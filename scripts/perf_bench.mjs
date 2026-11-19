#!/usr/bin/env node
/**
 * Headless Chromium Performance & Error Regression Benchmark.
 * Usage: NODE_PATH=/opt/homebrew/lib/node_modules node scripts/perf_bench.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = process.cwd();
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.env': 'application/octet-stream',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`); });

const t0 = Date.now();
await page.goto(`http://127.0.0.1:${port}/?profile=1`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__perfStats && window.__perfStats.fps > 0, { timeout: 25000 });
const loadMs = Date.now() - t0;
await page.waitForTimeout(1400);

const menu = await page.evaluate(() => window.__perfStats);
console.log('MENU:', JSON.stringify({ loadMs, frameMs: menu.frameMs, draws: menu.drawCalls, tris: Math.round(menu.triangles) }));

await page.click('#mission-dreadnought-btn');
await page.waitForTimeout(2600);
const m2 = await page.evaluate(() => window.__perfStats);
console.log('DREADNOUGHT:', JSON.stringify({ stage: m2.stage, mode: m2.controlMode, frameMs: m2.frameMs, draws: m2.drawCalls, tris: Math.round(m2.triangles) }));

console.log('ERRORS:', errors.length);
if (errors.length) console.error(errors.join('\n'));

await browser.close();
server.close();

if (errors.length > 0 || menu.drawCalls > 650 || menu.triangles > 450000) {
  console.error('PERF/ERROR BUDGET EXCEEDED!');
  process.exit(1);
}
console.log('PERF BENCH PASSED!');
