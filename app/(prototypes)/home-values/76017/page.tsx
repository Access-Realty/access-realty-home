// ABOUTME: Prototype — Zip code hub page for 76017 (Arlington, TX)
// ABOUTME: Unique editorial content, market stats, recently sold, links to property pages

import Link from "next/link";
import { Section } from "@/components/layout";
import { DirectListCTA } from "@/components/layout/DirectListCTA";

// ─── Market stats ─────────────────────────────────────────────────────────────
const STATS = {
  period: "Feb 2026",
  median_sale_price: 385000,
  median_price_yoy: 3.2,
  avg_dom: 31,
  months_of_supply: 2.8,
  sp_lp_ratio: 97.4,
  active: 142,
  closed_30: 48,
  closed_90: 156,
};

// ─── Recently sold in this zip ────────────────────────────────────────────────
const RECENT_SALES = [
  { address: "4605 Brentgate Ct", slug: "4605-brentgate-ct", price: 415000, sqft: 2555, beds: 3, baths: 2, dom: 18, date: "2026-02-14" },
  { address: "3921 Wimbledon Dr", slug: "3921-wimbledon-dr", price: 372000, sqft: 2100, beds: 3, baths: 2, dom: 25, date: "2026-02-02" },
  { address: "4412 Sycamore Ln", slug: "4412-sycamore-ln", price: 445000, sqft: 2830, beds: 4, baths: 2.5, dom: 12, date: "2026-01-28" },
  { address: "1809 Pecan Valley Dr", slug: "1809-pecan-valley-dr", price: 338000, sqft: 1680, beds: 3, baths: 2, dom: 41, date: "2026-01-15" },
  { address: "5110 Oakmont Trl", slug: "5110-oakmont-trl", price: 510000, sqft: 3200, beds: 4, baths: 3, dom: 8, date: "2026-01-10" },
  { address: "2234 Green Oaks Blvd", slug: "2234-green-oaks-blvd", price: 295000, sqft: 1420, beds: 2, baths: 1, dom: 55, date: "2025-12-20" },
];

// ─── Recently built property pages ────────────────────────────────────────────
const PROPERTY_PAGES = [
  { address: "4605 Brentgate Ct", slug: "4605-brentgate-ct", beds: 3, baths: 2, sqft: 2555, year: 1978 },
  { address: "3921 Wimbledon Dr", slug: "3921-wimbledon-dr", beds: 3, baths: 2, sqft: 2100, year: 1982 },
  { address: "4412 Sycamore Ln", slug: "4412-sycamore-ln", beds: 4, baths: 2.5, sqft: 2830, year: 1990 },
  { address: "1809 Pecan Valley Dr", slug: "1809-pecan-valley-dr", beds: 3, baths: 2, sqft: 1680, year: 1975 },
  { address: "5110 Oakmont Trl", slug: "5110-oakmont-trl", beds: 4, baths: 3, sqft: 3200, year: 2004 },
  { address: "2234 Green Oaks Blvd", slug: "2234-green-oaks-blvd", beds: 2, baths: 1, sqft: 1420, year: 1965 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function ZipHubPage() {
  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="bg-primary">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <nav aria-label="Geographic context" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/60">
              <li><Link href="/prototypes/home-values" className="hover:text-primary-foreground/90 transition-colors">Home Values</Link></li>
              <li className="before:content-['·'] before:mx-1.5 text-primary-foreground/90">76017</li>
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

      {/* Hero */}
      <section className="bg-primary pb-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Home Values in 76017
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-6">
            South Arlington, TX · Tarrant County
          </p>

          {/* Key stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Median Price</div>
              <div className="text-primary-foreground text-xl font-bold">{fmt(STATS.median_sale_price)}</div>
              <div className="text-primary-foreground/60 text-xs">+{STATS.median_price_yoy}% YoY</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Avg DOM</div>
              <div className="text-primary-foreground text-xl font-bold">{STATS.avg_dom}</div>
              <div className="text-primary-foreground/60 text-xs">days on market</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Sale/List</div>
              <div className="text-primary-foreground text-xl font-bold">{STATS.sp_lp_ratio}%</div>
              <div className="text-primary-foreground/60 text-xs">of asking price</div>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-primary-foreground/60 text-xs uppercase tracking-wider">Supply</div>
              <div className="text-primary-foreground text-xl font-bold">{STATS.months_of_supply} mo</div>
              <div className="text-primary-foreground/60 text-xs">seller&apos;s market</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial content — unique, NOT spun */}
      <Section variant="content" maxWidth="5xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">76017 at a Glance</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The 76017 zip code covers south Arlington — a stretch of established neighborhoods between I-20 and Green Oaks Boulevard. It&apos;s one of Tarrant County&apos;s most active residential markets, driven by a combination of affordable price points, proximity to the entertainment district, and strong school zoning in the Mansfield and Arlington ISDs.
            </p>
            <p>
              The typical home here was built in the late 1970s to early 1990s, sits on a quarter-acre lot, and offers 2,000–2,800 square feet of living space. Brick construction dominates. Buyers in this zip tend to be families upgrading from starter homes and investors looking for rental yield — cap rates here run 1–2 points higher than north Arlington.
            </p>
            <p>
              Recent activity shows the market tightening: days on market dropped from 38 to {STATS.avg_dom} over the past year, while inventory fell below 3 months of supply. Homes priced correctly and in good condition are moving fast — especially those under $400,000.
            </p>
          </div>
        </div>
      </Section>

      {/* Interactive map placeholder */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">Recent Sales Map</h2>
        <div className="bg-muted rounded-xl border border-border h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm font-medium">Interactive Deck.gl Map</p>
            <p className="text-xs">Recently sold homes in 76017 — color-coded by price range</p>
            <p className="text-xs mt-1">Hub pages get the full interactive version</p>
          </div>
        </div>
      </Section>

      {/* Recently sold table */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recently Sold in 76017</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 pr-4 font-semibold text-foreground">Address</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Sale Price</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Sq Ft</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden md:table-cell">$/Sq Ft</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Beds/Baths</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground hidden lg:table-cell">DOM</th>
                <th className="text-right py-3 pl-4 font-semibold text-foreground hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((sale) => (
                <tr key={sale.slug} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/prototypes/home-values/76017/${sale.slug}`} className="font-medium text-primary hover:underline">
                      {sale.address}
                    </Link>
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-foreground">{fmt(sale.price)}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground hidden sm:table-cell">{sale.sqft.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground hidden md:table-cell">${Math.round(sale.price / sale.sqft)}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground">{sale.beds}/{sale.baths}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground hidden lg:table-cell">{sale.dom}</td>
                  <td className="text-right py-3 pl-4 text-muted-foreground hidden lg:table-cell">
                    {new Date(sale.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Browse property pages */}
      <Section variant="content" maxWidth="5xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Browse Homes in 76017</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROPERTY_PAGES.map((prop) => (
            <Link
              key={prop.slug}
              href={`/prototypes/home-values/76017/${prop.slug}`}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="font-medium text-foreground mb-1">{prop.address}</div>
              <div className="text-sm text-muted-foreground">
                {prop.beds} bed · {prop.baths} bath · {prop.sqft.toLocaleString()} sqft · Built {prop.year}
              </div>
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Showing 6 of 142 properties with pages in 76017. More added weekly.
        </p>
      </Section>

      {/* Email signup */}
      <Section variant="content" maxWidth="5xl">
        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">76017 Market Updates</h2>
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
        subheading="Full MLS listing for a flat fee. Professional support included."
        buttonText="See Your Savings"
        buttonHref="/direct-list/savings"
      />
    </div>
  );
}
