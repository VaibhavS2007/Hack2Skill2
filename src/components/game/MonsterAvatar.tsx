import React from 'react';
import { AnomalyType } from '../../core/engine/types';

interface MonsterAvatarProps {
  anomalyType: AnomalyType;
  category: string;
  merchant: string;
}

export const MonsterAvatar: React.FC<MonsterAvatarProps> = ({
  anomalyType,
  category,
  merchant,
}) => {
  const norm = `${merchant} ${category}`.toLowerCase();

  // 1. Zombie Gym Monster
  if (norm.includes('gym') || norm.includes('fitness')) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center bg-slate-900/90 rounded-2xl border-2 border-arcade-neonPink shadow-lg shadow-arcade-neonPink/30 overflow-hidden group">
        <div className="text-4xl animate-bounce-slight select-none">🏋️‍♂️</div>
        <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 bg-arcade-neonPink/20 text-[9px] font-mono text-center text-arcade-neonPink font-black uppercase">
          Guilt Golem
        </div>
      </div>
    );
  }

  // 2. Duplicate Doppelgänger Monster
  if (anomalyType === 'duplicate') {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center bg-slate-900/90 rounded-2xl border-2 border-arcade-neonRed shadow-lg shadow-arcade-neonRed/30 overflow-hidden">
        <div className="relative flex items-center justify-center">
          <span className="text-3xl filter drop-shadow animate-pulse">🍔</span>
          <span className="text-2xl absolute -right-3 -top-1 opacity-70 filter hue-rotate-180 animate-ping">🍔</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-arcade-neonRed/30 text-[9px] font-mono text-center text-arcade-neonRed font-black uppercase">
          Doppelgänger
        </div>
      </div>
    );
  }

  // 3. Orphan Cloud Monster
  if (norm.includes('cloud') || norm.includes('aws') || norm.includes('server')) {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center bg-slate-900/90 rounded-2xl border-2 border-arcade-neonCyan shadow-lg shadow-arcade-neonCyan/30 overflow-hidden">
        <div className="text-4xl animate-pulse select-none">☁️</div>
        <div className="absolute top-1 text-xs text-arcade-neonYellow animate-bounce font-mono">⚡</div>
        <div className="absolute bottom-0 inset-x-0 bg-arcade-neonCyan/20 text-[9px] font-mono text-center text-arcade-neonCyan font-black uppercase">
          Vapor Cluster
        </div>
      </div>
    );
  }

  // 4. Creative / SaaS Zombie (Adobe, Duolingo, etc.)
  if (anomalyType === 'zombie_sub') {
    return (
      <div className="relative w-20 h-20 flex items-center justify-center bg-slate-900/90 rounded-2xl border-2 border-arcade-neonPink shadow-lg shadow-arcade-neonPink/30 overflow-hidden">
        <div className="text-4xl animate-pulse select-none">🧟</div>
        <div className="absolute -top-1 right-1 text-xs text-arcade-neonGreen animate-spin font-mono">💸</div>
        <div className="absolute bottom-0 inset-x-0 bg-arcade-neonPink/20 text-[9px] font-mono text-center text-arcade-neonPink font-black uppercase">
          SaaS Leech
        </div>
      </div>
    );
  }

  // 5. Work / Tax Ally (Dev tool, Figma, GitHub, Workspace)
  return (
    <div className="relative w-20 h-20 flex items-center justify-center bg-slate-900/90 rounded-2xl border-2 border-arcade-neonGreen shadow-lg shadow-arcade-neonGreen/30 overflow-hidden">
      <div className="text-4xl select-none">🤖</div>
      <div className="absolute -top-1 right-1 text-xs text-arcade-neonGreen animate-pulse font-mono">🛡️</div>
      <div className="absolute bottom-0 inset-x-0 bg-arcade-neonGreen/20 text-[9px] font-mono text-center text-arcade-neonGreen font-black uppercase">
        Tax Ally
      </div>
    </div>
  );
};
