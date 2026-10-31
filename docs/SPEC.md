# SpendIntruders Architecture & Technical Specification

## Challenge Alignment
**PromptWars x OUTLIER'2026 | Google for Developers x Hack2skill**
> *"We all procrastinate on painful digital chores - cleaning out 5,000 unread emails, sorting messy folders, reviewing expenses, or fixing lint errors. Build an experience where playing a fast-paced game or interactive story actually executes the real-world chore in the background."*

## Architecture Overview
- **Game Engine:** Pure TypeScript domain models in `src/core/engine/` completely decoupled from React DOM rendering.
- **Background Execution:** 3-way triage queue (KILL, KEEP, TAX) optimistically dispatches combat events and generates background legal and tax deliverables (FTC Click-to-Cancel, RBI E-Mandate cancellation drafts, FCBA bank dispute notices, IRS Schedule C / 44ADA CSV).
- **Google Ecosystem:** Google Gemini 1.5 Flash (`@google/generative-ai`), Google Cloud Run containerization, Cloud Build CI/CD.
- **Security & Privacy:** 100% in-browser client-side execution. AI advises, human decides (LLM never directly cancels without player action). Zod input validation, helmet CSP, rate limiting.
- **Efficiency:** 88 kB initial JS bundle, Rollup manual chunking, gzip compression, Service Worker PWA offline caching.
- **Accessibility:** Keyboard navigation, ARIA live regions, non-color visual indicators, high contrast tokens, skip links.
