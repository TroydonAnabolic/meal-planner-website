import { Nutrients } from "@/constants/constants-enums";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { macros, nutrientFields } from "@/util/nutrients";

export default async function ShareRecipePage({
  searchParams,
}: {
  searchParams: { recipe: string };
}) {
  const recipeParam = searchParams.recipe;

  let recipe: IRecipeInterface | null = null;
  if (recipeParam) {
    recipe = JSON.parse(recipeParam);
  }

  return (
    <div className="mt-20 container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Shared Recipe</h1>
      {recipe ? (
        <div className="bg-gray-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{recipe.label}</h2>
          <div className="mb-4">
            <img
              src={recipe.image}
              alt={recipe.label}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Yield:</strong> {recipe.yield}
          </p>
          <p className="mb-2">
            <strong>Source:</strong> {recipe.source}
          </p>
          <p className="mb-2">
            <strong>Total Time:</strong> {recipe.totalTime} minutes
          </p>
          <div className="mb-4">
            <strong>Ingredients:</strong>
            <ul className="list-disc list-inside ml-4">
              {recipe.ingredientLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Nutrients:</strong>
            <ul className="list-disc list-inside ml-4">
              {macros.map((nutrient) => (
                <li key={nutrient.tag} className="flex flex-col">
                  {recipe.totalNutrients && recipe.totalNutrients[nutrient.tag]
                    ? ` ${nutrient.label} ${recipe.totalNutrients[
                        nutrient.tag
                      ].quantity.toFixed(2)} ${nutrient.unit}`
                    : ` ${nutrient.label} 0 ${nutrient.unit}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading recipe details...</p>
      )}
    </div>
  );
}
