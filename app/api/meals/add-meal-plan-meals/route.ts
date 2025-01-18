import { NextRequest, NextResponse } from "next/server";
import { addMealPlanMeals } from "@/lib/meal";
import { IMealInterface } from "@/models/interfaces/meal/Meal";

export async function POST(request: NextRequest) {
  try {
    const mealsToAdd: IMealInterface[] = await request.json();

    // Generate email HTML content
    const mealsAdded = await addMealPlanMeals(mealsToAdd);

    return NextResponse.json(mealsAdded);
  } catch (error: any) {
    console.error("Error add recipes:", error);
    return NextResponse.json(
      { message: "Failed to add recipes", error: error.message },
      { status: 500 }
    );
  }
}
