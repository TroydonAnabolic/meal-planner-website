import React, { Suspense } from "react";
import MealPreferencesContent from "@/app/components/meal-plan/meal-preferences/meal-preferences-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Preferences",
  description: "Generate personalized meal plans easily.",
};

const MealPreferencesPage = async () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div>Loading meal preferences...</div>
          </div>
        }
      >
        {/* MealPreferencesContent handles getClient & data fetching */}
        <MealPreferencesContent />
      </Suspense>
    </>
  );
};

export default MealPreferencesPage;