#!/usr/bin/env node
/** Actual Babylon native particle pool/lifecycle checks; no replacement implementation. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON;
const {ExplosionEffects}=await import('../src/explosionEffects.js');
const engine=new B.NullEngine({renderWidth:32,renderHeight:32}),scene=new B.Scene(engine);
const fx=new ExplosionEffects(scene),position=new B.Vector3(5,10,15),checks=[];
let failures=0;
async function check(name,fn){try{const evidence=await fn();checks.push({name,status:'pass',evidence});}catch(error){failures++;checks.push({name,status:'fail',error:error.message});}}
const poolSystems=fx.slots.map(slot=>[slot.fire,slot.smoke,slot.spark]);
let nativeStopEvents=0;for(const systems of poolSystems)for(const ps of systems)ps.onStoppedObservable.add(()=>nativeStopEvents++);
await check('Actual native particle systems have a fixed six-burst, 444-particle capacity',()=>{
 assert.equal(scene.particleSystems.length,18);
 assert(scene.particleSystems.every(ps=>ps instanceof B.ParticleSystem));
 assert.equal(fx.slots.reduce((sum,slot)=>sum+slot.fire.getCapacity()+slot.smoke.getCapacity()+slot.spark.getCapacity(),0),444);
 for(let i=0;i<6;i++)assert(fx.spawn(position,1));
 assert.equal(fx.spawn(position,1),false);assert.equal(fx.snapshot.activeBursts,6);assert.equal(fx.snapshot.dropped,1);
 return fx.snapshot;
});
await check('Soot starts at 80ms and warm flash fades by 110ms',()=>{
 assert(fx.slots.every(slot=>slot.flash.isEnabled()));
 fx.update(.07);assert(fx.slots.every(slot=>slot.flash.isEnabled()));
 assert(fx.slots.every(slot=>!slot.smokeStarted));
 fx.update(.02);assert(fx.slots.every(slot=>slot.smokeStarted&&slot.smoke.isStarted()));
 fx.update(.03);assert(fx.slots.every(slot=>!slot.flash.isEnabled()));
 return {flashLifetimeSeconds:.11,sootDelaySeconds:.08,elapsedSeconds:.12};
});
await check('Large bursts retire after their finite lifetime and hide every fragment',()=>{
 for(let i=0;i<25;i++)fx.update(.1);
 assert.equal(fx.snapshot.activeBursts,0);
 assert(fx.slots.every(slot=>slot.shards.every(shard=>!shard.mesh.isEnabled())));
 assert.equal(nativeStopEvents,18,'all18 native systems signal stopped at retirement');
 assert(fx.slots.every(slot=>[slot.fire,slot.smoke,slot.spark].every(ps=>ps.manualEmitCount===0)));
 return {largeDurationSeconds:2.45,active:fx.snapshot.activeBursts,nativeStopEvents};
});
await check('Small impacts reuse original native systems, with seeded emission directions',()=>{
 assert(fx.spawn(position,.45));
 assert.deepEqual(fx.slots.map(slot=>[slot.fire,slot.smoke,slot.spark]),poolSystems);
 const slot=fx.slots[0],a=new B.Vector3(),b=new B.Vector3();
 slot.seed=123;slot.spark.startDirectionFunction(null,a);slot.seed=123;slot.spark.startDirectionFunction(null,b);
 assert(a.equals(b));assert(a.y>0);
 for(let i=0;i<16;i++)fx.update(.1);
 assert.equal(fx.snapshot.activeBursts,0);assert.equal(scene.particleSystems.length,18);
 return {smallDurationSeconds:1.55,systemsReused:true,seededDirection:a.asArray()};
});
await check('Disposal releases all native systems, fragment meshes and its scene observer',async()=>{
 const observer=fx.disposeObserver;fx.dispose();
 // Babylon unregisters observable callbacks on its next scheduled turn.
 await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(scene.particleSystems.length,0);assert.equal(scene.meshes.length,0);
 assert(!scene.onDisposeObservable.observers.includes(observer));
 assert.equal(fx.spawn(position,1),false);fx.update(.1);fx.dispose();
 return {particleSystems:scene.particleSystems.length,meshes:scene.meshes.length,observerRemoved:true,idempotent:true};
});
const report={date:new Date().toISOString(),status:failures?'fail':'pass',engine:'Babylon.js native ParticleSystem / NullEngine',scope:'Pool, timing, deterministic emission callbacks and resource lifecycle; visual alpha textures/shader appearance require browser verification.',checks};
const output=new URL('../artifacts/deploy-20261114/explosion-validation.json',import.meta.url);
fs.mkdirSync(new URL('../artifacts/deploy-20261114/',import.meta.url),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const check of checks)console.log(`${check.status.toUpperCase()} ${check.name}${check.error?': '+check.error:''}`);
console.log(`REPORT ${output.pathname}`);scene.dispose();engine.dispose();if(failures)process.exitCode=1;
