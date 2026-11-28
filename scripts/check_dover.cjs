// Exercise the shipped mission with keyboard input, including the pause/retry route.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');

async function main() {
  const url = new URL(process.argv[2] || 'http://127.0.0.1:5188/');
  url.searchParams.set('profile', '1');
  url.searchParams.set('quality', 'low');
  const browser = await chromium.launch({args: process.platform === 'darwin' ? ['--use-gl=angle', '--use-angle=metal'] : []});
  try {
    const page = await browser.newPage({viewport:{width:1000,height:620}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.href, {waitUntil:'domcontentloaded', timeout:150000});
    await page.locator('#atlas-menu:enabled').waitFor({timeout:90000});
    await page.locator('#mission-dover-btn').click();
    const waitForBattle = () => page.waitForFunction(() => window.__perfStats?.stage === 'dover_convoy');
    await waitForBattle();
    const marker = await page.locator('#dover-convoy-markers').elementHandle();
    await page.keyboard.press('Escape');
    await page.locator('#pause-restart-btn').click();
    await page.waitForFunction(old => !old.isConnected, marker);
    await page.locator('#dover-convoy-markers').waitFor();
    await waitForBattle();
    await page.keyboard.press('KeyT');
    await page.locator('#toast-msg').filter({hasText:'эсминцу Tribal'}).waitFor();
    const victory = page.locator('#victory-modal');
    for (let volley = 0; volley < 22 && !await victory.isVisible(); volley++) {
      await victory.waitFor({timeout:9500}).catch(error => {
        if (error.name !== 'TimeoutError') throw error;
      });
      assert.equal(await page.locator('#defeat-modal').isVisible(), false, 'Aircraft lost');
      if (!await victory.isVisible()) await page.keyboard.press('KeyT');
    }
    assert.equal(await victory.isVisible(), true, 'Missing debrief');
    assert.equal(await page.locator('#dover-convoy-markers').isVisible(), false);
    assert.equal(await page.locator('#victory-title').textContent(), 'Перехват у Дувра завершён');
    assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('nomad_rec_dover_convoy'))?.time > 0));
    assert.deepEqual(errors, []);
    console.log(await page.locator('#victory-stats').textContent());
  } finally {
    await browser.close();
  }
}
main().catch(error => {console.error(error);process.exitCode = 1;});
