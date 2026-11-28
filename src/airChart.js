// Printed route chart: north follows the compass (+Z), east is +X.
export function drawAirChart(canvas,world,ship,base){
  const w=window.innerWidth<620?440:680,h=430,ink='#233f47',red='#a23c27';
  canvas.width=w*2;canvas.height=h*2;
  const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);
  const bounds=[...world.islands.map(i=>i.group.position),ship.group.position];
  if(world.missionTarget)bounds.push(world.missionTarget.position);
  const xs=bounds.map(p=>p.x),zs=bounds.map(p=>p.z);
  const left=Math.min(...xs)-95,right=Math.max(...xs)+95,top=Math.max(...zs)+85,bottom=Math.min(...zs)-85;
  const scale=Math.min((w-110)/(right-left),(h-105)/(top-bottom));
  const px=x=>w*.5+(x-(left+right)*.5)*scale,py=z=>h*.49-(z-(top+bottom)*.5)*scale;
  const stroke=(points,color,width=1,close=false)=>{
    c.beginPath();points.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](x,y));
    if(close)c.closePath();c.strokeStyle=color;c.lineWidth=width;c.stroke();
  };
  const paper=c.createLinearGradient(0,0,w,h);
  paper.addColorStop(0,'#e7dfbd');paper.addColorStop(.42,'#faf1d6');paper.addColorStop(1,'#e6d3a9');
  c.fillStyle=paper;c.fillRect(0,0,w,h);
  const grid=scale<.13?500:200;
  for(let x=Math.floor(left/grid)*grid;px(x)<w-12;x+=grid)if(px(x)>12)stroke([[px(x),11],[px(x),h-12]],'#9aafa064',.7);
  for(let z=Math.floor(bottom/grid)*grid;py(z)>12;z+=grid)if(py(z)<h-12)stroke([[12,py(z)],[w-12,py(z)]],'#9aafa064',.7);
  c.strokeStyle=ink;c.lineWidth=1.4;c.strokeRect(6,6,w-12,h-12);c.lineWidth=.6;c.strokeRect(10,10,w-20,h-20);
  // An engraved title block and sheet divisions frame the navigation area.
  c.fillStyle='#f4e8cb';c.fillRect(14,14,146,42);
  c.font='bold 15px Georgia';c.fillStyle=ink;c.fillText('АРХИПЕЛАГ',21,33);
  c.font='10px monospace';c.fillStyle='#685c47';c.fillText('СЕКТОР '+world.seedStr,21,47);
  stroke([[19,53],[144,53]],'#977b50',.8);
  for(let j=1;j<8;j++){const xx=10+j*(w-20)/8;stroke([[xx,6],[xx,11]],ink,1);}
  for(let j=1;j<6;j++){const yy=10+j*(h-20)/6;stroke([[6,yy],[11,yy]],ink,1);}
  const labels=[{l:14,r:162,t:14,b:56},{l:w-48,r:w-12,t:14,b:62}];
  const label=(x,y,text,color,italic=false)=>{
    c.font=(italic?'italic ':'')+'bold 13px Georgia';const width=c.measureText(text).width;
    let best;
    for(const [dx,dy] of [[9,-9],[9,18],[-width-9,-9],[-width-9,18],[8,-27],[8,36],[8,-42]]){
      const xx=Math.max(16,Math.min(w-width-16,x+dx)),yy=Math.max(26,Math.min(h-43,y+dy));
      const rect={l:xx-2,r:xx+width+2,t:yy-13,b:yy+2};
      if(!best)best=[xx,yy,rect];
      if(!labels.some(r=>r.l<rect.r && r.r>rect.l && r.t<rect.b && r.b>rect.t)){best=[xx,yy,rect];break;}
    }
    labels.push(best[2]);c.lineWidth=3;c.strokeStyle='#f4e9cd';c.strokeText(text,best[0],best[1]);
    c.fillStyle=color;c.fillText(text,best[0],best[1]);
  };
  for(const island of world.islands){
    const center=island.group.position,x=px(center.x),y=py(center.z),g=island.generated?.geometry;
    if(island===base){
      c.save();c.translate(x,y);c.rotate(island.group.rotation.y);
      c.beginPath();c.moveTo(-17,0);c.lineTo(-8,-4);c.lineTo(14,-3);c.lineTo(16,2);c.lineTo(-8,4);c.closePath();c.fillStyle=ink;c.fill();c.restore();
    }else if(g){
      const rim=[],start=1+(g.rings-1)*g.segments;
      for(let j=0;j<g.segments;j+=2){const k=(start+j)*3;rim.push([g.top.positions[k]*scale,-g.top.positions[k+2]*scale]);}
      c.save();c.translate(x,y);
      for(const [size,fill,edge] of [[1.12,'#c2c9ac','#89998b'],[1,'#aeb48a','#526f65'],[.76,'#d2ca9d','#a3a37b'],[.44,'#e6d5a8','#b7ac85']]){
        stroke(rim.map(([a,b])=>[a*size,b*size]),edge,.85,true);c.fillStyle=fill;c.fill();c.stroke();
      }
      for(let j=2;j<rim.length;j+=3){
        const [rx,ry]=rim[j];
        if(ry<0 || rx< -5)continue;
        stroke([[rx*.93,ry*.93],[rx*1.13+1.4,ry*1.13+2.1]],'#797952',.56);
      }
      c.restore();
    }
    label(x,y,island.name,ink);
  }
  if(world.airLine){
    const ports=world.airLine.fields.ports.map(p=>[px(p.x),py(p.z)]);
    c.setLineDash([7,4]);stroke(ports,red,1.7);c.setLineDash([]);
    for(const [x,y] of ports){c.fillStyle='#f3e8c9';c.fillRect(x-3.3,y-3.3,6.6,6.6);c.strokeStyle=red;c.strokeRect(x-3.3,y-3.3,6.6,6.6);}
    const [a,b]=ports, dx=b[0]-a[0],dy=b[1]-a[1];
    const distance=Math.round(Math.hypot(dx,dy)/scale/10)*10;
    if(Math.hypot(dx,dy)>110){
      c.save();c.translate((a[0]+b[0])/2,(a[1]+b[1])/2);c.rotate(Math.atan2(dy,dx)+(dx<0?Math.PI:0));
      c.fillStyle=red;c.font='italic 11px Georgia';c.textAlign='center';c.fillText('«Ласточка» · '+distance+' м',0,-7);c.restore();
    }
    const flight=world.airLine.planes[1].root.position;
    c.beginPath();c.arc(px(flight.x),py(flight.z),3.2,0,2*Math.PI);c.fillStyle=red;c.fill();
  }
  const p=ship.group.position,x=px(p.x),y=py(p.z);
  c.save();c.translate(x,y);
  const f=ship.group.getDirection(new BABYLON.Vector3(0,0,-1));c.rotate(Math.atan2(f.x,f.z));
  c.beginPath();for(const [i,[xx,yy]] of [[0,-8],[2,-2],[8,2],[8,4],[2,3],[1,7],[-1,7],[-2,3],[-8,4],[-8,2],[-2,-2]].entries())c[i?'lineTo':'moveTo'](xx,yy);
  c.closePath();c.strokeStyle='#fbf0d3';c.lineWidth=2.2;c.stroke();c.fillStyle=red;c.fill();c.restore();label(x,y,'Ваш борт',red,true);
  if(world.missionTarget){const t=world.missionTarget.position,tx=px(t.x),ty=py(t.z);
    stroke([[tx,ty-5],[tx+5,ty],[tx,ty+5],[tx-5,ty]],red,1.4,true);label(tx,ty,world.missionTarget.name,red,true);}
  c.save();c.translate(w-35,48);stroke([[0,-16],[-6,9],[0,4],[6,9],[0,-16]],ink,1.1);
  c.fillStyle=ink;c.beginPath();c.moveTo(0,-16);c.lineTo(-6,9);c.lineTo(0,4);c.fill();
  c.font='bold 11px Georgia';c.fillText('С',-4,-20);c.restore();
  c.font='12px Georgia';c.fillStyle=ink;
  const m=grid/2,bar=m*scale;
  stroke([[22,h-31],[22,h-27],[22+bar,h-27],[22+bar,h-31]],ink,1.5);c.fillText(m+' м',22,h-12);
  if(world.airLine){c.setLineDash([6,3]);stroke([[w-169,h-24],[w-142,h-24]],red,1.6);c.setLineDash([]);c.fillStyle=ink;c.fillText('Пассажирская линия',w-136,h-20);}
  c.setTransform(1,0,0,1,0,0);
}
