import { DayOfTheWeek } from "@/constants/constants-enums";
import {
  BACKEND_URL_LIVE,
  APIM_HEADERS,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { mapRecipeToMeal } from "@/util/mappers";
import {
  extractRecipeIdFromHref,
  extractRecipeIdFromUri,
} from "@/util/meal-generator-util";
import axios from "axios";
import { fetchRecipesFromUris } from "./edamam";
import dayjs from "dayjs";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
  // transformRequest: [dateTransformer].concat(
  //   axios.defaults.transformRequest || []
  // ),
});

export async function getMealPlansByClientId(
  clientId: number
): Promise<IMealPlan[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/mealPlan`, {
      params: { clientId },
    });
    const mealPlan: IMealPlan[] = response.data;
    return mealPlan;
  } catch (error: any) {
    console.error("Error getting meal plan:", error);
    return undefined;
  }
}

/**
 * Adds a new meal plan to the backend.
 *
 * @param meal - The IMealPlan object to be saved.
 * @returns The saved IMealPlan object, or undefined if failed.
 */
export async function addMealPlan(
  mealPlan: IMealPlan
): Promise<IMealPlan | undefined> {
  const response = await instance.post(`${DIETAPI_BASE}/mealPlan`, mealPlan);
  const addedMealPlan: IMealPlan = response.data;
  return addedMealPlan;
}

/**
 * Updates an existing meal plan in the backend.
 *
 * @param meal - The IMealPlan object to be updated.
 * @returns The updated IMealPlan object, or undefined if failed.
 */
export async function updateMealPlan(
  mealPlan: IMealPlan
): Promise<IMealPlan | undefined> {
  const response = await instance.put(`${DIETAPI_BASE}/mealPlan`, mealPlan);
  const updatedMealPlan: IMealPlan = response.data;
  return updatedMealPlan;
}

export const generateMealsFromMealPlan = async (
  mealPlan: IMealPlan,
  clientId: number
): Promise<IMealInterface[]> => {
  const meals: IMealInterface[] = [];

  const recipeUris: string[] = mealPlan.selection.flatMap((selectionItem) =>
    Object.values(selectionItem.sections).map(
      (section) => section._links.self.href
    )
  );

  // Fetch all recipes concurrently using Promise.all
  const fetchedRecipes: IRecipeInterface[] = await fetchRecipesFromUris(
    recipeUris
  );

  mealPlan.selection.forEach((selectionItem, dayIndex) => {
    const currentDate = dayjs(mealPlan.startDate).clone().add(dayIndex, "day");

    // Iterate over each section in the selectionItem.sections object
    Object.entries(selectionItem.sections).forEach(([mealTypeKey, section]) => {
      // Extract the recipe ID from the section's self href
      const recipeId = extractRecipeIdFromHref(section._links.self.href);

      // Find the recipe in the recipes array that matches the extracted recipe ID
      const recipe = fetchedRecipes.find(
        (r) => extractRecipeIdFromUri(r.uri) === recipeId
      );

      // If a matching recipe is found
      if (recipe) {
        // Map the recipe to a meal object using the mapRecipeToMeal function
        const mappedMeal = mapRecipeToMeal(recipe, clientId);

        // Set the scheduled time for the meal to the current date
        mappedMeal.timeScheduled = currentDate.toDate();

        // Set the day of the week for the meal, casting as DayOfTheWeek enum
        mappedMeal.dayOfTheWeek = currentDate.day() as unknown as DayOfTheWeek;

        // Add the mapped meal to the meals array with a default mealPlanId
        meals.push({
          ...mappedMeal,
          mealPlanId: 0,
        });
      }
    });
  });
  return meals;
};
