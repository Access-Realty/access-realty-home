// ABOUTME: Redirect page for Metroplex Homebuyers SMS campaign
// ABOUTME: Serves OG tags for SMS link previews, then redirects to direct-list.com with UTM tracking

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
    url: "https://direct-list.com/s",
  },
  twitter: {
    card: "summary_large_image",
    title: "DirectList — Sell Your Home for Less",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
  },
};

export default function SMSRedirect() {
  return <RedirectClient />;
}
