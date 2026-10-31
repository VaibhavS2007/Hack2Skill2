import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, RotateCcw, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameStats, SwipedTransaction } from '../../core/engine/types';
import { playVictorySound } from '../../utils/soundEffects';
import { ActionDeliverables } from './ActionDeliverables';
import { GroqAuditReport } from './GroqAuditReport';
import { RupeeCashTokenIcon } from '../ui/CyberIcons';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';

interface VictoryScorecardProps {
  stats: GameStats;
  swipedTransactions: SwipedTransaction[];
  onPlayAgain: () => void;
  groqApiKey?: string;
  onUpdateApiKey?: (key: string) => void;
}

export const VictoryScorecard: React.FC<VictoryScorecardProps> = ({
  stats,
  swipedTransactions,
  onPlayAgain,
  groqApiKey = '',
  onUpdateApiKey = () => {},
}) => {
  // Fire confetti and play audio on mount
  useEffect(() => {
    playVictorySound();

    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center animate-fade-in z-20 relative select-none">
      {/* Trophy & Victory Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arcade-neonGreen/10 border border-arcade-neonGreen text-arcade-neonGreen text-xs font-arcade uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(0,255,136,0.25)]">
        <Sparkles className="w-4 h-4" />
        <span>SUBSCRIPTIONS PURGED &bull; ZERO CHORE REMAINING</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-2 font-cyber">
        STATEMENT <span className="text-arcade-neonGreen">CLEARED!</span>
      </h1>
      <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
        In just {60 - stats.timeRemainingSec} seconds, you blasted deadweight e-mandates into real annual savings and clean tax ledgers.
      </p>

      {/* Main Highlights Grid with ₹ (INR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Annual Savings */}
        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonGreen/60 shadow-[0_0_25px_rgba(0,255,136,0.2)] flex flex-col items-center justify-between group/card">
            <CardItem translateZ="20" className="flex items-center gap-1.5 mb-1">
              <RupeeCashTokenIcon className="w-4 h-4" />
              <span className="font-arcade text-[9px] uppercase tracking-widest text-slate-400">
                ANNUAL CASH RECOVERED
              </span>
            </CardItem>
            <CardItem translateZ="40" className="flex items-center text-3xl font-cyber font-black text-arcade-neonGreen">
              <span className="mr-0.5 text-2xl">₹</span>
              <span>{stats.annualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </CardItem>
            <CardItem translateZ="20" className="text-xs text-emerald-400 mt-1 font-mono">
              (₹{stats.monthlySavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}/mo saved)
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Zombie Subs Eliminated */}
        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonPink/60 shadow-[0_0_25px_rgba(255,0,127,0.2)] flex flex-col items-center justify-between group/card">
            <CardItem translateZ="20" className="font-arcade text-[9px] uppercase tracking-widest text-slate-400 mb-1">
              SUBSCRIPTIONS SLASHED
            </CardItem>
            <CardItem translateZ="40" className="text-3xl font-cyber font-black text-arcade-neonPink">
              {stats.killedCount}
            </CardItem>
            <CardItem translateZ="20" className="text-xs text-pink-300 mt-1 font-mono">
              {stats.duplicateDisputeTotal > 0
                ? `+ ₹${stats.duplicateDisputeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Disputed`
                : 'Zero dead weight'}
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Tax Deductions Claimed */}
        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonCyan/60 shadow-[0_0_25px_rgba(0,229,255,0.2)] flex flex-col items-center justify-between group/card">
            <CardItem translateZ="20" className="font-arcade text-[9px] uppercase tracking-widest text-slate-400 mb-1">
              TAX DEDUCTIONS CLAIMED
            </CardItem>
            <CardItem translateZ="40" className="flex items-center text-3xl font-cyber font-black text-arcade-neonCyan">
              <span className="mr-0.5 text-2xl">₹</span>
              <span>{stats.taxDeductionsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </CardItem>
            <CardItem translateZ="20" className="text-xs text-cyan-300 mt-1 font-mono">
              Schedule C / Sec 44ADA &bull; {stats.taxCount} items
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* Arcade High Score */}
        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-5 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonYellow/60 shadow-[0_0_25px_rgba(255,230,0,0.2)] flex flex-col items-center justify-between group/card">
            <CardItem translateZ="20" className="font-arcade text-[9px] uppercase tracking-widest text-slate-400 mb-1">
              ARCADE SCORE
            </CardItem>
            <CardItem translateZ="40" className="flex items-center gap-1 text-3xl font-cyber font-black text-arcade-neonYellow">
              <Trophy className="w-6 h-6" />
              <span>{stats.finalScore.toLocaleString()}</span>
            </CardItem>
            <CardItem translateZ="20" className="flex items-center gap-1 text-xs text-yellow-300 mt-1 font-arcade text-[9px]">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{stats.highestStreak}x MAX STREAK</span>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Summary Audit Statement Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 mb-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Processed {stats.totalProcessed} subscriptions with 100% decision confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-arcade-neonCyan" />
          <span>Legal Cancellation Package Compiled</span>
        </div>
        <button
          onClick={onPlayAgain}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-arcade text-[9px] transition-all border border-slate-700 active:scale-95 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>AUDIT ANOTHER STATEMENT</span>
        </button>
      </div>

      {/* Groq AI Spending Audit & Advisor */}
      <GroqAuditReport
        stats={stats}
        swipedTransactions={swipedTransactions}
        groqApiKey={groqApiKey}
        onUpdateApiKey={onUpdateApiKey}
      />

      {/* Tabbed Execution Deliverables */}
      <ActionDeliverables swipedTransactions={swipedTransactions} />
    </div>
  );
};
