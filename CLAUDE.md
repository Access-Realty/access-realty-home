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
- **access-realty-app** (`app.access.realty`) - Main application
- **access-realty-home** (`access.realty`) - THIS REPO - Marketing site
- **access-realty-seo** (future) - SEO property pages

All repos share the same Supabase database.

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
- Sign In: `https://app.access.realty/signin`
- Sign Up: `https://app.access.realty/signup`
- With tracking: `https://app.access.realty/signup?source={page-name}`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Copy `.env.local.example` to `.env.local` - uses same Supabase credentials as main app.
