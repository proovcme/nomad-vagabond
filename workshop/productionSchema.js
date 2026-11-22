export const groups={
 story:['Сюжет','title',{title:'Заголовок',text:'События главы',outcome:'Итог'}],
 route:['Сценарий','name',{name:'Ориентир',position:'Координаты XYZ, м',hint:'Задача игрока',cue:'Реплика после пролёта'}],
 shots:['Ролики','title',{title:'Титр',subtitle:'Субтитр',target:'Камера относительно',seconds:'Длительность, с',fromPos:'Камера в начале',toPos:'Камера в конце',look:'Точка взгляда',fov:'Начальный угол, рад',endFov:'Конечный угол, рад'}],
 characters:['Персонажи','name',{name:'Позывной',voice:'Манера речи',goal:'Чего добивается'}],
 radio:['Радио','id',{speaker:'Говорящий',text:'Реплика',clip:'Запись',recordedText:'Текст имеющейся записи'}],
 effects:['Эффекты','name',{name:'Эффект',scale:'Масштаб взрыва'}],
};
const required={radio:['chase','escape','found','landed','power','ignite','battery','clear'],effects:['airburst','muzzle','impact']};
export function check(d){
 const fail=m=>{throw Error(m);};
 if(d?.version!==1)fail('Неподдерживаемая версия проекта');
 for(const [key,[label,,fields]] of Object.entries(groups)){
   const list=d[key];if(!Array.isArray(list)||!list.length||list.length>300)fail(label+' · нужно от 1 до 300 записей');
   const ids=new Set();
   for(const r of list){
     if(!r||typeof r.id!=='string'||!/^[-a-z0-9_]{1,48}$/.test(r.id)||ids.has(r.id))fail(label+' · идентификаторы должны быть уникальными');
     ids.add(r.id);
     for(const field of Object.keys(fields)){
       const v=r[field];if(['position','fromPos','toPos','look'].includes(field)){
         if(!Array.isArray(v)||v.length!==3||!v.every(n=>Number.isFinite(n)&&Math.abs(n)<=10000))fail(r.id+' · вектор из трёх чисел');
       }else if(['seconds','fov','endFov','scale'].includes(field)){
         const bounds=field==='seconds'?[.1,120]:field==='scale'?[.25,4]:[.15,2.5];
         if(!Number.isFinite(v)||v<bounds[0]||v>bounds[1])fail(r.id+' · '+fields[field]+' от '+bounds[0]+' до '+bounds[1]);
       }else if(typeof v!=='string'||v.length>4000||(!['cue','clip','recordedText','subtitle'].includes(field)&&!v.trim()))fail(r.id+' · заполните '+fields[field]);
     }
   }
   for(const id of required[key]||[])if(!ids.has(id))fail('Игра ожидает событие '+id);
 }
 if(d.shots.some(s=>!['plane','escort'].includes(s.target)))fail('Выберите камеру самолёта или эсминца');
 for(const c of d.radio){if(!d.characters.some(a=>a.id===c.speaker))fail(c.id+' · неизвестный персонаж');if(c.clip&&!/^[-a-z0-9_]+$/.test(c.clip))fail('Некорректное имя записи');}
 for(const r of d.route)if(r.cue&&!d.radio.some(c=>c.id===r.cue))fail(r.id+' · неизвестная реплика');
 return d;
}
