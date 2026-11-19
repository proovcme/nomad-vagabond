import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
globalThis.BABYLON = require('../vendor/babylon.js');
const B = BABYLON;
// The vendored UMD minifies this constructor to `t`; legacy asset guards inspect
// constructor.name, so retain its documented class name in this headless harness.
Object.defineProperty(B.NullEngine, 'name', {value:'NullEngine', configurable:true});
// Canvas API setup only, copied from validate_runtime.mjs. No legacy tests run here.
const gradient = {addColorStop(){}};
const ctx = new Proxy({createLinearGradient:()=>gradient, createRadialGradient:()=>gradient,
  createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),
  getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}), measureText:()=>({width:100})},
  {get:(t,k)=>t[k]||(()=>{})});
const element = ()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},
  setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:100,height:100})});
globalThis.document = {createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};
globalThis.window = {addEventListener(){},removeEventListener(){},devicePixelRatio:1};
globalThis.OffscreenCanvas = class {constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};
const {CollisionWorld, makeSolid} = await import('../src/collisions.js');
const report = {date:new Date().toISOString(), checks:[], stair:null};
let failures = 0;
const engines = [];
function check(name, fn) {
  try { const evidence=fn(); report.checks.push({name,status:'pass',evidence}); }
  catch(error) { failures++;report.checks.push({name,status:'fail',error:error.message}); }
}
function sceneFixture() {
  const engine = new B.NullEngine({renderWidth:800,renderHeight:600}); engines.push(engine);
  const scene = new B.Scene(engine); scene.useRightHandedSystem=true;
  const camera = new B.FreeCamera('testCamera',new B.Vector3(0,30,80),scene); camera.setTarget(B.Vector3.Zero());
  const collision = new CollisionWorld(scene);scene.collisionWorld=collision;
  return {engine,scene,camera,collision};
}
function prepare(scene) {scene.meshes.forEach(m=>m.computeWorldMatrix(true));scene.render();}
function wall(scene, solid=true) {
  const mesh = B.MeshBuilder.CreateBox('thinWall',{width:.05,height:100,depth:100},scene);
  makeSolid(mesh,solid);mesh.computeWorldMatrix(true);return mesh;
}
check('High-speed aircraft ellipsoid sweep hits a 5cm wall without tunnelling',()=>{
  const {scene,collision}=sceneFixture();wall(scene);prepare(scene);
  const result=collision.move(new B.Vector3(-50,0,0),new B.Vector3(50,0,0),'aircraft');
  assert(result.x < -3.2 && result.x > -3.6,`Expected aircraft nose outside wall; x=${result.x}`);
  assert(collision.snapshot.hits>0);assert.equal(collision.snapshot.lastHit,'thinWall');
  const evidence={fromX:-50,desiredX:50,result:result.asArray(),collision:collision.snapshot};scene.dispose();return evidence;
});
check('Foot ellipsoid cannot pass a solid wall',()=>{
  const {scene,collision}=sceneFixture();wall(scene);prepare(scene);
  const result=collision.move(new B.Vector3(-5,0,0),new B.Vector3(5,0,0));
  assert(result.x < -.44 && result.x > -.8,`Expected feet stopped at wall; x=${result.x}`);
  assert(collision.snapshot.hits>0);
  const evidence={fromX:-5,desiredX:5,result:result.asArray(),collision:collision.snapshot};scene.dispose();return evidence;
});
check('Disabled/non-solid visual mesh is ignored by the solver',()=>{
  const {scene,collision}=sceneFixture();const mesh=wall(scene,false);prepare(scene);
  const result=collision.move(new B.Vector3(-5,0,0),new B.Vector3(5,0,0));
  assert(Math.abs(result.x-5)<1e-5);assert.equal(mesh.metadata.solid,false);assert.equal(collision.snapshot.hits,0);
  const evidence={result:result.asArray(),collision:collision.snapshot};scene.dispose();return evidence;
});
check('Scene disposal removes colliders and both hidden movement proxies',()=>{
  const {scene,collision}=sceneFixture();wall(scene);prepare(scene);
  assert.equal(collision.snapshot.colliders,1);scene.dispose();
  assert.equal(scene.meshes.length,0);assert.equal(collision.snapshot.colliders,0);
  assert(collision.foot.isDisposed()&&collision.air.isDisposed());
  return {sceneMeshes:scene.meshes.length,colliders:collision.snapshot.colliders,footDisposed:collision.foot.isDisposed(),airDisposed:collision.air.isDisposed()};
});

