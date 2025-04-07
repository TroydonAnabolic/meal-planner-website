import { NextRequest, NextResponse } from "next/server";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { addMealPlanRecipes } from "@/lib/server-side/recipe";

export async function POST(request: NextRequest) {
  try {
    const recipesToAdd: IRecipeInterface[] = await request.json();

    // Generate email HTML content
    const recipesAdded = await addMealPlanRecipes(recipesToAdd);

    return NextResponse.json(recipesAdded);
  } catch (error: any) {
    console.error("Error add recipes:", error);
    return NextResponse.json(
      { message: "Failed to add recipes", error: error.message },
      { status: 500 }
    );
  }
}
