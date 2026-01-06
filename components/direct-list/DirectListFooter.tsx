// ABOUTME: Footer component for DirectList pages
// ABOUTME: Focused on DirectList-relevant links (How It Works, pricing)

import Link from "next/link";

export function DirectListFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic" }}>
                Access
              </span>{" "}
              <span className="font-[var(--font-be-vietnam-pro)]" style={{ fontWeight: 700 }}>
                Realty
              </span>
            </div>
            <p className="text-sm opacity-90">Sell Your House Your Way</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">DirectList</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/direct-list#pricing"
                  className="hover:text-secondary transition-colors"
                >
                  Compare Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/direct-list/faq"
                  className="hover:text-secondary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-secondary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-secondary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contact Us</h3>
            <p className="text-sm opacity-90">
              Ready to get started? Reach out to discuss your selling options.
            </p>
            <p className="text-sm">
              <a href="tel:+19728207902" className="hover:text-secondary transition-colors">
                (972) 820-7902
              </a>
            </p>
            <p className="text-sm opacity-90">
              5755 Rufe Snow Dr STE 120<br />
              North Richland Hills, TX 76180
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Access Realty. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
