// app/utils/mealPlanUtils.ts

import { Nutrients } from "@/constants/constants-enums";
import { IMealPlan, SelectionItem } from "@/models/interfaces/diet/meal-plan";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import dayjs, { Dayjs } from "dayjs";

export const generateEmptySelections = (
  startDate: Dayjs,
  endDate: Dayjs
): IMealPlan["selection"] => {
  const selections = [];
  let current = startDate.clone();

  const selection: SelectionItem = {
    sections: {
      Breakfast: {
        assigned: "",
        _links: {
          self: {
            title: "Recipe details",
            href: "",
          },
        },
      },
      Lunch: {
        assigned: "",
        _links: {
          self: {
            title: "Recipe details",
            href: "",
          },
        },
      },
      Dinner: {
        assigned: "",
        _links: {
          self: {
            title: "Recipe details",
            href: "",
          },
        },
      },
    },
  };

  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    selections.push(selection);

    current = current.add(1, "day");
  }

  return selections;
};
export function getCurrentMealPlan(
  mealPlanData: IMealPlan[],
  today: dayjs.Dayjs,
  mealPlans: IMealPlan[],
  defaultMealPlan: IMealPlan
) {
  const currentMealPlan = mealPlanData.find(
    (plan) =>
      dayjs(plan.startDate).isBefore(today) &&
      dayjs(plan.endDate).isAfter(today)
  );
  const initialMealPlan = currentMealPlan || mealPlans[0] || defaultMealPlan;
  return initialMealPlan;
}

export function getDefaultMealPlan(clientId: number): IMealPlan {
  return {
    id: 0,
    clientId: clientId || 0,
    startDate: dayjs().startOf("week").toISOString(),
    endDate: dayjs().endOf("week").toISOString(),
    selection: generateEmptySelections(
      dayjs().startOf("week"),
      dayjs().endOf("week")
    ),
    autoLogMeals: true,
  };
}

export function computeNutritionalSummary(
  meals: IMealInterface[],
  today: Date
) {
  const summary: Record<
    string,
    { total: number; consumed: number; remaining: number }
  > = {};

  // Initialize summary for each nutrient in the enum
  Object.values(Nutrients).forEach((nutrientKey) => {
    summary[nutrientKey] = { total: 0, consumed: 0, remaining: 0 };
  });

  meals.forEach((meal) => {
    const isToday = dayjs(meal.timeScheduled).isSame(today, "day");
    const isConsumedToday =
      meal.timeConsumed && dayjs(meal.timeConsumed).isSame(today, "day");

    if (isToday && meal.nutrients) {
      for (const [key, nutrient] of Object.entries(meal.nutrients)) {
        if (summary[key]) {
          summary[key].total += nutrient.quantity;
          if (isConsumedToday) {
            summary[key].consumed += nutrient.quantity;
          }
        }
      }
    }
  });

  // Calculate remaining nutrients
  Object.keys(summary).forEach((key) => {
    summary[key].remaining = summary[key].total - summary[key].consumed;
  });
  return summary;
}
