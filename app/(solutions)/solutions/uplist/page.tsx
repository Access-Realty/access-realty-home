// ABOUTME: Uplist page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import type { Metadata } from "next";
import UplistContent from "./UplistContent";

export const metadata: Metadata = {
  title: "Uplist — We Cover Your Mortgage While You Sell",
  description:
    "Keep your home on the MLS at full price while we cover mortgage payments. A novation solution for loanable, livable homes in DFW.",
  alternates: { canonical: "https://access.realty/solutions/uplist" },
  openGraph: {
    title: "Uplist — Sell on the MLS With Zero Mortgage Stress",
    description:
      "We take over payments and list your home for full market value. No rush, no discount.",
    url: "https://access.realty/solutions/uplist",
  },
};

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function UplistPage() {
  return <UplistContent />;
}
