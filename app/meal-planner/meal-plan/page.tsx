import MealPlanSection from "@/app/components/meal-plan/meal-planning/meal-plan";
import { auth } from "@/auth";
import { getClient } from "@/lib/client/client";
import { getMealPlansByClientId } from "@/lib/meal-plan";
import { getRecipesByMealPlanId } from "@/lib/recipe";
import { Metadata } from "next";
import React from "react";

type MealPlanSectionPageProps = {};

const MealPlansPage = async (props: MealPlanSectionPageProps) => {
  const session = await auth();
  const clientId = Number(session?.user.clientId);
  // const clientData = await getClient(session?.user.userId!);
  const mealPlans = await getMealPlansByClientId(clientId);
  // get meal plan id from meal plans whose date falls between todays date
  const mealPlanId = mealPlans?.find(
    (plan) =>
      new Date(plan.startDate).getTime() <= new Date().getTime() &&
      new Date(plan.endDate).getTime() >= new Date().getTime()
  )?.id;
  const recipesData = await getRecipesByMealPlanId(mealPlanId as number);

  return (
    <>
      <MealPlanSection mealPlanData={mealPlans} recipesData={recipesData} clientId={clientId} />
    </>
  );
};

export default MealPlansPage;

export const metadata: Metadata = {
  title: "Meal Planner - Meal Plan",
  description: "Meal plans page, defines plans for meals.",
};
