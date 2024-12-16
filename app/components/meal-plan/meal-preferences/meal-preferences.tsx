// MealPreferencesSection.tsx
"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react"; // Add useEffect to imports
import {
  HealthLabels,
  DietLabels,
  AllergyLabels,
  CuisineType,
  Nutrients,
} from "@/constants/constants-enums";

import MealTypeCheckBoxes from "@/app/components/meal-plan/meal-preferences/meal-type-checkboxes";
import { IClientInterface } from "@/models/interfaces/client/client";
import { useFormState } from "react-dom";

import {
  AllMealSection,
  IMealPlanPreferences,
  MealSection,
} from "@/models/interfaces/client/meal-planner-preferences";
import { saveMealPlanPreference } from "@/actions/client-settings-action";

import React from "react";
import {
  getFilterSteps,
  getSidebarSteps,
  getMealTypeSteps,
  toggleDefaultConfig,
  resetMealPlanPreferences,
} from "@/util/meal-preferences-util";
import { toggleSelectionGeneric as toggleSelection } from "@/util/generic-utils";
import useNutrients from "@/hooks/use-nutrients";
import useLabels from "@/hooks/use-labels";
import FormButton from "../../ui/buttons/form-button";
import CheckboxGroup from "../../ui/inputs/checkbox-group-input";
import ToggleInput from "../../ui/inputs/toggle-input";
import BulletsWithText from "../../ui/progress-bars/bullets-with-text";
import PanelWithBorders, {
  Step,
} from "../../ui/progress-bars/panels-with-border";
import NutrientSlider from "./nutrients-slider";
import ConfirmActionModal, {
  ConfirmActionModalProps,
} from "../../ui/modals/confirm-action-modal";
const MealSectionComponent = React.lazy(() => import("./meal-section"));
const SummaryTable = React.lazy(() => import("./summary-table"));

type MealPreferencesSectionProps = {
  clientData: IClientInterface;
};

