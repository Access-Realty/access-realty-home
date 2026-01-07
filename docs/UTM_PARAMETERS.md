# UTM Parameters

This document tracks UTM parameter usage across Access Realty marketing campaigns and lead attribution.

## Overview

UTM parameters are captured from landing page URLs and stored with lead records for attribution tracking. They flow through the system as follows:

1. User lands on marketing page with UTM params in URL
2. Params captured and stored in `leads` table
3. Forwarded through Stripe checkout to app
4. Used for analytics and lead source reporting

## Attribution Model

Access Realty uses **first-touch attribution** to answer the core business question: "Where should we spend our next marketing dollar?"

### Campaign Types

Every campaign falls into one of three types, identified by `utm_term`:

| utm_term | Purpose | First-touch eligible? | Examples |
|----------|---------|----------------------|----------|
| `prospecting` | Cold traffic, new audiences | Yes | Google Ads, Facebook prospecting, SMS blasts, direct mail, yard signs |
| `remarketing` | Retargeting site visitors who didn't convert to lead | No | Google/Facebook retargeting ads |
| `nurture` | Follow-up sequences for existing leads | No | Email drips, SMS follow-ups, LTFU campaigns |

### Attribution Logic

```javascript
// When processing UTM params on lead record
const campaignType = utm_term // 'prospecting', 'remarketing', 'nurture', or keyword
const isNurtureOrRemarketing = ['nurture', 'remarketing'].includes(campaignType)

if (!lead.original_source && !isNurtureOrRemarketing) {
  // Only set first touch for prospecting traffic on new leads
  lead.original_source = utm_source
  lead.original_medium = utm_medium
  lead.original_campaign = utm_campaign
  lead.original_term = utm_term
  lead.original_content = utm_content
  lead.original_touch_at = now()
}

// Always update current UTM fields (latest touch)
lead.utm_source = utm_source
lead.utm_medium = utm_medium
lead.utm_campaign = utm_campaign
lead.utm_term = utm_term
lead.utm_content = utm_content

// Track converting touch when they actually convert
if (is_conversion_event) {
  lead.converting_source = utm_source
  lead.converting_medium = utm_medium
  lead.converting_campaign = utm_campaign
  lead.converting_term = utm_term
  lead.converted_at = now()
}
```

### Why This Matters

- **Remarketing** only exists because a prospecting channel got someone to the site first. Credit goes to the originator.
- **Nurture sequences** work on leads you already have. They measure sales effectiveness, not marketing acquisition.
- **First-touch protection** ensures email/SMS follow-ups don't steal credit from the campaigns that actually generated the lead.

### Field Naming Convention

Following industry standards (HubSpot, Marketo, Salesforce), attribution fields use the *concept* name (`source`, `medium`, `campaign`) rather than the URL parameter name (`utm_source`, `utm_medium`, `utm_campaign`):

| Touchpoint | Field Prefix | Example |
|------------|--------------|---------|
| First touch | `original_` | `original_source`, `original_medium` |
| Latest touch | `utm_` | `utm_source`, `utm_medium` (existing fields) |
| Converting touch | `converting_` | `converting_source`, `converting_medium` |

## Parameter Values

### utm_source

Identifies the traffic source or referring partner.

| Value | Description |
|-------|-------------|
| `access` | Direct Access Realty marketing |
| `metroplex_homebuyers` | Metroplex Homebuyers partner referrals |
| `google` | Google Ads |
| `facebook` | Facebook/Meta Ads |
| `organic` | Organic search (SEO landers) |

### utm_medium

Identifies the marketing medium or channel.

| Value | Description |
|-------|-------------|
| `email` | Email campaigns |
| `sms` | SMS/text message campaigns |
| `yard_sign` | Physical yard sign QR codes |
| `direct_mail` | Physical direct mail pieces |
| `cpc` | Cost-per-click (paid search/social) |
| `seo` | Organic search |
| `social` | Social media organic |
| `referral` | Partner referrals |

### utm_campaign

Identifies the specific campaign or promotion.

| Value | Description |
|-------|-------------|
| `ltfu` | Long-term follow-up nurture campaign |
| `directlist-launch` | DirectList product launch |
| `sell-house-fast` | Motivated seller campaign |
| `brand` | Yard sign QR codes (/dl, /qr) |
| `2026_launch` | Metroplex Homebuyers partner campaigns |
| `absentee-owner` | Absentee owner prospecting |
| `probate` | Probate list prospecting |

