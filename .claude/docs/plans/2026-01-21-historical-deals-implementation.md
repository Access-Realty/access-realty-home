# Historical Deals Import Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Import historical closed deals from CSV files into a dedicated table, enabling richer agent track record displays.

**Architecture:** New `agent_historical_deals` table linked to `staff` (via `staff_id`) and `parcels` (via `parcel_id`). Import script uses Google Geocoding API to standardize addresses, then looks up/creates parcels. Query integration unions MLS deals with historical deals.

**Tech Stack:** Supabase (PostgreSQL), TypeScript, Google Geocoding API, csv-parse

---

## Task 1: Create Database Migration

**Files:**
- Create: `supabase/migrations/YYYYMMDDHHMMSS_create_agent_historical_deals.sql` (in access-realty-app repo)

**Step 1: Create the migration file**

```sql
-- Create agent_historical_deals table for storing historical closed deals
-- imported from CSV files provided by agents

CREATE TABLE IF NOT EXISTS public.agent_historical_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id),
  parcel_id UUID REFERENCES public.parcels(id),

  -- Original MLS reference (human-readable listing ID)
  listing_id TEXT NOT NULL,
  mls_name TEXT DEFAULT 'NTREIS',

  -- Deal details
  side TEXT NOT NULL CHECK (side IN ('listing', 'buyer')),
  close_date DATE NOT NULL,
  close_price INTEGER,

  -- Address components (from Google Geocoding)
  unparsed_address TEXT,
  street_number TEXT,
  street_name TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,

  -- Property specs (nullable, can be enriched from BatchData later)
  year_built INTEGER,
  bedrooms_total INTEGER,
  bathrooms_total_decimal NUMERIC(3,1),
  living_area INTEGER,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(mls_name, listing_id)
);

-- Indexes for common queries
CREATE INDEX idx_historical_deals_staff ON public.agent_historical_deals(staff_id);
CREATE INDEX idx_historical_deals_parcel ON public.agent_historical_deals(parcel_id);
CREATE INDEX idx_historical_deals_close_date ON public.agent_historical_deals(close_date DESC);

-- Comments
COMMENT ON TABLE public.agent_historical_deals IS 'Historical closed deals imported from CSV, not available in MLS/Bridge API';
COMMENT ON COLUMN public.agent_historical_deals.listing_id IS 'Human-readable MLS listing ID (e.g., 13489630)';
COMMENT ON COLUMN public.agent_historical_deals.side IS 'listing = sellers agent, buyer = buyers agent';
```

**Step 2: Apply migration locally**

Run in access-realty-app repo (where Supabase is hosted):
```bash
npx supabase db push
```

Expected: Migration applies successfully, table created.

**Step 3: Commit migration**

```bash
git add supabase/migrations/
git commit -m "feat: create agent_historical_deals table for CSV imports"
```

---

## Task 2: Generate TypeScript Types

**Files:**
- Modify: `types/` (regenerate from schema)

**Step 1: Generate types from updated schema**

Run in access-realty-app repo:
```bash
npx supabase gen types typescript --local > src/types/database.ts
```

**Step 2: Verify the new type exists**

Check that `agent_historical_deals` appears in the generated types with correct columns.

**Step 3: Commit types**

```bash
git add src/types/database.ts
git commit -m "chore: regenerate types with agent_historical_deals"
```

---

## Task 3: Create Import Script - CSV Parsing

**Files:**
- Create: `scripts/import-historical-deals.ts` (in access-realty-home repo)

**Step 1: Install csv-parse dependency**

```bash
npm install csv-parse
```

**Step 2: Create script with argument parsing and CSV reading**

