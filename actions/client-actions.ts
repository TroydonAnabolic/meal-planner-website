"use server";

import { updateClient } from "@/lib/server-side/client";
import { IClientInterface } from "@/models/interfaces/client/client";
import { FormResult } from "@/types/form";
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
