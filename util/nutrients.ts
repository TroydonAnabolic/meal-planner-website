// utils/scaleNutrients.ts

import { Nutrients } from "@/constants/constants-enums";
import {
  IFoodNutrients,
  IFoodNutrientsResponse,
} from "@/models/interfaces/edamam/food/nutrients-response";
import {
  IIngredient,
  INutrient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import {
  IRecipeInterface,
  RecipeNutrient,
} from "@/models/interfaces/recipe/recipe";

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

export const nutrientFields: {
  tag: Nutrients;
  label: string;
  unit: string;
}[] = [
  { tag: Nutrients.ENERC_KCAL, label: "Calories", unit: "kcal" },
  { tag: Nutrients.PROCNT, label: "Protein", unit: "g" },
  { tag: Nutrients.FAT, label: "Total Lipid Fat", unit: "g" },
  { tag: Nutrients.FASAT, label: "Saturated Fat", unit: "g" },
  { tag: Nutrients.FATRN, label: "Trans Fat", unit: "g" },
  { tag: Nutrients.CHOCDF, label: "Carbs", unit: "g" },
  { tag: Nutrients.SUGAR, label: "Sugars", unit: "g" },
  { tag: Nutrients.FIBTG, label: "Fiber", unit: "g" },
  { tag: Nutrients.NA, label: "Sodium", unit: "mg" },
  { tag: Nutrients.K, label: "Potassium", unit: "mg" },
];

/**
 * Updates the meal's nutrients based on the operation.
 *
 * @param meal - The meal to update.
 * @param operation - The operation to perform: "add" or "remove".
 * @param response - The nutrients response containing totalNutrients and totalWeight.
 * @returns The updated meal.
 */
// export const updateIngredientNutrients = (
//   ingredient: IIngredient,
//   operation: "add" | "remove" | undefined,
//   response: IFoodNutrients
// ): IIngredient => {
//   if (!operation) {
//     console.warn("Operation is undefined. No changes made to the meal.");
//     return ingredient;
//   }

//   const updatedNutrients: { [key: string]: INutrient } = {
//     ...ingredient.totalNutrients,
//   };
//   const totalNutrients = response?.totalNutrients ?? {};
//   const totalWeight = response?.totalWeight || 0;

//   Object.keys(totalNutrients).forEach((key) => {
//     const nutrient = totalNutrients[key];
//     if (updatedNutrients[key]) {
//       // Nutrient already exists in the meal
//       if (operation === "add") {
//         updatedNutrients[key].quantity += nutrient.quantity;
//       } else if (operation === "remove") {
//         updatedNutrients[key].quantity -= nutrient.quantity;
//         // Ensure quantity doesn't go negative
//         if (updatedNutrients[key].quantity < 0) {
//           updatedNutrients[key].quantity = 0;
//         }
//       }
//     } else {
//       // Nutrient does not exist in the meal, initialize it
//       updatedNutrients[key] = {
//         id: (updatedNutrients[key] as INutrient)?.id || 0, // Provide a default value or handle appropriately
//         ingredientId: (updatedNutrients[key] as INutrient)?.ingredientId || 0, // Provide a default value or handle appropriately
//         label: nutrient.label,
//         quantity: operation === "add" ? nutrient.quantity : 0,
//         unit: nutrient.unit,
//       };
//     }
//   });

//   // Update the meal's weight based on the operation
//   let updatedWeight = ingredient.weight;
//   if (operation === "add") {
//     updatedWeight += totalWeight;
//   } else if (operation === "remove") {
//     updatedWeight -= totalWeight;
//     // Ensure weight doesn't go negative
//     if (updatedWeight < 0) {
//       updatedWeight = 0;
//     }
//   }

//   return {
//     ...ingredient,
//     totalNutrients: updatedNutrients,
//     weight: updatedWeight,
//   };
// };

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

export const nutrientNames: Record<string, string> = {
  [Nutrients.SUGAR_added]: "Added sugar",
  [Nutrients.CA]: "Calcium, Ca",
  [Nutrients.CHOCDF_net]: "Carbohydrate (net)",
  [Nutrients.CHOCDF]: "Carbohydrate, by difference",
  [Nutrients.CHOLE]: "Cholesterol",
  [Nutrients.ENERC_KCAL]: "Energy",
  [Nutrients.FAMS]: "Fatty acids, total monounsaturated",
  [Nutrients.FAPU]: "Fatty acids, total polyunsaturated",
  [Nutrients.FASAT]: "Fatty acids, total saturated",
  [Nutrients.FATRN]: "Fatty acids, total trans",
  [Nutrients.FIBTG]: "Fiber, total dietary",
  [Nutrients.FOLDFE]: "Folate, DFE",
  [Nutrients.FOLFD]: "Folate, food",
  [Nutrients.FOLAC]: "Folic acid",
  [Nutrients.FE]: "Iron, Fe",
  [Nutrients.MG]: "Magnesium",
  [Nutrients.NIA]: "Niacin",
  [Nutrients.P]: "Phosphorus, P",
  [Nutrients.K]: "Potassium, K",
  [Nutrients.PROCNT]: "Protein",
  [Nutrients.RIBF]: "Riboflavin",
  [Nutrients.NA]: "Sodium, Na",
  [Nutrients.SUGAR_alcohol]: "Sugar alcohols",
  [Nutrients.SUGAR]: "Sugars, total",
  [Nutrients.THIA]: "Thiamin",
  [Nutrients.FAT]: "Total lipid (fat)",
  [Nutrients.VITA_RAE]: "Vitamin A, RAE",
  [Nutrients.VITB12]: "Vitamin B-12",
  [Nutrients.VITB6A]: "Vitamin B-6",
  [Nutrients.VITC]: "Vitamin C, total ascorbic acid",
  [Nutrients.VITD]: "Vitamin D (D2 + D3)",
  [Nutrients.TOCPHA]: "Vitamin E (alpha-tocopherol)",
  [Nutrients.VITK1]: "Vitamin K (phylloquinone)",
  [Nutrients.WATER]: "Water",
  [Nutrients.ZN]: "Zinc, Zn",
};
