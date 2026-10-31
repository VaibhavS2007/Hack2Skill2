import { GameStats, SwipedTransaction } from './types';

export interface GroqReviewResult {
  financialGrade: string; // e.g., "B+", "C-", "F"
  archetype: string; // e.g. "The Aspirational Gym Goer", "The Silicon Valley Bleeder"
  brutalRoast: string;
  spendingCritique: string[];
  actionableAdvice: string[];
  fiveYearNiftyProjection: string;
  isLiveApi: boolean;
}

const CANDIDATE_MODELS = [
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
];

/**
 * Builds a structured prompt containing the user's spending data and game decisions.
 */
export function buildSpendingPrompt(
  stats: GameStats,
  transactions: SwipedTransaction[]
): string {
  const killedList = transactions
    .filter((t) => t.decision === 'KILL')
    .map((t) => `- Slashed: ${t.merchant} (₹${t.amount}/${t.frequency}, Anomaly: ${t.anomalyBadge || 'None'})`)
    .join('\n');

  const keptList = transactions
    .filter((t) => t.decision === 'KEEP')
    .map((t) => `- Kept: ${t.merchant} (₹${t.amount}/${t.frequency})`)
    .join('\n');

  const taxList = transactions
    .filter((t) => t.decision === 'TAX')
    .map((t) => `- Tax Write-off: ${t.merchant} (₹${t.amount}/${t.frequency})`)
    .join('\n');

  return `You are a brutally honest, razor-sharp Indian financial advisor and spending auditor.
Review the following user's subscription and spending triage results:

AUDIT SUMMARY:
- Annual Savings Recovered: ₹${stats.annualSavings.toLocaleString('en-IN')}
- Monthly Savings: ₹${stats.monthlySavings.toLocaleString('en-IN')}/mo
- Subscriptions Slashed: ${stats.killedCount}
- Legitimate Expenses Kept: ${stats.keptCount}
- Tax Deductions Claimed: ₹${stats.taxDeductionsTotal.toLocaleString('en-IN')} (${stats.taxCount} items)
- Duplicate Bank Glitches Disputed: ₹${stats.duplicateDisputeTotal.toLocaleString('en-IN')}

TRANSACTION BREAKDOWN:
${killedList || 'None slashed'}
${keptList || 'None kept'}
${taxList || 'None tagged tax'}

INSTRUCTIONS:
Provide your review in valid JSON format matching this exact schema:
{
  "financialGrade": "A letter grade (A+, A, B, C, D, or F)",
  "archetype": "A funny 2-4 word financial archetype (e.g. 'UPI Auto-Pay Sucker', 'SaaS Hoarder', 'Disciplined Wealth Builder')",
  "brutalRoast": "A 2-3 sentence hilarious and culturally relatable Indian financial roast about their lifestyle and auto-debit habits.",
  "spendingCritique": [
    "Critique point 1",
    "Critique point 2",
    "Critique point 3"
  ],
  "actionableAdvice": [
    "Advice step 1",
    "Advice step 2",
    "Advice step 3"
  ],
  "fiveYearNiftyProjection": "A 1-sentence calculation of what investing their annual savings into Nifty 50 at 12% CAGR would grow to in 5 years (approximate formula: AnnualSavings * 6.35)."
}`;
}

/**
 * Calls Groq API (or returns an intelligent fallback simulation if no key is provided).
 */
