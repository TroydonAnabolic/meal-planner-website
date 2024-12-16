// components/recipe/SelectedFoodCard.tsx

import React, { useState } from "react";
import { RecipeIngredient } from "@/models/interfaces/recipe/recipe";
import {
  UnitOfMeasure,
  getMeasureDescription,
  getMeasureDescriptionFromString,
} from "@/constants/constants-enums";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";
import SelectDropdown from "../ui/inputs/select-dropdown";
import { convertToGrams } from "@/util/generic-utils";

interface SelectedFoodCardProps {
  recipeIngredient: RecipeIngredient;
  onUpdate: (
    foodIngredient: IFoodIngredient,
    recipeIngredient: RecipeIngredient,
    operation?: "add" | "remove",
    weightInGrams?: number
  ) => void;
  readOnly?: boolean;
}

const SelectedFoodCard: React.FC<SelectedFoodCardProps> = ({
  recipeIngredient,
  onUpdate,
  readOnly,
}) => {
  const [quantity, setQuantity] = useState<number>(
    recipeIngredient.quantity! || 1
  );
  const [weight, setWeight] = useState<number>(recipeIngredient.weight! || 100);
  const [unitOfMeasure, setUnitOfMeasure] = useState<UnitOfMeasure>(
    (recipeIngredient.measure as UnitOfMeasure) || UnitOfMeasure.Gram
  );

  /**
   * Handles updating the ingredient details.
   */
  const handleUpdate = (operation?: "add" | "remove") => {
    const measureURI =
      getMeasureDescriptionFromString(unitOfMeasure) ||
      getMeasureDescription(UnitOfMeasure.Gram)!;

    // Convert weight to grams
    const weightInGrams = convertToGrams(unitOfMeasure, weight);

    const updatedFoodIngredient: IFoodIngredient = {
      quantity: weight * quantity,
      measureURI: measureURI,
      foodId: recipeIngredient.foodId,
    };

    const updatedRecipeIngredient: RecipeIngredient = {
      ...recipeIngredient,
      text: `${weight} ${unitOfMeasure} ${recipeIngredient.food}`,
      quantity: quantity,
      measure: unitOfMeasure,
      weight: weight,
    };

    onUpdate(
      updatedFoodIngredient,
      updatedRecipeIngredient,
      operation,
      weightInGrams
    );
  };

  return (
    <div className="flex flex-col justify-between items-center bg-white p-6 rounded-lg shadow-md h-full">
      {/* Image */}
      <Image
        src={recipeIngredient.image || ""}
        alt={recipeIngredient.text || "Selected Food"}
        width={96}
        height={96}
        className="w-24 h-24 object-cover rounded-md"
      />

      {/* Food Name */}
      <span className="mt-4 text-lg font-semibold text-gray-800 text-center">
        {recipeIngredient.text}
      </span>

      {/* Details */}
      <div className="mt-6 w-full">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={quantity.toFixed(1)}
              min="0.01"
              step={0.01}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-center text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Qty"
            />
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              {unitOfMeasure ? `${unitOfMeasure}'s` : ""}
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={weight.toFixed(1)}
              min="0.01"
              step={0.01}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-center text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Weight"
            />
          </div>
        </div>

        {/* Unit of Measure */}
        <div className="mt-6">
          <SelectDropdown
            label="Unit of Measure"
            options={Object.values(UnitOfMeasure)}
            selected={unitOfMeasure}
            onChange={setUnitOfMeasure}
            name="unit-of-measure"
            placeholder="Select unit"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="mt-6 w-full flex justify-end">
          <button
            title="Remove Ingredient"
            type="button"
            onClick={() => handleUpdate("remove")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectedFoodCard;
