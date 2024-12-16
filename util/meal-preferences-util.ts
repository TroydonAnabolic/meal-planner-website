// meal-preferences-util.ts

/**
 * Utility functions for Meal Preferences components.
 */

import { Step } from "@/app/components/ui/progress-bars/panels-with-border";
import { MealNumber } from "@/constants/constants-enums";
import { defaultMealPlanPreference } from "@/constants/constants-objects";
import { Labels } from "@/hooks/use-labels";
import { IClientInterface } from "@/models/interfaces/client/client";
import {
  AllMealSection,
  IMealPlanPreferences,
} from "@/models/interfaces/client/meal-planner-preferences";
import { clear } from "console";

/**
 * Generates the filter steps for the PanelWithBorders component.
 *
 * @param mealPlanPreferences - The current meal plan preferences.
 * @param currentStepId - The ID of the current active step.
 * @param currentMealType - The currently viewed meal type section, if any.
 * @returns An array of Step objects representing each filter step with updated statuses.
 */
export const getFilterSteps = (
  mealPlanPreferences: IMealPlanPreferences,
  currentStepId: string,
  currentMealType: string | null
): Step[] => {
  let steps: Step[] = [];

  if (currentMealType) {
    // Steps specific to the currently viewed meal section
    steps = getMealTypeSteps(currentMealType);
  } else {
    // Global steps for all meals
    steps = [
      {
        id: "allmeals-health-diet",
        name: "Health & Diet Labels",
        description: "Manage health and diet preferences for all meals.",
        href: "#allmeals-health-diet",
        status: "upcoming",
      },
      {
        id: "allmeals-caution-cuisine",
        name: "Caution & Cuisine Labels",
        description: "Manage caution and cuisine preferences for all meals.",
        href: "#allmeals-caution-cuisine",
        status: "upcoming",
      },
      {
        id: "allmeals-nutrients",
        name: "Nutrient Constraints",
        description: "Set nutrient preferences for all meals.",
        href: "#allmeals-nutrients",
        status: "upcoming",
      },
      {
        id: "meal-type-selection",
        name: "Meal Type Selection",
        description: "Select meal types to configure individual settings.",
        href: "#meal-type-selection",
        status: "upcoming",
      },
    ];
  }

  // Determine the current step index
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  // Update step statuses based on currentStepId
  const updatedSteps = steps.map((step, index) => {
    if (index < currentIndex) {
      return { ...step, status: "upcoming" as any }; // Adjust status as needed
    } else if (index === currentIndex) {
      return { ...step, status: "current" as any };
    } else {
      return { ...step, status: "upcoming" as any };
    }
  });

  return updatedSteps;
};

/**
 * Generates the sidebar steps for the BulletsWithText component.
 *
 * @param selectedMealTypes - Array of currently selected meal types.
 * @param currentStepId - The ID of the current active step.
 * @param currentMealType - The currently viewed meal type section, if any.
 * @returns An array of Step objects representing each sidebar step with updated statuses.
 */
export const getSidebarSteps = (
  selectedMealTypes: string[],
  currentStepId: string,
  currentMealType: string | null
): Step[] => {
  let sidebarSteps: Step[] = [];

  if (currentMealType) {
    // If viewing a specific meal section, highlight it in the sidebar
    sidebarSteps = [
      {
        id: "allmeals",
        name: "All Meals Preferences",
        description: "Overview of all meal preferences.",
        href: "#allmeals",
        status: "upcoming",
      },
      ...selectedMealTypes.map((mealType) => ({
        id: `meal-section-${mealType.toLowerCase().replace(/\s+/g, "-")}`,
        name: `${mealType} Preferences`,
        description: `Configure preferences for ${mealType}.`,
        href: `#meal-section-${mealType.toLowerCase().replace(/\s+/g, "-")}`,
        status:
          mealType === currentMealType
            ? "current"
            : ("upcoming" as "current" | "upcoming"),
      })),
    ];
  } else {
    // Parent navigation steps
    sidebarSteps = [
      {
        id: "allmeals",
        name: "All Meals Preferences",
        description: "Overview of all meal preferences.",
        href: "#allmeals",
        status: "current",
      },
      ...selectedMealTypes.map((mealType) => ({
        id: `meal-section-${mealType.toLowerCase().replace(/\s+/g, "-")}`,
        name: `${mealType} Preferences`,
        description: `Configure preferences for ${mealType}.`,
        href: `#meal-section-${mealType.toLowerCase().replace(/\s+/g, "-")}`,
        status: "upcoming" as "current" | "upcoming",
      })),
    ];
  }

  // Determine the position of currentStepId in sidebarSteps
  const currentIndex = sidebarSteps.findIndex(
    (step) => step.id === currentStepId
  );

  // Update step statuses based on currentStepId
  const updatedSidebarSteps = sidebarSteps.map((step, index) => {
    if (index < currentIndex) {
      return { ...step, status: "upcoming" as any }; // Adjust status as needed
    } else if (index === currentIndex) {
      return { ...step, status: "current" as any };
    } else {
      return { ...step, status: "upcoming" as any };
    }
  });

  return updatedSidebarSteps;
};

