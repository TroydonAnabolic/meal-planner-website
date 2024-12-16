import React from "react";

const ingredients = [
  {
    field: "quantity",
    type: "float",
    description: "Quantity of specified measure",
  },
  { field: "measure", type: "Measure", description: "Measure" },
  { field: "weight", type: "float", description: "Total weight, g" },
  { field: "food", type: "Food", description: "Food" },
  {
    field: "foodCategory",
    type: "string",
    description: "Shopping aisle category",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Ingredients = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Ingredients
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            The structure of the Ingredients based on what is under the
            ingredients section of the response.
            <br />
            Please note that some plans may not include all of the fields for
            the ingredient object.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    Field
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, ingredientIdx) => (
                  <tr key={ingredient.field}>
                    <td
                      className={classNames(
                        ingredientIdx !== ingredients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {ingredient.field}
                    </td>
                    <td
                      className={classNames(
                        ingredientIdx !== ingredients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {ingredient.type}
                    </td>
                    <td
                      className={classNames(
                        ingredientIdx !== ingredients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {ingredient.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
