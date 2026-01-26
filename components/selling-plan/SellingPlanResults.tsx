// ABOUTME: Results display for the selling plan quiz
// ABOUTME: Shows recommended selling options with "Best Option" and "Also Might Work" cards

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiCheck, HiArrowRight, HiStar, HiSparkles, HiCalendarDays } from "react-icons/hi2";
import {
  type RecommendationResult,
  type OptionCard,
  buildOptionCard,
} from "@/lib/sellingDecisionEngine";
import { ProgramInquiryModal } from "@/components/solutions/ProgramInquiryModal";
import type { AddressData } from "@/components/direct-list/AddressInput";

interface SellingPlanResultsProps {
  result: RecommendationResult;
  onStartOver: () => void;
  storedAddress?: AddressData | null;
}

export function SellingPlanResults({
  result,
  onStartOver,
  storedAddress,
}: SellingPlanResultsProps) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const bestCard = buildOptionCard(result.best);
  const secondaryCards = result.secondary.map(buildOptionCard);
  const hasThreeCards = secondaryCards.length === 2;

  return (
    <>
      <ProgramInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        programName="Discuss Selling Options"
        programSlug="selling_plan"
        addressData={storedAddress || null}
      />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
          Your Personalized Selling Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Based on your answers, here are the best options for selling your home.
        </p>
      </div>

      {/* Cards Container */}
      {hasThreeCards ? (
        <ThreeCardLayout
          bestCard={bestCard}
          secondaryCards={secondaryCards}
        />
      ) : (
        <TwoCardLayout
          bestCard={bestCard}
          secondaryCard={secondaryCards[0]}
        />
      )}

      {/* Footer CTA */}
      <div className="text-center mt-10 space-y-4">
        <p className="text-muted-foreground">
          Not sure which is right for you? We&apos;re happy to walk you through each option.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowInquiryModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <HiCalendarDays className="h-5 w-5" />
            Schedule a Call
            <HiArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onStartOver}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-border hover:bg-muted transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </motion.div>
    </>
  );
}

// Three card layout: Best centered on top, two secondary below
function ThreeCardLayout({
  bestCard,
  secondaryCards,
}: {
  bestCard: OptionCard;
  secondaryCards: OptionCard[];
}) {
  return (
    <div className="space-y-6">
      {/* Best Option - Full width on mobile, centered on desktop */}
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ResultCard card={bestCard} variant="best" />
        </div>
      </div>

      {/* Secondary Options - Stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryCards.map((card) => (
          <ResultCard key={card.key} card={card} variant="secondary" />
        ))}
      </div>
    </div>
  );
}

// Two card layout: Side by side (best larger)
function TwoCardLayout({
  bestCard,
  secondaryCard,
}: {
  bestCard: OptionCard;
  secondaryCard?: OptionCard;
}) {
  if (!secondaryCard) {
    return (
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ResultCard card={bestCard} variant="best" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResultCard card={bestCard} variant="best" />
      <ResultCard card={secondaryCard} variant="secondary" />
    </div>
  );
}

// Individual result card
function ResultCard({
  card,
  variant,
}: {
  card: OptionCard;
  variant: "best" | "secondary";
}) {
  const isBest = variant === "best";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: isBest ? 0 : 0.1 }}
      className={`
        relative rounded-2xl border bg-card p-6 md:p-8
        ${isBest
          ? "border-primary/30 shadow-lg"
          : "border-border shadow-sm"
        }
      `}
    >
      {/* Badge */}
      <div className="absolute -top-3 left-6">
        {isBest ? (
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
            <HiStar className="h-4 w-4" />
            Best Option
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full border border-border">
            <HiSparkles className="h-4 w-4" />
            Also Might Work
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-bold text-foreground ${isBest ? "text-2xl" : "text-xl"}`}>
              {card.title}
            </h3>
            <p className="text-muted-foreground mt-1">
              {card.subtitle}
            </p>
          </div>

          {/* Qualification badge (for Equity Bridge) */}
          {card.badge && (
            <span className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary-foreground">
              {card.badge}
            </span>
          )}
        </div>

        {/* Bullet points */}
        <ul className="mt-5 space-y-2.5">
          {card.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground/80">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Learn More Button */}
        {card.learnMoreUrl && (
          <div className="mt-6">
            <Link
              href={card.learnMoreUrl}
              className={`
                inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold transition-colors
                ${isBest
                  ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                  : "border border-border hover:bg-muted text-foreground"
                }
              `}
            >
              Learn More
              {isBest && <HiArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default SellingPlanResults;
