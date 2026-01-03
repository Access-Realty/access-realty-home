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

## Architecture

This is the **marketing site** (Repo 2 of 3) for Access Realty:
- **access-realty-app** (`app.access.realty`) - Main application
- **access-realty-home** (`access.realty`) - THIS REPO - Marketing site
- **access-realty-seo** (future) - SEO property pages

All repos share the same Supabase database.

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

## Logo Pattern

Text-based logo (no image file):
- "Access" - Times New Roman, italic
- "Realty" - Be Vietnam Pro, bold

See `components/Header.tsx` for implementation.

## CTAs and Links

All signup/signin buttons link to the main app:
- Sign In: `https://app.access.realty/signin`
- Sign Up: `https://app.access.realty/signup`
- With tracking: `https://app.access.realty/signup?source={page-name}`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Copy `.env.local.example` to `.env.local` - uses same Supabase credentials as main app.
