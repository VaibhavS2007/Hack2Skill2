import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { parseBankCsv } from '../../core/engine/csvProcessor';
import { Transaction } from '../../core/engine/types';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';
import {
  StarfighterShipIcon,
  FleetForgeIcon,
  CyberDatapadIcon,
  PlasmaLaserIcon,
  TractorBeamIcon,
  ShieldVaultIcon,
  GlitchHazardIcon,
} from '../ui/CyberIcons';

interface LandingHeroProps {
  onStartDemo: () => void;
  onCustomTransactionsLoaded: (transactions: Transaction[]) => void;
  onOpenForge: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartDemo,
  onCustomTransactionsLoaded,
  onOpenForge,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseBankCsv(text);
        if (parsed.length > 0) {
          onCustomTransactionsLoaded(parsed);
        } else {
          alert('Could not parse transactions from CSV. Please ensure it has Date, Merchant, and Amount headers.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 z-10">
      <BackgroundBeamsWithCollision className="px-4 py-8 md:py-12 flex flex-col items-center text-center">
        {/* Arcade Marquee Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border-2 border-arcade-neonGreen text-arcade-neonGreen text-[11px] font-arcade uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-pulse">
          <StarfighterShipIcon className="w-4 h-4" />
          <span>STARFIGHTER EDITION &bull; 60-SEC SPACE CHORE SHOOTER</span>
        </div>

        {/* Main Retro Arcade Logo */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-2 font-cyber drop-shadow-[0_0_35px_rgba(0,255,136,0.5)]">
          SPEND<span className="text-arcade-neonGreen">INTRUDERS</span>{' '}
          <span className="text-arcade-neonPink">⚡</span>
        </h1>

        {/* Aceternity Exploding Beams Drop-Shadow Text */}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] mb-4">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)] font-cyber text-xs sm:text-sm md:text-base font-black tracking-widest uppercase">
            <span>&gt;&gt; WHAT'S COOLER THAN CUTTING EXPENSES? EXPLODING BEAMS. &lt;&lt;</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 font-cyber text-xs sm:text-sm md:text-base font-black tracking-widest uppercase">
            <span>&gt;&gt; WHAT'S COOLER THAN CUTTING EXPENSES? EXPLODING BEAMS. &lt;&lt;</span>
          </div>
        </div>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed font-sans">
          Pilot your anti-debt starfighter! Aim with your mouse and blast zombie subscriptions with dual plasma lasers, 
          tractor-beam dev tools for IRS tax deductions, and escort legitimate expenses into your budget vault.
        </p>

        {/* Action CTA Buttons with 21st.dev Cyber Icons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-xl mb-12">
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-arcade-neonGreen to-emerald-400 text-slate-950 font-arcade font-bold text-xs hover:brightness-125 active:scale-90 transition-all shadow-[0_0_30px_rgba(0,255,136,0.5)] cursor-pointer group"
            aria-label="Start interactive demo with preloaded statement"
          >
            <StarfighterShipIcon className="w-5 h-5 group-hover:scale-110 transition-transform" glow={false} />
            <span>TRY DEMO</span>
          </button>

          <button
            onClick={onOpenForge}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-950 border-2 border-arcade-neonCyan text-arcade-neonCyan font-arcade text-xs hover:bg-arcade-neonCyan hover:text-slate-950 active:scale-90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] cursor-pointer group"
            aria-label="Build and forge your own custom subscription fleet"
          >
            <FleetForgeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>FORGE FLEET</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-950/80 border-2 border-slate-700 text-slate-300 font-arcade text-xs hover:border-arcade-neonYellow hover:text-arcade-neonYellow active:scale-90 transition-all shadow-lg cursor-pointer group"
            aria-label="Upload your own bank CSV"
          >
            <CyberDatapadIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>UPLOAD CSV</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {/* Arcade Cabinet Controller Guide */}
        <div className="w-full max-w-3xl bg-slate-950/85 border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-xl text-left">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-arcade text-arcade-neonYellow uppercase tracking-wider">
              <GlitchHazardIcon className="w-4 h-4" />
              <span>3-WAY ARCADE COMBAT CONTROLS</span>
            </div>
            <span className="font-arcade text-[9px] text-slate-500">READY PLAYER ONE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Action: BLAST */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-900/90 border border-arcade-neonPink/40 hover:border-arcade-neonPink transition-all hover:shadow-[0_0_20px_rgba(255,0,127,0.25)] group/card flex flex-col justify-between">
                <CardItem translateZ="30" className="flex items-center gap-2 text-arcade-neonPink font-arcade text-xs mb-2">
                  <span className="p-1 rounded bg-arcade-neonPink/20 flex items-center justify-center">
                    <PlasmaLaserIcon className="w-4 h-4" />
                  </span>
                  <span>SPACE / A &bull; BLAST</span>
                </CardItem>
                <CardItem translateZ="20" as="p" className="text-xs text-slate-300 leading-relaxed font-sans">
                  Fire twin plasma lasers to blast and terminate zombie subscriptions and dispute duplicate charges.
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Up Action: TRACTOR */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-900/90 border border-arcade-neonCyan/40 hover:border-arcade-neonCyan transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] group/card flex flex-col justify-between">
                <CardItem translateZ="30" className="flex items-center gap-2 text-arcade-neonCyan font-arcade text-xs mb-2">
                  <span className="p-1 rounded bg-arcade-neonCyan/20 flex items-center justify-center">
                    <TractorBeamIcon className="w-4 h-4" />
                  </span>
                  <span>W / &uarr; &bull; TRACTOR</span>
                </CardItem>
                <CardItem translateZ="20" as="p" className="text-xs text-slate-300 leading-relaxed font-sans">
                  Fire EMP tractor beam to absorb dev tools and cloud servers for automated IRS Schedule C tax write-off.
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Right Action: ESCORT */}
            <CardContainer containerClassName="w-full py-0" className="w-full h-full">
              <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-900/90 border border-arcade-neonGreen/40 hover:border-arcade-neonGreen transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.25)] group/card flex flex-col justify-between">
                <CardItem translateZ="30" className="flex items-center gap-2 text-arcade-neonGreen font-arcade text-xs mb-2">
                  <span className="p-1 rounded bg-arcade-neonGreen/20 flex items-center justify-center">
                    <ShieldVaultIcon className="w-4 h-4" />
                  </span>
                  <span>D / &rarr; &bull; ESCORT</span>
                </CardItem>
                <CardItem translateZ="20" as="p" className="text-xs text-slate-300 leading-relaxed font-sans">
                  Raise shields to escort legitimate food, necessary utilities, and core essentials into your budget vault.
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
            <span className="font-arcade text-[9px] text-arcade-neonGreen">
              ⚡ SPEED BONUS: Decide under 2.5s for 2x, 3x, 5x combos
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-arcade-neonPink" />
              100% Client-Side Privacy &bull; Zero Bank Credentials Required
            </span>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};
