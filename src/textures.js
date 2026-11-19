// High-detail procedural textures & bump maps (512x512) for sharp cosmopunk visuals

function hash2D(x, y, seed) {
  let n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2D(ix, iy, seed);
  const b = hash2D(ix + 1, iy, seed);
  const c = hash2D(ix, iy + 1, seed);
  const d = hash2D(ix + 1, iy + 1, seed);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x, y, seed, octaves = 5) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq, seed + i * 17);
    freq *= 2.05;
    amp *= 0.5;
  }
  return val;
}

// Convert grayscale height stored in R channel of ImageData into tangent-space RGB normal map
function bakeNormalMapFromImg(imgData, size, strength = 1.6) {
  const src = new Uint8Array(size * size);
  for (let i = 0; i < size * size; i++) src[i] = imgData.data[i * 4];
  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const dx = (src[y * size + xp] - src[y * size + xm]) * strength;
      const dy = (src[yp * size + x] - src[ym * size + x]) * strength;
      const invLen = 1 / Math.hypot(dx, dy, 127);
      const idx = (y * size + x) * 4;
      imgData.data[idx] = Math.max(0, Math.min(255, Math.round((-dx * invLen * 0.5 + 0.5) * 255)));
      imgData.data[idx + 1] = Math.max(0, Math.min(255, Math.round((-dy * invLen * 0.5 + 0.5) * 255)));
      imgData.data[idx + 2] = Math.max(0, Math.min(255, Math.round((127 * invLen * 0.5 + 0.5) * 255)));
      imgData.data[idx + 3] = 255;
    }
  }
}

export function createPlanetTextures(scene, biome, seedNum, namePrefix) {
  const size = 512;
  const albedoTex = new BABYLON.DynamicTexture(`${namePrefix}_alb`, { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture(`${namePrefix}_bmp`, { width: size, height: size }, scene, true);

  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const angle = (x / size) * Math.PI * 2;
      const nx = Math.cos(angle) * 3.2 + 5.0;
      const nz = Math.sin(angle) * 3.2 + 5.0;
      const ny = (y / size) * 6.4;

      const n = fbm(nx + ny * 0.25, nz + ny * 0.75, seedNum, 5);
      const detail = fbm(nx * 4.5, nz * 4.5 + ny * 4.5, seedNum + 99, 3);

      let r = 80, g = 80, b = 80;
      let h = n * 200 + detail * 55;

      if (biome === 'oasis' || biome === 'oceanic') {
        if (n < 0.48) {
          const depth = n / 0.48;
          r = 12 + depth * 18;
          g = 42 + depth * 56;
          b = 70 + depth * 58;
          h = 35 + detail * 15;
        } else if (n < 0.51) {
          r = 168; g = 152; b = 112; // natural sandy coast
          h = 122;
        } else if (n < 0.72) {
          const veg = (n - 0.51) / 0.21;
          r = 44 + detail * 24 + veg * 20;
          g = 86 + detail * 28 - veg * 12;
          b = 52 + detail * 16;
          h = 140 + detail * 65;
        } else {
          const peak = (n - 0.72) / 0.28;
          r = 105 + peak * 95 + detail * 25;
          g = 98 + peak * 100 + detail * 22;
          b = 92 + peak * 105 + detail * 20;
          h = 205 + peak * 50;
        }
      } else if (biome === 'cryo') {
        const ridge = Math.abs(detail - 0.5) * 2;
        if (n < 0.4) {
          r = 20; g = 46; b = 78;
          h = 60;
        } else if (n < 0.72) {
          r = 95 + ridge * 45; g = 138 + ridge * 40; b = 175;
          h = 150 + ridge * 80;
        } else {
          r = 205; g = 218; b = 228;
          h = 230;
        }
      } else if (biome === 'volcanic') {
        const crack = Math.abs(n - 0.36);
        if (crack < 0.018) {
          r = 235; g = 92; b = 22; // thin magma fissure
          h = 30;
        } else if (n < 0.65) {
          r = 42 + detail * 26; g = 36 + detail * 20; b = 38 + detail * 18;
          h = 135 + detail * 90;
        } else {
          r = 72 + detail * 32; g = 58 + detail * 24; b = 52;
          h = 190 + detail * 60;
        }
      } else if (biome === 'desert') {
        const canyon = n < 0.42 ? (0.42 - n) * 2.2 : 0;
        const plateau = n > 0.64 ? 1 : 0;
        const wind = fbm(nx * 2.2 + ny * 0.4, nz * 2.2, seedNum + 51, 3);
        r = 148 + wind * 38 - canyon * 65 + plateau * 22;
        g = 108 + wind * 28 - canyon * 48 + plateau * 12;
        b = 68 + wind * 18 - canyon * 32;
        h = 120 - canyon * 75 + plateau * 70 + wind * 35;
      } else if (biome === 'gas') {
        const lat = y / size;
        const turb = (fbm(nx * 1.8, ny * 0.9, seedNum + 12, 4) - 0.5) * 0.08;
        const band = Math.sin((lat + turb) * Math.PI * 10) * 0.5 + 0.5;
        const band2 = Math.cos((lat * 1.7 + turb * 1.5) * Math.PI * 6) * 0.5 + 0.5;
        r = 128 + band * 54 + band2 * 22;
        g = 104 + band * 40 + band2 * 18;
        b = 82 + band * 20 + (1 - band2) * 28;
        h = 128 + band * 18;
      } else if (biome === 'tidal') {
        if (n < 0.44) {
          r = 52; g = 28; b = 115;
          h = 65;
        } else {
          r = 120 + detail * 65; g = 68 + n * 65; b = 195 + detail * 55;
          h = 150 + detail * 90;
        }
      } else if (biome === 'observatory') {
        const px = x % 64;
        const py = y % 64;
        const seam = px < 2 || py < 2;
        const rivet = (px === 6 || px === 58) && (py === 6 || py === 58);
        const base = 115 + detail * 45;
        if (seam) {
          r = 45; g = 42; b = 38;
          h = 40;
        } else if (rivet) {
          r = 230; g = 185; b = 95;
          h = 240;
        } else {
          r = base * 1.15; g = base * 0.94; b = base * 0.65;
          h = 155 + detail * 30;
        }
      }

      const idx = (y * size + x) * 4;
      aImg.data[idx] = Math.min(255, r);
      aImg.data[idx + 1] = Math.min(255, g);
      aImg.data[idx + 2] = Math.min(255, b);
      aImg.data[idx + 3] = 255;

      const hv = Math.max(0, Math.min(255, h));
      bImg.data[idx] = hv;
      bImg.data[idx + 1] = hv;
      bImg.data[idx + 2] = hv;
      bImg.data[idx + 3] = 255;
    }
  }

  bakeNormalMapFromImg(bImg, size, 1.4);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.update();
  bumpTex.update();
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}

