// ABOUTME: Editorial-style time series charts for geo market pages
// ABOUTME: Pure SVG — dark card, gold accent, smooth lines, hover tooltips

'use client'

import { useState } from 'react'
import type { MonthlyDataPoint } from '@/lib/market-stats'

// ─── Types ──────────────────────────────────────────────────────────────────────

type SeriesKey = 'medianSalePrice' | 'salesVolume' | 'medianDom' | 'activeInventory' | 'medianPricePerSqft'

interface SeriesConfig {
  key: SeriesKey
  label: string
  shortLabel: string
  format: (v: number) => string
  chartType: 'line' | 'bar'
  color: string
  gradientFrom: string
  gradientTo: string
}

const NAVY = '#284b70'
const GOLD = '#d6b283'
const CREAM = '#f8f4ef'

const SERIES: SeriesConfig[] = [
  {
    key: 'medianSalePrice',
    label: 'Median Sale Price',
    shortLabel: 'Price',
    format: (v) => `$${(v / 1000).toFixed(0)}K`,
    chartType: 'line',
    color: GOLD,
    gradientFrom: GOLD,
    gradientTo: 'transparent',
  },
  {
    key: 'salesVolume',
    label: 'Sales Volume',
    shortLabel: 'Volume',
    format: (v) => `${v} sales`,
    chartType: 'bar',
    color: NAVY,
    gradientFrom: NAVY,
    gradientTo: 'transparent',
  },
  {
    key: 'medianDom',
    label: 'Days on Market',
    shortLabel: 'DOM',
    format: (v) => `${v} days`,
    chartType: 'line',
    color: '#167544',
    gradientFrom: '#167544',
    gradientTo: 'transparent',
  },
  {
    key: 'activeInventory',
    label: 'Active Inventory',
    shortLabel: 'Inventory',
    format: (v) => `${v}`,
    chartType: 'line',
    color: NAVY,
    gradientFrom: NAVY,
    gradientTo: 'transparent',
  },
  {
    key: 'medianPricePerSqft',
    label: 'Median $/SqFt',
    shortLabel: '$/SqFt',
    format: (v) => `$${v}/sqft`,
    chartType: 'line',
    color: GOLD,
    gradientFrom: GOLD,
    gradientTo: 'transparent',
  },
]

// ─── SVG Chart ──────────────────────────────────────────────────────────────────

const CHART_W = 720
const CHART_H = 260
const PAD = { top: 24, right: 20, bottom: 44, left: 60 }
const INNER_W = CHART_W - PAD.left - PAD.right
const INNER_H = CHART_H - PAD.top - PAD.bottom

