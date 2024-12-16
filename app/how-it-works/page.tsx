"use client";

import { useState } from "react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { DietLabels, HealthLabels } from "@/constants/constants-enums";
import CuisineTypes from "../components/Nutrients/CuisineTypes";
import DishTypes from "../components/Nutrients/DishTypes";
import Ingredients from "../components/Nutrients/Ingredients";
import MealTypes from "../components/Nutrients/MealTypes";
import NutrientGuide from "../components/Nutrients/NutrientGuide";

type Props = {};

const HowItWorks = (props: Props) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
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
      <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
      <div className="mt-6 space-y-6">
        <div>
          <button
            onClick={() => toggleSection("overview")}
            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          >
            <span>Meal Planning API Overview</span>
            <span className="ml-2">
              {openSection === "overview" ? (
                <MinusSmallIcon className="w-5 h-5" />
              ) : (
                <PlusSmallIcon className="w-5 h-5" />
              )}
            </span>
          </button>
          {openSection === "overview" && (
            <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
              The Meal Planning API provides dietary planning based on a
              user-supplied daily meal structure and nutritional constraints.
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleSection("structure")}
            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          >
            <span>Meal Plan Structure</span>
            <span className="ml-2">
              {openSection === "structure" ? (
                <MinusSmallIcon className="w-5 h-5" />
              ) : (
                <PlusSmallIcon className="w-5 h-5" />
              )}
            </span>
          </button>
          {openSection === "structure" && (
            <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
              A meal plan is the assignment of a number of dishes, according to
              a fixed daily pattern, over a given period of time. The daily
              pattern structures one or more slots (dishes) into a hierarchy of
              sections. An example meal plan daily pattern might be:
              <ul className="list-disc ml-6 mt-2">
                <li>Breakfast (1 dish)</li>
                <li>
                  Lunch (section)
                  <ul className="list-disc ml-6">
                    <li>Starter (1 dish)</li>
                    <li>Main course (1 dish)</li>
                    <li>Dessert (1 dish)</li>
                  </ul>
                </li>
                <li>
                  Dinner (section)
                  <ul className="list-disc ml-6">
                    <li>Main course (1 dish)</li>
                    <li>Dessert (1 dish)</li>
                  </ul>
                </li>
              </ul>
              The daily pattern is defined by the caller and is supplied to the
              meal planner with each select call.
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleSection("selection")}
            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          >
            <span>Meal Plan Generation</span>
            <span className="ml-2">
              {openSection === "selection" ? (
                <MinusSmallIcon className="w-5 h-5" />
              ) : (
                <PlusSmallIcon className="w-5 h-5" />
              )}
            </span>
          </button>
          {openSection === "selection" && (
            <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
              Once you request to generate a meal plean, we will attempt to
              generate a meal plan for a specified period from a given
              specification (daily pattern plus criteria and constraints.) Upon
              successful generation, the meal plan will contain unique
              assignments of recipes for each slot in the requested period.
              <br />
              <br />
              Meal plan usually generates the same results from the same inputs
              (though this is not guaranteed.)
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => toggleSection("shoppingList")}
            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          >
            <span>Shopping List</span>
            <span className="ml-2">
              {openSection === "shoppingList" ? (
                <MinusSmallIcon className="w-5 h-5" />
              ) : (
                <PlusSmallIcon className="w-5 h-5" />
              )}
            </span>
          </button>
          {openSection === "shoppingList" && (
            <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
              A shopping-list call may be issued on assigned recipes to obtain
              total shopping quantities for the products involved. Each recipe
              may be scaled individually for the shopping list by indicating the
              planned consumption as a number of servings; in the absence of
              such indication, consumption (and therefore preparation) of the
              complete output of the recipe will be assumed.
            </div>
          )}
        </div>
        <div className="mt-6 text-sm text-gray-700">
          The meal plan generator will use a combination of these meal
          preferences to generate a diet for you that will be tailored to your
          chosen preferences.
        </div>
        <NutrientGuide />
        <Ingredients />
        {/* <DietLabels />
        <HealthLabels /> */}
        <MealTypes />
        <DishTypes />
        <CuisineTypes />
      </div>
    </main>
  );
};

export default HowItWorks;
