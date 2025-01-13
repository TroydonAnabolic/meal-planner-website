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
import { getMealTypeAndTime } from "@/util/meal-utils";
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
        fetchedRecipes = fetchedRecipes.map((recipe) => {
          const matchingFavorite = favouriteRecipes?.find((fav) => {
            // Normalize mealTypeKey for comparison
            const recipeMealTypes = recipe.mealTypeKey?.map((type) =>
              type.toLowerCase()
            );
            const favMealTypes = fav.mealTypeKey?.map((type) =>
              type.toLowerCase()
            );

            if (!recipeMealTypes || !favMealTypes) return false;

            // Check for meal type intersection
            const hasMealTypeIntersection = favMealTypes.some((favType) =>
              recipeMealTypes.includes(favType)
            );

            if (!hasMealTypeIntersection) return false;

            // Convert favorite's timeScheduled to local timezone
            const userTimezone = dayjs.tz.guess(); // Get the user's timezone
            const favTimeScheduled = fav.timeScheduled
              ? dayjs(fav.timeScheduled).tz(userTimezone, true).toDate()
              : null;

            // Convert recipe's timeScheduled to local timezone
            const recipeTimeScheduled = recipe.timeScheduled
              ? dayjs(recipe.timeScheduled).tz(userTimezone, true).toDate()
              : null;

            // Extract and compare meal time ranges
            const getMealTimeRange = (
              mealTypeKey: string
            ): [Date, Date] | null => {
              const matchedMealType = Object.keys(MealTimeRanges).find(
                (key) => key.toLowerCase() === mealTypeKey.toLowerCase()
              );
              if (!matchedMealType) return null;

              const [start, end] = MealTimeRanges[matchedMealType as MealNumber]
                .split(" - ")
                .map(
                  (time) =>
                    new Date(
                      `1970-01-01T${
                        new Date(`1970-01-01T${time}`)
                          // TODO: Debug
                          .toISOString()
                          .split("T")[1]
                      }`
                    )
                );

              return [start, end];
            };

            const favMealTime = favMealTypes
              .map(getMealTimeRange)
              .filter(Boolean)[0];
            const recipeMealTime = recipeMealTypes
              .map(getMealTimeRange)
              .filter(Boolean)[0];

            if (!favMealTime || !recipeMealTime) return false;

            const isTimeInRange = (
              time: Date | null,
              [start, end]: [Date, Date]
            ): boolean => {
              return (
                time !== null &&
                time.getTime() >= start.getTime() &&
                time.getTime() <= end.getTime()
              );
            };

            const isFavInRange = favTimeScheduled
              ? isTimeInRange(favTimeScheduled, favMealTime)
              : false;
            const isRecipeInRange = recipeTimeScheduled
              ? isTimeInRange(recipeTimeScheduled, recipeMealTime)
              : false;

            return isFavInRange && isRecipeInRange;
          });

          return matchingFavorite
            ? { ...recipe, isFavourite: true }
            : { ...recipe, isFavourite: false };
        });
      }
    }

    // Update the generated meal plan with replaced favorite recipes
    generatedMealPlan?.selection.forEach((selectionItem, dayIndex) => {
      Object.values(selectionItem.sections).forEach((section) => {
        const sectionRecipe = fetchedRecipes.find((recipe) => {
          // TODO: maybe remove this to see if its causing issues
          // const isSameHour = dayjs(recipe.timeScheduled).isSame(
          //   dayjs(startDate).add(dayIndex, "day").startOf("hour"),
          //   "hour"
          // );
          recipe.uri === section._links.self.href; //&& isSameHour;
        });

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
