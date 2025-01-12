import RecipesGrid from "@/app/components/recipes/recipes-grid";
import { auth } from "@/auth";
import { getRecipesByClientId } from "@/lib/recipe";
import { Metadata } from "next";
import React from "react";

const RecipesPage = async () => {
  const session = await auth();
  const clientId = session?.user.clientId as unknown as number;
  const recipeData = await getRecipesByClientId(clientId);

  return (
    <>
      <RecipesGrid recipesData={recipeData} clientId={clientId} />
    </>
  );
};

export default RecipesPage;

export const metadata: Metadata = {
  title: "Meal Planner - Recipes",
  description: "Generate personalized meal plans easily.",
};