if(process.argv.includes('--hangar')) {
  const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');
  const {AsteroidBase}=await import('../src/asteroidBase.js');
  const {NavigatorPlayer}=await import('../src/player.js');
  const fixture=sceneFixture(),{scene,camera,collision}=fixture;
  const world=new SkyArchipelagoWorld(scene,'COLLISION-QA-742');
  const base=new AsteroidBase(scene,742);
  const started=performance.now();world.registerVagabondBase(base);
  prepare(scene);
  const stair={buildMs:Math.round(performance.now()-started),solidMeshCount:collision.snapshot.colliders,ascent:[],descent:[],blockedMeshes:[]};
  report.stair=stair;
  check('Actual hangar staircase height function rises continuously and descends symmetrically',()=>{
    let prior=base.getLocalSurfaceY(10,-12.4,3.38),maxJump=0;
    for(let x=9.75;x>=-18;x-=.25){const next=base.getLocalSurfaceY(x,-12.4,prior);assert(next>=prior-1e-6);maxJump=Math.max(maxJump,next-prior);prior=next;}
    assert(Math.abs(prior-21.73)<.01);assert(maxJump<.17);
    for(let x=-17.75;x<=10;x+=.25){const next=base.getLocalSurfaceY(x,-12.4,prior);assert(next<=prior+1e-6);prior=next;}
    assert(Math.abs(prior-3.38)<.01);return {bottom:prior,top:21.73,maxQuarterMeterRise:maxJump};
  });
  check('Actual hangar staircase clamp permits the full ascent/descent route',()=>{
    for(let x=10;x>=-18;x-=.25){const p=new B.Vector3(x,base.getLocalSurfaceY(x,-12.4,15),-12.4);const q=p.clone();base.clampWalkPos(q);assert(B.Vector3.Distance(p,q)<1e-6,`Clamp alters route at ${p.asArray()}`);}
    return {samples:113,z:-12.4};
  });
  const audio=new Proxy({},{get:()=>()=>{}});
  const player=new NavigatorPlayer(scene,camera,audio);
  const ship={dockedAsteroid:null,group:{position:new B.Vector3(1000,1000,1000)}};
  const hitNames=new Set();
  collision.foot.onCollide=mesh=>{collision.hits++;collision.lastHit=mesh.name;hitNames.add(mesh.name);};
  const drive=(start,uphill,output)=>{
    player.placeOnAsteroid(base,start);player.yaw=Math.PI/2;player.keys=uphill?{KeyW:true}:{KeyS:true};
    let stalled=0,priorX=player.localPos.x,maxDeltaY=0,priorY=player.localPos.y;
    for(let i=0;i<420;i++){
      player.update(1/60,ship,i/60);
      maxDeltaY=Math.max(maxDeltaY,Math.abs(player.localPos.y-priorY));priorY=player.localPos.y;
      if(Math.abs(player.localPos.x-priorX)<.0001)stalled++;else stalled=0;
      priorX=player.localPos.x;
      if(i%30===0)output.push({frame:i,pos:player.localPos.asArray().map(n=>+n.toFixed(4))});
      if(uphill?player.localPos.x<=-17.75:player.localPos.x>=10.75)break;
      if(stalled>90)break;
    }
    player.keys={};
    return {end:player.localPos.asArray(),maxDeltaY,stalledFrames:stalled,hitMeshes:[...hitNames]};
  };
  check('NavigatorPlayer walks up the actual solid staircase without jumping or teleporting',()=>{
    const result=drive(new B.Vector3(10,3.38,-12.4),true,stair.ascent);stair.ascentResult=result;
    assert(result.end[0]<=-17.75,`Uphill stalled at ${result.end}; hit ${result.hitMeshes.join(', ')}`);
    assert(result.end[1]>21.3,`Did not reach upper deck: ${result.end}`);return result;
  });
  check('NavigatorPlayer walks down the actual solid staircase without physical blockers',()=>{
    const result=drive(new B.Vector3(-18,21.73,-12.4),false,stair.descent);stair.descentResult=result;
    assert(result.end[0]>=10.75,`Downhill stalled at ${result.end}; hit ${result.hitMeshes.join(', ')}`);
    assert(result.end[1]<3.8,`Did not reach apron: ${result.end}`);return result;
  });
  if (process.argv.includes('--diagnose')) {
    stair.diagnostics=[];
    for (const names of [['baseReentryGlow'], ['vagabondUnifiedRockShell','vagUpperMossRim','vagBuildZone','vagBuildPylon_1'], ['vagUpperCourtyard']]) {
      for (const name of names) {const mesh=scene.getMeshByName(name);if(mesh)makeSolid(mesh,false);}
      hitNames.clear();const up=[],down=[];
      const ascent=drive(new B.Vector3(10,3.38,-12.4),true,up);
      hitNames.clear();const descent=drive(new B.Vector3(-18,21.73,-12.4),false,down);
      stair.diagnostics.push({disabledAdditional:names,ascent,descent});
    }
  }
  stair.blockedMeshes=[...hitNames];
  scene.dispose();
}else report.stair={status:'not-run',reason:'--hangar requires completed rock-shell implementation; no hangar/CSG code was invoked.'};
engines.forEach(e=>e.dispose());
fs.mkdirSync(new URL('../artifacts/first-pass/',import.meta.url),{recursive:true});
const output=new URL('../artifacts/first-pass/collision-validation.json',import.meta.url);
fs.writeFileSync(output,JSON.stringify(report,null,2));
for(const row of report.checks)console.log(`${row.status.toUpperCase()} ${row.name}${row.error?': '+row.error:''}`);
console.log(`REPORT ${output.pathname}`);
if(failures)process.exitCode=1;
