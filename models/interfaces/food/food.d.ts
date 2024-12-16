import { IFoodNutrients } from "../edamam/food/nutrients-response";
import { INutrients } from "../nutrition";

export interface IFood {
  foodId: string;
  uri: string;
  label: string;
  knownAs: string;
  nutrients: IFoodNutrient;
  brand: string;
  category: string;
  categoryLabel: string;
  foodContentsLabel: string;
  image: string;
  servingSizes: ServingSize[];
  servingsPerContainer: number;
}

export interface IFoodItemInterface {
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
}

interface IFoodNutrient {
  ENERC_KCAL: number; // Energy in kcal
  PROCNT: number; // Protein in grams
  FAT: number; // Fat in grams
  CHOCDF: number; // Carbohydrates in grams
  FIBTG: number; // Fiber in grams
}

interface ServingSize {
  uri: string;
  label: string;
  quantity: number;
}

interface Qualifier {
  uri: string;
  label: string;
}

interface QualifiedMeasure {
  qualifiers: Qualifier[];
  weight: number;
}

export interface Measure {
  uri: string;
  label: string;
  weight: number;
  qualified: QualifiedMeasure[];
}

export interface IFoodLabels {
  cuisineType?: string[];
  dishType?: string[];
  dietLabels?: string[];
  healthLabels?: string[];
  cautions?: string[];
  mealTypeKey?: string[];
}
