# SpendIntruders ⚡ – The Zombie Subscription & Expense Space Shooter

> **Turn painful digital chores into a fast-paced retro space shooter where blasting enemy SaaS motherships, tractor-beaming dev tools, and escorting legitimate expenses executes real-world cancellations, chargeback disputes, and tax ledgers in the background.**

[![Vitest Unit Tests](https://img.shields.io/badge/Vitest-32%20Passed%20(100%25)-00FF88?style=for-the-badge&logo=vitest&logoColor=black)](src/core/engine/__tests__/engine.test.ts)
[![Playwright E2E](https://img.shields.io/badge/Playwright-24%20Passed%20(100%25)-00E5FF?style=for-the-badge&logo=playwright&logoColor=black)](scripts/verify-features.mjs)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Type%20Safety-FFE600?style=for-the-badge&logo=typescript&logoColor=black)](tsconfig.json)
[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud%20Run-Containerized-FF007F?style=for-the-badge&logo=googlecloud&logoColor=black)](Dockerfile)
[![Google Gemini 1.5](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](src/core/engine/geminiAdvisor.ts)

---

## 🎯 1. Problem Statement & Hackathon Alignment

### The Problem
Millions of users and freelancers suffer from **financial leakage through forgotten subscriptions, zombie auto-debits, and opaque bank statements**:
- **\$340B+** lost annually worldwide to unused recurring digital memberships.
- **Dark Patterns & Hostile Retention:** Companies intentionally obscure cancellation workflows behind multi-step questionnaires.
- **Missed Business Write-Offs:** Developers and small business owners routinely fail to claim legitimate SaaS, hosting, and dev tools under **Section 44ADA / IRS Schedule C**.
- **Procrastination & Cognitive Overhead:** Auditing 300+ line-item bank statements is boring, emotionally exhausting, and perpetually postponed.

### The SpendIntruders Solution
**SpendIntruders** gamifies digital chores into an arcade starfighter shooter that executes real legal and tax deliverables in under 60 seconds:
1. **Gamified Triage (Space Combat Loop)**:
   - 🔴 **DUAL PLASMA LASERS (`Space` / `A`)**: Blasts zombie SaaS trials (Cult.fit, OTT renewals) and duplicate charges into 40-particle explosions!
   - ⚡ **EMP TRACTOR BEAM (`W` / `↑`)**: Beams up developer software, cloud hosting, and work assets into an automated tax ledger!
   - 🛡️ **ESCORT SHIELDS (`D` / `→`)**: Protects and passes legitimate groceries, utilities, and essentials into your budget vault!
2. **Instant Legal Deliverables**:
   - Auto-generated legal cancellation notices citing **FTC "Click-to-Cancel"** and **CCPA** regulations with 1-click copy & direct portal links.
   - Formal **Fair Credit Billing Act (FCBA 15 U.S.C. § 1666)** chargeback dispute letters for duplicate charges.
   - Sanitized, IRS Schedule C / Sec 44ADA-categorized `tax-deductions-2026.csv` ledger.

---

## 🌐 2. Google Services & Cloud Architecture

SpendIntruders is deeply integrated with Google's developer ecosystem:

1. **Google Gemini 1.5 Flash (`@google/generative-ai`)**:
   - Powers the autonomous financial health critique, lifestyle archetype classification, and personalized financial roast.
   - Interactive Q&A engine advising users on Indian tax law (Section 44ADA, 80C) and UPI e-mandate cancellations.
   - Built with cascading model fallbacks and zero-dependency local simulation when offline.
2. **Google Cloud Run (`Dockerfile`)**:
   - Production containerization via multi-stage alpine build (`node:20-alpine`).
   - Stateless auto-scaling on Google Cloud Run with sub-second container cold starts.
3. **Google Cloud Build (`cloudbuild.yaml`)**:
   - Fully automated CI/CD pipeline executing Vitest unit tests, Docker container packaging, and automated blue-green Cloud Run deployments.
4. **Google Flow Cinematic Video Canvas**:
   - GPU hardware-accelerated Cosmic Black Hole swirling relativistic plasma background for immersive space atmosphere without UI glare.

---

## 🏗️ 3. Architecture & Separation of Concerns

```text
src/
├── core/
│   └── engine/                     # ⚡ PURE DOMAIN LOGIC (ZERO React dependencies)
│       ├── types.ts                # Strict TypeScript interfaces & domain models
│       ├── anomalyDetector.ts      # Duplicate charge detection & anomaly heuristics
│       ├── savingsCalculator.ts    # Annualized savings, combo scoring, tax totals
│       ├── documentGenerator.ts    # FTC & CCPA cancellation drafts & FCBA dispute letters
│       ├── csvProcessor.ts         # OWASP CSV formula injection sanitizer & parser
│       ├── groqAdvisor.ts          # Groq Llama 3.3 / Qwen ultra-fast advisor module
│       ├── geminiAdvisor.ts        # Google Gemini 1.5 Flash financial intelligence
│       └── __tests__/
│           └── engine.test.ts      # 32 comprehensive Vitest unit tests (100% passing)
├── data/
│   └── demoStatement.ts            # Rich dataset with roasts & cancellation URLs
├── utils/
│   └── soundEffects.ts             # Web Audio API 8-bit procedural sound synthesizer & 120-BPM Synthwave BGM
├── components/
│   ├── ui/                         # Aceternity UI 3D Cards, 3D Marquee, Beams with Collision
│   │   ├── 3d-card.tsx             # 3D Perspective interactive mouse-tracking cards
│   │   ├── 3d-marquee.tsx          # 3D Perspective card river flowing with background grid
│   │   ├── background-beams-with-collision.tsx
│   │   └── CyberIcons.tsx          # Custom multi-stop gradient SVG icon set
│   └── game/                       # 🎮 PRESENTATION & 60-FPS CANVAS SHOOTER
│       ├── LandingHero.tsx         # Starfighter title screen, 1-Click Demo CTA, CSV uploader
│       ├── ArcadeHUD.tsx           # 60s timer, combo multiplier, live annual savings counter
│       ├── ArcadeShooter.tsx       # 60 FPS HTML5 Canvas space shooter with plasma bolts & physics
│       ├── SubscriptionForge.tsx   # Dockyard fleet builder with 3D Marquee and 16 Indian presets
│       ├── GroqAuditReport.tsx     # Gemini & Groq AI spending critique and interactive Q&A
│       └── VictoryScorecard.tsx    # Confetti celebrations, 4 KPI cards, legal deliverables hub
```

---

## 🔒 4. Security & Privacy Guarantees

- **100% Client-Side Privacy**: Statements and CSVs are processed entirely in browser memory. Zero banking credentials, account numbers, or personal identifying information (PII) are ever sent to remote servers.
- **OWASP CSV Formula Injection Defense**: All exported cells sanitize malicious execution prefixes (`=`, `+`, `-`, `@`, `\t`, `\r`) with single-quote escaping.
- **Defense in Depth**: Strict TypeScript types, Error Boundary containment, and automated test enforcement.

---

## ♿ 5. Accessibility & UX Quality (WCAG 2.1 AA)

- Semantic HTML5 structure (`<header role="banner">`, `<main id="main-content" role="main">`, `<footer role="contentinfo">`).
- Skip-to-content keyboard link for screen readers.
- Full ARIA labeling across all combat controls, inputs, and interactive cards.
- High-contrast visual tokens, pitch-black event horizon backdrop, and zero textured scanline blur for effortless readability.

---

## 🧪 6. Testing & Quality Verification

```bash
# Run Vitest Domain Unit Tests (32 passed, 100%)
npm test

# Run Playwright Automated E2E Checklist (24 checks passed, 100%)
npm run test:e2e

# Compile Production Build (Zero TypeScript or Lint Errors)
npm run build
```

---

## 🚀 7. Quick Start

```bash
# Install dependencies
npm install

# Launch development server
npm run dev
```

Visit `http://localhost:3000/` to test SpendIntruders locally.
