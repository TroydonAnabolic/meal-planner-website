import {
  recipeUriFormat,
  recipeUrlFormat,
} from "@/constants/constants-objects";
import {
  getEdamamMealPlan,
  getRecipesFromUris,
} from "@/lib/server-side/edamam";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const {
      endDate,
      startDate,
      mealPlanPreferences,
      excluded,
      useFavouriteRecipes,
      clientId,
    }: {
      endDate: string;
      startDate: string;
      mealPlanPreferences: IMealPlanPreferences;
      excluded: string[];
      useFavouriteRecipes: boolean;
      clientId: number;
    } = await req.json();

    // Calculate size of the meal plan
    const size = dayjs(endDate).diff(dayjs(startDate), "day") + 1;

    // Destructure and exclude `clientSettingsId` from mealPlanPreferences
    const { clientSettingsId, id, ...cleanedMealPlanPreferences } =
      mealPlanPreferences;

    // Prepare the payload for the Edamam API
    const payload: IMealPlannerRequest = {
      ...cleanedMealPlanPreferences,
      size,
      plan: {
        ...cleanedMealPlanPreferences.plan,
        exclude: excluded,
      },
    };

    // Fetch the generated meal plan
    // TODO: call the below functions from server side itself
    const generatedMealPlan: GeneratorResponse = await getEdamamMealPlan(
      payload
    );

    // Extract all recipe URIs
    const recipeUris: string[] | undefined =
      generatedMealPlan.selection.flatMap((selectionItem) =>
        Object.values(selectionItem?.sections).map(
          (section) => section._links.self.href
        )
      );

    // Fetch recipes by their URIs
    let fetchedRecipes: IRecipeInterface[] = [];

    if (recipeUris) {
      fetchedRecipes = await getRecipesFromUris(recipeUris);
    }

    let favouriteRecipes: IRecipeInterface[] | undefined = [];

    // Handle favorite recipes
    if (useFavouriteRecipes && clientId > 0) {
      // favouriteRecipes = (await getRecipesByClientId(clientId))?.filter(
      //   (r) => r.isFavourite
      // );

      if (favouriteRecipes?.length) {
        fetchedRecipes = fetchedRecipes.map((recipe) => {
          // Check for intersections with favorite recipes
          const matchingFavorite = favouriteRecipes?.find((fav) => {
            const hasMealTypeIntersection = fav.mealTypeKey.some((type) =>
              recipe.mealTypeKey.includes(type)
            );
            const hasTimeIntersection =
              fav.timeScheduled &&
              recipe.timeScheduled &&
              new Date(fav.timeScheduled).getTime() ===
                new Date(recipe.timeScheduled).getTime();
            return hasMealTypeIntersection && hasTimeIntersection;
          });

          if (matchingFavorite) {
            recipe.isFavourite = true;
          }

          return matchingFavorite || recipe;
        });
      }
    }

    // Update the generated meal plan with replaced favorite recipes
    generatedMealPlan?.selection.forEach((selectionItem) => {
      Object.values(selectionItem.sections).forEach((section) => {
        const sectionRecipe = fetchedRecipes.find(
          (recipe) => recipe.uri === section._links.self.href
        );

        if (sectionRecipe) {
          const formattedUri = sectionRecipe.uri.replace(
            recipeUriFormat,
            recipeUrlFormat
          );
          section.assigned = formattedUri;
        }
      });
    });

    // Return the response
    return NextResponse.json({
      generatedMealPlan,
      favouriteRecipes,
      fetchedRecipes,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