```typescript
#!/usr/bin/env npx tsx
// ABOUTME: Import historical closed deals from CSV files provided by agents
// ABOUTME: Usage: npx tsx scripts/import-historical-deals.ts --csv /path/to/file.csv --staff jennifer-lovett

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

interface CsvRow {
  "ML #": string;
  "List Agent Full Name": string;
  "List Agent Mls Id": string;
  "Buyer Agent Full Name": string;
  "Buyer Agent Mls Id": string;
  "Close Date": string;
  "Year Built": string;
  "Address": string;
  "City": string;
  "Postal Code": string;
  "Current Price": string;
}

interface ParsedDeal {
  listingId: string;
  side: "listing" | "buyer";
  closeDate: Date;
  closePrice: number;
  yearBuilt: number | null;
  address: string;
  city: string;
  postalCode: string;
}

function parseArgs(): { csvPath: string; staffSlug: string } {
  const args = process.argv.slice(2);
  let csvPath = "";
  let staffSlug = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--csv" && args[i + 1]) {
      csvPath = args[i + 1];
      i++;
    } else if (args[i] === "--staff" && args[i + 1]) {
      staffSlug = args[i + 1];
      i++;
    }
  }

  if (!csvPath || !staffSlug) {
    console.error("Usage: npx tsx scripts/import-historical-deals.ts --csv /path/to/file.csv --staff jennifer-lovett");
    process.exit(1);
  }

  return { csvPath, staffSlug };
}

function parsePrice(priceStr: string): number {
  // Remove $ and commas, parse as integer
  return parseInt(priceStr.replace(/[$,]/g, ""), 10) || 0;
}

function parseDate(dateStr: string): Date {
  // MM/DD/YYYY format
  const [month, day, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function determineSide(row: CsvRow, staffMlsId: string): "listing" | "buyer" {
  // Check if staff is the listing agent
  if (row["List Agent Mls Id"]?.replace(/,/g, "") === staffMlsId) {
    return "listing";
  }
  // Check if staff is the buyer agent
  if (row["Buyer Agent Mls Id"]?.replace(/,/g, "") === staffMlsId) {
    return "buyer";
  }
  // Default to listing if name matches
  return "listing";
}

function parseCsv(csvPath: string, staffMlsId: string): ParsedDeal[] {
  const content = readFileSync(csvPath, "utf-8");
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRow[];

  return rows.map((row) => ({
    listingId: row["ML #"],
    side: determineSide(row, staffMlsId),
    closeDate: parseDate(row["Close Date"]),
    closePrice: parsePrice(row["Current Price"]),
    yearBuilt: row["Year Built"] ? parseInt(row["Year Built"], 10) : null,
    address: row["Address"],
    city: row["City"],
    postalCode: row["Postal Code"],
  }));
}

async function main() {
  const { csvPath, staffSlug } = parseArgs();

  console.log(`Importing historical deals from: ${csvPath}`);
  console.log(`For staff member: ${staffSlug}`);

  // TODO: Look up staff by slug
  // TODO: Parse CSV
  // TODO: Geocode addresses
  // TODO: Insert into database

  console.log("CSV parsing complete. Next: implement geocoding and database insert.");
}

main().catch(console.error);
```

**Step 3: Test CSV parsing works**

```bash
npx tsx scripts/import-historical-deals.ts --csv "/Users/bort/Desktop/Jenn - SOLD - Sheet1.csv" --staff jennifer-lovett
```

Expected: Script runs, prints "Importing historical deals..." and staff slug.

**Step 4: Commit**

```bash
git add scripts/import-historical-deals.ts package.json package-lock.json
git commit -m "feat: add historical deals import script (CSV parsing)"
```

---

## Task 4: Import Script - Staff Lookup and Google Geocoding

**Files:**
- Modify: `scripts/import-historical-deals.ts`

**Step 1: Add Supabase client and staff lookup**

Add to the script after imports:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getStaffBySlug(slug: string): Promise<{ id: string; memberMlsId: string } | null> {
  const [firstName, ...lastParts] = slug.split("-");
  const lastName = lastParts.join(" ");

  const { data, error } = await supabase
    .from("staff")
    .select("id, member_mls_id")
    .ilike("first_name", firstName)
    .ilike("last_name", lastName)
    .single();

  if (error || !data) {
    console.error("Staff not found:", slug, error);
    return null;
  }

  return { id: data.id, memberMlsId: data.member_mls_id };
}
```

**Step 2: Add Google Geocoding function**

```typescript
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_MAPS_API_KEY env var");
  process.exit(1);
}

