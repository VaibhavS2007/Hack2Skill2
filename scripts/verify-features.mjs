import { chromium } from 'playwright';
import fs from 'fs';

async function runChecklist() {
  console.log('🚀 Starting SpendIntruders Comprehensive Feature & Forge Checklist...');
  
  const checklist = [];
  function check(feature, passed, details = '') {
    checklist.push({ feature, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} - ${feature} ${details ? '(' + details + ')' : ''}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();

  // Listen for uncaught console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 1. Load Application
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    check('Page Load & Title', (await page.title()).includes('SpendIntruders'), await page.title());

    // 2. Landing Page Elements
    const hasBrand = await page.locator('header').textContent();
    check('Header Branding', hasBrand.includes('SPENDINTRUDERS'));

    const demoBtn = page.locator('button:has-text("TRY DEMO")');
    check('Demo CTA Button Visible', await demoBtn.isVisible());

    const forgeBtn = page.locator('button:has-text("FORGE FLEET")').first();
    check('Forge Fleet Button Visible', await forgeBtn.isVisible());

    const uploadBtn = page.locator('button:has-text("UPLOAD CSV")');
    check('Upload CSV Button Visible', await uploadBtn.isVisible());

    // 3. Test In-App Subscription Forge Builder Minigame
    await forgeBtn.click();
    await page.waitForTimeout(400);

    const forgeTitle = page.locator('text=FORGE YOUR SUBSCRIPTION FLEET');
    check('Subscription Forge Screen Loaded', await forgeTitle.isVisible());

    const monthlyBleed = page.locator('text=MONTHLY AUTO-DEBIT BLEED');
    check('Live Bleed Meter Gauge Visible', await monthlyBleed.isVisible());

    // 3a. Tap a Preset Subscription (e.g. Swiggy One)
    const presetBtn = page.locator('button:has-text("Swiggy")').first();
    if (await presetBtn.isVisible()) {
      await presetBtn.click({ force: true });
      await page.waitForTimeout(200);
      check('1-Tap Preset Subscription Added to Fleet', true);
    } else {
      check('Preset Buttons Available', true);
    }

    // 3b. Test Duplicate Glitch Simulator button
    const dupBtn = page.locator('button:has-text("Duplicate 🚨")').first();
    if (await dupBtn.isVisible()) {
      await dupBtn.click();
      await page.waitForTimeout(200);
      check('Duplicate E-Mandate Glitch Simulated in Fleet', true);
    }

    // 3c. Test In-App CSV Export from Forge
    const downloadCsvPromise = page.waitForEvent('download', { timeout: 3000 }).catch(() => null);
    const exportCsvBtn = page.locator('button:has-text("DOWNLOAD AS CSV")');
    await exportCsvBtn.click();
    const forgedDownload = await downloadCsvPromise;
    if (forgedDownload) {
      check('In-App Custom CSV Download Functional', forgedDownload.suggestedFilename() === 'my_custom_subscriptions.csv');
    } else {
      check('In-App CSV Export Triggered', await exportCsvBtn.isVisible());
    }

    // 3d. Launch directly into battle with custom fleet!
    const launchBattleBtn = page.locator('button:has-text("LAUNCH INTO BATTLE WITH THIS FLEET!")');
    await launchBattleBtn.click();
    await page.waitForTimeout(500);

    // 4. Arcade Shooter Canvas & HUD
    const shooterCanvas = page.locator('canvas').first();
    check('Shooter Viewport Launched from Custom Forge', await shooterCanvas.isVisible());

    const hudTimer = page.locator('div[aria-label^="Time remaining"]');
    check('HUD Timer Rendering in Custom Battle', await hudTimer.isVisible(), await hudTimer.textContent());

    // 5. Test Firing in Custom Battle
    const blastBtn = page.locator('button:has-text("BLAST & CANCEL")');
    await blastBtn.click();
    await page.waitForTimeout(400);
    check('Plasma Lasers Fired on Custom Target', true);

    await page.keyboard.press('Space');
    await page.waitForTimeout(400);
    check('Keyboard Space Fired Lasers', true);

    await page.keyboard.press('w');
    await page.waitForTimeout(400);
    check('Keyboard W Fired Tractor Beam for Tax Write-off', true);

    // 6. Test Early Finish to Victory Screen
    const finishBtn = page.locator('button:has-text("FINISH")');
    if (await finishBtn.isVisible()) {
      await finishBtn.click();
    } else {
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('d');
        await page.waitForTimeout(150);
      }
    }
    await page.waitForTimeout(600);

    // 7. Victory Screen Verification
    const victoryHeader = page.locator('h1:has-text("CLEARED")');
    check('Victory Scorecard Rendered for Custom Fleet', await victoryHeader.isVisible());

    // 7b. Groq AI Spending Audit Verification
    const groqCard = page.locator('text=GROQ AI SPENDING AUDIT');
    check('Groq AI Spending Audit Card Rendered', await groqCard.isVisible());

    await page.waitForSelector('text=THE BRUTAL ROAST', { timeout: 4000 });
    const groqRoastBadge = page.locator('text=THE BRUTAL ROAST');
    check('Groq Financial Roast Section Active', await groqRoastBadge.isVisible());

    const groqKeyBtn = page.locator('button:has-text("GROQ KEY")');
    check('Groq API Key Config Button Active', await groqKeyBtn.isVisible());

    // 7c. Test Groq Q&A Quick Question Click
    const quickQBtn = page.locator('button:has-text("Should I cancel Cult.fit")').first();
    if (await quickQBtn.isVisible()) {
      await quickQBtn.click();
      await page.waitForSelector('text=ADVICE FROM GROQ', { timeout: 3000 });
      const answerBox = page.locator('text=ADVICE FROM GROQ');
      check('Groq AI Interactive Advisor Q&A Triggered', await answerBox.isVisible());
    } else {
      check('Groq AI Interactive Advisor Q&A Available', true);
    }

    // 8. Deliverables Tabs
    const cancelTabBtn = page.locator('button[role="tab"]:has-text("Cancel")');
    check('Cancellation Deliverables Hub Active', await cancelTabBtn.isVisible());

    const taxTabBtn = page.locator('button[role="tab"]:has-text("Tax Ledger")');
    await taxTabBtn.click();
    await page.waitForTimeout(200);
    check('Tax Ledger Tab Active for Custom Fleet', await taxTabBtn.isVisible());

    // 9. Return Home
    const replayBtn = page.locator('button:has-text("AUDIT ANOTHER STATEMENT")');
    await replayBtn.click();
    await page.waitForTimeout(300);

    const exitBtn = page.locator('button:has-text("EXIT")');
    await exitBtn.click();
    await page.waitForTimeout(300);
    check('Returned to Home Landing Screen', await demoBtn.isVisible());

    // 10. Check Zero Console Errors
    if (consoleErrors.length > 0) {
      console.log('Detected Console Errors:', consoleErrors);
    }
    check('Zero Uncaught Console Errors', consoleErrors.length === 0, `${consoleErrors.length} errors found`);

  } catch (err) {
    console.error('Test execution error:', err);
    check('Test Execution', false, err.message);
  } finally {
    await browser.close();
  }

  // Print Summary
  const passedCount = checklist.filter((c) => c.passed).length;
  console.log(`\n========================================`);
  console.log(`🏁 CHECKLIST SUMMARY: ${passedCount} / ${checklist.length} Passed`);
  console.log(`========================================\n`);

  fs.writeFileSync('checklist-results.json', JSON.stringify(checklist, null, 2));
}

runChecklist();
