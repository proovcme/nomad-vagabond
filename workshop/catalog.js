export const finishes={
  hull:['Корабельная сталь','#8396a3',.48,.63,'weathered-iron-v2.jpg'],
  iron:['Воронёная сталь','#485158',.62,.55,null],
  enamel:['Киноварь','#af5140',.28,.62,null],
  ivory:['Слоновая кость','#ded6b7',.12,.66,null],
  brass:['Латунь','#c19650',.7,.37,null],
  canvas:['Парусина','#d6b577',.01,.92,'ochre-aircraft-canvas.png'],
  rock:['Охристая порода','#bc8761',0,.99,'painted-rust-cliff-v3.jpg'],
  moss:['Осенняя трава','#b9bc71',0,.98,'painted-meadow-v3.jpg'],
};
export function part(name,kind,material,size,at=[0,0,0],extra={}){
  return {name,kind,material,size,at,rotation:[0,0,0],...extra};
}
// Sections are [longitudinal position, centre height, half breadth, half height] in metres.
const hull=part('Наборный корпус','loft','hull',[1,1,1],[0,0,0],{sides:16,sections:[[-8,.65,.08,.55],[-6,.12,1.1,1],[-3,0,1.75,1.12],[2,0,1.8,1.05],[5.8,.1,1.38,.86],[7,.17,.88,.7]]});
export const presets={
  cutter:{name:'Рейдовый катер',parts:[hull,part('Броневая рубка','cylinder','hull',[4.8,1.65,2.6],[-1,1.57,0]),part('Лента остекления','cylinder','iron',[4.38,.54,2.4],[-1,2.58,0]),part('Козырёк мостика','cylinder','ivory',[4.8,.18,2.72],[-1,2.93,0]),part('Дымовая труба','cylinder','iron',[.9,2.2,.8],[2.3,2.02,0],{rotation:[0,0,-9]}),part('Марка флотилии','cylinder','enamel',[.94,.46,.84],[2.4,2.77,0],{rotation:[0,0,-9]}),part('Фок-мачта','cylinder','brass',[.14,4.35,.14],[-.2,4.15,0]),part('Рея','box','iron',[.13,.13,2.55],[-.2,5.63,0])]},
  aircraft:{name:'Почтовый моноплан',parts:[part('Фюзеляж','loft','enamel',[1,1,1],[0,0,0],{sides:16,sections:[[-4.9,.1,.36,.45],[-4,.1,.82,.84],[-2,.04,.94,.93],[.2,0,.77,.85],[2.9,.15,.37,.45],[5,.29,.13,.21]]}),...[-1,1].map(s=>part(s<0?'Левая консоль':'Правая консоль','loft','canvas',[1,1,1],[-.8,-.23,0],{rotation:[0,s*90,0],sides:12,sections:[[0,0,1.6,.22],[2,.08,1.45,.18],[5,.23,.96,.12],[6.4,.36,.38,.06]]})),part('Фонарь','sphere','iron',[2.1,.96,1.24],[-.1,.65,0]),part('Оперение','sphere','canvas',[1.7,.17,4],[3.95,.32,0]),part('Киль','sphere','enamel',[1.55,1.8,.16],[4.15,.89,0])]},
  island:{name:'Дозорный остров',parts:[part('Скальный уступ','loft','rock',[1,1,1],[0,0,0],{sides:9,sections:[[-8,0,.45,.7],[-6,-.7,3.2,2.4],[-2,-1.2,4.5,3.6],[2,-.85,4.8,2.9],[5,-.1,3.8,2.1],[7,.3,.8,.9]]}),part('Травяная вершина','sphere','moss',[13.6,1.6,8.2],[0,1.35,0]),part('Маяк','cylinder','ivory',[1.45,4.5,1.45],[-1.6,4,0]),part('Сигнальная полоса','cylinder','enamel',[1.47,.62,1.47],[-1.6,4.8,0]),part('Фонарь','cylinder','brass',[1.85,1.24,1.85],[-1.6,6.79,0]),part('Колпак','cone','iron',[2.18,.94,2.18],[-1.6,7.88,0])]},
};
export const kinds={loft:'Корпус по сечениям',box:'Плита',cylinder:'Цилиндр',cone:'Конус',sphere:'Эллипсоид'};
export function newPart(kind){return kind==='loft'?structuredClone(hull):part(kinds[kind],kind,'hull',[2,1,2]);}