### utm_term

Identifies the campaign type for attribution purposes. Also used for paid search keywords.

| Value | Description | First-touch eligible? |
|-------|-------------|----------------------|
| `prospecting` | Cold traffic, new audience acquisition | Yes |
| `remarketing` | Retargeting website visitors | No |
| `nurture` | Existing lead follow-up sequences | No |
| (keyword) | Paid search keyword (defaults to prospecting) | Yes |

### utm_content

Identifies specific content variation or sequence position.

| Value | Description |
|-------|-------------|
| `drip1` | Email/SMS drip sequence - message 1 |
| `drip2` | Email/SMS drip sequence - message 2 |
| `drip3` | Email/SMS drip sequence - message 3 |
| `v1`, `v2` | Creative variations for A/B testing |

## URL Examples by Campaign Type

### Prospecting (First-touch eligible)

```
# Yard sign QR codes
https://access.realty/dl → /direct-list?utm_source=access&utm_medium=yard_sign&utm_campaign=brand&utm_term=prospecting

# Google Ads - cold search
https://access.realty/direct-list?utm_source=google&utm_medium=cpc&utm_campaign=sell-house-fast&utm_term=sell+house+fast+texas&gclid=xxx

# Facebook Ads - cold prospecting
https://access.realty/direct-list?utm_source=facebook&utm_medium=cpc&utm_campaign=directlist-launch&utm_term=prospecting&fbclid=xxx

# SMS blast to purchased list
https://access.realty/direct-list?utm_source=access&utm_medium=sms&utm_campaign=absentee-owner&utm_term=prospecting

# Direct mail piece
https://access.realty/direct-list?utm_source=access&utm_medium=direct_mail&utm_campaign=probate&utm_term=prospecting
```

### Remarketing (Not first-touch eligible)

```
# Google retargeting - visited site but didn't convert
https://access.realty/direct-list?utm_source=google&utm_medium=cpc&utm_campaign=sell-house-fast&utm_term=remarketing&gclid=xxx

# Facebook retargeting - visited site but didn't convert
https://access.realty/direct-list?utm_source=facebook&utm_medium=cpc&utm_campaign=directlist-launch&utm_term=remarketing&fbclid=xxx
```

### Nurture (Not first-touch eligible)

```
# Access Realty LTFU email sequence
https://access.realty/direct-list?utm_source=access&utm_medium=email&utm_campaign=ltfu&utm_term=nurture

# Access Realty LTFU SMS sequence
https://access.realty/direct-list?utm_source=access&utm_medium=sms&utm_campaign=ltfu&utm_term=nurture

# Metroplex Homebuyers email drip (existing leads)
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_term=nurture&utm_content=drip1
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_term=nurture&utm_content=drip2
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_term=nurture&utm_content=drip3

# Metroplex Homebuyers SMS drip (existing leads)
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=sms&utm_campaign=2026_launch&utm_term=nurture&utm_content=drip1
```

## Short Links & Redirects

These short URLs are used in marketing materials. Each serves OG meta tags for link previews before client-side redirecting.

| Short URL | Destination | UTM Parameters | Use Case |
|-----------|-------------|----------------|----------|
| `access.realty/dl` | `/direct-list` | `utm_source=access&utm_medium=yard_sign&utm_campaign=brand&utm_term=prospecting` | DirectList yard sign QR code |
| `access.realty/qr` | `/direct-list` | `utm_source=access&utm_medium=yard_sign&utm_campaign=brand&utm_term=prospecting` | Access Realty yard sign QR code |
| `direct-list.com/s` | `/direct-list` | `utm_source=metroplex_homebuyers&utm_medium=sms&utm_campaign=2026_launch&utm_term=nurture&utm_content=drip1` | Metroplex Homebuyers SMS campaign |

### Implementation

Each short link has:
- `app/{path}/page.tsx` - Server component with OG metadata
- `app/{path}/redirect-client.tsx` - Client component that redirects after page renders

This pattern ensures social platforms/SMS apps can scrape OG tags before the redirect occurs.

## Database Schema

### Marketing Site (`leads` table)

