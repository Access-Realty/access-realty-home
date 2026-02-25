# Marketing Site → App Handoff

> **Maintainers:** This document describes the data contract between the marketing site and the app. If you modify the `leads` or `parcels` table schema, API request/response formats, URL parameters, or Stripe metadata, update this document to keep both repos in sync.

This document describes how lead and property data flows from the marketing site to the app. There are two main lead capture flows:

1. **DirectList Wizard** - Full checkout flow with Stripe payment → redirect to app
2. **Solution Inquiries** - Contact form + Calendly booking (Price Launch, Equity Bridge, Uplist, Seller Finance)

Both flows write to the shared `leads` table in Supabase.

---

## DirectList Wizard Flow

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
https://access.realty/app?stripe_session_id={CHECKOUT_SESSION_ID}&tier=direct_list&lead_id=abc-123&ref=get-started
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
| `*.vercel.app` (preview) | `staging.access.realty/app` |
| `access.realty` (prod) | `access.realty/app` |

See `app/api/stripe/create-checkout-session/route.ts` → `getAppUrl()`.

## Testing

Test script in app repo: `scripts/test-marketing-handoff.mjs`

To test the full flow:
1. Go to `localhost:4000/direct-list/get-started`
2. Enter address, confirm specs, enter contact info
3. Select tier, accept terms, complete Stripe test payment
4. Verify redirect to app with `lead_id` param
5. Verify app can fetch lead + parcel data

---

## Solution Inquiry Leads

Solution pages (Price Launch, Equity Bridge, Uplist, Seller Finance) capture leads through a contact form + Calendly booking flow. Unlike DirectList which redirects to the app after payment, these inquiries stay on the marketing site and schedule a consultation call.

### Flow Overview

| Step | What Happens | Data Collected |
|------|--------------|----------------|
| 1. Address | User enters property address | Address components |
| 2. Qualify Click | Opens ProgramInquiryModal | - |
| 3. Contact Form | User enters contact info | Name, email, phone |
| 4. Lead Creation | POST to `/api/leads` | Lead record in DB |
| 5. Slack Notification | POST to `/api/program-inquiry` | Team notified |
| 6. Calendly Booking | User selects appointment time | Meeting scheduled |

### Data Flow

```
┌─────────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Solution Page      │     │  /api/leads     │     │  Supabase       │
│  (Price Launch,     │────>│                 │────>│  leads table    │
│   Equity Bridge,    │     └─────────────────┘     └─────────────────┘
│   Uplist, etc.)     │
│                     │     ┌─────────────────┐     ┌─────────────────┐
│  ProgramInquiry     │────>│  /api/program-  │────>│  Slack          │
│  Modal              │     │  inquiry        │     │  #needs-attn    │
└─────────────────────┘     └─────────────────┘     └─────────────────┘
         │
         │                  ┌─────────────────┐
         └─────────────────>│  Calendly       │
                            │  Booking        │
                            └─────────────────┘
```

### Contact Form Data

The `ProgramInquiryModal` collects:

| Field | Required | Notes |
|-------|----------|-------|
| First Name | Yes | |
| Last Name | Yes | |
| Email | Yes | Validated format |
| Phone | Yes | Auto-formatted as (555) 123-4567 |

Plus the address data passed from the solution page.

### Lead Creation (`POST /api/leads`)

```typescript
// Request body
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  source: "website";
  landingUrl: string;
  // Multi-touch attribution
  originalTouch?: TouchParams;
  latestTouch?: TouchParams;
  convertingTouch?: TouchParams;
}

// Response
{
  success: true,
  leadId: "uuid-here"
}
```

### Multi-Touch Attribution

Solution inquiries track the user's journey across multiple sessions:

| Touch Type | Purpose | Example |
|------------|---------|---------|
| `originalTouch` | First interaction with site | Google Ads click from 2 weeks ago |
| `latestTouch` | Most recent session before conversion | Direct visit today |
| `convertingTouch` | Params at form submission | Current page URL |

Attribution params stored:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `gclid` (Google Ads), `fbclid` (Facebook)
- `landing_url`, `captured_at`

### Slack Notification (`POST /api/program-inquiry`)

Sends immediate notification to `#needs-attention` channel:

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programName: string;  // "Price Launch", "Equity Bridge", etc.
  address: string;
  attribution?: {
    originalTouch: string | null;  // "google/cpc/campaign-name"
    latestTouch: string | null;
  };
}
```

### Calendly Integration

After lead creation, the modal shows an embedded Calendly widget:

- Event type configured via `NEXT_PUBLIC_CALENDLY_INQUIRIES_URI`
- Pre-fills invitee name, email, phone from form
- Passes `leadId` and `programSource` as custom fields
- On successful booking, shows confirmation message

### Solution Pages Using This Flow

| Solution | Page Path | programSlug |
|----------|-----------|-------------|
| Price Launch | `/solutions/price-launch` | `price_launch` |
| Equity Bridge | `/solutions/equity-bridge` | `equity_bridge` |
| Uplist | `/solutions/uplist` | `uplist` |
| Seller Finance | `/solutions/seller-finance` | `seller_finance` |

---

## Related Files

### Marketing Site (this repo)

**DirectList Wizard:**
- `app/(direct-list)/direct-list/get-started/page.tsx` - Wizard UI
- `app/api/stripe/create-checkout-session/route.ts` - Checkout + redirect URL
- `lib/propertyLookup.ts` - BatchData lookup client

**Solution Inquiries:**
- `components/solutions/ProgramInquiryModal.tsx` - Contact form + Calendly modal
- `app/api/program-inquiry/route.ts` - Slack notification endpoint
- `components/calendly/CalendlyBooking.tsx` - Calendly embed component
- `lib/useTrackingParams.ts` - Multi-touch attribution hook

**Shared:**
- `app/api/leads/route.ts` - Lead creation endpoint (used by both flows)

### App Repo
- `scripts/test-marketing-handoff.mjs` - Puppeteer test
- (TBD) Handoff handling in onboarding flow
