# Marketing Site Stripe Integration - Developer Primer

## Overview

The marketing site (`access.realty`) now collects Stripe payments BEFORE users create accounts. This document explains the integration and what needs to be implemented in `access-realty-app`.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MARKETING SITE                                     │
│                         (access.realty)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. User lands on /services page (possibly with UTM params)                 │
│     Example: /services?utm_source=google&utm_campaign=spring2025            │
│                                                                              │
│  2. User clicks "Select DirectList" or "Select DirectList+"                 │
│     → PlanSelectButton captures UTM params from URL                         │
│     → POST /api/stripe/create-checkout-session                              │
│       Body: { plan, source, utmParams }                                     │
│                                                                              │
│  3. API creates Stripe Checkout Session with:                               │
│     - success_url: app.access.realty/signup?session_id={ID}&plan=X          │
│     - metadata: { plan, source, utm_source, utm_medium, ... }               │
│                                                                              │
│  4. User redirects to Stripe hosted checkout                                │
│     → Enters credit card                                                    │
│     → Payment completes                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MAIN APP                                        │
│                        (app.access.realty)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  5. User arrives at /signup?session_id=cs_xxx&plan=direct-list              │
│     → App detects session_id in URL                                         │
│     → App verifies session with Stripe API                                  │
│                                                                              │
│  6. User completes SSO/OAuth signup                                         │
│     → User record created in auth.users                                     │
│     → Profile created                                                       │
│                                                                              │
│  7. App links payment to user:                                              │
│     → Retrieve Stripe session metadata                                      │
│     → UPDATE stripe_payments SET user_id = X WHERE stripe_session_id = Y    │
│                                                                              │
│  8. User enters app with payment already complete                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## What the Marketing Site Does

### Files Modified

1. **`/api/stripe/create-checkout-session/route.ts`** - Creates Stripe Checkout sessions
2. **`/components/services/PlanSelectButton.tsx`** - Button component that captures UTMs and triggers checkout
3. **`/app/services/page.tsx`** - Uses PlanSelectButton for CTA buttons

### What Gets Sent to Stripe

The Stripe Checkout session is created with this metadata:

```typescript
metadata: {
  plan: "direct-list" | "direct-list-plus",
  source: "services-page",
  created_from: "marketing-site",
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,
  utm_term?: string,
  utm_content?: string,
}
```

### Success URL Format

After payment, Stripe redirects to:
```
https://app.access.realty/signup?session_id={CHECKOUT_SESSION_ID}&plan=direct-list&payment_complete=true
```

The `{CHECKOUT_SESSION_ID}` is replaced by Stripe with the actual session ID (e.g., `cs_test_abc123...`).

---

## What access-realty-app Needs to Implement

### 1. Database Migration

The existing `stripe_payments` table needs two changes:

```sql
-- Migration: Add support for pre-auth payments from marketing site

-- 1. Make user_id nullable (payments can exist before user signup)
ALTER TABLE stripe_payments
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add stripe_session_id for linking payments after signup
ALTER TABLE stripe_payments
ADD COLUMN stripe_session_id TEXT UNIQUE;

-- 3. Add index for session lookups
CREATE INDEX idx_stripe_payments_session_id
ON stripe_payments(stripe_session_id)
WHERE stripe_session_id IS NOT NULL;

-- Note: Existing rows will have NULL stripe_session_id (legacy payments)
-- New payments from marketing site will have session_id but NULL user_id initially
```

### 2. Signup Flow Changes

In the signup/onboarding flow, check for `session_id` query parameter:

```typescript
// In /signup page or auth callback

const searchParams = useSearchParams();
const sessionId = searchParams.get('session_id');
const paymentComplete = searchParams.get('payment_complete');

if (sessionId && paymentComplete === 'true') {
  // User paid on marketing site before signup
  // Store sessionId for linking after OAuth completes
  sessionStorage.setItem('stripe_session_id', sessionId);
}
```

