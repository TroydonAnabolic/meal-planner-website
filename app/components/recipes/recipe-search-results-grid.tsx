// components/ui/RecipeSearchResultsGrid.tsx

import React from "react";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type RecipeSearchResultsGridProps = {
  recipes: IRecipeInterface[];
  onViewDetails: (recipe: IRecipeInterface) => void;
  onAddRecipe: (recipe: IRecipeInterface) => void;
};

const RecipeSearchResultsGrid: React.FC<RecipeSearchResultsGridProps> = ({
  recipes,
  onViewDetails,
  onAddRecipe,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div
          key={recipe.uri} // Assuming URI is unique
          className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {/* Recipe Image */}
          <div className="h-48 w-full bg-gray-200 relative">
            <Image
              src={recipe.image || ""}
              alt={recipe.label}
              layout="fill"
              //    objectFit="cover"
              className="object-cover object-center"
            />
          </div>

          {/* Recipe Details */}
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-sm font-medium text-gray-900">
              {recipe.label}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{recipe.source}</p>
            <div className="mt-4 flex items-center justify-between">
              {/* Add Recipe Button */}
              <button
                type="submit"
                onClick={() => onAddRecipe(recipe)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Add ${recipe.label} to your recipes`}
              >
                Add
              </button>
              {/* View Details Button */}
              <button
                type="button"
                onClick={() => onViewDetails(recipe)}
                className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`View details for ${recipe.label}`}
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

export default React.memo(RecipeSearchResultsGrid);
