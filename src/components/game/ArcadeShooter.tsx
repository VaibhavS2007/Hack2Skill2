import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Transaction, SwipeDecision } from '../../core/engine/types';
import { calculateAnnualCost } from '../../core/engine/savingsCalculator';
import { playSlashSound, playCoinSound, playTaxPowerUpSound, playComboSound } from '../../utils/soundEffects';
import { PlasmaLaserIcon, TractorBeamIcon, ShieldVaultIcon } from '../ui/CyberIcons';

interface ArcadeShooterProps {
  currentTransaction: Transaction;
  onDecision: (decision: SwipeDecision, durationMs: number) => void;
  streak: number;
  onCombatEvent: (type: 'SLASH' | 'KEEP' | 'TAX', text: string, subText?: string) => void;
  triggerScreenShake: () => void;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'LASER' | 'TRACTOR';
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export const ArcadeShooter: React.FC<ArcadeShooterProps> = ({
  currentTransaction,
  onDecision,
  streak,
  onCombatEvent,
  triggerScreenShake,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardStartTimeRef = useRef<number>(Date.now());
  const [selectedWeapon, setSelectedWeapon] = useState<'LASER' | 'TRACTOR' | 'PASS'>('LASER');
  const [isExploding, setIsExploding] = useState<boolean>(false);

  const annualBounty = calculateAnnualCost(currentTransaction.amount, currentTransaction.frequency);

  // Ship and Game World State
  const playerRef = useRef({
    x: 350,
    y: 420,
    targetX: 350,
    width: 44,
    height: 48,
  });

  const enemyRef = useRef({
    x: 350,
    y: 120,
    vx: 1.5,
    width: 220,
    height: 100,
    hp: 100,
  });

  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isDecisionMadeRef = useRef<boolean>(false);

  // Reset on new transaction
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
    isDecisionMadeRef.current = false;
    setIsExploding(false);
    enemyRef.current.hp = 100;
    enemyRef.current.x = 350;
    enemyRef.current.y = 120;
    projectilesRef.current = [];
    particlesRef.current = [];
  }, [currentTransaction.id]);

  // Execute Financial Decision
  const triggerDecision = useCallback(
    (decision: SwipeDecision) => {
      if (isDecisionMadeRef.current) return;
      isDecisionMadeRef.current = true;
      const duration = Date.now() - cardStartTimeRef.current;

      if (decision === 'KILL') {
        playSlashSound();
        triggerScreenShake();
        onCombatEvent(
          'SLASH',
          `💥 -₹${annualBounty.toFixed(2)}/YR`,
          currentTransaction.anomalyType === 'duplicate' ? 'DUPLICATE DESTROYED!' : 'ZOMBIE ANNIHILATED!'
        );
      } else if (decision === 'KEEP') {
        playCoinSound();
        onCombatEvent('KEEP', '💰 APPROVED', 'ESCORTED TO BUDGET');
      } else {
        playTaxPowerUpSound();
        triggerScreenShake();
        onCombatEvent('TAX', `⚡ +₹${currentTransaction.amount.toFixed(2)} TAX WRITE-OFF`, 'IRS SCHEDULE C BEAMED');
      }

      if (streak >= 2) {
        playComboSound(streak);
      }

      setTimeout(() => {
        onDecision(decision, duration);
      }, 80);
    },
    [annualBounty, currentTransaction, onCombatEvent, onDecision, streak, triggerScreenShake]
  );

  // Fire Projectile
  const fireWeapon = useCallback(
    (weaponType: 'LASER' | 'TRACTOR') => {
      if (isDecisionMadeRef.current) return;
      const p = playerRef.current;

      if (weaponType === 'LASER') {
        // Dual laser plasma cannons
        projectilesRef.current.push({
          x: p.x - 12,
          y: p.y - 10,
          vx: 0,
          vy: -14,
          type: 'LASER',
          color: '#FF007F',
        });
        projectilesRef.current.push({
          x: p.x + 12,
          y: p.y - 10,
          vx: 0,
          vy: -14,
          type: 'LASER',
          color: '#FF007F',
        });
        playSlashSound();
      } else {
        // Tractor EMP ring
        projectilesRef.current.push({
          x: p.x,
          y: p.y - 12,
          vx: 0,
          vy: -12,
          type: 'TRACTOR',
          color: '#00E5FF',
        });
        playTaxPowerUpSound();
      }
    },
    []
  );

