import axios from "@/axiosConfig";
import { ACCOUNTAPI_BASE, BACKEND_URL_LIVE } from "@/constants/constants-urls";
import { IClientInterface } from "@/models/interfaces/client/client";
import { constructClientObjectFromResponse } from "@/util/client-util";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userID = searchParams.get("userID");

  if (!userID) {
    return NextResponse.json({ message: "Missing userID" }, { status: 400 });
  }

  const opimSubScriptionKey = process.env.OPIM_SUBSCRIPTION_KEY;
  const headers = {
    "Ocp-Apim-Subscription-Key": opimSubScriptionKey,
    "Ocp-Apim-Trace": "true",
    Connection: "keep-alive",
  };
  const instance = axios.create({
    baseURL: BACKEND_URL_LIVE,
    headers: headers,
  });

  try {
    const response = await instance.get(`${ACCOUNTAPI_BASE}/clients/v2`, {
      params: { userID: userID },
    });

    const clientObj: IClientInterface =
      constructClientObjectFromResponse(response);

    return NextResponse.json(clientObj, { status: 200 });
  } catch (error) {
    console.error("Error fetching client", error);
    return NextResponse.json(
      { message: "Error fetching client" },
      { status: 500 }
    );
  }
}
