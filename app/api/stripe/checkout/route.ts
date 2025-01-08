import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { priceId, userID, stripeCustomerId } = await request.json();

    if (userID) {
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

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        (process.env.NODE_ENV === "production"
          ? process.env.AUTH_TRUST_HOST_PROD
          : process.env.AUTH_TRUST_HOST) + `/login`,
      cancel_url:
        (process.env.NODE_ENV === "production"
          ? process.env.AUTH_TRUST_HOST_PROD
          : process.env.AUTH_TRUST_HOST) + `/error`,
      subscription_data: {
        metadata: {
          payingUserId: userID, // sets the cognito userid in stripe
        },
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        {
          error: {
            code: "stripe-error",
            message: "Could not create checkout session",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error("Could not create checkout session", error);
    return NextResponse.json(
      { message: "Could not create checkout session" },
      { status: 500 }
    );
  }
}
