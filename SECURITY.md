# Security Policy & Client-Side Privacy Guarantee

## Zero-Knowledge Architecture
SpendIntruders is engineered with a strict **Local-First, Zero-Knowledge Privacy Architecture**:
- All CSV bank statements, subscription logs, and transaction parsing are executed **100% in-browser memory**.
- No bank statement data or personal account identifiers are transmitted, saved, or logged to any remote database.
- AI telemetry sent to LLM endpoints (Groq / Gemini) is strictly limited to transaction descriptions and numerical sums requested explicitly by the user, with custom API keys stored solely in browser `localStorage`.

## Reporting a Vulnerability
If you discover a security vulnerability within SpendIntruders, please report it privately:
- **Email:** `vaibhavsaini110707@gmail.com`
- Please provide a detailed description of the vulnerability, reproduction steps, and potential impact.
- Vulnerabilities will be addressed within 48 hours.
