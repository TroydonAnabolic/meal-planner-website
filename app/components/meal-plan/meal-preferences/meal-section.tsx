import React, { useCallback, useEffect, useMemo, useRef } from "react"; // Import useRef
import {
  AllergyLabels,
  CuisineType,
  DietLabels,
  DishType,
  HealthLabels,
  Nutrients,
} from "@/constants/constants-enums";
import { MealSection } from "@/models/interfaces/client/meal-planner-preferences";
import useLabels from "@/hooks/use-labels";
import useNutrients from "@/hooks/use-nutrients";
import PanelWithBorders, {
  Step,
} from "../../ui/progress-bars/panels-with-border";
import NutrientSlider from "./nutrients-slider";
import CheckboxGroup from "../../ui/inputs/checkbox-group-input";

interface MealSectionProps {
  mealType: string;
  sectionData: MealSection | undefined;
  steps: Step[]; // New prop for steps
  currentStepId: string; // Add currentStepId as a prop
  onSectionChange: (updatedSection: MealSection) => void;
  setCurrentStepId: React.Dispatch<React.SetStateAction<string>>;
}

const MealSectionComponent: React.FC<MealSectionProps> = ({
  mealType,
  sectionData,
  steps, // Destructure steps
  currentStepId, // Destructure currentStepId from props
  onSectionChange,
  setCurrentStepId,
}) => {
  // Initialize render count
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(
    `MealSectionComponent (${mealType}) rendered ${renderCount.current} times`
  );

  // Initialize accept.all if undefined
  const initializedSectionData: MealSection = useMemo(
    () => ({
      ...sectionData,
      accept: {
        all: sectionData?.accept?.all,
        ...sectionData?.accept,
      },
    }),
    [sectionData]
  );

  // Memoize handleSectionChange to maintain stable reference
  const handleSectionChange = useCallback(
    (updatedSection: MealSection) => {
      onSectionChange(updatedSection);
    },
    [onSectionChange]
  );

  const { labels, handleLabelChange } = useLabels(
    initializedSectionData,
    handleSectionChange
  );

  const {
    selectedNutrients,
    nutrientRanges,
    handleNutrientChange,
    handleNutrientRangeChange,
  } = useNutrients({
    initialSection: initializedSectionData,

    handleSectionChange,
  });

  // Debugging: Log labels and nutrients
  useEffect(() => {
    // console.log("Labels:", labels);
    // console.log("Selected Nutrients:", selectedNutrients);
    // console.log("Nutrient Ranges:", nutrientRanges);
  }, [labels, selectedNutrients, nutrientRanges]);

  return (
    <>
      {/* Panel With Borders for Meal Type Steps */}
      <div className="">
        <PanelWithBorders
          steps={steps}
          currentStepId={currentStepId} // Use currentStepId from props
          onStepChange={(stepId: string) => {
            // Assuming setCurrentMealType is not directly used here
            setCurrentStepId(stepId);
          }}
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Conditionally Render Content Based on Current Step */}
        {steps.map((step) => {
          if (step.id === currentStepId) {
            switch (step.id) {
              case `${mealType.toLowerCase().replace(/\s+/g, "-")}-health-diet`:
                return (
                  <React.Fragment key={step.id}>
                    {/* Health Labels */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Health Labels`} // Add space for clarity
                        options={Object.values(HealthLabels)}
                        selectedOptions={labels.health}
                        onChange={(label) => handleLabelChange("health", label)}
                      />
                    </div>

                    {/* Diet Labels */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Diet Labels`} // Add space for clarity
                        options={Object.values(DietLabels)}
                        selectedOptions={labels.diet}
                        onChange={(label) => handleLabelChange("diet", label)}
                      />
                    </div>
                  </React.Fragment>
                );

              case `${mealType
                .toLowerCase()
                .replace(/\s+/g, "-")}-caution-cuisine`:
                return (
                  <React.Fragment key={step.id}>
                    {/* Caution Labels */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Caution Labels (Allergies)`}
                        options={Object.values(AllergyLabels)}
                        selectedOptions={labels.caution}
                        onChange={(label) =>
                          handleLabelChange("caution", label)
                        }
                      />
                    </div>

                    {/* Cuisine Types */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label="Cuisine Types"
                        options={Object.values(CuisineType)}
                        selectedOptions={labels.cuisine}
                        onChange={(label) =>
                          handleLabelChange("cuisine", label)
                        }
                      />
                    </div>
                  </React.Fragment>
                );

              case `${mealType
                .toLowerCase()
                .replace(/\s+/g, "-")}-dish-only-dish`:
                return (
                  <React.Fragment key={step.id}>
                    {/* Dish Types */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Dish Types`}
                        options={Object.values(DishType)}
                        selectedOptions={labels.dish || []}
                        onChange={(label) => handleLabelChange("dish", label)}
                      />
                    </div>
                    {/* Only Dish Types */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Only Dish Types`}
                        options={Object.values(DishType)}
                        selectedOptions={labels["only-dish"] || []}
                        onChange={(label) =>
                          handleLabelChange("only-dish", label)
                        }
                      />
                    </div>
                  </React.Fragment>
                );

              case `${mealType.toLowerCase().replace(/\s+/g, "-")}-nutrients`:
                return (
                  <React.Fragment key={step.id}>
                    {/* Nutrient Constraints */}
                    <div className="col-span-full mb-8">
                      <CheckboxGroup
                        label={`${mealType} Nutrients`}
                        options={Object.values(Nutrients)}
                        selectedOptions={selectedNutrients}
                        onChange={handleNutrientChange}
                      />
                      {selectedNutrients.map((nutrient) => (
                        <NutrientSlider
                          key={nutrient}
                          nutrient={nutrient}
                          min={initializedSectionData.fit?.[nutrient]?.min ?? 0}
                          max={
                            initializedSectionData.fit?.[nutrient]?.max ?? 100
                          }
                          onChange={(min, max) =>
                            handleNutrientRangeChange(nutrient, min, max)
                          }
                        />
                      ))}
                    </div>
                  </React.Fragment>
                );

              default:
                return null;
            }
          }
          return null;
        })}
      </div>
    </>
  );
};

export default React.memo(MealSectionComponent);
