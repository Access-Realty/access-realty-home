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
    title: "List Investment Properties on MLS at a Flat Fee",
    description:
      "Flat-fee MLS listing built for investors. Same exposure, less cost.",
    url: "https://direct-list.com/investors",
    siteName: "DirectList by Access Realty",
    images: [
      {
        url: "https://direct-list.com/DirectList_Investor.jpg",
        width: 1080,
        height: 1080,
        alt: "DirectList — Built for Experienced Investors",
      },
    ],
  },
};

export default function InvestorsPage() {
  return <InvestorsContent />;
}
