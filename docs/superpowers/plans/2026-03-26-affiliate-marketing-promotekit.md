# Affiliate Marketing (PromoteKit) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch affiliate marketing for DirectList using PromoteKit — a partners recruitment page, investor vetting flow, and qualified-investors checkout landing page with $500 coupon support.

**Architecture:** Three new/modified pages in the DirectList route group, a shared investor vetting module backed by BatchData parcel-lookup, an enhanced property-lookup API that returns vetting fields, and PromoteKit tracking script integration that passes `promotekit_referral` to Stripe checkout metadata.

**Tech Stack:** Next.js 16 App Router, Stripe Embedded Checkout, Supabase Edge Functions (parcel-lookup), Google Places Autocomplete, PromoteKit JS SDK.

---

## Context (Read First)

### Pricing Model
- **DirectList** (homeowners): $2,995 total
- **Investor tier** (`investor_1995` — Bret will create this in Stripe/DB): $1,995 published price
- **Affiliate coupon**: $500 off investor tier → effective $1,495
- Coupon is auto-assigned per affiliate by PromoteKit (unique codes per promoter)
- Coupon restricted to the investor product only in Stripe

### Existing Code to Reuse
- `components/direct-list/AddressInput.tsx` — Google Places Autocomplete, returns `AddressData`
- `lib/propertyLookup.ts` → `app/api/property-lookup/route.ts` — proxies to `parcel-lookup` edge function
- `components/checkout/EmbeddedCheckoutModal.tsx` — Stripe Embedded Checkout wrapper
- `app/api/stripe/create-checkout-session/route.ts` — Stripe session creation (already has `allow_promotion_codes: true`)
- `app/(direct-list)/direct-list/investors/InvestorsContent.tsx` — existing investors page
- `app/(direct-list)/direct-list/investors/book/BookContent.tsx` — existing booking flow (FAIL path target)

### BatchData Fields for Vetting (stored in `parcels` table)
These fields are populated by the `parcel-lookup` edge function:
- `owner_status_type` (text) — e.g., "Individual", "Company", "Trust"
- `ql_corporate_owned` (boolean) — QuickList flag for corporate ownership
- `ql_trust_owned` (boolean) — QuickList flag for trust ownership
- `last_transfer_date` (date) — when property last changed hands
- `raw_response` (JSONB) — contains `tax.taxExemptions` array for homestead check

### Page Flow Sequence
Pitch → Contact Form (name, email, phone) → Address Entry → Vetting → Checkout (PASS) or Book a Call (FAIL)

