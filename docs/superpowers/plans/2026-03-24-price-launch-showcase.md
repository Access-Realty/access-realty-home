# Price Launch Project Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder project cards on `/solutions/price-launch` with interactive before/after image sliders and real financial data for 3 renovation projects.

**Architecture:** A reusable `BeforeAfterSlider` client component handles the drag interaction. A `publicAssetUrl` helper builds Supabase Storage URLs. The existing `PriceLaunchContent.tsx` gets its case studies section replaced with stacked project showcases, each containing a room selector + slider + financials panel.

**Tech Stack:** React (client component), Tailwind CSS v4, next/image, Supabase Storage (public-assets bucket)

**Spec:** `docs/superpowers/specs/2026-03-24-price-launch-showcase-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/storage.ts` | Create | `publicAssetUrl(path)` helper for Supabase public-assets bucket |
| `components/ui/BeforeAfterSlider.tsx` | Create | Draggable before/after image comparison component |
| `app/(solutions)/solutions/price-launch/PriceLaunchContent.tsx` | Modify (lines 150-176, 522-574) | Replace case studies data + section with showcase |

---

### Task 1: Create `publicAssetUrl` helper

**Files:**
- Create: `lib/storage.ts`

- [ ] **Step 1: Create the helper**

```typescript
// ABOUTME: Supabase public storage URL helper for marketing site assets
// ABOUTME: Matches the app repo's pattern in src/constants/storage.ts

const SUPABASE_URL = "https://hvbicnpvactgxzprnygc.supabase.co";

/** Build a full URL for a file in the public-assets storage bucket */
export function publicAssetUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit lib/storage.ts` — no errors expected.

- [ ] **Step 3: Commit**

```bash
git add lib/storage.ts
git commit -m "feat: add publicAssetUrl helper for Supabase storage"
```

---

### Task 2: Build `BeforeAfterSlider` component

**Files:**
- Create: `components/ui/BeforeAfterSlider.tsx`

This is a `"use client"` component. It renders two `next/image` elements stacked with absolute positioning. The "after" image is full-size behind; the "before" image is clipped using `clip-path: inset(0 <right>% 0 0)` based on slider position. A vertical divider line with a circular grip handle sits at the divider position.

**Interaction model:**
- Mouse: `onPointerDown` on the handle starts tracking → `onPointerMove` on the container updates position → `onPointerUp` stops
- Touch: same pointer events (PointerEvent unifies mouse+touch)
- Keyboard: left/right arrow keys when handle is focused (5% increments)
- The container captures pointer on down to get moves outside the handle

