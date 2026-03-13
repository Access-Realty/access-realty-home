# Direct-List Long-Tail SEO Property Pages — Design Document

> **Date:** 2026-03-12
> **Status:** Approved
> **Repo:** `access-realty-seo` (new, third repo)
> **Domain:** `direct-list.com`

---

## 1. Mission

Create individual property landing pages targeting DFW homeowners searching "what's my house worth." Pages provide free value (property data, comps, market stats) while promoting DirectList's flat-fee listing service. Build 20K pages/month for 6 months, driven by utility disconnect data and preferred zip codes. Ultimate coverage: 2.2M properties across 5 DFW counties.

---

## 2. Architecture

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Repo | `access-realty-seo` (new) | Clean separation from marketing + app |
| Framework | Astro (hybrid mode) | Static-first with on-demand SSR; islands for interactivity |
| Domain | `direct-list.com` | Independent brand for the new real estate model |
| Hosting | Vercel | Consistent with other repos; edge caching |
| Database | Shared Supabase | Same instance as app + marketing |
| Email | Resend | Already in tech stack |
| Rendering | SSR + CDN cache | Cost scales flat, not linearly with page count |
| Interactive components | React islands | Net proceeds calc, AVM request, email signup, map |
| Lead management | App repo CRM | SEO repo captures leads; app repo manages lifecycle |

### Rendering Strategy

Pages render server-side on first request, then cache at Vercel's edge CDN. Cron jobs invalidate cache when underlying data changes. This avoids rebuilding hundreds of thousands of static files and keeps costs flat as page count grows.

- Hub pages: 7-day cache TTL, invalidated weekly when market stats refresh
- Property pages: 30-day cache TTL, invalidated monthly when comps refresh
- New pages from the build queue are live instantly — no full site redeploy needed

---

## 3. Data Sources & Costs

| Data | Source | Cost | When Fetched |
|------|--------|------|-------------|
| Property specs | TaxNetUSA | ~$1K / 5 counties | Pre-loaded at page build time |
| Recently sold comps | NTREIS (replicated DB) | Free | Server render, cached |
| Market aggregates | NTREIS (replicated DB) | Free | Weekly cron computes stats |
| Newly listed nearby | NTREIS (replicated DB) | Free | Monthly subscriber emails |
| AVM estimate | BatchData API | 20K/month budget | On-demand, email-gated |
| Closed deals (team) | `mls_listings` table | Free | Queried at render, cached |

### BatchData Budget Management

The AVM is not fetched until a visitor provides their email. This gates the BatchData cost to actual conversions rather than page builds. At 20K records/month, the budget aligns with page build velocity. If traction justifies it, renegotiate to bulk purchase with quarterly/annual delta files.

---

## 4. Database — New Tables

### `seo_build_queue`

Tracks which properties need pages built. FK to `parcels`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `parcel_id` | uuid | FK to parcels |
| `source` | text | `utility_disconnect` or `preferred_zip` |
| `priority` | int | Build priority (lower = sooner) |
| `status` | text | `pending`, `built`, `failed` |
| `built_at` | timestamp | When page was first built |
| `created_at` | timestamp | When added to queue |

### `seo_subscribers`

Email subscribers requesting market updates.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | Subscriber email |
| `parcel_id` | uuid | FK to parcels (the property they care about) |
| `cadence` | text | `monthly` or `quarterly` |
| `next_report_date` | date | Computed from subscribe date + cadence |
| `subscribed_at` | timestamp | When they signed up |
| `unsubscribed_at` | timestamp | Null if active |

### `seo_content_blocks`

Geographic content templates with spin syntax.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `geo_type` | text | `county`, `city`, `zip`, `school_district` |
| `geo_id` | text | Identifier (e.g., "76111", "arlington") |
| `block_name` | text | Block identifier (e.g., "market_narrative") |
| `content_template` | text | Content with `{variant1|variant2}` spin syntax |
| `version` | int | Incremented on editorial updates |
| `updated_at` | timestamp | Last editorial update |

### `market_stats`

Precomputed market aggregates from NTREIS data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `geo_type` | text | `county`, `city`, `zip` |
| `geo_id` | text | Geographic identifier |
| `period` | text | e.g., "2026-03" |
| `median_sale_price` | int | Median closed sale price |
| `avg_dom` | int | Average days on market |
| `months_of_supply` | float | Inventory absorption rate |
| `pct_list_price_received` | float | Sale-to-list ratio |
| `active_inventory` | int | Current active listing count |
| `closed_last_30` | int | Closings in last 30 days |
| `closed_last_90` | int | Closings in last 90 days |
| `computed_at` | timestamp | When stats were computed |

---

## 5. URL Hierarchy

```
direct-list.com/home-values/                          → DFW overview hub
direct-list.com/home-values/tarrant-county/           → County hub
direct-list.com/home-values/arlington/                → City hub
direct-list.com/home-values/76111/                    → Zip hub
direct-list.com/home-values/76111/2113-bird-st/       → Property page
direct-list.com/home-values/how-comps-work            → Educational pillar
```

### Why Flat (Not Nested)

