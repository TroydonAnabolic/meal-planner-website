import axios from "@/axiosConfig";
import {
  EDAMAM_BASE,
  EDAMAM_FOOD_DB_PARSER_API,
} from "@/constants/constants-urls";
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

  const appId = process.env.EDAMAM_FOOD_APP_ID;
  const appKey = process.env.EDAMAM_FOOD_APP_KEY;

  try {
    const response = await axios.get(
      `${EDAMAM_BASE}${EDAMAM_FOOD_DB_PARSER_API}`,
      {
        params: {
          app_id: appId,
          app_key: appKey,
          ingr: query,
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
