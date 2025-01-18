import {
  BACKEND_URL_LIVE,
  APIM_HEADERS_PUBLIC,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import axios from "axios";

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function fetchRecipesByClientId(
  clientId: number
): Promise<IRecipeInterface[] | undefined> {
  try {
    const response = await fetch(
      `/api/recipes/add-meal-plan-recipes?clientId=${clientId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const recipes: IRecipeInterface[] = await response.json();

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by clientId:", error);
  }
}

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function storeMealPlanRecipes(
  recipesToAdd: IRecipeInterface[]
): Promise<IRecipeInterface[] | undefined> {
  try {
    const response = await fetch(`/api/recipes/add-meal-plan-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipesToAdd), // Send data in the body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const recipes: IRecipeInterface[] = await response.json();

    return recipes;
  } catch (error) {
    console.error("Error storing recipes:", error);
  }
}
