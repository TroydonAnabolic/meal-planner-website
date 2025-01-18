import React, { useState } from "react";
import { IShoppingListResult } from "@/models/interfaces/edamam/meal-planner/shopping-list-response";
import { getUnitOfMeasureFromUrl } from "@/constants/constants-enums";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { generateConsolidatedShoppingList } from "@/lib/client-side/edamam";

interface ShoppingListTableProps {
  recipes: IRecipeInterface[];
  shoppingList: IShoppingListResult | null;
  setShoppingList: React.Dispatch<
    React.SetStateAction<IShoppingListResult | null>
  >;
}

const ShoppingListTable: React.FC<ShoppingListTableProps> = ({
  recipes,
  shoppingList,
  setShoppingList,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to extract the qualifier name from the URL
  const getQualifierName = (qualifierUrl: string): string => {
    const parts = qualifierUrl.split("#");
    return parts[1] || qualifierUrl;
  };

  const handleGenerateShoppingList = async () => {
    setIsLoading(true);
    try {
      // Prepare shopping list entries
      const shoppingListData: IShoppingListResult | null =
        await generateConsolidatedShoppingList(recipes);
      setShoppingList(shoppingListData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerateShoppingList}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        disabled={isLoading}
      >
        {isLoading ? "Generating Shopping List..." : "Generate Shopping List"}
      </button>

      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Shopping List</h2>
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="w-1/3  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ingredient
                </th>
                <th
                  scope="col"
                  className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!isLoading && shoppingList?.entries.length! > 0 ? (
                shoppingList?.entries.map((entry, index) => (
                  <React.Fragment key={index}>
                    {entry.quantities.map((quantity, qIndex) => (
                      <tr key={`${index}-${qIndex}`}>
                        <td className="px-6 py-4 border break-words text-sm text-gray-900">
                          {entry.food}
                        </td>
                        <td className="px-6 py-4 border text-center text-sm text-gray-900">
                          {quantity.quantity}
                          {quantity.qualifiers && quantity.qualifiers.length > 0
                            ? ` (${quantity.qualifiers
                                .map(getQualifierName)
                                .join(", ")})`
                            : ""}
                        </td>
                        <td className="px-6 py-4 border text-center text-sm text-gray-900">
                          {getUnitOfMeasureFromUrl(quantity.measure)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    {isLoading
                      ? "Fetching shopping list..."
                      : "Shopping list items to display."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ShoppingListTable;
