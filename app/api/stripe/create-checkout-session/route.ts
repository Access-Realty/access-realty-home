// ABOUTME: API route to create Stripe Checkout sessions for service tier purchases
// ABOUTME: Returns clientSecret for embedded checkout (payment stays on marketing site)

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
    const { plan, source, utmParams, returnUrl } = body as {
      plan: string;
      source?: string;
      utmParams?: UTMParams;
      returnUrl?: string; // For embedded checkout return
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

    // Full Service has no upfront payment - redirect directly to app
    if (planConfig.amountCents === 0) {
      const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
      const tier = "full_service";
      const signupUrl = new URL(appBaseUrl);
      signupUrl.searchParams.set("tier", tier);
      if (source) signupUrl.searchParams.set("ref", source);
      // Forward UTM params to the app
      if (utmParams) {
        Object.entries(utmParams).forEach(([key, value]) => {
          if (value) signupUrl.searchParams.set(key, value);
        });
      }
      return NextResponse.json({
        redirectUrl: signupUrl.toString(),
        clientSecret: null,
        noPaymentRequired: true,
      });
    }

    // Build return URL for embedded checkout
    // After payment completes, user is redirected to the app with session info
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
    const tier = plan === "direct-list" ? "direct_list" : plan === "direct-list-plus" ? "direct_list_plus" : plan;

    // Build return URL with UTM params forwarded for attribution tracking
    const returnUrlParams = new URLSearchParams({
      stripe_session_id: "{CHECKOUT_SESSION_ID}",
      tier,
      ...(source && { ref: source }),
    });

    // Forward UTM params to the app
    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) returnUrlParams.set(key, value);
      });
    }

    const checkoutReturnUrl = `${appBaseUrl}/?${returnUrlParams.toString()}`;

    // Create Stripe Checkout session in embedded mode
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded", // Embedded checkout - stays on our site
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      return_url: checkoutReturnUrl,
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
      // Collect billing address for compliance
      billing_address_collection: "required",
    });

    // Return the client secret for embedded checkout
    return NextResponse.json({
      clientSecret: session.client_secret,
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
