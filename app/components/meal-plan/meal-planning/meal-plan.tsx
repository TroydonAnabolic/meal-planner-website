"use client";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import React from "react";
import { useReactToPrint } from "react-to-print";
import MealPlanSection from "./meal-plan-section";

interface MealPlanProps {
  mealPlanData: IMealPlan[] | undefined;
  recipesData: IRecipeInterface[] | undefined;
  clientId: number;
}

const MealPlan: React.FC<MealPlanProps> = ({
  mealPlanData,
  recipesData,
  clientId,
}) => {
  const componentRef = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => printFn()}
        className="absolute top-14 z-10 right-6 w-60 px-6 py-2 mb-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Print Meal Plan
      </button>
      <MealPlanSection
        mealPlanData={mealPlanData}
        recipesData={recipesData}
        clientId={clientId}
        ref={componentRef}
      />
    </div>
  );
};

export default MealPlan;
