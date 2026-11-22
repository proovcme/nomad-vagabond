import {finishes,kinds,presets,newPart} from './catalog.js';
import {makeGeometry} from './geometry.js';

const $=id=>document.getElementById(id),B=BABYLON;
const copy=structuredClone, status=s=>{$('status').textContent=s;};
const canvas=$('view'),engine=new B.Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true});
const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.39,.46,.49,1);
const camera=new B.ArcRotateCamera('atelier',-1.07,1.18,25,B.Vector3.Zero(),scene);
camera.attachControl(canvas,true);camera.minZ=.03;camera.maxZ=12000;camera.wheelDeltaPercentage=.018;
const fill=new B.HemisphericLight('northWindow',new B.Vector3(0,1,.3),scene);
fill.intensity=.98;fill.groundColor=new B.Color3(.43,.38,.34);
const sun=new B.DirectionalLight('afternoon',new B.Vector3(.55,-.8,.42),scene);sun.intensity=2.1;sun.diffuse=new B.Color3(1,.87,.69);
const rim=new B.DirectionalLight('bounce',new B.Vector3(-.6,-.2,-.7),scene);rim.intensity=1.05;rim.diffuse=new B.Color3(.73,.85,1);
let doc={version:1,...copy(presets.cutter)},selected=0,wire=false,editable=[],undo=[],redo=[];
const textures=new Map(),materials=new Map();
const axes=['X','Y','Z'],finite=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
const vector=(v,min,max)=>Array.isArray(v)&&v.length===3&&v.every(n=>finite(n,min,max));
function validate(d){
  if(d?.version!==1||typeof d.name!=='string'||!d.name.trim()||d.name.length>80||!Array.isArray(d.parts)||!d.parts.length||d.parts.length>200)throw Error('Нужен проект мастерской с 1–200 деталями.');
  for(const p of d.parts){
    if(!p||!Object.hasOwn(kinds,p.kind)||!Object.hasOwn(finishes,p.material)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||!vector(p.size,.001,2000)||!vector(p.at,-5000,5000)||!vector(p.rotation,-3600,3600))throw Error('Проверьте тип, размеры и положение детали.');
    if(p.color!==undefined&&!/^#[0-9a-f]{6}$/i.test(p.color))throw Error('Некорректный цвет.');
    if(p.roughness!==undefined&&!finite(p.roughness,0,1))throw Error('Шероховатость должна быть от 0 до 1.');
    if(p.texture!==undefined && (typeof p.texture!=='string'||p.texture.length>5600000||!/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.texture)))throw Error('Не удалось прочитать встроенную текстуру.');
    if(p.kind==='loft'&&(!Number.isInteger(p.sides)||!finite(p.sides,3,64)||!Array.isArray(p.sections)||p.sections.length<2||p.sections.length>64||p.sections.some((s,i)=>!Array.isArray(s)||s.length!==4||!finite(s[0],-2000,2000)||!finite(s[1],-2000,2000)||!finite(s[2],.001,2000)||!finite(s[3],.001,2000)||(i>0&&s[0]<=p.sections[i-1][0]))))throw Error('Сечения должны идти по X по возрастанию и иметь положительные радиусы.');
  }
}
const history=()=>({doc:copy(doc),selected});
function remember(){undo.push(history());if(undo.length>30)undo.shift();redo=[];}
function change(fn){
  const prior=history();
  try{fn();validate(doc);}catch(e){doc=prior.doc;selected=prior.selected;refresh();status(e.message);return;}
  undo.push(prior);if(undo.length>30)undo.shift();redo=[];refresh();status('Изменения в рабочем эскизе');
}
function option(label,value){return new Option(label,value);}
for(const [id,d] of Object.entries(presets))$('template').add(option(d.name,id));
for(const [id,name] of Object.entries(kinds))$('kind').add(option(name,id));

