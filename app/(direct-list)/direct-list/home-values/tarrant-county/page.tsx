// ABOUTME: Prototype — County hub page for Tarrant County, TX
// ABOUTME: Hardcoded stats for prototype review — no live DB queries

import Link from "next/link"
import { Section } from "@/components/layout"
import { DirectListCTA } from "@/components/layout/DirectListCTA"
import MarketSnapshotGrid from "@/components/market-stats/MarketSnapshotGrid"
import MarketTimeSeries from "@/components/market-stats/MarketTimeSeries"
import type { MarketSnapshot, MonthlyDataPoint } from "@/lib/market-stats"

// City data — population is not in MLS
const CITIES = [
  { name: "Fort Worth", slug: "fort-worth", pop: 958692 },
  { name: "Arlington", slug: "arlington", pop: 394266 },
  { name: "Mansfield", slug: "mansfield", pop: 78240 },
  { name: "Southlake", slug: "southlake", pop: 32376 },
  { name: "Keller", slug: "keller", pop: 48907 },
  { name: "Grapevine", slug: "grapevine", pop: 54857 },
  { name: "Colleyville", slug: "colleyville", pop: 27750 },
  { name: "Hurst", slug: "hurst", pop: 40152 },
  { name: "Bedford", slug: "bedford", pop: 49464 },
  { name: "Euless", slug: "euless", pop: 61032 },
  { name: "North Richland Hills", slug: "north-richland-hills", pop: 72888 },
  { name: "Watauga", slug: "watauga", pop: 24587 },
]

const AVG_TAX_RATE = 2.15

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

// ─── Hardcoded prototype data — reasonable for Tarrant County ────────────────

const snapshot: MarketSnapshot = {
  period: "Mar 2026",
  periodEnd: "2026-03-23",
  medianSalePrice: 372000,
  medianPricePerSqft: 178,
  medianDom: 32,
  activeInventory: 4200,
  newListings30d: 1420,
  closedSales30d: 1580,
  pendingSales30d: 1190,
  monthsOfSupply: 3.0,
  saleToListRatio: 97.2,
  pctOverList: 18.6,
  pctUnderList: 48.3,
  contractRate: 28.3,
}

const timeSeries: MonthlyDataPoint[] = [
  { month: "2024-04", label: "Apr 2024", medianSalePrice: 355000, salesVolume: 1520, medianDom: 35, activeInventory: 4600, medianPricePerSqft: 170 },
  { month: "2024-05", label: "May 2024", medianSalePrice: 362000, salesVolume: 1780, medianDom: 31, activeInventory: 4400, medianPricePerSqft: 173 },
  { month: "2024-06", label: "Jun 2024", medianSalePrice: 368000, salesVolume: 1850, medianDom: 28, activeInventory: 4200, medianPricePerSqft: 176 },
  { month: "2024-07", label: "Jul 2024", medianSalePrice: 365000, salesVolume: 1690, medianDom: 30, activeInventory: 4350, medianPricePerSqft: 175 },
  { month: "2024-08", label: "Aug 2024", medianSalePrice: 360000, salesVolume: 1600, medianDom: 33, activeInventory: 4500, medianPricePerSqft: 173 },
  { month: "2024-09", label: "Sep 2024", medianSalePrice: 356000, salesVolume: 1380, medianDom: 36, activeInventory: 4700, medianPricePerSqft: 171 },
  { month: "2024-10", label: "Oct 2024", medianSalePrice: 352000, salesVolume: 1280, medianDom: 38, activeInventory: 4800, medianPricePerSqft: 169 },
  { month: "2024-11", label: "Nov 2024", medianSalePrice: 348000, salesVolume: 1050, medianDom: 40, activeInventory: 4650, medianPricePerSqft: 167 },
  { month: "2024-12", label: "Dec 2024", medianSalePrice: 345000, salesVolume: 820, medianDom: 42, activeInventory: 4400, medianPricePerSqft: 166 },
  { month: "2025-01", label: "Jan 2025", medianSalePrice: 348000, salesVolume: 950, medianDom: 40, activeInventory: 4300, medianPricePerSqft: 167 },
  { month: "2025-02", label: "Feb 2025", medianSalePrice: 352000, salesVolume: 1120, medianDom: 37, activeInventory: 4250, medianPricePerSqft: 169 },
  { month: "2025-03", label: "Mar 2025", medianSalePrice: 358000, salesVolume: 1450, medianDom: 34, activeInventory: 4150, medianPricePerSqft: 172 },
  { month: "2025-04", label: "Apr 2025", medianSalePrice: 362000, salesVolume: 1620, medianDom: 32, activeInventory: 4100, medianPricePerSqft: 174 },
  { month: "2025-05", label: "May 2025", medianSalePrice: 368000, salesVolume: 1800, medianDom: 29, activeInventory: 3950, medianPricePerSqft: 176 },
  { month: "2025-06", label: "Jun 2025", medianSalePrice: 374000, salesVolume: 1900, medianDom: 27, activeInventory: 3800, medianPricePerSqft: 179 },
  { month: "2025-07", label: "Jul 2025", medianSalePrice: 370000, salesVolume: 1720, medianDom: 29, activeInventory: 3950, medianPricePerSqft: 177 },
  { month: "2025-08", label: "Aug 2025", medianSalePrice: 367000, salesVolume: 1640, medianDom: 31, activeInventory: 4100, medianPricePerSqft: 176 },
  { month: "2025-09", label: "Sep 2025", medianSalePrice: 363000, salesVolume: 1400, medianDom: 34, activeInventory: 4300, medianPricePerSqft: 174 },
  { month: "2025-10", label: "Oct 2025", medianSalePrice: 360000, salesVolume: 1320, medianDom: 36, activeInventory: 4400, medianPricePerSqft: 173 },
  { month: "2025-11", label: "Nov 2025", medianSalePrice: 356000, salesVolume: 1100, medianDom: 38, activeInventory: 4350, medianPricePerSqft: 171 },
  { month: "2025-12", label: "Dec 2025", medianSalePrice: 354000, salesVolume: 880, medianDom: 40, activeInventory: 4200, medianPricePerSqft: 170 },
  { month: "2026-01", label: "Jan 2026", medianSalePrice: 360000, salesVolume: 1050, medianDom: 37, activeInventory: 4150, medianPricePerSqft: 173 },
  { month: "2026-02", label: "Feb 2026", medianSalePrice: 366000, salesVolume: 1280, medianDom: 34, activeInventory: 4200, medianPricePerSqft: 176 },
  { month: "2026-03", label: "Mar 2026", medianSalePrice: 372000, salesVolume: 1580, medianDom: 32, activeInventory: 4200, medianPricePerSqft: 178 },
]

