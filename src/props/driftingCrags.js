import { cliffMaterial } from './railViaduct.js';
import { makeSolid } from '../collisions.js';

// A coarse fracture outline gives each fragment planar faces and an offset keel.
function buildCrag(scene,seed){
  const B=BABYLON,n=9,vertices=[],indices=[],normals=[],uvs=[],colors=[];
  const strata=['#c7bf9b','#edba78','#ad7961','#7e7981','#936954'].map(hex=>B.Color3.FromHexString(hex).toLinearSpace());
  const profile=[[.54,.58],[1,.31],[.97,-.08],[.81,-.46],[.30,-.77]];
  for(const [level,[reach,height]] of profile.entries()){
    for(let j=0;j<=n;j++){
      const a=2*Math.PI*(j%n)/n,ledge=.90+.17*Math.sin(3*a+seed);
      const split=Math.max(0,Math.cos(a-seed))*.36;
      const x=Math.cos(a)*ledge*reach+height*.34;
      const z=Math.sin(a)*reach*(.69+.13*Math.sin(5*a+seed));
      const y=height+x*.22+z*.12-.11*Math.sin(a*3+seed)-split*Math.abs(height);
      vertices.push(x,y,z);uvs.push(j/n*2,level*.35);
      const c=strata[level],v=.91+.09*Math.cos(a+seed);colors.push(c.r*v,c.g*v,c.b*v,1);
      if(level&&j){const k=vertices.length/3-1,b=k-n-1;indices.push(k,b-1,b,k,k-1,b-1);}
    }
  }
  for(const [end,y] of [[0,.66],[4,-.94]]){
    const mid=vertices.length/3;vertices.push(y*.32,y,-y*.11);uvs.push(.5,.5);
    const c=strata[end];colors.push(c.r,c.g,c.b,1);
    for(let j=0;j<n;j++){
      const a=end*(n+1)+j;
      if(end)indices.push(mid,a,a+1);else indices.push(mid,a+1,a);
    }
  }
  B.VertexData.ComputeNormals(vertices,indices,normals);
  // Side winding also fixes both caps as they share the same oriented boundaries.
  if(normals[0]<0){indices.reverse();B.VertexData.ComputeNormals(vertices,indices,normals);}
  const mesh=new B.Mesh('driftingCrag_'+seed,scene),data=new B.VertexData();
  Object.assign(data,{positions:vertices,indices,normals,colors,uvs});data.applyToMesh(mesh);
  mesh.convertToFlatShadedMesh();
  const faces=mesh.getVerticesData('normal'),points=mesh.getVerticesData('position'),projected=[];
  for(let i=0;i<points.length;i+=3){
    const [x,y,z]=[points[i],points[i+1],points[i+2]];
    const nx=Math.abs(faces[i]),ny=Math.abs(faces[i+1]),nz=Math.abs(faces[i+2]);
    projected.push((nx>nz?z:x)*.58,(ny>Math.max(nx,nz)?z:y)*.63);
  }
  mesh.setVerticesData('uv',projected);mesh.material=cliffMaterial(scene);mesh.receiveShadows=true;
  return mesh;
}

export function addDriftingCrags(scene,parent,orbiters){
  // Small companions and solitary slabs, clear of runway approaches and mission fixes.
  const groups=[
    [[-130,56,68,14],[-108,64,81,4],[-151,47,75,6]],
    [[88,70,136,11],[112,65,126,5],[407,87,-111,15]],
    [[675,74,-80,18],[1010,148,-468,8],[1420,92,-515,15]],
    [[2004,125,-430,17],[2440,160,-679,9],[2970,90,-115,20],[3420,105,-300,10]],
  ];
  const models=[];
  groups.flat().forEach(([x,y,z,size],i)=>{
    const form=i%3;
    const mesh=models[form]?.createInstance('driftingCragPiece_'+i)||buildCrag(scene,form+71);
    if(!models[form])models[form]=mesh;
    mesh.parent=parent;mesh.position.set(x,y,z);mesh.rotation.set(.12*Math.cos(i),i*1.71,.25*Math.sin(i));
    mesh.scaling.set(size*[1.5,.85,1.17][form],size*[.65,1.24,.93][form],size);
    makeSolid(mesh);
    orbiters.push({node:mesh,basePos:mesh.position.clone(),baseRot:mesh.rotation.asArray(),phase:i*.87,
      orbitRx:size*1.1,orbitRz:size*.7,orbitSpeed:.054+i%4*.009,bobAmp:size*.15,bobSpeed:.21,spinSpeed:.017*(i%2?1:-1)});
  });
}
