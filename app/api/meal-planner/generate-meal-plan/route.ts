import {
  MealNumber,
  MealTimeRanges,
  MealType,
} from "@/constants/constants-enums";
import {
  recipeUriFormat,
  recipeUrlFormat,
} from "@/constants/constants-objects";
import { getRecipesByClientId } from "@/lib/recipe";
import {
  getEdamamMealPlan,
  getRecipesFromUris,
} from "@/lib/server-side/edamam";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";
import { IMealPlannerRequest } from "@/models/interfaces/edamam/meal-planner/meal-planner-request";
import { GeneratorResponse } from "@/models/interfaces/edamam/meal-planner/meal-planner-response";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { getEnumKeysByValues } from "@/util/enum-util";
import {
  getMealTimeRange,
  getMealTypeAndTime,
  isTimeInRange,
} from "@/util/meal-utils";
import { NextResponse } from "next/server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Import the timezone plugin
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(timezone); // Extend dayjs with the timezone plugin
dayjs.extend(utc); // Extend dayjs with UTC plugin
// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);
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
    // assign scheduled time and meal type keys to the generated recipes
    fetchedRecipes = fetchedRecipes.map((recipe, index) => {
      const dayIndex = Math.floor(
        index / Object.keys(mealPlanPreferences.plan).length
      ); // Calculate day index
      const scheduledDate = new Date(
        dayjs(startDate).add(dayIndex, "day").toISOString()
      ); // Ensure it's a Date object

      // Convert the scheduled time to the user's local timezone
      const userTimezone = dayjs.tz.guess(); // Get the user's timezone

      const { mealTypeKey, hasGeneratedForLunch, updatedDate } =
        getMealTypeAndTime(
          scheduledDate,
          recipe.mealType as MealType[],
          mealTypesToGenerateFor,
          generatedForLunch
        );
      // Update the localScheduledDate to reflect the meal time
      const localScheduledDate = dayjs(updatedDate)
        .tz(userTimezone, true)
        .toDate(); // Convert to local time
      generatedForLunch = hasGeneratedForLunch;

      // reset whether lunch is generated each time we enter a new day - a new day occurs when we created calculated recipe props
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

    // Handle favorite recipes by replacing generated recipes with favorite recipes that fall on the same mealtypekey + scheduledtime range
    if (useFavouriteRecipes && clientId > 0) {
      favouriteRecipes = (await getRecipesByClientId(clientId))?.filter(
        (r) => r.isFavourite
      );

      if (favouriteRecipes?.length) {
        fetchedRecipes = fetchedRecipes.map((fetchedRecipe) => {
          const matchingFavorite = favouriteRecipes?.find((fav) => {
            // Normalize mealTypeKey for comparison
            const fetchedRecipeMealTypes = fetchedRecipe.mealTypeKey?.map(
              (type) => type.toLowerCase()
            );
            const favMealTypes = fav.mealTypeKey?.map((type) =>
              type.toLowerCase()
            );

            if (!fetchedRecipeMealTypes || !favMealTypes) return false;

            // Check for meal type intersection
            const hasMealTypeIntersection = favMealTypes.some((favType) =>
              fetchedRecipeMealTypes.includes(favType)
            );

            // TODO: Later implement time intersection, for now only where mealtype intersects

            if (!hasMealTypeIntersection) return false;

            // /* Check if timeschedule falls in the same time range */
            // // Convert favorite's timeScheduled to local timezone
            const userTimezone = dayjs.tz.guess(); // Get the user's timezone

            const favTimeScheduled = fav.timeScheduled
              ? dayjs(fav.timeScheduled).tz(userTimezone, true).toDate()
              : null;

            // Convert fetched recipe's timeScheduled to local timezone
            const fetchedRecipeTimeScheduled = fetchedRecipe.timeScheduled
              ? dayjs(fetchedRecipe.timeScheduled)
                  .tz(userTimezone, true)
                  .toDate()
              : null;

            const favMealTime = favMealTypes
              .map((type) => getMealTimeRange(type, favTimeScheduled!))
              .filter(Boolean)[0];

            const recipeMealTime = fetchedRecipeMealTypes
              .map((type) =>
                getMealTimeRange(type, fetchedRecipeTimeScheduled!)
              )
              .filter(Boolean)[0];

            if (!favMealTime || !recipeMealTime) return false;

            const isFavInRange = favTimeScheduled
              ? isTimeInRange(favTimeScheduled, favMealTime)
              : false;
            const isfetchedRecipeInRange = fetchedRecipeTimeScheduled
              ? isTimeInRange(fetchedRecipeTimeScheduled, recipeMealTime)
              : false;

            return isFavInRange && isfetchedRecipeInRange;
          });

          return matchingFavorite
            ? { ...fetchedRecipe, ...matchingFavorite, isFavourite: true }
            : { ...fetchedRecipe, isFavourite: false };
        });
      }
    }

    // Update the generated meal plan with replaced favorite recipes
    // generatedMealPlan?.selection.forEach((selectionItem, dayIndex) => {
    //   Object.values(selectionItem.sections).forEach((section) => {
    //     const sectionRecipe = fetchedRecipes.find((recipe) => {
    //       const formattedUri = recipe.uri.replace(
    //         recipeUriFormat,
    //         recipeUrlFormat
    //       );

    //       formattedUri == section._links.self.href; //&& isSameHour;

    //       if (formattedUri != section._links.self.href) {
    //         section.assigned = recipe.uri;
    //       }
    //     });

    //     // if (sectionRecipe) {
    //     //   // const formattedUri = sectionRecipe.uri.replace(
    //     //   //   recipeUriFormat,
    //     //   //   recipeUrlFormat
    //     //   // );
    //     //   section.assigned = sectionRecipe.uri;
    //     // }
    //   });
    // });

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
