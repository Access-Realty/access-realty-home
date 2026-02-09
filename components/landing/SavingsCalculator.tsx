// ABOUTME: Interactive savings calculator for persona landing pages
// ABOUTME: Supports variants: standard, hourly-rate, fire-growth, investor-multi

"use client";

import { useState } from "react";

interface SavingsCalculatorProps {
  preset: {
    homePrice: number;
    traditionalRate: number;
  };
  variant?: "standard" | "hourly-rate" | "fire-growth" | "investor-multi";
  slug: string;
}

const FLAT_FEE = 2995;
const AGENT_HOURS = 40;

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function SavingsCalculator({ preset, variant = "standard", slug }: SavingsCalculatorProps) {
  const [homePrice, setHomePrice] = useState(preset.homePrice);

  const traditionalCost = homePrice * preset.traditionalRate;
  const savings = traditionalCost - FLAT_FEE;
  const effectiveHourlyRate = traditionalCost / AGENT_HOURS;

  return (
    <div
      className="bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border"
      data-persona={slug}
      data-section="calculator"
    >
      <h3 className="text-xl font-bold text-foreground mb-6">Calculate Your Savings</h3>

      {/* Home price input */}
      <div className="mb-6">
        <label htmlFor="home-price" className="block text-sm font-medium text-foreground mb-2">
          Home Price
        </label>
        <input
          id="home-price"
          type="range"
          min={150000}
          max={1500000}
          step={5000}
          value={homePrice}
          onChange={(e) => setHomePrice(Number(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          aria-label="Adjust home price"
        />
        <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(homePrice)}</p>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Traditional Agent (3%)
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(traditionalCost)}
          </p>
        </div>
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            DirectList Flat Fee
          </p>
          <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(FLAT_FEE)}</p>
        </div>
      </div>

      {/* Savings callout */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center mb-6">
        <p className="text-sm text-success font-medium">You Keep</p>
        <p className="text-3xl font-bold text-success">{formatCurrency(savings)}</p>
      </div>

      {/* Variant-specific extras */}
      {variant === "hourly-rate" && (
        <HourlyRateBreakdown
          traditionalCost={traditionalCost}
          effectiveHourlyRate={effectiveHourlyRate}
        />
      )}
      {variant === "fire-growth" && <FireGrowthProjection savings={savings} />}
      {variant === "investor-multi" && <InvestorMultiDeal savings={savings} />}
    </div>
  );
}

function HourlyRateBreakdown({
  traditionalCost,
  effectiveHourlyRate,
}: {
  traditionalCost: number;
  effectiveHourlyRate: number;
}) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-sm font-semibold text-foreground mb-3">The Hourly Rate Breakdown</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Agent Hours</p>
          <p className="text-lg font-bold text-foreground">~{AGENT_HOURS}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Commission</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(traditionalCost)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Effective Rate</p>
          <p className="text-lg font-bold text-destructive">{formatCurrency(effectiveHourlyRate)}/hr</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Based on ~40 hours of typical listing agent work: photos, listing entry, showing coordination, and offer review.
      </p>
    </div>
  );
}

function FireGrowthProjection({ savings }: { savings: number }) {
  const rate = 0.07;
  const growth10 = savings * Math.pow(1 + rate, 10);
  const growth20 = savings * Math.pow(1 + rate, 20);
  const growth30 = savings * Math.pow(1 + rate, 30);

  return (
    <div className="border-t border-border pt-4">
      <p className="text-sm font-semibold text-foreground mb-3">
        Invest Your Savings at 7% Annual Return
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted-foreground">10 Years</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(growth10)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">20 Years</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(growth20)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">30 Years</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(growth30)}</p>
        </div>
      </div>
    </div>
  );
}

function InvestorMultiDeal({ savings }: { savings: number }) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-sm font-semibold text-foreground mb-3">Savings Scale With Your Portfolio</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-muted-foreground">3 Deals</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(savings * 3)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">5 Deals</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(savings * 5)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">10 Deals</p>
          <p className="text-lg font-bold text-primary">{formatCurrency(savings * 10)}</p>
        </div>
      </div>
    </div>
  );
}
