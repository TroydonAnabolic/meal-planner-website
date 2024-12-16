import {
  IRecipeHit,
  IRecipeInterface,
} from "@/models/interfaces/recipe/recipe";
import {
  IFoodParser,
  IFoodParserResponse,
} from "@/models/interfaces/edamam/food/food-response";
import { IFoodNutrientsRequest } from "@/models/interfaces/edamam/food/nutrients-request";
import {
  IFoodNutrients,
  IFoodNutrientsResponse,
} from "@/models/interfaces/edamam/food/nutrients-response";
import {
  IRecipeResponse,
  IRecipeResponseData,
} from "@/models/interfaces/edamam/recipe/recipe-response";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { transformMealPlanLabels } from "@/util/meal-generator-util";
import {
  ShoppingListEntry,
  ShoppingListRequest,
} from "@/models/interfaces/edamam/meal-planner/shopping-list-request";
import { IRecipeRequest } from "@/models/interfaces/recipe/recipes-request";
import { exponentialBackoffFetch } from "./http/exponential-back-off";
import qs from "qs";
import { IShoppingListResult } from "@/models/interfaces/edamam/meal-planner/shopping-list-response";
import Bottleneck from "bottleneck"; // Install via npm install bottleneck

// Initialize Bottleneck limiter
const limiter = new Bottleneck({
  maxConcurrent: 1, // Maximum number of concurrent API calls
  minTime: 50, // Minimum time between requests in ms
});

/**
 * Fetches recipes from the Edamam API based on a search query.
 *
 * @param query - The search term entered by the user.
 * @returns An array of IRecipeInterface objects.
 */