```sql
-- First touch (set once, protected from overwrite)
-- Named without utm_ prefix per industry convention (HubSpot, Marketo, Salesforce)
original_source       TEXT
original_medium       TEXT
original_campaign     TEXT
original_term         TEXT
original_content      TEXT
original_touch_at     TIMESTAMPTZ

-- Latest touch (existing fields, updated on every visit)
utm_source            TEXT
utm_medium            TEXT
utm_campaign          TEXT
utm_term              TEXT
utm_content           TEXT

-- Converting touch (set when lead converts to client)
converting_source     TEXT
converting_medium     TEXT
converting_campaign   TEXT
converting_term       TEXT
converted_at          TIMESTAMPTZ

-- Click IDs
gclid                 TEXT  -- Google Ads click ID
fbclid                TEXT  -- Facebook click ID

-- Context
landing_url           TEXT  -- Full landing URL with params
```

### Migration

To add attribution fields to existing schema:

```sql
-- Add first-touch fields
ALTER TABLE leads
  ADD COLUMN original_source TEXT,
  ADD COLUMN original_medium TEXT,
  ADD COLUMN original_campaign TEXT,
  ADD COLUMN original_term TEXT,
  ADD COLUMN original_content TEXT,
  ADD COLUMN original_touch_at TIMESTAMPTZ;

-- Add converting-touch fields
ALTER TABLE leads
  ADD COLUMN converting_source TEXT,
  ADD COLUMN converting_medium TEXT,
  ADD COLUMN converting_campaign TEXT,
  ADD COLUMN converting_term TEXT,
  ADD COLUMN converted_at TIMESTAMPTZ;

-- Backfill original_* from utm_* for existing leads (one-time)
UPDATE leads
SET
  original_source = utm_source,
  original_medium = utm_medium,
  original_campaign = utm_campaign,
  original_term = utm_term,
  original_content = utm_content,
  original_touch_at = created_at
WHERE original_source IS NULL;
```

### App (`leads` table)

```sql
-- Forwarded from marketing site via Stripe checkout
utm_source            TEXT
utm_medium            TEXT
utm_campaign          TEXT
utm_term              TEXT
utm_content           TEXT
```

## Reporting

### Attribution Report (Marketing Spend Decisions)

Groups by `original_source` and `original_medium`:

| Source | Medium | Leads | Clients | Conv Rate | Remarketing Dependency |
|--------|--------|-------|---------|-----------|------------------------|
| access | sms | 50 | 12 | 24% | 36% |
| access | direct_mail | 40 | 11 | 28% | 30% |
| organic | seo | 60 | 9 | 15% | 58% |
| google | cpc | 35 | 5 | 14% | 60% |
| facebook | cpc | 25 | 3 | 12% | 68% |

*Remarketing Dependency = % of conversions where `converting_term = 'remarketing'`*

### Nurture Effectiveness Report (Sales Process Decisions)

For leads where `converting_term = 'nurture'`:

| Nurture Campaign | Conversions | Avg Days to Convert | Avg Touches |
|------------------|-------------|---------------------|-------------|
| ltfu (email) | 23 | 45 | 6.2 |
| ltfu (sms) | 18 | 32 | 4.1 |
| 2026_launch | 12 | 28 | 3.8 |

## Related Files

### Core Tracking

- `lib/tracking.ts` - Core tracking utility with attribution logic
- `lib/useTrackingParams.ts` - React hook for forms to consume tracking data
- `components/TrackingCapture.tsx` - Site-wide component that captures UTM params on page load

### Forms & APIs

- `app/(direct-list)/direct-list/get-started/page.tsx` - DirectList wizard, submits multi-touch attribution
- `app/api/leads/route.ts` - Stores UTM params in database with multi-touch support
- `components/solutions/ProgramInquiryModal.tsx` - Program inquiry form with attribution
- `app/api/program-inquiry/route.ts` - Sends Slack notification with attribution

### Checkout & Handoff

- `app/api/stripe/create-checkout-session/route.ts` - Forwards UTM params to app
- `MARKETING-HANDOFF.md` - Documents lead data flow
- `docs/STRIPE_MARKETING_INTEGRATION.md` - Stripe checkout UTM forwarding

### Short Links

- `app/dl/` - DirectList yard sign short link redirect
- `app/qr/` - Access Realty yard sign short link redirect
- `app/s/` - Metroplex SMS campaign short link redirect (direct-list.com/s)
