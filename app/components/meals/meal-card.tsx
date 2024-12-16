// components/meal-plan/meal-card.tsx

import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { macros } from "@/util/nutrients";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { UrlAction } from "@/constants/constants-enums";
import { format } from "date-fns";

type MealCardProps = {
  meal: IMealInterface;
  handleViewDetails: (meal: IMealInterface) => void;
  handleImageError: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
};

const MealCard: React.FC<MealCardProps> = ({
  meal,
  handleImageError,
  handleViewDetails,
}) => {
  const pathname = usePathname();

  const handleClickView = useCallback(
    (meal: IMealInterface) => {
      handleViewDetails(meal);

      // Update URL with 'action' and 'id' using pushState
      const params = new URLSearchParams(window.location.search);
      params.set("action", UrlAction.View);
      params.set("id", String(meal.id));
      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, handleViewDetails]
  );

  return (
    <div
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
      style={{ minHeight: "130px" }}
    >
      {/* Badge Indicator */}
      {meal.timeConsumed && (
        <span className="absolute top-2 left-2 flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10 opacity-70">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Logged
        </span>
      )}

      {/* Meal Image */}
      <div className="relative w-full h-20 bg-gray-200">
        {meal.image ? (
          <Image
            src={meal.image || "/aiimages/food/default-food.svg"}
            alt={meal.name}
            fill
            sizes={"100%"}
            onError={handleImageError}
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* Meal Details */}
      <div className="flex flex-1 flex-col p-1">
        <h3 className="text-sm font-medium text-gray-900 truncate w-full">
          <Link
            title={meal.name}
            href={meal.foodSourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {meal.name}
          </Link>
        </h3>
        <p className="text-xs text-gray-600">
          {format(new Date(meal.timeScheduled), "hh:mm a")}
        </p>

        {/* Macros and "View Details" Button - Horizontal Alignment */}
        <div className="mt-1 flex items-end justify-between">
          {/* Macros Grid */}
          <div className="grid grid-cols-2 gap-1">
            {macros.map((macro) => (
              <div
                key={macro.tag}
                className="flex flex-col items-center justify-center w-9 h-9 rounded-md"
              >
                {macro.icon}
                <span className={`text-xs mt-1 ${macro.className}`}>
                  {meal.nutrients && meal.nutrients[macro.tag]
                    ? `${meal.nutrients[macro.tag].quantity.toFixed(0)}${
                        macro.unit
                      }`
                    : "0g"}
                </span>
              </div>
            ))}
          </div>

          {/* "View Details" Button */}
          <button
            onClick={() => handleClickView(meal)}
            className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MealCard);
