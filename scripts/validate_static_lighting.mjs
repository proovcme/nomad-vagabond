#!/usr/bin/env node
/** Detect visible rock triangles penetrating the actual open hangar, not just coplanar faces. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;
Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const element=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:100,height:100})});
globalThis.document={createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};

const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');const{AsteroidBase}=await import('../src/asteroidBase.js');
const {bakeTargets,refineBakeSurface,geometryKey,sceneTriangles,buildBakeBVH,bakeVertex,traceBakeRay,BAKE_VERSION,applyBakedData}=await import('../src/bakedLighting.js');
const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.useRightHandedSystem=true;
const cam=new B.FreeCamera('validationCamera',new B.Vector3(0,60,100),scene);scene.activeCamera=cam;
const world=new SkyArchipelagoWorld(scene,'AETHER-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);
const targets=bakeTargets(scene),winding=[];
function orientation(mesh){
 const p=mesh.getVerticesData('position'),n=mesh.getVerticesData('normal'),ids=mesh.getIndices();let wrong=0,area=0,badArea=0,volume=0;
 for(let i=0;i<ids.length;i+=3){const a=B.Vector3.FromArray(p,ids[i]*3),b=B.Vector3.FromArray(p,ids[i+1]*3),c=B.Vector3.FromArray(p,ids[i+2]*3),cross=B.Vector3.Cross(b.subtract(a),c.subtract(a)),normal=B.Vector3.FromArray(n,ids[i]*3).add(B.Vector3.FromArray(n,ids[i+1]*3)).add(B.Vector3.FromArray(n,ids[i+2]*3));
  const dot=B.Vector3.Dot(cross,normal),weight=cross.length();area+=weight;volume+=B.Vector3.Dot(a,B.Vector3.Cross(b,c))/6;
  if(dot>1e-8){wrong++;badArea+=weight;}
 }
 return {name:mesh.name,triangles:ids.length/3,wrong,wrongAreaFraction:badArea/area,signedVolume:volume};
}
const reference=B.MeshBuilder.CreateBox('nativeReference',{},scene);assert.equal(reference.sideOrientation,B.Material.ClockWiseSideOrientation);assert.equal(orientation(reference).wrong,0);
reference.flipFaces(false);assert(orientation(reference).wrong>0,'synthetic inversion caught');reference.dispose();
for(const mesh of targets.filter(m=>/^generatedIsland_|vagabondUnifiedRockShell/.test(m.name))){assert.equal(mesh.sideOrientation,reference.sideOrientation,'native front-face state');const result=orientation(mesh);assert(result.wrongAreaFraction<.005,JSON.stringify(result));winding.push(result);}
for(const island of [...world.islands.map(i=>i.generated).filter(Boolean),...world.landmarks.halves]){
 const a=orientation(island.terrain),b=orientation(island.rock);assert(a.signedVolume+b.signedVolume<0,'closed island has native Babylon clockwise volume');
 const normals=island.terrain.getVerticesData('normal');assert(normals[1]>0,'top physical normal points upward');
}
// Empty hemisphere and a physically closed box differentiate genuine traced occlusion.
const tiny=B.MeshBuilder.CreateBox('testOccluder',{size:4},scene);tiny.position.set(10000,0,0);
const tree=buildBakeBVH(sceneTriangles([tiny]));assert.equal(traceBakeRay(tree,[9996,0,0],[1,0,0],20).distance,2);
const open=bakeVertex(tree,[10000,3,0],[0,1,0]),closed=bakeVertex(tree,[10000,0,0],[0,1,0]);assert(open[3]>.99);assert(closed[3]<.5);assert(open.every(Number.isFinite));tiny.dispose();
const cache=JSON.parse(fs.readFileSync('assets/lighting/static-irradiance-v2.json'));assert.equal(cache.version,BAKE_VERSION);
const cacheRows=[];targets.forEach(m=>refineBakeSurface(m));assert.deepEqual(cache.occluders,targets.map(geometryKey).sort(),'all static bake occluders must match the current scene');
for(const mesh of targets){refineBakeSurface(mesh);const key=geometryKey(mesh),data=cache.meshes[key];assert(data,`stale or missing bake ${key}`);assert.equal(data.length,mesh.getTotalVertices()*5);assert(data.every(Number.isFinite));assert(data.every(v=>v>=0&&v<=1));applyBakedData(mesh,data);assert(mesh.isVerticesDataPresent('bakedIrradiance'));assert(mesh.isVerticesDataPresent('bakedSunVisibility'));assert.equal(mesh._lightSources[0].name,'archSunLight','baked sunlight controls sun slot only');cacheRows.push({name:mesh.name,vertices:mesh.getTotalVertices(),cacheKey:key});}
const report={engine:B.Engine.Version,winding,cache:cacheRows,synthetic:{invertedWindingCaught:true,emptyHemisphere:open[3],closedBox:closed[3],rayDistance:2},scope:'Clockwise render orientation, physical normals, oriented closed volume, actual cached geometry fingerprints and independent ray fixtures. AO and sun visibility are vertex bakes of static architecture/terrain; not a path-traced full-scene GI solution.'};
fs.writeFileSync('artifacts/lighting-20261114/validation.json',JSON.stringify(report,null,2));console.log('PASS',winding.length,'native-oriented island surfaces;',cacheRows.length,'current static vertex bakes; genuine ray visibility fixtures');scene.dispose();engine.dispose();
