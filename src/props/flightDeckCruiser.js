import { mountServiceEnsign } from './serviceEnsign.js';
import { fieldRepairTexture } from './repairTexture.js';
/**
 * Authentic 235-Meter 1930s Interbellum Flight-Deck Cruiser (CF) «Бродяга».
 * Modular naval architecture:
 *   1. Separate weathered steel surfaces for hull plating and deck panels.
 *   2. Lofted 235m cruiser hull: flared clipper bow (-X = -152) -> wide flat 28m x 82m stern flight deck (+X = +82).
 *   3. Three large sculpted superfiring triple-barrel 6-inch cruiser turrets (A, B, C) forward.
 *   4. Sculpted 1930s curved/faceted cruiser bridge, wrap-around wings, tripod foremast with rigging,
 *      and twin oval raked funnels with steam pipes & crimson bands.
 *   5. Clean cantilevered carrier stern overhang (zero stern rocket nozzles) + recessed keel levitation bays.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function textureRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/**
 * Generates color, normal and roughness/metalness maps for naval steel
 * with riveted horizontal strakes, vertical butt joints, and subtle sea-weathering (Babylon.js 8 PBR).
 */
function createNavalHullTextures(scene, deck = false) {
  const prefix = deck ? 'cfDeckPlate' : 'cfNavalHull';
  const albedo = new BABYLON.DynamicTexture(prefix + 'Albedo', { width: 512, height: 512 }, scene, true);
  const normal = new BABYLON.DynamicTexture(prefix + 'Normal', { width: 512, height: 512 }, scene, true);
  const surface = new BABYLON.DynamicTexture(prefix + 'Surface', { width: 512, height: 512 }, scene, true);
  normal.gammaSpace = surface.gammaSpace = false;
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();
  const surfaceCtx = surface.getContext();
  const random = textureRandom(deck ? 1941 : 1931);
  surfaceCtx.fillStyle = deck ? 'rgb(255,198,108)' : 'rgb(255,205,24)';
  surfaceCtx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#9ea7ae';
  ctx.fillRect(0, 0, 512, 512);
  // Neutral tangent-space normal (128, 128, 255)
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, 512, 512);

  const rows = deck ? 3 : 6;
  const rowH = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const shade = (deck ? 111 : 198) + ((r * 17) % 14) - 7;
    ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 11})`;
    ctx.fillRect(0, r * rowH, 512, rowH);
    // Horizontal strake seam (albedo + real 3D normal bevel!)
    ctx.fillStyle = 'rgba(38, 44, 50, 0.42)';
    ctx.fillRect(0, r * rowH, 512, 2);
    ctx.fillStyle = 'rgba(240, 244, 248, 0.24)';
    ctx.fillRect(0, r * rowH + 2, 512, 1);
    nCtx.fillStyle = deck ? 'rgb(128,112,254)' : 'rgb(128,98,249)';
    nCtx.fillRect(0, r * rowH, 512, 2);
    nCtx.fillStyle = deck ? 'rgb(128,145,254)' : 'rgb(128,158,249)';
    nCtx.fillRect(0, r * rowH + 2, 512, 2);

    // Staggered vertical butt-joints, rivets & rain streaks
    const cols = deck ? 2 : 4;
    const colW = 512 / cols;
    const off = (r % 2) * (colW * 0.5);
    for (let c = 0; c < cols; c++) {
      const vx = (c * colW + off) % 512;
      const plateShade = 0.025 + random() * 0.18;
      ctx.fillStyle = `rgba(24,37,50,${plateShade})`;
      ctx.fillRect(vx, r * rowH, colW, rowH);
      if (vx + colW > 512) ctx.fillRect(0, r * rowH, vx + colW - 512, rowH);
      ctx.fillStyle = 'rgba(42, 48, 54, 0.34)';
      ctx.fillRect(vx, r * rowH, 2, rowH);
      nCtx.fillStyle = 'rgb(84, 128, 240)';
      nCtx.fillRect(vx, r * rowH, 2, rowH);
      nCtx.fillStyle = 'rgb(172, 128, 240)';
      nCtx.fillRect(vx + 2, r * rowH, 2, rowH);
      // Subtle rivet dots along plate edge
      for (let ry = 8; ry < rowH - 4; ry += 12) {
        ctx.fillStyle = '#505a63';
        ctx.fillRect(vx + 5, r * rowH + ry, 3, 3);
        ctx.fillStyle = '#b3b9bb';
        ctx.fillRect(vx + 5, r * rowH + ry, 2, 1);
      }
      const grad = ctx.createLinearGradient(0, r * rowH, 0, r * rowH + rowH * 0.78);
      grad.addColorStop(0, 'rgba(118, 62, 36, 0.46)');
      grad.addColorStop(1, 'rgba(65, 58, 52, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(vx + 2, r * rowH + 2, 5 + random() * 11, rowH * 0.78);
    }
  }
  // Layer broad worn regions with fine patches, so adjacent plates respond differently to light.
  for (let i = 0; i < 46; i++) {
    const x = random() * 512, y = random() * 512;
    const width = 8 + random() * 37, height = 4 + random() * (deck ? 20 : 42);
    const patina = ctx.createRadialGradient(x,y,1,x,y,Math.max(width,height));
    patina.addColorStop(0, i % 3 === 0 ? 'rgba(82,49,29,.27)' : 'rgba(40,45,50,.25)');
    patina.addColorStop(1, 'rgba(45,46,47,0)');
    ctx.fillStyle = patina;
    ctx.fillRect(x-width, y-height, width*2, height*2);
  }
  // Chips are clustered along panel joints, with exposed steel and an oxide edge.
  for (let i = 0; i < 86; i++) {
    const y = Math.floor(random() * rows) * rowH + 3 + random() * 9;
    const x = random() * 512;
    const width = 2 + random() ** 2 * 19;
    ctx.fillStyle = 'rgba(65,43,34,.63)';
    ctx.fillRect(x, y, width, 2 + random() * 3);
    ctx.fillStyle = 'rgba(181,175,155,.64)';
    ctx.fillRect(x + 1, y + 1, width * .68, 1.3);
    surfaceCtx.fillStyle = 'rgb(255,154,177)';
    surfaceCtx.fillRect(x + 1, y + 1, width * .68, 1.3);
  }
  // Sparse scuffs expose the steel. The same strokes carry lower roughness and higher metalness.
  for (let i = 0; i < 580; i++) {
    const x = random() * 512, y = random() * 512, width = 1 + random() ** 3 * 12;
    ctx.fillStyle = i % 3 ? 'rgba(202,207,211,0.24)' : 'rgba(37,40,45,0.20)';
    ctx.fillRect(x, y, width, 1);
    surfaceCtx.fillStyle = i % 3 ? 'rgb(255,135,180)' : 'rgb(255,230,16)';
    surfaceCtx.fillRect(x, y, width, 1);
  }
  albedo.update();
  normal.update();
  surface.update();
  albedo.uScale = normal.uScale = surface.uScale = deck ? 1 : 1.2;
  for (const tex of [albedo,normal,surface]) tex.wrapU=tex.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;
  if (deck) albedo.coordinatesIndex = normal.coordinatesIndex = surface.coordinatesIndex = 1;
  albedo.anisotropicFilteringLevel = normal.anisotropicFilteringLevel = 8;
  return { albedo, normal, surface };
}

export function createLoftedHull(scene, name, stations, mats, parent, shadowGen = null, { decorate = true, bowRake = decorate ? 9.5 : 0 } = {}) {
  const B = BABYLON;
  const positions = [];
  const steel = [], oxide = [], stripe = [], foredeck = [];
  const uvs = [], deckUvs = [];
  const ringPts = 13;
  const xMin = stations[0].x;
  const xSpan = Math.max(1, stations[stations.length - 1].x - xMin);

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const u = ((s.x - xMin) / xSpan) * 6.0;
    // Flared topsides, a rounded turn of bilge and a narrow keel.
    const side = [
      [s.yTop, s.halfBeamTop],
      [s.yMid + (s.yTop - s.yMid) * .57, s.halfBeamMid + (s.halfBeamTop - s.halfBeamMid) * .43],
      [s.yMid, s.halfBeamMid],
      [s.yMid + (s.yKeel - s.yMid) * .41, s.halfBeamMid * .84 + s.halfBeamKeel * .16],
      [s.yMid + (s.yKeel - s.yMid) * .74, s.halfBeamMid * .48 + s.halfBeamKeel * .52],
      [s.yKeel + .75, s.halfBeamKeel * .69],
    ];
    const section = [...side, [s.yKeel, 0], ...side.slice().reverse().map(([y,z]) => [y,-z])];
    const pts = section.map(([y,z]) => {
      const depth = (s.yTop - y) / (s.yTop - s.yKeel);
      const rake = i === 0 ? bowRake * depth : 0;
      const stern = decorate && i === stations.length - 1 ? 6.4 * depth : 0;
      return [s.x + rake - stern, y, z];
    });
    for (let j = 0; j < ringPts; j++) {
      positions.push(pts[j][0], pts[j][1], pts[j][2]);
      uvs.push(u, (j / (ringPts - 1)) * 1.4);
      deckUvs.push(pts[j][0] / 6.4, pts[j][2] / 6.4);
    }
  }

  for (let i = 0; i < stations.length - 1; i++) {
    const rowA = i * ringPts;
    const rowB = (i + 1) * ringPts;
    for (let j = 0; j < ringPts - 1; j++) {
      const a = rowA + j, b = rowB + j, c = rowB + j + 1, d = rowA + j + 1;
      const middleX = (stations[i].x + stations[i + 1].x) * 0.5;
      const lowerBelt = j >= 3 && j < ringPts - 4;
      const band = decorate && middleX >= -128 && middleX < -120;
      const paintedRed = middleX >= -126 && middleX < -122;
      const faces = lowerBelt || (band && paintedRed) ? oxide : band ? stripe : steel;
      faces.push(a, b, d, b, c, d);
    }
  }

  // A plate edge is a hard crease. Keep the top normals independent of the flared shell.
  const deckStart = positions.length / 3;
  for (let i = 0; i < stations.length; i++) {
    for (const j of [0, ringPts - 1]) {
      const v = i * ringPts + j;
      positions.push(...positions.slice(v*3,v*3+3));
      uvs.push(deckUvs[v*2],deckUvs[v*2+1]);
      deckUvs.push(deckUvs[v*2],deckUvs[v*2+1]);
    }
  }
  for (let i = 0; i < stations.length - 1; i++) {
    const a = deckStart + i*2;
    const faces = decorate && stations[i + 1].x <= -64 ? foredeck : steel;
    faces.push(a,a+1,a+2, a+2,a+1,a+3);
  }

  // End seals share the skin's section edges and carry the same lower belt.
  for (const end of [0, stations.length - 1]) {
    const station = stations[end];
    const row = end * ringPts;
    const center = positions.length / 3;
    positions.push(station.x + (end === 0 ? bowRake / 2 : decorate ? -3.2 : 0), (station.yTop + station.yKeel) * 0.5, 0);
    uvs.push(end === 0 ? 0 : 6, 0.5);
    deckUvs.push(station.x / 6.4, 0);
    for (let j = 0; j < ringPts; j++) {
      const a = row + j, b = row + (j + 1) % ringPts;
      const faces = j >= 3 && j < ringPts - 4 ? oxide : steel;
      if (end === 0) faces.push(center, a, b);
      else faces.push(center, b, a);
    }
  }
  const indices = [...steel, ...oxide, ...stripe, ...foredeck];

  const normals = [];
  B.VertexData.ComputeNormals(positions, indices, normals);
  const vd = new B.VertexData();
  vd.positions = positions;
  vd.indices = indices;
  vd.normals = normals;
  vd.uvs = uvs;
  vd.uvs2 = deckUvs;

  const mesh = new B.Mesh(name, scene);
  vd.applyToMesh(mesh);
  mesh.parent = parent;
  const paint = new B.MultiMaterial(`${name}Paint`, scene);
  paint.subMaterials.push(mats.hull, mats.crimson, mats.white, mats.deckSteel);
  mesh.material = paint;
  mesh.releaseSubMeshes();
  let offset = 0;
  for (const [slot, faces] of [steel, oxide, stripe, foredeck].entries()) {
    if (faces.length) new B.SubMesh(slot, 0, positions.length / 3, offset, faces.length, mesh);
    offset += faces.length;
  }
  mesh.receiveShadows = true;
  mesh.isPickable = false;
  if (shadowGen) shadowGen.addShadowCaster(mesh, false);
  return mesh;
}

// Apply the same metre-scale steel plates to the runway, gallery and hangar floor.
export function applyCruiserDeckMaterial(mesh, material) {
  mesh.material = material;
  const positions = mesh.getVerticesData('position');
  const normals = mesh.getVerticesData('normal');
  const uvs = [];
  for (let i = 0; i < positions.length; i += 3) {
    const [x, y, z] = [positions[i], positions[i + 1], positions[i + 2]];
    const top = Math.abs(normals[i + 1]) > .5;
    const side = Math.abs(normals[i + 2]) > .5;
    uvs.push((top || side ? x : z) / 6.4, (top ? z : y) / 6.4);
  }
  mesh.setVerticesData('uv2', uvs);
}

function mergeKit(meshes, name, parent, material, shadowGen = null) {
  if (!meshes.length) return null;
  for (const m of meshes) m.computeWorldMatrix(true);
  const merged = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, false);
  if (!merged) return null;
  merged.name = name;
  merged.parent = parent;
  if (material.name === 'cfCruiserDeckSteelMat') applyCruiserDeckMaterial(merged, material);
  else merged.material = material;
  merged.receiveShadows = true;
  merged.isPickable = false;
  if (shadowGen) shadowGen.addShadowCaster(merged, false);
  return merged;
}

// A non-repeating port/starboard atlas. Red carries oxide, green carries soot
// and runoff, blue separates fresh repair panels from sun-bleached paint.
class CruiserServiceWear extends BABYLON.MaterialPluginBase {
  constructor(material,texture) {
    super(material,'CruiserServiceWear',216,{CF_SERVICE_WEAR:false},true);
    this.texture=texture;
    this._enable(true);
  }
  prepareDefines(defines,scene,mesh) {
    defines.CF_SERVICE_WEAR=!!mesh?.name.startsWith('cf') && !mesh.name.startsWith('cfTurret');
  }
  getSamplers(list) {list.push('cfWearAtlas');}
  bindForSubMesh(buffer) {buffer.setTexture('cfWearAtlas',this.texture);}
  getCustomCode(type) {
    if(type==='vertex') return {
      CUSTOM_VERTEX_DEFINITIONS:'#ifdef CF_SERVICE_WEAR\nvarying vec3 cfShipPoint;\n#endif',
      CUSTOM_VERTEX_MAIN_BEGIN:'#ifdef CF_SERVICE_WEAR\ncfShipPoint=position;\n#endif',
    };
    if(type!=='fragment')return null;
    return {
      CUSTOM_FRAGMENT_DEFINITIONS:'#ifdef CF_SERVICE_WEAR\nvarying vec3 cfShipPoint; uniform sampler2D cfWearAtlas; vec3 cfWear;\n#endif',
      CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
        #ifdef CF_SERVICE_WEAR
        vec2 wearUV=vec2((cfShipPoint.x+154.)/240.,1.-clamp((40.-cfShipPoint.y)/56.,.001,.999)*.5-step(0.,cfShipPoint.z)*.5);
        cfWear=texture2D(cfWearAtlas,wearUV).rgb;
        float oxidation=smoothstep(.14,.84,cfWear.r);
        vec3 rust=toLinearSpace(mix(vec3(.35,.17,.09),vec3(.70,.39,.18),cfWear.r));
        surfaceAlbedo=mix(surfaceAlbedo*.72,surfaceAlbedo*1.21+vec3(.015,.014,.011),cfWear.b);
        surfaceAlbedo=mix(surfaceAlbedo,rust,oxidation*.86);
        surfaceAlbedo*=1.-.82*cfWear.g;
        #endif`,
      CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS:`
        #ifdef CF_SERVICE_WEAR
        metallicRoughness.r*=1.-cfWear.r*.92;
        metallicRoughness.g=mix(metallicRoughness.g,.94,clamp(cfWear.r+cfWear.g*.42,0.,1.));
        #endif`,
    };
  }
}

