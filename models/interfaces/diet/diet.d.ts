import { ActivityLevel, GenderType } from "../../client";
import Goal, { HealthGoals } from "../../goal";
import Meal from "../../meal";
import {
  BudgetConstraintsDto,
  DietaryPreferencesDto,
  FoodDislikesDto,
} from "../client/IClientSettingsInterface";
import { GoalInterface } from "../Goal/GoalInterface";

interface MealPlanGenerator {
  generateMealPlan(): DietInterface;
}

interface MealPlanDisplay {
  displayMealPlan(mealPlan: DietInterface): void;
}

interface DietInterface {
  Id?: number;
  Name?: string;
  GoalId?: number;
  GoalDto?: GoalInterface;
  BMR?: number;
  TDEE?: number;
  TargetTotalDailyCalories?: number;
  TargetCarbohydrates?: number;
  TargetProtein?: number;
  TargetFat?: number;
  StartDate: Date;
  EndDate?: Date;
  Meals: Meal[];
}

interface MealPlanGeneratorInputInterface {
  ClientId: number;
  GoalId: number;
  StartDate: Date;
  EndDate: Date;
  TargetTotalDailyCalories: number;
  BMR?: number;
  TDEE?: number;
  healthGoals?: HealthGoals;
  Age?: number;
  BodyWeight?: number;
  Height?: number;
  Gender?: GenderType;
  Birthday: Date;
  Activity?: ActivityLevel;
  Bodyfat?: number;
  // food prefs
  foodDislikes?: FoodDislikesDto;
  dietaryPreferences?: DietaryPreferencesDto;
  medicalConditions?: string;
  medicalConditionsArr?: string[];
  medicationsAndSupplements?: string;
  medicationsAndSupplementsArr?: string[];
  cookingSkills?: string;
  freeTimeToCook?: string;
  budgetConstraints?: BudgetConstraintsDto;
  mealType?: string;
  useFavorites?: boolean;
}
