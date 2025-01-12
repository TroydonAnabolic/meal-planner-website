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

export function getMealTypeByTime(date: Date, mealTypes: MealType[]): MealType {
  const time = dayjs(date); // Parse the given date using dayjs

  // Map meal types to their corresponding meal ranges
  for (const mealType of mealTypes) {
    const mealNumbers = Object.entries(MealTimeRanges).filter(
      ([mealNumber, _]) =>
        mealNumber.toLowerCase().includes(mealType.toLowerCase())
    );

    for (const [mealNumber, timeRange] of mealNumbers) {
      const [startTime, endTime] = timeRange.split(" - ");
      const start = dayjs(startTime, "h:mm A");
      const end = dayjs(endTime, "h:mm A");

      // Check if the time falls between the start and end times of the range
      if (time.isBetween(start, end, "minute", "[)")) {
        // Handle lunch and dinner ambiguity
        if (mealType === MealType.lunch || mealType === MealType.dinner) {
          const isLunch = time.isBefore(dayjs("6:00 PM", "h:mm A"));
          return isLunch ? MealType.lunch : MealType.dinner;
        }

        return mealType;
      }
    }
  }

  // Default to "breakfast" if no match
  return MealType.breakfast;
}
