import {
  IIngredient,
  INutrients,
} from "@/models/interfaces/ingredient/ingredient";
import { nutrientFields } from "@/util/nutrients";

export default async function ShareIngredientPage({
  searchParams,
}: {
  searchParams: { ingredient: string };
}) {
  const ingredientParam = searchParams.ingredient;

  let ingredient: IIngredient | null = null;
  if (ingredientParam) {
    ingredient = JSON.parse(ingredientParam);
  }

  return (
    <div className="mt-20 container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Shared Ingredient</h1>
      {ingredient ? (
        <div className="bg-gray-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{ingredient.food}</h2>
          <div className="mb-4">
            <img
              src={ingredient.image}
              alt={ingredient.food}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Quantity:</strong> {ingredient.quantity}{" "}
            {ingredient.measure}
          </p>
          <p className="mb-2">
            <strong>Weight:</strong> {ingredient.weight}g
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {ingredient.foodCategory || "N/A"}
          </p>
          <div>
            <strong>Nutrients:</strong>
            <ul className="list-disc list-inside ml-4">
              {nutrientFields.map((nutrient) => (
                <li key={nutrient.tag} className="flex flex-col">
                  {ingredient.totalNutrients &&
                    (ingredient.totalNutrients as unknown as INutrients)[
                    nutrient.tag as unknown as keyof INutrients
                    ]
                    ? ` ${nutrient.label} ${(ingredient.totalNutrients as unknown as INutrients)[
                      nutrient.tag as unknown as keyof INutrients
                    ].quantity
                    } ${nutrient.unit}`
                    : ` ${nutrient.label} 0 ${nutrient.unit}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Loading ingredient details...
        </p>
      )}
    </div>
  );
}
