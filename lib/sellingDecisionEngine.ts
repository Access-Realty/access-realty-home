/**
 * Access Realty - 5 Questions Decision Engine
 * Recommends selling options based on quiz answers
 *
 * Options:
 *  - "cash"           (primary-capable)
 *  - "equity_bridge"  (primary-capable, show label "See if you qualify")
 *  - "traditional"    (primary-capable)
 *  - "direct_list"    (primary-capable)
 *  - "price_launch"   (primary-capable, time-sensitive)
 *  - "uplist"         (secondary-only)
 *  - "seller_finance" (secondary-only, ALWAYS LAST if shown)
 */

// -------------------------
// Types
// -------------------------
export type OptionKey =
  | "cash"
  | "equity_bridge"
  | "traditional"
  | "direct_list"
  | "price_launch"
  | "uplist"
  | "seller_finance";

export const SPEED = {
  VERY_FAST: "very_fast",
  FAST: "fast",
  QUICK: "quick",
  STANDARD: "standard",
  NO_HURRY: "no_hurry",
} as const;
export type Speed = (typeof SPEED)[keyof typeof SPEED];

export const UPDATES = {
  TOP_OF_MARKET: "top_of_market",
  UPDATED_RECENT: "updated_semi_recent",
  NICE_NOT_UPDATED: "nice_not_updated",
  NOT_UPDATED_WEAR: "not_updated_wear",
  DATED_FULL_COSMETIC: "dated_full_cosmetic",
} as const;
export type Updates = (typeof UPDATES)[keyof typeof UPDATES];

export const REPAIRS = {
  STRUCTURAL: "structural",
  BIG_TICKET: "big_ticket",
  NON_LOANABLE: "non_loanable",
  MINOR: "minor",
  NONE: "none",
} as const;
export type Repair = (typeof REPAIRS)[keyof typeof REPAIRS];

export const AVOID = {
  SHOWINGS: "showings",
  NEGOTIATIONS: "negotiations",
  TIME: "excessive_time",
  NONE: "none_open",
} as const;
export type Avoidance = (typeof AVOID)[keyof typeof AVOID];

export const PRIORITY = {
  MAX_PRICE: "maximize_price",
  SELL_FAST: "sell_quickly",
  AVOID_REPAIRS: "avoid_repairs",
  AVOID_HASSLE: "avoid_hassle",
  FIN_FRESH_START: "financial_fresh_start",
} as const;
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export type Ranks = Record<Priority, 1 | 2 | 3 | 4 | 5>;

export type Answers = {
  speed: Speed;
  updates: Updates;
  repairs: Repair[];
  avoid: Avoidance[];
  ranks: Ranks;
};

export type RecommendationResult = {
  best: OptionKey;
  secondary: OptionKey[];
  debug?: {
    excluded: OptionKey[];
    scores: Record<OptionKey, number>;
  };
};

// -------------------------
// Config
// -------------------------
const OPTIONS: OptionKey[] = [
  "cash",
  "equity_bridge",
  "traditional",
  "direct_list",
  "price_launch",
  "uplist",
  "seller_finance",
];

const SIMPLICITY_ORDER: OptionKey[] = [
  "cash",
  "equity_bridge",
  "traditional",
  "direct_list",
  "price_launch",
  "uplist",
  "seller_finance",
];

const SECONDARY_ONLY = new Set<OptionKey>(["uplist", "seller_finance"]);
const ALWAYS_LAST_IF_SHOWN: OptionKey = "seller_finance";

const RANK_WEIGHTS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 10,
  2: 6,
  3: 1,
  4: 0,
  5: 0,
};

// -------------------------
// Core Engine
// -------------------------
export function recommendOptions(
  answers: Answers,
  includeDebug = false
): RecommendationResult {
  const excluded = computeExclusions(answers);
  let eligible = OPTIONS.filter((o) => !excluded.has(o));

  if (eligible.length === 0) {
    return { best: "cash", secondary: [] };
  }

  const scores = computeScores(answers, eligible);
  const override = computeBestOverride(answers, eligible);
  let best: OptionKey = override ?? pickBestByScore(scores, eligible);

  // Enforce secondary-only cannot be best
  if (SECONDARY_ONLY.has(best)) {
    const primaries = eligible.filter((o) => !SECONDARY_ONLY.has(o));
    best = primaries.length
      ? pickBestByScore(scores, primaries)
      : pickBestByScore(scores, eligible);
  }

  // Pick secondary cards (1–2) from remaining eligible
  let remaining = eligible.filter((o) => o !== best);
  remaining.sort((a, b) => compareOptionsByScoreThenSimplicity(scores, a, b));
  remaining = moveToEndIfPresent(remaining, ALWAYS_LAST_IF_SHOWN);

  const secondary: OptionKey[] = [];
  for (const opt of remaining) {
    if (secondary.length >= 2) break;
    if (opt === ALWAYS_LAST_IF_SHOWN) {
      if (secondary.length < 2 && sellerFinanceAllowed(answers)) {
        secondary.push(opt);
      }
      continue;
    }
    secondary.push(opt);
  }

  if (
    secondary.length < 2 &&
    remaining.includes(ALWAYS_LAST_IF_SHOWN) &&
    !secondary.includes(ALWAYS_LAST_IF_SHOWN) &&
    sellerFinanceAllowed(answers)
  ) {
    secondary.push(ALWAYS_LAST_IF_SHOWN);
  }

  const secondaryFinal = moveToEndIfPresent(secondary, ALWAYS_LAST_IF_SHOWN);

  const result: RecommendationResult = { best, secondary: secondaryFinal };
  if (includeDebug) {
    result.debug = {
      excluded: Array.from(excluded) as OptionKey[],
      scores: scores as Record<OptionKey, number>,
    };
  }
  return result;
}

