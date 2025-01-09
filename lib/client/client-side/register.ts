import { register } from "@/actions/auth-actions";
import { adminDeleteUser } from "@/actions/cognito-actions";
import { Countries } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { IClientInterface } from "@/models/interfaces/client/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { redirect } from "next/navigation";
import { deleteClientUnsafe, updateClientUnsafe } from "./client";
import Stripe from "stripe";
import { FormResult } from "@/types/form";

export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<
  { errors: { [key: string]: string }; email?: string | undefined } | undefined
> {
  // TODO: add hidden element with priceId
  const priceId = formData.get("priceId") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  // const birthday = new Date(formData.get("birthDay") as string);
  // const age = calculateAge(birthday);
  const country = formData.get("country") as Countries;
  //const gender = formData.get("gender") as GenderType;
  //  const activityLevel = formData.get("activityLevel") as ActivityLevel;

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
    Country: country,
    // Gender: gender,
    // Activity: activityLevel,
    // Age: age,
    // Birthday: birthday,
    City: formData.get("city") as string,
    Address: formData.get("address") as string,
    Suburb: formData.get("suburb") as string,
    PostCode: Number(formData.get("postCode")),
    ClientSettingsDto: {
      id: 0,
      clientId: 0,
    },
  };

  // Example usage in a Stripe API call with AddressParam
  const addressParam: Stripe.AddressParam = {
    city: "San Francisco",
    country: "US",
    line1: "123 Market St",
    line2: "Suite 500",
    postal_code: "94105",
    state: "CA",
  };

  try {
    // register account via nextauth and cognito through server component
    const client = await register(newClient, password, confirmPassword);

    const errors = {};

    // process payment once client created
    if (client) {
      const result = await stripeCheckout(client, priceId);
      if (result.success) {
        redirect(ROUTES.AUTH.REGISTRATION_CONFIRMATION);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
}

async function stripeCheckout(
  client: IClientInterface | undefined,
  priceId: string
): Promise<FormResult> {
  // subscribe to stripe product plan
  try {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
    if (!stripe) {
      return { success: false };
    }

    if (client?.Id && client.Id > 0) {
      const response = await axios.post("/api/stripe/checkout", {
        priceId: priceId,
        userID: client.UserID,
      });

      console.log("Attempting to re-direct to checkout");

      const data = response.data;
      if (!data.ok) throw new Error("Something went wrong");
      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });

      const { error } = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.session.id,
      });

      if (error) {
        throw new Error(`Error redirecting to checkout: ${error.message}`);
      }
    }

    return { success: true };
  } catch (error: any) {
    // delete user if any error occurs
    if (client?.Id! > 0) {
      try {
        await adminDeleteUser(client?.Email!);
        await deleteClientUnsafe(client?.UserID!);
      } catch (error: any) {
        console.log(error.message);
      }
    }
    console.log(error.message);

    return { success: false, errors: { message: error.message } };
  }
}
