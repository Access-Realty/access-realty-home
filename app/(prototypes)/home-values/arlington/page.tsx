// ABOUTME: Prototype — City hub page for Arlington, TX
// ABOUTME: Market overview, zip breakdowns, editorial content, map

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { getClosedListingsByCity } from "@/lib/listings-seo";
import ListingsMapSection from "@/components/listings/ListingsMapSection";

export const dynamic = 'force-dynamic'

const CITY_STATS = {
  period: "Feb 2026",
  median_sale_price: 355000,
  median_price_yoy: 2.8,
  avg_dom: 33,
  months_of_supply: 3.1,
  sp_lp_ratio: 97.1,
  active: 890,
  closed_30: 312,
  closed_90: 985,
  population: 394266,
  median_household_income: 62800,
};

const ZIP_BREAKDOWNS = [
  { zip: "76001", name: "Southwest Arlington", median: 310000, dom: 35, active: 95, yoy: 1.9 },
  { zip: "76002", name: "Southeast Arlington", median: 340000, dom: 30, active: 78, yoy: 3.1 },
  { zip: "76006", name: "North Arlington / Pantego", median: 385000, dom: 28, active: 62, yoy: 4.2 },
  { zip: "76010", name: "Central Arlington", median: 275000, dom: 38, active: 110, yoy: 1.5 },
  { zip: "76011", name: "Northwest Arlington", median: 365000, dom: 26, active: 54, yoy: 3.8 },
  { zip: "76012", name: "West Arlington", median: 320000, dom: 32, active: 88, yoy: 2.4 },
  { zip: "76013", name: "Central West Arlington", median: 290000, dom: 36, active: 72, yoy: 1.8 },
  { zip: "76014", name: "South Arlington", median: 335000, dom: 29, active: 68, yoy: 3.5 },
  { zip: "76015", name: "South Central Arlington", median: 345000, dom: 31, active: 75, yoy: 2.9 },
  { zip: "76016", name: "West Central Arlington", median: 350000, dom: 27, active: 58, yoy: 3.4 },
  { zip: "76017", name: "South Arlington / Wimbledon", median: 385000, dom: 31, active: 142, yoy: 3.2 },
  { zip: "76018", name: "South Arlington / Sublett", median: 360000, dom: 30, active: 85, yoy: 3.0 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function CityHubPage() {
  const listings = await getClosedListingsByCity("Arlington");

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Geographic context" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/prototypes/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
              <li className="before:content-['·'] before:mx-1.5 text-primary-foreground/90">Arlington</li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/prototypes/home-values/tarrant-county" className="hover:text-primary-foreground/90 transition-colors">Tarrant County</Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Arlington Home Values
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Tarrant County, TX · Population {CITY_STATS.population.toLocaleString()}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Price</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(CITY_STATS.median_sale_price)}</div>
              <div className="text-primary-foreground/60 text-xs">+{CITY_STATS.median_price_yoy}% YoY</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{CITY_STATS.avg_dom}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Active Listings</div>
              <div className="text-primary-foreground text-xl font-bold">{CITY_STATS.active}</div>
              <div className="text-primary-foreground/60 text-xs">{CITY_STATS.closed_30} sold last 30 days</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Income</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(CITY_STATS.median_household_income)}</div>
              <div className="text-primary-foreground/60 text-xs">household income</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial — unique city narrative */}
      <Section variant="content" maxWidth="5xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">The Arlington Market</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Arlington is the largest city in the DFW metroplex that isn&apos;t a county seat — and that lack of county-government infrastructure is part of what keeps tax rates competitive. Sitting squarely between Dallas and Fort Worth, Arlington offers something the north-side suburbs don&apos;t: genuine price diversity. You can find a move-in-ready starter home for $250,000 in central Arlington or a new-build with a pool for $550,000 in the southern corridors — all within the same city limits.
            </p>
            <p>
              The entertainment district anchored by AT&amp;T Stadium, Globe Life Field, and the expanding Texas Live! complex has reshaped buyer perception of the city. What was once a pass-through has become a destination. Neighborhoods within a 10-minute drive of the stadiums — particularly in 76011 and 76006 — have seen the fastest appreciation, driven by short-term rental investors and young professionals drawn to the walkable mixed-use developments.
            </p>
            <p>
              For sellers, Arlington&apos;s market remains favorable. Inventory sits below 3.5 months of supply citywide, with the south-side zips (76017, 76018) running even tighter. Homes priced at or below the median move in under 30 days. The key differentiator is condition — buyers in this price range have options, and they&apos;re choosing updated homes over fixer-uppers.
            </p>
          </div>
        </div>
      </Section>

      {/* Interactive map */}
      <Section variant="content" maxWidth="5xl">
        <ListingsMapSection
          activeListings={[]}
          closedListings={listings}
          initialCenter={[-97.11, 32.74]}
          initialZoom={11}
          clusteringEnabled={true}
          title="Arlington Sales Activity"
        />
      </Section>

      {/* Zip code breakdown table */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Arlington by Zip Code</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 pr-4 font-semibold text-foreground">Zip Code</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Area</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Median Price</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden md:table-cell">YoY</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Avg DOM</th>
                <th className="text-right py-3 pl-4 font-semibold text-foreground hidden lg:table-cell">Active</th>
              </tr>
            </thead>
            <tbody>
              {ZIP_BREAKDOWNS.map((zip) => (
                <tr key={zip.zip} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/prototypes/home-values/${zip.zip}`} className="font-medium text-primary hover:underline">
                      {zip.zip}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{zip.name}</td>
                  <td className="text-right py-3 px-4 font-semibold text-foreground">{fmt(zip.median)}</td>
                  <td className="text-right py-3 px-4 hidden md:table-cell">
                    <span className={zip.yoy >= 3 ? "text-success" : "text-muted-foreground"}>
                      +{zip.yoy}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-muted-foreground">{zip.dom}</td>
                  <td className="text-right py-3 pl-4 text-muted-foreground hidden lg:table-cell">{zip.active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* School districts cross-link */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">School Districts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Arlington ISD", homes: 4200, rating: "B+", slug: "arlington-isd" },
            { name: "Mansfield ISD", homes: 1800, rating: "A", slug: "mansfield-isd" },
            { name: "Kennedale ISD", homes: 340, rating: "B", slug: "kennedale-isd" },
          ].map((district) => (
            <Link
              key={district.slug}
              href={`/prototypes/home-values/school-districts/${district.slug}`}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-baseline justify-between mb-1">
                <div className="font-medium text-foreground">{district.name}</div>
                <div className="text-sm font-semibold text-primary">{district.rating}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                ~{district.homes.toLocaleString()} homes in Arlington
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <DirectListCTA
        heading="Selling in Arlington?"
        subheading="Full MLS listing for a flat fee. Your home, your terms, your equity."
        buttonText="Get Started Now"
        buttonHref="/direct-list/get-started"
      />
    </div>
  );
}
