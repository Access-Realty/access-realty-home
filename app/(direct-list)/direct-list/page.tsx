// ABOUTME: DirectList landing page for flat-fee MLS listing service
// ABOUTME: Showcases savings, process, and pricing comparison

import {
  HiCheck,
  HiOutlineBanknotes,
  HiOutlineHomeModern,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineCamera,
  HiOutlineGlobeAlt,
  HiOutlineLifebuoy
} from "react-icons/hi2";
import Link from "next/link";
import { TierSelectTrigger } from "@/components/services/TierSelectTrigger";
import { StyledTierName } from "@/components/services/StyledTierName";

// Styled DirectList logo component
function DirectListLogo({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
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

export default function DirectListPage() {
  return (
    <div className="bg-card">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/hero-house-new.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-left text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <DirectListLogo />
          </h1>
          <p
            className="text-2xl md:text-3xl mb-4 text-secondary font-semibold"
            style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic" }}
          >
            Exactly what you need, nothing you don&apos;t.
          </p>
          <h2 className="text-lg md:text-xl mb-8 max-w-2xl text-white/90 font-bold">
            Avoid costly agent fees. Get full MLS exposure, backed by experts, and sell smarter.
          </h2>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <TierSelectTrigger
              initialTier="direct-list-plus"
              source="direct-list-hero"
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-white/90 transition-colors"
            >
              Get Started Now
            </TierSelectTrigger>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Calculate Your Savings
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl text-secondary">
            <div>
              <div className="text-3xl md:text-4xl font-bold">$12,000</div>
              <div className="text-sm opacity-80">Average Savings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">72 hrs</div>
              <div className="text-sm opacity-80">MLS Activation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">100%</div>
              <div className="text-sm opacity-80">Your Equity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell Without a Realtor */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Sell Without a Realtor?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple listing system gives you everything you need to sell your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Save Thousands */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineBanknotes className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Save Thousands in Commissions
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save on listing commissions. On a $400k home that&apos;s over $9,000 in savings.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Huge savings
              </span>
            </div>

            {/* Full MLS Exposure */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineHomeModern className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Full MLS Exposure
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your property appears on all major real estate websites including Zillow, Realtor.com, and Redfin.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Maximum visibility
              </span>
            </div>

            {/* Complete Control */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Complete Control
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                You decide on pricing, showings, negotiations, and timeline. No pressure from agents to accept low offers.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                Your decisions
              </span>
            </div>

            {/* Quick MLS Activation */}
            <div className="bg-muted rounded-xl p-6 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineClock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Quick MLS Activation
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get your listing live within 72 hours. Professional photos and description creation included.
              </p>
              <span className="inline-block text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1">
                72-hour setup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
              SIMPLE PROCESS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your home on the MLS in just 4 simple steps. We handle the technical details while you stay in control.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineDocumentText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Complete Your Listing
                </h3>
                <p className="text-muted-foreground">
                  Fill out our simple form with your property details, pricing, and contact information.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineCamera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Professional Setup
                </h3>
                <p className="text-muted-foreground">
                  We create your MLS listing with professional descriptions and optimize your photos.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineGlobeAlt className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Property Goes Live
                </h3>
                <p className="text-muted-foreground">
                  Your property appears on the MLS and all major real estate sites with maximum exposure.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <HiOutlineLifebuoy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Manage Your Sale
                </h3>
                <p className="text-muted-foreground">
                  Handle showings, negotiations, and closing yourself while we provide ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
              PRICING
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Compare Your Options
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly how much you can save by selling without a traditional realtor while still getting MLS exposure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Direct List */}
            <div className="border-2 border-border rounded-xl p-6 bg-card">
              <h3 className="text-xl font-bold text-foreground mb-1">
                <DirectListLogo />
              </h3>
              <div className="text-3xl font-bold text-primary mb-1">$2,995</div>
              <p className="text-sm text-muted-foreground mb-6">$495 upfront</p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>MLS + Syndication</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Professional Photography</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>You control pricing</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Self-guided coordination</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Pay-per-use add-ons</span>
                </li>
              </ul>

              <TierSelectTrigger
                initialTier="direct-list"
                source="direct-list-page"
                className="block w-full bg-secondary text-secondary-foreground text-center py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </TierSelectTrigger>
            </div>

            {/* Direct List Plus - Best Value */}
            <div className="border-2 border-primary rounded-xl p-6 bg-primary/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1 mt-2">
                <DirectListLogo /> Plus
              </h3>
              <div className="text-3xl font-bold text-primary mb-1">$4,495</div>
              <p className="text-sm text-muted-foreground mb-6">$995 upfront</p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>MLS + Syndication</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Professional photos & copy</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Premium marketing included</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Premium analytics</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-semibold">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Save Thousands</span>
                </li>
              </ul>

              <TierSelectTrigger
                initialTier="direct-list-plus"
                source="direct-list-page"
                className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
              >
                Get Started Now
              </TierSelectTrigger>
            </div>

            {/* Full Service */}
            <div className="border-2 border-border rounded-xl p-6 bg-card">
              <h3 className="text-xl font-bold text-foreground mb-1">
                <StyledTierName name="Full Service" />
              </h3>
              <div className="text-3xl font-bold text-primary mb-1">3%</div>
              <p className="text-sm text-muted-foreground mb-6">No upfront payment</p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Full agent representation</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Negotiation on every offer</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Repairs management</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Transaction coordination</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <HiCheck className="h-4 w-4 text-green-600" />
                  <span>Preferred vendors access</span>
                </li>
              </ul>

              <TierSelectTrigger
                initialTier="full-service"
                source="direct-list-page"
                className="block w-full bg-secondary text-secondary-foreground text-center py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </TierSelectTrigger>
            </div>
          </div>

          <p className="text-center text-lg">
            <span className="font-bold">Save $9,000</span>{" "}
            <span className="text-muted-foreground">on a $400k home sale compared to traditional realtors</span>
          </p>
        </div>
      </section>

      {/* Simplified Final CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Save Thousands on Your Home Sale?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Get full MLS exposure and keep more money in your pocket.
          </p>
          <TierSelectTrigger
            initialTier="direct-list-plus"
            source="direct-list-cta"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            List My Home on MLS
            <span aria-hidden="true">&rarr;</span>
          </TierSelectTrigger>
        </div>
      </section>
    </div>
  );
}
