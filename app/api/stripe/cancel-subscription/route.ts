import { auth, unstable_update } from "@/auth";
import { getClient, updateClient } from "@/lib/client/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  const { userID }: { userID: string } = await request.json();
  const client = await getClient(userID);

  if (!client) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: client.stripeCustomerId,
      status: "active", // Optional: filter for active subscriptions
    });

    if (!subscriptions.data || subscriptions.data.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "no-subscription",
            message: "No active subscriptions found.",
          },
        },
        { status: 404 }
      );
    }

    const subscriptionToCancel = subscriptions.data[0]; // Replace with your selection logic

    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionToCancel.id,
      {
        cancel_at_period_end: true,
      }
    );

    if (!canceledSubscription.cancellation_details?.reason) {
      return NextResponse.json(
        {
          error: {
            code: "stripe-error",
            message: "Could not cancel subscription",
          },
        },
        { status: 500 }
      );
    } else {
      // Update the client's subscription status in your database
      client.isStripeBasicActive = false;
      const updatedClient = await updateClient(client);
      // TODO: check if it errors out over here
      const session = await auth();
      const newSession = await unstable_update({
        user: {
          stripeCustomerId: client.stripeCustomerId,
          isStripeBasicActive: client.isStripeBasicActive,
        },
      });
    }

    return NextResponse.json(
      { subscription: canceledSubscription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Could not cancel subscription", error);
    return NextResponse.json(
      { message: "Could not cancel subscription" },
      { status: 500 }
    );
  }
}
