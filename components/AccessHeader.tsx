// ABOUTME: Fixed header for Access Realty pages
// ABOUTME: Sticky nav bar with logo, sign-in button, and backdrop blur effect

import Link from "next/link";
import Image from "next/image";

export function AccessHeader() {
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
          <nav className="hidden md:flex items-center gap-8">
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
