/**
 * Modular Biome Floating Islands (Volcanic Obsidian, Glacial Observatory,
 * Red Canyon Windmills, Ancient Marble Sanctuary).
 * Each island uses buildGeneratedIsland + RockProjection + merged low-draw-call architecture.
 */

import { buildGeneratedIsland } from '../islandGenerator.js?v=mission1';
import { applyRockProjection } from '../terrainMaterials.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

export const BIOME_TYPES = Object.freeze(['volcanic', 'glacier', 'desert', 'ancient']);

function mergeGroup(scene, name, meshes, parent, material, castShadow = false, shadowGen = null) {
  if (!meshes.length) return null;
  meshes.forEach((m) => m.computeWorldMatrix(true));
  const merged = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, false);
  if (!merged) return null;
  merged.name = name;
  merged.parent = parent;
  merged.material = material;
  merged.receiveShadows = true;
  if (castShadow && shadowGen) shadowGen.addShadowCaster(merged, false);
  return merged;
}

function getBiomeTex(scene, key, url, scale = 3.0, isLinear = false) {
  if (scene.getEngine() instanceof BABYLON.NullEngine) return null;
  scene._biomeTexCache ||= {};
  if (!scene._biomeTexCache[key]) {
    const t = new BABYLON.Texture(url, scene);
    t.uScale = t.vScale = scale;
    t.anisotropicFilteringLevel = 8;
    if (isLinear) t.gammaSpace = false;
    scene._biomeTexCache[key] = t;
  }
  return scene._biomeTexCache[key];
}

