import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, CheckCircle, HelpCircle, Send, Key, AlertCircle } from 'lucide-react';
import { GameStats, SwipedTransaction } from '../../core/engine/types';
import { getGroqSpendingReview, askGroqFinancialQuestion, GroqReviewResult } from '../../core/engine/groqAdvisor';
import { GroqNeuralCoreIcon } from '../ui/CyberIcons';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';

interface GroqAuditReportProps {
  stats: GameStats;
  swipedTransactions: SwipedTransaction[];
  groqApiKey: string;
  onUpdateApiKey: (key: string) => void;
}

export const GroqAuditReport: React.FC<GroqAuditReportProps> = ({
  stats,
  swipedTransactions,
  groqApiKey,
  onUpdateApiKey,
}) => {
  const [review, setReview] = useState<GroqReviewResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [askingQa, setAskingQa] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(groqApiKey);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getGroqSpendingReview(stats, swipedTransactions, groqApiKey).then((res) => {
      if (isMounted) {
        setReview(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stats, swipedTransactions, groqApiKey]);

  const handleAskQuestion = async (q: string) => {
    if (!q.trim()) return;
    setAskingQa(true);
    setQaAnswer(null);
    const answer = await askGroqFinancialQuestion(q, stats, groqApiKey);
    setQaAnswer(answer);
    setAskingQa(false);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateApiKey(tempKey.trim());
    setShowKeyInput(false);
  };

  return (
    <div className="w-full bg-slate-950/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.85)] mt-8 text-left backdrop-blur-xl relative z-20">
      {/* Top Groq AI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-arcade-neonYellow/15 border border-arcade-neonYellow text-arcade-neonYellow text-[10px] font-arcade uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(255,230,0,0.25)]">
            <GroqNeuralCoreIcon className="w-3.5 h-3.5" />
            <span>GROQ LLAMA 3.3 &bull; AI FINANCIAL ROAST &amp; ADVISOR</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-cyber tracking-tight">
            GROQ AI SPENDING AUDIT
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
            Groq's ultra-fast LLM reviewed your decisions, analyzed your lifestyle, and prepared this critique.
          </p>
        </div>

        {/* API Status & Key Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-arcade-neonYellow text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-arcade-neonYellow" />
            <span>{groqApiKey ? 'GROQ KEY CONFIGURED' : 'CONNECT GROQ KEY'}</span>
          </button>
        </div>
      </div>

      {/* Optional Groq API Key Input Drawer */}
      {showKeyInput && (
        <form
          onSubmit={handleSaveKey}
          className="my-4 p-4 rounded-2xl bg-slate-900 border border-slate-700 flex flex-wrap items-center gap-3 animate-fade-in"
        >
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[10px] font-arcade text-slate-400 mb-1">
              GROQ API KEY (Free from console.groq.com)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-arcade-neonYellow focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-arcade-neonYellow text-slate-950 font-arcade text-xs font-black self-end"
          >
            SAVE KEY
          </button>
          <button
            type="button"
            onClick={() => setShowKeyInput(false)}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs self-end"
          >
            Cancel
          </button>
        </form>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 font-arcade text-xs text-arcade-neonYellow">
          <div className="w-8 h-8 border-4 border-arcade-neonYellow border-t-transparent rounded-full animate-spin" />
          <span>GROQ LLAMA 3.3 IS AUDITING YOUR SPENDING...</span>
        </div>
      ) : review ? (
        <div className="pt-6 space-y-6 animate-fade-in">
          {/* Grade & Archetype Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grade */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-900 border-2 border-arcade-neonGreen flex items-center gap-4 group/card">
                <CardItem translateZ="40" className="w-14 h-14 rounded-2xl bg-arcade-neonGreen/20 border-2 border-arcade-neonGreen flex items-center justify-center font-cyber font-black text-3xl text-arcade-neonGreen shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                  {review.financialGrade}
                </CardItem>
                <CardItem translateZ="20">
                  <span className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                    FINANCIAL DISCIPLINE GRADE
                  </span>
                  <div className="font-mono text-xs text-slate-200 font-bold mt-0.5">
                    Calculated by Groq AI
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Archetype */}
            <CardContainer containerClassName="w-full py-0 sm:col-span-2" className="w-full h-full">
              <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-900 border-2 border-arcade-neonPink flex flex-col justify-center group/card">
                <CardItem translateZ="15">
                  <span className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1 block">
                    YOUR FINANCIAL ARCHETYPE
                  </span>
                </CardItem>
                <CardItem translateZ="35" className="font-cyber font-black text-xl sm:text-2xl text-arcade-neonPink drop-shadow-[0_0_10px_rgba(255,0,127,0.4)]">
                  "{review.archetype}"
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          {/* Brutal Roast Callout */}
          <CardContainer containerClassName="w-full py-0" className="w-full">
            <CardBody className="w-full p-5 rounded-2xl bg-slate-900/95 border-2 border-arcade-neonYellow/60 shadow-[0_0_25px_rgba(255,230,0,0.15)] relative overflow-hidden group/card">
              <CardItem translateZ="20" className="text-xs font-mono font-bold text-arcade-neonYellow mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THE BRUTAL ROAST &bull; GROQ OPINION</span>
              </CardItem>
              <CardItem translateZ="35" as="p" className="text-sm sm:text-base text-slate-100 font-sans italic leading-relaxed">
                "{review.brutalRoast}"
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Critique & Actionable Advice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critique Points */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md group/card flex flex-col justify-between">
                <CardItem translateZ="25" className="font-mono font-bold text-xs text-arcade-neonPink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>SPENDING ANOMALIES DETECTED:</span>
                </CardItem>
                <CardItem translateZ="15" as="ul" className="space-y-3 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  {review.spendingCritique.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-arcade-neonPink font-bold mt-0.5 text-base leading-none">&bull;</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Actionable Next Steps */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md group/card flex flex-col justify-between">
                <CardItem translateZ="25" className="font-mono font-bold text-xs text-arcade-neonGreen uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>ACTIONABLE ADVICE FROM GROQ:</span>
                </CardItem>
                <CardItem translateZ="15" as="ul" className="space-y-3 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                  {review.actionableAdvice.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-arcade-neonGreen font-bold mt-0.5 text-base leading-none">&bull;</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          {/* 5-Year Nifty Projection Box */}
          <CardContainer containerClassName="w-full py-0" className="w-full">
            <CardBody className="w-full p-4 rounded-2xl bg-gradient-to-r from-arcade-neonGreen/10 via-slate-900 to-arcade-neonCyan/10 border border-arcade-neonGreen/40 flex items-center gap-3 group/card">
              <CardItem translateZ="30" className="p-2.5 rounded-xl bg-arcade-neonGreen/20 text-arcade-neonGreen">
                <TrendingUp className="w-5 h-5" />
              </CardItem>
              <CardItem translateZ="20">
                <span className="font-mono font-bold text-xs text-arcade-neonGreen uppercase tracking-wider block">
                  5-YEAR WEALTH PROJECTION (NIFTY 50 @ 12% CAGR)
                </span>
                <p className="text-xs text-slate-200 font-mono mt-0.5">
                  {review.fiveYearNiftyProjection}
                </p>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Interactive "Ask Groq AI" Box */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5 font-arcade text-[10px] text-arcade-neonCyan uppercase mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ASK GROQ A FINANCIAL OPINION / QUESTION</span>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'How do I cancel Cult.fit permanently?',
                'Is ChatGPT deductible under Section 44ADA?',
                'How to stop UPI auto-debits on Google Pay?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setCustomQuestion(q);
                    handleAskQuestion(q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-arcade-neonCyan text-[11px] text-slate-300 font-mono transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(customQuestion)}
                placeholder="Ask Groq AI any question about your spending..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-arcade-neonCyan focus:outline-none"
              />
              <button
                onClick={() => handleAskQuestion(customQuestion)}
                disabled={askingQa || !customQuestion.trim()}
                className="px-5 py-2.5 rounded-xl bg-arcade-neonCyan text-slate-950 font-arcade text-xs font-bold flex items-center gap-1.5 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{askingQa ? 'THINKING...' : 'ASK'}</span>
              </button>
            </div>

            {/* Q&A Answer Box */}
            {qaAnswer && (
              <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-arcade-neonCyan/40 text-xs font-sans text-slate-200 leading-relaxed animate-fade-in">
                <span className="font-arcade text-[9px] text-arcade-neonCyan block mb-1">
                  ⚡ GROQ ADVICE:
                </span>
                {qaAnswer}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
