export interface IFoodIngredient {
  quantity: number;
  measureURI: string;
  qualifiers?: string[];
  foodId: string;
}

export interface IFoodNutrientsRequest {
  ingredients: IFoodIngredient[];
}
