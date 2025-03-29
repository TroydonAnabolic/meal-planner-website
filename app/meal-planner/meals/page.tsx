import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamically import the MealsContent server component
const MealsContent = dynamic(
  () => import("@/app/components/meals/meals-content"),
  {
    ssr: true,
    loading: () => (
      <div className="p-4 flex items-center justify-center min-h-screen">
        Loading meals...
      </div>
    ),
  }
);

const MealsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense
        fallback={
          <div className="p-4 flex items-center justify-center min-h-screen">
            Loading meals...
          </div>
        }
      >
        <MealsContent />
      </Suspense>
    </div>
  );
};

export default MealsPage;

export const metadata: Metadata = {
  title: "Meal Planner - Meals",
  description: "Generate personalized meal plans easily.",
};