/**
 * Initializes nutrient ranges with default values if not already set.
 *
 * @param nutrientRanges - Current nutrient ranges.
 * @param nutrientsToAdd - Array of nutrients to initialize.
 * @returns Updated nutrient ranges with defaults added.
 */
export const initializeNutrientRanges = (
  nutrientRanges: { [key: string]: { min: number; max: number } },
  nutrientsToAdd: string[]
): { [key: string]: { min: number; max: number } } => {
  const updatedRanges = { ...nutrientRanges };
  nutrientsToAdd.forEach((nutrient) => {
    if (!updatedRanges[nutrient]) {
      updatedRanges[nutrient] = { min: 0, max: 100 };
    }
  });
  return updatedRanges;
};

/**
 * Generates steps for a specific meal type.
 *
 * @param mealType - The selected meal type.
 * @returns An array of Step objects representing each step for the meal type.
 */
export const getMealTypeSteps = (mealType: string): Step[] => {
  return [
    {
      id: `${mealType}-health-diet`.toLocaleLowerCase().replace(/\s+/g, "-"),
      name: "Health & Diet Labels",
      description: `Manage health and diet preferences for ${mealType}.`,
      href: `#${mealType}-health-diet`,
      status: "upcoming",
    },
    {
      id: `${mealType}-caution-cuisine`
        .toLocaleLowerCase()
        .replace(/\s+/g, "-"),
      name: "Caution & Cuisine Labels",
      description: `Manage caution and cuisine preferences for ${mealType}.`,
      href: `#${mealType}-caution-cuisine`,
      status: "upcoming",
    },
    {
      id: `${mealType}-dish-only-dish`.toLocaleLowerCase().replace(/\s+/g, "-"),
      name: "Dish & Only Dish Labels",
      description: `Manage dish and only-dish preferences for ${mealType}.`,
      href: `#${mealType}-dish-only-dish`,
      status: "upcoming",
    },
    {
      id: `${mealType}-nutrients`.toLocaleLowerCase().replace(/\s+/g, "-"),
      name: "Nutrient Constraints",
      description: `Set nutrient preferences for ${mealType}.`,
      href: `#${mealType}-nutrients`,
      status: "upcoming",
    },
  ];
};

/**
 * Toggles the default configuration for meal preferences.
 *
 * @param useDefaultConfig - Current state of default config toggle.
 * @param setUseDefaultConfig - Setter for useDefaultConfig state.
 * @param setPlanLabels - Setter for labels state.
 * @param setSelectedMealTypes - Setter for selectedMealTypes state.
 * @param setPlanSelectedNutrients - Setter for selectedNutrients state.
 * @param setPlanNutrientRanges - Setter for nutrientRanges state.
 * @param handleMealPlanPreferencesChange - Function to update meal plan preferences.
 * @param handlePlanSectionChange - Function to update meal plan preferences section.
 * @param clientData - Client data for resetting to client settings.
 */