interface GeocodedAddress {
  formattedAddress: string;
  streetNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

async function geocodeAddress(address: string, city: string, postalCode: string): Promise<GeocodedAddress | null> {
  const fullAddress = `${address}, ${city}, TX ${postalCode}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK" || !data.results?.[0]) {
    console.warn(`Geocoding failed for: ${fullAddress}`);
    return null;
  }

  const result = data.results[0];
  const components = result.address_components || [];

  const getComponent = (type: string) =>
    components.find((c: { types: string[] }) => c.types.includes(type))?.long_name || "";
  const getShortComponent = (type: string) =>
    components.find((c: { types: string[] }) => c.types.includes(type))?.short_name || "";

  return {
    formattedAddress: result.formatted_address,
    streetNumber: getComponent("street_number"),
    streetName: getComponent("route"),
    city: getComponent("locality") || getComponent("sublocality"),
    state: getShortComponent("administrative_area_level_1"),
    postalCode: getComponent("postal_code"),
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  };
}
```

**Step 3: Update main() to use staff lookup**

```typescript
async function main() {
  const { csvPath, staffSlug } = parseArgs();

  console.log(`Importing historical deals from: ${csvPath}`);
  console.log(`For staff member: ${staffSlug}`);

  // Look up staff
  const staff = await getStaffBySlug(staffSlug);
  if (!staff) {
    console.error(`Staff member not found: ${staffSlug}`);
    process.exit(1);
  }
  console.log(`Found staff: ${staff.id} (MLS ID: ${staff.memberMlsId})`);

  // Parse CSV
  const deals = parseCsv(csvPath, staff.memberMlsId);
  console.log(`Parsed ${deals.length} deals from CSV`);

  // Test geocoding on first deal
  if (deals.length > 0) {
    const firstDeal = deals[0];
    console.log(`Testing geocode for: ${firstDeal.address}, ${firstDeal.city}`);
    const geocoded = await geocodeAddress(firstDeal.address, firstDeal.city, firstDeal.postalCode);
    if (geocoded) {
      console.log(`Geocoded: ${geocoded.formattedAddress} (${geocoded.lat}, ${geocoded.lng})`);
    }
  }
}
```

**Step 4: Test geocoding works**

```bash
npx tsx scripts/import-historical-deals.ts --csv "/Users/bort/Desktop/Jenn - SOLD - Sheet1.csv" --staff jennifer-lovett
```

Expected: Script finds staff, parses CSV, geocodes first address successfully.

**Step 5: Commit**

```bash
git add scripts/import-historical-deals.ts
git commit -m "feat: add staff lookup and Google Geocoding to import script"
```

---

## Task 5: Import Script - Parcel Lookup/Creation and Database Insert

**Files:**
- Modify: `scripts/import-historical-deals.ts`

**Step 1: Add parcel lookup/creation function**

```typescript
async function findOrCreateParcel(geocoded: GeocodedAddress): Promise<string | null> {
  // First, try to find existing parcel by address
  const { data: existing } = await supabase
    .from("parcels")
    .select("id")
    .ilike("street_address", `%${geocoded.streetNumber} ${geocoded.streetName}%`)
    .ilike("city", geocoded.city)
    .eq("state", geocoded.state)
    .limit(1)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create a stub parcel with geocoded data
  // BatchData enrichment can fill in details later
  const { data: newParcel, error } = await supabase
    .from("parcels")
    .insert({
      house_number: geocoded.streetNumber,
      street_address: `${geocoded.streetNumber} ${geocoded.streetName}`,
      formatted_street: geocoded.streetName,
      city: geocoded.city,
      state: geocoded.state,
      zip: geocoded.postalCode,
      full_address: geocoded.formattedAddress,
      latitude: geocoded.lat,
      longitude: geocoded.lng,
      data_source: "google_geocode",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create parcel:", error);
    return null;
  }

  return newParcel?.id || null;
}
```

**Step 2: Add database insert function**

```typescript
interface DealInsert {
  staffId: string;
  parcelId: string | null;
  deal: ParsedDeal;
  geocoded: GeocodedAddress | null;
}

async function insertDeal(insert: DealInsert): Promise<boolean> {
  const { staffId, parcelId, deal, geocoded } = insert;

  const { error } = await supabase
    .from("agent_historical_deals")
    .insert({
      staff_id: staffId,
      parcel_id: parcelId,
      listing_id: deal.listingId,
      mls_name: "NTREIS",
      side: deal.side,
      close_date: deal.closeDate.toISOString().split("T")[0],
      close_price: deal.closePrice,
      unparsed_address: `${deal.address}, ${deal.city}, TX ${deal.postalCode}`,
      street_number: geocoded?.streetNumber || null,
      street_name: geocoded?.streetName || null,
      city: geocoded?.city || deal.city,
      state: geocoded?.state || "TX",
      postal_code: geocoded?.postalCode || deal.postalCode,
      year_built: deal.yearBuilt,
    })
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation - already imported
      return false;
    }
    console.error(`Failed to insert deal ${deal.listingId}:`, error);
    return false;
  }

  return true;
}
```

**Step 3: Update main() with full import loop**

```typescript
async function main() {
  const { csvPath, staffSlug } = parseArgs();

  console.log(`Importing historical deals from: ${csvPath}`);
  console.log(`For staff member: ${staffSlug}`);

  // Look up staff
  const staff = await getStaffBySlug(staffSlug);
  if (!staff) {
    console.error(`Staff member not found: ${staffSlug}`);
    process.exit(1);
  }
  console.log(`Found staff: ${staff.id} (MLS ID: ${staff.memberMlsId})`);

  // Parse CSV
  const deals = parseCsv(csvPath, staff.memberMlsId);
  console.log(`Parsed ${deals.length} deals from CSV`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const deal of deals) {
    // Rate limit geocoding (Google allows 50 QPS)
    await new Promise((r) => setTimeout(r, 100));

    // Geocode address
    const geocoded = await geocodeAddress(deal.address, deal.city, deal.postalCode);

    // Find or create parcel
    let parcelId: string | null = null;
    if (geocoded) {
      parcelId = await findOrCreateParcel(geocoded);
    }

    // Insert deal
    const success = await insertDeal({
      staffId: staff.id,
      parcelId,
      deal,
      geocoded,
    });

    if (success) {
      inserted++;
      console.log(`✓ Imported: ${deal.listingId} - ${deal.address}`);
    } else {
      skipped++;
    }
  }

  console.log(`\nImport complete:`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped (duplicates): ${skipped}`);
  console.log(`  Failed: ${failed}`);
}
```

**Step 4: Run full import**

```bash
npx tsx scripts/import-historical-deals.ts --csv "/Users/bort/Desktop/Jenn - SOLD - Sheet1.csv" --staff jennifer-lovett
```

Expected: All 41 deals imported with parcel links.

**Step 5: Commit**

```bash
git add scripts/import-historical-deals.ts
git commit -m "feat: complete historical deals import with parcel linking"
```

---

## Task 6: Update getClosedDeals() to Include Historical Deals

**Files:**
- Modify: `lib/listings.ts`

**Step 1: Add historical deals query function**

Add after the existing `getClosedDeals` function:

```typescript
/**
 * Fetch historical deals for a staff member (from CSV imports)
 * @param staffId - The staff UUID
 */
