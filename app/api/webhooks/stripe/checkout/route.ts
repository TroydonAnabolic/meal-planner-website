import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getClient, updateClient } from "@/lib/client/client";
import { auth } from "@/auth";
type METADATA = {
  userId: string;
  priceId: string;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  const session = await auth();

  if (!session?.user) {
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
    // database update here
    const client = await getClient(session.user.userId);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        client.isStripeBasicActive = true;
        break;
      case "customer.subscription.deleted":
        client.isStripeBasicActive = false;

        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    await updateClient(client);

    return new NextResponse("Subscription added", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Server error", {
      status: 500,
    });
  }
}
