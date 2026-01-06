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

## Page Structure Pattern

**Every page MUST follow this structure** to ensure visual consistency:

```
┌─────────────────────────────────────────┐
│ Header (sticky, from layout)            │
├─────────────────────────────────────────┤
│ HeroSection (primary/gradient bg)       │  ← REQUIRED: Always first
├─────────────────────────────────────────┤
│ Section (default/muted) - content       │  ← Content sections
│ Section (default/muted) - as needed     │
│ ...                                     │
├─────────────────────────────────────────┤
│ Section (primary bg) - CTA              │  ← REQUIRED: Always last
├─────────────────────────────────────────┤
│ Footer (from layout)                    │
└─────────────────────────────────────────┘
```

**The mandatory CTA section before footer** eliminates empty space above the footer and creates a visual anchor for short pages.

## Layout Components

**Use layout components for consistent vertical spacing.** Do NOT use raw `<section>` tags with manual padding.

```tsx
import { HeroSection, Section, AccessCTA, DirectListCTA } from "@/components/layout";

// Hero - always first, always primary/gradient
<HeroSection maxWidth="4xl">
  <h1 className="text-3xl font-bold text-primary-foreground">Page Title</h1>
  <p className="text-primary-foreground/80">Subtitle here</p>
</HeroSection>

// Content sections - use default or muted backgrounds
<Section variant="content" maxWidth="4xl" background="default">
  ...
</Section>

// CTA section - use the appropriate CTA component (see below)
<AccessCTA />  // or <DirectListCTA />
```

### CTA Components

Two CTA components exist, each designed to flow into its paired footer:

| Component | Use On | Flows Into | Default Action |
|-----------|--------|------------|----------------|
| `<AccessCTA />` | Pages in `(home)` layout | AccessFooter | Get My Custom Selling Plan |
| `<DirectListCTA />` | Pages in `(direct-list)` layout | DirectListFooter | Get Started Now |

```tsx
// Access pages (solutions, staff, homes-for-sale, etc.)
<AccessCTA />  // defaults to selling-plan CTA

// Or customize:
<AccessCTA
  heading="Custom Heading"
  subheading="Custom subheading."
  buttonText="Custom Button"
  buttonHref="/custom-path"
  showPhone={true}  // optional: adds phone number button
/>

// DirectList pages (faq, savings, etc.)
<DirectListCTA
  heading="Ready to Save Thousands?"
  subheading="List your home on MLS for a flat fee."
  buttonText="Get Started Now"
  buttonHref="/direct-list/get-started"
/>
```

**Important:** The CTA component MUST match the page's layout. Pages in `(home)/` use `AccessCTA`, pages in `(direct-list)/` use `DirectListCTA`.

### Spacing Values (actual implementation)

| Element | Padding | Notes |
|---------|---------|-------|
| HeroSection | pt-24 pb-12 | 96px top (header clearance), 48px bottom |
| Section (content) | py-12 | 48px each direction = 96px gaps |
| Section (tight) | py-8 | 32px each direction = 64px gaps |
| Section (cta) | py-12 | 48px each direction = 96px gaps |

### Container Max-Widths

| Use Case | Max Width |
|----------|-----------|
| Narrow content (forms, text) | max-w-2xl or max-w-3xl |
| Standard pages | max-w-4xl |
| Multi-column layouts | max-w-5xl |
| Wide hero sections | max-w-6xl |

## Background Color System

**Three background colors for sections, used purposefully:**

| Background | Tailwind | Hex | Use When |
|------------|----------|-----|----------|
| **default** (cream) | `bg-background` | #f8f4ef | Standard content sections |
| **muted** (light gray) | `bg-muted/30` | #f9fafb | Feature grids, testimonials, grouped items |
| **card** (white) | `bg-card` | #ffffff | Rarely - only when content needs max emphasis |
| **primary** (navy) | `bg-primary` | #284b70 | Hero sections, CTA sections |

### Background Rules

1. **Cards are always white** (`bg-card`) - they sit ON section backgrounds
2. **Cream sections** → white cards contrast naturally (no border needed)
3. **Muted sections** → white cards contrast naturally (no border needed)
4. **White sections** → white cards NEED `border border-border`
5. **Inputs always have borders** - never use `bg-transparent border-0`

### Preventing Same-Color-on-Same-Color

```tsx
// ✅ GOOD: White card on cream background
<Section background="default">
  <div className="bg-card rounded-lg p-6">Content</div>
</Section>

// ✅ GOOD: White card on white section WITH border
<Section background="card">
  <div className="bg-card border border-border rounded-lg p-6">Content</div>
</Section>

// ❌ BAD: White card on white section without border
<Section background="card">
  <div className="bg-card rounded-lg p-6">Content</div>  {/* Invisible! */}
</Section>

// ❌ BAD: Transparent input without border
<input className="bg-transparent border-0" />  {/* Invisible! */}
```

**Do NOT use:** `py-20`, `pt-24`, `pb-20` or other non-standard spacing values.

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
