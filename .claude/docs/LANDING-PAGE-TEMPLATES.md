# Page Design System

This document defines the visual structure, layout components, spacing, and color system for all pages.

## Page Structure Pattern

**Every page MUST follow this structure** to ensure visual consistency:

```
┌─────────────────────────────────────────┐
│ Header (sticky, from layout)            │
├─────────────────────────────────────────┤
│ HeroSection (primary/gradient bg)       │  ← REQUIRED: Always first
├─────────────────────────────────────────┤
│ Section (cream) - content               │  ← Content sections (ALL cream)
│ Section (cream) - as needed             │
│ ...                                     │
├─────────────────────────────────────────┤
│ Section (primary bg) - CTA              │  ← REQUIRED: Always last
├─────────────────────────────────────────┤
│ Footer (from layout)                    │
└─────────────────────────────────────────┘
```

**IMPORTANT: Do NOT alternate section backgrounds.** All content sections use the default cream background. Visual distinction comes from content hierarchy (cards, spacing, typography), not background color changes.

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

// Content sections - always use default (cream) background
// Do NOT specify background prop - cream is the default
<Section variant="content" maxWidth="4xl">
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
// Access pages (solutions, our-team, homes-for-sale, etc.)
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

## Spacing Values

| Element | Classes | Notes |
|---------|---------|-------|
| HeroSection | `min-h-[280px] pt-20 pb-20 flex items-center` | Symmetric padding for true vertical centering |
| Section (content) | `py-12` | 48px each direction = 96px gaps |
| Section (tight) | `py-8` | 32px each direction = 64px gaps |
| Section (cta) | `py-12` | 48px each direction = 96px gaps |

### Container Max-Widths

| Use Case | Max Width |
|----------|-----------|
| Narrow content (forms, text) | max-w-2xl or max-w-3xl |
| Standard pages | max-w-4xl |
| Multi-column layouts | max-w-5xl |
| Wide hero sections | max-w-6xl |

**Do NOT use:** `py-20`, `pt-24`, `pb-20` or other non-standard spacing values.

## Background Color System

**All content sections use cream background.** Do NOT alternate backgrounds between sections.

| Background | Tailwind | Hex | Use When |
|------------|----------|-----|----------|
| **default** (cream) | `bg-background` | #f8f4ef | ALL content sections (the only option) |
| **primary** (navy) | `bg-primary` | #284b70 | Hero sections, CTA sections only |

**For elements WITHIN sections:**

| Element | Tailwind | Hex | Use When |
|---------|----------|-----|----------|
| Cards | `bg-card` | #ffffff | White cards sitting on cream background |
| Inputs | `bg-muted` | #f9fafb | Gray inputs inside white cards |

### Header vs Body Colors (Option A)

The site uses a gray header / cream body color scheme:

| Element | Background | Color |
|---------|------------|-------|
| Header | `bg-muted/95` | Gray (#f9fafb) |
| Body | `bg-background` | Cream (#f8f4ef) |
| Cards | `bg-card` | White (#ffffff) |
| Inputs inside cards | `bg-muted` | Gray (#f9fafb) |

### Background Rules

1. **All content sections use cream** - do not specify `background` prop
2. **Cards are always white** (`bg-card`) - they sit on cream and contrast naturally
3. **Inputs inside white cards** → use `bg-muted` for contrast
4. **Inputs always have borders** - never use `bg-transparent border-0`

### Examples

```tsx
// ✅ GOOD: White card on cream section (no background prop needed)
<Section variant="content" maxWidth="4xl">
  <div className="bg-card rounded-lg p-6">Content</div>
</Section>

// ✅ GOOD: Gray input inside white card
<div className="bg-card p-6">
  <input className="bg-muted border border-border rounded-lg" />
</div>

// ❌ BAD: Alternating section backgrounds
<Section background="card">...</Section>
<Section background="default">...</Section>
<Section background="card">...</Section>

// ❌ BAD: White input inside white card
<div className="bg-card p-6">
  <input className="bg-card border-0" />  {/* Invisible! */}
</div>
```
