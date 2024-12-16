"use server";
import { MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import {
  addMeal,
  deleteMeal as removeMeal,
  updateMeal as update,
} from "@/lib/meal";
import { IMealInterface } from "@/models/interfaces/meal/meal";
import { FormResult } from "@/types/form";
import { getDayOfWeek } from "@/util/date-util";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function saveMeal(
  meal: IMealInterface
): Promise<IMealInterface | undefined> {
  try {
    if (meal.mealTypeKey) {
      meal.mealType = meal.mealTypeKey.map(
        (m) => MealType[m as keyof typeof MealType]
      );
    }
    meal.dayOfTheWeek = meal.timeScheduled
      ? getDayOfWeek(new Date(meal.timeScheduled))
      : undefined;

    // meal.mealNumber = meal.mealTypeKey;

    // Call the update API
    const addedMeal = await addMeal(meal);
    return addedMeal;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.MEALS);
  }
}

export async function updateMeal(
  meal: IMealInterface
): Promise<IMealInterface | undefined> {
  try {
    meal.mealType = meal.mealTypeKey.map(
      (m) => MealType[m as keyof typeof MealType]
    );

    meal.dayOfTheWeek = meal.timeScheduled
      ? getDayOfWeek(new Date(meal.timeScheduled))
      : undefined;

    // Call the update API
    const updatedMeal = await update(meal);
    return updatedMeal;
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.MEALS);
  }
}

export async function deleteMeal(
  meal: IMealInterface
): Promise<FormResult | undefined> {
  try {
    // Call the update API
    await removeMeal(meal.id);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.MEALS);
  }
}
