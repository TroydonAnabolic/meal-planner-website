// utils/transformMealPlan.ts

import {
  AllMealFilter,
  IMealPlanPreferences,
  MealFilter,
  MealSection,
} from "@/models/interfaces/client/meal-planner-preferences";
import { transformLabel } from "./generic-utils";
import { DayOfTheWeek, MealType } from "@/constants/constants-enums";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import dayjs, { Dayjs } from "dayjs";
import { mapRecipeToMeal } from "./mappers";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { getEnumKeysByValues } from "./enum-util";
import {
  recipeUriFormat,
  recipeUrlFormat,
} from "@/constants/constants-objects";
// utils/transformMealPlan.ts

/**
 * List of string array keys to transform in AllMealFilter and MealFilter.
 */
const stringArrayKeys: (keyof AllMealFilter | keyof MealFilter)[] = [
  "health",
  "diet",
  "caution",
  "cuisine",
  "dish",
  "only-dish",
  "source",
  "source-name",
  "meal", // Added 'meal' for MealFilter
];

// Format the fetchedUri to match the section._links.self.href format
export const formatUri = (uri: string): string => {
  return uri.replace(recipeUriFormat, recipeUrlFormat);
};

/**
 * Recursively transforms all string arrays in AllMealFilter.
 * Converts strings to uppercase and replaces hyphens with underscores.
 * @param filter The AllMealFilter object to transform.
 * @returns The transformed AllMealFilter object.
 */
const transformAllMealFilter = (
  filter?: AllMealFilter
): AllMealFilter | undefined => {
  if (!filter) return undefined;

  const transformed: AllMealFilter = {};

  // Transform 'all' filters
  if (filter.all) {
    transformed.all = filter.all
      .map(transformAllMealFilter)
      .filter(Boolean) as AllMealFilter[];
  }

  // Transform 'any' filters
  if (filter.any) {
    transformed.any = filter.any
      .map(transformAllMealFilter)
      .filter(Boolean) as AllMealFilter[];
  }

  // Transform 'not' filter
  if (filter.not) {
    transformed.not = transformAllMealFilter(filter.not);
  }

  // Transform 'when' condition and requirement
  if (filter.when) {
    transformed.when = {
      condition: transformAllMealFilter(filter.when.condition) || {
        ...filter.when.condition,
      },
      require: transformAllMealFilter(filter.when.require) || {
        ...filter.when.require,
      },
    };
  }

  // Transform string arrays
  stringArrayKeys.forEach((key) => {
    if (
      "health" === key ||
      "diet" === key ||
      "caution" === key ||
      "cuisine" === key
      // "dish" === key ||
      // "only-dish" === key ||
      // "source" === key ||
      // "source-name" === key
    ) {
      if (filter[key]) {
        const test = filter[key];
        transformed[key] = filter[key].map(transformLabel);
      }
    } else {
      if (filter[key]) {
        let currentFilter;
        if (Array.isArray(filter[key])) {
          currentFilter = filter[key] as string[];
          transformed[key] = currentFilter?.map((f) => f.toString()) as any;
        } else {
          currentFilter = filter[key] as string;
        }
      }
    }
  });

  return transformed;
};

/**
 * Recursively transforms all string arrays in MealFilter.
 * Converts strings to uppercase and replaces hyphens with underscores.
 * @param filter The MealFilter object to transform.
 * @returns The transformed MealFilter object.
 */
const transformMealFilter = (filter?: MealFilter): MealFilter | undefined => {
  if (!filter) return undefined;

  const transformed: MealFilter = {};

  // Transform 'all' filters
  if (filter.all) {
    transformed.all = filter.all
      .map(transformMealFilter)
      .filter(Boolean) as MealFilter[];
  }

  // Transform 'any' filters
  if (filter.any) {
    transformed.any = filter.any
      .map(transformMealFilter)
      .filter(Boolean) as MealFilter[];
  }

  // Transform 'not' filter
  if (filter.not) {
    transformed.not = transformMealFilter(filter.not);
  }

  // Transform 'when' condition and requirement
  if (filter.when) {
    transformed.when = {
      condition: transformMealFilter(filter.when.condition) || {
        ...filter.when.condition,
      },
      require: transformMealFilter(filter.when.require) || {
        ...filter.when.require,
      },
    };
  }

  // Transform string arrays
  stringArrayKeys.forEach((key) => {
    if (
      "health" === key ||
      "diet" === key ||
      "caution" === key ||
      "cuisine" === key
      //    "meal" === key ||
      // "dish" === key ||
      //  "only-dish" === key
    ) {
      if (filter[key]) {
        transformed[key] = filter[key].map(transformLabel);
      }
    } else {
      if (filter[key]) {
        let currentFilter;
        if (Array.isArray(filter[key])) {
          currentFilter = filter[key] as string[];
          transformed[key] = currentFilter?.map((f) => f.toString()) as any;
        } else {
          currentFilter = filter[key] as string;
        }
      }
    }
  });

  return transformed;
};

