import { IClientInterface } from "@/models/interfaces/client/client";
import { AxiosResponse } from "axios";

export function constructClientObjectFromResponse(
  response: AxiosResponse
): IClientInterface {
  return {
    Id: response.data.id,
    DashboardId: response.data.dashboardId,
    FirstName: response.data.firstName,
    LastName: response.data.lastName,
    Age: response.data.age,
    BodyWeight: response.data.bodyWeight,
    Bodyfat: response.data.bodyfat,
    Height: response.data.height,
    Gender: response.data.gender,
    Email: response.data.email,
    PhoneNumber: response.data.phoneNumber,
    Birthday: response.data.birthday,
    Address: response.data.address,
    Suburb: response.data.suburb,
    Country: response.data.country,
    City: response.data.city,
    PostCode: response.data.postCode,
    Activity: response.data.activity,
    UserID: response.data.userID,
    stripeCustomerId: response.data.stripeCustomerId,
    isStripeBasicActive: response.data.isStripeBasicActive,
    ClientSettingsDto: response.data.clientSettingsDto
      ? {
          id: response.data.clientSettingsDto.id,
          clientId: response.data.clientSettingsDto.clientId,
          timezoneId: response.data.clientSettingsDto.timezoneId,
          foodDislikes: response.data.clientSettingsDto.foodDislikesDto,
          dietaryPreferences:
            response.data.clientSettingsDto.dietaryPreferencesDto,
          medicalConditions: response.data.clientSettingsDto.medicalConditions,
          medicalConditionsArr:
            response.data.clientSettingsDto.medicalConditionsArr,
          medicationsAndSupplements:
            response.data.clientSettingsDto.medicationsAndSupplements,
          medicationsAndSupplementsArr:
            response.data.clientSettingsDto.medicationsAndSupplementsArr,
          cookingSkills: response.data.clientSettingsDto.cookingSkills,
          healthGoals: response.data.clientSettingsDto.healthGoals,
          freeTimeToCook: response.data.clientSettingsDto.freeTimeToCook,
          budgetConstraints:
            response.data.clientSettingsDto.budgetConstraintsDto,
          mealPlanPreferences:
            response.data.clientSettingsDto.mealPlanPreferencesDto,
        }
      : undefined,
  };
}
