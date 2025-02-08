import {
  EDAMAM_BASE,
  EDAMAM_MEALPLANNER_API,
} from "@/constants/constants-urls";
import {
  IRecipeHit,
  IRecipeInterface,
} from "@/models/interfaces/recipe/recipe";
import { exponentialBackoffFetch } from "../http/exponential-back-off";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import {
  GeneratorResponse,
  IMealPlannerResponse,
} from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { transformMealPlanLabels } from "@/util/meal-generator-util";
import { AxiosRequestConfig } from "axios";
import { exponentialBackoffAxios } from "../http/exponential-back-off-axios";
import Bottleneck from "bottleneck";

// Initialize Bottleneck limiter
const limiter = new Bottleneck({
  maxConcurrent: 1, // Maximum number of concurrent API calls
  minTime: 200, // Minimum time between requests in ms
});

/**
 * Fetches recipes by query.
 *
 * @param query - The query to search for.
 * @returns IRecipeHit object or undefined.
 */
export async function getRecipeFromId(
  id: string
): Promise<IRecipeHit | undefined> {
  const appId = process.env.EDAMAM_RECIPE_APP_ID;
  const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

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

export async function getEdamamMealPlan(
  mealPlanPreferences: IMealPlannerRequest
): Promise<GeneratorResponse> {
  const transformedMealPlan = transformMealPlanLabels(mealPlanPreferences);
  const appId = process.env.EDAMAM_MEAL_PLANNER_APP_ID;
  const appKey = process.env.EDAMAM_MEAL_PLANNER_APP_KEY;
  const edamamAccountUser = process.env.EDAMAM_ACCOUNT_USER;

  const token = Buffer.from(`${appId}:${appKey}`).toString("base64");
  const authHeader = `Basic ${token}`;

  const axiosConfig: AxiosRequestConfig = {
    url: `${EDAMAM_BASE}${EDAMAM_MEALPLANNER_API}/${appId}/select`,
    method: "POST",
    data: transformedMealPlan,
    headers: {
      Authorization: authHeader,
      "Edamam-Account-User": edamamAccountUser,
    },
  };
  try {
    const response = await exponentialBackoffAxios<GeneratorResponse>(
      axiosConfig
    );
    return response.data;
  } catch (error: any) {
    console.error(`Failed to get meal plan: ${error.message}`, error);
    throw new Error(`Failed to get meal plan: ${error.message}`);
  }
}

export async function getRecipeFromURI(
  recipeURI: string
): Promise<IRecipeHit | undefined> {
  const appId = process.env.EDAMAM_RECIPE_APP_ID;
  const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

  try {
    const response = await exponentialBackoffFetch(() =>
      fetch(`${recipeURI}?app_id=${appId}&app_key=${appKey}`, {
        method: "GET",
      })
    );

    if (!response.ok) {
      throw new Error("Failed to get recipe");
    }

    const recipeResponse: IRecipeHit = await response.json();

    if (!recipeResponse) {
      throw new Error("Failed to get recipe");
    }

    return recipeResponse;
  } catch (error: any) {
    console.error(`Failed to get recipe: ${error.message}`, error);
  }
}

export async function getRecipesFromUris(
  recipeUris: string[]
): Promise<IRecipeInterface[]> {
  console.log(`Initial amount of recipe URIs: ${recipeUris.length}`);

  const results = await Promise.all(
    recipeUris.map(async (uri) => {
      try {
        const recipeResponse: IRecipeHit | undefined = await limiter.schedule(
          () => getRecipeFromURI(uri)
        );
        return { success: true, recipe: recipeResponse?.recipe };
      } catch (error) {
        console.error(`Failed to fetch recipe from URI: ${uri}`, error);
        return { success: false, recipe: null };
      }
    })
  );

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  console.log(`Successful calls: ${successCount}`);
  console.log(`Unsuccessful calls: ${failureCount}`);

  return results
    .filter((r): r is { success: true; recipe: IRecipeInterface } => r.success)
    .map((r) => r.recipe);
}
