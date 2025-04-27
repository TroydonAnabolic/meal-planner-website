import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import CenteredPageNumbers from "../../ui/pagination/centered-page-numbers";
import { MealNumber, MealType } from "@/constants/constants-enums";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is installed: npm install uuid
import { macros } from "@/util/nutrients";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import {
  extractRecipeIdFromUri,
} from "@/util/meal-generator-util";
import { IMealPlan, Section } from "@/models/interfaces/diet/meal-plan";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSearchParams } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/outline";
import RecipeDropdown from "../../recipes/recipe-dropdown";
import { storeMealPlanRecipes } from "@/lib/client-side/recipe";

type RecipeListProps = {
  recipes: IRecipeInterface[];
  mealPlan: GeneratorResponse | IMealPlan;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  allowEmptyRows?: boolean;
  mode?: "view" | "add" | "edit";
};

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  mealPlan,
  startDate,
  endDate,
  allowEmptyRows = false,
  mode = "view",
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Use a mapping from cell key ("dayIndex-mealType") to IRecipeInterface
  const [selectedRecipeMap, setSelectedRecipeMap] = useState<{ [cellKey: string]: IRecipeInterface }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 7; // You have 7 items per page as a constant

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return endDate.diff(startDate, "day") + 1;
  }, [startDate, endDate]);

  const totalPages = Math.ceil(totalDays / ITEMS_PER_PAGE); // Total pages based on the number of days

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;

  const mealNumberOrder = Object.values(MealNumber);

  const currentSelection = useMemo(() => {
    return mealPlan.selection.slice(startIdx, endIdx).map((selectionItem) => {
      const sortedSections = Object.entries(selectionItem.sections)
        .sort(([keyA], [keyB]) => {
          const indexA = mealNumberOrder.indexOf(keyA as MealNumber);
          const indexB = mealNumberOrder.indexOf(keyB as MealNumber);
          return indexA - indexB;
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as { [key: string]: Section });
      return {
        ...selectionItem,
        sections: sortedSections,
      };
    });
  }, [mealPlan, startIdx, endIdx, mealNumberOrder]);

  const recipeMap = useMemo(() => {
    const map = new Map<string, IRecipeInterface>();
    const mealTypeOrder = Object.values(MealType);

    recipes
      .sort((a, b) => {
        const timeComparison = dayjs(a.timeScheduled).diff(dayjs(b.timeScheduled));
        if (timeComparison !== 0) {
          return timeComparison;
        }
        const aMealTypeIndex = mealTypeOrder.findIndex((type) =>
          a.mealTypeKey?.includes(type)
        );
        const bMealTypeIndex = mealTypeOrder.findIndex((type) =>
          b.mealTypeKey?.includes(type)
        );
        return aMealTypeIndex - bMealTypeIndex;
      })
      .forEach((recipe) => {
        const recipeId = extractRecipeIdFromUri(recipe.uri);
        if (recipeId) {
          const compositeKey = `${recipeId}-${dayjs(recipe.timeScheduled).format("YYYY-MM-DD HH:mm:ss")}`;
          if (!map.has(compositeKey)) {
            map.set(compositeKey, recipe);
          }
        }
      });
    return map;
  }, [recipes]);

  const availableMealTypes = useMemo(() => {
    const mealTypeSet = new Set<string>();
    if (currentSelection) {
      currentSelection.forEach((selectionItem) => {
        Object.keys(selectionItem.sections).forEach((mealType) => {
          mealTypeSet.add(mealType);
        });
      });
    }
    return Object.values(MealNumber).filter((mealType) =>
      mealTypeSet.has(mealType)
    );
  }, [currentSelection]);

  const days: { day: string; date: string; dateTime: string }[] = useMemo(() => {
    if (!startDate || !endDate) return [];
    const daysArray = [];
    let current = startDate.clone();
    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      daysArray.push({
        day: current.format("dddd"),
        date: current.format("DD/MM/YYYY"),
        dateTime: current.format("DD/MM/YYYY HH:mm A"),
      });
      current = current.add(1, "day");
    }
    return daysArray.slice(startIdx, endIdx);
  }, [startDate, endDate, startIdx, endIdx]);

  // Save handler for a given cell
  const handleSaveForCell = async (cellKey: string) => {
    setIsSaving(true);
    try {
      const cellRecipe = selectedRecipeMap[cellKey];
      if (!cellRecipe || !cellRecipe.label) {
        console.error("No recipe selected or recipe is invalid.");
        return;
      }

      // Update properties on the cell's recipe
      const mealPlanId = (mealPlan as IMealPlan).id;
      const updatedRecipe: IRecipeInterface = {
        ...cellRecipe,
        mealPlanId,
      };
      // Save the recipe via your API call
      const savedRecipe = await storeMealPlanRecipes([...recipes, updatedRecipe]);
      console.log("Recipe saved for cell", cellKey, ":", savedRecipe);
      // Optionally clear the cell selection after saving:
      setSelectedRecipeMap((prev) => {
        const newMap = { ...prev };
        delete newMap[cellKey];
        return newMap;
      });
    } catch (error) {
      console.error("Error saving recipe for cell", cellKey, ":", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <colgroup>
            <col style={{ width: "20%" }} />
            {availableMealTypes.map((_, index) => (
              <col key={index} style={{ width: `${80 / availableMealTypes.length}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="px-4 py-2 border border-gray-300 bg-gray-100 text-center text-gray-800">
                Day
              </th>
              {availableMealTypes.map((mealType) => (
                <th key={mealType} scope="col" className="px-4 py-2 border border-gray-300 bg-gray-100 text-center text-gray-800">
                  {mealType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentSelection.map((selectionItem, dayIndex) => (
              <tr key={`day-${startIdx + dayIndex}`} className="hover:bg-gray-50 h-24">
                <td scope="row" className="px-4 py-2 border border-gray-300 text-center font-semibold text-gray-800">
                  {days[dayIndex]?.day || "-"}
                  <br />
                  <span className="text-sm">{days[dayIndex]?.date || "-"}</span>
                </td>
                {availableMealTypes.map((mealType) => {
                  // Create a unique key for the cell
                  const cellKey = `${dayIndex}-${mealType}`;
                  // Check for an existing recipe from recipeMap for this cell
                  let recipe: IRecipeInterface | null = null;
                  for (let [key, value] of recipeMap.entries()) {
                    const recipeItem = value as IRecipeInterface;
                    const currentScheduledTime = days[dayIndex]?.date;
                    const recipeScheduledTime = recipeItem.timeScheduled
                      ? dayjs(recipeItem.timeScheduled).format("DD/MM/YYYY")
                      : null;
                    if (
                      recipeItem.mealTypeKey.some((k) =>
                        mealType.toLowerCase().includes(k)
                      ) &&
                      recipeScheduledTime === currentScheduledTime
                    ) {
                      recipe = recipeItem;
                      break;
                    }
                  }
                  return (
                    <td key={`${mealType}-${dayIndex}`} className="px-4 py-2 border border-gray-300 relative">
                      {recipe ? (
                        <div className="flex flex-col relative items-center group">
                          {recipe.isFavourite && (
                            <span className="absolute top-2 left-2 flex items-center bg-yellow-500 text-white text-xs px-2 py-1 rounded-full z-10 opacity-80">
                              <StarIcon className="h-4 w-4 mr-1" />
                              Favourite
                            </span>
                          )}
                          <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={100}
                            height={100}
                            className="w-full h-24 object-contain rounded"
                          />
                          <span className="text-sm font-medium text-gray-800 mt-2 truncate w-full" title={recipe.label}>
                            {recipe.label}
                          </span>
                          {recipe.yield && (
                            <span className="text-xs text-gray-600 mt-1">
                              Yield: {recipe.yield} servings
                            </span>
                          )}
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            {macros.map((macro) => (
                              <div key={macro.tag} className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-gray-200">
                                <span>{macro.icon}</span>
                                <span className={`text-xs mt-1 ${macro.className}`}>
                                  {recipe.totalNutrients && recipe.totalNutrients[macro.tag]
                                    ? `${(recipe.totalNutrients[macro.tag].quantity / recipe.yield).toFixed(0)}${macro.unit}`
                                    : "0g"}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 overflow-auto rounded-md flex flex-col items-center" aria-label={`View details for ${recipe.label}`}>
                            <h3 className="text-sm font-semibold mb-1">{recipe.label}</h3>
                            <h4 className="text-sm font-semibold mb-1">Ingredients:</h4>
                            <ul className="text-xs list-disc list-inside">
                              {recipe.ingredientLines.map((line, idx) => (
                                <li key={idx}>{line}</li>
                              ))}
                            </ul>
                            <Link
                              href={
                                mode === "view"
                                  ? `${ROUTES.MEAL_PLANNER.RECIPES.VIEW_RECIPE_DETAILS}/${extractRecipeIdFromUri(recipe.uri)}`
                                  : `${ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES}?page=1&action=edit&id=${recipe.id}`
                              }
                              target="_blank"
                              className="text-sm mt-2 bg-white text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
                              aria-label={`View details for ${recipe.label}`}
                            >
                              {mode === "view" ? "View Details" : "Edit Recipe"}
                            </Link>
                          </div>
                        </div>
                      ) : allowEmptyRows && mode === "edit" && !recipe ? (
                        <div className="mb-4">

                          {selectedRecipeMap[cellKey] ? (
                            <div className="mt-2 text-sm text-gray-600">
                              Selected: {selectedRecipeMap[cellKey].label}
                              <div className="mt-4 flex justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveForCell(cellKey)}
                                  disabled={
                                    isSaving ||
                                    !selectedRecipeMap[cellKey] ||
                                    !selectedRecipeMap[cellKey].label
                                  }
                                  className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                  {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedRecipeMap((prev) => {
                                      const newMap = { ...prev };
                                      delete newMap[cellKey];
                                      return newMap;
                                    })
                                  }
                                  className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          ) : (
                            <RecipeDropdown
                              clientId={(mealPlan as IMealPlan).clientId || 0}
                              onSelect={(r) => {
                                r.timeScheduled = dayjs(days[dayIndex].dateTime, "DD/MM/YYYY HH:mm A").toDate();
                                r.mealTypeKey = [mealType.toLowerCase()];
                                setSelectedRecipeMap((prev) => ({ ...prev, [cellKey]: r }));
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <CenteredPageNumbers
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default RecipeList;