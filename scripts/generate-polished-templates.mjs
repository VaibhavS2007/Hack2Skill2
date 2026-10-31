import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Polished Industry Design Templates</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; background-color: #050608; color: #EDEDED; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: -0.015em; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-8 space-y-16">

  <!-- ============================================================== -->
  <!-- TEMPLATE A: LINEAR.APP DESIGN SYSTEM                           -->
  <!-- ============================================================== -->
  <div id="template-linear" class="max-w-5xl mx-auto bg-[#0C0D11] border border-white/[0.08] rounded-2xl p-7 shadow-2xl">
    <!-- Linear Navigation Header -->
    <div class="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.06]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 flex items-center justify-center text-[#828FFF]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-white">Subscription Fleet Forge</h2>
            <span class="px-2 py-0.5 rounded-full bg-white/[0.06] text-[11px] font-medium text-neutral-400">Option A &bull; Linear Style</span>
          </div>
          <p class="text-xs text-neutral-400 mt-0.5">Triage, categorize, and prepare monthly auto-debits for the battle engine.</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-300 transition">Back to Home</button>
      </div>
    </div>

    <!-- Linear Key Metric Tiles -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] transition">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-neutral-400">Monthly Recurring Bleed</span>
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-white font-mono">₹3,873</span>
          <span class="text-xs text-neutral-500 font-mono">/mo</span>
        </div>
        <div class="text-[11px] text-rose-400 mt-1 font-medium flex items-center gap-1">
          <span>+₹899 duplicate debit detected</span>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] transition">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-neutral-400">Annualized Outflow</span>
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-white font-mono">₹46,475</span>
          <span class="text-xs text-neutral-500 font-mono">/yr</span>
        </div>
        <div class="text-[11px] text-neutral-400 mt-1">12-month compounding total</div>
      </div>

      <div class="p-4 rounded-xl bg-[#121318] border border-white/[0.06] hover:border-white/[0.12] transition">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-neutral-400">Armed Targets</span>
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-white font-mono">3</span>
          <span class="text-xs text-neutral-500">Subscriptions</span>
        </div>
        <div class="text-[11px] text-emerald-400 mt-1 font-medium">1 Tax write-off eligible</div>
      </div>
    </div>

    <!-- Quick-Add Indian Subscriptions -->
    <div class="p-4 rounded-xl bg-[#121318] border border-white/[0.06] mb-6">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-medium text-neutral-300">Quick-Add Popular Indian Services</span>
        <span class="text-neutral-500 text-[11px]">Click to add to roster</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 text-xs text-neutral-200 transition">
          <span class="w-4 h-4 rounded bg-[#FF4156]/20 text-[#FF4156] flex items-center justify-center text-[10px] font-bold">C</span>
          <span class="font-medium">Cult.fit</span>
          <span class="text-neutral-400 font-mono text-[11px]">₹1,799</span>
        </button>
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 text-xs text-neutral-200 transition">
          <span class="w-4 h-4 rounded bg-[#0088FF]/20 text-[#0088FF] flex items-center justify-center text-[10px] font-bold">H</span>
          <span class="font-medium">Disney+ Hotstar</span>
          <span class="text-neutral-400 font-mono text-[11px]">₹899</span>
        </button>
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 text-xs text-neutral-200 transition">
          <span class="w-4 h-4 rounded bg-[#FC8019]/20 text-[#FC8019] flex items-center justify-center text-[10px] font-bold">S</span>
          <span class="font-medium">Swiggy One</span>
          <span class="text-neutral-400 font-mono text-[11px]">₹899</span>
        </button>
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 text-xs text-neutral-200 transition">
          <span class="w-4 h-4 rounded bg-[#10A37F]/20 text-[#10A37F] flex items-center justify-center text-[10px] font-bold">AI</span>
          <span class="font-medium">ChatGPT Plus</span>
          <span class="text-neutral-400 font-mono text-[11px]">₹1,999</span>
        </button>
        <button class="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 text-xs text-neutral-200 transition">
          <span class="w-4 h-4 rounded bg-[#FF9900]/20 text-[#FF9900] flex items-center justify-center text-[10px] font-bold">A</span>
          <span class="font-medium">AWS Cloud</span>
          <span class="text-neutral-400 font-mono text-[11px]">₹2,850</span>
        </button>
      </div>
    </div>

    <!-- Linear Issue-Style Table -->
    <div class="rounded-xl border border-white/[0.06] overflow-hidden bg-[#121318] mb-6">
      <div class="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
        <span class="font-medium">Active Statement Fleet (3 items)</span>
        <span>Status &amp; Triage Category</span>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-[#FF4156]/20 text-[#FF4156] flex items-center justify-center text-xs font-bold">C</div>
            <div>
              <div class="text-xs font-medium text-white flex items-center gap-2">
                <span>Cult.fit Elite Pass</span>
                <span class="text-neutral-500 font-normal">Health &amp; Fitness</span>
              </div>
              <div class="text-[11px] text-neutral-500">Unused gym resolution &bull; Last checked 114 days ago</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs font-medium text-white">₹1,799.00 <span class="text-neutral-500 font-sans text-[11px]">/mo</span></span>
            <span class="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Zombie Sub
            </span>
            <button class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs border border-white/[0.06]">Duplicate</button>
          </div>
        </div>

        <div class="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-[#0088FF]/20 text-[#0088FF] flex items-center justify-center text-xs font-bold">H</div>
            <div>
              <div class="text-xs font-medium text-white flex items-center gap-2">
                <span>Disney+ Hotstar Super</span>
                <span class="text-neutral-500 font-normal">Entertainment</span>
              </div>
              <div class="text-[11px] text-neutral-500">Annual cricket auto-debit renewal</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs font-medium text-white">₹899.00 <span class="text-neutral-500 font-sans text-[11px]">/yr</span></span>
            <span class="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Dormant OTT
            </span>
            <button class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs border border-white/[0.06]">Duplicate</button>
          </div>
        </div>

        <div class="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded bg-[#10A37F]/20 text-[#10A37F] flex items-center justify-center text-xs font-bold">AI</div>
            <div>
              <div class="text-xs font-medium text-white flex items-center gap-2">
                <span>OpenAI ChatGPT Plus</span>
                <span class="text-neutral-500 font-normal">Dev &amp; Productivity</span>
              </div>
              <div class="text-[11px] text-neutral-500">Work AI tool &bull; Eligible for Sec 44ADA deduction</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs font-medium text-white">₹1,999.00 <span class="text-neutral-500 font-sans text-[11px]">/mo</span></span>
            <span class="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-medium flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              Tax Asset (Sec 44ADA)
            </span>
            <button class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs border border-white/[0.06]">Duplicate</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between mb-8">
      <button class="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-300 transition">Download Fleet CSV</button>
      <button class="px-5 py-2 rounded-lg bg-[#5E6AD2] hover:bg-[#6875E5] text-white text-xs font-medium shadow-lg shadow-[#5E6AD2]/20 transition flex items-center gap-2">
        <span>Launch Battle Strike</span>
        <span>→</span>
      </button>
    </div>

    <!-- Linear AI Intelligence & Groq Audit Section -->
    <div class="pt-6 border-t border-white/[0.08]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-md bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#828FFF] text-[11px] font-medium">✦ Groq Llama 3.3 Intelligence</span>
          <h3 class="text-sm font-semibold text-white">Financial Discipline Audit</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">Grade: A-</span>
          <span class="text-xs text-neutral-400 font-medium">"Strategic Cost Optimizer"</span>
        </div>
      </div>

      <!-- Roast Callout -->
      <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
        <div class="text-[11px] font-medium text-amber-400 mb-1.5 flex items-center gap-1.5">
          <span>⚡</span>
          <span class="uppercase tracking-wider text-[10px]">Groq Executive Critique</span>
        </div>
        <p class="text-xs text-neutral-200 italic leading-relaxed">
          "Slashing JioFiber while keeping AWS and ChatGPT is like selling your phone to buy a data cable. Internet is a core infrastructure asset; claim it under Section 44ADA instead of cutting connectivity."
        </p>
      </div>

      <!-- Two-Column Anomaly & Advice Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div class="flex items-center gap-2 text-xs font-medium text-rose-400 mb-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Spending Anomalies Flagged</span>
          </div>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li class="flex items-start gap-2">
              <span class="text-neutral-500 mt-0.5">•</span>
              <span>Slashing JioFiber while retaining AWS & ChatGPT creates connectivity bottlenecks for active dev assets.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-neutral-500 mt-0.5">•</span>
              <span>Zero tax deductions claimed despite ₹3,700/mo spent on digital tools eligible under Section 44ADA.</span>
            </li>
          </ul>
        </div>

        <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div class="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Recommended Action Plan</span>
          </div>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li class="flex items-start gap-2">
              <span class="text-neutral-500 mt-0.5">•</span>
              <span>Restore JioFiber as a deductible business utility; audit AWS idle instances before shutting down.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-neutral-500 mt-0.5">•</span>
              <span>Rotate OTT passes (Disney+ Hotstar) seasonally around cricket schedules to recapture ₹899/yr instantly.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 5-Year Projection Bar -->
      <div class="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 flex items-center justify-between text-xs mb-4">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 font-bold">↗</span>
          <span class="text-neutral-300 font-medium">5-Year Wealth Compounding (Nifty 50 @ 12% CAGR):</span>
          <span class="font-mono font-semibold text-emerald-400">₹5,56,012</span>
        </div>
        <span class="text-[11px] text-neutral-400">Based on ₹87,561 annual savings invested</span>
      </div>

      <!-- Ask Groq Interactive Bar -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input type="text" placeholder="Ask Groq a question... e.g. 'Is ChatGPT deductible under Section 44ADA?'" class="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#5E6AD2]">
        </div>
        <button class="px-4 py-2 rounded-lg bg-[#5E6AD2] hover:bg-[#6875E5] text-xs font-medium text-white transition">Ask AI</button>
      </div>
    </div>
  </div>


  <!-- ============================================================== -->
  <!-- TEMPLATE B: RAYCAST COMMAND STORE STYLE                        -->
  <!-- ============================================================== -->
  <div id="template-raycast" class="max-w-5xl mx-auto bg-[#0F1015] border border-white/[0.08] rounded-2xl p-7 shadow-2xl">
    <!-- Raycast Command Palette Header -->
    <div class="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <span class="text-rose-500 font-bold text-sm">✦</span>
        <span class="text-xs font-semibold text-white">Raycast Fleet Commander</span>
        <span class="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-neutral-400">Option B &bull; Raycast Store</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-neutral-400">⌘K Actions</span>
        <span class="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-neutral-400">ESC Close</span>
      </div>
    </div>

    <!-- Stat Badges -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="p-4 rounded-xl bg-[#14161E] border border-white/[0.06]">
        <div class="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Monthly Bleed</div>
        <div class="text-2xl font-bold text-white font-mono mt-1">₹3,873<span class="text-xs text-neutral-500 font-sans"> /month</span></div>
      </div>
      <div class="p-4 rounded-xl bg-[#14161E] border border-white/[0.06]">
        <div class="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Annual Cost</div>
        <div class="text-2xl font-bold text-amber-400 font-mono mt-1">₹46,475<span class="text-xs text-neutral-500 font-sans"> /year</span></div>
      </div>
      <div class="p-4 rounded-xl bg-[#14161E] border border-white/[0.06]">
        <div class="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Fleet Size</div>
        <div class="text-2xl font-bold text-cyan-400 font-mono mt-1">3 <span class="text-xs text-neutral-500 font-sans">Subscriptions</span></div>
      </div>
    </div>

    <!-- Raycast Search & Filter Bar -->
    <div class="mb-5 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 text-xs">
        <span class="px-2.5 py-1 rounded-md bg-white/[0.08] text-white font-medium">All (16)</span>
        <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white transition">Streaming</span>
        <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white transition">Food</span>
        <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white transition">Dev Tools</span>
      </div>
      <div class="text-xs text-neutral-400">Search: <span class="font-mono text-neutral-300">"Swiggy", "AWS"...</span></div>
    </div>

    <!-- Raycast Extension Cards Grid -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="p-3.5 rounded-xl bg-[#14161E] border border-white/[0.06] hover:border-white/[0.15] transition flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm">🏋️</div>
          <div>
            <div class="text-xs font-semibold text-white">Cult.fit Pass</div>
            <div class="text-[11px] text-neutral-400 font-mono">₹1,799/mo</div>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-neutral-300 font-mono">+ADD</span>
      </div>

      <div class="p-3.5 rounded-xl bg-[#14161E] border border-white/[0.06] hover:border-white/[0.15] transition flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">🏏</div>
          <div>
            <div class="text-xs font-semibold text-white">Hotstar Super</div>
            <div class="text-[11px] text-neutral-400 font-mono">₹899/yr</div>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-neutral-300 font-mono">+ADD</span>
      </div>

      <div class="p-3.5 rounded-xl bg-[#14161E] border border-white/[0.06] hover:border-white/[0.15] transition flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">🤖</div>
          <div>
            <div class="text-xs font-semibold text-white">ChatGPT Plus</div>
            <div class="text-[11px] text-neutral-400 font-mono">₹1,999/mo</div>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-neutral-300 font-mono">+ADD</span>
      </div>
    </div>

    <!-- Active List -->
    <div class="rounded-xl border border-white/[0.06] bg-[#14161E] p-4 mb-6">
      <div class="text-xs font-semibold text-white mb-3">Armed Roster Queue</div>
      <div class="space-y-2">
        <div class="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
          <span class="font-medium text-white">Cult.fit Elite Pass &bull; <span class="font-mono text-neutral-400">₹1,799/mo</span></span>
          <span class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[11px]">Zombie Gym Sub</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
          <span class="font-medium text-white">Disney+ Hotstar &bull; <span class="font-mono text-neutral-400">₹899/yr</span></span>
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[11px]">Dormant OTT Sub</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs mb-8">
      <button class="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-300 font-medium">Export CSV</button>
      <button class="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/20 transition">Execute Battle Fleet ↵</button>
    </div>

    <!-- Raycast Inspector: Groq Spending Audit -->
    <div class="pt-6 border-t border-white/[0.08]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-rose-400 font-bold">⚡</span>
          <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-300">Groq AI Spending Roast &amp; Advisor</h3>
        </div>
        <span class="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">GRADE A- &bull; STRATEGIC OPTIMIZER</span>
      </div>

      <div class="p-4 rounded-xl bg-[#14161E] border border-white/[0.06] mb-4 text-xs italic text-neutral-200">
        "Slashing JioFiber while keeping AWS and ChatGPT is like selling your phone to buy a data cable. Claim your cloud stack under Section 44ADA instead."
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div class="p-3.5 rounded-xl bg-[#14161E] border border-white/[0.06]">
          <span class="text-rose-400 font-medium block mb-2">Spending Anomalies Flagged</span>
          <p class="text-neutral-300">Restoring JioFiber is essential if working remotely; zero tax deductions claimed on ₹3,700/mo software.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-[#14161E] border border-white/[0.06]">
          <span class="text-emerald-400 font-medium block mb-2">Actionable Next Steps</span>
          <p class="text-neutral-300">Rotate Disney+ Hotstar annually and claim internet bills under business expenses.</p>
        </div>
      </div>
    </div>
  </div>


  <!-- ============================================================== -->
  <!-- TEMPLATE C: SHADCN / TAILWIND UI DATA TABLE                    -->
  <!-- ============================================================== -->
  <div id="template-shadcn" class="max-w-5xl mx-auto bg-[#090A0F] border border-slate-800 rounded-2xl p-7 shadow-2xl">
    <!-- Shadcn Header -->
    <div class="flex items-center justify-between pb-5 mb-6 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h2 class="text-xl font-semibold text-white">Fleet Management</h2>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium">Option C &bull; Shadcn Tasks Table</span>
        </div>
        <p class="text-xs text-slate-400">Manage bank statement line items with faceted sorting and bulk triage.</p>
      </div>
      <button class="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium">Close</button>
    </div>

    <!-- Top Metrics -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 font-medium">Total Monthly Expense</span>
        <div class="text-2xl font-bold text-white font-mono mt-1">₹3,873.00</div>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 font-medium">Projected Annual Outflow</span>
        <div class="text-2xl font-bold text-white font-mono mt-1">₹46,475.00</div>
      </div>
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <span class="text-xs text-slate-400 font-medium">Identified Anomalies</span>
        <div class="text-2xl font-bold text-emerald-400 font-mono mt-1">2 Flags</div>
      </div>
    </div>

    <!-- Shadcn Table Toolbar -->
    <div class="p-3 bg-slate-900/40 border border-slate-800 rounded-t-xl flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <input type="text" placeholder="Filter subscriptions..." class="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 w-64 focus:outline-none">
        <button class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
          <span>Status</span>
          <span class="text-[10px] text-slate-500">▼</span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-slate-400 text-[11px]">3 of 3 row(s) selected</span>
        <button class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Columns</button>
      </div>
    </div>

    <!-- Shadcn Formal Data Table -->
    <div class="border-x border-b border-slate-800 rounded-b-xl overflow-hidden bg-slate-950/60 mb-6">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-900/80 text-slate-400 border-b border-slate-800">
          <tr>
            <th class="p-3 w-8"><input type="checkbox" checked class="rounded bg-slate-900 border-slate-700"></th>
            <th class="p-3 font-medium">Merchant</th>
            <th class="p-3 font-medium">Category</th>
            <th class="p-3 font-medium">Amount</th>
            <th class="p-3 font-medium">Billing Cycle</th>
            <th class="p-3 font-medium">Anomaly Status</th>
            <th class="p-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60 text-slate-200">
          <tr class="hover:bg-slate-900/40 transition">
            <td class="p-3"><input type="checkbox" checked class="rounded bg-slate-900 border-slate-700"></td>
            <td class="p-3 font-medium text-white">Cult.fit Elite Pass</td>
            <td class="p-3 text-slate-400">Health &amp; Fitness</td>
            <td class="p-3 font-mono font-medium text-white">₹1,799.00</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">Monthly</span></td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-rose-950/50 text-rose-400 border border-rose-800 text-[11px]">Zombie Gym Sub</span></td>
            <td class="p-3 text-right"><button class="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-[11px]">Duplicate</button></td>
          </tr>
          <tr class="hover:bg-slate-900/40 transition">
            <td class="p-3"><input type="checkbox" checked class="rounded bg-slate-900 border-slate-700"></td>
            <td class="p-3 font-medium text-white">Disney+ Hotstar Super</td>
            <td class="p-3 text-slate-400">OTT &amp; Entertainment</td>
            <td class="p-3 font-mono font-medium text-white">₹899.00</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">Annual</span></td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-amber-950/50 text-amber-400 border border-amber-800 text-[11px]">Dormant OTT Sub</span></td>
            <td class="p-3 text-right"><button class="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-[11px]">Duplicate</button></td>
          </tr>
          <tr class="hover:bg-slate-900/40 transition">
            <td class="p-3"><input type="checkbox" checked class="rounded bg-slate-900 border-slate-700"></td>
            <td class="p-3 font-medium text-white">OpenAI ChatGPT Plus</td>
            <td class="p-3 text-slate-400">AI &amp; Developer Tools</td>
            <td class="p-3 font-mono font-medium text-white">₹1,999.00</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">Monthly</span></td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-800 text-[11px]">Tax Write-Off Eligible</span></td>
            <td class="p-3 text-right"><button class="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-[11px]">Duplicate</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Shadcn Action Bar -->
    <div class="flex items-center justify-between mb-8">
      <button class="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">Export Selected CSV</button>
      <button class="px-6 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-semibold text-xs transition">Launch Battle With Selected →</button>
    </div>

    <!-- Shadcn Card: Groq Financial Intelligence -->
    <div class="pt-6 border-t border-slate-800">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-white">Groq AI Audit &amp; Risk Assessment</h3>
        <span class="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">Grade: A- &bull; Low Risk</span>
      </div>

      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-4 text-xs text-slate-200 leading-relaxed">
        <strong class="text-white block mb-1">Executive Summary:</strong>
        "Slashing JioFiber while keeping AWS and ChatGPT is like selling your phone to buy a data cable. Internet is a deductible operating expense; audit idle AWS instances instead."
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs mb-4">
        <div class="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div class="font-medium text-rose-400 mb-1.5">Detected Inefficiencies</div>
          <p class="text-slate-300 leading-relaxed">Lack of 44ADA business deduction usage on ₹3,700/mo active development software.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div class="font-medium text-emerald-400 mb-1.5">Remediation Path</div>
          <p class="text-slate-300 leading-relaxed">Rotate Disney+ Hotstar annually to save ₹899/yr; categorize cloud tools under business assets.</p>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
`;

async function capturePolished() {
  const htmlPath = path.resolve('scripts/polished-preview.html');
  fs.writeFileSync(htmlPath, HTML_CONTENT);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const targetDir = 'C:/Users/Vaibhav Saini/.gemini/antigravity/brain/ab400625-a5ad-4e44-be28-29322230c0c6';

  // Template A: Linear
  const tA = page.locator('#template-linear');
  await tA.screenshot({ path: path.join(targetDir, 'polished-linear-style.png') });
  console.log('Linear captured!');

  // Template B: Raycast
  const tB = page.locator('#template-raycast');
  await tB.screenshot({ path: path.join(targetDir, 'polished-raycast-style.png') });
  console.log('Raycast captured!');

  // Template C: Shadcn
  const tC = page.locator('#template-shadcn');
  await tC.screenshot({ path: path.join(targetDir, 'polished-shadcn-style.png') });
  console.log('Shadcn captured!');

  await browser.close();
  console.log('All polished templates captured successfully!');
}

capturePolished();
