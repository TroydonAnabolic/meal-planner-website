import {
  CuisineType,
  DietLabels,
  DishType,
  HealthLabels,
} from "../../../constants/constants-enums";
import { MealNumber } from "../../meal";

/**
 * Represents a query object for the Edaman API.
 */
export interface IRecipeRequest {
  /** Query text, for example "chicken".
      REQUIRED if no other parameter is specified. NOT REQUIRED if any other parameter (other than application credentials) is specified. */
  q?: string;
  /** Type of recipes to search for.
      Available values : public, user, any */
  type?: string;
  /** The application ID for accessing the Edaman API. */
  app_id?: string;
  /** The application key for accessing the Edaman API. */
  app_key?: string;
  /** An array of excluded foods. */
  excluded?: string[];
  /** Indicates whether to return random results. */
  random?: string;
  /** Diet label. Available values : balanced, high-fiber, high-protein, low-carb, low-fat, low-sodium*/
  diet?: DietLabels[];
  /** Health label. Available values : alcohol-cocktail, alcohol-free, celery-free, crustacean-free, dairy-free, DASH, egg-free, fish-free, fodmap-free, gluten-free, immuno-supportive, keto-friendly, kidney-friendly, kosher, low-fat-abs, low-potassium, low-sugar, lupine-free, Mediterranean, mollusk-free, mustard-free, no-oil-added, paleo, peanut-free, pescatarian, pork-free, red-meat-free, sesame-free, shellfish-free, soy-free, sugar-conscious, sulfite-free, tree-nut-free, vegan, vegetarian, wheat-free */
  health?: HealthLabels[];
  /** The type of cuisine of the recipe. Available values : American, Asian, British, Caribbean, Central Europe, Chinese, Eastern Europe, French, Indian, Italian, Japanese, Kosher, Mediterranean, Mexican, Middle Eastern, Nordic, South American, South East Asian */
  cuisineType?: CuisineType[];
  /** The type of meal a recipe belongs to. Available values : Breakfast, Dinner, Lunch, Snack, Teatime*/
  mealType?: string[];
  /** AThe dish type a recipe belongs to. Available values : Biscuits and cookies, Bread, Cereals, Condiments and sauces, Desserts, Drinks, Main course, Pancake, Preps, Preserve, Salad, Sandwiches, Side dish, Soup, Starter, Sweets */
  dishType?: DishType[];
  /** The format is calories=RANGE where RANGE is in one of MIN+, MIN-MAX or MAX, where MIN and MAX are non-negative floating point numbers. The + symbol needs to be properly encoded. Examples: “calories=100-300” will return all recipes with which have between 100 and 300 kcal per serving. */
  calories?: string;
  /** Time range for the total cooking and prep time for a recipe . The format is time=RANGE where RANGE is one of MIN+, MIN-MAX or MAX, where MIN and MAX are non-negative integer numbers. The + symbol needs to be properly encoded. Examples: “time=1%2B” will return all recipes with available total time greater then 1 minute */
  time?: string;
  /** Recipe fields to be included in the response.

Available values : uri, label, image, images, source, url, shareAs, yield, dietLabels, healthLabels, cautions, ingredientLines, ingredients, calories, glycemicIndex, inflammatoryIndex, totalCO2Emissions, co2EmissionsClass, totalWeight, totalTime, cuisineType, mealType, dishType, totalNutrients, totalDaily, digest, tags, externalId */
  field?: string[];
}
