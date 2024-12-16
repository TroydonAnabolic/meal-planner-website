import React from "react";

const healthLabels = [
  {
    type: "Health",
    webLabel: "Alcohol-Cocktail",
    apiParameter: "alcohol-cocktail",
    definition: "Describes an alcoholic cocktail",
  },
  {
    type: "Health",
    webLabel: "Alcohol-Free",
    apiParameter: "alcohol-free",
    definition: "No alcohol used or contained",
  },
  {
    type: "Health",
    webLabel: "Celery-Free",
    apiParameter: "celery-free",
    definition: "Does not contain celery or derivatives",
  },
  {
    type: "Health",
    webLabel: "Crustcean-Free",
    apiParameter: "crustacean-free",
    definition:
      "Does not contain crustaceans (shrimp, lobster etc.) or derivatives",
  },
  {
    type: "Health",
    webLabel: "Dairy-Free",
    apiParameter: "dairy-free",
    definition: "No dairy; no lactose",
  },
  {
    type: "Health",
    webLabel: "DASH",
    apiParameter: "DASH",
    definition: "Dietary Approaches to Stop Hypertension diet",
  },
  {
    type: "Health",
    webLabel: "Egg-Free",
    apiParameter: "egg-free",
    definition: "No eggs or products containing eggs",
  },
  {
    type: "Health",
    webLabel: "Fish-Free",
    apiParameter: "fish-free",
    definition: "No fish or fish derivatives",
  },
  {
    type: "Health",
    webLabel: "FODMAP-Free",
    apiParameter: "fodmap-free",
    definition: "Does not contain FODMAP foods",
  },
  {
    type: "Health",
    webLabel: "Gluten-Free",
    apiParameter: "gluten-free",
    definition: "No ingredients containing gluten",
  },
  {
    type: "Health",
    webLabel: "Immuno-Supportive",
    apiParameter: "immuno-supportive",
    definition:
      "Recipes which fit a science-based approach to eating to strengthen the immune system",
  },
  {
    type: "Health",
    webLabel: "Keto-Friendly",
    apiParameter: "keto-friendly",
    definition: "Maximum 7 grams of net carbs per serving",
  },
  {
    type: "Health",
    webLabel: "Kidney-Friendly",
    apiParameter: "kidney-friendly",
    definition:
      "Per serving – phosphorus less than 250 mg AND potassium less than 500 mg AND sodium less than 500 mg",
  },
  {
    type: "Health",
    webLabel: "Kosher",
    apiParameter: "kosher",
    definition:
      "Contains only ingredients allowed by the kosher diet. However it does not guarantee kosher preparation of the ingredients themselves",
  },
  {
    type: "Health",
    webLabel: "Low Potassium",
    apiParameter: "low-potassium",
    definition: "Less than 150mg per serving",
  },
  {
    type: "Health",
    webLabel: "Low Sugar",
    apiParameter: "low-sugar",
    definition:
      "No simple sugars – glucose, dextrose, galactose, fructose, sucrose, lactose, maltose",
  },
  {
    type: "Health",
    webLabel: "Lupine-Free",
    apiParameter: "lupine-free",
    definition: "Does not contain lupine or derivatives",
  },
  {
    type: "Health",
    webLabel: "Mediterranean",
    apiParameter: "Mediterranean",
    definition: "Mediterranean diet",
  },
  {
    type: "Health",
    webLabel: "Mollusk-Free",
    apiParameter: "mollusk-free",
    definition: "No mollusks",
  },
  {
    type: "Health",
    webLabel: "Mustard-Free",
    apiParameter: "mustard-free",
    definition: "Does not contain mustard or derivatives",
  },
  {
    type: "Health",
    webLabel: "No oil added",
    apiParameter: "No-oil-added",
    definition:
      "No oil added except to what is contained in the basic ingredients",
  },
  {
    type: "Health",
    webLabel: "Paleo",
    apiParameter: "paleo",
    definition:
      "Excludes what are perceived to be agricultural products; grains, legumes, dairy products, potatoes, refined salt, refined sugar, and processed oils",
  },
  {
    type: "Health",
    webLabel: "Peanut-Free",
    apiParameter: "peanut-free",
    definition: "No peanuts or products containing peanuts",
  },
  {
    type: "Health",
    webLabel: "Pescatarian",
    apiParameter: "pecatarian",
    definition:
      "Does not contain meat or meat based products, can contain dairy and fish",
  },
  {
    type: "Health",
    webLabel: "Pork-Free",
    apiParameter: "pork-free",
    definition: "Does not contain pork or derivatives",
  },
  {
    type: "Health",
    webLabel: "Red-Meat-Free",
    apiParameter: "red-meat-free",
    definition:
      "Does not contain beef, lamb, pork, duck, goose, game, horse, and other types of red meat or products containing red meat.",
  },
  {
    type: "Health",
    webLabel: "Sesame-Free",
    apiParameter: "sesame-free",
    definition: "Does not contain sesame seed or derivatives",
  },
  {
    type: "Health",
    webLabel: "Shellfish-Free",
    apiParameter: "shellfish-free",
    definition: "No shellfish or shellfish derivatives",
  },
  {
    type: "Health",
    webLabel: "Soy-Free",
    apiParameter: "soy-free",
    definition: "No soy or products containing soy",
  },
  {
    type: "Health",
    webLabel: "Sugar-Conscious",
    apiParameter: "sugar-conscious",
    definition: "Less than 4g of sugar per serving",
  },
  {
    type: "Health",
    webLabel: "Sulfite-Free",
    apiParameter: "sulfite-free",
    definition: "No Sulfites",
  },
  {
    type: "Health",
    webLabel: "Tree-Nut-Free",
    apiParameter: "tree-nut-free",
    definition: "No tree nuts or products containing tree nuts",
  },
  {
    type: "Health",
    webLabel: "Vegan",
    apiParameter: "vegan",
    definition: "No meat, poultry, fish, dairy, eggs or honey",
  },
  {
    type: "Health",
    webLabel: "Vegetarian",
    apiParameter: "vegetarian",
    definition: "No meat, poultry, or fish",
  },
  {
    type: "Health",
    webLabel: "Wheat-Free",
    apiParameter: "wheat-free",
    definition: "No wheat, can have gluten though",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const HealthLabels = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Health Labels
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            The list of all possible Health Labels generated from the ingredient
            information on the recipes. These labels describe commonly used
            ingredient level aspects of the recipe.
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
                    Web Label
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    API Parameter
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-black backdrop-blur backdrop-filter"
                  >
                    Definition
                  </th>
                </tr>
              </thead>
              <tbody>
                {healthLabels.map((label, labelIdx) => (
                  <tr key={label.apiParameter}>
                    <td
                      className={classNames(
                        labelIdx !== healthLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 lg:pl-8 bg-white"
                      )}
                    >
                      {label.type}
                    </td>
                    <td
                      className={classNames(
                        labelIdx !== healthLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {label.webLabel}
                    </td>
                    <td
                      className={classNames(
                        labelIdx !== healthLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {label.apiParameter}
                    </td>
                    <td
                      className={classNames(
                        labelIdx !== healthLabels.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-black bg-white"
                      )}
                    >
                      {label.definition}
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

export default HealthLabels;
