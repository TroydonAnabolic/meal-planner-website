// app/components/meal-planner/PlanMeal.tsx
"use client";

import { IClientInterface } from "@/models/interfaces/client/client";
import React from "react";
import MealPlanGenerator from "../components/meal-plan/plan/meal-plan-generator";
import { Countries } from "@/constants/constants-enums";
import { initializeClientSettings } from "@/util/client-settings-util";
import { defaultMealPlanPreference } from "@/constants/constants-objects";

type PlanMealDemoProps = {
  clientData: IClientInterface;
};

const PlanMealDemo: React.FC<PlanMealDemoProps> = () => {
  const clientData: IClientInterface = {
    Id: 0,
    FirstName: "Givenname",
    LastName: "Familyname",
    Age: 33,
    Email: "example3423@smartaitrainer.com",
    PhoneNumber: "0221002320",
    Country: Countries.NZ,
  };

  initializeClientSettings(clientData);
  clientData.ClientSettingsDto!.mealPlanPreferences = defaultMealPlanPreference;

  return (
    <main className="mx-auto py-16 px-4 sm:px-6 lg:px-8 ">
      {/* Pricing section */}
      <div className="relative isolate text-center bg-white px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          />
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold p-4 text-gray-800">
            Plan Your Meals
          </h1>
          <MealPlanGenerator clientData={clientData} />
        </div>
      </div>
    </main>
  );
};

export default PlanMealDemo;
