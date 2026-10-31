/**
 * @fileoverview Strict domain models and type definitions for SpendIntruders.
 * Pure TypeScript primitives with zero runtime dependencies.
 * @module core/engine/types
 */

/**
 * Standardized billing frequencies for recurring subscriptions and bank transactions.
 */
export type BillingFrequency = 'monthly' | 'annual' | 'weekly' | 'one_time';

/**
 * Financial anomaly classifications detected by the rules engine.
 */
export type AnomalyType = 
  | 'zombie_sub' 
  | 'duplicate' 
  | 'price_creep' 
  | 'trial_expiry' 
  | 'normal';

/**
 * Combat decision actions available in the 3-way arcade shooter:
 * - `KILL`: Terminate subscription / dispute charge
 * - `KEEP`: Approve expense / retain service
 * - `TAX`: Flag as tax-deductible business expense
 */
export type SwipeDecision = 'KILL' | 'KEEP' | 'TAX';

/**
 * Represents a parsed bank statement entry or subscription target.
 */
export interface Transaction {
  /** Unique transaction identifier */
  id: string;
  /** Merchant or service name (e.g., Netflix, AWS) */
  merchant: string;
  /** Numerical transaction amount */
  amount: number;
  /** ISO date string or formatted date */
  date: string;
  /** Financial category classification */
  category: string;
  /** Recurrence billing frequency */
  frequency: BillingFrequency;
  /** Detected anomaly type */
  anomalyType: AnomalyType;
  /** Visual badge text indicating danger/leak level */
  anomalyBadge?: string;
  /** Humorous AI roast exposing wasteful spending */
  roast: string;
  /** Human-readable usage latency description */
  lastActiveDescription?: string;
  /** Direct URL to cancellation/management portal */
  portalUrl?: string;
  /** Direct customer support/dispute email */
  supportEmail?: string;
  /** Flag denoting whether transaction is recurring */
  isRecurring: boolean;
  /** Optional notes or additional context */
  notes?: string;
}

/**
 * Represents a transaction processed during an arcade session with player metadata.
 */
export interface SwipedTransaction extends Transaction {
  /** Combat decision applied by the user */
  decision: SwipeDecision;
  /** Epoch timestamp when decision was registered */
  decisionTimestamp: number;
  /** Reaction time in milliseconds */
  decisionDurationMs: number;
  /** Active combo multiplier when decision was executed */
  streakMultiplierAtDecision: number;
}

/**
 * Aggregated scorecard statistics computed at game completion.
 */
export interface GameStats {
  /** Total number of transactions audited */
  totalProcessed: number;
  /** Total subscriptions terminated */
  killedCount: number;
  /** Total necessary expenses retained */
  keptCount: number;
  /** Total business expenses marked for tax write-off */
  taxCount: number;
  /** Total projected annual savings in currency units */
  annualSavings: number;
  /** Total projected monthly savings in currency units */
  monthlySavings: number;
  /** Total tax-deductible business expenses identified */
  taxDeductionsTotal: number;
  /** Total duplicate billing charges flagged for refund */
  duplicateDisputeTotal: number;
  /** Final calculated arcade game score */
  finalScore: number;
  /** Maximum consecutive correct decisions streak */
  highestStreak: number;
  /** Remaining game timer in seconds */
  timeRemainingSec: number;
}

/**
 * Formal cancellation notice metadata compliant with FTC & RBI rules.
 */
export interface CancellationDraft {
  /** Linked transaction identifier */
  transactionId: string;
  /** Service merchant name */
  merchant: string;
  /** Recurring billing amount */
  amount: number;
  /** Recurrence frequency */
  frequency: BillingFrequency;
  /** Computed annual cost burden */
  annualCost: number;
  /** Customer support email */
  supportEmail: string;
  /** Self-service cancellation portal URL */
  portalUrl?: string;
  /** Email subject line */
  emailSubject: string;
  /** Full cancellation notice email body */
  emailBody: string;
}

/**
 * Bank transaction dispute notice metadata.
 */
export interface DisputeDraft {
  /** Disputed transaction identifier */
  transactionId: string;
  /** Merchant / payee entity */
  merchant: string;
  /** Disputed amount */
  amount: number;
  /** Transaction date */
  date: string;
  /** Reason for dispute */
  reason: string;
  /** Legal dispute notice letter text */
  formalLetter: string;
}

/**
 * IRS Schedule C / Sec 44ADA tax deduction export row.
 */
export interface TaxDeductionRow {
  date: string;
  merchant: string;
  amount: string;
  scheduleCCategory: string;
  businessPurpose: string;
  notes: string;
}