// -------------------------
// Exclusions
// -------------------------
function computeExclusions(a: Answers): Set<OptionKey> {
  const excluded = new Set<OptionKey>();

  const speedUnder30 = a.speed === SPEED.VERY_FAST || a.speed === SPEED.FAST;
  const speedQuick = a.speed === SPEED.QUICK;

  if (speedUnder30) {
    excluded.add("traditional");
    excluded.add("direct_list");
    excluded.add("uplist");
    excluded.add("price_launch");
  }

  if (speedQuick) {
    excluded.add("price_launch");
  }

  const repairSet = new Set(a.repairs);
  const hasHardRepairs =
    repairSet.has(REPAIRS.STRUCTURAL) ||
    repairSet.has(REPAIRS.BIG_TICKET) ||
    repairSet.has(REPAIRS.NON_LOANABLE);

  if (hasHardRepairs) {
    excluded.add("traditional");
    excluded.add("direct_list");
    excluded.add("uplist");
  }

  return excluded;
}

// -------------------------
// Scoring
// -------------------------
function computeScores(
  a: Answers,
  eligible: OptionKey[]
): Record<OptionKey, number> {
  const scores = Object.fromEntries(eligible.map((o) => [o, 0])) as Record<
    OptionKey,
    number
  >;

  const speedUnder30 = a.speed === SPEED.VERY_FAST || a.speed === SPEED.FAST;
  const timePlenty = a.speed === SPEED.STANDARD || a.speed === SPEED.NO_HURRY;

  const repairSet = new Set(a.repairs);
  const avoidSet = new Set(a.avoid);

  const rank = (p: Priority) => a.ranks[p];
  const w = (p: Priority) => RANK_WEIGHTS[rank(p)];

  const maxPriceRank = rank(PRIORITY.MAX_PRICE);
  const sellFast1or2 =
    rank(PRIORITY.SELL_FAST) === 1 || rank(PRIORITY.SELL_FAST) === 2;
  const finStart1or2 =
    rank(PRIORITY.FIN_FRESH_START) === 1 ||
    rank(PRIORITY.FIN_FRESH_START) === 2;
  const avoidHassle1or2 =
    rank(PRIORITY.AVOID_HASSLE) === 1 || rank(PRIORITY.AVOID_HASSLE) === 2;

  const needsWork =
    repairSet.has(REPAIRS.STRUCTURAL) ||
    repairSet.has(REPAIRS.BIG_TICKET) ||
    repairSet.has(REPAIRS.NON_LOANABLE) ||
    repairSet.has(REPAIRS.MINOR) ||
    a.updates === UPDATES.NOT_UPDATED_WEAR ||
    a.updates === UPDATES.DATED_FULL_COSMETIC;

  const moveInReady =
    (repairSet.size === 0 ||
      (repairSet.size === 1 && repairSet.has(REPAIRS.NONE))) &&
    (a.updates === UPDATES.TOP_OF_MARKET ||
      a.updates === UPDATES.UPDATED_RECENT ||
      a.updates === UPDATES.NICE_NOT_UPDATED);

  // CASH
  if (scores.cash !== undefined) {
    if (speedUnder30) scores.cash += 12;
    if (needsWork) scores.cash += 10;
    if (avoidSet.has(AVOID.SHOWINGS)) scores.cash += 4;
    if (avoidSet.has(AVOID.NEGOTIATIONS)) scores.cash += 4;
    if (avoidSet.has(AVOID.TIME)) scores.cash += 2;
    scores.cash += w(PRIORITY.AVOID_HASSLE) * 0.8;
    scores.cash += w(PRIORITY.SELL_FAST) * 0.9;
    scores.cash += w(PRIORITY.AVOID_REPAIRS) * 0.8;
    if (maxPriceRank === 1) scores.cash -= 12;
    else if (maxPriceRank === 2) scores.cash -= 7;
    else scores.cash -= w(PRIORITY.MAX_PRICE) * 0.2;
  }

  // EQUITY BRIDGE
  if (scores.equity_bridge !== undefined) {
    if (a.speed === SPEED.FAST) scores.equity_bridge += 12;
    if (a.speed === SPEED.VERY_FAST) scores.equity_bridge += 6;
    scores.equity_bridge += w(PRIORITY.MAX_PRICE) * 0.9;
    scores.equity_bridge += w(PRIORITY.FIN_FRESH_START) * 0.9;
    scores.equity_bridge += w(PRIORITY.AVOID_HASSLE) * 0.7;
    scores.equity_bridge += w(PRIORITY.SELL_FAST) * 0.6;
    if (avoidSet.has(AVOID.SHOWINGS)) scores.equity_bridge += 3;
    if (avoidSet.has(AVOID.NEGOTIATIONS)) scores.equity_bridge += 3;
  }

  // TRADITIONAL
  if (scores.traditional !== undefined) {
    if (a.speed === SPEED.NO_HURRY) scores.traditional += 12;
    if (a.speed === SPEED.STANDARD) scores.traditional += 8;
    if (a.speed === SPEED.QUICK) scores.traditional += 2;
    if (moveInReady) scores.traditional += 10;
    if (a.updates === UPDATES.TOP_OF_MARKET) scores.traditional += 6;
    if (a.updates === UPDATES.UPDATED_RECENT) scores.traditional += 4;
    scores.traditional += w(PRIORITY.MAX_PRICE) * 1.0;
    if (avoidHassle1or2) scores.traditional -= 8;
    if (avoidSet.has(AVOID.SHOWINGS)) scores.traditional -= 5;
    if (avoidSet.has(AVOID.NEGOTIATIONS)) scores.traditional -= 4;
  }

  // DIRECT LIST
  if (scores.direct_list !== undefined) {
    if (a.speed === SPEED.NO_HURRY) scores.direct_list += 10;
    if (a.speed === SPEED.STANDARD) scores.direct_list += 6;
    if (a.speed === SPEED.QUICK) scores.direct_list += 1;
    if (moveInReady) scores.direct_list += 8;
    if (
      a.updates === UPDATES.TOP_OF_MARKET ||
      a.updates === UPDATES.UPDATED_RECENT
    )
      scores.direct_list += 3;
    scores.direct_list += w(PRIORITY.MAX_PRICE) * 0.7;
    if (avoidHassle1or2) scores.direct_list -= 9;
    if (avoidSet.has(AVOID.SHOWINGS)) scores.direct_list -= 5;
    if (avoidSet.has(AVOID.NEGOTIATIONS)) scores.direct_list -= 5;
  }

  // PRICE LAUNCH
  if (scores.price_launch !== undefined) {
    if (timePlenty) scores.price_launch += 10;
    if (needsWork) scores.price_launch += 10;
    scores.price_launch += w(PRIORITY.MAX_PRICE) * 0.9;
    scores.price_launch += w(PRIORITY.AVOID_REPAIRS) * 0.5;
    if (sellFast1or2) scores.price_launch -= 4;
  }

  // UPLIST (secondary-only)
  if (scores.uplist !== undefined) {
    scores.uplist += w(PRIORITY.AVOID_HASSLE) * 1.0;
    scores.uplist += w(PRIORITY.MAX_PRICE) * 0.3;
    if (a.speed === SPEED.QUICK) scores.uplist += 2;
    if (timePlenty) scores.uplist += 3;
    if (avoidSet.has(AVOID.NEGOTIATIONS)) scores.uplist += 3;
    if (avoidSet.has(AVOID.SHOWINGS)) scores.uplist += 2;
  }

  // SELLER FINANCE (secondary-only, always last)
  if (scores.seller_finance !== undefined) {
    scores.seller_finance += w(PRIORITY.MAX_PRICE) * 0.8;
    if (sellFast1or2) scores.seller_finance -= 12;
    if (finStart1or2) scores.seller_finance -= 10;
    if (a.speed === SPEED.VERY_FAST) scores.seller_finance -= 6;
    scores.seller_finance -= 3;
    if (maxPriceRank === 1 || maxPriceRank === 2) scores.seller_finance += 1;
  }

  // Tie-breaker nudge
  for (const opt of eligible) {
    scores[opt] +=
      (SIMPLICITY_ORDER.length - SIMPLICITY_ORDER.indexOf(opt)) * 0.001;
  }

  return scores;
}

