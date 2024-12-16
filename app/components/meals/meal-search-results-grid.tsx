// components/ui/MealSearchResultsGrid.tsx

import React from "react";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type MealSearchResultsGridProps = {
  meals: IMealInterface[];
  onViewDetails: (meal: IMealInterface) => void;
};

const MealSearchResultsGrid: React.FC<MealSearchResultsGridProps> = ({
  meals,
  onViewDetails,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {meals.map((meal) => (
        <div
          key={meal.foodSourceUrl} // Assuming URI is unique
          className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {/* Meal Image */}
          <div className="h-48 w-full bg-gray-200 relative">
            <Image
              src={meal.image || ""}
              alt={meal.name}
              fill
              sizes="100%"
              // layout="fill"
              // objectFit="cover"
              className="object-cover object-center"
            />
          </div>

          {/* Meal Details */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-sm font-medium text-gray-900">{meal.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{meal.foodSourceUrl}</p>
            <div className="mt-4 flex items-center justify-between">
              {/* Add Meal Button 
              <button
                type="button"
                onClick={() => onAddMeal(meal)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Add ${meal.name} to your meals`}
              >
                Add
              </button>*/}
              {/* View Details Button */}
              <button
                type="button"
                onClick={() => onViewDetails(meal)}
                className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`View details for ${meal.name}`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(MealSearchResultsGrid);
