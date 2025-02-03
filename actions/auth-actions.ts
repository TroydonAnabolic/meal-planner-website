"use server";
import { redirect } from "next/navigation";

import {
  cognitoPool,
  handleValidationErrors,
  initializeCognitoUser,
  prepareAttributes,
} from "../util/cognito-util";
import { auth, signIn, signOut, unstable_update as update } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import {
  registerSchema,
  loginSchema,
  confirmPasswordSchema,
  changePasswordSchema,
} from "@/util/validation";
import { Session, User } from "next-auth";
import { revalidatePath } from "next/cache";
import { IClientInterface } from "@/models/interfaces/client/client";
import { isEmailNotConfirmedException } from "@/util/error-util";
import { adminDeleteUser, fetchCognitoAttributes } from "./cognito-actions";
import { FormResult } from "@/types/form";
import { deleteClient, storeClient } from "@/lib/server-side/client";
import { ISignUpResult } from "amazon-cognito-identity-js";
import { ROUTES } from "@/constants/routes";
import { stripeCancelSubscription } from "@/lib/stripe";

export async function register(
  newClient: IClientInterface,
  password: string,
  confirmPassword: string
): Promise<IClientInterface | undefined> {
  // Validate the form data using the schema
  const result = registerSchema.safeParse({
    email: newClient.Email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    throw new Error("Validation failed: Invalid input data.");
  }

  try {
    const attributeList = prepareAttributes(newClient);

    const signUpResult = await new Promise<
      { errors: { [key: string]: string }; email?: string } | undefined
    >((resolve, reject) => {
      cognitoPool.signUp(
        newClient.Email,
        password,
        attributeList,
        [],
        async (err: any, data: ISignUpResult | undefined) => {
          if (err) {
            console.log("Error: " + err.message);

            switch (err.name) {
              case "InvalidParameterException":
                reject(new Error("Invalid email address."));
              case "InvalidPasswordException":
                reject(new Error("Invalid password."));
              case "UsernameExistsException":
                reject(new Error(`Email already exists: ${newClient.Email}`));

              default:
                reject(new Error("Something went wrong during signup."));
            }
            return;
          }

          if (!data) {
            reject(
              new Error("Something went wrong during signup: No data received.")
            );
            return;
          }

          try {
            newClient.UserID = data.userSub!;
            const id = await storeClient(newClient);
            if (id && id > 0) {
              newClient.Id = id;
              resolve(undefined);
            } else {
              throw new Error("Client not stored");
            }
            // TODO: Find out why create client is failing again
          } catch (error: any) {
            console.log(
              "Error storing client:",
              error?.message + error?.cause?.code
            );
            try {
              await adminDeleteUser(newClient.Email);
            } catch (deleteError: any) {
              console.error(
                `Failed to delete user after client creation failed: ${deleteError.message}`
              );
            }
            reject(new Error("Error creating client."));
          }
        }
      );
    });

    return newClient;
  } catch (error) {
    throw error; // Ensure errors are propagated
  }
}

export async function login(
  prevState: unknown,
  formData: FormData
): Promise<
  | { errors: { [key: string]: string }; emailInput?: string | undefined }
  | undefined
> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate the form data using the schema
  const result = loginSchema.safeParse({ email, password });
  const errors: { [key: string]: string } = {};

  if (!result.success) {
    return { errors: handleValidationErrors(result) };
  }

  try {
    const result: { error?: any } = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      switch (result.error) {
        case "UserNotConfirmedException":
          errors.general = "User not confirmed.";
          email && (errors.email = email);
          break;
        case "NotAuthorizedException":
          errors.general = "Incorrect credentials.";
          break;
        default:
          errors.general = "Something went wrong.";
          break;
      }
      return { errors, emailInput: email! };
    }

    await redirect(ROUTES.MEAL_PLANNER.DASHBOARD + "?page=1");
    await revalidatePath("/", "layout");
  } catch (error: any) {
    //  console.error("Login error:", error);
    if (isEmailNotConfirmedException(error?.cause?.err!)) {
      return {
        errors: {
          general: "Email not verified.",
        },
        emailInput: email,
      };
    }
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      errors: {
        general: "An error occurred during login. Please try again later.",
      },
    };
  } finally {
  }
}

export async function logout() {
  const session = await auth();

  const cognitoUser = initializeCognitoUser(
    session?.user?.email!,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );

  try {
    cognitoUser.signOut();
    await signOut({ redirect: false });
  } catch (error) {
    console.error("Logout error:", error);
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      errors: {
        general: "An error occurred during logout. Please try again later.",
      },
    };
  } finally {
    await revalidatePath("/", "layout");
    await redirect(ROUTES.HOME);
  }
}

