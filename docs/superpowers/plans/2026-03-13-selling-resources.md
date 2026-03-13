# Selling Resources Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Selling Resources" section to the DirectList brand — a hub page with 11 resource cards and individual article-first resource pages with embedded video.

**Architecture:** Static pages generated from a metadata registry (`resources.ts`). Dynamic `[slug]` route uses `generateStaticParams`. Three shared components: `ResourceCard`, `VideoPlayer`, `RelatedResources`. Article content is placeholder until Descript scripts are provided.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Supabase public storage (videos/posters)

**Spec:** `docs/superpowers/specs/2026-03-13-selling-resources-design.md`

---

## File Structure

| File | Purpose |
|------|---------|
| **Create:** `app/(direct-list)/direct-list/selling-resources/resources.ts` | Resource metadata registry + helper functions |
| **Create:** `app/(direct-list)/direct-list/selling-resources/components/VideoPlayer.tsx` | HTML5 video player with poster image |
| **Create:** `app/(direct-list)/direct-list/selling-resources/components/ResourceCard.tsx` | Card component for hub grid + related resources |
| **Create:** `app/(direct-list)/direct-list/selling-resources/components/RelatedResources.tsx` | "You might also find helpful" section |
| **Create:** `app/(direct-list)/direct-list/selling-resources/page.tsx` | Hub page — hero + card grid + CTA |
| **Create:** `app/(direct-list)/direct-list/selling-resources/[slug]/page.tsx` | Individual resource page — article + video + related |
| **Modify:** `components/direct-list/DirectListFooter.tsx` | Add "Selling Resources" nav link |

---

## Chunk 1: Data Layer and Components

### Task 1: Resource Metadata Registry

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/resources.ts`

- [ ] **Step 1: Create the registry file**

```ts
// ABOUTME: Metadata registry for all selling resource pages
// ABOUTME: Defines resource entries, slugs, video info, and helper functions

const SUPABASE_ASSETS_BASE =
  'https://hvbicnpvactgxzprnygc.supabase.co/storage/v1/object/public/public-assets';

export interface SellingResource {
  slug: string;
  title: string;
  description: string;
  video?: {
    fileName: string;
    posterFileName?: string;
    durationSeconds: number;
  };
  relatedSlugs: string[];
}

