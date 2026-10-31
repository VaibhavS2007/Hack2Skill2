import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const targetDir = 'C:/Users/Vaibhav Saini/.gemini/antigravity/brain/ab400625-a5ad-4e44-be28-29322230c0c6';

  // 1. Landing Hero Screen with Black Hole Background
  await page.screenshot({ path: path.join(targetDir, 'blackhole-bg-landing.png') });
  console.log('Landing with black hole background captured!');

  // 2. Forge Fleet Screen with Black Hole Background
  const forgeBtn = page.locator('button:has-text("FORGE FLEET")').first();
  await forgeBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(targetDir, 'blackhole-bg-forge.png') });
  console.log('Forge with black hole background captured!');

  await browser.close();
}

capture();
