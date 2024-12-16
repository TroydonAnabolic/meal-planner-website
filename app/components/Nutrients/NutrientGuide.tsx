import React from "react";

const nutrients = [
  { code: "SUGAR.added", name: "Added sugar", unit: "g" },
  { code: "CA", name: "Calcium, Ca", unit: "mg" },
  { code: "CHOCDF.net", name: "Carbohydrate (net)", unit: "g" },
  { code: "CHOCDF", name: "Carbohydrate, by difference", unit: "g" },
  { code: "CHOLE", name: "Cholesterol", unit: "mg" },
  { code: "ENERC_KCAL", name: "Energy", unit: "kcal" },
  { code: "FAMS", name: "Fatty acids, total monounsaturated", unit: "g" },
  { code: "FAPU", name: "Fatty acids, total polyunsaturated", unit: "g" },
  { code: "FASAT", name: "Fatty acids, total saturated", unit: "g" },
  { code: "FATRN", name: "Fatty acids, total trans", unit: "g" },
  { code: "FIBTG", name: "Fiber, total dietary", unit: "g" },
  { code: "FOLDFE", name: "Folate, DFE", unit: "µg" },
  { code: "FOLFD", name: "Folate, food", unit: "µg" },
  { code: "FOLAC", name: "Folic acid", unit: "µg" },
  { code: "FE", name: "Iron, Fe", unit: "mg" },
  { code: "MG", name: "Magnesium", unit: "mg" },
  { code: "NIA", name: "Niacin", unit: "mg" },
  { code: "P", name: "Phosphorus, P", unit: "mg" },
  { code: "K", name: "Potassium, K", unit: "mg" },
  { code: "PROCNT", name: "Protein", unit: "g" },
  { code: "RIBF", name: "Riboflavin", unit: "mg" },
  { code: "NA", name: "Sodium, Na", unit: "mg" },
  { code: "Sugar.alcohol", name: "Sugar alcohols", unit: "g" },
  { code: "SUGAR", name: "Sugars, total", unit: "g" },
  { code: "THIA", name: "Thiamin", unit: "mg" },
  { code: "FAT", name: "Total lipid (fat)", unit: "g" },
  { code: "VITA_RAE", name: "Vitamin A, RAE", unit: "µg" },
  { code: "VITB12", name: "Vitamin B-12", unit: "µg" },
  { code: "VITB6A", name: "Vitamin B-6", unit: "mg" },
  { code: "VITC", name: "Vitamin C, total ascorbic acid", unit: "mg" },
  { code: "VITD", name: "Vitamin D (D2 + D3)", unit: "µg" },
  { code: "TOCPHA", name: "Vitamin E (alpha-tocopherol)", unit: "mg" },
  { code: "VITK1", name: "Vitamin K (phylloquinone)", unit: "µg" },
  { code: "WATER", name: "Water", unit: "g" },
  { code: "ZN", name: "Zinc, Zn", unit: "mg" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NutrientGuide = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Nutrient Guide
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            The list of all of the nutrients that may be contained as part of a
            recipe’s nutritional information under the totalNutrients and the
            totalDaily section of the response. totalNutrients is the absolute
            nutrient amount, while totalDaily is the percent of daily
            recommended nutrient intake.
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
                    NTR Code
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {nutrients.map((nutrient, nutrientIdx) => (
                  <tr key={nutrient.code}>
                    <td
                      className={classNames(
                        nutrientIdx !== nutrients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {nutrient.code}
                    </td>
                    <td
                      className={classNames(
                        nutrientIdx !== nutrients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {nutrient.name}
                    </td>
                    <td
                      className={classNames(
                        nutrientIdx !== nutrients.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {nutrient.unit}
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

export default NutrientGuide;
