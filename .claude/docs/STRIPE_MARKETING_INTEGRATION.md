# Marketing Site Stripe Integration

## Overview

The marketing site (`access.realty`) collects Stripe payments BEFORE users create accounts using **Embedded Checkout**. The payment form renders directly on access.realty in a modal, so users never leave the site during payment. After payment, users are redirected to the app (`app.access.realty`) where their payment is verified and their service tier is pre-selected.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MARKETING SITE                                     │
│                         (access.realty)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. User lands on /direct-list or /services page                            │
│                                                                              │
│  2. User clicks "Get Started" → TierSelectionModal opens                    │
│     User selects "DirectList" or "DirectList+"                              │
│                                                                              │
│  3. EmbeddedCheckoutModal opens                                             │
│     → POST /api/stripe/create-checkout-session                              │
│       Body: { plan, source, utmParams }                                     │
│     → API returns clientSecret (NOT a redirect URL)                         │
│                                                                              │
│  4. Stripe <EmbeddedCheckout /> renders IN THE MODAL                        │
│     → User enters payment info WITHOUT leaving access.realty                │
│     → Payment completes → Stripe redirects to return_url                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MAIN APP                                        │
│                        (app.access.realty)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  5. User arrives at /?stripe_session_id=cs_xxx&tier=direct_list&ref=...     │
│     → App parses URL params → stores in sessionStorage                      │
│                                                                              │
│  6. User completes signup (OAuth or email/password)                         │
│     → App calls POST /api/stripe/verify-marketing-payment                   │
│     → Session verified → marketing_stripe_session_id saved to profile       │
│                                                                              │
│  7. User starts submission flow                                             │
│     → Service tier step is pre-selected with their paid tier                │
│     → User proceeds with submission                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Marketing Site Implementation

### 1. Create Checkout Session API

`/app/api/stripe/create-checkout-session/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map plan IDs to Stripe price IDs
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
    priceId: "",
    name: "Full Service",
    amountCents: 0, // No upfront - 3% at closing
  },
};

export async function POST(request: NextRequest) {
  const { plan, source, utmParams } = await request.json();

  const planConfig = PLAN_PRICE_MAP[plan];
  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Full Service has no upfront payment - redirect directly to app
  if (planConfig.amountCents === 0) {
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
    const signupUrl = new URL(appBaseUrl);
    signupUrl.searchParams.set("tier", "full_service");
    if (source) signupUrl.searchParams.set("ref", source);
    // Forward UTM params
    if (utmParams) {
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) signupUrl.searchParams.set(key, value as string);
      });
    }
    return NextResponse.json({
      redirectUrl: signupUrl.toString(),
      clientSecret: null,
      noPaymentRequired: true,
    });
  }

  // Build return URL with UTM params forwarded
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.access.realty";
  const tier = plan === "direct-list" ? "direct_list" : "direct_list_plus";
  const returnUrlParams = new URLSearchParams({
    stripe_session_id: "{CHECKOUT_SESSION_ID}",
    tier,
    ...(source && { ref: source }),
  });
  if (utmParams) {
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) returnUrlParams.set(key, value as string);
    });
  }
  const checkoutReturnUrl = `${appBaseUrl}/?${returnUrlParams.toString()}`;

  // Create Stripe Checkout session in EMBEDDED mode
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded", // <-- Key difference from hosted checkout
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    return_url: checkoutReturnUrl, // Not success_url - embedded uses return_url
    metadata: {
      plan,
      source: source || "services-page",
      created_from: "marketing-site",
      ...(utmParams?.utm_source && { utm_source: utmParams.utm_source }),
      ...(utmParams?.utm_medium && { utm_medium: utmParams.utm_medium }),
      ...(utmParams?.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
    },
    billing_address_collection: "required",
  });

  // Return clientSecret for embedded checkout (NOT a redirect URL)
  return NextResponse.json({
    clientSecret: session.client_secret,
    sessionId: session.id,
  });
}
```

### 2. Embedded Checkout Modal Component

