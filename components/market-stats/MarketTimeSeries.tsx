// ABOUTME: Client-side time series charts for geo market pages
// ABOUTME: Pure SVG — no charting library dependency. Line + bar charts with tooltips.

'use client'

import { useState } from 'react'
import type { MonthlyDataPoint } from '@/lib/market-stats'

// ─── Types ──────────────────────────────────────────────────────────────────────

type SeriesKey = 'medianSalePrice' | 'salesVolume' | 'medianDom' | 'activeInventory' | 'medianPricePerSqft'

interface SeriesConfig {
  key: SeriesKey
  label: string
  format: (v: number) => string
  chartType: 'line' | 'bar'
  color: string
}

const SERIES: SeriesConfig[] = [
  {
    key: 'medianSalePrice',
    label: 'Median Sale Price',
    format: (v) => `$${(v / 1000).toFixed(0)}K`,
    chartType: 'line',
    color: '#284b70',
  },
  {
    key: 'salesVolume',
    label: 'Sales Volume',
    format: (v) => String(v),
    chartType: 'bar',
    color: '#284b70',
  },
  {
    key: 'medianDom',
    label: 'Median Days on Market',
    format: (v) => `${v}d`,
    chartType: 'line',
    color: '#d6b283',
  },
  {
    key: 'activeInventory',
    label: 'Active Inventory',
    format: (v) => String(v),
    chartType: 'line',
    color: '#284b70',
  },
  {
    key: 'medianPricePerSqft',
    label: 'Median $/SqFt',
    format: (v) => `$${v}`,
    chartType: 'line',
    color: '#284b70',
  },
]

// ─── SVG Chart ──────────────────────────────────────────────────────────────────

const CHART_W = 700
const CHART_H = 240
const PAD = { top: 20, right: 16, bottom: 40, left: 56 }
const INNER_W = CHART_W - PAD.left - PAD.right
const INNER_H = CHART_H - PAD.top - PAD.bottom

function MiniChart({
  data,
  series,
}: {
  data: MonthlyDataPoint[]
  series: SeriesConfig
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const values = data.map(d => d[series.key] as number | null)
  const validValues = values.filter((v): v is number => v != null && v > 0)

  if (validValues.length === 0) {
    return (
      <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
        No data available
      </div>
    )
  }

  const minVal = Math.min(...validValues) * 0.9
  const maxVal = Math.max(...validValues) * 1.1
  const range = maxVal - minVal || 1

  const xStep = INNER_W / (data.length - 1 || 1)

  // Y-axis ticks (4 ticks)
  const yTicks = Array.from({ length: 4 }, (_, i) => {
    const v = minVal + (range * i) / 3
    return Math.round(v)
  })

  // X-axis labels (show every 3rd month)
  const xLabels = data
    .map((d, i) => ({ label: d.label, i }))
    .filter((_, i) => i % 3 === 0)

  if (series.chartType === 'line') {
    // Build SVG path
    const points: [number, number][] = []
    data.forEach((d, i) => {
      const v = d[series.key] as number | null
      if (v != null && v > 0) {
        const x = PAD.left + i * xStep
        const y = PAD.top + INNER_H - ((v - minVal) / range) * INNER_H
        points.push([x, y])
      }
    })

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')

    // Area fill
    const areaD = points.length > 0
      ? `${pathD} L ${points[points.length - 1][0]} ${PAD.top + INNER_H} L ${points[0][0]} ${PAD.top + INNER_H} Z`
      : ''

    return (
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Grid lines */}
        {yTicks.map(v => {
          const y = PAD.top + INNER_H - ((v - minVal) / range) * INNER_H
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y} stroke="#e5e5e5" strokeWidth={0.5} />
              <text x={PAD.left - 8} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>
                {series.format(v)}
              </text>
            </g>
          )
        })}

        {/* X labels */}
        {xLabels.map(({ label, i }) => (
          <text
            key={i}
            x={PAD.left + i * xStep}
            y={CHART_H - 8}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
          >
            {label}
          </text>
        ))}

        {/* Area */}
        {areaD && <path d={areaD} fill={series.color} opacity={0.08} />}

        {/* Line */}
        <path d={pathD} fill="none" stroke={series.color} strokeWidth={2} strokeLinejoin="round" />

        {/* Hover zones */}
        {data.map((d, i) => {
          const v = d[series.key] as number | null
          if (v == null) return null
          const x = PAD.left + i * xStep
          const y = PAD.top + INNER_H - ((v - minVal) / range) * INNER_H
          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
              <rect x={x - xStep / 2} y={PAD.top} width={xStep} height={INNER_H} fill="transparent" />
              {hoveredIdx === i && (
                <>
                  <circle cx={x} cy={y} r={4} fill={series.color} />
                  <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H} stroke={series.color} strokeWidth={0.5} strokeDasharray="3,3" />
                  <rect x={x - 40} y={y - 28} width={80} height={22} rx={4} fill="#1a1a1a" />
                  <text x={x} y={y - 14} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>
                    {series.format(v)}
                  </text>
                  <text x={x} y={CHART_H - 22} textAnchor="middle" fill={series.color} fontSize={10} fontWeight={600}>
                    {d.label}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  // Bar chart
  const barWidth = Math.max(4, (INNER_W / data.length) * 0.6)
  const barGap = (INNER_W / data.length) * 0.4

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="w-full h-auto"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Grid lines */}
      {yTicks.map(v => {
        const y = PAD.top + INNER_H - ((v - minVal) / range) * INNER_H
        return (
          <g key={v}>
            <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y} stroke="#e5e5e5" strokeWidth={0.5} />
            <text x={PAD.left - 8} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize={10}>
              {series.format(v)}
            </text>
          </g>
        )
      })}

      {/* X labels */}
      {xLabels.map(({ label, i }) => (
        <text
          key={i}
          x={PAD.left + i * xStep}
          y={CHART_H - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={10}
        >
          {label}
        </text>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const v = d[series.key] as number | null
        if (v == null || v <= 0) return null
        const x = PAD.left + i * xStep - barWidth / 2
        const barH = ((v - minVal) / range) * INNER_H
        const y = PAD.top + INNER_H - barH
        return (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              fill={series.color}
              opacity={hoveredIdx === i ? 1 : 0.7}
              rx={2}
            />
            {hoveredIdx === i && (
              <>
                <rect x={PAD.left + i * xStep - 30} y={y - 26} width={60} height={22} rx={4} fill="#1a1a1a" />
                <text x={PAD.left + i * xStep} y={y - 12} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>
                  {series.format(v)}
                </text>
                <text x={PAD.left + i * xStep} y={CHART_H - 22} textAnchor="middle" fill={series.color} fontSize={10} fontWeight={600}>
                  {d.label}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Tabbed Container ───────────────────────────────────────────────────────────

export default function MarketTimeSeries({ data }: { data: MonthlyDataPoint[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeSeries = SERIES[activeIdx]

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SERIES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActiveIdx(i)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              i === activeIdx
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <MiniChart data={data} series={activeSeries} />
      </div>
    </div>
  )
}
