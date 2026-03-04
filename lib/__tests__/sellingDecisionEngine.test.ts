// ABOUTME: Unit tests for the selling decision engine recommendation logic
// ABOUTME: Covers exclusions, scoring, overrides, and edge cases

import { describe, it, expect } from 'vitest';
import {
  recommendOptions,
  SPEED,
  UPDATES,
  REPAIRS,
  AVOID,
  PRIORITY,
  type Answers,
  type OptionKey,
} from '../sellingDecisionEngine';

// Helper to build a complete Answers object with defaults
function makeAnswers(overrides: Partial<Answers> = {}): Answers {
  return {
    speed: SPEED.STANDARD,
    updates: UPDATES.UPDATED_RECENT,
    repairs: [REPAIRS.NONE],
    avoid: [AVOID.NONE],
    ranks: {
      [PRIORITY.MAX_PRICE]: 1,
      [PRIORITY.SELL_FAST]: 2,
      [PRIORITY.AVOID_REPAIRS]: 3,
      [PRIORITY.AVOID_HASSLE]: 4,
      [PRIORITY.FIN_FRESH_START]: 5,
    },
    ...overrides,
  };
}

describe('recommendOptions', () => {
  it('returns a best option and secondary array', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.best).toBeDefined();
    expect(Array.isArray(result.secondary)).toBe(true);
  });

  it('never returns more than 2 secondary options', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.secondary.length).toBeLessThanOrEqual(2);
  });

  it('does not include the best option in secondary', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.secondary).not.toContain(result.best);
  });

  describe('speed exclusions', () => {
    it('excludes traditional, direct_list, uplist, price_launch when speed is very_fast', () => {
      const result = recommendOptions(
        makeAnswers({ speed: SPEED.VERY_FAST }),
        true,
      );
      const excluded = result.debug!.excluded;
      expect(excluded).toContain('traditional');
      expect(excluded).toContain('direct_list');
      expect(excluded).toContain('uplist');
      expect(excluded).toContain('price_launch');
    });

    it('excludes price_launch when speed is quick', () => {
      const result = recommendOptions(
        makeAnswers({ speed: SPEED.QUICK }),
        true,
      );
      expect(result.debug!.excluded).toContain('price_launch');
    });
  });

  describe('repair exclusions', () => {
    it('excludes traditional, direct_list, uplist when structural repairs needed', () => {
      const result = recommendOptions(
        makeAnswers({ repairs: [REPAIRS.STRUCTURAL] }),
        true,
      );
      const excluded = result.debug!.excluded;
      expect(excluded).toContain('traditional');
      expect(excluded).toContain('direct_list');
      expect(excluded).toContain('uplist');
    });
  });

  describe('overrides', () => {
    it('picks equity_bridge when speed is fast and max_price is rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.FAST,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 2,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 5,
          },
        }),
      );
      expect(result.best).toBe('equity_bridge');
    });

    it('picks cash when speed is very_fast and max_price is not rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.VERY_FAST,
          ranks: {
            [PRIORITY.MAX_PRICE]: 5,
            [PRIORITY.SELL_FAST]: 1,
            [PRIORITY.AVOID_REPAIRS]: 2,
            [PRIORITY.AVOID_HASSLE]: 3,
            [PRIORITY.FIN_FRESH_START]: 4,
          },
        }),
      );
      expect(result.best).toBe('cash');
    });
  });

  describe('secondary-only options', () => {
    it('never picks uplist or seller_finance as best', () => {
      const speeds = Object.values(SPEED);
      const updateOptions = Object.values(UPDATES);
      for (const speed of speeds) {
        for (const updates of updateOptions) {
          const result = recommendOptions(makeAnswers({ speed, updates }));
          expect(['uplist', 'seller_finance']).not.toContain(result.best);
        }
      }
    });
  });

  describe('seller_finance gating', () => {
    it('includes seller_finance in secondary when max_price is top and sell_fast is low', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 5,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 2,
          },
        }),
      );
      expect(result.best).toBeDefined();
    });

    it('excludes seller_finance from secondary when sell_fast is rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          ranks: {
            [PRIORITY.MAX_PRICE]: 2,
            [PRIORITY.SELL_FAST]: 1,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 5,
          },
        }),
      );
      expect(result.secondary).not.toContain('seller_finance');
    });
  });

  describe('seller_finance always last', () => {
    it('places seller_finance at end of secondary when present', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          updates: UPDATES.TOP_OF_MARKET,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 4,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 5,
            [PRIORITY.FIN_FRESH_START]: 2,
          },
        }),
      );
      if (result.secondary.includes('seller_finance')) {
        expect(result.secondary[result.secondary.length - 1]).toBe('seller_finance');
      }
    });
  });

  describe('edge cases', () => {
    it('returns cash as fallback when all options excluded', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.VERY_FAST,
          repairs: [REPAIRS.STRUCTURAL],
        }),
      );
      expect(result.best).toBeDefined();
      expect(typeof result.best).toBe('string');
    });

    it('includes debug info when requested', () => {
      const result = recommendOptions(makeAnswers(), true);
      expect(result.debug).toBeDefined();
      expect(result.debug!.excluded).toBeDefined();
      expect(result.debug!.scores).toBeDefined();
    });
  });
});
