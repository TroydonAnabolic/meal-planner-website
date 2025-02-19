import IngredientsGrid from "@/app/components/ingredients/ingredients-grid";
import RecipesGrid from "@/app/components/recipes/recipes-grid";
import { auth } from "@/auth";
import { getRecipesByClientId } from "@/lib/recipe";
import { getIngredientsByClientId } from "@/lib/server-side/ingredients";
import { Metadata } from "next";
import React from "react";

const IngredientsPage = async () => {
  const session = await auth();
  const clientId = session?.user.clientId as unknown as number;
  //const recipeData = await getRecipesByClientId(clientId);
  const ingredientsData = await getIngredientsByClientId(clientId);
  return (
    <>
      <IngredientsGrid
        ingredientsData={ingredientsData}
        clientId={clientId}
        userId={session?.user.userId!}
      />
    </>
  );
};

export default IngredientsPage;

export const metadata: Metadata = {
  title: "Meal Planner - Recipes",
  description: "Generate personalized meal plans easily.",
};
