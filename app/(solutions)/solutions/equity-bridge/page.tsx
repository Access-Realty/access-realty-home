// ABOUTME: Equity Bridge page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import type { Metadata } from "next";
import EquityBridgeContent from "./EquityBridgeContent";

export const metadata: Metadata = {
  title: "Equity Bridge — Mortgage Relief While You Sell",
  description:
    "Behind on payments? We cover your mortgage while listing your home on the MLS to get full market value. No foreclosure, no fire sale.",
  alternates: { canonical: "https://access.realty/solutions/equity-bridge" },
  openGraph: {
    title: "Equity Bridge — Stop Foreclosure, Sell at Full Value",
    description:
      "Access Realty covers your mortgage payments while your home sells on the open market at full price.",
    url: "https://access.realty/solutions/equity-bridge",
  },
};

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function EquityBridgePage() {
  return <EquityBridgeContent />;
}
