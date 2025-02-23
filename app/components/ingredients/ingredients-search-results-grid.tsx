import React from "react";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type IngredientSearchResultsGridProps = {
  ingredients: IIngredient[];
  onViewDetails: (ingredient: IIngredient) => void;
  //onAddIngredient: (ingredient: IIngredient) => void;
};

const IngredientSearchResultsGrid: React.FC<
  IngredientSearchResultsGridProps
> = ({ ingredients, onViewDetails }) => {
  // const handleAddIngredient = (ingredient: IIngredient) => {
  //   onAddIngredient({
  //     ...ingredient,
  //   });
  // };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id} // Assuming id is unique
          className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {/* Ingredient Image */}
          <div className="h-48 w-full bg-gray-200 relative">
            <Image
              src={ingredient.image || ""}
              alt={ingredient.food}
              layout="fill"
              className="object-cover object-center"
            />
          </div>

          {/* Ingredient Details */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-sm font-medium text-gray-900">
              {ingredient.food}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {ingredient.foodCategory}
            </p>
            <div className="mt-auto flex justify-between items-center">
              {/* <button
                type="button"
                onClick={() => handleAddIngredient(ingredient)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Add ${ingredient.food}`}
              >
                Add
              </button> */}
              {/* View Details Button */}
              <button
                type="button"
                onClick={() => onViewDetails(ingredient)}
                className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`View details for ${ingredient.food}`}
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

export default React.memo(IngredientSearchResultsGrid);