Contact info is collected BEFORE address vetting. This:
- Captures the lead regardless of vetting outcome
- Deters casual exploration (people don't enter their email to tire-kick)
- Enables per-email rate limiting of vetting attempts (durable, survives refreshes)
- Smooths the FAIL path — you already have their info, so "Book a Call" is just a Calendly embed

### Vetting Rules (priority order)
1. `owner_status_type` contains LLC/Corp/Trust OR `ql_corporate_owned = true` → **PASS** (trumps all)
2. `raw_response->'tax'->'taxExemptions'` contains homestead (HS) → **FAIL**
3. `last_transfer_date` within last 12 months → **PASS**
4. None matched → **FAIL**

### Important References
- Voice guide: `DIRECTLIST-VOICE-GUIDE.md`
- Landing page templates: `LANDING-PAGE-TEMPLATES.md`
- Marketing handoff: `MARKETING-HANDOFF.md`
- Stripe config memory: `/Users/bort/.claude/projects/-Users-bort-Documents-GitHub-access-realty-home/memory/stripe-config.md`
- App repo parcel-lookup: `/Users/bort/Documents/GitHub/access-realty-app/supabase/functions/parcel-lookup/index.ts`

### Domain Routing
- `direct-list.com/*` is the canonical domain for DirectList pages
- `access.realty/direct-list/*` redirects to `direct-list.com/*` (see `next.config.ts`)
- All pages live under `app/(direct-list)/direct-list/` route group

---

## File Structure

### New Files
| File | Responsibility |
|------|----------------|
| `lib/investorVetting.ts` | Vetting logic: takes parcel data, returns pass/fail with reason |
| `app/api/investor-vetting/route.ts` | API route: runs property-lookup + returns vetting result with parcel data |
| `app/(direct-list)/direct-list/qualified-investors/page.tsx` | Server wrapper: metadata for `/qualified-investors` |
| `app/(direct-list)/direct-list/qualified-investors/QualifiedInvestorsContent.tsx` | Client component: affiliate landing page with pitch → vetting → checkout |
| `app/(direct-list)/direct-list/partners/page.tsx` | Server wrapper: metadata for `/partners` (noindex) |
| `app/(direct-list)/direct-list/partners/PartnersContent.tsx` | Client component: affiliate recruitment pitch page |
| `components/direct-list/InvestorVettingFlow.tsx` | Shared component: address input → vetting → pass/fail UI |

### Modified Files
| File | Change |
|------|--------|
| `app/layout.tsx` | Add PromoteKit tracking script to `<head>` (directlist brand only) |
| `app/api/stripe/create-checkout-session/route.ts` | Add `investor_1995` to `PLAN_PRICE_MAP`, pass `promotekit_referral` in metadata |
| `components/checkout/EmbeddedCheckoutModal.tsx` | Add `promotekitReferral` prop, pass to checkout session API |
| `app/(direct-list)/direct-list/investors/InvestorsContent.tsx` | Update price from $2,995 to $1,995, add vetting flow before Book a Call |
| `next-sitemap.config.js` | Add `/qualified-investors` to sitemap, add `/partners` to exclusion list |

### Deployment Ordering
The app repo migration for `investor_1995` tier (CHECK constraints + `service_tiers` row) must deploy **before or simultaneously with** the marketing site changes. Otherwise, completed checkouts with `tier=investor_1995` will fail on the app side.

---

## Task 1: Investor Vetting Logic

**Files:**
- Create: `lib/investorVetting.ts`

This is the core business logic. Pure function, no side effects, easy to test.

- [ ] **Step 1: Create the vetting module**

```typescript
// lib/investorVetting.ts
// ABOUTME: Pure business logic for investor qualification vetting
// ABOUTME: Checks parcel data from BatchData to determine if seller is an investor

export type VettingResult = {
  passed: boolean;
  reason: string;
  signal: "llc_owner" | "corporate_owned" | "recent_transfer" | "homestead" | "no_signal";
};

/**
 * Determine if a property's ownership signals indicate an investor seller.
 *
 * Priority order:
 * 1. LLC/Corp/Trust ownership → PASS (trumps homestead)
 * 2. Homestead exemption → FAIL
 * 3. Owned < 1 year → PASS
 * 4. No clear signal → FAIL
 */
export function vetInvestor(parcel: {
  owner_status_type?: string | null;
  ql_corporate_owned?: boolean | null;
  ql_trust_owned?: boolean | null;
  last_transfer_date?: string | null;
  raw_response?: Record<string, unknown> | null;
}): VettingResult {
  // 1. LLC/Corporate/Trust ownership — PASS (highest priority, trumps HS)
  const ownerType = (parcel.owner_status_type || "").toLowerCase();
  if (
    ownerType.includes("company") ||
    ownerType.includes("corporate") ||
    ownerType.includes("llc") ||
    ownerType.includes("trust")
  ) {
    return { passed: true, reason: "Property owned by entity", signal: "llc_owner" };
  }
  if (parcel.ql_corporate_owned || parcel.ql_trust_owned) {
    return { passed: true, reason: "Entity-owned property", signal: "corporate_owned" };
  }

  // 2. Homestead exemption — FAIL
  if (hasHomesteadExemption(parcel.raw_response)) {
    return { passed: false, reason: "Homestead exemption detected", signal: "homestead" };
  }

  // 3. Owned less than 1 year — PASS
  if (parcel.last_transfer_date) {
    const transferDate = new Date(parcel.last_transfer_date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (transferDate > oneYearAgo) {
      return { passed: true, reason: "Recent acquisition (< 1 year)", signal: "recent_transfer" };
    }
  }

  // 4. No clear signal — FAIL
  return { passed: false, reason: "No investor signals detected", signal: "no_signal" };
}

/**
 * Check raw BatchData response for homestead (HS) tax exemption.
 * BatchData stores exemptions in tax.taxExemptions as an array of strings.
 */
function hasHomesteadExemption(rawResponse: Record<string, unknown> | null | undefined): boolean {
  if (!rawResponse) return false;

  try {
    const tax = rawResponse.tax as Record<string, unknown> | undefined;
    if (!tax) return false;

    const exemptions = tax.taxExemptions;
    if (!Array.isArray(exemptions)) return false;

    return exemptions.some((e: unknown) => {
      const str = String(e).toLowerCase().trim();
      return str.includes("homestead") || str === "hs" || str === "res homestead";
    });
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit lib/investorVetting.ts 2>&1 | head -20`
Expected: No errors (or only unrelated project-level errors)

- [ ] **Step 3: Commit**

```bash
git add lib/investorVetting.ts
git commit -m "feat: add investor vetting logic for affiliate marketing"
```

---

## Task 2: Investor Vetting API Route

**Files:**
- Create: `app/api/investor-vetting/route.ts`

This route calls the existing `parcel-lookup` edge function (via the same pattern as `property-lookup`), then runs the vetting logic and returns the result. It returns more fields than the standard property-lookup route — specifically the ownership/tax fields needed for vetting.

**Abuse protection:** Contact info is collected before vetting (see flow sequence above). The API requires an email and limits vetting attempts per email address. This is durable — survives page refreshes, cleared cookies, and different devices. Combined with a honeypot field for bot rejection.

- [ ] **Step 1: Create the API route**

First, add the shared response type to `lib/investorVetting.ts` (append to the file created in Task 1):

```typescript
// Append to lib/investorVetting.ts:

/** Response shape returned by /api/investor-vetting — shared between route and UI */
export interface InvestorVettingResponse {
  vetting: VettingResult;
  parcel: {
    parcel_id: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    bedrooms?: number;
    bathrooms_total?: number;
    living_area_sqft?: number;
    year_built?: number;
    avm_value?: number;
    owner_1_full_name?: string;
  };
}
```

Then create the route:

```typescript
// app/api/investor-vetting/route.ts
// ABOUTME: API route that looks up property data and runs investor vetting logic
// ABOUTME: Requires email (contact gate) and limits vetting attempts per email address

import { NextRequest, NextResponse } from "next/server";
import { vetInvestor, type InvestorVettingResponse } from "@/lib/investorVetting";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- Per-email rate limiting ---
// Contact info is collected before vetting (UI enforces this sequence).
// Email is required here and used as the rate limit key — durable across
// page refreshes, cleared cookies, and different devices.
// Resets on serverless cold start, but the client-side 3-attempt cap
// provides the primary UX-level gate.
const MAX_ATTEMPTS_PER_EMAIL = 5;
const WINDOW_MS = 24 * 60 * 60_000; // 24 hours
const emailBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const bucket = emailBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    emailBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count++;
  return bucket.count > MAX_ATTEMPTS_PER_EMAIL;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // --- Honeypot check: reject bots that fill hidden fields ---
    if (body.website) {
      return NextResponse.json({ error: "Verification failed" }, { status: 422 });
    }

    // --- Contact gate: email is required ---
    const { email, address, street, city, state, zip } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required for property verification" },
        { status: 400 }
      );
    }

    // --- Per-email rate limit ---
    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please book a call instead." },
        { status: 429 }
      );
    }

    if (!address && (!street || !city || !state)) {
      return NextResponse.json(
        { error: "Address or address components (street, city, state) required" },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    // Call parcel-lookup Edge Function WITHOUT upsert so we always get fresh
    // BatchData results. An investor may have purchased the property recently —
    // the 90-day cache could still show the previous owner's data.
    // Cost is ~$0.025/call, controlled by the per-IP rate limit above (5/hr).
    // Data is NOT persisted to the parcels table — this is just a qualification check.
    // When the investor later enters the get-started wizard, THAT flow uses upsert: true
    // and properly saves the parcel.
    const response = await fetch(`${SUPABASE_URL}/functions/v1/parcel-lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ...(address ? { address } : { street, city, state, zip }),
        // Intentionally omitting upsert: true — always fetch fresh from BatchData
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Property lookup failed" },
        { status: response.status }
      );
    }

    const parcelData = await response.json();

    // Run vetting logic
    const vetting = vetInvestor({
      owner_status_type: parcelData.owner_status_type,
      ql_corporate_owned: parcelData.ql_corporate_owned,
      ql_trust_owned: parcelData.ql_trust_owned,
      last_transfer_date: parcelData.last_transfer_date,
      raw_response: parcelData.raw_response,
    });

    return NextResponse.json({
      vetting,
      parcel: {
        parcel_id: parcelData.parcel_id,
        street_address: parcelData.street_address,
        city: parcelData.city,
        state: parcelData.state,
        zip: parcelData.zip,
        bedrooms: parcelData.bedrooms,
        bathrooms_total: parcelData.bathrooms_total,
        living_area_sqft: parcelData.living_area_sqft,
        year_built: parcelData.year_built,
        avm_value: parcelData.avm_value,
        owner_1_full_name: parcelData.owner_1_full_name,
      },
    } satisfies InvestorVettingResponse);
  } catch (error) {
    console.error("Investor vetting error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Protection layers (three gates):**
1. **Contact gate:** Email/name/phone collected before any address lookup. Deters casual exploration — people don't enter real contact info to tire-kick. Also captures the lead regardless of vetting outcome.
2. **Per-email rate limit:** 5 vetting attempts per email per 24 hours (server-side). Durable across page refreshes, cleared cookies, and different devices. In-memory Map resets on cold start, but the client-side cap is the primary UX gate.
3. **Honeypot + client-side cap:** Hidden `website` field rejects bots. Component state limits to 3 attempts before showing "Book a Call" fallback.

**Why no parcel cache for vetting:** We intentionally skip the 90-day freshness cache (`upsert: true` omitted) because an investor may have purchased the flip house recently — stale cached data would still show the previous owner. The contact gate + per-email rate limit control cost instead. When the investor proceeds to the actual get-started/checkout flow, *that* path uses `upsert: true` and properly persists the parcel.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/api/investor-vetting/route.ts
git commit -m "feat: add investor vetting API route"
```

---

## Task 3: Shared Investor Vetting Flow Component

**Files:**
- Create: `components/direct-list/InvestorVettingFlow.tsx`

Shared UI component used by both `/investors` (existing page) and `/qualified-investors` (new affiliate page). Handles: address input → loading → pass/fail display.

**Important:** This component assumes contact info has ALREADY been collected by the parent page. It receives the email as a prop and passes it to the API for per-email rate limiting. The parent page manages the flow sequence: pitch → contact form → this component.

Includes a **client-side attempt cap** (max 3 addresses per session) as a UX gate.

- [ ] **Step 1: Create the vetting flow component**

This component should:
- Accept `email` prop (required — collected by parent before this component renders)
- Show Google Places `AddressInput` for property address entry
- Track attempt count in state — after 3 attempts, disable input and show fallback
- On address select, call `/api/investor-vetting` with email + address and show a spinner
- On PASS: show green success state, call `onPass(parcelId)` callback
- On FAIL: show the "Book a Call" CTA, call `onFail(reason)` callback
- On error (property not found): show "enter another address" message
- Include a hidden `website` honeypot field for bot rejection
- Handle 429 (rate limited) response gracefully

```typescript
// components/direct-list/InvestorVettingFlow.tsx
// ABOUTME: Shared address-based investor vetting flow for /investors and /qualified-investors
// ABOUTME: Includes client-side attempt cap (3 max) and honeypot field for abuse prevention

"use client";

import { useState, useRef } from "react";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import type { InvestorVettingResponse } from "@/lib/investorVetting";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPhone } from "react-icons/hi2";

const MAX_ATTEMPTS = 3;

type VettingState = "idle" | "loading" | "passed" | "failed" | "error" | "exhausted";

interface InvestorVettingFlowProps {
  /** Email collected by parent — required for per-email rate limiting */
  email: string;
  onPass: (parcelId: string, address: string) => void;
  onFail: (reason: string) => void;
  /** URL for the Book a Call fallback */
  bookCallHref?: string;
  /** Label for the address input */
  prompt?: string;
}

export function InvestorVettingFlow({
  email,
  onPass,
  onFail,
  bookCallHref = "/direct-list/investors/book",
  prompt = "Enter the property address you'd like to list",
}: InvestorVettingFlowProps) {
  const [state, setState] = useState<VettingState>("idle");
  const [address, setAddress] = useState<AddressData | null>(null);
  const [result, setResult] = useState<InvestorVettingResponse | null>(null);
  const [error, setError] = useState("");
  const attemptCount = useRef(0);
  // Honeypot — hidden field that bots fill in. Sent to API which rejects if non-empty.
  const honeypotRef = useRef("");

  const handleAddressSelect = async (addressData: AddressData) => {
    attemptCount.current++;

    // Client-side attempt cap — after MAX_ATTEMPTS, show fallback
    if (attemptCount.current > MAX_ATTEMPTS) {
      setState("exhausted");
      return;
    }

    setAddress(addressData);
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/investor-vetting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address: addressData.formattedAddress,
          website: honeypotRef.current, // honeypot field — should be empty
        }),
      });

      if (response.status === 404) {
        setState("error");
        setError("We couldn't find that property. Please check the address and try again.");
        return;
      }

      if (response.status === 429) {
        setState("error");
        setError("Too many lookups. Please try again later or book a call.");
        return;
      }

      if (!response.ok) {
        setState("error");
        setError("Something went wrong. Please try again.");
        return;
      }

      const data: InvestorVettingResponse = await response.json();
      setResult(data);

      if (data.vetting.passed) {
        setState("passed");
        onPass(data.parcel.parcel_id, addressData.formattedAddress);
      } else {
        setState("failed");
        onFail(data.vetting.reason);
      }
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    if (attemptCount.current >= MAX_ATTEMPTS) {
      setState("exhausted");
      return;
    }
    setState("idle");
    setAddress(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-4">
      {/* Honeypot — invisible to humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        aria-hidden="true"
        onChange={(e) => { honeypotRef.current = e.target.value; }}
      />

      {/* Address Input — shown when idle or error */}
      {(state === "idle" || state === "error") && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{prompt}</p>
          <AddressInput
            onAddressSelect={handleAddressSelect}
            placeholder="123 Main St, Fort Worth, TX"
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Verifying property...</span>
        </div>
      )}

      {/* Passed */}
      {state === "passed" && result && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <HiOutlineCheckCircle className="h-6 w-6 text-green-600 shrink-0" />
            <p className="font-semibold text-green-800">Qualified for Investor Pricing</p>
          </div>
          <p className="text-sm text-green-700">
            {address?.formattedAddress}
          </p>
          {result.parcel.living_area_sqft && (
            <p className="text-xs text-green-600">
              {result.parcel.bedrooms} bed · {result.parcel.living_area_sqft?.toLocaleString()} sqft
              {result.parcel.year_built ? ` · Built ${result.parcel.year_built}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Failed */}
      {state === "failed" && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HiOutlineXCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <p className="font-semibold text-amber-800">Additional Verification Needed</p>
          </div>
          <p className="text-sm text-amber-700">
            We weren&apos;t able to automatically verify investor qualification for this property.
            Schedule a quick call and we&apos;ll get you sorted.
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-primary font-medium hover:underline"
          >
            Try a different address
          </button>
        </div>
      )}

      {/* Exhausted — max attempts reached */}
      {state === "exhausted" && (
        <div className="rounded-xl border border-border bg-muted/50 p-5 text-center space-y-3">
          <p className="font-medium text-foreground">
            Having trouble qualifying?
          </p>
          <p className="text-sm text-muted-foreground">
            No worries — schedule a quick call and we&apos;ll verify your investor status personally.
          </p>
          <a
            href={bookCallHref}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <HiPhone className="h-4 w-4" />
            Book a Call
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add components/direct-list/InvestorVettingFlow.tsx
git commit -m "feat: add shared InvestorVettingFlow component"
```

---

## Task 4: PromoteKit Tracking Script + Stripe Integration

**Files:**
- Modify: `app/layout.tsx` (~line 112, in the `<head>` section)
- Modify: `app/api/stripe/create-checkout-session/route.ts` (~line 46, PLAN_PRICE_MAP + ~line 164, metadata)

### 4a: Add PromoteKit Script

- [ ] **Step 1: Add PromoteKit script to root layout (directlist brand only)**

In `app/layout.tsx`, find the `{brand === "directlist" && ...}` block (around line 158-191) where brand-specific scripts live. Add the PromoteKit tracking script inside this block:

```typescript
// Inside the {brand === "directlist" && ...} block, add:
<Script
  src="https://promotekit.com/js/promotekit.js"
  data-promotekit={process.env.NEXT_PUBLIC_PROMOTEKIT_ID || ""}
  strategy="afterInteractive"
/>
```

**NOTE:** The actual PromoteKit script URL and data attribute come from the PromoteKit dashboard after campaign setup. Bret will need to provide the exact script tag. The env var `NEXT_PUBLIC_PROMOTEKIT_ID` should be added to `.env.local` and Vercel. Only load on directlist brand — Access Realty pages don't need affiliate tracking.

### 4b: Add Investor Tier to Checkout + PromoteKit Referral

- [ ] **Step 2: Add `investor_1995` to PLAN_PRICE_MAP**

In `app/api/stripe/create-checkout-session/route.ts`, add the new tier to `PLAN_PRICE_MAP` (around line 46):

```typescript
"investor_1995": {
  priceId: process.env.STRIPE_PRICE_INVESTOR_1995 || "",
  name: "Investor",
  amountCents: 199500, // $1,995 upfront (before coupon)
},
```

- [ ] **Step 3: Pass PromoteKit referral in Stripe metadata**

In the same file, in the `POST` handler, extract `promotekitReferral` from the request body (around line 84):

```typescript
const { plan, source, utmParams, returnUrl, leadId, propertySpecs, promotekitReferral } = body as {
  plan: string;
  source?: string;
  utmParams?: UTMParams;
  returnUrl?: string;
  leadId?: string;
  propertySpecs?: PropertySpecs;
  promotekitReferral?: string;
};
```

Then add it to the Stripe session metadata (around line 181):

```typescript
metadata: {
  tier: plan,
  source: source || "services-page",
  created_from: "marketing-site",
  ...(leadId && { lead_id: leadId }),
  ...(promotekitReferral && { promotekit_referral: promotekitReferral }),
  // ... existing property specs and UTM params
},
```

### 4c: Modify EmbeddedCheckoutModal to Pass PromoteKit Referral

- [ ] **Step 4: Add `promotekitReferral` prop to EmbeddedCheckoutModal**

In `components/checkout/EmbeddedCheckoutModal.tsx`:

1. Add prop to interface (around line 35):
```typescript
interface EmbeddedCheckoutModalProps {
  // ... existing props
  promotekitReferral?: string;
}
```

2. Destructure it in the component (around line 48):
```typescript
export function EmbeddedCheckoutModal({
  // ... existing props
  promotekitReferral,
}: EmbeddedCheckoutModalProps) {
```

3. Pass it in the fetch body where the checkout session is created (find the `JSON.stringify` call that posts to `/api/stripe/create-checkout-session`):
```typescript
body: JSON.stringify({
  plan,
  source,
  utmParams,
  leadId,
  propertySpecs,
  promotekitReferral,  // Add this
}),
```

4. Add `promotekitReferral` to the `useEffect` dependency array that triggers the fetch.

- [ ] **Step 5: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/api/stripe/create-checkout-session/route.ts components/checkout/EmbeddedCheckoutModal.tsx
git commit -m "feat: add PromoteKit tracking + investor_1995 tier to checkout"
```

---

## Task 5: Qualified Investors Landing Page (Affiliate Target)

**Files:**
- Create: `app/(direct-list)/direct-list/qualified-investors/page.tsx`
- Create: `app/(direct-list)/direct-list/qualified-investors/QualifiedInvestorsContent.tsx`

This is the page affiliate links point to: `direct-list.com/qualified-investors`

Flow: Pitch ($1,995 vs $2,995 comparison) → Contact form (name, email, phone) → Address vetting → PASS: checkout → FAIL: Book a Call (Calendly, pre-filled with contact info)

Read `DIRECTLIST-VOICE-GUIDE.md` and `LANDING-PAGE-TEMPLATES.md` before writing copy. Use the emotional arc: Mirror → Validate → Reframe → Prove → Address Doubt → Close.

- [ ] **Step 1: Create server wrapper with metadata**

```typescript
// app/(direct-list)/direct-list/qualified-investors/page.tsx
// ABOUTME: Qualified Investors landing — affiliate target page for PromoteKit campaigns
// ABOUTME: Server wrapper exports metadata; delegates rendering to QualifiedInvestorsContent

import type { Metadata } from "next";
import QualifiedInvestorsContent from "./QualifiedInvestorsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Qualified Investor Pricing — DirectList",
  description:
    "Real estate investors qualify for exclusive pricing. List your investment property on the MLS for $1,995 — save $1,000 with your investor code.",
  alternates: { canonical: "https://direct-list.com/qualified-investors" },
  openGraph: {
    title: "Qualified Investor Pricing — DirectList",
    description:
      "Exclusive investor pricing for MLS listings. $1,995 with your referral code.",
    url: "https://direct-list.com/qualified-investors",
    siteName: "DirectList by Access Realty",
  },
};

export default function QualifiedInvestorsPage() {
  return <QualifiedInvestorsContent />;
}
```

- [ ] **Step 2: Create the client component**

The `QualifiedInvestorsContent.tsx` client component should follow this structure. The page is a multi-step flow managed in component state:

**Step 1 — Pitch (initial view):**
1. **Hero** — "You've Been Referred" messaging, $1,995 vs $2,995 comparison
2. **How it Works** — 3-step visual (reuse existing `/3-easy-steps.png`)
3. **Side-by-Side Pricing** — DirectList $2,995 (passive) vs Investor $1,995 (dominant), similar layout to existing `InvestorsContent.tsx` but with the updated $1,995 price
4. **CTA** — "Verify Your Qualification" button → advances to Step 2

**Step 2 — Contact form:**
- Collect name, email, phone (same pattern as `BookContent.tsx`)
- Create lead via `POST /api/leads` (captures lead before any BatchData cost)
- Send Slack notification via `POST /api/program-inquiry`
- On success → advance to Step 3

**Step 3 — Address vetting:**
- `InvestorVettingFlow` component with `email` prop from Step 2
- PASS → advance to Step 4
- FAIL → show Calendly booking (pre-filled with Step 2 contact info, same pattern as `BookContent.tsx`)

**Step 4 — Checkout (PASS only):**
- `EmbeddedCheckoutModal` with `plan="investor_1995"`
- Pass `window.promotekit_referral` as `promotekitReferral` prop
- Show coupon messaging: "Use your referral code at checkout for $500 off"

Key implementation details:
- Read `window.promotekit_referral` on mount and store in state
- The lead is created at Step 2 — pass `leadId` to checkout session metadata
- FAIL path uses `CalendlyBooking` component (same as `BookContent.tsx`) with pre-filled invitee data from Step 2

**Copy direction (from voice guide):**
- Mirror: "You're not looking for the standard listing package."
- Validate: "As an investor, you need speed and margins, not hand-holding."
- Reframe: "Same MLS exposure, same professional photography — without paying for extras you'll never use."
- Prove: Price comparison visual
- Close: "Verify your qualification below to unlock investor pricing."

- [ ] **Step 3: Verify build + visual review**

Run: `npm run build 2>&1 | tail -20`

Then start dev server and screenshot:
```bash
npm run dev &
sleep 3
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/qualified-investors.png --window-size=1400,1200 "http://localhost:4000/direct-list/qualified-investors"
```

Review the screenshot for layout, colors, and component rendering.

- [ ] **Step 4: Commit**

```bash
git add app/\(direct-list\)/direct-list/qualified-investors/
git commit -m "feat: add qualified-investors landing page for affiliate campaigns"
```

---

## Task 6: Update Existing Investors Page

**Files:**
- Modify: `app/(direct-list)/direct-list/investors/InvestorsContent.tsx`

Changes:
1. Update pricing from `$2,995` to `$1,995` in the investor card
2. Replace the static "Book a Call to Unlock Pricing" CTA with a multi-step inline flow:
   - Step 1: Contact form (name, email, phone) — creates lead
   - Step 2: `InvestorVettingFlow` with email from Step 1
3. PASS → proceed to checkout via `EmbeddedCheckoutModal`
4. FAIL → Calendly booking (pre-filled with contact info from Step 1)

- [ ] **Step 1: Update the pricing section**

In `InvestorsContent.tsx`:
- Change the strikethrough price reference to `$2,995` (DirectList standard)
- The investor card price changes from "Investor Pricing Available" to the actual `$1,995` price
- The Standard Listing card already shows `$2,995` — keep that

- [ ] **Step 2: Replace bottom CTA with vetting flow**

Replace the static "Book a Call to Unlock Pricing" button in the investor card and the bottom CTA section with the `InvestorVettingFlow` component:

The investors page becomes a multi-step flow. Add state to manage the steps:

```tsx
import { useState } from "react";
import { InvestorVettingFlow } from "@/components/direct-list/InvestorVettingFlow";
import { EmbeddedCheckoutModal } from "@/components/checkout/EmbeddedCheckoutModal";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";

type InvestorStep = "info" | "contact" | "vetting" | "checkout" | "booking";

// Add state:
const [step, setStep] = useState<InvestorStep>("info"); // "info" = current pricing/pitch content
const [contactData, setContactData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
const [leadId, setLeadId] = useState<string | null>(null);
const [showCheckout, setShowCheckout] = useState(false);

// In the investor card, replace the "Book a Call" button with:
// When step === "info": show "Get Started" button that advances to "contact"
// When step === "contact": show inline contact form (name, email, phone)
//   On submit: create lead via /api/leads, advance to "vetting"
// When step === "vetting": show InvestorVettingFlow
<InvestorVettingFlow
  email={contactData.email}
  onPass={(parcelId) => {
    setShowCheckout(true);
  }}
  onFail={() => {
    setStep("booking");  // Show Calendly inline with pre-filled contact info
  }}
/>

// When step === "booking": show CalendlyBooking with pre-filled invitee
// (same pattern as BookContent.tsx — contact info already captured)

// Add modal at end of component:
<EmbeddedCheckoutModal
  isOpen={showCheckout}
  onClose={() => setShowCheckout(false)}
  plan="investor_1995"
  planName="Investor"
  source="investors-page"
  leadId={leadId || undefined}
/>
```

- [ ] **Step 3: Update metadata description**

In `app/(direct-list)/direct-list/investors/page.tsx`, update the description to reference $1,995 pricing.

- [ ] **Step 4: Verify build + visual review**

Run: `npm run build 2>&1 | tail -20`

Screenshot and review:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/investors-updated.png --window-size=1400,1200 "http://localhost:4000/direct-list/investors"
```

- [ ] **Step 5: Commit**

```bash
git add app/\(direct-list\)/direct-list/investors/
git commit -m "feat: update investors page with $1,995 pricing and vetting flow"
```

---

## Task 7: Partners Page (Affiliate Recruitment)

**Files:**
- Create: `app/(direct-list)/direct-list/partners/page.tsx`
- Create: `app/(direct-list)/direct-list/partners/PartnersContent.tsx`

This page is `direct-list.com/partners` — noindexed, for recruiting affiliates. It should:
1. Pitch the affiliate program: "Earn $150 per investor listing, recurring for life"
2. Explain the program: what affiliates get, how it works, who it's for
3. Link to PromoteKit's affiliate signup portal (URL from PromoteKit dashboard)

- [ ] **Step 1: Create server wrapper with noindex metadata**

```typescript
// app/(direct-list)/direct-list/partners/page.tsx
// ABOUTME: Partners/affiliate recruitment page — noindex, links to PromoteKit signup
// ABOUTME: Server wrapper exports metadata; delegates rendering to PartnersContent

import type { Metadata } from "next";
import PartnersContent from "./PartnersContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Partner with DirectList — Earn $150 Per Referral",
  description:
    "Join the DirectList affiliate program. Earn $150 for every investor who lists with us through your referral link.",
  alternates: { canonical: "https://direct-list.com/partners" },
  robots: { index: false, follow: false },
};

export default function PartnersPage() {
  return <PartnersContent />;
}
```

- [ ] **Step 2: Create the partners content component**

Structure:
1. **Hero** — "Earn While You Refer" messaging
2. **How It Works** — 3 steps: Share your link → Investor lists property → You earn $150
3. **Program Details** — $150 per listing, recurring for life, unique code per partner
4. **Who This Is For** — Wholesalers, investor communities, real estate coaches, etc.
5. **CTA** — "Apply to Become a Partner" button → links to PromoteKit signup URL (placeholder: `NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL` env var)

Use the standard DirectList page structure: HeroSection → Section → Section → Section (CTA variant).

- [ ] **Step 3: Verify build + visual review**

Run: `npm run build 2>&1 | tail -20`

Screenshot and review:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/partners.png --window-size=1400,1200 "http://localhost:4000/direct-list/partners"
```

- [ ] **Step 4: Commit**

```bash
git add app/\(direct-list\)/direct-list/partners/
git commit -m "feat: add partners page for affiliate recruitment (noindex)"
```

---

## Task 8: Sitemap + Final Integration

**Files:**
- Modify: `next-sitemap.config.js`
- Modify: `app/layout.tsx` (if PromoteKit script needs adjustment)

- [ ] **Step 1: Update sitemap config**

In `next-sitemap.config.js`, add `/qualified-investors` to the DirectList core pages array and ensure `/partners` is excluded.

Look for the section that maps DirectList paths (around line 14-24):
```javascript
// Add to the DirectList core pages array:
'/qualified-investors',
```

The `/partners` page already has `robots: { index: false }` in its metadata, but you can also add it to the sitemap exclude list if one exists.

- [ ] **Step 2: Add env var placeholders**

Create or update `.env.local.example` to document the new env vars:
```
# PromoteKit
NEXT_PUBLIC_PROMOTEKIT_ID=           # From PromoteKit dashboard → Settings → Script
NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL=   # PromoteKit affiliate signup portal URL

# Stripe - Investor Tier
STRIPE_PRICE_INVESTOR_1995=          # Stripe Price ID for $1,995 investor tier
```

- [ ] **Step 3: Full build verification**

Run: `npm run build 2>&1 | tail -30`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit**

```bash
git add next-sitemap.config.js .env.local.example
git commit -m "feat: update sitemap and env var docs for affiliate marketing"
```

---

## Post-Implementation Checklist (Manual Steps for Bret)

These are NOT code tasks — they require Stripe/PromoteKit dashboard access:

- [ ] **Stripe:** Create `investor_1995` product and price ($1,995) in Stripe Dashboard
- [ ] **Stripe:** Create $500 fixed-amount coupon, restricted to the investor_1995 product
- [ ] **Stripe:** Configure coupon to be "reusable" (same customer can use on multiple purchases)
- [ ] **App repo:** Add `investor_1995` tier code to CHECK constraints (same pattern as `20260203234521_add_investor_tier_codes.sql`)
- [ ] **App repo:** Add `investor_1995` row to `service_tiers` table (migration)
- [ ] **PromoteKit:** Complete campaign setup with Website URL = `https://direct-list.com/qualified-investors`
- [ ] **PromoteKit:** Get the tracking script tag and update `NEXT_PUBLIC_PROMOTEKIT_ID` env var
- [ ] **PromoteKit:** Get the affiliate signup portal URL and update `NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL` env var
- [ ] **PromoteKit:** Confirm with support that repeat one-time purchases from the same Stripe customer trigger recurring commissions
- [ ] **Vercel:** Add `NEXT_PUBLIC_PROMOTEKIT_ID`, `NEXT_PUBLIC_PROMOTEKIT_SIGNUP_URL`, and `STRIPE_PRICE_INVESTOR_1995` env vars to Vercel project settings
