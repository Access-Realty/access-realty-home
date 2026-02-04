# DirectList Fix & Flip Investors Landing Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a dedicated landing page at `/direct-list/fix-and-flip` targeting real estate investors (fix & flip), showing how DirectList saves on listing commissions — with a "How it Works" timeline, comparison table, FAQ accordion, and "Book a Call" CTA.

**Architecture:** Single new page component under the existing `(direct-list)` route group, reusing the `DirectListHeader`/`DirectListFooter` layout. The page is a client component (for Accordion interactivity). It follows the established pattern: Hero → Content Sections → CTA → Footer. The CTA is customized to "Book a Call" / "Schedule Your Call" rather than the default "Get Started Now".

**Tech Stack:** Next.js App Router, Tailwind CSS v4, existing `Accordion` component, existing layout components (`HeroSection`, `Section`), `react-icons`.

---

## Design Reference

The design files are at `/Users/bort/Desktop/files_50be9d9c5995e88fee25a1dadbe0923f/`. The page has 6 sections in order:

1. **Hero** — Split layout (text left, house image right). Navy background. Headline: "List Your Investment Property on the MLS Without Paying High Listing Fees". Subtext about self-guided flat fee service for fix & flip investors. Two CTAs: "Book a Call" (gold/secondary button) and a text link "Find out if DirectList is the right fit for you." Stats are NOT shown (unlike main DirectList page).

2. **How Direct List Works** — 5-step vertical timeline with numbered tan circles (01–05) connected by a vertical line. Steps: Book a Call, Set Up Your Listing, Go Live on the MLS, Stay Informed & In Control, Close With Confidence. Intro text: "Selling your flip shouldn't require handing over a massive chunk of your profit..."

3. **Comparison Table** — "See How Direct List Compares to a Traditional Listing". 6-row table with navy header. Columns: Feature | Direct List | Traditional Listing. Rows: MLS Exposure (✓/✓), Listing Experience, Market Updates, Pricing Control, Agent Support, Savings.

4. **FAQ** — 5-item accordion on cream background. Questions: buyer's agents showing, negotiations, same exposure, experienced investors only, help during listing. Each with investor-specific answers from the designs.

5. **Bottom CTA** — Navy background. "Book a Call" heading. "Find out if Direct List is the right fit for your next flip." Button: "Schedule Your Call →" with phone icon.

6. **Footer** — Provided by DirectListFooter layout (automatic).

---

## Content Extracted from Designs

### Hero Section
- **H1:** "List Your Investment Property on the MLS Without Paying High Listing Fees"
- **Subtitle:** "DirectList is a self guided flat fee MLS listing service for fix and flip investors who want control, clarity, and more money at closing."
- **Primary CTA:** "Book a Call" (gold/secondary button)
- **Secondary text:** "Find out if DirectList is the right fit for you."
- **Image:** `/hero-house-new.jpg` (same as main DirectList page, with tan border)

### How DirectList Works
- **Intro:** "Selling your flip shouldn't require handing over a massive chunk of your profit. Direct List gives you MLS exposure, control, and support without the high listing fees."
- **Steps:**
  1. **Book a Call** — "We will answer questions and explain exactly how the process works."
  2. **Set Up Your Listing** — "Upload your property details using our step-by-step listing platform and we take care of everything else."
  3. **Go Live on the MLS** — "Your property is published to the MLS with the same exposure buyers and agents expect, without the high cost of a full-service listing agent."
  4. **Stay Informed & In Control** — "Stay updated on market activity and make confident pricing decisions. Our experienced, licensed agents are available whenever you need support."
  5. **Close With Confidence** — "From accepted offer to closing, we help you finish the sale smoothly while maximizing your net proceeds."

### Comparison Table
| Feature | Direct List | Traditional Listing |
|---------|-------------|---------------------|
| MLS Exposure | ✓ | ✓ |
| Listing Experience | Step-by-Step Platform | Agent Controlled Process |
| Market Updates | Real Time Updates | Periodic Check-Ins |
| Pricing Control | Full Control | Dependent on Agent |
| Agent Support | Support Available | On Demand |
| Savings | Thousands | None |

### FAQ Items
1. **Will buyer's agents still show my property?** — "Yes. Your property is listed on the MLS, where buyer's agents are already searching. Nothing changes from their perspective."
2. **Who handles negotiations?** — "You stay in control, but you're not alone. Our licensed agents are available to provide guidance and advice whenever you need it without forcing you into a full-service commission."
3. **Will my home get the same exposure as a traditional listing?** — "Yes. Your flip is listed on the MLS, which feeds major real estate platforms buyers and agents already use. Direct List gives you professional exposure without the premium fees."
4. **Is this only for experienced investors?** — "No. Direct List works for both new and experienced fix & flip investors. The system does most of the work, and support is available if you need it."
5. **What if I need help during the listing?** — "You can reach out to our licensed agents anytime for advice, strategy, or clarification. You get help when you want it."

