// ABOUTME: 2 Payment solution detail page
// ABOUTME: Placeholder until full content is ready

import Link from "next/link";
import { HiOutlineCreditCard, HiArrowLeft } from "react-icons/hi2";
import { HeroSection, Section } from "@/components/layout";

export default function TwoPaymentPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <HeroSection centered={false}>
        <Link
          href="/solutions"
          className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
        >
          <HiArrowLeft className="h-4 w-4 mr-2" />
          Back to Solutions
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <HiOutlineCreditCard className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            2 Payment
          </h1>
        </div>
        <p className="text-xl text-primary-foreground/80 max-w-2xl">
          Pay when it works for you
        </p>
      </HeroSection>

      {/* Coming Soon Content */}
      <Section variant="content">
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              Split your fees into two payments — a small amount upfront, the rest at closing. Keep more cash in your pocket until you sell.
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
      </Section>
    </div>
  );
}
