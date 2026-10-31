import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUp, Calendar, Tag, ShieldCheck, Flame, Skull } from 'lucide-react';
import { Transaction, SwipeDecision } from '../../core/engine/types';
import { playSlashSound, playCoinSound, playTaxPowerUpSound, playComboSound } from '../../utils/soundEffects';
import { MonsterAvatar } from './MonsterAvatar';
import { calculateAnnualCost } from '../../core/engine/savingsCalculator';

interface SwipeDeckProps {
  currentTransaction: Transaction;
  onDecision: (decision: SwipeDecision, durationMs: number) => void;
  streak: number;
  onCombatEvent: (type: 'SLASH' | 'KEEP' | 'TAX', text: string, subText?: string) => void;
  triggerScreenShake: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  currentTransaction,
  onDecision,
  streak,
  onCombatEvent,
  triggerScreenShake,
}) => {
  const [decisionDirection, setDecisionDirection] = useState<'KILL' | 'KEEP' | 'TAX' | null>(null);
  const cardStartTimeRef = useRef<number>(Date.now());

  const annualBounty = calculateAnnualCost(currentTransaction.amount, currentTransaction.frequency);

  useEffect(() => {
    cardStartTimeRef.current = Date.now();
    setDecisionDirection(null);
  }, [currentTransaction.id]);

  const handleAction = useCallback(
    (decision: SwipeDecision) => {
      if (decisionDirection) return; // Prevent double trigger
      setDecisionDirection(decision);

      const duration = Date.now() - cardStartTimeRef.current;

      if (decision === 'KILL') {
        playSlashSound();
        triggerScreenShake();
        onCombatEvent(
          'SLASH',
          `💥 -$${annualBounty.toFixed(2)}/YR`,
          currentTransaction.anomalyType === 'duplicate' ? 'DUPLICATE DISPUTED!' : 'ZOMBIE SLAIN!'
        );
      } else if (decision === 'KEEP') {
        playCoinSound();
        onCombatEvent('KEEP', '💰 APPROVED', 'KEPT IN BUDGET');
      } else {
        playTaxPowerUpSound();
        triggerScreenShake();
        onCombatEvent('TAX', `⚡ +$${currentTransaction.amount.toFixed(2)} TAX WRITE-OFF`, 'IRS SCHEDULE C');
      }

      if (streak >= 2) {
        playComboSound(streak);
      }

      setTimeout(() => {
        onDecision(decision, duration);
      }, 220);
    },
    [annualBounty, currentTransaction, decisionDirection, onCombatEvent, onDecision, streak, triggerScreenShake]
  );

  // Global Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleAction('KILL');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleAction('KEEP');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleAction('TAX');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center relative z-20">
      {/* ARIA Live Region for Accessibility */}
      <div className="sr-only" aria-live="polite">
        Target: {currentTransaction.merchant}, amount ${currentTransaction.amount.toFixed(2)},
        bounty ${annualBounty.toFixed(2)}/yr. {currentTransaction.roast}
      </div>

      {/* Target Arena & Health Bar */}
      <div className="w-full mb-3 flex items-center justify-between text-xs font-mono font-bold text-slate-300">
        <div className="flex items-center gap-1.5 text-arcade-neonPink">
          <Skull className="w-4 h-4 animate-pulse" />
          <span className="font-arcade text-[10px]">TARGET HP / BOUNTY</span>
        </div>
        <div className="text-arcade-neonGreen font-arcade text-xs">
          ${annualBounty.toFixed(2)} / yr
        </div>
      </div>

      {/* Main Physical Card Viewport */}
      <div className="relative w-full min-h-[380px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTransaction.id}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={
              decisionDirection === 'KILL'
                ? { x: -380, rotate: -35, opacity: 0, filter: 'brightness(1.5)' }
                : decisionDirection === 'KEEP'
                ? { x: 380, rotate: 35, opacity: 0 }
                : { y: -380, scale: 0.4, opacity: 0 }
            }
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-full bg-slate-950/95 border-2 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl ${
              currentTransaction.anomalyType === 'duplicate'
                ? 'border-arcade-neonRed shadow-[0_0_35px_rgba(255,51,102,0.3)]'
                : currentTransaction.anomalyType === 'zombie_sub'
                ? 'border-arcade-neonPink shadow-[0_0_35px_rgba(255,0,127,0.3)]'
                : 'border-arcade-neonGreen shadow-[0_0_35px_rgba(0,255,136,0.25)]'
            }`}
          >
            {/* Corner Cyber Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />

            {/* Top Banner: Anomaly Alert Badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-arcade text-[10px] uppercase tracking-wider border ${
                  currentTransaction.anomalyType === 'duplicate'
                    ? 'bg-arcade-neonRed/20 text-arcade-neonRed border-arcade-neonRed animate-pulse'
                    : currentTransaction.anomalyType === 'zombie_sub'
                    ? 'bg-arcade-neonPink/20 text-arcade-neonPink border-arcade-neonPink'
                    : 'bg-arcade-neonGreen/20 text-arcade-neonGreen border-arcade-neonGreen'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{currentTransaction.anomalyBadge || 'AUDIT TARGET'}</span>
              </div>

              <div className="text-right">
                <span className="font-arcade text-[10px] text-slate-400">CLASS: </span>
                <span className="font-mono text-xs text-white font-bold uppercase">
                  {currentTransaction.frequency}
                </span>
              </div>
            </div>

            {/* Monster Avatar & Title Row */}
            <div className="flex items-start gap-4 mb-4">
              <MonsterAvatar
                anomalyType={currentTransaction.anomalyType}
                category={currentTransaction.category}
                merchant={currentTransaction.merchant}
              />

              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-cyber">
                  {currentTransaction.merchant}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-arcade-neonCyan" />
                    {currentTransaction.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {currentTransaction.date}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-arcade-neonGreen">
                    ${currentTransaction.amount.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs text-slate-400 uppercase">
                    /{currentTransaction.frequency === 'one_time' ? '1-time' : currentTransaction.frequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Roast Callout Box */}
            <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-700/80 my-3 relative overflow-hidden">
              <div className="text-[10px] font-arcade text-arcade-neonYellow mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-arcade-neonYellow animate-ping" />
                <span>AI AUDIT ROAST &bull; WEAKNESS DETECTED</span>
              </div>
              <p className="text-sm text-slate-200 italic font-sans leading-relaxed">
                "{currentTransaction.roast}"
              </p>
              {currentTransaction.lastActiveDescription && (
                <div className="mt-2 text-xs font-mono text-arcade-neonCyan font-semibold">
                  ⚡ {currentTransaction.lastActiveDescription}
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FTC / CCPA Action Ready</span>
              </span>
              <span className="font-arcade text-[9px] text-arcade-neonYellow">
                PRESS KEY OR CLICK TO STRIKE
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3 Heavy Arcade Slasher Control Buttons */}
      <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 mt-6">
        {/* SLASH & KILL */}
        <button
          onClick={() => handleAction('KILL')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-arcade-neonPink/25 to-arcade-neonPink/10 border-2 border-arcade-neonPink text-arcade-neonPink font-arcade hover:brightness-125 active:scale-90 transition-all shadow-[0_0_20px_rgba(255,0,127,0.35)] group"
          aria-label="Slash and cancel subscription"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
            <span className="text-xs sm:text-sm font-black">SLASH</span>
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [A / &larr;] KILL
          </span>
        </button>

        {/* CLAIM TAX WRITE-OFF */}
        <button
          onClick={() => handleAction('TAX')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-arcade-neonCyan/25 to-arcade-neonCyan/10 border-2 border-arcade-neonCyan text-arcade-neonCyan font-arcade hover:brightness-125 active:scale-90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] group"
          aria-label="Claim as tax deduction"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1.5 transition-transform" />
            <span className="text-xs sm:text-sm font-black">TAX</span>
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [W / &uarr;] DEDUCT
          </span>
        </button>

        {/* KEEP EXPENSE */}
        <button
          onClick={() => handleAction('KEEP')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-arcade-neonGreen/25 to-arcade-neonGreen/10 border-2 border-arcade-neonGreen text-arcade-neonGreen font-arcade hover:brightness-125 active:scale-90 transition-all shadow-[0_0_20px_rgba(0,255,136,0.35)] group"
          aria-label="Keep and approve expense"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs sm:text-sm font-black">KEEP</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [D / &rarr;] APPROVE
          </span>
        </button>
      </div>

      {/* Keyboard Controls Bar */}
      <div className="mt-4 text-xs font-mono text-slate-400 text-center flex items-center justify-center gap-3">
        <span className="font-arcade text-[9px] text-arcade-neonGreen">ARCADE STRIKE:</span>
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-arcade-neonPink font-bold">A / &larr;</span>
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-arcade-neonCyan font-bold">W / &uarr;</span>
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-arcade-neonGreen font-bold">D / &rarr;</span>
      </div>
    </div>
  );
};
