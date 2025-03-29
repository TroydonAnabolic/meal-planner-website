import MealPlanGeneratorContainer from "./meal-plan-generator-container";
import { auth } from "@/auth";
import { getClient } from "@/lib/server-side/client";
import { initializeClientSettings } from "@/util/client-settings-util";
import React from "react";

type Props = {};

const PlanMealGeneratorContent = async (props: Props) => {
    const session = await auth();
    const clientData = await getClient(session?.user.userId as string);
    initializeClientSettings(clientData);
    return <MealPlanGeneratorContainer clientData={clientData} />;
};

export default PlanMealGeneratorContent;