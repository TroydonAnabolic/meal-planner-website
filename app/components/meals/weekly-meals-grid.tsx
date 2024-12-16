// components/meal-plan/WeeklyMealsGrid.tsx

import React, { useMemo } from "react";
import { addDays, format } from "date-fns";
import { MealNumber, MealTimeRanges } from "@/constants/constants-enums";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import MealCard from "./meal-card";
import { getMealNumberFromMealTypeKey } from "@/util/mappers";
import FullCardScrollContainer from "../ui/scrolls/horizontal-card-scroll-container/card-scroll-container";
import MealsSummary from "./meals-summary";
import { MealSection } from "@/models/interfaces/client/meal-planner-preferences";

type WeeklyMealsGridProps = {
  sections?: { [key: string]: MealSection };
  weekMeals: IMealInterface[];
  startDate: Date;
  filteredMeals: IMealInterface[];
  handleViewDetails: (meal: IMealInterface) => void;
  handleImageError: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
};

const daysOfWeek: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Unscheduled",
];

const WeeklyMealsGrid: React.FC<WeeklyMealsGridProps> = ({
  sections,
  weekMeals,
  startDate,
  filteredMeals,
  handleViewDetails,
  handleImageError,
}) => {
  // dynamically set rows based on sections from meal preferences, or default to all meal numbers if no preferences set
  const rows: MealNumber[] = useMemo(() => {
    const rowsFromSections = Object.keys(sections || {});
    if (!rowsFromSections.length) {
      return Object.values(MealNumber);
    }
    return rowsFromSections as MealNumber[];
  }, [sections]);

  const datesOfWeek = useMemo(() => {
    const dates: { [day: string]: Date } = {};
    daysOfWeek.slice(0, 7).forEach((day, index) => {
      dates[day] = addDays(startDate, index);
    });
    return dates;
  }, [startDate]);

  // Organize meals by day and meal type, sorted by timeScheduled
  const mealsByDayAndMeal = useMemo(() => {
    const grouped: {
      [day: string]: { [meal in MealNumber]?: IMealInterface[] };
    } = {};

    daysOfWeek.slice(0, 7).forEach((day) => {
      grouped[day] = {
        [MealNumber.Meal1]: [],
        [MealNumber.Meal2]: [],
        [MealNumber.Meal3]: [],
        [MealNumber.Meal4]: [],
        [MealNumber.Meal5]: [],
        [MealNumber.Meal6]: [],
      };
    });

    // Sort weekMeals by timeScheduled
    const sortedMeals = [...weekMeals].sort(
      (a, b) =>
        new Date(a.timeScheduled).getTime() -
        new Date(b.timeScheduled).getTime()
    );

    sortedMeals.forEach((meal) => {
      const day =
        meal.dayOfTheWeek ||
        format(new Date(meal.timeScheduled), "EEEE") ||
        "Unscheduled";
      const mealTypeKey = meal.mealTypeKey[0];
      const mealNumber: string | undefined =
        getMealNumberFromMealTypeKey(mealTypeKey);

      if (mealNumber) {
        grouped[day][mealNumber as MealNumber]?.push(meal);
      } else {
        // grouped["Unscheduled"][MealNumber.Meal1]?.push(meal);
      }
    });

    return grouped;
  }, [weekMeals]);

  return (
    <div className="flex-1 mx-auto mb-8 p-6 sm:py-4  relative max-w-[1600px]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Meals</h2>

      {/* Summary Section */}
      <MealsSummary meals={filteredMeals} />

      <table className="pt-4 table-fixed w-full border-collapse bg-gray-50 shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left text-gray-800 ">
              Meal
            </th>
            {daysOfWeek.slice(0, 7).map((day) => {
              const date = format(datesOfWeek[day], "dd/MM/yyyy");
              return (
                <th
                  key={day}
                  scope="col"
                  className="px-4 py-2 border-b text-center text-gray-800"
                  style={{ width: "12.5%" }} // 7 columns: 100/7 ≈14.28%
                >
                  <div>
                    <span>{day}</span>
                    <br />
                    <span className="text-sm text-gray-500">{date}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((mealType) => (
            <tr key={mealType} className="h-48">
              {/* Fixed row height */}
              <td className="px-4 py-2 border-b text-sm text-gray-700">
                <div className="flex flex-col">
                  <span className="font-medium">{mealType}</span>
                  <span className="text-xs text-gray-500">
                    {MealTimeRanges[mealType]}
                  </span>
                </div>
              </td>
              {daysOfWeek.slice(0, 7).map((day) => (
                <td
                  key={day}
                  className="px-4 py-2 border-b text-sm text-gray-700"
                  style={{ width: "14.28%" }} // Consistent width
                >
                  <FullCardScrollContainer arrowSizeClass="h-5 w-5">
                    {mealsByDayAndMeal[day][mealType] &&
                    mealsByDayAndMeal[day][mealType]?.length > 0 ? (
                      mealsByDayAndMeal[day][mealType]?.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          handleImageError={handleImageError}
                          handleViewDetails={handleViewDetails}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-gray-400">No Meal</p>
                      </div>
                    )}
                  </FullCardScrollContainer>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyMealsGrid;
