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
import { MealNumber } from "@/constants/constants-enums";
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
      "Check meal and its ingredients for the current meal type for the current day, for example lunch today if it is during lunch hours.",
  },
  {
    key: "Find a given meal",
    query:
      "Check meal, and its ingredients for any given meal type e.g. breakfast or lunch, for any given day by the user, for example lunch on 13th January 2025.",
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
    } else if (cleanedMatchResult.includes("Find a given meal")) {
      meal = await queryDatabaseForGivenMealTypeAtGivenDay(
        client,
        localTz,
        userPrompt
      );
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
      // TODO: Test general fitness enquiry
      const isFitnessPrompt = `Does the following sentence contain a dietary enquiry? Give me an answer either 'true' or 'false': ${userPrompt}`;
      const isFitnessStr = (await generateContent(isFitnessPrompt))
        .trim()
        .toLowerCase();
      const isFitness = isFitnessStr.includes("true");
      if (isFitness) {
        const fitnessPrompt = `Does the following sentence contain a dietary enquiry? If it does then
        please give me a reply in a friendly way, and don't mention whether it contains a dietary enquiry, just give me an answer. Here is the prompt: ${userPrompt}`;

        response = await generateContent(fitnessPrompt);
      } else {
        response = "I'm sorry, I couldn't understand your request.";
      }
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

// TODO: Test current meal
async function queryDatabaseForCurrentMeal(
  client: IClientInterface,
  localTz: string
): Promise<IMealInterface | null> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(client.Id)
  )) as IMealInterface[];

  const availableMealTypeKeys = meals.map((m) => m.mealTypeKey[0]);

  const startOfToday = dayjs().tz(localTz).startOf("day");
  const endOfToday = dayjs().tz(localTz).endOf("day");

  const currentTime = dayjs().tz(localTz);
  let mealType = getMealTypeForTimeRange(
    currentTime.toDate()
  )?.toLowerCase() as string;

  let currentMeal = meals?.find((meal) => {
    const mealDate = dayjs.utc(meal.timeScheduled).tz(localTz);
    let isToday =
      mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
    return isToday && meal.mealTypeKey.includes(mealType);
  });

  // TODO: Test brunch times
  if (!currentMeal) {
    // If no match is found, iterate through the MealNumber enum to find the next available meal type
    const mealTypes = Object.values(MealNumber).map((m) => m.toLowerCase());
    let mealIndex = mealTypes.indexOf(mealType);

    while (!currentMeal && mealIndex < mealTypes.length - 1) {
      mealIndex++;
      mealType = mealTypes[mealIndex];

      currentMeal = meals.find((meal) => {
        const mealDate = dayjs.utc(meal.timeScheduled).tz(localTz);
        let isToday =
          mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
        return isToday && meal.mealTypeKey.includes(mealType);
      });
    }
  }

  return currentMeal || null;
}

// TODO: Test random meal
async function queryDatabaseForGivenMealTypeAtGivenDay(
  client: IClientInterface,
  localTz: string,
  userPrompt: string
): Promise<IMealInterface | null> {
  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(client.Id)
  )) as IMealInterface[];

  const getMealTypePrompt = `From the user prompt given, tell me the exact meal type. Available values: "Breakfast", "Brunch", "Lunch", "Snack", "Teatime", "Dinner". Just return one of these words, nothing else. Here is the prompt: ${userPrompt}`;
  let mealType = (await generateContent(getMealTypePrompt))
    .trim()
    .toLowerCase();

  const getMealTimePrompt = `Extract the exact day and time from the user prompt. Return it in the format "YYYY-MM-DD HH:mm A" so that it can be parsed by dayjs. Do not add extra words. Prompt: ${userPrompt}`;
  let dateForMeal = dayjs(
    await generateContent(getMealTimePrompt),
    "YYYY-MM-DD HH:mm A"
  ).tz(localTz);

  let currentMeal = meals?.find((meal) => {
    let isToday = dateForMeal.isSame(meal.timeScheduled, "day");
    return isToday && meal.mealTypeKey.includes(mealType);
  });

  // TODO: Test brunch times
  if (!currentMeal) {
    // If no match is found, iterate through the MealNumber enum to find the next available meal type
    const mealTypes = Object.values(MealNumber).map((m) => m.toLowerCase());
    let mealIndex = mealTypes.indexOf(mealType);

    while (!currentMeal && mealIndex < mealTypes.length - 1) {
      mealIndex++;
      mealType = mealTypes[mealIndex];

      currentMeal = meals?.find((meal) => {
        let isToday = dateForMeal.isSame(meal.timeScheduled, "day");
        return isToday && meal.mealTypeKey.includes(mealType);
      });
    }

    if (!currentMeal) {
      console.warn(
        `No meal found for '${userPrompt}'. Defaulting to closest meal.`
      );
      currentMeal =
        meals.find((meal) => dateForMeal.isSame(meal.timeScheduled, "day")) ||
        undefined;
    }
  }

  return currentMeal || null;
}
