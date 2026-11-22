// Run with Playwright available through NODE_PATH. A fresh context has an empty HTTP cache.
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs/promises');

async function checkOpening(page, url, screenshot) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await page.locator('#atlas-menu:enabled').waitFor({ timeout: 120000 });
  const start = Date.now();
  await page.locator('#start-btn').click();
  await page.locator('#prologue-title').filter({hasText:'ПЕРЕХВАТ · ЭСМИНЕЦ'}).waitFor({ timeout: 30000 });
  const seconds = (Date.now() - start) / 1000;
  const visible = await page.evaluate(() => {
    const scene = BABYLON.EngineStore.LastCreatedScene;
    const active = scene.getActiveMeshes();
    return ['fogDestroyerHull','archSkyDome'].every(name => {
      const mesh = scene.getMeshByName(name);
      return mesh && active.indexOf(mesh) >= 0 && mesh.isReady(true);
    });
  });
  if (!visible) throw new Error('Sky or destroyer unavailable in intercept shot');
  const client = await page.context().newCDPSession(page);
  const frame = await client.send('Page.captureScreenshot', {format:'jpeg', quality:90});
  await fs.writeFile(screenshot, Buffer.from(frame.data,'base64'));
  await client.detach();
  await page.waitForFunction(() => document.getElementById('prologue').hidden && !document.body.classList.contains('in-prologue'));
  console.log(`Intercept after ${seconds.toFixed(1)} s; control passed to pilot`);
}
module.exports = { checkOpening };
if (require.main === module) (async () => {
  const browser = await chromium.launch({args:['--use-gl=angle','--use-angle=metal']});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:760}});
    // Hold external models and images to reproduce a slow asset queue without replacing the game code.
    if (process.argv.includes('--hold-assets')) {
      await page.route(/\.(glb|env|png|jpe?g|webp)(\?|$)/, () => {});
    }
    await checkOpening(page, process.argv.slice(2).find(arg => !arg.startsWith('--')) || 'http://localhost:5188/', path.resolve('artifacts/mission-intercept.jpg'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