async function getHistoricalDeals(staffId: string): Promise<ClosedDeal[]> {
  const { data, error } = await supabase
    .from("agent_historical_deals")
    .select(`
      id,
      listing_id,
      close_price,
      unparsed_address,
      city,
      year_built,
      bedrooms_total,
      bathrooms_total_decimal,
      living_area,
      side,
      parcels (
        latitude,
        longitude
      )
    `)
    .eq("staff_id", staffId)
    .order("close_price", { ascending: false });

  if (error) {
    console.error("Error fetching historical deals:", error);
    return [];
  }

  return (data || []).map((deal) => ({
    id: deal.id,
    listing_id: deal.listing_id,
    list_price: deal.close_price,
    unparsed_address: deal.unparsed_address,
    city: deal.city,
    bedrooms_total: deal.bedrooms_total,
    bathrooms_total_decimal: deal.bathrooms_total_decimal,
    living_area: deal.living_area,
    latitude: deal.parcels?.latitude || null,
    longitude: deal.parcels?.longitude || null,
    photo_urls: null, // Historical deals don't have photos
    photos_stored: null,
    side: deal.side as "listing" | "buyer",
  }));
}
```

**Step 2: Modify getClosedDeals() to accept staffId parameter**

The current function signature is:
```typescript
export async function getClosedDeals(agentMemberKey: string): Promise<ClosedDeal[]>
```

We need to also accept `staffId` to query historical deals. Update the function:

```typescript
/**
 * Fetch all closed deals for an agent (for map display)
 * Combines MLS deals (via agent key) and historical deals (via staff ID)
 * @param agentMemberKey - The member_key hash from staff table
 * @param staffId - Optional staff UUID for historical deals lookup
 */
export async function getClosedDeals(
  agentMemberKey: string,
  staffId?: string
): Promise<ClosedDeal[]> {
  // ... existing MLS query code ...

  // After combining MLS deals, add historical deals if staffId provided
  let allDeals = [...listingDeals, ...coListingDeals, ...buyerDeals];

  if (staffId) {
    const historicalDeals = await getHistoricalDeals(staffId);
    allDeals = [...allDeals, ...historicalDeals];
  }

  // Dedupe by listing_id (MLS deals have listing_id, historical have their own)
  const uniqueDeals = allDeals.filter(
    (deal, index, self) =>
      index === self.findIndex((d) => d.id === deal.id)
  );

  // Sort by price descending
  const sortedDeals = uniqueDeals.sort((a, b) => (b.list_price || 0) - (a.list_price || 0));

  // Trigger background photo downloads for MLS deals
  triggerPhotoDownloads(sortedDeals.filter(d => d.photos_stored !== null));

  return sortedDeals;
}
```

**Step 3: Commit**

```bash
git add lib/listings.ts
git commit -m "feat: include historical deals in getClosedDeals query"
```

---

## Task 7: Update ClosedDealsSection to Pass staffId

**Files:**
- Modify: `components/listings/ClosedDealsSection.tsx`
- Modify: `app/(home)/our-team/[slug]/page.tsx`

**Step 1: Update ClosedDealsSection props**

```typescript
interface ClosedDealsSectionProps {
  agentMlsId: string;
  staffId?: string;  // Add this
  agentName: string;
}

