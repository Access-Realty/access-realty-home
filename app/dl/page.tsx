// ABOUTME: Redirect page for Direct List yard sign QR codes
// ABOUTME: Serves OG tags for social sharing, then redirects to direct-list.com with UTM tracking

import { Metadata } from "next";
import RedirectClient from "./redirect-client";

export const metadata: Metadata = {
  title: "DirectList — Sell Your Home for Less",
  description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
  openGraph: {
    title: "DirectList — Sell Your Home for Less",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
    images: [
      {
        url: "https://direct-list.com/direct-list-logo.png",
        width: 2500,
        height: 659,
        alt: "DirectList",
      },
    ],
    type: "website",
    url: "https://direct-list.com/dl",
  },
  twitter: {
    card: "summary_large_image",
    title: "DirectList — Sell Your Home for Less",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
    images: ["https://direct-list.com/direct-list-logo.png"],
  },
};

export default function DirectListRedirect() {
  return <RedirectClient />;
}
