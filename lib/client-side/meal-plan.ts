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
