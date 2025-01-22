// lib/meal.ts

import {
  APIM_HEADERS,
  BACKEND_URL_LIVE,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import axios from "@/axiosConfig";
import { getLocalTimeFromUtc, getUtcTimeFromLocal } from "@/util/date-util";
import { IMealInterface } from "@/models/interfaces/meal/Meal";

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
 * Fetches meals by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IMealInterface objects or undefined.
 */
// lib/meal.ts

export async function getMealsByClientId(
  clientId: number
): Promise<IMealInterface[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/meals/mymeals`, {
      params: { clientId },
    });
    const meals: IMealInterface[] = [];

    for (const meal of response.data as IMealInterface[]) {
      if (meal.timeScheduled) {
        const mealScheduleTimeLocal = getLocalTimeFromUtc(meal.timeScheduled);
        meal.timeScheduled = mealScheduleTimeLocal;
      }
      if (meal.timeConsumed) {
        const mealConsumedTimeLocal = getLocalTimeFromUtc(meal.timeConsumed);
        meal.timeConsumed = new Date(mealConsumedTimeLocal);
      }
      meals.push(meal);
    }

    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return undefined;
  }
}

/**
 * Fetches meals by client ID.
 *
 * @param mealPlanId - The ID of the client.
 * @returns An array of IMealInterface objects or undefined.
 */
// lib/meal.ts

export async function getMealsByMealPlanId(
  mealPlanId: number
): Promise<IMealInterface[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/meals/mealPlan`, {
      params: { mealPlanId },
    });
    const meals: IMealInterface[] = [];

    for (const meal of response.data as IMealInterface[]) {
      if (meal.timeScheduled) {
        const mealScheduleTimeLocal = getLocalTimeFromUtc(meal.timeScheduled);
        meal.timeScheduled = mealScheduleTimeLocal;
        if (meal.timeConsumed) {
          const mealConsumedTimeLocal = getLocalTimeFromUtc(meal.timeConsumed);
          meal.timeConsumed = new Date(mealConsumedTimeLocal);
        }
      }
    }

    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return undefined;
  }
}

/**
 * Adds a new meal to the backend.
 *
 * @param meal - The IMealInterface object to be saved.
 * @returns The saved IMealInterface object, or undefined if failed.
 */
export async function addMeal(
  meal: IMealInterface
): Promise<IMealInterface | undefined> {
  try {
    if (meal.timeScheduled) {
      const timeScheduledUtcTime = getUtcTimeFromLocal(meal.timeScheduled); // Await if async
      meal.timeScheduled = new Date(timeScheduledUtcTime!);
    }

    if (meal.timeConsumed) {
      const timeConsumedUtcTime = getUtcTimeFromLocal(meal.timeConsumed); // Await if async
      meal.timeConsumed = new Date(timeConsumedUtcTime!);
    }

    const response = await instance.post(`${DIETAPI_BASE}/meals`, meal);
    const addedMeal: IMealInterface = response.data;
    return addedMeal;
  } catch (error: any) {
    console.error("Error adding meal:", error);
    return undefined;
  }
}

/**
 * Adds a array of meals to the backend.
 *
 * @param meal - The IMealInterface object to be saved.
 * @returns The saved IMealInterface object, or undefined if failed.
 */
export async function addMealPlanMeals(
  meals: IMealInterface[]
): Promise<IMealInterface | undefined> {
  for (const meal of meals) {
    if (meal.timeScheduled) {
      const timeScheduledUtcTime = getUtcTimeFromLocal(meal.timeScheduled); // Await if async
      meal.timeScheduled = new Date(timeScheduledUtcTime!);
    }
    if (meal.timeConsumed) {
      const timeConsumedUtcTime = getUtcTimeFromLocal(meal.timeConsumed); // Await if async
      meal.timeConsumed = new Date(timeConsumedUtcTime!);
    }
  }
  const response = await instance.post(`${DIETAPI_BASE}/meals/mealPlan`, meals);
  return response.data;
}

/**
 * Adds a array of meals to the backend.
 *
 * @param meal - The IMealInterface object to be saved.
 * @returns The saved IMealInterface object, or undefined if failed.
 */
export async function updateMealPlanMeals(
  meals: IMealInterface[]
): Promise<IMealInterface | undefined> {
  for (const meal of meals) {
    if (meal.timeScheduled) {
      const utcTime = getUtcTimeFromLocal(meal.timeScheduled); // Await if async
      meal.timeScheduled = new Date(utcTime!);
    }
    if (meal.timeConsumed) {
      const timeConsumedUtcTime = getUtcTimeFromLocal(meal.timeConsumed); // Await if async
      meal.timeConsumed = new Date(timeConsumedUtcTime!);
    }
  }
  const response = await instance.put(`${DIETAPI_BASE}/meals/mealPlan`, meals);
  return response.data;
}

/**
 * Updates an existing meal in the backend.
 *
 * @param meal - The IMealInterface object with updated data.
 * @returns The updated IMealInterface object, or undefined if failed.
 */
export async function updateMeal(
  meal: IMealInterface
): Promise<IMealInterface | undefined> {
  try {
    if (meal.timeScheduled) {
      const utcTime = await getUtcTimeFromLocal(meal.timeScheduled); // Await if async
      meal.timeScheduled = new Date(utcTime!);
    }
    if (meal.timeConsumed) {
      const timeConsumedUtcTime = await getUtcTimeFromLocal(meal.timeConsumed); // Await if async
      meal.timeConsumed = new Date(timeConsumedUtcTime!);
    }

    const response = await instance.put(`${DIETAPI_BASE}/meals`, meal);
    const updatedMeal: IMealInterface = response.data;
    return updatedMeal;
  } catch (error: any) {
    console.error("Error updating meal:", error);
    return undefined;
  }
}

/**
 * Deletes a meal from the backend.
 *
 * @param id - The ID of the meal to be deleted.
 * @returns The deletion result or undefined if failed.
 */
export async function deleteMeal(id: number) {
  try {
    const response = await instance.delete(
      `${BACKEND_URL_LIVE}/${DIETAPI_BASE}/meals`,
      {
        params: { id: id },
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting meal:", error);
    return undefined;
  }
}
