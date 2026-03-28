# Unified Investor Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate modal nesting on the investor page and persist vetting results + address to the lead record so the app can auto-create submissions.

**Architecture:** Two repos, sequential. App repo gets the migration + CRM config first (columns must exist before the marketing site writes to them). Marketing site gets the vetting upsert, leads PATCH endpoint, and modal rewrite.

**Tech Stack:** Next.js (marketing site), React/Vite (app), Supabase (Postgres), Stripe Embedded Checkout

**Spec:** `docs/superpowers/specs/2026-03-27-unified-investor-flow-design.md`

---

## Task 1: Migration — Add vetting columns to `leads` table

**Repo:** `access-realty-app` (`~/Documents/GitHub/access-realty-app`)

**Files:**
- Create: `supabase/migrations/YYYYMMDDHHMMSS_add_investor_vetting_columns.sql`

- [ ] **Step 1: Generate migration timestamp and create file**

```bash
cd ~/Documents/GitHub/access-realty-app
TIMESTAMP=$(date -u +"%Y%m%d%H%M%S")
cat > "supabase/migrations/${TIMESTAMP}_add_investor_vetting_columns.sql" << 'SQL'
-- ABOUTME: Add investor vetting result columns to leads table
-- ABOUTME: Stores pass/fail and reason from automated investor qualification check

ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_passed boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_reason text;
SQL
```

- [ ] **Step 2: Push migration to production**

```bash
npx supabase db push
```

Expected: Migration applies cleanly. Two new nullable columns on `leads`.

- [ ] **Step 3: Push migration to staging**

```bash
npx supabase db push --project-ref <staging-project-ref>
```

If staging ref is not configured, use the Supabase MCP `apply_migration` tool with the staging project ID.

- [ ] **Step 4: Apply to local Supabase**

```bash
npx supabase db reset
```

Or if local is already running and you don't want to reset:

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -d postgres -U postgres -c "
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_passed boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_reason text;
"
```

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/*_add_investor_vetting_columns.sql
git commit -m "schema: add investor_vetting_passed and investor_vetting_reason to leads"
git push origin main
```

---

## Task 2: CRM — Add vetting fields to leads detail view

**Repo:** `access-realty-app` (`~/Documents/GitHub/access-realty-app`)

**Files:**
- Modify: `src/config/modules/leads.ts`

- [ ] **Step 1: Add "Investor Vetting" section after "Lead Information"**

In `src/config/modules/leads.ts`, add a new section entry in the `sections` array after the `lead_info` section (after line 82):

```ts
    {
      key: 'investor_vetting',
      title: 'Investor Vetting',
      fields: [
        { key: 'investor_vetting_passed', label: 'Vetting Passed', type: 'boolean', editable: false },
        { key: 'investor_vetting_reason', label: 'Vetting Reason', type: 'text', editable: false },
      ],
    },
```

- [ ] **Step 2: Verify the CRM renders correctly**

Start the app (`npm run dev`), navigate to CRM → Leads → open any lead. Confirm:
- "Investor Vetting" section appears after "Lead Information"
- Both fields show as empty/null (no data yet)
- Fields are read-only

- [ ] **Step 3: Commit**

```bash
git add src/config/modules/leads.ts
git commit -m "feat(crm): add investor vetting fields to leads detail view"
git push origin main
```

---

## Task 3: Enable parcel upsert in investor vetting API

**Repo:** `access-realty-home` (`~/Documents/GitHub/access-realty-home`)

**Files:**
- Modify: `app/api/investor-vetting/route.ts`

- [ ] **Step 1: Add `upsert: true` to the parcel-lookup call**

In `app/api/investor-vetting/route.ts`, find the `fetch` call to `parcel-lookup` (around line 73) and add `upsert: true` to the request body:

Change:
```ts
      body: JSON.stringify({
        ...(address ? { address } : { street, city, state, zip }),
        // Intentionally omitting upsert: true — always fetch fresh from BatchData
      }),
```

To:
```ts
      body: JSON.stringify({
        ...(address ? { address } : { street, city, state, zip }),
        upsert: true,
      }),
```

