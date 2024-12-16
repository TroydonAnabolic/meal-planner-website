import React from "react";

const cuisineTypes = [
  { type: "cuisineType", value: "american" },
  { type: "cuisineType", value: "asian" },
  { type: "cuisineType", value: "british" },
  { type: "cuisineType", value: "caribbean" },
  { type: "cuisineType", value: "central europe" },
  { type: "cuisineType", value: "chinese" },
  { type: "cuisineType", value: "eastern europe" },
  { type: "cuisineType", value: "french" },
  { type: "cuisineType", value: "greek" },
  { type: "cuisineType", value: "indian" },
  { type: "cuisineType", value: "italian" },
  { type: "cuisineType", value: "japanese" },
  { type: "cuisineType", value: "korean" },
  { type: "cuisineType", value: "kosher" },
  { type: "cuisineType", value: "mediterranean" },
  { type: "cuisineType", value: "mexican" },
  { type: "cuisineType", value: "middle eastern" },
  { type: "cuisineType", value: "nordic" },
  { type: "cuisineType", value: "south american" },
  { type: "cuisineType", value: "south east asian" },
  { type: "cuisineType", value: "world" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CuisineTypes = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Cuisine Types
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            The list of all possible Cuisine Types. The cuisine types refer to
            the cuisine that the recipe would fall under.
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
                {cuisineTypes.map((cuisine, cuisineIdx) => (
                  <tr key={cuisine.value}>
                    <td
                      className={classNames(
                        cuisineIdx !== cuisineTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {cuisine.type}
                    </td>
                    <td
                      className={classNames(
                        cuisineIdx !== cuisineTypes.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {cuisine.value}
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

export default CuisineTypes;
