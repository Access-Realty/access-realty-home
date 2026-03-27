// ABOUTME: Unit tests for quiz-to-engine answer mapping
// ABOUTME: Tests mapQuizAnswersToEngine and extractQuizAnswers

import { describe, it, expect } from "vitest";
import {
  mapQuizAnswersToEngine,
  extractQuizAnswers,
  type QuizAnswers,
} from "../sellingPlanMapper";
import {
  SPEED,
  UPDATES,
  REPAIRS,
  AVOID,
  PRIORITY,
} from "../sellingDecisionEngine";

// Helper to build a complete QuizAnswers with defaults
function makeQuiz(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return {
    timeline: "standard",
    updates: "nice-not-updated",
    repairs: ["minor"],
    avoid: ["none"],
    priorities: ["price", "speed", "repairs", "convenience", "financial-freedom"],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// mapQuizAnswersToEngine - speed mapping
// ---------------------------------------------------------------------------
describe("mapQuizAnswersToEngine", () => {
  describe("speed mapping", () => {
    it('maps "very-fast" to SPEED.VERY_FAST', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ timeline: "very-fast" }));
      expect(result.speed).toBe(SPEED.VERY_FAST);
    });

    it('maps "fast" to SPEED.FAST', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ timeline: "fast" }));
      expect(result.speed).toBe(SPEED.FAST);
    });

    it('maps "quick" to SPEED.QUICK', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ timeline: "quick" }));
      expect(result.speed).toBe(SPEED.QUICK);
    });

    it('maps "standard" to SPEED.STANDARD', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ timeline: "standard" }));
      expect(result.speed).toBe(SPEED.STANDARD);
    });

    it('maps "no-hurry" to SPEED.NO_HURRY', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ timeline: "no-hurry" }));
      expect(result.speed).toBe(SPEED.NO_HURRY);
    });

    it("falls back to SPEED.STANDARD for unknown timeline", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ timeline: "unknown-value" }),
      );
      expect(result.speed).toBe(SPEED.STANDARD);
    });
  });

  // ---------------------------------------------------------------------------
  // updates mapping
  // ---------------------------------------------------------------------------
  describe("updates mapping", () => {
    it('maps "top-market" to UPDATES.TOP_OF_MARKET', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ updates: "top-market" }));
      expect(result.updates).toBe(UPDATES.TOP_OF_MARKET);
    });

    it('maps "semi-recent" to UPDATES.UPDATED_RECENT', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ updates: "semi-recent" }));
      expect(result.updates).toBe(UPDATES.UPDATED_RECENT);
    });

    it('maps "dated" to UPDATES.DATED_FULL_COSMETIC', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ updates: "dated" }));
      expect(result.updates).toBe(UPDATES.DATED_FULL_COSMETIC);
    });

    it("falls back to UPDATES.NICE_NOT_UPDATED for unknown updates", () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ updates: "bogus" }));
      expect(result.updates).toBe(UPDATES.NICE_NOT_UPDATED);
    });
  });

  // ---------------------------------------------------------------------------
  // repairs mapping (multi-select)
  // ---------------------------------------------------------------------------
  describe("repairs mapping", () => {
    it("maps known repair IDs correctly", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ repairs: ["major-structural", "big-ticket"] }),
      );
      expect(result.repairs).toContain(REPAIRS.STRUCTURAL);
      expect(result.repairs).toContain(REPAIRS.BIG_TICKET);
      expect(result.repairs).toHaveLength(2);
    });

    it('maps "none" to REPAIRS.NONE', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ repairs: ["none"] }));
      expect(result.repairs).toEqual([REPAIRS.NONE]);
    });

    it("falls back to [REPAIRS.NONE] for empty array", () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ repairs: [] }));
      expect(result.repairs).toEqual([REPAIRS.NONE]);
    });

    it("falls back to [REPAIRS.NONE] when all IDs are unknown", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ repairs: ["unknown-repair"] }),
      );
      expect(result.repairs).toEqual([REPAIRS.NONE]);
    });
  });

  // ---------------------------------------------------------------------------
  // avoid mapping (multi-select)
  // ---------------------------------------------------------------------------
  describe("avoid mapping", () => {
    it("maps known avoid IDs correctly", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ avoid: ["showings", "negotiations"] }),
      );
      expect(result.avoid).toContain(AVOID.SHOWINGS);
      expect(result.avoid).toContain(AVOID.NEGOTIATIONS);
      expect(result.avoid).toHaveLength(2);
    });

    it('maps "time" to AVOID.TIME', () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ avoid: ["time"] }));
      expect(result.avoid).toEqual([AVOID.TIME]);
    });

    it("falls back to [AVOID.NONE] for empty array", () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ avoid: [] }));
      expect(result.avoid).toEqual([AVOID.NONE]);
    });

    it("falls back to [AVOID.NONE] when all IDs are unknown", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ avoid: ["unknown-avoid"] }),
      );
      expect(result.avoid).toEqual([AVOID.NONE]);
    });
  });

  // ---------------------------------------------------------------------------
  // priority ranking
  // ---------------------------------------------------------------------------
  describe("priority ranking", () => {
    it("maps ranked priorities to correct positions", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({
          priorities: [
            "price",
            "speed",
            "repairs",
            "convenience",
            "financial-freedom",
          ],
        }),
      );
      expect(result.ranks[PRIORITY.MAX_PRICE]).toBe(1);
      expect(result.ranks[PRIORITY.SELL_FAST]).toBe(2);
      expect(result.ranks[PRIORITY.AVOID_REPAIRS]).toBe(3);
      expect(result.ranks[PRIORITY.AVOID_HASSLE]).toBe(4);
      expect(result.ranks[PRIORITY.FIN_FRESH_START]).toBe(5);
    });

    it("assigns fallback ranks to missing priorities", () => {
      // Only provide 2 priorities - remaining 3 should get auto-assigned
      const result = mapQuizAnswersToEngine(
        makeQuiz({ priorities: ["price", "speed"] }),
      );
      expect(result.ranks[PRIORITY.MAX_PRICE]).toBe(1);
      expect(result.ranks[PRIORITY.SELL_FAST]).toBe(2);
      // Remaining priorities get ranks 3, 4, 5 (order is implementation-defined)
      const remaining = [
        result.ranks[PRIORITY.AVOID_REPAIRS],
        result.ranks[PRIORITY.AVOID_HASSLE],
        result.ranks[PRIORITY.FIN_FRESH_START],
      ];
      expect(remaining).toContain(3);
      expect(remaining).toContain(4);
      expect(remaining).toContain(5);
    });

    it("assigns all fallback ranks when priorities array is empty", () => {
      const result = mapQuizAnswersToEngine(makeQuiz({ priorities: [] }));
      // All 5 priorities should have a rank assigned
      const allPriorities = Object.values(PRIORITY);
      for (const p of allPriorities) {
        expect(result.ranks[p]).toBeDefined();
        expect(result.ranks[p]).toBeGreaterThanOrEqual(1);
      }
    });

    it("handles unknown priority IDs gracefully", () => {
      const result = mapQuizAnswersToEngine(
        makeQuiz({ priorities: ["bogus-id", "price"] }),
      );
      // "bogus-id" is skipped, "price" gets rank 2 (index 1 + 1)
      expect(result.ranks[PRIORITY.MAX_PRICE]).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // full integration
  // ---------------------------------------------------------------------------
  describe("full mapping", () => {
    it("returns a complete Answers object", () => {
      const result = mapQuizAnswersToEngine(makeQuiz());
      expect(result).toHaveProperty("speed");
      expect(result).toHaveProperty("updates");
      expect(result).toHaveProperty("repairs");
      expect(result).toHaveProperty("avoid");
      expect(result).toHaveProperty("ranks");
    });
  });
});

