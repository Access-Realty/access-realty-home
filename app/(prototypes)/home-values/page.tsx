// ABOUTME: Prototype — DFW overview hub page (top of URL hierarchy)
// ABOUTME: Entry point for all home value pages, county breakdown, market overview

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";
import { getClosedListingsByBoundingBox } from "@/lib/listings-seo";
import ListingsMapSection from "@/components/listings/ListingsMapSection";

export const dynamic = 'force-dynamic'

const DFW_STATS = {
  period: "Feb 2026",
  median_sale_price: 395000,
  median_price_yoy: 2.3,
  avg_dom: 34,
  total_properties: 2200000,
  active_listings: 18500,
  closed_30: 7200,
};

const COUNTIES = [
  {
    name: "Tarrant County",
    slug: "tarrant-county",
    median: 372000,
    yoy: 2.5,
    dom: 32,
    active: 4200,
    population: 2110640,
    cities: ["Fort Worth", "Arlington", "Mansfield", "Southlake", "Keller", "Grapevine"],
  },
  {
    name: "Dallas County",
    slug: "dallas-county",
    median: 365000,
    yoy: 1.8,
    dom: 35,
    active: 5100,
    population: 2613539,
    cities: ["Dallas", "Irving", "Garland", "Mesquite", "Grand Prairie", "Richardson"],
  },
  {
    name: "Denton County",
    slug: "denton-county",
    median: 460000,
    yoy: 3.4,
    dom: 30,
    active: 3200,
    population: 1007745,
    cities: ["Denton", "Frisco", "McKinney", "Flower Mound", "Lewisville", "The Colony"],
  },
  {
    name: "Collin County",
    slug: "collin-county",
    median: 485000,
    yoy: 2.9,
    dom: 31,
    active: 3800,
    population: 1150228,
    cities: ["Plano", "McKinney", "Frisco", "Allen", "Prosper", "Celina"],
  },
  {
    name: "Ellis County",
    slug: "ellis-county",
    median: 335000,
    yoy: 3.1,
    dom: 36,
    active: 1100,
    population: 207030,
    cities: ["Waxahachie", "Midlothian", "Red Oak", "Ennis", "Cedar Hill"],
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function DFWOverviewPage() {
  const listings = await getClosedListingsByBoundingBox({
    minLat: 32.2,
    maxLat: 33.5,
    minLng: -97.8,
    maxLng: -96.3,
  });

  return (
    <div className="bg-background">
      {/* Hero — no breadcrumbs at top level */}
      <section className="bg-primary pt-20 pb-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
            Dallas–Fort Worth Home Values
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            What&apos;s Your Home Worth?
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
            Free property data, recent comps, and market trends for {(DFW_STATS.total_properties / 1000000).toFixed(1)}M+ homes across five DFW counties. No login required.
          </p>

          {/* Search bar */}
          <div className="max-w-xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your address — e.g., 4605 Brentgate Ct, Arlington TX"
                className="flex-1 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors whitespace-nowrap">
                Look Up
              </button>
            </div>
            <p className="text-primary-foreground/50 text-xs mt-2">
              Or browse by county, city, or zip below
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">DFW Median</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(DFW_STATS.median_sale_price)}</div>
              <div className="text-primary-foreground/60 text-xs">+{DFW_STATS.median_price_yoy}% YoY</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{DFW_STATS.avg_dom}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Active Listings</div>
              <div className="text-primary-foreground text-xl font-bold">{(DFW_STATS.active_listings / 1000).toFixed(1)}K</div>
              <div className="text-primary-foreground/60 text-xs">{(DFW_STATS.closed_30 / 1000).toFixed(1)}K sold last 30 days</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Properties Covered</div>
              <div className="text-primary-foreground text-xl font-bold">{(DFW_STATS.total_properties / 1000000).toFixed(1)}M+</div>
              <div className="text-primary-foreground/60 text-xs">across 5 counties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial overview */}
      <Section variant="content" maxWidth="5xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">The DFW Housing Market</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The Dallas–Fort Worth metroplex is the fourth-largest metro area in the United States and one of the fastest-growing. Over the past decade, DFW has added roughly 1 million residents — a pace that has kept housing demand elevated even as mortgage rates climbed. The result is a market where inventory remains tight across most price points, though pockets of the north-side suburbs have started to soften.
            </p>
            <p>
              As of {DFW_STATS.period}, the median home sale price across the five-county DFW area sits at {fmt(DFW_STATS.median_sale_price)}, up {DFW_STATS.median_price_yoy}% year-over-year. That growth has slowed from the double-digit pace of 2021–2022, but it remains positive — a sign that the market has normalized rather than corrected. Days on market average {DFW_STATS.avg_dom}, reflecting steady demand without the bidding-war frenzy of previous years.
            </p>
            <p>
              For homeowners considering a sale, the key question isn&apos;t whether the market is favorable — it is. The question is how much of your equity you keep when you close. On a {fmt(DFW_STATS.median_sale_price)} home, the difference between a traditional 3% listing commission and a flat-fee service is over {fmt(DFW_STATS.median_sale_price * 0.03 - 2995)}.
            </p>
          </div>
        </div>
      </Section>

      {/* County cards */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Browse by County</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COUNTIES.map((county) => (
            <Link
              key={county.slug}
              href={`/home-values/${county.slug}`}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                {county.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {county.population.toLocaleString()} residents · {county.active.toLocaleString()} active listings
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Median</div>
                  <div className="text-sm font-bold text-foreground">{fmt(county.median)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">YoY</div>
                  <div className={`text-sm font-bold ${county.yoy >= 3 ? "text-success" : "text-foreground"}`}>
                    +{county.yoy}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg DOM</div>
                  <div className="text-sm font-bold text-foreground">{county.dom}</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {county.cities.slice(0, 4).join(" · ")} + more
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Interactive map */}
      <Section variant="content" maxWidth="5xl">
        <ListingsMapSection
          activeListings={[]}
          closedListings={listings}
          initialCenter={[-96.8, 32.8]}
          initialZoom={9}
          clusteringEnabled={true}
          title="DFW Market Activity"
        />
      </Section>

      {/* Email signup */}
      <Section variant="content" maxWidth="5xl">
        <div className="bg-card rounded-xl border border-border p-8 md:p-10">
          <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">DFW Market Updates</h2>
              <p className="text-muted-foreground">
                Get monthly market data for your zip code — recent sales, new listings, and price trends. Free, no obligation, unsubscribe anytime.
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Your zip code"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                Get Monthly Updates
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Educational pillar link */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/home-values/how-comps-work"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="text-xs text-secondary font-semibold uppercase tracking-widest mb-2">Learn</div>
            <h3 className="text-lg font-bold text-foreground mb-2">How Comps Work</h3>
            <p className="text-sm text-muted-foreground">
              What makes a good comparable sale? How appraisers and agents use comps to price homes — and where automated estimates fall short.
            </p>
          </Link>
          <Link
            href="/direct-list/savings"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="text-xs text-secondary font-semibold uppercase tracking-widest mb-2">Calculate</div>
            <h3 className="text-lg font-bold text-foreground mb-2">Net Proceeds Calculator</h3>
            <p className="text-sm text-muted-foreground">
              See exactly how much you keep when you sell — and how much you save with a flat-fee listing vs. a traditional 3% commission.
            </p>
          </Link>
        </div>
      </Section>

      <DirectListCTA
        heading="Your Home. Your Equity. Your Terms."
        subheading="Full MLS listing for a flat fee. Professional support included."
        buttonText="Get Started Now"
        buttonHref="/direct-list/get-started"
      />
    </div>
  );
}
