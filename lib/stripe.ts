import { adminDeleteUser } from "@/actions/cognito-actions";
import { deleteClientUnsafe } from "./client/client-side/client";
import { IClientInterface } from "@/models/interfaces/client/client";
import { FormResult } from "@/types/form";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

export async function stripeCheckout(
  client: IClientInterface | undefined,
  priceId: string,
  isNewUser?: boolean
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
        isNewUser: isNewUser,
      });

      console.log("Attempting to re-direct to checkout");

      const data = response.data;
      if (!data.ok) throw new Error("Something went wrong");
      // await stripe.redirectToCheckout({
      //   sessionId: data.result.id,
      // });

      const { error } = await stripe!.redirectToCheckout({
        sessionId: data.result.id,
      });

      if (error) {
        throw new Error(`Error redirecting to checkout: ${error.message}`);
      }
    }

    return { success: true };
  } catch (error: any) {
    // delete user if any error occurs if user is registering
    if (isNewUser) {
      if (client?.Id! > 0) {
        try {
          await adminDeleteUser(client?.Email!);
          await deleteClientUnsafe(client?.UserID!);
        } catch (error: any) {
          console.log(error.message);
        }
      }
    }

    console.log(error.message);

    return { success: false, errors: { message: error.message } };
  }
}
