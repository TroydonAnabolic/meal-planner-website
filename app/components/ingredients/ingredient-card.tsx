import {
  IIngredient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import { macros } from "@/util/nutrients";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import {
  CheckCircleIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Import necessary icons

type IngredientCardProps = {
  ingredient: IIngredient;
  handleViewDetails: (ingredient: IIngredient) => void;
  handleDeleteIngredient: (ingredient: IIngredient) => Promise<void>;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIngredient: React.Dispatch<
    React.SetStateAction<IIngredient | undefined>
  >;
  handleImageError: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
};

const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  handleImageError,
  handleViewDetails,
  setIsConfirmOpen,
  setSelectedIngredient,
  handleDeleteIngredient,
}) => {
  const handleClickView = useCallback(() => {
    handleViewDetails(ingredient);
  }, [handleViewDetails, ingredient]);
  return (
    <div
      key={ingredient.id}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      {/* Badge Indicator for Custom */}
      {ingredient.foodId === null && (
        <span className="absolute top-2 left-2 flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full z-10 opacity-80">
          <StarIcon className="h-4 w-4 mr-1" />
          Custom
        </span>
      )}

      {/* Ingredient Image with "View Details" Button */}
      <div className="h-48 w-full bg-gray-200 relative">
        {ingredient.image ? (
          <Image
            src={ingredient.image}
            alt={ingredient.food}
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

      {/* Ingredient Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Ingredient Label and "View Details" Button */}
        <div className="flex justify-between items-center">
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
            <div key={macro.tag} className="flex items-center space-x-1">
              {macro.icon}
              <span className={`text-sm ${macro.className}`}>
                {ingredient.totalNutrients?.[
                  macro.tag as unknown as keyof INutrients
                ]?.quantity?.toFixed(1) || 0}
                {macro.unit}
              </span>
            </div>
          ))}
        </div>

        {/* Yield */}
        <p className="text-sm text-gray-500 mb-2">
          Quantity: {ingredient.quantity} x
        </p>

        {/* Source */}
        <p className="mt-auto text-sm text-gray-500">
          Weight: {ingredient.weight}
        </p>

        {/* Source */}
        <p className="mt-auto text-sm text-gray-500">
          Measure: {ingredient.measure}
        </p>
      </div>
      <div className="absolute bottom-1 right-1">
        <button
          title="Delete Ingredient"
          onClick={() => {
            setIsConfirmOpen(true);
            setSelectedIngredient(ingredient);
            handleDeleteIngredient.bind(null, ingredient);
          }}
          className="flex items-center text-red-600 hover:text-red-900"
          aria-label={`Delete ${ingredient.food}`}
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

export default IngredientCard;
