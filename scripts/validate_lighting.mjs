import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON;Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const element=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:1280,height:800})});
globalThis.document={createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};
globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};
const {deriveAircraftLightSockets}=await import('../src/explorerAircraft.js');
const {PracticalLights}=await import('../src/practicalLights.js');
const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');
const {AsteroidBase}=await import('../src/asteroidBase.js');
const report={checks:[],variants:[]};let failures=0;
function check(name,fn){try{const evidence=fn();report.checks.push({name,status:'pass',evidence});}catch(error){failures++;report.checks.push({name,status:'fail',error:error.message});}}
const engine=new B.NullEngine({renderWidth:1280,renderHeight:800}),scene=new B.Scene(engine);scene.useRightHandedSystem=true;
const camera=new B.FreeCamera('qaCamera',new B.Vector3(70,100,100),scene);camera.setTarget(new B.Vector3(0,40,0));
const world=new SkyArchipelagoWorld(scene,'LIGHTING-QA-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);
const ship={group:new B.TransformNode('qaAircraftGroup',scene),aircraftLightSockets:null};ship.group.position.set(0,100,0);
const practical=new PracticalLights(scene,world,base,ship);practical.update(.016);
const prepare=()=>{for(const mesh of scene.meshes)mesh.computeWorldMatrix(true);scene.updateTransformMatrix(true);};prepare();
check('Runway edge and threshold emitters sit above the actual deck and are not enclosed by old posts',()=>{
 const deck=scene.getMeshByName('vagCarrierRunway');deck.computeWorldMatrix(true);const height=deck.getBoundingInfo().boundingBox.maximumWorld.y;
 assert(practical.runwayFixtures.length>=28);let minimum=Infinity;
 for(const {lens,housing}of practical.runwayFixtures){lens.computeWorldMatrix(true);housing.computeWorldMatrix(true);const bottom=lens.getBoundingInfo().boundingBox.minimumWorld.y;minimum=Math.min(minimum,bottom-height);assert(bottom>height+.015,`${lens.name} buried: bottom=${bottom}, deck=${height}`);assert(lens.parent===base.group);assert(lens.isEnabled());assert(housing.isEnabled());}
 const obsolete=base.group.getChildMeshes().filter(m=>/^vagRwLamp_/.test(m.name));assert(obsolete.length>=14);assert(obsolete.every(m=>!m.isVisible));
 return {actualDeckY:height,fixtures:practical.runwayFixtures.length,minimumEmitterClearance:minimum,occludedLegacySpheresHidden:obsolete.length};
});
check('All hangar point lights are in the material light budget after a late floor material replacement',()=>{
 const floor=scene.getMeshByName('hangarInnerFloor');assert(floor);
 floor.material=new B.PBRMaterial('qaLateFloorMaterial',scene);assert.equal(floor.material.maxSimultaneousLights,4);
 practical.update(.6);prepare();
 assert.equal(floor.material.maxSimultaneousLights,3+practical._hangarLights.length);
 const selected=floor._lightSources.slice(0,floor.material.maxSimultaneousLights),intended=practical._hangarLights;
 assert.equal(intended.length,5);assert(intended.every(l=>l.canAffectMesh(floor)));
 assert(intended.every(l=>selected.includes(l)),`Shader slots: ${selected.map(l=>l.name)}`);
 const legacy=scene.lights.filter(l=>l.getTypeID()===B.Light.LIGHTTYPEID_POINTLIGHT&&!intended.includes(l));assert(legacy.every(l=>!l.canAffectMesh(floor)));
 const outside=B.MeshBuilder.CreateBox('qaFarOutside',{size:1},scene);outside.position.set(9999,9999,9999);assert(intended.every(l=>!l.canAffectMesh(outside)));outside.dispose();
 return {selectedLightNames:selected.map(l=>l.name),intendedPointLights:intended.map(l=>l.name),materialMaxLights:floor.material.maxSimultaneousLights,excludedLegacyPoints:legacy.length};
});
check('Hangar lights have a downward incident-light path onto the floor, with finite local range and no point shadow maps',()=>{
 const point=B.Vector3.TransformCoordinates(new B.Vector3(-8,3.38,0),base.group.getWorldMatrix());let incident=0;
 for(const light of practical._hangarLights){
  const source=B.Vector3.TransformCoordinates(light.position,base.group.getWorldMatrix()),delta=source.subtract(point),distance=delta.length();
  assert(delta.y>0);assert(light.position.y-3.38<light.range,'Each light reaches its own floor bay');assert.equal(light.shadowEnabled,false);assert.equal(light.intensityMode,B.Light.INTENSITYMODE_LUMINOUSINTENSITY);
  if(distance<light.range)incident+=light.intensity/(distance*distance)*Math.max(0,delta.y/distance)*(light.diffuse.r*.2126+light.diffuse.g*.7152+light.diffuse.b*.0722);
 }
 assert(incident>1,`Incident warm light too low: ${incident}`);return {floorWorldPoint:point.asArray(),unoccludedIncidentLuxEstimate:incident,pointShadowMaps:0};
});
function loadAirframe(file,root){
 const raw=fs.readFileSync(new URL(`../assets/aircraft/${file}`,import.meta.url)),length=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+length)),binary=raw.subarray(28+length);
 const node=doc.nodes.find(n=>n.name==='airframe'),primitive=doc.meshes[node.mesh].primitives[0];
 const read=index=>{const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],components={SCALAR:1,VEC3:3}[a.type],bytes={5126:4,5125:4,5123:2,5121:1}[a.componentType],start=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||bytes*components,out=[];for(let i=0;i<a.count;i++)for(let k=0;k<components;k++){const at=start+i*stride+k*bytes;out.push(a.componentType===5126?binary.readFloatLE(at):a.componentType===5125?binary.readUInt32LE(at):a.componentType===5123?binary.readUInt16LE(at):binary.readUInt8(at));}return out;};
 const positions=read(primitive.attributes.POSITION),indices=read(primitive.indices),mesh=new B.Mesh('airframe',scene),data=new B.VertexData();data.positions=positions;data.indices=indices;data.normals=read(primitive.attributes.NORMAL);data.applyToMesh(mesh);mesh.parent=root;
 if(node.translation)mesh.position.set(...node.translation);if(node.rotation)mesh.rotationQuaternion=B.Quaternion.FromArray(node.rotation);if(node.scale)mesh.scaling.set(...node.scale);mesh.computeWorldMatrix(true);
 return {mesh,positions,indices};
}
// Closest point on triangle (Voronoi-region test), used against actual GLB faces.
function triangleDistance(point,a,b,c){
 const ab=b.subtract(a),ac=c.subtract(a),ap=point.subtract(a),d1=B.Vector3.Dot(ab,ap),d2=B.Vector3.Dot(ac,ap);if(d1<=0&&d2<=0)return B.Vector3.Distance(point,a);
 const bp=point.subtract(b),d3=B.Vector3.Dot(ab,bp),d4=B.Vector3.Dot(ac,bp);if(d3>=0&&d4<=d3)return B.Vector3.Distance(point,b);
 const vc=d1*d4-d3*d2;if(vc<=0&&d1>=0&&d3<=0)return B.Vector3.Distance(point,a.add(ab.scale(d1/(d1-d3))));
 const cp=point.subtract(c),d5=B.Vector3.Dot(ab,cp),d6=B.Vector3.Dot(ac,cp);if(d6>=0&&d5<=d6)return B.Vector3.Distance(point,c);
 const vb=d5*d2-d1*d6;if(vb<=0&&d2>=0&&d6<=0)return B.Vector3.Distance(point,a.add(ac.scale(d2/(d2-d6))));
 const va=d3*d6-d5*d4;if(va<=0&&(d4-d3)>=0&&(d5-d6)>=0)return B.Vector3.Distance(point,b.add(c.subtract(b).scale((d4-d3)/((d4-d3)+(d5-d6)))));
 const inverse=1/(va+vb+vc),v=vb*inverse,w=vc*inverse;return B.Vector3.Distance(point,a.add(ab.scale(v)).add(ac.scale(w)));
}
let lastRoot=null;
for(const [variant,file]of [['cargo','scrapyard_plane.glb'],['fighter','scrapyard_fighter.glb'],['bomber','scrapyard_bomber.glb'],['attacker','scrapyard_attacker.glb']]){
 check(`${variant}: navigation fittings touch actual wing/tail/roof faces and rebind to the loaded variant`,()=>{
  const oldFixtures=[...practical.aircraftFixtures];if(lastRoot)lastRoot.dispose();
  const root=new B.TransformNode(`acGlbRoot_${variant}`,scene);root.parent=ship.group;root.position.y=-.72;ship.group.rotationQuaternion=B.Quaternion.RotationYawPitchRoll(.8,.2,-.1);
  const {mesh,positions,indices}=loadAirframe(file,root);root.computeWorldMatrix(true);
  const sockets=deriveAircraftLightSockets([mesh],root,variant);assert(sockets);ship.aircraftLightSockets=sockets;practical.update(.016);prepare();
  assert.equal(practical.aircraftFixtures.length,4);assert(practical.aircraftFixtures.every(f=>f.lens.parent===root&&f.housing.parent===root));assert(oldFixtures.every(f=>f.lens.isDisposed()&&f.housing.isDisposed()));
  // Sockets are model-root local. Imported airframes may carry a non-unit node scale.
  const toRoot = mesh.getWorldMatrix().multiply(root.getWorldMatrix().clone().invert());
  const modelVerts = [];
  for(let i=0;i<positions.length;i+=3)modelVerts.push(B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,i),toRoot));
  const distances={};for(const name of ['port','starboard','tail','beacon']){
   const point=B.Vector3.FromArray(sockets[name].surface);let minimum=Infinity;
   for(let i=0;i<indices.length;i+=3){minimum=Math.min(minimum,triangleDistance(point,modelVerts[indices[i]],modelVerts[indices[i+1]],modelVerts[indices[i+2]]));}
   distances[name]=minimum;assert(minimum<.055,`${name} mount floats ${minimum}m away from airframe`);
  }
  for(const [index,name]of ['port','starboard','tail','beacon'].entries()){
   const fitting=practical.aircraftFixtures[index],surface=B.Vector3.FromArray(sockets[name].surface),normal=B.Vector3.FromArray(sockets[name].normal),inverse=root.getWorldMatrix().clone().invert();
   const extents=visual=>{visual.computeWorldMatrix(true);const matrix=visual.getWorldMatrix().multiply(inverse),vertices=visual.getVerticesData(B.VertexBuffer.PositionKind);let min=Infinity,max=-Infinity;for(let i=0;i<vertices.length;i+=3){const p=B.Vector3.TransformCoordinates(B.Vector3.FromArray(vertices,i),matrix);const value=B.Vector3.Dot(p.subtract(surface),normal);min=Math.min(min,value);max=Math.max(max,value);}return {min,max};};
   const housing=extents(fitting.housing),lens=extents(fitting.lens);
   assert(housing.min<-.015&&housing.max>.035,`${name} housing is not embedded in mount face`);
   assert(lens.min<housing.max&&lens.max>housing.max,`${name} lens does not overlap its physical housing`);
  }
  assert(sockets.port.surface[0]<0&&sockets.starboard.surface[0]>0);assert.equal(practical.aircraftFixtures[0].lens.material,practical.red);assert.equal(practical.aircraftFixtures[1].lens.material,practical.green);
  const evidence={variant,bounds:sockets.bounds,surfaceDistance:distances,sockets:Object.fromEntries(['port','starboard','tail','beacon'].map(k=>[k,sockets[k].surface])),rootOffsetY:root.position.y};report.variants.push(evidence);lastRoot=root;return evidence;
 });
}
check('Signal materials use linear emissive colors and avoid an extra unlit diffuse term',()=>{
 assert(practical.red._practicalBaseColor.equalsWithEpsilon(B.Color3.FromHexString('#bc3024').toLinearSpace(),1e-6));assert(practical.red.diffuseColor.equals(B.Color3.Black()));assert(practical.red.disableLighting);return {redLinear:practical.red._practicalBaseColor.asArray(),diffuse:practical.red.diffuseColor.asArray()};
});
practical.dispose();scene.dispose();engine.dispose();
report.passed=report.checks.length-failures;report.failed=failures;fs.mkdirSync('artifacts/deploy-20261114',{recursive:true});fs.writeFileSync('artifacts/deploy-20261114/lighting-validation.json',JSON.stringify(report,null,2)+'\n');
for(const row of report.checks)console.log(`${row.status.toUpperCase()} ${row.name}${row.error?': '+row.error:''}`);
if(failures)process.exitCode=1;
