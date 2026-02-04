# Off-Market Listings Feature Design

**Date:** 2026-02-04
**Status:** Approved

## Overview

Add support for off-market sales on agent profile pages and the company-wide Our Team page. Off-market deals display as green dots on maps and appear in agent stats.

## Requirements

1. **Jennifer's profile page** (`/our-team/jennifer-lovett`):
   - Green dots (`#167544`) for off-market sales on the map
   - Third stats line: "X bought off-market • $X.XM"

2. **Our Team page** (`/our-team`):
   - Green dots for off-market sales on company-wide map
   - Single combined total includes off-market deals

## Color Scheme

| Side | Color | Hex |
|------|-------|-----|
| Listing | Navy | `#284b70` |
| Buyer | Light Blue | RGB(79,129,189) |
| Off-Market | Green | `#167544` |

## Files to Modify

### 1. Type Definition
**File:** `lib/listings.ts`

Update `ClosedListing.side` type:
```typescript
side: "listing" | "buyer" | "off_market"
```

### 2. Map Component
**File:** `components/listings/DeckGLListingsMap.tsx`

Add color case in `getFillColor`:
```typescript
side === "off_market" → [22, 117, 68] // #167544
```

### 3. Agent Stats
**File:** `components/listings/ClosedListingsSection.tsx`

Add third stat line:
- Filter: `listings.filter((d) => d.side === "off_market")`
- Display: "X bought off-market • $X.XM"
- Only show if count > 0

### 4. Company Stats
**File:** `components/listings/CompanyClosedListingsSection.tsx`

No logic changes — already sums all listings. Off-market deals automatically included once type is updated.

## Testing

1. Jennifer's page shows green dot at 5020 Crowley St, Fort Worth
2. Jennifer's stats show "1 bought off-market • $100K" as third item
3. Our Team page map includes the green dot
4. Our Team stats include the off-market deal in the combined total
