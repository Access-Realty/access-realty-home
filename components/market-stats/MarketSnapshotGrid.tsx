// ABOUTME: Editorial-style market snapshot display with tiered visual hierarchy
// ABOUTME: Hero stats get prominence, supporting metrics in a compact grid

import type { MarketSnapshot } from '@/lib/market-stats'

function fmt(n: number | null): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtPct(n: number | null): string {
  if (n == null) return '—'
  return `${n}%`
}

function fmtNum(n: number | null): string {
  if (n == null) return '—'
  return n.toLocaleString('en-US')
}

function marketTemperature(monthsOfSupply: number | null) {
  if (monthsOfSupply == null) return { label: 'Insufficient Data', emoji: '·', color: 'text-muted-foreground', accent: 'border-border' }
  if (monthsOfSupply < 3) return { label: "Seller's Market", emoji: '↑', color: 'text-success', accent: 'border-success' }
  if (monthsOfSupply < 5) return { label: 'Balanced Market', emoji: '→', color: 'text-amber-600', accent: 'border-amber-500' }
  return { label: "Buyer's Market", emoji: '↓', color: 'text-sky-600', accent: 'border-sky-500' }
}

export default function MarketSnapshotGrid({ snapshot }: { snapshot: MarketSnapshot }) {
  const s = snapshot
  const temp = marketTemperature(s.monthsOfSupply)

  return (
    <div>
      {/* ── Market Temperature ────────────────────────────────────────── */}
      <div className={`border-l-4 ${temp.accent} pl-4 mb-8`}>
        <div className={`text-sm font-semibold ${temp.color} uppercase tracking-widest`}>
          {temp.emoji} {temp.label}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {s.monthsOfSupply != null ? `${s.monthsOfSupply} months of supply` : 'Not enough data to determine'} · Data through {s.period}
        </div>
      </div>

      {/* ── Hero Stats — the numbers people came for ──────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden mb-6">
        {[
          {
            label: 'Median Sale Price',
            value: fmt(s.medianSalePrice),
            sub: 'last 12 months',
            highlight: true,
          },
          {
            label: 'Price per Sq Ft',
            value: s.medianPricePerSqft != null ? `$${s.medianPricePerSqft}` : '—',
            sub: 'median $/sqft',
            highlight: false,
          },
          {
            label: 'Days on Market',
            value: s.medianDom != null ? `${s.medianDom}` : '—',
            sub: 'list to contract',
            highlight: false,
          },
          {
            label: 'Sale-to-List',
            value: fmtPct(s.saleToListRatio),
            sub: 'of original asking',
            highlight: false,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card p-5 lg:p-6">
            <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium mb-2">
              {stat.label}
            </div>
            <div className={`text-2xl lg:text-3xl font-bold tracking-tight ${
              stat.highlight ? 'text-primary' : 'text-foreground'
            }`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Activity & Dynamics — compact two-row grid ────────────────── */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-px bg-border/50 rounded-xl overflow-hidden">
        {[
          { label: 'Active', value: fmtNum(s.activeInventory), sub: 'listings' },
          { label: 'New', value: fmtNum(s.newListings30d), sub: '30 days' },
          { label: 'Closed', value: fmtNum(s.closedSales30d), sub: '30 days' },
          { label: 'Pending', value: fmtNum(s.pendingSales30d), sub: '30 days' },
          { label: 'Supply', value: s.monthsOfSupply != null ? `${s.monthsOfSupply}` : '—', sub: 'months' },
          { label: 'Contract Rate', value: fmtPct(s.contractRate), sub: 'monthly' },
          { label: 'Over List', value: fmtPct(s.pctOverList), sub: 'sold above' },
          { label: 'Under List', value: fmtPct(s.pctUnderList), sub: 'sold below' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card/80 px-3 py-3.5 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
            <div className="text-lg font-bold text-foreground mt-0.5">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground mt-4 tracking-wide">
        Source: NTREIS MLS · Excludes leases · {s.period}
      </p>
    </div>
  )
}
