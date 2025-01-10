import { register } from "@/actions/auth-actions";
import { Countries } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { IClientInterface } from "@/models/interfaces/client/client";
import { redirect } from "next/navigation";
import { stripeCheckout } from "@/lib/stripe";

export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<
  | {
      errors: { [key: string]: string } | undefined;
      email?: string | undefined;
    }
  | undefined
> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const priceId = formData.get("priceId") as string;

  // Check if a pricing tier (plan) is selected
  if (!priceId) {
    return {
      errors: {
        priceId: "Please select a plan to proceed with registration.",
      },
    };
  }

  const newClient: IClientInterface = {
    Id: 0,
    DashboardId: 1,
    AmazonId: "",
    stripeCustomerId: "",
    isStripeBasicActive: false,
    FirstName: formData.get("givenName") as string,
    LastName: formData.get("familyName") as string,
    Email: email,
    PhoneNumber: `+${formData.get("phoneNumber") as string}`,
    Country: formData.get("country") as Countries,
    City: formData.get("city") as string,
    Address: formData.get("address") as string,
    Suburb: formData.get("suburb") as string,
    PostCode: Number(formData.get("postCode")),
    ClientSettingsDto: {
      id: 0,
      clientId: 0,
    },
  };

  try {
    const client = await register(newClient, password, confirmPassword);

    if (client) {
      const result = await stripeCheckout(client, priceId, true);
      if (result.success) {
        redirect(ROUTES.AUTH.REGISTRATION_CONFIRMATION);
      }
    }

    return { errors: { email } };
  } catch (error: any) {
    console.error("Error during registration:", error);
    return {
      errors: { form: error.message || "An unexpected error occurred." },
      email,
    };
  }
}
