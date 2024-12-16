import MealsGrid from "@/app/components/meals/meals-grid";
import { auth } from "@/auth";
import { getClient } from "@/lib/client/client";
import { getMealsByClientId } from "@/lib/meal";
import { Metadata } from "next";
import React from "react";

const MealsPage = async () => {
  const session = await auth();
  const clientId = session?.user.clientId as unknown as number;
  const mealsData = await getMealsByClientId(clientId);
  // const diet = await fetchAllClientDiets(clientId);
  const client = await getClient(session?.user.userId!);

  return (
    <>
      <MealsGrid mealsData={mealsData} client={client!} />
    </>
  );
};

export default MealsPage;

export const metadata: Metadata = {
  title: "Meal Planner - Meals",
  description: "Generate personalized meal plans easily.",
};