- [ ] **Step 1: Create the component file with full implementation**

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  /** Aspect ratio as height/width (default: 0.667 for 3:2) */
  aspectRatio?: number;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before renovation",
  afterAlt = "After renovation",
  aspectRatio = 0.667,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      containerRef.current?.setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setPosition((p) => Math.min(100, p + 5));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg select-none touch-none cursor-col-resize"
      style={{ paddingBottom: `${aspectRatio * 100}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After image (full, behind) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 65vw"
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 65vw"
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded pointer-events-none">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded pointer-events-none">
        After
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle grip */}
      <div
        className="absolute top-1/2 -translate-y-1/2 z-10"
        style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after comparison"
        onKeyDown={handleKeyDown}
      >
        <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13" stroke="#284b70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L14 8L11 13" stroke="#284b70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` — should compile without errors. The component isn't used yet, but it must type-check.

- [ ] **Step 3: Commit**

```bash
git add components/ui/BeforeAfterSlider.tsx
git commit -m "feat: add BeforeAfterSlider component with drag and keyboard support"
```

---

### Task 3: Replace case studies section in PriceLaunchContent

**Files:**
- Modify: `app/(solutions)/solutions/price-launch/PriceLaunchContent.tsx`

This task replaces the `caseStudies` array (lines 150-176) with real project data, and replaces the card grid JSX (lines 522-574) with the stacked showcase layout.

- [ ] **Step 1: Replace the `caseStudies` data array (lines 150-176)**

Remove the old `caseStudies` array and `HiPhoto` import. Replace with:

```typescript
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import { publicAssetUrl } from "@/lib/storage";

type Room = { key: string; label: string; before: string; after: string };

const showcaseProjects = [
  {
    name: "Alexander",
    address: "5113 Alexander Dr",
    city: "Flower Mound, TX",
    renovationCost: 86000,
    salePrice: 559900,
    status: "Sold" as const,
    rooms: [
      { key: "kit", label: "Kitchen", before: publicAssetUrl("price-launch/alexander/kit-before.jpg"), after: publicAssetUrl("price-launch/alexander/kit-after.jpg") },
      { key: "liv", label: "Living Room", before: publicAssetUrl("price-launch/alexander/liv-before.jpg"), after: publicAssetUrl("price-launch/alexander/liv-after.jpg") },
      { key: "bath", label: "Master Bath", before: publicAssetUrl("price-launch/alexander/bath-before.jpg"), after: publicAssetUrl("price-launch/alexander/bath-after.jpg") },
      { key: "front", label: "Front Elevation", before: publicAssetUrl("price-launch/alexander/front-before.jpg"), after: publicAssetUrl("price-launch/alexander/front-after.jpg") },
      { key: "pool", label: "Pool", before: publicAssetUrl("price-launch/alexander/pool-before.jpg"), after: publicAssetUrl("price-launch/alexander/pool-after.jpg") },
    ],
  },
  {
    name: "Cross Bend",
    address: "816 Cross Bend Rd",
    city: "Plano, TX",
    renovationCost: 75000,
    salePrice: 385000,
    status: "Sale Pending" as const,
    rooms: [
      { key: "kit", label: "Kitchen", before: publicAssetUrl("price-launch/cross-bend/kit-before.jpg"), after: publicAssetUrl("price-launch/cross-bend/kit-after.jpg") },
      { key: "liv", label: "Living Room", before: publicAssetUrl("price-launch/cross-bend/liv-before.jpg"), after: publicAssetUrl("price-launch/cross-bend/liv-after.jpg") },
      { key: "bath", label: "Master Bath", before: publicAssetUrl("price-launch/cross-bend/bath-before.jpg"), after: publicAssetUrl("price-launch/cross-bend/bath-after.jpg") },
      { key: "front", label: "Front Elevation", before: publicAssetUrl("price-launch/cross-bend/front-before.jpg"), after: publicAssetUrl("price-launch/cross-bend/front-after.jpg") },
    ],
  },
  {
    name: "Ralph",
    address: "1006 Ralph St",
    city: "Grand Prairie, TX",
    renovationCost: 68000,
    salePrice: 244000,
    status: "Sold" as const,
    rooms: [
      { key: "kit", label: "Kitchen", before: publicAssetUrl("price-launch/ralph/kit-before.jpg"), after: publicAssetUrl("price-launch/ralph/kit-after.jpg") },
      { key: "liv", label: "Living Room", before: publicAssetUrl("price-launch/ralph/liv-before.jpg"), after: publicAssetUrl("price-launch/ralph/liv-after.jpg") },
      { key: "bath", label: "Master Bath", before: publicAssetUrl("price-launch/ralph/bath-before.jpg"), after: publicAssetUrl("price-launch/ralph/bath-after.jpg") },
      { key: "front", label: "Front Elevation", before: publicAssetUrl("price-launch/ralph/front-before.jpg"), after: publicAssetUrl("price-launch/ralph/front-after.jpg") },
    ],
  },
];
```

- [ ] **Step 2: Add selected room state**

In the `PriceLaunchContent` component body, add state for tracking selected room per project:

```typescript
const [selectedRooms, setSelectedRooms] = useState<Record<string, string>>({
  Alexander: "kit",
  "Cross Bend": "kit",
  Ralph: "kit",
});
```

- [ ] **Step 3: Replace the case studies JSX section (lines 522-574)**

Replace the `{/* Recent Projects - Kept for credibility */}` section with:

```tsx
{/* Project Showcase */}
<Section variant="content" maxWidth="5xl">
  <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
    Recent Price Launch Projects
  </h2>
  <p className="text-muted-foreground text-center mb-10">
    Real results from properties we&apos;ve renovated and sold. Drag the slider to compare.
  </p>

  <div className="space-y-16">
    {showcaseProjects.map((project) => {
      const selectedKey = selectedRooms[project.name] || "kit";
      const selectedRoom = project.rooms.find((r) => r.key === selectedKey) || project.rooms[0];

      return (
        <div key={project.name} className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Project header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="text-xl font-bold text-primary">{project.address}</h3>
              <p className="text-sm text-muted-foreground">{project.city}</p>
            </div>
            {project.status === "Sale Pending" && (
              <span className="text-xs font-semibold bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                Sale Pending
              </span>
            )}
          </div>

          {/* Slider + financials */}
          <div className="grid md:grid-cols-[1fr_280px]">
            <div className="px-6">
              <BeforeAfterSlider
                beforeSrc={selectedRoom.before}
                afterSrc={selectedRoom.after}
                beforeAlt={`${project.address} ${selectedRoom.label} before`}
                afterAlt={`${project.address} ${selectedRoom.label} after`}
              />
            </div>

            <div className="flex flex-col justify-center p-6 border-t md:border-t-0 md:border-l border-border">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Renovation Investment</p>
                  <p className="text-2xl font-bold text-primary">~{formatCurrency(project.renovationCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sale Price</p>
                  <p className="text-2xl font-bold text-secondary">{formatCurrency(project.salePrice)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Room selector pills */}
          <div className="px-6 py-4 border-t border-border flex gap-2 overflow-x-auto">
            {project.rooms.map((room) => (
              <button
                key={room.key}
                onClick={() =>
                  setSelectedRooms((prev) => ({ ...prev, [project.name]: room.key }))
                }
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedKey === room.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {room.label}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</Section>
```

- [ ] **Step 4: Clean up unused imports**

Remove from imports: `HiPhoto` (no longer used after removing the placeholder).

- [ ] **Step 5: Verify build**

Run: `npm run build` — must pass. The page will render but images will 404 until photos are uploaded. That's expected.

- [ ] **Step 6: Start dev server and screenshot**

Run: `npm run dev`

Then screenshot: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=/tmp/price-launch-showcase.png --window-size=1400,1200 "http://localhost:4000/solutions/price-launch"`

Visually verify the layout: stacked cards, slider visible (with broken image placeholders), room pills, financials panel.

- [ ] **Step 7: Commit**

```bash
git add app/(solutions)/solutions/price-launch/PriceLaunchContent.tsx
git commit -m "feat: replace placeholder case studies with interactive project showcase

Real financial data from Zoho + MLS for Alexander, Cross Bend, Ralph.
Before/after slider with room selector pills.
Images will load once uploaded to Supabase public-assets bucket."
```

---

### Task 4: Upload placeholder images for dev testing (optional)

This task is for local development only. Real photos will be uploaded from Google Drive later.

- [ ] **Step 1: Create simple placeholder images**

Use a script or manually upload colored gradient PNGs to Supabase `public-assets` under `price-launch/{project}/{room}-{before|after}.jpg`. Even solid-color images work for testing the slider mechanics.

Alternatively, temporarily point the image URLs at `/price-launch-hero.jpg` (which already exists in public/) to test the slider visually.

- [ ] **Step 2: Verify slider works in browser**

Open `http://localhost:4000/solutions/price-launch`, scroll to showcase, drag the slider. Confirm:
- Dragging moves the divider
- Room pills switch images
- Mobile responsive (resize browser)
- Keyboard arrows work when handle is focused

- [ ] **Step 3: Take final screenshot for review**

Screenshot and visually verify before presenting to Bret.
