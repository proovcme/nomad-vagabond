import initial from '../src/content/passage.js';
import {groups,check} from './productionSchema.js';
const $=id=>document.getElementById(id),el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
let doc=structuredClone(initial),section='story',index=0,edits=[],dirty=false,revision=null,ready=false,playhead=0;
const report=m=>$('status').textContent=m;
const guides={story:'Главы, поворотные события и их последствия для команды. Главы служат планом кампании.',route:'Ориентиры первой миссии в метрах от крейсера. У последней точки поиск сменяется визуальным заходом на корабль.',shots:'У самолёта камера задаётся как «сзади, справа, сверху», точка взгляда — «вперёд, вправо, вверх». У эсминца используются оси мира XYZ. WebM — видеопревиз без звука и титров интерфейса.',characters:'Позывные используются в субтитрах игры. В окне показана доступная игровая модель пилота; у радиста и противника пока только голосовые роли.',radio:'Если текст изменился, старая озвучка замолчит. Для новой записи положите MP3 в assets/audio/fog-passage и укажите имя без расширения и записанный текст.',effects:'Предпросмотр использует игровой пул частиц. Масштаб попадания и дульной вспышки попадёт в сцену боя после записи проекта.'};
const current=()=>doc[section][index],total=()=>doc.shots.reduce((a,s)=>a+s.seconds,0),send=d=>{if(ready)$('screen').contentWindow.postMessage(d,location.origin);};
function saveBefore(){edits.push(structuredClone(doc));if(edits.length>35)edits.shift();dirty=true;}
function uiButton(label,fn){const b=el('button',label);b.type='button';b.onclick=fn;return b;}
function syncPreview(play=false){if(section==='shots')send({type:'timeline',shots:doc.shots,time:playhead,play});}
function selectRecord(i){index=i;if(section==='shots')playhead=doc.shots.slice(0,i).reduce((n,s)=>n+s.seconds,0);render();syncPreview();}
function setSection(k){section=k;index=0;playhead=0;ready=false;
 const preview=['shots','effects','characters'].includes(k);document.querySelector('.preview').hidden=!preview;
 $('screen').src=preview?'screen.html?mode='+k:'about:blank';render();}
function transport(){const t=$('transport');t.replaceChildren();
 if(section==='effects')t.append(uiButton('▶ Показать эффект',()=>send({type:'effect',scale:current().scale})));
 if(section==='characters'){const s=el('select');s.id='animation';s.setAttribute('aria-label','Анимация пилота');for(const name of animationNames)s.add(new Option(name,name));s.onchange=()=>send({type:'animate',name:s.value});t.append(s,uiButton('▶ Анимация',()=>send({type:'animate',name:s.value})));}
 if(section==='shots'){
  const r=el('input');r.type='range';r.id='time';r.min=0;r.max=total();r.step=.05;r.value=playhead;r.ariaLabel='Время кадра';r.oninput=()=>{playhead=Number(r.value);syncPreview();};
  t.append(uiButton('▶ С начала',()=>{playhead=0;syncPreview(true);}),uiButton('Пауза',()=>syncPreview()),r,uiButton('Записать WebM',()=>{syncPreview();send({type:'record'});}));
 }}
let animationNames=[];
window.addEventListener('message',e=>{if(e.source!==$('screen').contentWindow||e.origin!==location.origin)return;
 const d=e.data;if(d.type==='ready'){ready=true;syncPreview();}if(d.type==='time'){playhead=d.time;if($('time'))$('time').value=d.time;}
 if(d.type==='animations'){animationNames=d.names;transport();}if(d.type==='error')report(d.message);if(d.type==='recorded')report('Превиз сохранён');});
