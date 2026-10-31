import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const targetDir = 'C:/Users/Vaibhav Saini/.gemini/antigravity/brain/ab400625-a5ad-4e44-be28-29322230c0c6';
  await page.screenshot({ path: path.join(targetDir, 'spendintruders-branded.png') });
  console.log('SpendIntruders screenshot captured!');

  await browser.close();
}

capture();
