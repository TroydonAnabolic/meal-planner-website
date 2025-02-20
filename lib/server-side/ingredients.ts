import {
  APIM_HEADERS,
  BACKEND_URL_LIVE,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";
import axios from "axios";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
});

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function getIngredientsByClientId(
  clientId: number
): Promise<IIngredient[] | undefined> {
  try {
    const response = await instance.get(`${DIETAPI_BASE}/ingredients`, {
      params: { clientId: clientId },
    });
    const ingredients: IIngredient[] = response.data;
    return ingredients;
  } catch (error) {
    console.error("Error fetching recipes by clientId:", error);
  }
}

/**
 * Adds a new ingredient to the backend.
 *
 * @param ingredient - The IIngredientInterface object to be saved.
 * @returns The saved IIngredientInterface object, or undefined if failed.
 */
export async function addIngredient(
  ingredient: IIngredient
): Promise<IIngredient | undefined> {
  try {
    const response = await instance.post(
      `${DIETAPI_BASE}/ingredients`,
      ingredient
    );

    const addedIngredient: IIngredient = response.data;

    return addedIngredient;
  } catch (error: any) {
    console.error("Error adding ingredients by clientId:", error.message);
  }
}

export async function updateIngredient(ingredient: IIngredient) {
try {
    const response = await instance.put(
      `${BACKEND_URL_LIVE}/${DIETAPI_BASE}/ingredients`,
      ingredient
    );
    const updatedIngredient: IIngredient = response.data;
  
    return updatedIngredient;
} catch (error: any) {
  console.error("Error updating ingredients by clientId:", error.message);
}
}

export async function deleteIngredient(id: number) {
try {
    return await instance.delete(
      `${BACKEND_URL_LIVE}/${DIETAPI_BASE}/ingredients`,
      {
        params: { id: id },
      }
    );
} catch (error: any) {
  console.error("Error deleting ingredients by clientId:", error.message);
}
}