  // Spawn Particle Explosions
  const spawnExplosion = (x: number, y: number, color: string, count = 25) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedWeapon('LASER');
        fireWeapon('LASER');
        spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#FF007F', 35);
        triggerDecision('KILL');
      } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedWeapon('TRACTOR');
        fireWeapon('TRACTOR');
        spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#00E5FF', 35);
        triggerDecision('TAX');
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedWeapon('PASS');
        spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#00FF88', 25);
        triggerDecision('KEEP');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fireWeapon, triggerDecision]);

  // Mouse aim movement and firing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    playerRef.current.targetX = Math.max(40, Math.min(canvas.width - 40, mouseX));
  };

  const handleCanvasClick = () => {
    if (selectedWeapon === 'PASS') {
      spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#00FF88', 20);
      triggerDecision('KEEP');
    } else {
      fireWeapon(selectedWeapon);
    }
  };

  // 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Frame
      ctx.clearRect(0, 0, width, height);

      // Smooth player interpolation towards mouse
      playerRef.current.x += (playerRef.current.targetX - playerRef.current.x) * 0.22;
      const p = playerRef.current;

      // Enemy floating oscillation
      const enemy = enemyRef.current;
      enemy.x += enemy.vx;
      if (enemy.x > width - 130 || enemy.x < 130) {
        enemy.vx *= -1;
      }
      enemy.y = 110 + Math.sin(Date.now() * 0.003) * 12;

      // 1. Draw Player Starship
      ctx.save();
      ctx.translate(p.x, p.y);

      // Thruster Flame
      ctx.fillStyle = Math.random() > 0.5 ? '#00FF88' : '#00E5FF';
      ctx.beginPath();
      ctx.moveTo(-8, 20);
      ctx.lineTo(8, 20);
      ctx.lineTo(0, 32 + Math.random() * 8);
      ctx.fill();

      // Ship Hull (Neon Vector Starfighter)
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#00FF88';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00FF88';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(0, -24); // Nose
      ctx.lineTo(20, 16);  // Right wing
      ctx.lineTo(6, 10);
      ctx.lineTo(0, 14);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-20, 16); // Left wing
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Glow
      ctx.fillStyle = '#00E5FF';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Enemy Target Ship / Boss
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      if (!isExploding) {
        // Enemy Glow Aura
        const isZombie = currentTransaction.anomalyType === 'zombie_sub';
        const isDuplicate = currentTransaction.anomalyType === 'duplicate';
        const enemyColor = isDuplicate ? '#FF3366' : isZombie ? '#FF007F' : '#00FF88';

        ctx.strokeStyle = enemyColor;
        ctx.shadowColor = enemyColor;
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.lineWidth = 2;

        // Enemy Hull Box
        ctx.beginPath();
        ctx.roundRect(-100, -45, 200, 90, 16);
        ctx.fill();
        ctx.stroke();

        // Target Name & Bounty Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentTransaction.merchant, 0, -14);

        ctx.fillStyle = '#00FF88';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText(`₹${currentTransaction.amount.toFixed(2)} (${currentTransaction.frequency})`, 0, 8);

        // Anomaly Badge Text
        ctx.fillStyle = enemyColor;
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText(currentTransaction.anomalyBadge || 'TARGET LOCKED', 0, 28);

        // Target HP Bar above ship
        const hpPercent = Math.max(0, enemy.hp / 100);
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(-80, -58, 160, 8);
        ctx.fillStyle = enemyColor;
        ctx.fillRect(-80, -58, 160 * hpPercent, 8);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(-80, -58, 160, 8);
      }
      ctx.restore();

      // 3. Update & Draw Projectiles
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Draw projectile
        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 14;

        if (proj.type === 'LASER') {
          ctx.fillRect(proj.x - 2.5, proj.y - 12, 5, 24);
        } else {
          // Tractor ring
          ctx.strokeStyle = proj.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Collision Check with Enemy
        const hitX = Math.abs(proj.x - enemy.x);
        const hitY = Math.abs(proj.y - enemy.y);

        if (hitX < 100 && hitY < 45 && !isExploding) {
          projectilesRef.current.splice(i, 1);
          spawnExplosion(proj.x, proj.y, proj.color, 15);

          if (proj.type === 'LASER') {
            enemy.hp = 0;
            setIsExploding(true);
            spawnExplosion(enemy.x, enemy.y, '#FF007F', 40);
            triggerDecision('KILL');
          } else {
            // Tractor Beam captured immediately
            enemy.hp = 0;
            setIsExploding(true);
            spawnExplosion(enemy.x, enemy.y, '#00E5FF', 35);
            triggerDecision('TAX');
          }
          continue;
        }

        // Out of screen bounds
        if (proj.y < -30) {
          projectilesRef.current.splice(i, 1);
        }
      }

      // 4. Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const part = particlesRef.current[i];
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= part.decay;

        if (part.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = part.color;
        ctx.globalAlpha = Math.max(0, part.alpha);
        ctx.shadowColor = part.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [currentTransaction, isExploding, triggerDecision]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center relative z-20 select-none">
      {/* Target Dossier HUD Header */}
      <div className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl p-4 mb-3 flex items-center justify-between shadow-xl backdrop-blur-md">
        <div>
          <span className="font-arcade text-[9px] text-slate-400 uppercase tracking-widest">
            INCOMING TARGET BOUNTY:
          </span>
          <div className="font-cyber font-black text-xl text-arcade-neonGreen">
            ₹{annualBounty.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-xs text-emerald-400 font-mono">/YR</span>
          </div>
        </div>

        {/* Weakness Roast Quote */}
        <div className="max-w-xs text-right hidden sm:block">
          <span className="font-arcade text-[8px] text-arcade-neonYellow">
            AI RADAR WEAKNESS:
          </span>
          <p className="text-xs text-slate-300 italic truncate font-sans">
            "{currentTransaction.roast}"
          </p>
        </div>
      </div>

      {/* Interactive Arcade Canvas Viewport */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950/90 shadow-[0_0_40px_rgba(0,0,0,0.9)] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={700}
          height={480}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          className="w-full h-auto block"
        />

        {/* In-game Weapon Crosshair Indicator */}
        <div className="absolute top-3 left-4 font-arcade text-[9px] text-slate-400 flex items-center gap-2">
          <span>ACTIVE WEAPON:</span>
          <span
            className={`font-bold ${
              selectedWeapon === 'LASER'
                ? 'text-arcade-neonPink'
                : selectedWeapon === 'TRACTOR'
                ? 'text-arcade-neonCyan'
                : 'text-arcade-neonGreen'
            }`}
          >
            {selectedWeapon === 'LASER'
              ? '🔴 DUAL PLASMA LASERS'
              : selectedWeapon === 'TRACTOR'
              ? '⚡ EMP TRACTOR BEAM'
              : '🛡️ ESCORT SHIELD'}
          </span>
        </div>

        <div className="absolute bottom-3 right-4 font-arcade text-[9px] text-slate-500">
          CLICK CANVAS OR PRESS KEYS TO FIRE
        </div>
      </div>

      {/* 3 Physical Arcade Weapon Trigger Buttons */}
      <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 mt-5">
        {/* WEAPON 1: LASER (SLASH / KILL) */}
        <button
          onClick={() => {
            setSelectedWeapon('LASER');
            fireWeapon('LASER');
            spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#FF007F', 35);
            triggerDecision('KILL');
          }}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 font-arcade active:scale-95 transition-all group ${
            selectedWeapon === 'LASER'
              ? 'bg-arcade-neonPink/25 border-arcade-neonPink text-arcade-neonPink shadow-[0_0_20px_rgba(255,0,127,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
          aria-label="Slash and cancel subscription"
        >
          <div className="flex items-center gap-1.5 mb-1 font-black text-xs sm:text-sm">
            <PlasmaLaserIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>BLAST &amp; CANCEL</span>
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [SPACE / A / &larr;] KILL
          </span>
        </button>

        {/* WEAPON 2: TRACTOR BEAM (TAX DEDUCT) */}
        <button
          onClick={() => {
            setSelectedWeapon('TRACTOR');
            fireWeapon('TRACTOR');
            spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#00E5FF', 35);
            triggerDecision('TAX');
          }}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 font-arcade active:scale-95 transition-all group ${
            selectedWeapon === 'TRACTOR'
              ? 'bg-arcade-neonCyan/25 border-arcade-neonCyan text-arcade-neonCyan shadow-[0_0_20px_rgba(0,229,255,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
          aria-label="Claim as tax deduction"
        >
          <div className="flex items-center gap-1.5 mb-1 font-black text-xs sm:text-sm">
            <TractorBeamIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>TRACTOR TAX</span>
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [W / &uarr;] DEDUCT
          </span>
        </button>

        {/* WEAPON 3: SHIELD PASS (KEEP) */}
        <button
          onClick={() => {
            setSelectedWeapon('PASS');
            spawnExplosion(enemyRef.current.x, enemyRef.current.y, '#00FF88', 20);
            triggerDecision('KEEP');
          }}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 font-arcade active:scale-95 transition-all group ${
            selectedWeapon === 'PASS'
              ? 'bg-arcade-neonGreen/25 border-arcade-neonGreen text-arcade-neonGreen shadow-[0_0_20px_rgba(0,255,136,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
          aria-label="Keep and approve expense"
        >
          <div className="flex items-center gap-1.5 mb-1 font-black text-xs sm:text-sm">
            <ShieldVaultIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>ESCORT &amp; KEEP</span>
          </div>
          <span className="text-[9px] opacity-80 uppercase tracking-widest font-mono">
            [D / &rarr;] APPROVE
          </span>
        </button>
      </div>

      {/* Arcade Instructions */}
      <div className="mt-3 text-xs font-mono text-slate-400 text-center flex items-center justify-center gap-2">
        <span className="font-arcade text-[9px] text-arcade-neonYellow">CONTROLS:</span>
        <span>Mouse moves starship &bull; Click or Spacebar fires Lasers &bull; W fires Tractor EMP &bull; D escorts to Budget</span>
      </div>
    </div>
  );
};
