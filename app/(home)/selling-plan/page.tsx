// ABOUTME: Selling Plan quiz page - 5 questions to find the best selling solution
// ABOUTME: Interactive questionnaire that recommends personalized selling options

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Section, AccessCTA } from "@/components/layout";
import { HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi2";
import { recommendOptions, type RecommendationResult } from "@/lib/sellingDecisionEngine";
import { extractQuizAnswers, mapQuizAnswersToEngine } from "@/lib/sellingPlanMapper";
import { SellingPlanResults } from "@/components/selling-plan/SellingPlanResults";

// Question types
type QuestionType = "single" | "multi" | "rank";

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  options: { id: string; label: string; description?: string }[];
}

// Priority options for the stepped ranking (base list)
const allPriorityOptions = [
  { id: "price", label: "Maximizing price", description: "Getting the most money from the sale" },
  { id: "speed", label: "Selling quickly", description: "Closing as fast as possible" },
  { id: "repairs", label: "Avoiding repairs", description: "Not having to fix anything" },
  { id: "convenience", label: "Avoiding hassle", description: "No showings, paperwork, or negotiations" },
  { id: "financial-freedom", label: "Financial fresh start", description: "Freeing up equity or simplifying monthly obligations" },
];

const questions: Question[] = [
  {
    id: "timeline",
    question: "How soon do you need to sell?",
    type: "single",
    options: [
      { id: "very-fast", label: "Very Fast", description: "Less than 2 weeks" },
      { id: "fast", label: "Fast", description: "Less than 30 days" },
      { id: "quick", label: "Quick", description: "Less than 3 months" },
      { id: "standard", label: "Standard", description: "4–6 months" },
      { id: "no-hurry", label: "No Hurry", description: "More than 6 months is fine" },
    ],
  },
  {
    id: "updates",
    question: "Which best describes the level of updates your property has?",
    type: "single",
    options: [
      { id: "top-market", label: "Top-of-Market Updated", description: "Updated within the last 2 years" },
      { id: "semi-recent", label: "Updated Semi-Recently", description: "Updated within the last 10 years" },
      { id: "nice-not-updated", label: "Nice, but Not Updated" },
      { id: "wear-tear", label: "Not Updated, with Wear and Tear" },
      { id: "dated", label: "Dated", description: "Needs cosmetic updates" },
    ],
  },
  {
    id: "repairs",
    question: "Does the house need any repairs?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      { id: "none", label: "No repairs needed" },
      { id: "minor", label: "Yes — Minor repairs or maintenance" },
      { id: "non-loanable", label: "Yes — Non-loanable items", description: "exposed plumbing or electrical, missing flooring, etc." },
      { id: "big-ticket", label: "Yes — Big-ticket items", description: "roof, AC/heating, plumbing leaks" },
      { id: "major-structural", label: "Yes — Major structural issues", description: "e.g., foundation repair" },
    ],
  },
  {
    id: "avoid",
    question: "Is there anything about selling your home that you're really trying to avoid?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      { id: "showings", label: "Showings" },
      { id: "negotiations", label: "Back-and-forth negotiations" },
      { id: "time", label: "Excessive time spent during the sales process" },
      { id: "none", label: "None of the above", description: "I'm open to whatever gets me the best result" },
    ],
  },
  {
    id: "priorities",
    question: "What matters most to you?",
    type: "rank",
    options: allPriorityOptions, // Filtered dynamically in component based on repairs answer
  },
];

// Stepped ranking prompts
const rankingPrompts = [
  "What's MOST important to you?",
  "What's next most important?",
  "And after that?",
  "What comes next?",
  "And finally...",
];

