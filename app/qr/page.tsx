// ABOUTME: Redirect page for Access Realty brand yard sign QR codes
// ABOUTME: Serves OG tags for social sharing, then redirects to home page with UTM tracking

import { Metadata } from "next";
import RedirectClient from "./redirect-client";

export const metadata: Metadata = {
  title: "Access Realty",
  description: "Modern real estate brokerage. Buy, sell, and invest with expert guidance and transparent pricing.",
  openGraph: {
    title: "Access Realty",
    description: "Modern real estate brokerage. Buy, sell, and invest with expert guidance and transparent pricing.",
    images: [
      {
        url: "https://access.realty/access-realty-logo.png",
        width: 1200,
        height: 630,
        alt: "Access Realty",
      },
    ],
    type: "website",
    url: "https://access.realty/qr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Access Realty",
    description: "Modern real estate brokerage. Buy, sell, and invest with expert guidance and transparent pricing.",
    images: ["https://access.realty/access-realty-logo.png"],
  },
};

export default function QRRedirect() {
  return <RedirectClient />;
}
