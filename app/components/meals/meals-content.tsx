import React from "react";
import MealsGrid from "@/app/components/meals/meals-grid";
import { auth } from "@/auth";
import { getClient } from "@/lib/server-side/client";
import { getMealsByClientId } from "@/lib/meal";

const MealsContent = async () => {
    const session = await auth();
    const clientId = session?.user.clientId as unknown as number;
    const mealsData = await getMealsByClientId(clientId);
    const client = await getClient(session?.user.userId!);

    return <MealsGrid mealsData={mealsData} client={client!} />;
};

export default MealsContent;