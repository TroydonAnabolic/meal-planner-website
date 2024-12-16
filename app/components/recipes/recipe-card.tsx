import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { macros } from "@/util/nutrients";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Import necessary icons

type RecipeCardProps = {
  recipe: IRecipeInterface;
  handleViewDetails: (recipe: IRecipeInterface) => void;
  handleDeleteRecipe: (recipe: IRecipeInterface) => Promise<void>;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRecipe: React.Dispatch<
    React.SetStateAction<IRecipeInterface | undefined>
  >;
  handleImageError: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  handleImageError,
  handleViewDetails,
  setIsConfirmOpen,
  setSelectedRecipe,
  handleDeleteRecipe,
}) => {
  const handleClickView = useCallback(() => {
    handleViewDetails(recipe);
  }, [handleViewDetails, recipe]);
  return (
    <div
      key={recipe.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      {/* Recipe Image with "View Details" Button */}
      <div className="h-48 w-full bg-gray-200 relative">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.label}
            layout="fill"
            //  objectFit="cover"
            className="object-cover object-center"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      {/* Recipe Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Recipe Label and "View Details" Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">
            <Link
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {recipe.label}
            </Link>
          </h3>
          <button
            onClick={handleClickView}
            className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            View Details
          </button>
        </div>

        {/* Macros */}
        <div className="flex space-x-4 mb-4 mt-2">
          {macros.map((macro) => (
            <div key={macro.tag} className={`flex items-center space-x-1`}>
              {macro.icon}
              <span className={`text-sm ${macro.className}`}>
                {recipe.totalNutrients && recipe.totalNutrients[macro.tag]
                  ? `${recipe.totalNutrients[macro.tag].quantity.toFixed(1)}${
                      macro.unit
                    }`
                  : "0g"}
              </span>
            </div>
          ))}
        </div>

        {/* Yield */}
        <p className="text-sm text-gray-500 mb-2">Yield: {recipe.yield}</p>

        {/* Source */}
        <p className="mt-auto text-sm text-gray-500">Source: {recipe.source}</p>
      </div>
      <div className="absolute bottom-1 right-1">
        <button
          title="Delete Recipe"
          onClick={() => {
            setIsConfirmOpen(true);
            setSelectedRecipe(recipe);
            handleDeleteRecipe.bind(null, recipe);
          }}
          className="flex items-center text-red-600 hover:text-red-900"
          aria-label={`Delete ${recipe.label}`}
        >
          <span>Delete</span>
          <span className="ml-1">
            <XMarkIcon className="h-5 w-5" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
