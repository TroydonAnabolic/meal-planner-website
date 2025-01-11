// app/api/recipes/[mealPlanId]/route.ts

import axios from "@/axiosConfig";
import {
  BACKEND_URL_LIVE,
  APIM_HEADERS,
  DIETAPI_BASE,
} from "@/constants/constants-urls";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { NextResponse } from "next/server";

const instance = axios.create({
  baseURL: BACKEND_URL_LIVE,
  headers: APIM_HEADERS,
});

export async function GET(request: Request) {
  const { clientId } = await request.json();

  if (!clientId) {
    return NextResponse.json({ message: "Missing clientId" }, { status: 400 });
  }

  try {
    const response = await instance.get(`${DIETAPI_BASE}/recipes/myrecipes`, {
      params: { clientId: clientId },
    });
    // Assuming your API response matches the Recipe interface
    const recipes: IRecipeInterface[] = response.data;
    // assign recipe.totalNutrients, recipe.totalDaily, to recipe.baseTotalNutrients, recipe.baseTotalDaily
    recipes.forEach((recipe) => {
      recipe.baseTotalNutrients = recipe.totalNutrients;
      recipe.baseTotalDaily = recipe.totalDaily;
      recipe.baseTotalWeight = recipe.totalWeight;
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes." },
      { status: 500 }
    );
  }
}
