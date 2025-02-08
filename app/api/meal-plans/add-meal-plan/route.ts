import { NextRequest, NextResponse } from "next/server";
import { addMealPlanMeals } from "@/lib/meal";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { addMealPlan } from "@/lib/meal-plan";

export async function POST(request: NextRequest) {
  try {
    const mealPlanToAdd: IMealPlan = await request.json();

    // Generate email HTML content
    const addedMealPlan = await addMealPlan(mealPlanToAdd);

    return NextResponse.json(addedMealPlan);
  } catch (error: any) {
    console.error("Error add recipes:", error);
    return NextResponse.json(
      { message: "Failed to add recipes", error: error.message },
      { status: 500 }
    );
  }
}
