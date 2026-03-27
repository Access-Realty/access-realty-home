// ABOUTME: Selling Plan page server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to SellingPlanContent client component

import type { Metadata } from "next";
import SellingPlanContent from "./SellingPlanContent";

export const metadata: Metadata = {
  title: "Find Your Selling Plan — Free Quiz",
  description:
    "Answer 5 quick questions and get a personalized selling recommendation. Cash offer, MLS listing, or creative solution — find the right fit.",
  alternates: { canonical: "https://access.realty/selling-plan" },
  openGraph: {
    title: "What's the Best Way to Sell Your Home?",
    description:
      "Take our free quiz and get a personalized selling plan for your DFW home in under 2 minutes.",
    url: "https://access.realty/selling-plan",
  },
};

export default function SellingPlanPage() {
  return <SellingPlanContent />;
}
