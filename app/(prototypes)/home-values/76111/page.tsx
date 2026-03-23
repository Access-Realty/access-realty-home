// ABOUTME: Prototype — Zip code hub page for 76111 (Fort Worth, TX)
// ABOUTME: LIVE market stats from MLS data — no hardcoded numbers

import Link from "next/link"
import { Section } from "@/components/layout"
import { DirectListCTA } from "@/components/layout/DirectListCTA"
import { getClosedListingsByZip } from "@/lib/listings-seo"
import { getMarketStats } from "@/lib/market-stats"
import ListingsMapSection from "@/components/listings/ListingsMapSection"
import MarketSnapshotGrid from "@/components/market-stats/MarketSnapshotGrid"
import MarketTimeSeries from "@/components/market-stats/MarketTimeSeries"

export const dynamic = 'force-dynamic'

// ─── Property pages built for this zip ──────────────────────────────────────────
const PROPERTY_PAGES = [
  { address: "2113 Bird St", slug: "2113-bird-st", beds: 3, baths: 3, sqft: 2137, year: 2020 },
]

export default async function ZipHubPage() {
  const [listings, { snapshot, timeSeries }] = await Promise.all([
    getClosedListingsByZip("76111"),
    getMarketStats({ type: 'zip', value: '76111' }),
  ])

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Geographic context" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
              <li className="before:content-['·'] before:mx-1.5 text-primary-foreground/90">76111</li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/home-values/fort-worth" className="hover:text-primary-foreground/90 transition-colors">Fort Worth</Link>
              </li>
              <li className="before:content-['·'] before:mx-1.5">
                <Link href="/home-values/tarrant-county" className="hover:text-primary-foreground/90 transition-colors">Tarrant County</Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Home Values in 76111
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-6">
            Near Northside Fort Worth, TX · Tarrant County
          </p>

          {/* Key stats row — pulled from live snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Price</div>
              <div className="text-primary-foreground text-xl font-bold">
                {snapshot.medianSalePrice != null
                  ? `$${(snapshot.medianSalePrice / 1000).toFixed(0)}K`
                  : '—'}
              </div>
              <div className="text-primary-foreground/60 text-xs">last 12 months</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.medianDom ?? '—'}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Sale/List</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.saleToListRatio != null ? `${snapshot.saleToListRatio}%` : '—'}</div>
              <div className="text-primary-foreground/60 text-xs">of original asking</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Supply</div>
              <div className="text-primary-foreground text-xl font-bold">{snapshot.monthsOfSupply != null ? `${snapshot.monthsOfSupply} mo` : '—'}</div>
              <div className="text-primary-foreground/60 text-xs">{snapshot.activeInventory} active listings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial content — unique, NOT spun */}
      <Section variant="content" maxWidth="5xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">76111 at a Glance</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The 76111 zip code covers Fort Worth&apos;s Near Northside — one of the most dynamic residential pockets in Tarrant County. Bounded roughly by the Trinity River to the south and Meacham Airport to the north, this area straddles old Fort Worth and its fastest-changing neighborhoods. You&apos;ll find century-old Craftsman bungalows two blocks from new-build townhomes, and that range shows up in the pricing data.
            </p>
            <p>
              The Near Northside has been a focus of Fort Worth&apos;s urban revitalization push. The Stockyards National Historic District draws tourism, but the residential corridors between NE 28th Street and the Riverside Arts District have drawn a different kind of buyer — investors and young families who want walkability, character, and proximity to downtown without paying downtown prices.
            </p>
            <p>
              For sellers in 76111, the key dynamic is wide price variance. A renovated 3/2 on a tree-lined block can command $300K+, while a similar-sized unrenovated home two streets over might sit at $180K. Condition and recent updates matter more here than in suburban zips where homes are more homogeneous.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Market Snapshot — all 12 metrics ─────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">76111 Market Snapshot</h2>
        <MarketSnapshotGrid snapshot={snapshot} />
      </Section>

      {/* ── Time Series Charts ───────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">76111 Market Trends — 24 Months</h2>
        <MarketTimeSeries data={timeSeries} />
      </Section>

      {/* Map + recent sales */}
      <Section variant="content" maxWidth="5xl">
        <ListingsMapSection
          activeListings={[]}
          closedListings={listings}
          initialCenter={[-97.314, 32.777]}
          initialZoom={13}
          clusteringEnabled={false}
          title="Recent Sales in 76111"
        />
      </Section>

      {/* Browse property pages */}
      {PROPERTY_PAGES.length > 0 && (
        <Section variant="content" maxWidth="5xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse Homes in 76111</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROPERTY_PAGES.map((prop) => (
              <Link
                key={prop.slug}
                href={`/home-values/76111/${prop.slug}`}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="font-medium text-foreground mb-1">{prop.address}</div>
                <div className="text-sm text-muted-foreground">
                  {prop.beds} bed · {prop.baths} bath · {prop.sqft.toLocaleString()} sqft · Built {prop.year}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Email signup */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">76111 Market Updates</h2>
            <p className="text-muted-foreground">
              Recently sold homes, new listings, and price trends for your zip code — delivered to your inbox.
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              Get Monthly Updates
            </button>
          </div>
        </div>
      </Section>

      <DirectListCTA
        heading="Know Your Home's Worth — Then Keep More of It"
        subheading="When you're ready to sell, our experts help you price it right. Full MLS listing for a flat fee."
        buttonText="See Your Savings"
        buttonHref="/direct-list/savings"
      />
    </div>
  )
}
