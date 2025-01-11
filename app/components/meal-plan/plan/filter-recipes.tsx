import React, { useCallback, useState } from "react";
import { fetchRecipesToExclude } from "@/lib/client/client-side/edamam";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { LabelSection } from "@/models/interfaces/types";
import TextInputWithButton from "../../text-input-with-buttons";
import Labels from "../../labels";
import SelectFoodLabels from "../../food/food-labels-dropdown";
import { IRecipeRequest } from "@/models/interfaces/recipe/recipes-request";
import {
  CuisineType,
  DietLabels,
  HealthLabels,
} from "@/constants/constants-enums";

interface FilterRecipesProps {
  title: string;
  excluded: string[];
  setExcluded: React.Dispatch<React.SetStateAction<string[]>>;
  timeToCook: dayjs.Dayjs | null;
  setTimeToCook: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
}

const FilterRecipes: React.FC<FilterRecipesProps> = ({
  title,
  excluded,
  setExcluded,
  timeToCook,
  setTimeToCook,
}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [excludedLabels, setExcludedLabels] = useState<
    Record<LabelSection, string[]>
  >({
    cuisineType: [],
    dishType: [],
    dietLabels: [],
    healthLabels: [],
    mealTypeKey: [],
    cautions: [],
  });

  const handleAddExcluded = (value: string) => {
    if (!excluded.includes(value)) {
      setLabels((prev) => [...prev, value]);
    }
  };

  const handleRemoveExcluded = (item: string) => {
    setLabels((prev) => prev.filter((ex) => ex !== item));
  };

  const fetchExcludedRecipes = async () => {
    try {
      const recipeRequest: IRecipeRequest = {
        excluded: labels,
        diet: excludedLabels.dietLabels as DietLabels[],
        health: excludedLabels.healthLabels as HealthLabels[],
        cuisineType: excludedLabels.cuisineType as CuisineType[],
        time: timeToCook ? timeToCook.format("HH:mm:ss") : "",
      };

      const fetchedRecipes: IRecipeInterface[] = await fetchRecipesToExclude(
        recipeRequest
      );

      const recipeUris = fetchedRecipes.map((recipe) => recipe.uri);

      setExcluded(recipeUris);
    } catch (error) {
      console.error("Failed to fetch excluded recipes:", error);
    }
  };

  const handleLabelsChange = useCallback(
    (category: LabelSection, selected: string[]) => {
      setExcludedLabels((prev) => ({
        ...prev,
        [category]: selected,
      }));
    },
    []
  );

  return (
    <div className="space-y-4 p-4 bg-gray-50">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-700 text-center">
        {title}
      </h3>

      {/* Main Container with Flex Layout */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* Left Column: Recipe Names and Time to Cook */}
        <div className="flex-1 space-y-4">
          {/* Recipe Names to Exclude */}
          <div className="w-full">
            <TextInputWithButton
              label="Recipe names to exclude"
              placeholder="Add food names to exclude from search"
              buttonText="Add"
              onButtonPress={handleAddExcluded}
              type="exclude"
            />
          </div>

          {/* Display Excluded Recipe URIs */}
          <div>
            <Labels items={labels} onLabelClick={handleRemoveExcluded} />
          </div>

          {/* Time to Cook Picker */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Time to prepare"
                views={["hours", "minutes"]}
                format="HH:mm"
                ampm={false}
                defaultValue={null}
                onAccept={(date) => setTimeToCook(date)}
                value={timeToCook}
                className="mt-2 block w-full rounded-md py-1.5 text-gray-800 focus:ring-2 focus:ring-cyan-500 sm:text-sm"
              />
            </LocalizationProvider>
            {timeToCook && (
              <div className="mt-2 text-gray-700">
                {`${timeToCook.hour()} hour${
                  timeToCook.hour() !== 1 ? "s" : ""
                } ${timeToCook.minute()} minute${
                  timeToCook.minute() !== 1 ? "s" : ""
                }`}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Food Labels */}
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <h4 className="text-gray-700 font-semibold mb-2">
            Labels to Exclude
          </h4>
          <SelectFoodLabels
            data={excludedLabels}
            handleMultiSelectDropdown={handleLabelsChange}
            labelsToShow={["cuisineType", "dietLabels", "healthLabels"]}
            requireSelection={false}
          />
        </div>
      </div>

      {/* Fetch Excluded Recipes Button */}
      <div className="mt-4">
        <button
          onClick={fetchExcludedRecipes}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Confirm Filter
        </button>
      </div>
    </div>
  );
};

export default FilterRecipes;