export function createHullTexture(scene) {
  const size = 512;
  const albedoTex = new BABYLON.DynamicTexture('hullPanelTex', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('hullPanelBump', { width: size, height: size }, scene, true);
  const ctx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();

  // Deep weathered marine slate-bronze plating
  ctx.fillStyle = '#243242';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#909090';
  bCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 64) {
    for (let x = 0; x < size; x += 128) {
      const shade = ((x + y) % 128 === 0) ? 4 : -4;
      ctx.fillStyle = `rgb(${36 + shade}, ${50 + shade}, ${66 + shade})`;
      ctx.fillRect(x + 2, y + 2, 124, 60);

      // Subtle bevel & seam
      ctx.strokeStyle = '#151e29';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, 126, 62);
      bCtx.strokeStyle = '#303030';
      bCtx.lineWidth = 2;
      bCtx.strokeRect(x + 1, y + 1, 126, 62);

      // Small brass rivets
      ctx.fillStyle = '#b98b44';
      bCtx.fillStyle = '#dcdcdc';
      for (const rx of [x + 8, x + 120]) {
        for (const ry of [y + 8, y + 56]) {
          ctx.fillRect(rx - 1, ry - 1, 3, 3);
          bCtx.fillRect(rx - 1, ry - 1, 3, 3);
        }
      }
    }
  }
  albedoTex.update();
  bumpTex.update();
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}

