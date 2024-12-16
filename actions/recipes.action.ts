"use server";

import { MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import {
  addRecipe,
  deleteRecipe as removeRecipe,
  updateRecipe as update,
} from "@/lib/recipe";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FormResult } from "@/types/form";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function saveRecipe(
  recipe: IRecipeInterface
): Promise<IRecipeInterface | undefined> {
  try {
    // Convert mealType enums to their values
    if (recipe.mealTypeKey) {
      recipe.mealType = recipe.mealTypeKey.map(
        (meal) => MealType[meal as keyof typeof MealType]
      );
    }

    // Call the update API
    const addedRecipe = await addRecipe(recipe);
    return addedRecipe;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES);
  }
}

export async function updateRecipe(
  recipe: IRecipeInterface
): Promise<IRecipeInterface | undefined> {
  try {
    // Convert mealType enums to their values
    recipe.mealType = recipe.mealTypeKey.map(
      (meal) => MealType[meal as keyof typeof MealType]
    );

    // Call the update API
    const updatedRecipe = await update(recipe);
    return updatedRecipe;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES);
  }
}

export async function deleteRecipe(
  recipe: IRecipeInterface
): Promise<FormResult | undefined> {
  try {
    // Call the update API
    await removeRecipe(recipe.id);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES);
  }
}