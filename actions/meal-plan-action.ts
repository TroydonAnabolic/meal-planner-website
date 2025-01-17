"use server";

import { MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { fetchRecipesFromUris } from "@/lib/client/client-side/edamam";
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
import { generateMealsForPlan } from "@/util/meal-generator-util";
import { getMealTypeFromTime } from "@/util/meal-utils";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

/**
 * Server Action to handle form submission.
 * Note: In Next.js 13, server actions should be defined in a separate file or within a `use server` function.
 */
export const submitMealPlan = async (
  initialMealPlan: IMealPlan,
  mealPlan: IMealPlan
): Promise<FormResult> => {
  const errors: { [key: string]: string } = {};

  try {
    let addedMealPlan: IMealPlan | undefined;

    if (mealPlan.id === 0) {
      // Create new meal plan
      addedMealPlan = await addMealPlan(mealPlan);
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

    // add/update recipes and meals if new mealplan, or the start or end dates changed
    // TODO: might make start and end dates unchangeable so they need to generate new meal plans
    if (
      mealPlan.id === 0 ||
      initialMealPlan.startDate != mealPlan.startDate ||
      initialMealPlan.endDate != mealPlan.endDate
    ) {
      const recipes = await generateRecipesForMealPlan(addedMealPlan);
      const meals = generateMealsForPlan(mealPlan, recipes);

      await fillMealPlanRecipesAndMeals(
        addedMealPlan,
        recipes,
        mealPlan,
        meals
      );
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

const generateRecipesForMealPlan = async (
  mealPlan: IMealPlan
): Promise<IRecipeInterface[]> => {
  const recipeUris: string[] = mealPlan.selection.flatMap((selectionItem) =>
    Object.values(selectionItem.sections).map(
      (section) => section._links.self.href
    )
  );

  const fetchedRecipes: IRecipeInterface[] = await fetchRecipesFromUris(
    recipeUris
  );

  return fetchedRecipes;
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
