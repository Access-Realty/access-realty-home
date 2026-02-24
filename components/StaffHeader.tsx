// ABOUTME: Simplified header for staff pages
// ABOUTME: Access Realty logo + Sign In only (no nav links)

import Link from "next/link";

const StaffHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm z-50 border-b border-border">
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
          <a
            href="https://access.realty/app"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
