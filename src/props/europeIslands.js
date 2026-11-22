/**
 * «Осколки Европы Интербеллума (1920–1939)» — High-Detail Textured 3D European Islands & Architecture.
 * Built with Babylon.js 8 PBR paired albedo + tangent-space normal maps, CreateLathe profiles,
 * arched stone viaducts, half-timbered cottages, Alpine castles, and cascading cliff waterfalls.
 * Zero flat untextured white primitives.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function getOrCreateMat(scene, name, factory) {
  return scene.getMaterialByName(name) || factory();
}

/**
 * Generates paired Albedo + Normal textures for warm weathered European cut-stone masonry
 * with arched windows, stone cornices, and base weathering (no flat white cubes!).
 */
function createEuropeanMasonryTextures(scene) {
  const albedo = new BABYLON.DynamicTexture('euMasonryAlbedo', { width: 512, height: 512 }, scene, true);
  const normal = new BABYLON.DynamicTexture('euMasonryNormal', { width: 512, height: 512 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = '#c4b79c';
  ctx.fillRect(0, 0, 512, 512);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 512, 512);

  // 1. Cut-stone ashlar courses
  const rows = 16;
  const rh = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const off = (r % 2) * 32;
    for (let x = -32; x < 512; x += 64) {
      const v = (((r * 19 + x * 7) % 22) - 11);
      ctx.fillStyle = `rgb(${190 + v}, ${176 + v}, ${149 + v})`;
      ctx.fillRect(x + off + 1, r * rh + 1, 62, rh - 2);
      ctx.strokeStyle = 'rgba(72, 62, 48, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + off + 1, r * rh + 1, 62, rh - 2);

      nCtx.fillStyle = 'rgb(128, 92, 240)';
      nCtx.fillRect(x + off, r * rh, 64, 2);
      nCtx.fillStyle = 'rgb(92, 128, 240)';
      nCtx.fillRect(x + off, r * rh, 2, rh);
    }
  }

  // 2. Stone horizontal belt cornices
  for (const cy of [128, 256, 384]) {
    ctx.fillStyle = '#a89a80';
    ctx.fillRect(0, cy - 4, 512, 8);
    nCtx.fillStyle = 'rgb(128, 178, 240)';
    nCtx.fillRect(0, cy - 4, 512, 4);
    nCtx.fillStyle = 'rgb(128, 78, 240)';
    nCtx.fillRect(0, cy, 512, 4);
  }

  // 3. Classical European arched windows (dark stone sills + warm interior glow + mullions)
  for (const wy of [42, 170, 298]) {
    for (let wx = 26; wx < 500; wx += 64) {
      const lit = ((wx + wy) % 3) !== 0;
      ctx.fillStyle = '#5a5043';
      ctx.fillRect(wx - 3, wy - 3, 28, 52);
      ctx.fillStyle = lit ? '#e8bd6d' : '#353e4a';
      ctx.fillRect(wx, wy, 22, 46);
      // Window mullions
      ctx.fillStyle = '#4e4438';
      ctx.fillRect(wx + 10, wy, 2, 46);
      ctx.fillRect(wx, wy + 20, 22, 2);
      // Recessed window normal
      nCtx.fillStyle = 'rgb(88, 88, 220)';
      nCtx.fillRect(wx - 2, wy - 2, 26, 50);
    }
  }

  // 4. Subtle mossy weathering along bottom plinth
  const grad = ctx.createLinearGradient(0, 420, 0, 512);
  grad.addColorStop(0, 'rgba(72, 76, 56, 0.0)');
  grad.addColorStop(1, 'rgba(62, 66, 48, 0.48)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 420, 512, 92);

  albedo.update();
  normal.update();
  return { albedo, normal };
}

/**
 * Generates paired Albedo + Normal textures for European Half-Timbered Cottage walls.
 */
function createTimberCottageTextures(scene) {
  const albedo = new BABYLON.DynamicTexture('euTimberAlbedo', { width: 256, height: 256 }, scene, true);
  const normal = new BABYLON.DynamicTexture('euTimberNormal', { width: 256, height: 256 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = '#d8ccb2';
  ctx.fillRect(0, 0, 256, 256);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 256, 256);

  // Dark oak timber framing beams
  ctx.fillStyle = '#4d3b2c';
  nCtx.fillStyle = 'rgb(156,156,245)';
  for (const y of [0, 120, 240]) {
    ctx.fillRect(0, y, 256, 14);
    nCtx.fillRect(0, y, 256, 14);
  }
  for (let x = 0; x < 256; x += 64) {
    ctx.fillRect(x, 0, 12, 256);
    nCtx.fillRect(x, 0, 12, 256);
    // Warm cottage windows between timbers
    ctx.fillStyle = '#3b2e22';
    ctx.fillRect(x + 20, 36, 30, 44);
    ctx.fillStyle = '#f2c774';
    ctx.fillRect(x + 23, 39, 24, 38);
    ctx.fillStyle = '#4d3b2c';
    ctx.fillRect(x + 34, 39, 2, 38);
    ctx.fillRect(x + 23, 57, 24, 2);
  }
  // Stone foundation plinth
  ctx.fillStyle = '#8b8272';
  ctx.fillRect(0, 196, 256, 60);

  albedo.update();
  normal.update();
  return { albedo, normal };
}

/**
 * Generates paired Albedo + Normal shingle roof tiles (slate blue or terracotta red).
 */
function createRoofTileTextures(scene, name, baseHex, darkHex) {
  const albedo = new BABYLON.DynamicTexture(`${name}_alb`, { width: 256, height: 256 }, scene, true);
  const normal = new BABYLON.DynamicTexture(`${name}_nrm`, { width: 256, height: 256 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 256, 256);

  const rows = 16;
  const rh = 256 / rows;
  for (let r = 0; r < rows; r++) {
    ctx.fillStyle = darkHex;
    ctx.fillRect(0, r * rh, 256, 3);
    nCtx.fillStyle = 'rgb(128, 76, 240)';
    nCtx.fillRect(0, r * rh, 256, 3);
    nCtx.fillStyle = 'rgb(128, 170, 240)';
    nCtx.fillRect(0, r * rh + 3, 256, 2);
    const off = (r % 2) * 10;
    for (let x = 0; x < 256; x += 20) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect((x + off) % 256, r * rh, 1.5, rh);
    }
  }
  albedo.update();
  normal.update();
  albedo.uScale = normal.uScale = 2.0;
  albedo.vScale = normal.vScale = 2.0;
  return { albedo, normal };
}

export function getEuropePalette(scene) {
  const B = BABYLON;
  const isNull = scene.getEngine() instanceof B.NullEngine;

  const chalk = getOrCreateMat(scene, 'euChalkCliffMat', () => {
    const m = new B.PBRMaterial('euChalkCliffMat', scene);
    m.albedoColor = c3('#d8d2c2'); // sunlit White Cliffs of Dover chalk-limestone (textured, never flat white!)
    m.metallic = 0.0; m.roughness = 0.92;
    if (!isNull) {
      const diff = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
      diff.uScale = diff.vScale = 3.2;
      m.albedoTexture = diff;
      const bump = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', scene);
      bump.uScale = bump.vScale = 3.2;
      m.bumpTexture = bump;
      m.bumpTexture.level = 1.25;
    }
    return m;
  });

  const limestone = getOrCreateMat(scene, 'euLimestoneMat', () => {
    const m = new B.PBRMaterial('euLimestoneMat', scene);
    m.albedoColor = c3('#ddd3be');
    m.metallic = 0.02; m.roughness = 0.84;
    if (!isNull) {
      const t = createEuropeanMasonryTextures(scene);
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.9;
    }
    return m;
  });

  const timber = getOrCreateMat(scene, 'euTimberFacadeMat', () => {
    const m = new B.PBRMaterial('euTimberFacadeMat', scene);
    m.albedoColor = c3('#e2d8c4');
    m.metallic = 0.02; m.roughness = 0.82;
    if (!isNull) {
      const t = createTimberCottageTextures(scene);
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.85;
    }
    return m;
  });

  const slateRoof = getOrCreateMat(scene, 'euSlateRoofMat', () => {
    const m = new B.PBRMaterial('euSlateRoofMat', scene);
    m.albedoColor = c3('#596675');
    m.metallic = 0.14; m.roughness = 0.66;
    if (!isNull) {
      const t = createRoofTileTextures(scene, 'euSlate', '#505d6b', '#2c343d');
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.8;
    }
    return m;
  });

  const terracotta = getOrCreateMat(scene, 'euTerracottaMat', () => {
    const m = new B.PBRMaterial('euTerracottaMat', scene);
    m.albedoColor = c3('#ba563a');
    m.metallic = 0.04; m.roughness = 0.76;
    if (!isNull) {
      const t = createRoofTileTextures(scene, 'euTerra', '#b34f34', '#6e2c1b');
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.8;
    }
    return m;
  });

  const iron = getOrCreateMat(scene, 'euIronLatticeMat', () => {
    const m = new B.PBRMaterial('euIronLatticeMat', scene);
    m.albedoColor = c3('#4d545c');
    m.metallic = 0.68; m.roughness = 0.42;
    return m;
  });

  const grass = getOrCreateMat(scene, 'euMeadowGrassMat', () => {
    const m = new B.PBRMaterial('euMeadowGrassMat', scene);
    m.albedoColor = c3('#96aa6f');
    m.metallic = 0.0; m.roughness = 0.92;
    if (!isNull) {
      const diff = new B.Texture('./assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg', scene);
      diff.uScale = diff.vScale = 4.0;
      m.albedoTexture = diff;
      const bump = new B.Texture('./assets/benchmark/textures/aerial_grass_rock/nor_gl.jpg', scene);
      bump.uScale = bump.vScale = 4.0;
      m.bumpTexture = bump;
      m.bumpTexture.level = 0.85;
    }
    return m;
  });

  const waterfallMat = getOrCreateMat(scene, 'euHorizonWaterfallMat', () => {
    const m = new B.StandardMaterial('euHorizonWaterfallMat', scene);
    m.emissiveColor = c3('#e4f3fc');
    m.diffuseColor = c3('#ffffff');
    m.disableLighting = true;
    m.backFaceCulling = false;
    m.depthWrite = false;
    if (!isNull) {
      const wfTex = new B.DynamicTexture('euWaterfallGradTex', { width: 64, height: 128 }, scene, false);
      const wCtx = wfTex.getContext();
      const g = wCtx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0.0, 'rgba(255,255,255,0.88)');
      g.addColorStop(0.55, 'rgba(225,244,255,0.62)');
      g.addColorStop(1.0, 'rgba(220,240,255,0.0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(0, 0, 64, 128);
      wfTex.update();
      wfTex.hasAlpha = true;
      m.diffuseTexture = wfTex;
      m.opacityTexture = wfTex;
    } else {
      m.alpha = 0.65;
    }
    return m;
  });

  const warmWin = getOrCreateMat(scene, 'euWarmWindowMat', () => {
    const m = new B.StandardMaterial('euWarmWindowMat', scene);
    m.emissiveColor = c3('#ffd27d');
    m.diffuseColor = c3('#ffe8b6');
    m.disableLighting = true;
    return m;
  });

  return { chalk, limestone, timber, slateRoof, terracotta, iron, grass, waterfallMat, warmWin };
}

function mergeGroup(meshes, name, parent, material, shadowGen = null) {
  if (!meshes.length) return null;
  for (const m of meshes) m.computeWorldMatrix(true);
  const merged = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, false);
  if (!merged) return null;
  merged.name = name;
  merged.parent = parent;
  merged.material = material;
  merged.receiveShadows = true;
  merged.isPickable = false;
  if (shadowGen) shadowGen.addShadowCaster(merged, false);
  return merged;
}

export function applyDoverChalkCliffs(builtSat, scene) {
  const pal = getEuropePalette(scene);
  if (builtSat?.island?.rock) builtSat.island.rock.material = pal.chalk;
  if (builtSat?.node) {
    for (const m of builtSat.node.getChildMeshes()) {
      if (m.name.includes('satelliteRoots_')) m.material = pal.chalk;
    }
  }
}

/**
 * Helper: Creates a pitched gable roof prism (much more European than a cone!).
 */
function addGableRoof(arr, scene, name, width, height, depth, x, y, z, ry = 0) {
  const roof = BABYLON.MeshBuilder.CreateCylinder(name, { diameter: depth * 1.18, height: width, tessellation: 3 }, scene);
  roof.position.set(x, y + height * 0.38, z);
  roof.rotation.set(0, ry, Math.PI * 0.5);
  roof.scaling.set(height / (depth * 0.58), 1.0, 1.0);
  arr.push(roof);
}

/**
 * 1. British Coasts: White Cliffs of Dover village, gothic abbey church, half-timbered cottages & lathed coastal lighthouse!
 */
export function buildDoverCliffVillage(scene, parent, island, rx = 24, rz = 19) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euDoverVillage', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], timber = [], slate = [], red = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Sculpted Lathed British Coastal Lighthouse (Babylon.js CreateLathe!)
  const lx = rx * 0.54, lz = -rz * 0.24, ly = hAt(lx, lz);
  const lhProfile = [
    new B.Vector3(2.2, 0, 0), new B.Vector3(1.9, 2.0, 0), new B.Vector3(1.5, 6.5, 0),
    new B.Vector3(1.25, 10.2, 0), new B.Vector3(1.65, 10.6, 0), new B.Vector3(1.65, 11.2, 0),
    new B.Vector3(1.1, 11.2, 0),
  ];
  const lhBody = B.MeshBuilder.CreateLathe('dvLhLathe', { shape: lhProfile, tessellation: 14 }, scene);
  put(stone, lhBody, lx, ly - 0.3, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLhBand', { diameterTop: 2.7, diameterBottom: 3.1, height: 3.2, tessellation: 14 }, scene), lx, ly + 6.4, lz);
  put(glow, B.MeshBuilder.CreateCylinder('dvLhLamp', { diameter: 1.85, height: 1.7, tessellation: 12 }, scene), lx, ly + 11.9, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLhDome', { diameterTop: 0.25, diameterBottom: 2.6, height: 1.9, tessellation: 12 }, scene), lx, ly + 13.5, lz);

  // English Stone Parish Church with pitched gable roof, buttresses & twin spires
  const cx = -3, cz = -2, cy = hAt(cx, cz);
  put(stone, B.MeshBuilder.CreateBox('dvChurchNave', { width: 9.8, height: 5.8, depth: 5.4 }, scene), cx, cy + 2.6, cz);
  addGableRoof(slate, scene, 'dvChurchGable', 10.4, 3.2, 5.8, cx, cy + 5.6, cz, 0);
  for (const tz of [-1.9, 1.9]) {
    put(stone, B.MeshBuilder.CreateBox(`dvTower_${tz}`, { width: 2.8, height: 11.2, depth: 2.8 }, scene), cx - 4.6, cy + 5.2, cz + tz);
    put(slate, B.MeshBuilder.CreateCylinder(`dvSpire_${tz}`, { diameterTop: 0.2, diameterBottom: 3.1, height: 4.8, tessellation: 4 }, scene), cx - 4.6, cy + 13.0, cz + tz, 0, Math.PI * 0.25);
  }

  // Half-timbered English cottages with pitched terracotta/slate gable roofs & stone chimneys
  const cottages = [
    { x: 4.5, z: 5.5, ry: 0.3, redRoof: true },
    { x: -7.5, z: 6.2, ry: -0.4, redRoof: false },
    { x: 1.5, z: -8.0, ry: 0.8, redRoof: true },
    { x: -10.0, z: -6.5, ry: 0.1, redRoof: false },
  ];
  cottages.forEach((c, idx) => {
    const y = hAt(c.x, c.z);
    put(timber, B.MeshBuilder.CreateBox(`dvCot_${idx}`, { width: 5.0, height: 3.2, depth: 3.8 }, scene), c.x, y + 1.4, c.z, 0, c.ry);
    addGableRoof(c.redRoof ? red : slate, scene, `dvCotR_${idx}`, 5.5, 2.2, 4.2, c.x, y + 3.0, c.z, c.ry);
    put(stone, B.MeshBuilder.CreateBox(`dvChim_${idx}`, { width: 0.75, height: 2.8, depth: 0.75 }, scene), c.x + 1.4, y + 3.9, c.z + 0.6, 0, c.ry);
  });

  mergeGroup(stone, 'euDoverStone', root, pal.limestone, null);
  mergeGroup(timber, 'euDoverTimber', root, pal.timber, null);
  mergeGroup(slate, 'euDoverSlate', root, pal.slateRoof, null);
  mergeGroup(red, 'euDoverRed', root, pal.terracotta, null);
  mergeGroup(glow, 'euDoverGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 2. Continental Sky-City: Parisian Eiffel-inspired curved lattice spire, textured Haussmann blocks & arched viaduct!
 */
export function buildContinentalSkyCity(scene, parent, island, rx = 22, rz = 18) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euContinentalCity', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], iron = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Iconic 40m Parisian Curved Lattice Iron Spire (4 sweeping arched legs + 2 observation decks)
  const sx = 0, sz = 0, sy = hAt(sx, sz);
  for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const path = [
      new B.Vector3(sx + lx * 4.4, sy - 0.5, sz + lz * 4.4),
      new B.Vector3(sx + lx * 2.4, sy + 9.0, sz + lz * 2.4),
      new B.Vector3(sx + lx * 1.1, sy + 20.0, sz + lz * 1.1),
      new B.Vector3(sx + lx * 0.3, sy + 36.0, sz + lz * 0.3),
    ];
    iron.push(B.MeshBuilder.CreateTube(`euSpireCurve_${lx}_${lz}`, { path, radius: 0.48, tessellation: 6 }, scene));
  }
  put(iron, B.MeshBuilder.CreateBox('euSpireDeck1', { width: 6.4, height: 1.0, depth: 6.4 }, scene), sx, sy + 11.5, sz);
  put(iron, B.MeshBuilder.CreateBox('euSpireDeck2', { width: 3.6, height: 0.9, depth: 3.6 }, scene), sx, sy + 22.5, sz);
  put(iron, B.MeshBuilder.CreateCylinder('euSpireNeedle', { diameterTop: 0.14, diameterBottom: 0.85, height: 8.5, tessellation: 8 }, scene), sx, sy + 39.5, sz);
  put(glow, B.MeshBuilder.CreateSphere('euSpireBeacon', { diameter: 1.4, segments: 8 }, scene), sx, sy + 44.0, sz);

  // Textured Haussmann Parisian boulevard blocks with mansard roofs & domes
  const blocks = [
    { x: -9.5, z: -4.5, w: 7.8, h: 6.8, d: 5.4, ry: 0.2 },
    { x:  9.0, z: -5.0, w: 7.2, h: 6.0, d: 5.2, ry: -0.25 },
    { x: -8.0, z:  6.5, w: 7.5, h: 5.8, d: 5.0, ry: -0.15 },
    { x:  8.5, z:  5.8, w: 6.8, h: 6.4, d: 4.8, ry: 0.3 },
  ];
  blocks.forEach((b, idx) => {
    const y = hAt(b.x, b.z);
    put(stone, B.MeshBuilder.CreateBox(`euHaus_${idx}`, { width: b.w, height: b.h, depth: b.d }, scene), b.x, y + b.h * 0.5 - 0.3, b.z, 0, b.ry);
    put(slate, B.MeshBuilder.CreateCylinder(`euMans_${idx}`, { diameterTop: b.w * 0.72, diameterBottom: b.w * 1.12, height: 2.2, tessellation: 4 }, scene), b.x, y + b.h + 0.7, b.z, 0, b.ry + Math.PI * 0.25);
  });

  // Stone Multi-Arch Railway Viaduct jutting off the island flank
  const vy = hAt(rx * 0.6, 0);
  put(stone, B.MeshBuilder.CreateBox('euViaductDeck', { width: 18.0, height: 1.3, depth: 3.6 }, scene), rx * 0.94, vy + 3.0, 0);
  for (const px of [-6, 0, 6]) {
    put(stone, B.MeshBuilder.CreateBox(`euViaductPier_${px}`, { width: 1.6, height: 8.5, depth: 3.2 }, scene), rx * 0.94 + px, vy - 1.5, 0);
  }
  for (const ax of [-3, 3]) {
    put(stone, B.MeshBuilder.CreateTorus(`euViaductArch_${ax}`, { diameter: 4.8, thickness: 1.0, tessellation: 14 }, scene), rx * 0.94 + ax, vy + 0.6, 0, Math.PI * 0.5, 0, 0);
  }

  mergeGroup(stone, 'euCityStone', root, pal.limestone, null);
  mergeGroup(slate, 'euCitySlate', root, pal.slateRoof, null);
  mergeGroup(iron, 'euCityIron', root, pal.iron, null);
  mergeGroup(glow, 'euCityGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 3. Alpine Highlands: Textured European Schloss Castle overlooking the Forest Island waterfall!
 */
export function buildAlpineCastleDiorama(scene, parent, pos, shadowGen = null) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euAlpineCastle', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stone = [], timber = [], slate = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Main textured Alpine Schloss keep with pitched gable roof & timber courtyard wing
  put(stone, B.MeshBuilder.CreateBox('euCastKeep', { width: 14.5, height: 11.8, depth: 9.8 }, scene), 0, 5.6, 0);
  addGableRoof(slate, scene, 'euCastKeepGable', 15.2, 5.2, 10.6, 0, 11.6, 0, 0);
  put(timber, B.MeshBuilder.CreateBox('euCastWing', { width: 10.8, height: 7.4, depth: 6.6 }, scene), -10.8, 3.4, 2.0);
  addGableRoof(slate, scene, 'euCastWingGable', 11.4, 3.6, 7.2, -10.8, 7.2, 2.0, 0);

  // Cylindrical corner turrets with lathed conical slate spires
  const towers = [
    { x:  7.4, z:  4.8, h: 16.8, d: 4.4 },
    { x:  7.4, z: -4.8, h: 13.8, d: 3.8 },
    { x: -6.8, z: -4.8, h: 19.0, d: 4.6 },
    { x: -15.4, z: 4.6, h: 12.2, d: 3.6 },
  ];
  towers.forEach((t, i) => {
    put(stone, B.MeshBuilder.CreateCylinder(`euCastTow_${i}`, { diameterTop: t.d * 0.94, diameterBottom: t.d, height: t.h, tessellation: 14 }, scene), t.x, t.h * 0.5, t.z);
    put(slate, B.MeshBuilder.CreateCylinder(`euCastSpire_${i}`, { diameterTop: 0.22, diameterBottom: t.d * 1.24, height: 6.4, tessellation: 14 }, scene), t.x, t.h + 3.0, t.z);
  });

  mergeGroup(stone, 'euCastleStone', root, pal.limestone, shadowGen);
  mergeGroup(timber, 'euCastleTimber', root, pal.timber, shadowGen);
  mergeGroup(slate, 'euCastleSlate', root, pal.slateRoof, shadowGen);
  mergeGroup(glow, 'euCastleGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 4. Old-World Gothic Abbey Ruins (weathered textured masonry arches & ruined cathedral bell tower).
 */
export function buildGothicRuinsDiorama(scene, parent, island) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euGothicRuins', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  const cy = hAt(0, 0);
  // Textured Gothic nave buttresses & sweeping pointed arch ribs
  for (let i = -2; i <= 2; i++) {
    const px = i * 5.2;
    const h = i === 0 ? 11.8 : 9.4 - Math.abs(i) * 1.0;
    put(stone, B.MeshBuilder.CreateBox(`euGothL_${i}`, { width: 1.8, height: h, depth: 2.0 }, scene), px, cy + h * 0.5, -5.4);
    put(stone, B.MeshBuilder.CreateBox(`euGothR_${i}`, { width: 1.8, height: h * 0.86, depth: 2.0 }, scene), px, cy + h * 0.42, 5.4);
    if (i > -2 && i < 2) {
      const archPath = [
        new B.Vector3(px, cy + h * 0.72, -5.0),
        new B.Vector3(px, cy + h * 1.05, 0),
        new B.Vector3(px, cy + h * 0.72, 5.0),
      ];
      stone.push(B.MeshBuilder.CreateTube(`euGothArch_${i}`, { path: archPath, radius: 0.55, tessellation: 6 }, scene));
    }
  }
  put(stone, B.MeshBuilder.CreateBox('euGothTower', { width: 5.8, height: 15.8, depth: 5.8 }, scene), -13.5, cy + 7.6, 0);
  put(slate, B.MeshBuilder.CreateCylinder('euGothCap', { diameterTop: 0.8, diameterBottom: 6.4, height: 4.5, tessellation: 4 }, scene), -13.5, cy + 17.5, 0, 0, Math.PI * 0.25);
  put(glow, B.MeshBuilder.CreateSphere('euGothBrazier', { diameter: 1.5, segments: 8 }, scene), 0, cy + 2.6, 0);

  mergeGroup(stone, 'euGothicStone', root, pal.limestone, null);
  mergeGroup(slate, 'euGothicSlate', root, pal.slateRoof, null);
  mergeGroup(glow, 'euGothicGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 5. Sunlit 360° Horizon of Organic European Sky-Islands:
 *    Multi-mass craggy chalk cliffs + real textured green meadows + textured European towns/castles/spires
 *    + cascading white cliff waterfalls plunging into the clouds (5 merged draw calls total!).
 */
export function buildEuropeHorizonArchipelago(scene, sculptCraggyRock) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const chalkParts = [], meadowParts = [], cityParts = [], roofParts = [], waterfallParts = [];
  const put = (arr, m, px, py, pz, rx = 0, ry = 0, rz = 0) => {
    m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.computeWorldMatrix(true); arr.push(m);
  };

  const islands = [
    [0.32,  920, 26, 'paris',   1.35],
    [1.08,  980, 38, 'dover',   1.40],
    [1.85,  880, 18, 'alpine',  1.30],
    [2.65, 1020, 34, 'viaduct', 1.45],
    [3.42,  910, 22, 'dover',   1.35],
    [4.18,  960, 32, 'paris',   1.42],
    [4.95,  870, 24, 'alpine',  1.30],
    [5.68,  950, 20, 'viaduct', 1.38],
    [0.70, 1420, 58, 'paris',   1.85],
    [2.25, 1520, 48, 'alpine',  1.90],
    [3.80, 1460, 52, 'dover',   1.85],
    [5.30, 1480, 44, 'viaduct', 1.80],
  ];

  islands.forEach(([ang, dist, y, kind, s], idx) => {
    const cx = Math.cos(ang) * dist;
    const cz = Math.sin(ang) * dist;
    const face = ang + Math.PI * 0.5;
    const ux = Math.cos(face), uz = Math.sin(face);
    const nx = -Math.cos(ang), nz = -Math.sin(ang); // inward toward center

    // 5-part organic multi-root sculpted cliff cluster (never a single geometric cone!)
    const core = B.MeshBuilder.CreateCylinder(`euHCliff_${idx}`, { diameterTop: 94 * s, diameterBottom: 26 * s, height: 66 * s, tessellation: 10, subdivisions: 3 }, scene);
    if (sculptCraggyRock) sculptCraggyRock(core, 91 + idx * 17.3, 0.34);
    put(chalkParts, core, cx, y - 28 * s, cz, 0, ang);
    for (const [ox, oz, dTop, h, seedOff] of [
      [-32, -8, 52, 62, 11], [34, 6, 48, 56, 23], [-12, 26, 42, 52, 37], [16, -24, 40, 48, 53],
    ]) {
      const sh = B.MeshBuilder.CreateCylinder(`euHSh_${idx}_${seedOff}`, { diameterTop: dTop * s, diameterBottom: 7 * s, height: h * s, tessellation: 8, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(sh, 131 + idx * 13 + seedOff, 0.36);
      put(chalkParts, sh, cx + (ux * ox + nx * oz) * s, y - (28 + (seedOff % 9)) * s, cz + (uz * ox + nz * oz) * s, 0, ang + seedOff * 0.2);
    }

    // Textured lush green European meadow cap
    const cap = B.MeshBuilder.CreateCylinder(`euHCap_${idx}`, { diameterTop: 90 * s, diameterBottom: 96 * s, height: 6 * s, tessellation: 10 }, scene);
    put(meadowParts, cap, cx, y + 6 * s, cz, 0, ang);

    // Cascading white cliff waterfall plunging from the island edge into the cloud sea (artbook signature!)
    if (idx % 2 === 0) {
      const wf = B.MeshBuilder.CreateBox(`euHWaterfall_${idx}`, { width: 10 * s, height: 85 * s, depth: 2.2 * s }, scene);
      put(waterfallParts, wf, cx + nx * 44 * s, y - 36 * s, cz + nz * 44 * s, 0, ang + Math.PI * 0.5);
    }

    if (kind === 'paris') {
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit1_${idx}`, { width: 34 * s, height: 14 * s, depth: 22 * s }, scene), cx, y + 14 * s, cz, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHSpire_${idx}`, { diameterTop: 1.6 * s, diameterBottom: 14 * s, height: 58 * s, tessellation: 4 }, scene), cx, y + 42 * s, cz, 0, ang + Math.PI * 0.25);
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit2_${idx}`, { width: 20 * s, height: 18 * s, depth: 16 * s }, scene), cx - ux * 24 * s, y + 16 * s, cz - uz * 24 * s, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHDome_${idx}`, { diameterTop: 4 * s, diameterBottom: 18 * s, height: 10 * s, tessellation: 8 }, scene), cx - ux * 24 * s, y + 29 * s, cz - uz * 24 * s);
    } else if (kind === 'dover') {
      put(cityParts, B.MeshBuilder.CreateCylinder(`euHLh_${idx}`, { diameterTop: 3.5 * s, diameterBottom: 6.5 * s, height: 28 * s, tessellation: 10 }, scene), cx + ux * 28 * s, y + 22 * s, cz + uz * 28 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHManor_${idx}`, { width: 26 * s, height: 12 * s, depth: 16 * s }, scene), cx - ux * 12 * s, y + 14 * s, cz - uz * 12 * s, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHManorR_${idx}`, { diameterTop: 2 * s, diameterBottom: 24 * s, height: 10 * s, tessellation: 4 }, scene), cx - ux * 12 * s, y + 24 * s, cz - uz * 12 * s, 0, ang + Math.PI * 0.25);
    } else if (kind === 'alpine') {
      put(cityParts, B.MeshBuilder.CreateBox(`euHKeep_${idx}`, { width: 24 * s, height: 22 * s, depth: 16 * s }, scene), cx, y + 18 * s, cz, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHKeepR_${idx}`, { diameterTop: 2 * s, diameterBottom: 22 * s, height: 11 * s, tessellation: 4 }, scene), cx, y + 34 * s, cz, 0, ang + Math.PI * 0.25);
      for (const side of [-1, 1]) {
        put(cityParts, B.MeshBuilder.CreateCylinder(`euHTow_${idx}_${side}`, { diameterTop: 6.5 * s, diameterBottom: 8 * s, height: 32 * s, tessellation: 10 }, scene), cx + ux * side * 15 * s, y + 24 * s, cz + uz * side * 15 * s);
        put(roofParts, B.MeshBuilder.CreateCylinder(`euHCon_${idx}_${side}`, { diameterTop: 0.8 * s, diameterBottom: 9.5 * s, height: 16 * s, tessellation: 10 }, scene), cx + ux * side * 15 * s, y + 48 * s, cz + uz * side * 15 * s);
      }
    } else {
      const cliff2 = B.MeshBuilder.CreateCylinder(`euHCliffB_${idx}`, { diameterTop: 56 * s, diameterBottom: 10 * s, height: 64 * s, tessellation: 9, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(cliff2, 203 + idx * 11, 0.34);
      put(chalkParts, cliff2, cx + ux * 70 * s, y - 28 * s, cz + uz * 70 * s, 0, ang);
      put(meadowParts, B.MeshBuilder.CreateCylinder(`euHCapB_${idx}`, { diameterTop: 52 * s, diameterBottom: 56 * s, height: 6 * s, tessellation: 9 }, scene), cx + ux * 70 * s, y + 5 * s, cz + uz * 70 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHBridge_${idx}`, { width: 74 * s, height: 7 * s, depth: 8 * s }, scene), cx + ux * 35 * s, y + 11 * s, cz + uz * 35 * s, 0, face);
    }
  });

  const finalize = (arr, name, mat) => {
    if (!arr.length) return;
    const m = B.Mesh.MergeMeshes(arr, true, true, undefined, false, false);
    if (m) {
      m.name = name;
      m.material = mat;
      m.isPickable = false;
      m.checkCollisions = false;
      m.receiveShadows = false;
      m.freezeWorldMatrix();
    }
  };
  finalize(chalkParts, 'horizonEuropeChalkCliffs', pal.chalk);
  finalize(meadowParts, 'horizonEuropeMeadows', pal.grass);
  finalize(cityParts, 'horizonEuropeCities', pal.limestone);
  finalize(roofParts, 'horizonEuropeSpires', pal.slateRoof);
  finalize(waterfallParts, 'horizonEuropeWaterfalls', pal.waterfallMat);
}
