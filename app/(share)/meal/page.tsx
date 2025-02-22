import { Nutrients } from "@/constants/constants-enums";
import { IMealInterface } from "@/models/interfaces/meal/Meal";
import { macros, nutrientFields } from "@/util/nutrients";

export default async function ShareMealPage({
  searchParams,
}: {
  searchParams: { meal: string };
}) {
  const mealParam = searchParams.meal;

  let meal: IMealInterface | null = null;
  if (mealParam) {
    meal = JSON.parse(decodeURIComponent(mealParam));
  }

  return (
    <div className="mt-20 container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Shared Meal</h1>
      {meal ? (
        <div className="bg-gray-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{meal.name}</h2>
          <div className="mb-4">
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <p className="mb-2">
            <strong>Meal Type:</strong> {meal.mealTypeKey}
          </p>
          <p className="mb-2">
            <strong>Weight:</strong> {meal.weight.toFixed(2)} grams
          </p>
          <div className="mb-4">
            <strong>Ingredients:</strong>
            <ul className="list-disc list-inside ml-4">
              {meal.ingredientLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Nutrients:</strong>
            <ul className="list-disc list-inside ml-4">
              {macros.map((nutrient) => (
                <li key={nutrient.tag} className="flex flex-col">
                  {meal.nutrients && meal.nutrients[nutrient.tag]
                    ? ` ${nutrient.label} ${meal.nutrients[
                        nutrient.tag
                      ].quantity.toFixed(2)} ${nutrient.unit}`
                    : ` ${nutrient.label} 0 ${nutrient.unit}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Loading meal details...</p>
      )}
    </div>
  );
}
