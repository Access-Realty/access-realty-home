// ABOUTME: Redirect page for Metroplex Homebuyers SMS campaign
// ABOUTME: Serves OG tags for SMS link previews, then redirects to /direct-list with UTM tracking

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
    url: "https://access.realty/sms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Direct List by Access Realty",
    description: "Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.",
  },
};

export default function SMSRedirect() {
  return <RedirectClient />;
}
