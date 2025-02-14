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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getMealTypeForTimeRange } from "@/util/meal-utils";
dayjs.extend(utc);
dayjs.extend(timezone);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

interface ApiCall {
  key: string;
  query: string;
}

// TODO: add wats on the menu, whats for lunch, whats for dinner, whats for breakfast
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
    query: "Make a meal plan for me.",
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
  meal: IMealInterface | null;
}

export const handleUserPrompt: (
  userPrompt: string,
  clientId: number
) => Promise<IHandleUserPromptResult> = async (
  userPrompt: string,
  clientId: number
): Promise<IHandleUserPromptResult> => {
  try {
    const client: IClientInterface = await getClientById(clientId);
    const localTz = client.ClientSettingsDto?.timezoneId || "UTC"; // Default to UTC if not set

    const promptForMatching: string = `Given the following user input: "${userPrompt}", match it to one of these queries: ${apiCalls
      .map((call) => `"${call.key}"`)
      .join(", ")} or return "No match found."`;

    const matchResult: string = await generateContent(promptForMatching);

    let response: string = "";
    let generatedMealPlan: IMealPlan | null = null;
    let fetchedRecipes: IRecipeInterface[] = [];
    let meal: IMealInterface | null = null;

    const cleanedMatchResult: string = matchResult
      .replace(/^'+|'+$/g, "")
      .replace(/"/g, "")
      .trim();

    if (cleanedMatchResult.includes("Total Calories")) {
      const { totalCalories }: { totalCalories: number } =
        await queryDatabaseForCalorieDetails(client);
      response = `You have ${totalCalories.toFixed(
        2
      )} total calories to consume today.`;
    } else if (cleanedMatchResult.includes("Remaining Calories")) {
      const { remainingCalories }: { remainingCalories: number } =
        await queryDatabaseForCalorieDetails(client);
      response = `You have ${remainingCalories.toFixed(
        2
      )} calories remaining for today.`;
    } else if (cleanedMatchResult.includes("Consumed Calories")) {
      const { consumedCalories }: { consumedCalories: number } =
        await queryDatabaseForCalorieDetails(client);
      response = `You have consumed ${consumedCalories.toFixed(
        2
      )} calories today.`;
    } else if (cleanedMatchResult.includes("What is on the menu")) {
      meal = await queryDatabaseForCurrentMeal(client, localTz);
      response = meal
        ? `Here is your ${meal.mealTypeKey[0]} scheduled for ${dayjs
            .utc(meal.timeScheduled) // Convert from UTC
            .tz(localTz) // Convert to local timezone
            .format("hh:mm A")}.`
        : "No meal found.";
    } else if (cleanedMatchResult.includes("Generate Meal Plan")) {
      try {
        ({ generatedMealPlan, fetchedRecipes } =
          await generateMealPlanAndRecipes(client));
        response = "Here is your generated meal plan.";
      } catch (mealPlanError) {
        console.error("Error generating meal plan:", mealPlanError);
        response = "Sorry, I couldn't generate the meal plan.";
      }
    } else {
      response = "I'm sorry, I couldn't understand your request.";
    }

    return { response, generatedMealPlan, fetchedRecipes, meal };
  } catch (error) {
    console.error("Error handling user prompt:", error);
    return {
      response: "Sorry, there was an error processing your request.",
      generatedMealPlan: null,
      fetchedRecipes: [],
      meal: null,
    };
  }
};

const generateMealPlanAndRecipes = async (client: IClientInterface) => {
  const localTz = client.ClientSettingsDto?.timezoneId || "UTC"; // Default to UTC if not set

  // Get local start and end of today
  const startOfWeek = dayjs().tz(localTz).startOf("week").toISOString();
  const endOfWeek = dayjs().tz(localTz).endOf("week").toISOString();

  const {
    generatedMealPlan: generatorResponse,
    fetchedRecipes,
  }: {
    generatedMealPlan: GeneratorResponse;
    fetchedRecipes: IRecipeInterface[];
  } = await generateMealPlansAndRecipes(
    endOfWeek,
    startOfWeek,
    client.ClientSettingsDto?.mealPlanPreferences || defaultMealPlanPreference,
    [],
    true,
    client.Id,
    client.ClientSettingsDto?.timezoneId || "UTC"
  );

  if (!generatorResponse || !fetchedRecipes) {
    throw new Error("Meal plan generation failed");
  }

  // Map the properties from `GeneratorResponse` to `IMealPlan`
  const generatedMealPlan: IMealPlan = {
    ...generatorResponse,
    id: 0,
    clientId: client.Id,
    startDate: startOfWeek,
    endDate: endOfWeek,
    autoLogMeals: true,
    meals: [],
  };

  return { generatedMealPlan, fetchedRecipes };
};

async function queryDatabaseForCalorieDetails(
  client: IClientInterface
): Promise<{
  totalCalories: number;
  remainingCalories: number;
  consumedCalories: number;
}> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(client.Id)
  )) as IMealInterface[];

  const localTz = client.ClientSettingsDto?.timezoneId || "UTC"; // Default to UTC if not set

  // Get local start and end of today
  const startOfToday = dayjs().tz(localTz).startOf("day");
  const endOfToday = dayjs().tz(localTz).endOf("day");

  // Filter meals for today (convert times from UTC to localTz)
  const mealsToday = meals?.filter((meal) => {
    const mealDate = dayjs.utc(meal.timeScheduled).tz(localTz);
    return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
  });

  // Total Calories (sum of all planned meals)
  const totalCalories = mealsToday.reduce((total, meal) => {
    const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
    return total + mealEnergy;
  }, 0);

  // Consumed Calories (sum of only consumed meals, converted to local time)
  const consumedCalories = mealsToday.reduce((total, meal) => {
    if (meal.timeConsumed) {
      const mealConsumedDate = dayjs.utc(meal.timeConsumed).tz(localTz);
      if (
        mealConsumedDate.isAfter(startOfToday) &&
        mealConsumedDate.isBefore(endOfToday)
      ) {
        const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
        return total + mealEnergy;
      }
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

async function queryDatabaseForCurrentMeal(
  client: IClientInterface,
  localTz: string
): Promise<IMealInterface | null> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(client.Id)
  )) as IMealInterface[];

  // Get local start and end of today
  const startOfToday = dayjs().tz(localTz).startOf("day");
  const endOfToday = dayjs().tz(localTz).endOf("day");

  //  get current meal type based on the current time
  const currentTime = dayjs().tz(localTz);

  const mealType = getMealTypeForTimeRange(
    currentTime.toDate()
  )?.toLowerCase() as string;

  // Filter meals for today (convert times from UTC to localTz)
  const currentMeal = meals?.find((meal) => {
    const mealDate = dayjs.utc(meal.timeScheduled).tz(localTz);
    return (
      mealDate.isAfter(startOfToday) &&
      mealDate.isBefore(endOfToday) &&
      meal.mealTypeKey.includes(mealType)
    );
  });

  // try to filter meals separately failing here,
  porblem is if there is no brunch in clients meal type', we have to get the  next meal types meal

  if (currentMeal) {
    return currentMeal;
  }
  return null;
}

// gets a meal for a given meal type, defaults to todays if not specified
async function queryDatabaseForGivenMealType(
  client: IClientInterface,
  localTz: string
): Promise<IMealInterface | null> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(client.Id)
  )) as IMealInterface[];

  // Get local start and end of today
  const startOfToday = dayjs().tz(localTz).startOf("day");
  const endOfToday = dayjs().tz(localTz).endOf("day");

  //  get current meal type based on the current time
  const currentTime = dayjs().tz(localTz);

  const mealType = getMealTypeForTimeRange(
    currentTime.toDate()
  )?.toLowerCase() as string;

  // get meal type from prompt, if we find a meal type from prompt use that
  // otherwise

  // get date time from prompt

  // Filter meals for today (convert times from UTC to localTz)
  const currentMeal = meals?.find((meal) => {
    const mealDate = dayjs.utc(meal.timeScheduled).tz(localTz);
    return (
      mealDate.isAfter(startOfToday) &&
      mealDate.isBefore(endOfToday) &&
      meal.mealTypeKey.includes(mealType)
    );
  });

  if (currentMeal) {
    return currentMeal;
  }
  return null;
}