### Bottom CTA
- **Heading:** "Book a Call"
- **Subheading:** "Find out if Direct List is the right fit for your next flip."
- **Button:** "Schedule Your Call →" (with phone icon)

---

## Tasks

### Task 1: Create the Fix & Flip page file with hero section

**Files:**
- Create: `app/(direct-list)/direct-list/fix-and-flip/page.tsx`

**Step 1: Create the page file with hero section**

The hero uses a split layout (text left, image right) matching the main DirectList page pattern but with investor-specific copy. Uses `HeroSection` with `centered={false}`.

```tsx
// ABOUTME: DirectList Fix & Flip landing page for real estate investors
// ABOUTME: Flat-fee MLS listing service targeted at fix and flip sellers

import Link from "next/link";
import { HeroSection, Section } from "@/components/layout";
import { HiCheck } from "react-icons/hi2";
import { HiPhone } from "react-icons/hi2";
import Accordion from "@/components/ui/Accordion";

// FAQ items for fix & flip investors
const faqItems = [
  {
    question: "Will buyer's agents still show my property?",
    answer:
      "Yes. Your property is listed on the MLS, where buyer's agents are already searching. Nothing changes from their perspective.",
  },
  {
    question: "Who handles negotiations?",
    answer:
      "You stay in control, but you're not alone. Our licensed agents are available to provide guidance and advice whenever you need it without forcing you into a full-service commission.",
  },
  {
    question: "Will my home get the same exposure as a traditional listing?",
    answer:
      "Yes. Your flip is listed on the MLS, which feeds major real estate platforms buyers and agents already use. DirectList gives you professional exposure without the premium fees.",
  },
  {
    question: "Is this only for experienced investors?",
    answer:
      "No. DirectList works for both new and experienced fix & flip investors. The system does most of the work, and support is available if you need it.",
  },
  {
    question: "What if I need help during the listing?",
    answer:
      "You can reach out to our licensed agents anytime for advice, strategy, or clarification. You get help when you want it.",
  },
];

// Comparison table data
const comparisonRows = [
  { feature: "MLS Exposure", directList: "check", traditional: "check" },
  {
    feature: "Listing Experience",
    directList: "Step-by-Step Platform",
    traditional: "Agent Controlled Process",
  },
  {
    feature: "Market Updates",
    directList: "Real Time Updates",
    traditional: "Periodic Check-Ins",
  },
  {
    feature: "Pricing Control",
    directList: "Full Control",
    traditional: "Dependent on Agent",
  },
  {
    feature: "Agent Support",
    directList: "Support Available",
    traditional: "On Demand",
  },
  { feature: "Savings", directList: "Thousands", traditional: "None" },
];

// How it works steps
const steps = [
  {
    number: "01",
    title: "Book a Call",
    description:
      "We will answer questions and explain exactly how the process works.",
  },
  {
    number: "02",
    title: "Set Up Your Listing",
    description:
      "Upload your property details using our step-by-step listing platform and we take care of everything else.",
  },
  {
    number: "03",
    title: "Go Live on the MLS",
    description:
      "Your property is published to the MLS with the same exposure buyers and agents expect, without the high cost of a full-service listing agent.",
  },
  {
    number: "04",
    title: "Stay Informed & In Control",
    description:
      "Stay updated on market activity and make confident pricing decisions. Our experienced, licensed agents are available whenever you need support.",
  },
  {
    number: "05",
    title: "Close With Confidence",
    description:
      "From accepted offer to closing, we help you finish the sale smoothly while maximizing your net proceeds.",
  },
];

export default function FixAndFlipPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HeroSection maxWidth="6xl" centered={false} className="pt-28">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              List Your Investment Property on the MLS Without Paying High
              Listing Fees
            </h1>
            <p className="text-base md:text-lg mb-8 text-white/90">
              DirectList is a self guided flat fee MLS listing service for fix
              and flip investors who want control, clarity, and more money at
              closing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/direct-list/get-started"
                className="inline-flex items-center justify-center bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Book a Call
              </Link>
              <p className="text-sm text-white/70">
                Find out if DirectList is the right fit for you.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <div className="border-4 border-secondary rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/hero-house-new.jpg"
                alt="Investment property for sale"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </HeroSection>

      {/* How DirectList Works - Timeline */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How DirectList Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selling your flip shouldn&apos;t require handing over a massive
            chunk of your profit. DirectList gives you MLS exposure, control,
            and support without the high listing fees.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-secondary/40" />

          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center z-10">
                  <span className="text-sm font-bold text-primary">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Comparison Table */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See How DirectList Compares to a Traditional Listing
          </h2>
        </div>

        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left px-6 py-4 font-semibold">Feature</th>
                <th className="text-center px-6 py-4 font-semibold">
                  DirectList
                </th>
                <th className="text-center px-6 py-4 font-semibold">
                  Traditional Listing
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.feature}
                  className={idx % 2 === 0 ? "bg-card" : "bg-muted/50"}
                >
                  <td className="px-6 py-4 text-foreground">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.directList === "check" ? (
                      <HiCheck className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <span className="font-semibold text-primary">
                        {row.directList}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.traditional === "check" ? (
                      <HiCheck className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">
                        {row.traditional}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section variant="content" maxWidth="3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <Accordion items={faqItems} />
        </div>
      </Section>

      {/* Bottom CTA - Book a Call */}
      <section className="bg-primary pt-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Book a Call
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Find out if DirectList is the right fit for your next flip.
          </p>
          <Link
            href="/direct-list/get-started"
            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <HiPhone className="h-5 w-5" />
            Schedule Your Call
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

**Step 3: Start dev server and screenshot**

Run: `npm run dev` (if not already running)

Screenshot: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/fix-and-flip-hero.png --window-size=1400,2400 "http://localhost:4000/direct-list/fix-and-flip"`

