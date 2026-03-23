// ABOUTME: Computes aggregated market statistics from mls_listings
// ABOUTME: Snapshot metrics (12) + monthly time series (5) for zip, city, county geo tiers
// NOTE: Prototype — queries live data. Production will use pre-computed cron table.

import 'server-only'
import { supabase } from './supabase'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MarketSnapshot {
  period: string                    // e.g. "Mar 2026"
  periodEnd: string                 // ISO date of the snapshot cutoff
  medianSalePrice: number | null
  medianPricePerSqft: number | null
  medianDom: number | null
  activeInventory: number
  newListings30d: number
  closedSales30d: number
  pendingSales30d: number
  monthsOfSupply: number | null
  saleToListRatio: number | null    // as percentage, e.g. 97.4
  pctOverList: number | null        // as percentage
  pctUnderList: number | null       // as percentage
  contractRate: number | null       // as percentage — pending / active per month
}

export interface MonthlyDataPoint {
  month: string                     // "2024-04"
  label: string                     // "Apr 2024"
  medianSalePrice: number | null
  salesVolume: number
  medianDom: number | null
  activeInventory: number
  medianPricePerSqft: number | null
}

export interface MarketStatsResult {
  snapshot: MarketSnapshot
  timeSeries: MonthlyDataPoint[]
}

export type GeoFilter =
  | { type: 'zip'; value: string }
  | { type: 'city'; value: string }
  | { type: 'county'; value: string }

// ─── Constants ──────────────────────────────────────────────────────────────────

const MLS_NAME = 'ntreis2'
const LEASE_TYPES = ['Residential Lease', 'Commercial Lease']
const ACTIVE_STATUSES = ['Active', 'Active Option Contract', 'Active KO', 'Active Contingent']
const PENDING_STATUSES = ['Pending']
const CLOSED_STATUS = 'Closed'

// ─── Helpers ────────────────────────────────────────────────────────────────────

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

function daysBetween(a: string, b: string): number | null {
  const start = new Date(b)
  const end = new Date(a)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return days >= 0 ? days : null
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(m, 10) - 1]} ${y}`
}

function formatPeriod(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

/** Return the column name for a geo filter */
function geoColumn(geo: GeoFilter): string {
  switch (geo.type) {
    case 'zip': return 'postal_code'
    case 'city': return 'city'
    case 'county': return 'county_or_parish'
  }
}

// ─── Core Query: Fetch raw listings for aggregation ─────────────────────────────

const STATS_FIELDS = `
  listing_id,
  list_price,
  original_list_price,
  living_area,
  mls_status,
  status_change_timestamp,
  listing_contract_date,
  purchase_contract_date
