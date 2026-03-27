// ABOUTME: Price Launch page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and ClosedDealsMap during SSG

import type { Metadata } from "next";
import PriceLaunchContent from "./PriceLaunchContent";

export const metadata: Metadata = {
  title: "Price Launch — Strategic Renovation & Pricing",
  description:
    "We invest in renovations, you keep the upside. Strategic pricing and pre-market prep designed to maximize your DFW home's sale price.",
  alternates: { canonical: "https://access.realty/solutions/price-launch" },
  openGraph: {
    title: "Price Launch — Renovate, Price Smart, Sell Higher",
    description:
      "Access Realty invests in your home's renovation and lists at the optimal price to attract competing offers.",
    url: "https://access.realty/solutions/price-launch",
  },
};

// Force dynamic rendering to avoid Google Maps loader conflicts during build
// AddressInput uses ["places"] while ClosedDealsMap uses ["maps"]
export const dynamic = 'force-dynamic';

export default function PriceLaunchPage() {
  return <PriceLaunchContent />;
}
