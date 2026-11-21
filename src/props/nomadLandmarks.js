/**
 * Project Nomads × Interbellum World-Building Landmarks & Living Carrier Details.
 * Every static kit merges into 1–3 draw calls so 60 FPS is preserved across all presets.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function getOrCreateMat(scene, name, builder) {
  const existing = scene.getMaterialByName(name);
  if (existing) return existing;
  return builder();
}

function getNomadPalette(scene) {
  const steel = getOrCreateMat(scene, 'nomadKitSteelMat', () => {
    const m = new BABYLON.PBRMaterial('nomadKitSteelMat', scene);
    m.albedoColor = c3('#4f5459');
    m.metallic = 0.68;
    m.roughness = 0.44;
    return m;
  });
  const brass = getOrCreateMat(scene, 'nomadKitBrassMat', () => {
    const m = new BABYLON.PBRMaterial('nomadKitBrassMat', scene);
    m.albedoColor = c3('#cfa052');
    m.metallic = 0.84;
    m.roughness = 0.28;
    return m;
  });
  const limestone = getOrCreateMat(scene, 'nomadKitLimestoneMat', () => {
    const m = new BABYLON.PBRMaterial('nomadKitLimestoneMat', scene);
    m.albedoColor = c3('#b9aa8e');
    m.metallic = 0.04;
    m.roughness = 0.88;
    return m;
  });
  const canvas = getOrCreateMat(scene, 'nomadKitCanvasMat', () => {
    const m = new BABYLON.PBRMaterial('nomadKitCanvasMat', scene);
    m.albedoColor = c3('#dfd2b4');
    m.metallic = 0.0;
    m.roughness = 0.92;
    m.backFaceCulling = false;
    return m;
  });
  const terracotta = getOrCreateMat(scene, 'nomadKitTerracottaMat', () => {
    const m = new BABYLON.PBRMaterial('nomadKitTerracottaMat', scene);
    m.albedoColor = c3('#a44e32');
    m.metallic = 0.08;
    m.roughness = 0.76;
    return m;
  });
  const warmGlow = getOrCreateMat(scene, 'nomadKitWarmGlowMat', () => {
    const m = new BABYLON.StandardMaterial('nomadKitWarmGlowMat', scene);
    m.emissiveColor = c3('#ffcb74');
    m.diffuseColor = c3('#ffe5b0');
    m.disableLighting = true;
    return m;
  });
  const aetherGlow = getOrCreateMat(scene, 'nomadKitAetherGlowMat', () => {
    const m = new BABYLON.StandardMaterial('nomadKitAetherGlowMat', scene);
    m.emissiveColor = c3('#4be4ff');
    m.diffuseColor = c3('#9af4ff');
    m.disableLighting = true;
    return m;
  });
  return { steel, brass, limestone, canvas, terracotta, warmGlow, aetherGlow };
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
 * Adds lived-in Sky-Carrier storytelling details to Vagabond:
 * - Hangar apron cargo crane gantry
 * - Pressurized copper fuel tanks & mooring bollards
 * - Warm illuminated cabin portholes carved into the carrier flanks
 * - Gentle funnel smoke plume (only on real GPU)
 */
