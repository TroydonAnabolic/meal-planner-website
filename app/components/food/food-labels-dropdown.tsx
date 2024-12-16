import React, { useCallback } from "react";
import MultiSelectDropdownCheckbox from "../ui/inputs/multi-select-dropdown";
import {
  MealType,
  DietLabels,
  HealthLabels,
  CuisineType,
  DishType,
  AllergyLabels,
} from "@/constants/constants-enums";
import { LabelSection } from "@/models/interfaces/types";

type SelectFoodLabelsProps<T> = {
  data: T;
  readOnly?: boolean;
  labelsToShow?: LabelSection[];
  requireSelection?: boolean;
  handleMultiSelectDropdown: (type: keyof T, selected: string[]) => void;
};

const SelectFoodLabels = <T,>({
  data,
  readOnly,
  labelsToShow = [
    "mealTypeKey",
    "dietLabels",
    "healthLabels",
    "cuisineType",
    "dishType",
    "cautions",
  ],
  requireSelection = false,
  handleMultiSelectDropdown,
}: SelectFoodLabelsProps<T>) => {
  const labelSections: {
    [key in LabelSection]: {
      title: string;
      options: { label: string; value: string }[];
      typeKey: keyof T;
    };
  } = {
    mealTypeKey: {
      title: "Meal Types",
      options: Object.keys(MealType).map((label) => ({
        label: label.replace(/-/g, " "),
        value: label,
      })),
      typeKey: "mealTypeKey" as keyof T,
    },
    dietLabels: {
      title: "Diet Labels",
      options: Object.values(DietLabels).map((label) => ({
        label: label.replace(/-/g, " "),
        value: label,
      })),
      typeKey: "dietLabels" as keyof T,
    },
    healthLabels: {
      title: "Health Labels",
      options: Object.values(HealthLabels).map((label) => ({
        label: label.replace(/-/g, " "),
        value: label,
      })),
      typeKey: "healthLabels" as keyof T,
    },
    cuisineType: {
      title: "Cuisine Types",
      options: Object.values(CuisineType).map((cuisine) => ({
        label: cuisine.replace(/-/g, " "),
        value: cuisine,
      })),
      typeKey: "cuisineType" as keyof T,
    },
    dishType: {
      title: "Dish Types",
      options: Object.values(DishType).map((dish) => ({
        label: dish.replace(/-/g, " "),
        value: dish,
      })),
      typeKey: "dishType" as keyof T,
    },
    cautions: {
      title: "Allergy Labels",
      options: Object.values(AllergyLabels).map((caution) => ({
        label: caution.replace(/-/g, " "),
        value: caution,
      })),
      typeKey: "cautions" as keyof T,
    },
  };

  return (
    <>
      {labelSections &&
        labelsToShow?.map((section) => {
          const { title, options, typeKey } = labelSections[section];
          return (
            <div key={section} className="">
              <MultiSelectDropdownCheckbox
                title={title}
                options={options}
                selectedValues={data[typeKey] as string[]}
                onSelect={(selected) =>
                  handleMultiSelectDropdown(typeKey, selected)
                }
                requireSelection={requireSelection}
                readOnly={readOnly}
              />
            </div>
          );
        })}
    </>
  );
};

export default SelectFoodLabels;
