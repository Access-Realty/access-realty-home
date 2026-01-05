# UTM Parameters

This document tracks UTM parameter usage across Access Realty marketing campaigns and lead attribution.

## Overview

UTM parameters are captured from landing page URLs and stored with lead records for attribution tracking. They flow through the system as follows:

1. User lands on marketing page with UTM params in URL
2. Params captured and stored in `leads` table
3. Forwarded through Stripe checkout to app
4. Used for analytics and lead source reporting

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
| `paid` | Generic paid traffic |

### utm_medium

Identifies the marketing medium or channel.

| Value | Description |
|-------|-------------|
| `email` | Email campaigns |
| `sms` | SMS/text message campaigns |
| `yard_sign` | Physical yard sign QR codes |
| `cpc` | Cost-per-click (paid search) |
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

### utm_term

Optional. Used for paid search keywords.

### utm_content

Identifies specific content or drip sequence.

| Value | Description |
|-------|-------------|
| `drip1` | Metroplex Homebuyers email drip - message 1 |
| `drip2` | Metroplex Homebuyers email drip - message 2 |
| `drip3` | Metroplex Homebuyers email drip - message 3 |

## Database Storage

### Marketing Site (`leads` table)

```sql
utm_source    TEXT
utm_medium    TEXT
utm_campaign  TEXT
utm_term      TEXT
utm_content   TEXT
gclid         TEXT  -- Google Ads click ID
fbclid        TEXT  -- Facebook click ID
landing_url   TEXT  -- Full landing URL with params
```

### App (`leads` table)

```sql
utm_source    TEXT
utm_medium    TEXT
utm_campaign  TEXT
utm_term      TEXT
utm_content   TEXT
```

## URL Examples

```
# Email campaign from Access Realty
https://access.realty/direct-list?utm_source=access&utm_medium=email&utm_campaign=ltfu

# SMS follow-up
https://access.realty/direct-list?utm_source=access&utm_medium=sms&utm_campaign=ltfu

# Yard sign QR codes
https://access.realty/dl → /direct-list?utm_source=access&utm_medium=yard_sign&utm_campaign=brand
https://access.realty/qr → /direct-list?utm_source=access&utm_medium=yard_sign&utm_campaign=brand

# Metroplex Homebuyers email drip campaigns
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_content=drip1
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_content=drip2
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=email&utm_campaign=2026_launch&utm_content=drip3

# Metroplex Homebuyers SMS campaign
https://access.realty/direct-list?utm_source=metroplex_homebuyers&utm_medium=sms&utm_campaign=2026_launch&utm_content=drip1

# Google Ads
https://access.realty/direct-list?utm_source=google&utm_medium=cpc&utm_campaign=sell-house-fast&gclid=xxx
```

## Related Files

- `app/(direct-list)/direct-list/get-started/page.tsx` - Captures UTM params from URL
- `app/api/leads/route.ts` - Stores UTM params in database
- `app/api/stripe/create-checkout-session/route.ts` - Forwards UTM params to app
- `MARKETING-HANDOFF.md` - Documents lead data flow
- `docs/STRIPE_MARKETING_INTEGRATION.md` - Stripe checkout UTM forwarding
