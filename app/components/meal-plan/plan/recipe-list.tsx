// RecipeList.tsx

import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import Image from "next/image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import CenteredPageNumbers from "../../ui/pagination/centered-page-numbers";
import { MealNumber } from "@/constants/constants-enums";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is installed: npm install uuid
import { macros } from "@/util/nutrients";
import { Dayjs } from "dayjs";
import {
  extractRecipeIdFromHref,
  extractRecipeIdFromUri,
} from "@/util/meal-generator-util";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSearchParams } from "next/navigation";

type RecipeListProps = {
  recipes: IRecipeInterface[];
  mealPlan: GeneratorResponse | IMealPlan;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  allowEmptyRows?: boolean;
  mode?: "view" | "add" | "edit";
};

// TODO: Add view recipe and use dynamic routes
const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  mealPlan,
  startDate,
  endDate,
  allowEmptyRows = false,
  mode = "view",
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();

  const ITEMS_PER_PAGE = 7;
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return endDate.diff(startDate, "day") + 1;
  }, [startDate, endDate]);

  const totalPages = Math.ceil(totalDays / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentSelection = mealPlan.selection.slice(startIdx, endIdx);

  // Create a map of extracted recipe IDs to recipe objects
  // const recipeMap = useMemo(() => {
  //   const map = new Map<string, IRecipeInterface>();
  //   recipes.forEach((recipe) => {
  //     const recipeId = extractRecipeIdFromUri(recipe.uri);
  //     if (recipeId) {
  //       // Handle duplicates by appending a GUID
  //       if ([...map.keys()].some((key) => key.startsWith(recipeId))) {
  //         map.set(`${recipeId}-${uuidv4()}`, recipe);
  //       } else {
  //         map.set(recipeId, recipe);
  //       }
  //     }
  //   });
  //   return map;
  // }, [recipes]);

  const recipeMap = useMemo(() => {
    const map = new Map<string, IRecipeInterface>();
    recipes.forEach((recipe) => {
      const recipeId = extractRecipeIdFromUri(recipe.uri);
      if (recipeId && !map.has(recipeId)) {
        map.set(recipeId, recipe);
      }
    });
    return map;
  }, [recipes]);

  // Extract all used recipe IDs from mealPlan
  const usedRecipeIds = useMemo(() => {
    const ids = new Set<string>();
    mealPlan.selection.forEach((selectionItem) => {
      Object.values(selectionItem.sections).forEach((section) => {
        const sectionId = extractRecipeIdFromHref(section._links.self.href);
        if (sectionId) {
          ids.add(sectionId);
        }
      });
    });
    return ids;
  }, [mealPlan]);

  // Find missing recipes
  const missingRecipes = useMemo(() => {
    return Array.from(recipeMap.entries())
      .filter(([id]) => !usedRecipeIds.has(id))
      .map(([, recipe]) => recipe);
  }, [recipeMap, usedRecipeIds]);

  // Determine which mealTypes are present across all days
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

  // Generate days based on startDate
  const days: { day: string; date: string }[] = useMemo(() => {
    if (!startDate || !endDate) return [];
    const daysArray = [];
    let current = startDate.clone();
    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      daysArray.push({
        day: current.format("dddd"),
        date: current.format("DD/MM/YYYY"),
      });
      current = current.add(1, "day");
    }
    return daysArray.slice(startIdx, endIdx);
  }, [startDate, endDate, startIdx, endIdx]);

  const usedRecipeIdsByGroup = useRef<Map<string, Set<string>>>(new Map());

  const createQueryString = useCallback(
    (params: { [key: string]: string | string[] }) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => searchParams.append(key, val));
        } else {
          searchParams.set(key, value);
        }
      });
      return searchParams.toString();
    },
    []
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-300">
          {/* Define Column Widths */}
          <colgroup>
            {/* Day Column */}
            <col style={{ width: "20%" }} />
            {availableMealTypes.map((_, index) => (
              <col
                key={index}
                style={{ width: `${80 / availableMealTypes.length}%` }}
              />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-2 border border-gray-300 bg-gray-100 text-center text-gray-800"
              >
                Day
              </th>
              {availableMealTypes.map((mealType) => (
                <th
                  key={mealType}
                  scope="col"
                  className="px-4 py-2 border border-gray-300 bg-gray-100 text-center text-gray-800"
                >
                  {mealType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentSelection.map((selectionItem, dayIndex) => (
              <tr
                key={`day-${startIdx + dayIndex}`}
                className="hover:bg-gray-50 h-24"
              >
                {/* Day Header */}
                <td
                  scope="row"
                  className="px-4 py-2 border border-gray-300 text-center font-semibold text-gray-800"
                >
                  {days[dayIndex]?.day || "-"}
                  <br />
                  <span className="text-sm">{days[dayIndex]?.date || "-"}</span>
                </td>
                {/* Meal Types */}
                {availableMealTypes.map((mealType) => {
                  const section = selectionItem.sections[mealType];
                  let recipe: IRecipeInterface | null = null;

                  if (section) {
                    const sectionId = extractRecipeIdFromHref(
                      section._links.self.href
                    );
                    if (sectionId) {
                      // Find the recipe by extracted ID
                      for (let key of recipeMap.keys()) {
                        if (key.startsWith(sectionId)) {
                          recipe = recipeMap.get(key) || null;
                          break;
                        }
                      }
                    }
                  }

                  // If no recipe is found, assign a missing recipe
                  if (!recipe) {
                    for (let [key, value] of recipeMap.entries()) {
                      if (![...usedRecipeIds].includes(key)) {
                        // identify how to map recipe.timeScheduled maps to dayIndex and only assign when match
                        const recipeMissing = value as IRecipeInterface;
                        const currentScheduledTime = days[dayIndex]?.date;
                        const recipeScheduledTime =
                          recipeMissing.timeScheduled?.toLocaleDateString();

                        const currentMealType = [mealType] as string[];

                        if (
                          recipeMissing.mealType == currentMealType &&
                          recipeScheduledTime == currentScheduledTime
                        ) {
                        }
                        recipe = value;
                        break;
                      }
                    }
                  }

                  return (
                    <td
                      key={`${mealType}-${dayIndex}`}
                      className="px-4 py-2 border border-gray-300 relative"
                    >
                      {recipe ? (
                        <div className="flex flex-col items-center group">
                          <Image
                            src={recipe.image}
                            alt={recipe.label}
                            width={100}
                            height={100}
                            className="w-full h-24 object-contain rounded"
                          />
                          <span
                            className="text-sm font-medium text-gray-800 mt-2 truncate w-full"
                            title={recipe.label}
                          >
                            {recipe.label}
                          </span>

                          {/* Display Yield */}
                          {recipe.yield && (
                            <span className="text-xs text-gray-600 mt-1">
                              Yield: {recipe.yield} servings
                            </span>
                          )}

                          {/* Display Macros */}
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            {macros.map((macro) => (
                              <div
                                key={macro.tag}
                                className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-gray-200"
                              >
                                <span>{macro.icon}</span>
                                <span
                                  className={`text-xs mt-1 ${macro.className}`}
                                >
                                  {recipe.totalNutrients &&
                                  recipe.totalNutrients[macro.tag]
                                    ? `${recipe.totalNutrients[
                                        macro.tag
                                      ].quantity.toFixed(0)}${macro.unit}`
                                    : "0g"}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Ingredient Lines Overlay */}
                          <div
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 overflow-auto rounded-md flex flex-col items-center"
                            aria-label={`View details for ${recipe.label}`}
                          >
                            <h3 className="text-sm font-semibold mb-1">
                              {recipe.label}
                            </h3>
                            <h4 className="text-sm font-semibold mb-1">
                              Ingredients:
                            </h4>
                            <ul className="text-xs list-disc list-inside">
                              {recipe.ingredientLines.map((line, idx) => (
                                <li key={idx}>{line}</li>
                              ))}
                            </ul>
                            <Link
                              href={
                                mode === "view"
                                  ? `${
                                      ROUTES.MEAL_PLANNER.RECIPES
                                        .VIEW_RECIPE_DETAILS
                                    }/${extractRecipeIdFromUri(recipe.uri)}`
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
                      ) : // if there is no recipe on this cell then add it
                      allowEmptyRows && mode === "edit" ? (
                        <Link
                          // href={`${
                          //   ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES
                          // }?page=1&action=add&${createQueryString(
                          //   "mealType",
                          //   mealType
                          // )}&${createQueryString(
                          //   "timeScheduled",
                          //   days[dayIndex]?.date || ""
                          // )}&${createQueryString(
                          //   "mealPlanId",
                          //   (mealPlan as IMealPlan).id.toString()
                          // )}`}
                          href={`${
                            ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES
                          }?${createQueryString({
                            page: "1",
                            action: "add",
                            mealType: mealType,
                            timeScheduled: days[dayIndex]?.date || "",
                            mealPlanId:
                              (mealPlan as IMealPlan).id.toString() || "0",
                          })}`}
                          target="_blank"
                          className="flex flex-col items-center justify-center h-full w-full"
                          aria-label="Add a recipe"
                        >
                          <span className="text-gray-500">+</span>
                          <span className="text-sm text-gray-500">
                            Add Recipe
                          </span>
                        </Link>
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

      {/* Pagination */}
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
