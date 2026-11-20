/**
 * Sculpted Interbellum / Dieselpunk Anti-Aircraft Gun ("Зенитная пушка"):
 * - Zero boxy cubes: fluted CreateLathe pedestal, tubular outriggers, curved cast-armor wings,
 *   wide open-top elevation slot + rotating gun mantlet so the barrel NEVER clips through the shield!
 * - Weathered iron PBR texture + burnished copper hydraulics + tarnished brass handwheels & muzzle brake.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

export function buildFlak88Turret(scene, name, parent, pos = new BABYLON.Vector3(0, 0, 0), rotY = 0, shadowGen = null) {
  const B = BABYLON;
  const root = new B.TransformNode(`${name}_root`, scene);
  if (parent) root.parent = parent;
  root.position.copyFrom(pos);
  root.rotation.y = rotY;

  const isNull = scene.getEngine() instanceof B.NullEngine;
  let ironTex = null;
  if (!isNull) {
    if (!scene._sharedGunmetalTex) {
      const t = new B.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg', scene);
      t.uScale = t.vScale = 2.5;
      t.anisotropicFilteringLevel = 8;
      scene._sharedGunmetalTex = t;
    }
    ironTex = scene._sharedGunmetalTex;
  }

  const armorMat = new B.PBRMaterial(`${name}_armorMat`, scene);
  armorMat.albedoColor = c3('#8c9288');
  armorMat.metallic = 0.54;
  armorMat.roughness = 0.46;
  armorMat.environmentIntensity = 0.72;
  if (ironTex) armorMat.albedoTexture = ironTex;

  const barrelMat = new B.PBRMaterial(`${name}_barrelMat`, scene);
  barrelMat.albedoColor = c3('#343838');
  barrelMat.metallic = 0.76;
  barrelMat.roughness = 0.34;

  const brassMat = new B.PBRMaterial(`${name}_brassMat`, scene);
  brassMat.albedoColor = c3('#caa050');
  brassMat.metallic = 0.86;
  brassMat.roughness = 0.28;

  const copperMat = new B.PBRMaterial(`${name}_copperMat`, scene);
  copperMat.albedoColor = c3('#ba6838');
  copperMat.metallic = 0.84;
  copperMat.roughness = 0.32;

  const gaugeMat = new B.StandardMaterial(`${name}_gaugeMat`, scene);
  gaugeMat.emissiveColor = c3('#ffbe55');
  gaugeMat.disableLighting = true;

  const reg = (mesh, mat, castShadow = true) => {
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
    mesh.checkCollisions = false;
    if (castShadow && shadowGen) shadowGen.addShadowCaster(mesh, false);
    return mesh;
  };

  // 1. Fluted Cast-Iron Cruciform Base & Tubular Outrigger Legs (zero cubes!)
  const hubProf = [
    new B.Vector3(1.38, 0.0, 0),
    new B.Vector3(1.28, 0.28, 0),
    new B.Vector3(1.05, 0.54, 0),
  ];
  const centerHub = reg(B.MeshBuilder.CreateLathe(`${name}_hub`, { shape: hubProf, tessellation: 16 }, scene), armorMat);
  centerHub.parent = root;

  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const legNode = new B.TransformNode(`${name}_legNode_${i}`, scene);
    legNode.parent = root;
    legNode.rotation.y = ang;

    const strut = reg(B.MeshBuilder.CreateCylinder(`${name}_leg_${i}`, { diameterTop: 0.28, diameterBottom: 0.42, height: 2.65, tessellation: 10 }, scene), armorMat);
    strut.parent = legNode;
    strut.rotation.x = Math.PI * 0.5;
    strut.position.set(0, 0.22, 1.82);

    const pad = reg(B.MeshBuilder.CreateCylinder(`${name}_pad_${i}`, { diameterTop: 0.72, diameterBottom: 0.88, height: 0.16, tessellation: 12 }, scene), barrelMat, false);
    pad.parent = legNode;
    pad.position.set(0, 0.08, 3.12);

    const jack = reg(B.MeshBuilder.CreateCylinder(`${name}_jack_${i}`, { diameter: 0.22, height: 0.58, tessellation: 10 }, scene), brassMat, false);
    jack.parent = legNode;
    jack.position.set(0, 0.38, 3.12);
  }

  // 2. Rotating Turntable Pedestal (yawNode)
  const yawNode = new B.TransformNode(`${name}_yaw`, scene);
  yawNode.parent = root;
  yawNode.position.y = 0.54;

  const ring = reg(B.MeshBuilder.CreateTorus(`${name}_ring`, { diameter: 1.98, thickness: 0.22, tessellation: 20 }, scene), brassMat);
  ring.parent = yawNode;
  ring.position.y = 0.08;

  const pedProf = [
    new B.Vector3(0.92, 0.0, 0),
    new B.Vector3(0.76, 0.35, 0),
    new B.Vector3(0.62, 1.15, 0),
    new B.Vector3(0.74, 1.32, 0),
  ];
  const pedestal = reg(B.MeshBuilder.CreateLathe(`${name}_pedestal`, { shape: pedProf, tessellation: 16 }, scene), armorMat);
  pedestal.parent = yawNode;

  // Curved cast-iron trunnion yokes supporting the elevating barrel (wide clearance: x = ±0.64!)
  for (const sx of [-0.64, 0.64]) {
    const yoke = reg(B.MeshBuilder.CreateTube(`${name}_yoke_${sx}`, {
      path: [new B.Vector3(sx * 0.75, 0.95, 0.05), new B.Vector3(sx, 1.38, 0.02), new B.Vector3(sx, 1.82, 0.0)],
      radius: 0.14, tessellation: 8, cap: B.Mesh.CAP_ALL,
    }, scene), armorMat);
    yoke.parent = yawNode;
  }

  // Curved Cast-Armor Side Shields with WIDE 1.16m open-top slot (NO top brow -> barrel NEVER clips!)
  for (const sx of [-1, 1]) {
    const shieldCurve = [];
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      const x = sx * (0.68 + t * 0.96);
      const z = -0.92 + t * t * 0.58;
      shieldCurve.push(new B.Vector3(x, 0, z));
    }
    const wingMesh = reg(B.MeshBuilder.CreateRibbon(`${name}_curvedShield_${sx}`, {
      pathArray: [
        shieldCurve.map((p) => new B.Vector3(p.x, 0.58, p.z + 0.16)),
        shieldCurve.map((p) => new B.Vector3(p.x, 1.48, p.z)),
        shieldCurve.map((p) => new B.Vector3(p.x, 2.28, p.z - 0.14)),
      ],
      sideOrientation: B.Mesh.DOUBLESIDE,
    }, scene), armorMat);
    wingMesh.parent = yawNode;

    // Brass top beading along the curved shield edge
    const bead = reg(B.MeshBuilder.CreateTube(`${name}_shieldBead_${sx}`, {
      path: shieldCurve.map((p) => new B.Vector3(p.x, 2.29, p.z - 0.14)),
      radius: 0.045, tessellation: 6,
    }, scene), brassMat, false);
    bead.parent = yawNode;
  }

  // Gunner seat, brass elevation handwheels, copper pressure tank, curved exhaust & glowing amber dial
  const seatPost = reg(B.MeshBuilder.CreateCylinder(`${name}_seatPost`, { diameter: 0.13, height: 0.78, tessellation: 8 }, scene), barrelMat, false);
  seatPost.parent = yawNode; seatPost.position.set(0.88, 0.65, 0.54);
  const seatPan = reg(B.MeshBuilder.CreateSphere(`${name}_seatPan`, { diameter: 0.58, segments: 10, slice: 0.4 }, scene), armorMat, false);
  seatPan.parent = yawNode; seatPan.position.set(0.88, 1.06, 0.54); seatPan.rotation.x = Math.PI;

  for (const [wx, wy, wz] of [[0.78, 1.44, 0.22], [-0.78, 1.48, 0.18]]) {
    const wheel = reg(B.MeshBuilder.CreateTorus(`${name}_wheel_${wx}`, { diameter: 0.44, thickness: 0.055, tessellation: 14 }, scene), brassMat, false);
    wheel.parent = yawNode; wheel.position.set(wx, wy, wz); wheel.rotation.z = Math.PI * 0.5;
  }
  const hydroTank = reg(B.MeshBuilder.CreateCylinder(`${name}_hydroTank`, { diameter: 0.44, height: 1.05, tessellation: 12 }, scene), copperMat, false);
  hydroTank.parent = yawNode; hydroTank.position.set(-0.86, 1.05, 0.64); hydroTank.rotation.x = Math.PI * 0.5;

  const exhaust = reg(B.MeshBuilder.CreateTube(`${name}_exhaust`, {
    path: [new B.Vector3(-0.86, 1.05, 0.92), new B.Vector3(-1.05, 1.45, 1.05), new B.Vector3(-1.08, 2.15, 1.15)],
    radius: 0.085, tessellation: 8, cap: B.Mesh.CAP_ALL,
  }, scene), barrelMat, false);
  exhaust.parent = yawNode;

  const dialFace = reg(B.MeshBuilder.CreateCylinder(`${name}_dial`, { diameter: 0.22, height: 0.05, tessellation: 12 }, scene), gaugeMat, false);
  dialFace.parent = yawNode; dialFace.position.set(0.68, 1.66, 0.34); dialFace.rotation.x = Math.PI * 0.5;

  // 3. Elevating Cradle (pitchNode: rotates cleanly up to +82° inside the open slot!)
  const pitchNode = new B.TransformNode(`${name}_pitch`, scene);
  pitchNode.parent = yawNode;
  pitchNode.position.set(0, 1.80, 0.0);
  pitchNode.rotation.x = 0.38;

  // Rounded cast-armor gun mantlet (rotates WITH the barrel so it protects the slot at EVERY elevation!)
  const mantlet = reg(B.MeshBuilder.CreateCylinder(`${name}_mantlet`, { diameter: 0.96, height: 1.12, tessellation: 14 }, scene), armorMat);
  mantlet.parent = pitchNode; mantlet.rotation.z = Math.PI * 0.5; mantlet.position.set(0, 0.02, -0.45);

  // Twin copper/blued hydraulic recuperator cylinders + brass rotary ammo drum
  for (const cy of [0.38, -0.32]) {
    const cyl = reg(B.MeshBuilder.CreateCylinder(`${name}_recup_${cy}`, { diameter: 0.24, height: 2.35, tessellation: 12 }, scene), cy > 0 ? copperMat : barrelMat);
    cyl.parent = pitchNode; cyl.rotation.x = Math.PI * 0.5; cyl.position.set(0, cy, -0.58);
  }
  const ammoDrum = reg(B.MeshBuilder.CreateCylinder(`${name}_ammoDrum`, { diameter: 0.64, height: 0.36, tessellation: 14 }, scene), brassMat, false);
  ammoDrum.parent = pitchNode; ammoDrum.rotation.z = Math.PI * 0.5; ammoDrum.position.set(-0.56, 0.16, 0.36);

  // 4. Recoiling Barrel Assembly (slides cleanly along +Z on fire)
  const recoilNode = new B.TransformNode(`${name}_recoil`, scene);
  recoilNode.parent = pitchNode;

  // Rounded cylindrical breech block (no ugly square box!)
  const breech = reg(B.MeshBuilder.CreateCylinder(`${name}_breech`, { diameter: 0.58, height: 0.92, tessellation: 12 }, scene), barrelMat);
  breech.parent = recoilNode; breech.rotation.x = Math.PI * 0.5; breech.position.set(0, 0.02, 0.88);
  const breechCap = reg(B.MeshBuilder.CreateSphere(`${name}_breechCap`, { diameter: 0.58, segments: 10 }, scene), brassMat, false);
  breechCap.parent = recoilNode; breechCap.position.set(0, 0.02, 1.32);

  // Multi-stage tapered rifled barrel with copper cooling fins & sculpted Lathe muzzle brake
  const barrelRear = reg(B.MeshBuilder.CreateCylinder(`${name}_barrelRear`, { diameterTop: 0.28, diameterBottom: 0.40, height: 2.15, tessellation: 14 }, scene), barrelMat);
  barrelRear.parent = recoilNode; barrelRear.rotation.x = -Math.PI * 0.5; barrelRear.position.set(0, 0.02, -1.35);
  for (const fz of [-1.05, -1.45, -1.85]) {
    const fin = reg(B.MeshBuilder.CreateTorus(`${name}_coolFin_${fz}`, { diameter: 0.42, thickness: 0.07, tessellation: 14 }, scene), copperMat, false);
    fin.parent = recoilNode; fin.rotation.x = Math.PI * 0.5; fin.position.set(0, 0.02, fz);
  }

  const barrelFront = reg(B.MeshBuilder.CreateCylinder(`${name}_barrelFront`, { diameterTop: 0.19, diameterBottom: 0.28, height: 3.35, tessellation: 14 }, scene), barrelMat);
  barrelFront.parent = recoilNode; barrelFront.rotation.x = -Math.PI * 0.5; barrelFront.position.set(0, 0.02, -4.05);

  const collar = reg(B.MeshBuilder.CreateTorus(`${name}_collar`, { diameter: 0.34, thickness: 0.08, tessellation: 14 }, scene), brassMat, false);
  collar.parent = recoilNode; collar.rotation.x = Math.PI * 0.5; collar.position.set(0, 0.02, -2.42);

  const muzzleBrake = reg(B.MeshBuilder.CreateLathe(`${name}_muzzleBrake`, {
    shape: [
      new B.Vector3(0.11, 0.0, 0),
      new B.Vector3(0.18, 0.12, 0),
      new B.Vector3(0.14, 0.24, 0),
      new B.Vector3(0.21, 0.38, 0),
      new B.Vector3(0.17, 0.48, 0),
    ],
    tessellation: 14,
  }, scene), brassMat, false);
  muzzleBrake.parent = recoilNode; muzzleBrake.rotation.x = -Math.PI * 0.5; muzzleBrake.position.set(0, 0.02, -5.65);

  const muzzleNode = new B.TransformNode(`${name}_muzzle`, scene);
  muzzleNode.parent = recoilNode;
  muzzleNode.position.set(0, 0.02, -6.15);

  return {
    root,
    yawNode,
    pitchNode,
    recoilNode,
    muzzleNode,
    recoil: 0,
  };
}
