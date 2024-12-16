// utils/mealUtils.ts

import { addDays, startOfWeek, endOfWeek } from "date-fns";
import { IMealInterface } from "@/models/interfaces/meal/Meal";

export const groupMealsByWeek = (
  meals: IMealInterface[],
  startDate: Date,
  endDate: Date
): IMealInterface[][] => {
  const weeks: IMealInterface[][] = [];
  let currentStart = startOfWeek(startDate, { weekStartsOn: 0 }); // Sunday
  let currentEnd = endOfWeek(currentStart, { weekStartsOn: 0 }); // Saturday

  while (currentStart <= endDate) {
    const weekMeals = meals.filter((meal) => {
      if (!meal.timeScheduled) return false;
      const mealDate = new Date(meal.timeScheduled);
      return mealDate >= currentStart && mealDate <= currentEnd;
    });
    weeks.push(weekMeals);
    currentStart = addDays(currentEnd, 1);
    currentEnd = endOfWeek(currentStart, { weekStartsOn: 0 });
  }

  return weeks;
};