function render(){
 $('category').textContent=groups[section][0];$('guide').textContent=guides[section];$('tabs').replaceChildren();
 for(const [k,[title]] of Object.entries(groups)){const b=uiButton(title,()=>setSection(k));b.setAttribute('aria-pressed',k===section);$('tabs').append(b);}
 $('entries').replaceChildren();const list=doc[section],record=current();for(const [i,r] of list.entries()){
 const b=uiButton(r[groups[section][1]],()=>selectRecord(i));b.setAttribute('aria-pressed',index===i);$('entries').append(b);}
 $('up').disabled=index===0;$('down').disabled=index===list.length-1;$('delete').disabled=list.length<2;
 const f=$('fields');f.replaceChildren(el('h1',record[groups[section][1]]));
 for(const [key,title] of Object.entries({id:'Код записи',...groups[section][2]})){
   const label=el('label',title);f.append(label);const val=record[key];
   function update(v){saveBefore();record[key]=v;render();syncPreview();report('Есть изменения');}
   if(Array.isArray(val)){const row=el('div');row.className='vector';label.append(row);val.forEach((n,i)=>{const input=el('input');input.type='number';input.step='any';input.value=n;input.ariaLabel=title+' '+['X','Y','Z'][i];input.onchange=()=>{const v=val.slice();v[i]=input.valueAsNumber;update(v);};row.append(input);});continue;}
   let inp,options;if(key==='target')options=['plane','escort'];if(key==='speaker')options=doc.characters.map(x=>x.id);if(key==='cue')options=['',...doc.radio.map(x=>x.id)];
   if(options){inp=el('select');options.forEach(o=>inp.add(new Option(o||'Тишина',o)));}else if(['subtitle','text','goal','outcome','voice','recordedText','hint'].includes(key))inp=el('textarea');else{inp=el('input');inp.type=typeof val==='number'?'number':'text';inp.step='any';}
   inp.value=val;inp.onchange=()=>update(typeof val==='number'?Number(inp.value):inp.value);label.append(inp);
 }
 if(section==='radio'&&record.clip&&/^[-a-z0-9_]+$/.test(record.clip)){const audio=el('audio');audio.controls=true;audio.preload='none';audio.src='../assets/audio/fog-passage/'+record.clip+'.mp3';f.append(audio);if(record.text!==record.recordedText)f.append(el('small','Текст изменён. В игре прозвучит новая запись после замены файла и обновления текста записи.'));}
 transport();$('revert').disabled=!edits.length;
}
$('new').onclick=()=>{saveBefore();const next=structuredClone(current());let i=1;while(doc[section].some(r=>r.id===section+'_'+i))i++;next.id=section+'_'+i;if(groups[section][1]!=='id')next[groups[section][1]]+=' · вариант';doc[section].push(next);selectRecord(doc[section].length-1);};
$('delete').onclick=()=>{saveBefore();doc[section].splice(index,1);selectRecord(Math.max(0,index-1));};
for(const [btn,delta] of [['up',-1],['down',1]])$(btn).onclick=()=>{saveBefore();const arr=doc[section],p=index+delta;[arr[p],arr[index]]=[arr[index],arr[p]];selectRecord(p);};
$('revert').onclick=()=>{if(edits.length){doc=edits.pop();index=Math.min(index,doc[section].length-1);render();syncPreview();}};
$('load').onclick=()=>$('file').click();$('file').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{const v=check(JSON.parse(await f.text()));saveBefore();doc=v;setSection('story');}catch(err){report(err.message);}};
$('download').onclick=()=>{const a=el('a');const url=URL.createObjectURL(new Blob([JSON.stringify(doc,null,2)],{type:'application/json'}));a.href=url;a.download='brodyaga-production.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);};
$('commit').onclick=async()=>{try{check(doc);if(!revision)throw Error('Для записи в папку проекта откройте мастерскую через npm run workshop.');const r=await fetch('/_workshop/production',{method:'PUT',headers:{'Content-Type':'application/json','If-Match':revision},body:JSON.stringify(doc)});if(!r.ok)throw Error(await r.text());revision=(await r.json()).revision;dirty=false;report('Записано в проект. Следующий запуск игры прочитает изменения.');}catch(err){report(err.message);}};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
setSection('story');
fetch('/_workshop/production',{cache:'no-store'}).then(async r=>{if(r.ok){const v=await r.json();if(!dirty){doc=check(v.doc);revision=v.revision;render();}}}).catch(()=>{});
