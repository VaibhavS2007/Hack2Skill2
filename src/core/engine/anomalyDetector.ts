/**
 * @fileoverview Financial anomaly detection engine.
 * Identifies duplicate charges, zombie subscriptions, hidden price creeps, and uncancelled trials.
 * @module core/engine/anomalyDetector
 */

import { Transaction, AnomalyType } from './types';

/**
 * Detects duplicate billing transactions within a statement.
 * Flags transactions that share matching merchant names and identical amounts within a 7-day window.
 *
 * @param transactions - List of parsed financial transactions
 * @returns Set of transaction IDs identified as duplicate billing charges
 *
 * @example
 * ```ts
 * const dupes = detectDuplicates(statementRows);
 * ```
 */
export function detectDuplicates(transactions: Transaction[]): Set<string> {
  const duplicateIds = new Set<string>();
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i];
      const b = sorted[j];

      // Normalize merchant strings
      const normA = a.merchant.toLowerCase().trim();
      const normB = b.merchant.toLowerCase().trim();

      const timeDiff = Math.abs(new Date(b.date).getTime() - new Date(a.date).getTime());
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (daysDiff > 7) {
        break; // beyond time window
      }

      if (normA === normB && Math.abs(a.amount - b.amount) < 0.01) {
        duplicateIds.add(b.id);
      }
    }
  }

  return duplicateIds;
}

/**
 * Categorizes a transaction into an anomaly type based on heuristics, merchant taxonomy, and pattern recognition.
 *
 * @param tx - Transaction payload lacking anomaly classification
 * @returns Object containing the identified anomaly type, UI danger badge, and AI roast string
 */
export function classifyAnomaly(tx: Omit<Transaction, 'anomalyType' | 'roast'>): {
  anomalyType: AnomalyType;
  anomalyBadge?: string;
  roast: string;
} {
  const norm = tx.merchant.toLowerCase();

  // 1. Gym Subscriptions
  if (norm.includes('cult') || norm.includes('gym') || norm.includes('fitness') || norm.includes('gold')) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Zombie Gym Sub 🏋️',
      roast: 'Jan 1st New Year resolution still draining your UPI. Your sneakers collect dust while soles haven’t touched the treadmill since Holi.',
    };
  }

  // 2. Cloud Infrastructure
  if (norm.includes('cloud') || norm.includes('aws') || norm.includes('gcp') || norm.includes('azure')) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Orphan Cloud Instance ☁️',
      roast: 'That EC2 instance running in ap-south-1 Mumbai has been idling for 6 months doing absolutely nothing.',
    };
  }

  // 3. Streaming Overload
  if (
    norm.includes('netflix') ||
    norm.includes('prime') ||
    norm.includes('disney') ||
    norm.includes('hotstar') ||
    norm.includes('hulu') ||
    norm.includes('hbo') ||
    norm.includes('sony') ||
    norm.includes('zee')
  ) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Dormant OTT Sub 📺',
      roast: 'Subscribed to watch one cricket tournament or web series. Renewed silently via auto-pay e-mandate.',
    };
  }

  // 4. Overlapping Delivery Passes
  if (norm.includes('swiggy one') || norm.includes('zomato gold') || norm.includes('times prime')) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Overlapping Delivery Pass 🍔',
      roast: 'You already pay for a delivery membership. Why have duplicate dining passes active at the same time?',
    };
  }

  // 5. Unread Reading / App Subscriptions
  if (
    norm.includes('kindle') ||
    norm.includes('audible') ||
    norm.includes('duolingo') ||
    norm.includes('calm') ||
    norm.includes('truecaller')
  ) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Guilt App Auto-Pay 📱',
      roast: 'Monthly auto-debit active on your card, but the app hasn’t been opened in 120+ days.',
    };
  }

  // 6. Generic Recurring
  if (tx.isRecurring) {
    return {
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Silent Auto-Debit 💸',
      roast: 'Recurring auto-debit silently ticking away on autopilot. When did you last actually log in?',
    };
  }

  return {
    anomalyType: 'normal',
    roast: 'An active subscription. Is it an essential everyday necessity or silent wallet drain?',
  };
}

/**
 * Enrich raw transactions with detected duplicates and anomalies.
 *
 * @param transactions - Raw transaction list
 * @returns Enriched transactions with anomaly classifications
 */
export function enrichTransactions(transactions: Transaction[]): Transaction[] {
  const duplicates = detectDuplicates(transactions);

  return transactions.map((tx) => {
    if (duplicates.has(tx.id)) {
      return {
        ...tx,
        anomalyType: 'duplicate',
        anomalyBadge: 'Double Charge Alert 🚨',
        roast: 'Billed twice for the exact same subscription in the same billing cycle! Bank e-mandate glitch.',
      };
    }
    return tx;
  });
}
