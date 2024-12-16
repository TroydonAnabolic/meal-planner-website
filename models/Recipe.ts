import {
  IRecipeInterface,
  RecipeIngredient,
  RecipeImages,
  Digest,
  RecipeNutrients,
} from "./interfaces/recipe/recipe";

class Recipe implements IRecipeInterface {
  constructor(clientId: number) {
    this.id = 0; // Assuming backend assigns ID
    this.clientId = clientId;
    this.mealId = 0;
    this.mealPlanId = 0;
    this.uri = "default-uri";
    this.image = "";
    this.label = "";
    this.source = "";
    this.url = "";
    this.shareAs = "";
    this.yield = 0;
    this.dietLabels = []; // Populate as needed
    this.healthLabels = []; // Populate as needed
    this.cautions = []; // Populate as needed
    this.ingredientLines = []; // Populate as needed
    this.ingredients = []; // Populate as needed
    this.calories = 0; // Populate as needed
    this.totalCO2Emissions = 0; // Populate as needed
    this.co2EmissionsClass = ""; // Populate as needed
    this.totalWeight = 0; // Populate as needed
    this.totalTime = 0;
    this.cuisineType = []; // Populate as needed
    this.mealType = []; // Populate as needed
    this.dishType = []; // Populate as needed
    this.digest = []; // Populate as needed
    this.totalNutrients = {}; // Populate as needed
    this.totalDaily = {}; // Populate as needed
    this.dateAdded = new Date().toISOString();
    this.mealTypeKey = []; // Populate as needed
    this.avoid = false;
  }
  id: number;
  mealId?: number | undefined;
  mealPlanId: number | null;
  clientId: number;
  uri: string;
  label: string;
  image: string;
  images?: RecipeImages | undefined;
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
  dishType: string[];
  digest: Digest[];
  totalNutrients?: RecipeNutrients | undefined;
  totalDaily?: RecipeNutrients | undefined;
  dateAdded: string;
  mealTypeKey: string[];
  avoid: boolean;
}

export default Recipe;
