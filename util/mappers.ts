// lib/mappers.ts

import {
  IRecipeInterface,
  RecipeNutrient,
} from "@/models/interfaces/recipe/recipe";
import { MealNumber, MealType, Nutrients } from "@/constants/constants-enums";
import { IMealInterface, IMealNutrient } from "@/models/interfaces/meal/Meal";
import {
  IFoodParser,
  IHint,
} from "@/models/interfaces/edamam/food/food-response";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";

/**
 * Maps a recipe to a meal, scaling nutrients by recipe yield.
 *
 * @param recipe - The recipe to map.
 * @returns The mapped meal.
 */
export const mapRecipeToMeal = (
  recipe: IRecipeInterface,
  mealPlanId: number,
  generator: boolean
): IMealInterface => {
  const scaledNutrients = scaleNutrientsByYield(
    recipe.totalNutrients,
    recipe.yield
  );

  return {
    id: 0,
    clientId: recipe.clientId,
    mealPlanId: mealPlanId,
    name: recipe.label,
    image: recipe.image,
    weight: recipe.totalWeight / recipe.yield || 0,
    mealType: recipe.mealType,
    mealTypeKey: recipe.mealTypeKey,
    nutrients: scaledNutrients,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      mealId: 0,
    })),
    ingredientLines: recipe.ingredientLines,
    foodSourceUrl: recipe.url,
    isLogged: false,
    timeScheduled:
      recipe.timeScheduled && generator ? recipe.timeScheduled : new Date(),
  };
};

export function mapParsedFoodToIngredient(
  results: IFoodParser,
  ingredient: IIngredient
): IIngredient[] {
  return results.hints.map((hint: IHint) => {
    const measure = "Gram";
    const selectedMeasure = hint.measures.find((m) => m.label === measure);
    //const weight = selectedMeasure?.weight || 0;

    return {
      id: 0,
      clientId: ingredient.clientId,
      text: hint.food.label,
      measure: measure,
      quantity: 1,
      weight: 100,
      food: hint.food.label,
      image: hint.food.image,
      foodCategory: hint.food.category,
      foodId: hint.food.foodId,
      totalNutrients: {
        [Nutrients.ENERC_KCAL]: {
          id: 0,
          ingredientId: 0,
          label: Nutrients.ENERC_KCAL,
          quantity: hint.food.nutrients.ENERC_KCAL,
        },
        [Nutrients.FAT]: {
          id: 0,
          ingredientId: 0,
          label: Nutrients.FAT,
          quantity: hint.food.nutrients.FAT,
          unit: "%",
        },
        [Nutrients.PROCNT]: {
          id: 0,
          ingredientId: 0,
          label: Nutrients.FAT,
          quantity: hint.food.nutrients.FAT,
          unit: "%",
        },
        [Nutrients.CHOCDF]: {
          id: 0,
          ingredientId: 0,
          label: Nutrients.FAT,
          quantity: hint.food.nutrients.FAT,
          unit: "%",
        },
        [Nutrients.FIBTG]: {
          id: 0,
          ingredientId: 0,
          label: Nutrients.FAT,
          quantity: hint.food.nutrients.FAT,
          unit: "%",
        },
      },
    };
  });
}

/**
 * Scales nutrient values by the given yield.
 *
 * @param nutrients - The nutrients to scale.
 * @param yield - The yield to scale by.
 * @returns The scaled nutrients.
 */
const scaleNutrientsByYield = (
  nutrients: { [key: string]: RecipeNutrient } | undefined,
  yieldValue: number
): { [key: string]: IMealNutrient } => {
  const scaled: { [key: string]: IMealNutrient } = {};

  if (!nutrients) return scaled;

  Object.keys(nutrients).forEach((key) => {
    const nutrient = nutrients[key];
    scaled[key] = {
      label: nutrient.label,
      quantity: nutrient.quantity / yieldValue,
      unit: nutrient.unit,
    };
  });

  return scaled;
};

// util/titleMap.ts

export const titleMap: { [key: string]: string } = {
  dashboard: "Dashboard",
  recipes: "Recipes",
  meals: "Meals",
  settings: "Settings",
  profile: "Profile",
};

/**
 * Maps a mealTypeKey string to its corresponding MealNumber.
 *
 * @param mealTypeKey - The meal type key string (e.g., "breakfast", "brunch", "lunch", etc.).
 * @returns The corresponding MealNumber or undefined if no match is found.
 */
export function getMealNumberFromMealTypeKey(
  mealTypeKey: string
): string | undefined {
  switch (mealTypeKey?.toLowerCase()) {
    case "breakfast":
      return "Breakfast";
    case "brunch":
      return "Brunch";
    case "lunch":
      return "Lunch";
    case "snack":
      return "Snack";
    case "teatime":
      return "Teatime";
    case "dinner":
      return "Dinner";
    default:
      return undefined;
  }
}
