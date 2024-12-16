export interface NutritionDataInterface {
  uri: string;
  image: string;
  calories: number;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  totalNutrients: { [key: string]: Nutrient };
  totalDaily: { [key: string]: Nutrient };
  ingredients: { parsed: ParsedIngredient[] }[];
}

export interface ParsedIngredient {
  quantity: number;
  measure: string;
  food: string;
  foodId: string;
  weight: number;
  retainedWeight: number;
  measureURI: string;
  status: string;
}

interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

export interface INutrients {
  [key: string]: Nutrient;
}
