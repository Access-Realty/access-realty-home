// ABOUTME: FAQ page for DirectList flat-fee MLS listing service
// ABOUTME: Uses Accordion component to display common questions

import type { Metadata } from "next";
import Accordion from "@/components/ui/Accordion";
import { HeroSection, Section, DirectListCTA } from "@/components/layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://direct-list.com"),
  title: "FAQ — DirectList Flat-Fee MLS Listing",
  description:
    "Common questions about DirectList flat-fee MLS listings. Fees, buyer's agents, photography, showings, and how the process works.",
  alternates: { canonical: "https://direct-list.com/faq" },
  openGraph: {
    title: "Frequently Asked Questions — DirectList",
    description:
      "Everything you need to know about listing your home on the MLS with DirectList.",
    url: "https://direct-list.com/faq",
    siteName: "DirectList by Access Realty",
  },
};

const faqItems = [
  {
    question: "What is DirectList?",
    answer:
      "DirectList is a flat-fee MLS listing service that gives you control over your home sale through a technology-driven platform with full market exposure — without the traditional commission structure.",
  },
  {
    question: "What is the MLS, and why is it so important?",
    answer:
      "The MLS, or Multiple Listing Service, is the primary database real estate agents use to find and match properties with buyers. When your home is on the MLS, it automatically syndicates to major home search websites, giving you the same exposure as any traditionally listed property.",
  },
  {
    question: "How fast can I get my property listed on the MLS?",
    answer:
      "Your listing goes live within 24 hours after your details and photos are submitted. Professional photography is included at no cost and typically delivers in 2–3 business days, after which your listing is activated immediately.",
  },
  {
    question: "Once my home is listed, where can buyers find it?",
    answer:
      "Your property appears on the MLS and automatically appears on all major home search websites, including Zillow, Realtor.com, Homes.com, and many others.",
  },
  {
    question: "Are there any hidden fees or additional costs beyond the flat fee?",
    answer:
      "No, there are no hidden fees. The flat fee covers your MLS listing and syndication. Optional add-on services are available if you want additional support: On-Market Consultation ($99), On-Site Property Evaluation ($199), Contract Negotiation ($149), and Amendment Negotiation ($149).",
  },
  {
    question: "Are photos included?",
    answer:
      "Yes, professional photography is included at no additional cost. A professional real estate photographer will capture your home to ensure it makes the best first impression online.",
  },
  {
    question: "What is an On-Market Consultation?",
    answer:
      "An optional strategy session where an agent provides guidance on pricing adjustments, current market conditions, competing listings, and overall strategy to improve your listing's performance.",
  },
  {
    question: "What is an On-Site Property Evaluation?",
    answer:
      "An optional service where an agent visits your property to evaluate its condition, review comparable sales, and develop a pricing strategy aligned with current market trends and your target buyer audience.",
  },
  {
    question: "What is Contract Negotiation?",
    answer:
      "An optional service that provides agent guidance through contract terms and direct negotiations with the buyer's agent after an offer is received. A professional interpretation of the contract helps prevent disputes and misunderstandings.",
  },
  {
    question: "What is Amendment Negotiation?",
    answer:
      "An optional service that assists with post-inspection repair requests, concession negotiations, and other buyer requests based on your preferred outcomes.",
  },
  {
    question: "What happens when I receive an offer?",
    answer:
      "You will be notified as soon as an offer is submitted. You can review the offer through your portal and choose to accept, counter, or decline.",
  },
  {
    question: "How do showings work? Do I need to coordinate them myself?",
    answer:
      "No. A professional showing service manages all scheduling and coordination. You control your availability and can approve or decline showing requests as they come in.",
  },
  {
    question: "Can I make changes to my listing after it goes live?",
    answer:
      "Yes. Our support team can update your pricing, descriptions, photos, and other details as needed.",
  },
  {
    question: "Do I choose the buyer's agent commission?",
    answer:
      "Yes, you decide what to offer. The current market standard is approximately 3%. Offering a lower commission is your choice, but often the commission will be reflected in the offer presented and the amount requested will be reflected in the negotiations.",
  },
  {
    question: "How does DirectList help me price my property correctly?",
    answer:
      "Before your listing goes live, an agent will schedule a call with you to review current market data and comparable sales. They'll provide a recommended price, but you always have the final say on your listing price.",
  },
  {
    question: "Will my listing look any different to buyers or agents?",
    answer:
      "No. Your property appears identical to any traditionally listed home. It is listed through a licensed brokerage and shows up on the MLS and all major search platforms the same way.",
  },
  {
    question: "Can I use my own title company?",
    answer:
      "Yes. You can use any title company you prefer, or you can use DirectList's trusted title partner who is already familiar with our process.",
  },
  {
    question: "Is there a limit to how many properties I can list?",
    answer:
      "No, there is no limit. You can list as many properties as you need.",
  },
  {
    question: "What kind of support do I get throughout the transaction?",
    answer:
      "Support is flexible — you can self-direct the process or engage our team for assistance at any stage through closing. You choose how much help you need.",
  },
  {
    question: "Can I list land?",
    answer:
      "Yes. Land and vacant lots are eligible for listing through DirectList.",
  },
  {
    question: "Does DirectList use licensed realtors?",
    answer:
      "Yes, every listing is handled by experienced, licensed real estate professionals who are available to provide guidance and support throughout your transaction.",
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
];

// FAQ structured data derived entirely from our own static faqItems array (not user input),
// so dangerouslySetInnerHTML is safe here — standard Next.js pattern for JSON-LD.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
      <Section variant="content" maxWidth="3xl">
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
