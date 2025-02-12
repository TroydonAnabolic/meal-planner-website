"use server";

import { unstable_update } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { getClient, updateClient } from "@/lib/server-side/client";
import { IClientInterface } from "@/models/interfaces/client/client";
import { FormResult } from "@/types/form";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

// TODO: Add rate limits to avoid abuse to azure functions
export async function saveBasicProfile(
  client: IClientInterface
): Promise<FormResult | undefined> {
  try {
    console.log("saveBasicProfile", client);
    // Call the update API
    await updateClient(client);
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
  }
}

export async function updateLocationSettings(
  client: IClientInterface,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  const timeZone = formData.get("timezone") as string;
  const errors: { [key: string]: string } = {};

  try {
    const updatedClient = {
      ...client, // Spread existing client properties
      ClientSettingsDto: {
        ...client.ClientSettingsDto!, // Preserve existing settings
        timezoneId: timeZone, // Update only timezoneId
      },
    };

    await updateClient(updatedClient);

    await unstable_update({
      user: {
        timeZoneId: client.ClientSettingsDto?.timezoneId,
      },
    });

    revalidatePath(ROUTES.MEAL_PLANNER.SETTINGS.GENERAL, "page");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    } else {
      return { success: false, errors };
    }
  }
}
