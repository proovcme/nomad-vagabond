/**
 * Sculpted 1930s Interbellum / Dieselpunk Military Structures (Zero-Cube Geometry):
 * - Würzburg-Riese style Parabolic Lattice Radar (CreateLathe + CreateTorus + CreateTube + CreateSphere)
 * - Domed Armored Quad-Pod SAM Rocket Battery (Cast Cupola + Curved Copper Hydraulics + Tapered Pods)
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function getWeatheredIronMat(scene, key, hex, metallic = 0.56, roughness = 0.44) {
  scene._dieselMats ||= {};
  if (!scene._dieselMats[key] || scene._dieselMats[key].isDisposed) {
    const m = new BABYLON.PBRMaterial(`diesel_${key}`, scene);
    m.albedoColor = c3(hex);
    m.metallic = metallic;
    m.roughness = roughness;
    m.environmentIntensity = 0.72;
    if (!(scene.getEngine() instanceof BABYLON.NullEngine)) {
      if (!scene._sharedGunmetalTex) {
        const tex = new BABYLON.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg', scene);
        tex.uScale = tex.vScale = 2.5;
        tex.anisotropicFilteringLevel = 8;
        scene._sharedGunmetalTex = tex;
      }
      if (!scene._sharedGunmetalBump) {
        const bump = new BABYLON.Texture('./assets/benchmark/textures/anti_slip_concrete/nor_gl.jpg', scene);
        bump.uScale = bump.vScale = 3.5;
        bump.gammaSpace = false;
        bump.level = 0.22;
        scene._sharedGunmetalBump = bump;
      }
      m.albedoTexture = scene._sharedGunmetalTex;
      m.bumpTexture = scene._sharedGunmetalBump;
    }
    scene._dieselMats[key] = m;
  }
  return scene._dieselMats[key];
}

function getMetalMat(scene, key, hex, metallic = 0.84, roughness = 0.30) {
  scene._dieselMats ||= {};
  if (!scene._dieselMats[key] || scene._dieselMats[key].isDisposed) {
    const m = new BABYLON.PBRMaterial(`diesel_${key}`, scene);
    m.albedoColor = c3(hex);
    m.metallic = metallic;
    m.roughness = roughness;
    scene._dieselMats[key] = m;
  }
  return scene._dieselMats[key];
}

function mergeInto(name, list, parent, mat, shadowGen = null) {
  if (!list.length) return null;
  list.forEach((m) => m.computeWorldMatrix(true));
  const merged = BABYLON.Mesh.MergeMeshes(list, true, true, undefined, false, false);
  if (!merged) return null;
  merged.name = name;
  merged.parent = parent;
  merged.material = mat;
  merged.receiveShadows = true;
  if (shadowGen) shadowGen.addShadowCaster(merged, false);
  return merged;
}

/**
 * Builds a sculptural WWII / Interbellum Parabolic Lattice Radar ("Редут / Würzburg-Riese").
 * Returns { root, rotor } — rotate `rotor.rotation.y` in update loop for smooth 360° sweep.
 */
