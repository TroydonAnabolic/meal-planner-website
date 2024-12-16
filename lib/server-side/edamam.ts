import axios from "@/axiosConfig";
import { EDAMAM_BASE, EDAMAM_RECIPE_API } from "@/constants/constants-urls";
import { IRecipeHit } from "@/models/interfaces/recipe/recipe";
import { exponentialBackoffFetch } from "../http/exponential-back-off";

const appId = process.env.EDAMAM_RECIPE_APP_ID;
const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

/**
 * Fetches recipes by query.
 *
 * @param query - The query to search for.
 * @returns IRecipeHit object or undefined.
 */
export async function fetchRecipeFromId(
  id: string
): Promise<IRecipeHit | undefined> {
  try {
    const recipeURI = `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${appId}&app_key=${appKey}`;

    const response = await exponentialBackoffFetch(() =>
      fetch(recipeURI, {
        method: "GET",
      })
    );
    const recipeResponse: IRecipeHit = await response.json();

    return recipeResponse;
  } catch (error) {
    console.error("Error fetching recipe", error);
  }
}
