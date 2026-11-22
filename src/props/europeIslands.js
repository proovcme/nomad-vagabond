/**
 * «Осколки Европы Интербеллума (1920–1939)» — Modular 3D European Island Dioramas & Horizon Architecture.
 * Replaces bare geometric rock spikes with recognizable fragments of Europe:
 *   - White Cliffs of Dover + English coastal village, church spire & lighthouse
 *   - Continental Art-Deco / Belle Époque Sky-City with lattice iron spire & stone viaduct
 *   - Alpine Schloss Castle overlooking the waterfall
 *   - Old-World Gothic Abbey Ruins with pointed arches
 *   - Distant low-LOD European Sky-Islands (2 merged draw calls total!)
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function getOrCreateMat(scene, name, factory) {
  return scene.getMaterialByName(name) || factory();
}

export function getEuropePalette(scene) {
  const B = BABYLON;
  const chalk = getOrCreateMat(scene, 'euChalkCliffMat', () => {
    const m = new B.PBRMaterial('euChalkCliffMat', scene);
    m.albedoColor = c3('#e6e2d6'); // sunlit White Cliffs of Dover chalk-limestone
    m.metallic = 0.0; m.roughness = 0.90;
    if (!(scene.getEngine() instanceof B.NullEngine)) {
      const diff = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
      diff.uScale = diff.vScale = 3.5;
      m.albedoTexture = diff;
      const bump = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', scene);
      bump.uScale = bump.vScale = 3.5;
      m.bumpTexture = bump;
      m.bumpTexture.level = 1.1;
    }
    return m;
  });
  const limestone = getOrCreateMat(scene, 'euLimestoneMat', () => {
    const m = new B.PBRMaterial('euLimestoneMat', scene);
    m.albedoColor = c3('#d5cab2'); // warm Parisian / Alpine cream stone
    m.metallic = 0.02; m.roughness = 0.84;
    return m;
  });
  const slateRoof = getOrCreateMat(scene, 'euSlateRoofMat', () => {
    const m = new B.PBRMaterial('euSlateRoofMat', scene);
    m.albedoColor = c3('#475361'); // European blue-slate castle & mansard roofs
    m.metallic = 0.12; m.roughness = 0.68;
    return m;
  });
  const terracotta = getOrCreateMat(scene, 'euTerracottaMat', () => {
    const m = new B.PBRMaterial('euTerracottaMat', scene);
    m.albedoColor = c3('#ad4d34'); // Mediterranean / English red tile & brick
    m.metallic = 0.05; m.roughness = 0.78;
    return m;
  });
  const iron = getOrCreateMat(scene, 'euIronLatticeMat', () => {
    const m = new B.PBRMaterial('euIronLatticeMat', scene);
    m.albedoColor = c3('#525860'); // Eiffel / Art-Deco riveted ironwork
    m.metallic = 0.64; m.roughness = 0.44;
    return m;
  });
  const grass = getOrCreateMat(scene, 'euMeadowGrassMat', () => {
    const m = new B.PBRMaterial('euMeadowGrassMat', scene);
    m.albedoColor = c3('#6b8452'); // lush European green pastures & downs
    m.metallic = 0.0; m.roughness = 0.92;
    return m;
  });
  const warmWin = getOrCreateMat(scene, 'euWarmWindowMat', () => {
    const m = new B.StandardMaterial('euWarmWindowMat', scene);
    m.emissiveColor = c3('#ffd27d');
    m.diffuseColor = c3('#ffe8b6');
    m.disableLighting = true;
    return m;
  });
  return { chalk, limestone, slateRoof, terracotta, iron, grass, warmWin };
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

/**
 * Applies iconic White Cliffs of Dover chalk-white rock material to a satellite island's cliffs.
 */
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
 * 1. British Coasts: White Cliffs of Dover village, gothic stone church, cottages & coastal lighthouse!
 */
