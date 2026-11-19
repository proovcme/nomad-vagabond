#!/usr/bin/env node
/**
 * Master QA, Architecture & Asset Audit Tool.
 * Usage: node scripts/audit_all.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { LEVEL_REGISTRY, LEVEL_THEMES, BIOME_TYPES } from '../src/levels/levelRegistry.js';
import { ASSET_MANIFEST } from '../src/engine/assetManager.js';

const ROOT = process.cwd();
let failures = 0;

function pass(msg) { console.log(`  \x1b[32mPASS\x1b[0m ${msg}`); }
function fail(msg) { console.error(`  \x1b[31mFAIL\x1b[0m ${msg}`); failures++; }

function walkJs(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJs(full));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

console.log('\n=== 1. SYNTAX CHECK (src/**/*.js) ===');
const jsFiles = walkJs(path.join(ROOT, 'src'));
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    fail(`Syntax error in ${path.relative(ROOT, file)}: ${e.stderr?.toString() || e.message}`);
  }
}
if (failures === 0) pass(`All ${jsFiles.length} JS modules passed syntax check`);

console.log('\n=== 2. ASSET MANIFEST INTEGRITY ===');
let totalAssetBytes = 0;
for (const [id, spec] of Object.entries(ASSET_MANIFEST)) {
  const full = path.join(ROOT, spec.dir, spec.file);
  if (!fs.existsSync(full)) {
    fail(`Missing asset "${id}" at ${path.relative(ROOT, full)}`);
  } else {
    const sz = fs.statSync(full).size;
    totalAssetBytes += sz;
    if (sz > 12 * 1024 * 1024) {
      fail(`Oversized asset "${id}" (${(sz / 1048576).toFixed(1)} MB > 12 MB)`);
    }
  }
}
pass(`Verified ${Object.keys(ASSET_MANIFEST).length} manifest assets (${(totalAssetBytes / 1048576).toFixed(1)} MB total)`);

console.log('\n=== 3. LEVEL REGISTRY VALIDATION ===');
for (const [id, lvl] of Object.entries(LEVEL_REGISTRY)) {
  if (!LEVEL_THEMES[lvl.theme]) fail(`Level "${id}" references unknown theme "${lvl.theme}"`);
  if (lvl.nextLevelId && !LEVEL_REGISTRY[lvl.nextLevelId]) fail(`Level "${id}" nextLevelId "${lvl.nextLevelId}" not found`);
  for (const prop of lvl.archipelago?.customProps || []) {
    if (!ASSET_MANIFEST[prop.assetId]) fail(`Level "${id}" customProp references unknown assetId "${prop.assetId}"`);
  }
  for (const bi of lvl.archipelago?.extraIslands || []) {
    if (!BIOME_TYPES.includes(bi.biome)) fail(`Level "${id}" extraIsland has unknown biome "${bi.biome}"`);
    const distFromVag = Math.hypot(bi.pos?.[0] || 0, bi.pos?.[2] || 0);
    if (distFromVag < 160) fail(`Level "${id}" extraIsland "${bi.biome}" too close to Vagabond (${Math.round(distFromVag)}m < 160m)`);
  }
  const f = lvl.archipelago?.forestPos;
  const ind = lvl.archipelago?.industrialPos;
  if (f && ind) {
    const d = Math.hypot(f[0] - ind[0], f[2] - ind[2]);
    if (d < 180) fail(`Level "${id}" forest & industrial islands overlap (${Math.round(d)}m < 180m)`);
  }
}
pass(`Validated ${Object.keys(LEVEL_REGISTRY).length} levels across ${Object.keys(LEVEL_THEMES).length} themes`);

console.log('\n=== 4. AUTOMATED RUNTIME VALIDATORS ===');
const validators = [
  'scripts/validate_lighting.mjs',
  'scripts/validate_collisions.mjs',
  'scripts/validate_aircraft_takeoff.mjs',
  'scripts/validate_instruments.mjs',
  'scripts/validate_fleet_layout.mjs',
  'scripts/validate_construction.mjs',
];
for (const v of validators) {
  const full = path.join(ROOT, v);
  if (!fs.existsSync(full)) continue;
  try {
    execFileSync(process.execPath, [full], { stdio: 'pipe', timeout: 60000 });
    pass(v);
  } catch (e) {
    fail(`${v} exited with error:\n${(e.stdout?.toString() || '') + (e.stderr?.toString() || '')}`);
  }
}

console.log('\n=== SUMMARY ===');
if (failures > 0) {
  console.error(`\x1b[31mAUDIT FAILED with ${failures} issue(s)\x1b[0m`);
  process.exit(1);
}
console.log('\x1b[32mALL AUDITS & VALIDATORS PASSED!\x1b[0m');
