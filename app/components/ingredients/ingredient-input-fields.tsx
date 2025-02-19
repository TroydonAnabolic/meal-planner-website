"use client";
import React, { useState, useCallback, useEffect } from "react";

import { getAllFoodNutrition } from "@/lib/nutrients";
import Image from "next/image";
import ImageUploadLabel from "../ui/inputs/image-upload";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";

import ToggleInput from "../ui/inputs/toggle-input";
import {
  macros,
  scaleNutrients,
  updateIngredientNutrients,
} from "@/util/nutrients";
import { FormActionType } from "@/models/interfaces/types";
import NutrientsDetails from "../Nutrients/nutrient-details";
import SelectFoodLabels from "../food/food-labels-dropdown";
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import { getLocalTimeFromUtc, getUtcTimeFromLocal } from "@/util/date-util";
import {
  IIngredient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import { Nutrients } from "@/constants/constants-enums";

dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin

type IngredientInputFieldsProps = {
  action: FormActionType | "Search";
  ingredient: IIngredient;
  setIngredient:
    | React.Dispatch<React.SetStateAction<IIngredient | undefined>>
    | undefined;
  readOnly: boolean;
};

const IngredientInputFields: React.FC<IngredientInputFieldsProps> = ({
  action,
  ingredient,
  setIngredient,
  readOnly,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    ingredient.image || undefined
  );
  // State to control picker visibility
  const [isCustom, setIsCustom] = useState(false);

  //  * Adds a new ingredient to the ingredient and updates a list of ingredient ingredients.
  //  */@param ingredientIngredient The selected IngredientIngredient to add.
  //  */@param ingredient The selected IFoodIngredient to add.
  //  */@param operation The operation to perform. Either 'add' or 'remove'.
  //  */
  //   const handleUpdateAllIngredientNutrient = async (
  //     ingredient: IIngredient,
  //     totalNutrients: INutrients,
  //     operation?: "add" | "remove",
  //     weightInGrams?: number
  //   ) => {
  //     const foodNutritionResp = await getAllFoodNutrition(ingredient);

  //     if (!foodNutritionResp) {
  //       // Handle the case where nutrient fetching failed
  //       console.error("Failed to update ingredient nutrients.");
  //       return;
  //     }

  //     // update the ingredients nutrient values based on the updated ingredient
  //     const updatedIngredient: IIngredient = updateIngredientNutrients(
  //       ingredient,
  //       operation,
  //       foodNutritionResp
  //     );

  //     if (!updatedIngredient) {
  //       // Handle the case where nutrient fetching failed
  //       console.error("Failed to update ingredient nutrients.");
  //       return;
  //     }

  //     const finalIngredient: IIngredient = {
  //       ...updatedIngredient, // Includes baseTotalNutrients, baseTotalDaily, baseTotalWeight, totalNutrients, totalDaily, calories, totalWeight
  //       ingredients:
  //         operation === "add"
  //           ? [...(ingredient.ingredients || []), ingredientIngredient]
  //           : ingredient.ingredients.filter(
  //               (ing) => ing.foodId !== ingredientIngredient.foodId
  //             ),
  //       ingredientLines:
  //         operation === "add"
  //           ? [...(ingredient.ingredientLines || []), ingredientIngredient.text!]
  //           : ingredient.ingredientLines.filter(
  //               (line) => line !== ingredientIngredient.text!
  //             ),
  //       isCustom: true,
  //       // Nutrient totals and weights are already updated in updatedIngredient
  //     };

  //     // Update totalWeight in grams
  //     if (weightInGrams) {
  //       finalIngredient.totalWeight =
  //         (finalIngredient.totalWeight || 0) +
  //         (operation === "add" ? weightInGrams : -weightInGrams);
  //     }

  //     console.log("Updated Ingredient:", finalIngredient);

  //     setIngredient?.(finalIngredient);
  //   };

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setIngredient?.((prevIngredient) => ({
      ...prevIngredient!,
      [name]: name === "quantity" || name === "weight" ? Number(value) : value,
      foodId: null,
    }));
  };

  const handleImageUpload = (imageSrc: string | undefined) => {
    setImageSrc(imageSrc);
    setIngredient?.((prev) => ({
      ...prev!,
      image: imageSrc || "",
      isCustom: true,
    }));
  };

  const handleToggleCustom = (isCustom: boolean) => {
    if (readOnly) {
      return;
    }
    setIngredient?.((prev) => ({
      ...prev!,
      foodId: null,
    }));
  };

  const placeholderImage = "/aiimages/food/avocado.jpg";

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = placeholderImage;
  };

  // Define the nutrients you want to create input fields for
  const nutrientFields: {
    tag: Nutrients;
    label: string;
    unit: string;
  }[] = [
    { tag: Nutrients.ENERC_KCAL, label: "Calories", unit: "kcal" },
    { tag: Nutrients.PROCNT, label: "Protein", unit: "g" },
    { tag: Nutrients.FAT, label: "Total Lipid Fat", unit: "g" },
    { tag: Nutrients.FASAT, label: "Saturated Fat", unit: "g" },
    { tag: Nutrients.FATRN, label: "Trans Fat", unit: "g" },
    { tag: Nutrients.CHOCDF, label: "Carbs", unit: "g" },
    { tag: Nutrients.SUGAR, label: "Sugars", unit: "g" },
    { tag: Nutrients.FIBTG, label: "Fiber", unit: "g" },
    { tag: Nutrients.NA, label: "Sodium", unit: "mg" },
    { tag: Nutrients.K, label: "Potassium", unit: "mg" },
  ];

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Ingredient Details</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div className="">
              <h2 className="text-lg font-medium text-gray-900">
                {action} Ingredient
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="label"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Label
                  </label>
                  <div className="mt-1">
                    <input
                      id="label"
                      name="label"
                      type="text"
                      placeholder="Ingredient Name"
                      value={ingredient.food}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Yield
                  </label>
                  <div className="mt-1">
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      value={ingredient.quantity}
                      defaultValue={1}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value === 0) {
                          return;
                        }
                        handleInputChange(e);
                      }}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rigth Panel Section - Image upload + Read only fields here*/}
          <div className="mt-6 lg:mt-0">
            {/* 'Avoid' Toggle */}
            <div className="my-4">
              <ToggleInput
                label="Make Favourite"
                subLabel="Mark this ingredient as favourite"
                enabled={ingredient.foodId !== null}
                disableInput={readOnly}
                onChange={handleToggleCustom}
              />
            </div>
            {/* Ingredient Image */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
              <h3 className="sr-only">Ingredient image</h3>

              {!imageSrc && !readOnly ? (
                <>
                  <h2 className="text-lg font-medium text-gray-900">
                    Upload Ingredient Image
                  </h2>
                  <div className="p-6">
                    <ImageUploadLabel handleImageUpload={handleImageUpload} />
                  </div>
                </>
              ) : (
                <div>
                  <Image
                    src={imageSrc || ""}
                    alt="Ingredient"
                    className="w-full h-auto rounded-md"
                    width={300}
                    height={300}
                    onError={handleImageError}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => setImageSrc(undefined)}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
              )}

              {/* Enter main */}
              <div className="mt-2 col-span-2">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight (grams)
                </label>
                <div className="mt-1">
                  <input
                    id="weight"
                    name="weight"
                    readOnly={true}
                    disabled={true}
                    value={ingredient.weight.toFixed(1)}
                    type="number"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Macros */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {macros.map((macro) => (
                  <div
                    key={macro.tag}
                    className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded"
                  >
                    <span className="mr-1">{macro.icon}</span>
                    <span>
                      {ingredient.totalNutrients &&
                      ingredient.totalNutrients[
                        macro.tag as unknown as keyof INutrients
                      ]
                        ? ingredient.totalNutrients[
                            macro.tag as unknown as keyof INutrients
                          ].quantity.toFixed(1)
                        : 0}{" "}
                      {macro.unit} {macro.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Nutrients
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {nutrientFields.map((nutrient) => (
                    <div key={nutrient.tag} className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700">
                        {nutrient.label}
                      </label>
                      <input
                        type="number"
                        value={
                          ingredient.totalNutrients &&
                          (ingredient.totalNutrients as unknown as INutrients)[
                            nutrient.tag as unknown as keyof INutrients
                          ]
                            ? (
                                ingredient.totalNutrients as unknown as INutrients
                              )[nutrient.tag as unknown as keyof INutrients]
                                .quantity
                            : 0
                        }
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setIngredient?.((prevIngredient) => {
                            if (!prevIngredient) return prevIngredient;
                            const totalNutrients =
                              prevIngredient.totalNutrients || {};
                            const nutrientTag =
                              nutrient.tag as unknown as keyof INutrients;
                            return {
                              ...prevIngredient,
                              totalNutrients: {
                                ...totalNutrients,
                                [nutrientTag]: {
                                  ...totalNutrients?.[nutrientTag],
                                  quantity: value,
                                },
                              },
                            };
                          });
                        }}
                        readOnly={readOnly}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      />
                      <span className="text-xs text-gray-500">
                        {nutrient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IngredientInputFields;
