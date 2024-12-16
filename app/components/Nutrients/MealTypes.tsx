import React from "react";

const mealTypes = [
  { type: "mealType", value: "breakfast" },
  { type: "mealType", value: "brunch" },
  { type: "mealType", value: "lunch/dinner" },
  { type: "mealType", value: "snack" },
  { type: "mealType", value: "teatime" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MealTypes = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Meal Types
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all possible Meal Types. The meal types refer to the meals
            in a day the recipe is commonly consumed in.
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
                    Type
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {mealTypes.map((meal, mealIdx) => (
                  <tr key={meal.value}>
                    <td
                      className={classNames(
                        mealIdx !== mealTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {meal.type}
                    </td>
                    <td
                      className={classNames(
                        mealIdx !== mealTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {meal.value}
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

export default MealTypes;
