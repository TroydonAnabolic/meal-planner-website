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
import { getClient } from "../server-side/client";
import { IClientInterface } from "@/models/interfaces/client/client";

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
export const handleUserPrompt = async (userPrompt: string) => {
  try {
    const promptForMatching = `Given the following user input: "${userPrompt}", match it to one of these queries: ${apiCalls
      .map((call) => `"${call.key}"`)
      .join(", ")} or return "No match found."`;

    const matchResult = await generateContent(promptForMatching);

    const session = (await auth()) as Session;
    const clientId = session.user.clientId;
    const initialMealPlan: IMealPlan = getDefaultMealPlan(Number(clientId));

    let response = "";
    let generatedMealPlan: IMealPlan | null = null;
    let fetchedRecipes: IRecipeInterface[] = [];

    // Handle API query based on the match
    switch (matchResult.trim()) {
      case "Total Calories":
        const { totalCalories } = await queryDatabaseForCalorieDetails();
        response = await generateContent(
          `You have ${totalCalories} total calories to consume today.`
        );
        break;
      case "Remaining Calories":
        const { remainingCalories } = await queryDatabaseForCalorieDetails();
        response = await generateContent(
          `You have ${remainingCalories} calories remaining for today.`
        );
        break;
      case "Consumed Calories":
        const { consumedCalories } = await queryDatabaseForCalorieDetails();
        response = await generateContent(
          `You have consumed ${consumedCalories} calories today.`
        );
        break;
      case "Generate Meal Plan":
        ({ generatedMealPlan, fetchedRecipes } =
          await generateMealPlanAndRecipes(initialMealPlan, session));
        response = "Here is your generated meal plan.";
        break;
      default:
        response = "I'm sorry, I couldn't understand your request.";
        break;
    }

    return { response, generatedMealPlan, fetchedRecipes };
  } catch (error) {
    console.error("Error handling user prompt:", error);
    return { response: "Sorry, there was an error processing your request." };
  }
};

const generateMealPlanAndRecipes = async (
  initialMealPlan: IMealPlan,
  session: Session
) => {
  const client: IClientInterface = await getClient(session.user.userId);

  const payload = {
    ...initialMealPlan,
    mealPlanPreferences: client.ClientSettingsDto?.mealPlanPreferences,
    excluded: [],
    useFavouriteRecipes: true,
  };

  const response = await fetch(`/api/meal-planner/generate-meal-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate meal plan: ${response.statusText}`);
  }

  const {
    generatedMealPlan,
    fetchedRecipes,
  }: {
    generatedMealPlan: IMealPlan;
    fetchedRecipes: IRecipeInterface[];
  } = await response.json();

  return { generatedMealPlan, fetchedRecipes };
};

async function queryDatabaseForCalorieDetails(): Promise<{
  totalCalories: number;
  remainingCalories: number;
  consumedCalories: number;
}> {
  const session = (await auth()) as Session;
  const clientId = session.user.clientId;

  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(clientId)
  )) as IMealInterface[];

  const startOfToday = dayjs().startOf("day");
  const endOfToday = dayjs().endOf("day");

  // Filter meals for today
  const mealsToday = meals.filter((meal) => {
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