/**
 * Transforms all relevant string arrays in a MealSection.
 * Converts strings to uppercase and replaces hyphens with underscores.
 * @param section The MealSection object to transform.
 * @returns The transformed MealSection object.
 */
const transformMealSection = (section?: MealSection): MealSection => {
  if (!section) return {};

  return {
    ...section,
    accept: transformMealFilter(section.accept),
    // If other properties inside MealSection require transformation, handle them here
  };
};

/**
 * Transforms all relevant string arrays in the meal plan preferences.
 * Converts strings to uppercase and replaces hyphens with underscores.
 * @param mealPlanPreferences The meal plan preferences to transform.
 * @returns The transformed meal plan preferences.
 */
export const transformMealPlanLabels = (
  mealPlanPreferences: IMealPlanPreferences
): IMealPlanPreferences => {
  // Transform the 'accept' filter
  const transformedAccept = transformAllMealFilter(
    mealPlanPreferences.plan.accept
  );

  // Transform each section's 'accept' filter
  const transformedSections = mealPlanPreferences.plan.sections
    ? Object.entries(mealPlanPreferences.plan.sections).reduce(
        (acc, [key, section]) => {
          acc[key] = transformMealSection(section);
          return acc;
        },
        {} as { [key: string]: MealSection }
      )
    : undefined;

  return {
    ...mealPlanPreferences,
    plan: {
      ...mealPlanPreferences.plan,
      accept: transformedAccept,
      sections: transformedSections,
      // If there are other sections or properties to transform, handle them here
    },
  };
};

// Utility functions
export const extractRecipeIdFromHref = (href: string): string | null => {
  const match = href.match(/recipes\/v2\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

export const extractRecipeIdFromUri = (uri: string): string | null => {
  const match = uri.match(/#recipe_(\w+)/);
  return match ? match[1] : null;
};

/**
 * Generates meals for the meal plan by mapping recipes to their respective meals.
 * Ensures that recipe.timeScheduled is assigned the same date as the meal.
 * Provides a blueprint for each meal with default values.
 * @param mealPlan The meal plan object containing selections and preferences.
 * @param recipes The list of recipes to be mapped to meals.
 * @returns An array of meals with assigned dates and blueprint structure.
 */
export const generateMealsForPlan = (
  mealPlan: IMealPlan,
  recipes: IRecipeInterface[]
): IMealInterface[] => {
  const meals: IMealInterface[] = [];

  mealPlan.selection.forEach((selectionItem, dayIndex) => {
    const currentDate = dayjs(mealPlan.startDate).add(dayIndex, "day");

    // Iterate over each section in the selectionItem.sections object
    Object.entries(selectionItem.sections).forEach(([mealTypeKey, section]) => {
      // Extract the recipe ID from the section's self href
      const recipeId = extractRecipeIdFromHref(section._links.self.href);

      // Find the recipe in the recipes array that matches the extracted recipe ID
      const recipe = recipes.find(
        (r) => extractRecipeIdFromUri(r.uri) === recipeId
      );

      // If a matching recipe is found
      if (recipe) {
        // Map the recipe to a meal object using the mapRecipeToMeal function
        const mappedMeal = mapRecipeToMeal(recipe, mealPlan.clientId);

        // Assign the scheduled time for the meal to the current date
        mappedMeal.timeScheduled = currentDate.toDate();

        // Assign the day of the week for the meal
        mappedMeal.dayOfTheWeek = currentDate.day() as unknown as DayOfTheWeek;

        // Assign mealTypeKey based on the recipe's mealType
        mappedMeal.mealTypeKey = getEnumKeysByValues(
          MealType,
          recipe.mealType as MealType[]
        );

        // Add the mapped meal to the meals array with a default mealPlanId
        meals.push({
          ...mappedMeal,
          mealPlanId: mealPlan.id || 0,
        });

        // Assign the same scheduled time to the recipe
        recipe.timeScheduled = mappedMeal.timeScheduled;
      }
    });
  });
  return meals;
};
