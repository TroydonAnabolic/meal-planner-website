import {
  Nutrient,
  NutritionDataInterface,
  ParsedIngredient,
} from "./interfaces/nutrition";

class NutritionData implements NutritionDataInterface {
  uri: string = "";
  image: string = "";
  calories: number = 0;
  totalWeight: number = 0;
  dietLabels: string[] = [];
  healthLabels: string[] = [];
  cautions: string[] = [];
  totalNutrients: { [key: string]: Nutrient } = {};
  totalDaily: { [key: string]: Nutrient } = {};
  ingredients: { parsed: ParsedIngredient[] }[] = [];
}

export default NutritionData;
