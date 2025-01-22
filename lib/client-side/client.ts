import {
  ACCOUNTAPI_BASE,
  APIM_HEADERS_PUBLIC,
  BACKEND_URL_LIVE,
} from "@/constants/constants-urls";
import { IClientInterface } from "@/models/interfaces/client/client";
import { constructClientObjectFromResponse } from "@/util/client-util";
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
export async function fetchClientByUserId(
  clientId: number
): Promise<IClientInterface | undefined> {
  try {
    const response = await fetch(
      `/api/client/get-client?clientId=${clientId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch client");
    }

    const client: IClientInterface = await response.json();

    return client;
  } catch (error) {
    console.error("Error fetching client by user id:", error);
  }
}

/**
 * Saves client to the database.
 *
 * @param clientToAdd - The client object.
 * @returns An array of IRecipeInterface objects or undefined.
 */
export async function saveClient(
  clientToAdd: IClientInterface
): Promise<IClientInterface | undefined> {
  try {
    const response = await fetch(`/api/client/save-client`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientToAdd), // Send data in the body
    });

    if (!response.ok) {
      throw new Error("Failed to store client");
    }

    const client: IClientInterface = await response.json();

    if (!client) {
      throw new Error("Failed to store client");
    }

    return client;
  } catch (error) {
    console.error("Error storing client:", error);
  }
}

export async function getClientUnsafe(userID: string) {
  const response = await instance.get(`${ACCOUNTAPI_BASE}/clients/v2`, {
    params: { userID: userID },
  });

  const clientObj: IClientInterface =
    constructClientObjectFromResponse(response);
  return clientObj;
}

export async function updateClientUnsafe(clientData: IClientInterface) {
  try {
    const response = await instance.put(
      `${ACCOUNTAPI_BASE}/clients`,
      clientData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating client data:", error);
    throw error;
  }
}

export async function deleteClientUnsafe(userID: string) {
  try {
    const response = await instance.delete(`${ACCOUNTAPI_BASE}/clients`, {
      params: { userID: userID },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting client data:", error);
    throw error;
  }
}