// TODO: Try to fix re-renders, and generate tests to do manual and automatically
const MealPreferencesSection: React.FC<MealPreferencesSectionProps> = ({
  clientData,
}) => {
  // Initialize render count
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`MealPreferencesSection rendered ${renderCount.current} times`);

  // Initialize state
  const [client, setClient] = useState<IClientInterface>(clientData);
  const [formData, formAction, isPending] = useFormState(
    saveMealPlanPreference.bind(null, client.ClientSettingsDto!),
    {
      success: false,
    }
  );
  // Initialize mealPlanPreferences state with default sections if undefined
  const [mealPlanPreferences, setMealPlanPreferences] =
    useState<IMealPlanPreferences>(
      client.ClientSettingsDto?.mealPlanPreferences || {
        size: 7,
        plan: {
          accept: {
            health: [],
            diet: [],
            caution: [],
            cuisine: [],
            // Add other categories if necessary
          },
          fit: {},
          exclude: [],
          sections: {}, // Ensure sections is initialized as an empty object
        },
      }
    );

  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(
    Object.keys(mealPlanPreferences.plan.sections || {})
  );

  // State for current step and currently viewed meal type
  const [currentStepId, setCurrentStepId] = useState<string>(
    "allmeals-health-diet"
  );
  const [currentMealType, setCurrentMealType] = useState<string | null>(null); // New state
  const [useDefaultConfig, setUseDefaultConfig] = useState(false);
  const [modalProps, setModalProps] = useState<ConfirmActionModalProps>({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    onConfirm: () => handleCloseModal(),
  });

  const handleCloseModal = () => {
    setModalProps((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (formData?.success) {
      setModalProps({
        open: true,
        title: "Success",
        message: "Meal plan preferences have been saved successfully.",
        confirmText: "OK",
        onConfirm: handleCloseModal,
      });
    } else if (formData?.errors) {
      const errorMessage =
        formData?.errors?.general || "An error occurred while saving.";

      setModalProps({
        open: true,
        title: "Error",
        message: errorMessage,
        confirmText: "OK",
        onConfirm: handleCloseModal,
      });
    }
    handleCancel();
  }, [formData?.success, formData?.errors]);

  // Handler to update mealPlanPreferences
  const handleMealPlanPreferencesChange = useCallback(
    (updatedPreferences: IMealPlanPreferences) => {
      setMealPlanPreferences(updatedPreferences);
      // Update client.ClientSettingsDto.mealPlanPreferences
      setClient((prevClient) => {
        const updatedClient = {
          ...prevClient,
          ClientSettingsDto: {
            ...prevClient.ClientSettingsDto!,
            mealPlanPreferences: updatedPreferences,
          },
        };
        return updatedClient;
      });
    },
    []
  );

  // Handler to update the overall plan section
  const handlePlanSectionChange = useCallback(
    (updatedSection: AllMealSection) => {
      handleMealPlanPreferencesChange({
        ...mealPlanPreferences,
        plan: updatedSection,
      });
    },
    [mealPlanPreferences, handleMealPlanPreferencesChange]
  );

  const handleSectionChange = useCallback(
    (mealType: string, updatedSection: MealSection) => {
      handleMealPlanPreferencesChange({
        ...mealPlanPreferences,
        plan: {
          ...mealPlanPreferences.plan,
          sections: {
            ...mealPlanPreferences.plan.sections,
            [mealType]: {
              ...updatedSection,
              accept: updatedSection.accept,
            },
          },
        },
      });
    },
    [mealPlanPreferences, handleMealPlanPreferencesChange]
  );

  // Initialize labels for the overall plan using the custom hook
  const {
    labels: planLabels,
    handleLabelChange: handlePlanLabelChange,
    setLabels: setPlanLabels,
  } = useLabels(mealPlanPreferences.plan, handlePlanSectionChange);

  // Initialize nutrients for the overall plan using the custom hook
  const {
    selectedNutrients: planSelectedNutrients,
    nutrientRanges: planNutrientRanges,
    handleNutrientChange: handlePlanNutrientChange,
    handleNutrientRangeChange: handlePlanNutrientRangeChange,
    setSelectedNutrients: setPlanSelectedNutrients,
    setNutrientRanges: setPlanNutrientRanges,
  } = useNutrients({
    initialSection: mealPlanPreferences.plan,
    handleSectionChange: handlePlanSectionChange,
  });

  // Modify handleMealTypeChange to support currentMealType
  const handleMealTypeChange = useCallback(
    (type: string) => {
      const updatedMealTypes = toggleSelection(selectedMealTypes, type);
      setSelectedMealTypes(updatedMealTypes);

      // If the selected meal type is newly added, navigate to it
      if (updatedMealTypes.includes(type)) {
        setCurrentMealType(type);
        setCurrentStepId(
          `${type.toLowerCase().replace(/\s+/g, "-")}-health-diet`
        );
      }
    },
    [selectedMealTypes]
  );

  // Define steps for the right panel's PanelWithBorders component
  const filterSteps: Step[] = useMemo(
    () => getFilterSteps(mealPlanPreferences, currentStepId, currentMealType),
    [mealPlanPreferences, currentStepId, currentMealType]
  );

  // Define steps for the left panel's BulletsWithText component
  const sidebarSteps: Step[] = useMemo(
    () =>
      getSidebarSteps(
        selectedMealTypes,
        currentMealType
          ? `meal-section-${currentMealType
              ?.toLowerCase()
              .replace(/\s+/g, "-")}`
          : "allmeals",
        currentMealType
      ),
    [selectedMealTypes, currentMealType]
  );

  // Handler to change the current step
  const handlePanelStepChange = (stepId: string) => {
    setCurrentStepId(stepId);
    // Determine if the stepId corresponds to a specific meal type
    if (stepId.startsWith("allmeals-")) {
      setCurrentMealType(null);
    } else {
      const mealTypeMatch = stepId.match(/^(.*?)-health-diet$/);
      if (mealTypeMatch) {
        const mealType = mealTypeMatch[1].replace(/-/g, " ");
        const capitalizedMealType =
          mealType.charAt(0).toUpperCase() + mealType.slice(1);
        setCurrentMealType(capitalizedMealType);
      } else {
        setCurrentMealType(null);
      }
    }
  };

  const handleSidebarStepChange = (stepId: string) => {
    if (stepId === "allmeals") {
      setCurrentMealType(null);
      setCurrentStepId("allmeals-health-diet");
    } else if (stepId.startsWith("meal-section-")) {
      const mealType = stepId.replace("meal-section-", "").replace(/-/g, " ");
      const capitalizedMealType =
        mealType.charAt(0).toUpperCase() + mealType.slice(1);
      setCurrentMealType(capitalizedMealType);
      setCurrentStepId(
        `${mealType.toLowerCase().replace(/\s+/g, "-")}-health-diet`
      );
    }
  };

  // Initialize render count
  console.log(`Plan label values (${planLabels.health})`);

  // New state for confirmation
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Handler for confirming selections
  const handleConfirmSelection = () => {
    setIsConfirmed(true);
  };

  // Handler for cancelling confirmation
  const handleCancel = () => {
    setIsConfirmed(false);
  };

  // Handler for clearing selections
  const handleClearSelection = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your selections?"
    );
    if (confirmed) {
      setUseDefaultConfig(false);
      resetMealPlanPreferences(
        setPlanLabels,
        clientData,
        setSelectedMealTypes,
        setPlanSelectedNutrients,
        setPlanNutrientRanges,
        handleMealPlanPreferencesChange
      );
    }
  };

  // Reset confirmation when preferences change
  useEffect(() => {
    setIsConfirmed(false);
  }, [mealPlanPreferences]);

  return (
    <div className=" grid max-w-7xl grid-cols-1 gap-x-8   md:grid-cols-3 ">
      {/* Left Panel */}
      <div className="flex flex-1 flex-col space-y-6 border border-gray-300 p-6 bg-gray-50 pr-4 items-center w-full">
        <h2 className="text-xl font-bold leading-8 text-gray-900 w-full">
          Meal Preferences
        </h2>
        <p className="text-sm leading-6 text-gray-500 w-full">
          Navigate through your meal preference steps.
        </p>

        {/* Default Config Toggle */}
        <ToggleInput
          label="Use Default Config"
          subLabel=""
          enabled={useDefaultConfig}
          onChange={() =>
            toggleDefaultConfig(
              useDefaultConfig,
              setUseDefaultConfig,
              setPlanLabels,
              setSelectedMealTypes,
              setPlanSelectedNutrients,
              setPlanNutrientRanges,
              handleMealPlanPreferencesChange,
              handlePlanSectionChange,
              clientData,
              setCurrentMealType // Updated to pass
            )
          }
        />

        {/* Vertical Navigation */}
        <BulletsWithText
          steps={sidebarSteps}
          onStepChange={handleSidebarStepChange}
        />
      </div>

      {/* Right Panel */}
      <form action={formAction} className="md:col-span-2">
        {/* Panel With Borders for Filter Steps */}
        {!currentMealType ? (
          <>
            <div className="">
              <PanelWithBorders
                steps={filterSteps}
                currentStepId={currentStepId}
                onStepChange={handlePanelStepChange}
              />
            </div>

            {/* Conditionally Render Filter Content Based on Current Step */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              {currentStepId === "allmeals-health-diet" && (
                <>
                  {/* Health Labels */}
                  <div className="col-span-full ">
                    <CheckboxGroup
                      label="Health Labels"
                      options={Object.values(HealthLabels)}
                      selectedOptions={planLabels.health}
                      onChange={(label) =>
                        handlePlanLabelChange("health", label)
                      }
                    />
                  </div>

                  {/* Diet Labels */}
                  <div className="col-span-full ">
                    <CheckboxGroup
                      label="Diet Labels"
                      options={Object.values(DietLabels)}
                      selectedOptions={planLabels.diet}
                      onChange={(label) => handlePlanLabelChange("diet", label)}
                    />
                  </div>
                </>
              )}

              {currentStepId === "allmeals-caution-cuisine" && (
                <>
                  {/* Caution Labels */}
                  <div className="col-span-full ">
                    <CheckboxGroup
                      label="Caution Labels (Allergies)"
                      options={Object.values(AllergyLabels)}
                      selectedOptions={planLabels.caution}
                      onChange={(label) =>
                        handlePlanLabelChange("caution", label)
                      }
                    />
                  </div>

                  {/* Cuisine Types */}
                  <div className="col-span-full">
                    <CheckboxGroup
                      label="Cuisine Types"
                      options={Object.values(CuisineType)}
                      selectedOptions={planLabels.cuisine}
                      onChange={(label) =>
                        handlePlanLabelChange("cuisine", label)
                      }
                    />
                  </div>
                </>
              )}

              {currentStepId === "allmeals-nutrients" && (
                <>
                  {/* Nutrient Constraints */}
                  <div className="col-span-full ">
                    <CheckboxGroup
                      label="Nutrients"
                      options={Object.values(Nutrients)}
                      selectedOptions={planSelectedNutrients}
                      onChange={handlePlanNutrientChange}
                    />
                    {planSelectedNutrients.map((nutrient) => (
                      <NutrientSlider
                        key={nutrient}
                        nutrient={nutrient}
                        min={planNutrientRanges[nutrient].min ?? 0}
                        max={planNutrientRanges[nutrient].max ?? 100}
                        onChange={(min, max) =>
                          handlePlanNutrientRangeChange(nutrient, min, max)
                        }
                      />
                    ))}
                  </div>
                </>
              )}

              {currentStepId === "meal-type-selection" && (
                <>
                  {/* Meal Types */}
                  <div className="col-span-full ">
                    <MealTypeCheckBoxes
                      selectedMealTypes={selectedMealTypes}
                      onChange={handleMealTypeChange}
                    />
                  </div>
                </>
              )}
            </div>
            {/* End Panel nav */}
          </>
        ) : (
          // Render Meal Section Component - configure available mealtypes for logging meals and configuring auto-logging
          <MealSectionComponent
            mealType={currentMealType}
            sectionData={
              mealPlanPreferences.plan.sections
                ? mealPlanPreferences.plan.sections[currentMealType]
                : undefined
            }
            steps={getMealTypeSteps(currentMealType)}
            currentStepId={currentStepId} // Pass currentStepId as a prop
            onSectionChange={(updatedSection) =>
              handleSectionChange(currentMealType, updatedSection)
            }
            setCurrentStepId={setCurrentStepId}
          />
        )}

        {/* Summary Table */}
        <div className="overflow-auto">
          <SummaryTable mealPlanPreferences={mealPlanPreferences} />
        </div>

        {/* Confirm Selection Button */}
        {!isConfirmed && (
          <div className="mt-4 flex justify-center space-x-4">
            <button
              type="button"
              title="Confirm Selection"
              onClick={handleConfirmSelection}
              className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 w-1/2"
            >
              Confirm Selection
            </button>
            <button
              type="button"
              title="Clear Selection"
              onClick={handleClearSelection}
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 w-1/2"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Save Button - Visible only after confirmation */}
        {isConfirmed && (
          <div className="mt-4 flex justify-center space-x-4">
            <FormButton
              type="submit"
              isPending={isPending}
              buttonText="Save"
              buttonPendingText="Saving..."
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-1/2"
            />
            <button
              type="button"
              title="Cancel"
              onClick={handleCancel}
              className="rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 w-1/2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* {formData?.errors && (
          <ul id="form-errors" className="text-red-700">
            {Object.keys(formData.errors).map((error) => (
              <li key={error}>{formData.errors![error]}</li>
            ))}
          </ul>
        )}
        {formData?.success && (
          <div className="text-green-700">
            Meal Preferences changed successfully!
          </div>
        )} */}
      </form>

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        open={modalProps.open}
        title={modalProps.title}
        message={modalProps.message}
        confirmText={modalProps.confirmText}
        onConfirm={modalProps.onConfirm}
        // No cancelText to show only the OK button
      />
    </div>
  );
};

export default MealPreferencesSection;
