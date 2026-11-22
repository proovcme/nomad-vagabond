// Local bow faces -X. All fixed fittings are batched by finish on the moving ship.
import { createLoftedHull } from './flightDeckCruiser.js';

export function buildPursuitDestroyer(scene) {
  const B=BABYLON;
  const root=new B.TransformNode('fogDestroyer',scene);
  const mat=name=>scene.getMaterialByName('cfCruiser'+name+'Mat');
  const mats={hull:mat('Hull'),crimson:mat('Crimson'),white:mat('White'),deckSteel:mat('DeckSteel')};
  const stations=[
    [-62,.25,8,-1],[-57,2.6,7.4,-3.7],[-48,5,6.5,-5.1],[-36,6.8,6,-6.3],
    [-19,7.7,5.9,-6.7],[-15,7.8,4.1,-6.7],[12,7.6,3.9,-6.5],[34,6.6,4,-5.6],
    [46,5.2,4.2,-4],[54,3.1,4.5,-2],[56,1.8,4.6,-.6],
  ].map(([x,w,y,k])=>({x,halfBeamTop:w,halfBeamMid:w*.86,halfBeamKeel:w*.26,yTop:y,yMid:.25,yKeel:k}));
  createLoftedHull(scene,'fogDestroyerHull',stations,mats,root,null,{decorate:false});
  const groups=new Map();
  const add=(finish,mesh,x,y,z)=>{
    mesh.position.set(x,y,z);
    if(!groups.has(finish))groups.set(finish,[]);
    groups.get(finish).push(mesh);
    return mesh;
  };
  // Elliptical, battered deckhouses and overlapping eaves form the stepped bridge.
  function drum(finish,x,y,z,rx,rz,height,taper=1,sides=12,rake=0) {
    const mesh=B.MeshBuilder.CreateCylinder('fitting',{height,diameterBottom:2,diameterTop:2*taper,tessellation:sides},scene);
    mesh.scaling.set(rx,1,rz);mesh.rotation.z=rake;
    return add(finish,mesh,x,y,z);
  }
  function spar(finish,from,to,radius,endRadius=radius) {
    const a=B.Vector3.FromArray(from),b=B.Vector3.FromArray(to),axis=b.subtract(a);
    const m=B.MeshBuilder.CreateCylinder('spar',{height:axis.length(),diameterBottom:radius*2,diameterTop:endRadius*2,tessellation:6},scene);
    m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(B.Axis.Y,axis.normalize(),new B.Quaternion());
    const mid=a.add(b).scale(.5);return add(finish,m,mid.x,mid.y,mid.z);
  }
  drum('HullDark',-16,6.7,0,12,6.0,4.9,.89);
  drum('Hull',-19.5,10.5,0,7.9,5.3,4.1,.88);
  drum('DarkSteel',-20.1,13.1,0,6.7,4.8,1.35,.98);
  drum('White',-20.3,14.05,0,7,5.25,.52);
  for(const side of [-1,1]){
    for(const x of [-24,-22,-20,-18,-16])spar('Hull',[x,12.5,side*4.6],[x,13.8,side*4.6],.095);
    spar('DarkSteel',[-18,13,side*4.1],[-15,29,0],.34,.18);
    spar('DarkSteel',[-8,7,side*4.8],[-15,27,0],.29,.14);
    spar('DarkSteel',[-46,6.6,side*3.8],[-15,28,0],.075);
    spar('DarkSteel',[-15,28,0],[26,19.7,side*.4],.085);
    spar('DarkSteel',[26,19.7,0],[48,5.2,side*3.1],.065);
    // Overboard boats on davits with visible thwarts and a dark recessed well.
    drum('White',3,6.7,side*6.1,4.65,1.13,1.05,1.22);
    drum('DarkSteel',3,7.26,side*6.1,4.85,.91,.12);
    for(const x of [1,3,5])spar('Hull',[x,7.43,side*6.1-.80],[x,7.43,side*6.1+.80],.12);
    for(const x of [-1,7])spar('HullDark',[x,5,side*4.9],[x,8.7,side*6.45],.17);
    const rail=[[-51,6.96,4],[-37,6.23,6.15],[-20,6.2,7.2],[-15,4.55,7.3],[13,4.25,7.15],[34,4.36,6.1],[48,4.65,4.25]];
    for(let i=0;i<rail.length;i++){
      const [x,y,w]=rail[i];spar('DarkSteel',[x,y-.28,side*w],[x,y+.95,side*w],.095);
      if(i){const [px,py,pw]=rail[i-1];spar('DarkSteel',[px,py+.92,side*pw],[x,y+.92,side*w],.08);}
    }
    for(const [x,w] of [[-41,5.7],[-34,6.48],[-28,6.86],[-22,7.23],[8,7.25],[17,7.05],[29,6.47]]){
      spar('DarkSteel',[x,3.0,side*(w-.55)],[x,3.0,side*(w+.21)],.46);
    }
  }
  spar('DarkSteel',[-15,22,0],[-15,31,0],.28,.09);
  spar('Hull',[-15,26,-6.1],[-15,26,6.1],.16);
  spar('DarkSteel',[26,5,0],[26,20.6,0],.30,.12);
  spar('Hull',[26,17,-3.7],[26,17,3.7],.13);
  for(const [x,h] of [[-5,16],[11,14.8]]){
    drum('HullDark',x,6.05,0,4.6,3.8,4.2,.83);
    const stack=(finish,y,rx,rz,height)=>drum(finish,x+(y-7)*.16,y,0,rx,rz,height,1,16,-.159);
    stack('Hull',11.25,2.7,2.08,8.8);
    stack('White',h-3.17,2.78,2.14,.38);
    stack('Crimson',h-2.3,2.79,2.15,1.35);
    stack('DarkSteel',h-.72,2.85,2.22,1.95);
    stack('Brass',h+.22,2.91,2.25,.22);
    stack('DarkSteel',h+.39,2.55,1.93,.16);
    spar('DarkSteel',[x-3.05,7,0],[x-1.25,h+.6,0],.33);
  }
  for(const [x,y,dir] of [[-39,6.2,-1],[39,4.3,1]]){
    drum('DarkSteel',x,y+.55,0,3.3,2.9,1.05);
    drum('Hull',x,y+2.5,0,3.75,3.1,3.1,.76,8);
    for(const z of [-.72,.72])spar('DarkSteel',[x+dir*2.25,y+2.35,z],[x+dir*11,y+3.3,z],.47,.24);
  }
  // The ochre flotilla pennant breaks up the dark rigging against the cloud bank.
  const flag=new B.Mesh('pursuitPennant',scene);
  const flagData=new B.VertexData();
  flagData.positions=[-15,30.8,0,-15,29.1,0,-12,29.4,.45,-12,30.65,.45,-7.8,30.75,-.16];
  flagData.indices=[0,1,2,0,2,3,3,2,4,2,1,0,3,2,0,4,2,3];
  flagData.normals=[];B.VertexData.ComputeNormals(flagData.positions,flagData.indices,flagData.normals);
  flagData.uvs=[0,1,0,0,.45,0,.45,1,1,.75];flagData.applyToMesh(flag);
  add('Crimson',flag,0,0,0);
  for(const z of [-1.12,0,1.12])spar('HullDark',[18,5.85,z-1],[24,6.15,z+1],.58);
  for(const [finish,meshes] of groups){
    const batch=B.Mesh.MergeMeshes(meshes,true,true);
    batch.name='escort'+finish;batch.material=mat(finish);batch.parent=root;batch.isPickable=false;batch.receiveShadows=true;
  }
  return root;
}
