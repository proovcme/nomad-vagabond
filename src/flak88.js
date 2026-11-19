import { createRustedMetalTexture } from './textures.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Builds an authentic WWII 8.8cm FlaK 36/37 ("Flak 88") anti-aircraft gun
 * with cruciform outrigger legs, turntable pedestal, sloped gun shield,
 * dual recoil recuperator cylinders, long tapered barrel, and animated
 * yaw/pitch/recoil nodes.
 */
export function buildFlak88Turret(scene, name, parent, pos = new BABYLON.Vector3(0, 0, 0), rotY = 0, shadowGen = null) {
  const B = BABYLON;
  const root = new B.TransformNode(`${name}_root`, scene);
  if (parent) root.parent = parent;
  root.position.copyFrom(pos);
  root.rotation.y = rotY;

  const isNull = scene.getEngine() instanceof B.NullEngine;
  let tex = null;
  if (!isNull) {
    tex = createRustedMetalTexture(scene, [88, 90, 82]);
    tex.albedoTex.uScale = tex.albedoTex.vScale = 2.0;
    tex.bumpTex.uScale = tex.bumpTex.vScale = 2.0;
  }

  // Feldgrau matte armor paint
  const armorMat = new B.PBRMaterial(`${name}_armorMat`, scene);
  armorMat.albedoColor = c3('#575950');
  armorMat.metallic = 0.28;
  armorMat.roughness = 0.72;
  if (tex) {
    armorMat.albedoTexture = tex.albedoTex;
    armorMat.bumpTexture = tex.bumpTex;
    armorMat.bumpTexture.level = 1.25;
  }

  // Blued gunmetal barrel & breech
  const barrelMat = new B.PBRMaterial(`${name}_barrelMat`, scene);
  barrelMat.albedoColor = c3('#353736');
  barrelMat.metallic = 0.74;
  barrelMat.roughness = 0.38;
  if (tex) {
    barrelMat.bumpTexture = tex.bumpTex;
    barrelMat.bumpTexture.level = 0.9;
  }

  // Brass handwheels, optical sight & rings
  const brassMat = new B.PBRMaterial(`${name}_brassMat`, scene);
  brassMat.albedoColor = c3('#c49c50');
  brassMat.metallic = 0.84;
  brassMat.roughness = 0.30;

  const reg = (mesh, mat, castShadow = true) => {
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = false;
    mesh.checkCollisions = false;
    if (castShadow && shadowGen) shadowGen.addShadowCaster(mesh, false);
    return mesh;
  };

  // 1. Cruciform Outrigger Base (4 heavy steel legs + ground leveling pads)
  const centerHub = reg(B.MeshBuilder.CreateCylinder(`${name}_hub`, { diameterTop: 2.0, diameterBottom: 2.35, height: 0.52, tessellation: 12 }, scene), armorMat);
  centerHub.parent = root;
  centerHub.position.y = 0.26;

  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const legNode = new B.TransformNode(`${name}_legNode_${i}`, scene);
    legNode.parent = root;
    legNode.rotation.y = ang;

    const beam = reg(B.MeshBuilder.CreateBox(`${name}_leg_${i}`, { width: 0.44, height: 0.34, depth: 2.75 }, scene), armorMat);
    beam.parent = legNode;
    beam.position.set(0, 0.20, 1.85);

    // Leveling screw jack & circular footpad at the tip of each outrigger
    const pad = reg(B.MeshBuilder.CreateCylinder(`${name}_pad_${i}`, { diameter: 0.78, height: 0.14, tessellation: 10 }, scene), barrelMat, false);
    pad.parent = legNode;
    pad.position.set(0, 0.07, 3.15);

    const jack = reg(B.MeshBuilder.CreateCylinder(`${name}_jack_${i}`, { diameter: 0.22, height: 0.56, tessellation: 8 }, scene), brassMat, false);
    jack.parent = legNode;
    jack.position.set(0, 0.36, 3.15);
  }

  // 2. Rotating Turntable Pedestal (yawNode)
  const yawNode = new B.TransformNode(`${name}_yaw`, scene);
  yawNode.parent = root;
  yawNode.position.y = 0.52;

  const ring = reg(B.MeshBuilder.CreateCylinder(`${name}_ring`, { diameter: 1.95, height: 0.24, tessellation: 16 }, scene), barrelMat);
  ring.parent = yawNode;
  ring.position.y = 0.12;

  const pedestal = reg(B.MeshBuilder.CreateCylinder(`${name}_pedestal`, { diameterTop: 1.05, diameterBottom: 1.48, height: 1.15, tessellation: 12 }, scene), armorMat);
  pedestal.parent = yawNode;
  pedestal.position.y = 0.78;

  // Twin side trunnion cheeks supporting the elevating cradle
  for (const sx of [-0.54, 0.54]) {
    const cheek = reg(B.MeshBuilder.CreateBox(`${name}_cheek_${sx}`, { width: 0.20, height: 1.05, depth: 0.85 }, scene), armorMat);
    cheek.parent = yawNode;
    cheek.position.set(sx, 1.55, 0.05);
  }

  // Sloped WWII Gun Shield (left & right armor plates with central gun slot + angled side wings)
  for (const sx of [-0.92, 0.92]) {
    const plate = reg(B.MeshBuilder.CreateBox(`${name}_shield_${sx}`, { width: 1.18, height: 1.85, depth: 0.10 }, scene), armorMat);
    plate.parent = yawNode;
    plate.position.set(sx, 1.58, -0.78);
    plate.rotation.x = 0.22;

    const wing = reg(B.MeshBuilder.CreateBox(`${name}_wing_${sx}`, { width: 0.62, height: 1.65, depth: 0.09 }, scene), armorMat);
    wing.parent = yawNode;
    wing.position.set(sx * 1.68, 1.52, -0.56);
    wing.rotation.y = sx > 0 ? -0.45 : 0.45;
    wing.rotation.x = 0.18;
  }
  // Upper shield brow over the barrel slot
  const brow = reg(B.MeshBuilder.CreateBox(`${name}_shieldBrow`, { width: 0.72, height: 0.36, depth: 0.10 }, scene), armorMat);
  brow.parent = yawNode;
  brow.position.set(0, 2.34, -0.92);
  brow.rotation.x = 0.22;

  // Gunner seat, elevation/traverse brass handwheels & optical AA sight
  const seatPost = reg(B.MeshBuilder.CreateCylinder(`${name}_seatPost`, { diameter: 0.14, height: 0.75, tessellation: 8 }, scene), barrelMat, false);
  seatPost.parent = yawNode;
  seatPost.position.set(0.88, 0.65, 0.52);
  const seatPan = reg(B.MeshBuilder.CreateCylinder(`${name}_seatPan`, { diameter: 0.56, height: 0.08, tessellation: 10 }, scene), armorMat, false);
  seatPan.parent = yawNode;
  seatPan.position.set(0.88, 1.04, 0.52);

  for (const [wx, wy, wz] of [[0.72, 1.42, 0.22], [-0.72, 1.48, 0.18]]) {
    const wheel = reg(B.MeshBuilder.CreateTorus(`${name}_wheel_${wx}`, { diameter: 0.42, thickness: 0.055, tessellation: 12 }, scene), brassMat, false);
    wheel.parent = yawNode;
    wheel.position.set(wx, wy, wz);
    wheel.rotation.z = Math.PI * 0.5;
  }

  // 3. Elevating Cradle (pitchNode: rotates around X to aim skyward up to +80 deg!)
  const pitchNode = new B.TransformNode(`${name}_pitch`, scene);
  pitchNode.parent = yawNode;
  pitchNode.position.set(0, 1.78, 0.0);
  pitchNode.rotation.x = 0.38; // Iconic skyward AA resting elevation

  // Armored recoil cradle housing
  const cradle = reg(B.MeshBuilder.CreateBox(`${name}_cradle`, { width: 0.64, height: 0.62, depth: 2.15 }, scene), armorMat);
  cradle.parent = pitchNode;
  cradle.position.set(0, 0, -0.45);

  // Iconic twin hydraulic recuperator & recoil cylinders (top & bottom of barrel)
  for (const cy of [0.34, -0.30]) {
    const cyl = reg(B.MeshBuilder.CreateCylinder(`${name}_recup_${cy}`, { diameter: 0.24, height: 2.35, tessellation: 10 }, scene), barrelMat);
    cyl.parent = pitchNode;
    cyl.rotation.x = Math.PI * 0.5;
    cyl.position.set(0, cy, -0.55);
  }

  // Recoiling barrel assembly (slides back along +Z when firing!)
  const recoilNode = new B.TransformNode(`${name}_recoil`, scene);
  recoilNode.parent = pitchNode;

  // Breech block & loading tray
  const breech = reg(B.MeshBuilder.CreateBox(`${name}_breech`, { width: 0.54, height: 0.52, depth: 0.85 }, scene), barrelMat);
  breech.parent = recoilNode;
  breech.position.set(0, 0.02, 0.92);

  // Heavy rear jacket of the 88mm barrel
  const barrelRear = reg(B.MeshBuilder.CreateCylinder(`${name}_barrelRear`, { diameterTop: 0.28, diameterBottom: 0.38, height: 2.1, tessellation: 12 }, scene), barrelMat);
  barrelRear.parent = recoilNode;
  barrelRear.rotation.x = -Math.PI * 0.5;
  barrelRear.position.set(0, 0.02, -1.35);

  // Long slender forward rifled barrel (classic Flak 88 silhouette!)
  const barrelFront = reg(B.MeshBuilder.CreateCylinder(`${name}_barrelFront`, { diameterTop: 0.19, diameterBottom: 0.27, height: 3.35, tessellation: 12 }, scene), barrelMat);
  barrelFront.parent = recoilNode;
  barrelFront.rotation.x = -Math.PI * 0.5;
  barrelFront.position.set(0, 0.02, -4.05);

  // Brass reinforcement collar & muzzle brake ring
  const collar = reg(B.MeshBuilder.CreateCylinder(`${name}_collar`, { diameter: 0.31, height: 0.16, tessellation: 12 }, scene), brassMat, false);
  collar.parent = recoilNode;
  collar.rotation.x = -Math.PI * 0.5;
  collar.position.set(0, 0.02, -2.42);

  const muzzleRing = reg(B.MeshBuilder.CreateCylinder(`${name}_muzzleBrake`, { diameterTop: 0.26, diameterBottom: 0.24, height: 0.36, tessellation: 12 }, scene), barrelMat, false);
  muzzleRing.parent = recoilNode;
  muzzleRing.rotation.x = -Math.PI * 0.5;
  muzzleRing.position.set(0, 0.02, -5.75);

  const muzzleNode = new B.TransformNode(`${name}_muzzle`, scene);
  muzzleNode.parent = recoilNode;
  muzzleNode.position.set(0, 0.02, -6.05);

  return {
    root,
    yawNode,
    pitchNode,
    recoilNode,
    muzzleNode,
    recoil: 0,
  };
}
