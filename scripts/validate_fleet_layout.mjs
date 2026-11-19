#!/usr/bin/env node
/** Actual GLB POSITION vertices + authored node transforms, placed exactly like HangarFleet. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON;
const {HANGAR_FLEET_BAYS,HANGAR_BOUNDS}=await import('../src/hangar.js');
const {HANGAR_FLEET}=await import('../src/hangarFleet.js');
const files={cargo:'scrapyard_plane.glb',bomber:'scrapyard_bomber.glb',fighter:'scrapyard_fighter.glb',attacker:'scrapyard_attacker.glb'};
function readAsset(file){
 const bytes=fs.readFileSync(new URL(`../assets/aircraft/${file}`,import.meta.url));
 assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);
 let document,binary;
 for(let at=12;at<bytes.length;){const length=bytes.readUInt32LE(at),type=bytes.readUInt32LE(at+4),data=bytes.subarray(at+8,at+8+length);if(type===0x4e4f534a)document=JSON.parse(data.toString());if(type===0x004e4942)binary=data;at+=8+length;}
 assert(document&&binary,'valid JSON and binary chunks');return {document,binary};
}
function boundsOfAsset(file){
 const {document:doc,binary}=readAsset(file),cache=new Map(),yaw=B.Matrix.RotationY(-Math.PI/2);
 const min=new B.Vector3(Infinity,Infinity,Infinity),max=new B.Vector3(-Infinity,-Infinity,-Infinity);
 let vertices=0,meshNodes=0;
 function positions(index){
  if(cache.has(index))return cache.get(index);
  const a=doc.accessors[index],view=doc.bufferViews[a.bufferView];
  assert.equal(a.componentType,5126);assert.equal(a.type,'VEC3');assert(!a.sparse,'asset uses dense POSITION data');
  const start=(view.byteOffset||0)+(a.byteOffset||0),stride=view.byteStride||12,data=[];
  for(let i=0;i<a.count;i++){const at=start+i*stride;data.push(new B.Vector3(binary.readFloatLE(at),binary.readFloatLE(at+4),binary.readFloatLE(at+8)));}
  cache.set(index,data);return data;
 }
 function visit(index,parentMatrix){
  const node=doc.nodes[index];
  const local=node.matrix?B.Matrix.FromArray(node.matrix):B.Matrix.Compose(B.Vector3.FromArray(node.scale||[1,1,1]),B.Quaternion.FromArray(node.rotation||[0,0,0,1]),B.Vector3.FromArray(node.translation||[0,0,0]));
  const world=local.multiply(parentMatrix);
  if(node.mesh!==undefined){meshNodes++;const rotated=world.multiply(yaw);
   for(const primitive of doc.meshes[node.mesh].primitives)for(const position of positions(primitive.attributes.POSITION)){
    const p=B.Vector3.TransformCoordinates(position,rotated);assert(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z));
    min.minimizeInPlace(p);max.maximizeInPlace(p);vertices++;
   }
  }
  for(const child of node.children||[])visit(child,world);
 }
 const roots=doc.scenes?.[doc.scene||0]?.nodes||doc.nodes.map((_,i)=>i).filter(i=>!doc.nodes.some(n=>(n.children||[]).includes(i)));
 for(const root of roots)visit(root,B.Matrix.Identity());
 assert(vertices>0);return {min,max,vertices,meshNodes};
}
const checks=[],bays=[];let failures=0;
function check(name,fn){try{checks.push({name,status:'pass',evidence:fn()});}catch(error){failures++;checks.push({name,status:'fail',error:error.message});}}
check('Fleet module coordinates match the shared four-bay hangar contract',()=>{
 assert.equal(HANGAR_FLEET.length,4);assert.equal(HANGAR_FLEET_BAYS.length,4);
 for(const bay of HANGAR_FLEET_BAYS){const actual=HANGAR_FLEET.find(r=>r.variant===bay.variant);assert(actual);assert.equal(actual.x,bay.x);assert.equal(actual.z,bay.z);}
 return {variants:HANGAR_FLEET_BAYS.map(b=>b.variant)};
});
for(const bay of HANGAR_FLEET_BAYS)check(`${bay.variant}: authored GLB geometry fits its floor-mounted bay`,()=>{
 const raw=boundsOfAsset(files[bay.variant]);
 const placed={variant:bay.variant,file:files[bay.variant],centerX:bay.x,centerZ:bay.z,minX:bay.x+raw.min.x,maxX:bay.x+raw.max.x,minZ:bay.z+raw.min.z,maxZ:bay.z+raw.max.z,floorY:HANGAR_BOUNDS.floorY,topY:HANGAR_BOUNDS.floorY+raw.max.y-raw.min.y,floorOffset:-raw.min.y,verticesChecked:raw.vertices,authoredMeshNodes:raw.meshNodes};
 assert(placed.minX>=HANGAR_BOUNDS.minX&&placed.maxX<=HANGAR_BOUNDS.maxX,'longitudinal floor fit');
 assert(placed.minZ>=HANGAR_BOUNDS.minZ&&placed.maxZ<=HANGAR_BOUNDS.maxZ,'wingtip floor fit');
 assert(placed.topY<HANGAR_BOUNDS.ceilingY,'tail/roof clearance');bays.push(placed);return placed;
});
check('All parked aircraft have disjoint real AABBs',()=>{
 let pairs=0;for(let i=0;i<bays.length;i++)for(let j=i+1;j<bays.length;j++){const a=bays[i],b=bays[j];assert(a.maxX<=b.minX||b.maxX<=a.minX||a.maxZ<=b.minZ||b.maxZ<=a.minZ,`${a.variant}/${b.variant} overlap`);pairs++;}
 assert.equal(pairs,6);return {testedPairs:pairs};
});
check('A continuous central pedestrian aisle and preserved south staircase remain clear',()=>{
 const southMax=Math.max(...bays.filter(b=>b.centerZ===0).map(b=>b.maxZ)),northMin=Math.min(...bays.filter(b=>b.centerZ===20).map(b=>b.minZ));
 const centralAisleWidth=northMin-southMax;assert(centralAisleWidth>4,'central aisle exceeds walking capsule clearance');
 const minZ=Math.min(...bays.map(b=>b.minZ));assert(minZ>-9,'parked wings stay north of stair corridor');
 return {centralAisleWidth,minimumWingZ:minZ,stairCenterZ:-12.4,minimumCeilingClearance:Math.min(...bays.map(b=>HANGAR_BOUNDS.ceilingY-b.topY))};
});
const report={date:new Date().toISOString(),status:failures?'fail':'pass',method:'Decode actual POSITION vertices, compose authored glTF node transforms, apply HangarFleet yaw−PI/2, then apply each minimum-Y floor offset and shared bay coordinates.',scope:'Static aircraft geometry placement; actual walking collision/boarding/tow and rendered asset appearance require their separate integration checks.',bounds:HANGAR_BOUNDS,checks};
const output=new URL('../artifacts/deploy-20261114/fleet-layout-validation.json',import.meta.url);fs.mkdirSync(new URL('../artifacts/deploy-20261114/',import.meta.url),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const row of checks)console.log(`${row.status.toUpperCase()} ${row.name}${row.error?': '+row.error:''}`);console.log(`REPORT ${output.pathname}`);if(failures)process.exitCode=1;
