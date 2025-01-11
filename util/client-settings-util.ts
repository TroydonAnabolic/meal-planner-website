// diet-generator/util/client-settings.ts
import { Frequency, HealthGoals } from "@/constants/constants-enums";
import { IClientInterface } from "@/models/interfaces/client/client";
import {
  DietaryPreferencesDto,
  FoodDislikesDto,
  BudgetConstraintsDto,
} from "@/models/interfaces/client/client-settings";
import { IMealPlanPreferences } from "@/models/interfaces/client/meal-planner-preferences";

export function initializeClientSettings(clientData: IClientInterface) {
  const defaultCustomRatio = {
    proteinPercentage: 0,
    carbsPercentage: 0,
    fatPercentage: 0,
  };

  const defaultMealPlanPreference: IMealPlanPreferences = {
    size: 0,
    plan: {},
    clientSettingsId: clientData.ClientSettingsDto?.id || 0,
  };

  const defaultDietaryPreferencesDto: DietaryPreferencesDto = {
    id: 0,
    clientSettingsId: 0,
    healthLabelsDto: undefined,
    dietLabelsDto: undefined,
    cuisineTypesDto: undefined,
    dishTypesArr: [],
    custom: false,
    notes: "",
    customRatio: defaultCustomRatio,
    breakfastPreference: "",
    breakfastPreferenceArr: [],
    brunchPreference: "",
    brunchPreferenceArr: [],
    lunchPreference: "",
    lunchPreferenceArr: [],
    snackPreference: "",
    snackPreferenceArr: [],
    teaTimePreference: "",
    teamTimePreferenceArr: [],
    dinnerPreference: "",
    dinnerPreferenceArr: [],
  };

  const defaultFoodDislikesDto: FoodDislikesDto = {
    id: 0,
    clientSettingsId: 0,
    avoidedFoods: "",
    avoidedFoodsArr: [],
  };

  const defaultBudgetConstraintsDto: BudgetConstraintsDto = {
    id: 0,
    clientSettingsId: 0,
    amount: 0,
    frequency: Frequency.Weekly,
  };

  if (!clientData.ClientSettingsDto) {
    clientData.ClientSettingsDto = {
      id: 0,
      clientId: clientData.Id!,
      timezoneId: "",
      foodDislikes: defaultFoodDislikesDto,
      dietaryPreferences: defaultDietaryPreferencesDto,
      medicalConditions: "",
      medicalConditionsArr: [],
      medicationsAndSupplements: "",
      medicationsAndSupplementsArr: [],
      cookingSkills: "",
      healthGoals: HealthGoals.MaintainWeight,
      freeTimeToCook: "",
      budgetConstraints: defaultBudgetConstraintsDto,
      mealPlanPreferences: defaultMealPlanPreference,
    };
  } else {
    if (!clientData.ClientSettingsDto.foodDislikes) {
      clientData.ClientSettingsDto.foodDislikes = defaultFoodDislikesDto;
    }

    if (!clientData.ClientSettingsDto.dietaryPreferences) {
      clientData.ClientSettingsDto.dietaryPreferences =
        defaultDietaryPreferencesDto;
    } else {
      if (!clientData.ClientSettingsDto.dietaryPreferences.healthLabelsDto) {
        clientData.ClientSettingsDto.dietaryPreferences.healthLabelsDto =
          undefined;
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.dietLabelsDto) {
        clientData.ClientSettingsDto.dietaryPreferences.dietLabelsDto =
          undefined;
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.cuisineTypesDto) {
        clientData.ClientSettingsDto.dietaryPreferences.cuisineTypesDto =
          undefined;
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.dishTypesArr) {
        clientData.ClientSettingsDto.dietaryPreferences.dishTypesArr = [];
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.customRatio) {
        clientData.ClientSettingsDto.dietaryPreferences.customRatio =
          defaultCustomRatio;
      }
      if (
        !clientData.ClientSettingsDto.dietaryPreferences.breakfastPreferenceArr
      ) {
        clientData.ClientSettingsDto.dietaryPreferences.breakfastPreferenceArr =
          [];
      }
      if (
        !clientData.ClientSettingsDto.dietaryPreferences.brunchPreferenceArr
      ) {
        clientData.ClientSettingsDto.dietaryPreferences.brunchPreferenceArr =
          [];
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.lunchPreferenceArr) {
        clientData.ClientSettingsDto.dietaryPreferences.lunchPreferenceArr = [];
      }
      if (!clientData.ClientSettingsDto.dietaryPreferences.snackPreferenceArr) {
        clientData.ClientSettingsDto.dietaryPreferences.snackPreferenceArr = [];
      }
      if (
        !clientData.ClientSettingsDto.dietaryPreferences.teamTimePreferenceArr
      ) {
        clientData.ClientSettingsDto.dietaryPreferences.teamTimePreferenceArr =
          [];
      }
      if (
        !clientData.ClientSettingsDto.dietaryPreferences.dinnerPreferenceArr
      ) {
        clientData.ClientSettingsDto.dietaryPreferences.dinnerPreferenceArr =
          [];
      }
    }

    if (!clientData.ClientSettingsDto.budgetConstraints) {
      clientData.ClientSettingsDto.budgetConstraints =
        defaultBudgetConstraintsDto;
    }

    if (!clientData.ClientSettingsDto.medicalConditionsArr) {
      clientData.ClientSettingsDto.medicalConditionsArr = [];
    }

    if (!clientData.ClientSettingsDto.medicationsAndSupplementsArr) {
      clientData.ClientSettingsDto.medicationsAndSupplementsArr = [];
    }
  }

  if (!clientData.ClientSettingsDto.mealPlanPreferences) {
    clientData.ClientSettingsDto.mealPlanPreferences =
      defaultMealPlanPreference;
  }
}
