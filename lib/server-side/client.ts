import axios from "@/axiosConfig";
import {
  ACCOUNTAPI_BASE,
  APIM_HEADERS,
  BACKEND_URL_LIVE,
} from "@/constants/constants-urls";
import { IClientInterface } from "@/models/interfaces/client/client";
import { constructClientObjectFromResponse } from "@/util/client-util";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: {
    ...APIM_HEADERS,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function getClientById(clientId: number) {
  const response = await instance.get(`${ACCOUNTAPI_BASE}/clients`, {
    params: { id: clientId },
  });

  const clientObj: IClientInterface =
    constructClientObjectFromResponse(response);
  return clientObj;
}

export async function getClient(userID: string) {
  const response = await instance.get(`${ACCOUNTAPI_BASE}/clients/v2`, {
    params: { userID: userID },
  });

  const clientObj: IClientInterface =
    constructClientObjectFromResponse(response);
  return clientObj;
}

export async function storeClient(clientData: IClientInterface) {
  const response = await instance.post(
    `${ACCOUNTAPI_BASE}/clients`,
    clientData
  );

  const id = response.data.id;
  return id;
}

export async function updateClient(clientData: IClientInterface) {
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

export async function deleteClient(userID: string) {
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
