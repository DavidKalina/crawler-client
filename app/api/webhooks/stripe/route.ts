import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const stripeHeaders = await headers();
    const signature = stripeHeaders.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve the session to get line items
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      if (session.customer_email) {
        const supabase = await createClient();

        // Get user by email
        const { data: userData } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", session.customer_email)
          .single();

        if (userData) {
          // Parse the number of pages from the product name
          const pagesMatch = expandedSession.line_items?.data[0]?.description?.match(/(\d+)/);
          console.log({ pagesMatch });
          const pageCount = parseInt(session.metadata?.page_count ?? "0");

          // Update user's available pages
          await supabase.rpc("increment_available_pages", {
            user_id: userData.id,
            page_count: pageCount,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