export function buildSculptedRadar(scene, name, parent, pos = new BABYLON.Vector3(0, 0, 0), shadowGen = null) {
  const B = BABYLON;
  const root = new B.TransformNode(`${name}_root`, scene);
  if (parent) root.parent = parent;
  root.position.copyFrom(pos);

  const ironMat = getWeatheredIronMat(scene, 'radarIron', '#969c94', 0.56, 0.44);
  const darkIronMat = getWeatheredIronMat(scene, 'radarDarkIron', '#747a76', 0.65, 0.40);
  const brassMat = getMetalMat(scene, 'radarBrass', '#cca052', 0.84, 0.28);
  const copperMat = getMetalMat(scene, 'radarCopper', '#bc6c3c', 0.82, 0.32);

  // 1. Fluted cast-iron pedestal (Lathe silhouette, zero boxes!)
  const pedProfile = [
    new B.Vector3(2.45, 0.0, 0),
    new B.Vector3(2.35, 0.45, 0),
    new B.Vector3(1.65, 0.95, 0),
    new B.Vector3(1.48, 2.55, 0),
    new B.Vector3(1.82, 2.85, 0),
    new B.Vector3(1.70, 3.10, 0),
  ];
  const ped = B.MeshBuilder.CreateLathe(`${name}_pedestal`, { shape: pedProfile, tessellation: 16 }, scene);
  ped.parent = root; ped.material = ironMat; ped.receiveShadows = true;
  if (shadowGen) shadowGen.addShadowCaster(ped, false);

  // 2. Rotating Azimuth Cupola & Parabolic Mesh Dish
  const rotor = new B.TransformNode(`${name}_rotor`, scene);
  rotor.parent = root;
  rotor.position.set(0, 3.1, 0);

  const ironParts = [], brassParts = [], copperParts = [];
  const add = (m, arr, px, py, pz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
    arr.push(m); return m;
  };

  // Rounded cast-iron operator cupola + brass bearing collar + rear cylindrical counterweight
  add(B.MeshBuilder.CreateSphere('cupola', { diameter: 3.1, segments: 12, slice: 0.62 }, scene), ironParts, 0, 0.0, 0, 0, 0, 0, 1.0, 0.88, 1.15);
  add(B.MeshBuilder.CreateTorus('collar', { diameter: 3.1, thickness: 0.28, tessellation: 18 }, scene), brassParts, 0, 0.12, 0);
  add(B.MeshBuilder.CreateCylinder('counterWt', { diameter: 1.45, height: 1.6, tessellation: 12 }, scene), ironParts, 0, 1.05, -1.65, Math.PI * 0.5, 0, 0);
  // Twin curved trunnion support arms rising to the parabolic dish
  for (const sx of [-1.15, 1.15]) {
    const arm = B.MeshBuilder.CreateTube(`arm_${sx}`, {
      path: [new B.Vector3(sx, 0.6, -0.3), new B.Vector3(sx * 1.1, 2.2, 0.2), new B.Vector3(sx * 0.75, 4.1, 0.65)],
      radius: 0.18, tessellation: 8, cap: B.Mesh.CAP_ALL,
    }, scene);
    ironParts.push(arm);
  }

  // Sculpted Parabolic Open-Grid Dish (radius 3.4m, tilted skyward at -24 deg)
  const dishCenter = new B.Vector3(0, 4.55, 0.95);
  const dishTilt = -0.34;
  const rotPt = (x, y, z) => {
    const cy = Math.cos(dishTilt), sy = Math.sin(dishTilt);
    return new B.Vector3(
      dishCenter.x + x,
      dishCenter.y + (y * cy - z * sy),
      dishCenter.z + (y * sy + z * cy)
    );
  };

  // 3 Concentric parabolic rings (outer heavy rim + 2 inner wire rings)
  for (const [r, thick, matArr] of [[3.35, 0.18, ironParts], [2.25, 0.10, brassParts], [1.15, 0.09, brassParts]]) {
    const depth = (r * r) * 0.085;
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      pts.push(rotPt(Math.cos(a) * r, Math.sin(a) * r, depth));
    }
    matArr.push(B.MeshBuilder.CreateTube(`ring_${r}`, { path: pts, radius: thick * 0.5, tessellation: 6 }, scene));
  }

  // 8 Curved parabolic radial ribs forming the iconic lattice dish
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    const ribPts = [];
    for (let k = 0; k <= 6; k++) {
      const r = (k / 6) * 3.35;
      ribPts.push(rotPt(c * r, s * r, (r * r) * 0.085));
    }
    ironParts.push(B.MeshBuilder.CreateTube(`rib_${i}`, { path: ribPts, radius: 0.065, tessellation: 6 }, scene));
  }

  // Central hub + copper tripod waveguide feed horn projecting forward to the focal point
  const hubPt = rotPt(0, 0, 0.05);
  const focusPt = rotPt(0, 0, 2.45);
  add(B.MeshBuilder.CreateSphere('dishHub', { diameter: 0.95, segments: 10 }, scene), brassParts, hubPt.x, hubPt.y, hubPt.z);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const basePt = rotPt(Math.cos(a) * 1.9, Math.sin(a) * 1.9, (1.9 * 1.9) * 0.085);
    copperParts.push(B.MeshBuilder.CreateTube(`tripod_${i}`, { path: [basePt, focusPt], radius: 0.055, tessellation: 6 }, scene));
  }
  const horn = B.MeshBuilder.CreateCylinder('feedHorn', { diameterTop: 0.22, diameterBottom: 0.72, height: 0.78, tessellation: 10 }, scene);
  add(horn, copperParts, focusPt.x, focusPt.y, focusPt.z, Math.PI * 0.5 + dishTilt, 0, 0);

  mergeInto(`${name}_ironMesh`, ironParts, rotor, darkIronMat, shadowGen);
  mergeInto(`${name}_brassMesh`, brassParts, rotor, brassMat, null);
  mergeInto(`${name}_copperMesh`, copperParts, rotor, copperMat, null);

  return { root, rotor };
}

