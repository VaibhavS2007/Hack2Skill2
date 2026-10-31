import { useState, useEffect, useCallback, useRef } from 'react';
import { LandingHero } from './components/game/LandingHero';
import { ArcadeHUD } from './components/game/ArcadeHUD';
import { ArcadeShooter } from './components/game/ArcadeShooter';
import { VictoryScorecard } from './components/game/VictoryScorecard';
import { SubscriptionForge } from './components/game/SubscriptionForge';
import { ArcadeCanvasBackground } from './components/game/ArcadeCanvasBackground';
import { CombatVfxOverlay, CombatTextEvent } from './components/game/CombatVfxOverlay';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DEMO_STATEMENT } from './data/demoStatement';
import { Transaction, SwipedTransaction, SwipeDecision, GameStats } from './core/engine/types';
import { calculateScoreForDecision, calculateGameStats } from './core/engine/savingsCalculator';
import {
  toggleAudioMute,
  isAudioMuted,
  toggleBgm,
  isBgmActive,
  startSynthwaveBgm,
  stopSynthwaveBgm,
} from './utils/soundEffects';
import { Volume2, VolumeX } from 'lucide-react';
import {
  StarfighterShipIcon,
  FleetForgeIcon,
  SoundSynthwaveIcon,
  ShieldVaultIcon,
} from './components/ui/CyberIcons';

type GameState = 'landing' | 'playing' | 'finished' | 'forge';