export function decorateVagabondCarrier(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  const pal = getNomadPalette(scene);
  const steelParts = [];
  const brassParts = [];
  const glowParts = [];

  // 1. Hangar Apron Cargo Crane (starboard flight-deck edge, clear of runway corridor z=-9..+9)
  const cx = 8.5, cy = 3.4, cz = 11.4;
  const mast = BABYLON.MeshBuilder.CreateCylinder('vagCraneMast', { diameterTop: 0.55, diameterBottom: 0.85, height: 8.2, tessellation: 8 }, scene);
  mast.position.set(cx, cy + 4.1, cz); steelParts.push(mast);
  const basePed = BABYLON.MeshBuilder.CreateCylinder('vagCraneBase', { diameter: 1.9, height: 0.7, tessellation: 10 }, scene);
  basePed.position.set(cx, cy + 0.35, cz); steelParts.push(basePed);
  const boom = BABYLON.MeshBuilder.CreateBox('vagCraneBoom', { width: 8.6, height: 0.45, depth: 0.48 }, scene);
  boom.position.set(cx - 2.6, cy + 9.5, cz - 1.2);
  boom.rotation.z = -0.34;
  boom.rotation.y = 0.28;
  steelParts.push(boom);
  const counterweight = BABYLON.MeshBuilder.CreateBox('vagCraneWeight', { width: 1.6, height: 1.2, depth: 1.4 }, scene);
  counterweight.position.set(cx + 1.5, cy + 7.6, cz + 0.5); brassParts.push(counterweight);
  const cable = BABYLON.MeshBuilder.CreateCylinder('vagCraneCable', { diameter: 0.08, height: 4.4, tessellation: 6 }, scene);
  cable.position.set(cx - 6.0, cy + 8.5, cz - 2.2); steelParts.push(cable);
  const hook = BABYLON.MeshBuilder.CreateTorus('vagCraneHook', { diameter: 0.55, thickness: 0.14, tessellation: 10 }, scene);
  hook.position.set(cx - 6.0, cy + 6.2, cz - 2.2); brassParts.push(hook);

  // 2. Pressurized Copper Aether Fuel Tanks on the aft-starboard deck edge
  for (let i = 0; i < 2; i++) {
    const tz = 15.2 + i * 2.8;
    const tank = BABYLON.MeshBuilder.CreateCylinder(`vagFuelTank_${i}`, { diameter: 2.1, height: 5.8, tessellation: 12 }, scene);
    tank.position.set(-45.5, 22.5, tz);
    tank.rotation.z = Math.PI * 0.5;
    brassParts.push(tank);
    for (const sx of [-47.4, -43.6]) {
      const cradle = BABYLON.MeshBuilder.CreateBox(`vagTankCradle_${i}_${sx}`, { width: 0.35, height: 1.5, depth: 2.2 }, scene);
      cradle.position.set(sx, 21.8, tz);
      steelParts.push(cradle);
    }
  }

  // 3. Naval Mooring Bollards along runway catwalk edges
  for (const bx of [16, 28, 40, 50]) {
    for (const side of [-1, 1]) {
      const bollard = BABYLON.MeshBuilder.CreateCylinder(`vagBollard_${bx}_${side}`, { diameterTop: 0.42, diameterBottom: 0.34, height: 0.65, tessellation: 8 }, scene);
      bollard.position.set(bx, 3.12, side * 11.2);
      brassParts.push(bollard);
    }
  }

  // 4. Illuminated Cliffside Cabin Portholes (warm inhabited glow along carrier flanks — 0 PointLights!)
  const portholes = [
    [-12, 14.5, -24.5, 0], [-18, 14.5, -26.0, 0], [-24, 14.5, -26.5, 0],
    [-12, 14.5, 24.5, Math.PI], [-18, 14.5, 26.0, Math.PI], [-24, 14.5, 26.5, Math.PI],
    [-46, 15.5, -4, -Math.PI * 0.5], [-46, 15.5, 4, -Math.PI * 0.5],
  ];
  for (let i = 0; i < portholes.length; i++) {
    const [px, py, pz, ry] = portholes[i];
    const frame = BABYLON.MeshBuilder.CreateTorus(`vagPortholeRing_${i}`, { diameter: 1.45, thickness: 0.22, tessellation: 12 }, scene);
    frame.position.set(px, py, pz);
    frame.rotation.set(Math.PI * 0.5, ry, 0);
    brassParts.push(frame);
    const glass = BABYLON.MeshBuilder.CreateDisc(`vagPortholeGlass_${i}`, { radius: 0.62, tessellation: 10 }, scene);
    glass.position.set(px, py, pz);
    glass.rotation.y = ry;
    glowParts.push(glass);
  }

  mergeGroup(steelParts, 'vagLivingCarrierSteel', asteroidBase.group, pal.steel, shadowGen);
  mergeGroup(brassParts, 'vagLivingCarrierBrass', asteroidBase.group, pal.brass, null);
  mergeGroup(glowParts, 'vagLivingCarrierPortholes', asteroidBase.group, pal.warmGlow, null);

  // 5. Gentle Naval Funnel Smoke Plume (soft painterly puffs, zero GPU overhead)
  let funnelSmoke = null;
  if (!(scene.getEngine() instanceof BABYLON.NullEngine) && typeof document !== 'undefined') {
    const emitter = new BABYLON.TransformNode('vagFunnelSmokeEmitter', scene);
    emitter.parent = asteroidBase.group;
    emitter.position.set(-36.2, 32.6, -19.5);
    const ps = new BABYLON.ParticleSystem('vagFunnelSmokePS', 28, scene);
    const tex = new BABYLON.DynamicTexture('vagFunnelSmokeTex', { width: 64, height: 64 }, scene, false);
    const ctx = tex.getContext();
    const g = ctx.createRadialGradient(32, 32, 3, 32, 32, 30);
    g.addColorStop(0, 'rgba(218, 206, 188, 0.55)');
    g.addColorStop(0.55, 'rgba(175, 166, 154, 0.24)');
    g.addColorStop(1, 'rgba(150, 145, 140, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();
    tex.hasAlpha = true;
    ps.particleTexture = tex;
    ps.emitter = emitter;
    ps.minEmitBox = new BABYLON.Vector3(-0.6, 0, -0.6);
    ps.maxEmitBox = new BABYLON.Vector3(0.6, 0.4, 0.6);
    ps.color1 = new BABYLON.Color4(0.82, 0.78, 0.72, 0.38);
    ps.color2 = new BABYLON.Color4(0.65, 0.62, 0.58, 0.24);
    ps.colorDead = new BABYLON.Color4(0.55, 0.54, 0.52, 0.0);
    ps.minSize = 1.8;
    ps.maxSize = 5.4;
    ps.minLifeTime = 2.4;
    ps.maxLifeTime = 4.2;
    ps.emitRate = 6;
    ps.direction1 = new BABYLON.Vector3(-3.5, 4.2, -1.2);
    ps.direction2 = new BABYLON.Vector3(-6.2, 6.4, 1.2);
    ps.minEmitPower = 0.8;
    ps.maxEmitPower = 1.4;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    ps.start();
    funnelSmoke = ps;
  }

  return { funnelSmoke };
}

/**
 * Iconic Ancient Windmill Tower + Stone Archway (Forest Island landmark, visible from 1.5 km!).
 * Returns { root, sailHub } so update loop can spin the giant canvas sails.
 */
export function buildAncientWindmillLandmark(scene, parent, pos, shadowGen = null) {
  const pal = getNomadPalette(scene);
  const root = new BABYLON.TransformNode('nomadWindmillLandmark', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stoneParts = [];
  const roofParts = [];
  const brassParts = [];

  // Tapered limestone mill tower (20m tall)
  const tower = BABYLON.MeshBuilder.CreateCylinder('wmTower', { diameterTop: 5.4, diameterBottom: 8.6, height: 19.0, tessellation: 12 }, scene);
  tower.position.set(0, 9.5, 0); stoneParts.push(tower);
  const gallery = BABYLON.MeshBuilder.CreateCylinder('wmGallery', { diameter: 7.4, height: 0.7, tessellation: 12 }, scene);
  gallery.position.set(0, 14.5, 0); brassParts.push(gallery);
  const dome = BABYLON.MeshBuilder.CreateCylinder('wmDome', { diameterTop: 0.6, diameterBottom: 6.4, height: 4.8, tessellation: 12 }, scene);
  dome.position.set(0, 21.4, 0); roofParts.push(dome);
  const spire = BABYLON.MeshBuilder.CreateCylinder('wmSpire', { diameterTop: 0.12, diameterBottom: 0.38, height: 3.4, tessellation: 8 }, scene);
  spire.position.set(0, 25.0, 0); brassParts.push(spire);

  // Adjacent ruined stone archway for Project Nomads ancient-civilization storytelling
  for (const sx of [-9.5, -15.5]) {
    const pillar = BABYLON.MeshBuilder.CreateCylinder(`wmArchPillar_${sx}`, { diameterTop: 1.5, diameterBottom: 2.0, height: 8.5, tessellation: 8 }, scene);
    pillar.position.set(sx, 4.2, 5.5); stoneParts.push(pillar);
  }
  const lintel = BABYLON.MeshBuilder.CreateBox('wmArchLintel', { width: 8.2, height: 1.4, depth: 1.8 }, scene);
  lintel.position.set(-12.5, 8.8, 5.5); lintel.rotation.z = 0.06; stoneParts.push(lintel);

  mergeGroup(stoneParts, 'nomadWindmillStone', root, pal.limestone, shadowGen);
  mergeGroup(roofParts, 'nomadWindmillRoof', root, pal.terracotta, shadowGen);
  mergeGroup(brassParts, 'nomadWindmillBrass', root, pal.brass, null);

  // Rotating 4-blade giant canvas sails (15m diameter!)
  const sailHub = new BABYLON.TransformNode('nomadWindmillSailHub', scene);
  sailHub.parent = root;
  sailHub.position.set(0, 17.6, 3.2);
  const hubCap = BABYLON.MeshBuilder.CreateCylinder('wmHubCap', { diameter: 1.4, height: 1.8, tessellation: 10 }, scene);
  hubCap.parent = sailHub; hubCap.rotation.x = Math.PI * 0.5; hubCap.material = pal.brass; hubCap.isPickable = false;

  const sparParts = [];
  const clothParts = [];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const spar = BABYLON.MeshBuilder.CreateBox(`wmSpar_${i}`, { width: 0.38, height: 11.2, depth: 0.34 }, scene);
    spar.position.set(Math.sin(a) * 5.6, Math.cos(a) * 5.6, 0.35);
    spar.rotation.z = -a;
    sparParts.push(spar);

    const cloth = BABYLON.MeshBuilder.CreateBox(`wmCloth_${i}`, { width: 2.2, height: 8.6, depth: 0.08 }, scene);
    cloth.position.set(Math.sin(a) * 6.4 + Math.cos(a) * 1.15, Math.cos(a) * 6.4 - Math.sin(a) * 1.15, 0.42);
    cloth.rotation.z = -a;
    clothParts.push(cloth);
  }
  mergeGroup(sparParts, 'nomadWindmillSpars', sailHub, pal.steel, null);
  mergeGroup(clothParts, 'nomadWindmillCanvas', sailHub, pal.canvas, null);

  return { root, sailHub };
}

/**
 * Iconic Sky-Lighthouse & Airship Mooring Mast (Industrial Island landmark, 28m tall!).
 * Returns { root, lanternHub } so update loop can rotate the warm beacon.
 */
export function buildSkyLighthouseLandmark(scene, parent, pos, shadowGen = null) {
  const pal = getNomadPalette(scene);
  const root = new BABYLON.TransformNode('nomadLighthouseLandmark', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stoneParts = [];
  const redParts = [];
  const brassParts = [];

  // Alternating limestone & terracotta-red Interbellum lighthouse drum segments
  const tiers = [
    { y: 3.5, h: 7.0, dTop: 6.2, dBot: 7.6, red: false },
    { y: 10.0, h: 6.0, dTop: 5.0, dBot: 6.2, red: true },
    { y: 15.8, h: 5.6, dTop: 4.0, dBot: 5.0, red: false },
    { y: 20.6, h: 4.0, dTop: 3.3, dBot: 4.0, red: true },
  ];
  tiers.forEach((t, idx) => {
    const seg = BABYLON.MeshBuilder.CreateCylinder(`lhSeg_${idx}`, { diameterTop: t.dTop, diameterBottom: t.dBot, height: t.h, tessellation: 14 }, scene);
    seg.position.set(0, t.y, 0);
    (t.red ? redParts : stoneParts).push(seg);
  });

  // Brass gallery ring + cupola + airship mooring spire
  const gallery = BABYLON.MeshBuilder.CreateTorus('lhGallery', { diameter: 4.6, thickness: 0.45, tessellation: 16 }, scene);
  gallery.position.set(0, 22.8, 0); brassParts.push(gallery);
  const cupola = BABYLON.MeshBuilder.CreateCylinder('lhCupola', { diameterTop: 0.5, diameterBottom: 3.8, height: 2.8, tessellation: 12 }, scene);
  cupola.position.set(0, 27.4, 0); brassParts.push(cupola);
  const mast = BABYLON.MeshBuilder.CreateCylinder('lhMooringMast', { diameterTop: 0.18, diameterBottom: 0.55, height: 7.5, tessellation: 8 }, scene);
  mast.position.set(0, 32.0, 0); brassParts.push(mast);

  mergeGroup(stoneParts, 'nomadLighthouseStone', root, pal.limestone, shadowGen);
  mergeGroup(redParts, 'nomadLighthouseRed', root, pal.terracotta, shadowGen);
  mergeGroup(brassParts, 'nomadLighthouseBrass', root, pal.brass, null);

  // Glowing Fresnel lantern + rotating dual light beam
  const lanternHub = new BABYLON.TransformNode('nomadLighthouseLantern', scene);
  lanternHub.parent = root;
  lanternHub.position.set(0, 24.6, 0);
  const core = BABYLON.MeshBuilder.CreateCylinder('lhLanternCore', { diameter: 2.5, height: 2.6, tessellation: 12 }, scene);
  core.parent = lanternHub; core.material = pal.warmGlow; core.isPickable = false;

  const beamMat = getOrCreateMat(scene, 'nomadLighthouseBeamMat', () => {
    const m = new BABYLON.StandardMaterial('nomadLighthouseBeamMat', scene);
    m.emissiveColor = c3('#ffd582');
    m.disableLighting = true;
    m.alpha = 0.22;
    m.alphaMode = BABYLON.Engine.ALPHA_ADD;
    m.backFaceCulling = false;
    m.depthWrite = false;
    return m;
  });
  for (const s of [-1, 1]) {
    const beam = BABYLON.MeshBuilder.CreateCylinder(`lhBeam_${s}`, { diameterTop: 0.8, diameterBottom: 11.0, height: 55, tessellation: 10, cap: BABYLON.Mesh.NO_CAP }, scene);
    beam.parent = lanternHub;
    beam.rotation.z = s * Math.PI * 0.5;
    beam.position.x = s * 28.0;
    beam.material = beamMat;
    beam.isPickable = false;
  }

  return { root, lanternHub };
}

/**
 * Ancient Aether Monolith Circle (Project Nomads mystery landmark).
 * Floating glowing cyan obelisk framed by 6 weathered limestone standing stones.
 */
export function buildAetherMonolithLandmark(scene, parent, pos) {
  const pal = getNomadPalette(scene);
  const root = new BABYLON.TransformNode('nomadMonolithLandmark', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stoneParts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const h = 6.5 + (i % 2) * 2.4;
    const pillar = BABYLON.MeshBuilder.CreateCylinder(`monoStone_${i}`, { diameterTop: 1.1, diameterBottom: 1.9, height: h, tessellation: 6 }, scene);
    pillar.position.set(Math.cos(a) * 7.8, h * 0.5, Math.sin(a) * 7.8);
    pillar.rotation.z = Math.cos(a) * 0.12;
    pillar.rotation.x = -Math.sin(a) * 0.12;
    stoneParts.push(pillar);
  }
  const dais = BABYLON.MeshBuilder.CreateCylinder('monoDais', { diameterTop: 12.0, diameterBottom: 14.0, height: 1.4, tessellation: 12 }, scene);
  dais.position.set(0, 0.7, 0);
  stoneParts.push(dais);
  mergeGroup(stoneParts, 'nomadMonolithStones', root, pal.limestone, null);

  // Floating rotating Aether Crystal Obelisk
  const crystal = BABYLON.MeshBuilder.CreatePolyhedron('nomadMonolithCrystal', { type: 1, sizeX: 1.8, sizeY: 5.2, sizeZ: 1.8 }, scene);
  crystal.parent = root;
  crystal.position.set(0, 9.5, 0);
  crystal.material = pal.aetherGlow;
  crystal.isPickable = false;

  const ring = BABYLON.MeshBuilder.CreateTorus('nomadMonolithRing', { diameter: 6.8, thickness: 0.28, tessellation: 18 }, scene);
  ring.parent = crystal;
  ring.rotation.x = 0.45;
  ring.material = pal.brass;
  ring.isPickable = false;

  return { root, crystal };
}

/**
 * Populates a satellite floating island with a distinct, lived-in Interbellum architectural diorama
 * (Watchtower, Aviator Villa, Signal Outpost, Fuel Depot, or Ancient Aqueduct) merged into 3–4 draw calls!
 */
export function populateSatelliteIslandDiorama(scene, parent, island, kind = 'watchtower', rx = 22, rz = 18) {
  const pal = getNomadPalette(scene);
  const root = new BABYLON.TransformNode(`satDiorama_${kind}`, scene);
  root.parent = parent;

  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);
  const stoneParts = [], roofParts = [], steelParts = [], brassParts = [], glowParts = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => {
    m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m);
  };

  if (kind === 'watchtower') {
    // Interbellum stone-and-steel sky watchtower + wooden cantilever mooring pier + warm lantern
    const ty = hAt(2, -2);
    put(stoneParts, BABYLON.MeshBuilder.CreateCylinder('wtBase', { diameterTop: 4.4, diameterBottom: 6.0, height: 6.5, tessellation: 8 }, scene), 2, ty + 3.0, -2);
    put(steelParts, BABYLON.MeshBuilder.CreateCylinder('wtCab', { diameter: 4.8, height: 3.4, tessellation: 8 }, scene), 2, ty + 7.8, -2);
    put(roofParts, BABYLON.MeshBuilder.CreateCylinder('wtRoof', { diameterTop: 0.5, diameterBottom: 6.2, height: 2.8, tessellation: 8 }, scene), 2, ty + 10.9, -2);
    put(glowParts, BABYLON.MeshBuilder.CreateCylinder('wtLamp', { diameter: 2.2, height: 1.5, tessellation: 8 }, scene), 2, ty + 8.0, -2);
    put(brassParts, BABYLON.MeshBuilder.CreateCylinder('wtMast', { diameter: 0.22, height: 4.5, tessellation: 6 }, scene), 2, ty + 14.0, -2);
    // Cantilevered sky-pier jutting off the southern cliff
    const py = hAt(0, rz * 0.65);
    put(steelParts, BABYLON.MeshBuilder.CreateBox('wtPierDeck', { width: 4.2, height: 0.5, depth: 11.5 }, scene), 0, py + 0.5, rz * 0.85);
    for (const sx of [-1.8, 1.8]) {
      put(brassParts, BABYLON.MeshBuilder.CreateCylinder(`wtPierPost_${sx}`, { diameter: 0.35, height: 2.2, tessellation: 6 }, scene), sx, py + 1.4, rz * 0.85 + 4.8);
    }
    put(glowParts, BABYLON.MeshBuilder.CreateSphere('wtPierBeacon', { diameter: 0.75, segments: 6 }, scene), 1.8, py + 2.7, rz * 0.85 + 4.8);
  } else if (kind === 'villa') {
    // Porco Rosso sunlit Mediterranean Aviator's Villa + terracotta roof + small mooring dock
    const vy = hAt(-2, 1);
    put(stoneParts, BABYLON.MeshBuilder.CreateBox('vilMain', { width: 8.6, height: 5.2, depth: 6.4 }, scene), -2, vy + 2.4, 1, 0, 0.25);
    put(roofParts, BABYLON.MeshBuilder.CreateCylinder('vilRoof', { diameterTop: 0.6, diameterBottom: 10.8, height: 2.8, tessellation: 4 }, scene), -2, vy + 6.4, 1, 0, Math.PI * 0.25 + 0.25);
    put(stoneParts, BABYLON.MeshBuilder.CreateBox('vilWing', { width: 5.2, height: 3.6, depth: 4.8 }, scene), 3.4, vy + 1.6, 2.2, 0, 0.25);
    put(roofParts, BABYLON.MeshBuilder.CreateBox('vilWingRoof', { width: 5.8, height: 0.5, depth: 5.4 }, scene), 3.4, vy + 3.6, 2.2, 0.08, 0.25);
    // Warm sunlit windows & chimney
    for (const wx of [-4.2, -1.5, 1.0]) {
      put(glowParts, BABYLON.MeshBuilder.CreateBox(`vilWin_${wx}`, { width: 1.1, height: 1.4, depth: 0.2 }, scene), wx, vy + 2.9, 4.3, 0, 0.25);
    }
    put(stoneParts, BABYLON.MeshBuilder.CreateCylinder('vilChimney', { diameter: 0.9, height: 4.2, tessellation: 6 }, scene), -4.5, vy + 6.5, -0.5);
    // Wooden mooring dock
    const dy = hAt(rx * 0.55, 0);
    put(steelParts, BABYLON.MeshBuilder.CreateBox('vilDock', { width: 10.5, height: 0.45, depth: 3.6 }, scene), rx * 0.78, dy + 0.4, 0);
    put(brassParts, BABYLON.MeshBuilder.CreateCylinder('vilDockMast', { diameter: 0.26, height: 5.5, tessellation: 6 }, scene), rx * 0.78 + 4.4, dy + 3.0, 1.3);
  } else if (kind === 'signal') {
    // Interbellum Radio & Signal Outpost (stone bunker + tall lattice copper antenna + beacon)
    const sy = hAt(0, 0);
    put(stoneParts, BABYLON.MeshBuilder.CreateCylinder('sigBunker', { diameterTop: 7.4, diameterBottom: 8.6, height: 3.8, tessellation: 10 }, scene), 0, sy + 1.8, 0);
    put(brassParts, BABYLON.MeshBuilder.CreateTorus('sigCollar', { diameter: 7.5, thickness: 0.35, tessellation: 16 }, scene), 0, sy + 3.7, 0);
    put(steelParts, BABYLON.MeshBuilder.CreateCylinder('sigMast', { diameterTop: 0.35, diameterBottom: 1.4, height: 14.5, tessellation: 6 }, scene), 0, sy + 10.8, 0);
    for (const cy of [8.5, 12.5, 15.8]) {
      put(brassParts, BABYLON.MeshBuilder.CreateBox(`sigCross_${cy}`, { width: 5.2 - (cy - 8) * 0.35, height: 0.24, depth: 0.24 }, scene), 0, sy + cy, 0);
    }
    put(glowParts, BABYLON.MeshBuilder.CreateSphere('sigBeacon', { diameter: 1.3, segments: 8 }, scene), 0, sy + 18.2, 0);
    put(roofParts, BABYLON.MeshBuilder.CreateBox('sigHut', { width: 4.2, height: 2.6, depth: 3.4 }, scene), -6.5, hAt(-6.5, 3) + 1.2, 3, 0, -0.4);
  } else if (kind === 'depot') {
    // Sky-Fuel Depot (twin copper/steel fuel silos + gantry bridge + airship mooring mast)
    const fy = hAt(-2, 0);
    for (const sx of [-5.2, 1.2]) {
      put(steelParts, BABYLON.MeshBuilder.CreateCylinder(`depSilo_${sx}`, { diameter: 4.8, height: 7.8, tessellation: 12 }, scene), sx, fy + 3.8, -1.5);
      put(brassParts, BABYLON.MeshBuilder.CreateCylinder(`depDome_${sx}`, { diameterTop: 1.2, diameterBottom: 4.8, height: 1.6, tessellation: 12 }, scene), sx, fy + 8.5, -1.5);
      put(brassParts, BABYLON.MeshBuilder.CreateTorus(`depBand_${sx}`, { diameter: 5.0, thickness: 0.28, tessellation: 14 }, scene), sx, fy + 4.0, -1.5);
    }
    put(steelParts, BABYLON.MeshBuilder.CreateBox('depPipe', { width: 7.5, height: 0.6, depth: 0.6 }, scene), -2.0, fy + 6.4, -1.5);
    put(steelParts, BABYLON.MeshBuilder.CreateBox('depPad', { width: 10.5, height: 0.5, depth: 8.5 }, scene), 6.2, hAt(6.2, 3) + 0.3, 3.0);
    put(brassParts, BABYLON.MeshBuilder.CreateCylinder('depMast', { diameterTop: 0.3, diameterBottom: 1.1, height: 13.5, tessellation: 8 }, scene), 8.5, hAt(8.5, -4) + 6.6, -4.0);
    put(glowParts, BABYLON.MeshBuilder.CreateSphere('depLamp', { diameter: 1.2, segments: 8 }, scene), 8.5, hAt(8.5, -4) + 13.6, -4.0);
  } else {
    // Ancient Triple-Arch Limestone Aqueduct Ruins + glowing Aether Brazier
    const ay = hAt(0, 0);
    for (let i = -1; i <= 1; i++) {
      const px = i * 6.8;
      put(stoneParts, BABYLON.MeshBuilder.CreateBox(`aqPil_${i}`, { width: 2.1, height: 9.2, depth: 2.4 }, scene), px, ay + 4.4, -1.0);
    }
    put(stoneParts, BABYLON.MeshBuilder.CreateBox('aqSpan', { width: 17.5, height: 1.8, depth: 2.6 }, scene), 0, ay + 9.4, -1.0);
    put(stoneParts, BABYLON.MeshBuilder.CreateCylinder('aqBrokenCol', { diameter: 1.4, height: 5.2, tessellation: 8 }, scene), 5.5, hAt(5.5, 5.5) + 0.8, 5.5, 1.38, 0.6);
    put(brassParts, BABYLON.MeshBuilder.CreateCylinder('aqBrazier', { diameterTop: 1.8, diameterBottom: 0.9, height: 2.2, tessellation: 8 }, scene), -4.5, hAt(-4.5, 4.5) + 1.1, 4.5);
    put(glowParts, BABYLON.MeshBuilder.CreateSphere('aqFlame', { diameter: 1.3, segments: 8 }, scene), -4.5, hAt(-4.5, 4.5) + 2.6, 4.5);
  }

  mergeGroup(stoneParts, `satDiorama_${kind}_stone`, root, pal.limestone, null);
  mergeGroup(roofParts, `satDiorama_${kind}_roof`, root, pal.terracotta, null);
  mergeGroup(steelParts, `satDiorama_${kind}_steel`, root, pal.steel, null);
  mergeGroup(brassParts, `satDiorama_${kind}_brass`, root, pal.brass, null);
  mergeGroup(glowParts, `satDiorama_${kind}_glow`, root, pal.warmGlow, null);
  return root;
}

