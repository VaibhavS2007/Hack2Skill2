/**
 * @fileoverview Financial calculations and gamified arcade score engine.
 * @module core/engine/savingsCalculator
 */

import { SwipedTransaction, GameStats, BillingFrequency } from './types';

/**
 * Normalizes an expense amount into its annual cost.
 *
 * @param amount - Numerical transaction amount
 * @param frequency - Billing frequency schedule
 * @returns Annualized amount in base currency
 */
export function calculateAnnualCost(amount: number, frequency: BillingFrequency): number {
  switch (frequency) {
    case 'monthly':
      return amount * 12;
    case 'weekly':
      return amount * 52;
    case 'annual':
      return amount;
    case 'one_time':
    default:
      return amount;
  }
}

/**
 * Normalizes an expense amount into its monthly cost.
 *
 * @param amount - Numerical transaction amount
 * @param frequency - Billing frequency schedule
 * @returns Equivalent monthly cost in base currency
 */
export function calculateMonthlyCost(amount: number, frequency: BillingFrequency): number {
  switch (frequency) {
    case 'monthly':
      return amount;
    case 'weekly':
      return (amount * 52) / 12;
    case 'annual':
      return amount / 12;
    case 'one_time':
    default:
      return 0; // One-time charges don't recur monthly
  }
}

/**
 * Computes the combo multiplier based on current streak count.
 * Streak thresholds:
 * 0 - 2: 1x
 * 3 - 5: 2x
 * 6 - 9: 3x
 * 10+: 5x (MAX COMBO)
 *
 * @param streak - Consecutive non-idle combat actions
 * @returns Multiplier factor (1, 2, 3, or 5)
 */
export function getMultiplier(streak: number): number {
  if (streak >= 10) return 5;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

/**
 * Computes arcade points for a single decision.
 * Faster decisions under 2.5s award speed bonus.
 *
 * @param durationMs - Time elapsed from card presentation to user decision
 * @param currentStreak - Active combo streak prior to decision
 * @returns Object containing awarded points, updated streak, and multiplier factor
 */
export function calculateScoreForDecision(
  durationMs: number,
  currentStreak: number
): { points: number; newStreak: number; multiplier: number } {
  const isFast = durationMs <= 2500;
  const newStreak = isFast ? currentStreak + 1 : 1;
  const multiplier = getMultiplier(newStreak);

  const basePoints = 100;
  const speedBonus = isFast ? Math.max(0, Math.floor((2500 - durationMs) / 25)) : 0;
  const points = (basePoints + speedBonus) * multiplier;

  return { points, newStreak, multiplier };
}

/**
 * Aggregates all game statistics and financial savings from swiped transactions.
 *
 * @param swipedTransactions - Array of transactions processed during the arcade run
 * @param timeRemainingSec - Seconds left on clock at termination
 * @param highestStreak - Peak combo streak reached during play
 * @param accumulatedScore - Total score accumulated by the player
 * @returns Complete calculated scorecard metrics
 */
export function calculateGameStats(
  swipedTransactions: SwipedTransaction[],
  timeRemainingSec: number,
  highestStreak: number,
  accumulatedScore: number
): GameStats {
  let annualSavings = 0;
  let monthlySavings = 0;
  let taxDeductionsTotal = 0;
  let duplicateDisputeTotal = 0;
  let killedCount = 0;
  let keptCount = 0;
  let taxCount = 0;

  for (const item of swipedTransactions) {
    if (item.decision === 'KILL') {
      killedCount++;
      if (item.anomalyType === 'duplicate') {
        duplicateDisputeTotal += item.amount;
        annualSavings += item.amount;
      } else {
        annualSavings += calculateAnnualCost(item.amount, item.frequency);
        monthlySavings += calculateMonthlyCost(item.amount, item.frequency);
      }
    } else if (item.decision === 'KEEP') {
      keptCount++;
    } else if (item.decision === 'TAX') {
      taxCount++;
      taxDeductionsTotal += item.amount;
    }
  }

  return {
    totalProcessed: swipedTransactions.length,
    killedCount,
    keptCount,
    taxCount,
    annualSavings: Math.round(annualSavings * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    taxDeductionsTotal: Math.round(taxDeductionsTotal * 100) / 100,
    duplicateDisputeTotal: Math.round(duplicateDisputeTotal * 100) / 100,
    finalScore: accumulatedScore,
    highestStreak,
    timeRemainingSec,
  };
}
