import { useState, useEffect, useCallback } from "react";
import {
  AllMealSection,
  MealSection,
} from "@/models/interfaces/client/meal-planner-preferences";
import { toggleSelectionGeneric as toggleSelection } from "@/util/generic-utils";

export type Labels = {
  health: string[];
  diet: string[];
  caution: string[];
  cuisine: string[];
  dish?: string[];
  "only-dish"?: string[];
};

type UseLabelsProps = {
  section: AllMealSection | MealSection;
  handleSectionChange: (updatedSection: AllMealSection | MealSection) => void;
};

const useLabels = (
  section: AllMealSection | MealSection,
  handleSectionChange: (updatedSection: AllMealSection | MealSection) => void
) => {
  // Ensure accept.all is initialized

  const [labels, setLabels] = useState<Labels>({
    health:
      section.accept?.all?.flatMap((condition) => condition.health || []) || [],
    diet:
      section.accept?.all?.flatMap((condition) => condition.diet || []) || [],
    caution:
      section.accept?.all?.flatMap((condition) => condition.caution || []) ||
      [],
    cuisine:
      section.accept?.all?.flatMap((condition) => condition.cuisine || []) ||
      [],
    dish:
      section.accept?.all?.flatMap((condition) => condition.dish || []) || [],
    "only-dish":
      section.accept?.all?.flatMap(
        (condition) => condition["only-dish"] || []
      ) || [],
  });

  useEffect(() => {
    // Sync labels with section when section changes
    setLabels({
      health:
        section.accept?.all?.flatMap((condition) => condition.health || []) ||
        [],
      diet:
        section.accept?.all?.flatMap((condition) => condition.diet || []) || [],
      caution:
        section.accept?.all?.flatMap((condition) => condition.caution || []) ||
        [],
      cuisine:
        section.accept?.all?.flatMap((condition) => condition.cuisine || []) ||
        [],
      dish:
        section.accept?.all?.flatMap((condition) => condition.dish || []) || [],
      "only-dish":
        section.accept?.all?.flatMap(
          (condition) => condition["only-dish"] || []
        ) || [],
    });
  }, [section]);

  const handleLabelChange = useCallback(
    (labelType: keyof Labels, label: string) => {
      setLabels((prevLabels) => {
        const updatedLabels = toggleSelection(
          prevLabels[labelType] || [],
          label
        );
        return { ...prevLabels, [labelType]: updatedLabels };
      });

      const updatedSection = {
        ...section,
        accept: {
          ...section.accept,
          all: section.accept?.all
            ? section.accept.all.map((cond) => ({
                ...cond,
                [labelType]: toggleSelection(cond[labelType] || [], label),
              }))
            : [{ [labelType]: [label] }],
        },
      };

      handleSectionChange(updatedSection);
    },
    [section, handleSectionChange]
  );

  return { labels, handleLabelChange, setLabels };
};

export default useLabels;
