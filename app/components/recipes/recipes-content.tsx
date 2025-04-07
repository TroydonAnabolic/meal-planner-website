import React from "react";
import RecipesGrid from "@/app/components/recipes/recipes-grid";
import { auth } from "@/auth";
import { getRecipesByClientId } from "@/lib/server-side/recipe";

const RecipesContent = async () => {
    const session = await auth();
    const clientId = Number(session?.user.clientId);
    const recipeData = await getRecipesByClientId(clientId);

    return (
        <RecipesGrid
            recipesData={recipeData}
            clientId={clientId}
            userId={session?.user.userId!}
        />
    );
};

export default RecipesContent;