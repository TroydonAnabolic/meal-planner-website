import MealPlanSection from "@/app/components/meal-plan/meal-planning/meal-plan-section";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import ReactDOMServer from "react-dom/server";

export const renderMealPlanToHTML = (
  mealPlanData: IMealPlan[] | undefined,
  recipesData: IRecipeInterface[] | undefined,
  clientId: number
) => {
  return ReactDOMServer.renderToStaticMarkup(
    <MealPlanSection
      mealPlanData={mealPlanData}
      recipesData={recipesData}
      clientId={clientId}
    />
  );
};
