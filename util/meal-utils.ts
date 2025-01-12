// utils/mealUtils.ts

import { addDays, startOfWeek, endOfWeek } from "date-fns";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import {
  MealNumber,
  MealTimeRanges,
  MealType,
} from "@/constants/constants-enums";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

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

export function getMealTypeByTime(date: Date): MealType {
  const time = dayjs(date).format("h:mm A"); // Format time for easy comparison

  for (const [mealType, timeRange] of Object.entries(MealTimeRanges)) {
    const [startTime, endTime] = timeRange.split(" - ");
    const start = dayjs(startTime, "h:mm A");
    const end = dayjs(endTime, "h:mm A");

    // Check if the current time falls between the start and end times of the range
    if (dayjs(time, "h:mm A").isBetween(start, end, null, "[)")) {
      // Special handling for lunch/dinner which maps to two values
      if (mealType === MealType.lunch) {
        return time >= "6:00 PM" ? MealType.dinner : MealType.lunch; // Adjust based on time of day
      }
      return mealType as MealType;
    }
  }
  return MealType.breakfast;
}
