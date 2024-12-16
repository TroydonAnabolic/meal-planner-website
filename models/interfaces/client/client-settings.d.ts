import {
  CuisineType,
  HealthGoals,
  MicroNutrients,
} from "@/constants/constants-enums";
import { IMealPlanPreferences } from "./meal-planner-preferences";

export interface IClientSettingsInterface {
  id: number;
  clientId: number;
  timezoneId?: string;
  foodDislikes?: FoodDislikesDto;
  dietaryPreferences?: DietaryPreferencesDto;
  medicalConditions?: string;
  medicalConditionsArr?: string[];
  medicationsAndSupplements?: string;
  medicationsAndSupplementsArr?: string[];
  cookingSkills?: string;
  freeTimeToCook?: string;
  budgetConstraints?: BudgetConstraintsDto;
  healthGoals?: HealthGoals;
  mealPlanPreferences?: IMealPlanPreferences;
}

export interface FoodDislikesDto {
  id: number;
  clientSettingsId: number;
  avoidedFoods: string;
  avoidedFoodsArr?: { name: string }[];
}

// TODO: Make sure when designing the UI and the Chat GPT feed, that when custom is enabled,
// it will customize the input, and also remember to use those sliders chatgpt generated before
export interface Preference {
  name: string;
}

// Define a new interface for preference arrays
interface PreferenceArray {
  name: string;
}

// Update the DietaryPreferencesDto interface to use the PreferenceArray interface
export interface DietaryPreferencesDto {
  id: number;
  clientSettingsId: number;
  healthLabelsDto?: HealthLabelsInterface;
  dietLabelsDto?: DietLabelsInterface;
  cuisineTypesDto?: CuisineTypeInterface;
  dishTypesArr?: PreferenceArray[];
  custom: boolean;
  notes?: string;
  customRatio?: MacronutrientRatioDto;
  breakfastPreference: string;
  breakfastPreferenceArr?: PreferenceArray[];
  brunchPreference: string;
  brunchPreferenceArr?: PreferenceArray[];
  lunchPreference: string;
  lunchPreferenceArr?: PreferenceArray[];
  snackPreference: string;
  snackPreferenceArr?: PreferenceArray[];
  teaTimePreference: string;
  teamTimePreferenceArr?: PreferenceArray[];
  dinnerPreference: string;
  dinnerPreferenceArr?: PreferenceArray[];
}

export interface CuisineTypeInterface {
  id: number;
  [CuisineType.american]: boolean;
  [CuisineType.asian]: boolean;
  [CuisineType.british]: boolean;
  [CuisineType.caribbean]: boolean;
  [CuisineType.centralEurope]: boolean;
  [CuisineType.chinese]: boolean;
  [CuisineType.easternEurope]: boolean;
  [CuisineType.french]: boolean;
  [CuisineType.greek]: boolean;
  [CuisineType.indian]: boolean;
  [CuisineType.italian]: boolean;
  [CuisineType.japanese]: boolean;
  [CuisineType.korean]: boolean;
  [CuisineType.kosher]: boolean;
  [CuisineType.mediterranean]: boolean;
  [CuisineType.mexican]: boolean;
  [CuisineType.middleEastern]: boolean;
  [CuisineType.nordic]: boolean;
  [CuisineType.southAmerican]: boolean;
  [CuisineType.southEastAsian]: boolean;
  [CuisineType.world]: boolean;
}

export interface DietLabelsInterface {
  id: number;
  dietaryPreferencesId: number;
  balanced: boolean;
  highFiber: boolean;
  highProtein: boolean;
  lowCarb: boolean;
  lowFat: boolean;
  lowSodium: boolean;
}

export interface HealthLabelsInterface {
  id: number;
  dietaryPreferencesId: number;
  alcoholCocktail: boolean;
  alcoholFree: boolean;
  celeryFree: boolean;
  crustceanFree: boolean;
  dairyFree: boolean;
  dash: boolean;
  eggFree: boolean;
  fishFree: boolean;
  fodMapFree: boolean;
  glutenFree: boolean;
  immunoSupportive: boolean;
  ketoFriendly: boolean;
  kidneyFriendly: boolean;
  kosher: boolean;
  lowPotassium: boolean;
  lowSugar: boolean;
  lupineFree: boolean;
  mediterranean: boolean;
  molluskFree: boolean;
  mustardFree: boolean;
  noOilAdded: boolean;
  paleo: boolean;
  peanutFree: boolean;
  pescatarian: boolean;
  porkFree: boolean;
  redMeatFree: boolean;
  sesameFree: boolean;
  shellfishFree: boolean;
  soyFree: boolean;
  sugarConscious: boolean;
  sulfiteFree: boolean;
  treeNutFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  wheatFree: boolean;
}

export interface MacronutrientRatioDto {
  proteinPercentage: number;
  fatPercentage: number;
  carbsPercentage: number;
}

export interface BudgetConstraintsDto {
  id: number;
  clientSettingsId: number;
  amount?: number;
  frequency: Frequency;
}

enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}

// TODO: In the future after shipping, configure micros for extra customisation on surgar levels, and other useful micros
export interface MicroNutrientRangesDto {
  [MicroNutrients.sugar]: string;
  [MicroNutrients.sugarAdded]: string;
  [MicroNutrients.sugarAlcohol]: string;
}
