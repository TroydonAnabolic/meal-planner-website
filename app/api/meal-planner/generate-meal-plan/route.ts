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
import { getMealTypeByTime } from "@/util/meal-utils";
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

    fetchedRecipes = fetchedRecipes.map((recipe, index) => {
      const dayIndex = Math.floor(
        index / Object.keys(mealPlanPreferences.plan).length
      ); // Calculate day index
      const scheduledDate = new Date(
        dayjs(startDate).add(dayIndex, "day").toISOString()
      ); // Ensure it's a Date object

      const mealTypeKey: MealType = getMealTypeByTime(scheduledDate);

      return {
        ...recipe,
        mealTypeKey: [mealTypeKey],
        timeScheduled: scheduledDate, // Add optional property
      };
    });

    let favouriteRecipes: IRecipeInterface[] | undefined = [];

    // Handle favorite recipes
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

            // Extract meal time ranges
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

            const favTimeScheduled = fav.timeScheduled
              ? new Date(fav.timeScheduled).getTime()
              : null;
            const recipeTimeScheduled = recipe.timeScheduled
              ? new Date(recipe.timeScheduled).getTime()
              : null;

            const isTimeInRange = (
              time: number | null,
              [start, end]: [Date, Date]
            ): boolean =>
              time !== null && time >= start.getTime() && time <= end.getTime();

            const isFavInRange = isTimeInRange(favTimeScheduled, favMealTime);
            const isRecipeInRange = isTimeInRange(
              recipeTimeScheduled,
              recipeMealTime
            );

            return isFavInRange && isRecipeInRange;
          });

          // Preserve original recipe if no favorite match is found
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
