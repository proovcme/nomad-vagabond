#!/usr/bin/env node
/** Read-only world-space near-coplanar surface regression check.
 * Usage: node scripts/validate_surfaces.mjs [--self-test] [--report path]
 * Rejects opaque same-facing axis-aligned surfaces with positive overlapping area.
 * Does not change geometry, enable logarithmic depth, or hide findings behind a baseline.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON;
Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const element=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:100,height:100})});
globalThis.document={createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};
globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};
globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};
const HEIGHT_EPS=.025,AREA_EPS=.08,FLAT_EPS=.003;
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const signedArea=p=>p.reduce((s,a,i)=>s+a[0]*p[(i+1)%p.length][1]-a[1]*p[(i+1)%p.length][0],0)*.5;
function bounds(p){return {minX:Math.min(...p.map(v=>v[0])),maxX:Math.max(...p.map(v=>v[0])),minZ:Math.min(...p.map(v=>v[1])),maxZ:Math.max(...p.map(v=>v[1]))};}
const boundsOverlap=(a,b)=>a.maxX>b.minX+1e-8&&b.maxX>a.minX+1e-8&&a.maxZ>b.minZ+1e-8&&b.maxZ>a.minZ+1e-8;
function triangleIntersection(a,b){
  let out=a.slice();const clip=signedArea(b)<0?b.slice().reverse():b;
  for(let j=0;j<3&&out.length;j++){
    const c=clip[j],d=clip[(j+1)%3],input=out;out=[];
    for(let i=0;i<input.length;i++){
      const p=input[i],q=input[(i+1)%input.length],cp=cross(c,d,p),cq=cross(c,d,q),pin=cp>=-1e-9,qin=cq>=-1e-9;
      if(pin)out.push(p);
      if(pin!==qin){const t=cp/(cp-cq);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}
    }
  }
  return out.length>=3?Math.abs(signedArea(out)):0;
}
function triangle(poly){return {poly,bounds:bounds(poly)};}
function checkSurfaceGroups(groups){
  const candidates=[],bins=new Map();
  for(const a of groups){
    const orientation=`${a.normalAxis||'Y'}:${a.normalSign||1}`;
    const key=Math.floor(a.y/HEIGHT_EPS);
    for(let k=key-1;k<=key+1;k++)for(const b of bins.get(`${orientation}:${k}`)||[]){
      if(a.id===b.id||Math.abs(a.y-b.y)>=HEIGHT_EPS||!boundsOverlap(a.bounds,b.bounds))continue;
      let area=0;
      for(const ta of a.triangles)for(const tb of b.triangles)if(boundsOverlap(ta.bounds,tb.bounds))area+=triangleIntersection(ta.poly,tb.poly);
      if(area<=AREA_EPS)continue;
      candidates.push({normalAxis:a.normalAxis||'Y',normalSign:a.normalSign||1,meshes:[b.name,a.name],areaSquareMetres:+area.toFixed(5),heightSeparationMetres:+Math.abs(a.y-b.y).toFixed(6),worldCoordinate:+((a.y+b.y)*.5).toFixed(5),planeAxes:a.planeAxes||['X','Z'],overlapBounds:{minX:Math.max(a.bounds.minX,b.bounds.minX),maxX:Math.min(a.bounds.maxX,b.bounds.maxX),minZ:Math.max(a.bounds.minZ,b.bounds.minZ),maxZ:Math.min(a.bounds.maxZ,b.bounds.maxZ)},severity:Math.abs(a.y-b.y)<.002?'coplanar':'near-coplanar'});
    }
    const binKey=`${orientation}:${key}`;
    if(!bins.has(binKey))bins.set(binKey,[]);bins.get(binKey).push(a);
  }
  return candidates.sort((a,b)=>b.areaSquareMetres-a.areaSquareMetres);
}
function selfTest(){
 const group=(id,x=0,y=0)=>({id,name:`synthetic_${id}`,y,bounds:{minX:x,maxX:x+2,minZ:0,maxZ:2},triangles:[triangle([[x,0],[x+2,0],[x+2,2]]),triangle([[x,0],[x+2,2],[x,2]])]});
 let r=checkSurfaceGroups([group(1),group(2,1)]);assert.equal(r.length,1);assert(Math.abs(r[0].areaSquareMetres-2)<1e-6);
 assert.equal(checkSurfaceGroups([group(1),group(2,2)]).length,0,'shared edges are not overlap');
 assert.equal(checkSurfaceGroups([group(1),group(2,0,.02)]).length,1,'2cm near surfaces detected');
 assert.equal(checkSurfaceGroups([group(1),group(2,0,.03)]).length,0,'3cm safely separate');
 assert.equal(checkSurfaceGroups([group(1),{...group(1),name:'same_mesh_other_face'}]).length,0,'same-mesh groups excluded');
 const verticalX=checkSurfaceGroups([{...group(1),normalAxis:'X',normalSign:1},{...group(2,1,.02),normalAxis:'X',normalSign:1}]);
 assert.equal(verticalX.length,1,'vertical X planes 2cm apart overlap');assert.equal(verticalX[0].normalAxis,'X');
 const verticalZ=checkSurfaceGroups([{...group(1),normalAxis:'Z',normalSign:-1},{...group(2,1),normalAxis:'Z',normalSign:-1}]);
 assert.equal(verticalZ.length,1,'vertical Z sign/wall overlap detected');assert.equal(verticalZ[0].normalAxis,'Z');
 assert.equal(checkSurfaceGroups([{...group(1),normalAxis:'Z',normalSign:1},{...group(2,1),normalAxis:'Z',normalSign:-1}]).length,0,'opposing contact faces ignored');
 assert.equal(checkSurfaceGroups([{...group(1),normalAxis:'X'},{...group(2,1),normalAxis:'Z'}]).length,0,'perpendicular planes ignored');
 return {verticalXOverlapDetected:true,verticalZSignWallDetected:true,opposingContactsIgnored:true,perpendicularPlanesIgnored:true,positiveOverlapArea:2,sharedEdgeIgnored:true,twoCentimetresDetected:true,threeCentimetresSeparated:true,sameMeshExcluded:true};
}
function collect(scene){
 const result=[],skipped={hidden:0,transparent:0,noGeometry:0,nonAxisAlignedTriangles:0};let testedTriangles=0;
 const axisNames=['X','Y','Z'];
 for(const m of scene.meshes){
  if(!m.isEnabled()||!m.isVisible||m.visibility<.999){skipped.hidden++;continue;}
  const mat=m.material;if(mat&&(mat.alpha<.999||mat.needAlphaBlending?.())){skipped.transparent++;continue;}
  const positions=m.getVerticesData(B.VertexBuffer.PositionKind),normals=m.getVerticesData(B.VertexBuffer.NormalKind),indices=m.getIndices();
  if(!positions||!normals||!indices){skipped.noGeometry++;continue;}
  const world=m.computeWorldMatrix(true),localGroups=new Map(),normalMatrix=B.Matrix.Transpose(B.Matrix.Invert(world));
  for(let i=0;i<indices.length;i+=3){
   const ps=[],ns=[];
   for(let j=0;j<3;j++){const at=indices[i+j]*3;ps.push(B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,at),world).asArray());ns.push(B.Vector3.TransformNormal(B.Vector3.FromArray(normals,at),normalMatrix).normalize().asArray());}
   const mean=ns.reduce((n,v)=>n.map((x,k)=>x+v[k]/3),[0,0,0]);
   let axis=0;for(let k=1;k<3;k++)if(Math.abs(mean[k])>Math.abs(mean[axis]))axis=k;
   const coordinates=ps.map(p=>p[axis]);
   if(Math.abs(mean[axis])<.995||Math.max(...coordinates)-Math.min(...coordinates)>FLAT_EPS){skipped.nonAxisAlignedTriangles++;continue;}
   const planeAxes=[0,1,2].filter(k=>k!==axis),normalSign=Math.sign(mean[axis]);
   const poly=ps.map(p=>[p[planeAxes[0]],p[planeAxes[1]]]);if(Math.abs(signedArea(poly))<1e-8)continue;
   const y=coordinates.reduce((a,b)=>a+b,0)/3,key=`${axis}:${normalSign}:${Math.round(y/FLAT_EPS)}`;
   if(!localGroups.has(key))localGroups.set(key,{id:m.uniqueId,name:m.name,y,normalAxis:axisNames[axis],normalSign,planeAxes:planeAxes.map(k=>axisNames[k]),triangles:[]});
   localGroups.get(key).triangles.push(triangle(poly));testedTriangles++;
  }
  for(const g of localGroups.values()){
   g.bounds=bounds(g.triangles.flatMap(t=>t.poly));result.push(g);
  }
 }
 return {groups:result,skipped,testedTriangles};
}
function extractionSelfTest(){
 const engine=new B.NullEngine({renderWidth:16,renderHeight:16}),scene=new B.Scene(engine);scene.useRightHandedSystem=true;
 const add=(name,pos,rotation=0)=>{const m=B.MeshBuilder.CreatePlane(name,{size:2},scene);m.position.set(...pos);m.rotation.y=rotation;return m;};
 add('fixtureZ_A',[0,0,0]);add('fixtureZ_B',[1,0,.02]);
 add('fixtureX_A',[8,0,0],Math.PI/2);add('fixtureX_B',[8.02,0,1],Math.PI/2);
 const actual=checkSurfaceGroups(collect(scene).groups);
 assert(actual.some(p=>p.normalAxis==='Z'&&p.meshes.includes('fixtureZ_A')),'actual Z mesh extraction');
 assert(actual.some(p=>p.normalAxis==='X'&&p.meshes.includes('fixtureX_A')),'actual X mesh extraction');
 const evidence={actualVerticalMeshExtraction:true,actualVerticalFindingAxes:actual.map(p=>p.normalAxis)};
 scene.meshes.slice().forEach(m=>m.dispose());
 const floor=B.MeshBuilder.CreateBox('fixtureFloor',{width:2,depth:2,height:1},scene);
 const duplicate=B.MeshBuilder.CreateBox('fixtureDuplicate',{width:2,depth:2,height:1},scene);duplicate.position.x=1;
 assert(checkSurfaceGroups(collect(scene).groups).length>0,'visible duplicate box faces detected');
 duplicate.position.y=1;
 assert.equal(checkSurfaceGroups(collect(scene).groups).length,0,'opposing underside contact ignored');
 duplicate.position.y=0;duplicate.isVisible=false;
 assert.equal(checkSurfaceGroups(collect(scene).groups).length,0,'hidden collision proxy ignored');
 duplicate.isVisible=true;duplicate.material=new B.StandardMaterial('transparentFixture',scene);duplicate.material.alpha=.3;
 assert.equal(checkSurfaceGroups(collect(scene).groups).length,0,'transparent preview ignored');
 Object.assign(evidence,{visibleOverlapDetected:true,undersideContactIgnored:true,hiddenProxyIgnored:true,transparentPreviewIgnored:true});
 scene.dispose();engine.dispose();return evidence;
}
const selfTestEvidence={...selfTest(),...extractionSelfTest()};
if(process.argv.includes('--self-test')){console.log('PASS surface detector synthetic fixtures',JSON.stringify(selfTestEvidence));process.exit(0);}
const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');
const {AsteroidBase}=await import('../src/asteroidBase.js');
const {IndustrialCranes}=await import('../src/industrialCranes.js');
const engine=new B.NullEngine({renderWidth:800,renderHeight:600}),scene=new B.Scene(engine);scene.useRightHandedSystem=true;
const camera=new B.FreeCamera('surfaceAuditCamera',new B.Vector3(0,60,100),scene);camera.setTarget(B.Vector3.Zero());
const world=new SkyArchipelagoWorld(scene,'AETHER-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);
world.industrialCranes=new IndustrialCranes(scene,world.industrialIsland.group,world.shadowGenerator);
scene.meshes.forEach(m=>m.computeWorldMatrix(true));
const rear=scene.getMeshByName('vagHangarBack'),exitSign=scene.getMeshByName('hangarStairSign');
assert(rear.getBoundingInfo().boundingBox.maximumWorld.x-base.group.position.x<=-18.9,'rear wall must be behind the full playable floor');
assert.equal(exitSign.checkCollisions,false,'deck arrow must never block collision');
assert(exitSign.getAbsolutePosition().z-base.group.position.z>-9.0,'deck arrow stays lateral to stair passage');
const hangarChecks={rearWallLocalX:rear.getBoundingInfo().boundingBox.maximumWorld.x-base.group.position.x,rearMaterial:rear.material.name,deckSignNonBlocking:!exitSign.checkCollisions,deckSignLateralZ:exitSign.getAbsolutePosition().z-base.group.position.z};
const started=performance.now(),collected=collect(scene),findings=checkSurfaceGroups(collected.groups);
const report={date:new Date().toISOString(),seed:'AETHER-742',scope:'Opaque visible axis-aligned static world faces, with matching authored normal orientation; excludes GLB art skipped by NullEngine. Run repair_building_surfaces.py separately for intra-GLB coplanar triangles.',thresholds:{maximumHeightSeparationMetres:HEIGHT_EPS,minimumOverlapSquareMetres:AREA_EPS,triangleFlatnessMetres:FLAT_EPS},allowlist:[],hangarChecks,meshCount:scene.meshes.length,surfaceGroups:collected.groups.length,testedTriangles:collected.testedTriangles,skipped:collected.skipped,selfTest:selfTestEvidence,elapsedMs:Math.round(performance.now()-started),findings,status:findings.length?'fail':'pass'};
const reportIndex=process.argv.indexOf('--report'),output=path.resolve(reportIndex>=0?process.argv[reportIndex+1]:'artifacts/deploy-20261114/surface-validation.json');
fs.mkdirSync(path.dirname(output),{recursive:true});
let glbFailure=false;
if(process.argv.includes('--with-glb')){
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),glbOutput=path.join(path.dirname(output),'glb-surface-audit.json');
 const run=spawnSync('python3',[path.join(root,'scripts/repair_building_surfaces.py'),'--report',glbOutput],{cwd:root,encoding:'utf8'});
 const windingOutput=path.join(path.dirname(output),'building-winding-audit.json');
 const windingRun=spawnSync('python3',[path.join(root,'scripts/validate_building_winding.py'),'--report',windingOutput],{cwd:root,encoding:'utf8'});
 report.buildingWinding={status:windingRun.status===0?'pass':'fail',report:windingOutput};
 if(windingRun.status!==0){glbFailure=true;report.buildingWinding.error=(windingRun.stderr||windingRun.stdout||'winding audit failed').slice(-1500);}

 if(run.status!==0){glbFailure=true;report.glbAudit={status:'error',error:(run.stderr||run.error?.message||'GLB audit failed').slice(-1500)};}
 else{
  const models=JSON.parse(fs.readFileSync(glbOutput,'utf8'));
  const pairs=Object.values(models).reduce((n,r)=>n+(r.after||r.before).overlapping_pairs,0);
  glbFailure=glbFailure||pairs>0;report.glbAudit={status:glbFailure?'fail':'pass',overlappingPairs:pairs,report:glbOutput,models:Object.keys(models)};
 }
}
report.status=findings.length||glbFailure?'fail':'pass';
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(`${findings.length?'FAIL':'PASS'} ${collected.testedTriangles} axis-aligned triangles, ${collected.groups.length} surfaces, ${findings.length} overlapping pairs`);
for(const f of findings.slice(0,30))console.log(`${f.severity} ${f.meshes.join(' / ')} area=${f.areaSquareMetres}m2 gap=${f.heightSeparationMetres}m axis=${f.normalAxis}${f.normalSign>0?'+':'-'} coordinate=${f.worldCoordinate}`);
console.log(`REPORT ${output}`);scene.dispose();engine.dispose();if(findings.length||glbFailure)process.exitCode=1;
