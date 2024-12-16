// File: route.ts

import axios from "@/axiosConfig";
import { EDAMAM_BASE, EDAMAM_RECIPE_API } from "@/constants/constants-urls";
import { IRecipeResponse } from "@/models/interfaces/edamam/recipe/recipe-response";
import { IRecipeRequest } from "@/models/interfaces/recipe/recipes-request";
import { parseQueryParams } from "@/util/edamam-util";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryParametersStr = searchParams.toString(); // Get the full query string

  if (!queryParametersStr) {
    return NextResponse.json(
      { message: "Missing query parameters" },
      { status: 400 }
    );
  }

  const appId = process.env.EDAMAM_RECIPE_APP_ID;
  const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

  const queryParams: IRecipeRequest = {
    ...parseQueryParams(queryParametersStr),
    app_id: appId || "", // Provide default empty string if undefined
    app_key: appKey || "",
    type: "public",
  };

  try {
    const response: IRecipeResponse = await axios.get(
      `${EDAMAM_BASE}${EDAMAM_RECIPE_API}`,
      {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe", error);
    return NextResponse.json(
      { message: "Error fetching recipe" },
      { status: 500 }
    );
  }
}
