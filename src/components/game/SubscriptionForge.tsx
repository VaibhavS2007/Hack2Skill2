import React, { useState } from 'react';
import { Plus, Trash2, Flame, RotateCcw } from 'lucide-react';
import { Transaction, BillingFrequency } from '../../core/engine/types';
import { sanitizeForCsv } from '../../core/engine/csvProcessor';
import { classifyAnomaly } from '../../core/engine/anomalyDetector';
import { playCoinSound, playSlashSound, playTaxPowerUpSound } from '../../utils/soundEffects';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card';
import { ThreeDMarquee } from '../ui/3d-marquee';
import {
  FleetForgeIcon,
  CyberDatapadIcon,
  StarfighterShipIcon,
  RupeeCashTokenIcon,
} from '../ui/CyberIcons';

interface SubscriptionForgeProps {
  onLaunchBattle: (customTransactions: Transaction[]) => void;
  onBackToHome: () => void;
}

interface PresetSubscription {
  name: string;
  amount: number;
  frequency: BillingFrequency;
  category: string;
  icon: string;
}

const POPULAR_PRESETS: PresetSubscription[] = [
  { name: 'Cult.fit Elite Pass', amount: 1799, frequency: 'monthly', category: 'Health & Fitness', icon: '🏋️' },
  { name: 'Disney+ Hotstar Super', amount: 899, frequency: 'annual', category: 'OTT & Entertainment', icon: '🏏' },
  { name: 'Netflix Premium 4K', amount: 649, frequency: 'monthly', category: 'OTT & Entertainment', icon: '🍿' },
  { name: 'Swiggy One Membership', amount: 899, frequency: 'annual', category: 'Food & Delivery', icon: '🍔' },
  { name: 'Zomato Gold', amount: 999, frequency: 'annual', category: 'Food & Dining', icon: '🍕' },
  { name: 'Spotify Premium', amount: 119, frequency: 'monthly', category: 'Music & Audio', icon: '🎵' },
  { name: 'YouTube Premium Family', amount: 189, frequency: 'monthly', category: 'Music & Video', icon: '▶️' },
  { name: 'OpenAI ChatGPT Plus', amount: 1999, frequency: 'monthly', category: 'AI & Developer Tools', icon: '🤖' },
  { name: 'GitHub Copilot Pro', amount: 850, frequency: 'monthly', category: 'Developer Tools', icon: '💻' },
  { name: 'AWS Mumbai Cloud', amount: 2850, frequency: 'monthly', category: 'Cloud Infrastructure', icon: '☁️' },
  { name: 'JioFiber Commercial Broadband', amount: 1179, frequency: 'monthly', category: 'Internet & Work', icon: '⚡' },
  { name: 'Amazon Prime Annual', amount: 1499, frequency: 'annual', category: 'Delivery & Video', icon: '📦' },
  { name: 'Apple iCloud+ 50GB', amount: 75, frequency: 'monthly', category: 'Cloud Storage', icon: '🍏' },
  { name: 'Google One 100GB Storage', amount: 130, frequency: 'monthly', category: 'Cloud Storage', icon: '📁' },
  { name: 'SonyLIV Annual', amount: 999, frequency: 'annual', category: 'OTT & Entertainment', icon: '📺' },
  { name: 'Truecaller Gold', amount: 549, frequency: 'annual', category: 'Mobile Utilities', icon: '📱' },
];

