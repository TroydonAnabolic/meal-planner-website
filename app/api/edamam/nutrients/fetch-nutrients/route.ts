import axios from "axios";
import {
  EDAMAM_BASE,
  EDAMAM_FOOD_DB_NUTRITION_API,
} from "@/constants/constants-urls";
import { NextRequest, NextResponse } from "next/server";
import { IFoodNutrientsRequest } from "@/models/interfaces/edamam/food/nutrients-request";

export async function POST(request: NextRequest) {
  const appId = process.env.EDAMAM_FOOD_APP_ID;
  const appKey = process.env.EDAMAM_FOOD_APP_KEY;

  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const foodNutritionRequest: IFoodNutrientsRequest = await request.json();

  try {
    const response = await axios.post(
      `${EDAMAM_BASE}${EDAMAM_FOOD_DB_NUTRITION_API}`,
      foodNutritionRequest,
      {
        params: {
          app_id: appId,
          app_key: appKey,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch nutrients" },
      { status: 500 }
    );
  }
}
