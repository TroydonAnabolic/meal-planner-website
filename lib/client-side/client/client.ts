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
