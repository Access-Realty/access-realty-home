// ABOUTME: Seller Finance page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import type { Metadata } from "next";
import SellerFinanceContent from "./SellerFinanceContent";

export const metadata: Metadata = {
  title: "Seller Finance — Earn Monthly Income From Your Home",
  description:
    "Sell your home and become the bank. Earn passive income with monthly payments from the buyer. Ideal for DFW homeowners with equity.",
  alternates: { canonical: "https://access.realty/solutions/seller-finance" },
  openGraph: {
    title: "Seller Finance — Turn Your Home Into Passive Income",
    description:
      "Finance the sale yourself and collect monthly payments. A smart alternative for homeowners with equity.",
    url: "https://access.realty/solutions/seller-finance",
  },
};

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function SellerFinancePage() {
  return <SellerFinanceContent />;
}
