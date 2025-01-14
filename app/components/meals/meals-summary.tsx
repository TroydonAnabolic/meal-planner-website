// components/meal-plan/MealsSummary.tsx

import React from "react";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { Nutrients } from "@/constants/constants-enums";

type MealsSummaryProps = {
  meals: IMealInterface[];
};

// TODO: Update TOTAL LOGIC Display total calories and remaining calories (look into summing meals.timeConsumed for consumed today and summing meals.timeScheduled for today for total calories, get the difference of both for remaining, do it for all macros.

const MealsSummary: React.FC<MealsSummaryProps> = ({ meals }) => {
  const totalMeals = meals.length;

  const totalMacros = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.nutrients?.[Nutrients.ENERC_KCAL]?.quantity || 0;
      acc.protein += meal.nutrients?.[Nutrients.PROCNT]?.quantity || 0;
      acc.carbs += meal.nutrients?.[Nutrients.CHOCDF]?.quantity || 0;
      acc.fat += meal.nutrients?.[Nutrients.FAT]?.quantity || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const formatNumber = (num: number) => num.toFixed(1);

  return (
    <div className="p-4 bg-gray-800 rounded-tl-md rounded-tr-md text-white flex justify-between">
      <div>
        Total Meals: <span className="font-semibold">{totalMeals}</span>
      </div>
      <div className="flex space-x-4">
        <div>
          Calories:{" "}
          <span className="font-semibold">
            {formatNumber(totalMacros.calories)}
          </span>
        </div>
        <div>
          Protein:{" "}
          <span className="font-semibold">
            {formatNumber(totalMacros.protein)}g
          </span>
        </div>
        <div>
          Carbs:{" "}
          <span className="font-semibold">
            {formatNumber(totalMacros.carbs)}g
          </span>
        </div>
        <div>
          Fat:{" "}
          <span className="font-semibold">
            {formatNumber(totalMacros.fat)}g
          </span>
        </div>
      </div>
    </div>
  );
};

export default MealsSummary;
