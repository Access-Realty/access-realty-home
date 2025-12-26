// ABOUTME: Price Launch solution detail page
// ABOUTME: Placeholder until full content is ready

import Link from "next/link";
import { HiOutlineRocketLaunch, HiArrowLeft } from "react-icons/hi2";

export default function PriceLaunchPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-primary">
        <div className="container mx-auto px-4">
          <Link
            href="/solutions"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
          >
            <HiArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <HiOutlineRocketLaunch className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Price Launch
            </h1>
          </div>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Test the market risk-free
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              Launch your home at an aspirational price before committing to a full listing. See real buyer interest before making decisions.
            </p>
            <div className="bg-muted rounded-xl p-8">
              <p className="text-2xl font-bold text-primary mb-4">
                Details Coming Soon
              </p>
              <p className="text-muted-foreground mb-6">
                We&apos;re putting together more information about this solution. In the meantime, give us a call to learn more.
              </p>
              <a
                href="tel:+19728207902"
                className="inline-block bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Call (972) 820-7902
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
