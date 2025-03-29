import React from "react";
import MealPlan from "@/app/components/meal-plan/meal-planning/meal-plan";
import { auth } from "@/auth";
import { getMealPlansByClientId } from "@/lib/meal-plan";

type Props = {};

const MealPlansContent = async (props: Props) => {
    const session = await auth();
    const clientId = Number(session?.user.clientId);
    const mealPlans = await getMealPlansByClientId(clientId);

    // Get recipes for the current meal plan, e.g. the one where today's date falls between startDate and endDate.
    const recipesData = mealPlans?.find(
        (plan) =>
            new Date(plan.startDate).getTime() <= Date.now() &&
            new Date(plan.endDate).getTime() >= Date.now()
    )?.recipes;

    return (
        <MealPlan
            mealPlanData={mealPlans}
            recipesData={recipesData}
            clientId={clientId}
        />
    );
};

export default MealPlansContent;