# Company-Wide Closed Listings Map

## Overview

Add a company-wide map showing all closed transactions from all staff members on the Our Team page.

## Location

Bottom of `/our-team` page, below the staff grid, as a "collective track record" section.

## Stats Display

Combined format: "X transactions · $YM total volume"

## Data Sources

1. `mls_listings` - closed deals where staff `member_key` matches `list_agent_key`, `co_list_agent_key`, or `buyer_agent_key`
2. `staff_imported_listings` - historical deals joined with `parcels` for coordinates

## Staff Inclusion

All staff in the `staff` table.

TODO: May need to filter by `is_active` flag in the future.

## Deduplication Policy

**No deduplication by address.** A house transacted multiple times (e.g., bought in 2020, sold in 2024) counts as two transactions. Visual overlap is acceptable - deck.gl handles this with opacity.

## Data Fetching

Batched queries for efficiency:

1. Single query: get all staff IDs and member_keys
2. Single query: `mls_listings` with `WHERE list_agent_key IN (...) OR buyer_agent_key IN (...)`
3. Single query: `staff_imported_listings WHERE staff_id IN (...)`

## Files

- `lib/listings.ts` - add `getCompanyClosedListings()` function
- `components/listings/CompanyClosedListingsSection.tsx` - new server component
- `app/(home)/our-team/page.tsx` - add section at bottom

## Component Reuse

Uses existing `DeckGLListingsMap` component unchanged.

## Caching

`revalidate = 3600` (1 hour) consistent with other staff pages.