Remove the comment about intentionally omitting upsert.

- [ ] **Step 2: Verify locally**

Start the dev server (`npm run dev`). Go to `/direct-list/investors`, click "Get Started", fill contact form, enter a real address for vetting. After vetting completes, check the `parcels` table in local Supabase — a row should exist for the looked-up address.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/api/investor-vetting/route.ts
git commit -m "feat: enable parcel upsert in investor vetting API"
```

---

## Task 4: Add PATCH handler to leads API

**Repo:** `access-realty-home` (`~/Documents/GitHub/access-realty-home`)

**Files:**
- Modify: `app/api/leads/route.ts`

- [ ] **Step 1: Add the PATCH export**

Add the following after the existing `POST` function in `app/api/leads/route.ts`:

```ts
// Fields allowed in PATCH updates (allowlist for safety)
const PATCHABLE_FIELDS = new Set([
  'street',
  'city',
  'state',
  'zip',
  'parcel_id',
  'investor_vetting_passed',
  'investor_vetting_reason',
]);

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, ...updates } = body;

    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    // Filter to allowed fields only
    const safeUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (PATCHABLE_FIELDS.has(key)) {
        safeUpdates[key] = value;
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('leads')
      .update(safeUpdates)
      .eq('id', leadId);

    if (error) {
      console.error('Lead PATCH error:', error);
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead PATCH API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Test locally with curl**

With the dev server running:

```bash
# First create a lead to get a leadId
LEAD_ID=$(curl -s -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Investor","email":"test-patch@example.com","phone":"8175551234"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin).get('leadId',''))")

echo "Lead ID: $LEAD_ID"

# Now PATCH it with vetting data
curl -s -X PATCH http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d "{\"leadId\":\"$LEAD_ID\",\"street\":\"123 Main St\",\"city\":\"Fort Worth\",\"state\":\"TX\",\"zip\":\"76102\",\"investor_vetting_passed\":true,\"investor_vetting_reason\":\"Entity ownership confirmed\"}"
```

Expected: `{"success":true}`. Verify in Supabase that the lead row has the address and vetting fields populated.

- [ ] **Step 3: Test disallowed fields are rejected**

```bash
curl -s -X PATCH http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d "{\"leadId\":\"$LEAD_ID\",\"email\":\"hacker@evil.com\",\"status\":\"converted\"}"
```

Expected: `{"error":"No valid fields to update"}` with status 400. The allowlist blocks `email` and `status`.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/api/leads/route.ts
git commit -m "feat: add PATCH handler to leads API for vetting enrichment"
```

---

## Task 5: Rewrite investor modal — embed checkout + persist vetting

**Repo:** `access-realty-home` (`~/Documents/GitHub/access-realty-home`)

**Files:**
- Modify: `app/(direct-list)/direct-list/investors/InvestorsContent.tsx`
- Modify: `components/direct-list/InvestorVettingFlow.tsx` (extend `onPass` callback to include parcel address data)

This is the largest task. It has three parts: update imports/state, wire up vetting persistence, and replace the checkout modal with inline Stripe.

- [ ] **Step 1: Update imports — remove EmbeddedCheckoutModal, add Stripe primitives**

Replace the import block (lines 9-17) with:

```tsx
import { HiCheck, HiChevronDown, HiXMark } from "react-icons/hi2";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useBrandPath } from "@/lib/BrandProvider";
import { StyledTierName } from "@/components/services/StyledTierName";
import { InvestorVettingFlow } from "@/components/direct-list/InvestorVettingFlow";
import { CalendlyBooking } from "@/components/calendly/CalendlyBooking";
import type { CalendlyBookingResult } from "@/components/calendly/types";
import { useTrackingParams } from "@/lib/useTrackingParams";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

- [ ] **Step 2: Update state — remove `showCheckout`, add checkout state**

Remove the `showCheckout` state variable. Add checkout state after the `eventTypeUri` line:

```tsx
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
```

- [ ] **Step 3: Add checkout fetch effect**

Add two effects after the existing `useEffect` blocks (before `const startFlow`):

```tsx
  // Fetch Stripe client secret when entering checkout step
  useEffect(() => {
    if (step !== "checkout" || clientSecret || checkoutLoading) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: "investor_service",
        source: "investors-page",
        leadId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create checkout session");
        return res.json();
      })
      .then((data) => {
        if (data.noPaymentRequired && data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("No client secret returned");
        }
      })
      .catch((err) => {
        setCheckoutError(
          err instanceof Error ? err.message : "Failed to load checkout"
        );
      })
      .finally(() => {
        setCheckoutLoading(false);
      });
  }, [step, clientSecret, checkoutLoading, leadId]);

  // Reset checkout state when leaving checkout step
  useEffect(() => {
    if (step !== "checkout") {
      setClientSecret(null);
      setCheckoutError(null);
      setCheckoutLoading(false);
    }
  }, [step]);
```

- [ ] **Step 4: Update vetting `onPass` — persist to lead and go to checkout**

Replace the `onPass` handler in the `InvestorVettingFlow` component (around line 581):

Change:
```tsx
                <InvestorVettingFlow
                  email={contactData.email}
                  onPass={(_parcelId, address) => {
                    setPropertyAddress(address);
                    setStep("checkout");
                  }}
                  onFail={(reason) => {
                    setVettingFailReason(reason);
                    setStep("vetting-reviewing");
                    setTimeout(() => setStep("vetting-failed"), 2500);
                  }}
                />
```

To:
```tsx
                <InvestorVettingFlow
                  email={contactData.email}
                  onPass={(parcelId, address) => {
                    setPropertyAddress(address);
                    // Persist address + vetting result to lead (best-effort)
                    if (leadId) {
                      fetch("/api/leads", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          leadId,
                          parcel_id: parcelId,
                          investor_vetting_passed: true,
                          investor_vetting_reason: "Automated vetting passed",
                        }),
                      }).catch(() => {
                        /* best-effort — don't block checkout */
                      });
                    }
                    setStep("checkout");
                  }}
                  onFail={(reason) => {
                    setVettingFailReason(reason);
                    // Persist fail result to lead (best-effort)
                    if (leadId) {
                      fetch("/api/leads", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          leadId,
                          investor_vetting_passed: false,
                          investor_vetting_reason: reason,
                        }),
                      }).catch(() => {});
                    }
                    setStep("vetting-reviewing");
                    setTimeout(() => setStep("vetting-failed"), 2500);
                  }}
                />
```

Note: The vetting API response includes `parcel.street_address`, `parcel.city`, `parcel.state`, `parcel.zip` — but the `InvestorVettingFlow` component only passes `parcelId` and `formattedAddress` to `onPass`. The address fields are already stored on the parcel record (via upsert from Task 3), so the lead's `parcel_id` FK is the primary link. To also populate the lead's address columns, we need to parse the formatted address or pass the parcel response through. For now, linking via `parcel_id` is sufficient — `enrichFromLead` in the app already reads address from the lead's `street`/`city`/`state`/`zip` columns.

To populate the lead's address columns, update the `InvestorVettingFlow` component's `onPass` callback type to also receive the parcel data. Modify `InvestorVettingFlow.tsx`:

In `InvestorVettingFlowProps`, change the `onPass` signature:
```tsx
  onPass: (parcelId: string, address: string, parcelData: { street_address?: string; city?: string; state?: string; zip?: string }) => void;
```

In the `handleAddressSelect` function, update the `onPass` call (around line 88):
```tsx
        onPass(data.parcel.parcel_id, addressData.formattedAddress, {
          street_address: data.parcel.street_address,
          city: data.parcel.city,
          state: data.parcel.state,
          zip: data.parcel.zip,
        });
```

Then back in `InvestorsContent.tsx`, update the `onPass` handler:
```tsx
                  onPass={(parcelId, address, parcelData) => {
                    setPropertyAddress(address);
                    if (leadId) {
                      fetch("/api/leads", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          leadId,
                          parcel_id: parcelId,
                          street: parcelData.street_address || undefined,
                          city: parcelData.city || undefined,
                          state: parcelData.state || undefined,
                          zip: parcelData.zip || undefined,
                          investor_vetting_passed: true,
                          investor_vetting_reason: "Automated vetting passed",
                        }),
                      }).catch(() => {});
                    }
                    setStep("checkout");
                  }}
```

- [ ] **Step 5: Update modal header for checkout step**

Change the header text for the `checkout` step (around line 383):

Change:
```tsx
                {step === "checkout" && "Investor Pricing Unlocked"}
```

To:
```tsx
                {step === "checkout" && "Checkout"}
```

- [ ] **Step 6: Widen modal for checkout step**

Change the modal container class (around line 374) to conditionally widen:

Change:
```tsx
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
```

To:
```tsx
          <div className={`relative bg-card rounded-xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col ${step === "checkout" ? "max-w-2xl" : "max-w-lg"}`}>
```

- [ ] **Step 7: Replace checkout step content with inline Stripe**

Replace the checkout step content block (around lines 632-655):

Change:
```tsx
              {/* Checkout */}
              {step === "checkout" && (
                <div className="text-center space-y-4 py-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                    <span className="text-green-700 font-semibold text-sm">
                      Qualified for Investor Pricing
                    </span>
                  </div>
                  {propertyAddress && (
                    <p className="text-sm font-medium text-foreground">
                      {propertyAddress}
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm">
                    You&apos;re all set to proceed with your listing.
                  </p>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
```

To:
```tsx
              {/* Checkout — Stripe Embedded Checkout rendered inline */}
              {step === "checkout" && (
                <div>
                  {checkoutError ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="text-red-600 mb-4 text-center">{checkoutError}</div>
                      <button
                        onClick={() => {
                          setCheckoutError(null);
                          setClientSecret(null);
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : checkoutLoading || !clientSecret ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                      <p className="text-muted-foreground">Loading checkout...</p>
                    </div>
                  ) : (
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  )}
                </div>
              )}
```

- [ ] **Step 8: Remove the `EmbeddedCheckoutModal` at the bottom of the component**

Delete the `EmbeddedCheckoutModal` usage (around lines 727-734):

```tsx
      {/* Checkout Modal */}
      <EmbeddedCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan="investor_service"
        planName="Investor"
        source="investors-page"
        leadId={leadId || undefined}
      />
```

Remove these lines entirely.

- [ ] **Step 9: Build check**

```bash
npm run build
```

Expected: Build succeeds. No TypeScript errors.

- [ ] **Step 10: Visual test**

Start dev server (`npm run dev`). Navigate to `http://localhost:4000/direct-list/investors`.

Test the full flow:
1. Click "Get Started" → contact form modal opens
2. Fill name/email/phone → "Continue"
3. Enter a property address → vetting runs
4. If vetting passes → Stripe checkout renders **inline in the same modal** (no second modal). Modal widens.
5. Enter promo code / card details → Pay
6. Redirects to app

Verify:
- No modal-on-modal at any point
- No "Complete Your Investor Purchase" header
- No "Qualified for Investor Pricing" interstitial
- Modal widens smoothly for checkout step
- Stripe "Add code" promo code field is visible

- [ ] **Step 11: Commit**

```bash
git add app/\(direct-list\)/direct-list/investors/InvestorsContent.tsx
git add components/direct-list/InvestorVettingFlow.tsx
git commit -m "feat: embed checkout inline in investor modal, persist vetting to lead

- Remove EmbeddedCheckoutModal (eliminates modal nesting)
- Render Stripe EmbeddedCheckout directly in flow modal
- Skip 'Qualified for Investor Pricing' interstitial
- PATCH lead with address, parcel_id, and vetting result after vetting
- Widen modal for checkout step"
```

---

## Task 6: Final push and verify

**Repo:** `access-realty-home` (`~/Documents/GitHub/access-realty-home`)

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Verify Vercel deployment**

Check that the Vercel deployment succeeds. The marketing site auto-deploys on push to main.

- [ ] **Step 3: Smoke test on production**

Navigate to `https://direct-list.com/investors` (or `https://access.realty/direct-list/investors`). Click "Get Started" and verify the modal flow works without nesting.