Counties, cities, and zip codes are **sibling paths**, not nested. Geographic entities don't nest cleanly:

- A city can span multiple counties (Fort Worth spans Tarrant, Denton, Parker, Johnson)
- A zip code can span multiple cities (76244 covers Keller, Fort Worth, and Watauga)
- A county contains parts of many cities and many zips

The only truly 1:1 relationship is **property → zip code**, so property pages nest under their zip. Everything else is flat and **cross-linked** rather than hierarchically nested.

Namespacing is natural: zips are numbers, cities are words, counties end in "-county". No collisions.

### Breadcrumbs

Breadcrumbs use **contextual peer tags** (· separator) rather than hierarchical paths (/ separator):

```
Home Values · 76111 · 2113 Bird St · Fort Worth · Tarrant County
```

Each tag is a link to its hub page. No implied parent-child relationship. A zip hub can list multiple cities; a city hub can list multiple counties if it crosses boundaries.

---

## 6. Content Hierarchy & Spin System

### Geographic Content Blocks

Multiple editorial variants per block, plus embedded spin syntax within each variant. Resolved deterministically per page using address hash as seed — same page always renders the same copy.

| Level | Count | Block Types |
|-------|-------|------------|
| County | ~5 | Tax context, market overview |
| City | ~60 | Economic narrative, lifestyle, demographics |
| Zip code | ~400 | Micro-market narrative, price trends |
| School district | ~40 | School quality, family appeal |

### Spin Syntax Format

```
{The median sale price|Homes in this area have sold at a median price|The typical closing price}
of {$X|around $X} {over the past {year|12 months}|since {month} {year}},
{reflecting|representing|marking} a {X%|roughly X%} {increase|gain|rise}
{compared to|over|versus} the prior year.
```

### Spin Resolution Rules

- **Deterministic:** Address hash seeds variant selection. Rebuild only changes copy when content blocks are editorially updated.
- **Human-authored:** Every option in every spin set is written by a person. No AI generation without editorial review.
- **QA validation:** At build time, sample spin resolutions are logged. Flag blocks with < 50 unique resolutions.

### Hub Pages (Not Spun)

Hub pages at county, city, and zip levels use full-length unique editorial content — not spun. These are the topical authority anchors. They include:
- Market stats charts (median price trend, DOM trend, inventory)
- Recently sold tables
- Interactive closed deals map (Deck.gl React island)
- Links down to property pages or child hubs

---

## 7. Property Page Template

Top to bottom:

1. **Breadcrumbs** — Home Values > Arlington > 76111 > 2113 Bird St (BreadcrumbList schema)
2. **Hero** — Address, key specs from tax data (beds, baths, sqft, year built, lot size), CTA: "Get Your Home's Estimated Value" (email-gated AVM)
3. **Property details** — Tax assessment value, specs grid, annual taxes
4. **Property tax protest** — TODO (separately scoped project)
5. **Recently sold near you** — 3-5 NTREIS closed sales, mini-map, brief comp methodology note linking to pillar page
6. **Geographic content blocks** (spun) — Zip + City + School district + County narratives
7. **Market snapshot** — Key stats from `market_stats` table: median price, DOM, market temperature (seller's/balanced/buyer's), inventory
8. **Our Track Record** — Map of your team's closed deals in this geographic area (static image on property pages, interactive on hub pages)
9. **Net proceeds calculator** (React island) — Pre-fills AVM if unlocked; shows DirectList flat-fee savings vs. 3% commission
10. **DirectList CTA** — Voice-guide aligned; "pricing strategy from a seasoned professional included"
11. **Email signup** (React island) — Monthly or quarterly market updates, cadence selector
12. **Footer** — AVM disclaimer, Fair Housing notice, DirectList branding

---

## 8. AVM Gating & Lead Capture

### What's Public (Indexed, Rankable)

- Property specs from tax data
- Recently sold comps from NTREIS
- Geographic content blocks
- Market stats
- Net proceeds calculator
- Closed deals map

### What's Email-Gated

- Fresh AVM from BatchData (fetched on demand when visitor provides email)
- Monthly/quarterly market update subscription
- Detailed comp analysis

### AVM Framing

AVMs are positioned honestly: a starting point, not gospel. The page acknowledges that no AVM can account for the home's condition, upgrades, or unique features. When the homeowner is ready for a real pricing strategy, DirectList includes professional guidance — not as an upsell, but as a core part of the service.

---

## 9. SEO Infrastructure

### Sitemaps

Tiered sitemap index:
- `sitemap-hubs.xml` — County, city, zip, school district pages (~600 URLs, priority 0.9)
- `sitemap-properties-N.xml` — Property pages batched 10K per file (priority 0.6)
- Regenerated daily by cron when new pages are built

### Schema Markup (Per Property Page)

- `BreadcrumbList` — Full path: Home Values → County → City → Zip → Address
- `RealEstateAgent` — DirectList business entity
- `PostalAddress` — Structured address data

### Internal Linking

- Property pages link UP: zip hub → city hub → county hub
- Hub pages link DOWN to recently built property pages
- Hub pages cross-link to school district pages
- Every property page links to the comp methodology pillar page

