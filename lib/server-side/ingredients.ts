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
