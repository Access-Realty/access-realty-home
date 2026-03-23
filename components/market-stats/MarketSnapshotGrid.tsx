// ABOUTME: Display grid for the 12 snapshot market metrics
// ABOUTME: Server component — no client interactivity needed

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
  if (monthsOfSupply == null) return { label: 'Insufficient Data', color: 'text-muted-foreground', bg: 'bg-muted' }
  if (monthsOfSupply < 3) return { label: "Seller's Market", color: 'text-success', bg: 'bg-success/10' }
  if (monthsOfSupply < 5) return { label: 'Balanced Market', color: 'text-amber-600', bg: 'bg-amber-50' }
  return { label: "Buyer's Market", color: 'text-sky-600', bg: 'bg-sky-50' }
}

interface StatCardProps {
  label: string
  value: string
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  )
}

export default function MarketSnapshotGrid({ snapshot }: { snapshot: MarketSnapshot }) {
  const s = snapshot
  const temp = marketTemperature(s.monthsOfSupply)

  return (
    <div>
      {/* Market temperature badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${temp.color} ${temp.bg} mb-6`}>
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            temp.color === 'text-success' ? 'bg-success' :
            temp.color === 'text-amber-600' ? 'bg-amber-500' :
            temp.color === 'text-sky-600' ? 'bg-sky-500' : 'bg-gray-400'
          }`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            temp.color === 'text-success' ? 'bg-success' :
            temp.color === 'text-amber-600' ? 'bg-amber-500' :
            temp.color === 'text-sky-600' ? 'bg-sky-500' : 'bg-gray-400'
          }`} />
        </span>
        {temp.label}{s.monthsOfSupply != null && ` · ${s.monthsOfSupply} months of supply`}
      </div>

      {/* Headline metrics — 4 across */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard label="Median Sale Price" value={fmt(s.medianSalePrice)} sub="last 12 months" />
        <StatCard label="Median $/SqFt" value={s.medianPricePerSqft != null ? `$${s.medianPricePerSqft}` : '—'} sub="last 12 months" />
        <StatCard label="Median Days on Market" value={s.medianDom != null ? `${s.medianDom} days` : '—'} sub="list to contract" />
        <StatCard label="Sale-to-List Ratio" value={fmtPct(s.saleToListRatio)} sub="sold price vs. original ask" />
      </div>

      {/* Activity metrics — 4 across */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard label="Active Listings" value={fmtNum(s.activeInventory)} sub="currently on market" />
        <StatCard label="New Listings" value={fmtNum(s.newListings30d)} sub="last 30 days" />
        <StatCard label="Closed Sales" value={fmtNum(s.closedSales30d)} sub="last 30 days" />
        <StatCard label="Pending Sales" value={fmtNum(s.pendingSales30d)} sub="last 30 days" />
      </div>

      {/* Market dynamics — 4 across */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Months of Supply" value={s.monthsOfSupply != null ? `${s.monthsOfSupply}` : '—'} sub="lower = hotter market" />
        <StatCard label="Contract Rate" value={fmtPct(s.contractRate)} sub="monthly pending / active" />
        <StatCard label="Sold Over List" value={fmtPct(s.pctOverList)} sub="above original ask" />
        <StatCard label="Sold Under List" value={fmtPct(s.pctUnderList)} sub="below original ask" />
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Data through {s.period}. Source: NTREIS MLS. Excludes leases.
      </p>
    </div>
  )
}
