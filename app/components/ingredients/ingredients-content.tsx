import React from "react";
import IngredientsGrid from "@/app/components/ingredients/ingredients-grid";
import { auth } from "@/auth";
import { getIngredientsByClientId } from "@/lib/server-side/ingredients";

const IngredientsContent = async () => {
    const session = await auth();
    const clientId = session?.user.clientId as unknown as number;
    const ingredientsData = await getIngredientsByClientId(clientId);

    return (
        <IngredientsGrid
            ingredientsData={ingredientsData}
            clientId={clientId}
            userId={session?.user.userId!}
        />
    );
};

export default IngredientsContent;