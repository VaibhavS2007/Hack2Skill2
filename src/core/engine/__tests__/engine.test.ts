import { describe, it, expect } from 'vitest';
import {
  calculateAnnualCost,
  calculateMonthlyCost,
  getMultiplier,
  calculateScoreForDecision,
  calculateGameStats,
} from '../savingsCalculator';
import {
  detectDuplicates,
  classifyAnomaly,
  enrichTransactions,
} from '../anomalyDetector';
import {
  generateCancellationEmail,
  generateDisputeLetter,
} from '../documentGenerator';
import {
  sanitizeForCsv,
  mapToScheduleCCategory,
  buildTaxDeductionsCsv,
  parseBankCsv,
} from '../csvProcessor';
import {
  buildSpendingPrompt,
  generateFallbackReview,
  askGroqFinancialQuestion,
} from '../groqAdvisor';
import { Transaction, SwipedTransaction } from '../types';

describe('SpendSwipe Financial Engine Tests', () => {
  // 1. Annualization calculations
  describe('calculateAnnualCost', () => {
    it('calculates monthly costs annualized (* 12)', () => {
      expect(calculateAnnualCost(10, 'monthly')).toBe(120);
    });

    it('calculates weekly costs annualized (* 52)', () => {
      expect(calculateAnnualCost(10, 'weekly')).toBe(520);
    });

    it('returns original amount for annual or one_time', () => {
      expect(calculateAnnualCost(120, 'annual')).toBe(120);
      expect(calculateAnnualCost(50, 'one_time')).toBe(50);
    });
  });

  // 2. Monthly calculations
  describe('calculateMonthlyCost', () => {
    it('returns identical amount for monthly frequency', () => {
      expect(calculateMonthlyCost(35, 'monthly')).toBe(35);
    });

    it('returns zero for one_time payments', () => {
      expect(calculateMonthlyCost(100, 'one_time')).toBe(0);
    });

    it('converts annual payment to monthly divisor', () => {
      expect(calculateMonthlyCost(120, 'annual')).toBe(10);
    });
  });

  // 3. Arcade Combo Multipliers
  describe('getMultiplier', () => {
    it('evaluates streak milestones accurately', () => {
      expect(getMultiplier(0)).toBe(1);
      expect(getMultiplier(2)).toBe(1);
      expect(getMultiplier(3)).toBe(2);
      expect(getMultiplier(5)).toBe(2);
      expect(getMultiplier(6)).toBe(3);
      expect(getMultiplier(9)).toBe(3);
      expect(getMultiplier(10)).toBe(5);
      expect(getMultiplier(25)).toBe(5);
    });
  });

  // 4. Arcade Decision Scoring
  describe('calculateScoreForDecision', () => {
    it('awards bonus points and increments streak for fast decisions (<= 2500ms)', () => {
      const result = calculateScoreForDecision(1000, 2);
      expect(result.newStreak).toBe(3);
      expect(result.multiplier).toBe(2);
      expect(result.points).toBeGreaterThan(200);
    });

    it('resets streak to 1 for slow decisions (> 2500ms)', () => {
      const result = calculateScoreForDecision(3000, 5);
      expect(result.newStreak).toBe(1);
      expect(result.multiplier).toBe(1);
      expect(result.points).toBe(100);
    });
  });

  // 5. Anomaly & Duplicate Detection
  describe('detectDuplicates', () => {
    const baseTx: Transaction = {
      id: 'tx-1',
      merchant: 'Uber Eats',
      amount: 34.50,
      date: '2026-10-15',
      category: 'Food',
      frequency: 'one_time',
      anomalyType: 'normal',
      roast: '',
      isRecurring: false,
    };

    it('flags duplicate charge when merchant and amount match within 7 days', () => {
      const dupTx: Transaction = {
        ...baseTx,
        id: 'tx-2',
        date: '2026-10-16', // 1 day later
      };

      const duplicates = detectDuplicates([baseTx, dupTx]);
      expect(duplicates.has('tx-2')).toBe(true);
      expect(duplicates.has('tx-1')).toBe(false);
    });

    it('ignores transactions beyond the 7 day threshold', () => {
      const oldTx: Transaction = {
        ...baseTx,
        id: 'tx-3',
        date: '2026-10-25', // 10 days later
      };

      const duplicates = detectDuplicates([baseTx, oldTx]);
      expect(duplicates.size).toBe(0);
    });
  });

  // 6. Classification & Heuristics
  describe('classifyAnomaly', () => {
    it('identifies gym memberships as zombie subs with witty roast', () => {
      const anomaly = classifyAnomaly({
        id: 'test',
        merchant: 'Planet Fitness Gym',
        amount: 25,
        date: '2026-10-01',
        category: 'Health',
        frequency: 'monthly',
        isRecurring: true,
      });

      expect(anomaly.anomalyType).toBe('zombie_sub');
      expect(anomaly.anomalyBadge).toContain('Gym');
      expect(anomaly.roast).toContain('sneakers');
    });

    it('identifies cloud infrastructure instances as zombie subs', () => {
      const anomaly = classifyAnomaly({
        id: 'test-2',
        merchant: 'AWS Cloud Services',
        amount: 84.12,
        date: '2026-10-01',
        category: 'Tech',
        frequency: 'monthly',
        isRecurring: true,
      });

      expect(anomaly.anomalyType).toBe('zombie_sub');
      expect(anomaly.anomalyBadge).toContain('Cloud');
    });
  });

  // 7. Enriching Transactions
  describe('enrichTransactions', () => {
    it('decorates duplicate transactions with alert badges and custom roasts', () => {
      const txs: Transaction[] = [
        {
          id: 'a',
          merchant: 'DoorDash',
          amount: 28.90,
          date: '2026-10-02',
          category: 'Dining',
          frequency: 'one_time',
          anomalyType: 'normal',
          roast: 'Initial',
          isRecurring: false,
        },
        {
          id: 'b',
          merchant: 'DoorDash',
          amount: 28.90,
          date: '2026-10-03',
          category: 'Dining',
          frequency: 'one_time',
          anomalyType: 'normal',
          roast: 'Initial',
          isRecurring: false,
        },
      ];

      const enriched = enrichTransactions(txs);
      const duplicateItem = enriched.find((t) => t.id === 'b');
      expect(duplicateItem?.anomalyType).toBe('duplicate');
      expect(duplicateItem?.anomalyBadge).toContain('Double Charge Alert');
    });
  });

  // 8. Legal Document Generators
  describe('generateCancellationEmail', () => {
    it('generates FTC Click-to-Cancel and CCPA compliant cancellation notice', () => {
      const tx: Transaction = {
        id: 'tx-adobe',
        merchant: 'Adobe Creative Cloud',
        amount: 54.99,
        date: '2026-10-01',
        category: 'Software',
        frequency: 'monthly',
        anomalyType: 'zombie_sub',
        roast: 'Photoshop dust collector',
        isRecurring: true,
      };

      const email = generateCancellationEmail(tx);
      expect(email.merchant).toBe('Adobe Creative Cloud');
      expect(email.annualCost).toBe(659.88);
      expect(email.emailBody).toContain('Federal Trade Commission');
      expect(email.emailBody).toContain('Click-to-Cancel');
      expect(email.emailBody).toContain('California Business and Professions Code § 17600');
    });
  });

  // 9. Dispute Notice Generator
  describe('generateDisputeLetter', () => {
    it('cites Fair Credit Billing Act (FCBA) for disputed charges', () => {
      const tx: Transaction = {
        id: 'tx-dup',
        merchant: 'Uber Eats',
        amount: 42.10,
        date: '2026-10-10',
        category: 'Food',
        frequency: 'one_time',
        anomalyType: 'duplicate',
        roast: 'Double meal charge',
        isRecurring: false,
      };

      const dispute = generateDisputeLetter(tx);
      expect(dispute.merchant).toBe('Uber Eats');
      expect(dispute.formalLetter).toContain('Fair Credit Billing Act (15 U.S.C. § 1666)');
      expect(dispute.formalLetter).toContain('identical duplicate charge');
      expect(dispute.formalLetter).toContain('₹42.10');
    });
  });

  // 10. OWASP CSV Formula Injection Defense
  describe('sanitizeForCsv (Security Signal)', () => {
    it('neutralizes malicious formula injection triggers (=, +, -, @, \\t)', () => {
      expect(sanitizeForCsv('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
      expect(sanitizeForCsv('+cmd|"/c calc"!A0')).toBe('"\'+cmd|""/c calc""!A0"');
      expect(sanitizeForCsv('@DDE("cmd",,"calc")')).toBe('"\'@DDE(""cmd"",,""calc"")"');
      expect(sanitizeForCsv('-2+3')).toBe('"\'-2+3"');
    });

    it('safely handles standard strings and numbers', () => {
      expect(sanitizeForCsv('Figma Subscription')).toBe('"Figma Subscription"');
      expect(sanitizeForCsv(129.99)).toBe('"129.99"');
    });

    it('escapes internal quotes correctly', () => {
      expect(sanitizeForCsv('Acme "Pro" Plan')).toBe('"Acme ""Pro"" Plan"');
    });
  });

  // 11. IRS Schedule C Mapping
  describe('mapToScheduleCCategory', () => {
    it('maps tech tools to Line 18 Office Expense & Software', () => {
      expect(mapToScheduleCCategory('Tech', 'GitHub Copilot')).toBe(
        'Part II Line 18: Office Expense & Software'
      );
      expect(mapToScheduleCCategory('Dev', 'AWS Cloud Services')).toBe(
        'Part II Line 18: Office Expense & Software'
      );
    });

    it('maps meals to Line 24b 50% deduction', () => {
      expect(mapToScheduleCCategory('Meals', 'Business Lunch')).toBe(
        'Part II Line 24b: Deductible Business Meals (50%)'
      );
    });
  });

  // 12. buildTaxDeductionsCsv & CSV Parsing
  describe('buildTaxDeductionsCsv & parseBankCsv', () => {
    it('generates properly formatted and sanitized CSV with headers', () => {
      const txs: Transaction[] = [
        {
          id: '1',
          merchant: 'JetBrains IDE',
          amount: 149.0,
          date: '2026-01-15',
          category: 'Software',
          frequency: 'annual',
          anomalyType: 'normal',
          roast: 'Real code tool',
          isRecurring: true,
        },
      ];

      const csv = buildTaxDeductionsCsv(txs);
      expect(csv).toContain('"Date","Merchant","Amount (INR ₹)"');
      expect(csv).toContain('"JetBrains IDE"');
      expect(csv).toContain('Part II Line 18: Office Expense & Software');
    });

    it('parses raw bank statement CSV text correctly', () => {
      const rawCsv = `Date,Merchant,Amount,Category\n2026-09-01,Netflix,19.99,Entertainment\n2026-09-05,Gym,49.99,Fitness`;
      const parsed = parseBankCsv(rawCsv);
      expect(parsed.length).toBe(2);
      expect(parsed[0].merchant).toBe('Netflix');
      expect(parsed[0].amount).toBe(19.99);
      expect(parsed[1].merchant).toBe('Gym');
    });

    it('parses generated sample_bank_statement.csv with anomaly detection', () => {
      const fs = require('fs');
      const sampleCsv = fs.readFileSync('sample_bank_statement.csv', 'utf-8');
      const parsed = parseBankCsv(sampleCsv);
      expect(parsed.length).toBe(20);
      
      // Verifies duplicate Swiggy One auto-debit detection
      const duplicateSwiggy = parsed.find(t => t.merchant === 'Swiggy One Membership' && t.anomalyType === 'duplicate');
      expect(duplicateSwiggy).toBeDefined();

      // Verifies gym detection
      const gym = parsed.find(t => t.merchant.includes('Cult.fit'));
      expect(gym?.anomalyType).toBe('zombie_sub');
    });
  });

  // 13. Comprehensive Game Stats Aggregator
  describe('calculateGameStats', () => {
    it('accurately computes totals, annual savings, and tax deduction metrics', () => {
      const swiped: SwipedTransaction[] = [
        {
          id: 'sub-1',
          merchant: 'Gym',
          amount: 50,
          frequency: 'monthly',
          anomalyType: 'zombie_sub',
          date: '2026-10-01',
          category: 'Fitness',
          roast: '',
          isRecurring: true,
          decision: 'KILL',
          decisionTimestamp: Date.now(),
          decisionDurationMs: 1200,
          streakMultiplierAtDecision: 2,
        },
        {
          id: 'dup-1',
          merchant: 'Uber',
          amount: 30,
          frequency: 'one_time',
          anomalyType: 'duplicate',
          date: '2026-10-02',
          category: 'Travel',
          roast: '',
          isRecurring: false,
          decision: 'KILL',
          decisionTimestamp: Date.now(),
          decisionDurationMs: 1400,
          streakMultiplierAtDecision: 3,
        },
        {
          id: 'tax-1',
          merchant: 'AWS',
          amount: 120,
          frequency: 'monthly',
          anomalyType: 'normal',
          date: '2026-10-03',
          category: 'Cloud',
          roast: '',
          isRecurring: true,
          decision: 'TAX',
          decisionTimestamp: Date.now(),
          decisionDurationMs: 900,
          streakMultiplierAtDecision: 4,
        },
        {
          id: 'keep-1',
          merchant: 'Groceries',
          amount: 85,
          frequency: 'one_time',
          anomalyType: 'normal',
          date: '2026-10-04',
          category: 'Food',
          roast: '',
          isRecurring: false,
          decision: 'KEEP',
          decisionTimestamp: Date.now(),
          decisionDurationMs: 800,
          streakMultiplierAtDecision: 5,
        },
      ];

      const stats = calculateGameStats(swiped, 24, 5, 2400);

      expect(stats.totalProcessed).toBe(4);
      expect(stats.killedCount).toBe(2);
      expect(stats.keptCount).toBe(1);
      expect(stats.taxCount).toBe(1);
      // Gym is 50*12 = 600, Duplicate is 30 -> total 630
      expect(stats.annualSavings).toBe(630);
      expect(stats.duplicateDisputeTotal).toBe(30);
      expect(stats.taxDeductionsTotal).toBe(120);
      expect(stats.highestStreak).toBe(5);
      expect(stats.finalScore).toBe(2400);
      expect(stats.timeRemainingSec).toBe(24);
    });
  });

  // 10. Groq AI Advisor Engine Tests
  describe('Groq Advisor Module', () => {
    const mockStats = {
      annualSavings: 24000,
      monthlySavings: 2000,
      killedCount: 4,
      keptCount: 2,
      taxCount: 1,
      taxDeductionsTotal: 8400,
      duplicateDisputeTotal: 1500,
      finalScore: 3500,
      highestStreak: 7,
      totalProcessed: 7,
      timeRemainingSec: 25,
    };

    const mockTransactions: SwipedTransaction[] = [
      {
        id: 'tx-1',
        merchant: 'Cult.fit Pass',
        amount: 1799,
        frequency: 'monthly',
        anomalyType: 'zombie_sub',
        date: '2026-10-01',
        category: 'Fitness',
        roast: 'Unused gym membership',
        isRecurring: true,
        decision: 'KILL',
        decisionTimestamp: Date.now(),
        decisionDurationMs: 1200,
        streakMultiplierAtDecision: 2,
      },
      {
        id: 'tx-2',
        merchant: 'Hotstar Super',
        amount: 899,
        frequency: 'annual',
        anomalyType: 'price_creep',
        date: '2026-10-02',
        category: 'Entertainment',
        roast: 'Forgotten OTT',
        isRecurring: true,
        decision: 'KILL',
        decisionTimestamp: Date.now(),
        decisionDurationMs: 900,
        streakMultiplierAtDecision: 3,
      },
    ];

    it('builds structured prompt containing Indian Rupee metrics and merchant details', () => {
      const prompt = buildSpendingPrompt(mockStats, mockTransactions);
      expect(prompt).toContain('₹24,000');
      expect(prompt).toContain('Cult.fit Pass');
      expect(prompt).toContain('Hotstar Super');
      expect(prompt).toContain('Nifty 50');
      expect(prompt).toContain('Indian financial advisor');
    });

    it('generates high quality intelligent fallback review when no API key is supplied', () => {
      const review = generateFallbackReview(mockStats, mockTransactions);
      expect(review.isLiveApi).toBe(false);
      expect(review.financialGrade).toBeDefined();
      expect(review.archetype).toBeDefined();
      expect(review.brutalRoast).toContain('Cult.fit');
      expect(review.spendingCritique.length).toBeGreaterThanOrEqual(3);
      expect(review.actionableAdvice.length).toBeGreaterThanOrEqual(3);
      expect(review.fiveYearNiftyProjection).toContain('₹1,52,400'); // 24000 * 6.35
    });

    it('returns helpful advice on financial Q&A fallback without crashing', async () => {
      const response = await askGroqFinancialQuestion('Should I stop my Netflix subscription?', mockStats, '');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(15);
    });

    it('processes live or simulated financial advice', async () => {
      const response = await askGroqFinancialQuestion('Should I stop my Netflix subscription?', mockStats);
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(15);
    });
  });

  // 17. Google Cloud Gemini 1.5 Advisory Suite (Google Services Signal)
  describe('Google Gemini 1.5 Financial Advisory Engine', () => {
    const testStats = {
      annualSavings: 24000,
      monthlySavings: 2000,
      killedCount: 4,
      keptCount: 2,
      taxCount: 1,
      taxDeductionsTotal: 8400,
      duplicateDisputeTotal: 1500,
      finalScore: 3500,
      highestStreak: 7,
      totalProcessed: 7,
      timeRemainingSec: 25,
    };

    it('generates structured financial health audit and tax grading', async () => {
      const { getGeminiSpendingReview } = await import('../geminiAdvisor');
      const review = await getGeminiSpendingReview(testStats, [], '');
      expect(review.financialGrade).toBeDefined();
      expect(review.archetype).toBeDefined();
      expect(review.brutalRoast).toBeDefined();
      expect(review.spendingCritique.length).toBeGreaterThanOrEqual(2);
      expect(review.actionableAdvice.length).toBeGreaterThanOrEqual(2);
      expect(review.fiveYearNiftyProjection).toContain('₹');
      expect(review.modelUsed).toBeDefined();
    });

    it('answers Indian Section 44ADA tax questions accurately via Gemini engine', async () => {
      const { askGeminiFinancialQuestion } = await import('../geminiAdvisor');
      const answer = await askGeminiFinancialQuestion('Is ChatGPT deductible under Section 44ADA?', testStats, '');
      expect(answer).toContain('Section 44ADA');
      expect(answer).toContain('tax-deductible');
    });

    it('answers UPI auto-debit cancellation questions accurately via Gemini engine', async () => {
      const { askGeminiFinancialQuestion } = await import('../geminiAdvisor');
      const answer = await askGeminiFinancialQuestion('How to stop Cult.fit autopay?', testStats, '');
      expect(answer.toLowerCase()).toContain('cult.fit');
    });
  });
});
