// ABOUTME: Root layout for Access Realty marketing site
// ABOUTME: Sets up fonts, metadata, and global styles

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Access Realty - Sell Your House Your Way",
  description:
    "Sell your home smarter, faster, and easier. Top selling agents, highly rated investors, and self-service listing options — all in one place.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} antialiased`}>{children}</body>
    </html>
  );
}
