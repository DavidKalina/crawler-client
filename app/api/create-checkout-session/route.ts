import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
  throw new Error("STRIPE_SECRET_KEY must be a valid secret key starting with sk_");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

// List of allowed origins
const allowedOrigins = [
  "https://crawler-client.vercel.app",
  "https://davidkalina.com",
  "http://localhost:3000", // For local development
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function corsResponse(data: any, status = 200) {
  const headersList = await headers();

  const origin = headersList.get("origin");

  // Check if the origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Content-Type": "application/json",
      Vary: "Origin", // Important for CDN caching
    },
  });
}

export async function OPTIONS() {
  const headersList = await headers();
  const origin = headersList.get("origin");

  // Check if the origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  });
}

export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return OPTIONS();
  }
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
