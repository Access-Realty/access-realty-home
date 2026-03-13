# Selling Resources — Design Spec

## Overview

Add a "Selling Resources" section to the DirectList brand: a hub page linking to 11 individual resource pages. Ten pages feature educational videos (already in Supabase storage) with written content adapted from Descript scripts. One page is a standalone written guide (lockbox installation). The goal is SEO value and brand credibility.

## Scope

- **Hub page** at `/direct-list/selling-resources`
- **11 resource pages** at `/direct-list/selling-resources/[slug]`
- **Footer link** added to DirectListFooter
- **Video player component** for embedding Supabase-hosted videos
- **Related resources** component for cross-linking between pages

### Out of Scope

- Access Realty brand versions of these pages (separate domain/effort)
- Category grouping or timeline organization (revisit when library exceeds ~30 items)
- Contract negotiation guide (future)

## Routes and File Structure

All pages live inside the existing `(direct-list)` layout group:

```
app/(direct-list)/direct-list/selling-resources/
├── page.tsx                        # Hub page
├── [slug]/
│   └── page.tsx                    # Individual resource page (dynamic route)
├── resources.ts                    # Resource metadata registry
└── components/
    ├── ResourceCard.tsx            # Card used on hub + "related" section
    ├── VideoPlayer.tsx             # HTML5 video with poster support
    └── RelatedResources.tsx        # "You might also find helpful" section
```

### Rendering Strategy

The `[slug]` route uses `generateStaticParams` to statically generate all pages at build time (matching the pattern used by `/direct-list/for/[slug]`). Unknown slugs return `notFound()`.

## Resource Metadata Registry (`resources.ts`)

A single registry defines all resources. Each entry contains:

```ts
interface SellingResource {
  slug: string;              // URL slug, e.g. "photography-prep"
  title: string;             // Page title
  description: string;       // Short description for cards and meta
  video?: {
    fileName: string;        // Matches Supabase public-assets path
    posterFileName?: string; // Poster/thumbnail image
    durationSeconds: number;
  };
  relatedSlugs: string[];    // 3 slugs for "related resources" section
}
```

Video and poster URLs use a local constant for the Supabase base URL:

```ts
const SUPABASE_ASSETS_BASE = 'https://hvbicnpvactgxzprnygc.supabase.co/storage/v1/object/public/public-assets';
```

This constant lives in `resources.ts` alongside the registry. No cross-repo import.

### Resource Inventory

| # | Slug | Title | Has Video | Duration |
|---|------|-------|-----------|----------|
| 1 | `access-and-showings` | Access and Showings Guide | Yes | 1:25 |
| 2 | `photography-prep` | Photography Preparation Guide | Yes | 2:55 |
| 3 | `pricing-strategy` | Pricing Strategy Guide | Yes | 1:07 |
| 4 | `sellers-disclosure` | Seller's Disclosure Guide | Yes | 2:06 |
| 5 | `showings-with-pets` | Showings with Pets Guide | Yes | 1:52 |
| 6 | `property-conveyance` | What's Included in a Home Sale | Yes | 2:06 |
| 7 | `square-footage` | What Counts as Square Footage | Yes | 2:02 |
| 8 | `t47-survey` | Understanding Your T-47 Survey | Yes | 1:37 |
| 9 | `capital-gains` | About Capital Gains | Yes | 1:09 |
| 10 | `lender-driven-repairs` | Lender-Driven Repairs Guide | Yes | 1:30 |
| 11 | `how-to-attach-a-lockbox` | How to Attach a Lockbox | No | — |

## Hub Page Design

**Route:** `/direct-list/selling-resources`

**Structure** (follows mandatory page pattern):

1. **HeroSection** (navy) — title: "Selling Resources", subtitle framing these as expert guides for confident selling
2. **Section** (cream, `maxWidth="5xl"`) — flat grid of `ResourceCard` components, 3 columns on desktop, 2 on tablet, 1 on mobile
3. **DirectListCTA** — standard CTA before footer

### ResourceCard

Each card displays:
- Video poster thumbnail (for video resources) or a navy-tinted placeholder with a relevant icon (for written-only resources like the lockbox page — use a simple SVG icon on a `bg-primary/10` background)
- Title
- Short description (1-2 sentences)
- Badge: "Video + Guide" or "Written Guide"

Cards link to the individual resource page.

## Individual Resource Page Design

**Route:** `/direct-list/selling-resources/[slug]`

**Structure:**

1. **HeroSection** (navy) — breadcrumb link ("Selling Resources" as a `<Link>` back to `/direct-list/selling-resources`), page title, one-line subtitle
2. **Section** (cream) — article content in a narrow container (`max-w-3xl`):
   - Opening paragraphs (adapted from Descript script)
   - Subheadings breaking content into scannable sections
   - **VideoPlayer** embedded mid-article (for pages with video)
   - Continued written content: checklists, tips, key takeaways
3. **RelatedResources** section (cream) — "You Might Also Find Helpful" with 3 `ResourceCard` components
4. **DirectListCTA** — standard CTA before footer

### Article Content

Written content comes from Descript video scripts, adapted for reading:
- Conversational tone following the DirectList Voice Guide
- Structured with subheadings (H2/H3) for scannability and SEO
- Key points surfaced as bullet lists or checklists where appropriate
- The lockbox page follows the same layout, minus the video embed

### VideoPlayer Component

- HTML5 `<video>` element with native controls
- Poster image from Supabase (`posterFileName`)
- Video source from Supabase public-assets bucket
- Responsive: full-width within the `max-w-3xl` article container
- Rounded corners consistent with site card styling (`rounded-xl`)

Video URLs follow the pattern:
```
https://hvbicnpvactgxzprnygc.supabase.co/storage/v1/object/public/public-assets/{fileName}
```

## RelatedResources Component

Displays 3 resource cards below the article. Each resource entry in the registry specifies its `relatedSlugs` — hand-curated, not algorithmic. Uses the same `ResourceCard` component as the hub page.

## SEO

### Per-Page Metadata

Each resource page generates metadata via Next.js `generateMetadata`:
- `title`: resource title + " | DirectList Selling Resources"
- `description`: resource description (from registry)
- `openGraph` image: video poster if available; omit for pages without video (no fallback needed)

### Hub Page Metadata

- `title`: "Selling Resources | DirectList"
- `description`: summary of the resource library

### Content Strategy

Article-first layout ensures Google indexes written content immediately. Videos complement the text but are not the primary content signal. Related resources create internal linking that strengthens the topic cluster.

## Footer Update

Add "Selling Resources" link to `DirectListFooter` navigation column, positioned after existing nav items (Compare Plans, FAQ). Use `bp('selling-resources')` consistent with how existing footer links use the `useBrandPath()` helper.

## Style and Brand Consistency

All pages use:
- Existing layout components: `HeroSection`, `Section`, `DirectListCTA`
- Site color system: navy hero, cream content sections, white cards
- No alternating section backgrounds
- Spacing per LANDING-PAGE-TEMPLATES: `py-12` content sections, `max-w-3xl` for article text
- DirectList Voice Guide for all written content
- Typography consistent with existing DirectList pages

## Content Dependency

Written article content for the 10 video pages depends on Descript scripts (stored in Google Drive). The lockbox page requires original written content. Implementation can proceed with the structural build (components, routing, registry, layout) while content is finalized separately.
