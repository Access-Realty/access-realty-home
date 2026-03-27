// ABOUTME: Investors landing server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to InvestorsContent client component

import type { Metadata } from "next";
import InvestorsContent from "./InvestorsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "DirectList for Real Estate Investors",
  description:
    "Flat-fee MLS listings for fix-and-flip and rental properties. Active investors qualify for $1,995 pricing — save thousands per deal with professional listing support.",
  alternates: { canonical: "https://direct-list.com/investors" },
  openGraph: {
    title: "Investor MLS Listings — DirectList",
    description:
      "List investment properties on the MLS at a flat fee. Save on every deal in your portfolio.",
    url: "https://direct-list.com/investors",
    siteName: "DirectList by Access Realty",
  },
};

export default function InvestorsPage() {
  return <InvestorsContent />;
}
