import axios from "@/axiosConfig";
import {
  BACKEND_URL_LIVE,
  APIM_HEADERS,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { getLocalTimeFromUtc } from "@/util/date-util";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
  // transformRequest: [dateTransformer].concat(
  //   axios.defaults.transformRequest || []
  // ),
});

export async function getMealPlansByClientId(
  clientId: number
): Promise<IMealPlan[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/mealPlan`, {
      params: { clientId },
    });
    const mealPlans: IMealPlan[] = response.data;

    if (mealPlans) {
      for (const mealPlan of mealPlans) {
        if (mealPlan.recipes) {
          for (const recipe of mealPlan.recipes) {
            if (recipe.timeScheduled) {
              const localTimeScheduled = await getLocalTimeFromUtc(
                recipe.timeScheduled
              );
              recipe.timeScheduled = localTimeScheduled;
            }
          }
        }
      }
    }

    return mealPlans;
  } catch (error: any) {
    console.error("Error getting meal plan:", error);
    return undefined;
  }
}

/**
 * Adds a new meal plan to the backend.
 *
 * @param meal - The IMealPlan object to be saved.
 * @returns The saved IMealPlan object, or undefined if failed.
 */
export async function addMealPlan(
  mealPlan: IMealPlan
): Promise<IMealPlan | undefined> {
  // TODO: Do the recipe add along with the meal plan add
  // if (mealPlan.recipes) {
  //   for (const recipe of mealPlan?.recipes) {
  //     if (recipe.timeScheduled) {
  //       const localTimeScheduled = await getLocalTimeFromUtc(
  //         recipe.timeScheduled
  //       );
  //       recipe.timeScheduled = localTimeScheduled;
  //     }
  //   }
  // }

  const response = await instance.post(`${DIETAPI_BASE}/mealPlan`, mealPlan);

  const addedMealPlan: IMealPlan = response.data;
  return addedMealPlan;
}

/**
 * Updates an existing meal plan in the backend.
 *
 * @param meal - The IMealPlan object to be updated.
 * @returns The updated IMealPlan object, or undefined if failed.
 */
export async function updateMealPlan(
  mealPlan: IMealPlan
): Promise<IMealPlan | undefined> {
  const response = await instance.put(`${DIETAPI_BASE}/mealPlan`, mealPlan);
  const updatedMealPlan: IMealPlan = response.data;
  return updatedMealPlan;
}

export async function deleteMealPlan(id: number) {
  return await instance.delete(`${BACKEND_URL_LIVE}/${DIETAPI_BASE}/mealPlan`, {
    params: { id: id },
  });
}
