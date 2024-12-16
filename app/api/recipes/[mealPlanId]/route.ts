// app/api/recipes/[mealPlanId]/route.ts

import { getRecipesByMealPlanId } from "@/lib/recipe";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { mealPlanId: string } }
) {
  const { mealPlanId } = params;
  try {
    const recipes = await getRecipesByMealPlanId(Number(mealPlanId));
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes." },
      { status: 500 }
    );
  }
}
