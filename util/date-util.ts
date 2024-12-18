// utils/date.ts

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
