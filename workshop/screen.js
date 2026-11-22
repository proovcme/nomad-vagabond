import {openingFrame} from '../src/content/cinematic.js';
import {ExplosionEffects} from '../src/explosionEffects.js';
import {createCruiserMaterials} from '../src/props/flightDeckCruiser.js';
import {buildPursuitDestroyer} from '../src/props/pursuitDestroyer.js';
const B=BABYLON,mode=new URLSearchParams(location.search).get('mode'),canvas=document.querySelector('canvas'),caption=document.querySelector('output');
const engine=new B.Engine(canvas,true,{preserveDrawingBuffer:true}),scene=new B.Scene(engine);
scene.clearColor=new B.Color4(.32,.43,.49,1);
const camera=new B.ArcRotateCamera('orbit',-1.2,1.22,12,new B.Vector3(0,2,0),scene);camera.minZ=.05;camera.attachControl(canvas,true);
new B.HemisphericLight('sky',new B.Vector3(.3,1,.2),scene).intensity=1.05;
const sun=new B.DirectionalLight('sun',new B.Vector3(.54,-.7,.21),scene);sun.intensity=2.15;sun.diffuse=new B.Color3(1,.87,.72);
const send=(type,data={})=>parent.postMessage({type,...data},location.origin);
const plane=new B.TransformNode('plane',scene);let escort,fx,playhead=0,playing=false,shots=[],rec;
let shotCam;
async function setup(){
 if(mode==='shots'){
   createCruiserMaterials(scene);escort=buildPursuitDestroyer(scene);escort.position.set(-70,-5,-60);
   const loaded=await B.SceneLoader.ImportMeshAsync('','../assets/aircraft/','scrapyard_plane.glb',scene);
   for(const node of loaded.meshes.filter(m=>!m.parent))node.parent=plane;
   shotCam=new B.FreeCamera('shot',B.Vector3.Zero(),scene);scene.activeCamera=shotCam;
 }else if(mode==='characters'){
   const result=await B.SceneLoader.ImportMeshAsync('','../assets/character/','nomad_hero.glb',scene);
   const bounds=result.meshes[0].getHierarchyBoundingVectors(true);
   camera.setTarget(bounds.min.add(bounds.max).scale(.5));camera.radius=bounds.max.subtract(bounds.min).length()*1.45;
   result.animationGroups.forEach(g=>g.stop());send('animations',{names:result.animationGroups.map(g=>g.name)});
 }else{fx=new ExplosionEffects(scene);camera.radius=19;camera.setTarget(new B.Vector3(0,2,0));fx.spawn(new B.Vector3(0,2,0),1);}
 caption.textContent='';send('ready');
}
function startRecording(){
 if(!window.MediaRecorder||!canvas.captureStream){send('error',{message:'Запись видео недоступна в этом браузере'});return;}
 const stream=canvas.captureStream(30),chunks=[];const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(s=>MediaRecorder.isTypeSupported(s));if(!type){stream.getTracks().forEach(t=>t.stop());send('error',{message:'Этот браузер не поддерживает запись WebM'});return;}
 rec=new MediaRecorder(stream,{mimeType:type});rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob(chunks,{type}));a.href=url;a.download='brodyaga-previz.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);stream.getTracks().forEach(t=>t.stop());rec=null;send('recorded');};rec.start();playing=true;playhead=0;
}
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin)return;const d=e.data;
 if(d.type==='timeline'){shots=d.shots;playhead=d.time||0;playing=d.play===true;}
 if(d.type==='record'&&shotCam&&shots.length&&!rec)startRecording();
 if(d.type==='effect'&&fx)fx.spawn(new B.Vector3(0,2,0),d.scale);
 if(d.type==='animate'){scene.animationGroups.forEach(g=>g.stop());scene.animationGroups.find(g=>g.name===d.name)?.start(true);}
});
setup().catch(e=>{caption.textContent='Ошибка загрузки';send('error',{message:e.message});});
new ResizeObserver(()=>engine.resize()).observe(canvas);
engine.runRenderLoop(()=>{
 const dt=Math.min(.1,engine.getDeltaTime()/1000);
 if(mode==='shots'&&shotCam&&shots.length){if(playing){playhead+=dt;const end=shots.reduce((n,s)=>n+s.seconds,0);if(playhead>=end){playhead=end;playing=false;if(rec?.state==='recording')rec.stop();}send('time',{time:playhead});}
 const shot=openingFrame(shotCam,plane,escort,playhead,shots);caption.textContent=shot.title+' · '+shot.subtitle;}
 fx?.update(dt);scene.render();
});
