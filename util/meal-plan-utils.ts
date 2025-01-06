// app/utils/mealPlanUtils.ts

import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import dayjs, { Dayjs } from "dayjs";
import ReactDOMServer from "react-dom/server";
import MealPlanSection from "@/app/components/meal-plan/meal-planning/meal-plan-section"; // Adjust the path as needed
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";

export const generateEmptySelections = (
  startDate: Dayjs,
  endDate: Dayjs
): IMealPlan["selection"] => {
  const selections = [];
  let current = startDate.clone();

  while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
    selections.push({
      id: 0,
      clientId: 0,
      startDate: dayjs().startOf("week").toISOString(),
      endDate: dayjs().endOf("week").toISOString(),
      sections: {
        Breakfast: {
          assigned:
            "http://www.edamam.com/ontologies/edamam.owl#recipe_9ccd7c12d4ea90541966b7d02a56c7a6",
          _links: {
            self: {
              title: "Recipe details",
              href: "https://api.edamam.com/api/recipes/v2/9ccd7c12d4ea90541966b7d02a56c7a6?type=public",
            },
          },
        },
        Lunch: {
          assigned:
            "http://www.edamam.com/ontologies/edamam.owl#recipe_72719aab9078491ef27903ea94f50ec6",
          _links: {
            self: {
              title: "Recipe details",
              href: "https://api.edamam.com/api/recipes/v2/72719aab9078491ef27903ea94f50ec6?type=public",
            },
          },
        },
        Dinner: {
          assigned:
            "http://www.edamam.com/ontologies/edamam.owl#recipe_4b32887b8cd4462fb58d21b5b6cae0b4",
          _links: {
            self: {
              title: "Recipe details",
              href: "https://api.edamam.com/api/recipes/v2/4b32887b8cd4462fb58d21b5b6cae0b4?type=public",
            },
          },
        },
      },
    });

    current = current.add(1, "day");
  }

  return selections;
};
