// Local bow faces -X. All fixed fittings are batched by finish on the moving ship.
import { createLoftedHull } from './flightDeckCruiser.js';

export function buildPursuitDestroyer(scene) {
  const B=BABYLON;
  const root=new B.TransformNode('fogDestroyer',scene);
  const mat=name=>scene.getMaterialByName('cfCruiser'+name+'Mat');
  const mats={hull:mat('Hull'),crimson:mat('HullDark'),white:mat('White'),deckSteel:mat('DeckSteel')};
  const stations=[
    [-62,.25,8,-1],[-57,1.9,7.0,-3.7],[-48,3.95,6.2,-5.1],[-36,5.2,6,-5.8],
    [-15,5.95,5.9,-6],[-12,6,3.35,-6],[12,5.95,3.35,-5.85],[34,5.45,3.5,-5.5],
    [46,4.7,3.65,-4.75],[54,3.4,3.8,-3.75],[56,2.25,3.85,-2.65],
  ].map(([x,w,y,k])=>({x,halfBeamTop:w,halfBeamMid:w*.86,halfBeamKeel:w*.26,yTop:y,yMid:.25,yKeel:k}));
  createLoftedHull(scene,'fogDestroyerHull',stations,mats,root,null,{decorate:false,bowRake:2.5});
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
  // Deckhouse plans are laid out from bow to stern, with clipped forward corners.
  function house(finish, fore, aft, beam, bottom, top, cut, taper=1) {
    const plan=[[fore,-beam*.6],[fore+cut,-beam],[aft-.6,-beam],[aft,-beam*.85],
      [aft,beam*.85],[aft-.6,beam],[fore+cut,beam],[fore,beam*.6]];
    const center=(fore+aft)/2, positions=[], indices=[];
    for(const [y,factor] of [[bottom,1],[top,taper]]) {
      for(const [x,z] of plan) positions.push(center+(x-center)*factor,y,z*factor);
    }
    for(let i=0;i<8;i++) {
      const next=(i+1)%8;
      indices.push(i,next,next+8,i,next+8,i+8);
      if(i>0 && i<7) indices.push(8,8+i,9+i);
    }
    const mesh=new B.Mesh('deckhouse',scene),data=new B.VertexData();
    data.positions=positions;data.indices=indices;data.normals=[];
    data.uvs=positions.flatMap((v,i)=>i%3===0?[v/9,(positions[i+1]+positions[i+2])/9]:[]);
    B.VertexData.ComputeNormals(positions,indices,data.normals);
    data.applyToMesh(mesh);mesh.convertToFlatShadedMesh();add(finish,mesh,0,0,0);
  }
  house('Hull',-35,-13,4.45,5.75,8.65,2.5);
  house('Hull',-26,-13.5,4.15,8.6,11.65,2.25,.95);
  house('DeckSteel',-25.6,-14.1,5.05,11.6,12.12,2.6);
  house('DarkSteel',-24.5,-15.25,3.8,12.1,13.65,1.9);
  house('Hull',-24.8,-15,4.05,13.62,14.3,2.1);
  drum('HullDark',-17.6,15,0,1.15,1,1.5);
  spar('Hull',[-17.6,15.9,-2.3],[-17.6,15.9,2.3],.55);
  house('Hull',22,39,3.85,3.4,6.6,1.5);
  house('HullDark',24,31.5,2.7,6.5,8.35,.9);
  // Paint follows the flare of the shell on both sides; the number is fictional.
  function hullPaint(side, path) {
    const mesh=new B.Mesh('escortPaint',scene),data=new B.VertexData();
    const project=([x,y])=>{
      const i=stations.findIndex(s=>s.x>=x),a=stations[i-1],b=stations[i];
      const t=(x-a.x)/(b.x-a.x),w=a.halfBeamTop+(b.halfBeamTop-a.halfBeamTop)*t;
      const top=a.yTop+(b.yTop-a.yTop)*t,h=(y-.25)/(top-.25);
      const flare=h<.57 ? .43*h/.57 : .43+.57*(h-.57)/.43;
      return [x,y,side*(w*(.86+.14*flare)+.045)];
    };
    data.positions=path.flatMap(project);data.indices=[0,2,1,0,3,2];
    data.normals=path.flatMap(()=>[0,0,side]);data.uvs=[0,0,1,0,1,1,0,1];
    data.applyToMesh(mesh);add('White',mesh,0,0,0);
  }
  for(const side of [-1,1]){
    const strokes=[[[0,3],[1.55,3]],[[1.55,3],[1.55,1.75]],[[1.55,1.75],[0,.25]],[[0,.25],[1.65,.25]],
      [[2.35,3],[4,3]],[[4,3],[2.85,.25]]];
    for(const [[ax,ay],[bx,by]] of strokes){
      const dx=bx-ax,dy=by-ay,k=.14/Math.hypot(dx,dy);
      const corners=[[ax-dy*k,ay+dx*k],[ax+dy*k,ay-dx*k],[bx+dy*k,by-dx*k],[bx-dy*k,by+dx*k]];
      hullPaint(side,corners.map(([x,y])=>[-31+side*x,1.05+y]));
    }
    for(const x of [-21.75,-18.75])
      spar('AmberGlow',[x-.45,12.9,side*3.83],[x+.45,12.9,side*3.83],.15);

    for(const x of [-22.5,-21,-19.5,-18,-16.5])
      spar('Hull',[x,12.1,side*3.84],[x,13.7,side*3.84],.1);
    spar('HullDark',[-14,6,side*3.9],[-12.5,21,0],.32,.16);
    spar('DarkSteel',[-34,8.7,side*3.5],[-12.5,21,0],.065);
    spar('DarkSteel',[-12.5,22,side*.2],[22,12,side*1.1],.065);
    drum('Hull',3.4,6.6,side*4.2,4.1,1,1.0,1.18);
    drum('DarkSteel',3.4,7.14,side*4.2,4.2,.85,.12);
    for(const x of [.8,3.4,6]) spar('DeckSteel',[x,7.24,side*4.2-.78],[x,7.24,side*4.2+.78],.1);
    for(const x of [-.6,7.3]) spar('HullDark',[x,4.3,side*3.2],[x,7.9,side*4.4],.15);
    const rail=stations.slice(1,-1);
    for(let i=1;i<rail.length;i++){
      const a=rail[i-1],b=rail[i],span=b.x-a.x,count=Math.ceil(span/4);
      const point=(t,h)=>[a.x+span*t,a.yTop+(b.yTop-a.yTop)*t+h,side*(a.halfBeamTop+(b.halfBeamTop-a.halfBeamTop)*t-.22)];
      for(let j=0;j<count;j++) spar('HullDark',point(j/count,0),point(j/count,.98),.067);
      for(const h of [.51,.96]) spar('HullDark',point(0,h),point(1,h),.058);
    }
    for(const [x,z] of [[-39,4.7],[-36,5],[-33,5.1],[-30,5.24],[-27,5.34],[-24,5.45]])
      spar('DarkSteel',[x,4.3,side*(z-.3)],[x,4.3,side*(z+.23)],.27);
  }
  spar('DarkSteel',[-13.3,6.2,0],[-12.05,27,0],.31,.085);
  spar('DarkSteel',[-12.5,20.7,-4.5],[-12.5,20.7,4.5],.13);
  for(const side of [-1,1]) spar('DarkSteel',[-12.5,19,0],[-12.5,20.7,side*4.5],.072);
  spar('HullDark',[22,3.4,0],[22,12.4,0],.21,.085);
  spar('DarkSteel',[22,10.8,-2.5],[22,10.8,2.5],.11);
  for(const [x,top,rx,rz] of [[-9,16.2,2.65,1.67],[5,13.55,1.94,1.43]]){
    const base=5.35,shift=y=>x+(y-base)*.12;
    drum('HullDark',x,4.4,0,rx+1,rz+.85,2.2,.93);
    const stack=(f,y,wide,height)=>drum(f,shift(y),y,0,rx*wide,rz*wide,height,1,20,-.119);
    stack('Hull',(base+top)/2,1,top-base);
    stack('DarkSteel',top-.65,1.02,1.42);
    stack('HullDark',top+.11,1.05,.2);
    stack('DarkSteel',top+.24,.86,.12);
    spar('HullDark',[x-rx-.22,5.4,0],[shift(top)-rx-.22,top-.23,0],.21);
  }
  for(const [x,y,dir] of [[-43,6.14,-1],[-30.8,8.65,-1],[35.3,6.6,1],[44,3.7,1]]){
    drum('HullDark',x,y+.36,0,2.05,1.85,.78);
    house('Hull',x-2.35,x+2.35,1.95,y+.72,y+2.85,1,.82);
    for(const z of [-.54,.54]) spar('DarkSteel',[x+dir*1.7,y+1.94,z],[x+dir*6.9,y+2.17,z],.23,.15);
  }
  for(const z of [-.87,0,.87]) spar('HullDark',[12,4.8,z-.85],[17,5,z+.85],.43);
  // A small swallowtail gives the masthead a warm moving-ship accent.
  const flag=B.MeshBuilder.CreateRibbon('pursuitPennant',{pathArray:[
    [[-12.1,26.6,0],[-10.8,26.25,.23],[-9.1,26.35,-.12]],
    [[-12.1,25.5,0],[-10.8,25.67,.23],[-9.35,26.17,-.12]]
  ].map(row=>row.map(p=>B.Vector3.FromArray(p))),sideOrientation:B.Mesh.DOUBLESIDE},scene);
  add('Crimson',flag,0,0,0);
  for(const [finish,meshes] of groups){
    const batch=B.Mesh.MergeMeshes(meshes,true,true);
    batch.name='escort'+finish;batch.material=mat(finish);batch.parent=root;batch.isPickable=false;batch.receiveShadows=true;
  }
  return root;
}
