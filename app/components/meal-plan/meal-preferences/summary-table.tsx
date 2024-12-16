import React from "react";
import {
  AllMealSection,
  IMealPlanPreferences,
} from "@/models/interfaces/client/meal-planner-preferences";
import styles from "./meal-preferences.module.css";

type SummaryTableProps = {
  mealPlanPreferences: IMealPlanPreferences;
};

type Section = {
  [key: string]: AllMealSection;
};

const SummaryTable: React.FC<SummaryTableProps> = ({ mealPlanPreferences }) => {
  const { size, plan } = mealPlanPreferences;

  const allMealSection: Section = { "All Meals": plan };

  const sections = { ...allMealSection, ...plan.sections };

  const categories = [
    "Health Labels",
    "Diet Labels",
    "Caution Labels",
    "Cuisine Types",
    "Dish Types",
    "Only Dish Types",
    "Nutrients", // Added category
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Meal Preferences Summary
      </h3>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border table-fixed">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              {Object.keys(sections).map((section) => (
                <th
                  key={section}
                  className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                >
                  {section}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category}>
                <td
                  className={`px-6 py-4 border-b text-sm text-gray-900 ${styles["fixed-height-cell"]}`}
                >
                  {category}
                </td>
                {Object.values(sections).map((section, idx) => {
                  let data: string | React.ReactNode = "None";

                  if (category === "Nutrients") {
                    const nutrients = section.fit || {};
                    data =
                      Object.keys(nutrients).length > 0 ? (
                        <ul className="list-disc pl-5">
                          {Object.entries(nutrients).map(
                            ([nutrient, range], index) => (
                              <li key={index}>
                                {nutrient}: {range.min} - {range.max}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        "None"
                      );
                  } else {
                    switch (category) {
                      case "Health Labels":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition.health || []
                          ) || [];
                        break;
                      case "Diet Labels":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition.diet || []
                          ) || [];
                        break;
                      case "Caution Labels":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition.caution || []
                          ) || [];
                        break;
                      case "Cuisine Types":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition.cuisine || []
                          ) || [];
                        break;
                      case "Dish Types":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition.dish || []
                          ) || [];
                        break;
                      case "Only Dish Types":
                        data =
                          section.accept?.all?.flatMap(
                            (condition) => condition["only-dish"] || []
                          ) || [];
                        break;
                      default:
                        data = [];
                    }

                    if (Array.isArray(data) && data.length > 0) {
                      data = (
                        <div className={styles["fixed-height-cell"]}>
                          <ul className="list-disc pl-5">
                            {data.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    } else {
                      data = "None";
                    }
                  }

                  return (
                    <td
                      key={idx}
                      className={`px-6 py-4 border-b text-sm text-gray-700 ${styles["fixed-height-cell"]}`}
                    >
                      {data}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
