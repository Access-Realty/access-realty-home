// ABOUTME: Header component for DirectList pages
// ABOUTME: Minimal nav with Sign In button and Get Started CTA

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function DirectListHeader() {
  const pathname = usePathname();
  const isGetStartedPage = pathname === "/direct-list/get-started";
  return (
    <header className="fixed top-0 left-0 right-0 bg-muted/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Access Realty Home">
            <Image
              src="/access-realty-logo.png"
              alt="Access Realty"
              width={180}
              height={100}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <nav className="flex items-center gap-4">
            <a
              href="https://app.access.realty"
              className="text-foreground/70 hover:text-foreground text-sm md:text-base font-medium transition-colors"
            >
              Sign In
            </a>
            {!isGetStartedPage && (
              <Link
                href="/direct-list/get-started"
                className="bg-primary text-primary-foreground px-4 md:px-6 py-2 rounded-md text-sm md:text-base font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
