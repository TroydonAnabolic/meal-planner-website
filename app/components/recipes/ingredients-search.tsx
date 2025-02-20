// components/recipe/IngredientSearch.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  IFoodParser,
  IFoodParserResponse,
  IHint,
} from "@/models/interfaces/edamam/food/food-response";
import { convertToGrams, debounce } from "@/util/generic-utils";
import { fetchFood } from "@/lib/client-side/edamam";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";

import {
  getMeasureDescription,
  getMeasureDescriptionFromString,
  Nutrients,
  UnitOfMeasure,
} from "@/constants/constants-enums";
import SelectDropdown from "../ui/inputs/select-dropdown";
import ToggleInput from "../ui/inputs/toggle-input";
import Image from "next/image";
import { RecipeIngredient } from "@/models/interfaces/recipe/recipe";
import { fetchIngredientsByClientId } from "@/lib/client-side/ingredients";
import { IIngredient } from "@/models/interfaces/ingredient/ingredient";
import { mapIngredientToHint } from "@/util/mappers";

interface IngredientSearchProps {
  recipeId?: number;
  clientId: number;
  updateAllRecipeIngredients: (
    ingredient: IFoodIngredient,
    recipeIngredient: RecipeIngredient,
    action: "add" | "remove",
    weightInGrams: number
  ) => void;
  // updateRecipeIngredients: (ingredient: RecipeIngredient) => void;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({
  recipeId,
  clientId,
  updateAllRecipeIngredients, // api call to get all recipe nutrients
  //updateRecipeIngredients,
}) => {
  const [query, setQuery] = useState<string>("");
  const [selectedFoodHint, setSelectedFoodHint] = useState<IHint>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [weight, setWeight] = useState<number>(100);
  const [unitOfMeasure, setUnitOfMeasure] = useState<UnitOfMeasure>(
    UnitOfMeasure.Gram
  );
  const [foodParse, setFoodParse] = useState<IFoodParser | undefined>();
  const [customIngredients, setCustomIngredients] = useState<IHint[]>([]);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  /**
   * Debounced search to prevent excessive API calls.
   */
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (searchTerm.length < 3) {
          setFoodParse(undefined);
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          const response: IFoodParser = await fetchFood(searchTerm);
          if (response) {
            setFoodParse(response);
          }
        } catch (err) {
          setError("Failed to fetch ingredients.");
        } finally {
          setIsLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    if (!isCustom) {
      debouncedSearch(query);
    }
    return debouncedSearch.cancel;
  }, [query, debouncedSearch, isCustom]);

  useEffect(() => {
    if (isCustom) {
      const fetchCustomIngredients = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const ingredients = await fetchIngredientsByClientId(clientId);
          if (ingredients) {
            const hints: IHint[] = ingredients.map((ingredient) => {
              const hint = mapIngredientToHint(ingredient);
              return hint;
            });
            setCustomIngredients(hints);
          }
        } catch (err) {
          setError("Failed to fetch custom ingredients.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomIngredients();
    } else {
      setCustomIngredients([]);
      setQuery("");
    }
  }, [isCustom, clientId]);

  /**
   * Handles the selection and preparation of an ingredient.
   */
  const handleSelect = (foodHint: IHint) => {
    setSelectedFoodHint(foodHint);
    // Optionally, reset input fields
    setQuantity(1);
    setWeight(0);
    setUnitOfMeasure(UnitOfMeasure.Gram);
  };

  /**
   * Handles adding the ingredient after inputting details.
   */
  const handleAddIngredient = () => {
    if (selectedFoodHint) {
      const measure = selectedFoodHint.measures.find(
        (m) => m.label === unitOfMeasure
      );
      const measureUri =
        measure?.uri || getMeasureDescription(UnitOfMeasure.Gram)!;

      if (!measure || !quantity || !weight) {
        setError("Enter all ingredient details.");
        return;
      }

      // Convert weight to grams
      const weightInGrams = convertToGrams(unitOfMeasure, weight);

      const foodIngredient: IFoodIngredient = {
        quantity: weight * quantity,
        measureURI: measureUri,
        foodId: selectedFoodHint.food.foodId,
      };

      const recipeIngredient: RecipeIngredient = {
        recipeId: recipeId || 0,
        text: `${weight} ${measure.label} ${selectedFoodHint.food.label}`,
        quantity: quantity,
        measure: unitOfMeasure,
        food: selectedFoodHint.food.label,
        weight: weight,
        foodId: selectedFoodHint.food.foodId,
        image: selectedFoodHint.food.image,
      };

      updateAllRecipeIngredients(
        foodIngredient,
        recipeIngredient,
        "add",
        weightInGrams
      );

      // Reset selection
      setSelectedFoodHint(undefined);
      setQuery("");
    }
  };

  return (
    <div className="mb-4">
      <div className="mb-2">
        <ToggleInput
          label="Custom Ingredients"
          enabled={isCustom}
          onChange={setIsCustom}
        />
      </div>
      {!selectedFoodHint ? (
        <div>
          {!isCustom && (
            <input
              type="text"
              placeholder="Search Ingredients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-700"
            />
          )}
          {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <ul className="mt-2 max-h-60 overflow-y-auto divide-y divide-gray-200">
            {(isCustom ? customIngredients : foodParse?.hints)?.map(
              (hint, index) => (
                <li
                  key={`${hint.food.foodId}-${index}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  onClick={() => handleSelect(hint)}
                >
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <Image
                      src={hint.food.image || ""} // Fallback image if none provided
                      alt={hint.food.label}
                      width={50}
                      height={50}
                      className="rounded-md object-cover object-center"
                    />
                  </div>

                  {/* Food Name and Macros Section */}
                  <div className="flex-1 ml-4 flex justify-between items-center">
                    {/* Food Name */}
                    <span className="text-gray-900 font-medium mr-4">
                      {hint.food.label}
                    </span>

                    {/* Macros Box */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Calories */}
                      <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                        <span className="mr-1">🔥</span>
                        <span>
                          {hint.food.nutrients.ENERC_KCAL
                            ? hint.food.nutrients.ENERC_KCAL.toFixed(1)
                            : 0}{" "}
                          kcal
                        </span>
                      </div>

                      {/* Protein */}
                      <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        <span className="mr-1">💪</span>
                        <span>
                          {hint.food.nutrients.PROCNT
                            ? hint.food.nutrients.PROCNT.toFixed(1)
                            : 0}{" "}
                          g Protein
                        </span>
                      </div>

                      {/* Carbohydrates */}
                      <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        <span className="mr-1">🍞</span>
                        <span>
                          {hint.food.nutrients.CHOCDF
                            ? hint.food.nutrients.CHOCDF.toFixed(1)
                            : 0}{" "}
                          g Carbs
                        </span>
                      </div>

                      {/* Fat */}
                      <div className="flex items-center bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        <span className="mr-1">🥑</span>
                        <span>
                          {hint.food.nutrients.FAT
                            ? hint.food.nutrients.FAT.toFixed(1)
                            : 0}{" "}
                          g Fat
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    className="ml-4 text-green-500 hover:text-green-600 transition-colors duration-200"
                    aria-label={`Add ${hint.food.label}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      ) : (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h3 className="text-md font-medium text-gray-700">
            Add Ingredient Details
          </h3>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            {/* Image */}
            <div className="flex-shrink-0 flex justify-center">
              <Image
                src={
                  selectedFoodHint.food.image || "/aiimages/food/meal-plan.jpg"
                }
                alt={selectedFoodHint.food.label}
                width={120}
                height={120}
                className="rounded-md object-cover object-center"
              />
            </div>

            {/* Details */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="mb-4">
                <label
                  htmlFor="food-label"
                  className="block text-sm font-medium text-gray-700"
                >
                  Label
                </label>
                <input
                  type="text"
                  id="food-label"
                  name="food-label"
                  value={selectedFoodHint.food.label}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    title="Quantity"
                    type="number"
                    min="1"
                    step={0.01}
                    value={quantity.toFixed(1)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      console.log(
                        "Input Quantity:",
                        e.target.value,
                        "Parsed:",
                        value
                      );
                      setQuantity(!isNaN(value) ? value : 0);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {unitOfMeasure ? `${unitOfMeasure}'s` : ""}
                  </label>
                  <input
                    title="Weight"
                    type="number"
                    min="0"
                    step={0.01}
                    value={weight.toFixed(1)}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Unit of Measure */}
          <div className="mt-4">
            <SelectDropdown
              label="Unit of Measure"
              options={Object.values(UnitOfMeasure)}
              selected={unitOfMeasure}
              onChange={setUnitOfMeasure}
              name="unit-of-measure"
              placeholder="Select unit"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleAddIngredient}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Ingredient
            </button>
            <button
              onClick={() => setSelectedFoodHint(undefined)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
