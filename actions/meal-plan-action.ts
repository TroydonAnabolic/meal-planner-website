"use server";

import { MealType } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { addMealPlanMeals } from "@/lib/meal";
import { addMealPlan, updateMealPlan } from "@/lib/meal-plan";
import { addMealPlanRecipes } from "@/lib/recipe";
import {
  IMealPlan,
  Section,
  SelectionItem,
} from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { FormResult } from "@/types/form";
import { getEnumKeysByValues } from "@/util/enum-util";
import { generateMealsForPlan } from "@/util/meal-generator-util";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

/**
 * Server Action to handle form submission.
 * Note: In Next.js 13, server actions should be defined in a separate file or within a `use server` function.
 */
export const submitMealPlan = async (
  formData: FormData,
  clientId: number
): Promise<FormResult> => {
  const errors: { [key: string]: string } = {};

  try {
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const mealPlanId = formData.get("endDate") as string;
    const selectionData = [];

    // Extract selection items from FormData
    for (const [key, value] of formData.entries()) {
      const selectionMatch = key.match(
        /^selection\[(\d+)\]\.sections\.(\w+)\.(\w+)$/
      );
      if (selectionMatch) {
        const [, index, sectionKey, field] = selectionMatch;
        const indexNum = parseInt(index, 10);

        // Initialize the selection item if it doesn't exist
        if (!selectionData[indexNum]) {
          selectionData[indexNum] = {
            id: 0, // Set default or appropriate value
            mealPlanId: 0, // Set default or appropriate value
            sections: {} as { [key: string]: Section },
          };
        }

        const selectionItem = selectionData[indexNum]!;

        // Initialize the section if it doesn't exist
        if (
          !(selectionItem.sections as { [key: string]: Section })[sectionKey]
        ) {
          selectionItem.sections[sectionKey] = {
            assigned: "",
            _links: {
              self: {
                title: "",
                href: "",
              },
            },
          };
        }

        const value = formData.get(key) as string;
        if (
          field === "title" ||
          (field === "href" && selectionData[indexNum]!.sections[sectionKey])
        ) {
          selectionData[indexNum]!.sections[sectionKey]._links.self![field] =
            value;
        } else if (field === "assigned") {
          selectionData[indexNum].sections[sectionKey].assigned = value;
        }
      }
    }

    // Filter out any undefined selections
    const filteredSelection = selectionData.filter(
      (item) => item !== undefined
    ) as SelectionItem[];

    const mealPlan: IMealPlan = {
      id: 0, // Assuming new meal plan; update if editing
      clientId: clientId,
      startDate: startDate,
      endDate: endDate,
      selection: filteredSelection,
    };

    let addedMealPlan: IMealPlan | undefined;

    if (mealPlan.id === 0) {
      // Create new meal plan
      addedMealPlan = await addMealPlan(mealPlan);
      if (addedMealPlan) {
        revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);
        return { success: true, errors: {} };
      } else {
        return {
          success: false,
          errors: { general: "Failed to create meal plan" },
        };
      }
    } else {
      // Update existing meal plan
      addedMealPlan = await updateMealPlan(mealPlan);
      if (addedMealPlan) {
        revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);

        return { success: true, errors: {} };
      } else {
        revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);

        return {
          success: false,
          errors: { general: "Failed to update meal plan" },
        };
      }
    }
  } catch (error: any) {
    console.error("Form submission error:", error);
    return {
      success: false,
      errors: { general: "An unexpected error occurred." },
    };
  }
};

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
