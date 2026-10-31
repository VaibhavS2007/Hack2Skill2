import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CombatTextEvent {
  id: string;
  type: 'SLASH' | 'KEEP' | 'TAX';
  text: string;
  subText?: string;
  x: number;
  y: number;
}

interface CombatVfxOverlayProps {
  events: CombatTextEvent[];
  laserSlash: boolean;
}

export const CombatVfxOverlay: React.FC<CombatVfxOverlayProps> = ({
  events,
  laserSlash,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Dramatic Katana Laser Cut Line across screen */}
      <AnimatePresence>
        {laserSlash && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-arcade-neonPink to-transparent shadow-[0_0_30px_#FF007F] transform -rotate-12 origin-center"
          />
        )}
      </AnimatePresence>

      {/* 2. Floating Combat Damage / Reward Numbers */}
      <AnimatePresence>
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{ opacity: 1, y: -70, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.4, y: -120 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            style={{ left: `${ev.x}%`, top: `${ev.y}%` }}
            className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-50"
          >
            <div
              className={`font-arcade text-lg sm:text-2xl font-black tracking-wider px-4 py-2 rounded-xl backdrop-blur-md border shadow-2xl ${
                ev.type === 'SLASH'
                  ? 'bg-arcade-neonPink/20 text-arcade-neonPink border-arcade-neonPink shadow-arcade-neonPink/50 text-stroke-sm'
                  : ev.type === 'KEEP'
                  ? 'bg-arcade-neonGreen/20 text-arcade-neonGreen border-arcade-neonGreen shadow-arcade-neonGreen/50'
                  : 'bg-arcade-neonCyan/20 text-arcade-neonCyan border-arcade-neonCyan shadow-arcade-neonCyan/50'
              }`}
            >
              {ev.text}
            </div>
            {ev.subText && (
              <div className="font-mono text-xs font-bold text-white mt-1 drop-shadow-md">
                {ev.subText}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
