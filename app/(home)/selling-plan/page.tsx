// ABOUTME: Selling Plan quiz page - 5 questions to find the best selling solution
// ABOUTME: Interactive questionnaire that recommends personalized selling options

"use client";

import { useState } from "react";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";

// Question types
type QuestionType = "single" | "multi" | "rank";

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  options: { id: string; label: string; description?: string }[];
}

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
      { id: "major-structural", label: "Yes — Major structural issues", description: "e.g., foundation repair" },
      { id: "big-ticket", label: "Yes — Big-ticket items", description: "roof, AC/heating, plumbing leaks" },
      { id: "non-loanable", label: "Yes — Non-loanable items", description: "exposed plumbing or electrical, missing flooring, etc." },
      { id: "minor", label: "Yes — Minor repairs or maintenance" },
      { id: "none", label: "No repairs needed" },
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
    ],
  },
  {
    id: "priorities",
    question: "Please rank the following in order of importance",
    subtitle: "Drag to reorder, 1 = Most important",
    type: "rank",
    options: [
      { id: "price", label: "Maximizing price" },
      { id: "speed", label: "Selling quickly" },
      { id: "repairs", label: "Avoiding repairs" },
      { id: "convenience", label: "Avoiding inconvenience", description: "showings, paperwork, negotiations" },
    ],
  },
];

// Option card component
function OptionCard({
  option,
  selected,
  onClick,
  type,
  rank,
}: {
  option: { id: string; label: string; description?: string };
  selected: boolean;
  onClick: () => void;
  type: QuestionType;
  rank?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-center gap-4">
        {type === "rank" && rank !== undefined && (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground cursor-grab">⋮⋮</span>
            <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-primary">
              {rank}
            </span>
          </div>
        )}
        {type !== "rank" && (
          <div
            className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              selected ? "border-primary bg-primary" : "border-border"
            }`}
          >
            {selected && (
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
        <div>
          <span className="font-medium text-foreground">
            {option.label}
            {option.description && (
              <span className="text-muted-foreground font-normal">
                {" "}— {option.description}
              </span>
            )}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function SellingPlanPage() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [rankOrder, setRankOrder] = useState<string[]>(
    questions[4].options.map((o) => o.id)
  );
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSingleSelect = (optionId: string) => {
    setAnswers({ ...answers, [question.id]: optionId });
  };

  const handleMultiSelect = (optionId: string) => {
    const current = (answers[question.id] as string[]) || [];
    if (current.includes(optionId)) {
      setAnswers({
        ...answers,
        [question.id]: current.filter((id) => id !== optionId),
      });
    } else {
      setAnswers({ ...answers, [question.id]: [...current, optionId] });
    }
  };

  const handleRankMove = (fromIndex: number, toIndex: number) => {
    const newOrder = [...rankOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setRankOrder(newOrder);
    setAnswers({ ...answers, [question.id]: newOrder });
  };

  const canProceed = () => {
    if (question.type === "single") {
      return !!answers[question.id];
    }
    if (question.type === "multi") {
      return ((answers[question.id] as string[]) || []).length > 0;
    }
    return true; // rank always has a default order
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Intro screen
  if (!started) {
    return (
      <div className="bg-background min-h-screen">
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
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
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors"
              >
                Get Started
                <HiArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Completed screen
  if (completed) {
    return (
      <div className="bg-background min-h-screen">
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Your Personalized Plan
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Based on your answers, we&apos;re preparing your personalized selling recommendations.
              </p>
              <div className="bg-muted rounded-xl p-8 mb-8">
                <p className="text-2xl font-bold text-primary mb-4">
                  Results Coming Soon
                </p>
                <p className="text-muted-foreground mb-6">
                  We&apos;re building the recommendation engine. In the meantime, give us a call and we&apos;ll walk through your options together.
                </p>
                <a
                  href="tel:+19728207902"
                  className="inline-block bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-8 py-4 rounded-lg transition-colors"
                >
                  Call (972) 820-7902
                </a>
              </div>
              <button
                onClick={() => {
                  setStarted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setCompleted(false);
                  setRankOrder(questions[4].options.map((o) => o.id));
                }}
                className="text-primary hover:text-secondary transition-colors font-semibold"
              >
                Start Over
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Question screen
  return (
    <div className="bg-background min-h-screen">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress header */}
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full mb-10 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <h2 className="text-3xl font-bold text-primary mb-2">
              {question.question}
            </h2>
            {question.subtitle && (
              <p className="text-muted-foreground mb-6">({question.subtitle})</p>
            )}

            {/* Options */}
            <div className="space-y-3 mb-10">
              {question.type === "rank"
                ? rankOrder.map((optionId, index) => {
                    const option = question.options.find((o) => o.id === optionId)!;
                    return (
                      <div key={option.id} className="flex gap-2">
                        <button
                          onClick={() => index > 0 && handleRankMove(index, index - 1)}
                          disabled={index === 0}
                          className="p-2 text-muted-foreground hover:text-primary disabled:opacity-30"
                          aria-label="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() =>
                            index < rankOrder.length - 1 && handleRankMove(index, index + 1)
                          }
                          disabled={index === rankOrder.length - 1}
                          className="p-2 text-muted-foreground hover:text-primary disabled:opacity-30"
                          aria-label="Move down"
                        >
                          ▼
                        </button>
                        <div className="flex-1">
                          <OptionCard
                            option={option}
                            selected={false}
                            onClick={() => {}}
                            type="rank"
                            rank={index + 1}
                          />
                        </div>
                      </div>
                    );
                  })
                : question.options.map((option) => {
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
                        type={question.type}
                      />
                    );
                  })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 0
                    ? "opacity-0 pointer-events-none"
                    : "border border-border hover:bg-muted"
                }`}
              >
                <HiArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  canProceed()
                    ? "bg-primary text-primary-foreground hover:bg-primary-dark"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {currentQuestion === questions.length - 1 ? "See My Plan" : "Next"}
                <HiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