/**
 * Transforms «Бродяга» into a 1920s–1930s Interbellum Flying Dreadnought-Carrier Flagship:
 * - Riveted naval battleship-slate armored hull with tapered prow & hanging anchors
 * - Crimson-oxide flagship waterline belt & brass strakes
 * - Broadside dreadnought gun casemates, twin stern stabilizer fins, 2nd raked funnel & quad stern thrusters
 * Merged into 4 draw calls for zero FPS overhead.
 */
export function buildInterbellumCarrierHull(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  const B = BABYLON;

  const navalHullMat = getOrCreateMat(scene, 'vagNavalWarshipHullMat', () => {
    const m = new B.PBRMaterial('vagNavalWarshipHullMat', scene);
    m.albedoColor = c3('#8c949a'); // sunlit 1920s Interbellum battleship light-slate grey (reads clearly in sunset backlight!)
    m.metallic = 0.28;
    m.roughness = 0.52;
    m.environmentIntensity = 0.82;
    if (!(scene.getEngine() instanceof B.NullEngine)) {
      const tex = new B.Texture('./assets/textures/nomad/armored-deck-plates.png', scene);
      tex.uScale = 5; tex.vScale = 3;
      m.albedoTexture = tex;
    }
    return m;
  });
  const crimsonBeltMat = getOrCreateMat(scene, 'vagNavalCrimsonBeltMat', () => {
    const m = new B.PBRMaterial('vagNavalCrimsonBeltMat', scene);
    m.albedoColor = c3('#b23e2e'); // vivid Interbellum naval oxide-red armor belt
    m.metallic = 0.18;
    m.roughness = 0.54;
    m.environmentIntensity = 0.72;
    return m;
  });
  const darkIronMat = getOrCreateMat(scene, 'vagNavalDarkIronMat', () => {
    const m = new B.PBRMaterial('vagNavalDarkIronMat', scene);
    m.albedoColor = c3('#464e56');
    m.metallic = 0.58;
    m.roughness = 0.44;
    m.environmentIntensity = 0.72;
    return m;
  });
  const pal = getNomadPalette(scene);

  const hullParts = [], crimsonParts = [], brassParts = [], ironParts = [], glowParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
    arr.push(m);
  };

  // 1. Main Armored Dreadnought Lower Hull & Tapered Bow Prow (under the 64m flight deck, x = -54..+66)
  // Center armored hull body
  put(hullParts, B.MeshBuilder.CreateBox('wsHullCore', { width: 76, height: 14.0, depth: 38.0 }, scene), -14, -4.8, 0);
  // Sloped lower V-keel armor plates
  put(crimsonParts, B.MeshBuilder.CreateCylinder('wsLowerKeel', { diameterTop: 42, diameterBottom: 14, height: 11.5, tessellation: 6 }, scene), -14, -15.5, 0, 0, Math.PI / 6, 0, 1.85, 1.0, 0.92);
  // Forward tapered battleship prow extending cleanly under the 64m carrier runway to x = +66!
  put(hullParts, B.MeshBuilder.CreateCylinder('wsBowProw', { diameterTop: 22, diameterBottom: 2.2, height: 42.0, tessellation: 4 }, scene), 44.0, -3.8, 0, 0, Math.PI * 0.25, -Math.PI * 0.5, 0.62, 1.0, 0.95);
  // Classic 1920s Dreadnought Brass Ram / Bow Stem + Twin Anchors
  put(brassParts, B.MeshBuilder.CreateBox('wsBowStem', { width: 1.4, height: 10.5, depth: 1.4 }, scene), 64.5, -1.6, 0, 0, 0, -0.24);
  for (const side of [-1, 1]) {
    put(brassParts, B.MeshBuilder.CreateTorus(`wsHawse_${side}`, { diameter: 2.0, thickness: 0.32, tessellation: 12 }, scene), 48.0, -0.8, side * 8.6, 0, Math.PI * 0.5, 0);
    put(ironParts, B.MeshBuilder.CreateCylinder(`wsAnchorShank_${side}`, { diameter: 0.45, height: 3.6, tessellation: 6 }, scene), 48.0, -2.6, side * 9.0);
    put(ironParts, B.MeshBuilder.CreateTorus(`wsAnchorFluke_${side}`, { diameter: 2.2, thickness: 0.36, tessellation: 10 }, scene), 48.0, -4.0, side * 9.0, 0, 0, 0, 1.0, 0.55, 0.4);
  }

  // 2. Armored Side Bulges, Crimson Flagship Waterline Belt & Brass Strakes (port & starboard)
  for (const side of [-1, 1]) {
    // Full-length crimson armor belt
    put(crimsonParts, B.MeshBuilder.CreateBox(`wsBelt_${side}`, { width: 78, height: 3.6, depth: 1.6 }, scene), -14, -4.5, side * 19.6);
    // Upper armored citadel hull wall sheathing the ship flanks up to the 66m upper deck
    put(hullParts, B.MeshBuilder.CreateBox(`wsCitadelWall_${side}`, { width: 52, height: 17.5, depth: 4.5 }, scene), -26, 11.2, side * 24.5);
    // Sloped forward bow cheek sponsons framing the carved hangar bay (leaving z = -10..+10 wide open!)
    put(hullParts, B.MeshBuilder.CreateBox(`wsBowCheek_${side}`, { width: 16, height: 17.2, depth: 10.5 }, scene), -2, 11.4, side * 20.5, 0, side * -0.18);
    // Armored cylindrical battleship barbettes supporting the mid-level AA Turret & Radar sponsons!
    const bx = side > 0 ? 16.0 : 14.0, bz = side > 0 ? 25.0 : -26.0, bh = side > 0 ? 19.5 : 21.0;
    put(hullParts, B.MeshBuilder.CreateCylinder(`wsBarbette_${side}`, { diameterTop: 13.8, diameterBottom: 11.2, height: bh, tessellation: 14 }, scene), bx, bh * 0.5 - 6.0, bz);
    put(crimsonParts, B.MeshBuilder.CreateCylinder(`wsBarbetteBase_${side}`, { diameterTop: 11.0, diameterBottom: 4.5, height: 7.5, tessellation: 12 }, scene), bx, -9.2, bz);
    put(brassParts, B.MeshBuilder.CreateTorus(`wsBarbetteRing_${side}`, { diameter: 14.0, thickness: 0.42, tessellation: 18 }, scene), bx, bh - 6.2, bz);
    // Horizontal armored bridge-arm connecting each barbette cleanly into the main warship hull
    put(hullParts, B.MeshBuilder.CreateBox(`wsBarbetteStrut_${side}`, { width: 10.5, height: 6.5, depth: 14.0 }, scene), bx - 4.0, 2.0, side * 16.5);
    // Brass armored strake rails along upper & lower citadel edges
    put(brassParts, B.MeshBuilder.CreateBox(`wsStrakeTop_${side}`, { width: 54, height: 0.55, depth: 0.7 }, scene), -26, 20.1, side * 27.0);
    put(brassParts, B.MeshBuilder.CreateBox(`wsStrakeMid_${side}`, { width: 79, height: 0.55, depth: 0.7 }, scene), -14, -2.5, side * 20.6);

    // 3. Dreadnought Broadside Armored Gun Casemates (3 per side — iconic 1920s battleship silhouette!)
    for (const gx of [-38, -24, -10]) {
      put(ironParts, B.MeshBuilder.CreateCylinder(`wsCasemate_${side}_${gx}`, { diameter: 3.8, height: 3.4, tessellation: 10 }, scene), gx, 6.2, side * 26.8);
      put(ironParts, B.MeshBuilder.CreateCylinder(`wsBroadsideBarrel_${side}_${gx}`, { diameterTop: 0.38, diameterBottom: 0.58, height: 7.2, tessellation: 8 }, scene), gx, 6.4, side * 30.2, side * Math.PI * 0.5);
      put(brassParts, B.MeshBuilder.CreateTorus(`wsCasemateRing_${side}_${gx}`, { diameter: 3.9, thickness: 0.24, tessellation: 12 }, scene), gx, 7.9, side * 26.8);
    }
  }

  // 4. Armored Stern Bulkhead, Twin Dreadnought Stabilizer Fins & Quad Main Propulsion Thrusters
  put(hullParts, B.MeshBuilder.CreateCylinder('wsSternTransom', { diameterTop: 52, diameterBottom: 40, height: 19.0, tessellation: 12 }, scene), -44, 10.5, 0, 0, 0, 0, 0.58, 1.0, 1.0);
  // Twin vertical & horizontal naval tail-rudder stabilizer fins at the stern
  for (const side of [-1, 1]) {
    put(crimsonParts, B.MeshBuilder.CreateBox(`wsSternFinV_${side}`, { width: 12.0, height: 14.5, depth: 0.9 }, scene), -60.5, 7.0, side * 12.5, 0, 0, 0.16);
    put(brassParts, B.MeshBuilder.CreateBox(`wsSternFinTrim_${side}`, { width: 12.4, height: 0.5, depth: 1.1 }, scene), -60.5, 14.2, side * 12.5, 0, 0, 0.16);
  }
  put(hullParts, B.MeshBuilder.CreateBox('wsSternFinH', { width: 10.5, height: 0.9, depth: 34.0 }, scene), -59.5, 6.5, 0);

  // Quad stern battleship-carrier thruster bells with warm glowing exhaust cores
  for (const [tz, ty] of [[-12, 0], [-4.5, -2.5], [4.5, -2.5], [12, 0]]) {
    put(ironParts, B.MeshBuilder.CreateCylinder(`wsSternBell_${tz}`, { diameterTop: 3.6, diameterBottom: 5.4, height: 6.5, tessellation: 12 }, scene), -55.5, ty, tz, 0, 0, Math.PI * 0.5);
    put(brassParts, B.MeshBuilder.CreateTorus(`wsSternBellRing_${tz}`, { diameter: 5.4, thickness: 0.45, tessellation: 14 }, scene), -58.8, ty, tz, 0, 0, Math.PI * 0.5);
    put(glowParts, B.MeshBuilder.CreateDisc(`wsSternGlow_${tz}`, { radius: 2.2, tessellation: 10 }, scene), -58.9, ty, tz, 0, Math.PI * 0.5, 0);
  }

  // 5. Second Raked 1920s Naval Funnel beside the first on port flank (unmistakable twin-funnel dreadnought-carrier!)
  put(ironParts, B.MeshBuilder.CreateCylinder('wsSecondFunnel', { diameterTop: 2.6, diameterBottom: 3.5, height: 10.5, tessellation: 12 }, scene), -41.5, 26.2, -19.5, 0, 0, 0.14);
  for (const fy of [28.8, 30.2]) {
    put(brassParts, B.MeshBuilder.CreateTorus(`wsSecondFunnelBand_${fy}`, { diameter: 2.9, thickness: 0.24, tessellation: 14 }, scene), -41.5 - (fy - 26.2) * 0.14, fy, -19.5, 0, 0, 0.14);
  }

  mergeGroup(hullParts, 'vagWarshipHullSteel', asteroidBase.group, navalHullMat, shadowGen);
  mergeGroup(crimsonParts, 'vagWarshipArmorCrimson', asteroidBase.group, crimsonBeltMat, null);
  mergeGroup(brassParts, 'vagWarshipBrassTrim', asteroidBase.group, pal.brass, null);
  mergeGroup(ironParts, 'vagWarshipDarkIron', asteroidBase.group, darkIronMat, null);
  mergeGroup(glowParts, 'vagWarshipThrusterGlow', asteroidBase.group, pal.warmGlow, null);

  return { navalHullMat };
}


