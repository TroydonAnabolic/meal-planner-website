// utils/scaleNutrients.ts

import { Nutrients } from "@/constants/constants-enums";
import {
  IFoodNutrients,
  IFoodNutrientsResponse,
} from "@/models/interfaces/edamam/food/nutrients-response";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import {
  IRecipeInterface,
  RecipeNutrient,
} from "@/models/interfaces/recipe/recipe";
// utils/scaleNutrients.ts

/**
 * Scales the recipe's base nutrients based on the provided scaling factor.
 * @param baseNutrients The base total nutrients.
 * @param baseTotalDaily The base total daily nutrients.
 * @param baseTotalWeight The base total weight.
 * @param scalingFactor The factor by which to scale the nutrients.
 * @returns An object containing the scaled nutrients and related fields.
 */
export const scaleNutrients = (
  baseNutrients: { [key: string]: RecipeNutrient },
  baseTotalDaily: { [key: string]: RecipeNutrient },
  baseTotalWeight: number, // New parameter
  scalingFactor: number
): {
  totalNutrients: { [key: string]: RecipeNutrient };
  totalDaily: { [key: string]: RecipeNutrient };
  calories: number;
  totalWeight: number;
} => {
  const scaledTotalNutrients = Object.keys(baseNutrients).reduce(
    (acc: { [key: string]: RecipeNutrient }, key) => {
      acc[key] = {
        ...baseNutrients[key],
        quantity: parseFloat(
          (baseNutrients[key].quantity * scalingFactor).toFixed(2)
        ),
      };
      return acc;
    },
    {}
  );

  const scaledTotalDaily = Object.keys(baseTotalDaily).reduce(
    (acc: { [key: string]: RecipeNutrient }, key) => {
      acc[key] = {
        ...baseTotalDaily[key],
        quantity: parseFloat(
          (baseTotalDaily[key].quantity * scalingFactor).toFixed(2)
        ),
      };
      return acc;
    },
    {}
  );

  // Scale calories and totalWeight based on baseTotalWeight
  const scaledCalories =
    (baseNutrients["ENERC_KCAL"]?.quantity || 0) * scalingFactor;
  const scaledTotalWeight = parseFloat(
    (baseTotalWeight * scalingFactor).toFixed(2) // Use baseTotalWeight
  );

  return {
    totalNutrients: scaledTotalNutrients,
    totalDaily: scaledTotalDaily,
    calories: scaledCalories,
    totalWeight: scaledTotalWeight,
  };
};

// Define a mapping for macros to their icons
export const macros = [
  {
    label: "Calories",
    tag: Nutrients.ENERC_KCAL,
    icon: "🔥",
    unit: "kcal",
    className: "text-purple-500",
  },
  {
    label: "Protein",
    tag: Nutrients.PROCNT,
    icon: "💪",
    unit: "g",
    className: "text-indigo-500",
  },
  {
    label: "Carbs",
    tag: Nutrients.CHOCDF,
    icon: "🍞",
    unit: "g",
    className: "text-green-500",
  },
  {
    label: "Fat",
    tag: Nutrients.FAT,
    icon: "🥑",
    unit: "g",
    className: "text-yellow-500",
  },
];

/**
 * Updates the meal's nutrients based on the operation.
 *
 * @param meal - The meal to update.
 * @param operation - The operation to perform: "add" or "remove".
 * @param response - The nutrients response containing totalNutrients and totalWeight.
 * @returns The updated meal.
 */
export const updateMealNutrients = (
  meal: IMealInterface,
  operation: "add" | "remove" | undefined,
  response: IFoodNutrients
): IMealInterface => {
  if (!operation) {
    console.warn("Operation is undefined. No changes made to the meal.");
    return meal;
  }

  const updatedNutrients = { ...meal.nutrients };
  const totalNutrients = response?.totalNutrients ?? {};
  const totalWeight = response?.totalWeight || 0;

  Object.keys(totalNutrients).forEach((key) => {
    const nutrient = totalNutrients[key];
    if (updatedNutrients[key]) {
      // Nutrient already exists in the meal
      if (operation === "add") {
        updatedNutrients[key].quantity += nutrient.quantity;
      } else if (operation === "remove") {
        updatedNutrients[key].quantity -= nutrient.quantity;
        // Ensure quantity doesn't go negative
        if (updatedNutrients[key].quantity < 0) {
          updatedNutrients[key].quantity = 0;
        }
      }
    } else {
      // Nutrient does not exist in the meal, initialize it
      updatedNutrients[key] = {
        label: nutrient.label,
        quantity: operation === "add" ? nutrient.quantity : 0,
        unit: nutrient.unit,
      };
    }
  });

  // Update the meal's weight based on the operation
  let updatedWeight = meal.weight;
  if (operation === "add") {
    updatedWeight += totalWeight;
  } else if (operation === "remove") {
    updatedWeight -= totalWeight;
    // Ensure weight doesn't go negative
    if (updatedWeight < 0) {
      updatedWeight = 0;
    }
  }

  return {
    ...meal,
    nutrients: updatedNutrients,
    weight: updatedWeight,
  };
};