// ---------------------------------------------------------------------------
// extractQuizAnswers
// ---------------------------------------------------------------------------
describe("extractQuizAnswers", () => {
  it("extracts quiz answers from component state", () => {
    const answers: Record<string, string | string[]> = {
      timeline: "fast",
      updates: "top-market",
      repairs: ["minor", "none"],
      avoid: ["showings"],
    };
    const priorityRanking = ["price", "speed", "repairs"];

    const result = extractQuizAnswers(answers, priorityRanking);

    expect(result.timeline).toBe("fast");
    expect(result.updates).toBe("top-market");
    expect(result.repairs).toEqual(["minor", "none"]);
    expect(result.avoid).toEqual(["showings"]);
    expect(result.priorities).toEqual(["price", "speed", "repairs"]);
  });

  it("defaults repairs to empty array when missing", () => {
    const answers: Record<string, string | string[]> = {
      timeline: "standard",
      updates: "nice-not-updated",
    };
    const result = extractQuizAnswers(answers, []);
    expect(result.repairs).toEqual([]);
  });

  it("defaults avoid to empty array when missing", () => {
    const answers: Record<string, string | string[]> = {
      timeline: "standard",
      updates: "nice-not-updated",
    };
    const result = extractQuizAnswers(answers, []);
    expect(result.avoid).toEqual([]);
  });

  it("passes priorityRanking through as priorities", () => {
    const ranking = ["convenience", "financial-freedom"];
    const result = extractQuizAnswers(
      { timeline: "quick", updates: "dated", repairs: [], avoid: [] },
      ranking,
    );
    expect(result.priorities).toBe(ranking);
  });
});
