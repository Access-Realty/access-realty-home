// ABOUTME: Savings calculator server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to SavingsContent client component

import type { Metadata } from "next";
import SavingsContent from "./SavingsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Commission Savings Calculator",
  description:
    "See how much you save with DirectList vs. a traditional 3% listing commission. Enter your home price and compare costs instantly.",
  alternates: { canonical: "https://direct-list.com/savings" },
  openGraph: {
    title: "How Much Can You Save? — DirectList Calculator",
    description:
      "Compare DirectList flat-fee listing to traditional agent commission. Calculate your savings in seconds.",
    url: "https://direct-list.com/savings",
    siteName: "DirectList by Access Realty",
  },
};

export default function SavingsPage() {
  return <SavingsContent />;
}
