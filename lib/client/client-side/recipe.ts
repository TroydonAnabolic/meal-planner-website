import {
  BACKEND_URL_LIVE,
  APIM_HEADERS_PUBLIC,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import axios from "axios";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS_PUBLIC,
});

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function unsafe_getRecipesByClientId(
  clientId: number
): Promise<IRecipeInterface[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/recipes/myrecipes`, {
      params: { clientId: clientId },
    });
    // Assuming your API response matches the Recipe interface
    const recipes: IRecipeInterface[] = response.data;
    // assign recipe.totalNutrients, recipe.totalDaily, to recipe.baseTotalNutrients, recipe.baseTotalDaily
    recipes.forEach((recipe) => {
      recipe.baseTotalNutrients = recipe.totalNutrients;
      recipe.baseTotalDaily = recipe.totalDaily;
      recipe.baseTotalWeight = recipe.totalWeight;
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by clientId:", error);
  }
}
