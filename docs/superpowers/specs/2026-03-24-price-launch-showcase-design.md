# Price Launch Project Showcase — Design Spec

**Date:** 2026-03-24
**Monday Item:** [#10935860649](https://metroplex-homebuyers.monday.com/boards/9871088663/views/232875187/pulses/10935860649)
**Status:** Ready to Deploy

## Goal

Replace the placeholder "Recent Price Launch Projects" section on `/solutions/price-launch` with a real project showcase featuring before/after comparison sliders and verified financial data.

## Projects

| Project | Address | Purchase | Renovation | Sale Price | Status |
|---------|---------|----------|------------|------------|--------|
| Alexander | 5113 Alexander Dr, Flower Mound | $336K | ~$86K | $559,900 | Sold |
| Cross Bend | 816 Cross Bend Rd, Plano | $285K | ~$75K | $385,000 | Sale Pending |
| Ralph | 1006 Ralph St, Grand Prairie | $142K | ~$68K | $244,000 | Sold |

**Sale prices** from MLS (listing IDs: 21149276, 21185966, 21001910) — 100% accurate.
**Renovation costs** from Zoho Rehabs module `Current_Renovation_Expense` — rounded estimates.

## Component: `BeforeAfterSlider`

Interactive image comparison with a draggable vertical divider.

- Two images stacked via absolute positioning; top image clipped by divider position
- Draggable handle (vertical line + circle grip) controlled by mouse drag and touch
- "Before" / "After" labels in opposing corners
- Defaults to 50% center position
- Responsive: full-width on mobile, constrained on desktop
- Accessible: keyboard arrow keys to move divider

## Page Layout: Stacked Showcase

Each of the 3 projects rendered vertically (scroll to see all — no tabs):

```
┌─────────────────────────────────────────────┐
│ Project Name — City, TX          Sale Pending│  (badge only if pending)
├──────────────────────┬──────────────────────┤
│                      │  Renovation: ~$86K   │
│   BeforeAfterSlider  │  Sale Price: $559,900│
│   (selected room)    │                      │
│                      │                      │
├──────────────────────┴──────────────────────┤
│ [Kitchen] [Living Room] [Master Bath] [Front│  Room selector pills
│  Elevation] [Pool]                          │
└─────────────────────────────────────────────┘
```

- Desktop: slider left (~65%), financials right (~35%)
- Mobile: slider full-width, financials below, room pills horizontal scroll
- Room pills switch which before/after pair is shown in the slider

## Financials Display (Option 2 — verified only)

Show only what's verifiable:
- **Renovation Investment:** ~$86K (rounded from Zoho)
- **Sale Price:** $559,900 (exact from MLS)

No "as-is value" or "net gain" — those would be fabrications.

## Images

**Storage:** Supabase `public-assets` bucket under `price-launch/{project}/{room}-{before|after}.jpg`

**Naming convention** (matches Emma's Google Drive structure):
- `price-launch/alexander/kit-before.jpg`
- `price-launch/alexander/kit-after.jpg`
- `price-launch/alexander/liv-before.jpg`
- etc.

**Room keys:** `kit` (Kitchen), `liv` (Living Room), `bath` (Master Bath), `front` (Front Elevation), `pool` (Pool — Alexander only)

**Helper:** Add `publicAssetUrl()` to this repo's `lib/storage.ts`, matching the app repo's pattern from `src/constants/storage.ts`.

**For prototype:** Use placeholder gradient images until real photos are uploaded from Google Drive.

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/ui/BeforeAfterSlider.tsx` | Create — reusable slider component |
| `lib/storage.ts` | Create — `publicAssetUrl()` helper |
| `app/(solutions)/solutions/price-launch/PriceLaunchContent.tsx` | Modify — replace case studies section |

## Out of Scope

- Photo upload workflow (manual via Supabase dashboard or CLI)
- Dewberry project (eliminated by Emma)
- "As-is value" or speculative financials
