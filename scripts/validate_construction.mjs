import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON;Object.defineProperty(B.NullEngine,'name',{value:'NullEngine',configurable:true});
class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.style={};this.dataset={};this.children=[];this.registry=new Map();this.hidden=false;this.attrs={};this.width=1280;this.height=800;}
  append(...nodes){for(const node of nodes){node.parentNode=this;this.children.push(node);}}
  appendChild(node){this.append(node);return node;}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);}
  setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(){} removeEventListener(){} focus(){} dispatchEvent(){return true;}
  contains(node){while(node){if(node===this)return true;node=node.parentNode;}return false;}
  getBoundingClientRect(){return {left:0,top:0,width:1280,height:800};}
  querySelector(selector){if(!this.registry.has(selector)){const node=new Element();node.parentNode=this;this.registry.set(selector,node);}return this.registry.get(selector);}
  querySelectorAll(selector){const result=[],key=selector.match(/^\[data-([\w-]+)\]$/)?.[1]?.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());const visit=node=>{if(key&&key in node.dataset)result.push(node);for(const child of node.children)visit(child);for(const child of node.registry.values())visit(child);};visit(this);return result;}
}
globalThis.document={createElement:tag=>new Element(tag),body:new Element('body'),addEventListener(){},removeEventListener(){}};
globalThis.window={addEventListener(){},removeEventListener(){},devicePixelRatio:1};
globalThis.CustomEvent=class {constructor(type,options){this.type=type;Object.assign(this,options);}};
const {IslandConstruction}=await import('../src/islandConstruction.js');
const checks=[];let failed=0;const fixtures=[];
function fixture(){
 const engine=new B.NullEngine({renderWidth:1280,renderHeight:800});const canvas=new Element('canvas');engine.getRenderingCanvas=()=>canvas;
 const scene=new B.Scene(engine);scene.useRightHandedSystem=true;
 const camera=new B.FreeCamera('mainCam',new B.Vector3(12,13,14),scene);camera.setTarget(new B.Vector3(0,3,0));camera.fov=.93;
 const group=new B.TransformNode('base',scene);group.position.set(40,35,-20);group.rotation.y=.4;group.computeWorldMatrix(true);
 const base={group,integrity:50};const construction=new IslandConstruction(scene,base);fixtures.push({engine,scene,construction});return {engine,scene,camera,canvas,base,construction};
}
function check(name,fn){try{const evidence=fn();checks.push({name,status:'pass',evidence});}catch(error){failed++;checks.push({name,status:'fail',error:error.message});}}
check('Topdown builder owns a separate viewport and restores camera transform/mode/fov',()=>{
 const {construction:c,camera}=fixture();const old={position:camera.position.clone(),rotation:camera.rotation.clone(),mode:camera.mode,fov:camera.fov,viewport:camera.viewport.clone()};
 c.selectedType='radar';c.update(0,{stage:'build_generator',controlMode:'foot'});c.open();
 assert.equal(c.selectedType,'generator');assert.equal(camera.mode,B.Camera.ORTHOGRAPHIC_CAMERA);assert(camera.viewport.width<.8);c.close();
 assert(camera.position.equals(old.position));assert(camera.rotation.equals(old.rotation));assert.equal(camera.mode,old.mode);assert.equal(camera.fov,old.fov);assert.equal(camera.viewport.width,old.viewport.width);
 return {autoType:c.selectedType,restored:true};
});
check('Ray picking selects a real foundation on a translated/rotated island',()=>{
 const {construction:c,scene,camera,engine,base}=fixture();c.update(0,{stage:'build_generator',controlMode:'foot'});c.open();scene.meshes.forEach(m=>m.computeWorldMatrix(true));scene.updateTransformMatrix(true);
 const point=B.Vector3.TransformCoordinates(new B.Vector3(-18,21.80,-4),base.group.getWorldMatrix());
 const pixel=B.Vector3.Project(point,B.Matrix.Identity(),scene.getTransformMatrix(),camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight()));
 const picked=c._pickPosition({clientX:pixel.x,clientY:pixel.y});assert(picked);assert(Math.hypot(picked.x+18,picked.z+4)<.01);
 c.selectPosition(picked,true);assert(c.positionPinned);return {picked,pixel:pixel.asArray()};
});
check('Invalid edge, stairwell, lift and insufficient power reject without charging',()=>{
 const {construction:c}=fixture();const before=c.salvage;
 assert.equal(c.validatePlacement('generator',{x:0,z:0}).code,'edge');
 assert.equal(c.validatePlacement('generator',{x:-18,z:-6}).code,'stairs');
 assert.equal(c.validatePlacement('generator',{x:-8,z:6.5}).code,'lift');
 assert.equal(c.build('turret',1),false);assert.equal(c.salvage,before);assert.equal(c.buildings.length,0);return {salvage:c.salvage};
});
check('Free placement commits once; overlap and duplicate type never spend twice',()=>{
 const {construction:c}=fixture();c.update(0,{stage:'build_generator',controlMode:'foot'});c.selectPosition({x:-17,z:-3});
 assert(c.build());assert.equal(c.salvage,50);assert.equal(c.buildings[0].position.x,-17);assert.equal(c.buildings[0].position.z,-3);
 assert.equal(c.build('generator',0),false);assert.equal(c.salvage,50);
 c.update(0,{stage:'build_defense',controlMode:'foot'});assert.equal(c.build('turret',{x:-17,z:-3}),false);assert.equal(c.salvage,50);
 assert.equal(c.validatePlacement('turret',{x:-17,z:-3}).code,'occupied');return c.snapshot;
});
check('Generator → turret → radar mission works with nonstandard first placement and exact resources',()=>{
 const {construction:c}=fixture();c.update(0,{stage:'build_generator',controlMode:'foot'});assert(c.build('generator',{x:-17,z:-3}));
 c.update(0,{stage:'build_defense',controlMode:'foot'});assert(c.build('turret',1));assert.equal(c.salvage,15);assert.equal(c.snapshot.powerAvailable,2);
 c.update(0,{stage:'build_radar',controlMode:'foot'});assert.equal(c.build('radar',2),false);assert.equal(c.salvage,15);c.addSalvage(20);assert(c.build('radar',2));
 assert.equal(c.salvage,10);assert.equal(c.snapshot.powerProduced,4);assert.equal(c.snapshot.powerUsed,3);assert.equal(c.buildings.length,3);return c.snapshot;
});
check('A free position cannot block space needed for the rest of the first mission',()=>{
 const {construction:c}=fixture();c.update(0,{stage:'build_generator',controlMode:'foot'});
 const result=c.validateBuild('generator',{x:-14,z:.5});assert.equal(result.code,'capacity');assert.equal(c.build('generator',{x:-14,z:.5}),false);assert.equal(c.salvage,80);return result;
});
check('First click pins a place; second click builds, Enter builds, Escape closes without leaking',()=>{
 const {construction:c}=fixture();c.update(0,{stage:'build_generator',controlMode:'foot'});c.open();c._pickPosition=()=>({x:-18,z:-4});
 let stopped=0,prevented=0;const pointer={button:0,clientX:1,clientY:1,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}};
 c._pointerDown(pointer);assert(c.positionPinned);assert.equal(c.buildings.length,0);c._pointerDown(pointer);assert.equal(c.buildings.length,1);assert.equal(c.salvage,50);
 c.update(0,{stage:'build_defense',controlMode:'foot'});c.selectSocket(1);c._keyHandler({code:'Enter',repeat:false,target:c.canvas,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}});assert.equal(c.buildings.length,2);
 c._keyHandler({code:'Escape',repeat:false,target:c.canvas,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;}});assert(!c.isOpen);assert(stopped>=4&&prevented>=4);return {buildings:c.buildings.length,stopped,prevented};
});
for(const {scene,construction:c}of fixtures){c.dispose();scene.dispose();}
const report={checks,passed:checks.length-failed,failed};fs.mkdirSync('artifacts/deploy-20261114',{recursive:true});fs.writeFileSync('artifacts/deploy-20261114/construction-placement-validation.json',JSON.stringify(report,null,2)+'\n');
for(const check of checks)console.log(`${check.status.toUpperCase()} ${check.name}${check.error?': '+check.error:''}`);
if(failed)process.exitCode=1;
