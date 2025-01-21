"use server";
import { ROUTES } from "@/constants/routes";
import {
  storeMealPreferences,
  updateMealPreferences,
} from "@/lib/meal-plan-preferences";
import { IClientInterface } from "@/models/interfaces/client/client";
import { IClientSettingsInterface } from "@/models/interfaces/client/client-settings";

import { FormResult } from "@/types/form";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function saveMealPlanPreference(
  clientSettings: IClientSettingsInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  const errors: { [key: string]: string } = {};

  try {
    if (!clientSettings?.mealPlanPreferences) {
      throw new Error("Meal Plan Preferences not found.");
    } else if (
      !Object.values(clientSettings.mealPlanPreferences.plan).some(
        (value) => value !== undefined && value !== null && value !== ""
      )
    ) {
      errors.general = "Please select at least one preference.";
      throw new Error(
        "At least one of the allmealfiler properties must be filled in plan."
      );
    }

    clientSettings.mealPlanPreferences.clientSettingsId = clientSettings.id;

    // Call the update API
    if (clientSettings?.mealPlanPreferences?.id) {
      await updateMealPreferences(clientSettings.mealPlanPreferences);
    } else {
      await storeMealPreferences(clientSettings.mealPlanPreferences!);
    }
    //revalidatePath(ROUTES.MEAL_PLANNER.MEAL_PREFERENCES, "page");
    return { success: true };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
      return { success: false, errors };
    }

    return { success: false, errors };
  }
}

export async function saveBudgetConstraints(
  clientSettings: IClientInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  try {
    console.log("budgetConstraints");
    // Call the update API
    // await updateClient(client);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch (error.code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES);
  }
}

export async function saveDietaryPreferences(
  client: IClientInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  try {
    console.log("dietaryPreferences");
    // Call the update API
    // await updateClient(client);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch (error.code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES);
  }
}

export async function saveBiometrics(
  client: IClientInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  try {
    console.log("saveBasicProfile");
    // Call the update API
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch (error.code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES);
  }
}

export async function saveMedical(
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  try {
    console.log("saveMedical");
    // Call the update API
    // await updateClient(client);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch (error.code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES);
  }
}

export async function saveCookingAndHealth(
  client: IClientInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  try {
    console.log("cookingAndHealth");
    // Call the update API
    // await updateClient(client);
    return { success: true };
  } catch (error: any) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch (error.code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { success: false, errors };
  } finally {
    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES);
  }
}