export function createWoodPlankTexture(scene) {
  const size = 512;
  const albedoTex = new BABYLON.DynamicTexture('woodPlankAlb', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('woodPlankBmp', { width: size, height: size }, scene, true);
  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    const plankIdx = Math.floor(y / 32);
    const plankY = y % 32;
    const seam = plankY < 2;
    const plankTone = ((plankIdx * 37) % 19) - 9;
    for (let x = 0; x < size; x++) {
      const grain = fbm(x * 0.03, y * 0.25 + plankIdx * 7.1, 42, 3);
      const idx = (y * size + x) * 4;
      if (seam) {
        aImg.data[idx] = 42;
        aImg.data[idx + 1] = 27;
        aImg.data[idx + 2] = 17;
        aImg.data[idx + 3] = 255;
        bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = 40;
        bImg.data[idx + 3] = 255;
      } else {
        const g = (grain - 0.5) * 38 + plankTone;
        aImg.data[idx] = Math.max(0, Math.min(255, 118 + g));
        aImg.data[idx + 1] = Math.max(0, Math.min(255, 76 + g * 0.72));
        aImg.data[idx + 2] = Math.max(0, Math.min(255, 46 + g * 0.45));
        aImg.data[idx + 3] = 255;
        const h = Math.max(0, Math.min(255, 145 + (grain - 0.5) * 70));
        bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = h;
        bImg.data[idx + 3] = 255;
      }
    }
  }
  bakeNormalMapFromImg(bImg, size, 1.4);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.update();
  bumpTex.update();
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}

export function createTerrainDetailTexture(scene) {
  const size = 512;
  const albedoTex = new BABYLON.DynamicTexture('terrainDetAlb', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('terrainDetBmp', { width: size, height: size }, scene, true);
  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Seamless periodic sampling
      const ax = (x / size) * Math.PI * 2;
      const ay = (y / size) * Math.PI * 2;
      const nx = Math.cos(ax) * 2.5 + 4.0;
      const nz = Math.sin(ax) * 2.5 + 4.0;
      const ny = Math.cos(ay) * 2.5 + Math.sin(ay) * 1.2 + 4.0;
      const n = fbm(nx + ny * 0.4, nz + ny * 0.6, 77, 4);
      const micro = fbm(nx * 3.0, nz * 3.0 + ny * 2.0, 131, 2);
      const v = 232 + (n - 0.5) * 30 + (micro - 0.5) * 16;
      const h = 128 + (n - 0.5) * 90 + (micro - 0.5) * 45;
      const idx = (y * size + x) * 4;
      const cv = Math.max(205, Math.min(255, v));
      aImg.data[idx] = cv;
      aImg.data[idx + 1] = cv;
      aImg.data[idx + 2] = cv;
      aImg.data[idx + 3] = 255;
      const bv = Math.max(0, Math.min(255, h));
      bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = bv;
      bImg.data[idx + 3] = 255;
    }
  }
  bakeNormalMapFromImg(bImg, size, 1.5);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.update();
  bumpTex.update();
  albedoTex.uScale = 6;
  albedoTex.vScale = 3;
  bumpTex.uScale = 6;
  bumpTex.vScale = 3;
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}

export function createBarkTexture(scene) {
  const size = 256;
  const albedoTex = new BABYLON.DynamicTexture('barkAlb', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('barkBmp', { width: size, height: size }, scene, true);
  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const furrow = fbm(x * 0.22, y * 0.045, 91, 4);
      const ridge = Math.sin(x * 0.35 + furrow * 4.5) * 0.5 + 0.5;
      const shade = 0.62 + 0.38 * ridge;
      const idx = (y * size + x) * 4;
      aImg.data[idx] = Math.min(255, 92 * shade);
      aImg.data[idx + 1] = Math.min(255, 64 * shade);
      aImg.data[idx + 2] = Math.min(255, 44 * shade);
      aImg.data[idx + 3] = 255;
      const bv = Math.max(0, Math.min(255, 70 + ridge * 165));
      bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = bv;
      bImg.data[idx + 3] = 255;
    }
  }
  bakeNormalMapFromImg(bImg, size, 1.5);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.update();
  bumpTex.update();
  return { albedoTex, bumpTex };
}

