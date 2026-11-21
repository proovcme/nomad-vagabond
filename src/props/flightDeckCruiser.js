/**
 * Modular 227-Meter 1931 Interbellum Flight-Deck Cruiser (CF) «Бродяга».
 * Orientation (matches hangar & runway takeoff along +X):
 *   - BOW (-X): x = -155..-55 — Razor-sharp flared clipper bow, diagonal crimson-white heraldic stripe,
 *     3 superfiring triple-barrel 6-inch main cruiser turrets (A, B, C).
 *   - MIDSHIPS: x = -55..+2 — Stepped 1930s pagoda bridge, 56m tripod foremast, twin crimson-banded
 *     raked funnels, sheltered 4-bay hangar & upper shipyard deck (y = 21.73).
 *   - AFT (+X): x = +2..+72 — Flush flat flight deck (y = 3.38) for real takeoff/landing,
 *     catwalks, lifeboats on davits, cranes, and cruiser stern transom.
 *   - KEEL: 5 armored anti-gravity propulsion bays with glowing amber louver vents.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function createLoftedHull(scene, name, stations, material, parent, shadowGen = null) {
  const B = BABYLON;
  const positions = [];
  const indices = [];
  const uvs = [];
  const ringPts = 7;
  const xMin = stations[0].x;
  const xSpan = Math.max(1, stations[stations.length - 1].x - xMin);

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const u = ((s.x - xMin) / xSpan) * 11.0;
    const pts = [
      [s.x, s.yTop,         s.halfBeamTop],
      [s.x, s.yMid,         s.halfBeamMid],
      [s.x, s.yKeel + 1.5,  s.halfBeamKeel],
      [s.x, s.yKeel,        0],
      [s.x, s.yKeel + 1.5, -s.halfBeamKeel],
      [s.x, s.yMid,        -s.halfBeamMid],
      [s.x, s.yTop,        -s.halfBeamTop],
    ];
    for (let j = 0; j < ringPts; j++) {
      positions.push(pts[j][0], pts[j][1], pts[j][2]);
      uvs.push(u, (j / (ringPts - 1)) * 2.4);
    }
  }

  for (let i = 0; i < stations.length - 1; i++) {
    const rowA = i * ringPts;
    const rowB = (i + 1) * ringPts;
    for (let j = 0; j < ringPts - 1; j++) {
      const a = rowA + j;
      const b = rowB + j;
      const c = rowB + j + 1;
      const d = rowA + j + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Cap top deck flush (+Y outward)
  for (let i = 0; i < stations.length - 1; i++) {
    const a = i * ringPts;
    const b = (i + 1) * ringPts;
    const c = (i + 1) * ringPts + (ringPts - 1);
    const d = i * ringPts + (ringPts - 1);
    indices.push(a, d, b);
    indices.push(b, d, c);
  }

  // Cap stern transom (last station, +X outward)
  const last = stations.length - 1;
  const lastRow = last * ringPts;
  const sternCenterIdx = positions.length / 3;
  const sLast = stations[last];
  positions.push(sLast.x, (sLast.yTop + sLast.yKeel) * 0.5, 0);
  uvs.push(11.0, 0.5);
  for (let j = 0; j < ringPts - 1; j++) {
    indices.push(sternCenterIdx, lastRow + j + 1, lastRow + j);
  }

  const normals = [];
  B.VertexData.ComputeNormals(positions, indices, normals);
  const vd = new B.VertexData();
  vd.positions = positions;
  vd.indices = indices;
  vd.normals = normals;
  vd.uvs = uvs;

  const mesh = new B.Mesh(name, scene);
  vd.applyToMesh(mesh);
  mesh.parent = parent;
  mesh.material = material;
  mesh.receiveShadows = true;
  mesh.isPickable = false;
  if (shadowGen) shadowGen.addShadowCaster(mesh, false);
  return mesh;
}

function mergeKit(meshes, name, parent, material, shadowGen = null) {
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

function createCruiserMaterials(scene) {
  const B = BABYLON;
  const isNull = scene.getEngine() instanceof B.NullEngine;

  const hull = new B.PBRMaterial('cfCruiserHullMat', scene);
  hull.albedoColor = c3('#8d979f'); // classic 1930s battleship light-slate grey
  hull.metallic = 0.28;
  hull.roughness = 0.52;
  hull.environmentIntensity = 0.85;
  if (!isNull) {
    const tex = new B.Texture('./assets/textures/nomad/armored-deck-plates.png', scene);
    tex.uScale = 2.4; tex.vScale = 1.6;
    hull.albedoTexture = tex;
  }

  const darkSteel = new B.PBRMaterial('cfCruiserDarkSteelMat', scene);
  darkSteel.albedoColor = c3('#3a424a');
  darkSteel.metallic = 0.58;
  darkSteel.roughness = 0.44;
  darkSteel.environmentIntensity = 0.72;

  const deckWood = new B.PBRMaterial('cfCruiserDeckWoodMat', scene);
  deckWood.albedoColor = c3('#b6a27e'); // weathered Interbellum teak warship deck
  deckWood.metallic = 0.08;
  deckWood.roughness = 0.76;
  if (!isNull) {
    const dTex = new B.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg', scene);
    dTex.uScale = 3.5; dTex.vScale = 2.0;
    deckWood.albedoTexture = dTex;
  }

  const crimson = new B.PBRMaterial('cfCruiserCrimsonMat', scene);
  crimson.albedoColor = c3('#a43024');
  crimson.metallic = 0.16;
  crimson.roughness = 0.54;

  const white = new B.PBRMaterial('cfCruiserWhiteMat', scene);
  white.albedoColor = c3('#efe7d4');
  white.metallic = 0.06;
  white.roughness = 0.64;

  const brass = new B.PBRMaterial('cfCruiserBrassMat', scene);
  brass.albedoColor = c3('#d2a44c');
  brass.metallic = 0.84;
  brass.roughness = 0.28;

  const amberGlow = new B.StandardMaterial('cfCruiserAmberGlowMat', scene);
  amberGlow.emissiveColor = c3('#ffaa38');
  amberGlow.diffuseColor = c3('#ffe29c');
  amberGlow.disableLighting = true;

  return { hull, darkSteel, deckWood, crimson, white, brass, amberGlow };
}

/**
 * Module 1: 227-meter lofted 1930s Cruiser Hull (bow x=-155 -> stern x=+72)
 * with flared clipper stem, diagonal crimson-white bow heraldic stripe, anchors & portholes.
 */
