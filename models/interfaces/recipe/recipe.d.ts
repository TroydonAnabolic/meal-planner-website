interface RecipeImage {
  url: string;
  width: number;
  height: number;
}

interface RecipeImages {
  id?: number;
  recipeId?: number;
  THUMBNAIL: RecipeImage;
  SMALL: RecipeImage;
  REGULAR: RecipeImage;
  LARGE: RecipeImage;
}

export interface RecipeIngredient {
  id?: number;
  recipeId: number;
  text?: string;
  quantity?: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory?: string;
  foodId: string; // foodId is null for custom ingredients
  image: string;
  totalNutrients?: RecipeTotalNutrients;
  totalDaily?: RecipeTotalNutrients;
}

interface RecipeNutrient {
  id?: number;
  recipeId?: number;
  label: string;
  quantity: number;
  unit: string;
}

export interface RecipeNutrients {
  [key: string]: RecipeNutrient;
}

export interface IRecipeInterface {
  id: number;
  mealPlanId: number | null;
  clientId: number;
  uri: string;
  label: string;
  image: string;
  mealId?: number;
  images?: RecipeImages;
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: RecipeIngredient[];
  calories: number;
  totalCO2Emissions: number;
  co2EmissionsClass: string;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  mealTypeKey: string[];
  dishType: string[];
  digest: Digest[];
  totalNutrients?: RecipeNutrients;
  totalDaily?: RecipeNutrients;
  // Base Nutrients (without scaling)
  baseTotalNutrients?: { [key: string]: RecipeNutrient };
  baseTotalDaily?: { [key: string]: RecipeNutrient };
  baseTotalWeight?: number;
  dateAdded: string;
  avoid: boolean;
  isCustom?: boolean;
  timeScheduled?: Date;
  isFavourite?: boolean;
}

export interface Digest {
  label: string;
  tag: string;
  schemaOrgTag?: string;
  total: number;
  hasRDI: boolean;
  daily: number;
  unit: string;
}

export interface IRecipeHit {
  recipe: IRecipeInterface;
  _links: {
    self?: {
      href: string;
      title: string;
    };
  };
}