export function createSpaceEnvironmentTexture(scene, starColorHex = '#ffd296') {
  const engine = scene.getEngine();
  if (!engine || engine instanceof BABYLON.NullEngine) return null;
  const size = 32;
  const starC = BABYLON.Color3.FromHexString(starColorHex);
  const skyTop = new BABYLON.Color3(0.24, 0.38, 0.62);
  const skyHorizon = new BABYLON.Color3(0.22, 0.44, 0.52);
  const skyBottom = new BABYLON.Color3(0.08, 0.09, 0.19);
  const sunDir = new BABYLON.Vector3(-0.6, 0.55, -0.58).normalize();

  const dirForFace = (face, u, v) => {
    switch (face) {
      case 0: return new BABYLON.Vector3(1, -v, -u).normalize();   // +X
      case 1: return new BABYLON.Vector3(-1, -v, u).normalize();   // -X
      case 2: return new BABYLON.Vector3(u, 1, v).normalize();     // +Y
      case 3: return new BABYLON.Vector3(u, -1, -v).normalize();   // -Y
      case 4: return new BABYLON.Vector3(u, -v, 1).normalize();    // +Z
      default: return new BABYLON.Vector3(-u, -v, -1).normalize(); // -Z
    }
  };

  const faces = [];
  const d = new BABYLON.Vector3();
  for (let f = 0; f < 6; f++) {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      const v = (y + 0.5) / size * 2 - 1;
      for (let x = 0; x < size; x++) {
        const u = (x + 0.5) / size * 2 - 1;
        d.copyFrom(dirForFace(f, u, v));
        const upT = d.y * 0.5 + 0.5;
        let r, g, b;
        if (d.y >= 0) {
          const t = Math.pow(d.y, 0.65);
          r = skyHorizon.r * (1 - t) + skyTop.r * t;
          g = skyHorizon.g * (1 - t) + skyTop.g * t;
          b = skyHorizon.b * (1 - t) + skyTop.b * t;
        } else {
          const t = Math.pow(-d.y, 0.65);
          r = skyHorizon.r * (1 - t) + skyBottom.r * t;
          g = skyHorizon.g * (1 - t) + skyBottom.g * t;
          b = skyHorizon.b * (1 - t) + skyBottom.b * t;
        }
        const sunDot = Math.max(0, BABYLON.Vector3.Dot(d, sunDir));
        const sunGlow = Math.pow(sunDot, 10) * 1.2 + Math.pow(sunDot, 2.5) * 0.28 + upT * 0.05;
        r = Math.min(1, r + starC.r * sunGlow);
        g = Math.min(1, g + starC.g * sunGlow);
        b = Math.min(1, b + starC.b * sunGlow);

        const idx = (y * size + x) * 4;
        data[idx] = Math.round(r * 255);
        data[idx + 1] = Math.round(g * 255);
        data[idx + 2] = Math.round(b * 255);
        data[idx + 3] = 255;
      }
    }
    faces.push(data);
  }

  return new BABYLON.RawCubeTexture(
    scene,
    faces,
    size,
    BABYLON.Constants.TEXTUREFORMAT_RGBA,
    BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE,
    false,
    false,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE
  );
}

export function createStarTexture(scene, hexColor, seedNum) {
  const size = 512;
  const tex = new BABYLON.DynamicTexture('starPlasmaTex', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();
  const img = ctx.createImageData(size, size);
  const c = BABYLON.Color3.FromHexString(hexColor);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm((x / size) * 10, (y / size) * 10, seedNum, 5);
      const flare = 0.6 + n * 0.65;
      const idx = (y * size + x) * 4;
      img.data[idx] = Math.min(255, c.r * 255 * flare + (n > 0.66 ? 70 : 0));
      img.data[idx + 1] = Math.min(255, c.g * 255 * flare + (n > 0.66 ? 55 : 0));
      img.data[idx + 2] = Math.min(255, c.b * 255 * flare + (n > 0.66 ? 45 : 0));
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  tex.update();
  return tex;
}

export function createSailTexture(scene) {
  const size = 512;
  const tex = new BABYLON.DynamicTexture('sailClothTex', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();

  // Warm woven cream-parchment canvas with subtle vertical gradient
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#f4ebd4');
  grad.addColorStop(0.5, '#eadbc0');
  grad.addColorStop(1, '#dfd0b2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle canvas weave
  ctx.strokeStyle = 'rgba(110, 82, 50, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Horizontal stitched reefing seams
  ctx.strokeStyle = 'rgba(95, 65, 38, 0.22)';
  ctx.lineWidth = 3;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (size / 4) * i);
    ctx.lineTo(size, (size / 4) * i);
    ctx.stroke();
  }

  // Decorative teal & burnished gold border trim
  ctx.strokeStyle = '#246b6e';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, size - 20, size - 20);

  // Understated astrolabe compass emblem
  ctx.strokeStyle = '#b98234';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 118, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#246b6e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 82, 0, Math.PI * 2);
  ctx.stroke();

  tex.update();
  tex.anisotropicFilteringLevel = 8;
  return tex;
}