export const toggleDefaultConfig = (
  useDefaultConfig: boolean,
  setUseDefaultConfig: React.Dispatch<React.SetStateAction<boolean>>,
  setPlanLabels: React.Dispatch<React.SetStateAction<any>>,
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>,
  setPlanSelectedNutrients: React.Dispatch<React.SetStateAction<string[]>>,
  setPlanNutrientRanges: React.Dispatch<React.SetStateAction<any>>,
  handleMealPlanPreferencesChange: (
    updatedPreferences: IMealPlanPreferences
  ) => void,
  handlePlanSectionChange: (updatedSection: AllMealSection) => void,
  clientData: IClientInterface,
  setCurrentMealType: (type: string | null) => void
) => {
  const newValue = !useDefaultConfig;
  setUseDefaultConfig(newValue);

  if (newValue) {
    // Set default label values for the plan
    const planLabels: Labels = {
      health:
        defaultMealPlanPreference.plan.accept?.all?.flatMap(
          (condition) => condition.health || []
        ) || [],
      diet:
        defaultMealPlanPreference.plan.accept?.all?.flatMap(
          (condition) => condition.diet || []
        ) || [],
      caution:
        defaultMealPlanPreference.plan.accept?.all?.flatMap(
          (condition) => condition.caution || []
        ) || [],
      cuisine:
        defaultMealPlanPreference.plan.accept?.all?.flatMap(
          (condition) => condition.cuisine || []
        ) || [],
    };

    setPlanLabels(planLabels);

    // Set default meal types
    setSelectedMealTypes(
      Object.keys(defaultMealPlanPreference.plan.sections || {})
    );

    // Set default nutrients for the plan
    setPlanSelectedNutrients(
      Object.keys(defaultMealPlanPreference.plan.fit || {})
    );

    // Set default nutrient ranges for the plan
    setPlanNutrientRanges(defaultMealPlanPreference.plan.fit || {});

    // Initialize 'accept' for each section
    handlePlanSectionChange(defaultMealPlanPreference.plan);

    // Update meal plan preferences with defaults
  } else {
    // Reset labels to client settings for the plan
    resetMealPlanPreferences(
      setPlanLabels,
      clientData,
      setSelectedMealTypes,
      setPlanSelectedNutrients,
      setPlanNutrientRanges,
      handleMealPlanPreferencesChange
    );
  }

  // Ensure active meal type is set to null to avoid referencing undefined types
  setCurrentMealType(null);
};

export function resetMealPlanPreferences(
  setPlanLabels: React.Dispatch<React.SetStateAction<Labels>>,
  clientData: IClientInterface,
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>,
  setPlanSelectedNutrients: React.Dispatch<React.SetStateAction<string[]>>,
  setPlanNutrientRanges: React.Dispatch<React.SetStateAction<any>>,
  handleMealPlanPreferencesChange: (
    updatedPreferences: IMealPlanPreferences
  ) => void
) {
  setPlanLabels({
    health:
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.accept?.all?.flatMap(
        (condition: any) => condition.health || []
      ) || [],
    diet:
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.accept?.all?.flatMap(
        (condition: any) => condition.diet || []
      ) || [],
    caution:
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.accept?.all?.flatMap(
        (condition: any) => condition.caution || []
      ) || [],
    cuisine:
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.accept?.all?.flatMap(
        (condition: any) => condition.cuisine || []
      ) || [],
  });

  // Reset meal types to client settings
  setSelectedMealTypes(
    Object.keys(
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.sections || {}
    )
  );

  // Reset selected nutrients for the plan to client settings
  setPlanSelectedNutrients(
    Object.keys(
      clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit || {}
    )
  );

  // Reset nutrient ranges for the plan to client settings
  setPlanNutrientRanges(
    clientData.ClientSettingsDto?.mealPlanPreferences?.plan.fit || {}
  );

  // Initialize 'accept' for each section from client data
  const clientSections =
    clientData.ClientSettingsDto?.mealPlanPreferences?.plan.sections ||
    undefined;

  // Update meal plan preferences with client settings
  handleMealPlanPreferencesChange(
    clientData.ClientSettingsDto?.mealPlanPreferences ||
      ({
        size: 7,
        plan: {},
      } as IMealPlanPreferences)
  );

  // Ensure 'accept' is initialized for each section
  handleMealPlanPreferencesChange({
    ...clientData.ClientSettingsDto?.mealPlanPreferences,
    size: clientData.ClientSettingsDto?.mealPlanPreferences?.size!,
    plan: {
      ...clientData.ClientSettingsDto?.mealPlanPreferences?.plan,
      sections: clientSections,
    },
  });
}
