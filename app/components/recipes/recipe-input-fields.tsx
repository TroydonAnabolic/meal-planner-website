"use client";
import React, { useState, useCallback, useEffect } from "react";

import {
  RecipeIngredient,
  IRecipeInterface,
} from "@/models/interfaces/recipe/recipe";
import IngredientSearch from "./ingredients-search";
import { getAllFoodNutrition } from "@/lib/nutrients";
import Image from "next/image";
import ImageUploadLabel from "../ui/inputs/image-upload";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";

import { INutrients } from "@/models/interfaces/nutrition";

import RecipeIngredientsGallery from "./recipe-ingredients-gallery";
import ToggleInput from "../ui/inputs/toggle-input";
import {
  macros,
  scaleNutrients,
  updateRecipeNutrients,
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

dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin

type RecipeInputFieldsProps = {
  action: FormActionType | "Search";
  recipe: IRecipeInterface;
  setRecipe:
    | React.Dispatch<React.SetStateAction<IRecipeInterface | undefined>>
    | undefined;
  readOnly: boolean;
};

const RecipeInputFields: React.FC<RecipeInputFieldsProps> = ({
  action,
  recipe,
  setRecipe,
  readOnly,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(
    recipe.image || undefined
  );
  const isMealPlanRecipe = recipe.mealPlanId !== null;

  // State to control picker visibility
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // State to hold the selected date-time
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  //  * Adds a new ingredient to the recipe and updates a list of recipe ingredients.
  //  */@param recipeIngredient The selected RecipeIngredient to add.
  //  */@param ingredient The selected IFoodIngredient to add.
  //  */@param operation The operation to perform. Either 'add' or 'remove'.
  //  */
  const handleUpdateAllRecipeIngredient = async (
    ingredient: IFoodIngredient,
    recipeIngredient: RecipeIngredient,
    operation?: "add" | "remove",
    weightInGrams?: number
  ) => {
    const foodNutritionResp = await getAllFoodNutrition(ingredient);

    if (!foodNutritionResp) {
      // Handle the case where nutrient fetching failed
      console.error("Failed to update recipe nutrients.");
      return;
    }

    // update the recipes nutrient values based on the updated ingredient
    const updatedRecipe: IRecipeInterface = updateRecipeNutrients(
      recipe,
      operation,
      foodNutritionResp
    );

    if (!updatedRecipe) {
      // Handle the case where nutrient fetching failed
      console.error("Failed to update recipe nutrients.");
      return;
    }

    const finalRecipe: IRecipeInterface = {
      ...updatedRecipe, // Includes baseTotalNutrients, baseTotalDaily, baseTotalWeight, totalNutrients, totalDaily, calories, totalWeight
      ingredients:
        operation === "add"
          ? [...(recipe.ingredients || []), recipeIngredient]
          : recipe.ingredients.filter(
              (ing) => ing.foodId !== recipeIngredient.foodId
            ),
      ingredientLines:
        operation === "add"
          ? [...(recipe.ingredientLines || []), recipeIngredient.text!]
          : recipe.ingredientLines.filter(
              (line) => line !== recipeIngredient.text!
            ),
      isCustom: true,
      // Nutrient totals and weights are already updated in updatedRecipe
    };

    // Update totalWeight in grams
    if (weightInGrams) {
      finalRecipe.totalWeight =
        (finalRecipe.totalWeight || 0) +
        (operation === "add" ? weightInGrams : -weightInGrams);
    }

    console.log("Updated Recipe:", finalRecipe);

    setRecipe?.(finalRecipe);
  };

  const handleOpenPicker = (field: "timeScheduled") => {
    setSelectedDateTime(dayjs(recipe[field]));
    setIsPickerOpen(true);
  };

  // Handler for date-time change
  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setSelectedDateTime(newValue);
  };

  // Handler for accepting the selected date-time
  // TODO: bug fix - update mealtype and mealtypekey based on timescheduled e.g. 7am must update mealtype to be
  const handleDateTimeAccept = () => {
    if (selectedDateTime) {
      // Convert the selected time from NZT to UTC before saving
      const userTimezone = dayjs.tz.guess(); // e.g., "Pacific/Auckland"

      // Convert the selected time from the user's local timezone to UTC
      const timeInUTC = selectedDateTime.tz(userTimezone, true).utc();
      setRecipe!((prevRecipe) => ({
        ...prevRecipe!,
        timeScheduled: timeInUTC.toDate(), // Save the UTC time to the database
      }));
      setIsPickerOpen(false);
    }
  };

  // Handler for cancelling the picker
  const handleDateTimeCancel = () => {
    setIsPickerOpen(false);
    setSelectedDateTime(null);
  };

  // Handler for clearing the picker selection
  const handleDateTimeClear = () => {
    setRecipe!((prevRecipe) => {
      const updatedMeal = { ...prevRecipe! };

      setIsPickerOpen(false);
      setSelectedDateTime(null);
      return updatedMeal;
    });
  };

  useEffect(() => {
    if (recipe.timeScheduled) {
      // Get the user's timezone from the browser
      const userTimezone = dayjs.tz.guess(); // e.g., "Pacific/Auckland"

      // Convert UTC time to the user's local time
      const timeInLocal = dayjs(recipe.timeScheduled)
        .utc()
        .tz(userTimezone, true);
      setSelectedDateTime(timeInLocal);
    }
  }, [recipe.timeScheduled]);

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "yield") {
      const newYield = Number(value);
      const prevYield = recipe.yield || 1; // Default to 1 to avoid division by zero
      const scalingFactor = newYield / prevYield;

      if (scalingFactor !== 1) {
        const scaledData = scaleNutrients(
          recipe.baseTotalNutrients!,
          recipe.baseTotalDaily!,
          recipe.baseTotalWeight!, // Pass baseTotalWeight
          newYield
        );

        setRecipe?.((prevRecipe) => ({
          ...prevRecipe!,
          yield: newYield,
          calories: scaledData.calories,
          totalWeight: scaledData.totalWeight,
          totalNutrients: scaledData.totalNutrients,
          totalDaily: scaledData.totalDaily,
          isCustom: true,
        }));
        return; // Exit early since yield has been handled
      }
    }

    setRecipe?.((prevRecipe) => ({
      ...prevRecipe!,
      [name]:
        name === "yield" || name === "totalTime" || name === "totalCO2Emissions"
          ? Number(value)
          : value,
      isCustom: true,
    }));
  };
  // Handler for multi-select dropdowns
  const handleMultiSelectDropdown = useCallback(
    (category: keyof IRecipeInterface, selected: string[]) => {
      setRecipe?.({ ...recipe, [category]: selected, isCustom: true });
    },
    [recipe, setRecipe]
  );

  const handleImageUpload = (imageSrc: string | undefined) => {
    setImageSrc(imageSrc);
    setRecipe?.((prev) => ({
      ...prev!,
      image: imageSrc || "",
      isCustom: true,
    }));
  };

  const handleToggleAvoid = (enabled: boolean) => {
    if (readOnly) {
      return;
    }
    setRecipe?.((prev) => ({
      ...prev!,
      avoid: enabled,
      isCustom: true,
    }));
  };

  const handleToggleFavourite = (isFavourite: boolean) => {
    if (readOnly) {
      return;
    }
    setRecipe?.((prev) => ({
      ...prev!,
      isFavourite: isFavourite,
      isCustom: true,
    }));
  };

  const placeholderImage = "/aiimages/food/avocado.jpg";

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = placeholderImage;
  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Recipe Details</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div className="">
              <h2 className="text-lg font-medium text-gray-900">
                {action} Recipe
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="col-span-2">
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Recipe URL
                  </label>
                  <div className="mt-1">
                    <input
                      id="url"
                      name="url"
                      type="url"
                      value={recipe.url || ""}
                      readOnly={true}
                      disabled={true}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      placeholder="Enter recipe URL"
                    />
                  </div>
                </div>

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
                      placeholder="Recipe Name"
                      value={recipe.label}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="yield"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Yield
                  </label>
                  <div className="mt-1">
                    <input
                      id="yield"
                      name="yield"
                      type="number"
                      min={1}
                      value={recipe.yield}
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

                <div>
                  <label
                    htmlFor="totalTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time to cook (minutes)
                  </label>
                  <div className="mt-1">
                    <input
                      id="totalTime"
                      name="totalTime"
                      type="number"
                      value={recipe.totalTime}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalCO2Emissions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total CO2 emissions (kg)
                  </label>
                  <div className="mt-1">
                    <input
                      id="totalCO2Emissions"
                      name="totalCO2Emissions"
                      type="number"
                      value={recipe.totalCO2Emissions.toFixed(1)}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <SelectFoodLabels
                  data={recipe}
                  handleMultiSelectDropdown={handleMultiSelectDropdown}
                  readOnly={readOnly}
                />

                <div className="space-y-6">
                  {/* Time Scheduled Field */}
                  <div className="mt-1 flex items-center">
                    <input
                      id="scheduledTime"
                      name="scheduledTime"
                      disabled={isMealPlanRecipe}
                      type="text"
                      placeholder="Scheduled Time"
                      required
                      value={
                        recipe.timeScheduled
                          ? dayjs(recipe.timeScheduled).format(
                              "DD/MM/YYYY hh:mm A"
                            )
                          : ""
                      }
                      readOnly={readOnly}
                      onChange={handleInputChange}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleOpenPicker("timeScheduled")}
                        className=" ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                      >
                        Select
                      </button>
                    )}
                  </div>

                  {/* Static DateTime Picker */}
                  {isPickerOpen && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        Select Recipe Scheduled Time
                      </p>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-nz"
                      >
                        <StaticDateTimePicker
                          orientation="portrait"
                          ampm={true}
                          minutesStep={1}
                          disabled={isMealPlanRecipe}
                          value={selectedDateTime}
                          onChange={handleDateTimeChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  text-gray-700"
                          sx={{
                            width: "100%",
                          }}
                          slotProps={{
                            // The actions will be the same between desktop and mobile
                            actionBar: {
                              actions: ["accept", "cancel", "clear"],
                              onAccept: handleDateTimeAccept,
                              onClear: handleDateTimeClear,
                              onCancel: handleDateTimeCancel,
                            },
                            toolbar: {
                              classes: {
                                ampmLabel: "text-sm",
                                ampmSelection:
                                  "hover:bg-blue-100 active:bg-blue-200",
                              },
                              toolbarPlaceholder: "Scheduled Time",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="border-t border-gray-200 pt-6">
                    {!readOnly && (
                      <>
                        <h2 className="text-lg font-medium text-gray-900">
                          Ingredient Search
                        </h2>
                        <div className="mt-4">
                          {/* Ingredient Search Component */}
                          <IngredientSearch
                            recipeId={recipe.id}
                            updateAllRecipeIngredients={
                              handleUpdateAllRecipeIngredient
                            }
                          />
                        </div>
                      </>
                    )}

                    <h2 className="text-lg font-medium text-gray-900">
                      Selected Ingredients
                    </h2>

                    <div className="my-8">
                      <RecipeIngredientsGallery
                        ingredients={recipe?.ingredients}
                        onUpdate={handleUpdateAllRecipeIngredient}
                        readOnly={readOnly}
                      />
                    </div>
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
                label="Avoid Recipe"
                subLabel="Mark this recipe to avoid in future suggestions."
                enabled={recipe.avoid}
                disableInput={readOnly}
                onChange={handleToggleAvoid}
              />
            </div>
            <div className="my-4">
              <ToggleInput
                label="Make Favourite"
                subLabel="Mark this recipe as favourite"
                enabled={recipe.isFavourite!}
                disableInput={readOnly}
                onChange={handleToggleFavourite}
              />
            </div>
            {/* Recipe Image */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
              <h3 className="sr-only">Recipe image</h3>

              {!imageSrc && !readOnly ? (
                <>
                  <h2 className="text-lg font-medium text-gray-900">
                    Upload Recipe Image
                  </h2>
                  <div className="p-6">
                    <ImageUploadLabel handleImageUpload={handleImageUpload} />
                  </div>
                </>
              ) : (
                <div>
                  <Image
                    src={imageSrc || ""}
                    alt="Recipe"
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
                  htmlFor="total-weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total weight (grams)
                </label>
                <div className="mt-1">
                  <input
                    id="total-weight"
                    name="total-weight"
                    readOnly={true}
                    disabled={true}
                    value={recipe.totalWeight.toFixed(1)}
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
                      {recipe.totalNutrients && recipe.totalNutrients[macro.tag]
                        ? recipe.totalNutrients[macro.tag].quantity.toFixed(1)
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
                <NutrientsDetails
                  nutrients={recipe.totalNutrients as INutrients}
                />
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Total Daily
                </h2>
                <NutrientsDetails nutrients={recipe.totalDaily as INutrients} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeInputFields;
