// ABOUTME: Partners/affiliate recruitment page — noindex, targets DFW wholesalers
// ABOUTME: Server wrapper exports metadata; delegates rendering to PartnersContent

import type { Metadata } from "next";
import PartnersContent from "./PartnersContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "DirectList Partner Program — Earn $150 Per Referral | DFW Wholesalers",
  description:
    "DFW wholesalers & dispo managers: earn $150 per signup. Monetize your buyers list and convert dead leads into revenue with the DirectList Partner Program.",
  alternates: { canonical: "https://direct-list.com/partners" },
  robots: { index: false, follow: false },
};

export default function PartnersPage() {
  return <PartnersContent />;
}
