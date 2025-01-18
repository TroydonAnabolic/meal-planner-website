import {
  IFoodNutrients,
  IFoodNutrientsResponse,
} from "@/models/interfaces/edamam/food/nutrients-response";
import { fetchNutrients } from "./client-side/edamam";
import {
  IFoodIngredient,
  IFoodNutrientsRequest,
} from "@/models/interfaces/edamam/food/nutrients-request";

/**
 * Updates the total nutrients based on the operation.
 * @param ingredient The ingredient to update nutrients for.
 * @param operation "add" or "remove".
 */
export const getAllFoodNutrition = async (
  foodIngredient: IFoodIngredient
): Promise<IFoodNutrients | undefined> => {
  const request: IFoodNutrientsRequest = {
    ingredients: [foodIngredient],
  };

  try {
    const response: IFoodNutrients = await fetchNutrients(request);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("Failed to update nutrients:", error);
  }
};