// Option card component
function OptionCard({
  option,
  selected,
  onClick,
  disabled,
}: {
  option: { id: string; label: string; description?: string };
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 bg-muted shadow-sm ${
        disabled
          ? "opacity-50 cursor-not-allowed border-border"
          : selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-muted-foreground/30 hover:border-primary/50 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            selected ? "border-primary bg-primary" : "border-muted-foreground/50"
          }`}
        >
          {selected && (
            <HiCheck className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <span className="font-medium text-foreground">
            {option.label}
          </span>
          {option.description && (
            <span className="block text-sm text-muted-foreground mt-0.5">
              {option.description}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// Animated priority card for ranking question
function PriorityCard({
  option,
  rank,
  onClick,
  disabled,
  isRanked,
}: {
  option: { id: string; label: string; description?: string };
  rank?: number;
  onClick?: () => void;
  disabled?: boolean;
  isRanked: boolean;
}) {
  if (isRanked) {
    // Ranked state - compact display with rank number
    return (
      <motion.div
        layoutId={`priority-${option.id}`}
        className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
          mass: 1,
        }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
          className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground"
        >
          {rank}
        </motion.span>
        <span className="font-medium text-foreground">{option.label}</span>
      </motion.div>
    );
  }

  // Selectable state - full card with description
  return (
    <motion.button
      layoutId={`priority-${option.id}`}
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-5 rounded-xl border-2 border-muted-foreground/30 bg-muted shadow-sm hover:border-primary/50 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      initial={false}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 1,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center" />
        <div>
          <span className="font-medium text-foreground">{option.label}</span>
          {option.description && (
            <span className="block text-sm text-muted-foreground mt-0.5">
              {option.description}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function SellingPlanPage() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [priorityRanking, setPriorityRanking] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // Transition state
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const question = questions[currentQuestion];
  const isRankingQuestion = question.type === "rank";

  // Filter out "Avoiding repairs" if user selected "No repairs needed"
  const repairsAnswer = answers.repairs as string[] | undefined;
  const hasNoRepairs = repairsAnswer?.length === 1 && repairsAnswer[0] === "none";
  const priorityOptions = hasNoRepairs
    ? allPriorityOptions.filter((opt) => opt.id !== "repairs")
    : allPriorityOptions;

  const rankingStep = priorityRanking.length;
  const totalRankingSteps = priorityOptions.length;

  // Calculate progress - ranking question counts as multiple sub-steps
  const baseProgress = currentQuestion / questions.length;
  const rankingProgress = isRankingQuestion ? (rankingStep / totalRankingSteps) / questions.length : 0;
  const progress = Math.round((baseProgress + rankingProgress) * 100);

  // Calculate recommendation when quiz is completed
  const recommendation = useMemo<RecommendationResult | null>(() => {
    if (!completed) return null;
    const quizAnswers = extractQuizAnswers(answers, priorityRanking);
    const engineAnswers = mapQuizAnswersToEngine(quizAnswers);
    return recommendOptions(engineAnswers);
  }, [completed, answers, priorityRanking]);

  // Transition helper
  const transitionTo = (direction: "left" | "right", callback: () => void) => {
    if (isTransitioning) return;

    setSlideDirection(direction);
    setIsVisible(false);
    setIsTransitioning(true);

    setTimeout(() => {
      callback();
      setIsVisible(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 200);
  };

  const handleSingleSelect = (optionId: string) => {
    // Set answer and auto-advance
    setAnswers({ ...answers, [question.id]: optionId });

    // Auto-advance after brief delay to show selection
    setTimeout(() => {
      transitionTo("left", () => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setCompleted(true);
        }
      });
    }, 150);
  };

  const handleMultiSelect = (optionId: string) => {
    const current = (answers[question.id] as string[]) || [];

    // Special case: "No repairs needed" on Q3 or "None of the above" on Q4 should auto-advance
    if ((question.id === "repairs" || question.id === "avoid") && optionId === "none") {
      setAnswers({ ...answers, [question.id]: [optionId] });
      setTimeout(() => {
        transitionTo("left", () => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            setCompleted(true);
          }
        });
      }, 150);
      return;
    }

    // If selecting another option, remove "none" if it was selected
    if ((question.id === "repairs" || question.id === "avoid") && optionId !== "none" && current.includes("none")) {
      setAnswers({ ...answers, [question.id]: [optionId] });
      return;
    }

    if (current.includes(optionId)) {
      setAnswers({
        ...answers,
        [question.id]: current.filter((id) => id !== optionId),
      });
    } else {
      setAnswers({ ...answers, [question.id]: [...current, optionId] });
    }
  };

  const handlePrioritySelect = (optionId: string) => {
    // No transitionTo - framer-motion handles the animation
    const newRanking = [...priorityRanking, optionId];
    setPriorityRanking(newRanking);

    // If all priorities ranked, save to answers
    if (newRanking.length === totalRankingSteps) {
      setAnswers({ ...answers, priorities: newRanking });
    }
  };

  const canProceed = () => {
    if (question.type === "single") {
      return !!answers[question.id];
    }
    if (question.type === "multi") {
      return ((answers[question.id] as string[]) || []).length > 0;
    }
    if (question.type === "rank") {
      return priorityRanking.length === totalRankingSteps;
    }
    return true;
  };

  const handleNext = () => {
    transitionTo("left", () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setCompleted(true);
      }
    });
  };

  const handleBack = () => {
    transitionTo("right", () => {
      if (isRankingQuestion && priorityRanking.length > 0) {
        setPriorityRanking(priorityRanking.slice(0, -1));
      } else if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    });
  };

  const handleStart = () => {
    transitionTo("left", () => {
      setStarted(true);
    });
  };

  const handleRestart = () => {
    transitionTo("right", () => {
      setStarted(false);
      setCurrentQuestion(0);
      setAnswers({});
      setPriorityRanking([]);
      setCompleted(false);
    });
  };

  // Get remaining priority options (not yet ranked)
  const remainingPriorities = priorityOptions.filter(
    (opt) => !priorityRanking.includes(opt.id)
  );

  // Transition classes - horizontal slide
  const getSlideTransform = () => {
    if (isVisible) return "translate-x-0";
    return slideDirection === "left" ? "-translate-x-8" : "translate-x-8";
  };

  const contentClasses = `transform transition-all duration-300 ease-out ${
    isVisible ? "opacity-100" : "opacity-0"
  } ${getSlideTransform()}`;

  // Intro screen
  if (!started) {
    return (
      <div className="bg-background flex-1">
      <Section variant="content" maxWidth="3xl" className="pt-24 pb-12">
        <div className={`bg-card rounded-xl border border-border p-8 md:p-12 text-center ${contentClasses}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Your Home. Your Best Selling Plan.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Selling a home isn&apos;t one-size-fits-all. Different goals require different
            strategies, and choosing the wrong one can cost you time, money, or
            unnecessary stress.
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Answer 5 quick questions and we&apos;ll create a personalized selling plan that
            shows you 2–3 realistic ways to reach your goal, so you can decide what works
            best for you.
          </p>
          <button
            onClick={handleStart}
            disabled={isTransitioning}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors"
          >
            Get Started
            <HiArrowRight className="h-5 w-5" />
          </button>
        </div>
      </Section>
      </div>
    );
  }

  // Completed screen with recommendations
  if (completed && recommendation) {
    return (
      <div className="bg-background flex-1">
        <Section variant="content" maxWidth="5xl" className="pt-24 pb-12">
          <div className={contentClasses}>
            <SellingPlanResults
              result={recommendation}
              onStartOver={handleRestart}
            />
          </div>
        </Section>
      </div>
    );
  }

  // Question screen
  return (
    <div className="bg-background flex-1">
      <Section variant="content" maxWidth="2xl" className="pt-24 pb-12">
        <div className="bg-card rounded-xl border border-border p-8 md:p-10">
            {/* Progress header - always visible */}
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full mb-10 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question content with transitions */}
            <div className={isRankingQuestion ? "" : contentClasses}>
              {/* Ranking Question - Stepped UI with Framer Motion */}
              {isRankingQuestion ? (
                <LayoutGroup>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      {rankingPrompts[rankingStep] || "What matters most?"}
                    </h2>
                    {rankingStep < totalRankingSteps && (
                      <p className="text-muted-foreground mb-6">
                        Step {rankingStep + 1} of {totalRankingSteps}
                      </p>
                    )}
                  </motion.div>

                  {/* Already ranked items */}
                  <motion.div layout className="space-y-2 mb-6">
                    <AnimatePresence mode="popLayout">
                      {priorityRanking.map((id, index) => {
                        const option = priorityOptions.find((o) => o.id === id)!;
                        return (
                          <PriorityCard
                            key={id}
                            option={option}
                            rank={index + 1}
                            isRanked={true}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* Remaining options to choose from */}
                  <motion.div layout className="space-y-3 mb-10">
                    <AnimatePresence mode="popLayout">
                      {remainingPriorities.map((option) => (
                        <PriorityCard
                          key={option.id}
                          option={option}
                          onClick={() => handlePrioritySelect(option.id)}
                          disabled={isTransitioning}
                          isRanked={false}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* All ranked - show summary */}
                  <AnimatePresence>
                    {remainingPriorities.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-primary/5 rounded-xl p-6 mb-10 border border-primary/20"
                      >
                        <p className="text-center text-foreground font-medium">
                          Your priorities are set. Click &quot;See My Plan&quot; to continue.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LayoutGroup>
              ) : (
                <>
                  {/* Regular Question */}
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    {question.question}
                  </h2>
                  {question.subtitle && (
                    <p className="text-muted-foreground mb-6">({question.subtitle})</p>
                  )}

                  {/* Options */}
                  <div className="space-y-3 mb-10">
                    {question.options.map((option) => {
                      const isSelected =
                        question.type === "single"
                          ? answers[question.id] === option.id
                          : ((answers[question.id] as string[]) || []).includes(option.id);
                      return (
                        <OptionCard
                          key={option.id}
                          option={option}
                          selected={isSelected}
                          onClick={() =>
                            question.type === "single"
                              ? handleSingleSelect(option.id)
                              : handleMultiSelect(option.id)
                          }
                          disabled={isTransitioning}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Navigation - only show for multi-select and ranking */}
            <div className={`flex items-center justify-between transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
              <button
                onClick={handleBack}
                disabled={(currentQuestion === 0 && priorityRanking.length === 0) || isTransitioning}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 0 && priorityRanking.length === 0
                    ? "opacity-0 pointer-events-none"
                    : "border border-border hover:bg-muted"
                }`}
              >
                <HiArrowLeft className="h-4 w-4" />
                Back
              </button>

              {/* Only show Next for multi-select and completed ranking */}
              {(question.type === "multi" || (isRankingQuestion && remainingPriorities.length === 0)) && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isTransitioning}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    canProceed() && !isTransitioning
                      ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? "See My Plan" : "Next"}
                  <HiArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </Section>
      </div>
    );
  }
