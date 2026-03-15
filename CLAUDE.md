# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with Turbopack (port 4000)
npm run build    # Production build
npm run lint     # ESLint
```

**Note:** This repo uses port 4000 to avoid conflicts with other Access Realty repos.

## Pre-Commit Checklist

**ALWAYS run `npm run build` before committing/pushing.** This catches:
- Missing imports and untracked files
- TypeScript errors
- Build-time failures that would break Vercel deployment

Vercel auto-deploys on push to main - broken builds affect production immediately.

## UI Visual Review

**ALWAYS capture and review screenshots before presenting UI changes to the user.**

Use headless Chrome to screenshot your work:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/review.png --window-size=1400,900 "http://localhost:4000/page-path"
```

Then read the image to visually verify:
- Layout looks correct (no double headers, proper spacing)
- Colors match site guidelines (navy hero, cream content, etc.)
- Components render as expected

### Image Cleanup

- **Your screenshots:** Only save to Desktop when user specifically asks for comparison options. Delete after user has reviewed.
- **User-provided images:** When the user drops images into conversation for UI feedback, delete them from Desktop once you've addressed the issue (after approval or once you've seen what's needed).

## Architecture

This is the **marketing site** (Repo 2 of 3) for Access Realty:
- **access-realty-app** (`access.realty/app`) - Main application
- **access-realty-home** (`access.realty`) - THIS REPO - Marketing site
- **access-realty-seo** (future) - SEO property pages

All repos share the same Supabase database.

## MLS Data Identifiers

When Bret references MLS records casually, he uses **human-readable MLS IDs**, not internal keys.

| When Bret says... | Table | Query column | Example |
|-------------------|-------|--------------|---------|
| Office ID | `mls_offices` | `office_mls_id` | `PRSG01` |
| Agent/Member ID | `mls_agents` | `member_mls_id` | `0618343` |
| Listing ID | `mls_listings` | `listing_id` | `20976128` |

**Key gotchas:**
- `listing_id` is **text**, not integer. Query as string: `WHERE listing_id = '20976128'`
- Bridge API `*_key` fields (e.g., `member_key`, `listing_key`) are internal hashes—not human-readable
- All MLS tables include `mls_name` (e.g., "ntreis2") in composite keys

**Agent lookups for staff pages:**
- `staff.member_key` → hash (e.g., `772fa4dea37689a3a22c3f7d1b7cf710`)
- `mls_agents.member_mls_id` → human-readable (e.g., `0618343`)
- `mls_listings.list_agent_mls_id` → uses human-readable format
- `mls_listings.buyer_agent_key` → uses hash format

### RESO Fields & Query Patterns

Our MLS data comes from Bridge Interactive (NTREIS MLS) using RESO Data Dictionary v2.0. Reference: https://ddwiki.reso.org/display/DDW21/Property+Resource

