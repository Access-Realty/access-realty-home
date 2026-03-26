# Protect Texas Homeowners — Advocacy Section Design Spec

## Overview

A multi-page advocacy section on access.realty to spearhead legislation restricting predatory real estate wholesaling in Texas. The section targets two audiences: **legislators** (showing the problem and proposed solutions) and **licensed Texas realtors** (collecting petition signatures, stories, and votes on draft legislation). Secondary business goal: the petition and voting flows capture verified realtor emails for recruiting pipeline via retargeting ads.

**Working title:** Protect Texas Homeowners (URL may change later)

## Sitemap

```
access.realty/
├── (home)/                          ← existing
├── (direct-list)/                   ← existing
├── (solutions)/                     ← existing
├── (advocacy)/                      ← NEW route group
│   └── protect-texas-homeowners/
│       ├── layout.tsx               ← AccessHeader + sub-nav + AccessFooter
│       ├── page.tsx                 ← Landing hub
│       ├── the-problem/page.tsx     ← YouTube video wall
│       ├── other-states/page.tsx    ← State-by-state legislation reference
│       ├── stories/page.tsx         ← Horror stories + submission form
│       ├── legislation/page.tsx     ← Draft provisions + voting
│       └── petition/page.tsx        ← Signatures + legislator lookup
```

Footer link added to `AccessFooter.tsx` under Quick Links.

## Shared Identity Layer

A single `advocacy_supporters` table serves as the identity layer across all advocacy pages. When a visitor verifies their email on any page, their verified status persists via localStorage (`advocacy_verified_email`). Subsequent pages skip the email prompt.

**Flow:**
1. Visitor interacts with any email-gated feature (voting, petition, story submission)
2. Modal prompts for email (or pre-fills if localStorage has a verified email)
3. Verification email sent (if not already verified)
4. On verification, `advocacy_supporters` record is created/updated, localStorage set
5. All other advocacy pages recognize the visitor immediately

