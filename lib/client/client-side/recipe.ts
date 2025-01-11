import {
  BACKEND_URL_LIVE,
  APIM_HEADERS_PUBLIC,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import axios from "axios";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS_PUBLIC,
});

/**
 * Fetches recipes by client ID.
 *
 * @param clientId - The ID of the client.
 * @returns An array of IRecipeInterface objects or undefined.
 */
// export async function fetchRecipesByClientId(
//   clientId: number
// ): Promise<IRecipeInterface[] | undefined> {
//   try {
//     const recipes = await fetch(
//       `/api/recipes/fetch-recipes?clientId=${clientId}`,
//       {
//         method: "GET",
//       }
//     );

//     if (!presignedURLResponse.ok) {
//       throw new Error("Failed to get pre-signed URL");
//     }

//     const { signedUrl, objectUrl } = await presignedURLResponse.json();

//     return recipes;
//   } catch (error) {
//     console.error("Error fetching recipes by clientId:", error);
//   }
// }
