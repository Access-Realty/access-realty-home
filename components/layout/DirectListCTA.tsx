// ABOUTME: Reusable CTA section for DirectList product pages
// ABOUTME: Flows directly into DirectListFooter (both use bg-primary)

import Link from "next/link";

interface DirectListCTAProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function DirectListCTA({
  heading = "Ready to Save Thousands on Your Home Sale?",
  subheading = "List your home on MLS for a flat fee and keep more money in your pocket.",
  buttonText = "Get Started Now",
  buttonHref = "/direct-list/get-started",
}: DirectListCTAProps) {
  // Uses custom styling instead of Section component to flow seamlessly into DirectListFooter
  // Both use bg-primary - no bottom padding so it flows directly into footer
  return (
    <section className="bg-primary pt-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          {heading}
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
          {subheading}
        </p>
        <Link
          href={buttonHref}
          className="inline-block px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
