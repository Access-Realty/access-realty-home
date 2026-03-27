# Market Stats Data — SEO Hub Pages

## Overview

Precomputed MLS market statistics for 841 DFW geographies, stored in the shared Supabase database (`hvbicnpvactgxzprnygc`). This data powers the SEO hub pages on direct-list.com.

## Access

All market stats tables have **public read RLS** — query with the anon key, no auth required.

```
Supabase URL: https://hvbicnpvactgxzprnygc.supabase.co
Tables: market_stats_geos, market_stats, market_stats_live
```

## Tables

### market_stats_geos — Geography Reference

841 geos with metadata for page generation and routing.

| Column | Description | Example |
|--------|-------------|---------|
| `geo_type` | `county`, `city`, or `zip` | `city` |
| `geo_id` | Raw MLS value | `Fort Worth` |
| `tier` | `core`, `ring`, or `discovered` | `discovered` |
| `parent_county` | Predominant county for this geo | `Tarrant` |
| `display_name` | Human-readable name | `Fort Worth, TX` |
| `slug` | URL-safe identifier | `fort-worth-tx` |
| `url_path` | Relative path segments (no base prefix) | `tarrant-county-tx/fort-worth` |

**Geo counts:** 15 counties + 280 cities + 546 zips = 841

### URL Path Structure

The `url_path` column stores relative segments. The Astro repo prepends the base prefix (e.g., `/home-values/`).

| Type | url_path | Full URL |
|------|----------|----------|
| County | `tarrant-county-tx` | `/home-values/tarrant-county-tx/` |
| City | `tarrant-county-tx/fort-worth` | `/home-values/tarrant-county-tx/fort-worth/` |
| Zip | `tarrant-county-tx/76111` | `/home-values/tarrant-county-tx/76111/` |
| Property | *(not in DB — built from address)* | `/home-values/123-main-st-tx-76111` |

Cities and zips nest under their predominant county. This supports:
- Breadcrumb navigation (DFW > Tarrant County > Fort Worth)
- Internal linking (county pages link to child cities/zips)
- Topical authority for SEO

### market_stats — Historical Monthly Stats

PK: `(geo_type, geo_id, period)`

Each geo has up to 18 monthly rows (Sep 2024 – Feb 2026) plus two trailing rows.

| Period format | Meaning | Example |
|---------------|---------|---------|
| `YYYY-MM` | Single month stats | `2026-02` |
| `trailing-3mo` | Rolling 3-month weighted averages | Latest 3 months |
| `trailing-12mo` | Rolling 12-month weighted averages + YoY | Latest 12 months |

**Key columns:**

| Column | Description |
|--------|-------------|
| `closed_count` | Sales closed in period |
| `median_sale_price` | Median sale price ($) |
| `median_price_per_sqft` | Median $/sqft |
| `avg_dom` / `median_dom` | Days on market |
| `pct_list_price_received` | Avg sale/list ratio (0.97 = 97%) |
| `pct_over_list` / `pct_under_list` | % of sales above/below original list |
| `yoy_price_change` | Year-over-year median price change (trailing-12mo only) |
| `active_inventory` | Active listings at end of month |
| `pending_inventory` | Listings that went under contract |
| `new_listings` | New listings entering market |
| `months_of_supply` | Inventory / avg monthly closings |
| `pct_with_concessions` | % of sales with seller concessions |
| `avg_concession_amount` | Average concession ($) |
| `avg_concession_pct` | Average concession as % of sale price |

**Refresh:** Monthly, 1st of month at 11:00 AM UTC (after nightly MLS sync).

### market_stats_live — Daily Current Snapshot

PK: `(geo_type, geo_id)` — one row per geo, overwritten nightly.

| Column | Description |
|--------|-------------|
| `active_count` | Currently active listings |
| `pending_count` | Currently pending/under contract |
| `new_last_7_days` | New listings in last 7 days |
| `new_last_30_days` | New listings in last 30 days |
| `median_active_price` | Median list price of active listings |
| `computed_at` | When this snapshot was taken |

**Refresh:** Daily at 10:30 AM UTC (after nightly MLS sync completes).

## Example Queries

### Fetch all data for a single geo page

```sql
-- Geo metadata
SELECT * FROM market_stats_geos WHERE url_path = 'tarrant-county-tx/fort-worth';

-- Historical stats (for charts)
SELECT * FROM market_stats
WHERE geo_type = 'city' AND geo_id = 'Fort Worth'
ORDER BY period;

-- Live snapshot
SELECT * FROM market_stats_live
WHERE geo_type = 'city' AND geo_id = 'Fort Worth';
```

### List all geos under a county (for county page child links)

```sql
SELECT geo_type, geo_id, display_name, url_path
FROM market_stats_geos
WHERE parent_county = 'Tarrant' AND geo_type != 'county'
ORDER BY geo_type, geo_id;
```

### Build sitemap

```sql
SELECT url_path FROM market_stats_geos ORDER BY geo_type, geo_id;
```

## Data Quality Notes

- `list_price / original_list_price` ratios clamped to 0.5–2.0 to exclude MLS data entry errors
- `concessions / list_price` capped at 50% for the same reason
- Trailing "medians" are weighted averages of monthly medians (weighted by closed_count), not true re-computed medians
- Dirty geos (malformed zips, "No City") are excluded from `market_stats_geos`
- The `active_inventory` in monthly stats is a reconstructed end-of-month snapshot; `market_stats_live.active_count` is the real current count

## Refresh Schedule (all UTC)

```
7:00-10:15 AM  — MLS nightly sync (raw data)
10:30 AM       — market_stats_live refresh (daily)
11:00 AM       — market_stats refresh (1st of month only)
```
