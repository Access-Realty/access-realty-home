# Access Realty - Marketing Site

Marketing website for Access Realty, deployed at [access.realty](https://access.realty).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Database:** Supabase (for lead capture forms)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages to Build

### Priority 1 - Core Pages

| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ Basic | Homepage - hero, features, CTAs |
| `/how-it-works` | ❌ TODO | Step-by-step process explanation |
| `/services` | ❌ TODO | Service tier comparison (see below) |
| `/privacy` | ✅ Done | Privacy Policy |
| `/terms` | ✅ Done | Terms of Service |

### Priority 2 - Staff Pages

| Route | Status | Description |
|-------|--------|-------------|
| `/staff` | ❌ TODO | Staff directory/landing |
| `/staff/[slug]` | ❌ TODO | Individual staff bio pages |

### Priority 3 - Landing Pages (Future)

Marketing landing pages for paid ads:
- `/sell-house-fast`
- `/cash-offer`
- `/fast-closing`
- etc.

---

## Services Page - Pricing Data

Three service tiers to display in a comparison table:

### Direct List - $2,995
- **Upfront:** $495
- **Badge:** None

### Direct List + - $4,495
- **Upfront:** $995
- **Badge:** "BEST VALUE"

### Full Service - 3%
- **Upfront:** No upfront payment
- **Badge:** "MOST POPULAR"

### Feature Comparison

| Feature | Direct List | Direct List + | Full Service |
|---------|-------------|---------------|--------------|
| On-Site Evaluation | $199 | $199 | ✓ |
| Market Assessment | Monthly Video | Bi-Weekly Video | Weekly Meeting |
| On Market Consultation | $99 | $99 | ✓ |
| Feedback Requests | — | ✓ | ✓ |
| Listing Description | Self-Written | ✓ | ✓ |
| Virtual Walkthrough | $99 | ✓ | ✓ |
| Floor Plan | $49 | ✓ | ✓ |
| Aerial Photography | $99 | ✓ | ✓ |
| Amenities Photography | $40 | ✓ | ✓ |
| Virtual Staging | $99 | 3 photos | Whole House/Yard |
| Premium Analytics | — | ✓ | ✓ |
| Mega Open House | $99 | 1 Included | 1 Included |
| Contract Negotiation | $249 | 1 Free, then $149 | Every Offer |
| Amendment Negotiation | $249 | 1 Free, then $149 | Every Offer |
| Leaseback Package | $499 | $299 | If needed |
| Repairs Management | Self-Managed | Self-Managed | ✓ |
| Preferred Vendors | — | — | ✓ |
| Transaction Coord. | Self-Guided | Self-Guided | Hands-off |

### All Plans Include
- MLS + Syndication
- Professional Photography
- Guided Pricing Strategy
- Pre-Listing Consultation
- Digital Document Signing
- Lockbox & Yard Sign
- Showings by ShowingTime
- Zillow/Homes Traffic

### CTA Buttons
- "Select Direct List" → `https://app.access.realty/signup?plan=direct-list`
- "Select Direct List +" → `https://app.access.realty/signup?plan=direct-list-plus`
- "Select Full Service" → `https://app.access.realty/signup?plan=full-service`

---

## Brand Colors (Already Configured)

Colors are set up in `app/globals.css`. Use these Tailwind classes:

| Color | Class | Hex |
|-------|-------|-----|
| Navy (Primary) | `bg-primary`, `text-primary` | #284b70 |
| Navy Dark | `bg-primary-dark` | #1e3a5f |
| Navy Light | `bg-primary-light` | #3a6690 |
| Tan/Gold (Secondary) | `bg-secondary`, `text-secondary` | #d6b283 |
| Cream (Background) | `bg-background` | #f8f4ef |
| White (Cards) | `bg-card` | #ffffff |

See `Brand Style Guide.md` for complete color and typography reference.

## Typography

| Element | Font |
|---------|------|
| Logo "Access" | Times New Roman MT Italic |
| Logo "Realty" | Be Vietnam Bold |
| Headings | Verdana |
| Body | Arial |

---

## Project Structure

```
app/
├── page.tsx              # Homepage
├── layout.tsx            # Root layout
├── globals.css           # Brand colors & Tailwind config
├── how-it-works/
│   └── page.tsx          # TODO
├── services/
│   └── page.tsx          # TODO - pricing comparison
├── staff/
│   ├── page.tsx          # TODO - staff directory
│   └── [slug]/
│       └── page.tsx      # TODO - individual staff pages
├── privacy/
│   └── page.tsx          # Done
└── terms/
    └── page.tsx          # Done

components/               # TODO - create shared components
├── Header.tsx
├── Footer.tsx
├── LeadCaptureForm.tsx
└── PricingTable.tsx

lib/
└── supabase.ts           # Supabase client (configured)
```

---

## Links & CTAs

All "Get Started" / signup buttons should link to the main app:

| Action | URL |
|--------|-----|
| Sign In | `https://app.access.realty/signin` |
| Sign Up | `https://app.access.realty/signup` |
| Sign Up (with source tracking) | `https://app.access.realty/signup?source={page-name}` |

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

(Get these from Bret - same credentials as main app)

---

## Platform Architecture

This is **Repo 2** of the Access Realty platform:

1. **`access-realty-app`** (`app.access.realty`) - Main application
2. **`access-realty-home`** (`access.realty`) - THIS REPO - Marketing site
3. **`access-realty-seo`** (future) - SEO property pages

All repos share the same Supabase database.

---

## Deployment

Auto-deploys to Vercel on push to `main` branch.

- **Production:** https://access.realty
- **Vercel Project:** `access-realty-home`
