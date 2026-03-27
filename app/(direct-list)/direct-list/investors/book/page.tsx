// ABOUTME: Investor booking server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to BookContent client component

import type { Metadata } from "next";
import BookContent from "./BookContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "Book an Investor Consultation",
  description:
    "Schedule a free consultation to discuss flat-fee MLS listings for your investment properties. Quick setup, no obligation.",
  alternates: { canonical: "https://direct-list.com/investors/book" },
  openGraph: {
    title: "Schedule Your Investor Consultation — DirectList",
    description:
      "Free consultation for real estate investors. Learn how DirectList saves you thousands per listing.",
    url: "https://direct-list.com/investors/book",
    siteName: "DirectList by Access Realty",
  },
};

export default function InvestorBookPage() {
  return <BookContent />;
}
