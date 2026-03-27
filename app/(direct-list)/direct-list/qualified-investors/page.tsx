// app/(direct-list)/direct-list/qualified-investors/page.tsx
// ABOUTME: Qualified Investors landing — affiliate target page for PromoteKit campaigns
// ABOUTME: Server wrapper exports metadata; delegates rendering to QualifiedInvestorsContent

import type { Metadata } from "next";
import QualifiedInvestorsContent from "./QualifiedInvestorsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Qualified Investor Pricing — DirectList",
  description:
    "Real estate investors qualify for exclusive pricing. List your investment property on the MLS for $1,995 — save $1,000 with your investor code.",
  alternates: { canonical: "https://direct-list.com/qualified-investors" },
  openGraph: {
    title: "Qualified Investor Pricing — DirectList",
    description:
      "Exclusive investor pricing for MLS listings. $1,995 with your referral code.",
    url: "https://direct-list.com/qualified-investors",
    siteName: "DirectList by Access Realty",
  },
};

export default function QualifiedInvestorsPage() {
  return <QualifiedInvestorsContent />;
}
