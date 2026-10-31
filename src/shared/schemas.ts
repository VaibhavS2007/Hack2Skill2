import { z } from 'zod';

/**
 * Zod validation schema for individual transaction / file metadata.
 * Caps string lengths and validates numeric limits to prevent injection or buffer exploits.
 */
export const TransactionMetaSchema = z.object({
  id: z.string().min(1).max(128),
  merchant: z.string().min(1).max(256),
  amount: z.number().nonnegative(),
  date: z.string().min(1).max(32),
  category: z.string().min(1).max(64),
  frequency: z.enum(['monthly', 'annual', 'weekly', 'one_time']),
  isRecurring: z.boolean().default(true),
});

export const VerdictSchema = z.enum(['junk', 'maybe', 'keep']);

export const AnalysisSchema = z.object({
  id: z.string().min(1).max(128),
  verdict: VerdictSchema,
  confidence: z.number().min(0).max(1),
  reason: z.string().max(160),
  category: z.string().max(64),
});

/**
 * Batched analysis request schema enforcing a maximum of 25 items per AI call.
 */
export const BatchAnalyzeSchema = z.object({
  items: z.array(TransactionMetaSchema).min(1).max(25),
});

export type TransactionMetaInput = z.infer<typeof TransactionMetaSchema>;
export type VerdictType = z.infer<typeof VerdictSchema>;
export type AnalysisOutput = z.infer<typeof AnalysisSchema>;
