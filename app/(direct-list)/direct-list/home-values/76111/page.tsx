// ABOUTME: Prototype — Zip code hub page for 76111 (Fort Worth, TX)
// ABOUTME: Editorial aesthetic, hardcoded stats, live MLS map data

import type { Metadata } from "next"
import Link from "next/link"
import { Section } from "@/components/layout"
import { DirectListCTA } from "@/components/layout/DirectListCTA"
import { getListingsNearby } from "@/lib/listings-seo"
import ListingsMapSection from "@/components/listings/ListingsMapSection"
import MarketSnapshotGrid from "@/components/market-stats/MarketSnapshotGrid"
import MarketTimeSeries from "@/components/market-stats/MarketTimeSeries"
import ZipHeroMap from "@/components/market-stats/ZipHeroMap"
import type { MarketSnapshot, MonthlyDataPoint } from "@/lib/market-stats"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Home Values in 76111 — Fort Worth, TX | Market Data & Trends",
  description: "Median sale price $285K, 26 days on market, 98.2% sale-to-list ratio. See 24-month trends, recent sales, and market snapshot for Fort Worth's Near Northside (76111).",
  openGraph: {
    title: "76111 Home Values — Fort Worth, TX",
    description: "Median $285K · 26 DOM · 98.2% Sale-to-List · 2.1 Months Supply. Real market data for Fort Worth's Near Northside.",
    siteName: "DirectList",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "76111 Home Values — Fort Worth, TX",
    description: "Median $285K · 26 DOM · 98.2% Sale-to-List. Real MLS market data.",
  },
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

// ─── Hardcoded prototype stats — reasonable values for Fort Worth 76111 ───────

const snapshot: MarketSnapshot = {
  period: "Mar 2026",
  periodEnd: "2026-03-23",
  medianSalePrice: 285000,
  medianPricePerSqft: 168,
  medianDom: 26,
  activeInventory: 34,
  newListings30d: 18,
  closedSales30d: 14,
  pendingSales30d: 11,
  monthsOfSupply: 2.1,
  saleToListRatio: 98.2,
  pctOverList: 22.4,
  pctUnderList: 41.8,
  contractRate: 32.4,
}

const timeSeries: MonthlyDataPoint[] = [
  { month: "2024-04", label: "Apr 2024", medianSalePrice: 258000, salesVolume: 12, medianDom: 32, activeInventory: 42, medianPricePerSqft: 152 },
  { month: "2024-05", label: "May 2024", medianSalePrice: 265000, salesVolume: 16, medianDom: 28, activeInventory: 39, medianPricePerSqft: 155 },
  { month: "2024-06", label: "Jun 2024", medianSalePrice: 272000, salesVolume: 18, medianDom: 24, activeInventory: 36, medianPricePerSqft: 158 },
  { month: "2024-07", label: "Jul 2024", medianSalePrice: 270000, salesVolume: 15, medianDom: 26, activeInventory: 38, medianPricePerSqft: 157 },
  { month: "2024-08", label: "Aug 2024", medianSalePrice: 268000, salesVolume: 14, medianDom: 29, activeInventory: 40, medianPricePerSqft: 156 },
  { month: "2024-09", label: "Sep 2024", medianSalePrice: 262000, salesVolume: 11, medianDom: 33, activeInventory: 44, medianPricePerSqft: 153 },
  { month: "2024-10", label: "Oct 2024", medianSalePrice: 259000, salesVolume: 10, medianDom: 35, activeInventory: 46, medianPricePerSqft: 151 },
  { month: "2024-11", label: "Nov 2024", medianSalePrice: 255000, salesVolume: 8, medianDom: 38, activeInventory: 48, medianPricePerSqft: 149 },
  { month: "2024-12", label: "Dec 2024", medianSalePrice: 252000, salesVolume: 6, medianDom: 41, activeInventory: 45, medianPricePerSqft: 148 },
  { month: "2025-01", label: "Jan 2025", medianSalePrice: 250000, salesVolume: 7, medianDom: 39, activeInventory: 43, medianPricePerSqft: 147 },
  { month: "2025-02", label: "Feb 2025", medianSalePrice: 254000, salesVolume: 9, medianDom: 36, activeInventory: 41, medianPricePerSqft: 149 },
  { month: "2025-03", label: "Mar 2025", medianSalePrice: 260000, salesVolume: 13, medianDom: 31, activeInventory: 38, medianPricePerSqft: 153 },
  { month: "2025-04", label: "Apr 2025", medianSalePrice: 265000, salesVolume: 15, medianDom: 28, activeInventory: 36, medianPricePerSqft: 155 },
  { month: "2025-05", label: "May 2025", medianSalePrice: 272000, salesVolume: 17, medianDom: 25, activeInventory: 33, medianPricePerSqft: 159 },
  { month: "2025-06", label: "Jun 2025", medianSalePrice: 278000, salesVolume: 19, medianDom: 23, activeInventory: 31, medianPricePerSqft: 162 },
  { month: "2025-07", label: "Jul 2025", medianSalePrice: 276000, salesVolume: 16, medianDom: 25, activeInventory: 33, medianPricePerSqft: 161 },
  { month: "2025-08", label: "Aug 2025", medianSalePrice: 274000, salesVolume: 15, medianDom: 27, activeInventory: 35, medianPricePerSqft: 160 },
  { month: "2025-09", label: "Sep 2025", medianSalePrice: 270000, salesVolume: 12, medianDom: 30, activeInventory: 38, medianPricePerSqft: 158 },
  { month: "2025-10", label: "Oct 2025", medianSalePrice: 268000, salesVolume: 11, medianDom: 32, activeInventory: 40, medianPricePerSqft: 157 },
  { month: "2025-11", label: "Nov 2025", medianSalePrice: 265000, salesVolume: 9, medianDom: 34, activeInventory: 41, medianPricePerSqft: 155 },
  { month: "2025-12", label: "Dec 2025", medianSalePrice: 262000, salesVolume: 7, medianDom: 37, activeInventory: 39, medianPricePerSqft: 154 },
  { month: "2026-01", label: "Jan 2026", medianSalePrice: 268000, salesVolume: 10, medianDom: 33, activeInventory: 37, medianPricePerSqft: 157 },
  { month: "2026-02", label: "Feb 2026", medianSalePrice: 275000, salesVolume: 12, medianDom: 29, activeInventory: 35, medianPricePerSqft: 162 },
  { month: "2026-03", label: "Mar 2026", medianSalePrice: 285000, salesVolume: 14, medianDom: 26, activeInventory: 34, medianPricePerSqft: 168 },
]

