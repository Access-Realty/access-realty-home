// ABOUTME: FAQ page for DirectList flat-fee MLS listing service
// ABOUTME: Uses Accordion component to display common questions

import Accordion from "@/components/ui/Accordion";
import { HeroSection, Section, DirectListCTA } from "@/components/layout";

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
      "Traditional agents typically charge 3% (or more) just to list your home. With DirectList, you pay a flat fee with no percentage-based listing commission. You maintain more control over pricing and negotiations, and you keep more of your equity. It's designed for sellers who want exposure without overpaying.",
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
      "The calculator provides an estimate based on your entered sale price and a 3% traditional listing fee. Actual savings will depend on final sale price, buyer agent commission (if any), negotiated terms, and closing costs. The calculator is meant to give you a clear comparison, not an exact closing statement.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <HeroSection maxWidth="3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-primary-foreground/80">
          Everything you need to know about selling with DirectList.
        </p>
      </HeroSection>

      {/* FAQ Accordion */}
      <Section variant="content" maxWidth="3xl" background="default">
        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          <Accordion items={faqItems} />
        </div>
      </Section>

      {/* CTA flows into DirectListFooter */}
      <DirectListCTA
        heading="Ready to Save Thousands on Your Home Sale?"
        subheading="Get full MLS exposure and keep more money in your pocket."
        buttonText="List My Home on MLS →"
      />
    </>
  );
}
