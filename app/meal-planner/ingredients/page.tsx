import Ingredients from "@/app/components/Nutrients/Ingredients";
import RecipesGrid from "@/app/components/recipes/recipes-grid";
import { auth } from "@/auth";
import { getRecipesByClientId } from "@/lib/recipe";
import { Metadata } from "next";
import React from "react";

const IngredientsPage = async () => {
  const session = await auth();
  const clientId = session?.user.clientId as unknown as number;
  //const recipeData = await getRecipesByClientId(clientId);
  const ingredientsData = await getIngredientsByClientId(clientId);
  return (
    <>
      <Ingredients
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
