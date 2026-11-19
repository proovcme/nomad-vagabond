#!/usr/bin/env node
/** Detect visible rock triangles penetrating the actual open hangar, not just coplanar faces. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;
Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
const gradient={addColorStop(){}};
const ctx=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4)}),measureText:()=>({width:100})},{get:(t,k)=>t[k]||(()=>{})});
const element=()=>({width:256,height:256,style:{},getContext:()=>ctx,addEventListener(){},removeEventListener(){},setAttribute(){},appendChild(){},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect:()=>({width:100,height:100})});
globalThis.document={createElement:element,getElementById:element,addEventListener(){},removeEventListener(){},body:{appendChild(){},append(){}}};globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};globalThis.OffscreenCanvas=class{constructor(w,h){this.width=w;this.height=h;}getContext(){return ctx;}};
const {SkyArchipelagoWorld}=await import('../src/skyArchipelago.js');const{AsteroidBase}=await import('../src/asteroidBase.js');const{HANGAR_BOUNDS}=await import('../src/hangar.js');
const margin=.10;
function inside(p){
 // North facade is closed at x=2.4; the south-central portal continues out to x=9.
 const front=p.z>10.6?2.4:HANGAR_BOUNDS.maxX;
 return p.x>HANGAR_BOUNDS.minX+margin&&p.x<front-margin&&p.y>HANGAR_BOUNDS.floorY+margin&&p.y<HANGAR_BOUNDS.ceilingY-margin&&p.z>HANGAR_BOUNDS.minZ+margin&&p.z<HANGAR_BOUNDS.maxZ-margin;
}
assert(inside(new B.Vector3(-25,8,15)),'synthetic interior point detected');assert(!inside(new B.Vector3(-25,3.4,15)),'solid floor boundary excluded');assert(!inside(new B.Vector3(5,8,20)),'outside closed north facade excluded');
const engine=new B.NullEngine({renderWidth:32,renderHeight:32}),scene=new B.Scene(engine);scene.useRightHandedSystem=true;const camera=new B.FreeCamera('rockAuditCamera',new B.Vector3(0,60,100),scene);camera.setTarget(B.Vector3.Zero());
const world=new SkyArchipelagoWorld(scene,'AETHER-742'),base=new AsteroidBase(scene,742);world.registerVagabondBase(base);base.group.computeWorldMatrix(true);const baseInverse=base.group.getWorldMatrix().clone().invert();
const findings=[],checked=[];
for(const mesh of base.group.getChildMeshes()){
 if(!mesh.isEnabled()||!mesh.isVisible||mesh.visibility<.999)continue;
 if(!/vagStrata|vagabondUnifiedRockShell|vagCarrierRock|asteroidBaseRock|vagUpperMoss/.test(mesh.name)&&!/^vagabondRock|vagabondMossRock/.test(mesh.material?.name||''))continue;
 const positions=mesh.getVerticesData(B.VertexBuffer.PositionKind),indices=mesh.getIndices();if(!positions||!indices)continue;
 const matrix=mesh.computeWorldMatrix(true).multiply(baseInverse),vertices=[];let vertexHits=0,triangleHits=0;const examples=[];
 for(let i=0;i<positions.length;i+=3){const point=B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,i),matrix);vertices.push(point);if(inside(point)){vertexHits++;if(examples.length<8)examples.push({kind:'vertex',position:point.asArray()});}}
 for(let i=0;i<indices.length;i+=3){const a=vertices[indices[i]],b=vertices[indices[i+1]],c=vertices[indices[i+2]],centroid=a.add(b).addInPlace(c).scaleInPlace(1/3);
  const samples=[centroid,a.add(b).scaleInPlace(.5),a.add(c).scaleInPlace(.5),b.add(c).scaleInPlace(.5)];const hit=samples.find(inside);
  if(hit){triangleHits++;if(examples.length<12)examples.push({kind:'triangle-centroid-or-edge',triangle:i/3,position:hit.asArray()});}
 }
 const entry={mesh:mesh.name,vertices:vertices.length,triangles:indices.length/3,vertexHits,triangleHits,examples};checked.push(entry);if(vertexHits||triangleHits)findings.push(entry);
}
const report={date:new Date().toISOString(),status:findings.length?'fail':'pass',method:'Transform actual visible rock vertices, triangle centroids and edge midpoints into base coordinates and test against open room volume.',marginMetres:margin,bounds:HANGAR_BOUNDS,northFacadeX:2.4,selfTest:{interiorDetected:true,floorExcluded:true,northFacadeExteriorExcluded:true},checked,findings};
const ri=process.argv.indexOf('--report'),output=path.resolve(ri>=0?process.argv[ri+1]:'artifacts/deploy-20261114/hangar-rock-validation.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(`${findings.length?'FAIL':'PASS'} ${checked.length} visible rock meshes; ${findings.length} intruding meshes`);for(const f of findings)console.log(f.mesh,'vertices',f.vertexHits,'triangles',f.triangleHits,JSON.stringify(f.examples.slice(0,2)));console.log(`REPORT ${output}`);scene.dispose();engine.dispose();if(findings.length)process.exitCode=1;
