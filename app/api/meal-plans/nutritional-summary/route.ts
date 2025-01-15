import { computeNutritionalSummary } from "@/util/meal-plan-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { selectedMealPlan, date } = await req.json();
    const today = new Date(date);
    const meals = selectedMealPlan.meals || [];

    const summary = computeNutritionalSummary(meals, today);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute nutritional summary" },
      { status: 500 }
    );
  }
}
