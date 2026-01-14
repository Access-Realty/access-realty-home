/**
 * Maps quiz answer IDs from the selling plan UI to the decision engine format
 */

import {
  type Answers,
  type Speed,
  type Updates,
  type Repair,
  type Avoidance,
  type Priority,
  type Ranks,
  SPEED,
  UPDATES,
  REPAIRS,
  AVOID,
  PRIORITY,
} from "./sellingDecisionEngine";

// -------------------------
// ID Mappings
// -------------------------

const SPEED_MAP: Record<string, Speed> = {
  "very-fast": SPEED.VERY_FAST,
  "fast": SPEED.FAST,
  "quick": SPEED.QUICK,
  "standard": SPEED.STANDARD,
  "no-hurry": SPEED.NO_HURRY,
};

const UPDATES_MAP: Record<string, Updates> = {
  "top-market": UPDATES.TOP_OF_MARKET,
  "semi-recent": UPDATES.UPDATED_RECENT,
  "nice-not-updated": UPDATES.NICE_NOT_UPDATED,
  "wear-tear": UPDATES.NOT_UPDATED_WEAR,
  "dated": UPDATES.DATED_FULL_COSMETIC,
};

const REPAIRS_MAP: Record<string, Repair> = {
  "major-structural": REPAIRS.STRUCTURAL,
  "big-ticket": REPAIRS.BIG_TICKET,
  "non-loanable": REPAIRS.NON_LOANABLE,
  "minor": REPAIRS.MINOR,
  "none": REPAIRS.NONE,
};

const AVOID_MAP: Record<string, Avoidance> = {
  "showings": AVOID.SHOWINGS,
  "negotiations": AVOID.NEGOTIATIONS,
  "time": AVOID.TIME,
  "none": AVOID.NONE,
};

const PRIORITY_MAP: Record<string, Priority> = {
  "price": PRIORITY.MAX_PRICE,
  "speed": PRIORITY.SELL_FAST,
  "repairs": PRIORITY.AVOID_REPAIRS,
  "convenience": PRIORITY.AVOID_HASSLE,
  "financial-freedom": PRIORITY.FIN_FRESH_START,
};

// -------------------------
// Quiz Answer Types (from UI)
// -------------------------

export type QuizAnswers = {
  timeline: string;
  updates: string;
  repairs: string[];
  avoid: string[];
  priorities: string[]; // Ranked array, index 0 = #1 priority
};

// -------------------------
// Mapping Function
// -------------------------

/**
 * Converts quiz answers from the UI format to the decision engine format
 */
export function mapQuizAnswersToEngine(quiz: QuizAnswers): Answers {
  // Map speed
  const speed = SPEED_MAP[quiz.timeline] ?? SPEED.STANDARD;

  // Map updates
  const updates = UPDATES_MAP[quiz.updates] ?? UPDATES.NICE_NOT_UPDATED;

  // Map repairs (multi-select)
  const repairs: Repair[] = quiz.repairs
    .map((r) => REPAIRS_MAP[r])
    .filter((r): r is Repair => r !== undefined);
  if (repairs.length === 0) repairs.push(REPAIRS.NONE);

  // Map avoidances (multi-select)
  const avoid: Avoidance[] = quiz.avoid
    .map((a) => AVOID_MAP[a])
    .filter((a): a is Avoidance => a !== undefined);
  if (avoid.length === 0) avoid.push(AVOID.NONE);

  // Map priority rankings (array position = rank)
  const ranks = {} as Ranks;
  quiz.priorities.forEach((priorityId, index) => {
    const priority = PRIORITY_MAP[priorityId];
    if (priority) {
      ranks[priority] = (index + 1) as 1 | 2 | 3 | 4 | 5;
    }
  });

  // Ensure all priorities have a rank (fallback for missing values)
  const allPriorities = Object.values(PRIORITY);
  let nextRank = Object.keys(ranks).length + 1;
  for (const p of allPriorities) {
    if (!(p in ranks)) {
      ranks[p] = nextRank as 1 | 2 | 3 | 4 | 5;
      nextRank++;
    }
  }

  return { speed, updates, repairs, avoid, ranks };
}

/**
 * Helper to extract quiz answers from the component's answers state
 */
export function extractQuizAnswers(
  answers: Record<string, string | string[]>,
  priorityRanking: string[]
): QuizAnswers {
  return {
    timeline: answers.timeline as string,
    updates: answers.updates as string,
    repairs: (answers.repairs as string[]) || [],
    avoid: (answers.avoid as string[]) || [],
    priorities: priorityRanking,
  };
}
