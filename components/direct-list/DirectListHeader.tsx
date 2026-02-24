// ABOUTME: Header component for DirectList pages
// ABOUTME: Shows DirectList logo on direct-list.com, Access Realty logo on access.realty

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBrand, useBrandPath } from "@/lib/BrandProvider";

function DirectListLogo() {
  return (
    <span className="text-2xl">
      <span
        style={{
          fontFamily: "'Times New Roman', serif",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Direct
      </span>
      <span
        style={{
          fontFamily: "var(--font-be-vietnam-pro), 'Be Vietnam Pro', sans-serif",
          fontWeight: 700,
        }}
      >
        List
      </span>
    </span>
  );
}

export function DirectListHeader() {
  const pathname = usePathname();
  const { brand } = useBrand();
  const bp = useBrandPath();

  const isGetStartedPage =
    pathname === "/direct-list/get-started" || pathname === "/get-started";

  return (
    <header className="fixed top-0 left-0 right-0 bg-muted/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {brand === "directlist" ? (
            <Link href="/" aria-label="DirectList Home" className="text-foreground">
              <DirectListLogo />
            </Link>
          ) : (
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
          )}
          <nav className="flex items-center gap-4">
            <a
              href="https://access.realty/app"
              className="text-foreground/70 hover:text-foreground text-sm md:text-base font-medium transition-colors"
            >
              Sign In
            </a>
            {!isGetStartedPage && (
              <Link
                href={bp("/direct-list/get-started")}
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
