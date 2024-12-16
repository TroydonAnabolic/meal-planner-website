// app/components/meal-planner/PlanMeal.tsx

import { IClientInterface } from "@/models/interfaces/client/client";
import React from "react";
import MealPlanGenerator from "./meal-plan-generator";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";

type PlanMealProps = {
  clientData: IClientInterface;
  mealPlan?: IMealPlan | undefined;
};

const PlanMeal: React.FC<PlanMealProps> = ({ clientData, mealPlan }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold p-4 text-gray-800">Plan Your Meals</h1>
      <MealPlanGenerator clientData={clientData} />
    </div>
  );
};

export default PlanMeal;
