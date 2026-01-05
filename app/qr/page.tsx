// ABOUTME: Redirect page for yard sign QR codes (alternate)
// ABOUTME: Serves OG tags for social sharing, then redirects to /direct-list with UTM tracking

import { Metadata } from "next";
import RedirectClient from "./redirect-client";

export const metadata: Metadata = {
  title: "Direct List by Access Realty",
  description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
  openGraph: {
    title: "Direct List by Access Realty",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
    images: [
      {
        url: "https://access.realty/direct-list-logo.png",
        width: 2500,
        height: 659,
        alt: "Direct List",
      },
    ],
    type: "website",
    url: "https://access.realty/qr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Direct List by Access Realty",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
    images: ["https://access.realty/direct-list-logo.png"],
  },
};

export default function QRRedirect() {
  return <RedirectClient />;
}
