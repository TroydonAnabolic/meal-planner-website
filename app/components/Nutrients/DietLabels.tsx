import React from "react";

const dietLabels = [
  {
    field: "balanced",
    description: "Contains a balance of carbohydrates, fats, and protein",
  },
  { field: "high-fiber", description: "More than 5g fiber per serving" },
  {
    field: "high-protein",
    description: "More than 50% of total calories from proteins",
  },
  {
    field: "low-carb",
    description: "Less than 20% of total calories from carbs",
  },
  { field: "low-fat", description: "Less than 15% of total calories from fat" },
  { field: "low-sodium", description: "Less than 140mg Na per serving" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DietLabels = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Diet Labels
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            The structure of the Diet Labels based on what is under the diet
            labels section of the response.
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
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {dietLabels.map((label, labelIdx) => (
                  <tr key={label.field}>
                    <td
                      className={classNames(
                        labelIdx !== dietLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {label.field}
                    </td>
                    <td
                      className={classNames(
                        labelIdx !== dietLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {label.description}
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

export default DietLabels;
