"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import ImageUploadLabel from "../ui/inputs/image-upload";

import ToggleInput from "../ui/inputs/toggle-input";
import { macros, nutrientFields } from "@/util/nutrients";
import { FormActionType } from "@/models/interfaces/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import {
  IIngredient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import {
  getMeasureDescriptionFromString,
  Nutrients,
  UnitOfMeasure,
  UrlAction,
} from "@/constants/constants-enums";
import SelectDropdown from "../ui/inputs/select-dropdown";
import { Measure } from "@/models/interfaces/food/food";
import { useSearchParams } from "next/navigation";
import { read } from "fs";

dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin

type IngredientInputFieldsProps = {
  ingredient: IIngredient;
  setIngredient:
    | React.Dispatch<React.SetStateAction<IIngredient | undefined>>
    | undefined;
  handleClear: () => void;
  // measure?: Measure;
};

const IngredientInputFields: React.FC<IngredientInputFieldsProps> = ({
  ingredient,
  setIngredient,
  handleClear,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    ingredient.image || undefined
  );
  const [unitOfMeasure, setUnitOfMeasure] = useState<UnitOfMeasure>(
    UnitOfMeasure.Gram
  );
  const isCustom = ingredient.foodId === null;
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const readOnly = actionParam === UrlAction.View || !isCustom;

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setIngredient?.((prevIngredient) => ({
      ...prevIngredient!,
      [name]: name === "quantity" || name === "weight" ? Number(value) : value,
      foodId: null, // set to null to indicate custom ingredient when user changes any input
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

  const placeholderImage = "/aiimages/food/avocado.jpg";

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = placeholderImage;
  };

  // Handler to reset all fields and state
  const handleClearFields = () => {
    setIngredient?.({
      ...ingredient,
      text: "",
      quantity: 1,
      measure: "",
      food: "",
      weight: 1,
      foodCategory: "",
      foodId: null,
      image: "",
      totalNutrients: {},
    });
    setImageSrc(undefined);
    setUnitOfMeasure(UnitOfMeasure.Gram);
    handleClear();
  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Ingredient Details</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div className="">
              <h2 className="text-lg font-medium text-gray-900">
                {(actionParam ?? "").charAt(0).toUpperCase() +
                  (actionParam ?? "").slice(1) || ""}{" "}
                Ingredient
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
                      readOnly={readOnly && isCustom}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
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
                      readOnly={readOnly && isCustom}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Weight
                  </label>
                  <div className="mt-3">
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      min={1}
                      value={ingredient.weight}
                      defaultValue={1}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value === 0) {
                          return;
                        }
                        handleInputChange(e);
                      }}
                      readOnly={readOnly && isCustom}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <SelectDropdown
                    label="Unit of Measure"
                    options={Object.values(UnitOfMeasure)}
                    selected={unitOfMeasure}
                    onChange={setUnitOfMeasure}
                    name="unit-of-measure"
                    placeholder="Select unit"
                    disabled={readOnly && isCustom}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rigth Panel Section - Image upload + Read only fields here*/}
          <div className="mt-6 lg:mt-0">
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
                        readOnly={readOnly && isCustom}
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
        {/* Clear Button */}
        {!readOnly && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleClearFields}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Clear All Fields
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default IngredientInputFields;
