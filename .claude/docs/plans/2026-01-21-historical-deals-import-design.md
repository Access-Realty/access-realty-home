# Historical Deals Import Design

## Overview

Import historical closed deals from CSV files (provided by agents) into a dedicated table, enabling richer "track record" displays on agent profile pages. This supplements MLS data which only includes recent history.

## Problem

- Bridge API / MLS data doesn't include older historical deals
- Jennifer Lovett has 41 closed deals from 2012-2021 not in MLS
- Other agents joining will have similar historical data to display

## Solution

Create `agent_historical_deals` table linked to `staff` and `parcels` tables, with a script to import CSV data.

## Database Schema

```sql
CREATE TABLE agent_historical_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  parcel_id UUID REFERENCES parcels(id),

  -- Original MLS reference
  listing_id TEXT NOT NULL,
  mls_name TEXT DEFAULT 'NTREIS',

  -- Deal details
  side TEXT NOT NULL CHECK (side IN ('listing', 'buyer')),
  close_date DATE NOT NULL,
  close_price INTEGER,                    -- dollars

  -- Address components (from Google Geocoding)
  unparsed_address TEXT,
  street_number TEXT,
  street_name TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,

  -- Property specs (nullable, can be enriched later)
  year_built INTEGER,
  bedrooms_total INTEGER,
  bathrooms_total_decimal NUMERIC(3,1),
  living_area INTEGER,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(mls_name, listing_id)
);

CREATE INDEX idx_historical_deals_staff ON agent_historical_deals(staff_id);
CREATE INDEX idx_historical_deals_parcel ON agent_historical_deals(parcel_id);
```

## Import Script

**Location:** `scripts/import-historical-deals.ts`

**Usage:**
```bash
npx tsx scripts/import-historical-deals.ts \
  --csv "/path/to/deals.csv" \
  --staff "jennifer-lovett"
```

**Flow:**
1. Parse CSV file
2. Look up `staff_id` from staff slug/email
3. For each row:
   - Call Google Geocoding API to standardize address
   - Parse response into address components
   - Look up or create parcel via BatchData
   - Determine `side` (listing vs buyer) from agent columns
   - Insert into `agent_historical_deals`
4. Report results: inserted, skipped (duplicates), failed (no geocode)

**CSV Format Expected:**
| Column | Description |
|--------|-------------|
| ML # | Human-readable MLS listing ID |
| Close Date | Date in MM/DD/YYYY format |
| Current Price | Price with $ and commas |
| Year Built | Integer |
| Address | Street address |
| City | City name |
| Postal Code | ZIP code |
| List Agent Full Name | Used to determine side |
| Buyer Agent Full Name | Used to determine side |

## Query Integration

Modify `getClosedDeals()` in `lib/listings.ts` to union both sources:

```typescript
async function getClosedDeals(staffId: string): Promise<ClosedDeal[]> {
  // 1. Get MLS deals (existing logic via agent keys)
  const mlsDeals = await getMlsClosedDeals(agentKeys);

  // 2. Get historical deals with parcel coordinates
  const { data: historicalDeals } = await supabase
    .from('agent_historical_deals')
    .select(`
      *,
      parcels(latitude, longitude)
    `)
    .eq('staff_id', staffId);

  // 3. Normalize both to common ClosedDeal shape
  // 4. Combine and sort by close_date desc
  return [...mlsDeals, ...normalizedHistorical].sort(byCloseDate);
}
```

## UI Impact

- **ClosedDealsMap:** No changes needed - already accepts `ClosedDeal[]`
- **Display:** Historical deals won't have photos (InfoWindow shows without image)

## Address Standardization Flow

Consistent with existing app patterns:
1. **Google Geocoding API** - Standardize raw address, get lat/lng and components
2. **BatchData/Parcels lookup** - Find or create parcel using standardized address
3. **Store `parcel_id`** - Link historical deal to parcel for coordinates

## Future Considerations

- **Admin UI:** If imports become frequent, add CRM upload page
- **BatchData enrichment:** Could backfill beds/baths/sqft from parcel data
- **Photo scraping:** Could potentially find old listing photos (low priority)
