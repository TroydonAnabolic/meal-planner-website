import axios from "@/axiosConfig";
import {
  EDAMAM_BASE,
  EDAMAM_MEALPLANNER_API,
} from "@/constants/constants-urls";
import { NextRequest, NextResponse } from "next/server";
import { ShoppingListRequest } from "@/models/interfaces/edamam/meal-planner/shopping-list-request";
import { IShoppingListResponse } from "@/models/interfaces/edamam/meal-planner/shopping-list-response";
import { AxiosRequestConfig } from "axios";
import { exponentialBackoffAxios } from "@/lib/http/exponential-back-off-axios";
import { exponentialBackoffFetch } from "@/lib/http/exponential-back-off";

export async function POST(req: NextRequest) {
  const appId = process.env.EDAMAM_MEAL_PLANNER_APP_ID;
  const appKey = process.env.EDAMAM_MEAL_PLANNER_APP_KEY;
  const edamamAccountUser = process.env.EDAMAM_ACCOUNT_USER;

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const shoppingListRequest: ShoppingListRequest = await req.json();
  const token = Buffer.from(`${appId}:${appKey}`).toString("base64");
  const authHeader = `Basic ${token}`;

  const url = `${EDAMAM_BASE}${EDAMAM_MEALPLANNER_API}/${appId}/shopping-list`;
  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
    "Edamam-Account-User": edamamAccountUser,
  };
  const body = JSON.stringify(shoppingListRequest);

  try {
    const response = await exponentialBackoffFetch(() =>
      fetch(url, {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          "Edamam-Account-User": edamamAccountUser || "",
        },
        method: "POST",
        body: body,
      })
    );
    const shoppingListResponse: IShoppingListResponse = await response.json();
    return NextResponse.json(shoppingListResponse, { status: 200 });
  } catch (error: any) {
    console.log(
      "Error generating shopping list",
      error.response.data.errors.forEach((error: any) => {
        console.log("error " + error.error + " message " + error.message);
      })
    );
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
