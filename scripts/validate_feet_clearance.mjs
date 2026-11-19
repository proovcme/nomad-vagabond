import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire}from'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const el=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}}});globalThis.document={createElement:el,getElementById:el,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};

const {ExplorerAircraft,deriveAircraftLightSockets}=await import('../src/explorerAircraft.js');
const {CollisionWorld,makeSolid}=await import('../src/collisions.js');
const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');
const {AsteroidBase}=await import('../src/asteroidBase.js');
const {NavigatorPlayer}=await import('../src/player.js');
const FILES={cargo:'scrapyard_plane.glb',fighter:'scrapyard_fighter.glb',bomber:'scrapyard_bomber.glb',attacker:'scrapyard_attacker.glb'};
const report={checks:[]};let failures=0;const audio=new Proxy({},{get:()=>()=>{}});const engines=[];
function check(name,fn){try{const evidence=fn();report.checks.push({name,status:'pass',evidence});}catch(error){failures++;report.checks.push({name,status:'fail',error:error.message});}}
function bare(){const engine=new B.NullEngine({renderWidth:800,renderHeight:600});engines.push(engine);const scene=new B.Scene(engine);scene.useRightHandedSystem=true;const camera=new B.FreeCamera('camera',new B.Vector3(10,10,10),scene);camera.setTarget(B.Vector3.Zero());scene.collisionWorld=new CollisionWorld(scene);return {engine,scene,camera};}
check('Character sweep covers boots through head, blocks a low wing horizontally and never pushes boots below the solid floor',()=>{
 const{scene}=bare(),collision=scene.collisionWorld;
 const floor=B.MeshBuilder.CreateBox('qaFloor',{width:30,height:1,depth:30},scene);floor.position.y=-.5;makeSolid(floor);
 const wing=B.MeshBuilder.CreateBox('qaLowWing',{width:3,height:.12,depth:5},scene);wing.position.y=1.45;makeSolid(wing);scene.meshes.forEach(m=>m.computeWorldMatrix(true));
 const result=collision.moveGrounded(new B.Vector3(-5,0,0),new B.Vector3(5,0,0),{grounded:true,floorAt:()=>0});
 assert.equal(collision.foot.ellipsoidOffset.y-collision.foot.ellipsoid.y,0);assert.equal(collision.foot.ellipsoidOffset.y+collision.foot.ellipsoid.y,1.85);
 assert(result.x<-1.5,`Passed under the low wing: ${result.asArray()}`);assert(result.y>=-.012,`Boots below floor: ${result.y}`);
 scene.dispose();return {resolved:result.asArray(),bodyHeight:1.85,bottomOffset:0};
});
check('A grounded NavigatorPlayer remains above the floor while holding movement against a low overhang',()=>{
 const{scene,camera}=bare();const floor=B.MeshBuilder.CreateBox('qaFloor',{width:30,height:1,depth:30},scene);floor.position.y=-.5;makeSolid(floor);const wing=B.MeshBuilder.CreateBox('qaLowWing',{width:3,height:.12,depth:5},scene);wing.position.y=1.45;makeSolid(wing);
 const group=new B.TransformNode('base',scene),base={group,velocity:B.Vector3.Zero(),prevPos:B.Vector3.Zero(),plateauY:0,padLocalPos:new B.Vector3(50,0,50),getLocalSurfaceY:()=>0,clampWalkPos(){},colliders:[]};group.computeWorldMatrix(true);scene.meshes.forEach(m=>m.computeWorldMatrix(true));
 const player=new NavigatorPlayer(scene,camera,audio);player.placeOnAsteroid(base,new B.Vector3(-5,0,0));player.keys={KeyD:true};let minimum=Infinity;
 for(let i=0;i<240;i++){player.update(1/60,{dockedAsteroid:null,group:{position:new B.Vector3(100,0,0)}},i/60);minimum=Math.min(minimum,player.localPos.y);}
 assert(minimum>=-.012);assert(player.localPos.x<-1.5);scene.dispose();return {minimumBootY:minimum,end:player.localPos.asArray()};
});
function loadGLB(aircraft,variant,scene){
 const raw=fs.readFileSync(new URL(`../assets/aircraft/${FILES[variant]}`,import.meta.url)),length=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+length)),binary=raw.subarray(28+length);
 const read=index=>{const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],bytes={5126:4,5125:4,5123:2,5121:1}[a.componentType],start=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||bytes*components,out=[];for(let i=0;i<a.count;i++)for(let k=0;k<components;k++){const at=start+i*stride+k*bytes;out.push(a.componentType===5126?binary.readFloatLE(at):a.componentType===5125?binary.readUInt32LE(at):a.componentType===5123?binary.readUInt16LE(at):binary.readUInt8(at));}return out;};
 const root=new B.TransformNode(`acGlbRoot_${variant}`,scene);root.parent=aircraft.group;root.position.y=-.72;aircraft.glbRoot=root;
 const nodes=doc.nodes.map(node=>{let m;if(node.mesh!==undefined){const primitive=doc.meshes[node.mesh].primitives[0],data=new B.VertexData();data.positions=read(primitive.attributes.POSITION);data.normals=read(primitive.attributes.NORMAL);data.uvs=read(primitive.attributes.TEXCOORD_0);data.indices=read(primitive.indices);m=new B.Mesh(node.name,scene);data.applyToMesh(m);}else m=new B.TransformNode(node.name,scene);if(node.translation)m.position.set(...node.translation);if(node.rotation)m.rotationQuaternion=B.Quaternion.FromArray(node.rotation);if(node.scale)m.scaling.set(...node.scale);return m;});
 const children=new Set();doc.nodes.forEach((node,i)=>(node.children||[]).forEach(child=>{nodes[child].parent=nodes[i];children.add(child);}));nodes.forEach((node,i)=>{if(!children.has(i))node.parent=root;node.computeWorldMatrix(true);});
 const meshes=nodes.filter(n=>n.getTotalVertices?.()>0),gears=nodes.filter(n=>n.name.startsWith('gear_'));
 aircraft.gearStruts=gears;aircraft._rememberLandingGear(gears,true);aircraft.aircraftLightSockets=deriveAircraftLightSockets(meshes,root,variant);aircraft._setLandingGear(true);aircraft.visual.setEnabled(false);return {meshes,gears};
}
const bays=[['cargo',-29,0],['bomber',-29,20],['fighter',-13,0],['attacker',-13,20]];
const{scene,camera}=bare(),world=new SkyArchipelagoWorld(scene,'BOOT-CLEARANCE-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);
const aircrafts=[];
for(const[variant,x,z]of bays){const aircraft=new ExplorerAircraft(scene,camera,audio,variant);loadGLB(aircraft,variant,scene);aircraft.dockOnAsteroid(base,{localPad:{x,y:3.38,z}});for(const mesh of aircraft.glbRoot.getChildMeshes())makeSolid(mesh);aircrafts.push(aircraft);}
scene.meshes.forEach(m=>m.computeWorldMatrix(true));
const player=new NavigatorPlayer(scene,camera,audio);
for(const[variant,x,z]of bays)check(`${variant} bay: real GLB low surfaces never push the player's boots through the hangar floor`,()=>{
 const aircraft=aircrafts.find(a=>a.variant===variant),span=aircraft.groundProfile.wingspan;
 const side=z>10?-1:1,targetMeshes=new Set(aircraft.glbRoot.getChildMeshes());
 const start=new B.Vector3(x+.8,3.38,z+side*(span*.5+1.3));player.placeOnAsteroid(base,start);player.yaw=side>0?0:Math.PI;player.keys={KeyW:true};let minimum=Infinity,maxBelow=0;const hits=new Set();scene.collisionWorld.foot.onCollide=mesh=>hits.add(mesh);
 for(let i=0;i<300;i++){player.update(1/60,{dockedAsteroid:null,group:{position:new B.Vector3(9999,9999,9999)}},i/60);const support=base.getLocalSurfaceY(player.localPos.x,player.localPos.z,player.localPos.y);minimum=Math.min(minimum,player.localPos.y);maxBelow=Math.max(maxBelow,support-player.localPos.y);}
 assert(maxBelow<=.012,`Boot penetration ${maxBelow}m at ${player.localPos.asArray()}`);assert([...hits].some(mesh=>targetMeshes.has(mesh)),`No target aircraft collision was exercised; hit ${[...hits].map(m=>m.name)}`);
 return {start:start.asArray(),end:player.localPos.asArray(),minimumBootY:minimum,maxBelowSupport:maxBelow,hitMeshes:[...hits].map(m=>m.name)};
});
scene.dispose();for(const engine of engines)engine.dispose();report.passed=report.checks.length-failures;report.failed=failures;fs.mkdirSync('artifacts/deploy-20261114',{recursive:true});fs.writeFileSync('artifacts/deploy-20261114/feet-clearance-validation.json',JSON.stringify(report,null,2)+'\n');for(const row of report.checks)console.log(`${row.status.toUpperCase()} ${row.name}${row.error?': '+row.error:''}`);if(failures)process.exitCode=1;
