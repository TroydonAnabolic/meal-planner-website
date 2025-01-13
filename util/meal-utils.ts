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
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { getEnumKeyByValue } from "./enum-util";

dayjs.extend(timezone);
dayjs.extend(utc);
// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);
// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

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

export function getMealTypeAndTime(
  date: Date,
  mealTypes: MealType[],
  mealTypesToGenerateFor: string[], // mealtypes/mealnumbers that will generate for client
  generatedForLunch: boolean
): { mealTypeKey: string; hasGeneratedForLunch: boolean; updatedDate: Date } {
  const time = dayjs(date); // Parse the given date using dayjs
  const hasLunchInMeals = mealTypesToGenerateFor.includes(MealNumber.Meal3);

  // Iterate through the provided meal types to determine the range of interest
  for (const mealType of mealTypes) {
    console.log(`Meal type: ${mealType}`);
    const mealTimeRanges = Object.entries(MealTimeRanges).filter(
      ([mealNumber, timeRange]) => {
        // lunch
        if (
          mealNumber === MealNumber.Meal3 &&
          mealType == MealType.lunch &&
          !generatedForLunch
        ) {
          return hasLunchInMeals && !generatedForLunch;
        } else if (
          mealNumber === MealNumber.Meal6 &&
          mealType == MealType.dinner
        ) {
          const isDinner =
            !hasLunchInMeals || (hasLunchInMeals && generatedForLunch);
          return isDinner;
        } else {
          const hasMealType = mealNumber
            .toLowerCase()
            .includes(mealType.toLowerCase());
          return hasMealType;
        }
      }
    );

    for (const [mealNumber, timeRange] of mealTimeRanges) {
      // Parse the start and end times
      const [startTime, endTime] = timeRange.split(" - ");
      const start = dayjs(startTime, "h:mm A"); // Works with the plugin
      const end = dayjs(endTime, "h:mm A");

      // Ensure that updatedDate is in local time and reflects the same hour and minute as start
      const updatedDate = dayjs(date)
        .hour(start.hour()) // Set the hour from the parsed start time
        .minute(start.minute()) // Set the minute from the parsed start time
        .second(0) // Reset the seconds
        .millisecond(0) // Reset the milliseconds
        .local() // Ensure it's in the local time zone
        .toDate(); // Convert to a Date object

      // Debug log to check the updatedDate time
      console.log("Updated Date:", updatedDate); // Check if it matches the expected local time

      // Check if it's between 12:00 PM and 2:00 PM
      const isLunch = start.isBetween(
        dayjs("12:00 PM", "h:mm A"),
        dayjs("2:00 PM", "h:mm A"),
        "minute",
        "[)"
      );

      console.log("Is Lunch:", isLunch); // This should evaluate correctly now

      switch (mealType) {
        case MealType.breakfast:
          return {
            mealTypeKey: "breakfast",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
        case MealType.lunch:
        case MealType.dinner:
          if (isLunch) {
            generatedForLunch = true;
          }
          return {
            mealTypeKey: isLunch ? "lunch" : "dinner",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
        case MealType.brunch:
          return {
            mealTypeKey: "brunch",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
        case MealType.snack:
          return {
            mealTypeKey: "snack",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
        case MealType.teatime:
          return {
            mealTypeKey: "teatime",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
        default:
          return {
            mealTypeKey: "breakfast",
            hasGeneratedForLunch: generatedForLunch,
            updatedDate: updatedDate,
          };
      }
    }
  }

  // Default to breakfast if no match is found
  return {
    mealTypeKey: "breakfast",
    hasGeneratedForLunch: generatedForLunch,
    updatedDate: dayjs(date).hour(7).minute(0).toDate(), // Default breakfast time
  };
}

export const getMealTimeRange = (
  mealTypeKey: string,
  referenceDate: Date
): [Date, Date] | null => {
  const matchedMealType = Object.keys(MealTimeRanges).find(
    (key) => key.toLowerCase() === mealTypeKey.toLowerCase()
  );
  if (!matchedMealType) return null;

  const [startTime, endTime] =
    MealTimeRanges[matchedMealType as MealNumber].split(" - ");

  const start = dayjs(referenceDate)
    .hour(dayjs(startTime, "h:mm A").hour())
    .minute(dayjs(startTime, "h:mm A").minute())
    .second(0)
    .millisecond(0)
    .toDate();

  const end = dayjs(referenceDate)
    .hour(dayjs(endTime, "h:mm A").hour())
    .minute(dayjs(endTime, "h:mm A").minute())
    .second(0)
    .millisecond(0)
    .toDate();

  return [start, end];
};

export const isTimeInRange = (
  time: Date | null,
  [start, end]: [Date, Date]
): boolean => {
  return (
    time !== null &&
    time.getTime() >= start.getTime() &&
    time.getTime() <= end.getTime()
  );
};
