import { chromium } from 'playwright';
import path from 'path';

async function checkVideo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  await page.goto('http://localhost:3000/cosmic-blackhole.mp4');
  await page.waitForTimeout(1500);
  
  const targetDir = 'C:/Users/Vaibhav Saini/.gemini/antigravity/brain/ab400625-a5ad-4e44-be28-29322230c0c6';
  await page.screenshot({ path: path.join(targetDir, 'video-preview-frame2.png') });
  console.log('Video page captured!');
  
  await browser.close();
}

checkVideo();
