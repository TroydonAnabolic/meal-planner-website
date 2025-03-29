import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamically import the IngredientsContent async component
const IngredientsContent = dynamic(
  () => import("@/app/components/ingredients/ingredients-content"),
  {
    ssr: true,
    loading: () => (
      <div className="p-4 flex items-center justify-center min-h-screen">
        Loading ingredients...
      </div>
    ),
  }
);

const IngredientsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense
        fallback={
          <div className="p-4 flex items-center justify-center min-h-screen">
            Loading ingredients...
          </div>
        }
      >
        <IngredientsContent />
      </Suspense>
    </div>
  );
};

export default IngredientsPage;

export const metadata: Metadata = {
  title: "Meal Planner - Ingredients",
  description: "Generate personalized meal plans easily.",
};