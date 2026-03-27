// app/(direct-list)/direct-list/partners/page.tsx
// ABOUTME: Partners/affiliate recruitment page — noindex, links to PromoteKit signup
// ABOUTME: Server wrapper exports metadata; delegates rendering to PartnersContent

import type { Metadata } from "next";
import PartnersContent from "./PartnersContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Partner with DirectList — Earn $150 Per Referral",
  description:
    "Join the DirectList affiliate program. Earn $150 for every investor who lists with us through your referral link.",
  alternates: { canonical: "https://direct-list.com/partners" },
  robots: { index: false, follow: false },
};

export default function PartnersPage() {
  return <PartnersContent />;
}