export function createSparkTexture(scene) {
  const size = 64;
  const tex = new BABYLON.DynamicTexture('sparkTex', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(90, 245, 225, 0.85)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  tex.update();
  return tex;
}

export function createRustedMetalTexture(scene, tint = [108, 122, 118]) {
  const size = 512;
  const albedoTex = new BABYLON.DynamicTexture('rustMetalAlb', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('rustMetalBmp', { width: size, height: size }, scene, true);
  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const panelX = Math.floor(x / 128);
      const panelY = Math.floor(y / 64);
      const px = x % 128;
      const py = y % 64;
      const seam = px < 2 || py < 2;
      const edgeDist = Math.min(px, 127 - px, py, 63 - py);
      const rivet =
        ((px === 8 || px === 120) && (py === 8 || py === 56)) ||
        ((px === 44 || px === 84) && (py === 8 || py === 56));

      const panelVar = (((panelX * 17 + panelY * 31) % 9) - 4) * 1.4;
      const micro = fbm(x * 0.08, y * 0.08, 53, 2);
      const edgeFactor = Math.max(0, 1 - edgeDist / 7);
      const rustMask = Math.max(0, Math.min(0.24, edgeFactor * 0.24));
      const idx = (y * size + x) * 4;

      let r = tint[0] + panelVar + (micro - 0.5) * 6;
      let g = tint[1] + panelVar + (micro - 0.5) * 6;
      let b = tint[2] + panelVar + (micro - 0.5) * 6;

      // Subtle warm iron-oxide patina along panel seams only
      r = r * (1 - rustMask) + 128 * rustMask;
      g = g * (1 - rustMask) + 84 * rustMask;
      b = b * (1 - rustMask) + 56 * rustMask;

      let bump = 128 + (micro - 0.5) * 10;
      if (seam) {
        r *= 0.80;
        g *= 0.80;
        b *= 0.80;
        bump = 85;
      } else if (rivet) {
        r = Math.min(255, r * 1.28);
        g = Math.min(255, g * 1.25);
        b = Math.min(255, b * 1.2);
        bump = 225;
      }

      aImg.data[idx] = Math.max(0, Math.min(255, r));
      aImg.data[idx + 1] = Math.max(0, Math.min(255, g));
      aImg.data[idx + 2] = Math.max(0, Math.min(255, b));
      aImg.data[idx + 3] = 255;

      const bv = Math.max(0, Math.min(255, bump));
      bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = bv;
      bImg.data[idx + 3] = 255;
    }
  }
  bakeNormalMapFromImg(bImg, size, 1.4);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.update();
  bumpTex.update();
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}

/**
 * Tileable neutral micro-detail albedo & normal map for planetary terrain slopes, soil & stone.
 */
export function createTerrainDetailTextures(scene) {
  const size = 256;
  const albedoTex = new BABYLON.DynamicTexture('terrainDetailAlb', { width: size, height: size }, scene, true);
  const bumpTex = new BABYLON.DynamicTexture('terrainDetailBmp', { width: size, height: size }, scene, true);
  const aCtx = albedoTex.getContext();
  const bCtx = bumpTex.getContext();
  const aImg = aCtx.createImageData(size, size);
  const bImg = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Tileable coordinates via periodic domain wrapping approximation
      const n1 = fbm(x * 0.09, y * 0.09, 17, 3);
      const n2 = fbm(x * 0.24, y * 0.24, 61, 2);
      const crack = Math.abs(n1 - 0.5) * 2.0;
      const v = 216 + (n1 - 0.5) * 42 + (n2 - 0.5) * 24 - (crack < 0.14 ? 24 : 0);
      const idx = (y * size + x) * 4;
      const cv = Math.max(145, Math.min(255, Math.round(v)));
      aImg.data[idx] = cv;
      aImg.data[idx + 1] = cv;
      aImg.data[idx + 2] = cv;
      aImg.data[idx + 3] = 255;

      const h = Math.max(0, Math.min(255, Math.round(128 + (n1 - 0.5) * 90 + (n2 - 0.5) * 45 - (crack < 0.14 ? 38 : 0))));
      bImg.data[idx] = bImg.data[idx + 1] = bImg.data[idx + 2] = h;
      bImg.data[idx + 3] = 255;
    }
  }
  bakeNormalMapFromImg(bImg, size, 1.35);
  aCtx.putImageData(aImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);
  albedoTex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
  albedoTex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  bumpTex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
  bumpTex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  albedoTex.uScale = albedoTex.vScale = 22;
  bumpTex.uScale = bumpTex.vScale = 22;
  albedoTex.update();
  bumpTex.update();
  albedoTex.anisotropicFilteringLevel = 8;
  bumpTex.anisotropicFilteringLevel = 8;
  return { albedoTex, bumpTex };
}
