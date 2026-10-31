/**
 * Strict TypeScript domain models for SpendSwipe
 * Zero React dependencies allowed in this file.
 */

export type BillingFrequency = 'monthly' | 'annual' | 'weekly' | 'one_time';

export type AnomalyType = 
  | 'zombie_sub' 
  | 'duplicate' 
  | 'price_creep' 
  | 'trial_expiry' 
  | 'normal';

export type SwipeDecision = 'KILL' | 'KEEP' | 'TAX';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  frequency: BillingFrequency;
  anomalyType: AnomalyType;
  anomalyBadge?: string;
  roast: string;
  lastActiveDescription?: string;
  portalUrl?: string;
  supportEmail?: string;
  isRecurring: boolean;
  notes?: string;
}

export interface SwipedTransaction extends Transaction {
  decision: SwipeDecision;
  decisionTimestamp: number;
  decisionDurationMs: number;
  streakMultiplierAtDecision: number;
}

export interface GameStats {
  totalProcessed: number;
  killedCount: number;
  keptCount: number;
  taxCount: number;
  annualSavings: number;
  monthlySavings: number;
  taxDeductionsTotal: number;
  duplicateDisputeTotal: number;
  finalScore: number;
  highestStreak: number;
  timeRemainingSec: number;
}

export interface CancellationDraft {
  transactionId: string;
  merchant: string;
  amount: number;
  frequency: BillingFrequency;
  annualCost: number;
  supportEmail: string;
  portalUrl?: string;
  emailSubject: string;
  emailBody: string;
}

export interface DisputeDraft {
  transactionId: string;
  merchant: string;
  amount: number;
  date: string;
  reason: string;
  formalLetter: string;
}

export interface TaxDeductionRow {
  date: string;
  merchant: string;
  amount: string;
  scheduleCCategory: string;
  businessPurpose: string;
  notes: string;
}
