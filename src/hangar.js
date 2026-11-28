import { buildRockShell } from './rockShell.js?v=mission1';
import { createRustedMetalTexture } from './textures.js?v=mission1';
export const HANGAR_FLEET_BAYS=Object.freeze([
  Object.freeze({variant:'cargo',x:-29,z:0}),Object.freeze({variant:'bomber',x:-29,z:20}),
  Object.freeze({variant:'fighter',x:-13,z:0}),Object.freeze({variant:'attacker',x:-13,z:20}),
]);
export const HANGAR_BOUNDS=Object.freeze({minX:-38,maxX:9,minZ:-9,maxZ:29,floorY:3.38,ceilingY:15.3,entranceMinZ:-9,entranceMaxZ:10.6});
// Cut a real tunnel through the rock kit, then furnish the sheltered lower deck.
export function finishRockHangar(scene, base, shadowGenerator, rockMasses) {
  const B = BABYLON;
  scene.getMeshByName('vagCatwalk')?.dispose();
  const rocks = base.group.getChildMeshes().filter(m => m.name.startsWith('vagCarrierRock_') || m === base.rockMesh);
  const material = rocks[0]?.material;
  buildRockShell(scene, base, material, rockMasses, shadowGenerator);
  for (const rock of rocks) {shadowGenerator?.removeShadowCaster(rock);rock.dispose();}
  // Cut one open stairwell through the three simple deck caps. These are small
  // convex primitives, so this bounded CSG is cheap; the rock shell uses the SDF.
  const rise = 21.73-3.38, slope = Math.atan2(rise,28);
  const stairCutter = B.MeshBuilder.CreateBox('stairwellCut', {width:44,height:60,depth:5.8},scene);
  stairCutter.rotation.z=-slope;
  stairCutter.position.set(-4+Math.sin(slope)*30,12.555+Math.cos(slope)*30-.35,-12.4);
  stairCutter.computeWorldMatrix(true);
  const channel = B.CSG.FromMesh(stairCutter);
  // The upper lift is an inset slab, not a second floor only 1 cm above the grate.
  const liftWellCutter = B.MeshBuilder.CreateBox('upperLiftInsetCut', {width:4.16,height:1.2,depth:3.36},scene);
  liftWellCutter.position.set(-8,21.55,6.5);liftWellCutter.computeWorldMatrix(true);
  const liftWell = B.CSG.FromMesh(liftWellCutter);
  for (const name of ['vagUpperCourtyard','vagUpperMossRim','vagBuildZone']) {
    const original = scene.getMeshByName(name);
    if (!original) continue;
    original.parent=null; original.computeWorldMatrix(true);
    const stairCut = B.CSG.FromMesh(original).subtract(channel);
    const carved = name === 'vagBuildZone' ? stairCut.subtract(liftWell) : stairCut;
    const cut = carved.toMesh(`${name}_stairwell`,original.material,scene);
    cut.parent=base.group; cut.receiveShadows=true;
    shadowGenerator?.removeShadowCaster(original); shadowGenerator?.addShadowCaster(cut,false);
    original.dispose();
  }
  stairCutter.dispose();liftWellCutter.dispose();
  const iron = new B.PBRMaterial('hangarRibIron', scene);
  iron.albedoColor = B.Color3.FromHexString('#6b6258'); iron.metallic = .54; iron.roughness = .52;
  if (!(scene.getEngine() instanceof B.NullEngine)) {
    const hangarTex = createRustedMetalTexture(scene, [104, 94, 84]);
    hangarTex.albedoTex.uScale = hangarTex.albedoTex.vScale = 5;
    hangarTex.bumpTex.uScale = hangarTex.bumpTex.vScale = 5;
    iron.albedoTexture = hangarTex.albedoTex;
    iron.bumpTexture = hangarTex.bumpTex;
    iron.bumpTexture.level = 0.85;
  }
  const glow = new B.StandardMaterial('hangarWarmStrip', scene);
  glow.emissiveColor = B.Color3.FromHexString('#ffcc71'); glow.disableLighting = true;
  function box(name, size, pos, mat) {
    const m = B.MeshBuilder.CreateBox(name, {width:size[0],height:size[1],depth:size[2]}, scene);
    m.parent = base.group; m.position.set(...pos); m.material = mat; m.receiveShadows = true; return m;
  }
  box('hangarInnerFloor', [38.4,.7,38.4], [-19.2,3.03,10], iron);
  const serviceDetails=[];
  // Receding ribs make the excavated volume readable from the runway.
  for (const x of [-34,-27,-20,-13,-6,1]) {
    // Inner wall faces are z=±8.9. Put ribs in the room instead of inside the wall solid.
    for (const z of [-8.67,28.77]) serviceDetails.push(box(`hangarRib_${x}_${z}`, [.38,11.5,.4], [x,9.14,z], iron));
    serviceDetails.push(box(`hangarRoofRib_${x}`, [.38,.30,37.0], [x,15.10,10], iron));
    // Paired knee braces tie the frames into the shell above the aircraft bays.
    for(const side of [-1,1]){
      const z=side<0?-7.35:27.45;
      const brace=box('hangarFrameKnee',[.22,3.75,.19],[x,13.77,z],iron);
      brace.rotation.x=side<0?.78:-.78;
      serviceDetails.push(brace);
      serviceDetails.push(box('hangarFrameTie',[.24,.14,2.18],[x,14.55,z],iron));
    }
    box(`hangarRoofLamp_${x}`, [.25,.12,24], [x,14.78,10], glow);
  }
  // Visible hoist connects both playable decks; E travels with the cabin.
  for (const z of [5.1,7.9]) box(`hangarLiftRail_${z}`, [.32,18.8,.32], [-9.5,12.5,z], iron);
  box('hangarLiftLower', [4,.18,3.2], [-8,3.5,6.5], iron);
  box('hangarLiftUpper', [4,.18,3.2], [-8,21.65,6.5], iron);
  function sign(name, text, pos, rotationY, width=5.5) {
    const tex = new B.DynamicTexture(`${name}Tex`, {width:512,height:128}, scene, false);
    tex.drawText(text, null, 86, 'bold 52px sans-serif', '#ffe4a0', '#15303c', true);
    const mat = new B.StandardMaterial(`${name}Mat`, scene); mat.diffuseTexture = tex; mat.emissiveColor.set(.45,.45,.45); mat.backFaceCulling = false;
    const panel = B.MeshBuilder.CreatePlane(name, {width,height:1.4}, scene);
    panel.parent = base.group; panel.position.set(...pos); panel.rotation.y=rotationY; panel.material=mat; panel.isPickable=false;panel.checkCollisions=false;panel.metadata={nonSolid:true}; return panel;
  }
  // The old sign at z=8.9 was exactly coplanar with the side-wall inner face.
  sign('hangarLiftSign', 'ЛИФТ ↑  E', [-7.5,6.1,8.65], 0,4.0);
  sign('hangarTitleSign', 'АНГАР 01', [8.95,14.2,0], Math.PI/2);
  // A readable rear service bay gives the tunnel a real destination, not a black occluder.
  const servicePaint=new B.PBRMaterial('hangarRearServicePaint',scene);
  servicePaint.albedoColor=B.Color3.FromHexString('#a89b88');servicePaint.metallic=.10;servicePaint.roughness=.86;
  box('hangarRearServiceBody',[.60,2.4,6.2],[-37.65,4.65,10],servicePaint);
  box('hangarRearWorkbench',[1.05,.22,6.8],[-37.20,5.96,10],iron);
  for(const z of [-2.7,-.9,.9,2.7]) {
    box(`hangarRearServiceDivider_${z}`,[.18,2.2,.12],[-37.28,4.65,z+10],iron);
    box(`hangarRearServiceLamp_${z}`,[.12,.18,.48],[-37.08,5.35,z+10],glow);
  }
  sign('hangarRearServiceSign','МАСТЕРСКАЯ 01',[-37.80,10.4,10],Math.PI/2);
  // Cable trays and pipe brackets sit against the walls, outside the central walking aisle.
  for(const z of [-8.35,28.35]) {
    serviceDetails.push(box(`hangarServiceTray_${z}`,[30,.16,.32],[-20,12.8,z],iron));
    for(const x of [-34,-27,-20,-13,-6])serviceDetails.push(box(`hangarTrayBracket_${x}_${z}`,[.18,.65,.48],[x,12.55,z],iron));
    const pipe=B.MeshBuilder.CreateCylinder(`hangarServicePipe_${z}`,{height:30,diameter:.20,tessellation:8},scene);
    pipe.parent=base.group;pipe.position.set(-20,11.7,z);pipe.rotation.z=Math.PI/2;pipe.material=iron;pipe.receiveShadows=true;serviceDetails.push(pipe);
  }
  // Four tool silhouettes on the rear board: readable lengths, not floating particle detail.
  for(const z of [-2.3,-.8,.8,2.3]) {
    serviceDetails.push(box(`hangarRearToolStem_${z}`,[.12,.85,.13],[-37.05,7.5,z+10],iron));
    serviceDetails.push(box(`hangarRearToolHead_${z}`,[.12,.22,.48],[-37.05,7.92,z+10],iron));
  }
  // Merge the fixed steel kit in the base's local frame, retaining material/geometry depth joins.
  const baseOffset=base.group.position.clone();base.group.position.setAll(0);base.group.computeWorldMatrix(true);
  serviceDetails.forEach(m=>m.computeWorldMatrix(true));
  const mergedServices=B.Mesh.MergeMeshes(serviceDetails,true,true,undefined,false,false);
  if(mergedServices){mergedServices.name='hangarMergedServiceDetails';mergedServices.parent=base.group;mergedServices.material=iron;mergedServices.receiveShadows=true;}
  base.group.position.copyFrom(baseOffset);

  if (!(scene.getEngine() instanceof B.NullEngine)) {
    for (const x of [-31,-16,1]) {
      const l = new B.PointLight(`hangarInteriorLight_${x}`, new B.Vector3(x,11,10), scene);
      l.parent=base.group; l.diffuse=B.Color3.FromHexString('#ffcf86'); l.intensity=1.6; l.range=18;
    }
  }
  // A continuous walkable service stair alongside the rock, from apron to courtyard (merged into 2 draw calls!).
  const stairGlow = new B.StandardMaterial('stairEdgeAmber', scene);
  stairGlow.diffuseColor = B.Color3.FromHexString('#dcb359');
  const count = 56, startX = 10, endX = -18;
  const stairStepMeshes = [], stairStripeMeshes = [];
  for (let i=0;i<count;i++) {
    const x = startX + (endX-startX)*(i+.5)/count;
    const y = 3.38 + rise*(i+1)/count;
    stairStepMeshes.push(box(`hangarServiceStep_${i}`, [.51,.34,3.6], [x,y-.17,-12.4], iron));
    if (i%4===0) stairStripeMeshes.push(box(`hangarStepStripe_${i}`, [.08,.025,3.5], [x+.20,y+.025,-12.4], stairGlow));
  }
  stairStepMeshes.push(box('hangarStairEntry', [5,.32,4.2], [10,3.22,-12.1], iron));
  for (const z of [-14.5,-10.3]) {
    const rail = box(`hangarStairRail_${z}`, [34,.15,.15], [-4,13.55,z], iron);
    rail.rotation.z = -Math.atan2(rise,28);
    stairStepMeshes.push(rail);
  }
  const stairOff = base.group.position.clone(); base.group.position.setAll(0); base.group.computeWorldMatrix(true);
  stairStepMeshes.forEach(m => m.computeWorldMatrix(true));
  stairStripeMeshes.forEach(m => m.computeWorldMatrix(true));
  const mergedSteps = B.Mesh.MergeMeshes(stairStepMeshes, true, true, undefined, false, false);
  if (mergedSteps) { mergedSteps.name = 'hangarMergedStairs'; mergedSteps.parent = base.group; mergedSteps.material = iron; mergedSteps.receiveShadows = true; }
  const mergedStripes = B.Mesh.MergeMeshes(stairStripeMeshes, true, true, undefined, false, false);
  if (mergedStripes) { mergedStripes.name = 'hangarMergedStairStripes'; mergedStripes.parent = base.group; mergedStripes.material = stairGlow; mergedStripes.receiveShadows = false; mergedStripes.isPickable = false; }
  base.group.position.copyFrom(stairOff);
  // Lateral wall plaque; nothing spans the stair or upper exit.
  const stairSign=sign('hangarStairSign', 'ПАЛУБА ←', [9.5,5.3,-8.55],0,3.2);
  const oldSurface = base.getLocalSurfaceY;
  base.getLocalSurfaceY = (x,z,y=3.38) => {
    if (x>=-18.5 && x<=12.5 && z>=-14.6 && z<=-9.1) return 3.38+Math.max(0,Math.min(1,(10-x)/28))*rise;
    if(y<14 && x>=-38 && x<=9 && z>=-9 && z<=29)return 3.38;
    return oldSurface(x,z,y);
  };
  base.padLocalPos.set(-3,3.38,0);
  base.playerSpawnLocal.set(2,3.38,-5.5);
  // Keep pilots inside the excavated lower level, with space behind parked aircraft.
  const oldClamp = base.clampWalkPos;
  base.clampWalkPos = p => {
    if (p.x>=-18.5 && p.x<=12.5 && p.z>=-14.4 && p.z<=-8.5) return;
    if (p.y>14) oldClamp(p);
    else {p.x=Math.max(-36.8,Math.min(54.8,p.x));p.z=Math.max(-8.4,Math.min(p.x<2.4?28.4:8.9,p.z));}
  };
}