export function createCruiserMaterials(scene) {
  const B = BABYLON;
  const isNull = scene.getEngine() instanceof B.NullEngine;

  const hull = new B.PBRMaterial('cfCruiserHullMat', scene);
  hull.albedoColor = c3('#405c78').toLinearSpace();
  hull.metallic = 0.12;
  hull.roughness = 0.83;
  hull.environmentIntensity = 0.80;

  const hullDark = new B.PBRMaterial('cfCruiserHullDarkMat', scene);
  hullDark.albedoColor = c3('#465266').toLinearSpace();
  hullDark.metallic = 0.15;
  hullDark.roughness = 0.82;
  hullDark.environmentIntensity = 0.75;

  const darkSteel = new B.PBRMaterial('cfCruiserDarkSteelMat', scene);
  darkSteel.albedoColor = c3('#3d454d');
  darkSteel.metallic = 0.62;
  darkSteel.roughness = 0.42;
  darkSteel.environmentIntensity = 0.72;

  const deckSteel = new B.PBRMaterial('cfCruiserDeckSteelMat', scene);
  deckSteel.albedoColor = c3('#d4d3cb').toLinearSpace();
  deckSteel.metallic = .38;
  deckSteel.roughness = .78;
  const boatWood = new B.PBRMaterial('cfBoatSeatWood', scene);
  boatWood.albedoColor = c3('#80644b').toLinearSpace();
  boatWood.metallic = 0;
  boatWood.roughness = .94;

  const crimson = new B.PBRMaterial('cfCruiserCrimsonMat', scene);
  crimson.albedoColor = c3('#ee5233').toLinearSpace();
  crimson.metallic = 0.06;
  crimson.roughness = 0.91;
  if (!isNull) {
    const applyPlates = (material, maps, metallic = 1) => {
      material.albedoTexture = maps.albedo;
      material.bumpTexture = maps.normal;
      material.metallicTexture = maps.surface;
      material.useRoughnessFromMetallicTextureAlpha = false;
      material.useRoughnessFromMetallicTextureGreen = true;
      material.useMetallnessFromMetallicTextureBlue = true;
      material.metallic = metallic;
      material.roughness = 1;
    };
    const plates = createNavalHullTextures(scene);
    plates.normal.level = .72;
    for (const material of [hull, hullDark]) applyPlates(material, plates);
    applyPlates(crimson, plates, .16);
    const deckPlates = createNavalHullTextures(scene, true);
    deckPlates.normal.level = .37;
    applyPlates(deckSteel, deckPlates);
  }

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

  return { hull, hullDark, darkSteel, deckSteel, boatWood, crimson, white, brass, amberGlow };
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
  // Add section boundaries for paint bands. Interpolation preserves the hull surface.
  const bowShoulder = hullStations[1], bowFlare = hullStations[2];
  const paintStations = [-128, -126, -122, -120].map(x => {
    const t = (x - bowShoulder.x) / (bowFlare.x - bowShoulder.x);
    return Object.fromEntries(Object.keys(bowShoulder).map(key => [
      key, key === 'x' ? x : bowShoulder[key] + t * (bowFlare[key] - bowShoulder[key]),
    ]));
  });
  hullStations.splice(2, 0, ...paintStations);
  const hull = createLoftedHull(scene, 'cfLoftedMainHull', hullStations, mats, parent, shadowGen);
  const hullWorld = hull.computeWorldMatrix(true);
  const toLocal = B.Matrix.Invert(hullWorld);

  const brassParts = [], darkParts = [], glowParts = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };

  const hullSide = (x, y, side) => {
    const origin = B.Vector3.TransformCoordinates(new B.Vector3(x, y, side * 36), hullWorld);
    const direction = B.Vector3.TransformNormal(new B.Vector3(0, 0, -side), hullWorld).normalize();
    const hit = new B.Ray(origin, direction, 36).intersectsMesh(hull);
    return hit.hit ? B.Vector3.TransformCoordinates(hit.pickedPoint, toLocal).z : null;
  };

  // Follow the flared bow with a segmented paint mask in hull coordinates.
  if (!(scene.getEngine() instanceof B.NullEngine)) {
    const patchParts=[];
    // Donor sheets sit on the sampled shell, including the bow flare.
    for(const [cx,cy,w,h,side,tile,tilt] of [
      [-110,1.6,7.8,2.7,-1,0,.10],[-103,.2,4.6,2.4,-1,3,-.04],
      [-55,1.3,6.8,3.6,-1,1,-.09],[23,-2.2,8.1,2.4,-1,3,.06],
      [-98,1.6,6.7,2.6,1,1,-.06],[-71,3.3,4.1,3.1,1,3,.13],[-5,-1.5,10,2.3,1,0,-.07],
    ]) {
      const positions=[],normals=[],uvs=[],indices=[];
      for(let j=0;j<=4;j++)for(let i=0;i<=8;i++) {
        const u=i/8,v=j/4,x=cx+(u-.5)*w,y=cy+(v-.5)*h+(u-.5)*w*tilt;
        const z=hullSide(x,y,side);
        if(z===null)continue;
        const ridge=tile===1 ? .16*(i%2) : 0;
        positions.push(x,y,z+side*(.14+ridge));
        uvs.push((tile%2+u)*.5,(1-Math.floor(tile/2)+v)*.5);
        if(i&&j){
          const k=j*9+i;
          if(side<0)indices.push(k-10,k-9,k,k-10,k,k-1);
          else indices.push(k-10,k,k-9,k-10,k-1,k);
        }
      }
      if(positions.length!==45*3)continue;
      B.VertexData.ComputeNormals(positions,indices,normals);
      if(tile===0) {
        // A strap from a different stock bridges the damaged edge of the donor sheet.
        const strap=[];
        for(let j=0;j<5;j++){
          const x=cx+w*(.29+j*.025), y=cy+h*(-.67+j*.33),z=hullSide(x,y,side);
          if(z===null)continue;
          strap.push(new B.Vector3(x,y,z+side*.20));
          if(j%2===0)put(brassParts,B.MeshBuilder.CreateCylinder('cfFieldWasher',{diameter:.24,height:.11,tessellation:6},scene),x,y,z+side*.32,Math.PI/2);
        }
        if(strap.length>1)darkParts.push(B.MeshBuilder.CreateTube('cfFieldFishplate',{path:strap,radius:.20,tessellation:4,cap:B.Mesh.CAP_ALL},scene));
      }
      const panel=new B.Mesh('cfRivetedDonorPanel',scene), vd=new B.VertexData();
      Object.assign(vd,{positions,normals,uvs,indices});vd.applyToMesh(panel);patchParts.push(panel);
    }
    const donor=new B.PBRMaterial('cfSalvagedPlate',scene);
    donor.albedoTexture=fieldRepairTexture(scene);donor.useAlphaFromAlbedoTexture=true;
    donor.transparencyMode=B.PBRMaterial.PBRMATERIAL_ALPHATEST;donor.backFaceCulling=false;
    donor.roughness=.76;donor.metallic=.30;
    mergeKit(patchParts,'cfHullRepairs',parent,donor);
    const lettering = new B.DynamicTexture('cfBowLettering',{width:768,height:128},scene,true);
    const ctx = lettering.getContext();
    ctx.fillStyle='#ead9aa';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='bold 88px Georgia, serif';ctx.fillText('БРОДЯГА',384,65);
    for(let i=0;i<3;i++) {
      const w=74-i*16;
      for(const x of [76,692]) ctx.fillRect(x-w/2,47+i*12,w,4);
    }
    // Compass rose between stepped wings on both bow nameplates.
    for(const x of [76,692]){
      ctx.fillStyle='#284b50';ctx.beginPath();ctx.arc(x,65,23,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#e4c88b';ctx.lineWidth=3;ctx.stroke();
      ctx.fillStyle='#eed9a7';ctx.beginPath();
      for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=i%2?5:18;
        const px=x+Math.sin(angle)*r,py=65-Math.cos(angle)*r;
        if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}
      ctx.closePath();ctx.fill();
    }
    const chip=textureRandom(1936);
    ctx.globalCompositeOperation='destination-out';
    for(let i=0;i<640;i++)ctx.fillRect(chip()*768,chip()*128,1+chip()**2*10,.7+chip()*2.2);
    ctx.globalCompositeOperation='source-over';
    lettering.update();lettering.hasAlpha=true;
    const enamel=new B.PBRMaterial('cfIvoryLetterPaint',scene);
    enamel.albedoTexture=lettering;enamel.useAlphaFromAlbedoTexture=true;
    enamel.transparencyMode=B.PBRMaterial.PBRMATERIAL_ALPHATEST;
    enamel.backFaceCulling=false;enamel.roughness=.84;enamel.metallic=0;
    const parts=[];
    for(const side of [-1,1]) {
      const points=[],uv=[],faces=[],n=[];
      for(let i=0;i<=12;i++) {
        const u=i/12,x=-103+(side>0?u:1-u)*24;
        for(const y of [1.85,5.02]) {
          const z=hullSide(x,y,side);
          points.push(x,y,z+side*.105);uv.push(u,(y-1.85)/3.17);
          n.push(0,.12,side*.993);
        }
        if(i) {const k=i*2;faces.push(k-2,k-1,k,k,k-1,k+1);}
      }
      const mesh=new B.Mesh('cfHullLetters',scene),vd=new B.VertexData();
      vd.positions=points;vd.uvs=uv;vd.indices=faces;vd.normals=n;vd.applyToMesh(mesh);parts.push(mesh);
    }
    mergeKit(parts,'cfBowName',parent,enamel);
  }
  // Recessed-looking glazing mounted on the actual side of the loft.
  for (const side of [-1, 1]) {
    // Half-round rubbing strake follows the sheer line through every station.
    const sheer = hullStations.slice(1,-1).map(st => {
      const y = st.yTop - .77;
      return new B.Vector3(st.x, y, hullSide(st.x,y,side) ?? side*st.halfBeamTop);
    });
    darkParts.push(B.MeshBuilder.CreateTube('cfSheerStrake', {path:sheer, radius:.21, tessellation:8}, scene));
    const hawseZ = hullSide(-136, 6.6, side);
    if (hawseZ !== null) {
      const z = hawseZ + side * .12;
      put(darkParts, B.MeshBuilder.CreateCylinder(`cfHawseWell_${side}`, { diameter: 1.44, height: .3, tessellation: 12 }, scene), -136, 6.6, z, Math.PI / 2);
      put(brassParts, B.MeshBuilder.CreateTorus(`cfHawseRim_${side}`, { diameter: 1.34, thickness: .17, tessellation: 12 }, scene), -136, 6.6, z + side * .12, Math.PI / 2);
      // Stowed stockless anchor. Follow the skin as the bow narrows towards the keel.
      const at = (dx, y) => {
        const x = -136 + dx;
        return new B.Vector3(x,y,(hullSide(x,y,side) ?? hawseZ) + side*.38);
      };
      for (const arm of [-1,1]) {
        const path = [at(0,2.7),at(arm*.85,2.8),at(arm*1.65,3.24),at(arm*2.05,4.02)];
        darkParts.push(B.MeshBuilder.CreateTube('cfAnchorPalm',{path,radius:.32,tessellation:7,cap:B.Mesh.CAP_ALL},scene));
      }
      darkParts.push(B.MeshBuilder.CreateTube('cfAnchorShank',{path:[at(0,2.65),at(.15,5.5),at(0,6.57)],radius:.30,tessellation:8},scene));
      for(let link=0;link<20;link++) {
        const t=link/19, x=-139+8.3*t, y=11.35-.56*t;
        const chain=B.MeshBuilder.CreateTorus('cfForedeckCable',{diameter:.54,thickness:.115,tessellation:10},scene);
        chain.scaling.x=1.52;chain.rotation.x=link%2?.96:.16;
        chain.position.set(x,y,side*(2.24-.44*t));darkParts.push(chain);
      }
      const drum = B.MeshBuilder.CreateLathe('cfAnchorWindlass',{shape:[[0,0],[.99,0],[1,.18],[.68,.35],[.68,1.05],[1,1.18],[.97,1.34],[0,1.34]].map(([r,h])=>new B.Vector3(r,h,0)),tessellation:16},scene);
      put(darkParts,drum,-130.4,10.68,side*1.8);

    }
    for (const [height, start, end] of [[5.8, -113, -65], [0.4, -37, 69]]) {
      for (let x = start; x <= end; x += 4.6) {
        const z = hullSide(x, height, side);
        if (z === null) continue;
        const name = `${side}_${height}_${x}`;
        put(darkParts, B.MeshBuilder.CreateCylinder(`cfPortRecess_${name}`, { diameter: 1.08, height: .34, tessellation: 12 }, scene), x, height, z, Math.PI / 2);
        put(brassParts, B.MeshBuilder.CreateTorus(`cfPortRim_${name}`, { diameter: .84, thickness: .11, tessellation: 10 }, scene), x, height, z + side * .18, Math.PI / 2);
        if (Math.round((x - start) / 4.6) % 4 !== 2) {
          put(glowParts, B.MeshBuilder.CreateCylinder(`cfPortGlass_${name}`, { diameter: .68, height: .10, tessellation: 10 }, scene), x, height, z + side * .16, Math.PI / 2);
        }
      }
    }
    const deckEdge = hullStations.filter(station => station.x >= -136 && station.x <= -64);
    for (const height of [.46, 1.02]) {
      const path = deckEdge.map(station => new B.Vector3(station.x, station.yTop + height, side * (station.halfBeamTop - .36)));
      darkParts.push(B.MeshBuilder.CreateTube(`cfForedeckRail_${side}_${height}`, { path, radius: .075, tessellation: 6, cap: B.Mesh.CAP_ALL }, scene));
    }
    for (let i = 1; i < deckEdge.length; i++) {
      const a = deckEdge[i - 1], b = deckEdge[i];
      const count = Math.ceil((b.x - a.x) / 3.5);
      for (let j = 0; j < count; j++) {
        const t = j / count;
        const x = a.x + (b.x - a.x) * t;
        const y = a.yTop + (b.yTop - a.yTop) * t;
        const z = side * (a.halfBeamTop + (b.halfBeamTop - a.halfBeamTop) * t - .36);
        put(darkParts, B.MeshBuilder.CreateCylinder(`cfForedeckStanchion_${side}_${i}_${j}`, { diameter: .17, height: 1.08, tessellation: 6 }, scene), x, y + .52, z);
      }
    }
  }
  put(brassParts, B.MeshBuilder.CreateCylinder('cfBowCapstan', { diameterTop: 1.5, diameterBottom: 2.0, height: 1.3, tessellation: 10 }, scene), -134, 11.0, 0);

  mergeKit(brassParts, 'cfHullBrassKit', parent, mats.brass, null);
  mergeKit(darkParts, 'cfHullFittings', parent, mats.darkSteel, null);
  mergeKit(glowParts, 'cfHullPortholes', parent, mats.amberGlow, null);
}

