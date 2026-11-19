/**
 * Detailed 3D Missile Factory with cached PBR materials and safe TrailMesh anchor.
 * Always provides `root._trailAnchor` (a real Mesh) and `initMissileTrail()` so
 * TrailMesh never stretches from world origin (0,0,0) across the viewport.
 */

export function createDetailedMissile(scene, name, scale, bodyHex, noseHex, flameMat) {
  const root = new BABYLON.TransformNode(name, scene);
  const key = `mslMat_${bodyHex}_${noseHex}`;
  scene._sharedMissileMats ||= {};
  if (!scene._sharedMissileMats[key] || scene._sharedMissileMats[key].body.isDisposed) {
    const body = new BABYLON.PBRMaterial(`${key}_b`, scene);
    body.albedoColor = BABYLON.Color3.FromHexString(bodyHex);
    body.metallic = 0.55;
    body.roughness = 0.36;
    const nose = new BABYLON.PBRMaterial(`${key}_n`, scene);
    nose.albedoColor = BABYLON.Color3.FromHexString(noseHex);
    nose.emissiveColor = BABYLON.Color3.FromHexString(noseHex).scale(0.35);
    nose.metallic = 0.35;
    nose.roughness = 0.32;
    scene._sharedMissileMats[key] = { body, nose };
  }
  const { body: bodyMat, nose: noseMat } = scene._sharedMissileMats[key];

  const cyl = BABYLON.MeshBuilder.CreateCylinder(`${name}_body`, { diameter: 0.42 * scale, height: 2.2 * scale, tessellation: 10 }, scene);
  cyl.parent = root;
  cyl.material = bodyMat;
  cyl.isPickable = false;

  const cone = BABYLON.MeshBuilder.CreateCylinder(`${name}_nose`, { diameterTop: 0.02 * scale, diameterBottom: 0.42 * scale, height: 0.85 * scale, tessellation: 10 }, scene);
  cone.parent = root;
  cone.position.y = 1.52 * scale;
  cone.material = noseMat;
  cone.isPickable = false;

  for (let fi = 0; fi < 2; fi++) {
    const fin = BABYLON.MeshBuilder.CreateBox(`${name}_fin_${fi}`, { width: 1.05 * scale, height: 0.55 * scale, depth: 0.05 * scale }, scene);
    fin.parent = root;
    fin.position.y = -0.82 * scale;
    fin.rotation.y = fi * Math.PI * 0.5;
    fin.material = noseMat;
    fin.isPickable = false;
  }

  const plume = BABYLON.MeshBuilder.CreateCylinder(`${name}_plume`, { diameterTop: 0.38 * scale, diameterBottom: 0.04 * scale, height: 1.45 * scale, tessellation: 8 }, scene);
  plume.parent = root;
  plume.position.y = -1.78 * scale;
  plume.material = flameMat;
  plume.isPickable = false;

  root._trailAnchor = plume;
  return root;
}

export function attachSafeTrail(scene, name, ownerNode, width, length, material) {
  if (typeof BABYLON.TrailMesh !== 'function' || !ownerNode) return null;
  const anchor = ownerNode._trailAnchor || ownerNode;
  ownerNode.computeWorldMatrix(true);
  if (anchor !== ownerNode) anchor.computeWorldMatrix(true);
  const trail = new BABYLON.TrailMesh(name, anchor, scene, width, length, true);
  trail.material = material;
  trail.isPickable = false;
  return trail;
}
