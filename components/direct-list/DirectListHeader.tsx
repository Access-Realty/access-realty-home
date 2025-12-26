// ABOUTME: Header component for DirectList pages
// ABOUTME: Includes How It Works link (relevant to DirectList flow)

import Link from "next/link";

export function DirectListHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            <span style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic" }}>
              Access
            </span>{" "}
            <span className="font-[var(--font-be-vietnam-pro)]" style={{ fontWeight: 700 }}>
              Realty
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/selling-plan"
              className="text-foreground hover:text-secondary transition-colors"
            >
              Selling Plan
            </Link>
            <Link
              href="/services"
              className="text-foreground hover:text-secondary transition-colors"
            >
              Compare Plans
            </Link>
            <a
              href="https://app.access.realty"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors"
            >
              Sign In
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
