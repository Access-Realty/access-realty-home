# Unified Investor Flow

## Problem

The investor page (`/direct-list/investors`) has two UX issues:

1. **Modal nesting** — After vetting passes, clicking "Proceed to Checkout" opens `EmbeddedCheckoutModal` on top of the investor flow modal. Two backdrops, two close buttons, two scroll contexts.

2. **Data loss** — Vetting captures a property address and parcel ID, then discards both. The lead record is created with only contact info. When the investor arrives at the app, they must re-enter their address during the submission flow.

The non-investor DirectList get-started flow does not have these problems. It stores address + parcel on the lead at creation time, and checkout happens in a single modal.

## Design

### Overview

Five changes across two repos:

| Change | Repo | Files |
|--------|------|-------|
| Add `investor_vetting_passed` and `investor_vetting_reason` columns | access-realty-app | New migration |
| Add "Investor Vetting" section to CRM leads view | access-realty-app | `src/config/modules/leads.ts` |
| Enable parcel upsert in investor vetting API | access-realty-home | `app/api/investor-vetting/route.ts` |
| Add PATCH handler to leads API | access-realty-home | `app/api/leads/route.ts` |
| Embed checkout inline + persist vetting results | access-realty-home | `app/(direct-list)/direct-list/investors/InvestorsContent.tsx` |

### 1. Migration: Add vetting columns to `leads`

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_passed boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS investor_vetting_reason text;
```

Both nullable. No constraints, no defaults. Only populated for investor leads that go through the self-service vetting flow.

Commit on main, push to staging and local.

### 2. CRM: Add vetting fields to leads detail view

Add an "Investor Vetting" section to `leadsConfig.sections` after "Lead Information":

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

Read-only. Staff sees whether the investor was auto-qualified or needs manual review.

### 3. Investor vetting API: Enable parcel upsert

In `app/api/investor-vetting/route.ts`, add `upsert: true` to the parcel-lookup Edge Function call:

```ts
body: JSON.stringify({
  ...(address ? { address } : { street, city, state, zip }),
  upsert: true,  // Save parcel to DB for lead linkage
}),
```

The vetting endpoint already fetches fresh BatchData. Adding upsert persists that fresh data to the `parcels` table so the `parcel_id` FK on the lead points to a real row.

### 4. Leads API: Add PATCH handler

Add a `PATCH` export to `app/api/leads/route.ts`. Accepts:

```ts
{
  leadId: string;           // Required — which lead to update
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  parcel_id?: string;       // UUID FK to parcels table
  investor_vetting_passed?: boolean;
  investor_vetting_reason?: string;
}
```

Allowlisted fields only — the PATCH handler rejects any fields not in the allowlist. Uses service role (same as the POST handler) to bypass RLS.

This follows the repo boundary principle: the marketing site creates and enriches leads; the app repo manages converted clients.

### 5. Investor modal: Embed checkout + persist vetting results

#### After vetting passes:

1. Call `PATCH /api/leads` with:
   - `leadId` (from lead creation in step 1)
   - Address fields from the vetting response (`street_address`, `city`, `state`, `zip`)
   - `parcel_id` from the vetting response
   - `investor_vetting_passed: true`
   - `investor_vetting_reason` (e.g., "Entity ownership confirmed")

2. Transition to checkout step — render `EmbeddedCheckoutProvider` + `EmbeddedCheckout` directly in the flow modal content area. No separate `EmbeddedCheckoutModal`. No "Qualified for Investor Pricing" interstitial.

3. Widen modal from `max-w-lg` to `max-w-2xl` for the checkout step.

#### After vetting fails:

1. Call `PATCH /api/leads` with:
   - `leadId`
   - `investor_vetting_passed: false`
   - `investor_vetting_reason` (e.g., "Homestead exemption detected")
   - Address fields (still useful for staff context)
   - `parcel_id` (if the lookup found a parcel)

2. Show the existing failure UI (explanation + "Schedule a Call" / "Try a different address").

#### Modal header per step:

| Step | Header |
|------|--------|
| `contact` | "Get Started" |
| `creating-lead` | "Get Started" |
| `vetting` | "Property Details" |
| `vetting-reviewing` | "Reviewing Property" |
| `vetting-failed` | "Verification Needed" |
| `checkout` | "Checkout" |
| `booking` | "Schedule a Call" |
| `success` | "You're All Set" |

#### Stripe checkout setup:

Fetch client secret from `POST /api/stripe/create-checkout-session` with `plan: "investor_service"`, `source: "investors-page"`, `leadId`. Render `EmbeddedCheckout` in the modal body. No extra heading, no "Complete Your Investor Purchase" text.

On checkout completion, Stripe redirects to the app via `return_url` (unchanged behavior).

#### Removed:

- `EmbeddedCheckoutModal` import and usage
- `showCheckout` state variable
- "Qualified for Investor Pricing" interstitial step
- "Proceed to Checkout" button

### Data flow after changes

```
Landing page → "Get Started"
  │
  ├─ Contact form (modal opens)
  │   └─ POST /api/leads → lead created (contact info only)
  │
  ├─ Vetting (same modal)
  │   └─ POST /api/investor-vetting → parcel upserted, vetting evaluated
  │       └─ PATCH /api/leads → address, parcel_id, vetting result written to lead
  │
  ├─ Checkout (same modal, widened)
  │   └─ Stripe Embedded Checkout renders inline
  │       └─ On complete → redirect to app with stripe_session_id + tier + lead_id
  │
  └─ App signup
      └─ enrichFromLead → pulls address, name, email, phone from lead
      └─ resolveOnboardingClientType → derives client_type from tier
      └─ useLeadConversion → auto-creates submission with address pre-filled
```

## Edge cases

These match the existing non-investor DirectList get-started flow behavior. Neither flow has session recovery or smart deduplication today.

### Duplicate leads

The DB has a unique constraint on `leads.email`. The POST handler catches the `23505` error and returns a 409 "already registered" message. The investor flow should surface this error the same way the non-investor flow does.

### Page reload mid-flow

`leadId` is React state — lost on refresh. The modal resets to the landing page. This matches the non-investor flow, which also stores `leadId` only in React state.

### PATCH failure after vetting

Best-effort. Don't block checkout on the PATCH result. The app-side flow still works via URL params (`tier`, `stripe_session_id`). If the lead update fails, staff can still see the lead with contact info.

### Checkout abandonment

No special handling. The lead persists with vetting data and address. Staff can see it in the CRM and follow up. Stripe session expires after 24 hours.

### Multiple vetting attempts with different addresses

Each PATCH overwrites the previous address/vetting data on the lead. The lead reflects the most recent property. Previous parcels remain in the `parcels` table (harmless).

### Browser back/forward

Modal steps are React state, not URL history. Browser back navigates away from the page. Same as non-investor flow.

## Out of scope

- Changing the staff-initiated invitation path (CRM → invite → signup). It continues to work via `invited_client_type` / `invited_service_tier` on the lead.
- Updating the investor journey doc (`client-journeys/investor.md`). Tracked as a separate task.
- Changing vetting logic (homestead detection, entity ownership, acquisition recency).
