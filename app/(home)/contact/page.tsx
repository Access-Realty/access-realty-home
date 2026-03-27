// ABOUTME: Contact page server wrapper — exports metadata for SEO
// ABOUTME: Delegates rendering to ContactContent client component

import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us — Free Consultation",
  description:
    "Questions about selling your home? Contact Access Realty for a free, no-obligation consultation. DFW real estate experts ready to help.",
  alternates: { canonical: "https://access.realty/contact" },
  openGraph: {
    title: "Get in Touch — Access Realty",
    description:
      "Free consultation for DFW homeowners. Our agents are ready to help you find the right selling approach.",
    url: "https://access.realty/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
