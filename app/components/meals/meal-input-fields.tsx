import React, { useState, useCallback, useEffect } from "react";

import { IMealIngredient, IMealInterface } from "@/models/interfaces/meal/Meal";
import { getAllFoodNutrition } from "@/lib/nutrients";
import Image from "next/image";
import ImageUploadLabel from "../ui/inputs/image-upload";
import { IFoodIngredient } from "@/models/interfaces/edamam/food/nutrients-request";
import { INutrients } from "@/models/interfaces/nutrition";

import { macros, updateMealNutrients } from "@/util/nutrients";
import NutrientsDetails from "../Nutrients/nutrient-details";
import MealIngredientSearch from "./meal-ingredient-search";
import MealIngredientsGallery from "./meal-ingredients-gallery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import SelectFoodLabels from "../food/food-labels-dropdown";
import "dayjs/locale/en-nz";
import { FormResult } from "@/types/form";
import { useSearchParams } from "next/navigation";
import { UrlAction } from "@/constants/constants-enums";

type MealInputFieldsProps = {
  meal: IMealInterface;
  setMeal: React.Dispatch<React.SetStateAction<IMealInterface | undefined>>;
  handleClear: () => void;
};

const MealInputFields: React.FC<MealInputFieldsProps> = ({
  meal,
  setMeal,
  handleClear,
}) => {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const readOnly = actionParam === UrlAction.View;

  const [imageSrc, setImageSrc] = useState<string | undefined>(
    meal.image || undefined
  );

  // State for error handling (if any)
  const [error, setError] = useState<FormResult>({
    success: false,
    errors: { general: "", ingredients: "" },
  });

  // State to control picker visibility
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // State to determine which field is being edited
  const [fieldBeingEdited, setFieldBeingEdited] = useState<
    "timeScheduled" | "timeConsumed" | null
  >(null);

  // State to hold the selected date-time
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);

  // Handler to open the picker for a specific field
  const handleOpenPicker = (field: "timeScheduled" | "timeConsumed") => {
    setFieldBeingEdited(field);
    setSelectedDateTime(dayjs(meal[field]));
    setIsPickerOpen(true);
  };

  // Handler for date-time change
  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setSelectedDateTime(newValue);
  };

  // Handler for accepting the selected date-time
  const handleDateTimeAccept = () => {
    if (selectedDateTime && fieldBeingEdited) {
      setMeal((prevMeal) => ({
        ...prevMeal!,
        [fieldBeingEdited]: selectedDateTime.toDate(),
      }));
      setIsPickerOpen(false);
      setFieldBeingEdited(null);
    }
  };

  // Handler for cancelling the picker
  const handleDateTimeCancel = () => {
    setIsPickerOpen(false);
    setFieldBeingEdited(null);
    setSelectedDateTime(null);
  };

  // Handler for clearing the picker selection
  const handleDateTimeClear = () => {
    setMeal((prevMeal) => {
      const updatedMeal = { ...prevMeal! };
      if (fieldBeingEdited === "timeConsumed") {
        updatedMeal[fieldBeingEdited] = undefined;
      }
      setIsPickerOpen(false);
      setFieldBeingEdited(null);
      setSelectedDateTime(null);
      return updatedMeal;
    });
  };

  /**
   * Synchronize selectedDateTime with meal.timeConsumed prop changes.
   */
  useEffect(() => {
    if (meal.timeConsumed) {
      setSelectedDateTime(dayjs(meal.timeConsumed));
    }
    if (meal.timeScheduled) {
      setSelectedDateTime(dayjs(meal.timeScheduled));
    }
  }, [meal.timeConsumed, meal.timeScheduled]);

  //  * Adds a new ingredient to the meal and updates a list of meal ingredients.
  //  */@param mealIngredient The selected MealIngredient to add.
  //  */@param ingredient The selected IFoodIngredient to add.
  //  */@param operation The operation to perform. Either 'add' or 'remove'.
  //  */
  const handleUpdateAllMealIngredient = async (
    ingredient: IFoodIngredient,
    mealIngredient: IMealIngredient,
    operation?: "add" | "remove",
    weight?: number
  ) => {
    setError((prev) => ({
      ...prev,
      errors: { ...prev.errors, nutrients: "" },
    }));

    const foodNutritionResp = await getAllFoodNutrition(ingredient);

    if (!foodNutritionResp) {
      console.error("Failed to update meal nutrients.");
      setError((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          nutrients: "Failed to update meal nutrients.",
        },
      }));
      return;
    }

    const updatedMeal: IMealInterface = updateMealNutrients(
      meal,
      operation,
      foodNutritionResp
    );

    if (!updatedMeal) {
      console.error("Failed to update meal nutrients.");
      setError((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          nutrients: "Failed to update meal nutrients.",
        },
      }));
      return;
    }

    const finalMeal: IMealInterface = {
      ...updatedMeal,
      ingredients:
        operation === "add"
          ? [...(meal.ingredients || []), mealIngredient]
          : meal.ingredients.filter(
              (ing) => ing.foodId !== mealIngredient.foodId
            ),
      ingredientLines:
        operation === "add"
          ? [...(meal.ingredientLines || []), mealIngredient.text!]
          : meal.ingredientLines.filter(
              (line) => line !== mealIngredient.text!
            ),
    };

    console.log("Updated Meal:", finalMeal);

    setMeal(finalMeal);
  };

  // Handler for multi-select dropdowns
  const handleMultiSelectDropdown = useCallback(
    (category: keyof IMealInterface, selected: string[]) => {
      setMeal((prevMeal) => ({
        ...prevMeal!,
        [category]: selected,
      }));
    },
    [setMeal]
  );

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      errors: { ...prev.errors, general: "" },
    }));
    setMeal((prevMeal) => ({
      ...prevMeal!,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageSrc: string | undefined) => {
    setImageSrc(imageSrc);
    setMeal((prev) => ({
      ...prev!,
      image: imageSrc || "",
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
    setMeal({
      ...meal,
      name: "",
      foodSourceUrl: "",
      timeScheduled: new Date(),
      timeConsumed: undefined,
      image: "",
      weight: 0,
      nutrients: {},
      ingredients: [],
      ingredientLines: [],
    });
    setImageSrc(undefined);
    setSelectedDateTime(null);
    setIsPickerOpen(false);
    setFieldBeingEdited(null);
    handleClear();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-nz">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Meal Details</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div className="">
              <h2 className="text-lg font-medium text-gray-900">
                {(actionParam ?? "").charAt(0).toUpperCase() +
                  (actionParam ?? "").slice(1) || ""}{" "}
                Meal
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="col-span-2">
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Food Source URL
                  </label>
                  <div className="mt-1">
                    <input
                      id="url"
                      name="url"
                      type="text"
                      value={meal.foodSourceUrl || ""}
                      readOnly={readOnly}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      placeholder="Meal source URL"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Meal Name"
                      required
                      value={meal.name}
                      onChange={handleInputChange}
                      readOnly={readOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <SelectFoodLabels
                  data={meal}
                  handleMultiSelectDropdown={handleMultiSelectDropdown}
                  readOnly={readOnly}
                  labelsToShow={["mealTypeKey"]}
                  requireSelection={true}
                />

                <div className="">
                  <label
                    htmlFor="scheduledTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Meal Scheduled Time
                  </label>
                  {/* Time Scheduled Field */}
                  <div className="mt-1 flex items-center">
                    <input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="text"
                      placeholder="Scheduled Time"
                      required
                      value={
                        meal.timeScheduled
                          ? dayjs(meal.timeScheduled).format(
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

                  {/* Time Consumed Field */}
                  <div className="">
                    <label
                      htmlFor="consumedTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Meal Consumed Time
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        id="consumedTime"
                        name="consumedTime"
                        type="text"
                        placeholder="Consumed Time"
                        value={
                          meal.timeConsumed
                            ? dayjs(meal.timeConsumed).format(
                                "DD/MM/YYYY hh:mm A"
                              )
                            : ""
                        }
                        readOnly
                        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                      />
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleOpenPicker("timeConsumed")}
                          className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Static DateTime Picker */}
                  {isPickerOpen && fieldBeingEdited && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-gray-700">
                        {fieldBeingEdited === "timeScheduled"
                          ? "Select Meal Scheduled Time"
                          : "Select Meal Consumed Time"}
                      </p>
                      <StaticDateTimePicker
                        orientation="portrait"
                        disableFuture={fieldBeingEdited !== "timeScheduled"}
                        ampm={true}
                        minutesStep={1}
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
                            toolbarPlaceholder:
                              fieldBeingEdited === "timeScheduled"
                                ? "Scheduled Time"
                                : "Consumed Time",
                          },
                        }}
                      />
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
                          <MealIngredientSearch
                            updateAllMealIngredients={
                              handleUpdateAllMealIngredient
                            }
                            clientId={meal.clientId}
                          />
                        </div>
                      </>
                    )}

                    <h2 className="text-lg font-medium text-gray-900">
                      Selected Ingredients
                    </h2>

                    <div className="my-8">
                      <MealIngredientsGallery
                        ingredients={meal?.ingredients}
                        onUpdate={handleUpdateAllMealIngredient}
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
            {/* Meal Image */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
              <h3 className="sr-only">Meal image</h3>

              {!imageSrc && !readOnly ? (
                <>
                  <h2 className="text-lg font-medium text-gray-900">
                    Upload Meal Image
                  </h2>
                  <div className="p-6">
                    <ImageUploadLabel handleImageUpload={handleImageUpload} />
                  </div>
                </>
              ) : (
                <div>
                  <Image
                    src={imageSrc || ""}
                    alt="Meal"
                    className="w-full h-auto rounded-md"
                    width={300}
                    height={300}
                    //  objectFit="contain"
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
                    value={meal.weight.toFixed(1)}
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
                      {meal.nutrients && meal.nutrients[macro.tag]
                        ? meal.nutrients[macro.tag].quantity.toFixed(1)
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
                <NutrientsDetails nutrients={meal.nutrients as INutrients} />
              </div>
            </div>
          </div>
          {(!readOnly ||
            !meal.ingredients.every((ing) => ing.foodId === "")) && (
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
      </div>
    </LocalizationProvider>
  );
};

export default MealInputFields;
