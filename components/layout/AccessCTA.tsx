// ABOUTME: Reusable CTA section for general Access Realty pages
// ABOUTME: Uses cream background to match page content sections

import Link from "next/link";

interface AccessCTAProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonHref?: string;
  /** Show phone number alongside button */
  showPhone?: boolean;
}

export function AccessCTA({
  heading = "Let's Build Your Perfect Selling Plan",
  subheading = "Answer 5 quick questions and get a custom selling strategy tailored to your needs.",
  buttonText = "Get My Custom Selling Plan",
  buttonHref = "/selling-plan",
  showPhone = false,
}: AccessCTAProps) {
  return (
    <section className="bg-background py-12 flex-grow flex flex-col justify-center">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          {subheading}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={buttonHref}
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </Link>
          {showPhone && (
            <a
              href="tel:+19728207902"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary/30 text-primary font-semibold rounded-lg hover:border-primary/60 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              (972) 820-7902
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
