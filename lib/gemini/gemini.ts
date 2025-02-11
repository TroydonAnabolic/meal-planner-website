import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dayjs from "dayjs";
import { getMealsByClientId } from "../meal";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { getDefaultMealPlan } from "@/util/meal-plan-utils";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { getClient, getClientById } from "../server-side/client";
import { IClientInterface } from "@/models/interfaces/client/client";
import { generateMealPlansAndRecipes } from "../server-side/meal-plan-generator";
import { defaultMealPlanPreference } from "@/constants/constants-objects";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

interface ApiCall {
  key: string;
  query: string;
}

// TODO: Fill up api calls for all differrent api calls required e.g. whats on the menu must give
// all  ingredients for todays, mealtypes meal
const apiCalls: ApiCall[] = [
  {
    key: "Total Calories",
    query: "How many calories do U have to consume today",
  },
  {
    key: "Consumed Calories",
    query: "How many calories have I consume today",
  },
  {
    key: "Remaining Calories",
    query: "How many calories is remaining for me to consume today",
  },
  {
    key: "What is on the menu",
    query:
      "Check all ingredients for the current meal type for the current day, for example lunch today if it is during lunch hours.",
  },
  {
    key: "Generate Meal Plan",
    query: "Generate a meal plan for 7 days for me.",
  },
];

// Helper to call Gemini to generate content
async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

// Handles the Gemini semantic matching and query execution
// Handles the Gemini semantic matching and query execution
interface IHandleUserPromptResult {
  response: string;
  generatedMealPlan: IMealPlan | null;
  fetchedRecipes: IRecipeInterface[];
}

export const handleUserPrompt: (
  userPrompt: string,
  clientId: number
) => Promise<IHandleUserPromptResult> = async (
  userPrompt: string,
  clientId: number
): Promise<IHandleUserPromptResult> => {
  try {
    const promptForMatching: string = `Given the following user input: "${userPrompt}", match it to one of these queries: ${apiCalls
      .map((call) => `"${call.key}"`)
      .join(", ")} or return "No match found."`;

    const matchResult: string = await generateContent(promptForMatching);
    const initialMealPlan: IMealPlan = getDefaultMealPlan(clientId);

    let response: string = "";
    let generatedMealPlan: IMealPlan | null = null;
    let fetchedRecipes: IRecipeInterface[] = [];

    const cleanedMatchResult: string = matchResult
      .replace(/^'+|'+$/g, "")
      .replace(/"/g, "")
      .trim();

    if (cleanedMatchResult.includes("Total Calories")) {
      const { totalCalories }: { totalCalories: number } =
        await queryDatabaseForCalorieDetails(clientId);
      response = `You have ${totalCalories.toFixed(
        2
      )} total calories to consume today.`;
    } else if (cleanedMatchResult.includes("Remaining Calories")) {
      const { remainingCalories }: { remainingCalories: number } =
        await queryDatabaseForCalorieDetails(clientId);
      response = `You have ${remainingCalories.toFixed(
        2
      )} calories remaining for today.`;
    } else if (cleanedMatchResult.includes("Consumed Calories")) {
      const { consumedCalories }: { consumedCalories: number } =
        await queryDatabaseForCalorieDetails(clientId);
      response = `You have consumed ${consumedCalories.toFixed(
        2
      )} calories today.`;
    } else if (cleanedMatchResult.includes("Generate Meal Plan")) {
      try {
        ({ generatedMealPlan, fetchedRecipes } =
          await generateMealPlanAndRecipes(initialMealPlan, clientId));
        response = "Here is your generated meal plan.";
      } catch (mealPlanError) {
        console.error("Error generating meal plan:", mealPlanError);
        response = "Sorry, I couldn't generate the meal plan.";
      }
    } else {
      response = "I'm sorry, I couldn't understand your request.";
    }

    return { response, generatedMealPlan, fetchedRecipes };
  } catch (error) {
    console.error("Error handling user prompt:", error);
    return {
      response: "Sorry, there was an error processing your request.",
      generatedMealPlan: null,
      fetchedRecipes: [],
    };
  }
};

const generateMealPlanAndRecipes = async (
  initialMealPlan: IMealPlan,
  clientId: number
) => {
  const client: IClientInterface = await getClientById(clientId);

  const {
    generatedMealPlan: generatorResponse,
    fetchedRecipes,
  }: {
    generatedMealPlan: GeneratorResponse;
    fetchedRecipes: IRecipeInterface[];
  } = await generateMealPlansAndRecipes(
    initialMealPlan.endDate,
    initialMealPlan.startDate,
    client.ClientSettingsDto?.mealPlanPreferences || defaultMealPlanPreference,
    [],
    true,
    client.Id
  );

  if (!generatorResponse || !fetchedRecipes) {
    throw new Error("Meal plan generation failed");
  }

  // Map the properties from `GeneratorResponse` to `IMealPlan`
  const generatedMealPlan: IMealPlan = {
    id: initialMealPlan.id || 0,
    clientId: client.Id,
    startDate: initialMealPlan.startDate,
    endDate: initialMealPlan.endDate,
    autoLogMeals: true,
    meals: [],
    selection: [],
  };

  return { generatedMealPlan, fetchedRecipes };
};

async function queryDatabaseForCalorieDetails(clientId: number): Promise<{
  totalCalories: number;
  remainingCalories: number;
  consumedCalories: number;
}> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(clientId)
  )) as IMealInterface[];

  const startOfToday = dayjs().startOf("day");
  const endOfToday = dayjs().endOf("day");

  // Filter meals for today
  const mealsToday = meals?.filter((meal) => {
    const mealDate = dayjs(meal.timeScheduled);
    return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
  });

  // Total Calories (sum of all planned meals)
  const totalCalories = mealsToday.reduce((total, meal) => {
    const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
    return total + mealEnergy;
  }, 0);

  // Consumed Calories (sum of only consumed meals)
  const consumedCalories = mealsToday.reduce((total, meal) => {
    if (meal.timeConsumed) {
      const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
      return total + mealEnergy;
    }
    return total;
  }, 0);

  // Remaining Calories
  const remainingCalories = totalCalories - consumedCalories;

  return {
    totalCalories,
    remainingCalories,
    consumedCalories,
  };
}