export function App() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [deck, setDeck] = useState<Transaction[]>(DEMO_STATEMENT);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipedTransactions, setSwipedTransactions] = useState<SwipedTransaction[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(isAudioMuted());
  const [isBgmOn, setIsBgmOn] = useState<boolean>(isBgmActive());
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('GROQ_API_KEY') || import.meta.env.VITE_GROQ_API_KEY || '';
    }
    return '';
  });

  const handleUpdateGroqApiKey = useCallback((key: string) => {
    setGroqApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('GROQ_API_KEY', key);
    }
  }, []);

  // Arcade VFX States
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [laserSlash, setLaserSlash] = useState<boolean>(false);
  const [combatEvents, setCombatEvents] = useState<CombatTextEvent[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 250);
  }, []);

  const handleCombatEvent = useCallback(
    (type: 'SLASH' | 'KEEP' | 'TAX', text: string, subText?: string) => {
      const newEvent: CombatTextEvent = {
        id: `vfx-${Date.now()}-${Math.random()}`,
        type,
        text,
        subText,
        x: 50 + (Math.random() * 16 - 8),
        y: 45 + (Math.random() * 10 - 5),
      };

      if (type === 'SLASH') {
        setLaserSlash(true);
        setTimeout(() => setLaserSlash(false), 220);
      }

      setCombatEvents((prev) => [...prev, newEvent]);
      setTimeout(() => {
        setCombatEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
      }, 1000);
    },
    []
  );

  // Transition to Finished State
  const finishGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopSynthwaveBgm();
    setIsBgmOn(false);

    const computedStats = calculateGameStats(
      swipedTransactions,
      timeRemaining,
      highestStreak,
      score
    );
    setFinalStats(computedStats);
    setGameState('finished');
  }, [swipedTransactions, timeRemaining, highestStreak, score]);

  // Timer countdown hook during 'playing' state
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, finishGame]);

  // Start demo deck
  const handleStartDemo = () => {
    setDeck(DEMO_STATEMENT);
    setCurrentIndex(0);
    setSwipedTransactions([]);
    setTimeRemaining(60);
    setStreak(0);
    setHighestStreak(0);
    setScore(0);
    setAnnualSavings(0);
    setGameState('playing');

    startSynthwaveBgm();
    setIsBgmOn(true);
  };

  // Start with custom uploaded CSV transactions
  const handleCustomTransactionsLoaded = (customTxs: Transaction[]) => {
    setDeck(customTxs);
    setCurrentIndex(0);
    setSwipedTransactions([]);
    setTimeRemaining(Math.min(90, Math.max(45, customTxs.length * 4)));
    setStreak(0);
    setHighestStreak(0);
    setScore(0);
    setAnnualSavings(0);
    setGameState('playing');

    startSynthwaveBgm();
    setIsBgmOn(true);
  };

  // Start with fleet forged inside the app
  const handleLaunchBattleFromForge = (customFleet: Transaction[]) => {
    setDeck(customFleet);
    setCurrentIndex(0);
    setSwipedTransactions([]);
    setTimeRemaining(Math.min(100, Math.max(45, customFleet.length * 5)));
    setStreak(0);
    setHighestStreak(0);
    setScore(0);
    setAnnualSavings(0);
    setGameState('playing');

    startSynthwaveBgm();
    setIsBgmOn(true);
  };

  // Handle a card decision (KILL / KEEP / TAX)
  const handleDecision = (decision: SwipeDecision, durationMs: number) => {
    const currentTx = deck[currentIndex];
    if (!currentTx) return;

    // Score & Streak calculation
    const scoreCalc = calculateScoreForDecision(durationMs, streak);
    setStreak(scoreCalc.newStreak);
    setHighestStreak((prev) => Math.max(prev, scoreCalc.newStreak));
    setScore((prev) => prev + scoreCalc.points);

    // Track swiped transaction
    const swipedItem: SwipedTransaction = {
      ...currentTx,
      decision,
      decisionTimestamp: Date.now(),
      decisionDurationMs: durationMs,
      streakMultiplierAtDecision: scoreCalc.multiplier,
    };

    const updatedSwiped = [...swipedTransactions, swipedItem];
    setSwipedTransactions(updatedSwiped);

    // Update real-time annual savings ticker
    if (decision === 'KILL') {
      const addedAnnual =
        currentTx.anomalyType === 'duplicate'
          ? currentTx.amount
          : currentTx.frequency === 'monthly'
          ? currentTx.amount * 12
          : currentTx.frequency === 'weekly'
          ? currentTx.amount * 52
          : currentTx.amount;
      setAnnualSavings((prev) => Math.round((prev + addedAnnual) * 100) / 100);
    }

    // Move to next card or complete
    if (currentIndex + 1 >= deck.length) {
      setTimeout(() => {
        const computedStats = calculateGameStats(
          updatedSwiped,
          timeRemaining,
          Math.max(highestStreak, scoreCalc.newStreak),
          score + scoreCalc.points
        );
        setFinalStats(computedStats);
        stopSynthwaveBgm();
        setIsBgmOn(false);
        setGameState('finished');
      }, 300);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleToggleMute = () => {
    const newState = toggleAudioMute();
    setIsMuted(newState);
  };

  const handleToggleBgm = () => {
    const newState = toggleBgm();
    setIsBgmOn(newState);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-arcade-bg text-slate-100 flex flex-col justify-between selection:bg-arcade-neonPink selection:text-white relative overflow-hidden font-sans">
        {/* Skip to Main Content Link for WCAG Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-arcade-neonGreen focus:text-slate-950 focus:font-mono focus:font-bold focus:rounded-xl focus:shadow-2xl"
        >
          Skip to main battle content
        </a>

        {/* 1. 60 FPS 3D Synthwave Horizon & Perspective Canvas Grid */}
        <ArcadeCanvasBackground screenShake={screenShake} />

        {/* 2. Floating Combat Damage Numbers & Laser Slashes */}
        <CombatVfxOverlay events={combatEvents} laserSlash={laserSlash} />

        {/* Global Arcade Header */}
        <header role="banner" className="border-b border-arcade-border/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            onClick={() => {
              stopSynthwaveBgm();
              setIsBgmOn(false);
              setGameState('landing');
            }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 group-hover:border-arcade-neonGreen flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)] group-hover:scale-105 transition-all">
              <StarfighterShipIcon className="w-5 h-5" />
            </div>
            <span className="font-cyber font-black text-xl tracking-wider text-white group-hover:text-arcade-neonGreen transition-colors drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              SPEND<span className="text-arcade-neonGreen">INTRUDERS</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Forge Fleet Shortcut */}
            <button
              onClick={() => {
                stopSynthwaveBgm();
                setIsBgmOn(false);
                setGameState('forge');
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all font-arcade text-[9px] flex items-center gap-1.5 ${
                gameState === 'forge'
                  ? 'bg-arcade-neonCyan/20 border-arcade-neonCyan text-arcade-neonCyan shadow-[0_0_15px_#00E5FF]'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-arcade-neonCyan'
              }`}
            >
              <FleetForgeIcon className="w-3.5 h-3.5" />
              <span>FORGE FLEET</span>
            </button>

            {/* Quick Audio Controls in Nav with 21st.dev Synthwave Visualizer */}
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-xl border transition-all ${
                isBgmOn
                  ? 'bg-arcade-neonPink/20 border-arcade-neonPink text-arcade-neonPink shadow-[0_0_10px_#FF007F]'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={isBgmOn ? 'Mute 80s Synthwave Music' : 'Start 80s Synthwave Music'}
              aria-label="Toggle Synthwave Music"
            >
              <SoundSynthwaveIcon className="w-4 h-4" active={isBgmOn} />
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-600" /> : <Volume2 className="w-4 h-4 text-arcade-neonCyan" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400">
              <ShieldVaultIcon className="w-3.5 h-3.5" />
              <span>FTC &bull; CCPA Compliant</span>
            </div>

            {gameState !== 'landing' && (
              <button
                onClick={() => {
                  stopSynthwaveBgm();
                  setIsBgmOn(false);
                  setGameState('landing');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800 font-arcade text-[9px]"
              >
                EXIT
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main id="main-content" role="main" className="flex-1 flex flex-col justify-center py-6 relative z-10">
        {gameState === 'landing' && (
          <LandingHero
            onStartDemo={handleStartDemo}
            onCustomTransactionsLoaded={handleCustomTransactionsLoaded}
            onOpenForge={() => setGameState('forge')}
          />
        )}

        {gameState === 'forge' && (
          <SubscriptionForge
            onLaunchBattle={handleLaunchBattleFromForge}
            onBackToHome={() => setGameState('landing')}
          />
        )}

        {gameState === 'playing' && deck[currentIndex] && (
          <div className="w-full flex flex-col items-center">
            <ArcadeHUD
              timeRemainingSec={timeRemaining}
              annualSavings={annualSavings}
              streak={streak}
              currentIndex={currentIndex}
              totalCards={deck.length}
              score={score}
              isMuted={isMuted}
              isBgmActive={isBgmOn}
              onToggleMute={handleToggleMute}
              onToggleBgm={handleToggleBgm}
              onEndGame={finishGame}
            />

            <ArcadeShooter
              currentTransaction={deck[currentIndex]}
              onDecision={handleDecision}
              streak={streak}
              onCombatEvent={handleCombatEvent}
              triggerScreenShake={triggerScreenShake}
            />
          </div>
        )}

        {gameState === 'finished' && finalStats && (
          <VictoryScorecard
            stats={finalStats}
            swipedTransactions={swipedTransactions}
            onPlayAgain={handleStartDemo}
            groqApiKey={groqApiKey}
            onUpdateApiKey={handleUpdateGroqApiKey}
          />
        )}
      </main>

      {/* Global Arcade Footer */}
      <footer role="contentinfo" className="border-t border-slate-800/80 bg-slate-950/90 py-5 text-center text-xs font-mono text-slate-400 relative z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StarfighterShipIcon className="w-4 h-4" />
            <span className="font-arcade text-[9px] text-white">SPENDINTRUDERS // ARCADE CHORE ENGINE</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Deployed on Google Cloud Run &bull; 100% Client-Side Privacy
          </div>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}

export default App;
