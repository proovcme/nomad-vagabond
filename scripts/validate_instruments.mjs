#!/usr/bin/env node
/** Release contract for real HUD wiring, physical units and modal/mode visibility.
 * Uses the exported production functions and only IDs actually present in index.html.
 * Does not emulate CSS layout or substitute for a browser screenshot.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
globalThis.BABYLON=require('../vendor/babylon.js');
const B=BABYLON,root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const matches=[...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)],ids=matches.map(m=>m[1]);
const counts=new Map();for(const id of ids)counts.set(id,(counts.get(id)||0)+1);
const nodes=new Map(ids.map(id=>[id,{id,style:{},dataset:{},hidden:false,textContent:'',innerHTML:'',attributes:{},setAttribute(name,value){this.attributes[name]=String(value);},getAttribute(name){return this.attributes[name]??null;},classList:{add(){},remove(){},toggle(){}}}]));
globalThis.document={getElementById:id=>nodes.get(id)||null};
const {aircraftInstrumentValues,GameUI}=await import('../src/ui.js');
const report={checks:[],scope:'Production gauge conversions and updateHUD SVG transforms, HTML ID binding, and modal/mode visibility. CSS layout and visual quality require browser inspection.'};
function check(name,fn){try{const evidence=fn();report.checks.push({name,passed:true,evidence});console.log('PASS',name);}catch(error){report.checks.push({name,passed:false,error:error.message});console.error('FAIL',name,error.message);}}
const needleIds=['airspeed-needle','altimeter-needle','throttle-needle'];
const angle=id=>{const transform=nodes.get(id)?.getAttribute('transform');const found=/^rotate\(([-\d.]+) 50 50\)$/.exec(transform||'');assert(found,`${id} has no valid SVG rotation: ${transform}`);const value=Number(found[1]);assert(Number.isFinite(value),`${id} angle is nonfinite`);assert(value>=-130-1e-8&&value<=130+1e-8,`${id} left its physical sweep`);return value;};
check('HUD and instrument IDs are unique and attached to the shipped SVG markup',()=>{
 const duplicates=[...counts].filter(([,count])=>count!==1);assert.deepEqual(duplicates,[]);
 for(const id of ['hud','aviation-instruments','flight-dial','altimeter-dial','throttle-dial','dial-speed','dial-alt','dial-vspd','dial-throttle',...needleIds])assert.equal(counts.get(id),1,`Missing ${id}`);
 for(const id of needleIds)assert(new RegExp(`<g\\b[^>]*\\bid=["']${id}["']`).test(html),`${id} must bind to an SVG group`);
 assert(/#aviation-instruments\[hidden\][^}]*display\s*:\s*none\s*!important/.test(html),'Instrument display style must respect the hidden attribute');
 return {uniqueIds:ids.length,needles:needleIds};
});
check('Physical units convert correctly at a nonzero flight condition',()=>{
 const v=aircraftInstrumentValues(50,250,.5);assert.equal(v.airspeedKmh,180);assert.equal(v.altitude,250);assert.equal(v.throttlePercent,50);assert.equal(v.speedAngle,-26);assert.equal(v.altitudeAngle,-65);assert.equal(v.throttleAngle,0);return v;
});
check('Invalid, negative and over-range inputs keep finite needles inside their sweeps',()=>{
 const cases=[[0,0,0],[-1,-100,-.1],[NaN,Infinity,undefined],[Infinity,NaN,null],[200,3000,2]];
 for(const args of cases){const v=aircraftInstrumentValues(...args);for(const [key,n]of Object.entries(v))assert(Number.isFinite(n),`${key} is nonfinite for ${args}`);for(const key of['speedAngle','altitudeAngle','throttleAngle'])assert(v[key]>=-130&&v[key]<=130);assert(v.throttlePercent>=0&&v.throttlePercent<=100);}
 const zero=aircraftInstrumentValues(-1,-100,-1);assert.equal(zero.airspeedKmh,0);assert.equal(zero.altitude,0);assert.equal(zero.throttlePercent,0);
 return {inputCases:cases.length};
});
const ui=new GameUI();
function fixture(){
 return {ship:{velocity:new B.Vector3(50,0,0),group:{position:new B.Vector3(0,125,0),rotationQuaternion:B.Quaternion.Identity()},hull:60,maxHull:120,fuel:79,throttle:.5,atmoDensity:1,upgrades:new Set(),spec:{name:'Проверочный самолёт'}},player:{velocity:B.Vector3.Zero(),group:{position:B.Vector3.Zero()},currentPlanet:null,currentAsteroid:null},world:{planets:[],seedStr:'HUD-QA',stormWarning:0,stormActive:false},base:{velocity:B.Vector3.Zero(),integrity:90,maxIntegrity:100,enginePower:.25,heat:0,group:{position:B.Vector3.Zero(),rotation:{y:0}},name:'Проверочный остров'}};
}
function update(f,mode){ui.setMode(mode);ui.updateHUD(f.ship,f.player,f.world,mode,0,f.base,{title:'Испытание приборов',desc:'Фактические показания',resources:'Лом 80'});}
check('updateHUD writes actual flight values to all three SVG needles and windows',()=>{
 const f=fixture();update(f,'aircraft');assert.equal(ui.dialSpeed.textContent,'180');assert.equal(ui.dialAlt.textContent,'250 м');assert.equal(ui.throttleVal.textContent,'50');
 assert.equal(angle('airspeed-needle'),-26);assert.equal(angle('altimeter-needle'),-65);assert.equal(angle('throttle-needle'),0);
 assert.equal(ui.hullPct.textContent,'50%');assert.equal(ui.fuelPct.textContent,'79%');
 const before=needleIds.map(angle);f.ship.velocity.set(100,0,0);f.ship.group.position.y=375;f.ship.throttle=1;update(f,'aircraft');
 const after=needleIds.map(angle);for(let i=0;i<3;i++)assert(after[i]>before[i],`${needleIds[i]} did not respond to live flight state`);
 assert.equal(ui.dialSpeed.textContent,'360');assert.equal(ui.dialAlt.textContent,'500 м');assert.equal(ui.throttleVal.textContent,'100');return {before,after};
});
check('A moving carrier is subtracted from airspeed rather than displayed as aircraft speed',()=>{
 const f=fixture();f.ship.velocity.set(60,0,0);f.ship.dockedAsteroid={velocity:new B.Vector3(10,0,0),name:'Носитель',biomeLabel:'Палуба'};update(f,'aircraft');assert.equal(ui.dialSpeed.textContent,'180');assert.equal(angle('airspeed-needle'),-26);return {worldSpeedMetresPerSecond:60,carrierSpeedMetresPerSecond:10,displayKilometresPerHour:ui.dialSpeed.textContent};
});
check('Live zero and over-range flight states do not push SVG needles past the stops',()=>{
 const f=fixture();f.ship.velocity.set(0,0,0);f.ship.group.position.y=-250;f.ship.throttle=0;update(f,'aircraft');for(const id of needleIds)assert.equal(angle(id),-130);assert.equal(ui.dialAlt.textContent,'0 м');
 f.ship.velocity.set(200,0,0);f.ship.group.position.y=2875;f.ship.throttle=2;update(f,'aircraft');for(const id of needleIds)assert.equal(angle(id),130);assert.equal(ui.throttleVal.textContent,'100');return {zeroStopDegrees:-130,maximumStopDegrees:130};
});
check('Foot, space ship and island helm modes hide aircraft instruments and retain their own status',()=>{
 const f=fixture();for(const mode of ['foot','ship','asteroid']){update(f,mode);assert.equal(ui.aviationInstruments.hidden,true);assert.equal(ui.flightDial.style.display,'none');assert.equal(ui.hud.dataset.controlMode,mode);assert(!ui.speedVal.textContent.includes('NaN'));}
 update(f,'foot');assert.equal(ui.hullLabel.textContent,'Корпус борта');assert.equal(ui.hullPct.textContent,'50%');assert.equal(ui.fuelPct.textContent,'79%');assert.equal(ui.speedVal.textContent,'0 м/с');
 update(f,'aircraft');assert.equal(ui.aviationInstruments.hidden,false);assert.equal(ui.flightDial.style.display,'flex');assert.equal(ui.speedVal.textContent,'');return {nonAircraftModes:['foot','ship','asteroid'],aircraftRestored:true};
});
check('Mode changes while a modal hides the HUD never reveal it, and restoring keeps the selected mode',()=>{
 const f=fixture();ui.showHUD(false);
 for(const mode of ['aircraft','foot','ship','aircraft']){update(f,mode);assert.equal(ui.hud.style.display,'none');assert.equal(ui.hud.getAttribute('aria-hidden'),'true');}
 ui.showHUD(true);assert.equal(ui.hud.style.display,'block');assert.equal(ui.hud.getAttribute('aria-hidden'),'false');assert.equal(ui.aviationInstruments.hidden,false);
 ui.showHUD(false);update(f,'foot');ui.showHUD(true);assert.equal(ui.aviationInstruments.hidden,true);assert.equal(ui.hud.dataset.controlMode,'foot');return {hiddenTransitions:4,restoredModes:['aircraft','foot']};
});
clearTimeout(ui.toastTimeout);clearTimeout(ui._locBannerTimer);clearTimeout(ui._radioTimer);
report.passed=report.checks.every(c=>c.passed);report.count=report.checks.length;
const output=path.join(root,'artifacts/deploy-20261114/instrument-contracts.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(`REPORT ${output}`);
if(!report.passed)process.exitCode=1;
