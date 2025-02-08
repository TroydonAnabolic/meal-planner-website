import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { fetchRecipesFromUris } from "./edamam";
import { DayOfTheWeek } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { FormResult } from "@/types/form";
import { mapRecipeToMeal } from "@/util/mappers";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { storeMealPlanRecipes } from "./recipe";
import { storeMealPlanMeals } from "./meal";
import { isRedirectError } from "next/dist/client/components/redirect";

export const generateRecipesForMealPlan = async (
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

// TODO: Include option to exclude recreating logged meals
export async function reCreateMealsForMealPlan(
  recipes: IRecipeInterface[]
): Promise<FormResult> {
  const meals: IMealInterface[] = [];
  const errors: { [key: string]: string } = {};

  // TODO: check date for meal plan recipes for second meal must be 12th,
  // last date must be 18th
  //const recipes = await generateRecipesForMealPlan(mealPlan);

  recipes
    .sort((a, b) => dayjs(a.timeScheduled).diff(dayjs(b.timeScheduled))) // Sort by timeScheduled
    .forEach((r, i) => {
      const currentDate = dayjs(r.timeScheduled);
      const mappedMeal = mapRecipeToMeal(r, r.mealPlanId!, true);
      // Assign the day of the week for the meal
      mappedMeal.dayOfTheWeek = currentDate.format("dddd") as DayOfTheWeek;
      meals.push(mappedMeal);
    });

  try {
    // Call the meal plan API endpoint
    // const recipesAdded = await storeMealPlanRecipes(recipes);

    if (recipes?.length && meals?.length) {
      meals.forEach((m) => {
        // Find the recipe that matches the meal's timeScheduled date
        const matchingRecipe = recipes.find((r) => {
          const recipeTime =
            r.timeScheduled instanceof Date
              ? r.timeScheduled
              : r.timeScheduled
              ? new Date(r.timeScheduled)
              : null;

          const mealTime =
            m.timeScheduled instanceof Date
              ? m.timeScheduled
              : m.timeScheduled
              ? new Date(m.timeScheduled)
              : null;

          return recipeTime!.getTime() === mealTime!.getTime();
        });

        if (matchingRecipe) {
          m.recipeId = matchingRecipe.id; // Assign recipeId to the meal
        }
      });

      const mealsAdded = await storeMealPlanMeals(meals);
    }
    //revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);
    return { success: true };
  } catch (error) {
    errors.general = "Error generating meals.";
    return { success: false, errors };
  }
}

export async function storeMealPlan(
  mealPlanToStore: IMealPlan
): Promise<IMealPlan | undefined> {
  try {
    const response = await fetch(`/api/meal-plans/add-meal-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealPlanToStore), // Send data in the body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    const mealPlan: IMealPlan = await response.json();

    return mealPlan;
  } catch (error) {
    console.error("Error storing meals:", error);
  }
}

export async function saveMealPlan(
  mealPlanToStore: IMealPlan
): Promise<IMealPlan | undefined> {
  try {
    const response = await fetch(`/api/meal-plans/save-meal-plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealPlanToStore), // Send data in the body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    const mealPlan: IMealPlan = await response.json();

    return mealPlan;
  } catch (error) {
    console.error("Error storing meals:", error);
  }
}

export async function createMealPlan(
  recipes: IRecipeInterface[],
  mealPlan: IMealPlan
): Promise<FormResult> {
  const errors: { [key: string]: string } = {};

  try {
    let resultMealPlan: IMealPlan | undefined;
    //const meals = generateMealsForPlan(mealPlan, recipes);
    const meals: IMealInterface[] = [];

    if (mealPlan.id) {
      resultMealPlan = await saveMealPlan(mealPlan);
    } else {
      resultMealPlan = await storeMealPlan(mealPlan);
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
      for (const recipe of recipes) {
        recipe.id = 0;
        recipe.mealPlanId = resultMealPlan?.id;
        // recipe.image = "/aiimages/food/default-food.svg";
        if (recipe.images) {
          recipe.images.id = 0;
          recipe.images.recipeId = 0;
        }
        recipe.clientId = mealPlan.clientId;

        for (const ingr of recipe.ingredients || []) {
          ingr.id = 0;
          ingr.recipeId = 0;
        }
      }

      // TODO: Do the recipe add along with the meal plan add
      const recipesAdded = await storeMealPlanRecipes(recipes);

      if (recipesAdded?.length) {
        for (const recipe of recipesAdded) {
          const currentDate = dayjs(recipe.timeScheduled);
          const mappedMeal = mapRecipeToMeal(recipe, recipe.mealPlanId!, true);

          // Get the day of the week as a string from the date
          mappedMeal.dayOfTheWeek = currentDate.format("dddd") as DayOfTheWeek;

          meals.push(mappedMeal);
        }
      }

      meals.forEach((m) => {
        // Find the recipe that matches the meal's timeScheduled date
        const matchingRecipe = recipesAdded?.find((r) => {
          const recipeTime =
            r.timeScheduled instanceof Date
              ? r.timeScheduled
              : r.timeScheduled
              ? new Date(r.timeScheduled)
              : null;

          const mealTime =
            m.timeScheduled instanceof Date
              ? m.timeScheduled
              : m.timeScheduled
              ? new Date(m.timeScheduled)
              : null;

          return recipeTime!.getTime() === mealTime!.getTime();
        });

        if (matchingRecipe) {
          m.recipeId = matchingRecipe.id; // Assign recipeId to the meal
        }
      });

      const addedMeals = await storeMealPlanMeals(meals);
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