### 3. Post-Auth Payment Linking

After user completes OAuth and profile creation:

```typescript
async function linkPendingPayment(userId: string) {
  const sessionId = sessionStorage.getItem('stripe_session_id');
  if (!sessionId) return;

  // Verify session with Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    console.error('Session not paid:', sessionId);
    return;
  }

  // Link payment to user in database
  const { error } = await supabase
    .from('stripe_payments')
    .update({ user_id: userId })
    .eq('stripe_session_id', sessionId);

  if (!error) {
    sessionStorage.removeItem('stripe_session_id');
  }
}
```

### 4. Create Payment Record (Option A: Webhook)

The marketing site does NOT insert into `stripe_payments`. You have two options:

**Option A: Stripe Webhook (Recommended)**

Add a webhook handler for `checkout.session.completed`:

```typescript
// /api/webhooks/stripe/route.ts

case 'checkout.session.completed': {
  const session = event.data.object;

  // Only handle sessions from marketing site
  if (session.metadata?.created_from !== 'marketing-site') {
    break;
  }

  await supabase.from('stripe_payments').insert({
    stripe_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent,
    amount: session.amount_total,
    currency: session.currency,
    status: 'succeeded',
    stripe_metadata: session.metadata, // Contains UTMs!
    user_id: null, // Will be linked after signup
  });

  break;
}
```

**Option B: Create on Verification**

Alternatively, create the record when the user arrives with a session_id:

```typescript
// During signup flow
async function verifyAndRecordPayment(sessionId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') return null;

  // Check if already recorded
  const { data: existing } = await supabase
    .from('stripe_payments')
    .select('id')
    .eq('stripe_session_id', sessionId)
    .single();

  if (existing) return existing;

  // Create payment record
  const { data } = await supabase.from('stripe_payments').insert({
    stripe_session_id: sessionId,
    stripe_payment_intent_id: session.payment_intent,
    amount: session.amount_total,
    currency: session.currency,
    status: 'succeeded',
    stripe_metadata: session.metadata,
    user_id: null, // Will be updated after signup completes
  }).select().single();

  return data;
}
```

---

## Environment Variables

The marketing site uses these env vars (already configured):

```bash
STRIPE_SECRET_KEY=sk_live_xxx  # Same key as main app
STRIPE_PRICE_DIRECT_LIST=price_xxx
STRIPE_PRICE_DIRECT_LIST_PLUS=price_xxx
```

---

## Testing

### Test with UTM Parameters

1. Visit: `http://localhost:3000/services?utm_source=test&utm_campaign=dev`
2. Click "Select DirectList"
3. Complete Stripe test payment (card: 4242 4242 4242 4242)
4. Check Stripe Dashboard → Payments → click payment → Metadata
5. Confirm UTMs are present: `utm_source: test`, `utm_campaign: dev`

### Test Full Flow

1. Start both apps (marketing on :3000, app on :4000)
2. Complete payment on marketing site
3. Should redirect to `app.access.realty/signup?session_id=cs_xxx...`
4. Complete OAuth signup
5. Verify payment is linked to user in database

---

## Edge Cases to Handle

1. **User abandons after payment** - Payment record exists with `user_id = NULL`. Consider a cleanup job or re-engagement email.

2. **User already has account** - If user with same email exists during OAuth, link payment to existing account.

3. **Session expired** - Stripe sessions expire after 24 hours. Handle gracefully if user returns with stale session_id.

4. **Duplicate session attempts** - The UNIQUE constraint on `stripe_session_id` prevents double-recording.

---

## Questions?

Reach out to the team if anything is unclear. The key points are:
1. Migration makes `user_id` nullable and adds `stripe_session_id`
2. Signup flow needs to detect and store `session_id` from URL
3. After OAuth, link the payment to the new user
4. UTM data is in the Stripe session metadata and should be preserved in `stripe_metadata` JSONB column