Read the screenshot to verify:
- Hero has navy background, split layout with house image
- "How DirectList Works" has numbered timeline with tan circles
- Comparison table renders with navy header
- FAQ accordion renders with 5 items
- Bottom CTA has navy background with "Book a Call" and phone icon
- DirectListHeader and DirectListFooter are both present

**Step 4: Commit**

```bash
git add app/(direct-list)/direct-list/fix-and-flip/page.tsx
git commit -m "feat: add DirectList fix & flip investors landing page"
```

---

### Task 2: Visual refinement pass

**Files:**
- Modify: `app/(direct-list)/direct-list/fix-and-flip/page.tsx`

**Step 1: Compare screenshots to design files**

Take a screenshot and compare against the design files at `/Users/bort/Desktop/files_50be9d9c5995e88fee25a1dadbe0923f/`. Check:

- **Hero:** Text sizing, CTA positioning, image border color matches tan/secondary
- **Timeline:** Circle sizing, line thickness, spacing between steps. The design shows larger circles (~40px) with tan fill at ~30% opacity, connected by a thin vertical line. Numbers are bold inside circles.
- **Comparison table:** Header is full navy, text alignment matches. DirectList column values are bold/navy. Traditional column is lighter/muted.
- **FAQ:** Items have rounded card-like containers with subtle borders (the design shows individual rounded cards per FAQ item rather than a single divided list). Adjust if the Accordion's `divide-y` style doesn't match.
- **Bottom CTA:** Phone icon before button text, arrow after.

**Step 2: Adjust any spacing/styling mismatches**

Make targeted edits based on screenshot comparison. Common adjustments:
- Timeline circle size (the design shows ~40-48px circles)
- Timeline line positioning and thickness
- FAQ item styling (may need per-item card borders instead of dividers)
- Table row padding and text weights

**Step 3: Re-screenshot and verify**

Run screenshot again and compare. Iterate if needed.

**Step 4: Commit**

```bash
git add app/(direct-list)/direct-list/fix-and-flip/page.tsx
git commit -m "fix: refine fix & flip page styling to match design"
```

---

### Task 3: Mobile responsiveness check

**Files:**
- Modify: `app/(direct-list)/direct-list/fix-and-flip/page.tsx` (if needed)

**Step 1: Screenshot at mobile width**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/fix-and-flip-mobile.png --window-size=375,2400 "http://localhost:4000/direct-list/fix-and-flip"
```

**Step 2: Check mobile layout**

Verify:
- Hero image hidden on mobile (already `hidden md:block`)
- Hero text stacks properly
- Timeline is readable at narrow widths
- Comparison table doesn't overflow (may need horizontal scroll wrapper)
- FAQ accordion works at narrow widths
- CTA button is full-width or appropriately sized

**Step 3: Fix any mobile issues**

Most likely fix: comparison table may need a horizontal scroll wrapper:
```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[500px]">
    ...
  </table>
</div>
```

**Step 4: Re-screenshot and verify**

**Step 5: Commit (if changes were made)**

```bash
git add app/(direct-list)/direct-list/fix-and-flip/page.tsx
git commit -m "fix: improve fix & flip page mobile responsiveness"
```

---

### Task 4: Final build verification and cleanup

**Files:**
- Possibly: `app/(direct-list)/direct-list/fix-and-flip/page.tsx`

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Delete design files from Desktop**

```bash
rm -rf "/Users/bort/Desktop/files_50be9d9c5995e88fee25a1dadbe0923f"
```

**Step 4: Final commit if any cleanup was needed**

```bash
git add -A
git commit -m "chore: clean up fix & flip page"
```
