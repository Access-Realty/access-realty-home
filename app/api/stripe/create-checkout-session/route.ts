// ABOUTME: API route to create Stripe Checkout sessions for service tier purchases
// ABOUTME: Redirects users to Stripe-hosted checkout, then back to app.access.realty with session_id

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Lazy-initialize Stripe to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

// Map plan IDs to Stripe price IDs
// Price IDs must be configured in environment variables (from Stripe Dashboard)
const PLAN_PRICE_MAP: Record<string, { priceId: string; name: string; amountCents: number }> = {
  "direct-list": {
    priceId: process.env.STRIPE_PRICE_DIRECT_LIST || "",
    name: "DirectList",
    amountCents: 49500, // $495 upfront
  },
  "direct-list-plus": {
    priceId: process.env.STRIPE_PRICE_DIRECT_LIST_PLUS || "",
    name: "DirectList+",
    amountCents: 99500, // $995 upfront
  },
  "full-service": {
    priceId: process.env.STRIPE_PRICE_FULL_SERVICE || "",
    name: "Full Service",
    amountCents: 0, // No upfront - 3% at closing
  },
};

// UTM parameters type
interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, source, utmParams } = body as {
      plan: string;
      source?: string;
      utmParams?: UTMParams;
    };

    // Validate plan
    if (!plan || !PLAN_PRICE_MAP[plan]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const planConfig = PLAN_PRICE_MAP[plan];

    // Validate price ID is configured (except for Full Service which has no upfront)
    if (planConfig.amountCents > 0 && !planConfig.priceId) {
      console.error(`Missing Stripe price ID for plan: ${plan}`);
      return NextResponse.json(
        { error: "Payment configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Full Service has no upfront payment - redirect directly to signup
    if (planConfig.amountCents === 0) {
      const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
      // Build signup URL with UTM params preserved
      const signupUrl = new URL(`${appBaseUrl}/signup`);
      signupUrl.searchParams.set("plan", plan);
      signupUrl.searchParams.set("source", source || "services-page");
      // Forward UTM params to the app
      if (utmParams) {
        Object.entries(utmParams).forEach(([key, value]) => {
          if (value) signupUrl.searchParams.set(key, value);
        });
      }
      return NextResponse.json({
        url: signupUrl.toString(),
        sessionId: null,
        noPaymentRequired: true,
      });
    }

    // Build success URL - redirects to app with session_id for payment linking
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
    const successUrl = `${appBaseUrl}/signup?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&payment_complete=true`;

    // Cancel URL returns to marketing site services page
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://access.realty"}/services?cancelled=true`;

    // Create Stripe Checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan,
        source: source || "services-page",
        created_from: "marketing-site",
        // UTM params for attribution tracking
        ...(utmParams?.utm_source && { utm_source: utmParams.utm_source }),
        ...(utmParams?.utm_medium && { utm_medium: utmParams.utm_medium }),
        ...(utmParams?.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
        ...(utmParams?.utm_term && { utm_term: utmParams.utm_term }),
        ...(utmParams?.utm_content && { utm_content: utmParams.utm_content }),
      },
      // Allow promotion codes for marketing campaigns
      allow_promotion_codes: true,
      // Collect billing address for compliance
      billing_address_collection: "required",
      // Session expires in 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    // Return the checkout URL for redirect
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errorMessage },
      { status: 500 }
    );
  }
}