/**
 * Module 2: TWO Large Animation-Ready Superfiring Triple-Barrel 6-inch Cruiser Turrets (A, B).
 * Uses Babylon.js 8 Pivot-Before-Geometry hierarchy: yawPivot -> pitchPivot so turrets rotate & elevate live!
 */
function createGunhouse(scene, name) {
  const B = BABYLON;
  const outline = [[-6.1,-3.5],[-4.5,-4.85],[5.4,-4.85],[7,-3.5],[7,3.5],[5.4,4.85],[-4.5,4.85],[-6.1,3.5]];
  const sections = [
    { height: .16, scale: .91, shift: .12 },
    { height: .64, scale: 1, shift: 0 },
    { height: 3.15, scale: .98, shift: .16 },
    { height: 4.34, scale: .78, shift: .88 },
  ];
  const positions = [], indices = [], uvs = [], normals = [];
  const count = outline.length;
  for (const [row, section] of sections.entries()) {
    for (const [i, [x,z]] of outline.entries()) {
      positions.push(x * section.scale + section.shift, section.height, z * section.scale);
      uvs.push((x + 6.1) / 13.1, (z + 4.85) / 9.7);
      if (row === 0) continue;
      const a = (row - 1) * count + i;
      const b = (row - 1) * count + (i + 1) % count;
      indices.push(a, b, a + count, b, b + count, a + count);
    }
  }
  const top = (sections.length - 1) * count;
  for (let i = 1; i < count - 1; i++) indices.push(0, i + 1, i, top, top + i, top + i + 1);
  B.VertexData.ComputeNormals(positions, indices, normals);
  const mesh = new B.Mesh(name, scene);
  Object.assign(new B.VertexData(), { positions, indices, normals, uvs }).applyToMesh(mesh);
  return mesh.convertToFlatShadedMesh();
}

