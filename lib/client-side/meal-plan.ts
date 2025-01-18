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

export async function reCreateRecipeAndMealsForMealPlan(
  mealPlan: IMealPlan
): Promise<FormResult> {
  const meals: IMealInterface[] = [];
  const errors: { [key: string]: string } = {};

  // TODO: check date for meal plan recipes for second meal must be 12th,
  // last date must be 18th
  const recipes = await generateRecipesForMealPlan(mealPlan);

  recipes.forEach((r, i) => {
    r.clientId = mealPlan.clientId;
    r.mealPlanId = mealPlan.id;
    r.ingredients = r.ingredients.map((ingredient) => ({
      ...ingredient, // Spread the existing properties
      recipeId: r.id, // Correctly assign the recipeId
    }));

    const currentDate = dayjs(r.timeScheduled).add(i, "day");
    const mappedMeal = mapRecipeToMeal(r, r.mealPlanId!, true);
    // Assign the day of the week for the meal
    mappedMeal.dayOfTheWeek = currentDate.day() as unknown as DayOfTheWeek;
    meals.push(mappedMeal);
  });

  try {
    // Call the meal plan API endpoint
    const recipesAdded = await storeMealPlanRecipes(recipes);

    if (recipesAdded?.length && meals?.length) {
      meals.forEach((m) => {
        // Find the recipe that matches the meal's timeScheduled date
        const matchingRecipe = recipesAdded.find((r) => {
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
    revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PLAN);
    return { success: true };
  } catch (error) {
    errors.general = "Error generating meals.";
    return { success: false, errors };
  }
}
