// ABOUTME: Prototype — County hub page for Tarrant County, TX
// ABOUTME: LIVE market stats from MLS data — served on direct-list.com

import Link from "next/link"
import { Section } from "@/components/layout"
import { DirectListCTA } from "@/components/layout/DirectListCTA"
import { getClosedListingsByCounty } from '@/lib/listings-seo'
import { getMarketStats } from '@/lib/market-stats'
import ListingsMapSection from '@/components/listings/ListingsMapSection'
import MarketSnapshotGrid from '@/components/market-stats/MarketSnapshotGrid'
import MarketTimeSeries from '@/components/market-stats/MarketTimeSeries'

export const dynamic = 'force-dynamic'

// City data — population is not in MLS, so this stays hardcoded
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

// Tax rate is external data — not in MLS
const AVG_TAX_RATE = 2.15

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

export default async function CountyHubPage() {
  const [listings, { snapshot, timeSeries }] = await Promise.all([
    getClosedListingsByCounty('Tarrant'),
    getMarketStats({ type: 'county', value: 'Tarrant' }),
  ])

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

      {/* Hero — now uses live snapshot */}
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
              <div className="text-primary-foreground text-xl font-bold">
                {snapshot.medianSalePrice != null ? fmt(snapshot.medianSalePrice) : '—'}
              </div>
              <div className="text-primary-foreground/60 text-xs">last 12 months</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.medianDom ?? '—'}</div>
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
              Property taxes remain a dominant factor in homeownership costs. Tarrant County&apos;s effective rate averages {AVG_TAX_RATE}%, which on a {snapshot.medianSalePrice != null ? fmt(snapshot.medianSalePrice) : '—'} home translates to roughly {snapshot.medianSalePrice != null ? fmt(snapshot.medianSalePrice * AVG_TAX_RATE / 100) : '—'} annually. The Tarrant Appraisal District processes over 200,000 protests each year — the highest volume in Texas. For homeowners weighing whether to sell, the combination of rising assessed values and flat or declining real appreciation in some zips creates a natural decision point.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Market Snapshot — all 12 metrics ─────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County Market Snapshot</h2>
        <MarketSnapshotGrid snapshot={snapshot} />
      </Section>

      {/* ── Time Series Charts ───────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Tarrant County Market Trends — 24 Months</h2>
        <MarketTimeSeries data={timeSeries} />
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
              {snapshot.medianSalePrice != null ? [
                ["Median Home Value", fmt(snapshot.medianSalePrice)],
                ["Effective Tax Rate", `${AVG_TAX_RATE}%`],
                ["Est. Annual Tax", fmt(snapshot.medianSalePrice * AVG_TAX_RATE / 100)],
                ["Est. Monthly Tax", fmt(snapshot.medianSalePrice * AVG_TAX_RATE / 100 / 12)],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Insufficient data</p>
              )}
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
