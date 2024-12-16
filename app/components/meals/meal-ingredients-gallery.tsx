// MealIngredientsGallery.tsx

import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";
import { IMealIngredient } from "@/models/interfaces/meal/Meal";
import SelectedMealFoodCard from "./selected-meal-food-card";

interface MealIngredientsGalleryProps {
  ingredients: IMealIngredient[];
  onUpdate: (
    foodIngredient: IFoodIngredient,
    mealIngredient: IMealIngredient,
    operation?: "add" | "remove"
  ) => void;
  readOnly?: boolean;
}

const MealIngredientsGallery: React.FC<MealIngredientsGalleryProps> = ({
  ingredients,
  onUpdate,
  readOnly,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        type="button"
        title="Scroll Left"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none z-10"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 px-8 py-4 scrollbar-hide"
      >
        {ingredients.map((ingredient, index) => (
          <div
            key={`${ingredient.foodId}-${index}`}
            className="flex-shrink-0 w-64"
          >
            <SelectedMealFoodCard
              mealIngredient={ingredient}
              onUpdate={onUpdate}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}

      <button
        type="button"
        title="Scroll Right"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none z-10"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

export default MealIngredientsGallery;
