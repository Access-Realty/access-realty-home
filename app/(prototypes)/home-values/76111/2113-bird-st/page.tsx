// ABOUTME: Prototype — SEO property page for 2113 Bird St, Fort Worth TX
// ABOUTME: Full template per design doc: breadcrumbs, hero, specs, comps, market stats, calculator, CTA

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { getListingsNearby, getPropertyHeroImage } from "@/lib/listings-seo";
import ListingsMapSection from "@/components/listings/ListingsMapSection";
import PropertyHero from "@/components/listings/PropertyHero";

export const dynamic = 'force-dynamic'

// ─── Real parcel data from parcels table ──────────────────────────────────────
const PARCEL = {
  id: "cc85d4ec-5af4-4808-9fb9-3c12d3f83ee0",
  street_address: "2113 Bird St",
  city: "Fort Worth",
  state: "TX",
  zip: "76111",
  county: "Tarrant",
  latitude: 32.777231,
  longitude: -97.314469,
  property_type_detail: "Single Family",
  living_area_sqft: 2137,
  bedrooms: 3,
  bathrooms_full: 3,
  bathrooms_total: 3.0,
  stories: 2,
  lot_size_acres: 0.072,
  lot_size_sqft: 3136,
  year_built: 2018,
  subdivision_name: "Scenic Village Addition",
  fireplace_count: 0,
  building_condition: "Excellent",
  assessed_total_value: 470575,
  assessed_land_value: 100000,
  assessed_improvement_value: 370575,
  market_total_value: 470575,
  tax_amount: 8509.97,
  tax_year: 2024,
  assessment_year: 2025,
  avm_value: 463547,
  avm_low: 372976,
  avm_high: 554118,
  avm_confidence_score: 73,
  avm_as_of_date: "2025-09-03",
  last_sale_price: 495717,
  last_transfer_date: "2023-01-30",
  owner_occupied: true,
};

// ─── Market stats for 76111 ───────────────────────────────────────────────────
const MARKET_STATS = {
  period: "Feb 2026",
  median_sale_price: 325000,
  median_price_change_yoy: 4.8,
  avg_dom: 26,
  months_of_supply: 1.9,
  pct_list_price_received: 98.2,
  active_inventory: 28,
  closed_last_30: 14,
  closed_last_90: 45,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}

function marketTemperature(monthsOfSupply: number) {
  if (monthsOfSupply < 3) return { label: "Seller's Market", color: "text-success", bg: "bg-success/10" };
  if (monthsOfSupply < 5) return { label: "Balanced Market", color: "text-warning", bg: "bg-warning/10" };
  return { label: "Buyer's Market", color: "text-info", bg: "bg-info/10" };
}

