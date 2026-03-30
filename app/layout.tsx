// ABOUTME: Root layout for Access Realty + DirectList multi-domain marketing site
// ABOUTME: Sets up fonts, metadata, and global styles (no Header/Footer - handled by route groups)

import type { Metadata } from "next";
import { Suspense } from "react";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { TrackingCapture } from "@/components/TrackingCapture";
import { getBrand } from "@/lib/brand-server";
import { BrandProvider } from "@/lib/BrandProvider";
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

const directListOrgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DirectList",
  alternateName: "DirectList by Access Realty",
  url: "https://direct-list.com",
  description:
    "Flat-fee MLS listing service for DFW homeowners. Professional photos, full syndication, and expert support — without the 6% commission.",
  telephone: "+1-972-820-7902",
  areaServed: {
    "@type": "Place",
    name: "Dallas-Fort Worth Metroplex",
  },
  parentOrganization: {
    "@type": "RealEstateAgent",
    name: "Access Realty",
    url: "https://access.realty",
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
  metadataBase: new URL("https://access.realty"),
  title: {
    default: "Access Realty — Sell Your House Your Way",
    template: "%s | Access Realty",
  },
  description:
    "Sell your home smarter, faster, and easier. Top selling agents, highly rated investors, and self-service listing options — all in one place.",
  openGraph: {
    type: "website",
    siteName: "Access Realty",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { brand } = await getBrand();

  return (
    <html lang="en" data-brand={brand}>
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
        {brand === "access" && (
          <>
            <Script
              id="local-business-schema"
              type="application/ld+json"
              strategy="beforeInteractive"
            >
              {JSON.stringify(localBusinessSchema)}
            </Script>
            <Script id="meta-pixel-access" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1641055853569043');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1641055853569043&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
          </>
        )}
        {brand === "directlist" && (
          <>
            <Script
              id="directlist-org-schema"
              type="application/ld+json"
              strategy="beforeInteractive"
            >
              {JSON.stringify(directListOrgSchema)}
            </Script>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1585282762590913');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1585282762590913&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
            <Script
              src="https://cdn.promotekit.com/pk.js"
              data-promotekit={process.env.NEXT_PUBLIC_PROMOTEKIT_ID || ""}
              strategy="afterInteractive"
            />
          </>
        )}
      </head>
      <body className={`${beVietnamPro.variable} ${cormorantGaramond.variable} antialiased`}>
        <BrandProvider brand={brand}>
          <Suspense fallback={null}>
            <TrackingCapture />
          </Suspense>
          {children}
        </BrandProvider>
      </body>
    </html>
  );
}