export function buildDoverCliffVillage(scene, parent, island, rx = 24, rz = 19) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euDoverVillage', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], red = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Coastal British Lighthouse on the seaward cliff edge
  const lx = rx * 0.56, lz = -rz * 0.25, ly = hAt(lx, lz);
  put(stone, B.MeshBuilder.CreateCylinder('dvLh1', { diameterTop: 2.8, diameterBottom: 4.0, height: 6.5, tessellation: 12 }, scene), lx, ly + 3.0, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLh2', { diameterTop: 2.3, diameterBottom: 2.8, height: 4.5, tessellation: 12 }, scene), lx, ly + 8.5, lz);
  put(glow, B.MeshBuilder.CreateCylinder('dvLhLamp', { diameter: 1.8, height: 1.6, tessellation: 10 }, scene), lx, ly + 11.5, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLhDome', { diameterTop: 0.3, diameterBottom: 2.6, height: 1.8, tessellation: 10 }, scene), lx, ly + 13.1, lz);

  // Small English stone abbey church with twin towers on the crest
  const cx = -3, cz = -2, cy = hAt(cx, cz);
  put(stone, B.MeshBuilder.CreateBox('dvChurchNave', { width: 9.2, height: 5.4, depth: 5.2 }, scene), cx, cy + 2.5, cz);
  put(slate, B.MeshBuilder.CreateCylinder('dvChurchRoof', { diameterTop: 0.4, diameterBottom: 7.4, height: 3.2, tessellation: 4 }, scene), cx, cy + 6.6, cz, 0, Math.PI * 0.25);
  for (const tz of [-1.8, 1.8]) {
    put(stone, B.MeshBuilder.CreateBox(`dvTower_${tz}`, { width: 2.6, height: 10.5, depth: 2.6 }, scene), cx - 4.4, cy + 5.0, cz + tz);
    put(slate, B.MeshBuilder.CreateCylinder(`dvSpire_${tz}`, { diameterTop: 0.2, diameterBottom: 2.8, height: 4.2, tessellation: 4 }, scene), cx - 4.4, cy + 12.2, cz + tz, 0, Math.PI * 0.25);
  }

  // Cluster of 4 cozy English cottages with pitched terracotta/slate roofs & warm windows
  const cottages = [
    { x: 4.5, z: 5.5, ry: 0.3, redRoof: true },
    { x: -7.5, z: 6.2, ry: -0.4, redRoof: false },
    { x: 1.5, z: -8.0, ry: 0.8, redRoof: true },
    { x: -10.0, z: -6.5, ry: 0.1, redRoof: false },
  ];
  cottages.forEach((c, idx) => {
    const y = hAt(c.x, c.z);
    put(stone, B.MeshBuilder.CreateBox(`dvCot_${idx}`, { width: 4.6, height: 3.0, depth: 3.6 }, scene), c.x, y + 1.3, c.z, 0, c.ry);
    put(c.redRoof ? red : slate, B.MeshBuilder.CreateCylinder(`dvCotR_${idx}`, { diameterTop: 0.3, diameterBottom: 5.6, height: 2.1, tessellation: 4 }, scene), c.x, y + 3.8, c.z, 0, c.ry + Math.PI * 0.25);
    put(glow, B.MeshBuilder.CreateBox(`dvCotW_${idx}`, { width: 1.2, height: 0.9, depth: 3.72 }, scene), c.x, y + 1.6, c.z, 0, c.ry);
  });

  mergeGroup(stone, 'euDoverStone', root, pal.limestone, null);
  mergeGroup(slate, 'euDoverSlate', root, pal.slateRoof, null);
  mergeGroup(red, 'euDoverRed', root, pal.terracotta, null);
  mergeGroup(glow, 'euDoverGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 2. Continental Sky-City: Parisian Eiffel-inspired Iron Spire, Haussmann mansard blocks & stone viaduct!
 */
export function buildContinentalSkyCity(scene, parent, island, rx = 22, rz = 18) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euContinentalCity', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], iron = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Iconic 36m Lattice Iron Spire (Eiffel-inspired 1930s Continental landmark!)
  const sx = 0, sz = 0, sy = hAt(sx, sz);
  for (const [lx, lz] of [[-3.2, -3.2], [3.2, -3.2], [-3.2, 3.2], [3.2, 3.2]]) {
    put(iron, B.MeshBuilder.CreateCylinder(`euSpireLeg_${lx}_${lz}`, { diameterTop: 0.55, diameterBottom: 1.6, height: 18.0, tessellation: 6 }, scene), sx + lx * 0.65, sy + 8.5, sz + lz * 0.65, lz * 0.045, 0, -lx * 0.045);
  }
  put(iron, B.MeshBuilder.CreateBox('euSpireDeck1', { width: 5.4, height: 0.9, depth: 5.4 }, scene), sx, sy + 14.5, sz);
  put(iron, B.MeshBuilder.CreateCylinder('euSpireUpper', { diameterTop: 0.5, diameterBottom: 3.4, height: 18.5, tessellation: 4 }, scene), sx, sy + 24.0, sz, 0, Math.PI * 0.25);
  put(iron, B.MeshBuilder.CreateCylinder('euSpireTip', { diameterTop: 0.12, diameterBottom: 0.45, height: 5.5, tessellation: 6 }, scene), sx, sy + 35.5, sz);
  put(glow, B.MeshBuilder.CreateSphere('euSpireBeacon', { diameter: 1.3, segments: 8 }, scene), sx, sy + 38.4, sz);

  // Haussmann-style Continental boulevard blocks with slate mansard roofs & warm windows
  const blocks = [
    { x: -9.5, z: -4.5, w: 7.4, h: 6.2, d: 5.2, ry: 0.2 },
    { x:  9.0, z: -5.0, w: 6.8, h: 5.6, d: 5.0, ry: -0.25 },
    { x: -8.0, z:  6.5, w: 7.2, h: 5.4, d: 4.8, ry: -0.15 },
    { x:  8.5, z:  5.8, w: 6.4, h: 6.0, d: 4.6, ry: 0.3 },
  ];
  blocks.forEach((b, idx) => {
    const y = hAt(b.x, b.z);
    put(stone, B.MeshBuilder.CreateBox(`euHaus_${idx}`, { width: b.w, height: b.h, depth: b.d }, scene), b.x, y + b.h * 0.5 - 0.3, b.z, 0, b.ry);
    put(slate, B.MeshBuilder.CreateCylinder(`euMans_${idx}`, { diameterTop: b.w * 0.65, diameterBottom: b.w * 1.15, height: 2.0, tessellation: 4 }, scene), b.x, y + b.h + 0.6, b.z, 0, b.ry + Math.PI * 0.25);
    put(glow, B.MeshBuilder.CreateBox(`euHausW_${idx}`, { width: b.w * 0.72, height: 1.1, depth: b.d + 0.16 }, scene), b.x, y + b.h * 0.55, b.z, 0, b.ry);
  });

  // Stone multi-arch viaduct jutting off the island flank
  const vy = hAt(rx * 0.6, 0);
  put(stone, B.MeshBuilder.CreateBox('euViaductDeck', { width: 16.0, height: 1.2, depth: 3.4 }, scene), rx * 0.92, vy + 2.6, 0);
  for (const px of [-5, 0, 5]) {
    put(stone, B.MeshBuilder.CreateBox(`euViaductPier_${px}`, { width: 1.5, height: 7.5, depth: 3.0 }, scene), rx * 0.92 + px, vy - 1.2, 0);
  }

  mergeGroup(stone, 'euCityStone', root, pal.limestone, null);
  mergeGroup(slate, 'euCitySlate', root, pal.slateRoof, null);
  mergeGroup(iron, 'euCityIron', root, pal.iron, null);
  mergeGroup(glow, 'euCityGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 3. Alpine Highlands: Fairytale European Castle / Schloss overlooking the Forest Island waterfall!
 */
export function buildAlpineCastleDiorama(scene, parent, pos, shadowGen = null) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euAlpineCastle', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stone = [], slate = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Main Alpine Schloss keep & curtain walls
  put(stone, B.MeshBuilder.CreateBox('euCastKeep', { width: 14.0, height: 11.5, depth: 9.5 }, scene), 0, 5.5, 0);
  put(slate, B.MeshBuilder.CreateCylinder('euCastKeepRoof', { diameterTop: 0.6, diameterBottom: 14.5, height: 5.2, tessellation: 4 }, scene), 0, 13.8, 0, 0, Math.PI * 0.25);
  put(stone, B.MeshBuilder.CreateBox('euCastWing', { width: 10.5, height: 7.2, depth: 6.5 }, scene), -10.5, 3.4, 2.0);
  put(slate, B.MeshBuilder.CreateCylinder('euCastWingRoof', { diameterTop: 0.5, diameterBottom: 10.5, height: 3.6, tessellation: 4 }, scene), -10.5, 8.8, 2.0, 0, Math.PI * 0.25);
  // Four cylindrical fairytale corner turrets with steep blue-slate conical spires!
  const towers = [
    { x:  7.2, z:  4.8, h: 16.5, d: 4.2 },
    { x:  7.2, z: -4.8, h: 13.5, d: 3.6 },
    { x: -6.8, z: -4.8, h: 18.5, d: 4.4 },
    { x: -15.2, z: 4.6, h: 12.0, d: 3.4 },
  ];
  towers.forEach((t, i) => {
    put(stone, B.MeshBuilder.CreateCylinder(`euCastTow_${i}`, { diameterTop: t.d * 0.92, diameterBottom: t.d, height: t.h, tessellation: 12 }, scene), t.x, t.h * 0.5, t.z);
    put(slate, B.MeshBuilder.CreateCylinder(`euCastSpire_${i}`, { diameterTop: 0.25, diameterBottom: t.d * 1.18, height: 5.8, tessellation: 12 }, scene), t.x, t.h + 2.8, t.z);
    put(glow, B.MeshBuilder.CreateBox(`euCastWin_${i}`, { width: 0.9, height: 1.6, depth: t.d + 0.15 }, scene), t.x, t.h * 0.72, t.z);
  });
  put(glow, B.MeshBuilder.CreateBox('euCastHallWin', { width: 9.0, height: 1.8, depth: 9.7 }, scene), 0, 7.6, 0);

  mergeGroup(stone, 'euCastleStone', root, pal.limestone, shadowGen);
  mergeGroup(slate, 'euCastleSlate', root, pal.slateRoof, shadowGen);
  mergeGroup(glow, 'euCastleGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 4. Old-World Gothic Abbey Ruins (shattered cathedral nave arches & ruined bell tower).
 */
export function buildGothicRuinsDiorama(scene, parent, island) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euGothicRuins', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  const cy = hAt(0, 0);
  // Broken twin-buttress Gothic nave arches
  for (let i = -2; i <= 2; i++) {
    const px = i * 5.2;
    const h = i === 0 ? 11.5 : 9.2 - Math.abs(i) * 1.1;
    put(stone, B.MeshBuilder.CreateBox(`euGothL_${i}`, { width: 1.6, height: h, depth: 1.8 }, scene), px, cy + h * 0.5, -5.2);
    put(stone, B.MeshBuilder.CreateBox(`euGothR_${i}`, { width: 1.6, height: h * 0.85, depth: 1.8 }, scene), px, cy + h * 0.42, 5.2);
    if (i > -2 && i < 2) {
      put(stone, B.MeshBuilder.CreateBox(`euGothRib_${i}`, { width: 1.2, height: 1.4, depth: 11.2 }, scene), px, cy + h * 0.86, 0, 0.08 * i);
    }
  }
  // Ruined Gothic west-front bell tower
  put(stone, B.MeshBuilder.CreateBox('euGothTower', { width: 5.4, height: 15.5, depth: 5.4 }, scene), -13.5, cy + 7.5, 0);
  put(glow, B.MeshBuilder.CreateSphere('euGothBrazier', { diameter: 1.5, segments: 8 }, scene), 0, cy + 2.6, 0);

  mergeGroup(stone, 'euGothicStone', root, pal.limestone, null);
  mergeGroup(glow, 'euGothicGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 5. Replaces dark geometric horizon rock spikes with a sunlit 360° ring of distant low-LOD
 *    Fragments of Europe (Dover Chalk Mesas, Continental Parisian Sky-Cities, Alpine Castles & Stone Viaducts)
 *    merged into just 3 draw calls total (cliffs, green meadows, European cities/spires)!
 */
export function buildEuropeHorizonArchipelago(scene, sculptCraggyRock) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const chalkParts = [], meadowParts = [], cityParts = [], roofParts = [];
  const put = (arr, m, px, py, pz, rx = 0, ry = 0, rz = 0) => {
    m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.computeWorldMatrix(true); arr.push(m);
  };

  const islands = [
    // angle, distance, y, kind ('paris' | 'dover' | 'alpine' | 'viaduct'), scale
    [0.32,  920, 26, 'paris',   1.35],
    [1.08,  980, 38, 'dover',   1.40],
    [1.85,  880, 18, 'alpine',  1.30],
    [2.65, 1020, 34, 'viaduct', 1.45],
    [3.42,  910, 22, 'dover',   1.35],
    [4.18,  960, 32, 'paris',   1.42],
    [4.95,  870, 24, 'alpine',  1.30],
    [5.68,  950, 20, 'viaduct', 1.38],
    // Outer ultra-far European sky-citadels (1380–1580m)
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

    // Multi-root sculpted chalk/limestone floating mesa (3 asymmetric craggy cliff masses — zero smooth cones!)
    const cliff = B.MeshBuilder.CreateCylinder(`euHCliff_${idx}`, { diameterTop: 88 * s, diameterBottom: 24 * s, height: 64 * s, tessellation: 9, subdivisions: 3 }, scene);
    if (sculptCraggyRock) sculptCraggyRock(cliff, 91 + idx * 17.3, 0.32);
    put(chalkParts, cliff, cx, y - 28 * s, cz, 0, ang);
    for (const side of [-1, 1]) {
      const sh = B.MeshBuilder.CreateCylinder(`euHShoulder_${idx}_${side}`, { diameterTop: 46 * s, diameterBottom: 8 * s, height: 58 * s, tessellation: 7, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(sh, 131 + idx * 9 + side * 7, 0.34);
      put(chalkParts, sh, cx + ux * side * 26 * s, y - 34 * s, cz + uz * side * 26 * s, 0, ang + side * 0.6);
    }

    // Lush green European meadow cap on top of the cliffs
    const cap = B.MeshBuilder.CreateCylinder(`euHCap_${idx}`, { diameterTop: 82 * s, diameterBottom: 88 * s, height: 7 * s, tessellation: 9 }, scene);
    put(meadowParts, cap, cx, y + 6 * s, cz, 0, ang);

    if (kind === 'paris') {
      // Continental Sky-City skyline + iconic tall iron lattice spire!
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit1_${idx}`, { width: 32 * s, height: 14 * s, depth: 22 * s }, scene), cx, y + 14 * s, cz, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHSpire_${idx}`, { diameterTop: 1.6 * s, diameterBottom: 14 * s, height: 58 * s, tessellation: 4 }, scene), cx, y + 42 * s, cz, 0, ang + Math.PI * 0.25);
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit2_${idx}`, { width: 18 * s, height: 18 * s, depth: 16 * s }, scene), cx - ux * 22 * s, y + 16 * s, cz - uz * 22 * s, 0, ang);
    } else if (kind === 'dover') {
      // White Cliffs of Dover coastal lighthouse + English manor town
      put(cityParts, B.MeshBuilder.CreateCylinder(`euHLh_${idx}`, { diameterTop: 3.5 * s, diameterBottom: 6.5 * s, height: 28 * s, tessellation: 8 }, scene), cx + ux * 26 * s, y + 22 * s, cz + uz * 26 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHManor_${idx}`, { width: 24 * s, height: 12 * s, depth: 16 * s }, scene), cx - ux * 10 * s, y + 14 * s, cz - uz * 10 * s, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHManorR_${idx}`, { diameterTop: 2 * s, diameterBottom: 22 * s, height: 10 * s, tessellation: 4 }, scene), cx - ux * 10 * s, y + 24 * s, cz - uz * 10 * s, 0, ang + Math.PI * 0.25);
    } else if (kind === 'alpine') {
      // Fairytale Alpine Castle with twin pointed spires
      put(cityParts, B.MeshBuilder.CreateBox(`euHKeep_${idx}`, { width: 22 * s, height: 22 * s, depth: 16 * s }, scene), cx, y + 18 * s, cz, 0, ang);
      for (const side of [-1, 1]) {
        put(cityParts, B.MeshBuilder.CreateCylinder(`euHTow_${idx}_${side}`, { diameterTop: 6 * s, diameterBottom: 8 * s, height: 32 * s, tessellation: 8 }, scene), cx + ux * side * 14 * s, y + 24 * s, cz + uz * side * 14 * s);
        put(roofParts, B.MeshBuilder.CreateCylinder(`euHCon_${idx}_${side}`, { diameterTop: 0.8 * s, diameterBottom: 9 * s, height: 16 * s, tessellation: 8 }, scene), cx + ux * side * 14 * s, y + 48 * s, cz + uz * side * 14 * s);
      }
    } else {
      // Twin-island Stone Viaduct Bridge + European abbey
      const cliff2 = B.MeshBuilder.CreateCylinder(`euHCliffB_${idx}`, { diameterTop: 52 * s, diameterBottom: 10 * s, height: 64 * s, tessellation: 8, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(cliff2, 203 + idx * 11, 0.24);
      put(chalkParts, cliff2, cx + ux * 68 * s, y - 28 * s, cz + uz * 68 * s, 0, ang);
      put(meadowParts, B.MeshBuilder.CreateCylinder(`euHCapB_${idx}`, { diameterTop: 48 * s, diameterBottom: 52 * s, height: 6 * s, tessellation: 8 }, scene), cx + ux * 68 * s, y + 5 * s, cz + uz * 68 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHBridge_${idx}`, { width: 72 * s, height: 6 * s, depth: 8 * s }, scene), cx + ux * 34 * s, y + 11 * s, cz + uz * 34 * s, 0, face);
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
}
