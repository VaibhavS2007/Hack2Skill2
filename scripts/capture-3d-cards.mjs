import { chromium } from 'playwright';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const targetDir = 'C:/Users/Vaibhav Saini/.gemini/antigravity/brain/ab400625-a5ad-4e44-be28-29322230c0c6';

  // Navigate to Forge Screen
  const forgeBtn = page.locator('button:has-text("FORGE FLEET")').first();
  await forgeBtn.click();
  await page.waitForTimeout(1000);

  // Capture Forge with 3D Marquee
  await page.screenshot({ path: path.join(targetDir, '3d-marquee-forge.png') });
  console.log('Forge with 3D marquee captured!');

  await browser.close();
}

capture();