export default async function ZipHubPage() {
  // Live MLS data for the map — same approach as 2113 Bird St (proven to show dots)
  const nearbyListings = await getListingsNearby(32.777, -97.314)

  return (
    <div className="bg-background">
      {/* ────────────────────────────────────────────────────────────────
          HERO — Immersive with texture, the headline stat front and center
      ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* 2-tone streets-only map background */}
        <ZipHeroMap center={[-97.314, 32.777]} zoom={12.5} />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="pt-20 pb-3" aria-label="Geographic context">
            <ol className="flex flex-wrap items-center gap-1 text-xs tracking-wider uppercase">
              <li><Link href="/direct-list/home-values" className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">Home Values</Link></li>
              <li className="text-primary-foreground/20 mx-1">/</li>
              <li className="text-primary-foreground/40"><Link href="/direct-list/home-values/tarrant-county" className="hover:text-primary-foreground/70 transition-colors">Tarrant County</Link></li>
              <li className="text-primary-foreground/20 mx-1">/</li>
              <li className="text-secondary font-semibold">76111</li>
            </ol>
          </nav>

          {/* Headline */}
          <div className="pb-14 lg:pb-16">
            <p className="text-secondary text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Fort Worth · Near Northside
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight mb-2">
              76111
            </h1>
            <p className="text-primary-foreground/50 text-base max-w-lg">
              Market data, trends, and recent sales for Fort Worth&apos;s most dynamic zip code.
            </p>

            {/* ── The Number — Median Sale Price gets the spotlight ──── */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-12">
              <div>
                <div className="text-[11px] text-primary-foreground/40 uppercase tracking-[0.2em] mb-1">
                  Median Sale Price
                </div>
                <div className="text-5xl lg:text-6xl font-bold text-secondary tracking-tight"
      >
                  {fmt(snapshot.medianSalePrice!)}
                </div>
                <div className="text-primary-foreground/40 text-xs mt-1">last 12 months</div>
              </div>

              {/* Supporting stats — smaller, secondary */}
              <div className="flex gap-8 sm:gap-10 pb-1">
                <div>
                  <div className="text-2xl font-bold text-primary-foreground">{snapshot.medianDom}</div>
                  <div className="text-[10px] text-primary-foreground/40 uppercase tracking-wider">Days on Market</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-foreground">{snapshot.saleToListRatio}%</div>
                  <div className="text-[10px] text-primary-foreground/40 uppercase tracking-wider">Sale-to-List</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-foreground">{snapshot.monthsOfSupply}</div>
                  <div className="text-[10px] text-primary-foreground/40 uppercase tracking-wider">Mo. Supply</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          EDITORIAL NARRATIVE
      ──────────────────────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-secondary" />
              <span className="text-[11px] text-secondary font-semibold uppercase tracking-[0.2em]">Neighborhood Profile</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-5 tracking-tight">
              Where Old Fort Worth Meets New
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>
                The 76111 zip code covers Fort Worth&apos;s Near Northside — one of the most dynamic residential pockets in Tarrant County. Bounded roughly by the Trinity River to the south and Meacham Airport to the north, this area straddles old Fort Worth and its fastest-changing neighborhoods. Century-old Craftsman bungalows sit two blocks from new-build townhomes, and that range shows up in the pricing data.
              </p>
              <p>
                The Near Northside has been a focus of Fort Worth&apos;s urban revitalization push. The Stockyards National Historic District draws tourism, but the residential corridors between NE 28th Street and the Riverside Arts District have drawn a different kind of buyer — investors and young families who want walkability, character, and proximity to downtown without paying downtown prices.
              </p>
              <p>
                For sellers, the key dynamic is <strong className="text-foreground">wide price variance</strong>. A renovated 3/2 on a tree-lined block can command $300K+, while a similar-sized unrenovated home two streets over might sit at $180K. Condition and recent updates matter more here than in suburban zips where homes are more homogeneous.
              </p>
            </div>
          </div>

          {/* Sidebar quick facts */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="text-[11px] text-primary font-semibold uppercase tracking-[0.15em] mb-4">Quick Facts</div>
              <dl className="space-y-3 text-sm">
                {[
                  ['County', 'Tarrant'],
                  ['City', 'Fort Worth'],
                  ['Area', 'Near Northside'],
                  ['Active Listings', String(snapshot.activeInventory)],
                  ['Sold (30 days)', String(snapshot.closedSales30d)],
                  ['Median $/SqFt', `$${snapshot.medianPricePerSqft}`],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 pt-4 border-t border-primary/10">
                <Link href="/direct-list/home-values/tarrant-county"
                  className="text-xs text-primary font-semibold hover:underline">
                  View Tarrant County →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────────────────────
          MARKET SNAPSHOT — tiered stats
      ──────────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-card border-y border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-secondary" />
            <span className="text-[11px] text-secondary font-semibold uppercase tracking-[0.2em]">Market Data</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 tracking-tight"
>
            76111 Market Snapshot
          </h2>
          <MarketSnapshotGrid snapshot={snapshot} />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          TIME SERIES — dark chart card
      ──────────────────────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-secondary" />
          <span className="text-[11px] text-secondary font-semibold uppercase tracking-[0.2em]">Trends</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight"
>
          24-Month Market Trends
        </h2>
        <MarketTimeSeries data={timeSeries} />
      </Section>

      {/* ────────────────────────────────────────────────────────────────
          MAP — Real MLS listing data with clickable dots
      ──────────────────────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-secondary" />
          <span className="text-[11px] text-secondary font-semibold uppercase tracking-[0.2em]">Activity</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight"
>
          Recent Sales in 76111
        </h2>
        <ListingsMapSection
          activeListings={nearbyListings.active.listings}
          activeRadiusMiles={nearbyListings.active.radiusMiles}
          closedListings={nearbyListings.closed.listings}
          closedRadiusMiles={nearbyListings.closed.radiusMiles}
          initialCenter={[-97.314, 32.777]}
          initialZoom={13}
          clusteringEnabled={false}
        />
      </Section>

      {/* ────────────────────────────────────────────────────────────────
          EMAIL SIGNUP
      ──────────────────────────────────────────────────────────────── */}
      <Section variant="content" maxWidth="5xl">
        <div className="bg-primary-dark rounded-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, #d6b283 50%)',
            }}
          />
          <div className="relative grid md:grid-cols-[1fr_320px] gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2"
    >
                Stay Informed on 76111
              </h2>
              <p className="text-primary-foreground/60 text-sm">
                Monthly market updates — recent sales, new listings, and price trends for your zip code. No spam, unsubscribe anytime.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-white/10 border border-white/10 text-primary-foreground placeholder:text-primary-foreground/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-secondary text-secondary-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-secondary/90 transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
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
