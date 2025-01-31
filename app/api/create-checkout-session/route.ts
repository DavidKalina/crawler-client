import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
  throw new Error("STRIPE_SECRET_KEY must be a valid secret key starting with sk_");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

// Helper function to handle CORS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function corsResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Origin": process.env.BASE_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json",
    },
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsResponse({});
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { package: pkg } = body;

    if (!pkg || !pkg.pages || !pkg.price || !pkg.id) {
      return corsResponse({ error: "Invalid package data" }, 400);
    }

    // Get the current user
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return corsResponse({ error: "Not authenticated" }, 401);
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.pages.toLocaleString()} Pages Package`,
              description: `One-time purchase of ${pkg.pages.toLocaleString()} pages`,
            },
            unit_amount: pkg.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        page_count: pkg.pages.toString(),
        pages: pkg.pages,
        user_id: session.user.id,
        package_id: pkg.id,
      },
      customer_email: session.user.email,
      success_url: `${process.env.BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
    });

    return corsResponse({ sessionUrl: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return corsResponse({ error: "Failed to create checkout session" }, 500);
  }
}
