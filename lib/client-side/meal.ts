import { IMealInterface } from "@/models/interfaces/meal/Meal";

export async function storeMealPlanMeals(
  mealsToAdd: IMealInterface[]
): Promise<IMealInterface[] | undefined> {
  try {
    const response = await fetch(`/api/meals/add-meal-plan-meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealsToAdd), // Send data in the body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    const meals: IMealInterface[] = await response.json();

    return meals;
  } catch (error) {
    console.error("Error storing meals:", error);
  }
}
