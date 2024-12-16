import { DayOfTheWeek } from "../../../constants/constants-enums";
import { DietInterface } from "../diet/diet";
import { Nutrient } from "../nutrition";
import { IRecipeInterface } from "../recipe/RecipeInterfacee";
import { IFoodItemInterface } from "../food/food";

export interface IMealInterface {
  id: number;
  mealPlanId?: number;
  recipeId?: number;
  clientId: number;
  name: string;
  ingredients: IMealIngredient[];
  ingredientLines: string[];
  weight: number;
  nutrients?: IMealNutrients;
  timeScheduled: Date;
  timeConsumed?: Date;
  mealTypeKey: string[];
  mealType: string[];
  isLogged: boolean;
  image?: string;
  dayOfTheWeek?: DayOfTheWeek;
  foodSourceUrl?: string;
}

export interface IMealIngredient {
  id?: number;
  mealId: number; // TODO: add mealid foreign key and to meal.id json payload for testing intializtion
  text?: string;
  quantity?: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory?: string;
  foodId: string;
  image: string;
  totalNutrients?: IMealNutrients;
  totalDaily?: IMealNutrients;
}

export interface IMealNutrients {
  [key: string]: IMealNutrient;
}

interface IMealNutrient {
  id?: number;
  recipeId?: number;
  label: string;
  quantity: number;
  unit: string;
}
