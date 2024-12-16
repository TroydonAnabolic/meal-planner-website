import {
  ACCOUNTAPI_BASE,
  APIM_HEADERS,
  BACKEND_URL_LIVE,
} from "@/constants/constants-urls";
import { IClientInterface } from "@/models/interfaces/client/client";
import { constructClientObjectFromResponse } from "@/util/client-util";
import axios from "axios";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
});

export async function getClientUnsafe(userID: string) {
  const response = await instance.get(`${ACCOUNTAPI_BASE}/clients/v2`, {
    params: { userID: userID },
  });

  const clientObj: IClientInterface =
    constructClientObjectFromResponse(response);
  return clientObj;
}