export default function CountyHubPage() {
  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/direct-list/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
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
            Texas · {CITIES.length}+ cities
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Price</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(snapshot.medianSalePrice!)}</div>
              <div className="text-primary-foreground/60 text-xs">last 12 months</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.medianDom}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Active Listings</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.activeInventory.toLocaleString()}</div>
              <div className="text-primary-foreground/60 text-xs">{snapshot.closedSales30d.toLocaleString()} sold last 30 days</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg Tax Rate</div>
              <div className="text-primary-foreground text-xl font-bold">{AVG_TAX_RATE}%</div>
              <div className="text-primary-foreground/60 text-xs">effective rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial */}
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
              Property taxes remain a dominant factor in homeownership costs. Tarrant County&apos;s effective rate averages {AVG_TAX_RATE}%, which on a {fmt(snapshot.medianSalePrice!)} home translates to roughly {fmt(snapshot.medianSalePrice! * AVG_TAX_RATE / 100)} annually. The Tarrant Appraisal District processes over 200,000 protests each year — the highest volume in Texas.
            </p>
          </div>
        </div>
      </Section>

      {/* Market Snapshot */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County Market Snapshot</h2>
        <MarketSnapshotGrid snapshot={snapshot} />
      </Section>

      {/* Time Series */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County Market Trends — 24 Months</h2>
        <MarketTimeSeries data={timeSeries} />
      </Section>

      {/* City breakdown */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County by City</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/direct-list/home-values/${city.slug}`}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {city.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {city.pop.toLocaleString()} residents
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Tax context */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">Property Taxes in Tarrant County</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Texas has no state income tax, which means local governments rely heavily on property taxes to fund schools, roads, and services. Tarrant County&apos;s effective tax rate — roughly {AVG_TAX_RATE}% — is competitive within DFW but varies significantly by taxing jurisdiction.
            </p>
            <p>
              The Tarrant Appraisal District reappraises all properties annually. In 2025, assessed values rose an average of 4.1% countywide. Homeowners who believe their assessment exceeds market value can protest — and many do. Over 200,000 protests were filed in 2025, with an average reduction of 8–12% for successful cases.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tax Impact at Median Price</h3>
            <dl className="space-y-3">
              {[
                ["Median Home Value", fmt(snapshot.medianSalePrice!)],
                ["Effective Tax Rate", `${AVG_TAX_RATE}%`],
                ["Est. Annual Tax", fmt(snapshot.medianSalePrice! * AVG_TAX_RATE / 100)],
                ["Est. Monthly Tax", fmt(snapshot.medianSalePrice! * AVG_TAX_RATE / 100 / 12)],
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
  )
}
