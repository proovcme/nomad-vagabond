// Coordinates are local to Emerald Cliff. The same strips define the terrain paint and planting exclusions.
const plots=[
  {kind:'rye', x:34.5,z:-23,w:15,d:14,tilt:.18},
  {kind:'stubble',x:39,z:-6,w:17,d:13,tilt:.16},
  {kind:'earth',x:18,z:-34,w:18,d:10,tilt:-.14},
];
const lane=[[23,-14],[27,-13],[30,-15],[41,-14],[48,-12]];
export function millCultivated(x,z){
  return plots.some(p=>Math.abs(z-p.z)<p.d*.5+1.5 && Math.abs(x-p.x-p.tilt*(z-p.z))<p.w*.5+1.5) ||
    (x>22 && x<49 && z>-16.6 && z<-11);
}
export function paintMillFields(ctx,size,geometry){
  ctx.save();
  ctx.setTransform(size/(geometry.radiusX*2.4),0,0,size/(geometry.radiusZ*2.4),size/2,size/2);
  for(const p of plots){
    ctx.save();ctx.translate(p.x,p.z);ctx.transform(1,0,p.tilt,1,0,0);
    const w=p.w/2,d=p.d/2;
    ctx.beginPath();ctx.moveTo(-w+1,-d);ctx.lineTo(w,-d+.65);ctx.lineTo(w-.7,d);ctx.lineTo(-w,d-.35);ctx.closePath();ctx.clip();
    ctx.fillStyle={rye:'#cfa44f',stubble:'#b49459',earth:'#835e48'}[p.kind];ctx.fillRect(-w,-d,p.w,p.d);
    for(let j=0;j<p.w*2;j++){
      const x=-w+j*.54;
      ctx.strokeStyle=p.kind==='earth'?'#584838':p.kind==='rye'?'#f6cf78':'#dfbb73';
      ctx.lineWidth=p.kind==='earth'?.19:.15;ctx.beginPath();ctx.moveTo(x,-d);
      ctx.bezierCurveTo(x+.8,-d*.4,x-.35,d*.6,x+.36,d);ctx.stroke();
    }
    let seed=29;
    const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
    for(let n=0;n<900;n++){
      const light=rand()>.43;
      ctx.fillStyle=light?'rgba(254,218,150,.27)':'rgba(73,55,35,.26)';
      ctx.fillRect((rand()-.5)*p.w,(rand()-.5)*p.d,.1+rand()*.24,.15+rand()*.64);
    }
    ctx.restore();
  }
  for(const offset of [-.52,.52]){
    ctx.strokeStyle='#b89a74';ctx.lineWidth=.47;ctx.lineJoin='round';
    ctx.beginPath();lane.forEach(([x,z],i)=>ctx[i?'lineTo':'moveTo'](x,z+offset));ctx.stroke();
  }
  ctx.restore();
}
export function dressMillFields(scene,island){
  const B=BABYLON, vertices=[],colors=[],indices=[];
  let seed=1936;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
  const p=plots[0];
  for(let row=0;row<24;row++)for(let n=0;n<34;n++){
    const dz=-p.d/2+.5+n*.38+rand()*.16;
    const x=p.x-p.w/2+1+row*.54+dz*p.tilt+rand()*.18,z=p.z+dz;
    if(!island.generated.contains(x,z,.06))continue;
    const y=island.getTopHeightLocal(x,z),h=.52+rand()*.38;
    const i=vertices.length/3;
    vertices.push(x-.05,y,z,x+.06,y,z,x+.16,y+h,z+.06,x+.09,y+h+.21,z+.08);
    indices.push(i,i+1,i+2,i,i+2,i+3);
    colors.push(.45,.34,.09,1,.54,.43,.13,1,.96,.73,.26,1,1,.85,.44,1);
  }
  const crop=new B.Mesh('millRyeHeads',scene),data=new B.VertexData(),normals=[];
  B.VertexData.ComputeNormals(vertices,indices,normals);Object.assign(data,{positions:vertices,indices,colors,normals});data.applyToMesh(crop);
  crop.parent=island.group;crop.isPickable=false;
  const straw=new B.StandardMaterial('millHarvestStraw',scene);straw.diffuseColor=B.Color3.FromHexString('#e5bd70');straw.emissiveColor=B.Color3.FromHexString('#745422');straw.specularColor=B.Color3.Black();straw.backFaceCulling=false;
  crop.material=straw;
  const shocks=[];
  for(const [x,z] of [[35,-7],[38,-5],[43,-6],[41,-2]]){
    if(!island.generated.contains(x,z,.05))continue;
    const mesh=B.MeshBuilder.CreateLathe('boundSheaf',{shape:[[0,0],[.81,.10],[.52,.85],[.27,1.12],[.50,1.56],[.06,1.90]].map(([r,y])=>new B.Vector3(r,y,0)),tessellation:9},scene);
    mesh.position.set(x,island.getTopHeightLocal(x,z),z);shocks.push(mesh);
  }
  if(shocks.length){const stacks=B.Mesh.MergeMeshes(shocks,true,true);stacks.name='millBoundSheaves';stacks.parent=island.group;stacks.material=straw;}
}