`

interface RawStatsRow {
  listing_id: string
  list_price: number | null
  original_list_price: number | null
  living_area: number | null
  mls_status: string | null
  status_change_timestamp: string | null
  listing_contract_date: string | null
  purchase_contract_date: string | null
}

/**
 * Fetch all listings in a geo area for the last 24 months + current active.
 * We pull everything once and compute metrics in-memory.
 * Prototype approach — production will pre-compute via cron.
 */
async function fetchListingsForStats(geo: GeoFilter): Promise<RawStatsRow[]> {
  const twentyFourMonthsAgo = new Date(
    Date.now() - 24 * 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  const col = geoColumn(geo)

  // Closed + Pending in last 24 months
  const closedQuery = supabase
    .from('mls_listings')
    .select(STATS_FIELDS)
    .eq('mls_name', MLS_NAME)
    .eq(col, geo.value)
    .in('mls_status', [CLOSED_STATUS, ...PENDING_STATUSES, ...ACTIVE_STATUSES])
    .not('property_type', 'in', `(${LEASE_TYPES.join(',')})`)
    .gte('status_change_timestamp', twentyFourMonthsAgo)
    .limit(50000)

  // Current active inventory (regardless of timestamp)
  const activeQuery = supabase
    .from('mls_listings')
    .select(STATS_FIELDS)
    .eq('mls_name', MLS_NAME)
    .eq(col, geo.value)
    .in('mls_status', ACTIVE_STATUSES)
    .not('property_type', 'in', `(${LEASE_TYPES.join(',')})`)
    .not('list_price', 'is', null)
    .limit(50000)

  const [closedResult, activeResult] = await Promise.all([closedQuery, activeQuery])

  if (closedResult.error) console.warn('market-stats closed query error:', closedResult.error)
  if (activeResult.error) console.warn('market-stats active query error:', activeResult.error)

  // Dedupe by listing_id (active listings may appear in both queries)
  const seen = new Set<string>()
  const all: RawStatsRow[] = []
  for (const row of [...(closedResult.data ?? []), ...(activeResult.data ?? [])]) {
    if (!seen.has(row.listing_id)) {
      seen.add(row.listing_id)
      all.push(row as RawStatsRow)
    }
  }
  return all
}

// ─── Snapshot Computation ───────────────────────────────────────────────────────

function computeSnapshot(rows: RawStatsRow[]): MarketSnapshot {
  const now = new Date()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)

  // Categorize
  const active = rows.filter(r => ACTIVE_STATUSES.includes(r.mls_status ?? ''))
  const closed = rows.filter(r => r.mls_status === CLOSED_STATUS)
  const pending = rows.filter(r => PENDING_STATUSES.includes(r.mls_status ?? ''))

  // Time-windowed subsets
  const closed30d = closed.filter(r =>
    r.status_change_timestamp && new Date(r.status_change_timestamp) >= thirtyDaysAgo
  )
  const closed6mo = closed.filter(r =>
    r.status_change_timestamp && new Date(r.status_change_timestamp) >= sixMonthsAgo
  )
  const pending30d = pending.filter(r =>
    r.status_change_timestamp && new Date(r.status_change_timestamp) >= thirtyDaysAgo
  )
  const newListings30d = rows.filter(r =>
    r.listing_contract_date && new Date(r.listing_contract_date) >= thirtyDaysAgo
  )

  // ── Median Sale Price (closed last 12 months for larger sample)
  const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  const closed12mo = closed.filter(r =>
    r.status_change_timestamp && new Date(r.status_change_timestamp) >= twelveMonthsAgo
  )
  const salePrices = closed12mo
    .map(r => r.list_price)
    .filter((p): p is number => p != null && p > 0)

  // ── Median $/sqft
  const ppsfs = closed12mo
    .filter(r => r.list_price && r.list_price > 0 && r.living_area && r.living_area > 0)
    .map(r => Math.round(r.list_price! / r.living_area!))

  // ── Median DOM
  const doms = closed12mo
    .map(r => {
      if (!r.listing_contract_date) return null
      const endDate = r.purchase_contract_date || r.status_change_timestamp
      if (!endDate) return null
      return daysBetween(endDate, r.listing_contract_date)
    })
    .filter((d): d is number => d != null && d >= 0)

  // ── Months of Supply
  const monthlyAbsorption = closed6mo.length / 6
  const monthsOfSupply = monthlyAbsorption > 0
    ? Math.round((active.length / monthlyAbsorption) * 10) / 10
    : null

  // ── Sale-to-List Ratio
  const ratios = closed12mo
    .filter(r => r.list_price && r.list_price > 0 && r.original_list_price && r.original_list_price > 0)
    .map(r => (r.list_price! / r.original_list_price!) * 100)
  const saleToListRatio = ratios.length > 0
    ? Math.round(ratios.reduce((s, v) => s + v, 0) / ratios.length * 10) / 10
    : null

  // ── % Over / Under List
  const withBothPrices = closed12mo.filter(
    r => r.list_price != null && r.original_list_price != null && r.original_list_price > 0
  )
  const overCount = withBothPrices.filter(r => r.list_price! > r.original_list_price!).length
  const underCount = withBothPrices.filter(r => r.list_price! < r.original_list_price!).length
  const pctOverList = withBothPrices.length > 0
    ? Math.round((overCount / withBothPrices.length) * 1000) / 10
    : null
  const pctUnderList = withBothPrices.length > 0
    ? Math.round((underCount / withBothPrices.length) * 1000) / 10
    : null

  // ── Contract Rate (listings going pending / active inventory, monthly)
  // Average monthly pendings over last 6 months / current active
  const pendingsLast6mo = rows.filter(r =>
    (r.mls_status === 'Pending' || r.mls_status === CLOSED_STATUS) &&
    r.purchase_contract_date &&
    new Date(r.purchase_contract_date) >= sixMonthsAgo
  )
  const monthlyPendings = pendingsLast6mo.length / 6
  const contractRate = active.length > 0
    ? Math.round((monthlyPendings / active.length) * 1000) / 10
    : null

  return {
    period: formatPeriod(now),
    periodEnd: now.toISOString().split('T')[0],
    medianSalePrice: median(salePrices),
    medianPricePerSqft: median(ppsfs),
    medianDom: median(doms),
    activeInventory: active.length,
    newListings30d: newListings30d.length,
    closedSales30d: closed30d.length,
    pendingSales30d: pending30d.length,
    monthsOfSupply,
    saleToListRatio,
    pctOverList,
    pctUnderList,
    contractRate,
  }
}

// ─── Time Series Computation ────────────────────────────────────────────────────

function computeTimeSeries(rows: RawStatsRow[]): MonthlyDataPoint[] {
  const now = new Date()
  const months: string[] = []

  // Generate last 24 month keys
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push(ym)
  }

  const closed = rows.filter(r => r.mls_status === CLOSED_STATUS)

  return months.map(ym => {
    const [year, month] = ym.split('-').map(Number)
    const monthStart = new Date(year, month - 1, 1)
    const monthEnd = new Date(year, month, 0, 23, 59, 59) // last day of month

    // Closed in this month (by status_change_timestamp)
    const closedInMonth = closed.filter(r => {
      if (!r.status_change_timestamp) return false
      const d = new Date(r.status_change_timestamp)
      return d >= monthStart && d <= monthEnd
    })

    // Active inventory snapshot: approximate as active + pending + closed-after-this-month
    // For historical months, count listings that were active at month-end
    // Simplified: listings listed before month-end that hadn't closed/expired yet
    const activeAtMonthEnd = rows.filter(r => {
      if (!r.listing_contract_date) return false
      const listed = new Date(r.listing_contract_date)
      if (listed > monthEnd) return false
      // If it closed/went pending before month end, it's not active
      if (r.mls_status === CLOSED_STATUS && r.status_change_timestamp) {
        const closed = new Date(r.status_change_timestamp)
        if (closed <= monthEnd) return false
      }
      // For current month, just use current active
      if (ym === months[months.length - 1]) {
        return ACTIVE_STATUSES.includes(r.mls_status ?? '')
      }
      return true
    })

    const salePrices = closedInMonth
      .map(r => r.list_price)
      .filter((p): p is number => p != null && p > 0)

    const ppsfs = closedInMonth
      .filter(r => r.list_price && r.list_price > 0 && r.living_area && r.living_area > 0)
      .map(r => Math.round(r.list_price! / r.living_area!))

    const doms = closedInMonth
      .map(r => {
        if (!r.listing_contract_date) return null
        const endDate = r.purchase_contract_date || r.status_change_timestamp
        if (!endDate) return null
        return daysBetween(endDate, r.listing_contract_date)
      })
      .filter((d): d is number => d != null && d >= 0)

    return {
      month: ym,
      label: monthLabel(ym),
      medianSalePrice: median(salePrices),
      salesVolume: closedInMonth.length,
      medianDom: median(doms),
      activeInventory: activeAtMonthEnd.length,
      medianPricePerSqft: median(ppsfs),
    }
  })
}

// ─── Public API ─────────────────────────────────────────────────────────────────

export async function getMarketStats(geo: GeoFilter): Promise<MarketStatsResult> {
  const rows = await fetchListingsForStats(geo)
  return {
    snapshot: computeSnapshot(rows),
    timeSeries: computeTimeSeries(rows),
  }
}