export async function fetchEdamamRecipeWithFilter(
  recipeRequest: IRecipeRequest
): Promise<IRecipeInterface[]> {
  // Serialize query parameters using qs
  const serializedParams = qs.stringify(recipeRequest, {
    arrayFormat: "repeat",
  });
  const url = `/api/edamam/recipe/fetch-recipe-by-filter?${serializedParams}`;

  const recipeResponse = await exponentialBackoffFetch(() =>
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  if (!recipeResponse.ok) {
    throw new Error("Failed to get recipes");
  }

  const data: IRecipeResponseData = await recipeResponse.json();
  const recipes = data?.hits.map((hit) => hit.recipe) || [];
  return recipes;
}

export async function fetchRecipesToExclude(
  recipeRequest: IRecipeRequest
): Promise<IRecipeInterface[]> {
  const updatedRecipeRequest: IRecipeRequest = {
    ...recipeRequest,
    field: ["uri"],
  };

  try {
    const recipes = await fetchEdamamRecipeWithFilter(updatedRecipeRequest);
    return recipes;
  } catch (error) {
    throw new Error("Failed to fetch excluded recipes");
  }
}

export async function fetchEdamamRecipes(
  query: string
): Promise<IRecipeInterface[]> {
  const recipeResponse = await limiter.schedule(() =>
    fetch(`/api/edamam/recipe/fetch-recipe?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  // const recipeResponse3 = await exponentialBackoffFetch(
  //   () =>
  //     fetch(`/api/edamam/recipe/fetch-recipe?query=${query}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }),
  //   20
  // );

  if (!recipeResponse.ok) {
    throw new Error("Failed to get recipes");
  }

  const response: IRecipeResponseData = await recipeResponse.json();

  if (!response) {
    throw new Error("Failed to get recipes");
  }

  const recipes = response?.hits.map((hit) => hit.recipe) || [];
  return recipes;
}

/**
 * Fetches food data from the Edamam Food Database API based on a search query.
 *
 * @param query - The search term entered by the user.
 * @returns IFoodParserResponse containing food hints.
 */
export async function fetchFood(query: string): Promise<IFoodParser> {
  const foodResponse = await exponentialBackoffFetch(
    () =>
      fetch(`/api/edamam/food/fetch-food?query=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    20
  );

  if (!foodResponse.ok) {
    throw new Error("Failed to get food");
  }

  const response: IFoodParserResponse = await foodResponse.json();

  if (!response) {
    throw new Error("Failed to get food");
  } else if (!response.data) {
    throw new Error("Failed to get food");
  }

  return response.data;
}

/**
 * Updates the recipe nutrients by adding or removing ingredients.
 *
 * @param request - The nutrients request body.
 * @returns IFoodNutrientsResponse containing updated nutrients.
 */
export async function fetchNutrients(
  request: IFoodNutrientsRequest
): Promise<IFoodNutrients> {
  const nutritionResponse = await exponentialBackoffFetch(() =>
    fetch("/api/edamam/nutrition/fetch-nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
  );

  if (!nutritionResponse.ok) {
    throw new Error("Failed to get nutrition data");
  }

  const response: IFoodNutrientsResponse = await nutritionResponse.json();

  if (!response) {
    throw new Error("Failed to get meal plan");
  } else if (!response.data) {
    throw new Error("No meal plan could be generated");
  }

  return response.data;
}

export async function fetchEdamamMealPlan(
  mealPlanPreferences: IMealPlannerRequest
): Promise<GeneratorResponse> {
  const transformedMealPlan = transformMealPlanLabels(mealPlanPreferences);

  const edamamPlanResponse = await exponentialBackoffFetch(
    () =>
      fetch("/api/edamam/meal-planner/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedMealPlan),
      }),
    5,
    2000
  );

  if (!edamamPlanResponse.ok) {
    throw new Error("Failed to get meal plan");
  }

  const response: GeneratorResponse = await edamamPlanResponse.json();

  if (!response) {
    throw new Error("Failed to get meal plan");
  } else if (response.status !== "OK") {
    throw new Error("No meal plan could be generated");
  }

  return response;
}

export async function fetchRecipeFromURI(
  recipeURI: string
): Promise<IRecipeHit> {
  const recipeResponse = await exponentialBackoffFetch(
    () =>
      fetch(
        `/api/edamam/meal-planner/fetch-recipe?uri=${encodeURIComponent(
          recipeURI
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    5,
    60000
  );

  if (!recipeResponse.ok) {
    throw new Error(`Failed to get recipe ${recipeResponse.statusText}`);
  }

  const response: IRecipeHit = await recipeResponse.json();

  if (!response) {
    throw new Error("Failed to get meal plan");
  }

  return response;
}

export async function fetchRecipesFromUris(
  recipeUris: string[]
): Promise<IRecipeInterface[]> {
  console.log(`Initial amount of recipe URIs: ${recipeUris.length}`);

  const results = await Promise.all(
    recipeUris.map(async (uri) => {
      try {
        const recipeResponse = await limiter.schedule(() =>
          fetchRecipeFromURI(uri)
        );
        return { success: true, recipe: recipeResponse.recipe };
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

/**
 * Fetches the shopping list based on the generated meal plan.
 *
 * @param shoppingListRequest - The shopping list request body.
 * @returns ShoppingListResponse containing the shopping list items.
 */
export async function fetchShoppingList(
  shoppingListRequest: ShoppingListRequest
): Promise<IShoppingListResult> {
  const shoppingListResponse = await exponentialBackoffFetch(
    () =>
      fetch(`/api/edamam/meal-planner/shopping-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shoppingListRequest),
      }),
    30,
    6000
  );

  if (!shoppingListResponse.ok) {
    throw new Error("Failed to fetch shopping list");
  }

  const response: IShoppingListResult = await shoppingListResponse.json();

  if (!response) {
    throw new Error("No shopping list could be generated");
  }

  return response;
}

/**
 * Sends a ShoppingListRequest to the backend API with exponential backoff and throttling.
 *
 * @param shoppingListRequest - The shopping list request payload.
 * @returns ShoppingListResponse from the backend API.
 */
async function fetchShoppingListThrottled(
  shoppingListRequest: ShoppingListRequest
): Promise<IShoppingListResult> {
  return limiter.schedule(() => fetchShoppingList(shoppingListRequest));
}

/**
 * Processes the fetched recipes to create a consolidated shopping list.
 * Sends fetchShoppingList requests in batches, each containing entries from a unique recipeUri.
 *
 * @param recipes - Array of recipes with ingredients.
 * @returns Consolidated ShoppingListResponse.
 */
export async function generateConsolidatedShoppingList(
  recipes: IRecipeInterface[]
): Promise<IShoppingListResult> {
  // Step 1: Group entries by unique recipeUri
  const recipeMap: Map<string, ShoppingListEntry[]> = new Map();

  recipes.forEach((recipe) => {
    const recipeUri = recipe.uri;
    if (!recipeMap.has(recipeUri)) {
      recipeMap.set(recipeUri, []);
    }

    recipe.ingredients.forEach((ingredient) => {
      const entry: ShoppingListEntry = {
        quantity: ingredient.quantity || 1,
        recipe: recipeUri,
      };

      recipeMap.get(recipeUri)?.push(entry);
    });
  });

  const entries: ShoppingListEntry[] = [];
  recipeMap.forEach((entryList, recipeUri) => {
    entries.push(...entryList);
  });

  const groupedEntries: ShoppingListEntry[][] = [];
  let currentGroup: ShoppingListEntry[] = [];
  const recipesInCurrentGroup = new Set<string>();
  const amountPerGroup = Math.ceil(entries.length / 5);

  // Group the entries ensuring each currentGroup.entry.recipe is unique, each group size has to be the size of the entries.length/5, when we reach a duplicate within a group, push the current group into the groupedEntries
  entries.forEach((entry) => {
    if (
      // if the recipes in current group does not have the entry.recipe
      // and the current group length is less than the amount per group
      !recipesInCurrentGroup.has(entry.recipe) &&
      currentGroup.length < amountPerGroup
    ) {
      currentGroup.push(entry);
      recipesInCurrentGroup.add(entry.recipe);
    } else {
      // push the current group into the groupedEntries
      groupedEntries.push(currentGroup);
      // reset the current group and recipes set
      currentGroup = [entry];
      recipesInCurrentGroup.clear();
      recipesInCurrentGroup.add(entry.recipe);
    }
  });

  // if there are still entries in the current group, push it into the groupedEntries
  if (currentGroup.length > 0) {
    groupedEntries.push(currentGroup);
  }

  // Step 4: Consolidate successful responses
  const finalShoppingList: IShoppingListResult = { entries: [] };

  groupedEntries.forEach(async (entryGroup) => {
    const shoppingListRequest: ShoppingListRequest = {
      entries: entryGroup,
    };

    try {
      const response = await fetchShoppingListThrottled(shoppingListRequest);
      finalShoppingList.entries.push(...response.entries);
    } catch (error: any) {
      console.error(`Error fetching shopping list`, error);
    }
  });

  return finalShoppingList;
}
