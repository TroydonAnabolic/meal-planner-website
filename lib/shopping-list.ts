import {
  BACKEND_URL_LIVE,
  APIM_HEADERS,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import {
  IShoppingListResponse,
  IShoppingListResult,
} from "@/models/interfaces/edamam/meal-planner/shopping-list-response";
import axios from "axios";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
  // transformRequest: [dateTransformer].concat(
  //   axios.defaults.transformRequest || []
  // ),
});

/**
 * Adds a new meal plan to the backend.
 *
 * @param meal - The IMealPlan object to be saved.
 * @returns The saved IMealPlan object, or undefined if failed.
 */
export async function addShoppingList(
  shoppingList: IShoppingListResult
): Promise<IShoppingListResponse | undefined> {
  try {
    const response = await instance.post(
      `${DIETAPI_BASE}/mealPlan`,
      shoppingList
    );
    const addedShoppingList: IShoppingListResponse = response.data;
    return addedShoppingList;
  } catch (error: any) {
    console.error("Error adding meal:", error);
    return undefined;
  }
}
