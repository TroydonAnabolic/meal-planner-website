import React, { Suspense } from "react";
import MealPreferencesContent from "@/app/components/meal-plan/meal-preferences/meal-preferences-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meal Preferences",
  description: "Generate personalized meal plans easily.",
};

const MealPreferencesPage = async () => {
  // Header and footer can be rendered immediately
  return (
    <>
      <Suspense fallback={<div>Loading meal preferences...</div>}>
        {/* MealPreferencesContent handles getClient & data fetching */}
        <MealPreferencesContent />
      </Suspense>
    </>
  );
};

export default MealPreferencesPage;