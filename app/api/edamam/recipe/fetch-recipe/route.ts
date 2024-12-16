import axios from "@/axiosConfig";
import { EDAMAM_BASE, EDAMAM_RECIPE_API } from "@/constants/constants-urls";
import { exponentialBackoffFetch } from "@/lib/http/exponential-back-off";
import { exponentialBackoffAxios } from "@/lib/http/exponential-back-off-axios";
import {
  IRecipeResponse,
  IRecipeResponseData,
} from "@/models/interfaces/edamam/recipe/recipe-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { message: "Missing query search word" },
      { status: 400 }
    );
  }

  const appId = process.env.EDAMAM_RECIPE_APP_ID;
  const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

  const url = `${EDAMAM_BASE}${EDAMAM_RECIPE_API}`;

  const params = new URLSearchParams({
    q: query,
    type: "public",
    app_id: appId || "",
    app_key: appKey || "",
    to: "20", // Number of recipes to fetch
  });

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // You can add other options like credentials, mode, etc., if needed
  };

  try {
    const response = await exponentialBackoffFetch(
      () => fetch(`${url}?${params.toString()}`, fetchOptions),
      5, // maxRetries
      500 // initialDelay in ms
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edamam API Error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: "Failed to fetch recipes from Edamam API." },
        { status: response.status }
      );
    }

    const data: IRecipeResponseData = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe", error);
    return NextResponse.json(
      { message: "Error fetching recipe" },
      { status: 500 }
    );
  }
}