export const SELLING_RESOURCES: SellingResource[] = [
  {
    slug: 'access-and-showings',
    title: 'Access and Showings Guide',
    description: 'Learn about property access options and showing scheduling for your listing.',
    video: { fileName: 'access-and-showings.mp4', posterFileName: 'access-and-showings.webp', durationSeconds: 85 },
    relatedSlugs: ['showings-with-pets', 'how-to-attach-a-lockbox', 'photography-prep'],
  },
  {
    slug: 'photography-prep',
    title: 'Photography Preparation Guide',
    description: 'Essential tips for preparing your property for professional photography and virtual staging.',
    video: { fileName: 'photography-prep.mp4', posterFileName: 'photography-prep.webp', durationSeconds: 175 },
    relatedSlugs: ['square-footage', 'property-conveyance', 'pricing-strategy'],
  },
  {
    slug: 'pricing-strategy',
    title: 'Pricing Strategy Guide',
    description: 'Understanding market pricing, competitive analysis, and strategic list price decisions.',
    video: { fileName: 'pricing-strategy.mp4', posterFileName: 'pricing-strategy.webp', durationSeconds: 67 },
    relatedSlugs: ['capital-gains', 'lender-driven-repairs', 'photography-prep'],
  },
  {
    slug: 'sellers-disclosure',
    title: "Seller's Disclosure Guide",
    description: 'Texas real estate disclosure requirements and seller obligations for transparency.',
    video: { fileName: 'sellers-disclosure.mp4', posterFileName: 'sellers-disclosure.webp', durationSeconds: 126 },
    relatedSlugs: ['t47-survey', 'property-conveyance', 'lender-driven-repairs'],
  },
  {
    slug: 'showings-with-pets',
    title: 'Showings with Pets Guide',
    description: 'Best practices for managing pets during property showings and buyer visits.',
    video: { fileName: 'showings-with-pets.mp4', posterFileName: 'showings-with-pets.webp', durationSeconds: 112 },
    relatedSlugs: ['access-and-showings', 'photography-prep', 'how-to-attach-a-lockbox'],
  },
  {
    slug: 'property-conveyance',
    title: "What's Included in a Home Sale",
    description: 'Learn what items typically stay with the property when you sell.',
    video: { fileName: 'property-conveyance.mp4', posterFileName: 'property-conveyance.webp', durationSeconds: 126 },
    relatedSlugs: ['sellers-disclosure', 'square-footage', 't47-survey'],
  },
  {
    slug: 'square-footage',
    title: 'What Counts as Square Footage',
    description: "Learn what areas can and cannot be included when calculating your property's square footage.",
    video: { fileName: 'allowable-square-footage.mp4', posterFileName: 'allowable-square-footage.webp', durationSeconds: 122 },
    relatedSlugs: ['photography-prep', 'property-conveyance', 'pricing-strategy'],
  },
  {
    slug: 't47-survey',
    title: 'Understanding Your T-47 Survey',
    description: 'Learn about your property survey and why it matters for your home sale.',
    video: { fileName: 'understanding-t47.mp4', posterFileName: 'understanding-t47.webp', durationSeconds: 97 },
    relatedSlugs: ['sellers-disclosure', 'property-conveyance', 'square-footage'],
  },
  {
    slug: 'capital-gains',
    title: 'About Capital Gains',
    description: 'Important information about potential capital gains tax implications when selling your property.',
    video: { fileName: 'about-capital-gains.mp4', posterFileName: 'about-capital-gains.webp', durationSeconds: 69 },
    relatedSlugs: ['pricing-strategy', 'lender-driven-repairs', 'sellers-disclosure'],
  },
  {
    slug: 'lender-driven-repairs',
    title: 'Lender-Driven Repairs Guide',
    description: "Understanding your obligations for repairs required by a buyer's lender for loan approval.",
    video: { fileName: 'lender-driven-repairs.mp4', durationSeconds: 90 },
    relatedSlugs: ['pricing-strategy', 'capital-gains', 'sellers-disclosure'],
  },
  {
    slug: 'how-to-attach-a-lockbox',
    title: 'How to Attach a Lockbox',
    description: 'Step-by-step guide to installing your lockbox for secure property access during showings.',
    relatedSlugs: ['access-and-showings', 'showings-with-pets', 'photography-prep'],
  },
];

/** Map of slug → resource for quick lookups */
export const resourcesBySlug: Record<string, SellingResource> = Object.fromEntries(
  SELLING_RESOURCES.map((r) => [r.slug, r])
);

/** All valid slugs for generateStaticParams */
export const validSlugs = SELLING_RESOURCES.map((r) => r.slug);

/** Build full Supabase URL for a video or poster file */
export function assetUrl(fileName: string): string {
  return `${SUPABASE_ASSETS_BASE}/${fileName}`;
}

/** Format seconds as "M:SS" */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds (unused file is fine — no imports yet)

- [ ] **Step 3: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/resources.ts
git commit -m "feat(selling-resources): add resource metadata registry"
```

---

### Task 2: VideoPlayer Component

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/components/VideoPlayer.tsx`

- [ ] **Step 1: Create the VideoPlayer component**

```tsx
// ABOUTME: HTML5 video player for selling resource pages
// ABOUTME: Renders responsive video with poster image from Supabase storage

import { assetUrl } from '../resources';

interface VideoPlayerProps {
  fileName: string;
  posterFileName?: string;
  title: string;
}

export function VideoPlayer({ fileName, posterFileName, title }: VideoPlayerProps) {
  return (
    <video
      controls
      preload="metadata"
      poster={posterFileName ? assetUrl(posterFileName) : undefined}
      className="w-full rounded-xl"
      aria-label={title}
    >
      <source src={assetUrl(fileName)} type="video/mp4" />
      Your browser does not support the video element.
    </video>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/components/VideoPlayer.tsx
git commit -m "feat(selling-resources): add VideoPlayer component"
```

---

