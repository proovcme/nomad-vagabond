#!/usr/bin/env node
// Production contract tests: real scene transforms, swept ordnance and exactly-once rewards.
import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire}from'node:module';const require=createRequire(import.meta.url);globalThis.BABYLON=require('../vendor/babylon.js');const B=BABYLON;
globalThis.document={addEventListener(){},removeEventListener(){}};globalThis.window={addEventListener(){},removeEventListener(){}};
const {AircraftJobs}=await import('../src/aircraftJobs.js');
const engine=new B.NullEngine(),scene=new B.Scene(engine);const group=(name,p)=>{const n=new B.TransformNode(name,scene);n.position.copyFrom(p);return n;};
const base={group:group('jobBase',new B.Vector3(0,35,0)),velocity:B.Vector3.Zero(),padLocalPos:new B.Vector3(-3,3.38,0)};
const world={forestIsland:{group:group('forest',new B.Vector3(340,85,-260)),getTopHeightLocal:()=>2,topY:2},industrialIsland:{group:group('industrial',new B.Vector3(-290,-10,-340)),getTopHeightLocal:()=>2.35,topY:2.35}};
const ship={variant:'cargo',hull:100,velocity:B.Vector3.Zero(),group:group('jobPlane',new B.Vector3(0,40,0)),keys:{},projectiles:[],dockedAsteroid:null};
let salvage=80;const paid=[];const jobs=new AircraftJobs(scene,world,base,{onReward:(amount,data)=>{salvage+=amount;paid.push(data);}});const context={ship,controlMode:'aircraft'};const checks=[];
const test=(name,fn)=>{fn();checks.push({name,passed:true});console.log('PASS',name);};
function projectile(kind,from,to){const mesh=B.MeshBuilder.CreateSphere('testOrdnance',{diameter:.1},scene);mesh.position.copyFrom(to);ship.projectiles.push({kind,previousPosition:from.clone(),mesh,life:1,vel:to.subtract(from)});}
test('Cargo does not collect by proximity, speed or wrong aircraft without winch input',()=>{
 jobs.start('cargo');const e=jobs.entities[0];ship.group.position.copyFrom(e.root.getAbsolutePosition()).addInPlace(new B.Vector3(0,7,0));for(let i=0;i<40;i++)jobs.update(.1,context);assert.equal(jobs.snapshot.completed,0);
 ship.keys.KeyF=true;ship.velocity.x=10;for(let i=0;i<40;i++)jobs.update(.1,context);assert.equal(jobs.snapshot.completed,0);
 ship.velocity.x=0;ship.variant='fighter';for(let i=0;i<40;i++)jobs.update(.1,context);assert.equal(jobs.snapshot.completed,0);ship.variant='cargo';
});
test('Cargo physically winches three crates and pays only after home docking, exactly once',()=>{
 for(const e of jobs.entities){ship.group.position.copyFrom(e.root.getAbsolutePosition()).addInPlace(new B.Vector3(0,7,0));for(let i=0;i<26;i++)jobs.update(.1,context);assert(e.collected);assert.equal(e.root.parent,ship.group);}
 assert.equal(jobs.snapshot.stage,'deliver');assert.equal(salvage,80);ship.group.position.copyFrom(base.group.position);jobs.update(.1,context);assert.equal(salvage,80);ship.dockedAsteroid=base;jobs.update(.1,{...context,landed:true});assert.equal(salvage,110);for(let i=0;i<50;i++)jobs.update(.1,context);assert.equal(salvage,110);assert.equal(jobs.snapshot.stage,'complete');ship.dockedAsteroid=null;ship.keys={};
});
test('Fighter scouts move and their actual swept return-fire bolts damage the player',()=>{
 ship.variant='fighter';jobs.start('fighter');const e=jobs.entities[0],before=e.root.position.clone();ship.group.position.copyFrom(before).addInPlace(new B.Vector3(0,0,50));e.fireCooldown=0;for(let i=0;i<10;i++)jobs.update(.1,context);assert(B.Vector3.Distance(before,e.root.position)>1);assert(ship.hull<100,'Return-fire projectile must hit, not just appear');
});
test('Fighter contract requires actual swept projectile hits on both scouts and pays once',()=>{
 for(const e of jobs.entities){const p=e.root.getAbsolutePosition().clone();for(let i=0;i<3;i++)projectile('bullet',p.add(new B.Vector3(-20,0,0)),p.add(new B.Vector3(20,0,0)));jobs.update(0,context);assert.equal(e.alive,false);}
 assert.equal(jobs.snapshot.stage,'complete');assert.equal(salvage,140);jobs.update(.1,context);assert.equal(salvage,140);
});
test('Attacker rocket salvos destroy two real flak positions; wrong variant cannot advance',()=>{
 ship.variant='attacker';jobs.start('attacker');const first=jobs.entities[0],center=first.root.getAbsolutePosition().add(new B.Vector3(0,2,0));projectile('rocket',center.add(new B.Vector3(-20,0,0)),center.add(new B.Vector3(20,0,0)));ship.variant='fighter';jobs.update(0,context);assert.equal(first.hp,140);ship.variant='attacker';
 for(const e of jobs.entities){const p=e.root.getAbsolutePosition().add(new B.Vector3(0,2,0));for(let i=0;i<2;i++)projectile('rocket',p.add(new B.Vector3(-20,0,0)),p.add(new B.Vector3(20,0,0)));jobs.update(0,context);assert.equal(e.alive,false);}
 assert.equal(jobs.snapshot.stage,'complete');assert.equal(salvage,170);
});
test('Bombing requires bomb impacts at each depot, rejects gunfire, misses and duplicate hits',()=>{
 ship.variant='bomber';jobs.start('bomber');jobs.update(0,context);const a=jobs.entities[0].root.getAbsolutePosition().add(new B.Vector3(0,1.5,0)),b=jobs.entities[1].root.getAbsolutePosition().add(new B.Vector3(0,1.5,0));
 assert.equal(jobs.onProjectileImpact({kind:'bullet',position:a}),false);assert.equal(jobs.onProjectileImpact({kind:'bomb',position:a.add(new B.Vector3(30,0,0))}),false);assert.equal(jobs.snapshot.completed,0);
 assert.equal(jobs.onProjectileImpact({kind:'bomb',position:a}),true);assert.equal(jobs.snapshot.completed,1);assert.equal(jobs.onProjectileImpact({kind:'bomb',position:a}),false);assert.equal(salvage,170);
 assert.equal(jobs.onProjectileImpact({kind:'bomb',position:b}),true);assert.equal(jobs.snapshot.stage,'complete');assert.equal(salvage,200);jobs.onProjectileImpact({kind:'bomb',position:b});assert.equal(salvage,200);
});
test('Contracts repeat with a new ID; disposal removes only owned targets and never pays cancellation',()=>{
 const old=jobs.snapshot.id;jobs.start('bomber');assert(jobs.snapshot.id>old);assert.equal(jobs.snapshot.completed,0);assert.equal(jobs.snapshot.reward,0);const owned=jobs.entities.map(e=>e.root);jobs.dispose();assert(owned.every(n=>n.isDisposed()));assert.equal(base.group.isDisposed(),false);assert.equal(world.forestIsland.group.isDisposed(),false);assert.equal(salvage,200);assert.equal(paid.length,4);
});
fs.mkdirSync(new URL('../artifacts/deploy-20261114/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../artifacts/deploy-20261114/aircraft-jobs-contracts.json',import.meta.url),JSON.stringify({checks,passed:true,salvageBefore:80,salvageAfter:salvage,rewards:paid,scope:'Real production contract update/impact functions, scene transforms, swept projectiles, physical loading constraints and exactly-once economy. Headless loading skips visual assets; browser flight and art verification remain required.'},null,2));scene.dispose();engine.dispose();
