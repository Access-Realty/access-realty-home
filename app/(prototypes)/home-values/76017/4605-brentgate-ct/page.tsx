// ABOUTME: Prototype — SEO property page for 4605 Brentgate Ct, Arlington TX
// ABOUTME: Full template per design doc: breadcrumbs, hero, specs, comps, market stats, calculator, CTA

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { getListingsNearby } from "@/lib/listings-seo";
import ListingsMapSection from "@/components/listings/ListingsMapSection";

export const dynamic = 'force-dynamic'

// ─── Real parcel data from parcels table ──────────────────────────────────────
const PARCEL = {
  street_address: "4605 Brentgate Ct",
  city: "Arlington",
  state: "TX",
  zip: "76017",
  county: "Tarrant",
  latitude: 32.671639,
  longitude: -97.142574,
  property_type_detail: "Single Family",
  living_area_sqft: 2555,
  bedrooms: 3,
  bathrooms_full: 2,
  bathrooms_total: 2.0,
  stories: 1,
  lot_size_acres: 0.294,
  lot_size_sqft: 12798,
  year_built: 1978,
  subdivision_name: "Wimbledon North Addition",
  garage: "Attached Garage",
  garage_spaces: 3,
  exterior_walls: "Brick",
  roof_cover: "Wood Shake / Shingles",
  heating_type: "Central",
  cooling_type: "Central",
  assessed_total_value: 402008,
  assessed_land_value: 70000,
  assessed_improvement_value: 332008,
  market_total_value: 402008,
  tax_amount: 2295.56,
  tax_year: 2024,
  assessment_year: 2025,
  avm_value: 427251,
  avm_low: 345343,
  avm_high: 509159,
  avm_confidence_score: 74,
  avm_as_of_date: "2025-11-10",
  last_sale_price: null as number | null,
  last_transfer_date: null as string | null,
  owner_occupied: true,
};

// ─── Market stats for 76017 ───────────────────────────────────────────────────
const MARKET_STATS = {
  period: "Feb 2026",
  median_sale_price: 385000,
  median_price_change_yoy: 3.2,
  avg_dom: 31,
  months_of_supply: 2.8,
  pct_list_price_received: 97.4,
  active_inventory: 142,
  closed_last_30: 48,
  closed_last_90: 156,
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
  const listings = await getListingsNearby(32.671639, -97.142574);
  const p = PARCEL;
  const temp = marketTemperature(MARKET_STATS.months_of_supply);
  const specsLine = `${p.bedrooms} bed · ${p.bathrooms_full} bath · ${fmtNum(p.living_area_sqft)} sqft · Built ${p.year_built}`;

  return (
    <div className="bg-background">
      {/* ── 1. Breadcrumbs ─────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Geographic context" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/prototypes/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/prototypes/home-values/76017" className="hover:text-primary-foreground/90 transition-colors">76017</Link>
              </li>
              <li className="before:content-['·'] before:mx-1.5 text-primary-foreground/90">{p.street_address}</li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/prototypes/home-values/arlington" className="hover:text-primary-foreground/90 transition-colors">Arlington</Link>
              </li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/prototypes/home-values/tarrant-county" className="hover:text-primary-foreground/90 transition-colors">Tarrant County</Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── 2. Hero ────────────────────────────────────────────────────────── */}
      <section className="bg-primary pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {p.street_address}
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-1">
                {p.city}, {p.state} {p.zip}
              </p>
              <p className="text-primary-foreground/60 text-sm mb-6">
                {specsLine} · {p.lot_size_acres} acres
              </p>

              {/* Key specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Bedrooms", value: p.bedrooms },
                  { label: "Bathrooms", value: p.bathrooms_full },
                  { label: "Sq Ft", value: fmtNum(p.living_area_sqft) },
                  { label: "Year Built", value: p.year_built },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-lg px-4 py-3">
                    <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">{item.label}</div>
                    <div className="text-primary-foreground text-xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AVM teaser / email gate */}
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-foreground mb-1">Estimated Home Value</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Get a data-driven estimate for this property based on recent sales and market trends.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-4 text-center">
                <div className="text-3xl font-bold text-primary blur-sm select-none" aria-hidden="true">
                  {fmt(p.avm_value)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Range: {fmt(p.avm_low)} – {fmt(p.avm_high)}</div>
              </div>
              <label className="block text-sm font-medium text-foreground mb-1">Your email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg hover:bg-secondary/90 transition-colors">
                See Estimated Value
              </button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Free. No obligation. We&apos;ll send market updates too.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                ["Garage", `${p.garage} — ${p.garage_spaces} spaces`],
                ["Exterior", p.exterior_walls],
                ["Roof", p.roof_cover],
                ["Heating / Cooling", `${p.heating_type} / ${p.cooling_type}`],
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

      {/* ── 5. Recently Sold Near You ──────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recently Sold Near You</h2>
          <Link href="/home-values" className="text-sm text-primary hover:underline">
            How comps work →
          </Link>
        </div>
        <ListingsMapSection
          listings={listings}
          initialCenter={[-97.142574, 32.671639]}
          initialZoom={14}
          clusteringEnabled={false}
        />
        <p className="text-xs text-muted-foreground mt-4">
          Comparable sales sourced from NTREIS MLS. Actual comparability depends on property condition, upgrades, and features not captured in public records.
        </p>
      </Section>

      {/* ── 6. Geographic Content Block (spun — showing resolved version) ── */}
      <Section variant="content" maxWidth="5xl">
        <div className="prose prose-sm max-w-none text-foreground">
          <h2 className="text-2xl font-bold text-foreground mb-4">Arlington 76017 Market Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            Homes in the 76017 zip code have sold at a median price of {fmt(MARKET_STATS.median_sale_price)} over the past 12 months, representing a {MARKET_STATS.median_price_change_yoy}% gain compared to the prior year. The neighborhood sits in south Arlington, anchored by the Wimbledon North and Brentwood Park subdivisions — mature neighborhoods with established trees, larger lots, and proximity to both I-20 and the Parks Mall corridor.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Arlington&apos;s housing market continues to benefit from its central DFW location and relative affordability compared to north-side suburbs like Southlake or Colleyville. The city&apos;s investment in entertainment districts and mixed-use development has drawn renewed buyer interest, particularly among families and investors looking for value in Tarrant County.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tarrant County assessed property values rose an average of 4.1% in 2025, though many homeowners successfully protested their valuations. The county appraisal district processes over 200,000 protests annually — the highest volume in the state.
          </p>
        </div>
      </Section>

      {/* ── 7. Market Snapshot ─────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Market Snapshot — 76017</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Stay Informed on 76017</h2>
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
