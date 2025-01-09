import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { getClient, updateClient } from "@/lib/client/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  const { priceId, userID } = await request.json();
  console.log("api price id used: " + priceId);
  if (!userID || !priceId) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "Invalid parameters received.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const client = await getClient(userID);

    // Example usage in a Stripe API call with AddressParam
    const addressParam: Stripe.AddressParam = {
      city: client.City,
      country: client.Country as string,
      line1: client.Address,
      line2: "",
      postal_code: String(client.PostCode),
      state: client.Suburb,
    };

    const customer = await stripe.customers.create({
      email: client.Email,
      name: `${client.FirstName!} ${client.LastName!}`,
      phone: client.PhoneNumber,
      address: addressParam,
    });

    client.stripeCustomerId = customer.id;
    await updateClient(client);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: client.stripeCustomerId,
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
