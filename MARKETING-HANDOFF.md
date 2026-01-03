# Marketing Site → App Handoff

This document describes how lead and property data flows from the marketing site to the app after a user completes the DirectList get-started wizard.

## Overview

The get-started wizard (`/direct-list/get-started`) collects property and contact info before checkout. After successful payment, the user is redirected to the app with URL parameters that allow the app to fetch the lead data and pre-populate the submission form.

## Wizard Flow

| Step | What Happens | Data Collected |
|------|--------------|----------------|
| 1. Address | Google Places autocomplete + map | Address components, lat/lng |
| 2. Confirm | BatchData lookup, user edits specs | Parcel ID, property specs |
| 3. Contact | User enters contact info | Name, email, phone |
| 4. Service | User selects tier, accepts terms | Service tier selection |
| 5. Checkout | Stripe embedded checkout | Payment confirmation |

## URL Parameters Passed to App

After successful checkout, user is redirected to:

```
https://app.access.realty/?stripe_session_id={CHECKOUT_SESSION_ID}&tier=direct_list&lead_id=abc-123&ref=get-started
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `stripe_session_id` | Stripe checkout session ID (template replaced by Stripe) | `cs_live_a1b2c3...` |
| `tier` | Service tier selected | `direct_list`, `direct_list_plus`, `full_service` |
| `lead_id` | UUID of lead record in shared database | `b7580e28-e6f1-40e1-b8dd-6d82e34ffdfe` |
| `ref` | Source page for attribution | `get-started` |
| `utm_source` | UTM source (if present) | `google` |
| `utm_medium` | UTM medium (if present) | `cpc` |
| `utm_campaign` | UTM campaign (if present) | `directlist-launch` |

## Stripe Session Metadata

The Stripe checkout session also includes metadata for redundancy:

```json
{
  "plan": "direct-list",
  "source": "get-started",
  "created_from": "marketing-site",
  "lead_id": "b7580e28-e6f1-40e1-b8dd-6d82e34ffdfe",
  "bedrooms": "4",
  "full_bathrooms": "2",
  "half_bathrooms": "1",
  "year_built": "2005",
  "square_feet": "2400",
  "utm_source": "google",
  "utm_medium": "cpc"
}
```

Note: Property specs in metadata are user-reported values (may differ from parcel data if user edited them).

## Database Tables

Both repos share the same Supabase database. The marketing site writes to:

### `leads` table

Created via `POST /api/leads` when user submits contact form.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key (this is the `lead_id` passed to app) |
| `first_name` | text | User's first name |
| `last_name` | text | User's last name |
| `email` | text | User's email |
| `phone` | text | User's phone (digits only) |
| `street` | text | Street address |
| `city` | text | City |
| `state` | text | State (2-letter) |
| `zip` | text | ZIP code |
| `parcel_id` | uuid | FK to `parcels` table |
| `source` | text | Lead source (`website`, `paid_search`, `social_media`) |
| `landing_url` | text | Full URL user landed on |
| `gclid` | text | Google Ads click ID |
| `fbclid` | text | Facebook click ID |
| `utm_source` | text | UTM source |
| `utm_medium` | text | UTM medium |
| `utm_campaign` | text | UTM campaign |
| `created_at` | timestamp | When lead was created |

### `parcels` table

Created via Edge Function (`parcel-lookup`) when user confirms address. Contains BatchData property info.

| Column | Type | Description |
|--------|------|-------------|
| `parcel_id` | uuid | Primary key |
| `address_hash` | text | Hash for deduplication |
| `street_address` | text | Street address |
| `city` | text | City |
| `state` | text | State |
| `zip` | text | ZIP |
| `latitude` | float | Latitude |
| `longitude` | float | Longitude |
| `bedrooms` | int | Bedroom count |
| `bathrooms_full` | int | Full bathroom count |
| `bathrooms_total` | float | Total bathrooms (e.g., 2.5) |
| `living_area_sqft` | int | Square footage |
| `year_built` | int | Year built |
| `stories` | int | Number of stories |
| `lot_size_acres` | float | Lot size in acres |
| `avm_value` | int | Automated valuation |
| `property_type_detail` | text | Property type from BatchData |
| `subdivision` | text | Subdivision name |

## App Integration

### Fetching Lead Data

When app detects `lead_id` in URL params:

```typescript
const leadId = searchParams.get('lead_id');

if (leadId) {
  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      parcels (*)
    `)
    .eq('id', leadId)
    .single();

  // lead.first_name, lead.email, etc.
  // lead.parcels.bedrooms, lead.parcels.living_area_sqft, etc.
}
```

### Pre-populating Submission Form

With lead data, the app can:

1. **Skip address entry** - Already have full address from `leads` + `parcels`
2. **Pre-fill property specs** - Use parcel data as defaults
3. **Pre-fill contact info** - Name, email, phone from lead
4. **Apply user edits** - Stripe metadata contains user-edited specs (if different from parcel)

### Priority for Property Specs

1. Stripe metadata (user-edited values) - highest priority
2. Parcel data (BatchData values) - fallback
3. User input in app - if neither available

## Environment Detection

The marketing site detects environment to redirect to correct app:

| Marketing Site | App Redirect |
|----------------|--------------|
| `localhost:4000` | `localhost:3000` |
| `*.vercel.app` (preview) | `preview.access.realty` |
| `access.realty` (prod) | `app.access.realty` |

See `app/api/stripe/create-checkout-session/route.ts` → `getAppUrl()`.

## Testing

Test script in app repo: `scripts/test-marketing-handoff.mjs`

To test the full flow:
1. Go to `localhost:4000/direct-list/get-started`
2. Enter address, confirm specs, enter contact info
3. Select tier, accept terms, complete Stripe test payment
4. Verify redirect to app with `lead_id` param
5. Verify app can fetch lead + parcel data

## Related Files

### Marketing Site (this repo)
- `app/(direct-list)/direct-list/get-started/page.tsx` - Wizard UI
- `app/api/leads/route.ts` - Lead creation endpoint
- `app/api/stripe/create-checkout-session/route.ts` - Checkout + redirect URL
- `lib/propertyLookup.ts` - BatchData lookup client

### App Repo
- `scripts/test-marketing-handoff.mjs` - Puppeteer test
- (TBD) Handoff handling in onboarding flow
