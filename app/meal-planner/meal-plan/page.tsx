import React, { Suspense } from "react";
import MealPlansContent from "@/app/components/meal-plan/meal-planning/meal-plans-content";
import { Metadata } from "next";

const MealPlansPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense
        fallback={
          <div className="p-4 flex items-center justify-center min-h-screen">
            Loading meal plans...
          </div>
        }
      >
        <MealPlansContent />
      </Suspense>
    </div>
  );
};

export default MealPlansPage;

export const metadata: Metadata = {
  title: "Meal Planner - Meal Plan",
  description: "Meal plans page, defines plans for meals.",
};