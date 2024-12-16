// import { DayOfTheWeek } from "../constants/constants-enums";
// import { IFoodItemInterface } from "./interfaces/food/food";
// import { IMealIngredient, IMealInterface, IMealNutrients } from "./interfaces/meal/meal";

// import { Nutrient } from "./interfaces/nutrition";
// import { IRecipeInterface } from "./interfaces/recipe/recipe";

// class Meal implements IMealInterface {
//   Id?: number;
//   DietId?: number;
//   RecipeId?: number; // TODO: Store all recipe data, to later display ingredients on meals
//   Recipe?: IRecipeInterface; // TODO: Store all recipe data, to later display ingredients on meals
//   ClientId?: number;
//   Name: string;
//   Carbohydrates: number;
//   Fat: number;
//   Protein: number;
//   Calories: number;
//   //Nutrients: { [key: string]: Nutrient } = {};
//   TimeConsumed?: Date;
//  // MealNumber: string;
//   IsLogged: boolean;
//   Image?: string;
//   FoodItemDtos: IFoodItemInterface[];
//   DayOfTheWeek: DayOfTheWeek;
//   FoodSourceUrl?: string;
//   Yield?: number;

//   constructor(
//     clientId: number,
//     name: string,
//     carbohydrates: number,
//     fat: number,
//     protein: number,
//     calories: number,
//     //mealNumber: string,
//     isLogged: boolean,
//     image: string,
//     foodItemDtos: IFoodItemInterface[],
//     dayOfTheWeek: DayOfTheWeek,
//     timeConsumed?: Date,
//     foodSourceUrl?: string
//   ) {
//     this.ClientId = clientId;
//     this.Name = name;
//     this.Carbohydrates = carbohydrates;
//     this.Fat = fat;
//     this.Protein = protein;
//     this.Calories = calories;
//     this.TimeConsumed = timeConsumed;
//   //  this.MealNumber = mealNumber;
//     this.IsLogged = isLogged;
//     this.Image = image;
//     this.FoodItemDtos = foodItemDtos;
//     this.DayOfTheWeek = dayOfTheWeek;
//     this.FoodSourceUrl = foodSourceUrl;
//   }
//   id: number;
//   dietId: number;
//   recipeId?: number | undefined;
//   clientId: number;
//   name: string;
//   ingredients: IMealIngredient[];
//   ingredientLines: string[];
//   weight: number;
//   nutrients?: IMealNutrients | undefined;
//   timeScheduled: Date;
//   timeConsumed?: Date | undefined;
//   mealTypeKey: string[];
//   mealType: string[];
//   isLogged: boolean;
//   image?: string | undefined;
//   dayOfTheWeek?: DayOfTheWeek | undefined;
//   foodSourceUrl?: string | undefined;
// }

// export enum MealNumber {
//   Meal1 = "Breakfast",
//   Meal2 = "Brunch",
//   Meal3 = "Lunch",
//   Meal4 = "Snack",
//   Meal5 = "Teatime",
//   Meal6 = "Dinner",
// }

// // Mapping of MealNumber enum to time of day in "hh:mm" format
// export const mealTimeMapping: Record<MealNumber, string> = {
//   [MealNumber.Meal1]: "08:00", // Breakfast at 8:00 AM
//   [MealNumber.Meal2]: "10:30", // Brunch at 10:30 AM
//   [MealNumber.Meal3]: "12:00", // Lunch at 12:00 PM
//   [MealNumber.Meal4]: "15:00", // Snack at 3:00 PM
//   [MealNumber.Meal5]: "17:30", // Teatime at 5:30 PM
//   [MealNumber.Meal6]: "19:00", // Dinner at 7:00 PM
// };

// export const getMealTypeLabel = (mealType: MealNumber): string => {
//   switch (mealType) {
//     case MealNumber.Meal1:
//       return "Breakfast";
//     case MealNumber.Meal2:
//       return "Brunch";
//     case MealNumber.Meal3:
//       return "Lunch";
//     case MealNumber.Meal4:
//       return "Snack";
//     case MealNumber.Meal5:
//       return "Teatime";
//     case MealNumber.Meal6:
//       return "Dinner";
//     default:
//       return "";
//   }
// };

// export default Meal;