function MiniChart({
  data,
  series,
  gradientId,
}: {
  data: MonthlyDataPoint[]
  series: SeriesConfig
  gradientId: string
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const values = data.map(d => d[series.key] as number | null)
  const validValues = values.filter((v): v is number => v != null && v > 0)

  if (validValues.length < 2) {
    return (
      <div className="flex items-center justify-center h-[260px] text-muted-foreground/60 text-sm italic">
        Not enough data for this view
      </div>
    )
  }

  const minVal = Math.min(...validValues) * 0.85
  const maxVal = Math.max(...validValues) * 1.1
  const range = maxVal - minVal || 1

  const xStep = INNER_W / (data.length - 1 || 1)

  // Y-axis: 5 ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minVal + (range * i) / 4
    return Math.round(v)
  })

  // X labels: every 4th month
  const xLabels = data
    .map((d, i) => ({ label: d.label, i }))
    .filter((_, i) => i % 4 === 0 || i === data.length - 1)

  const toX = (i: number) => PAD.left + i * xStep
  const toY = (v: number) => PAD.top + INNER_H - ((v - minVal) / range) * INNER_H

  if (series.chartType === 'line') {
    const points: [number, number, number][] = [] // x, y, index
    data.forEach((d, i) => {
      const v = d[series.key] as number | null
      if (v != null && v > 0) {
        points.push([toX(i), toY(v), i])
      }
    })

    // Smooth curve
    const pathD = points.length > 1
      ? points.reduce((acc, [x, y], i) => {
          if (i === 0) return `M ${x} ${y}`
          const [px, py] = points[i - 1]
          const cpx = (px + x) / 2
          return `${acc} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`
        }, '')
      : ''

    const areaD = pathD && points.length > 1
      ? `${pathD} L ${points[points.length - 1][0]} ${PAD.top + INNER_H} L ${points[0][0]} ${PAD.top + INNER_H} Z`
      : ''

    return (
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series.gradientFrom} stopOpacity="0.2" />
            <stop offset="100%" stopColor={series.gradientTo} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}
        {yTicks.map((v, i) => {
          const y = toY(v)
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
                stroke="currentColor" className="text-border" strokeWidth={0.5} />
              <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize={10} fontFamily="var(--font-be-vietnam-pro), sans-serif">
                {series.format(v).replace(' sales', '').replace(' days', '').replace('/sqft', '')}
              </text>
            </g>
          )
        })}

        {/* X labels */}
        {xLabels.map(({ label, i }) => (
          <text
            key={i}
            x={toX(i)}
            y={CHART_H - 8}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize={10}
            fontFamily="var(--font-be-vietnam-pro), sans-serif"
          >
            {label}
          </text>
        ))}

        {/* Gradient fill */}
        {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

        {/* Line */}
        <path d={pathD} fill="none" stroke={series.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover zones + dots */}
        {points.map(([x, y, idx]) => (
          <g key={idx} onMouseEnter={() => setHoveredIdx(idx)}>
            <rect x={x - xStep / 2} y={PAD.top} width={xStep} height={INNER_H} fill="transparent" />
            {/* Dot always visible on last point */}
            {(hoveredIdx === idx || idx === points[points.length - 1][2]) && (
              <circle cx={x} cy={y} r={hoveredIdx === idx ? 5 : 3.5}
                fill={series.color} stroke="white" strokeWidth={2} />
            )}
            {hoveredIdx === idx && (
              <>
                <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H}
                  stroke={series.color} strokeWidth={0.5} strokeDasharray="4,4" opacity={0.5} />
                {/* Tooltip */}
                <rect x={x - 48} y={y - 34} width={96} height={26} rx={6}
                  fill="#1a1a1a" opacity={0.95} />
                <text x={x} y={y - 17} textAnchor="middle" fill="white" fontSize={12}
                  fontWeight={600} fontFamily="var(--font-be-vietnam-pro), sans-serif">
                  {series.format(data[idx][series.key] as number)}
                </text>
                <text x={x} y={CHART_H - 24} textAnchor="middle" fill={series.color}
                  fontSize={10} fontWeight={600} fontFamily="var(--font-be-vietnam-pro), sans-serif">
                  {data[idx].label}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    )
  }

  // ── Bar chart ──────────────────────────────────────────────────────
  const barWidth = Math.max(6, (INNER_W / data.length) * 0.55)

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="w-full h-auto"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Grid */}
      {yTicks.map((v, i) => {
        const y = toY(v)
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
              stroke="currentColor" className="text-border" strokeWidth={0.5} />
            <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize={10}>
              {series.format(v).replace(' sales', '')}
            </text>
          </g>
        )
      })}

      {/* X labels */}
      {xLabels.map(({ label, i }) => (
        <text key={i} x={toX(i)} y={CHART_H - 8} textAnchor="middle" fill="#9ca3af" fontSize={10}>
          {label}
        </text>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const v = d[series.key] as number | null
        if (v == null || v <= 0) return null
        const x = toX(i) - barWidth / 2
        const barH = ((v - minVal) / range) * INNER_H
        const y = PAD.top + INNER_H - barH
        const isHovered = hoveredIdx === i
        return (
          <g key={i} onMouseEnter={() => setHoveredIdx(i)}>
            <rect x={x} y={y} width={barWidth} height={barH}
              fill={series.color} opacity={isHovered ? 1 : 0.6} rx={3} />
            {isHovered && (
              <>
                <rect x={toX(i) - 40} y={y - 30} width={80} height={24} rx={6} fill="#1a1a1a" opacity={0.95} />
                <text x={toX(i)} y={y - 14} textAnchor="middle" fill="white" fontSize={12} fontWeight={600}>
                  {series.format(v)}
                </text>
                <text x={toX(i)} y={CHART_H - 24} textAnchor="middle" fill={series.color} fontSize={10} fontWeight={600}>
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

// ─── Tabbed Container ───────────────────────────────────────────────────────

export default function MarketTimeSeries({ data }: { data: MonthlyDataPoint[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeSeries = SERIES[activeIdx]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b border-border">
        {SERIES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActiveIdx(i)}
            className={`text-xs px-4 py-2.5 font-medium transition-colors relative ${
              i === activeIdx
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {s.shortLabel}
            {i === activeIdx && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ backgroundColor: s.color }} />
            )}
          </button>
        ))}
      </div>

      {/* Chart card */}
      <div className="bg-primary-dark rounded-2xl p-5 lg:p-6">
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-primary-foreground/60 text-xs uppercase tracking-widest font-medium">
            {activeSeries.label}
          </div>
          <div className="text-primary-foreground/40 text-[10px]">
            24 months
          </div>
        </div>
        <div className="[&_text]:fill-primary-foreground/50 [&_.text-border]:text-primary-foreground/10">
          <MiniChart data={data} series={activeSeries} gradientId={`grad-${activeSeries.key}`} />
        </div>
      </div>
    </div>
  )
}
