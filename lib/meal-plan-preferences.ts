import axios from "@/axiosConfig";
import {
  ACCOUNTAPI_BASE,
  APIM_HEADERS,
  BACKEND_URL_LIVE,
} from "@/constants/constants-urls";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  //timeout: 1000,
  headers: APIM_HEADERS,
});

export async function getMealPreferences(
  clientId: string
): Promise<IMealPlanPreferences> {
  const response = await instance.get(
    `${ACCOUNTAPI_BASE}/client/mealpreferences`,
    {
      params: { clientId: clientId },
    }
  );

  const mealPlanPreferences: IMealPlanPreferences = response.data;
  return mealPlanPreferences;
}

export async function storeMealPreferences(
  mealPlanPreferences: IMealPlanPreferences
): Promise<IMealPlanPreferences> {
  try {
    const response = await instance.post(
      `${ACCOUNTAPI_BASE}/client/mealpreferences`,
      mealPlanPreferences
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating meal preferences:", error);
    throw error;
  }
}

export async function updateMealPreferences(
  mealPlanPreferences: IMealPlanPreferences
): Promise<IMealPlanPreferences> {
  try {
    const response = await instance.put(
      `${ACCOUNTAPI_BASE}/client/mealpreferences`,
      mealPlanPreferences
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating meal preferences:", error);
    throw error;
  }
}
