import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamically import the RecipesContent server component
const RecipesContent = dynamic(
  () => import("@/app/components/recipes/recipes-content"),
  {
    ssr: true,
    loading: () => (
      <div className="p-4 flex items-center justify-center min-h-screen">
        Loading recipes...
      </div>
    ),
  }
);

const RecipesPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div className="p-4">Loading recipes...</div>}>
        <RecipesContent />
      </Suspense>
    </div>
  );
};

export default RecipesPage;

export const metadata: Metadata = {
  title: "Meal Planner - Recipes",
  description: "Generate personalized meal plans easily.",
};