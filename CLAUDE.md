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

## Spacing Standards

**Use layout components for consistent vertical spacing.** Do NOT use raw `<section>` tags with manual padding.

### Layout Components

```tsx
import { HeroSection, Section } from "@/components/layout";

// Hero with header clearance (pt-24 pb-12)
<HeroSection maxWidth="4xl">
  <h1>Page Title</h1>
</HeroSection>

// Standard content section (py-16)
<Section variant="content" maxWidth="4xl">
  ...
</Section>

// Secondary/minor section (py-12)
<Section variant="tight" maxWidth="3xl">
  ...
</Section>

// CTA section with primary background
<Section variant="cta" background="primary" maxWidth="4xl">
  ...
</Section>
```

### Spacing Values (for reference)

| Element | Spacing | Tailwind |
|---------|---------|----------|
| Hero top (header clearance) | 6rem | pt-24 |
| Hero bottom | 3rem | pb-12 |
| Section padding | 4rem | py-16 |
| Tight section padding | 3rem | py-12 |

### Container Max-Widths

| Use Case | Max Width |
|----------|-----------|
| Narrow content (forms, text) | max-w-2xl or max-w-3xl |
| Standard pages | max-w-4xl |
| Multi-column layouts | max-w-5xl |
| Wide hero sections | max-w-6xl |

**Do NOT use:** `py-20`, `pt-28`, `pb-16`, `pb-20` or other non-standard spacing values.

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