export default async function ClosedDealsSection({
  agentMlsId,
  staffId,  // Add this
  agentName,
}: ClosedDealsSectionProps) {
  const deals = await getClosedDeals(agentMlsId, staffId);  // Pass staffId
  // ... rest unchanged
}
```

**Step 2: Update staff profile page to pass staffId**

In `app/(home)/our-team/[slug]/page.tsx`, update the ClosedDealsSection call:

```tsx
{/* Closed Deals Map */}
{staff.member_key && (
  <ClosedDealsSection
    agentMlsId={staff.member_key}
    staffId={staff.id}  // Add this
    agentName={name}
  />
)}
```

**Step 3: Commit**

```bash
git add components/listings/ClosedDealsSection.tsx app/(home)/our-team/[slug]/page.tsx
git commit -m "feat: pass staffId to ClosedDealsSection for historical deals"
```

---

## Task 8: Test End-to-End and Verify Map Display

**Step 1: Start local dev server**

```bash
npm run dev
```

**Step 2: Navigate to Jennifer's profile page**

Open: http://localhost:3000/our-team/jennifer-lovett

**Step 3: Verify closed deals section**

Expected:
- Map shows 8 MLS deals + 41 historical deals = 49 total markers
- Stats show combined totals for listing and buyer sides
- Historical deals appear as markers (may not have photos in InfoWindow)

**Step 4: Take screenshot for verification**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --screenshot=/tmp/jennifer-closed-deals.png \
  --window-size=1400,1200 \
  "http://localhost:3000/our-team/jennifer-lovett"
```

**Step 5: Commit any fixes if needed**

---

## Task 9: Documentation

**Files:**
- Modify: `docs/plans/2026-01-21-historical-deals-import-design.md` (add usage section)
- Create: `.claude/docs/HISTORICAL_DEALS_IMPORT.md`

**Step 1: Create documentation file**

```markdown
# Historical Deals Import

## Overview

Historical closed deals can be imported from CSV files to supplement MLS data on agent profile pages.

## When to Use

When an agent joins and has historical deals that predate Bridge API data retention, or deals from a different MLS.

## CSV Format

Required columns:
- `ML #` - MLS listing ID
- `Close Date` - MM/DD/YYYY format
- `Current Price` - Price with $ and commas (e.g., "$534,900")
- `Address` - Street address
- `City` - City name
- `Postal Code` - ZIP code
- `List Agent Mls Id` - To determine if agent was listing side
- `Buyer Agent Mls Id` - To determine if agent was buyer side

Optional columns:
- `Year Built` - Integer

## Running the Import

```bash
npx tsx scripts/import-historical-deals.ts \
  --csv "/path/to/deals.csv" \
  --staff "jennifer-lovett"
```

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_MAPS_API_KEY`

## What the Script Does

1. Looks up staff member by slug
2. Parses CSV file
3. For each deal:
   - Geocodes address via Google Geocoding API
   - Finds or creates parcel in parcels table
   - Inserts into agent_historical_deals
4. Reports results

## Idempotency

The script is idempotent - running it twice with the same CSV will skip already-imported deals (unique constraint on mls_name + listing_id).

## Enrichment

Historical deals linked to parcels can be enriched with property data via BatchData later.
```

**Step 2: Commit documentation**

```bash
git add .claude/docs/HISTORICAL_DEALS_IMPORT.md docs/plans/2026-01-21-historical-deals-import-design.md
git commit -m "docs: add historical deals import documentation"
```

---

## Summary

After completing all tasks:

1. **Database**: New `agent_historical_deals` table with proper indexes and constraints
2. **Import Script**: `scripts/import-historical-deals.ts` - CSV parsing, geocoding, parcel linking
3. **Query Integration**: `getClosedDeals()` unions MLS and historical deals
4. **UI**: No changes needed - ClosedDealsMap already handles the combined data
5. **Documentation**: Usage guide in `.claude/docs/HISTORICAL_DEALS_IMPORT.md`

Jennifer's profile will show ~49 closed deals instead of 8, giving a much better representation of her track record.
