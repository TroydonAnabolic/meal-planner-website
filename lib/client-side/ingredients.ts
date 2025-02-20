import { IIngredient } from "@/models/interfaces/ingredient/ingredient";

/**
 * Fetches ingredients by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IIngredient objects or undefined.
 */
export async function fetchIngredientsByClientId(
  clientId: number
): Promise<IIngredient[] | undefined> {
  try {
    const response = await fetch(
      `/api/ingredients/fetch-ingredients?clientId=${clientId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }

    const ingredients: IIngredient[] = await response.json();

    return ingredients;
  } catch (error) {
    console.error("Error fetching ingredients by clientId:", error);
  }
}
