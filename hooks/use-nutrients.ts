import { useState, useEffect } from "react";
import {
  AllMealSection,
  MealSection,
  NutrientConstraints,
} from "@/models/interfaces/client/meal-planner-preferences";
import { toggleSelectionGeneric as toggleSelection } from "@/util/generic-utils";

type UseNutrientsProps = {
  initialSection: AllMealSection | MealSection;
  handleSectionChange: (updatedSection: AllMealSection | MealSection) => void;
};

const useNutrients = ({
  initialSection,
  handleSectionChange,
}: UseNutrientsProps) => {
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>(
    Object.keys(initialSection.fit || {})
  );

  const [nutrientRanges, setNutrientRanges] = useState<NutrientConstraints>(
    initialSection.fit || {}
  );

  useEffect(() => {
    // Sync selectedNutrients and nutrientRanges with initialSection on mount or update
    setSelectedNutrients(Object.keys(initialSection.fit || {}));
    setNutrientRanges(initialSection.fit || {});
  }, [initialSection]);

  const handleNutrientChange = (nutrient: string) => {
    console.log("handleNutrientChange called with:", nutrient);
    const updatedSelectedNutrients = toggleSelection(
      selectedNutrients,
      nutrient
    );
    setSelectedNutrients(updatedSelectedNutrients);

    if (updatedSelectedNutrients.includes(nutrient)) {
      // Nutrient selected: set default range if not present
      if (!nutrientRanges[nutrient]) {
        const updatedNutrientRanges = {
          ...nutrientRanges,
          [nutrient]: { min: 0, max: 100 },
        };
        setNutrientRanges(updatedNutrientRanges);

        handleSectionChange({
          ...initialSection,
          fit: updatedNutrientRanges,
        });
      }
    } else {
      // Nutrient unselected: remove range
      const { [nutrient]: _, ...updatedNutrientRanges } = nutrientRanges;
      setNutrientRanges(updatedNutrientRanges);

      handleSectionChange({
        ...initialSection,
        fit: updatedNutrientRanges,
      });
    }
  };

  const handleNutrientRangeChange = (
    nutrient: string,
    min: number,
    max: number
  ) => {
    console.log("handleNutrientRangeChange called with:", nutrient, min, max);
    const updatedRanges = {
      ...nutrientRanges,
      [nutrient]: { min, max },
    };
    setNutrientRanges(updatedRanges);

    handleSectionChange({
      ...initialSection,
      fit: updatedRanges,
    });
  };

  return {
    selectedNutrients,
    nutrientRanges,
    handleNutrientChange,
    handleNutrientRangeChange,
    setSelectedNutrients,
    setNutrientRanges,
  };
};

export default useNutrients;
