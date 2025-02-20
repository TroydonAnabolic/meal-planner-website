"use server";

import { MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { addIngredient, deleteIngredient, updateIngredient } from "@/lib/server-side/ingredients";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";

import { FormResult } from "@/types/form";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function addIngredientAction(
  ingredient: IIngredient
): Promise<IIngredient | undefined> {
  try {
    // Call the update API
    const addedIngredient = await addIngredient(ingredient);
    return addedIngredient;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES);
  }
}

export async function updateIngredientAction(
  ingredient: IIngredient
): Promise<IIngredient | undefined> {
  try {
    // Call the update API
    const updatedIngredient = await updateIngredient(ingredient);
    return updatedIngredient;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES);
  }
}

export async function deleteIngredientAction(
  ingredient: IIngredient
): Promise<FormResult | undefined> {
  try {
    // Call the update API
    await deleteIngredient(ingredient.id);
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
