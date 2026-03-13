// ABOUTME: Prototype layout for SEO property pages
// ABOUTME: Minimal chrome — these pages will eventually live in the access-realty-seo repo
// ABOUTME: noindex via metadata export — prototypes should NOT be indexed

import type { Metadata } from "next";
import { DirectListHeader } from "@/components/direct-list/DirectListHeader";
import { DirectListFooter } from "@/components/direct-list/DirectListFooter";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DirectListHeader />
      <main className="flex-1">{children}</main>
      <DirectListFooter />
    </div>
  );
}
