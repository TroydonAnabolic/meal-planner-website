"use server";

import mealPlan from "@/app/components/meal-plan/meal-planning/meal-plan";
import { DayOfTheWeek, MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { fetchRecipesFromUris } from "@/lib/client-side/edamam";
import { generateRecipesForMealPlan } from "@/lib/client-side/meal-plan";
import { addMealPlanMeals } from "@/lib/meal";
import { addMealPlan, updateMealPlan } from "@/lib/meal-plan";
import { addMealPlanRecipes } from "@/lib/recipe";
import {
  IMealPlan,
  Section,
  SelectionItem,
} from "@/models/interfaces/diet/meal-plan";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FormResult } from "@/types/form";
import { getEnumKeysByValues } from "@/util/enum-util";
import { mapRecipeToMeal } from "@/util/mappers";
import { formatUri, generateMealsForPlan } from "@/util/meal-generator-util";
import { getMealTypeFromTime } from "@/util/meal-utils";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

/**
 * Server Action to handle form submission.
 * Note: In Next.js 13, server actions should be defined in a separate file or within a `use server` function.
 */
export const submitMealPlan = async (
  mealPlan: IMealPlan,
  recipes: IRecipeInterface[]
): Promise<FormResult> => {
  const errors: { [key: string]: string } = {};

  try {
    let addedMealPlan: IMealPlan | undefined;

    // assign the meal plan the current recipes
    for (const recipe of recipes) {
      for (const selectionItem of mealPlan?.selection || []) {
        for (const section of Object.values(selectionItem.sections)) {
          const formattedUri = formatUri(recipe.uri);
          section.assigned = recipe.uri;
          section._links.self.href = formattedUri; // Update the section URI
        }
      }
    }

    if (mealPlan.id === 0 || mealPlan.id === null) {
      // Create new meal plan

      addedMealPlan = await addMealPlan({ ...mealPlan, id: 0 });
      if (!addedMealPlan) {
      }
      return {
        success: false,
        errors: { general: "Failed to create meal plan" },
      };
    } else {
      // Update existing meal plan
      addedMealPlan = await updateMealPlan(mealPlan);
      if (!addedMealPlan) {
        return {
          success: false,
          errors: { general: "Failed to update meal plan" },
        };
      }
    }

    revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);

    return { success: true, errors: {} };
  } catch (error: any) {
    console.error("Form submission error:", error);
    return {
      success: false,
      errors: { general: "An unexpected error occurred." },
    };
  }
};

async function fillMealPlanRecipesAndMeals(
  resultMealPlan: IMealPlan | undefined,
  recipes: IRecipeInterface[],
  mealPlan: IMealPlan,
  meals: IMealInterface[]
) {
  if (resultMealPlan) {
    recipes.forEach(async (recipe) => {
      recipe.mealPlanId = resultMealPlan?.id;
      //recipe.image = "/aiimages/food/default-food.svg";
      recipe.clientId = mealPlan.clientId;
      recipe.mealTypeKey = getMealTypeFromTime(recipe.timeScheduled);
    });
    meals.forEach(async (meal) => {
      meal.mealPlanId = resultMealPlan?.id;
      meal.image = "/aiimages/food/default-food.svg";
      meal.clientId = mealPlan.clientId;
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
}

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

    if (resultMealPlan) {
      recipes.forEach(async (recipe) => {
        recipe.mealPlanId = resultMealPlan?.id;
        // TODO: Save image to s3 if possible
        recipe.image = "/aiimages/food/default-food.svg";
        recipe.clientId = mealPlan.clientId;
        recipe.mealTypeKey = getEnumKeysByValues(
          MealType,
          recipe.mealType as MealType[]
        );
      });
      meals.forEach(async (meal) => {
        meal.mealPlanId = resultMealPlan?.id;
        meal.image = "/aiimages/food/default-food.svg";
        meal.clientId = mealPlan.clientId;
      });

      await addMealPlanRecipes(recipes);
      await addMealPlanMeals(meals);
    }

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
