/** Sampled union/difference of tapered craggy rock masses. No runtime CSG.
 * Marching tetrahedra shares every grid-edge vertex; cave is part of the same field.
 */
export function buildRockShell(scene, base, material, rockMasses, shadowGenerator = null) {
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const masses = rockMasses.map((m, i) => ({...m, c: Math.cos(m.ry || 0), s: Math.sin(m.ry || 0),
    sx: m.sx || 1, sz: m.sz || 1, rTop: m.dTop / 2, rBottom: m.dBot / 2, phase:i * 2.39996}));
  // A full grid cell of hidden clearance behind the room lining prevents coarse
  // tetrahedral corner interpolation from cutting back through green wall panels.
  const cave={minX:-40.5,maxX:11.5,minY:.8,maxY:17.8,minZ:-11.5,maxZ:31.5};
  const boxDistance = (x,y,z) => {
    const qx=Math.abs(x+14.5)-26, qy=Math.abs(y-9.3)-8.5, qz=Math.abs(z-10)-21.5;
    return Math.hypot(Math.max(qx,0),Math.max(qy,0),Math.max(qz,0))+Math.min(Math.max(qx,qy,qz),0);
  };
  const field = (x, y, z) => {
    let union = 1e6;
    for (const m of masses) {
      const dx=x-m.x, dz=z-m.z, dy=y-m.y;
      const outsideCap=Math.abs(dy)-m.h/2;
      if (outsideCap > union + 2) continue;
      const lx=(dx*m.c-dz*m.s)/m.sx, lz=(dx*m.s+dz*m.c)/m.sz;
      const t=Math.max(0,Math.min(1,dy/m.h+0.5));
      const radius=m.rBottom+(m.rTop-m.rBottom)*t;
      const radial=Math.hypot(lx,lz);
      // Real 3D sculptural geological ribs & stepped cliff strata shelves (not just flat polyhedrons!)
      const a=Math.atan2(lz,lx);
      const strata=Math.sin(dy*0.42+a*2.0+m.phase)*0.55;
      const crag=Math.sin(a*5+m.phase)*0.82+Math.sin(a*9+dy*0.30+m.phase)*0.38+strata;
      const side=(radial-radius-crag)*Math.min(m.sx,m.sz);
      const sdf=Math.hypot(Math.max(side,0),Math.max(outsideCap,0))+Math.min(Math.max(side,outsideCap),0);
      if(sdf<union)union=sdf;
    }
    // Rectangular hangar portal open toward +X, cut cleanly through the rock mass.
    const rampY = 3.38 + (10 - x) / 28 * 18.35;
    const stairChannel = Math.max(-20 - x, x - 13, Math.abs(z + 12.4) - 3.2, rampY - 0.6 - y);
    return Math.max(union, -boxDistance(x,y,z), -stairChannel);
  };
  // Expanded by one empty cell on all sides to guarantee a capped boundary; finer 2.1m grid for sharper cliff relief.
  const step=2.1, min=[-60,-57,-42], max=[34,27,42];
  const nx=Math.round((max[0]-min[0])/step)+1,ny=Math.round((max[1]-min[1])/step)+1,nz=Math.round((max[2]-min[2])/step)+1;
  const index=(x,y,z)=>(z*ny+y)*nx+x;
  const count=nx*ny*nz, values=new Float32Array(count);
  for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
    const v=field(min[0]+x*step,min[1]+y*step,min[2]+z*step);
    values[index(x,y,z)]=Math.abs(v)<1e-5?1e-5:v;
  }
  const positions=[],indices=[],uvs=[],cache=new Map();
  const coord=id=>{
    const x=id%nx, q=(id-x)/nx,y=q%ny,z=(q-y)/ny;
    return [min[0]+x*step,min[1]+y*step,min[2]+z*step];
  };
  const vertex=(a,b)=>{
    const lo=Math.min(a,b), hi=Math.max(a,b),key=lo*count+hi;
    const existing=cache.get(key);if(existing!==undefined)return existing;
    const p=coord(a),q=coord(b),t=values[a]/(values[a]-values[b]);
    const id=positions.length/3;
    positions.push(p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t);
    uvs.push((positions[id*3]+60)/16,(positions[id*3+1]+57)/16);
    cache.set(key,id);return id;
  };
  const triangle=(a,b,c,direction)=>{
    const ai=a*3,bi=b*3,ci=c*3;
    const ux=positions[bi]-positions[ai],uy=positions[bi+1]-positions[ai+1],uz=positions[bi+2]-positions[ai+2];
    const vx=positions[ci]-positions[ai],vy=positions[ci+1]-positions[ai+1],vz=positions[ci+2]-positions[ai+2];
    const xx=uy*vz-uz*vy,yy=uz*vx-ux*vz,zz=ux*vy-uy*vx;
    if(xx*xx+yy*yy+zz*zz<1e-30)return;
    if(xx*direction[0]+yy*direction[1]+zz*direction[2]<0)indices.push(a,c,b);else indices.push(a,b,c);
  };
  const tetrahedra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){
    const cube=[index(x,y,z),index(x+1,y,z),index(x+1,y+1,z),index(x,y+1,z),index(x,y,z+1),index(x+1,y,z+1),index(x+1,y+1,z+1),index(x,y+1,z+1)];
    let negative=0;for(const id of cube)if(values[id]<0)negative++;
    if(negative===0||negative===8)continue;
    for(const tetra of tetrahedra){
      const inside=[],outside=[];
      for(const corner of tetra){const id=cube[corner];(values[id]<0?inside:outside).push(id);}
      if(!inside.length||!outside.length)continue;
      const ic=[0,0,0],oc=[0,0,0];
      for(const id of inside){const p=coord(id);for(let k=0;k<3;k++)ic[k]+=p[k]/inside.length;}
      for(const id of outside){const p=coord(id);for(let k=0;k<3;k++)oc[k]+=p[k]/outside.length;}
      const direction=oc.map((v,k)=>v-ic[k]);
      if(inside.length===1){
        const v=outside.map(id=>vertex(inside[0],id));triangle(v[0],v[1],v[2],direction);
      }else if(outside.length===1){
        const v=inside.map(id=>vertex(outside[0],id));triangle(v[0],v[1],v[2],direction);
      }else{
        const a=vertex(inside[0],outside[0]),b=vertex(inside[0],outside[1]),c=vertex(inside[1],outside[1]),d=vertex(inside[1],outside[0]);
        triangle(a,b,c,direction);triangle(a,c,d,direction);
      }
    }
  }
  const normals=new Array(positions.length).fill(0);
  for(let i=0;i<indices.length;i+=3){
    const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
    const ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2];
    const vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2];
    const n=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx];
    for(const at of[a,b,c])for(let k=0;k<3;k++)normals[at+k]+=n[k];
  }
  for(let i=0;i<normals.length;i+=3){const len=Math.hypot(normals[i],normals[i+1],normals[i+2])||1;normals[i]/=len;normals[i+1]/=len;normals[i+2]/=len;}
  // Two authored strata ledges are independent of the SDF. Their outer profiles
  // remain, but their interior portions must receive the exact same room cut.
  let strataCuts=0;
  const ledges=base.group.getChildMeshes().filter(m=>/^vagStrata_\d+$/.test(m.name));
  let cutter=null,cutterCSG=null;
  for(const ledge of ledges){
    const parent=ledge.parent;ledge.parent=null;ledge.computeWorldMatrix(true);
    const bounds=ledge.getBoundingInfo().boundingBox;
    const minB=bounds.minimumWorld,maxB=bounds.maximumWorld;
    const intersects=maxB.x>cave.minX&&minB.x<cave.maxX&&maxB.y>cave.minY&&minB.y<cave.maxY&&maxB.z>cave.minZ&&minB.z<cave.maxZ;
    if(!intersects){ledge.parent=parent;continue;}
    if(!cutter){
      cutter=BABYLON.MeshBuilder.CreateBox('hangarStrataClearanceCutter',{width:cave.maxX-cave.minX,height:cave.maxY-cave.minY,depth:cave.maxZ-cave.minZ},scene);
      cutter.position.set((cave.minX+cave.maxX)/2,(cave.minY+cave.maxY)/2,(cave.minZ+cave.maxZ)/2);cutter.computeWorldMatrix(true);
      cutterCSG=BABYLON.CSG.FromMesh(cutter);
    }
    const clipped=BABYLON.CSG.FromMesh(ledge).subtract(cutterCSG).toMesh(`${ledge.name}_caveCut`,ledge.material,scene);
    clipped.parent=parent;clipped.receiveShadows=ledge.receiveShadows;clipped.checkCollisions=ledge.checkCollisions;
    clipped.metadata={...ledge.metadata,hangarClearanceCut:true};
    shadowGenerator?.removeShadowCaster(ledge);shadowGenerator?.addShadowCaster(clipped,false);
    ledge.dispose();strataCuts++;
  }
  cutter?.dispose();
  // Match Babylon's clockwise procedural front face without inverting outward normals.
  for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
  const mesh=new BABYLON.Mesh('vagabondUnifiedRockShell',scene);
  const data=new BABYLON.VertexData();Object.assign(data,{positions,indices,normals,uvs});data.applyToMesh(mesh);
  mesh.parent=base.group;mesh.material=material;mesh.receiveShadows=true;mesh.checkCollisions=true;mesh.isPickable=true;
  shadowGenerator?.addShadowCaster(mesh,false);
  mesh.metadata={generator:'sampled-sdf-marching-tetrahedra',gridStep:step,triangles:indices.length/3,vertices:positions.length/3,
    generationMs:Math.round((typeof performance!=='undefined'?performance.now():Date.now())-started),masses:masses.length,strataCuts,caveClearanceBounds:cave};
  return mesh;
}
