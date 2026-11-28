import { installLiftPropellers } from './liftPropellers.js';
/**
 * Heavy Interwar Sky-Battleship «Колосс» (inspired by HMS Nelson / Rodney, 1927):
 * Signature "all-forward" main armament (3 triple 16-inch turrets A, B, X forward of a towering
 * Queen Anne's Mansion citadel bridge, single raked funnel aft, and working AA wing mounts).
 * Built with lofted hull, flat-shaded beveled deckhouses, batched materials, and destructible subsystems.
 */
import { createLoftedHull } from './flightDeckCruiser.js';

export function buildHeavyBattleship(scene) {
  const B = BABYLON;
  const root = new B.TransformNode('colossusBattleship', scene);
  const mat = name => scene.getMaterialByName('cfCruiser' + name + 'Mat');
  const mats = {
    hull: mat('Hull'),
    crimson: mat('Crimson') || mat('HullDark'),
    white: mat('White'),
    deckSteel: mat('DeckSteel') || mat('HullDark'),
  };

  // 215-meter heavy battleship hull (bow faces -X, broad armored beam 32m, deep keel)
  const stations = [
    [-108,  0.4, 10.2,  -1.5],
    [ -98,  5.6,  9.4,  -6.8],
    [ -80, 11.4,  8.8, -10.4],
    [ -52, 15.6,  8.4, -12.6],
    [ -16, 16.4,  8.2, -13.2],
    [  28, 16.2,  8.2, -13.0],
    [  62, 14.4,  8.0, -11.6],
    [  86, 10.4,  7.8,  -8.8],
    [ 102,  5.8,  7.6,  -5.6],
    [ 107,  3.2,  7.5,  -3.6],
  ].map(([x, w, y, k]) => ({
    x,
    halfBeamTop: w,
    halfBeamMid: w * 0.92,
    halfBeamKeel: w * 0.42,
    yTop: y,
    yMid: 0.8,
    yKeel: k,
  }));
  createLoftedHull(scene, 'colossusHull', stations, mats, root, null, { decorate: false, bowRake: 3.4 });

  const groups = new Map();
  const add = (finish, mesh, x, y, z) => {
    mesh.position.set(x, y, z);
    if (!groups.has(finish)) groups.set(finish, []);
    groups.get(finish).push(mesh);
    return mesh;
  };

  function drum(finish, x, y, z, rx, rz, height, taper = 1, sides = 14, rake = 0) {
    const m = B.MeshBuilder.CreateCylinder('colDrum', { height, diameterBottom: 2, diameterTop: 2 * taper, tessellation: sides }, scene);
    m.scaling.set(rx, 1, rz);
    m.rotation.z = rake;
    return add(finish, m, x, y, z);
  }

  function spar(finish, from, to, radius, endRadius = radius) {
    const a = B.Vector3.FromArray(from), b = B.Vector3.FromArray(to), axis = b.subtract(a);
    const m = B.MeshBuilder.CreateCylinder('colSpar', { height: axis.length(), diameterBottom: radius * 2, diameterTop: endRadius * 2, tessellation: 7 }, scene);
    m.rotationQuaternion = B.Quaternion.FromUnitVectorsToRef(B.Axis.Y, axis.normalize(), new B.Quaternion());
    const mid = a.add(b).scale(0.5);
    return add(finish, m, mid.x, mid.y, mid.z);
  }

  function house(finish, fore, aft, beam, bottom, top, cut, taper = 1) {
    const plan = [
      [fore, -beam * 0.6], [fore + cut, -beam], [aft - 0.9, -beam], [aft, -beam * 0.85],
      [aft, beam * 0.85], [aft - 0.9, beam], [fore + cut, beam], [fore, beam * 0.6],
    ];
    const center = (fore + aft) / 2, positions = [], indices = [];
    for (const [y, factor] of [[bottom, 1], [top, taper]]) {
      for (const [x, z] of plan) positions.push(center + (x - center) * factor, y, z * factor);
    }
    for (let i = 0; i < 8; i++) {
      const next = (i + 1) % 8;
      indices.push(i, next, next + 8, i, next + 8, i + 8);
      if (i > 0 && i < 7) indices.push(8, 8 + i, 9 + i);
    }
    const mesh = new B.Mesh('colHouse', scene), data = new B.VertexData();
    data.positions = positions; data.indices = indices; data.normals = [];
    data.uvs = positions.flatMap((v, i) => (i % 3 === 0 ? [v / 12, (positions[i + 1] + positions[i + 2]) / 12] : []));
    B.VertexData.ComputeNormals(positions, indices, data.normals);
    data.applyToMesh(mesh);
    mesh.convertToFlatShadedMesh();
    return add(finish, mesh, 0, 0, 0);
  }

  // 1. Iconic HMS Nelson "Queen Anne's Mansion" towering armored bridge citadel (placed AFT of the 3 main turrets!)
  house('Hull',      14, 52, 10.6,  8.0, 15.2, 4.5, 0.96);
  house('HullDark',  18, 46,  8.6, 15.0, 22.8, 3.8, 0.92);
  house('DeckSteel', 17, 45,  9.8, 22.7, 23.5, 4.2, 1.0);
  house('Hull',      20, 40,  7.2, 23.4, 30.8, 3.2, 0.90);
  house('DarkSteel', 21, 36,  5.6, 30.7, 34.4, 2.4, 0.88);
  // Armored main fire-control director & rangefinder atop the citadel (y = 36m!)
  drum('HullDark', 26, 36.2, 0, 2.8, 2.4, 3.2, 0.9, 12);
  spar('Hull', [26, 37.8, -5.8], [26, 37.8, 5.8], 0.85);
  // Aft mast rising cleanly behind the citadel
  spar('DarkSteel', [38, 23, 0], [41, 49, 0], 0.52, 0.14);
  spar('DarkSteel', [40, 41, -8.5], [40, 41, 8.5], 0.18);
  spar('DarkSteel', [40.4, 45, -5.2], [40.4, 45, 5.2], 0.14);

  // 2. Single massive raked Nelson-style battleship funnel aft of the bridge (x = 58)
  drum('HullDark', 58, 11.2, 0, 5.4, 4.2, 6.2, 0.94, 14);
  drum('Hull',     60, 21.5, 0, 4.5, 3.2, 16.5, 0.98, 18, -0.14);
  drum('Crimson',  61.2, 25.8, 0, 4.65, 3.35, 2.8, 1.0, 18, -0.14);
  drum('DarkSteel',61.8, 29.8, 0, 4.6, 3.3, 2.4, 1.02, 18, -0.14);
  spar('Brass',    [54.2, 12.0, 0], [56.8, 29.2, 0], 0.34);

  // 3. Aft secondary 6-inch twin turrets flanking the funnel & quarterdeck
  for (const side of [-1, 1]) {
    for (const sx of [56, 72]) {
      drum('HullDark', sx, 9.4, side * 9.8, 2.6, 2.4, 2.2);
      house('Hull', sx - 2.6, sx + 2.8, 2.3, 10.4, 12.6, 1.1, 0.85);
      for (const bz of [-0.65, 0.65]) {
        spar('DarkSteel', [sx + 2.2, 11.6, side * 9.8 + bz], [sx + 8.6, 12.1, side * 9.8 + bz], 0.24, 0.16);
      }
    }
    // Bridge wing glowing navigation strips + armored portholes
    for (const wx of [22, 28, 34]) {
      spar('AmberGlow', [wx - 0.8, 26.8, side * 7.25], [wx + 0.8, 26.8, side * 7.25], 0.28);
    }
    // Diagonal white-crimson bow insignia band on the dreadnought prow
    const bandW = B.MeshBuilder.CreateBox('colBandW', { width: 6.2, height: 11.5, depth: 0.45 }, scene);
    bandW.rotation.set(side * 0.14, side * 0.28, 0.24);
    add('White', bandW, -86, 3.8, side * 9.6);
    const bandC = B.MeshBuilder.CreateBox('colBandC', { width: 3.8, height: 11.8, depth: 0.56 }, scene);
    bandC.rotation.set(side * 0.14, side * 0.28, 0.24);
    add('Crimson', bandC, -86, 3.8, side * 9.72);
  }

  // Crimson battle ensign streaming from the aft mast
  const flag = B.MeshBuilder.CreateRibbon('colossusEnsign', {
    pathArray: [
      [[41.0, 48.4, 0], [44.2, 47.9, 0.35], [47.8, 48.1, -0.25]],
      [[41.0, 46.2, 0], [44.2, 46.4, 0.35], [47.4, 46.9, -0.25]],
    ].map(row => row.map(p => B.Vector3.FromArray(p))),
    sideOrientation: B.Mesh.DOUBLESIDE,
  }, scene);
  add('Crimson', flag, 0, 0, 0);

  // Merge static batches by material
  for (const [finish, meshes] of groups) {
    const batch = B.Mesh.MergeMeshes(meshes, true, true);
    if (!batch) continue;
    batch.name = 'colossus' + finish;
    batch.material = mat(finish) || mats.hull;
    batch.parent = root;
    batch.isPickable = false;
    batch.receiveShadows = true;
  }

  // 4. THREE Animated All-Forward Triple 16-inch Main Turrets (A, B, X — exact HMS Nelson silhouette!)
  root.mainTurrets = [];
  const turretSpecs = [
    { id: 'A', x: -72, y: 9.2,  elev: 0.12 },
    { id: 'B', x: -46, y: 13.4, elev: 0.14 },
    { id: 'X', x: -20, y: 10.6, elev: 0.10 },
  ];
  for (const t of turretSpecs) {
    const barbH = Math.max(1.6, t.y - 7.8);
    const barb = B.MeshBuilder.CreateCylinder(`colBarb_${t.id}`, { diameter: 11.8, height: barbH, tessellation: 16 }, scene);
    barb.parent = root; barb.position.set(t.x, 7.8 + barbH * 0.5, 0); barb.material = mats.hull; barb.isPickable = false;

    const yawPivot = new B.TransformNode(`colTurretYaw_${t.id}`, scene);
    yawPivot.parent = root;
    yawPivot.position.set(t.x, t.y, 0);

    const hParts = [];
    const body = B.MeshBuilder.CreateBox(`colTHouse_${t.id}`, { width: 12.8, height: 4.2, depth: 10.4 }, scene);
    body.position.set(1.2, 2.2, 0); hParts.push(body);
    const glacis = B.MeshBuilder.CreateBox(`colTGlacis_${t.id}`, { width: 3.4, height: 4.0, depth: 10.0 }, scene);
    glacis.position.set(-5.6, 2.0, 0); glacis.rotation.z = 0.36; hParts.push(glacis);
    const houseMerged = B.Mesh.MergeMeshes(hParts, true, true);
    if (houseMerged) {
      houseMerged.name = `colTurretBody_${t.id}`;
      houseMerged.parent = yawPivot;
      houseMerged.material = mats.hull;
      houseMerged.isPickable = false;
    }

    const pitchPivot = new B.TransformNode(`colTurretPitch_${t.id}`, scene);
    pitchPivot.parent = yawPivot;
    pitchPivot.position.set(-6.8, 2.6, 0);
    pitchPivot.rotation.z = -t.elev;

    const bParts = [];
    for (const bz of [-2.5, 0, 2.5]) {
      const barrel = B.MeshBuilder.CreateCylinder(`colTBar_${t.id}_${bz}`, { diameterTop: 0.48, diameterBottom: 0.80, height: 19.5, tessellation: 10 }, scene);
      barrel.position.set(-9.6, 0, bz); barrel.rotation.z = Math.PI * 0.5; bParts.push(barrel);
    }
    const barMerged = B.Mesh.MergeMeshes(bParts, true, true);
    if (barMerged) {
      barMerged.name = `colTurretBarrels_${t.id}`;
      barMerged.parent = pitchPivot;
      barMerged.material = mat('DarkSteel') || mats.deckSteel;
      barMerged.isPickable = false;
    }
    root.mainTurrets.push({ id: t.id, yawPivot, pitchPivot, baseElev: t.elev });
  }

  // 5. Working Anti-Aircraft Wing Mounts on bridge flanks (same interface as pursuitDestroyer.js!)
  root.antiAircraftMounts = [];
  for (const side of [-1, 1]) {
    const swivel = new B.TransformNode(`colAA_${side}`, scene);
    swivel.parent = root;
    swivel.position.set(28, 24.2, side * 9.8);
    const pivot = new B.TransformNode(`colAAPivot_${side}`, scene);
    pivot.parent = swivel;
    pivot.position.y = 0.9;
    const gun = B.MeshBuilder.CreateCylinder(`colAAGun_${side}`, { diameterTop: 0.18, diameterBottom: 0.28, height: 4.2, tessellation: 8 }, scene);
    gun.parent = pivot; gun.position.set(-1.8, 0, 0); gun.rotation.z = Math.PI * 0.5;
    gun.material = mat('DarkSteel') || mats.deckSteel; gun.isPickable = false;
    root.antiAircraftMounts.push({ side, swivel, pivot });
  }

  // 6. Three Destructible Combat Subsystems (for Dover Convoy mission & torpedo/bomb strikes!)
  root.subsystems = [
    { id: 'bow_battery',  name: 'Носовая батарея ГК', localPos: new B.Vector3(-52, 14, 0), hp: 220, maxHp: 220, alive: true },
    { id: 'citadel',      name: 'Цитадель и мостик',  localPos: new B.Vector3( 28, 26, 0), hp: 260, maxHp: 260, alive: true },
    { id: 'propulsion',   name: 'Кормовые турбины',   localPos: new B.Vector3( 62, 16, 0), hp: 220, maxHp: 220, alive: true },
  ];
  root.hp = 900;
  root.maxHp = 900;
  root.alive = true;

  root.liftDrive=installLiftPropellers(root,[
    {x:-60,y:-15,offset:16,radius:12,anchorY:-4,anchorZ:8},
    {x:0,y:-17,offset:19,radius:14,anchorY:-5,anchorZ:9},
    {x:66,y:-14,offset:15,radius:12,anchorY:-4,anchorZ:7}
  ],{mount:mat('HullDark'),blade:mat('White')});
  return root;
}
