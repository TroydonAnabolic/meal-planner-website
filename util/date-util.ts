import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin

export function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
}

// Convert a UTC date string to the user's local time zone
export function getLocalTimeFromUtc(utcDate: string | Date): Date {
  const userTimezone = dayjs.tz.guess(); // Detect user's timezone
  return dayjs.utc(utcDate).tz(userTimezone).toDate();
}

// Convert a local date to UTC for backend processing
export function getUtcTimeFromLocal(
  localDate: string | Date | undefined
): string | undefined {
  if (!localDate || isNaN(new Date(localDate).getTime())) {
    // Return undefined if the date is invalid or undefined
    return undefined;
  }
  return dayjs(localDate).utc().toISOString();
}

export const parseDate = (
  dateString: string,
  format: string = "DD/MM/YYYY"
) => {
  const parsedDate = dayjs(dateString, format);
  return parsedDate.isValid() ? parsedDate.toDate() : undefined;
};

export const formatDate = (date: string | Date | null) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().substring(0, 10);
};

export const formatDateTimeLocal = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// util/dateUtils.ts

import { DayOfTheWeek } from "@/constants/constants-enums";
import dayjs from "dayjs";

export const getDayOfWeek = (date: Date): DayOfTheWeek => {
  const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  switch (dayIndex) {
    case 0:
      return DayOfTheWeek.Sunday;
    case 1:
      return DayOfTheWeek.Monday;
    case 2:
      return DayOfTheWeek.Tuesday;
    case 3:
      return DayOfTheWeek.Wednesday;
    case 4:
      return DayOfTheWeek.Thursday;
    case 5:
      return DayOfTheWeek.Friday;
    case 6:
      return DayOfTheWeek.Saturday;
    default:
      return DayOfTheWeek.Sunday; // Fallback
  }
};
