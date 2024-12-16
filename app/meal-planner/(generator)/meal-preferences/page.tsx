import MealPreferencesSection from "@/app/components/meal-plan/meal-preferences/meal-preferences";
import { auth } from "@/auth";
import { getClient } from "@/lib/client/client";
import { initializeClientSettings } from "@/util/client-settings-util";
import { Metadata } from "next";
import React from "react";

type Props = {};

const MealPreferencesPage = async (props: Props) => {
  const session = await auth();
  const clientData = await getClient(session?.user.userId as string);
  initializeClientSettings(clientData);

  return (
    <>
      <MealPreferencesSection clientData={clientData} />
    </>
  );
};

export default MealPreferencesPage;

export const metadata: Metadata = {
  title: "Meal Preferences",
  description: "Generate personalized meal plans easily.",
};
