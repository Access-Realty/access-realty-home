// ABOUTME: Root layout for Access Realty marketing site
// ABOUTME: Sets up fonts, metadata, and global styles (no Header/Footer - handled by route groups)

import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-15NH3BVL2Q";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Access Realty",
  description: "Sell your home smarter, faster, and easier. Top selling agents, highly rated investors, and self-service listing options — all in one place.",
  url: "https://access.realty",
  telephone: "+1-972-820-7902",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5755 Rufe Snow Dr STE 120",
    addressLocality: "North Richland Hills",
    addressRegion: "TX",
    postalCode: "76180",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Place",
    name: "Dallas-Fort Worth Metroplex",
  },
};

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Access Realty - Sell Your House Your Way",
  description:
    "Sell your home smarter, faster, and easier. Top selling agents, highly rated investors, and self-service listing options — all in one place.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(localBusinessSchema)}
        </Script>
      </head>
      <body className={`${beVietnamPro.variable} ${cormorantGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
