"use server";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  VerifyUserAttributeCommand,
  AdminUpdateUserAttributesRequestFilterSensitiveLog,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { IClientInterface } from "@/models/interfaces/client/client";
import { VerificationAttributesResult } from "@/types/cognito";
import { FormResult } from "@/types/form";
import { initializeCognitoUser, prepareAttributes } from "@/util/cognito-util";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Session } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { revalidatePath } from "next/cache";

export async function fetchCognitoAttributes(
  session: Session | undefined,
  email: string
): Promise<VerificationAttributesResult> {
  const cognitoUser = initializeCognitoUser(
    email,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );

  const userAttributes = await new Promise<CognitoUserAttribute[] | undefined>(
    (resolve, reject) => {
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
        } else {
          resolve(attributes);
        }
      });
    }
  );

  const cognitoEmail = userAttributes?.find((attr) => attr.Name === "email")
    ?.Value as string;

  const emailVerified =
    userAttributes?.find((attr) => attr.Name === "email_verified")?.Value ===
    "true";

  return { cognitoEmail, emailVerified };
}

export async function updateCognitoAttribute(
  session: Session | undefined,
  attributeName: string,
  attributeValue: string
): Promise<FormResult | undefined> {
  if (!session?.user?.email) {
    return { success: false, errors: { general: "User email is not defined" } };
  }

  const cognitoUser = initializeCognitoUser(
    session.user.email,
    session.user.idToken,
    session.user.accessToken,
    session.user.refreshToken
  );

  const attribute = new CognitoUserAttribute({
    Name: attributeName,
    Value: attributeValue,
  });

  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    cognitoUser.updateAttributes([attribute], (err, result) => {
      if (err) {
        console.error(`Error updating ${attributeName}:`, err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log(`Successfully updated ${attributeName}:`, result);
        resolve({ success: true });
      }
    });
  });
}

export async function updateCognitoUser(
  session: Session | undefined,
  updatedClient: IClientInterface
): Promise<FormResult | undefined> {
  if (!session?.user?.email) {
    throw new Error("User email is not defined");
  }

  const cognitoUser = initializeCognitoUser(
    session?.user?.email!,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );

  try {
    // Update Cognito attributes
    const attributeList = prepareAttributes(updatedClient);
    // when the attributeslist is the phone number, append a + to the beginning of the phone number
    if (attributeList.length > 0) {
      attributeList.forEach((attribute: CognitoUserAttribute) => {
        if (attribute.Name === "phone_number") {
          attribute.Value = "+" + attribute.Value;
        }
      });
    }

    await new Promise<void>((resolve, reject) => {
      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          console.error("updateAttributes error:", err.message);
          reject(err);
        } else {
          console.log("updateAttributes result:", result);
          resolve();
        }
      });
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("updateUser error:", error);
    if (isRedirectError(error)) {
      throw error;
    }

    if (error.message === "Invalid phone number format.") {
      return {
        errors: {
          general:
            "Invalid phone number format. e.g. Phone number must be in the format +640000000000.",
        },
      };
    }

    return {
      errors: {
        general:
          "An error occurred during user update. Please try again later.",
      },
    };
  }
}

// Function to send verification code
export async function sendVerificationCode(
  email: string,
  attributeName: "email" | "phone_number",
  idToken?: string,
  accessToken?: string,
  refreshToken?: string
): Promise<FormResult | undefined> {
  // TODO: Implement email verification so that code is not sent to invalid email

  const cognitoUser = initializeCognitoUser(
    email,
    idToken,
    accessToken,
    refreshToken
  );

  return new Promise<FormResult>((resolve) => {
    cognitoUser.getAttributeVerificationCode(attributeName, {
      onSuccess: () => {
        console.log(`Verification code sent for ${attributeName}`);
        resolve({ success: true });
      },
      onFailure: (err) => {
        console.error(`Failed to send verification code: ${err.message}`);
        resolve({ success: false, errors: { general: err.message } });
      },
    });
  });
}

// Function to verify the code entered by the user
export async function verifyCode(
  email: string,
  attributeName: "email" | "phone_number",
  code: string,
  idToken?: string,
  accessToken?: string,
  refreshToken?: string
): Promise<{ success: boolean; error?: string }> {
  const cognitoUser = initializeCognitoUser(
    email,
    idToken,
    accessToken,
    refreshToken
  );

  return new Promise<{ success: boolean; error?: string }>((resolve) => {
    cognitoUser.verifyAttribute(attributeName, code, {
      onSuccess: () => {
        console.log(`Successfully verified ${attributeName}`);
        resolve({ success: true });
      },
      onFailure: (err) => {
        console.error(`Failed to verify ${attributeName}: ${err.message}`);
        resolve({ success: false, error: err.message });
      },
    });
  });
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
});

export async function adminDeleteUser(username: string): Promise<void> {
  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    Username: username,
  });
  try {
    await cognitoClient.send(command);
    console.log(`User ${username} has been deleted.`);
  } catch (error: any) {
    console.error(`Failed to delete user ${username}: ${error.message}`);
    throw error;
  }
}
export async function adminVerifyUserAttribute(
  username: string,
  attributeName: "email" | "phone_number"
): Promise<FormResult> {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
    Username: username,
    UserAttributes: [
      {
        Name: attributeName + "_verified",
        Value: "true",
      },
    ],
  });

  try {
    await cognitoClient.send(command);
    console.log(`Successfully verified ${attributeName} for user ${username}`);
    return { success: true };
  } catch (error: any) {
    console.error(
      `Failed to verify ${attributeName} for user ${username}: ${error.message}`
    );
    return { success: false, errors: { general: error.message } };
  }
}