function buildMainBatteryTurrets(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const staticBarbParts = [], staticBrassParts = [];
  const turretHandles = [];

  const specs = [
    { id: 'A', x: -112, y: 10.6, elev: 0.11 },
    { id: 'B', x:  -84, y: 15.2, elev: 0.14 },
  ];
  for (const t of specs) {
    const barbH = t.y - 8.4;
    const barb = B.MeshBuilder.CreateCylinder(`cfBarb_${t.id}`, { diameter: 11.2, height: barbH, tessellation: 18 }, scene);
    barb.position.set(t.x, 8.4 + barbH * 0.5, 0); staticBarbParts.push(barb);
    const ring = B.MeshBuilder.CreateTorus(`cfBarbRing_${t.id}`, { diameter: 11.4, thickness: 0.36, tessellation: 20 }, scene);
    ring.position.set(t.x, t.y + 0.1, 0); staticBrassParts.push(ring);

    // 1. Yaw pivot at turret center
    const yawPivot = new B.TransformNode(`cfMainTurretYaw_${t.id}`, scene);
    yawPivot.parent = parent;
    yawPivot.position.set(t.x, t.y, 0);

    // Turret gunhouse geometry (merged per-turret under yawPivot so it rotates cleanly as 1 draw call!)
    const houseParts = [], armorParts = [], brassParts = [];
    const putLocal = (arr, m, lx, ly, lz, rx = 0, ry = 0, rz = 0) => { m.position.set(lx, ly, lz); m.rotation.set(rx, ry, rz); arr.push(m); };
    houseParts.push(createGunhouse(scene, `cfGunHouse_${t.id}`));
    putLocal(armorParts, B.MeshBuilder.CreateCylinder(`cfGunRF_${t.id}`, { diameter: 0.92, height: 12.2, tessellation: 10 }, scene), 3.6, 3.1, 0, Math.PI * 0.5, 0, 0);
    putLocal(brassParts, B.MeshBuilder.CreateBox(`cfGunSight_${t.id}`, { width: 1.4, height: 0.7, depth: 2.2 }, scene), -1.5, 4.8, 0);
    for (const bz of [-2.4, 0.0, 2.4]) {
      putLocal(armorParts, B.MeshBuilder.CreateSphere(`cfBlastBag_${t.id}_${bz}`, { diameterX: 2.4, diameterY: 1.6, diameterZ: 1.6, segments: 8 }, scene), -6.6, 2.5, bz);
    }
    mergeKit(houseParts, `cfTurretHouse_${t.id}`, yawPivot, mats.hull, shadowGen);
    mergeKit(armorParts, `cfTurretArmor_${t.id}`, yawPivot, mats.hullDark, shadowGen);
    mergeKit(brassParts, `cfTurretBrass_${t.id}`, yawPivot, mats.brass, null);

    // 2. Pitch pivot at trunnion axis (-6.6, 2.5, 0) for triple 19m barrels
    const pitchPivot = new B.TransformNode(`cfMainTurretPitch_${t.id}`, scene);
    pitchPivot.parent = yawPivot;
    pitchPivot.position.set(-6.6, 2.5, 0);
    pitchPivot.rotation.z = -t.elev;
    const barrelParts = [];
    for (const bz of [-2.4, 0.0, 2.4]) {
      putLocal(barrelParts, B.MeshBuilder.CreateCylinder(`cfSleeve_${t.id}_${bz}`, { diameter: 1.05, height: 4.8, tessellation: 10 }, scene), -2.2, 0, bz, 0, 0, Math.PI * 0.5);
      putLocal(barrelParts, B.MeshBuilder.CreateCylinder(`cfBarrel_${t.id}_${bz}`, { diameterTop: 0.42, diameterBottom: 0.68, height: 18.8, tessellation: 10 }, scene), -9.8, 0, bz, 0, 0, Math.PI * 0.5);
    }
    mergeKit(barrelParts, `cfTurretBarrels_${t.id}`, pitchPivot, mats.darkSteel, shadowGen);
    turretHandles.push({ id: t.id, yawPivot, pitchPivot, baseElev: t.elev });
  }

  mergeKit(staticBarbParts, 'cfMainBarbettesHull', parent, mats.hull, shadowGen);
  mergeKit(staticBrassParts, 'cfMainBarbettesBrass', parent, mats.brass, null);
  return turretHandles;
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
  // The widened starboard hangar replaces the old starboard waist. Its outer
  // shoulder is built by buildHangarOuterPlating, outside the two starboard bays.
  const side = -1;
  {
    // Lower waist hull strake matching forecastle height (only 8m tall instead of 18m!)
    put(hullParts, B.MeshBuilder.CreateBox(`cfWaistLower_${side}`, { width: 58.0, height: 8.2, depth: 3.6 }, scene), -27.0, 6.8, side * 18.2, side * -0.08);
    // Open waist promenade deck + brass safety railing at y = 11.0 (breaks up the side silhouette!)
    put(deckParts, B.MeshBuilder.CreateBox(`cfWaistWalk_${side}`, { width: 54.0, height: 0.45, depth: 4.8 }, scene), -26.0, 11.0, side * 16.68);
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
  // Tapered shoulders connect the forecastle with the sheltered midships deck.
  const shoulders = [
    { x:-67, halfBeamTop:9, halfBeamMid:11, halfBeamKeel:10, yTop:15.1, yMid:11.3, yKeel:8.9 },
    { x:-59, halfBeamTop:12, halfBeamMid:15, halfBeamKeel:13, yTop:21.1, yMid:14.5, yKeel:8.8 },
    { x:-49, halfBeamTop:16.4, halfBeamMid:17.5, halfBeamKeel:15, yTop:21.1, yMid:15, yKeel:8.8 },
  ];
  createLoftedHull(scene, 'cfForecastleShoulders', shoulders, { ...mats, crimson: mats.hullDark }, parent, shadowGen, { decorate: false });
  put(deckParts, B.MeshBuilder.CreateBox('cfUpperDeckMain', { width: 50, height: 0.65, depth: 33.4 }, scene), -24, 20.78, 0);
  put(darkHullParts, B.MeshBuilder.CreateBox('cfUpperRailL', { width: 54.2, height: 0.7, depth: 0.35 }, scene), -25.0, 21.6, -17.0);
  put(darkHullParts, B.MeshBuilder.CreateBox('cfUpperRailR', { width: 54.2, height: 0.7, depth: 0.35 }, scene), -25.0, 21.6,  17.0);

  // Sculpted 1930s US Navy Cruiser Conning Tower & Wrap-Around Compass Bridge (curved octagonal tiers, zero boxes!)
  const bx = -54.0, bz = 0.0;
  const bridgeIvory=[];
  // Base octagonal armored conning tower
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfConningBase', { diameterTop: 13.5, diameterBottom: 15.2, height: 6.4, tessellation: 8 }, scene), bx, 24.4, bz, 0, Math.PI / 8);
  // Wrap-around curved Admiral's Bridge & Compass Bridge decks with splinter shields
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfBridgeDeck1', { diameter: 16.5, height: 1.2, tessellation: 12 }, scene), bx - 1.2, 28.0, bz, 0, 0, 0, 0.82, 1.0, 1.28);
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfBridgeLowerBand', { diameterTop: 11.7, diameterBottom: 12.4, height: 1.45, tessellation: 12 }, scene), bx - .6, 29.25, bz);
  put(darkParts, B.MeshBuilder.CreateCylinder('cfBridgeGlazingRecess', { diameter: 10.7, height: 2.65, tessellation: 12 }, scene), bx - .6, 31.2, bz);
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfBridgeDeck2', { diameter: 12.6, height: 1.1, tessellation: 12 }, scene), bx - 1.0, 33.8, bz, 0, 0, 0, 0.80, 1.0, 1.35);
  // Open bridge wings with braced undersides and railings around each lookout.
  for (const flank of [-1,1]) {
    const outline=[[-3.9,6.3],[-3.45,10.8],[-1.35,12.0],[1.6,11.75],[2.8,10.3],[3.1,6.5]];
    const railPath=h=>outline.map(([x,z])=>new B.Vector3(bx+x,h,bz+flank*z));
    for (const [height,radius] of [[27.98,.28],[28.65,.07],[29.24,.105]]) {
      darkParts.push(B.MeshBuilder.CreateTube('cfBridgeWingRail',{path:railPath(height),radius,tessellation:6},scene));
    }
    const wing=B.MeshBuilder.CreateCylinder('cfBridgeLookout',{diameter:6.6,height:.48,tessellation:12},scene);
    put(hullParts,wing,bx-.22,27.93,flank*8.9,0,0,0,1,.99,1.01);
    for (const [x,z] of outline) put(darkParts,B.MeshBuilder.CreateCylinder('cfWingStanchion',{diameter:.15,height:1.26,tessellation:6},scene),bx+x,28.62,flank*z);
    for(const x of [-2.0,1.3]) darkHullParts.push(B.MeshBuilder.CreateTube('cfWingBracket',{path:[new B.Vector3(bx+x,24.4,flank*5.7),new B.Vector3(bx+x,27.79,flank*10.75)],radius:.24,tessellation:6},scene));
  }
  // Armored Fire-Control Director Tower atop the bridge
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfDirectorBase', { diameterTop: 5.8, diameterBottom: 7.4, height: 4.8, tessellation: 10 }, scene), bx, 36.6, bz);
  put(brassParts, B.MeshBuilder.CreateBox('cfDirectorRangefinder', { width: 1.0, height: 0.95, depth: 8.6 }, scene), bx - 0.6, 39.2, bz);
  // Individual panes sit within a continuous dark recess. Mullions and the canopy cast shadows.
  const panes = [], paneCount = 12, paneRadius = 5.6;
  for (let i = 0; i < paneCount; i++) {
    const angle = Math.PI * 2 * i / paneCount;
    const middle = angle + Math.PI / paneCount;
    put(darkHullParts, B.MeshBuilder.CreateBox(`cfBridgeMullion_${i}`, { width:.27, height:2.7, depth:.28 }, scene),
      bx - .6 + paneRadius * Math.cos(angle), 31.2, bz + paneRadius * Math.sin(angle), 0, -angle);
    const inset = paneRadius * Math.cos(Math.PI / paneCount) - .09;
    put(panes, B.MeshBuilder.CreateBox(`cfBridgePane_${i}`, { width:.08, height:1.87, depth:2.54 }, scene),
      bx - .6 + inset * Math.cos(middle), 31.2, bz + inset * Math.sin(middle), 0, -middle);
  }
  const glass = new B.PBRMaterial('cfBridgeGlass', scene);
  glass.albedoColor = c3('#648387').toLinearSpace();
  glass.emissiveColor = c3('#bd814c').toLinearSpace().scale(.075);
  if (!(scene.getEngine() instanceof B.NullEngine)) {
    const panesTex=new B.DynamicTexture('cfBridgeWindowReflection',{width:128,height:128},scene,true);
    const ctx=panesTex.getContext(), tint=ctx.createLinearGradient(0,0,0,128);
    tint.addColorStop(0,'#bed4cf');tint.addColorStop(.49,'#759aa1');
    tint.addColorStop(.53,'#455e66');tint.addColorStop(1,'#324a51');
    ctx.fillStyle=tint;ctx.fillRect(0,0,128,128);panesTex.update();glass.albedoTexture=panesTex;
  }
  glass.metallic = .34;
  glass.roughness = .31;
  mergeKit(panes, 'cfBridgePanoramicGlazing', parent, glass);
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
  put(bridgeIvory, B.MeshBuilder.CreateCylinder('cfSpottingTop', { diameterTop: 5.2, diameterBottom: 4.4, height: 2.0, tessellation: 12 }, scene), bx, 47.4, bz, 0, 0, 0, 0.85, 1.0, 1.15);
  put(darkParts, B.MeshBuilder.CreateBox('cfYardMain', { width: 0.28, height: 0.28, depth: 18.5 }, scene), bx, 53.0, bz);
  put(darkParts, B.MeshBuilder.CreateBox('cfYardUpper', { width: 0.20, height: 0.20, depth: 11.5 }, scene), bx, 56.8, bz);
  mountServiceEnsign(scene, parent, new B.Vector3(bx, 60.5, bz), 10.5, 3.5);
  // Sweeping naval wire rigging stays (Babylon.js CreateTube!) from foremast top to bow & bridge wings
  const riggingSpans = [
    [new B.Vector3(bx, 57.5, 0), new B.Vector3(-148, 12.2, 0)],
    [new B.Vector3(bx, 53.0, -8.8), new B.Vector3(-29.5, 36.0, -16.8)],
    [new B.Vector3(bx, 53.0,  8.8), new B.Vector3(-25.0, 22.0,  16.8)],
  ];
  riggingSpans.forEach(([a, b], rIdx) => {
    const mid = B.Vector3.Lerp(a, b, 0.5); mid.y -= 1.2;
    darkParts.push(B.MeshBuilder.CreateTube(`cfRigging_${rIdx}`, { path: [a, mid, b], radius: 0.085, tessellation: 6 }, scene));
  });

  // TWO Sleek Oval 1930s Raked Cruiser Funnels (elliptical cross-section, vertical steam pipes, crimson bands, black caps!)
  const jackets=[];
  for (const [fx, fz] of [[-41.0, -16.8], [-29.5, -16.8]]) {
    put(jackets, B.MeshBuilder.CreateCylinder(`cfFunnel_${fx}`, { diameterTop: 4.4, diameterBottom: 5.2, height: 15.2, tessellation: 16 }, scene), fx, 28.6, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    const lip = B.MeshBuilder.CreateLathe(`cfFunnelCap_${fx}`, {
      shape:[[2.23,-1.2],[2.37,.84],[2.44,1.12],[2.42,1.26],[2.10,1.26],[2.02,-.85]].map(([r,h])=>new B.Vector3(r,h,0)),
      tessellation:24,sideOrientation:B.Mesh.DOUBLESIDE,
    },scene);
    put(darkParts,lip,fx+1.4,36.2,fz,0,0,-.18,1.28,1,.82);
    for(const dx of [-1.32,0,1.32]) {
      const length=2*.82*Math.sqrt(2.1**2-(dx/1.28)**2);
      put(darkParts,B.MeshBuilder.CreateCylinder('cfFunnelGrate',{diameter:.16,height:length,tessellation:6},scene),
        fx+1.6+dx,37.30-dx*.18,fz,Math.PI/2);
    }
    put(crimsonParts, B.MeshBuilder.CreateCylinder(`cfFunnelRed_${fx}`, { diameterTop: 4.65, diameterBottom: 4.82, height: 2.2, tessellation: 16 }, scene), fx + 0.7, 32.8, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    put(brassParts, B.MeshBuilder.CreateTorus(`cfFunnelRing_${fx}`, { diameter: 4.85, thickness: 0.18, tessellation: 16 }, scene), fx + 0.5, 31.6, fz, 0, 0, -0.18, 1.28, 1.0, 0.82);
    // Vertical brass steam siren pipe along front of each funnel
    put(brassParts, B.MeshBuilder.CreateCylinder(`cfSteamPipe_${fx}`, { diameter: 0.34, height: 13.5, tessellation: 8 }, scene), fx - 2.9, 28.4, fz, 0, 0, -0.18);
  }

  const buff=new B.PBRMaterial('cfFunnelOchre',scene);
  buff.bumpTexture=mats.hull.bumpTexture;
  buff.metallic=.08;
  buff.roughness=.76;
  buff.albedoColor=c3('#f6b74e').toLinearSpace();
  mergeKit(bridgeIvory,'cfIvoryBridgeGalleries',parent,mats.white,shadowGen);
  mergeKit(jackets,'cfFunnelJackets',parent,buff,shadowGen);
  mergeKit(hullParts, 'cfSuperstructureHull', parent, mats.hull, shadowGen);
  mergeKit(darkHullParts, 'cfSuperstructureArmor', parent, mats.hullDark, shadowGen);
  mergeKit(darkParts, 'cfSuperstructureDark', parent, mats.darkSteel, null);
  mergeKit(crimsonParts, 'cfSuperstructureCrimson', parent, mats.crimson, null);
  mergeKit(brassParts, 'cfSuperstructureBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfSuperstructureGlow', parent, mats.amberGlow, null);
  mergeKit(deckParts, 'cfSuperstructureDeck', parent, mats.deckSteel, shadowGen);
}

function hullDarkPartsSafe(arr) { return arr; }

/**
 * Module 4: Wide, Unobstructed 28m x 82m Aft Flight Deck (x = +2..+84, y = 3.32 flush with runway!),
 * cantilevered carrier stern overhang (ZERO stern rocket nozzles!), lifeboats & deck cranes.
 */
function createShipBoat(scene, name) {
  const B = BABYLON;
  const plan = [[-3,0],[-2.2,-.67],[-.9,-1],[.8,-1.05],[2.45,-.77],[2.8,-.47],
    [2.8,.47],[2.45,.77],[.8,1.05],[-.9,1],[-2.2,.67]];
  const positions = [], indices = [], normals = [], uvs = [];
  const size = plan.length;
  // From the exterior bilge over the gunwale and down into the interior.
  for (const [row, [sx, sz, y]] of [[.78,.36,-.9],[.96,.84,-.46],[1,1,.18],[.97,.88,.18],[.74,.55,-.53]].entries()) {
    for (const [i, [x, z]] of plan.entries()) {
      positions.push(x * sx, y, z * sz);
      uvs.push((x + 3) / 5.8, row / 4);
      if (row === 0) continue;
      const a = (row - 1) * size + i;
      const b = (row - 1) * size + (i + 1) % size;
      indices.push(a, b, a + size, b, b + size, a + size);
    }
  }
  const inner = 4 * size;
  for (let i = 1; i < size - 1; i++) indices.push(0, i + 1, i, inner, inner + i, inner + i + 1);
  B.VertexData.ComputeNormals(positions, indices, normals);
  const boat = new B.Mesh(name, scene);
  Object.assign(new B.VertexData(), { positions, indices, normals, uvs }).applyToMesh(boat);
  return boat;
}

function buildWideAftFlightDeck(scene, parent, mats, shadowGen) {
  const B = BABYLON;
  const deckParts = [], hullParts = [], darkParts = [], whiteParts = [], brassParts = [], crimsonParts = [], boatSeats = [];
  const put = (arr, m, x, y, z, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); arr.push(m); };
  const strut = (name, a, b, radius) => {
    const start = B.Vector3.FromArray(a), end = B.Vector3.FromArray(b);
    darkParts.push(B.MeshBuilder.CreateTube(name, { path: [start,end], radius, tessellation: 6, cap: B.Mesh.CAP_ALL }, scene));
  };

  // Wide 28m x 82m flush teak-and-steel carrier flight deck extending cleanly over the stern (x = +2..+84)
  // Sits at y = 2.62 (top = 3.32) — 6cm below vagCarrierRunway top (3.38) so zero z-fighting with centerline & runway markings!
  put(deckParts, B.MeshBuilder.CreateBox('cfWideFlightDeck', { width: 82.0, height: 1.4, depth: 28.0 }, scene), 43.0, 2.62, 0.0);
  // Crisp white carrier deck-edge safety stripes along both flanks of the 28m flight deck
  for (const side of [-1, 1]) {
    put(whiteParts, B.MeshBuilder.CreateBox(`cfDeckEdgeLine_${side}`, { width: side < 0 ? 70 : 80, height: 0.08, depth: 0.48 }, scene), side < 0 ? 48 : 43, 3.34, side * 12.8);
    // Outboard recessed catwalk gallery & steel safety coaming along the 28m deck edge (never obstructs wings!)
    put(darkParts, B.MeshBuilder.CreateBox(`cfCatwalkFloor_${side}`, { width: 78.0, height: 0.35, depth: 1.9 }, scene), 43.0, 2.25, side * 14.9);
    put(brassParts, B.MeshBuilder.CreateBox(`cfCatwalkRail_${side}`, { width: 78.0, height: 0.22, depth: 0.16 }, scene), 43.0, 2.95, side * 15.8);
    // The aft gallery hangs from triangular knees rather than solid blocks.
    for (let x = 18; x <= 78; x += 6) {
      const joint = [x, 1.97, side * 15.68];
      strut(`cfGalleryKnee_${side}_${x}`, [x,-1.6,side * (15.4 - (x - 18) * .1)], joint, .23);
      strut(`cfGalleryOutrigger_${side}_${x}`, [x,1.97,side * 12.8], joint, .16);
      strut(`cfGalleryStanchion_${side}_${x}`, joint, [x,2.95,side * 15.8], .105);
    }
    // Open wooden boats with seats, suspended from paired curved davits.
    for (const x of [-44, -34, -20]) {
      const z = side * 20.5;
      put(whiteParts, createShipBoat(scene, `cfBoat_${side}_${x}`), x, 22.7, z);
      for (const seat of [-1.55, 0, 1.66]) {
        put(boatSeats, B.MeshBuilder.CreateBox(`cfBoatSeat_${side}_${x}_${seat}`, { width:.41, height:.11, depth:1.34 }, scene), x + seat, 22.67, z);
      }
      for (const dx of [-1.85, 1.85]) {
        const armX = x + dx;
        const path = [[armX,21.15,side*16.4],[armX,24,side*16.7],
          [armX,24.65,side*18.4],[armX,24.25,z]].map(coords => B.Vector3.FromArray(coords));
        darkParts.push(B.MeshBuilder.CreateTube(`cfDavit_${side}_${x}_${dx}`, { path, radius:.12, tessellation:8 }, scene));
        strut(`cfBoatFall_${side}_${x}_${dx}`, [armX,24.25,z], [armX,22.81,z], .036);
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

  mergeKit(deckParts, 'cfWideFlightDeckMesh', parent, mats.deckSteel, shadowGen);
  mergeKit(boatSeats, 'cfBoatThwarts', parent, mats.boatWood);
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
    // Fair the lift machinery into the curved keel. The raised shoulders enter
    // the shell and the lower shoe narrows around its emitter.
    const stations=[[-.65,.14,3.9],[-.50,.80,4.9],[-.37,1,5.1],[.37,1,5.1],[.50,.80,4.9],[.65,.14,3.9]];
    const rings=stations.map(([dx,beam,rise])=>[
      [-.63,rise],[-.91,1.55],[-1,.52],[-1,-.78],[-.74,-1.31],
      [.74,-1.31],[1,-.78],[1,.52],[.91,1.55],[.63,rise]
    ].map(([z,y])=>new B.Vector3(p.x+p.w*dx,p.y+y,z*p.z*beam)));
    darkParts.push(B.MeshBuilder.CreateRibbon('cfKeelFairing',{
      pathArray:rings,closePath:true,sideOrientation:B.Mesh.DOUBLESIDE,
    },scene));
    for(const ring of [rings[0],rings[rings.length-1]]) {
      const center=ring.reduce((sum,v)=>sum.addInPlace(v),B.Vector3.Zero()).scaleInPlace(1/ring.length);
      darkParts.push(B.MeshBuilder.CreateRibbon('cfKeelEnd',{pathArray:[ring,ring.map(()=>center)],closePath:true,sideOrientation:B.Mesh.DOUBLESIDE},scene));
    }
    for(const flank of [-1,1]) {
      const trim=stations.map(([dx,beam])=>new B.Vector3(p.x+p.w*dx,p.y+.59,flank*p.z*beam));
      brassParts.push(B.MeshBuilder.CreateTube('cfLiftTrim',{path:trim,radius:.12,tessellation:6},scene));
    }
    // Downward-facing levitation emitter core ring visible from below
    put(glowParts, B.MeshBuilder.CreateCylinder(`cfAgCore_${p.x}`, { diameter: Math.min(p.w * 0.72, p.z * 1.45), height: 0.3, tessellation: 14 }, scene), p.x, p.y - 1.32, 0);
    for (const side of [-1, 1]) {
      put(glowParts, B.MeshBuilder.CreateBox(`cfAgGlow_${p.x}_${side}`, { width: p.w * 0.78, height: 1.15, depth: 0.28 }, scene), p.x, p.y - 0.1, side * (p.z + 0.12));
      for (let lx = -p.w * 0.32; lx <= p.w * 0.33; lx += p.w * 0.16) {
        put(darkParts, B.MeshBuilder.CreateBox(`cfAgLouver_${p.x}_${side}_${lx}`, { width: 0.34, height: 1.45, depth: 0.42 }, scene), p.x + lx, p.y - 0.1, side * (p.z + 0.16));
      }
    }
  }
  mergeKit(darkParts, 'cfAntigravPods', parent, mats.darkSteel, null);
  mergeKit(brassParts, 'cfAntigravBrass', parent, mats.brass, null);
  mergeKit(glowParts, 'cfAntigravGlow', parent, mats.amberGlow, null);
}

// New outer plating around the existing hangar. The service stairs run along
// the port face; the wider starboard shoulder covers the offset second bay.
function buildHangarOuterPlating(scene, parent, mats) {
  const B = BABYLON;
  const portSections = [
    [-49, [8.8,9.8,11.5,12.4,13.5]],
    [-39, [10.76,10.82,10.83,10.74,10.38]],
    [ -6, [10.76,10.82,10.83,10.74,10.38]],
    [2.54, [10.75,10.78,10.78,10.68,10.2]],
    [5.18, [10.23,10.31,10.31,10.22,9.8]],
  ];
  const starboardSections = [
    [-62,[17.6,19.3,19.8,18.9,16.2]],
    [-51,[18.1,24.1,25.8,24.1,16.6]],
    [-43,[18.4,27.7,30.0,27.8,16.7]],
    [-39,[18.7,31.2,31.4,30.5,16.7]],
    [-22,[18.8,32.3,33.1,31.3,16.7]],
    [ -6,[18.5,31.8,32.4,30.9,16.7]],
    [3.38,[18.4,31.2,31.5,30.4,16.7]],
    [  10,[17.9,27.9,28.1,26.6,16.6]],
    [  18,[17.0,21.8,22.3,21.6,16.0]],
    [  24,[16.4,17.2,17.8,17.4,15.8]],
  ];
  // Beyond the working bay, the armour rolls down into the quarterdeck.
  const sectionY=(side,x,y)=>{
    if(side<0)return y;
    const shoulder=x>3.38?Math.min(1,(x-3.38)/20.62):Math.min(1,Math.max(0,(-39-x)/23));
    return y-(Math.max(0,y-2.8)*shoulder*.98);
  };
  const trim = [];
  for (const [side, sections, heights] of [
    [-1, portSections, [3.25,6.5,15.33,16.85,21.09]],
    [ 1, starboardSections, [-2.25,3.30,14.99,17.0,21.09]],
  ]) {
    const positions = [], uvs = [], normals = [], indices = [];
    const rows = heights.length;
    for (const [section, [x, widths]] of sections.entries()) {
      for (const [row, y] of heights.entries()) {
        positions.push(x, sectionY(side,x,y), side * widths[row]);
        uvs.push((x + 54) / 28, row * .26);
        if (section === 0 || row === 0) continue;
        const a = (section - 1) * rows + row - 1, b = a + rows;
        if (side === 1) indices.push(a, a + 1, b, b, a + 1, b + 1);
        else indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    B.VertexData.ComputeNormals(positions, indices, normals);
    const skin = new B.Mesh(side < 0 ? 'cfHangarPortArmor' : 'cfHangarStarboardArmor', scene);
    Object.assign(new B.VertexData(), { positions, indices, normals, uvs }).applyToMesh(skin);
    skin.parent = parent;
    skin.material = mats.hull;
    skin.isPickable = false;
    skin.receiveShadows = true;
    skin.metadata = { visualOnly: true };

    // Close the two tapered ends above the outer runway coaming.
    if(side>0){
      for(const run of [sections.slice(0,4),sections.slice(-4)]){
        const top=run.map(([x,w])=>new B.Vector3(x,sectionY(side,x,heights[4]),w[4]));
        const inboard=top.map(p=>new B.Vector3(p.x,2.48,15.78));
        trim.push(B.MeshBuilder.CreateRibbon('cfShoulderInboard',{pathArray:[top,inboard],sideOrientation:B.Mesh.DOUBLESIDE},scene));
      }
    }
    const strakeRow = side < 0 ? 3 : 2;
    const path = sections.map(([x, widths]) => new B.Vector3(x, sectionY(side,x,heights[strakeRow]), side * (widths[strakeRow] + .10)));
    trim.push(B.MeshBuilder.CreateTube(`cfHangarStrake_${side}`, { path, radius:.14, tessellation:6 }, scene));
  }

  // Flush longitudinal rubbing strake and screened vents follow the curved skin.
  const vents=[];
  for(let i=1;i<starboardSections.length;i++){
    const [x,w]=starboardSections[i], [prev,pw]=starboardSections[i-1];
    const rim=(x,w,y)=>new B.Vector3(x,sectionY(1,x,y),w[1]+(w[2]-w[1])*(y-3.30)/11.69+.12);
    trim.push(B.MeshBuilder.CreateTube('cfShoulderBelt',{path:[rim(prev,pw,6.9),rim(x,w,6.9)],radius:.18,tessellation:6},scene));
    if(prev < -39 || x>3.38)continue;
    for(const t of [.22,.54,.86]){
      const px=prev+(x-prev)*t;
      const width=pw.map((v,j)=>v+(w[j]-v)*t);
      const grille=B.MeshBuilder.CreateCylinder('cfShoulderVent',{height:.22,diameter:1,tessellation:12},scene);
      grille.scaling.set(2.1,1,1.05);grille.rotation.x=Math.PI/2;
      grille.position.copyFrom(rim(px,width,11.9));vents.push(grille);
    }
  }
  mergeKit(vents,'cfShoulderVents',parent,mats.darkSteel);
  const portal = B.MeshBuilder.CreateBox('cfHangarHeaderFace', { width:.12, height:1.38, depth:22.8 }, scene);
  portal.position.set(5.27,16.01,.58);
  trim.push(portal);
  const trimMesh = mergeKit(trim, 'cfHangarArmorReturns', parent, mats.hullDark);
  if (trimMesh) trimMesh.metadata = { visualOnly: true };
}

/**
 * Builds all 5 modular subsystems of the 234-meter 1930s Flight-Deck Cruiser (CF) «Бродяга».
 */
export function buildFlightDeckCruiserModel(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase?.group || !scene) return null;
  asteroidBase.pilotHeadingOffset = -Math.PI / 2; // The cruiser bow faces local −X.
  const mats = createCruiserMaterials(scene);
  buildCruiserHull(scene, asteroidBase.group, mats, shadowGen);
  asteroidBase.mainTurrets = buildMainBatteryTurrets(scene, asteroidBase.group, mats, shadowGen);
  buildMidshipsSuperstructure(scene, asteroidBase.group, mats, shadowGen);
  buildWideAftFlightDeck(scene, asteroidBase.group, mats, shadowGen);
  buildHangarOuterPlating(scene, asteroidBase.group, mats);
  buildAntigravKeelPods(scene, asteroidBase.group, mats);
  if (!(scene.getEngine() instanceof BABYLON.NullEngine)) {
    const wear=new BABYLON.Texture('./assets/textures/nomad/cruiser-service-wear.webp',scene);
    wear.gammaSpace=false;
    wear.wrapU=wear.wrapV=BABYLON.Texture.CLAMP_ADDRESSMODE;
    wear.anisotropicFilteringLevel=4;
    for(const material of [mats.hull,mats.hullDark,mats.crimson,mats.white,scene.getMaterialByName('cfFunnelOchre')]) {
      new CruiserServiceWear(material,wear);
    }
  }
  return { hullMat: mats.hull, deckMat: mats.deckSteel, mainTurrets: asteroidBase.mainTurrets };
}
