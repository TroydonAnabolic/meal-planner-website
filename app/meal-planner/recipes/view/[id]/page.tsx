// app/page.tsx

import RecipeInputFields from "@/app/components/recipes/recipe-input-fields";
import { MealType } from "@/constants/constants-enums";
import { getRecipeFromId } from "@/lib/server-side/edamam";
import { IRecipeHit } from "@/models/interfaces/recipe/recipe";
import { getEnumKeysByValues } from "@/util/enum-util";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const recipeHit = await getRecipeFromId(id);
  const recipe = recipeHit?.recipe;

  const mealtypeKey = getEnumKeysByValues(
    MealType,
    recipe?.mealType as MealType[]
  );

  if (recipe) {
    recipe.mealTypeKey = mealtypeKey;
  }

  if (!recipeHit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-600">
          Recipe not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{recipe?.label}</h1>
        <RecipeInputFields
          action="View"
          recipe={recipe!}
          setRecipe={undefined}
          readOnly={true}
        />
      </div>
    </div>
  );
}
