// ABOUTME: DirectList landing page server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to DirectListContent client component

import type { Metadata } from "next";
import DirectListContent from "./DirectListContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "DirectList — Flat-Fee MLS Listing in DFW",
  description:
    "List your home on the MLS starting at $495 upfront. Professional photos, full syndication, and expert support — without the 6% commission.",
  alternates: { canonical: "https://direct-list.com" },
  openGraph: {
    title: "Sell Your Home, Skip the 6% — DirectList",
    description:
      "Flat-fee MLS listing with professional photos and full buyer exposure. Save thousands on your DFW home sale.",
    url: "https://direct-list.com",
    siteName: "DirectList by Access Realty",
  },
};

export default function DirectListPage() {
  return <DirectListContent />;
}