/**
 * Builds a sculptural Domed Dieselpunk Quad-Pod SAM Rocket Battery (zero boxy cubes!).
 */
export function buildSculptedSamLauncher(scene, name, parent, pos = new BABYLON.Vector3(0, 0, 0), shadowGen = null) {
  const B = BABYLON;
  const base = new B.TransformNode(`${name}_base`, scene);
  if (parent) base.parent = parent;
  base.position.copyFrom(pos);

  const ironMat = getWeatheredIronMat(scene, 'samIron', '#90968c', 0.56, 0.44);
  const darkMat = getWeatheredIronMat(scene, 'samDark', '#707672', 0.64, 0.40);
  const brassMat = getMetalMat(scene, 'samBrass', '#c89b4c', 0.84, 0.30);
  const copperMat = getMetalMat(scene, 'samCopper', '#bc6838', 0.82, 0.32);
  const headMat = getMetalMat(scene, 'samWarhead', '#c94124', 0.32, 0.38);

  // Sculpted Lathe armored turret base
  const baseProf = [
    new B.Vector3(2.25, 0.0, 0),
    new B.Vector3(2.10, 0.45, 0),
    new B.Vector3(1.65, 1.35, 0),
    new B.Vector3(1.78, 1.55, 0),
  ];
  const ped = B.MeshBuilder.CreateLathe(`${name}_ped`, { shape: baseProf, tessellation: 16 }, scene);
  ped.parent = base; ped.material = ironMat; ped.receiveShadows = true;
  if (shadowGen) shadowGen.addShadowCaster(ped, false);

  const yawNode = new B.TransformNode(`${name}_yaw`, scene);
  yawNode.parent = base; yawNode.position.set(0, 1.55, 0);

  const yIron = [], yCopper = [], yBrass = [];
  const add = (m, arr, px, py, pz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
    m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
    arr.push(m); return m;
  };
  // Domed armored cupola + brass ring + curved copper elevation hydraulics + exhaust stack
  add(B.MeshBuilder.CreateSphere('sCupola', { diameter: 3.1, segments: 14, slice: 0.56 }, scene), yIron, 0, -0.1, 0, 0, 0, 0, 1.0, 0.82, 1.12);
  add(B.MeshBuilder.CreateTorus('sRing', { diameter: 3.2, thickness: 0.24, tessellation: 18 }, scene), yBrass, 0, 0.08, 0);
  for (const sx of [-1.22, 1.22]) {
    yIron.push(B.MeshBuilder.CreateTube(`sYoke_${sx}`, {
      path: [new B.Vector3(sx, 0.25, 0.2), new B.Vector3(sx * 1.06, 1.15, 0.1), new B.Vector3(sx * 0.96, 1.75, 0)],
      radius: 0.20, tessellation: 8, cap: B.Mesh.CAP_ALL,
    }, scene));
    yCopper.push(B.MeshBuilder.CreateTube(`sHydro_${sx}`, {
      path: [new B.Vector3(sx * 0.82, 0.55, -0.95), new B.Vector3(sx * 0.88, 1.45, -0.55)],
      radius: 0.13, tessellation: 8, cap: B.Mesh.CAP_ALL,
    }, scene));
  }
  // Curved diesel exhaust pipe & pressure cylinder on rear
  add(B.MeshBuilder.CreateCylinder('sTank', { diameter: 0.56, height: 1.55, tessellation: 12 }, scene), yCopper, 0, 0.65, 1.38, 0, 0, Math.PI * 0.5);
  yIron.push(B.MeshBuilder.CreateTube('sExhaust', {
    path: [new B.Vector3(0.95, 0.55, 1.1), new B.Vector3(1.18, 1.25, 1.25), new B.Vector3(1.22, 1.95, 1.45)],
    radius: 0.11, tessellation: 8, cap: B.Mesh.CAP_ALL,
  }, scene));

  mergeInto(`${name}_yawIron`, yIron, yawNode, ironMat, shadowGen);
  mergeInto(`${name}_yawCopper`, yCopper, yawNode, copperMat, null);
  mergeInto(`${name}_yawBrass`, yBrass, yawNode, brassMat, null);

  // Elevating Quad-Pod Launch Rack (4 sleek tapered cylindrical tubes + circular brass clamping rings!)
  const rackNode = new B.TransformNode(`${name}_rack`, scene);
  rackNode.parent = yawNode; rackNode.position.set(0, 1.72, 0); rackNode.rotation.x = -0.46;

  const rDark = [], rBrass = [], rHeads = [];
  const muzzles = [];
  const podCoords = [[-0.64, 0.42], [0.64, 0.42], [-0.64, -0.34], [0.64, -0.34]];
  for (const [rx, ry] of podCoords) {
    // Tapered cylindrical rocket pod with flared rear exhaust bell
    add(B.MeshBuilder.CreateCylinder(`sTube_${rx}_${ry}`, { diameterTop: 0.56, diameterBottom: 0.62, height: 3.65, tessellation: 14 }, scene), rDark, rx, ry, 0, Math.PI * 0.5, 0, 0);
    add(B.MeshBuilder.CreateCylinder(`sBell_${rx}_${ry}`, { diameterTop: 0.56, diameterBottom: 0.74, height: 0.45, tessellation: 14 }, scene), rBrass, rx, ry, 1.95, Math.PI * 0.5, 0, 0);
    add(B.MeshBuilder.CreateTorus(`sFrontRing_${rx}_${ry}`, { diameter: 0.62, thickness: 0.08, tessellation: 14 }, scene), rBrass, rx, ry, -1.72, Math.PI * 0.5, 0, 0);
    // Crimson conical warhead poking out front
    add(B.MeshBuilder.CreateCylinder(`sTip_${rx}_${ry}`, { diameterTop: 0.04, diameterBottom: 0.42, height: 0.92, tessellation: 12 }, scene), rHeads, rx, ry, -2.18, -Math.PI * 0.5, 0, 0);
    const mNode = new B.TransformNode(`${name}_muzzle_${rx}_${ry}`, scene);
    mNode.parent = rackNode; mNode.position.set(rx, ry, -2.55);
    muzzles.push(mNode);
  }
  // Circular brass binding rings embracing the 4-pod cluster (instead of ugly square boxes!)
  for (const bz of [-1.05, 0.95]) {
    add(B.MeshBuilder.CreateTorus(`sClamp_${bz}`, { diameter: 2.05, thickness: 0.14, tessellation: 20 }, scene), rBrass, 0, 0.04, bz, Math.PI * 0.5, 0, 0);
  }

  mergeInto(`${name}_rackPods`, rDark, rackNode, darkMat, shadowGen);
  mergeInto(`${name}_rackBrass`, rBrass, rackNode, brassMat, null);
  mergeInto(`${name}_rackHeads`, rHeads, rackNode, headMat, null);

  return { base, yawNode, rackNode, muzzles, cd: 1.5, tubeIdx: 0 };
}