export const SubscriptionForge: React.FC<SubscriptionForgeProps> = ({
  onLaunchBattle,
  onBackToHome,
}) => {
  const [fleet, setFleet] = useState<Transaction[]>([
    {
      id: 'forge-1',
      merchant: 'Cult.fit Elite Pass',
      amount: 1799,
      date: new Date().toISOString().split('T')[0],
      category: 'Health & Fitness',
      frequency: 'monthly',
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Zombie Gym Sub 🏋️',
      roast: 'Jan 1st New Year resolution draining your bank account while sneakers collect dust.',
      isRecurring: true,
    },
    {
      id: 'forge-2',
      merchant: 'Disney+ Hotstar Super',
      amount: 899,
      date: new Date().toISOString().split('T')[0],
      category: 'OTT & Entertainment',
      frequency: 'annual',
      anomalyType: 'zombie_sub',
      anomalyBadge: 'Dormant OTT Sub 📺',
      roast: 'Subscribed for IPL, renewed automatically via e-mandate.',
      isRecurring: true,
    },
    {
      id: 'forge-3',
      merchant: 'OpenAI ChatGPT Plus',
      amount: 1999,
      date: new Date().toISOString().split('T')[0],
      category: 'AI & Developer Tools',
      frequency: 'monthly',
      anomalyType: 'normal',
      anomalyBadge: 'Tax Deductible Dev Asset 💻',
      roast: 'Essential coding machinery & freelance partner. 100% business write-off.',
      isRecurring: true,
    },
  ]);

  // Custom Input State
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customFrequency, setCustomFrequency] = useState<BillingFrequency>('monthly');
  const [customCategory, setCustomCategory] = useState('Personal Subscriptions');
  const [marqueeView, setMarqueeView] = useState<'3d-marquee' | 'grid'>('3d-marquee');

  // Compute live bleed metrics
  const totalMonthlyBleed = fleet.reduce((acc, curr) => {
    return acc + (curr.frequency === 'monthly' ? curr.amount : curr.amount / 12);
  }, 0);

  const totalAnnualDamage = fleet.reduce((acc, curr) => {
    return acc + (curr.frequency === 'monthly' ? curr.amount * 12 : curr.amount);
  }, 0);

  // Add Preset to fleet
  const handleAddPreset = (preset: PresetSubscription) => {
    const anomalyInfo = classifyAnomaly({
      id: `forge-${Date.now()}-${Math.random()}`,
      merchant: preset.name,
      amount: preset.amount,
      date: new Date().toISOString().split('T')[0],
      category: preset.category,
      frequency: preset.frequency,
      isRecurring: true,
    });

    const newTx: Transaction = {
      id: `forge-${Date.now()}-${Math.random()}`,
      merchant: preset.name,
      amount: preset.amount,
      date: new Date().toISOString().split('T')[0],
      category: preset.category,
      frequency: preset.frequency,
      anomalyType: anomalyInfo.anomalyType,
      anomalyBadge: anomalyInfo.anomalyBadge,
      roast: anomalyInfo.roast,
      isRecurring: true,
    };

    setFleet((prev) => [...prev, newTx]);
    playCoinSound();
  };

  // Add Custom Item
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customAmount) return;

    const parsedAmount = Math.abs(parseFloat(customAmount) || 0);
    if (parsedAmount === 0) return;

    const anomalyInfo = classifyAnomaly({
      id: `forge-${Date.now()}-${Math.random()}`,
      merchant: customName.trim(),
      amount: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      category: customCategory,
      frequency: customFrequency,
      isRecurring: true,
    });

    const newTx: Transaction = {
      id: `forge-${Date.now()}-${Math.random()}`,
      merchant: customName.trim(),
      amount: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      category: customCategory,
      frequency: customFrequency,
      anomalyType: anomalyInfo.anomalyType,
      anomalyBadge: anomalyInfo.anomalyBadge,
      roast: anomalyInfo.roast,
      isRecurring: true,
    };

    setFleet((prev) => [...prev, newTx]);
    setCustomName('');
    setCustomAmount('');
    playTaxPowerUpSound();
  };

  // Duplicate an item to simulate double-charge glitch
  const handleDuplicateItem = (item: Transaction) => {
    const duplicate: Transaction = {
      ...item,
      id: `forge-dup-${Date.now()}`,
      anomalyType: 'duplicate',
      anomalyBadge: 'Double Charge Alert 🚨',
      roast: `Billed twice for ${item.merchant} in the same billing cycle! Bank e-mandate glitch.`,
    };
    setFleet((prev) => [...prev, duplicate]);
    playSlashSound();
  };

  // Delete item from fleet
  const handleDeleteItem = (id: string) => {
    setFleet((prev) => prev.filter((item) => item.id !== id));
  };

  // Update item amount
  const handleUpdateAmount = (id: string, newAmount: number) => {
    setFleet((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: Math.max(1, newAmount) } : item))
    );
  };

  // Download Generated CSV
  const handleExportCsv = () => {
    const headers = ['Date', 'Merchant', 'Amount', 'Category', 'Billing_Cycle'];
    const rows = fleet.map((item) => [
      sanitizeForCsv(item.date),
      sanitizeForCsv(item.merchant),
      sanitizeForCsv(item.amount.toFixed(2)),
      sanitizeForCsv(item.category),
      sanitizeForCsv(item.frequency === 'annual' ? 'Annual' : 'Monthly'),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'my_custom_subscriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 z-20 relative select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-arcade-neonCyan/15 border border-arcade-neonCyan text-arcade-neonCyan text-[10px] font-arcade uppercase tracking-wider mb-2">
            <FleetForgeIcon className="w-3.5 h-3.5" />
            <span>SUBSCRIPTION DOCKYARD &bull; FLEET FORGE MINIGAME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-cyber tracking-tight">
            FORGE YOUR SUBSCRIPTION FLEET
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
            Tap popular subscription presets or add your real monthly recurring bills. Then launch into battle to blast them!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-arcade text-[9px] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>
        </div>
      </div>

      {/* Live Bleed Threat Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonPink shadow-[0_0_20px_rgba(255,0,127,0.25)] flex flex-col items-center text-center group/card justify-center">
            <CardItem translateZ="25" className="flex items-center gap-1.5 mb-1">
              <RupeeCashTokenIcon className="w-3.5 h-3.5" />
              <span className="font-arcade text-[9px] text-slate-400 uppercase tracking-widest">
                MONTHLY AUTO-DEBIT BLEED
              </span>
            </CardItem>
            <CardItem translateZ="45" className="font-cyber text-2xl sm:text-3xl font-extrabold text-arcade-neonPink">
              ₹{totalMonthlyBleed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              <span className="text-xs font-mono text-pink-400">/mo</span>
            </CardItem>
          </CardBody>
        </CardContainer>

        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonYellow shadow-[0_0_20px_rgba(255,230,0,0.25)] flex flex-col items-center text-center group/card justify-center">
            <CardItem translateZ="25" className="font-arcade text-[9px] text-slate-400 uppercase tracking-widest mb-1">
              ANNUAL WALLET DAMAGE
            </CardItem>
            <CardItem translateZ="45" className="font-cyber text-2xl sm:text-3xl font-extrabold text-arcade-neonYellow">
              ₹{totalAnnualDamage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              <span className="text-xs font-mono text-yellow-300">/yr</span>
            </CardItem>
          </CardBody>
        </CardContainer>

        <CardContainer containerClassName="w-full py-0" className="w-full h-full">
          <CardBody className="w-full h-full p-4 rounded-2xl bg-slate-950/90 border-2 border-arcade-neonGreen shadow-[0_0_20px_rgba(0,255,136,0.25)] flex flex-col items-center text-center group/card justify-center">
            <CardItem translateZ="25" className="font-arcade text-[9px] text-slate-400 uppercase tracking-widest mb-1">
              FLEET SIZE (TARGETS)
            </CardItem>
            <CardItem translateZ="45" className="font-cyber text-2xl sm:text-3xl font-extrabold text-arcade-neonGreen">
              {fleet.length} <span className="text-xs font-arcade text-emerald-400">SHIPS</span>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* Step 1: 1-Tap Quick Add Presets (3D Perspective Marquee / Grid) */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-[10px] text-arcade-neonCyan uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>1-TAP QUICK ADD POPULAR INDIAN SUBSCRIPTIONS:</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-arcade-neonGreen/10 border border-arcade-neonGreen/30 text-arcade-neonGreen text-[9px] font-mono font-bold animate-pulse">
              3D PERSPECTIVE FLOW
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setMarqueeView('3d-marquee')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  marqueeView === '3d-marquee'
                    ? 'bg-arcade-neonCyan text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✦ 3D MARQUEE
              </button>
              <button
                type="button"
                onClick={() => setMarqueeView('grid')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  marqueeView === 'grid'
                    ? 'bg-arcade-neonCyan text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⊞ COMPACT GRID
              </button>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Click any card to add</span>
          </div>
        </div>

        {marqueeView === '3d-marquee' ? (
          <ThreeDMarquee
            items={POPULAR_PRESETS}
            className="h-[360px] sm:h-[400px]"
            transformStyle="rotateX(46deg) rotateY(0deg) rotateZ(-8deg) translateY(-20px)"
            gridLineColor="rgba(0, 229, 255, 0.3)"
            gridLineColorDark="rgba(255, 0, 127, 0.4)"
            renderItem={(preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="w-full text-left p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/95 border-2 border-slate-700/80 hover:border-arcade-neonGreen transition-all duration-200 group/card shadow-xl hover:shadow-[0_0_25px_rgba(0,255,136,0.35)] cursor-pointer select-none active:scale-95"
                title={`Add ${preset.name} (₹${preset.amount}/${preset.frequency})`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl group-hover/card:scale-125 transition-transform duration-200 inline-block">
                    {preset.icon}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                    {preset.frequency === 'annual' ? 'yr' : 'mo'}
                  </span>
                </div>
                <div className="font-cyber font-bold text-xs text-white truncate w-full group-hover/card:text-arcade-neonGreen transition-colors">
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-400 font-sans truncate mb-2">
                  {preset.category}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="font-mono text-xs font-bold text-arcade-neonGreen">
                    ₹{preset.amount}
                  </span>
                  <span className="text-[9px] font-mono text-arcade-neonCyan font-bold opacity-0 group-hover/card:opacity-100 transition-opacity">
                    +ADD TO FLEET
                  </span>
                </div>
              </button>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {POPULAR_PRESETS.map((preset) => (
              <CardContainer key={preset.name} containerClassName="w-full py-0" className="w-full h-full">
                <CardBody className="w-full h-full">
                  <button
                    onClick={() => handleAddPreset(preset)}
                    className="w-full h-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-arcade-neonGreen hover:bg-slate-800 transition-all text-left flex flex-col justify-between group active:scale-90"
                    title={`Add ${preset.name} (₹${preset.amount}/${preset.frequency})`}
                  >
                    <CardItem translateZ="30" className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {preset.icon}
                    </CardItem>
                    <CardItem translateZ="15" className="font-cyber text-xs font-bold text-white truncate w-full">
                      {preset.name.split(' ')[0]}
                    </CardItem>
                    <CardItem translateZ="25" className="text-[10px] font-mono text-arcade-neonGreen font-bold">
                      ₹{preset.amount}
                    </CardItem>
                  </button>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Custom Subscription Adder Form */}
      <form
        onSubmit={handleAddCustom}
        className="p-5 rounded-2xl bg-slate-950/90 border-2 border-slate-800 mb-8 flex flex-wrap items-center gap-3 backdrop-blur-md"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-arcade text-slate-400 mb-1 uppercase">
            Service / Subscription Name
          </label>
          <input
            type="text"
            required
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g. Zee5, Blinkit Pass, Gym, Headspace"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-arcade-neonCyan focus:outline-none"
          />
        </div>

        <div className="w-36">
          <label className="block text-[10px] font-arcade text-slate-400 mb-1 uppercase">
            Amount (₹)
          </label>
          <input
            type="number"
            required
            min="1"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="e.g. 499"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-arcade-neonGreen font-mono font-bold text-sm focus:border-arcade-neonGreen focus:outline-none"
          />
        </div>

        <div className="w-40">
          <label className="block text-[10px] font-arcade text-slate-400 mb-1 uppercase">
            Category
          </label>
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-arcade-neonYellow focus:outline-none"
          >
            <option value="Health & Fitness">Health &amp; Fitness</option>
            <option value="OTT & Entertainment">OTT &amp; Entertainment</option>
            <option value="Food & Delivery">Food &amp; Delivery</option>
            <option value="Developer Tools">Developer Tools</option>
            <option value="Cloud Storage">Cloud Storage</option>
            <option value="Personal Subscriptions">Personal Subscriptions</option>
          </select>
        </div>

        <div className="w-36">
          <label className="block text-[10px] font-arcade text-slate-400 mb-1 uppercase">
            Billing Frequency
          </label>
          <select
            value={customFrequency}
            onChange={(e) => setCustomFrequency(e.target.value as BillingFrequency)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-arcade-neonYellow focus:outline-none"
          >
            <option value="monthly">Monthly (/mo)</option>
            <option value="annual">Annual (/yr)</option>
          </select>
        </div>

        <div className="self-end pt-2 sm:pt-0">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-arcade-neonGreen text-slate-950 font-arcade text-xs font-black flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD TO FLEET</span>
          </button>
        </div>
      </form>

      {/* Step 3: Editable Fleet Roster Table */}
      <div className="mb-8 rounded-2xl border-2 border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-xs text-white">YOUR ARMED FLEET ROSTER</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-arcade-neonCyan font-bold">
              {fleet.length} Active Targets
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:block">
            Duplicate any item to simulate an auto-debit bank glitch!
          </span>
        </div>

        {fleet.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-mono italic">
            Your fleet is empty! Tap any preset above or enter a subscription to begin.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="p-3">Merchant / Service</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount (₹)</th>
                  <th className="p-3">Cycle</th>
                  <th className="p-3">Anomaly Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {fleet.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white font-cyber">{item.merchant}</td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-bold text-arcade-neonGreen">
                        <span>₹</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            handleUpdateAmount(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-arcade-neonGreen font-mono font-bold focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase">
                        {item.frequency}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.anomalyType === 'duplicate'
                            ? 'bg-arcade-neonRed/20 text-arcade-neonRed border border-arcade-neonRed animate-pulse'
                            : item.anomalyType === 'zombie_sub'
                            ? 'bg-arcade-neonPink/20 text-arcade-neonPink border border-arcade-neonPink'
                            : 'bg-arcade-neonGreen/20 text-arcade-neonGreen border border-arcade-neonGreen'
                        }`}
                      >
                        {item.anomalyBadge || 'Standard Sub'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleDuplicateItem(item)}
                        className="px-2 py-1 rounded bg-arcade-neonRed/10 border border-arcade-neonRed/30 text-arcade-neonRed hover:bg-arcade-neonRed hover:text-white transition-all text-[10px] font-bold"
                        title="Simulate bank double-debit glitch"
                      >
                        Duplicate 🚨
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition-colors"
                        title="Remove subscription"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Step 4: Big Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/95 border-2 border-slate-800">
        <button
          onClick={handleExportCsv}
          disabled={fleet.length === 0}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-arcade-neonCyan text-arcade-neonCyan font-arcade text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 group"
        >
          <CyberDatapadIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>DOWNLOAD AS CSV</span>
        </button>

        <button
          onClick={() => onLaunchBattle(fleet)}
          disabled={fleet.length === 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-arcade-neonPink via-arcade-neonGreen to-arcade-neonCyan text-slate-950 font-arcade text-xs font-black flex items-center justify-center gap-2 hover:brightness-125 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,136,0.5)] disabled:opacity-40 group cursor-pointer"
        >
          <StarfighterShipIcon className="w-4 h-4 group-hover:scale-110 transition-transform" glow={false} />
          <span>LAUNCH INTO BATTLE WITH THIS FLEET!</span>
        </button>
      </div>
    </div>
  );
};
