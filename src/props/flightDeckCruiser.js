/**
 * Authentic 235-Meter 1930s Interbellum Flight-Deck Cruiser (CF) «Бродяга».
 * Modular naval architecture:
 *   1. Procedural 1930s Naval Haze-Grey riveted steel plate & teak flight-deck textures (no blocky tiles).
 *   2. Lofted 235m cruiser hull: flared clipper bow (-X = -152) -> wide flat 28m x 82m stern flight deck (+X = +82).
 *   3. Three large sculpted superfiring triple-barrel 6-inch cruiser turrets (A, B, C) forward.
 *   4. Sculpted 1930s curved/faceted cruiser bridge, wrap-around wings, tripod foremast with rigging,
 *      and twin oval raked funnels with steam pipes & crimson bands.
 *   5. Clean cantilevered carrier stern overhang (zero stern rocket nozzles) + recessed keel levitation bays.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Generates a crisp 1930s Haze-Grey naval hull plate texture (horizontal welded/riveted strakes
 * + subtle weather streaking, eliminating blocky dark-blue tiles).
 */
function createNavalHullPlateTexture(scene) {
  const tex = new BABYLON.DynamicTexture('cfNavalHullPlatesTex', { width: 512, height: 512 }, scene, true);
  const ctx = tex.getContext();
  ctx.fillStyle = '#9aa3aa';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle horizontal hull plate strakes with slight per-plate tonal variation
  const rows = 8;
  const rowH = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const shade = 148 + ((r * 17) % 14) - 7;
    ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 11})`;
    ctx.fillRect(0, r * rowH, 512, rowH);
    // Horizontal strake seam
    ctx.fillStyle = 'rgba(42, 48, 54, 0.38)';
    ctx.fillRect(0, r * rowH, 512, 2);
    ctx.fillStyle = 'rgba(235, 240, 244, 0.22)';
    ctx.fillRect(0, r * rowH + 2, 512, 1);

    // Staggered vertical butt-joint seams & subtle rust/rain streaks
    const cols = 4;
    const colW = 512 / cols;
    const off = (r % 2) * (colW * 0.5);
    for (let c = 0; c <= cols; c++) {
      const vx = (c * colW + off) % 512;
      ctx.fillStyle = 'rgba(45, 52, 58, 0.30)';
      ctx.fillRect(vx, r * rowH, 2, rowH);
      // Light rain/salt streak under seam
      const grad = ctx.createLinearGradient(0, r * rowH, 0, r * rowH + rowH * 0.75);
      grad.addColorStop(0, 'rgba(65, 58, 52, 0.16)');
      grad.addColorStop(1, 'rgba(65, 58, 52, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(vx + 2, r * rowH + 2, 10, rowH * 0.75);
    }
  }
  tex.update();
  tex.uScale = 2.0;
  tex.vScale = 1.0;
  return tex;
}

/**
 * Generates a warm weathered 1930s teak carrier flight-deck plank texture.
 */
function createTeakDeckTexture(scene) {
  const tex = new BABYLON.DynamicTexture('cfTeakDeckTex', { width: 512, height: 512 }, scene, true);
  const ctx = tex.getContext();
  ctx.fillStyle = '#b49c76';
  ctx.fillRect(0, 0, 512, 512);
  const planks = 32;
  const ph = 512 / planks;
  for (let i = 0; i < planks; i++) {
    const v = ((i * 29) % 18) - 9;
    ctx.fillStyle = `rgb(${176 + v}, ${152 + v}, ${114 + v})`;
    ctx.fillRect(0, i * ph, 512, ph);
    ctx.fillStyle = 'rgba(58, 46, 32, 0.34)';
    ctx.fillRect(0, i * ph, 512, 1.5);
  }
  tex.update();
  tex.uScale = 5.0;
  tex.vScale = 2.5;
  return tex;
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
    const u = ((s.x - xMin) / xSpan) * 6.0;
    const pts = [
      [s.x, s.yTop,         s.halfBeamTop],
      [s.x, s.yMid,         s.halfBeamMid],
      [s.x, s.yKeel + 1.6,  s.halfBeamKeel],
      [s.x, s.yKeel,        0],
      [s.x, s.yKeel + 1.6, -s.halfBeamKeel],
      [s.x, s.yMid,        -s.halfBeamMid],
      [s.x, s.yTop,        -s.halfBeamTop],
    ];
    for (let j = 0; j < ringPts; j++) {
      positions.push(pts[j][0], pts[j][1], pts[j][2]);
      uvs.push(u, (j / (ringPts - 1)) * 1.4);
    }
  }

  for (let i = 0; i < stations.length - 1; i++) {
    const rowA = i * ringPts;
    const rowB = (i + 1) * ringPts;
    for (let j = 0; j < ringPts - 1; j++) {
      const a = rowA + j, b = rowB + j, c = rowB + j + 1, d = rowA + j + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Top deck cap (+Y outward)
  for (let i = 0; i < stations.length - 1; i++) {
    const a = i * ringPts, b = (i + 1) * ringPts;
    const c = (i + 1) * ringPts + (ringPts - 1), d = i * ringPts + (ringPts - 1);
    indices.push(a, d, b);
    indices.push(b, d, c);
  }

  // Stern transom cap (+X outward)
  const last = stations.length - 1;
  const lastRow = last * ringPts;
  const sternCenterIdx = positions.length / 3;
  const sLast = stations[last];
  positions.push(sLast.x, (sLast.yTop + sLast.yKeel) * 0.5, 0);
  uvs.push(6.0, 0.5);
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
  hull.albedoColor = c3('#aeb7be'); // crisp sunlit 1930s US Navy Haze-Grey
  hull.metallic = 0.24;
  hull.roughness = 0.56;
  hull.environmentIntensity = 0.78;
  if (!isNull) hull.albedoTexture = createNavalHullPlateTexture(scene);

  const hullDark = new B.PBRMaterial('cfCruiserHullDarkMat', scene);
  hullDark.albedoColor = c3('#78838c'); // shaded lower armor belt / turret faces
  hullDark.metallic = 0.34;
  hullDark.roughness = 0.50;
  hullDark.environmentIntensity = 0.75;

  const darkSteel = new B.PBRMaterial('cfCruiserDarkSteelMat', scene);
  darkSteel.albedoColor = c3('#3d454d');
  darkSteel.metallic = 0.62;
  darkSteel.roughness = 0.42;
  darkSteel.environmentIntensity = 0.72;

  const deckWood = new B.PBRMaterial('cfCruiserDeckWoodMat', scene);
  deckWood.albedoColor = c3('#c8b28c'); // sunlit weathered teak carrier flight deck
  deckWood.metallic = 0.04;
  deckWood.roughness = 0.80;
  if (!isNull) deckWood.albedoTexture = createTeakDeckTexture(scene);

  const crimson = new B.PBRMaterial('cfCruiserCrimsonMat', scene);
  crimson.albedoColor = c3('#9d3226'); // naval oxide-red lower hull & flagship stripes
  crimson.metallic = 0.14;
  crimson.roughness = 0.58;

  const white = new B.PBRMaterial('cfCruiserWhiteMat', scene);
  white.albedoColor = c3('#efe8d6');
  white.metallic = 0.06;
  white.roughness = 0.68;

  const brass = new B.PBRMaterial('cfCruiserBrassMat', scene);
  brass.albedoColor = c3('#cfa24c');
  brass.metallic = 0.82;
  brass.roughness = 0.30;

  const amberGlow = new B.StandardMaterial('cfCruiserAmberGlowMat', scene);
  amberGlow.emissiveColor = c3('#ffaa38');
  amberGlow.diffuseColor = c3('#ffe29c');
  amberGlow.disableLighting = true;

  return { hull, hullDark, darkSteel, deckWood, crimson, white, brass, amberGlow };
}

/**
 * Module 1: 234-meter Lofted 1930s Flight-Deck Cruiser Hull (bow x=-152 -> stern x=+82).
 */
function buildCruiserHull(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const hullStations = [
    // Sharp flared clipper bow (-X = forward)
    { x: -152, halfBeamTop: 0.7,  halfBeamMid: 0.45, halfBeamKeel: 0.2,  yTop: 12.0, yMid: 4.5,  yKeel: -2.8 },
    { x: -136, halfBeamTop: 6.4,  halfBeamMid: 4.4,  halfBeamKeel: 1.6,  yTop: 11.0, yMid: 2.6,  yKeel: -6.8 },
    { x: -116, halfBeamTop: 11.6, halfBeamMid: 9.4,  halfBeamKeel: 4.4,  yTop: 10.2, yMid: 1.0,  yKeel: -9.8 },
    { x:  -92, halfBeamTop: 15.6, halfBeamMid: 13.8, halfBeamKeel: 7.4,  yTop: 9.6,  yMid: -0.2, yKeel: -11.6 },
    { x:  -64, halfBeamTop: 18.6, halfBeamMid: 17.2, halfBeamKeel: 10.0, yTop: 9.2,  yMid: -1.2, yKeel: -12.6 },
    // Midships & Aft hull cleanly supporting the wide 28m x 80m flat flight deck (yTop=2.25 below runway!)
    { x:  -40, halfBeamTop: 19.6, halfBeamMid: 18.4, halfBeamKeel: 11.0, yTop: 2.35, yMid: -2.0, yKeel: -13.0 },
    { x:  -10, halfBeamTop: 19.6, halfBeamMid: 18.4, halfBeamKeel: 10.8, yTop: 2.25, yMid: -2.2, yKeel: -12.8 },
    { x:   18, halfBeamTop: 18.0, halfBeamMid: 16.6, halfBeamKeel: 9.2,  yTop: 2.25, yMid: -2.2, yKeel: -11.6 },
    { x:   44, halfBeamTop: 16.2, halfBeamMid: 14.2, halfBeamKeel: 6.8,  yTop: 2.25, yMid: -2.0, yKeel: -9.6 },
    { x:   66, halfBeamTop: 14.2, halfBeamMid: 11.4, halfBeamKeel: 4.4,  yTop: 2.25, yMid: -1.6, yKeel: -7.4 },
    { x:   82, halfBeamTop: 12.8, halfBeamMid: 9.2,  halfBeamKeel: 3.0,  yTop: 2.25, yMid: -1.2, yKeel: -5.4 },
  ];
  createLoftedHull(scene, 'cfLoftedMainHull', hullStations, mats.hull, parent, shadowGen);

  // Lower crimson anti-fouling hull bottom
  const keelStations = hullStations.map(s => ({
    x: s.x,
    halfBeamTop: s.halfBeamMid * 0.98,
    halfBeamMid: s.halfBeamKeel * 1.05,
    halfBeamKeel: s.halfBeamKeel * 0.44,
    yTop: s.yMid - 0.12,
    yMid: s.yKeel + 1.0,
    yKeel: s.yKeel - 0.9,
  }));
  createLoftedHull(scene, 'cfLoftedCrimsonKeel', keelStations, mats.crimson, parent, null);

  const whiteParts = [], crimsonParts = [], brassParts = [], darkParts = [], glowParts = [], deckParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  // Weathered teak forecastle deck (x = -142..-58)
  put(deckParts, B.MeshBuilder.CreateBox('cfBowTeakDeck', { width: 76, height: 0.45, depth: 22.0 }, scene), -96, 9.8, 0);
  // Brass stem, anchors, hawsepipes & diagonal white-crimson bow flagship stripe
  put(brassParts, B.MeshBuilder.CreateBox('cfBowStem', { width: 0.72, height: 15.0, depth: 0.72 }, scene), -152.0, 4.6, 0, 0, 0, -0.05);
  for (const side of [-1, 1]) {
    put(whiteParts, B.MeshBuilder.CreateBox(`cfBowStripeW_${side}`, { width: 6.4, height: 14.4, depth: 0.42 }, scene), -124.0, 2.5, side * 9.0, side * 0.22, side * 0.26, 0.22);
    put(crimsonParts, B.MeshBuilder.CreateBox(`cfBowStripeC_${side}`, { width: 4.0, height: 14.6, depth: 0.54 }, scene), -124.0, 2.5, side * 9.12, side * 0.22, side * 0.26, 0.22);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfHawse_${side}`, { diameter: 1.7, thickness: 0.26, tessellation: 10 }, scene), -138.0, 6.6, side * 5.2, 0, Math.PI * 0.5, 0);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfAnchor_${side}`, { diameter: 0.40, height: 3.6, tessellation: 6 }, scene), -138.0, 4.6, side * 5.6);
    for (let px = -112; px <= -58; px += 7.5) {
      const zOff = 12.2 + ((px + 112) / 54) * 5.8;
      put(glowParts, B.MeshBuilder.CreateCylinder(`cfHullPort_${side}_${px}`, { diameter: 0.80, height: 0.25, tessellation: 8 }, scene), px, 5.6, side * zOff, Math.PI * 0.5, 0, 0);
    }
    put(brassParts, B.MeshBuilder.CreateBox(`cfBowRail_${side}`, { width: 74, height: 0.22, depth: 0.18 }, scene), -96, 11.0, side * 11.2);
  }
  put(brassParts, B.MeshBuilder.CreateCylinder('cfBowCapstan', { diameterTop: 1.5, diameterBottom: 2.0, height: 1.3, tessellation: 10 }, scene), -134, 11.0, 0);

  mergeKit(whiteParts, 'cfBowStripeWhite', parent, mats.white, null);
  mergeKit(crimsonParts, 'cfBowStripeCrimson', parent, mats.crimson, null);
  mergeKit(brassParts, 'cfHullBrassKit', parent, mats.brass, null);
  mergeKit(darkParts, 'cfHullAnchorKit', parent, mats.darkSteel, null);
  mergeKit(glowParts, 'cfHullPortholes', parent, mats.amberGlow, null);
  mergeKit(deckParts, 'cfBowTeakDeckMesh', parent, mats.deckWood, shadowGen);
}

/**
 * Module 2: TWO Large Sculpted Superfiring Triple-Barrel 6-inch Cruiser Turrets (A, B).
 * Sloped glacis face, chamfered armor roof, blast bags, rangefinder hoods & long 19m triple barrels.
 */
function buildMainBatteryTurrets(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const hullParts = [], darkHullParts = [], barrelParts = [], brassParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  const turrets = [
    { id: 'A', x: -112, y: 10.6, elev: 0.11 },
    { id: 'B', x:  -84, y: 15.2, elev: 0.14 },
  ];
  for (const t of turrets) {
    const barbH = t.y - 8.4;
    // Heavy cylindrical armored barbette
    put(hullParts, B.MeshBuilder.CreateCylinder(`cfBarb_${t.id}`, { diameter: 11.2, height: barbH, tessellation: 18 }, scene), t.x, 8.4 + barbH * 0.5, 0);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfBarbRing_${t.id}`, { diameter: 11.4, thickness: 0.36, tessellation: 20 }, scene), t.x, t.y + 0.1, 0);
    // Sculpted 1930s US Navy 6"/47 triple gunhouse (sloped glacis + chamfered rear overhang + top cupola)
    put(hullParts, B.MeshBuilder.CreateBox(`cfGunBody_${t.id}`, { width: 12.2, height: 4.0, depth: 9.8 }, scene), t.x + 1.0, t.y + 2.1, 0);
    put(darkHullParts, B.MeshBuilder.CreateBox(`cfGunGlacis_${t.id}`, { width: 3.0, height: 3.8, depth: 9.4 }, scene), t.x - 5.4, t.y + 1.9, 0, 0, 0, 0.36);
    put(hullParts, B.MeshBuilder.CreateBox(`cfGunRoof_${t.id}`, { width: 10.2, height: 0.7, depth: 8.6 }, scene), t.x + 0.8, t.y + 4.3, 0);
    // Optical rangefinder hood ears protruding from turret flanks
    put(darkHullParts, B.MeshBuilder.CreateCylinder(`cfGunRF_${t.id}`, { diameter: 0.92, height: 12.2, tessellation: 10 }, scene), t.x + 3.6, t.y + 3.1, 0, Math.PI * 0.5, 0, 0);
    put(brassParts, B.MeshBuilder.CreateBox(`cfGunSight_${t.id}`, { width: 1.4, height: 0.7, depth: 2.2 }, scene), t.x - 1.5, t.y + 4.8, 0);
    // Long tapered 19-meter triple barrels with canvas blast bags & recoil sleeves
    for (const bz of [-2.4, 0.0, 2.4]) {
      put(darkHullParts, B.MeshBuilder.CreateSphere(`cfBlastBag_${t.id}_${bz}`, { diameterX: 2.4, diameterY: 1.6, diameterZ: 1.6, segments: 8 }, scene), t.x - 6.6, t.y + 2.5, bz);
      put(barrelParts, B.MeshBuilder.CreateCylinder(`cfSleeve_${t.id}_${bz}`, { diameter: 1.05, height: 4.8, tessellation: 10 }, scene), t.x - 8.8, t.y + 2.8, bz, 0, 0, Math.PI * 0.5 - t.elev);
      put(barrelParts, B.MeshBuilder.CreateCylinder(`cfBarrel_${t.id}_${bz}`, { diameterTop: 0.42, diameterBottom: 0.68, height: 18.8, tessellation: 10 }, scene), t.x - 16.4, t.y + 3.7, bz, 0, 0, Math.PI * 0.5 - t.elev);
    }
  }

  mergeKit(hullParts, 'cfMainTurretsHull', parent, mats.hull, shadowGen);
  mergeKit(darkHullParts, 'cfMainTurretsArmor', parent, mats.hullDark, shadowGen);
  mergeKit(barrelParts, 'cfMainTurretsBarrels', parent, mats.darkSteel, shadowGen);
  mergeKit(brassParts, 'cfMainTurretsBrass', parent, mats.brass, null);
}

