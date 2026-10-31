import React from 'react';
import { Flame, Clock, Volume2, VolumeX, FastForward } from 'lucide-react';
import { getMultiplier } from '../../core/engine/savingsCalculator';
import { SoundSynthwaveIcon, RupeeCashTokenIcon } from '../ui/CyberIcons';

interface ArcadeHUDProps {
  timeRemainingSec: number;
  annualSavings: number;
  streak: number;
  currentIndex: number;
  totalCards: number;
  score: number;
  isMuted: boolean;
  isBgmActive: boolean;
  onToggleMute: () => void;
  onToggleBgm: () => void;
  onEndGame: () => void;
}

export const ArcadeHUD: React.FC<ArcadeHUDProps> = ({
  timeRemainingSec,
  annualSavings,
  streak,
  currentIndex,
  totalCards,
  score,
  isMuted,
  isBgmActive,
  onToggleMute,
  onToggleBgm,
  onEndGame,
}) => {
  const multiplier = getMultiplier(streak);
  const isTimeCritical = timeRemainingSec <= 15;
  const progressPercent = totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-4 relative z-20">
      {/* Top Arcade Machine Bezel */}
      <div className="bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* 1UP & Timer */}
        <div className="flex items-center gap-3">
          <div
            role="timer"
            aria-live="polite"
            className={`px-3 py-2 rounded-xl flex items-center justify-center font-arcade text-xs transition-all ${
              isTimeCritical
                ? 'bg-arcade-neonRed/20 text-arcade-neonRed border-2 border-arcade-neonRed animate-pulse shadow-[0_0_15px_#FF3366]'
                : 'bg-slate-900 text-arcade-neonYellow border border-slate-700'
            }`}
            aria-label={`Time remaining: ${timeRemainingSec} seconds`}
          >
            <Clock className="w-4 h-4 mr-1.5" />
            <span>TIME {timeRemainingSec}s</span>
          </div>

          <div className="font-arcade text-[10px] text-slate-400 hidden sm:block">
            STAGE <span className="text-arcade-neonCyan font-bold">{currentIndex + 1}</span>/{totalCards}
          </div>
        </div>

        {/* Live Recovered Cash Display */}
        <div className="flex flex-col items-center" role="region" aria-label="Recovered Cash Counter">
          <div className="flex items-center gap-1 font-arcade text-[9px] text-slate-400 tracking-widest uppercase">
            <RupeeCashTokenIcon className="w-3.5 h-3.5" />
            <span>RECOVERED CASH</span>
          </div>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="flex items-center gap-1 font-cyber font-black text-2xl sm:text-3xl text-arcade-neonGreen drop-shadow-[0_0_12px_rgba(0,255,136,0.6)]"
          >
            <span className="text-xl -mr-0.5">₹</span>
            <span>{annualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] font-mono text-emerald-400">/YR</span>
          </div>
        </div>

        {/* Combo Multiplier & Controls */}
        <div className="flex items-center gap-2">
          {/* Flame Multiplier */}
          <div
            role="status"
            aria-live="polite"
            className={`px-3 py-1.5 rounded-xl font-arcade text-[10px] font-bold flex items-center gap-1.5 transition-all ${
              multiplier >= 3
                ? 'bg-arcade-neonYellow/20 text-arcade-neonYellow border-2 border-arcade-neonYellow shadow-[0_0_15px_#FFE600] animate-bounce-slight'
                : multiplier >= 2
                ? 'bg-arcade-neonCyan/20 text-arcade-neonCyan border border-arcade-neonCyan'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
            aria-label={`Current combo multiplier: ${multiplier}x, streak of ${streak}`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{multiplier}x STREAK</span>
          </div>

          {/* Arcade Score */}
          <div className="text-right hidden md:block pl-2" role="status" aria-live="polite">
            <div className="font-arcade text-[8px] text-slate-400 uppercase">SCORE</div>
            <div className="font-cyber text-sm font-extrabold text-white tracking-widest">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Synthwave BGM Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-2 rounded-xl border transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              isBgmActive
                ? 'bg-arcade-neonPink/20 border-arcade-neonPink text-arcade-neonPink shadow-[0_0_10px_#FF007F]'
                : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={isBgmActive ? 'Mute 80s Synthwave BGM' : 'Play 80s Synthwave BGM'}
            aria-label="Toggle Synthwave BGM"
          >
            <SoundSynthwaveIcon className="w-4 h-4" active={isBgmActive} />
          </button>

          {/* SFX Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-600" /> : <Volume2 className="w-4 h-4 text-arcade-neonCyan" />}
          </button>

          {/* Finish Button */}
          <button
            onClick={onEndGame}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-arcade-neonYellow transition-colors font-arcade text-[8px] hidden lg:flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            title="Finish audit and review deliverables now"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>FINISH</span>
          </button>
        </div>
      </div>

      {/* Cyber Neon Progress Track */}
      <div className="w-full h-2 bg-slate-950 rounded-full mt-2 overflow-hidden border border-slate-800 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-arcade-neonPink via-arcade-neonCyan to-arcade-neonGreen transition-all duration-300 ease-out shadow-[0_0_10px_#00FF88]"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