export function buildBiomeIsland(scene, {
  biome = 'desert',
  pos = [0, 50, -320],
  seed = 777,
  radiusX = 48,
  radiusZ = 40,
  depth = 52,
  shadowGen = null,
} = {}) {
  const B = BABYLON;
  const group = new B.TransformNode(`biomeIsland_${biome}_${seed}`, scene);
  group.position.set(pos[0], pos[1], pos[2]);

  const generated = buildGeneratedIsland(scene, {
    seed,
    radiusX,
    radiusZ,
    topY: 1.6,
    depth,
    style: biome,
    parent: group,
    shadowGenerator: null, // distant biome islands skip heavy shadow-map pass
  });

  // Ensure the biome's RockProjection material style is applied to both rock and terrain caps
  for (const m of [generated?.rock, generated?.terrain]) {
    if (m?.material) {
      applyRockProjection(m.material, scene, biome);
    }
  }

  const animators = [];
  const put = (mesh, arr, px, py, pz, rx = 0, ry = 0, rz = 0) => {
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx, ry, rz);
    arr.push(mesh);
    return mesh;
  };

  if (biome === 'volcanic') {
    // Magma Forge: glowing lava caldera + basalt vents + riveted iron smelter derrick
    const lavaMat = new B.StandardMaterial(`volcLavaMat_${seed}`, scene);
    lavaMat.emissiveColor = c3('#ff4e12');
    lavaMat.disableLighting = true;
    const ironMat = new B.PBRMaterial(`volcIronMat_${seed}`, scene);
    ironMat.albedoColor = c3('#6e6864'); ironMat.metallic = 0.64; ironMat.roughness = 0.46; ironMat.environmentIntensity = 0.7;
    ironMat.albedoTexture = getBiomeTex(scene, 'graphite', './assets/textures/nomad/aviation-runway-graphite-v1.jpg', 3.0);
    const copperMat = new B.PBRMaterial(`volcCopperMat_${seed}`, scene);
    copperMat.albedoColor = c3('#c8723e'); copperMat.metallic = 0.80; copperMat.roughness = 0.34;

    const caldera = B.MeshBuilder.CreateDisc(`volcCaldera_${seed}`, { radius: radiusX * 0.34, tessellation: 18 }, scene);
    caldera.parent = group; caldera.rotation.x = Math.PI * 0.5; caldera.position.y = 2.05;
    caldera.material = lavaMat; caldera.isPickable = false;

    const ironParts = [], copperParts = [];
    // Spanning smelter gantry + 3 basalt chimneys
    put(B.MeshBuilder.CreateBox('vBridge', { width: radiusX * 0.85, height: 1.4, depth: 3.6 }, scene), ironParts, 0, 8.5, 0);
    for (const sx of [-radiusX * 0.38, radiusX * 0.38]) {
      put(B.MeshBuilder.CreateBox(`vLeg_${sx}`, { width: 2.8, height: 10.5, depth: 3.4 }, scene), ironParts, sx, 4.2, 0);
    }
    put(B.MeshBuilder.CreateCylinder('vStackMain', { diameterTop: 2.4, diameterBottom: 4.2, height: 19, tessellation: 8 }, scene), ironParts, -radiusX * 0.22, 11.2, -radiusZ * 0.25);
    put(B.MeshBuilder.CreateCylinder('vStackPipe', { diameter: 1.1, height: 16, tessellation: 8 }, scene), copperParts, 0, 10.2, 0);
    for (let k = 0; k < 3; k++) {
      const a = k * 2.1 + 0.5;
      put(B.MeshBuilder.CreateCylinder(`vVent_${k}`, { diameterTop: 2.2, diameterBottom: 5.5, height: 9.5 + k * 2.5, tessellation: 7 }, scene), ironParts, Math.cos(a) * radiusX * 0.48, 5.2, Math.sin(a) * radiusZ * 0.45);
    }
    mergeGroup(scene, `volcSmelterIron_${seed}`, ironParts, group, ironMat);
    mergeGroup(scene, `volcSmelterCopper_${seed}`, copperParts, group, copperMat);

    animators.push((t) => {
      const p = 0.82 + 0.18 * Math.sin(t * 2.4 + seed);
      lavaMat.emissiveColor.set(1.0 * p, 0.30 * p, 0.06 * p);
    });
  } else if (biome === 'glacier') {
    // Glacial Observatory: faceted cyan ice spires + 1930s Art Deco brass observatory dome
    const crystalMat = new B.PBRMaterial(`glacCrystalMat_${seed}`, scene);
    crystalMat.albedoColor = c3('#7ce6ff'); crystalMat.emissiveColor = c3('#185872');
    crystalMat.metallic = 0.15; crystalMat.roughness = 0.18; crystalMat.alpha = 0.84;
    const brassMat = new B.PBRMaterial(`glacBrassMat_${seed}`, scene);
    brassMat.albedoColor = c3('#c8a258'); brassMat.metallic = 0.78; brassMat.roughness = 0.32;
    const stoneMat = new B.PBRMaterial(`glacStoneMat_${seed}`, scene);
    stoneMat.albedoColor = c3('#dce8f0'); stoneMat.metallic = 0.08; stoneMat.roughness = 0.72;
    stoneMat.albedoTexture = getBiomeTex(scene, 'granite', './assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', 3.0);
    stoneMat.bumpTexture = getBiomeTex(scene, 'graniteNor', './assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', 3.0, true);

    const crystalParts = [], stoneParts = [], brassParts = [];
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + 0.3;
      const dist = radiusX * (0.42 + (k % 3) * 0.12);
      const h = 11 + (k % 4) * 5.5;
      put(B.MeshBuilder.CreateCylinder(`gSpire_${k}`, { diameterTop: 0.4, diameterBottom: 3.4, height: h, tessellation: 5 }, scene), crystalParts, Math.cos(a) * dist, h * 0.45, Math.sin(a) * dist * 0.85, (k % 2 ? 0.18 : -0.14), a, 0.12);
    }
    // Art Deco Observatory base & dome
    put(B.MeshBuilder.CreateCylinder('gObsBase', { diameter: 14.5, height: 7.5, tessellation: 12 }, scene), stoneParts, 0, 5.2, 0);
    put(B.MeshBuilder.CreateSphere('gObsDome', { diameter: 13.8, segments: 12, slice: 0.55 }, scene), brassParts, 0, 8.8, 0);
    mergeGroup(scene, `glacCrystals_${seed}`, crystalParts, group, crystalMat);
    mergeGroup(scene, `glacObsStone_${seed}`, stoneParts, group, stoneMat);
    const domeMesh = mergeGroup(scene, `glacObsDome_${seed}`, brassParts, group, brassMat);
    if (domeMesh) {
      animators.push((t) => { domeMesh.rotation.y = Math.sin(t * 0.35 + seed) * 0.8; });
    }
  } else if (biome === 'desert') {
    // Red Canyon Outpost: terraced adobe/limestone Interbellum radio towers + 2 spinning canvas-and-brass windmills!
    const adobeMat = new B.PBRMaterial(`desAdobeMat_${seed}`, scene);
    adobeMat.albedoColor = c3('#e4c89e'); adobeMat.metallic = 0.02; adobeMat.roughness = 0.86;
    adobeMat.albedoTexture = getBiomeTex(scene, 'sand', './assets/benchmark/textures/coast_sand_01/Diffuse.jpg', 3.5);
    adobeMat.bumpTexture = getBiomeTex(scene, 'sandNor', './assets/benchmark/textures/coast_sand_01/nor_gl.jpg', 3.5, true);
    const roofMat = new B.PBRMaterial(`desRoofMat_${seed}`, scene);
    roofMat.albedoColor = c3('#b44d32'); roofMat.metallic = 0.08; roofMat.roughness = 0.80;
    const sailMat = new B.PBRMaterial(`desSailMat_${seed}`, scene);
    sailMat.albedoColor = c3('#f4e8ca'); sailMat.metallic = 0.0; sailMat.roughness = 0.90; sailMat.backFaceCulling = false;
    sailMat.albedoTexture = getBiomeTex(scene, 'canvas', './assets/textures/nomad/ochre-aircraft-canvas.png', 2.0);

    const adobeParts = [], roofParts = [];
    put(B.MeshBuilder.CreateBox('dDepot', { width: 14, height: 6.5, depth: 10 }, scene), adobeParts, -6, 4.8, 4);
    put(B.MeshBuilder.CreateBox('dDepotRoof', { width: 15.2, height: 1.4, depth: 11.2 }, scene), roofParts, -6, 8.6, 4);
    put(B.MeshBuilder.CreateCylinder('dTower1', { diameterTop: 3.4, diameterBottom: 5.8, height: 16, tessellation: 8 }, scene), adobeParts, 11, 9.2, -5);
    put(B.MeshBuilder.CreateCylinder('dTower2', { diameterTop: 3.0, diameterBottom: 4.8, height: 13, tessellation: 8 }, scene), adobeParts, -14, 7.8, -11);
    mergeGroup(scene, `desAdobe_${seed}`, adobeParts, group, adobeMat);
    mergeGroup(scene, `desRoofs_${seed}`, roofParts, group, roofMat);

    // 2 animated giant dieselpunk wind turbines
    const hubs = [];
    for (const [wx, wy, wz, scale] of [[11, 16.5, -2.5, 1.0], [-14, 13.8, -8.8, 0.82]]) {
      const hub = new B.TransformNode(`desWindmillHub_${seed}_${wx}`, scene);
      hub.parent = group; hub.position.set(wx, wy, wz);
      const bladeParts = [];
      for (let b = 0; b < 4; b++) {
        const ang = (b * Math.PI) / 2;
        const m = B.MeshBuilder.CreateBox(`dSail_${b}`, { width: 1.4 * scale, height: 7.5 * scale, depth: 0.12 }, scene);
        m.position.set(Math.sin(ang) * 4.2 * scale, Math.cos(ang) * 4.2 * scale, 0);
        m.rotation.z = -ang;
        bladeParts.push(m);
      }
      mergeGroup(scene, `desWindmillBlades_${seed}_${wx}`, bladeParts, hub, sailMat);
      hubs.push(hub);
    }
    animators.push((t) => {
      hubs.forEach((h, i) => { h.rotation.z = t * (0.95 + i * 0.25); });
    });
  } else {
    // Ancient Sanctuary: fluted ivory marble columns + levitating rotating emerald-and-brass Aether Obelisk!
    const marbleMat = new B.PBRMaterial(`ancMarbleMat_${seed}`, scene);
    marbleMat.albedoColor = c3('#efe8d6'); marbleMat.metallic = 0.06; marbleMat.roughness = 0.72;
    marbleMat.albedoTexture = getBiomeTex(scene, 'granite', './assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', 2.5);
    marbleMat.bumpTexture = getBiomeTex(scene, 'graniteNor', './assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', 2.5, true);
    if (marbleMat.bumpTexture) marbleMat.bumpTexture.level = 0.35;
    const brassMat = new B.PBRMaterial(`ancBrassMat_${seed}`, scene);
    brassMat.albedoColor = c3('#cfa352'); brassMat.metallic = 0.84; brassMat.roughness = 0.28;
    const glowMat = new B.StandardMaterial(`ancGlowMat_${seed}`, scene);
    glowMat.emissiveColor = c3('#48e8cc'); glowMat.disableLighting = true;

    const marbleParts = [];
    put(B.MeshBuilder.CreateCylinder('aAltar1', { diameter: 22, height: 1.8, tessellation: 12 }, scene), marbleParts, 0, 2.4, 0);
    put(B.MeshBuilder.CreateCylinder('aAltar2', { diameter: 14, height: 1.6, tessellation: 12 }, scene), marbleParts, 0, 4.0, 0);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const h = (k % 3 === 0) ? 7.5 : 14.5;
      put(B.MeshBuilder.CreateCylinder(`aCol_${k}`, { diameter: 1.9, height: h, tessellation: 8 }, scene), marbleParts, Math.cos(a) * 14.5, 2.5 + h * 0.5, Math.sin(a) * 14.5);
    }
    mergeGroup(scene, `ancSanctuaryMarble_${seed}`, marbleParts, group, marbleMat);

    // Levitating brass & aether obelisk + orbiting ring
    const obeliskNode = new B.TransformNode(`ancObelisk_${seed}`, scene);
    obeliskNode.parent = group; obeliskNode.position.set(0, 15.5, 0);
    const obCore = B.MeshBuilder.CreateCylinder(`ancObCore_${seed}`, { diameterTop: 0.2, diameterBottom: 3.6, height: 11.5, tessellation: 4 }, scene);
    obCore.parent = obeliskNode; obCore.material = brassMat; obCore.isPickable = false;
    const obRing = B.MeshBuilder.CreateTorus(`ancObRing_${seed}`, { diameter: 9.2, thickness: 0.45, tessellation: 18 }, scene);
    obRing.parent = obeliskNode; obRing.material = glowMat; obRing.isPickable = false;

    animators.push((t) => {
      obeliskNode.position.y = 15.5 + Math.sin(t * 1.4 + seed) * 2.2;
      obCore.rotation.y = t * 0.55;
      obRing.rotation.x = t * 0.8;
      obRing.rotation.z = t * 0.45;
    });
  }

  const names={
    volcanic:['Огненная гряда','Вулканический остров'],
    glacier:['Ледовая обсерватория','Высокогорная станция'],
    desert:['Красный каньон','Остров ветряных башен'],
    ancient:['Старое святилище','Руины обсерватории'],
  };
  const [name,biomeLabel]=names[biome] || ['Дальний остров','Остров архипелага'];
  return {
    group, name, biomeLabel, radius:Math.max(radiusX,radiusZ),
    biome,
    generated,
    update(simTime) {
      for (const fn of animators) fn(simTime);
    },
  };
}
