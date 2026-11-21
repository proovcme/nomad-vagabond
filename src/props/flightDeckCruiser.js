/**
 * Authentic 1931 Interbellum Flight-Deck Cruiser (CF) Warship Model for «Бродяга».
 * Uses a true lofted 3D ship-hull mesh (flared clipper bow, tumblehome armor sides,
 * tapered V-keel, cruiser stern) + tiered pagoda bridge, twin crimson-banded funnels,
 * superfiring triple 6-inch turrets, and recessed glowing amber keel lift-thrusters.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Builds a true lofted 3D cruiser warship hull mesh from longitudinal cross-section stations.
 * Each station: { x, halfBeamTop, halfBeamMid, halfBeamKeel, yTop, yMid, yKeel }
 */
function createLoftedCruiserHull(scene, name, stations, material, parent, shadowGen = null) {
  const B = BABYLON;
  const positions = [];
  const indices = [];
  const uvs = [];

  // 7 profile vertices per station (starboard top -> starboard mid -> starboard keel -> center keel -> port keel -> port mid -> port top)
  const ringPts = 7;
  const xMin = stations[0].x;
  const xSpan = Math.max(1, stations[stations.length - 1].x - xMin);

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const u = ((s.x - xMin) / xSpan) * 7.5;
    const pts = [
      [s.x, s.yTop,   s.halfBeamTop],
      [s.x, s.yMid,   s.halfBeamMid],
      [s.x, s.yKeel + 1.2, s.halfBeamKeel],
      [s.x, s.yKeel,  0],
      [s.x, s.yKeel + 1.2, -s.halfBeamKeel],
      [s.x, s.yMid,   -s.halfBeamMid],
      [s.x, s.yTop,   -s.halfBeamTop],
    ];
    for (let j = 0; j < ringPts; j++) {
      positions.push(pts[j][0], pts[j][1], pts[j][2]);
      uvs.push(u, (j / (ringPts - 1)) * 2.2);
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
      // Outward-facing CCW winding for Babylon.js left-handed coordinate system
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Cap top deck flush across all stations (starboard top -> port top, outward +Y)
  for (let i = 0; i < stations.length - 1; i++) {
    const a = i * ringPts;
    const b = (i + 1) * ringPts;
    const c = (i + 1) * ringPts + (ringPts - 1);
    const d = i * ringPts + (ringPts - 1);
    indices.push(a, d, b);
    indices.push(b, d, c);
  }

  // Cap stern transom (station 0)
  const sternCenterIdx = positions.length / 3;
  const s0 = stations[0];
  positions.push(s0.x, (s0.yTop + s0.yKeel) * 0.5, 0);
  uvs.push(0, 0.5);
  for (let j = 0; j < ringPts - 1; j++) {
    indices.push(sternCenterIdx, j, j + 1);
  }
  indices.push(sternCenterIdx, ringPts - 1, 0);

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

/**
 * Builds the complete 1931 Interbellum Flight-Deck Cruiser (CF) warship model for «Бродяга».
 */
export function buildFlightDeckCruiserModel(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  const B = BABYLON;
  const isNull = scene.getEngine() instanceof B.NullEngine;

  // 1. Authentic Sunlit 1931 Battleship-Grey Riveted Steel Hull Material
  const hullMat = new B.PBRMaterial('cfCruiserHullMat', scene);
  hullMat.albedoColor = c3('#8c969e');
  hullMat.metallic = 0.30;
  hullMat.roughness = 0.50;
  hullMat.environmentIntensity = 0.85;
  if (!isNull) {
    const tex = new B.Texture('./assets/textures/nomad/armored-deck-plates.png', scene);
    tex.uScale = 2.0; tex.vScale = 1.6;
    hullMat.albedoTexture = tex;
  }

  const darkSteelMat = new B.PBRMaterial('cfCruiserDarkSteelMat', scene);
  darkSteelMat.albedoColor = c3('#3b434b');
  darkSteelMat.metallic = 0.62;
  darkSteelMat.roughness = 0.44;
  darkSteelMat.environmentIntensity = 0.72;

  const deckSteelMat = new B.PBRMaterial('cfCruiserDeckMat', scene);
  deckSteelMat.albedoColor = c3('#a89b84'); // weathered teak/steel cruiser deck tone
  deckSteelMat.metallic = 0.14;
  deckSteelMat.roughness = 0.72;
  if (!isNull) {
    const dTex = new B.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg', scene);
    dTex.uScale = 3.0; dTex.vScale = 2.0;
    deckSteelMat.albedoTexture = dTex;
  }

  const crimsonMat = new B.PBRMaterial('cfCruiserCrimsonMat', scene);
  crimsonMat.albedoColor = c3('#a83226');
  crimsonMat.metallic = 0.18;
  crimsonMat.roughness = 0.52;

  const whiteMat = new B.PBRMaterial('cfCruiserWhiteMat', scene);
  whiteMat.albedoColor = c3('#efe7d4');
  whiteMat.metallic = 0.08;
  whiteMat.roughness = 0.62;

  const brassMat = new B.PBRMaterial('cfCruiserBrassMat', scene);
  brassMat.albedoColor = c3('#d4a64e');
  brassMat.metallic = 0.84;
  brassMat.roughness = 0.28;

  const amberGlowMat = new B.StandardMaterial('cfCruiserAmberGlowMat', scene);
  amberGlowMat.emissiveColor = c3('#ffaa38');
  amberGlowMat.diffuseColor = c3('#ffe09a');
  amberGlowMat.disableLighting = true;

  // 2. TRUE LOFTED 138-METER CRUISER WARSHIP HULL (stern x=-66 -> flared clipper bow x=+72!)
  const hullStations = [
    { x: -66, halfBeamTop: 7.5,  halfBeamMid: 6.2,  halfBeamKeel: 2.2, yTop: 4.0, yMid: -1.5, yKeel: -6.5 },
    { x: -56, halfBeamTop: 14.5, halfBeamMid: 13.0, halfBeamKeel: 5.8, yTop: 3.6, yMid: -2.4, yKeel: -9.0 },
    { x: -42, halfBeamTop: 19.5, halfBeamMid: 18.2, halfBeamKeel: 9.2, yTop: 3.2, yMid: -3.2, yKeel: -10.8 },
    { x: -20, halfBeamTop: 20.5, halfBeamMid: 19.2, halfBeamKeel: 9.8, yTop: 3.0, yMid: -3.4, yKeel: -11.2 },
    { x:   4, halfBeamTop: 18.5, halfBeamMid: 17.0, halfBeamKeel: 8.6, yTop: 2.9, yMid: -3.2, yKeel: -10.5 },
    { x:  26, halfBeamTop: 14.2, halfBeamMid: 12.2, halfBeamKeel: 5.6, yTop: 2.8, yMid: -2.6, yKeel: -9.2 },
    { x:  46, halfBeamTop: 10.6, halfBeamMid: 8.2,  halfBeamKeel: 3.0, yTop: 2.9, yMid: -2.0, yKeel: -7.8 },
    { x:  60, halfBeamTop: 6.4,  halfBeamMid: 4.0,  halfBeamKeel: 1.2, yTop: 3.2, yMid: -1.4, yKeel: -6.2 },
    { x:  71, halfBeamTop: 0.7,  halfBeamMid: 0.45, halfBeamKeel: 0.2, yTop: 3.8, yMid: -0.6, yKeel: -4.2 },
  ];
  createLoftedCruiserHull(scene, 'cfLoftedMainHull', hullStations, hullMat, asteroidBase.group, shadowGen);

  // Lower crimson anti-fouling keel hull band (sleek lofted lower keel!)
  const keelStations = hullStations.map(s => ({
    x: s.x,
    halfBeamTop: s.halfBeamMid * 0.96,
    halfBeamMid: s.halfBeamKeel * 1.04,
    halfBeamKeel: s.halfBeamKeel * 0.45,
    yTop: s.yMid - 0.1,
    yMid: s.yKeel + 0.8,
    yKeel: s.yKeel - 0.8,
  }));
  createLoftedCruiserHull(scene, 'cfLoftedCrimsonKeel', keelStations, crimsonMat, asteroidBase.group, null);

  const steelParts = [], darkParts = [], crimsonParts = [], whiteParts = [], brassParts = [], glowParts = [], deckParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
    arr.push(m);
  };

  // 3. DIAGONAL CRIMSON-AND-WHITE HERALDIC BOW STRIPE (exact key-art signature on both bow flanks!)
  for (const side of [-1, 1]) {
    put(whiteParts, B.MeshBuilder.CreateBox(`cfBowStripeW_${side}`, { width: 5.4, height: 8.6, depth: 0.35 }, scene), 49.0, -1.6, side * 8.6, side * 0.22, side * -0.22, -0.32);
    put(crimsonParts, B.MeshBuilder.CreateBox(`cfBowStripeC_${side}`, { width: 3.4, height: 8.8, depth: 0.46 }, scene), 49.0, -1.6, side * 8.72, side * 0.22, side * -0.22, -0.32);
    // Brass bow stem trim & anchors
    put(brassParts, B.MeshBuilder.CreateTorus(`cfHawse_${side}`, { diameter: 1.5, thickness: 0.24, tessellation: 10 }, scene), 57.5, 0.8, side * 5.6, 0, Math.PI * 0.5, 0);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfAnchor_${side}`, { diameter: 0.35, height: 2.6, tessellation: 6 }, scene), 57.5, -0.6, side * 5.9);
  }
  put(brassParts, B.MeshBuilder.CreateBox('cfBowStem', { width: 0.8, height: 8.4, depth: 0.8 }, scene), 71.2, -0.3, 0, 0, 0, -0.28);

  // 4. RECESSED GLOWING AMBER UNDER-HULL LIFT-THRUSTER PODS (tucked cleanly into the cruiser keel, exact key-art look!)
  for (const [vx, vw, vz, vy] of [[-34, 10.5, 6.8, -8.8], [-12, 11.5, 7.6, -9.2], [12, 10.0, 6.2, -8.4], [32, 8.2, 4.4, -7.2]]) {
    put(darkParts, B.MeshBuilder.CreateBox(`cfVentPod_${vx}`, { width: vw, height: 2.2, depth: vz * 2 }, scene), vx, vy, 0);
    for (const side of [-1, 1]) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfVentGlow_${vx}_${side}`, { width: vw * 0.78, height: 1.05, depth: 0.28 }, scene), vx, vy - 0.1, side * (vz + 0.08));
      for (let lx = -vw * 0.3; lx <= vw * 0.31; lx += vw * 0.2) {
        put(darkParts, B.MeshBuilder.CreateBox(`cfVentBar_${vx}_${side}_${lx}`, { width: 0.36, height: 1.4, depth: 0.42 }, scene), vx + lx, vy - 0.1, side * (vz + 0.14));
      }
    }
  }

  // 5. ARMORED CRUISER SUPERSTRUCTURE CITADEL (clean tapered warship upper hull — NO floating pancake on stilts!)
  // Solidly encloses the hangar bay (x = -54..+2) and steps cleanly up to the flat upper shipyard deck (y = 20.85)!
  for (const side of [-1, 1]) {
    // Sloped armored cruiser hull walls flanking the hangar bay (leaving z = -10..+10 wide open at x = +2!)
    put(steelParts, B.MeshBuilder.CreateBox(`cfCitadelWall_${side}`, { width: 54.0, height: 17.8, depth: 5.5 }, scene), -25.0, 11.8, side * 17.2, side * -0.10);
    // Brass armor strake & warm glowing recessed cabin porthole strip along the citadel side
    put(brassParts, B.MeshBuilder.CreateBox(`cfCitadelStrake_${side}`, { width: 56.0, height: 0.45, depth: 0.6 }, scene), -25.0, 20.6, side * 19.6);
    for (let px = -46; px <= -4; px += 5.5) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfCitPort_${side}_${px}`, { width: 1.2, height: 0.85, depth: 0.24 }, scene), px, 15.6, side * 19.8);
      put(glowParts, B.MeshBuilder.CreateBox(`cfCitPortLow_${side}_${px}`, { width: 1.0, height: 0.75, depth: 0.24 }, scene), px, 9.2, side * 20.2);
    }
    // Integrated armored cruiser sponsons supporting the mid-level AA Turret (16, 13.8, 25) & Radar (14, 15.2, -26)
    const sx = side > 0 ? 16.0 : 14.0, sz = side > 0 ? 25.0 : -26.0, sy = side > 0 ? 13.4 : 14.8;
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfSponsonCol_${side}`, { diameterTop: 9.5, diameterBottom: 5.2, height: 12.5, tessellation: 12 }, scene), sx, sy - 6.6, sz);
    put(steelParts, B.MeshBuilder.CreateBox(`cfSponsonWing_${side}`, { width: 11.5, height: 4.2, depth: 14.0 }, scene), sx - 2.5, sy - 3.6, side * 17.5);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfSponsonRing_${side}`, { diameter: 9.8, thickness: 0.35, tessellation: 16 }, scene), sx, sy - 0.5, sz);
  }
  // Tapered armored cruiser aft bulkhead closing the stern of the superstructure cleanly
  put(steelParts, B.MeshBuilder.CreateCylinder('cfAftBulkhead', { diameterTop: 38.0, diameterBottom: 28.0, height: 17.8, tessellation: 8 }, scene), -50.0, 11.8, 0, 0, Math.PI / 8, 0, 0.52, 1.0, 1.0);

  // Clean Rectangular/Beveled Armored Cruiser Upper Deck (replaces the ugly round 66m flying-saucer pancake!)
  put(deckParts, B.MeshBuilder.CreateBox('cfUpperShipyardDeck', { width: 58.0, height: 1.1, depth: 40.0 }, scene), -25.0, 20.88, 0.0);
  put(steelParts, B.MeshBuilder.CreateBox('cfUpperDeckCoamingL', { width: 58.4, height: 0.75, depth: 0.55 }, scene), -25.0, 21.65, -20.0);
  put(steelParts, B.MeshBuilder.CreateBox('cfUpperDeckCoamingR', { width: 58.4, height: 0.75, depth: 0.55 }, scene), -25.0, 21.65,  20.0);
  put(steelParts, B.MeshBuilder.CreateBox('cfUpperDeckCoamingA', { width: 0.55, height: 0.75, depth: 40.4 }, scene), -54.0, 21.65, 0.0);

  // 6. CLASSIC 1931 FLIGHT-DECK CRUISER ISLAND SUPERSTRUCTURE:
  //    Tiered Pagoda/Tripod Mast + Rangefinder + TWO Thick Crimson-Banded Raked Funnels!
  // Twin thick 1930s cruiser funnels (raked 18° aft, crimson flagship band, black top cap!)
  for (const fx of [-33.5, -42.5]) {
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfFunnelBody_${fx}`, { diameterTop: 3.2, diameterBottom: 4.0, height: 11.5, tessellation: 14 }, scene), fx, 26.8, -17.8, 0, 0, 0.24);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfFunnelCap_${fx}`, { diameterTop: 3.4, diameterBottom: 3.25, height: 1.8, tessellation: 14 }, scene), fx - 1.5, 32.4, -17.8, 0, 0, 0.24);
    put(crimsonParts, B.MeshBuilder.CreateCylinder(`cfFunnelBand_${fx}`, { diameterTop: 3.45, diameterBottom: 3.60, height: 1.8, tessellation: 14 }, scene), fx - 0.8, 29.8, -17.8, 0, 0, 0.24);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfFunnelTrim_${fx}`, { diameter: 3.65, thickness: 0.18, tessellation: 14 }, scene), fx - 0.5, 28.8, -17.8, 0, 0, 0.24);
  }

  // Tall 1931 US Navy Pagoda / Tripod Bridge Mast with tiered bridge wings, director & yardarms
  const mx = -21.5, mz = -17.8;
  put(steelParts, B.MeshBuilder.CreateBox('cfBridgeTier1', { width: 10.5, height: 5.0, depth: 6.2 }, scene), mx, 23.8, mz);
  put(steelParts, B.MeshBuilder.CreateBox('cfBridgeTier2', { width: 7.4, height: 4.4, depth: 5.2 }, scene), mx, 28.4, mz);
  put(steelParts, B.MeshBuilder.CreateBox('cfBridgeWing', { width: 3.2, height: 1.4, depth: 11.2 }, scene), mx + 1.8, 28.2, mz);
  put(glowParts, B.MeshBuilder.CreateBox('cfBridgeWindows', { width: 0.25, height: 0.9, depth: 4.4 }, scene), mx + 3.75, 29.2, mz);
  // Slender tripod foremast rising cleanly to y = 46!
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastCore', { diameterTop: 0.36, diameterBottom: 1.2, height: 17.5, tessellation: 8 }, scene), mx, 38.0, mz);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastTripodL', { diameterTop: 0.26, diameterBottom: 0.65, height: 13.5, tessellation: 6 }, scene), mx - 2.4, 35.5, mz - 1.8, 0.20, 0, -0.24);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastTripodR', { diameterTop: 0.26, diameterBottom: 0.65, height: 13.5, tessellation: 6 }, scene), mx - 2.4, 35.5, mz + 1.8, -0.20, 0, -0.24);
  put(steelParts, B.MeshBuilder.CreateCylinder('cfFireControlTop', { diameter: 3.4, height: 1.6, tessellation: 10 }, scene), mx, 37.8, mz);
  put(brassParts, B.MeshBuilder.CreateBox('cfRangefinderBar', { width: 0.75, height: 0.75, depth: 5.8 }, scene), mx, 39.4, mz);
  put(darkParts, B.MeshBuilder.CreateBox('cfSignalYard1', { width: 0.24, height: 0.24, depth: 12.5 }, scene), mx, 42.2, mz);
  put(darkParts, B.MeshBuilder.CreateBox('cfSignalYard2', { width: 0.20, height: 0.20, depth: 8.2 }, scene), mx, 44.8, mz);

  // 7. SUPERFIRING TRIPLE-BARREL 6-INCH CRUISER MAIN GUN TURRETS (signature of the 1930s Flight-Deck Cruiser CF!)
  const turrets = [
    { x: -50.0, y: 22.0, z: -8.5, dir: -1, elev: 0.14 },
    { x: -50.0, y: 22.0, z:  8.5, dir: -1, elev: 0.14 },
    { x:   1.2, y: 22.0, z: -14.2, dir: 1, elev: 0.16 },
    { x:   1.2, y: 22.0, z:  14.2, dir: 1, elev: 0.16 },
  ];
  for (const t of turrets) {
    put(steelParts, B.MeshBuilder.CreateCylinder(`cfBarb_${t.x}_${t.z}`, { diameter: 5.0, height: 1.8, tessellation: 12 }, scene), t.x, t.y, t.z);
    put(steelParts, B.MeshBuilder.CreateBox(`cfTurret_${t.x}_${t.z}`, { width: 6.2, height: 2.4, depth: 4.8 }, scene), t.x, t.y + 1.8, t.z);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfTurretRing_${t.x}_${t.z}`, { diameter: 5.1, thickness: 0.24, tessellation: 14 }, scene), t.x, t.y + 0.85, t.z);
    for (const bz of [-1.15, 0.0, 1.15]) {
      put(darkParts, B.MeshBuilder.CreateCylinder(`cfBarrel_${t.x}_${t.z}_${bz}`, { diameterTop: 0.28, diameterBottom: 0.42, height: 8.8, tessellation: 8 }, scene), t.x + t.dir * 6.4, t.y + 2.4, t.z + bz, 0, 0, t.dir * (Math.PI * 0.5 - t.elev));
    }
  }

  // 8. SLEEK CRUISER STERN FINS & TWIN MAIN PROPULSION NOZZLES
  for (const side of [-1, 1]) {
    put(crimsonParts, B.MeshBuilder.CreateBox(`cfSternFin_${side}`, { width: 9.5, height: 7.5, depth: 0.65 }, scene), -66.5, -2.5, side * 6.8, 0, 0, 0.22);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfSternNozzle_${side}`, { diameterTop: 2.8, diameterBottom: 4.2, height: 5.6, tessellation: 12 }, scene), -67.2, -3.5, side * 3.8, 0, 0, Math.PI * 0.5);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfSternNozzleRing_${side}`, { diameter: 4.2, thickness: 0.34, tessellation: 14 }, scene), -70.0, -3.5, side * 3.8, 0, 0, Math.PI * 0.5);
    put(glowParts, B.MeshBuilder.CreateDisc(`cfSternNozzleGlow_${side}`, { radius: 1.7, tessellation: 10 }, scene), -70.1, -3.5, side * 3.8, 0, Math.PI * 0.5, 0);
  }

  mergeKit(steelParts, 'cfCruiserSuperstructure', asteroidBase.group, hullMat, shadowGen);
  mergeKit(darkParts, 'cfCruiserDarkSteel', asteroidBase.group, darkSteelMat, null);
  mergeKit(deckParts, 'cfCruiserUpperDeck', asteroidBase.group, deckSteelMat, shadowGen);
  mergeKit(crimsonParts, 'cfCruiserCrimsonTrim', asteroidBase.group, crimsonMat, null);
  mergeKit(whiteParts, 'cfCruiserWhiteTrim', asteroidBase.group, whiteMat, null);
  mergeKit(brassParts, 'cfCruiserBrassTrim', asteroidBase.group, brassMat, null);
  mergeKit(glowParts, 'cfCruiserAmberLights', asteroidBase.group, amberGlowMat, null);

  return { hullMat };
}
