import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire}from'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const el=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}}});globalThis.document={createElement:el,getElementById:el,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};
const {ExplorerAircraft,deriveAircraftLightSockets}=await import('../src/explorerAircraft.js');const {CollisionWorld}=await import('../src/collisions.js');const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');const {AsteroidBase}=await import('../src/asteroidBase.js');
const FILES={cargo:'scrapyard_plane.glb',fighter:'scrapyard_fighter.glb',bomber:'scrapyard_bomber.glb',attacker:'scrapyard_attacker.glb'};const report={checks:[],variants:{}};let failures=0;const engines=[];const audio=new Proxy({},{get:()=>()=>{}});
function check(name,fn){try{const evidence=fn();report.checks.push({name,status:'pass',evidence});}catch(error){failures++;report.checks.push({name,status:'fail',error:error.message});}}
function loadGLB(aircraft,variant,scene){
 const raw=fs.readFileSync(new URL(`../assets/aircraft/${FILES[variant]}`,import.meta.url)),length=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+length)),binary=raw.subarray(28+length);
 const read=index=>{const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],bytes={5126:4,5125:4,5123:2,5121:1}[a.componentType],start=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||bytes*components,out=[];for(let i=0;i<a.count;i++)for(let k=0;k<components;k++){const at=start+i*stride+k*bytes;out.push(a.componentType===5126?binary.readFloatLE(at):a.componentType===5125?binary.readUInt32LE(at):a.componentType===5123?binary.readUInt16LE(at):binary.readUInt8(at));}return out;};
 const root=new B.TransformNode(`acGlbRoot_${variant}`,scene);root.parent=aircraft.group;root.position.y=-.72;aircraft.glbRoot=root;
 const nodes=doc.nodes.map(node=>{let m;if(node.mesh!==undefined){const primitive=doc.meshes[node.mesh].primitives[0],data=new B.VertexData();data.positions=read(primitive.attributes.POSITION);data.normals=read(primitive.attributes.NORMAL);data.uvs=read(primitive.attributes.TEXCOORD_0);data.indices=read(primitive.indices);m=new B.Mesh(node.name,scene);data.applyToMesh(m);}else m=new B.TransformNode(node.name,scene);if(node.translation)m.position.set(...node.translation);if(node.rotation)m.rotationQuaternion=B.Quaternion.FromArray(node.rotation);if(node.scale)m.scaling.set(...node.scale);return m;});
 const children=new Set();doc.nodes.forEach((node,i)=>(node.children||[]).forEach(child=>{nodes[child].parent=nodes[i];children.add(child);}));nodes.forEach((node,i)=>{if(!children.has(i))node.parent=root;node.computeWorldMatrix(true);});
 const meshes=nodes.filter(n=>n.getTotalVertices?.()>0),gears=nodes.filter(n=>n.name.startsWith('gear_'));
 aircraft.gearStruts=gears;aircraft._rememberLandingGear(gears,true);aircraft.aircraftLightSockets=deriveAircraftLightSockets(meshes,root,variant);aircraft._setLandingGear(true);aircraft.visual.setEnabled(false);return {meshes,gears};
}
function fixture(variant){const engine=new B.NullEngine({renderWidth:800,renderHeight:600});engines.push(engine);const scene=new B.Scene(engine);scene.useRightHandedSystem=true;const camera=new B.FreeCamera('camera',new B.Vector3(80,90,80),scene);camera.setTarget(new B.Vector3(0,40,0));scene.collisionWorld=new CollisionWorld(scene);const world=new SkyArchipelagoWorld(scene,'AIRCRAFT-TAKEOFF-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);base.group.rotation.y=.35;base.group.computeWorldMatrix(true);const aircraft=new ExplorerAircraft(scene,camera,audio,variant);const loaded=loadGLB(aircraft,variant,scene);scene.meshes.forEach(m=>m.computeWorldMatrix(true));return {engine,scene,world,base,aircraft,...loaded};}
function lowestWheelWorld(gears){let bottom=Infinity;for(const mesh of gears){mesh.computeWorldMatrix(true);const vertices=mesh.getVerticesData(B.VertexBuffer.PositionKind);for(let i=0;i<vertices.length;i+=3)bottom=Math.min(bottom,B.Vector3.TransformCoordinates(B.Vector3.FromArray(vertices,i),mesh.getWorldMatrix()).y);}return bottom;}
for(const variant of Object.keys(FILES))check(`${variant}: authored gear contacts moving deck, actual ground roll stays level, then guarded +X takeoff clears the swept collider`,()=>{
 const {scene,world,base,aircraft:a,gears}=fixture(variant);const profile=a.positionForTakeoff(base,{x:8,y:3.38,z:0}),deck=base.group.position.y+3.38;
 let initial=lowestWheelWorld(gears);assert(Math.abs(initial-deck)<.002,`Initial gear clearance ${initial-deck}`);
 // A premature Space/E launch request must not create the old vertical impulse.
 const original=a.group.position.clone();assert.equal(a.undockFromAsteroid(),false);for(let i=0;i<15;i++)a.update(1/60,world,'aircraft');assert(a.dockedAsteroid===base);assert(B.Vector3.Distance(a.group.position,original)<.002);
 base.velocity.set(1.5,0,.7);const baseStart=base.group.position.clone();
 a.keys={KeyW:true,ArrowUp:true};let groundedFrames=0,airFrames=0,groundTravel=0,maxWheelError=0,collisionAdjustments=0,lastLocalX=8,time=0,takeoffTime=null;
 for(let frame=0;frame<480;frame++){
  const before=a.group.position.clone();base.prevPos.copyFrom(base.group.position);base.group.position.addInPlace(base.velocity.scale(1/60));base.group.computeWorldMatrix(true);for(const mesh of base.group.getChildMeshes())mesh.computeWorldMatrix(true);a.update(1/60,world,'aircraft');time+=1/60;
  if(a.dockedAsteroid){
   groundedFrames++;const local=B.Vector3.TransformCoordinates(a.group.position,base.group.getWorldMatrix().clone().invert());groundTravel=local.x-8;
   assert(local.x>=lastLocalX-.001);assert(Math.abs(local.z)<.002);lastLocalX=local.x;
   maxWheelError=Math.max(maxWheelError,Math.abs(lowestWheelWorld(gears)-deck));
   const matrix=B.Matrix.FromQuaternionToRef(a.group.rotationQuaternion,new B.Matrix()),right=B.Vector3.TransformNormal(B.Axis.X,matrix);assert(Math.abs(right.y)<1e-5,'Uncommanded bank on runway');
   if(a.driveSpeed<profile.rotationSpeed||local.x<profile.noseClearX)assert((a._runwayState?.pitch||0)<.001,'Pitch before clearance/speed gate');
  }else{
   if(takeoffTime===null)takeoffTime=time;airFrames++;
   const offset=a.getCollisionCenterOffsetWorld(),desired=a.group.position.clone(),safe=scene.collisionWorld.move(before.add(offset),desired.add(offset),'aircraft').subtract(offset);
   if(B.Vector3.Distance(safe,desired)>.03)collisionAdjustments++;
   a.group.position.copyFrom(safe);if(airFrames>=45)break;
  }
 }
 assert(groundedFrames>20&&groundTravel>10,`No real roll: ${groundTravel}`);assert(maxWheelError<.004,`Wheel penetration/floating ${maxWheelError}`);
 assert(a.lastTakeoff,`Never lifted off; x=${lastLocalX},speed=${a.driveSpeed}`);assert(a.lastTakeoff.localX>=profile.noseClearX);assert(a.lastTakeoff.speed>=profile.liftoffSpeed);assert(a.lastTakeoff.pitch>=.055);assert(collisionAdjustments===0,`Takeoff hit floor/walls ${collisionAdjustments}times: ${scene.collisionWorld.snapshot.lastHit}`);
 const evidence={profile,movingBaseDistance:B.Vector3.Distance(baseStart,base.group.position),initialWheelError:initial-deck,maxWheelError,groundTravel,groundedFrames,takeoffTime,lastTakeoff:a.lastTakeoff,collisionAdjustments};report.variants[variant]=evidence;scene.dispose();return evidence;
});
check('Ground braking stops without a vertical kick or reverse takeoff',()=>{const{scene,world,base,aircraft:a}=fixture('fighter');a.positionForTakeoff(base,{x:8,y:3.38,z:0});assert(a.toggleRunwayEngine());for(let i=0;i<85;i++)a.update(1/60,world,'aircraft');assert.equal(a.driveSpeed,0);assert.equal(a._runwayState.ignition,'running');assert(a._propRpm>3);assert(a.toggleRunwayEngine());assert.equal(a._runwayState.ignition,'off');a.keys={KeyW:true};for(let i=0;i<130;i++)a.update(1/60,world,'aircraft');const fast=a.driveSpeed;assert(fast>3);a.keys={KeyS:true};for(let i=0;i<90;i++)a.update(1/60,world,'aircraft');assert.equal(a.driveSpeed,0);assert(a.dockedAsteroid===base);assert(!a.lastTakeoff);scene.dispose();return{beforeBrakeSpeed:fast,afterBrakeSpeed:a.driveSpeed};});
check('Fighter takeoff handoff eases a held Up key into a 15–25 degree climb, then restores full pitch authority',()=>{
 const{scene,world,base,aircraft:a}=fixture('fighter');a.positionForTakeoff(base,{x:8,y:3.38,z:0});a.keys={KeyW:true,ArrowUp:true};
 for(let i=0;i<300&&a.dockedAsteroid;i++)a.update(1/60,world,'aircraft');assert(a.lastTakeoff);
 for(let i=0;i<39;i++)a.update(1/60,world,'aircraft');
 const forward=()=>B.Vector3.TransformNormal(new B.Vector3(0,0,-1),B.Matrix.FromQuaternionToRef(a.group.rotationQuaternion,new B.Matrix())).normalize();
 const climb=Math.asin(forward().y)*180/Math.PI;assert(climb>=15&&climb<=25,`First .65s climb ${climb}degrees`);
 a.keys={KeyW:true};for(let i=0;i<51;i++)a.update(1/60,world,'aircraft');assert.equal(a._takeoffPitchGrace,0);
 const before=forward();a.keys={KeyW:true,ArrowUp:true};for(let i=0;i<12;i++)a.update(1/60,world,'aircraft');const delta=Math.acos(Math.max(-1,Math.min(1,B.Vector3.Dot(before,forward()))));
 assert(Math.abs(delta-a.spec.pitchRate*.2)<.005,`Full pitch authority not restored: ${delta}`);scene.dispose();return {climbDegreesAt650ms:climb,fullRateDeltaRadians:delta,expectedFullRateRadians:a.spec.pitchRate*.2};
});
check('Class flight controls keep fighter more responsive than bomber',()=>{
 const outputs={};for(const variant of ['fighter','bomber']){const{scene,world,aircraft:a}=fixture(variant);a.dockedAsteroid=null;a._runwayState=null;a.group.position.set(900,300,900);a.group.rotationQuaternion=B.Quaternion.Identity();a.velocity.set(0,0,-25);a.throttle=.6;a.keys={KeyA:true,KeyW:true};for(let i=0;i<40;i++)a.update(1/60,world,'aircraft');const forward=B.Vector3.TransformNormal(new B.Vector3(0,0,-1),B.Matrix.FromQuaternionToRef(a.group.rotationQuaternion,new B.Matrix()));outputs[variant]={turnAngle:Math.acos(Math.max(-1,Math.min(1,-forward.z))),speed:a.velocity.length()};scene.dispose();}
 assert(outputs.fighter.turnAngle>outputs.bomber.turnAngle*1.35);assert(outputs.fighter.speed>outputs.bomber.speed);return outputs;
});
check('Class special weapons: rockets only on attacker, bombs on bomber, none on cargo/fighter',()=>{
 for(const variant of ['cargo','fighter']){const{scene,world,aircraft:a}=fixture(variant);a.dockedAsteroid=null;a.group.position.set(900,300,900);a.velocity.set(0,0,-20);a.keys={KeyF:true};a.specialInputEnabled=true;a.update(1/60,world,'aircraft');assert.equal(a.projectiles.length,0);scene.dispose();}
 {const{scene,world,aircraft:a}=fixture('attacker');a.dockedAsteroid=null;a.group.position.set(900,300,900);a.velocity.set(0,0,-20);a.keys={KeyF:true};a.specialInputEnabled=false;a.update(1/60,world,'aircraft');assert.equal(a.projectiles.length,0);a.specialInputEnabled=true;a.update(1/60,world,'aircraft');assert(a.projectiles.some(pr=>pr.kind==='rocket'));scene.dispose();}
 {const{scene,world,aircraft:a}=fixture('bomber');a.dockedAsteroid=null;a.group.position.set(900,300,900);a.velocity.set(0,0,-20);a.keys={KeyF:true};a.specialInputEnabled=true;a.update(1/60,world,'aircraft');assert(a.projectiles.some(pr=>pr.kind==='bomb'));scene.dispose();}
 return {attackerRockets:true,bomberBombs:true,noRocketsOnCargoOrFighter:true};
});
check('World-hit and near-ground expired-bomb hooks fire before projectile disposal',()=>{
 const{scene,world,base,aircraft:a}=fixture('bomber');const events=[];
 a.onProjectileImpact=event=>events.push({...event,aliveAtHook:!a.projectiles[0].mesh.isDisposed()});
 const add=(y,vel,life)=>{const mesh=B.MeshBuilder.CreateSphere('qaBomb',{diameter:.2},scene);mesh.position.copyFrom(base.group.position).addInPlace(new B.Vector3(22,y,0));a.projectiles.push({mesh,vel:new B.Vector3(0,vel,0),life,kind:'bomb'});};
 // Base is rotated, so use world-space matching point on its real runway.
 const point=B.Vector3.TransformCoordinates(new B.Vector3(22,3.38,0),base.group.getWorldMatrix());
 add(5,-100,2);a.projectiles[0].mesh.position.copyFrom(point).addInPlace(new B.Vector3(0,2,0));a._updateProjectiles(.05,world);
 assert.equal(events.length,1);assert(events[0].aliveAtHook);assert(events[0].position.y<events[0].from.y);assert.equal(a.projectiles.length,0);
 add(7,0,.01);a.projectiles[0].mesh.position.copyFrom(point).addInPlace(new B.Vector3(0,4,0));a._updateProjectiles(.02,world);assert.equal(events.length,2);assert(events[1].expired);assert(events[1].aliveAtHook);assert.equal(a.projectiles.length,0);
 scene.dispose();return{impacts:events.map(e=>({kind:e.kind,expired:e.expired,aliveAtHook:e.aliveAtHook,position:e.position.asArray()}))};
});
check('Sky flight auto-levels bank after releasing turn keys, preserves cruise throttle floor, and couples dive/climb pitch energy',()=>{
 const{scene,world,aircraft:a}=fixture('fighter');a.dockedAsteroid=null;a._runwayState=null;a._takeoffPitchGrace=0;a.group.position.set(900,320,900);a.group.rotationQuaternion=B.Quaternion.Identity();a.velocity.set(0,0,-24);a.throttle=.65;
 a.keys={KeyA:true,KeyW:true};for(let i=0;i<36;i++)a.update(1/60,world,'aircraft');
 const rightY=()=>B.Vector3.TransformNormal(B.Axis.X,B.Matrix.FromQuaternionToRef(a.group.rotationQuaternion,new B.Matrix())).y;
 const bankedRightY=Math.abs(rightY());assert(bankedRightY>.12,`Expected noticeable bank during turn, got ${bankedRightY}`);
 a.keys={};for(let i=0;i<75;i++)a.update(1/60,world,'aircraft');
 const leveledRightY=Math.abs(rightY());assert(leveledRightY<bankedRightY*.35,`Expected horizon roll auto-leveling, got ${leveledRightY} from ${bankedRightY}`);
 assert(a.throttle>=.38,`Expected cruise throttle floor >= 0.38 in sky flight, got ${a.throttle}`);
 a.group.rotationQuaternion=B.Quaternion.FromEulerAngles(-.32,0,0);a.velocity.set(0,-8,-24);a.throttle=.55;a.keys={};
 for(let i=0;i<45;i++)a.update(1/60,world,'aircraft');const diveSpeed=a.velocity.length();
 a.group.rotationQuaternion=B.Quaternion.FromEulerAngles(.32,0,0);a.velocity.set(0,8,-24);a.throttle=.55;a.keys={};
 for(let i=0;i<45;i++)a.update(1/60,world,'aircraft');const climbSpeed=a.velocity.length();
 assert(diveSpeed>climbSpeed+2.5,`Expected dive speed (${diveSpeed}) > climb speed (${climbSpeed})`);
 scene.dispose();return{bankedRightY,leveledRightY,cruiseThrottle:a.throttle,diveSpeed,climbSpeed};
});
for(const engine of engines)engine.dispose();report.passed=report.checks.length-failures;report.failed=failures;fs.mkdirSync('artifacts/deploy-20261114',{recursive:true});fs.writeFileSync('artifacts/deploy-20261114/aircraft-takeoff-validation.json',JSON.stringify(report,null,2)+'\n');for(const row of report.checks)console.log(`${row.status.toUpperCase()} ${row.name}${row.error?': '+row.error:''}`);if(failures)process.exitCode=1;
