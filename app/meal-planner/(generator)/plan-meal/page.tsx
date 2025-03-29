import React, { Suspense } from "react";
import PlanMealGeneratorContent from "@/app/components/meal-plan/plan/plan-meal-generator-content";
import { Metadata } from "next";

type Props = {};

const PlanMealPage = async (props: Props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading meal plan generator...</div>
        </div>
      }
    >
      {/* This component will not render until getClient (and auth) complete */}
      <PlanMealGeneratorContent />
    </Suspense>
  );
};

export default PlanMealPage;

export const metadata: Metadata = {
  title: "Meal Planner - Plan",
  description: "Generate personalized meal plans easily.",
};