function buildCruiserHull(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const hullStations = [
    // Sharp flared clipper bow (-X = forward!)
    { x: -155, halfBeamTop: 0.7,  halfBeamMid: 0.45, halfBeamKeel: 0.2,  yTop: 11.4, yMid: 4.0,  yKeel: -3.2 },
    { x: -140, halfBeamTop: 6.2,  halfBeamMid: 4.2,  halfBeamKeel: 1.5,  yTop: 10.6, yMid: 2.2,  yKeel: -6.8 },
    { x: -120, halfBeamTop: 11.5, halfBeamMid: 9.2,  halfBeamKeel: 4.2,  yTop: 9.8,  yMid: 0.8,  yKeel: -9.8 },
    { x:  -95, halfBeamTop: 15.8, halfBeamMid: 14.0, halfBeamKeel: 7.4,  yTop: 9.2,  yMid: -0.4, yKeel: -11.6 },
    { x:  -65, halfBeamTop: 18.8, halfBeamMid: 17.5, halfBeamKeel: 10.0, yTop: 8.8,  yMid: -1.4, yKeel: -12.6 },
    // Midships hangar & superstructure beam (aft stations yTop=2.25 sit cleanly below runway deck at y=2.68..3.38 — zero z-fighting!)
    { x:  -40, halfBeamTop: 20.5, halfBeamMid: 19.2, halfBeamKeel: 11.2, yTop: 2.4,  yMid: -2.2, yKeel: -13.0 },
    { x:  -12, halfBeamTop: 20.5, halfBeamMid: 19.2, halfBeamKeel: 11.0, yTop: 2.25, yMid: -2.4, yKeel: -12.8 },
    { x:   14, halfBeamTop: 18.2, halfBeamMid: 16.8, halfBeamKeel: 9.2,  yTop: 2.25, yMid: -2.4, yKeel: -11.6 },
    { x:   38, halfBeamTop: 15.2, halfBeamMid: 13.6, halfBeamKeel: 6.8,  yTop: 2.25, yMid: -2.2, yKeel: -9.8 },
    { x:   58, halfBeamTop: 12.2, halfBeamMid: 10.2, halfBeamKeel: 4.4,  yTop: 2.25, yMid: -1.8, yKeel: -7.8 },
    { x:   72, halfBeamTop: 9.2,  halfBeamMid: 7.4,  halfBeamKeel: 2.8,  yTop: 2.25, yMid: -1.4, yKeel: -6.0 },
  ];
  createLoftedHull(scene, 'cfLoftedMainHull', hullStations, mats.hull, parent, shadowGen);

  // Lower crimson cruiser hull bottom
  const keelStations = hullStations.map(s => ({
    x: s.x,
    halfBeamTop: s.halfBeamMid * 0.98,
    halfBeamMid: s.halfBeamKeel * 1.05,
    halfBeamKeel: s.halfBeamKeel * 0.45,
    yTop: s.yMid - 0.15,
    yMid: s.yKeel + 1.0,
    yKeel: s.yKeel - 0.9,
  }));
  createLoftedHull(scene, 'cfLoftedCrimsonKeel', keelStations, mats.crimson, parent, null);

  const whiteParts = [], crimsonParts = [], brassParts = [], darkParts = [], glowParts = [], deckParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  // Weathered teak forecastle bow gun deck (x = -146..-58)
  put(deckParts, B.MeshBuilder.CreateBox('cfBowTeakDeck', { width: 78, height: 0.45, depth: 22.0 }, scene), -96, 9.5, 0);
  // Brass stem, anchors, hawsepipes & iconic 1931 diagonal white-crimson bow stripe!
  put(brassParts, B.MeshBuilder.CreateBox('cfBowStem', { width: 0.75, height: 14.8, depth: 0.75 }, scene), -155.0, 4.1, 0, 0, 0, -0.05);
  for (const side of [-1, 1]) {
    // Diagonal white-framed crimson flagship heraldic stripe hugging the flared cruiser bow!
    put(whiteParts, B.MeshBuilder.CreateBox(`cfBowStripeW_${side}`, { width: 6.4, height: 14.2, depth: 0.45 }, scene), -126.0, 2.2, side * 9.0, side * 0.22, side * 0.26, 0.22);
    put(crimsonParts, B.MeshBuilder.CreateBox(`cfBowStripeC_${side}`, { width: 4.0, height: 14.4, depth: 0.56 }, scene), -126.0, 2.2, side * 9.12, side * 0.22, side * 0.26, 0.22);
    // Anchor hawsepipe + hanging battleship anchor
    put(brassParts, B.MeshBuilder.CreateTorus(`cfHawse_${side}`, { diameter: 1.8, thickness: 0.28, tessellation: 10 }, scene), -142.0, 6.2, side * 5.2, 0, Math.PI * 0.5, 0);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfAnchor_${side}`, { diameter: 0.42, height: 3.6, tessellation: 6 }, scene), -142.0, 4.2, side * 5.6);
    // Illuminated cruiser hull portholes along bow & midships freeboard
    for (let px = -115; px <= -55; px += 7.5) {
      const zOff = 12.2 + ((px + 115) / 60) * 6.4;
      put(glowParts, B.MeshBuilder.CreateCylinder(`cfHullPort_${side}_${px}`, { diameter: 0.85, height: 0.25, tessellation: 8 }, scene), px, 5.2, side * zOff, Math.PI * 0.5, 0, 0);
    }
    // Foredeck railing stanchions & brass capstan
    put(brassParts, B.MeshBuilder.CreateBox(`cfBowRail_${side}`, { width: 76, height: 0.22, depth: 0.18 }, scene), -98, 10.7, side * 11.2);
  }
  put(brassParts, B.MeshBuilder.CreateCylinder('cfBowCapstan', { diameterTop: 1.6, diameterBottom: 2.1, height: 1.4, tessellation: 10 }, scene), -136, 10.6, 0);

  mergeKit(whiteParts, 'cfBowStripeWhite', parent, mats.white, null);
  mergeKit(crimsonParts, 'cfBowStripeCrimson', parent, mats.crimson, null);
  mergeKit(brassParts, 'cfHullBrassKit', parent, mats.brass, null);
  mergeKit(darkParts, 'cfHullAnchorKit', parent, mats.darkSteel, null);
  mergeKit(glowParts, 'cfHullPortholes', parent, mats.amberGlow, null);
  mergeKit(deckParts, 'cfBowTeakDeckMesh', parent, mats.deckWood, shadowGen);
}

/**
 * Module 2: Three Superfiring Triple-Barrel 6-inch Cruiser Main Gun Turrets (A, B, C)
 * mounted cleanly on the long cruiser forecastle bow (-X = forward!).
 */
function buildMainBatteryTurrets(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const steelParts = [], darkParts = [], brassParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  const turrets = [
    { id: 'A', x: -116, y: 10.4, elev: 0.12, yaw: 0.0 },
    { id: 'B', x:  -94, y: 14.2, elev: 0.15, yaw: 0.0 },
    { id: 'C', x:  -72, y: 18.0, elev: 0.16, yaw: 0.0 },
  ];
  for (const t of turrets) {
    const barbH = t.y - 8.2;
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfMainBarb_${t.id}`, { diameter: 9.2, height: barbH, tessellation: 16 }, scene), t.x, 8.2 + barbH * 0.5, 0);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfMainBarbRing_${t.id}`, { diameter: 9.4, thickness: 0.34, tessellation: 18 }, scene), t.x, t.y + 0.1, 0);
    // Faceted 1930s US Navy 6"/47 cruiser gunhouse
    put(steelParts, B.MeshBuilder.CreateBox(`cfMainHouse_${t.id}`, { width: 10.4, height: 3.6, depth: 8.4 }, scene), t.x + 0.6, t.y + 1.9, 0);
    put(steelParts, B.MeshBuilder.CreateBox(`cfMainFace_${t.id}`, { width: 2.2, height: 3.2, depth: 8.2 }, scene), t.x - 4.8, t.y + 1.8, 0, 0, 0, 0.28);
    // Optical turret rangefinder ears
    put(brassParts, B.MeshBuilder.CreateCylinder(`cfMainRF_${t.id}`, { diameter: 0.72, height: 10.4, tessellation: 8 }, scene), t.x + 2.8, t.y + 2.8, 0, Math.PI * 0.5, 0, 0);
    // Triple 6-inch barrels pointing forward (-X) with recoil jackets
    for (const bz of [-2.0, 0.0, 2.0]) {
      put(darkParts, B.MeshBuilder.CreateCylinder(`cfMainJacket_${t.id}_${bz}`, { diameter: 0.88, height: 3.8, tessellation: 8 }, scene), t.x - 6.8, t.y + 2.4, bz, 0, 0, Math.PI * 0.5 - t.elev);
      put(darkParts, B.MeshBuilder.CreateCylinder(`cfMainBarrel_${t.id}_${bz}`, { diameterTop: 0.38, diameterBottom: 0.58, height: 15.2, tessellation: 10 }, scene), t.x - 13.0, t.y + 3.2, bz, 0, 0, Math.PI * 0.5 - t.elev);
    }
  }

  mergeKit(steelParts, 'cfMainBatteryTurrets', parent, mats.hull, shadowGen);
  mergeKit(darkParts, 'cfMainBatteryBarrels', parent, mats.darkSteel, shadowGen);
  mergeKit(brassParts, 'cfMainBatteryBrass', parent, mats.brass, null);
}

/**
 * Module 3: Midships 1930s Cruiser Superstructure, Tiered Pagoda Bridge, 56m Tripod Foremast,
 * Twin Thick Raked Crimson-Banded Funnels & Sheltered Hangar Citadel.
 */
function buildMidshipsSuperstructure(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const steelParts = [], darkParts = [], crimsonParts = [], brassParts = [], glowParts = [], deckParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  // Armored cruiser citadel walls flanking the hangar cavern (x = -54..+2, leaving portal z=-10..+10 wide open at +X!)
  for (const side of [-1, 1]) {
    put(steelParts, B.MeshBuilder.CreateBox(`cfCitWall_${side}`, { width: 56.0, height: 18.0, depth: 5.4 }, scene), -26.0, 11.8, side * 17.8, side * -0.08);
    put(brassParts, B.MeshBuilder.CreateBox(`cfCitStrake_${side}`, { width: 58.0, height: 0.48, depth: 0.6 }, scene), -26.0, 20.6, side * 20.2);
    for (let px = -48; px <= -4; px += 5.5) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfCitWinA_${side}_${px}`, { width: 1.2, height: 0.85, depth: 0.24 }, scene), px, 16.0, side * 20.5);
      put(glowParts, B.MeshBuilder.CreateBox(`cfCitWinB_${side}_${px}`, { width: 1.0, height: 0.75, depth: 0.24 }, scene), px, 9.6, side * 20.8);
    }
    // Integrated armored hull sponsons supporting mid-level AA Gun (16, 13.8, 25) & Radar (14, 15.2, -26)
    const sx = side > 0 ? 16.0 : 14.0, sz = side > 0 ? 25.0 : -26.0, sy = side > 0 ? 13.4 : 14.8;
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfSponson_${side}`, { diameterTop: 9.2, diameterBottom: 5.0, height: 12.2, tessellation: 12 }, scene), sx, sy - 6.4, sz);
    put(steelParts, B.MeshBuilder.CreateBox(`cfSponsonArm_${side}`, { width: 11.0, height: 4.0, depth: 14.0 }, scene), sx - 2.5, sy - 3.5, side * 17.5);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfSponsonRing_${side}`, { diameter: 9.4, thickness: 0.34, tessellation: 16 }, scene), sx, sy - 0.5, sz);
  }
  // Sloped forward citadel bulkhead connecting the bow forecastle up to the upper cruiser deck (x = -58..-52)
  put(steelParts, B.MeshBuilder.CreateBox('cfCitBowWall', { width: 10.0, height: 13.5, depth: 36.0 }, scene), -55.0, 14.2, 0);
  // Upper armored shipyard/superstructure deck (y = 20.88, replaces legacy round flying saucer!)
  put(deckParts, B.MeshBuilder.CreateBox('cfUpperDeckMain', { width: 58.0, height: 1.1, depth: 40.0 }, scene), -25.0, 20.88, 0);
  put(steelParts, B.MeshBuilder.CreateBox('cfUpperBulwarkL', { width: 58.4, height: 0.85, depth: 0.55 }, scene), -25.0, 21.7, -20.0);
  put(steelParts, B.MeshBuilder.CreateBox('cfUpperBulwarkR', { width: 58.4, height: 0.85, depth: 0.55 }, scene), -25.0, 21.7,  20.0);

  // Towering 1930s US Navy Pagoda Bridge & 56m Tripod Foremast right behind Turret C (x = -54, z = 0)
  const bx = -54.0, bz = 0.0;
  put(steelParts, B.MeshBuilder.CreateBox('cfPagoda1', { width: 13.0, height: 6.2, depth: 14.5 }, scene), bx, 24.4, bz);
  put(steelParts, B.MeshBuilder.CreateBox('cfPagoda2', { width: 10.2, height: 5.4, depth: 11.4 }, scene), bx, 30.0, bz);
  put(steelParts, B.MeshBuilder.CreateBox('cfBridgeWings', { width: 4.2, height: 1.8, depth: 22.0 }, scene), bx - 1.5, 30.2, bz);
  put(steelParts, B.MeshBuilder.CreateBox('cfPagoda3', { width: 7.4, height: 4.8, depth: 7.8 }, scene), bx, 35.0, bz);
  // Warm glowing panoramic bridge windows facing forward (-X)
  put(glowParts, B.MeshBuilder.CreateBox('cfBridgeGlass1', { width: 0.25, height: 1.1, depth: 9.2 }, scene), bx - 5.2, 30.8, bz);
  put(glowParts, B.MeshBuilder.CreateBox('cfBridgeGlass2', { width: 0.25, height: 1.0, depth: 6.0 }, scene), bx - 3.8, 35.6, bz);
  // Tall slender 1930s Tripod Foremast rising to y = 58m!
  put(darkParts, B.MeshBuilder.CreateCylinder('cfForemastCore', { diameterTop: 0.40, diameterBottom: 1.45, height: 22.0, tessellation: 8 }, scene), bx, 48.0, bz);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfForemastLegL', { diameterTop: 0.30, diameterBottom: 0.78, height: 16.5, tessellation: 6 }, scene), bx + 3.2, 44.5, -2.4, -0.20, 0, 0.26);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfForemastLegR', { diameterTop: 0.30, diameterBottom: 0.78, height: 16.5, tessellation: 6 }, scene), bx + 3.2, 44.5,  2.4,  0.20, 0, 0.26);
  put(steelParts, B.MeshBuilder.CreateCylinder('cfSpottingTop', { diameter: 4.4, height: 1.9, tessellation: 12 }, scene), bx, 45.2, bz);
  put(brassParts, B.MeshBuilder.CreateBox('cfMainRangefinder', { width: 0.95, height: 0.95, depth: 7.8 }, scene), bx - 0.5, 47.0, bz);
  put(darkParts, B.MeshBuilder.CreateBox('cfMainYard1', { width: 0.28, height: 0.28, depth: 17.0 }, scene), bx, 51.4, bz);
  put(darkParts, B.MeshBuilder.CreateBox('cfMainYard2', { width: 0.22, height: 0.22, depth: 11.0 }, scene), bx, 55.2, bz);
  // Bridge searchlights on side wings
  for (const sz of [-9.5, 9.5]) {
    put(brassParts, B.MeshBuilder.CreateCylinder(`cfSearchlight_${sz}`, { diameter: 1.3, height: 1.6, tessellation: 10 }, scene), bx - 2.2, 31.8, sz, 0, 0, Math.PI * 0.5);
    put(glowParts, B.MeshBuilder.CreateDisc(`cfSearchlightLens_${sz}`, { radius: 0.58, tessellation: 8 }, scene), bx - 3.05, 31.8, sz, 0, -Math.PI * 0.5, 0);
  }

  // TWO Thick 1930s Raked Cruiser Funnels (behind the pagoda bridge, port flank z = -17.8, swept aft toward +X!)
  for (const fx of [-39.5, -29.5]) {
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfFunnel_${fx}`, { diameterTop: 4.2, diameterBottom: 5.0, height: 14.5, tessellation: 14 }, scene), fx, 28.2, -17.8, 0, 0, -0.20);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfFunnelCap_${fx}`, { diameterTop: 4.5, diameterBottom: 4.25, height: 2.2, tessellation: 14 }, scene), fx + 1.5, 35.4, -17.8, 0, 0, -0.20);
    put(crimsonParts, B.MeshBuilder.CreateCylinder(`cfFunnelRed_${fx}`, { diameterTop: 4.45, diameterBottom: 4.62, height: 2.2, tessellation: 14 }, scene), fx + 0.8, 32.2, -17.8, 0, 0, -0.20);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfFunnelBrass_${fx}`, { diameter: 4.72, thickness: 0.20, tessellation: 14 }, scene), fx + 0.5, 31.0, -17.8, 0, 0, -0.20);
  }

  mergeKit(steelParts, 'cfSuperstructureSteel', parent, mats.hull, shadowGen);
  mergeKit(darkParts, 'cfSuperstructureDark', parent, mats.darkSteel, null);
  mergeKit(crimsonParts, 'cfSuperstructureCrimson', parent, mats.crimson, null);
  mergeKit(brassParts, 'cfSuperstructureBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfSuperstructureGlow', parent, mats.amberGlow, null);
  mergeKit(deckParts, 'cfSuperstructureDeck', parent, mats.deckWood, shadowGen);
}

/**
 * Module 4: Aft Flight Deck Equipment — Lifeboats on Davits, Deck Ventilators,
 * Stern Stabilizer Fins & Twin Main Propulsion Nozzles.
 */
function buildFlightDeckAndDetails(scene, parent, mats) {
  const B = BABYLON;
  const whiteParts = [], brassParts = [], darkParts = [], crimsonParts = [], glowParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  // Lifeboats slung on curved davits along the cruiser waist & deck-edge ventilators
  for (const side of [-1, 1]) {
    for (const lx of [-42, -32, -18]) {
      put(whiteParts, B.MeshBuilder.CreateSphere(`cfBoat_${side}_${lx}`, { diameterX: 6.2, diameterY: 1.8, diameterZ: 2.2, segments: 8 }, scene), lx, 22.8, side * 21.4);
      for (const dx of [-2.4, 2.4]) {
        put(darkParts, B.MeshBuilder.CreateCylinder(`cfDavit_${side}_${lx}_${dx}`, { diameter: 0.22, height: 3.4, tessellation: 6 }, scene), lx + dx, 22.6, side * 20.6, side * 0.28, 0, 0);
      }
    }
    // Classic 1930s ship cowl ventilators on the upper deck flanks
    for (const vx of [-46, -10]) {
      put(brassParts, B.MeshBuilder.CreateCylinder(`cfVentPipe_${side}_${vx}`, { diameter: 0.75, height: 2.6, tessellation: 8 }, scene), vx, 22.8, side * 19.2);
      put(crimsonParts, B.MeshBuilder.CreateSphere(`cfVentCowl_${side}_${vx}`, { diameter: 1.4, segments: 8 }, scene), vx, 24.1, side * 19.2);
    }
    // Cruiser stern stabilizer fins & main propulsion thrusters at x = +72
    put(crimsonParts, B.MeshBuilder.CreateBox(`cfSternFin_${side}`, { width: 10.0, height: 6.2, depth: 0.65 }, scene), 70.5, -3.2, side * 6.4, 0, 0, -0.18);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfSternBell_${side}`, { diameterTop: 2.6, diameterBottom: 4.0, height: 5.5, tessellation: 12 }, scene), 71.5, -4.0, side * 3.8, 0, 0, -Math.PI * 0.5);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfSternRing_${side}`, { diameter: 4.0, thickness: 0.34, tessellation: 14 }, scene), 74.2, -4.0, side * 3.8, 0, 0, Math.PI * 0.5);
    put(glowParts, B.MeshBuilder.CreateDisc(`cfSternGlow_${side}`, { radius: 1.6, tessellation: 10 }, scene), 74.3, -4.0, side * 3.8, 0, -Math.PI * 0.5, 0);
  }

  mergeKit(whiteParts, 'cfDeckLifeboats', parent, mats.white, null);
  mergeKit(brassParts, 'cfDeckBrassDetails', parent, mats.brass, null);
  mergeKit(darkParts, 'cfDeckDarkDetails', parent, mats.darkSteel, null);
  mergeKit(crimsonParts, 'cfDeckCrimsonDetails', parent, mats.crimson, null);
  mergeKit(glowParts, 'cfDeckSternGlow', parent, mats.amberGlow, null);
}

/**
 * Module 5: Recessed Armored Anti-Gravity Propulsion Bays along the 227m cruiser keel.
 */
function buildAntigravKeelPods(scene, parent, mats) {
  const B = BABYLON;
  const darkParts = [], glowParts = [], brassParts = [];
  const put = (arr, m, x, y, z) => { m.position.set(x, y, z); arr.push(m); };

  const pods = [
    { x: -108, w: 12.0, z: 5.8, y: -11.4 },
    { x:  -68, w: 15.0, z: 8.8, y: -13.2 },
    { x:  -26, w: 16.5, z: 10.2, y: -13.6 },
    { x:   14, w: 14.0, z: 8.2, y: -12.4 },
    { x:   46, w: 11.0, z: 5.6, y: -9.8 },
  ];
  for (const p of pods) {
    put(darkParts, B.MeshBuilder.CreateBox(`cfAgPod_${p.x}`, { width: p.w, height: 2.6, depth: p.z * 2 }, scene), p.x, p.y, 0);
    put(brassParts, B.MeshBuilder.CreateBox(`cfAgFrame_${p.x}`, { width: p.w + 0.6, height: 0.4, depth: p.z * 2 + 0.4 }, scene), p.x, p.y + 1.2, 0);
    for (const side of [-1, 1]) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfAgGlow_${p.x}_${side}`, { width: p.w * 0.80, height: 1.2, depth: 0.30 }, scene), p.x, p.y - 0.1, side * (p.z + 0.08));
      for (let lx = -p.w * 0.32; lx <= p.w * 0.33; lx += p.w * 0.16) {
        put(darkParts, B.MeshBuilder.CreateBox(`cfAgLouver_${p.x}_${side}_${lx}`, { width: 0.36, height: 1.5, depth: 0.44 }, scene), p.x + lx, p.y - 0.1, side * (p.z + 0.16));
      }
    }
  }
  mergeKit(darkParts, 'cfAntigravPods', parent, mats.darkSteel, null);
  mergeKit(brassParts, 'cfAntigravBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfAntigravGlow', parent, mats.amberGlow, null);
}

/**
 * Orchestrates all 5 modular subsystems of the 227-meter 1931 Flight-Deck Cruiser (CF) «Бродяга».
 */
export function buildFlightDeckCruiserModel(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  const mats = createCruiserMaterials(scene);
  buildCruiserHull(scene, asteroidBase.group, mats, shadowGen);
  buildMainBatteryTurrets(scene, asteroidBase.group, mats, shadowGen);
  buildMidshipsSuperstructure(scene, asteroidBase.group, mats, shadowGen);
  buildFlightDeckAndDetails(scene, asteroidBase.group, mats);
  buildAntigravKeelPods(scene, asteroidBase.group, mats);
  return { hullMat: mats.hull };
}
