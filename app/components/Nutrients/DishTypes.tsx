import React from "react";

const dishTypes = [
  { type: "dishType", value: "alcohol cocktail" },
  { type: "dishType", value: "biscuits and cookies" },
  { type: "dishType", value: "bread" },
  { type: "dishType", value: "cereals" },
  { type: "dishType", value: "condiments and sauces" },
  { type: "dishType", value: "desserts" },
  { type: "dishType", value: "drinks" },
  { type: "dishType", value: "egg" },
  { type: "dishType", value: "ice cream and custard" },
  { type: "dishType", value: "main course" },
  { type: "dishType", value: "pancake" },
  { type: "dishType", value: "pasta" },
  { type: "dishType", value: "pastry" },
  { type: "dishType", value: "pies and tarts" },
  { type: "dishType", value: "pizza" },
  { type: "dishType", value: "preps" },
  { type: "dishType", value: "preserve" },
  { type: "dishType", value: "salad" },
  { type: "dishType", value: "sandwiches" },
  { type: "dishType", value: "seafood" },
  { type: "dishType", value: "side dish" },
  { type: "dishType", value: "soup" },
  { type: "dishType", value: "special occasions" },
  { type: "dishType", value: "starter" },
  { type: "dishType", value: "sweets" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DishTypes = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Dish Types
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all possible Dish Types. The dish types refer to the
            category of food the recipe would fall under.
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
                {dishTypes.map((dish, dishIdx) => (
                  <tr key={dish.value}>
                    <td
                      className={classNames(
                        dishIdx !== dishTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {dish.type}
                    </td>
                    <td
                      className={classNames(
                        dishIdx !== dishTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {dish.value}
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

export default DishTypes;
