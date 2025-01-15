"use server";

import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FormResult } from "@/types/form";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateMealsForPlan } from "@/util/meal-generator-util";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { addMealPlan, updateMealPlan } from "@/lib/meal-plan";
import { addMealPlanMeals, updateMealPlanMeals } from "@/lib/meal";
import { addMealPlanRecipes, updateMealPlanRecipes } from "@/lib/recipe";
import { getEnumKeyByValue, getEnumKeysByValues } from "@/util/enum-util";
import { MealType } from "@/constants/constants-enums";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

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
export async function createMealPlan(
  recipes: IRecipeInterface[],
  mealPlan: IMealPlan
): Promise<FormResult> {
  const errors: { [key: string]: string } = {};

  try {
    let resultMealPlan: IMealPlan | undefined;
    const meals = generateMealsForPlan(mealPlan, recipes);

    if (mealPlan.id) {
      resultMealPlan = await updateMealPlan(mealPlan);
    } else {
      resultMealPlan = await addMealPlan(mealPlan);
    }

    await fillMealPlanRecipesAndMeals(resultMealPlan, recipes, mealPlan, meals);

    if (!resultMealPlan) {
      errors.general = "Error adding or updating meal plan.";
      return { success: false, errors };
    }
    revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);
    return { success: true };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    errors.general = "Error generating meals.";
    return { success: false, errors };
  }
}

async function fillMealPlanRecipesAndMeals(
  resultMealPlan: IMealPlan | undefined,
  recipes: IRecipeInterface[],
  mealPlan: IMealPlan,
  meals: IMealInterface[]
) {
  try {
    if (resultMealPlan) {
      recipes.forEach(async (recipe) => {
        // make sure all ids are 0 to create recipes and related
        recipe.id = 0;
        recipe.mealPlanId = resultMealPlan?.id;
        // recipe.image = "/aiimages/food/default-food.svg";
        recipe.images
          ? ((recipe.images.id = 0), (recipe.images.recipeId = 0))
          : undefined;
        recipe.clientId = mealPlan.clientId;
        // recipe.mealTypeKey = getEnumKeysByValues(
        //   MealType,
        //   recipe.mealType as MealType[]
        // );
        recipe.ingredients?.forEach(async (ingr) => {
          // make sure all ids are 0 to create recipes and related
          ingr.id = 0;
          ingr.recipeId = 0;
        });
      });

      meals.forEach(async (meal) => {
        meal.id = 0;
        meal.mealPlanId = resultMealPlan?.id;
        //  meal.image = "/aiimages/food/default-food.svg";
        meal.clientId = mealPlan.clientId;
        meal.ingredients?.forEach(async (ingr) => {
          // make sure all ids are 0 to create recipes and related
          ingr.id = 0;
          ingr.mealId = 0;
        });
      });

      const recipesAdded = await addMealPlanRecipes(recipes);
      if (recipesAdded?.length && meals?.length) {
        meals.forEach((m) => {
          // Find the recipe that matches the meal's timeScheduled date
          const matchingRecipe = recipesAdded.find(
            (r) => r.timeScheduled!.getTime() === m.timeScheduled.getTime()
          );

          if (matchingRecipe) {
            m.recipeId = matchingRecipe.id; // Assign recipeId to the meal
          }
        });

        await addMealPlanMeals(meals);
      }
    }
  } catch (error: any) {
    console.log(
      "Error occurred saving meal plan recipes and meals" + error.message
    );
    throw new Error(
      "Error occurred saving meal plan recipes and meals" + error.message
    );
  }
}
