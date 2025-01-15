import { Nutrients } from "@/constants/constants-enums";
import { nutrientNames } from "@/util/nutrients";
import React from "react";

type NutritionSummaryProps = {
  summary: Record<
    string,
    { total: number; consumed: number; remaining: number }
  >;
};
const NutritionSummary: React.FC<NutritionSummaryProps> = ({ summary }) => {
  const mainMacros = [
    Nutrients.ENERC_KCAL as string, // Energy
    Nutrients.PROCNT as string, // Protein
    Nutrients.CHOCDF as string, // Carbohydrates
    Nutrients.FAT as string, // Fat
  ];

  // Filter main macros from the summary
  const mainMacrosSummary = Object.entries(summary).filter(([key]) =>
    mainMacros.includes(key)
  );

  // Filter remaining nutrients
  const otherNutrientsSummary = Object.entries(summary).filter(
    ([key]) => !mainMacros.includes(key)
  );

  return (
    <div className="mt-6 nutrition-summary">
      {/* Main Macros Summary */}
      <div className="mb-4">
        <h3 className="font-semibold text-xl text-gray-800">Macros Summary</h3>
        <table className="mt-2 table-auto w-full border-collapse border border-gray-300 text-left text-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Nutrient
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Total
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Consumed
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            {mainMacrosSummary.map(([key, values]) => (
              <tr key={key}>
                <td className="border px-4 py-2">
                  {nutrientNames[key] || key}
                </td>
                <td className="border px-4 py-2">{values.total.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {values.consumed.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  {values.remaining.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full Nutrient Table */}
      <div>
        <h3 className="font-semibold text-xl text-gray-800">
          {" "}
          Nutrient Summary
        </h3>
        <table className="mt-2 table-auto w-full border-collapse border border-gray-300 text-left text-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Nutrient
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Total
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Consumed
              </th>
              <th className="px-4 py-2 border-x border-gray-300 bg-gray-100">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            {otherNutrientsSummary.map(([key, values]) => (
              <tr key={key}>
                <td className="border px-4 py-2">
                  {nutrientNames[key] || key}
                </td>
                <td className="border px-4 py-2">{values.total.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {values.consumed.toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  {values.remaining.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutritionSummary;
