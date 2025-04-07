import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { NextResponse } from "next/server";
import {
  generateMealPlansAndRecipes,
  getMatchingRecipe,
} from "@/lib/server-side/meal-plan-generator";
import { MealType } from "@/constants/constants-enums";
import { getRecipesByClientId } from "@/lib/server-side/recipe";
import {
  getEdamamMealPlan,
  getRecipesFromUris,
} from "@/lib/server-side/edamam";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import { getLocalTimeFromUtc } from "@/util/date-util";
import { reUseRecipes, formatUri } from "@/util/meal-generator-util";
import { getMealTypeAndTime } from "@/util/meal-utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin
// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

export const maxDuration = 60; // This function can run for a maximum of 2 minutes

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

    const mealTypesToGenerateFor = [
      ...new Set(
        generatedMealPlan.selection.flatMap((selectionItem) =>
          Object.keys(selectionItem?.sections || {})
        )
      ),
    ];

    let generatedForLunch = false;
    let counter = 0;
    let totalRecipesProcessed = -1;
    let dayIndex = 0;
    let weeklyRecipesAddedTracker: IRecipeInterface[] = [];
    let currentDayRecipes: { [key: string]: IRecipeInterface } = {}; // Track assigned recipes for each day

    // assign scheduled time and meal type keys to the generated recipes
    fetchedRecipes = fetchedRecipes.map((recipe, index) => {
      // Increment totalRecipesProcessed for each recipe
      totalRecipesProcessed++;

      // increment day by 1 each time we reach meal type length
      if (totalRecipesProcessed === mealTypesToGenerateFor.length) {
        totalRecipesProcessed = 0;
        dayIndex++;
        currentDayRecipes = {}; // Reset current day recipes
      }

      // Calculate the day index based on total recipes and meal types
      const scheduledDate = new Date(
        dayjs(startDate).add(dayIndex, "day").toISOString()
      ); // Ensure it's a Date object

      const { mealTypeKey, hasGeneratedForDinner, updatedDate } =
        getMealTypeAndTime(
          scheduledDate,
          recipe.mealType as MealType[],
          mealTypesToGenerateFor,
          generatedForLunch
        );

      // Convert the scheduled time to the user's local timezone
      const localScheduledDate = getLocalTimeFromUtc(updatedDate);

      // Convert to local time
      generatedForLunch = hasGeneratedForDinner;

      counter++;
      if (counter % mealTypesToGenerateFor.length == 0) {
        generatedForLunch = false;
      }
      return {
        ...recipe,
        mealTypeKey: [mealTypeKey!],
        timeScheduled: localScheduledDate, // Add optional property
      };
    });

    let favouriteRecipes: IRecipeInterface[] | undefined = [];
    // Track replacements
    const replacements: { fetchedUri: string; favoriteUri: string }[] = [];
    weeklyRecipesAddedTracker = [];
    const recipeYieldTracker: Record<string, number> = {};
    // Handle favorite recipes by replacing generated recipes with favorite recipes that fall on the same mealtypekey + scheduledtime range
    if (useFavouriteRecipes && clientId > 0) {
      favouriteRecipes = (await getRecipesByClientId(clientId))?.filter(
        (r) => r.isFavourite
      );

      if (favouriteRecipes?.length) {
        // reset index to reassign breakfast meal times
        // dayIndex = 0;
        // totalRecipesProcessed = -1;
        fetchedRecipes = fetchedRecipes.map((fetchedRecipe, index) => {
          // if (totalRecipesProcessed === mealTypesToGenerateFor.length) {
          //   totalRecipesProcessed = 0;
          //   dayIndex++;
          //   currentDayRecipes = {}; // Reset current day recipes
          // }
          let matchingFavorite = getMatchingRecipe(
            favouriteRecipes,
            fetchedRecipe
          );

          if (matchingFavorite) {
            replacements.push({
              fetchedUri: fetchedRecipe.uri,
              favoriteUri: matchingFavorite.uri,
            });

            // create a copy of time schedule
            var updatedRecipe = {
              ...matchingFavorite,
              timeScheduled: fetchedRecipe.timeScheduled,
            };

            return reUseRecipes(
              weeklyRecipesAddedTracker,
              recipeYieldTracker,
              updatedRecipe.mealTypeKey[0],
              {
                ...updatedRecipe,
              }
            );
          } else {
            return reUseRecipes(
              weeklyRecipesAddedTracker,
              recipeYieldTracker,
              fetchedRecipe.mealTypeKey[0],
              {
                ...fetchedRecipe,
              }
            );
          }
        });
      }
    } else {
      fetchedRecipes = fetchedRecipes.map((fetchedRecipe, index) => {
        return reUseRecipes(
          weeklyRecipesAddedTracker,
          recipeYieldTracker,
          fetchedRecipe.mealTypeKey[0],
          {
            ...fetchedRecipe,
          }
        );
      });
    }

    //TODO: test if first seciton's assigned prop matches fetchedRecipes to see if custom is assinged correctly
    // Update the generated meal plan with replaced favorite recipes
    generatedMealPlan?.selection.forEach((selectionItem) => {
      Object.values(selectionItem.sections).forEach((section) => {
        const formattedSectionUri = formatUri(section._links.self.href);

        const replacement = replacements.find(
          (r) => formattedSectionUri === formatUri(r.fetchedUri)
        );
        if (replacement) {
          section.assigned = replacement.favoriteUri;
          section._links.self.href = formatUri(replacement.favoriteUri); // Update the section URI
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