export const updateRecipeNutrients = (
  recipe: IRecipeInterface,
  operation: "add" | "remove" | undefined,
  response: IFoodNutrients
): IRecipeInterface => {
  const updatedBaseTotalNutrients = { ...recipe.baseTotalNutrients };
  const updatedBaseTotalDaily = { ...recipe.baseTotalDaily };
  let updatedBaseTotalWeight = recipe.baseTotalWeight ?? 0; // Initialize from recipe

  if (operation === "add") {
    // Update baseTotalWeight
    updatedBaseTotalWeight += response?.totalWeight ?? 0;

    // Update calories and totalWeight
    // These updates are now handled via base totals and scaling

    // Update diet labels
    recipe.dietLabels = Array.from(
      new Set([...recipe.dietLabels, ...(response?.dietLabels || [])])
    );

    // Update baseTotalNutrients
    Object.keys(response?.totalNutrients || {}).forEach((key) => {
      if (updatedBaseTotalNutrients[key]) {
        updatedBaseTotalNutrients[key].quantity +=
          response?.totalNutrients[key].quantity ?? 0;
      } else {
        updatedBaseTotalNutrients[key] = {
          label: response?.totalNutrients[key].label ?? "",
          quantity: response?.totalNutrients[key].quantity ?? 0,
          unit: response?.totalNutrients[key].unit ?? "",
        };
      }
    });

    // Update baseTotalDaily
    Object.keys(response?.totalDaily || {}).forEach((key) => {
      if (updatedBaseTotalDaily[key]) {
        updatedBaseTotalDaily[key].quantity +=
          response?.totalDaily[key].quantity ?? 0;
      } else {
        updatedBaseTotalDaily[key] = {
          label: response?.totalDaily[key].label ?? "",
          quantity: response?.totalDaily[key].quantity ?? 0,
          unit: response?.totalDaily[key].unit ?? "",
        };
      }
    });
  } else if (operation === "remove") {
    // Update baseTotalWeight
    updatedBaseTotalWeight -= response?.totalWeight ?? 0;

    // Handle diet labels removal if necessary

    // Update baseTotalNutrients
    Object.keys(response?.totalNutrients || {}).forEach((key) => {
      if (updatedBaseTotalNutrients[key]) {
        updatedBaseTotalNutrients[key].quantity -=
          response?.totalNutrients[key].quantity ?? 0;
        if (updatedBaseTotalNutrients[key].quantity <= 0) {
          delete updatedBaseTotalNutrients[key];
        }
      }
    });

    // Update baseTotalDaily
    Object.keys(response?.totalDaily || {}).forEach((key) => {
      if (updatedBaseTotalDaily[key]) {
        updatedBaseTotalDaily[key].quantity -=
          response?.totalDaily[key].quantity ?? 0;
        if (updatedBaseTotalDaily[key].quantity <= 0) {
          delete updatedBaseTotalDaily[key];
        }
      }
    });
  }

  // Apply scaling based on current yield
  const scalingFactor = recipe.yield;

  const scaledData = scaleNutrients(
    updatedBaseTotalNutrients,
    updatedBaseTotalDaily,
    updatedBaseTotalWeight, // Pass baseTotalWeight
    scalingFactor
  );

  const updatedRecipe: IRecipeInterface = {
    ...recipe,
    baseTotalNutrients: updatedBaseTotalNutrients,
    baseTotalDaily: updatedBaseTotalDaily,
    baseTotalWeight: updatedBaseTotalWeight, // Update baseTotalWeight
    totalNutrients: scaledData.totalNutrients,
    totalDaily: scaledData.totalDaily,
    calories: scaledData.calories,
    totalWeight: scaledData.totalWeight,
  };

  return updatedRecipe;
};