export default async function PropertyPage() {
  const [nearbyListings, heroImage] = await Promise.all([
    getListingsNearby(32.777231, -97.314469),
    getPropertyHeroImage(PARCEL.id, 32.777231, -97.314469),
  ]);
  const p = PARCEL;
  const temp = marketTemperature(MARKET_STATS.months_of_supply);
  const specsLine = `${p.bedrooms} bed · ${p.bathrooms_full} bath · ${fmtNum(p.living_area_sqft)} sqft · Built ${p.year_built}`;

  return (
    <div className="bg-background">
      {/* ── 1b + 2. Immersive Property Hero ────────────────────────────── */}
      <PropertyHero
        imageUrl={heroImage.url}
        address={p.street_address}
        city={p.city}
        state={p.state}
        zip={p.zip}
        specs={specsLine}
        lotSize={String(p.lot_size_acres)}
        source={heroImage.source}
      />

      {/* ── 5. Nearby Market Activity ──────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Nearby Market Activity</h2>
          <Link href="/home-values" className="text-sm text-primary hover:underline">
            How comps work →
          </Link>
        </div>
        <ListingsMapSection
          activeListings={nearbyListings.active.listings}
          activeRadiusMiles={nearbyListings.active.radiusMiles}
          closedListings={nearbyListings.closed.listings}
          closedRadiusMiles={nearbyListings.closed.radiusMiles}
          initialCenter={[-97.314469, 32.777231]}
          initialZoom={14}
          clusteringEnabled={false}
          interactive={false}
        />
        <p className="text-xs text-muted-foreground mt-4">
          Comparable sales sourced from NTREIS MLS. Actual comparability depends on property condition, upgrades, and features not captured in public records.
        </p>
      </Section>

      {/* ── 6. Geographic Content Block ────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="prose prose-sm max-w-none text-foreground">
          <h2 className="text-2xl font-bold text-foreground mb-4">Fort Worth 76111 Market Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            The 76111 zip code covers Fort Worth&apos;s near northside — a neighborhood with deep roots and a rapidly changing skyline. Sitting just north of downtown and minutes from the historic Stockyards district, this area has long been a working-class community of small-lot bungalows built in the 1940s and 1950s. Over the past decade, new infill construction has transformed pockets of the neighborhood, with modern two-story builds like this 2018 home rising on lots that once held single-story cottages.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Homes in 76111 have sold at a median price of {fmt(MARKET_STATS.median_sale_price)} over the past 12 months, up {MARKET_STATS.median_price_change_yoy}% year-over-year. The mix is wide — renovated bungalows in the low $200s sit blocks away from new construction pushing past $500K. Proximity to downtown Fort Worth, the Trinity River trail system, and the ongoing Stockyards redevelopment continues to draw buyers who want walkability and character without north-side suburban prices.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tarrant County assessed property values rose an average of 4.1% in 2025, though many homeowners successfully protested their valuations. With an effective tax rate above 1.8% in this zip code, tax burden is a real factor — and one more reason sellers here are looking for ways to keep more of their equity at closing.
          </p>
        </div>
      </Section>

      {/* ── 7. Market Snapshot ─────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Market Snapshot — 76111</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Median Sale Price", value: fmt(MARKET_STATS.median_sale_price), sub: `${MARKET_STATS.median_price_change_yoy > 0 ? "+" : ""}${MARKET_STATS.median_price_change_yoy}% YoY` },
            { label: "Avg Days on Market", value: String(MARKET_STATS.avg_dom), sub: "days to contract" },
            { label: "Sale-to-List Ratio", value: `${MARKET_STATS.pct_list_price_received}%`, sub: "of asking price received" },
            { label: "Active Listings", value: String(MARKET_STATS.active_inventory), sub: `${MARKET_STATS.closed_last_30} closed last 30 days` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${temp.color} ${temp.bg}`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${temp.color === "text-success" ? "bg-success" : temp.color === "text-warning" ? "bg-warning" : "bg-info"}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${temp.color === "text-success" ? "bg-success" : temp.color === "text-warning" ? "bg-warning" : "bg-info"}`} />
          </span>
          {temp.label} · {MARKET_STATS.months_of_supply} months of supply
        </div>
      </Section>

      {/* ── 3. Property Details ────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Property Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Specs card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Property Specs</h3>
            <dl className="space-y-3">
              {[
                ["Property Type", p.property_type_detail],
                ["Bedrooms", p.bedrooms],
                ["Bathrooms", `${p.bathrooms_full} full`],
                ["Living Area", `${fmtNum(p.living_area_sqft)} sqft`],
                ["Stories", p.stories],
                ["Lot Size", `${p.lot_size_acres} acres (${fmtNum(p.lot_size_sqft)} sqft)`],
                ["Year Built", p.year_built],
                ["Subdivision", p.subdivision_name],
                ["Condition", p.building_condition],
                ["Fireplaces", p.fireplace_count],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tax / assessment card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tax Assessment ({p.assessment_year})</h3>
            <dl className="space-y-3 mb-6">
              {[
                ["Assessed Total Value", fmt(p.assessed_total_value)],
                ["Land Value", fmt(p.assessed_land_value)],
                ["Improvement Value", fmt(p.assessed_improvement_value)],
                ["Market Total Value", fmt(p.market_total_value)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Annual Property Tax ({p.tax_year})</span>
                <span className="text-xl font-bold text-foreground">{fmt(p.tax_amount)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Effective rate: {((p.tax_amount / p.assessed_total_value) * 100).toFixed(2)}%
              </div>
            </div>

            <div className="mt-6 p-4 border border-dashed border-border rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Think your assessment is too high?
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                Property tax protest tools — coming soon
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 4. Last Sale ───────────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Sale History</h2>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Last Sale Price</span>
            <span className="text-xl font-bold text-foreground">{fmt(p.last_sale_price)}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Transferred {new Date(p.last_transfer_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </Section>

      {/* ── 9. Net Proceeds Calculator (placeholder) ──────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-2">Net Proceeds Calculator</h2>
        <p className="text-sm text-muted-foreground mb-6">
          See how much you keep when you sell — and how much you save with DirectList&apos;s flat fee vs. a traditional 3% commission.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Sale</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Sale Price</label>
                <input
                  type="text"
                  defaultValue={fmt(p.avm_value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Remaining Mortgage</label>
                <input
                  type="text"
                  defaultValue="$0"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Buyer Agent Commission</label>
                <input
                  type="text"
                  defaultValue="2.5%"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Savings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                <span className="text-sm text-muted-foreground">Traditional Agent (3%)</span>
                <span className="text-sm font-medium text-foreground">{fmt(p.avm_value * 0.03)}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                <span className="text-sm text-muted-foreground">DirectList Flat Fee</span>
                <span className="text-sm font-medium text-foreground">$2,995</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-foreground">You Save</span>
                <span className="text-xl font-bold text-success">{fmt(p.avm_value * 0.03 - 2995)}</span>
              </div>
            </div>

            <div className="mt-6 bg-success/10 rounded-lg p-4 text-center">
              <p className="text-sm text-success font-medium">
                Keep {fmt(p.avm_value * 0.03 - 2995)} more at closing with DirectList
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 10. DirectList CTA ─────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="bg-card rounded-xl border border-border p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to sell {p.street_address}?
          </h2>
          <p className="text-muted-foreground mb-2 max-w-2xl mx-auto">
            Full MLS listing. Professional photography. A pricing strategy from a seasoned professional — included, not upsold. {fmt(2995)} flat.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            The rest stays with you.
          </p>
          <Link
            href="/direct-list/get-started"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started on Your Terms
          </Link>
        </div>
      </Section>

      {/* ── 11. Email Signup ───────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Stay Informed on 76111</h2>
            <p className="text-muted-foreground">
              Get market updates for your area — recently sold homes, new listings nearby, and price trends for your zip code. Choose monthly or quarterly delivery.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">How often?</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="cadence" value="monthly" defaultChecked className="accent-primary" />
                    Monthly
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="cadence" value="quarterly" className="accent-primary" />
                    Quarterly
                  </label>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 12. Footer Disclaimers ─────────────────────────────────────────── */}
      <Section variant="tight" maxWidth="5xl">
        <div className="text-xs text-muted-foreground space-y-2 border-t border-border pt-6">
          <p>
            <strong>AVM Disclaimer:</strong> Automated Valuation Models (AVMs) provide estimates based on public records, recent sales, and statistical modeling. They do not account for property condition, renovations, or unique features. An AVM is a starting point — not a substitute for a professional pricing strategy.
          </p>
          <p>
            <strong>Fair Housing:</strong> We are committed to the letter and spirit of federal, state, and local fair housing law. We do not discriminate on the basis of race, color, religion, sex, handicap, familial status, national origin, sexual orientation, or gender identity.
          </p>
          <p>
            Property data sourced from Tarrant County Appraisal District and NTREIS MLS. Data believed reliable but not guaranteed. Last updated {MARKET_STATS.period}.
          </p>
        </div>
      </Section>

      {/* ── Browse Nearby ────────────────────────────────────────────────── */}
      <Section variant="tight" maxWidth="5xl">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Browse nearby</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Home Values', href: '/home-values' },
            { label: '76111', href: '/home-values/76111' },
            { label: 'Fort Worth', href: '/home-values/fort-worth' },
            { label: 'Tarrant County', href: '/home-values/tarrant-county' },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </Section>

      {/* Bottom CTA flows into footer */}
      <DirectListCTA
        heading="Keep What's Yours"
        subheading="Full MLS listing. Flat fee. Professional support when you want it."
        buttonText="Get Started Now"
        buttonHref="/direct-list/get-started"
      />
    </div>
  );
}