// -------------------------
// Overrides
// -------------------------
function computeBestOverride(
  a: Answers,
  eligible: OptionKey[]
): OptionKey | null {
  const speedUnder30 = a.speed === SPEED.VERY_FAST || a.speed === SPEED.FAST;
  if (!speedUnder30) return null;

  if (a.ranks[PRIORITY.MAX_PRICE] === 1 && eligible.includes("equity_bridge"))
    return "equity_bridge";
  if (eligible.includes("cash")) return "cash";
  if (eligible.includes("equity_bridge")) return "equity_bridge";
  return null;
}

// -------------------------
// Seller Finance Gating
// -------------------------
function sellerFinanceAllowed(a: Answers): boolean {
  const maxPriceOk =
    a.ranks[PRIORITY.MAX_PRICE] === 1 || a.ranks[PRIORITY.MAX_PRICE] === 2;
  const needsCashSignals =
    a.ranks[PRIORITY.SELL_FAST] === 1 ||
    a.ranks[PRIORITY.SELL_FAST] === 2 ||
    a.ranks[PRIORITY.FIN_FRESH_START] === 1 ||
    a.ranks[PRIORITY.FIN_FRESH_START] === 2;
  return maxPriceOk && !needsCashSignals;
}

// -------------------------
// Helpers
// -------------------------
function pickBestByScore(
  scores: Record<OptionKey, number>,
  eligible: OptionKey[]
): OptionKey {
  return eligible
    .slice()
    .sort((a, b) => compareOptionsByScoreThenSimplicity(scores, a, b))[0];
}

