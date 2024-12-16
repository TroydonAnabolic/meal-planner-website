// components/recipe/RecipeDetails.tsx

import React from "react";
import Image from "next/image";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { INutrients } from "@/models/interfaces/nutrition";

interface NutrientDetailsProps {
  nutrients: INutrients;
}

const NutrientsDetails: React.FC<NutrientDetailsProps> = ({ nutrients }) => {
  if (!nutrients) return null;

  return (
    <>
      <div className="mt-4">
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(nutrients).map(([key, nutrient]) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
            >
              <span className="text-gray-800">{nutrient.label}</span>
              <span className="font-medium text-gray-800">
                {nutrient.quantity.toFixed(1)} {nutrient.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NutrientsDetails;
