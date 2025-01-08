import { register } from "@/actions/auth-actions";
import { adminDeleteUser } from "@/actions/cognito-actions";
import { Countries } from "@/constants/constants-enums";
import { ROUTES } from "@/constants/routes";
import { IClientInterface } from "@/models/interfaces/client/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { redirect } from "next/navigation";

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

  try {
    // register account via nextauth and cognito through server component
    const client = await register(newClient, password, confirmPassword);

    // process payment once client created
    if (client) {
      await stripeCheckout(client, priceId);
    }
  } catch (error) {
    console.log(error);
  } finally {
    redirect(ROUTES.AUTH.REGISTRATION_CONFIRMATION);
  }
}

async function stripeCheckout(
  client: IClientInterface | undefined,
  priceId: string
) {
  // subscribe to stripe product plan
  try {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
    if (!stripe) {
      return;
    }

    if (client?.Id && client.Id > 0) {
      const response = await axios.post("/api/stripe/checkout", {
        priceId: priceId,
      });

      console.log("Attempting to re-direct to checkout");

      const data = response.data;
      if (!data.ok) throw new Error("Something went wrong");
      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
    }
  } catch (error: any) {
    // delete user if any error occurs
    if (client?.Id! > 0) {
      await adminDeleteUser(client?.Email!);
    }
    console.log(error.message);
  }
}
