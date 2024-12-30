import { exponentialBackoffFetch } from "@/lib/http/exponential-back-off";
import { IRecipeHit } from "@/models/interfaces/recipe/recipe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const recipeURI = searchParams.get("uri");

  if (!recipeURI) {
    return NextResponse.json(
      { message: "Missing recipe URI" },
      { status: 400 }
    );
  }

  const appId = process.env.EDAMAM_RECIPE_APP_ID;
  const appKey = process.env.EDAMAM_RECIPE_APP_KEY;

  try {
    const response = await exponentialBackoffFetch(() =>
      fetch(`${recipeURI}?app_id=${appId}&app_key=${appKey}`, {
        method: "GET",
      })
    );
    const recipeResponse: IRecipeHit = await response.json();

    return NextResponse.json(recipeResponse, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe", error);
    return NextResponse.json(
      { message: "Error fetching recipe" },
      { status: 500 }
    );
  }
}
