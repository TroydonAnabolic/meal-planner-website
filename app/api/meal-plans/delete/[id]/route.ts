// app/api/recipes/[mealPlanId]/route.ts

import { deleteMealPlan } from "@/lib/meal-plan";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid meal plan ID." },
      { status: 400 }
    );
  }

  try {
    const mealPlanId = Number(id);
    await deleteMealPlan(mealPlanId);

    return NextResponse.json(
      { message: `Meal plan with ID ${id} deleted successfully.` },
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