**Status fields:**
- `standard_status` — RESO-normalized: `Active`, `Active Under Contract`, `Pending`, `Closed`, `Expired`, `Withdrawn`, `Canceled`
- `mls_status` — NTREIS-specific: `Active`, `Active Option Contract`, `Active Contingent`, `Active KO`, `Pending`, `Closed`, `Expired`, `Withdrawn`, `Cancelled`, `Hold`
- Use `mls_status` for NTREIS queries (matches app repo's `useCompetitiveListings` pattern)

**Date fields (and when they're populated):**

| Column | Type | Meaning | Populated for |
|--------|------|---------|---------------|
| `listing_contract_date` | date | When listing agreement was signed (original list date) | All statuses (100%) |
| `purchase_contract_date` | date | When buyer's offer was accepted | Pending + Closed (~87% of closed) |
| `status_change_timestamp` | timestamp | When MLS status last changed — **best proxy for close date** | All statuses (100%) |
| `on_market_date` | date | When first put on market | Barely populated (~0%) |
| `expiration_date` | date | When listing agreement expires | ~42% of closed |
| `cancellation_date` | date | When listing was cancelled | Only cancelled |

**Important:** `close_date` does NOT exist in our table (gap in Bridge sync). Use `status_change_timestamp` as the close date proxy for Closed listings.

**Filtering leases:** Always exclude `property_type IN ('Residential Lease', 'Commercial Lease')` for sales queries.

**Active listing statuses (for "nearby activity" queries):**
```
mls_status IN ('Active', 'Active Option Contract', 'Active Contingent', 'Pending')
```

**Recent closed (last 12 months):**
```
mls_status = 'Closed' AND status_change_timestamp > now() - interval '12 months'
```

**App repo reference:** `access-realty-app/src/hooks/useCompetitiveListings.ts` — uses `mls_status`, parallel bbox queries (active + time-limited), `listing_contract_date` for 90-day cutoff.

### Database Schema Ownership

**This repo MUST NOT modify the Supabase database schema.** All DDL lives in `access-realty-app/supabase/migrations/`. This includes:

- Tables, columns, constraints
- Indexes
- Functions, triggers
- RLS policies
- Views, materialized views
- Grants

This repo should only contain application code that **reads from or writes to** the database via the Supabase client SDK. If a query needs a new index for performance, document the need and add the migration in the app repo.

**Do not use `mcp__claude_ai_Supabase__execute_sql` or `mcp__claude_ai_Supabase__apply_migration` to run DDL statements (CREATE, DROP, ALTER, etc.) from this repo.** SELECT queries for debugging are OK.

### Related Repos (for cross-repo reference)

| Repo | Path | Purpose |
|------|------|---------|
| access-realty-app | `/Users/bort/Documents/GitHub/access-realty-app` | Main app - reference for styling patterns, components, database schemas |
| access-realty-home | THIS REPO | Marketing site |

When implementing features that need to match the app's patterns (forms, inputs, color system), reference the app repo for consistency.

## Marketing → App Handoff

The DirectList get-started wizard collects lead and property data, then hands off to the app after checkout. See **[MARKETING-HANDOFF.md](./MARKETING-HANDOFF.md)** for:
- Wizard flow and data collected at each step
- URL parameters passed to app after checkout
- Stripe session metadata
- Database tables (`leads`, `parcels`) and their schemas
- App integration examples

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS v4** (CSS-first config, NOT tailwind.config.js)
- **Supabase** for lead capture forms
- **Vercel** for deployment (auto-deploys on push to main)

## Tailwind v4 Configuration

Colors are defined in `app/globals.css` using the `@theme inline` block - not a JS config file:

```css
:root {
  --primary: #284b70;    /* Navy */
  --secondary: #d6b283;  /* Tan/Gold */
  --background: #f8f4ef; /* Cream */
}

@theme inline {
  --color-primary: var(--primary);
  /* ... maps CSS vars to Tailwind colors */
}
```

Use classes like `bg-primary`, `text-secondary`, `bg-background`.

## DirectList Voice & Tone

See **[DIRECTLIST-VOICE-GUIDE.md](./DIRECTLIST-VOICE-GUIDE.md)** for:
- Base voice rules (always true across all content)
- Emotional arc of a landing page (Mirror → Validate → Reframe → Prove → Address Doubt → Close)
- How the voice flexes by persona (investor vs. homeowner in transition vs. first-time seller, etc.)
- CTA patterns, objection handling voice, and language palette
- Words/phrases to use and avoid

**IMPORTANT:** All DirectList landing pages, persona pages, and marketing copy must follow this voice guide.

## Landing Page Design

See **[LANDING-PAGE-TEMPLATES.md](./LANDING-PAGE-TEMPLATES.md)** for:
- Page structure pattern (Hero → Content → CTA → Footer)
- Layout components (HeroSection, Section, AccessCTA, DirectListCTA)
- Spacing values and container max-widths
- Background color system and rules
- Examples of good/bad color layering

## Logo Pattern

Text-based logo (no image file):
- "Access" - Times New Roman, italic
- "Realty" - Be Vietnam Pro, bold

See `components/Header.tsx` for implementation.

## CTAs and Links

All signup/signin buttons link to the main app:
- Sign In: `https://access.realty/app/signin`
- Sign Up: `https://access.realty/app/signup`
- With tracking: `https://access.realty/app/signup?source={page-name}`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Copy `.env.local.example` to `.env.local` - uses same Supabase credentials as main app.