function compareOptionsByScoreThenSimplicity(
  scores: Record<OptionKey, number>,
  a: OptionKey,
  b: OptionKey
): number {
  const sa = scores[a] ?? -Infinity;
  const sb = scores[b] ?? -Infinity;
  if (sb !== sa) return sb - sa;
  return SIMPLICITY_ORDER.indexOf(a) - SIMPLICITY_ORDER.indexOf(b);
}

function moveToEndIfPresent(arr: OptionKey[], item: OptionKey): OptionKey[] {
  const out = arr.filter((x) => x !== item);
  if (arr.includes(item)) out.push(item);
  return out;
}

// -------------------------
// Card Metadata (for UI)
// -------------------------
export type OptionCard = {
  key: OptionKey;
  title: string;
  subtitle: string;
  bullets: string[];
  badge?: string;
  learnMoreUrl?: string;
};

export const OPTION_CARDS: Record<OptionKey, Omit<OptionCard, "key">> = {
  cash: {
    title: "Off-Market Cash",
    subtitle: "Fastest and easiest sale",
    bullets: [
      "Fast closing",
      "No repairs or clean out required",
      "No showings or negotiations",
    ],
    learnMoreUrl: "https://metroplexhomebuyers.com",
  },
  equity_bridge: {
    title: "Equity Bridge",
    subtitle: "Lose the payment while it sells",
    bullets: [
      "Fast closing",
      "No showings or negotiations",
      "More money than cash offers",
    ],
    badge: "See if you qualify",
    learnMoreUrl: "/solutions/equity-bridge",
  },
  traditional: {
    title: "Professional Listing",
    subtitle: "Maximum MLS exposure",
    bullets: [
      "Maximum MLS exposure to qualified buyers",
      "Professionally priced and marketed",
      "Ideal for move-in ready homes",
    ],
    learnMoreUrl: "/our-team",
  },
  direct_list: {
    title: "Direct List (Flat Fee MLS)",
    subtitle: "List your home on the MLS while saving on listing fees",
    bullets: [
      "Full MLS exposure",
      "Step-by-step platform guidance",
      "Keep more of your equity",
    ],
    learnMoreUrl: "/direct-list",
  },
  price_launch: {
    title: "Price Launch",
    subtitle: "We handle the renovations so you can sell for top dollar",
    bullets: [
      "No upfront costs or out-of-pocket expenses",
      "Professionally prepared to attract top-dollar offers",
      "Ideal when maximizing price matters more than speed",
    ],
    learnMoreUrl: "/solutions/price-launch",
  },
  uplist: {
    title: "Uplist (Novation)",
    subtitle: "Hands-off selling without the hassle",
    bullets: [
      "Less hassle than traditional listing",
      "More than typical cash offers",
      "Let us get you more without the hassle",
    ],
    learnMoreUrl: "/solutions/uplist",
  },
  seller_finance: {
    title: "Seller Finance",
    subtitle: "Highest price potential, paid over time",
    bullets: [
      "Become the bank",
      "Fast closing",
      "Make more from your home",
    ],
    learnMoreUrl: "/solutions/seller-finance",
  },
};

// Helper to build a full card from a key
export function buildOptionCard(key: OptionKey): OptionCard {
  return { key, ...OPTION_CARDS[key] };
}