/**
 * Module 3: Authentic 1930s Cruiser Superstructure (Zero Pile-of-Boxes!).
 * Curved/octagonal conning tower, wrap-around compass bridge wings with splinter shields,
 * tall tripod foremast with diagonal wire rigging, and twin oval raked funnels with steam pipes.
 */
function buildMidshipsSuperstructure(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const hullParts = [], darkHullParts = [], darkParts = [], crimsonParts = [], brassParts = [], glowParts = [], deckParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
    arr.push(m);
  };

  // Sculpted Stepped 1930s Cruiser Waist (NO giant 18m rectangular shipping-container box!)
  // Lower hull freeboard continues smoothly from the bow forecastle (y = 2.6..10.6), then steps INWARD
  // with an open waist promenade, angled cruiser stanchions, lifeboats & curved deckhouse galleries!
  for (const side of [-1, 1]) {
    // Lower waist hull strake matching forecastle height (only 8m tall instead of 18m!)
    put(hullParts, B.MeshBuilder.CreateBox(`cfWaistLower_${side}`, { width: 58.0, height: 8.2, depth: 3.6 }, scene), -27.0, 6.8, side * 18.2, side * -0.08);
    // Open waist promenade deck + brass safety railing at y = 11.0 (breaks up the side silhouette!)
    put(deckParts, B.MeshBuilder.CreateBox(`cfWaistWalk_${side}`, { width: 54.0, height: 0.45, depth: 4.8 }, scene), -26.0, 11.0, side * 16.4);
    put(brassParts, B.MeshBuilder.CreateBox(`cfWaistRail_${side}`, { width: 54.0, height: 0.22, depth: 0.16 }, scene), -26.0, 12.1, side * 18.8);
    // Recessed, stepped upper shelter-deck coaming & angled naval support pillars (airy 1930s cruiser architecture!)
    for (let px = -50; px <= 0; px += 8.2) {
      put(darkHullParts, B.MeshBuilder.CreateCylinder(`cfWaistStanchion_${side}_${px}`, { diameterTop: 0.65, diameterBottom: 0.95, height: 9.8, tessellation: 8 }, scene), px, 16.0, side * 17.6, side * 0.10);
    }
    // Curved/stepped armored bridge-wing gallery mid-waist (breaks the straight horizontal box line!)
    put(hullParts, B.MeshBuilder.CreateCylinder(`cfWaistSponson_${side}`, { diameter: 9.5, height: 3.6, tessellation: 12 }, scene), -38.0, 13.4, side * 16.8);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfWaistSponsonRim_${side}`, { diameter: 9.7, thickness: 0.22, tessellation: 16 }, scene), -38.0, 15.2, side * 16.8);
    // Lower hull portholes along the sleek waist freeboard
    for (let px = -50; px <= -4; px += 6.0) {
      put(glowParts, B.MeshBuilder.CreateCylinder(`cfCitPortB_${side}_${px}`, { diameter: 0.80, height: 0.25, tessellation: 8 }, scene), px, 8.2, side * 20.1, Math.PI * 0.5);
    }
  }
  // Curved stepped forecastle break rising smoothly toward the bridge (x = -62..-50)
  put(hullParts, B.MeshBuilder.CreateCylinder('cfForwardGlacis', { diameterTop: 26.0, diameterBottom: 32.0, height: 10.6, tessellation: 10 }, scene), -55.0, 14.4, 0, 0, Math.PI / 10, 0, 0.58, 1.0, 1.0);
  // Sleeker beveled upper cruiser deckhouse roof (y = 20.88, narrower depth=34 so bridge & funnels dominate!)
  put(deckParts, B.MeshBuilder.CreateBox('cfUpperDeckMain', { width: 54.0, height: 0.9, depth: 34.0 }, scene), -25.0, 20.88, 0);
  put(darkHullParts, B.MeshBuilder.CreateBox('cfUpperRailL', { width: 54.2, height: 0.7, depth: 0.35 }, scene), -25.0, 21.6, -17.0);
  put(darkHullParts, B.MeshBuilder.CreateBox('cfUpperRailR', { width: 54.2, height: 0.7, depth: 0.35 }, scene), -25.0, 21.6,  17.0);

  // Sculpted 1930s US Navy Cruiser Conning Tower & Wrap-Around Compass Bridge (curved octagonal tiers, zero boxes!)
  const bx = -54.0, bz = 0.0;
  // Base octagonal armored conning tower
  put(hullParts, B.MeshBuilder.CreateCylinder('cfConningBase', { diameterTop: 13.5, diameterBottom: 15.2, height: 6.4, tessellation: 8 }, scene), bx, 24.4, bz, 0, Math.PI / 8);
  // Wrap-around curved Admiral's Bridge & Compass Bridge decks with splinter shields
  put(darkHullParts, B.MeshBuilder.CreateCylinder('cfBridgeDeck1', { diameter: 16.5, height: 1.2, tessellation: 12 }, scene), bx - 1.2, 28.0, bz, 0, 0, 0, 0.82, 1.0, 1.28);
  put(hullParts, B.MeshBuilder.CreateCylinder('cfConningMid', { diameterTop: 10.2, diameterBottom: 11.4, height: 5.2, tessellation: 8 }, scene), bx, 31.0, bz, 0, Math.PI / 8);
  put(darkHullParts, B.MeshBuilder.CreateCylinder('cfBridgeDeck2', { diameter: 12.6, height: 1.1, tessellation: 12 }, scene), bx - 1.0, 33.8, bz, 0, 0, 0, 0.80, 1.0, 1.35);
  // Armored Fire-Control Director Tower atop the bridge
  put(hullParts, B.MeshBuilder.CreateCylinder('cfDirectorBase', { diameterTop: 5.8, diameterBottom: 7.4, height: 4.8, tessellation: 10 }, scene), bx, 36.6, bz);
  put(brassParts, B.MeshBuilder.CreateBox('cfDirectorRangefinder', { width: 1.0, height: 0.95, depth: 8.6 }, scene), bx - 0.6, 39.2, bz);
  // Warm panoramic bridge windows curving around the forward compass bridge
  for (const ang of [-0.55, -0.28, 0.0, 0.28, 0.55]) {
    put(glowParts, B.MeshBuilder.CreateBox(`cfBridgeWin_${ang}`, { width: 0.24, height: 1.0, depth: 1.6 }, scene), bx - 5.4 * Math.cos(ang), 30.8, 5.4 * Math.sin(ang), 0, -ang);
  }
  // Searchlight platforms on bridge wings
  for (const sz of [-9.2, 9.2]) {
    put(darkHullParts, B.MeshBuilder.CreateCylinder(`cfSlPod_${sz}`, { diameter: 2.6, height: 1.0, tessellation: 10 }, scene), bx - 1.0, 34.4, sz);
    put(brassParts, B.MeshBuilder.CreateCylinder(`cfSlDrum_${sz}`, { diameter: 1.35, height: 1.6, tessellation: 10 }, scene), bx - 1.8, 35.4, sz, 0, 0, Math.PI * 0.5);
    put(glowParts, B.MeshBuilder.CreateDisc(`cfSlLens_${sz}`, { radius: 0.6, tessellation: 8 }, scene), bx - 2.65, 35.4, sz, 0, -Math.PI * 0.5, 0);
  }

  // Graceful 1930s Tapered Tripod Foremast rising to y = 60m with spotting top, yardarms & rigging!
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastMain', { diameterTop: 0.38, diameterBottom: 1.45, height: 22.5, tessellation: 10 }, scene), bx, 49.5, bz);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastLegL', { diameterTop: 0.28, diameterBottom: 0.72, height: 18.0, tessellation: 8 }, scene), bx + 3.4, 46.2, -2.6, -0.18, 0, 0.24);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfMastLegR', { diameterTop: 0.28, diameterBottom: 0.72, height: 18.0, tessellation: 8 }, scene), bx + 3.4, 46.2,  2.6,  0.18, 0, 0.24);
  put(hullParts, B.MeshBuilder.CreateCylinder('cfSpottingTop', { diameterTop: 5.2, diameterBottom: 4.4, height: 2.0, tessellation: 12 }, scene), bx, 47.4, bz, 0, 0, 0, 0.85, 1.0, 1.15);
  put(darkParts, B.MeshBuilder.CreateBox('cfYardMain', { width: 0.28, height: 0.28, depth: 18.5 }, scene), bx, 53.0, bz);
  put(darkParts, B.MeshBuilder.CreateBox('cfYardUpper', { width: 0.20, height: 0.20, depth: 11.5 }, scene), bx, 56.8, bz);

  // TWO Sleek Oval 1930s Raked Cruiser Funnels (elliptical cross-section, vertical steam pipes, crimson bands, black caps!)
  for (const [fx, fz] of [[-41.0, -16.8], [-29.5, -16.8]]) {
    put(hullParts, B.MeshBuilder.CreateCylinder(`cfFunnel_${fx}`, { diameterTop: 4.4, diameterBottom: 5.2, height: 15.2, tessellation: 16 }, scene), fx, 28.6, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfFunnelCap_${fx}`, { diameterTop: 4.7, diameterBottom: 4.45, height: 2.4, tessellation: 16 }, scene), fx + 1.4, 36.2, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    put(crimsonParts, B.MeshBuilder.CreateCylinder(`cfFunnelRed_${fx}`, { diameterTop: 4.65, diameterBottom: 4.82, height: 2.2, tessellation: 16 }, scene), fx + 0.7, 32.8, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfFunnelRing_${fx}`, { diameter: 4.85, thickness: 0.18, tessellation: 16 }, scene), fx + 0.5, 31.6, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    // Vertical brass steam siren pipe along front of each funnel
    put(brassParts, B.MeshBuilder.CreateCylinder(`cfSteamPipe_${fx}`, { diameter: 0.34, height: 13.5, tessellation: 8 }, scene), fx - 2.9, 28.4, fz, 0, 0, -0.18);
  }

  mergeKit(hullParts, 'cfSuperstructureHull', parent, mats.hull, shadowGen);
  mergeKit(darkHullParts, 'cfSuperstructureArmor', parent, mats.hullDark, shadowGen);
  mergeKit(darkParts, 'cfSuperstructureDark', parent, mats.darkSteel, null);
  mergeKit(crimsonParts, 'cfSuperstructureCrimson', parent, mats.crimson, null);
  mergeKit(brassParts, 'cfSuperstructureBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfSuperstructureGlow', parent, mats.amberGlow, null);
  mergeKit(deckParts, 'cfSuperstructureDeck', parent, mats.deckWood, shadowGen);
}

function hullDarkPartsSafe(arr) { return arr; }

/**
 * Module 4: Wide, Unobstructed 28m x 82m Aft Flight Deck (x = +2..+84, y = 3.32 flush with runway!),
 * cantilevered carrier stern overhang (ZERO stern rocket nozzles!), lifeboats & deck cranes.
 */
function buildWideAftFlightDeck(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const deckParts = [], hullParts = [], darkParts = [], whiteParts = [], brassParts = [], crimsonParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  // Wide 28m x 82m flush teak-and-steel carrier flight deck extending cleanly over the stern (x = +2..+84)
  // Sits at y = 2.62 (top = 3.32) — 6cm below vagCarrierRunway top (3.38) so zero z-fighting with centerline & runway markings!
  put(deckParts, B.MeshBuilder.CreateBox('cfWideFlightDeck', { width: 82.0, height: 1.4, depth: 28.0 }, scene), 43.0, 2.62, 0.0);
  // Crisp white carrier deck-edge safety stripes along both flanks of the 28m flight deck
  for (const side of [-1, 1]) {
    put(whiteParts, B.MeshBuilder.CreateBox(`cfDeckEdgeLine_${side}`, { width: 80.0, height: 0.08, depth: 0.48 }, scene), 43.0, 3.34, side * 12.8);
    // Outboard recessed catwalk gallery & steel safety coaming along the 28m deck edge (never obstructs wings!)
    put(darkParts, B.MeshBuilder.CreateBox(`cfCatwalkFloor_${side}`, { width: 78.0, height: 0.35, depth: 1.9 }, scene), 43.0, 2.25, side * 14.9);
    put(brassParts, B.MeshBuilder.CreateBox(`cfCatwalkRail_${side}`, { width: 78.0, height: 0.22, depth: 0.16 }, scene), 43.0, 2.95, side * 15.8);
    // Diagonal steel cantilever girders supporting the wide flight deck overhang cleanly into the cruiser hull
    for (let gx = 10; gx <= 76; gx += 11) {
      put(darkParts, B.MeshBuilder.CreateBox(`cfDeckGirder_${side}_${gx}`, { width: 0.85, height: 1.0, depth: 7.5 }, scene), gx, 0.6, side * 11.2, side * 0.45);
    }
    // Lifeboats on curved davits along the midships upper waist (outboard of construction deck)
    for (const lx of [-44, -34, -20]) {
      put(whiteParts, B.MeshBuilder.CreateSphere(`cfBoat_${side}_${lx}`, { diameterX: 6.2, diameterY: 1.8, diameterZ: 2.2, segments: 8 }, scene), lx, 22.8, side * 21.0);
      for (const dx of [-2.4, 2.4]) {
        put(darkParts, B.MeshBuilder.CreateCylinder(`cfDavit_${side}_${lx}_${dx}`, { diameter: 0.22, height: 3.4, tessellation: 6 }, scene), lx + dx, 22.6, side * 20.2, side * 0.28);
      }
    }
    // 1930s cowl ventilators on upper deck flanks
    for (const vx of [-48, -10]) {
      put(brassParts, B.MeshBuilder.CreateCylinder(`cfVentPipe_${side}_${vx}`, { diameter: 0.72, height: 2.5, tessellation: 8 }, scene), vx, 22.8, side * 18.8);
      put(crimsonParts, B.MeshBuilder.CreateSphere(`cfVentCowl_${side}_${vx}`, { diameter: 1.35, segments: 8 }, scene), vx, 24.0, side * 18.8);
    }
  }
  // Clean squared-off 1930s carrier stern overhang transom + transverse under-deck stern beam (ZERO rocket nozzles!)
  put(hullParts, B.MeshBuilder.CreateBox('cfSternOverhangBeam', { width: 2.4, height: 2.6, depth: 27.6 }, scene), 83.0, 1.9, 0.0);
  put(whiteParts, B.MeshBuilder.CreateBox('cfSternThresholdLine', { width: 1.2, height: 0.08, depth: 25.6 }, scene), 81.8, 3.34, 0.0);
  // Extra cross-deck arrestor wires on the extended 82m aft landing zone
  for (const ax of [58, 66, 74]) {
    put(darkParts, B.MeshBuilder.CreateCylinder(`cfAftWire_${ax}`, { diameter: 0.11, height: 25.0, tessellation: 6 }, scene), ax, 3.36, 0.0, Math.PI * 0.5);
  }

  mergeKit(deckParts, 'cfWideFlightDeckMesh', parent, mats.deckWood, shadowGen);
  mergeKit(hullParts, 'cfSternOverhangMesh', parent, mats.hull, shadowGen);
  mergeKit(darkParts, 'cfFlightDeckGirders', parent, mats.darkSteel, null);
  mergeKit(whiteParts, 'cfFlightDeckMarkings', parent, mats.white, null);
  mergeKit(brassParts, 'cfFlightDeckBrass', parent, mats.brass, null);
  mergeKit(crimsonParts, 'cfFlightDeckVents', parent, mats.crimson, null);
}

/**
 * Module 5: Recessed Armored Under-Hull Levitation / Anti-Gravity Units (strictly beneath the keel).
 */
function buildAntigravKeelPods(scene, parent, mats) {
  const B = BABYLON;
  const darkParts = [], glowParts = [], brassParts = [];
  const put = (arr, m, x, y, z, rx = 0) => { m.position.set(x, y, z); m.rotation.x = rx; arr.push(m); };

  // 5 recessed armored anti-gravity thruster bays along the 234m cruiser keel
  const pods = [
    { x: -108, w: 12.0, z: 5.4, y: -11.4 },
    { x:  -68, w: 15.0, z: 8.6, y: -13.2 },
    { x:  -24, w: 16.5, z: 9.8, y: -13.6 },
    { x:   18, w: 14.5, z: 8.2, y: -12.4 },
    { x:   54, w: 12.0, z: 5.8, y: -9.4 },
  ];
  for (const p of pods) {
    put(darkParts, B.MeshBuilder.CreateBox(`cfAgPod_${p.x}`, { width: p.w, height: 2.5, depth: p.z * 2 }, scene), p.x, p.y, 0);
    put(brassParts, B.MeshBuilder.CreateBox(`cfAgRim_${p.x}`, { width: p.w + 0.5, height: 0.36, depth: p.z * 2 + 0.4 }, scene), p.x, p.y + 1.15, 0);
    // Downward-facing levitation emitter core ring visible from below
    put(glowParts, B.MeshBuilder.CreateCylinder(`cfAgCore_${p.x}`, { diameter: Math.min(p.w * 0.72, p.z * 1.45), height: 0.3, tessellation: 14 }, scene), p.x, p.y - 1.32, 0);
    for (const side of [-1, 1]) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfAgGlow_${p.x}_${side}`, { width: p.w * 0.78, height: 1.15, depth: 0.28 }, scene), p.x, p.y - 0.1, side * (p.z + 0.08));
      for (let lx = -p.w * 0.32; lx <= p.w * 0.33; lx += p.w * 0.16) {
        put(darkParts, B.MeshBuilder.CreateBox(`cfAgLouver_${p.x}_${side}_${lx}`, { width: 0.34, height: 1.45, depth: 0.42 }, scene), p.x + lx, p.y - 0.1, side * (p.z + 0.16));
      }
    }
  }
  mergeKit(darkParts, 'cfAntigravPods', parent, mats.darkSteel, null);
  mergeKit(brassParts, 'cfAntigravBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfAntigravGlow', parent, mats.amberGlow, null);
}

/**
 * Builds all 5 modular subsystems of the 234-meter 1930s Flight-Deck Cruiser (CF) «Бродяга».
 */
export function buildFlightDeckCruiserModel(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  const mats = createCruiserMaterials(scene);
  buildCruiserHull(scene, asteroidBase.group, mats, shadowGen);
  buildMainBatteryTurrets(scene, asteroidBase.group, mats, shadowGen);
  buildMidshipsSuperstructure(scene, asteroidBase.group, mats, shadowGen);
  buildWideAftFlightDeck(scene, asteroidBase.group, mats, shadowGen);
  buildAntigravKeelPods(scene, asteroidBase.group, mats);
  return { hullMat: mats.hull };
}
