// ABOUTME: API route to create Stripe Checkout sessions for service tier purchases
// ABOUTME: Returns redirect URL for hosted checkout (redirects to Stripe)
// ABOUTME: Detects environment (preview vs production) to redirect to correct app domain

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Determine the app URL based on the current environment.
 * Domain structure:
 *   - access.realty (marketing prod) → app.access.realty (app prod)
 *   - *.vercel.app (marketing preview) → app.staging.access.realty (app staging)
 *   - localhost:4000 (marketing dev) → localhost:3000 (app dev)
 */
function getAppUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "";

  // Local development
  if (host.includes("localhost")) {
    return "http://localhost:3000";
  }

  // Vercel preview deployments (access-realty-home-*.vercel.app)
  // Redirect to app staging at app.staging.access.realty
  if (host.includes("vercel.app")) {
    return "https://app.staging.access.realty";
  }

  // Production (access.realty) → app.access.realty
  return process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
}

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
  "direct_list": {
    priceId: process.env.STRIPE_PRICE_DIRECT_LIST || "",
    name: "DirectList",
    amountCents: 49500, // $495 upfront
  },
  "direct_list_plus": {
    priceId: process.env.STRIPE_PRICE_DIRECT_LIST_PLUS || "",
    name: "DirectList+",
    amountCents: 99500, // $995 upfront
  },
  "full_service": {
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

// Property specs from get-started flow
interface PropertySpecs {
  bedrooms?: string;
  fullBathrooms?: string;
  halfBathrooms?: string;
  yearBuilt?: string;
  squareFeet?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, source, utmParams, returnUrl, leadId, propertySpecs } = body as {
      plan: string;
      source?: string;
      utmParams?: UTMParams;
      returnUrl?: string; // For embedded checkout return
      leadId?: string;
      propertySpecs?: PropertySpecs;
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

    // Detect environment and get appropriate app URL
    const appBaseUrl = getAppUrl(request);

    // Full Service has no upfront payment - redirect directly to app
    if (planConfig.amountCents === 0) {
      const tier = "full_service";
      const signupUrl = new URL(appBaseUrl);
      signupUrl.searchParams.set("tier", tier);
      if (source) signupUrl.searchParams.set("ref", source);
      if (leadId) signupUrl.searchParams.set("lead_id", leadId);
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
    // Plan IDs already use underscored format matching the app's tier param (direct_list, direct_list_plus)
    const tier = plan;

    // Build query params for return URL
    // IMPORTANT: Don't use URLSearchParams for {CHECKOUT_SESSION_ID} - it would URL-encode
    // the curly braces and Stripe wouldn't recognize the template to replace
    const queryParams: string[] = [
      `stripe_session_id={CHECKOUT_SESSION_ID}`, // Stripe replaces this - don't encode!
      `tier=${encodeURIComponent(tier)}`,
    ];
    if (source) {
      queryParams.push(`ref=${encodeURIComponent(source)}`);
    }
    if (leadId) {
      queryParams.push(`lead_id=${encodeURIComponent(leadId)}`);
    }
    // Forward UTM params to the app
    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
    }

    const checkoutReturnUrl = `${appBaseUrl}/?${queryParams.join("&")}`;

    // Create Stripe Checkout session in embedded mode (stays on our site)
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      return_url: checkoutReturnUrl,
      // Create a Stripe Customer to store payment method
      customer_creation: "always",
      // Save payment method for future charges (e.g., commission at closing)
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      metadata: {
        plan,
        source: source || "services-page",
        created_from: "marketing-site",
        // Lead ID for fetching property data in app
        ...(leadId && { lead_id: leadId }),
        // Property specs (user-reported, may differ from parcel data)
        ...(propertySpecs?.bedrooms && { bedrooms: propertySpecs.bedrooms }),
        ...(propertySpecs?.fullBathrooms && { full_bathrooms: propertySpecs.fullBathrooms }),
        ...(propertySpecs?.halfBathrooms && { half_bathrooms: propertySpecs.halfBathrooms }),
        ...(propertySpecs?.yearBuilt && { year_built: propertySpecs.yearBuilt }),
        ...(propertySpecs?.squareFeet && { square_feet: propertySpecs.squareFeet }),
        // UTM params for attribution tracking
        ...(utmParams?.utm_source && { utm_source: utmParams.utm_source }),
        ...(utmParams?.utm_medium && { utm_medium: utmParams.utm_medium }),
        ...(utmParams?.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
        ...(utmParams?.utm_term && { utm_term: utmParams.utm_term }),
        ...(utmParams?.utm_content && { utm_content: utmParams.utm_content }),
      },
      // Collect billing address for compliance (includes name)
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
