import { IFoodItemInterface, IFoodNutrient } from "./interfaces/food/food";
import { Nutrient } from "./interfaces/nutrition";

export class FoodItem implements IFoodItemInterface {
  Id?: number;
  MealId?: number;
  Name: string;
  FoodId?: string;
  Quantity: number;
  UnitOfMeasure: string;
  MeasureURI?: string;
  Protein?: number;
  nutrients: IFoodNutrient;
  Image?: string;
  Weight?: number;
  Index?: string;
  AutoUpdated?: boolean;

  constructor(
    name: string,
    quantity: number,
    unitOfMeasure: string,
    foodId?: string,
    image?: string,
    weight?: number,
    index?: string,
    mealId?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    calories?: number,
    measureURI?: string
  ) {
    this.MealId = mealId;
    this.Name = name;
    this.FoodId = foodId;
    this.Quantity = quantity;
    this.UnitOfMeasure = unitOfMeasure;
    this.MeasureURI = measureURI;
    this.Protein = protein;
    this.nutrients = {
      ENERC_KCAL: calories,
      PROCNT: protein,
      FAT: fat,
      CHOCDF: carbohydrates,
      FIBTG: 0,
    } as IFoodNutrient;
    this.Image = image;
    this.Weight = weight;
    this.Index = index;
  }
}
