# Contributing to SpendIntruders ⚔️

Thank you for your interest in contributing to **SpendIntruders**! We welcome bug fixes, documentation improvements, new bank statement parsers, and arcade mechanics enhancements.

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/VaibhavS2007/SpendIntruders.git
   cd SpendIntruders
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Local Arcade Server**
   ```bash
   npm run dev
   ```

4. **Run Typecheck & Test Suites**
   ```bash
   npm run typecheck
   npm test
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Contribution Guidelines
- Ensure all tests pass (`npm test`).
- Maintain WCAG 2.1 AA accessibility standards for all interactive UI elements.
- Verify that bank statements and user financial records are strictly processed client-side. Zero external server logging of personal financial identifiers.
- Submit PRs targeting the `main` branch with descriptive commit messages following the Conventional Commits specification.
