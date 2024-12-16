interface INutrientInfo {
  label: string;
  tag: string;
  units: string;
}

interface INutrientKCalInfo {
  label: string;
  quantity: number;
  unit: string;
}

interface IServingSize {
  uri: string;
  label: string;
  quantity: number;
}

interface IIngredientNutrient {
  [key: string]: INutrientInfo;
}

interface IResponseIngredient {
  quantity: number;
  measure: string;
  measureURI: string;
  foodMatch: string;
  food: string;
  foodId: string;
  foodURI: string;
  specificFoodURI: string;
  foodCategory: string;
  brand: string;
  weight: number;
  retainedWeight: number;
  nutrients: IIngredientNutrient;
  status: "OK" | string;
  template: string;
  servingSizes: IServingSize[];
  servingsPerContainer: number;
}

interface ITotalNutrients {
  [key: string]: INutrientKCalInfo;
}

interface ITotalNutrientsKCal {
  [key: string]: INutrientKCalInfo;
}

interface ITotalDaily {
  [key: string]: INutrientKCalInfo;
}

interface IFoodNutrients {
  uri: string;
  url: string;
  yield: number;
  calories: number;
  glycemicIndex: number;
  inflammatoryIndex: number;
  co2EmissionsClass: string;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  totalNutrients: ITotalNutrients;
  totalNutrientsKCal: ITotalNutrientsKCal;
  totalDaily: ITotalDaily;
  ingredientLines: string[];
  label: string;
  preparation: string[];
  ingredients: IResponseIngredient[];
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
}

export interface IFoodNutrientsResponse {
  status: number;
  data?: IFoodNutrients;
}