### Task 3: ResourceCard Component

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/components/ResourceCard.tsx`

Reference: The `PersonaGrid` component in `app/(direct-list)/direct-list/for/PersonaGrid.tsx` uses `useBrandPath()` for link hrefs. `ResourceCard` is a server component, so it cannot use hooks. Instead, accept an `href` prop. The parent (which is a client component if it needs `bp()`, or a server component passing static paths) builds the full href.

Since the hub page and related resources section both live inside `(direct-list)` routes where the path is `/direct-list/selling-resources/[slug]`, and the card needs to be a link, we have two options:
- Make the card a client component using `useBrandPath`
- Keep the card as a server component and pass the full href

The card itself has no interactivity beyond being a link, so keep it as a server component. The hub page and RelatedResources wrapper will be client components that pass the `bp()`-resolved href.

- [ ] **Step 1: Create the ResourceCard component**

```tsx
// ABOUTME: Card component for selling resource hub grid and related resources section
// ABOUTME: Displays poster thumbnail, title, description, and video/written badge

import Image from 'next/image';
import Link from 'next/link';
import { assetUrl, formatDuration } from '../resources';
import type { SellingResource } from '../resources';

interface ResourceCardProps {
  resource: SellingResource;
  href: string;
}

export function ResourceCard({ resource, href }: ResourceCardProps) {
  const hasVideo = !!resource.video;

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail area */}
      {hasVideo && resource.video?.posterFileName ? (
        <div className="relative aspect-video bg-primary/5">
          <Image
            src={assetUrl(resource.video.posterFileName)}
            alt={resource.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-video bg-primary/10 flex items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-primary mb-1">{resource.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {resource.description}
        </p>
        <span className="text-xs font-medium text-secondary">
          {hasVideo
            ? `Video ${formatDuration(resource.video!.durationSeconds)} + Guide`
            : 'Written Guide'}
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/components/ResourceCard.tsx
git commit -m "feat(selling-resources): add ResourceCard component"
```

---

### Task 4: RelatedResources Component

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/components/RelatedResources.tsx`

This component is a client component because it needs `useBrandPath()` to build correct hrefs for the ResourceCards.

- [ ] **Step 1: Create the RelatedResources component**

```tsx
// ABOUTME: "You might also find helpful" section for individual resource pages
// ABOUTME: Renders 3 related ResourceCards based on hand-curated relatedSlugs

'use client';

import { useBrandPath } from '@/lib/BrandProvider';
import { resourcesBySlug } from '../resources';
import { ResourceCard } from './ResourceCard';

interface RelatedResourcesProps {
  slugs: string[];
}

export function RelatedResources({ slugs }: RelatedResourcesProps) {
  const bp = useBrandPath();

  const resources = slugs
    .map((slug) => resourcesBySlug[slug])
    .filter(Boolean);

  if (resources.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-6 text-center">
        You Might Also Find Helpful
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.slug}
            resource={resource}
            href={bp(`/direct-list/selling-resources/${resource.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/components/RelatedResources.tsx
git commit -m "feat(selling-resources): add RelatedResources component"
```

---

## Chunk 2: Pages and Footer

### Task 5: Hub Page

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/page.tsx`

The hub page must be a client component (or contain a client component) to use `useBrandPath()` for card links. Strategy: make the page itself a server component with metadata export, and extract the card grid into a client wrapper.

Actually, looking at the pattern in `app/(direct-list)/direct-list/for/page.tsx` which uses a separate `PersonaGrid` client component — follow the same pattern. The page is a server component that imports a client grid component.

- [ ] **Step 1: Create a ResourceGrid client component**

Create `app/(direct-list)/direct-list/selling-resources/components/ResourceGrid.tsx`:

```tsx
// ABOUTME: Client component for the selling resources hub page card grid
// ABOUTME: Uses useBrandPath to generate correct links on both access.realty and direct-list.com

'use client';

import { useBrandPath } from '@/lib/BrandProvider';
import { SELLING_RESOURCES } from '../resources';
import { ResourceCard } from './ResourceCard';

export function ResourceGrid() {
  const bp = useBrandPath();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SELLING_RESOURCES.map((resource) => (
        <ResourceCard
          key={resource.slug}
          resource={resource}
          href={bp(`/direct-list/selling-resources/${resource.slug}`)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create the hub page**

```tsx
// ABOUTME: Hub page listing all selling resources in a flat card grid
// ABOUTME: Entry point linked from DirectListFooter navigation

import { Metadata } from 'next';
import { HeroSection, Section, DirectListCTA } from '@/components/layout';
import { ResourceGrid } from './components/ResourceGrid';

export const metadata: Metadata = {
  title: 'Selling Resources | DirectList',
  description:
    'Expert guides and videos to help you navigate every step of selling your home with confidence.',
};

export default function SellingResourcesPage() {
  return (
    <>
      <HeroSection maxWidth="4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Selling Resources
        </h1>
        <p className="text-lg text-primary-foreground/80">
          Expert guides and videos to help you sell with confidence.
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="5xl">
        <ResourceGrid />
      </Section>

      <DirectListCTA />
    </>
  );
}
```

- [ ] **Step 3: Start dev server and verify page renders**

Run: `npm run dev`
Visit: `http://localhost:4000/direct-list/selling-resources`
Expected: Hero with title, grid of 11 cards with thumbnails/placeholders, CTA section, footer

- [ ] **Step 4: Screenshot and visually verify**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-hub.png --window-size=1400,900 "http://localhost:4000/direct-list/selling-resources"
```

Verify: Navy hero, cream content section, cards in 3-column grid, no alternating backgrounds, CTA flows into footer.

- [ ] **Step 5: Verify production build passes**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/page.tsx app/(direct-list)/direct-list/selling-resources/components/ResourceGrid.tsx
git commit -m "feat(selling-resources): add hub page with resource card grid"
```

---

### Task 6: Individual Resource Page (Dynamic Route)

**Files:**
- Create: `app/(direct-list)/direct-list/selling-resources/[slug]/page.tsx`

This page uses `generateStaticParams` and `generateMetadata` following the pattern in `app/(direct-list)/direct-list/for/[slug]/page.tsx`. The article content section uses placeholder text until Descript scripts are provided.

- [ ] **Step 1: Create the dynamic route page**

```tsx
// ABOUTME: Individual selling resource page with article-first layout and embedded video
// ABOUTME: Uses generateStaticParams for static generation, notFound() for unknown slugs

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HeroSection, Section, DirectListCTA } from '@/components/layout';
import { resourcesBySlug, validSlugs, assetUrl } from '../resources';
import { VideoPlayer } from '../components/VideoPlayer';
import { RelatedResources } from '../components/RelatedResources';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourcesBySlug[slug];

  if (!resource) {
    return { title: 'Page Not Found | DirectList' };
  }

  const canonicalUrl = `https://direct-list.com/selling-resources/${slug}`;

  return {
    title: `${resource.title} | DirectList Selling Resources`,
    description: resource.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${resource.title} | DirectList Selling Resources`,
      description: resource.description,
      url: canonicalUrl,
      siteName: 'DirectList by Access Realty',
      type: 'article',
      locale: 'en_US',
      ...(resource.video?.posterFileName && {
        images: [assetUrl(resource.video.posterFileName)],
      }),
    },
  };
}

export default async function SellingResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = resourcesBySlug[slug];

  if (!resource) {
    notFound();
  }

  return (
    <>
      <HeroSection maxWidth="3xl">
        <Link
          href="/direct-list/selling-resources"
          className="text-sm text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors mb-3 inline-block"
        >
          &larr; Selling Resources
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
          {resource.title}
        </h1>
        <p className="text-lg text-primary-foreground/80">{resource.description}</p>
      </HeroSection>

      <Section variant="content" maxWidth="3xl">
        <div className="space-y-6">
          {/* Placeholder article content — replace with Descript script content */}
          <p className="text-base text-muted-foreground leading-relaxed">
            {resource.description} This guide walks you through everything you need to know.
          </p>

          {resource.video && (
            <div className="my-8">
              <VideoPlayer
                fileName={resource.video.fileName}
                posterFileName={resource.video.posterFileName}
                title={resource.title}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Watch the full guide ({Math.floor(resource.video.durationSeconds / 60)}:
                {(resource.video.durationSeconds % 60).toString().padStart(2, '0')})
              </p>
            </div>
          )}

          {/* Placeholder for additional article content */}
          <p className="text-base text-muted-foreground leading-relaxed">
            More detailed content will be added from the Descript video scripts.
          </p>
        </div>
      </Section>

      <Section variant="content" maxWidth="5xl">
        <RelatedResources slugs={resource.relatedSlugs} />
      </Section>

      <DirectListCTA />
    </>
  );
}
```

- [ ] **Step 2: Start dev server and verify a resource page renders**

Run: `npm run dev`
Visit: `http://localhost:4000/direct-list/selling-resources/photography-prep`
Expected: Navy hero with breadcrumb link + title, cream article section with placeholder text, video player, related resources cards, CTA

- [ ] **Step 3: Verify breadcrumb link navigates back to hub**

Click the "← Selling Resources" link in the hero. It should navigate to `/direct-list/selling-resources`.

- [ ] **Step 4: Verify notFound works for invalid slugs**

Visit: `http://localhost:4000/direct-list/selling-resources/nonexistent-slug`
Expected: Next.js 404 page

- [ ] **Step 5: Screenshot and visually verify**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-detail.png --window-size=1400,900 "http://localhost:4000/direct-list/selling-resources/photography-prep"
```

Verify: Navy hero with breadcrumb, article text, video player with poster image, related resources section, CTA flows into footer. No alternating backgrounds.

- [ ] **Step 6: Verify production build passes**

Run: `npm run build`
Expected: Build succeeds. All 11 slugs should appear in the build output as statically generated pages.

- [ ] **Step 7: Commit**

```bash
git add app/(direct-list)/direct-list/selling-resources/[slug]/page.tsx
git commit -m "feat(selling-resources): add individual resource page with video and related resources"
```

---

### Task 7: Footer Link

**Files:**
- Modify: `components/direct-list/DirectListFooter.tsx` (navigation `<ul>`, after FAQ link)

- [ ] **Step 1: Add the Selling Resources link to the footer**

In `components/direct-list/DirectListFooter.tsx`, add a new `<li>` after the FAQ link (line 73) and before the Privacy Policy link:

```tsx
              <li>
                <Link
                  href={bp("/direct-list/selling-resources")}
                  className="hover:text-secondary transition-colors"
                >
                  Selling Resources
                </Link>
              </li>
```

- [ ] **Step 2: Verify the footer link appears and navigates correctly**

Run: `npm run dev`
Visit: `http://localhost:4000/direct-list`
Scroll to footer. Verify "Selling Resources" appears after FAQ. Click it — should navigate to `/direct-list/selling-resources`.

- [ ] **Step 3: Verify production build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add components/direct-list/DirectListFooter.tsx
git commit -m "feat(selling-resources): add Selling Resources link to DirectList footer"
```

---

### Task 8: Final Visual Review and Build Verification

- [ ] **Step 1: Run full production build**

Run: `npm run build`
Expected: Build succeeds with no errors. Check output for all 11 selling-resources pages being statically generated.

- [ ] **Step 2: Screenshot hub page**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-final-hub.png --window-size=1400,900 "http://localhost:4000/direct-list/selling-resources"
```

Verify: Consistent with site design system — navy hero, cream sections, white cards, no background alternation.

- [ ] **Step 3: Screenshot a video resource page**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-final-video.png --window-size=1400,900 "http://localhost:4000/direct-list/selling-resources/pricing-strategy"
```

Verify: Article-first layout, video embedded mid-content, related resources at bottom, CTA flows into footer.

- [ ] **Step 4: Screenshot the lockbox page (no video)**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-final-lockbox.png --window-size=1400,900 "http://localhost:4000/direct-list/selling-resources/how-to-attach-a-lockbox"
```

Verify: Same layout as video pages but without the video player. Article content and related resources still present.

- [ ] **Step 5: Screenshot footer**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/selling-resources-final-footer.png --window-size=1400,900 "http://localhost:4000/direct-list/faq"
```

Scroll to verify "Selling Resources" link is visible in footer navigation.

- [ ] **Step 6: Run lint**

Run: `npm run lint`
Expected: No lint errors