function createMaterial(p){
  const [name,color,metal,rough,file]=finishes[p.material];
  const url=p.texture||(file?'../assets/textures/nomad/'+file:null);
  const key=JSON.stringify([p.material,p.color,p.roughness,url]);
  if(!materials.has(key)){
    const m=new B.PBRMaterial(name,scene);
    m.albedoColor=B.Color3.FromHexString(p.color||color).toLinearSpace();
    m.metallic=metal;m.roughness=p.roughness??rough;
    if(url){
      if(!textures.has(url))textures.set(url,new B.Texture(url,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE,null,()=>status('Не удалось загрузить текстуру')));
      m.albedoTexture=textures.get(url);
    }
    materials.set(key,m);
  }
  const m=materials.get(key);m.wireframe=wire;return m;
}
function refresh(){
  editable.forEach(m=>m.dispose());editable=[];const list=$('parts');list.replaceChildren();
  doc.parts.forEach((p,i)=>{
    const mesh=makeGeometry(scene,p);
    mesh.position.set(...p.at);mesh.scaling.set(...p.size);
    mesh.rotation.set(...p.rotation.map(v=>v*Math.PI/180));mesh.material=createMaterial(p);mesh.metadata={workshopPart:i};
    mesh.computeWorldMatrix(true);editable.push(mesh);
    const button=document.createElement('button');button.textContent=p.name;button.classList.toggle('selected',i===selected);
    button.onclick=()=>select(i);list.append(button);
  });
  const used=new Set(editable.map(m=>m.material));
  for(const [k,m] of materials)if(!used.has(m)){m.dispose();materials.delete(k);}
  const usedMaps=new Set([...used].map(m=>m.albedoTexture));
  for(const [k,t] of textures)if(!usedMaps.has(t)){t.dispose();textures.delete(k);}
  $('title').value=doc.name;$('stats').textContent=doc.parts.length+' дет. · '+editable.reduce((n,m)=>n+m.getTotalIndices()/3,0).toLocaleString('ru')+' треуг. · '+used.size+' мат.';
  $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;$('remove').disabled=doc.parts.length===1;inspector();
}
function select(i){selected=i;[...$('parts').children].forEach((b,j)=>b.classList.toggle('selected',i===j));inspector();}
function frame(mode){
  const lo=new B.Vector3(Infinity,Infinity,Infinity),hi=lo.scale(-1);
  for(const m of editable){const bb=m.getBoundingInfo().boundingBox;lo.minimizeInPlace(bb.minimumWorld);hi.maximizeInPlace(bb.maximumWorld);}
  camera.target=lo.add(hi).scale(.5);
  camera.radius=Math.max(.4,hi.subtract(lo).length()*.54/Math.sin(camera.fov/2)*Math.max(1,canvas.clientHeight/canvas.clientWidth));
  camera.lowerRadiusLimit=.15;camera.upperRadiusLimit=Math.max(300,camera.radius*8);
  camera.alpha=mode==='iso'?-1.08:-Math.PI/2;camera.beta=mode==='top'?.015:mode==='side'?Math.PI/2:1.16;
}
function el(tag,text){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;}
function input(type,value,onchange){
  const n=el('input');n.type=type;n.value=value;if(type==='number')n.step='any';
  n.onchange=()=>onchange(type==='number'?n.valueAsNumber:n.value);return n;
}
function button(label,fn){const b=el('button',label);b.onclick=fn;return b;}
function inspector(){
 const panel=$('inspect'),p=doc.parts[selected];panel.replaceChildren();
 function field(label,n){const l=el('label',label);l.htmlFor=n.id='prop-'+panel.children.length;panel.append(l,n);}
 field('Название детали',input('text',p.name,v=>change(()=>p.name=v)));
 const mat=el('select');for(const [k,[n]] of Object.entries(finishes))mat.add(option(n,k));mat.value=p.material;
 mat.onchange=()=>change(()=>{p.material=mat.value;delete p.color;delete p.roughness;delete p.texture;});field('Материал',mat);
 field('Краска',input('color',p.color||finishes[p.material][1],v=>change(()=>p.color=v)));
 field('Шероховатость · 0–1',input('number',p.roughness??finishes[p.material][3],v=>change(()=>p.roughness=v)));
 panel.append(button('Своя текстура…',()=>$('texture').click()));
 if(p.texture)panel.append(button('Вернуть штатную текстуру',()=>change(()=>delete p.texture)));
 for(const [key,label] of [['at','Положение, м'],['rotation','Поворот, °'],['size',p.kind==='loft'?'Масштаб профиля':'Размеры, м']]){
   const box=el('fieldset'),row=el('div');row.className='vector';box.append(el('legend',label),row);
   axes.forEach((a,i)=>{const l=el('label',a);l.append(input('number',p[key][i],v=>change(()=>p[key][i]=v)));row.append(l);});panel.append(box);
 }
 if(p.kind!=='loft')return;
 const box=el('fieldset');box.append(el('legend','Поперечные сечения, м'));panel.append(box);
 p.sections.forEach((s,i)=>{
   const row=el('div');row.className='sectionRow';
   ['X','Y','½ шир.','½ выс.'].forEach((label,k)=>{const l=el('label',label);l.append(input('number',s[k],v=>change(()=>s[k]=v)));row.append(l);});
   const del=button('×',()=>change(()=>p.sections.splice(i,1)));del.title='Удалить сечение';del.disabled=p.sections.length<=2;row.append(del);box.append(row);
 });
 box.append(button('＋ Сечение',()=>change(()=>{
   let widest=1;for(let i=2;i<p.sections.length;i++)if(p.sections[i][0]-p.sections[i-1][0]>p.sections[widest][0]-p.sections[widest-1][0])widest=i;
   const mid=p.sections[widest].map((n,j)=>(n+p.sections[widest-1][j])/2);p.sections.splice(widest,0,mid);
 })));
 field('Граней по окружности',input('number',p.sides,v=>change(()=>p.sides=v)));
}
$('apply').onclick=()=>{change(()=>{doc={version:1,...copy(presets[$('template').value])};selected=0;});frame('iso');};
$('add').onclick=()=>change(()=>{doc.parts.push(newPart($('kind').value));selected=doc.parts.length-1;});
$('copy').onclick=()=>change(()=>{const p=copy(doc.parts[selected]);p.name=p.name.slice(0,69)+' · копия';p.at[2]+=1;doc.parts.push(p);selected=doc.parts.length-1;});
$('remove').onclick=()=>change(()=>{doc.parts.splice(selected,1);selected=Math.min(selected,doc.parts.length-1);});
$('title').onchange=e=>change(()=>doc.name=e.target.value);
for(const mode of ['iso','side','top'])$(mode).onclick=()=>frame(mode);
$('wire').onclick=()=>{wire=!wire;for(const m of materials.values())m.wireframe=wire;$('wire').setAttribute('aria-pressed',String(wire));};
function restore(from,to){if(!from.length)return;to.push(history());const h=from.pop();doc=h.doc;selected=h.selected;refresh();frame('iso');}
$('undo').onclick=()=>restore(undo,redo);$('redo').onclick=()=>restore(redo,undo);
scene.onPointerObservable.add(info=>{
 if(info.type===B.PointerEventTypes.POINTERTAP && info.pickInfo?.pickedMesh?.metadata?.workshopPart!==undefined)select(info.pickInfo.pickedMesh.metadata.workshopPart);
});
function download(blob,name){const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
const filename=()=>doc.name.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,80);
$('save').onclick=()=>{download(new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}),filename()+'.nomad.json');status('Проект сохранён');};
$('open').onclick=()=>$('file').click();
$('file').onchange=async e=>{
 const f=e.target.files[0];e.target.value='';if(!f)return;
 try{if(f.size>16*1024*1024)throw Error('Предел проекта — 16 МБ.');const next=JSON.parse(await f.text());validate(next);remember();doc=next;selected=0;refresh();frame('iso');status('Проект открыт');}catch(err){status(err.message);}
};
$('texture').onchange=async e=>{
 const f=e.target.files[0],target=doc.parts[selected];e.target.value='';if(!f)return;
 try{if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>4*1024*1024)throw Error('Выберите PNG, JPEG или WebP до 4 МБ.');
 const bitmap=await createImageBitmap(f);const longest=Math.max(bitmap.width,bitmap.height);bitmap.close();if(longest>4096)throw Error('Максимальная сторона текстуры — 4096 пикселей.');
 const data=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f);});
 if(doc.parts.includes(target))change(()=>target.texture=data);
 }catch(err){status(err.message);}
};
$('export').onclick=async()=>{
 const btn=$('export');btn.disabled=true;status('Собираем GLB…');
 try{await scene.whenReadyAsync();const model=await B.GLTF2Export.GLBAsync(scene,'asset',{shouldExportNode:n=>editable.includes(n)});
 download(model.glTFFiles['asset.glb'],filename()+'.glb');status('Модель GLB со встроенными материалами готова');}catch(err){status('Ошибка экспорта · '+err.message);}finally{btn.disabled=false;}
};
refresh();frame('iso');new ResizeObserver(()=>engine.resize()).observe(canvas);engine.runRenderLoop(()=>scene.render());