If a visitor verified via legislation voting and later visits the petition page, email is pre-filled and verification is skipped — but the petition form still collects additional fields (TREC#, brokerage, city, attestation).

## Data Architecture

All tables live in Supabase. **Migrations must be created in the access-realty-app repo** per database schema ownership rules. This repo only reads/writes via Supabase client SDK.

### advocacy_supporters
The identity table. All other advocacy tables reference `supporter_id`.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| email | text | unique, not null |
| name | text | nullable (collected on petition or story) |
| verified | boolean | default false |
| verified_at | timestamptz | null until verified |
| email_opt_in | boolean | default false — recruiting pipeline |
| created_at | timestamptz | default now() |

### advocacy_videos
Supabase-managed. No commentary — videos speak for themselves.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| youtube_url | text | not null |
| title | text | not null |
| channel_name | text | nullable |
| view_count | text | nullable, display only (e.g., "1.2M views") |
| category | text | enum: get-rich-quick, suing-sellers, predatory-contracts, unfair-negotiations |
| sort_order | integer | display ordering |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |

### advocacy_stories
Manual moderation. Stories start as "pending," display only when "approved."

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| supporter_id | uuid | FK → advocacy_supporters |
| author_display_name | text | what to show publicly (or "Anonymous") |
| brokerage | text | nullable |
| county | text | nullable |
| story_text | text | not null |
| is_anonymous | boolean | default false |
| status | text | pending / approved / rejected |
| created_at | timestamptz | default now() |
| approved_at | timestamptz | nullable |

### advocacy_provisions
Seeded from research on other states' legislation. New provisions can be suggested by visitors (go to moderation).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | not null |
| description | text | detailed provision language |
| source_states | text | e.g., "SC H4754, OK SB 1075" |
| source_url | text | nullable — link to source bill text |
| upvotes | integer | default 0 |
| downvotes | integer | default 0 |
| sort_order | integer | display ordering |
| is_active | boolean | default true — false for pending suggestions |
| suggested_by | uuid | nullable FK → advocacy_supporters (for user-suggested provisions) |
| created_at | timestamptz | default now() |

### advocacy_provision_votes
One vote per supporter per provision. Can change vote.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| provision_id | uuid | FK → advocacy_provisions |
| supporter_id | uuid | FK → advocacy_supporters |
| vote | text | "up" or "down" |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

Unique constraint on (provision_id, supporter_id).

### advocacy_signatures
Petition-specific data beyond what's in advocacy_supporters.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| supporter_id | uuid | FK → advocacy_supporters, unique |
| brokerage | text | not null |
| trec_license_number | text | not null |
| city | text | not null |
| signed_at | timestamptz | default now() |

## Page Designs

### Page 1: Landing Hub (`/protect-texas-homeowners`)

The emotional hook and navigation center.

**Sections:**
1. **Hero** — Navy background. "An Access Realty Initiative" badge. Title: "Protect Texas Homeowners from Predatory Wholesaling." Two CTAs: Sign the Petition (primary), Read the Draft Legislation (secondary outline).
2. **Live Stats Bar** — Three counters: Licensed Realtors Signed (live from advocacy_signatures), States Have Acted (hardcoded 12+), Stories Shared (live from advocacy_stories where approved). Cream background.
3. **Interactive US Map** — SVG-based map (react-simple-maps or custom SVG). States color-coded by legislation status:
   - Navy: enacted (SC, IL, OK, PA, OH, OR, VA, CT, AL, MD, TN, ND)
   - Gold: pending (NC)
   - Red with pulsing dashed border: Texas
   - Gray: failed (KS)
   - Hover/tap shows tooltip: state name, approach, bill number, effective date, key provisions
   - Clicking a state links to `/other-states` with that state's card
   - Legend below map
4. **Take Action Grid** — 4 cards linking to sub-pages: The Problem, Real Stories, Draft Legislation, Sign the Petition. Each with icon, title, short description.
5. **Bottom CTA** — Navy background. "Ready to protect Texas homeowners?" → Sign the Petition button.

### Page 2: The Problem (`/the-problem`)

YouTube video wall exposing predatory wholesaling practices.

**Sections:**
1. **Hero** — "In Their Own Words." Subtext about gurus openly teaching predatory tactics.
2. **Category Filter Tabs** — Client-side filtering pills: All Videos, Get Rich Quick Gurus, Suing Sellers, Predatory Contracts, Unfair Negotiations. All videos load, pills show/hide by category.
3. **Video Grid** — 2-column grid of video cards. Each card: YouTube thumbnail (lite-embed pattern — static image, click to load iframe), category badge (color-coded), video title, channel name, view count. No editorial commentary.
4. **"Why does this matter?" Callout** — Red left border. Connects the videos to the legislative gap.
5. **Bottom CTA** — "Seen enough?" → Sign the Petition + Share Your Story.

**Data:** Pulled from `advocacy_videos` table. Videos managed in Supabase dashboard.

### Page 3: Other States (`/other-states`)

State-by-state legislation reference. SEO target: "wholesaling laws by state."

**Sections:**
1. **Hero** — "12+ States Have Already Acted."
2. **State Cards** — Static list, no filtering. Sorted strongest protections first. Each card shows:
   - State name, bill number(s), signed/effective date
   - Status badges (Effective Ban, License Required, Disclosure Only, etc.)
   - Summary paragraph of what the law does
   - Key provisions bulleted list
   - Link to actual bill text on state legislature website
   - SC gets "STRONGEST" badge
   - KS shown dimmed as "Failed in House"
3. **Texas Card** — Always last. Red border, red background tint. "Disclosure Only — No Real Teeth." Description of current weak law. CTA: "Help Us Change This →" links to petition.
4. **Bottom CTA** — "Texas deserves better." → Sign the Petition + Read Draft Legislation.

**Data:** Hardcoded JSON object with state legislation data from research. Easy to update.

### Page 4: Stories (`/stories`)

Horror stories from realtors with submission form. Launches with zero published stories.

**Sections:**
1. **Hero** — "Stories from the Field." Subtext: these are happening right now.
2. **Approved Stories** — Italicized quote style with gold left border. Shows: story text, author name (or "Anonymous"), brokerage, county, date. Only stories with status "approved" display. Starts empty on launch — form is the star.
3. **Submit Form** — Fields: name, brokerage, email, county (optional), story text. Checkboxes: consent to publish, display as anonymous. Submit button. "All stories are reviewed before publishing" disclaimer.
4. **Bottom CTA** — "Every story strengthens the case." → Sign the Petition.

**Moderation:** Stories saved to `advocacy_stories` with status "pending." Approved via Supabase dashboard.

### Page 5: Legislation (`/legislation`)

Draft provisions with community voting and provision suggestions.

**Sections:**
1. **Hero** — "Help Us Draft the Law." Subtext: provisions drawn from other states, vote on which Texas should adopt.
2. **Provisions List** — Each provision card shows:
   - Title and detailed description with specific, clearly defined language
   - Source attribution with links to source state legislation
   - Up/down vote buttons with current counts (start at 0)
   - Clicking any vote button → modal for email if not already verified
   - Email verification required before votes are recorded
   - Once verified, can freely vote on all provisions
   - Can change vote (toggle up/down or remove)
3. **Suggest a Provision** — Form at bottom: title, description, rationale. Goes to moderation (is_active = false until approved). Requires verified email.
4. **Bottom CTA** — "Your voice shapes this legislation." → Sign the Petition.

**Seeded provisions (8):**
1. Require a real estate license to wholesale (SC, OK, PA, VA)
2. 30-day seller cancellation right (PA)
3. Mandatory written disclosure before contract (OH, OK)
4. Close the double-closing loophole (OK SB 1075)
5. Earnest money held in FDIC-insured escrow (OK)
6. Cap unlicensed transactions to 1 per year (IL)
7. Violations = deceptive trade practice under DTPA (OH model)
8. TREC cease-and-desist enforcement authority (KS SB 382 model)

Each provision needs thorough research and precise language before launch.

### Page 6: Petition (`/petition`)

Signature collection, email verification, legislator lookup, and pre-written outreach.

**Sections:**
1. **Hero** — "Sign the Petition." Subtext about joining licensed Texas realtors.
2. **Live Signature Count** — Large number, updated in real-time. Starts at 0.
3. **Petition Form** — Fields: first name, last name, email, brokerage, TREC license #, city. Checkboxes: attestation ("I am a licensed Texas real estate professional..."), opt-in for updates (recruiting pipeline). Email pre-fills if already verified via shared identity layer. "A verification email will be sent" disclaimer.
4. **Legislator Lookup** (shown after email verification) — Enter address → Google Civic Information API → returns TX House and Senate reps with name, district, party. Each rep card has "Send Pre-Written Letter →" button.
5. **Pre-Written Letter** — Personalized with signer's name, brokerage, city. Opens in email client via mailto: link. Editable before sending.
6. **Public Signature Wall** — Grid of verified signatures: name, brokerage, city, TREC#. Social proof.
7. **Share Buttons** — Facebook, Copy Link, WhatsApp.
8. **Bottom CTA** — "Thank you for standing up." → Share Your Story.

## Layout & Navigation

**Route group:** `(advocacy)` with its own `layout.tsx` using `AccessHeader` + `AccessFooter` (same as home pages).

**Sub-navigation:** Horizontal nav bar within the advocacy layout showing the 6 pages. Highlights current page. Sticky on scroll or placed below the header.

**Footer:** Add "Protect Texas Homeowners" link to `AccessFooter.tsx` Quick Links section.

## Integration Points

| Service | Purpose | Notes |
|---------|---------|-------|
| Google Civic Information API | Legislator lookup by address | Free tier, returns state legislators |
| Supabase | All data storage | Shared DB with app repo |
| Email (Resend or Supabase Auth) | Verification emails | Transactional — verification links for petition + voting |
| YouTube (lite-embed) | Video embeds | Static thumbnails, load iframe on click |

## Branding

Full Access Realty branding throughout. Same navy/cream/gold palette, same header/footer. "An Access Realty Initiative" badge on landing page hero.

## Technical Notes

- Pages are Next.js Server Components where possible (SEO-friendly)
- Interactive pieces (voting, forms, legislator lookup, video embeds) are Client Components
- API routes handle: email verification, vote submission, story submission, Google Civic lookups
- US map: react-simple-maps library or custom SVG with state paths
- YouTube lite-embed pattern for performance (no iframe until click)
- State legislation data: hardcoded JSON (not in DB — changes rarely)
- Provision language: needs dedicated research pass before launch

## Out of Scope (for now)

- TREC license number automated verification (using self-attested + public display model)
- Comment threads on provisions (just up/down voting + suggest new)
- Admin dashboard for moderation (use Supabase dashboard directly)
- Social media auto-posting of signatures
