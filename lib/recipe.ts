import axios from "@/axiosConfig";
import {
  APIM_HEADERS,
  BACKEND_URL_LIVE,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { getLocalTimeFromUtc, getUtcTimeFromLocal } from "@/util/date-util";

function dateTransformer(data: any, headers?: any): any {
  if (data instanceof Date) {
    // do your specific formatting here
    if (data.toDateString() == "Invalid Date") {
      return null;
    } else {
      return new Date(
        new Date(data).getTime() - data.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1);
    }
  }
  if (Array.isArray(data)) {
    return data.map((val) => dateTransformer(val, undefined));
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        dateTransformer(val, undefined),
      ])
    );
  }
  return data;
}

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
  // transformRequest: [dateTransformer].concat(
  //   axios.defaults.transformRequest || []
  // ),
});

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function getRecipesByClientId(
  clientId: number
): Promise<IRecipeInterface[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/recipes/myrecipes`, {
      params: { clientId: clientId },
    });
    // Assuming your API response matches the Recipe interface
    const recipes: IRecipeInterface[] = response.data;
    // assign recipe.totalNutrients, recipe.totalDaily, to recipe.baseTotalNutrients, recipe.baseTotalDaily
    if (recipes) {
      for (const recipe of recipes) {
        recipe.baseTotalNutrients = recipe.totalNutrients;
        recipe.baseTotalDaily = recipe.totalDaily;
        recipe.baseTotalWeight = recipe.totalWeight;
        if (recipe.timeScheduled) {
          const localTimeScheduled = getLocalTimeFromUtc(recipe.timeScheduled);
          recipe.timeScheduled = localTimeScheduled;
        }
      }
    }

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by clientId:", error);
  }
}

/**
 * Fetches recipes by meal plan ID.
 *
 * @param mealPlanId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function getRecipesByMealPlanId(
  mealPlanId: number
): Promise<IRecipeInterface[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/recipes/mealPlan`, {
      params: { mealPlanId: mealPlanId },
    });
    // Assuming your API response matches the Recipe interface
    const recipes: IRecipeInterface[] = response.data;
    // assign recipe.totalNutrients, recipe.totalDaily, to recipe.baseTotalNutrients, recipe.baseTotalDaily
    if (recipes) {
      for (const recipe of recipes) {
        recipe.baseTotalNutrients = recipe.totalNutrients;
        recipe.baseTotalDaily = recipe.totalDaily;
        recipe.baseTotalWeight = recipe.totalWeight;
        if (recipe.timeScheduled) {
          const localTimeScheduled = getLocalTimeFromUtc(recipe.timeScheduled);
          recipe.timeScheduled = localTimeScheduled;
        }
      }
    }

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes by mealPlanId:", error);
  }
}

/**
 * Adds a new recipe to the backend.
 *
 * @param recipe - The IRecipeInterface object to be saved.
 * @returns The saved IRecipeInterface object, or undefined if failed.
 */
export async function addRecipe(
  recipe: IRecipeInterface
): Promise<IRecipeInterface | undefined> {
  try {
    if (recipe.timeScheduled) {
      const utcTime = getUtcTimeFromLocal(recipe.timeScheduled); // Await if async
      recipe.timeScheduled = new Date(utcTime!);
    }

    const response = await instance.post(`${DIETAPI_BASE}/recipes`, recipe);

    const addedRecipe: IRecipeInterface = response.data;

    return addedRecipe;
  } catch (error: any) {
    console.error("Error fetching recipes by clientId:", error.message);
  }
}

/**
 * Adds a recipes of meals to the backend.
 *
 * @param recipes - The IRecipeInterface objects to be saved.
 * @returns The saved IRecipeInterface[] objects, or undefined if failed.
 */
export async function addMealPlanRecipes(
  recipes: IRecipeInterface[]
): Promise<IRecipeInterface[] | undefined> {
  // convert to local before storing in the db
  for (const recipe of recipes) {
    if (recipe.timeScheduled) {
      const utcTime = getUtcTimeFromLocal(recipe.timeScheduled); // Await if async
      recipe.timeScheduled = new Date(utcTime!);
    }
  }
  const response = await instance.post(
    `${DIETAPI_BASE}/recipes/mealPlan`,
    recipes
  );
  return response.data;
}

/**
 * Adds a recipes of meals to the backend.
 *
 * @param recipes - The IRecipeInterface objects to be saved.
 * @returns The saved IRecipeInterface[] objects, or undefined if failed.
 */
export async function updateMealPlanRecipes(
  recipes: IRecipeInterface[]
): Promise<IRecipeInterface | undefined> {
  for (const recipe of recipes) {
    if (recipe.timeScheduled) {
      const utcTime = getUtcTimeFromLocal(recipe.timeScheduled); // Await if async
      recipe.timeScheduled = new Date(utcTime!);
    }
  }
  const response = await instance.put(
    `${DIETAPI_BASE}/recipes/mealPlan`,
    recipes
  );
  return response.data;
}

export async function updateRecipe(recipe: IRecipeInterface) {
  if (recipe.timeScheduled) {
    const utcTime = getUtcTimeFromLocal(recipe.timeScheduled); // Await if async
    recipe.timeScheduled = new Date(utcTime!);
  }

  const response = await instance.put(
    `${BACKEND_URL_LIVE}/${DIETAPI_BASE}/recipes`,
    recipe
  );
  const updatedRecipe: IRecipeInterface = response.data;

  return updatedRecipe;
}

export async function deleteRecipe(id: number) {
  return await instance.delete(`${BACKEND_URL_LIVE}/${DIETAPI_BASE}/recipes`, {
    params: { id: id },
  });
}
