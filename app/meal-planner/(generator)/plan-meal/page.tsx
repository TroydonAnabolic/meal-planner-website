import MealPlanGeneratorContainer from "@/app/components/meal-plan/plan/meal-plan-generator-container";
import PlanMeal from "@/app/components/meal-plan/plan/plan-meal";
import { auth } from "@/auth";
import { getClient } from "@/lib/server-side/client";
import { initializeClientSettings } from "@/util/client-settings-util";
import { Metadata } from "next";
import React from "react";

type Props = {};

const PlanMealPage = async (props: Props) => {
  const session = await auth();
  const clientData = await getClient(session?.user.userId as string);
  //const mealPlan = await getMealPlanByClientId(clientData.Id);

  initializeClientSettings(clientData);

  return (
    <>
      <MealPlanGeneratorContainer clientData={clientData} />
    </>
  );
};

export default PlanMealPage;

export const metadata: Metadata = {
  title: "Meal Planner - Plan",
  description: "Generate personalized meal plans easily.",
};
function getMealPlanByClientId(Id: number) {
  throw new Error("Function not implemented.");
}
