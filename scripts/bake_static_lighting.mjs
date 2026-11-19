#!/usr/bin/env node
/** Detect visible rock triangles penetrating the actual open hangar, not just coplanar faces. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;
Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const element=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:100,height:100})});
globalThis.document={createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};

const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');
const {AsteroidBase}=await import('../src/asteroidBase.js');
const {bakeTargets,refineBakeSurface,sceneTriangles,buildBakeBVH,bakeVertex,geometryKey,BAKE_VERSION}=await import('../src/bakedLighting.js');
const engine=new B.NullEngine(),scene=new B.Scene(engine);scene.useRightHandedSystem=true;
const cam=new B.FreeCamera('bakeCamera',new B.Vector3(0,60,100),scene);scene.activeCamera=cam;
const world=new SkyArchipelagoWorld(scene,'AETHER-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);
const targets=bakeTargets(scene);targets.forEach(m=>refineBakeSurface(m));
const triangles=sceneTriangles(targets),tree=buildBakeBVH(triangles),meshes={},report=[];
console.log('Baking',targets.length,'meshes',triangles.length,'triangles');
for(const mesh of targets){
 const start=performance.now(),positions=mesh.getVerticesData('position'),normals=mesh.getVerticesData('normal'),matrix=mesh.computeWorldMatrix(true),normalMatrix=B.Matrix.Transpose(B.Matrix.Invert(matrix)),data=[];
 for(let i=0;i<positions.length;i+=3){
  const p=B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,i),matrix),n=B.Vector3.TransformNormal(B.Vector3.FromArray(normals,i),normalMatrix).normalize();
  data.push(...bakeVertex(tree,p.asArray(),n.asArray()).map(x=>+x.toFixed(4)));
 }
 meshes[geometryKey(mesh)]=data;
 const ao=data.filter((_,i)=>i%5===3);const row={name:mesh.name,vertices:positions.length/3,minAO:Math.min(...ao),meanAO:ao.reduce((a,b)=>a+b,0)/ao.length,maxAO:Math.max(...ao),ms:Math.round(performance.now()-start)};report.push(row);console.log(JSON.stringify(row));
}
fs.mkdirSync('assets/lighting',{recursive:true});fs.writeFileSync('assets/lighting/static-irradiance-v2.json',JSON.stringify({version:BAKE_VERSION,seed:'AETHER-742',samples:24,maxDistance:24,occluders:targets.map(geometryKey).sort(),meshes}));
fs.writeFileSync('artifacts/lighting-20261114/bake-report.json',JSON.stringify({engine:B.Engine.Version,triangles:triangles.length,meshes:report},null,2));
scene.dispose();engine.dispose();
