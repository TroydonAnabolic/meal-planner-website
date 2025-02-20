export interface IIngredient {
  id: number;
  clientId: number;
  mealId?: number;
  recipeId?: number;
  text?: string;
  quantity?: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory?: string;
  foodId?: string | null; // foodId is null for custom ingredients
  image: string;
  totalNutrients?: INutrients;
}

export interface INutrients {
  [Nutrients.ENERC_KCAL]: INutrient;
  [Nutrients.FAT]: INutrient;
  [Nutrients.FASAT]: INutrient;
  [Nutrients.FATRN]: INutrient;
  [Nutrients.FAMS]: INutrient;
  [Nutrients.FAPU]: INutrient;
  [Nutrients.CHOCDF]: INutrient;
  [Nutrients.CHOCDF_net]: INutrient;
  [Nutrients.FIBTG]: INutrient;
  [Nutrients.SUGAR]: INutrient;
  [Nutrients.PROCNT]: INutrient;
  [Nutrients.CHOLE]: INutrient;
  [Nutrients.NA]: INutrient;
  [Nutrients.CA]: INutrient;
  [Nutrients.MG]: INutrient;
  [Nutrients.K]: INutrient;
  [Nutrients.FE]: INutrient;
  [Nutrients.ZN]: INutrient;
  [Nutrients.P]: INutrient;
  [Nutrients.VITA_RAE]: INutrient;
  [Nutrients.VITC]: INutrient;
  [Nutrients.THIA]: INutrient;
  [Nutrients.RIBF]: INutrient;
  [Nutrients.NIA]: INutrient;
  [Nutrients.VITB6A]: INutrient;
  [Nutrients.FOLDFE]: INutrient;
  [Nutrients.FOLFD]: INutrient;
  [Nutrients.FOLAC]: INutrient;
  [Nutrients.VITB12]: INutrient;
  [Nutrients.VITD]: INutrient;
  [Nutrients.TOCPHA]: INutrient;
  [Nutrients.VITK1]: INutrient;
  [Nutrients.WATER]: INutrient;
}

export interface INutrient {
  label: string;
  quantity: number;
  unit: string;
}
