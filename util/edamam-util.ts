// util/queryUtils.ts

import {
  CuisineType,
  DietLabels,
  DishType,
  HealthLabels,
} from "@/constants/constants-enums";
import { IRecipeRequest } from "@/models/interfaces/recipe/recipes-request";
import qs from "qs";
/**
 * Transforms an object into a URL query string.
 *
 * @param params - The object containing query parameters.
 * @returns A URL-encoded query string.
 */
export function buildQueryParams(params: { [key: string]: any }): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
}

// File: edamam-util.ts

/**
 * Parses a URL query string into an IRecipeRequest object using qs.
 *
 * @param query - The URL query string.
 * @returns An IRecipeRequest object.
 */
export function parseQueryParams(query: string): IRecipeRequest {
  const params = qs.parse(query, { ignoreQueryPrefix: true });

  const recipeRequest: Partial<IRecipeRequest> = { field: [] };

  // Helper function to ensure values are strings
  const ensureStringArray = (value: any): string[] => {
    if (typeof value === "string") {
      return [value];
    } else if (
      Array.isArray(value) &&
      value.every((item) => typeof item === "string")
    ) {
      return value;
    } else {
      return [];
    }
  };

  if (params.calories && typeof params.calories === "string") {
    recipeRequest.calories = params.calories;
  }

  if (params.excluded) {
    recipeRequest.excluded = ensureStringArray(params.excluded);
  }

  if (params.diet) {
    const diets = ensureStringArray(params.diet).filter((value) =>
      Object.values(DietLabels).includes(value as DietLabels)
    );
    recipeRequest.diet = diets as DietLabels[];
  }

  if (params.health) {
    const healths = ensureStringArray(params.health).filter((value) =>
      Object.values(HealthLabels).includes(value as HealthLabels)
    );
    recipeRequest.health = healths as HealthLabels[];
  }

  if (params.cuisineType) {
    const cuisines = ensureStringArray(params.cuisineType).filter((value) =>
      Object.values(CuisineType).includes(value as CuisineType)
    );
    recipeRequest.cuisineType = cuisines as CuisineType[];
  }

  if (params.mealType) {
    recipeRequest.mealType = ensureStringArray(params.mealType);
  }

  if (params.dishType) {
    const dishes = ensureStringArray(params.dishType).filter((value) =>
      Object.values(DishType).includes(value as DishType)
    );
    recipeRequest.dishType = dishes as DishType[];
  }

  // Ensure 'field' is set if not present
  if (
    !recipeRequest.field ||
    (Array.isArray(recipeRequest.field) && recipeRequest.field.length === 0)
  ) {
    recipeRequest.field = ["uri"];
  }

  return recipeRequest as IRecipeRequest;
}