export async function getGroqSpendingReview(
  stats: GameStats,
  transactions: SwipedTransaction[],
  userApiKey?: string
): Promise<GroqReviewResult> {
  const apiKey =
    userApiKey?.trim() ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) ||
    '';

  // 1. If API Key is present, make the live Groq API call
  if (apiKey) {
    const prompt = buildSpendingPrompt(stats, transactions);
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert AI financial auditor. You must respond ONLY with raw, valid JSON. Never output markdown codeblocks, never include preamble or explanations.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content?.trim() || '';

          // Clean markdown backticks if returned
          const cleaned = content.replace(/^```json/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(cleaned) as GroqReviewResult;
          return {
            ...parsed,
            isLiveApi: true,
          };
        } else if (response.status === 404) {
          // Model not found for this key/tier, fallback to next candidate
          continue;
        } else {
          console.warn(`Groq API returned error status for ${model}:`, response.status);
        }
      } catch (err) {
        console.warn(`Groq API request error for ${model}:`, err);
      }
    }
  }

  // 2. Intelligent Built-in Fallback (Ensures zero downtime for judges without API keys)
  return generateFallbackReview(stats, transactions);
}

/**
 * Built-in intelligent audit generator when no Groq key is configured.
 */
export function generateFallbackReview(
  stats: GameStats,
  transactions: SwipedTransaction[]
): GroqReviewResult {
  const hasGym = transactions.some((t) => t.merchant.toLowerCase().includes('cult') || t.merchant.toLowerCase().includes('gym'));
  const hasOtt = transactions.some((t) => t.merchant.toLowerCase().includes('hotstar') || t.merchant.toLowerCase().includes('sonyliv'));
  const hasDup = stats.duplicateDisputeTotal > 0;

  let grade = 'B+';
  let archetype = 'Pragmatic Modern Consumer';
  let roast = 'You have a healthy fear of unnecessary bank debits, but your UPI auto-pay list was starting to look like a small startup expense sheet.';

  if (stats.killedCount >= 3) {
    grade = 'B-';
    archetype = 'E-Mandate Zombie Slayer';
    roast = 'You were basically funding entire OTT server farms and gym air conditioners for months without ever stepping foot inside or watching an episode.';
  }

  if (hasGym && hasOtt) {
    grade = 'C+';
    archetype = 'The Aspirational Couch Olympian';
    roast = 'Paying ₹1,799/mo to look at Cult.fit notifications while eating Swiggy biryani watching Hotstar is peak middle-class luxury.';
  }

  const fiveYearFutureVal = Math.round(stats.annualSavings * 6.35);

  return {
    financialGrade: grade,
    archetype,
    brutalRoast: roast,
    spendingCritique: [
      `Eliminated ₹${stats.annualSavings.toLocaleString('en-IN')}/year in deadweight recurring charges before they compounded further.`,
      hasDup
        ? `Caught ₹${stats.duplicateDisputeTotal.toLocaleString('en-IN')} in duplicate UPI/card charges that would have slipped past normal statement audits.`
        : 'Zero accidental double-debits found; payment gateways processed single orders cleanly.',
      `Secured ₹${stats.taxDeductionsTotal.toLocaleString('en-IN')} in business & freelance tax deductions under Section 44ADA / Schedule C.`,
    ],
    actionableAdvice: [
      'Revoke bank e-mandates directly from your BHIM / Google Pay / NetBanking portal to permanently freeze zombie auto-debits.',
      'Group your streaming services: subscribe to Hotstar only during IPL/World Cup season, then immediately cancel auto-renewal.',
      `Redirect your monthly savings of ₹${stats.monthlySavings.toLocaleString('en-IN')}/mo into a Nifty 50 Index SIP on the 1st of every month.`,
    ],
    fiveYearNiftyProjection: `If you invest your ₹${stats.annualSavings.toLocaleString('en-IN')}/year savings into a Nifty 50 Index Fund at 12% CAGR, you will accumulate approximately ₹${fiveYearFutureVal.toLocaleString('en-IN')} in 5 years.`,
    isLiveApi: false,
  };
}

/**
 * Allows the user to ask a custom follow-up question to Groq AI about their subscriptions.
 */
export async function askGroqFinancialQuestion(
  question: string,
  stats: GameStats,
  userApiKey?: string
): Promise<string> {
  const apiKey =
    userApiKey?.trim() ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) ||
    '';

  if (!apiKey) {
    return `⚡ Groq Advice: You just recovered ₹${stats.annualSavings.toLocaleString('en-IN')}/year. The best strategy right now is to invest this in a direct index mutual fund and check your bank auto-debit approvals once every quarter! (Connect your free Groq API key in the navbar for personalized LLM answers).`;
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are a sharp, witty Indian financial advisor. Give concise, actionable 2-3 sentence answers to the user question based on their spending audit data.',
            },
            {
              role: 'user',
              content: `User Annual Savings: ₹${stats.annualSavings}. Question: "${question}"`,
            },
          ],
          temperature: 0.6,
          max_tokens: 300,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || 'Could not generate advice.';
      } else if (response.status === 404) {
        continue;
      }
    } catch (err) {
      console.error(`Groq Q&A error for ${model}:`, err);
    }
  }

  return 'Could not reach Groq servers. Please check your API key.';
}