`/components/checkout/EmbeddedCheckoutModal.tsx`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface EmbeddedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  planName: string;
  source?: string;
  utmParams?: Record<string, string>;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export function EmbeddedCheckoutModal({
  isOpen,
  onClose,
  plan,
  planName,
  source,
  utmParams,
  onError,
}: EmbeddedCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch client secret when modal opens
  useEffect(() => {
    if (isOpen && !clientSecret && !loading) {
      setLoading(true);
      fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, source, utmParams }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.noPaymentRequired && data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => onError?.(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, plan, source, utmParams, clientSecret, loading, onError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b">
          <h2>Complete Your {planName} Purchase</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="p-4">
          {loading || !clientSecret ? (
            <div>Loading checkout...</div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3. Environment Variables

```bash
# .env.local

# Stripe keys
STRIPE_SECRET_KEY=sk_test_xxx           # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Client-side (for EmbeddedCheckout)

# Service tier price IDs (from Stripe Dashboard)
STRIPE_PRICE_DIRECT_LIST=price_xxx      # $495 DirectList
STRIPE_PRICE_DIRECT_LIST_PLUS=price_xxx # $995 DirectList+

# Webhook secret (for checkout.session.completed events)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# URLs
NEXT_PUBLIC_APP_URL=https://app.access.realty
```

### 4. Required Packages

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

### 5. Price IDs Reference

| Tier | Plan ID | Price | Stripe Product ID |
|------|---------|-------|-------------------|
| DirectList | `direct-list` | $495 | `prod_TJxlMoNGc1otZ5` |
| DirectList+ | `direct-list-plus` | $995 | `prod_TNOHtbmROWkZoh` |

**Note:** Full Service is commission-based (3% at closing, no upfront payment) - redirects directly to app without Stripe checkout.

---

## Hosted vs Embedded Checkout Comparison

| Feature | Hosted Checkout | Embedded Checkout (Current) |
|---------|-----------------|----------------------------|
| User experience | Redirects to checkout.stripe.com | Stays on access.realty |
| API returns | `{ url }` for redirect | `{ clientSecret }` for component |
| Session param | `success_url` | `return_url` |
| UI mode | `ui_mode: undefined` (default) | `ui_mode: "embedded"` |
| Client packages | None required | `@stripe/stripe-js`, `@stripe/react-stripe-js` |
| Brand consistency | Stripe-branded page | Your site's modal |

---

## URL Parameters

When redirecting to the app after payment, these URL parameters are used:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `stripe_session_id` | Yes | Stripe Checkout Session ID (`{CHECKOUT_SESSION_ID}` template) |
| `tier` | Yes | Service tier code: `direct_list` or `direct_list_plus` |
| `ref` | No | Source page (e.g., `direct-list-page`, `services-page`) |
| `utm_*` | No | UTM params forwarded for attribution |

### Return URL Template

```
https://app.access.realty/?stripe_session_id={CHECKOUT_SESSION_ID}&tier=direct_list&ref=direct-list-page
```

---

## App-Side Implementation (Already Complete)

The main app handles:

1. **URL param parsing** - Extracts `stripe_session_id`, `tier`, `ref`, and UTM params
2. **`/api/stripe/verify-marketing-payment`** - Verifies payment with Stripe
3. **`profiles.marketing_stripe_session_id`** - Stores verified session for audit
4. **`SubmissionFlow`** - Pre-selects service tier based on verified payment

---

## Testing

### Local Testing

1. Start marketing site: `npm run dev` (port 4000)
2. Start app on port 3000

Test the full flow:
```
1. Go to http://localhost:4000/direct-list
2. Click "Get Started"
3. Select "DirectList" tier in the modal
4. Stripe checkout form appears IN THE MODAL (not a redirect!)
5. Complete test payment (card: 4242 4242 4242 4242)
6. Should redirect to http://localhost:3000/?stripe_session_id=cs_test_xxx&tier=direct_list
7. Complete signup
8. Start submission - tier should be pre-selected
```

### Test Card Numbers

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

---

## Webhook (Optional)

For tracking/analytics, add a webhook handler for `checkout.session.completed`:

```typescript
// /app/api/stripe/webhook/route.ts
// Not required for core functionality - the app verifies sessions on arrival
// Useful for: analytics, email triggers, CRM updates

case 'checkout.session.completed': {
  const session = event.data.object;

  if (session.metadata?.created_from !== 'marketing-site') break;

  console.log('Marketing payment completed:', {
    tier: session.metadata.plan,
    amount: session.amount_total,
    email: session.customer_details?.email,
    source: session.metadata.source,
    utm_source: session.metadata.utm_source,
  });
}
```

---

## Troubleshooting

### Checkout modal shows "Loading..." forever
- Check browser console for errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Verify API is returning `clientSecret`

### "Payment not completed" error in app
- Check Stripe Dashboard to confirm payment succeeded
- Verify session hasn't expired (24 hour limit)

### Tier not pre-selected in app
- Confirm `tier` URL param matches exactly: `direct_list` or `direct_list_plus`
- Check browser console for sessionStorage issues

### Session verification fails
- Confirm both apps use the same Stripe account
- Check `STRIPE_SECRET_KEY` is correctly set in app's environment
