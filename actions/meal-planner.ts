"use server";

import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FormResult } from "@/types/form";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateMealsForPlan } from "@/util/meal-generator-util";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { addMealPlan, updateMealPlan } from "@/lib/meal-plan";
import { addMealPlanMeals, updateMealPlanMeals } from "@/lib/meal";
import {
  addMealPlanRecipes,
  updateMealPlanRecipes,
} from "@/lib/server-side/recipe";
import { getEnumKeyByValue, getEnumKeysByValues } from "@/util/enum-util";
import { DayOfTheWeek, MealType } from "@/constants/constants-enums";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import dayjs from "dayjs";
import { mapRecipeToMeal } from "@/util/mappers";
import { getUtcTimeFromLocal } from "@/util/date-util";

/**
 * Creates a meal plan based on the provided recipes, generator response, and other parameters.
 *
 * @param {IRecipeInterface[]} recipes - An array of recipe objects to be used in the meal plan.
 * @param {GeneratorResponse} generatorResponse - The response from the meal plan generator containing the selection of meals.
 * @param {IShoppingListResult | null} shoppingListResult - The result of the shopping list generation, can be null.
 * @param {Dayjs} startDate - The start date for the meal plan.
 * @param {Dayjs} endDate - The end date for the meal plan.
 * @param {number} clientId - The ID of the client for whom the meal plan is being created.
 * @returns {Promise<FormResult>} - A promise that resolves to a FormResult indicating the success or failure of the operation.
 *
 * @throws {Error} - Throws an error if there is an issue generating the meals.
 */
// export async function createMealPlan(
//   recipes: IRecipeInterface[],
//   mealPlan: IMealPlan
// ): Promise<FormResult> {
//   const errors: { [key: string]: string } = {};

//   try {
//     let resultMealPlan: IMealPlan | undefined;
//     //const meals = generateMealsForPlan(mealPlan, recipes);
//     const meals: IMealInterface[] = [];

//     if (mealPlan.id) {
//       resultMealPlan = await updateMealPlan(mealPlan);
//     } else {
//       resultMealPlan = await addMealPlan(mealPlan);
//     }

//     await fillMealPlanRecipesAndMeals(resultMealPlan, recipes, mealPlan, meals);

//     if (!resultMealPlan) {
//       errors.general = "Error adding or updating meal plan.";
//       return { success: false, errors };
//     }
//     revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);
//     return { success: true };
//   } catch (error: any) {
//     if (isRedirectError(error)) {
//       throw error;
//     }
//     errors.general = "Error generating meals.";
//     return { success: false, errors };
//   }
// }
