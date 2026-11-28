import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { updateShuttle } from '../src/props/airfields.js';
const require=createRequire(import.meta.url);
const {Vector3}=require('../vendor/babylon.js');
const node=()=>({position:Vector3.Zero(),rotation:Vector3.Zero()});
const services=[-1,1].map(sign=>({cart:node(),workers:[node()],sign}));
const root=node(),calls=[];
const line={fields:{ports:[Vector3.Zero(),new Vector3(0,38,600)],axis:new Vector3(0,0,1),side:new Vector3(1,0,0),services},
  planes:[null,{root,hubs:[node()]}],onRadio:(_speaker,who,_text,clip)=>calls.push({who,clip})};
let previous;
for(let tick=0;tick<=1360;tick++){
  const time=tick/10;
  updateShuttle(line,time);
  if(previous)assert.ok(Vector3.Distance(previous,root.position)<2.2,'route discontinuity');
  previous=root.position.clone();
  if(time===36||time===104){
    const east=time===36,port=east?1:0,sign=east?1:-1;
    assert.ok(Math.abs(root.position.y-1.83-line.fields.ports[port].y)<1e-6);
    assert.equal(root.position.z,line.fields.ports[port].z+27*sign);
    assert.equal(services[port].cart.position.x,7*sign);
  }
}
assert.equal(calls.length,8);
assert.deepEqual(calls.filter(c=>c.clip==='civil-cleared').map(c=>c.who),['Восточный аэродром','Западный аэродром']);
for(const {clip} of calls)assert.ok(readFileSync(new URL('../assets/audio/fog-passage/'+clip+'.mp3',import.meta.url)).length>1500);
console.log('PASS outbound and return landing, ground handling, continuous positions and eight radio cues');
