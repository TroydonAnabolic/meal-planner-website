import { IClientInterface } from "@/models/interfaces/client/client";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import dayjs from "dayjs";

export const startGenerateMealPlanAndRecipes = async (
  endDate: dayjs.Dayjs,
  startDate: dayjs.Dayjs,
  mealPlanPreferences: IMealPlanPreferences,
  excluded: string[],
  useFavouriteRecipes: boolean,
  clientData: IClientInterface
): Promise<{
  generatedMealPlan: GeneratorResponse;
  favouriteRecipes: IRecipeInterface[];
  fetchedRecipes: IRecipeInterface[];
}> => {
  // Prepare the payload
  const payload = {
    endDate: endDate.toISOString(), // Convert dayjs object to ISO string
    startDate: startDate.toISOString(),
    mealPlanPreferences,
    excluded,
    useFavouriteRecipes,
    clientId: clientData.Id, // Include the client ID
  };

  // Call the meal plan API endpoint
  const response = await fetch(`/api/meal-planner/generate-meal-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Send data in the body
  });

  // Check for successful response
  if (!response.ok) {
    throw new Error(`Failed to generate meal plan: ${response.statusText}`);
  }

  // Parse JSON response
  const {
    generatedMealPlan,
    favouriteRecipes,
    fetchedRecipes,
  }: {
    generatedMealPlan: GeneratorResponse;
    favouriteRecipes: IRecipeInterface[];
    fetchedRecipes: IRecipeInterface[];
  } = await response.json();

  return { generatedMealPlan, favouriteRecipes, fetchedRecipes };
};
