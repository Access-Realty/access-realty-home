// ABOUTME: Prototype — County hub page for Tarrant County, TX
// ABOUTME: Top-level geo hub with city breakdowns, tax context, editorial content

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { getClosedListingsByCounty } from '@/lib/listings-seo';
import ListingsMapSection from '@/components/listings/ListingsMapSection';

export const dynamic = 'force-dynamic'

const COUNTY_STATS = {
  period: "Feb 2026",
  median_sale_price: 372000,
  median_price_yoy: 2.5,
  avg_dom: 32,
  months_of_supply: 3.0,
  sp_lp_ratio: 97.2,
  active: 4200,
  closed_30: 1580,
  closed_90: 4920,
  population: 2110640,
  avg_tax_rate: 2.15,
};

const CITIES = [
  { name: "Fort Worth", slug: "fort-worth", median: 380000, dom: 30, active: 1850, yoy: 2.9, pop: 958692 },
  { name: "Arlington", slug: "arlington", median: 355000, dom: 33, active: 890, yoy: 2.8, pop: 394266 },
  { name: "Mansfield", slug: "mansfield", median: 425000, dom: 28, active: 310, yoy: 3.6, pop: 78240 },
  { name: "Southlake", slug: "southlake", median: 950000, dom: 42, active: 185, yoy: 1.2, pop: 32376 },
  { name: "Keller", slug: "keller", median: 520000, dom: 35, active: 220, yoy: 2.1, pop: 48907 },
  { name: "Grapevine", slug: "grapevine", median: 485000, dom: 30, active: 165, yoy: 3.4, pop: 54857 },
  { name: "Colleyville", slug: "colleyville", median: 680000, dom: 38, active: 125, yoy: 1.8, pop: 27750 },
  { name: "Hurst", slug: "hurst", median: 340000, dom: 27, active: 110, yoy: 3.8, pop: 40152 },
  { name: "Bedford", slug: "bedford", median: 350000, dom: 26, active: 95, yoy: 3.5, pop: 49464 },
  { name: "Euless", slug: "euless", median: 355000, dom: 29, active: 120, yoy: 3.1, pop: 61032 },
  { name: "North Richland Hills", slug: "north-richland-hills", median: 365000, dom: 31, active: 175, yoy: 2.7, pop: 72888 },
  { name: "Watauga", slug: "watauga", median: 310000, dom: 25, active: 65, yoy: 4.1, pop: 24587 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function CountyHubPage() {
  const listings = await getClosedListingsByCounty('Tarrant');

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
              <li className="before:content-['/'] before:mx-1.5 text-primary-foreground/90">Tarrant County</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Tarrant County Home Values
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Texas · {COUNTY_STATS.population.toLocaleString()} residents · {CITIES.length}+ cities
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Price</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(COUNTY_STATS.median_sale_price)}</div>
              <div className="text-primary-foreground/60 text-xs">+{COUNTY_STATS.median_price_yoy}% YoY</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{COUNTY_STATS.avg_dom}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Active Listings</div>
              <div className="text-primary-foreground text-xl font-bold">{COUNTY_STATS.active.toLocaleString()}</div>
              <div className="text-primary-foreground/60 text-xs">{COUNTY_STATS.closed_30.toLocaleString()} sold last 30 days</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg Tax Rate</div>
              <div className="text-primary-foreground text-xl font-bold">{COUNTY_STATS.avg_tax_rate}%</div>
              <div className="text-primary-foreground/60 text-xs">effective rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial — county narrative */}
      <Section variant="content" maxWidth="5xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tarrant County Overview</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Tarrant County is the third-most-populous county in Texas and the economic anchor of the western half of DFW. It encompasses everything from Fort Worth&apos;s urban core to Southlake&apos;s gated estates — a price spread that runs from $150,000 starter homes to $5M+ lakefront properties. That range makes it one of the most diverse residential markets in the state.
            </p>
            <p>
              The county&apos;s residential market is defined by two dynamics: sustained population growth (Tarrant added 18,000 residents in 2025) and a persistent inventory shortage. New construction in the south and west corridors — particularly in Mansfield, Burleson, and southwest Fort Worth — has added supply, but not enough to bring months-of-supply above 3.5 countywide.
            </p>
            <p>
              Property taxes remain a dominant factor in homeownership costs. Tarrant County&apos;s effective rate averages {COUNTY_STATS.avg_tax_rate}%, which on a {fmt(COUNTY_STATS.median_sale_price)} home translates to roughly {fmt(COUNTY_STATS.median_sale_price * COUNTY_STATS.avg_tax_rate / 100)} annually. The Tarrant Appraisal District processes over 200,000 protests each year — the highest volume in Texas. For homeowners weighing whether to sell, the combination of rising assessed values and flat or declining real appreciation in some zips creates a natural decision point.
            </p>
          </div>
        </div>
      </Section>

      {/* Interactive map */}
      <Section variant="content" maxWidth="5xl">
        <ListingsMapSection
          activeListings={[]}
          closedListings={listings}
          initialCenter={[-97.30, 32.76]}
          initialZoom={10}
          clusteringEnabled={true}
          title="Tarrant County Sales Activity"
        />
      </Section>

      {/* City breakdown table */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County by City</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 pr-4 font-semibold text-foreground">City</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Median Price</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden md:table-cell">YoY</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Avg DOM</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Active</th>
                <th className="text-right py-3 pl-4 font-semibold text-foreground hidden lg:table-cell">Population</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((city) => (
                <tr key={city.slug} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/home-values/${city.slug}`} className="font-medium text-primary hover:underline">
                      {city.name}
                    </Link>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-foreground">{fmt(city.median)}</td>
                  <td className="text-right py-3 px-4 hidden md:table-cell">
                    <span className={city.yoy >= 3 ? "text-success" : "text-muted-foreground"}>
                      +{city.yoy}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-muted-foreground">{city.dom}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground hidden sm:table-cell">{city.active}</td>
                  <td className="text-right py-3 pl-4 text-muted-foreground hidden lg:table-cell">{city.pop.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Tax context */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">Property Taxes in Tarrant County</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Texas has no state income tax, which means local governments rely heavily on property taxes to fund schools, roads, and services. Tarrant County&apos;s effective tax rate — roughly {COUNTY_STATS.avg_tax_rate}% — is competitive within DFW but varies significantly by taxing jurisdiction.
            </p>
            <p>
              The Tarrant Appraisal District reappraises all properties annually. In 2025, assessed values rose an average of 4.1% countywide. Homeowners who believe their assessment exceeds market value can protest — and many do. Over 200,000 protests were filed in 2025, with an average reduction of 8–12% for successful cases.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tax Impact at Median Price</h3>
            <dl className="space-y-3">
              {[
                ["Median Home Value", fmt(COUNTY_STATS.median_sale_price)],
                ["Effective Tax Rate", `${COUNTY_STATS.avg_tax_rate}%`],
                ["Est. Annual Tax", fmt(COUNTY_STATS.median_sale_price * COUNTY_STATS.avg_tax_rate / 100)],
                ["Est. Monthly Tax", fmt(COUNTY_STATS.median_sale_price * COUNTY_STATS.avg_tax_rate / 100 / 12)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <DirectListCTA
        heading="Selling in Tarrant County?"
        subheading="Same MLS exposure. Same buyer pool. Thousands less in commissions."
        buttonText="See How It Works"
        buttonHref="/direct-list"
      />
    </div>
  );
}