export async function changePassword(
  session: Session,
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  // Validate the form data using the schema
  const result = changePasswordSchema.safeParse({
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

  if (!result.success) {
    return { errors: handleValidationErrors(result) };
  }

  const errors = await validateSessionAndAttributes(session);
  if (errors) return errors;

  const cognitoUser = initializeCognitoUser(
    session?.user?.email!,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );

  try {
    await new Promise<void>((resolve, reject) => {
      cognitoUser.changePassword(
        currentPassword,
        newPassword,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
    session.user.id;

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      errors: { general: "An error occurred while changing the password." },
    };
  }
}

export async function logoutAllUsers(
  session: Session,
  prevState: unknown
): Promise<FormResult | undefined> {
  const errors = await validateSessionAndAttributes(session);
  if (errors) return errors;

  const cognitoUser = initializeCognitoUser(
    session?.user?.email!,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );

  if (cognitoUser !== null) {
    try {
      await new Promise<void>((resolve, reject) => {
        cognitoUser.globalSignOut({
          onSuccess: () => resolve(),
          onFailure: (err) => {
            console.error("global sign-out error:", err.message);
            reject(err);
          },
        });
      });
      await signOut({ redirect: false });
    } catch (error) {
      console.error("sign-out error:", error);
      if (isRedirectError(error)) {
        throw error;
      }
      return {
        errors: {
          general:
            "An error occurred during global sign-out. Please try again later.",
        },
      };
    } finally {
      await revalidatePath(ROUTES.HOME, "layout");
      await redirect(ROUTES.HOME);
    }
  } else {
    await logout(); // Fallback to regular logout if no Cognito user is found
  }
}

export async function deleteUser(
  session: Session,
  prevState: unknown
): Promise<FormResult | undefined> {
  const errors = await validateSessionAndAttributes(session);
  if (errors) return errors;

  const cognitoUser = initializeCognitoUser(
    session?.user?.email!,
    session?.user?.idToken,
    session?.user?.accessToken,
    session?.user?.refreshToken
  );
  try {
    const result = await stripeCancelSubscription(session.user.userId);
    // only proceed to delete accounts if subscription is sucessfully cancelled
    // TODO: test cancel subscription feature once completed app
    if (result.success) {
      await new Promise<void>((resolve, reject) => {
        cognitoUser.deleteUser((err, result) => {
          if (err) {
            console.error("deleteUser error:", err.message);
            reject(err);
          } else {
            console.log("deleteUser result:", result);
            resolve();
          }
        });
      });

      // TODO: Test if delete works from here
      await deleteClient(session.user.userId);

      await signOut({ redirect: false });
    }
  } catch (error) {
    console.error("delete user error:", error);
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      errors: {
        general:
          "An error occurred during deleting user. Please try again later.",
      },
    };
  } finally {
    await revalidatePath(ROUTES.HOME, "layout");
    await redirect(ROUTES.HOME);
  }
}

export async function forgotPassword(
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  const email = formData.get("email") as string;
  const cognitoUser = initializeCognitoUser(email);

  try {
    await new Promise<void>((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: () => {
          console.log("Password reset code sent!");
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  } catch (error) {
    const errors: { [key: string]: string } = {};

    if (isRedirectError(error)) {
      throw error;
    }
    switch ((error as any).code) {
      case "UserNotFoundException":
        errors.email = "User not found.";
        break;
      default:
        errors.general = "Something went wrong.";
        break;
    }
    return { errors };
  } finally {
    await redirect(
      `${ROUTES.AUTH.VERIFY_CODE}?email=${encodeURIComponent(email)}`
    );
  }
}

export async function confirmPassword(
  prevState: unknown,
  formData: FormData
): Promise<FormResult | undefined> {
  const email = formData.get("email") as string;
  const verificationCode = formData.get("code") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  // Validate the form data using the schema
  const result = confirmPasswordSchema.safeParse({
    email,
    code: verificationCode,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

  if (!result.success) {
    return { errors: handleValidationErrors(result) };
  }

  return new Promise((resolve, reject) => {
    const cognitoUser = initializeCognitoUser(email);

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        console.log("Password confirmed!");
        resolve({ success: true });
      },
      onFailure(err: any) {
        const errors: { [key: string]: string } = {};
        console.log("Error confirming password: ", err);
        if (err.code === "CodeMismatchException") {
          errors.invalidCode = err.message;
        }
        errors.general = "Password not confirmed!";
        resolve({ errors });
      },
    });
  });
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  const cognitoUser = initializeCognitoUser(email);

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        console.error("Error resending confirmation code:", err.message);
        reject(err);
      } else {
        console.log("Resend confirmation code result:", result);
        resolve();
      }
    });
  });
}

export async function updateSession(
  session: Session,
  updatedClient: IClientInterface
) {
  const updatedUser: User = {
    ...session?.user,
    givenName: updatedClient.FirstName,
    familyName: updatedClient.LastName,
    email: updatedClient.Email || "",
    userId: session?.user?.userId || "",
    phoneNumber: updatedClient.PhoneNumber || "",
    profilePicUrl: updatedClient.ProfilePicUrl as string,
  };
  if (session && session.user) {
    session.user = updatedUser;
  }
  await update({ user: { ...session.user, ...updatedUser } });
}

async function validateSessionAndAttributes(
  session: Session
): Promise<{ errors?: { [key: string]: string } } | undefined> {
  if (!session.user.email) {
    throw new Error("User email is not defined");
  }
  const { emailVerified } = await fetchCognitoAttributes(
    session,
    session.user.email
  );
  if (!emailVerified) {
    return {
      errors: {
        general: "Please verify your email before deleting your account.",
      },
    };
  }
}
