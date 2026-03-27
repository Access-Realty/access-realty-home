// ABOUTME: Get Started server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to GetStartedContent client component

import type { Metadata } from "next";
import GetStartedContent from "./GetStartedContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Get Started — List Your Home on MLS",
  description:
    "Start your flat-fee MLS listing in minutes. Enter your property details, choose your plan, and go live on the MLS within 72 hours.",
  alternates: { canonical: "https://direct-list.com/get-started" },
  openGraph: {
    title: "List Your Home on the MLS — Get Started",
    description:
      "Enter your property details and choose your DirectList plan. Live on MLS in 72 hours.",
    url: "https://direct-list.com/get-started",
    siteName: "DirectList by Access Realty",
  },
};

export default function GetStartedPage() {
  return <GetStartedContent />;
}
