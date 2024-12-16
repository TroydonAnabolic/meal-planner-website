import { IMealPlannerResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import {
  EDAMAM_BASE,
  EDAMAM_MEALPLANNER_API,
} from "@/constants/constants-urls";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import { NextRequest, NextResponse } from "next/server";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { AxiosRequestConfig } from "axios";
import { exponentialBackoffAxios } from "@/lib/http/exponential-back-off-axios";

export async function POST(req: NextRequest) {
  const appId = process.env.EDAMAM_MEAL_PLANNER_APP_ID;
  const appKey = process.env.EDAMAM_MEAL_PLANNER_APP_KEY;
  const edamamAccountUser = process.env.EDAMAM_ACCOUNT_USER;

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body: IMealPlanPreferences = await req.json();

  // Destructure to remove any unwanted properties if present
  const { size, plan } = body;

  // Create the final request body adhering to IMealPlannerRequest
  const requestBody: IMealPlannerRequest = {
    size,
    plan: plan,
  };

  const token = Buffer.from(`${appId}:${appKey}`).toString("base64");
  const authHeader = `Basic ${token}`;

  const axiosConfig: AxiosRequestConfig = {
    url: `${EDAMAM_BASE}${EDAMAM_MEALPLANNER_API}/${appId}/select`,
    method: "POST",
    data: requestBody,
    headers: {
      Authorization: authHeader,
      "Edamam-Account-User": edamamAccountUser,
    },
  };

  try {
    const response = await exponentialBackoffAxios<IMealPlannerResponse>(
      axiosConfig
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.log("Error generating meal plans", error.message);
    return NextResponse.json(
      { error: "Failed to generate meal plans" },
      { status: 500 }
    );
  }
}
