import { NextRequest, NextResponse } from "next/server";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { updateMealPlan } from "@/lib/meal-plan";

export async function PUT(request: NextRequest) {
  try {
    const mealPlanToUpdate: IMealPlan = await request.json();

    // Generate email HTML content
    const updatedMealPlan = await updateMealPlan(mealPlanToUpdate);

    return NextResponse.json(updatedMealPlan);
  } catch (error: any) {
    console.error("Error add recipes:", error);
    return NextResponse.json(
      { message: "Failed to add recipes", error: error.message },
      { status: 500 }
    );
  }
}
