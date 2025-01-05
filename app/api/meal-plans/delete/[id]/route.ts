// app/api/recipes/[mealPlanId]/route.ts

import { deleteMealPlan } from "@/lib/meal-plan";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { mealPlanId: string } }
) {
  const { mealPlanId } = params;

  if (!mealPlanId || isNaN(Number(mealPlanId))) {
    return NextResponse.json(
      { error: "Invalid meal plan ID." },
      { status: 400 }
    );
  }

  try {
    const id = Number(mealPlanId);
    await deleteMealPlan(id);

    return NextResponse.json(
      { message: `Meal plan with ID ${mealPlanId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes." },
      { status: 500 }
    );
  }
}