### Monitoring

- Google Search Console: watch "Discovered - not indexed" trends
- If Google starts ignoring pages, tighten content quality before adding volume
- Track rankings and traffic by tier (hub vs. property)

---

## 10. Cron Jobs

| Cron | Frequency | Purpose |
|------|-----------|---------|
| `refresh-market-stats` | Weekly | Query NTREIS, compute aggregates per geo, write to `market_stats` |
| `invalidate-hub-cache` | Weekly (after stats) | Purge CDN cache for hub pages |
| `invalidate-property-cache` | Monthly | Purge CDN cache for property pages with new comps |
| `build-new-pages` | Daily | Process `seo_build_queue`, load tax data for new parcels |
| `send-subscriber-reports` | Daily | Check `next_report_date <= today`, query NTREIS, send via Resend, advance date |
| `regenerate-sitemaps` | Daily (after build) | Add new property URLs to sitemap files |

---

## 11. Lead Flow

```
Visitor lands on property page (organic search)
  → Sees free content: specs, comps, market data, calculator
  → Clicks "Get Your Home's Estimated Value"
  → Provides email
  → AVM fetched from BatchData, displayed immediately
  → Selects monthly/quarterly market updates
  → Subscriber record created in seo_subscribers
  → Receives periodic email via Resend:
      - Recently sold in their area
      - Newly listed nearby
      - Market trend data for their zip/city
      - DirectList CTA in every email
  → When ready: clicks through to DirectList get-started wizard
  → Lead managed in app repo CRM
```

---

## 12. Voice & Tone

All page copy follows the [DirectList Voice Guide](../../DIRECTLIST-VOICE-GUIDE.md):

- Lead with their situation, not ours
- Empower, don't rescue
- Smart, not cheap
- The math speaks
- Help is available, never required

---

## 13. Closed Deals Map

Property pages display a static map image of the team's closed transactions in the relevant geography. Hub pages display the full interactive Deck.gl map.

Data source: `mls_listings` where listing/buyer agent matches staff `member_mls_id` values, filtered by geography and closed status. Existing `DeckGLListingsMap.tsx` pattern from the marketing repo provides the proven implementation — ported as a React island for Astro.

Color-coded by transaction side: navy (listing), light blue (buyer), green (off-market).

---

## 14. Phase 1 Scope (Months 1-6)

**In scope:**
- All geographic content blocks authored (counties, cities, zips, school districts)
- Property page template fully built
- Build queue processing 20K/month (utility disconnect + preferred zips)
- Email subscription and report pipeline live (Resend)
- Hub pages for all geographies live
- AVM gating functional (BatchData on-demand)
- Net proceeds calculator functional
- Closed deals map on hub pages (static image on property pages)
- Sitemap generation and SEO infrastructure
- Schema markup on all pages

**Separately scoped:**
- Property tax protest tools/content
- Comp methodology pillar page (content project)
- Build queue population system (utility disconnect data pipeline)

---

## 15. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Astro (hybrid mode) |
| Interactive islands | React |
| Styling | Tailwind CSS v4 |
| Maps | Deck.gl + MapLibre GL |
| Database | Supabase (shared) |
| Email | Resend |
| Hosting | Vercel |
| Cron | Vercel Cron or Supabase pg_cron |
| AVM API | BatchData |
| Property data | TaxNetUSA |
| MLS data | NTREIS (replicated) |

---

## 16. Prototypes

Live prototypes are deployed on `access.realty` under the `(prototypes)` route group. These pages are **not indexed** (noindex meta tag + excluded from sitemap).

### Prototype URLs

| Page Type | URL |
|-----------|-----|
| DFW Overview Hub | `access.realty/home-values` |
| County Hub | `access.realty/home-values/tarrant-county` |
| City Hub | `access.realty/home-values/arlington` |
| Zip Hub | `access.realty/home-values/76017` |
| Property: Arlington | `access.realty/home-values/76017/4605-brentgate-ct` |
| Property: Celina | `access.realty/home-values/75009/716-corner-post-path` |
| Property: Fort Worth | `access.realty/home-values/76111/2113-bird-st` |
| Property: Hurst | `access.realty/home-values/76053/4821-weyland-dr` |

### Prototype Notes

- Uses real parcel data from BatchData (fetched into both staging and prod)
- Market stats and comps are hardcoded placeholders (real data pipeline not built yet)
- Map sections are placeholders (Deck.gl integration pending)
- Net proceeds calculator is static (React island interactivity pending)
- AVM email gate is visual only (no form submission wired)
- All pages use the existing marketing repo layout components (HeroSection, Section, DirectListCTA)
- Final implementation will be in `access-realty-seo` repo using Astro, not Next.js

---

## Related Documents

- [DirectList Voice Guide](../../DIRECTLIST-VOICE-GUIDE.md)
- [Landing Page Templates](../../LANDING-PAGE-TEMPLATES.md)
- [Marketing Handoff](../../MARKETING-HANDOFF.md)
- [Marketing Handoff](../../MARKETING-HANDOFF.md)
