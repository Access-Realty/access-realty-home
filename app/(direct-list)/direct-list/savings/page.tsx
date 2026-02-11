// ABOUTME: Savings calculator page for DirectList
// ABOUTME: Interactive calculator comparing DirectList flat fee vs 3% traditional listing commission

"use client";

import { useState } from "react";
import Link from "next/link";
import { HiCheck } from "react-icons/hi2";
import Accordion from "@/components/ui/Accordion";
import { HeroSection, Section } from "@/components/layout";
import { useBrandPath } from "@/lib/BrandProvider";

const faqItems = [
  {
    question: "Are there any other fees besides the DirectList fee?",
    answer:
      "Yes. While DirectList replaces the listing agent commission, there are still other costs that may apply in a real estate transaction, including: closing costs (title, escrow, recording fees, etc.), buyer's agent commission if the buyer is represented, repairs or concessions if negotiated during escrow, and property taxes or HOA prorations if applicable. These costs exist whether you list traditionally or use DirectList.",
  },
  {
    question: "Does DirectList include paying a buyer's agent?",
    answer:
      "No. The DirectList fee covers our listing services only. If a buyer is represented by an agent, they may request a commission. You can offer a buyer's agent commission, negotiate the amount, or choose not to offer one at all. You remain in control of that decision.",
  },
  {
    question: "How is DirectList different from a traditional real estate agent?",
    answer:
      "Traditional listing agents typically charge 3% of the sale price. With DirectList, you pay a flat fee instead of a percentage-based listing commission. You maintain more control over pricing and negotiations, and you keep more of your equity. It's designed for sellers who want exposure without overpaying.",
  },
  {
    question: 'Is DirectList a "For Sale By Owner" (FSBO) listing?',
    answer:
      "No. DirectList is not FSBO. Your property is professionally listed and marketed, but without the traditional commission structure. You get the benefits of a listed home without paying a percentage of your sale price.",
  },
  {
    question: "What if my home doesn't sell?",
    answer:
      "If your home doesn't sell, there is no listing commission owed — because there is no percentage-based commission. If you choose to withdraw your listing, a $395 cancellation fee applies to cover administrative costs, MLS fees, photography, and marketing expenses already incurred. The initial upfront payment is non-refundable.",
  },
  {
    question: "Is DirectList right for everyone?",
    answer:
      "No, and that's intentional. DirectList is best for sellers who want to save on commissions, are comfortable being involved in the process, and would like to stay in control of the listing. If you want full-service, traditional representation may be a better fit.",
  },
  {
    question: "How accurate is the savings calculator?",
    answer:
      "The calculator provides an estimate based on your entered sale price and a 3% traditional listing commission. Actual savings will depend on final sale price, buyer agent commission (if any), negotiated terms, and closing costs. The calculator is meant to give you a clear comparison, not an exact closing statement.",
  },
];

const valueProps = [
  "Predictable costs",
  "More control",
  "More equity at closing",
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Styled DirectList brand name component
function DirectListStyled() {
  return (
    <>
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
    </>
  );
}

export default function SavingsPage() {
  const bp = useBrandPath();
  const [salePrice, setSalePrice] = useState<string>("");

  const salePriceNum = parseFloat(salePrice.replace(/,/g, "")) || 0;
  const traditionalFee = salePriceNum * 0.03; // 3% traditional listing commission
  const directListFee = 2995;
  const savings = Math.max(0, traditionalFee - directListFee);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      setSalePrice(Number(value).toLocaleString());
    } else {
      setSalePrice("");
    }
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
          See How Much You Could Save With <DirectListStyled />
        </h1>
        <p className="text-lg text-primary-foreground/80">
          Use the calculator below to estimate how much you could save by choosing DirectList.
        </p>
      </HeroSection>

      {/* Calculator Section */}
      <Section variant="content" maxWidth="4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Enter The Estimated Sales Price
          </h2>
        </div>

        {/* Price Input */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
              $
            </span>
            <input
              type="text"
              value={salePrice}
              onChange={handlePriceChange}
              placeholder="400,000"
              className="w-full pl-10 pr-4 py-4 text-xl border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-card text-foreground"
            />
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Traditional Fee */}
          <div className="bg-card border-2 border-red-200 rounded-xl p-6 text-center">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Traditional Listing Fee (3%)*
            </div>
            <div className="text-3xl md:text-4xl font-bold text-red-500">
              {formatCurrency(traditionalFee)}
            </div>
          </div>

          {/* DirectList Fee */}
          <div className="bg-card border-2 border-border rounded-xl p-6 text-center">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              DirectList
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground">
              {formatCurrency(directListFee)}
            </div>
          </div>

          {/* Savings */}
          <div className="bg-primary border-2 border-primary rounded-xl p-6 text-center">
            <div className="text-xs font-semibold text-primary-foreground/80 uppercase tracking-wide mb-2">
              Your Estimated Savings
            </div>
            <div className="text-3xl md:text-4xl font-bold text-secondary">
              {formatCurrency(savings)}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          *Under a standard Texas Residential Listing Agreement (TXR-1101), the seller agrees to pay a listing commission—typically 3% of the sales price—to the listing broker, who then offers a portion to the cooperating buyer&apos;s broker. While commission rates are not fixed by law or any association, this structure remains the prevailing industry practice. Your actual savings will depend on the final sales price of the Property.
        </p>
      </Section>

      {/* Value Proposition Section */}
      <Section variant="content" maxWidth="3xl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Why Pay More Just Because Your Home Is Worth More?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            DirectList removes the percentage-based commission and replaces it with a transparent, flat fee, giving sellers:
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {valueProps.map((prop) => (
              <div key={prop} className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <HiCheck className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-foreground font-medium">{prop}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Accordion */}
      <Section variant="content" maxWidth="3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="bg-card border border-border rounded-xl px-6">
          <Accordion items={faqItems} />
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="cta" maxWidth="3xl" className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          See If DirectList Is a Fit for You
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Not every seller should use DirectList — and that&apos;s okay. If saving thousands in commissions sounds appealing, the next step is a quick conversation to see if your property and situation are a good fit.
        </p>
        <Link
          href={bp("/direct-list/get-started")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Get Started With DirectList
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </Section>
    </div>
  );
}
