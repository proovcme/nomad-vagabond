// Static, ray-traced diffuse occlusion and one-bounce colour transfer.
// Results live on vertices, independently of repeating albedo UVs and camera position.
// Dynamic sun shadows and aircraft lighting remain live.
export const BAKE_VERSION=2;
const targetPattern=/^(generatedIsland_|vagabondUnifiedRockShell|vagStrata_|hangarInnerFloor|vagHangar(?:Back|Side|Ceil|NorthFacade)|vagCarrierRunway|vagUpperDeck|vagUpperCourtyard|vagCarrierDeck|indMainApron|indDockPlatform|indRefineryHall|indHangarRoof|hangarServiceDetails|forestUndersideMultiRoots|indUndersideMultiRoots)/;
export function bakeTargets(scene){return scene.meshes.filter(m=>targetPattern.test(m.name)&&m.isEnabled()&&m.isVisible&&m.getTotalVertices()>0);}

/** Add samples to large planar walls/decks without changing their shape or UVs. */
export function refineBakeSurface(mesh,maxEdge=3){
  if(!/^(hangarInnerFloor|vagHangar(?:Back|Side|Ceil|NorthFacade)|vagCarrierRunway|vagUpperDeck|vagUpperCourtyard|vagCarrierDeck|indMainApron|indDockPlatform|indRefineryHall|indHangarRoof)/.test(mesh.name)||mesh.metadata?.bakeRefined)return;
  const p=mesh.getVerticesData('position'),n=mesh.getVerticesData('normal'),uv=mesh.getVerticesData('uv'),ids=mesh.getIndices();
  if(!p||!n||!ids)return;
  const positions=[],normals=[],uvs=[],indices=[],lookup=new Map();
  const emit=v=>{const key=v.map(x=>x.toFixed(5)).join(',');if(lookup.has(key))return lookup.get(key);const id=positions.length/3;lookup.set(key,id);positions.push(...v.slice(0,3));normals.push(...v.slice(3,6));uvs.push(...v.slice(6,8));return id;};
  const vertex=id=>[...p.slice(id*3,id*3+3),...n.slice(id*3,id*3+3),...(uv?uv.slice(id*2,id*2+2):[0,0])];
  const split=(a,b,c,depth=0)=>{
    const v=[a,b,c],lengths=v.map((x,i)=>Math.hypot(...x.slice(0,3).map((t,k)=>t-v[(i+1)%3][k])));
    const edge=lengths.indexOf(Math.max(...lengths));
    if(lengths[edge]<=maxEdge||depth>=12){indices.push(emit(a),emit(b),emit(c));return;}
    const x=v[edge],y=v[(edge+1)%3],z=v[(edge+2)%3],mid=x.map((t,k)=>(t+y[k])*.5);
    split(x,mid,z,depth+1);split(mid,y,z,depth+1);
  };
  for(let i=0;i<ids.length;i+=3)split(vertex(ids[i]),vertex(ids[i+1]),vertex(ids[i+2]));
  mesh.setVerticesData('position',positions);mesh.setVerticesData('normal',normals);mesh.setVerticesData('uv',uvs);mesh.setIndices(indices);
  mesh.refreshBoundingInfo();mesh.metadata={...mesh.metadata,bakeRefined:true};
}
export function geometryKey(mesh){
  let hash=2166136261;
  for(const data of [mesh.getVerticesData('position'),mesh.getVerticesData('normal'),mesh.getIndices()])for(const x of data||[]){hash=Math.imul(hash^Math.round(Math.fround(x)*10000),16777619);}
  return `${mesh.name}:${mesh.getTotalVertices()}:${hash>>>0}`;
}
const colourOf=m=>{
  if(/^(vagCarrierRunway|hangarInnerFloor)/.test(m.name))return [.22,.24,.26];
  if(/^vagHangar(?:Back|Side|Ceil|NorthFacade)/.test(m.name))return [.18,.32,.16];
  if(/rock|strata/i.test(m.material?.name||'')||/Rock|Roots/.test(m.name))return [.68,.38,.16];
  if(/terrain/i.test(m.name))return [.26,.56,.18];
  if(/wall/i.test(m.material?.name||''))return [.18,.32,.16];
  return [.16,.38,.42];
};
export function sceneTriangles(meshes){
  const B=BABYLON,out=[];
  for(const mesh of meshes){
    const p=mesh.getVerticesData('position'),ids=mesh.getIndices(),matrix=mesh.computeWorldMatrix(true),verts=[];
    for(let i=0;i<p.length;i+=3)verts.push(B.Vector3.TransformCoordinates(B.Vector3.FromArray(p,i),matrix).asArray());
    const colour=colourOf(mesh);
    for(let i=0;i<ids.length;i+=3){
      const a=verts[ids[i]],b=verts[ids[i+1]],c=verts[ids[i+2]],e=b.map((x,k)=>x-a[k]),f=c.map((x,k)=>x-a[k]);
      out.push({a,e,f,colour,min:a.map((x,k)=>Math.min(x,b[k],c[k])),max:a.map((x,k)=>Math.max(x,b[k],c[k])),center:a.map((x,k)=>(x+b[k]+c[k])/3)});
    }
  }
  return out;
}
export function buildBakeBVH(triangles){
  function node(ts){
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(const t of ts)for(let k=0;k<3;k++){min[k]=Math.min(min[k],t.min[k]);max[k]=Math.max(max[k],t.max[k]);}
    if(ts.length<=10)return {min,max,triangles:ts};
    let axis=0;for(let k=1;k<3;k++)if(max[k]-min[k]>max[axis]-min[axis])axis=k;
    ts.sort((a,b)=>a.center[axis]-b.center[axis]);const mid=ts.length>>1;
    return {min,max,left:node(ts.slice(0,mid)),right:node(ts.slice(mid))};
  }
  return node(triangles.slice());
}
export function traceBakeRay(tree,origin,direction,maxDistance=24){
  let distance=maxDistance,colour=null;
  const stack=[tree],inv=direction.map(d=>1/(Math.abs(d)<1e-10?1e-10:d));
  while(stack.length){
    const node=stack.pop();let lo=0,hi=distance;
    for(let k=0;k<3;k++){const a=(node.min[k]-origin[k])*inv[k],b=(node.max[k]-origin[k])*inv[k];lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}
    if(hi<lo)continue;
    if(!node.triangles){stack.push(node.left,node.right);continue;}
    for(const t of node.triangles){
      const [dx,dy,dz]=direction,[fx,fy,fz]=t.f,[ex,ey,ez]=t.e;
      const px=dy*fz-dz*fy,py=dz*fx-dx*fz,pz=dx*fy-dy*fx,det=ex*px+ey*py+ez*pz;
      if(Math.abs(det)<1e-9)continue;
      const tx=origin[0]-t.a[0],ty=origin[1]-t.a[1],tz=origin[2]-t.a[2],u=(tx*px+ty*py+tz*pz)/det;
      if(u<0||u>1)continue;
      const qx=ty*ez-tz*ey,qy=tz*ex-tx*ez,qz=tx*ey-ty*ex,v=(dx*qx+dy*qy+dz*qz)/det;
      if(v<0||u+v>1)continue;
      const d=(fx*qx+fy*qy+fz*qz)/det;
      if(d>.035&&d<distance){distance=d;colour=t.colour;}
    }
  }
  return {distance,colour};
}
export function bakeVertex(tree,position,normal,samples=24){
  let nx=normal[0],ny=normal[1],nz=normal[2],len=Math.hypot(nx,ny,nz)||1;nx/=len;ny/=len;nz/=len;
  const tangent=Math.abs(ny)<.95?[-nz,0,nx]:[1,0,0],tl=Math.hypot(...tangent);for(let k=0;k<3;k++)tangent[k]/=tl;
  const bitangent=[ny*tangent[2]-nz*tangent[1],nz*tangent[0]-nx*tangent[2],nx*tangent[1]-ny*tangent[0]];
  const normalUnit=[nx,ny,nz],origin=position.map((p,k)=>p+normalUnit[k]*.09),bounce=[0,0,0];let visibility=0;
  for(let i=0;i<samples;i++){
    const radius=Math.sqrt((i+.5)/samples),angle=i*2.399963229728653,y=Math.sqrt(1-radius*radius);
    const direction=normalUnit.map((n,k)=>n*y+tangent[k]*radius*Math.cos(angle)+bitangent[k]*radius*Math.sin(angle));
    const hit=traceBakeRay(tree,origin,direction);
    // Room-scale occlusion, with smooth finite-distance falloff and a small sky floor.
    visibility+=hit.colour?Math.min(1,(hit.distance/24)**.65):1;
    if(hit.colour){
      for(let k=0;k<3;k++)bounce[k]+=hit.colour[k]*.26*Math.max(0,1-hit.distance/24)/samples;
    }else{
      // Unoccluded sky rays contribute warm golden horizon/sky irradiance
      const skyWarm=Math.max(0,direction[1]);
      bounce[0]+=(0.10+0.08*skyWarm)/samples;
      bounce[1]+=(0.13+0.07*skyWarm)/samples;
      bounce[2]+=(0.18+0.04*(1-skyWarm))/samples;
    }
  }
  const sun=[-.60,.34,-.72],sl=Math.hypot(...sun);for(let k=0;k<3;k++)sun[k]/=sl;
  // Five rays across a small area light retain broad penumbras in static scenery.
  let sunlight=0;
  for(let i=0;i<5;i++){
    const angle=i*2.3999632297,r=i===0?0:.022,d=sun.map((v,k)=>v+tangent[k]*Math.cos(angle)*r+bitangent[k]*Math.sin(angle)*r),dl=Math.hypot(...d);for(let k=0;k<3;k++)d[k]/=dl;
    sunlight+=traceBakeRay(tree,origin,d,180).colour?0:1;
  }
  const clamp01=v=>Math.max(0,Math.min(1,v));
  return [clamp01(bounce[0]),clamp01(bounce[1]),clamp01(bounce[2]),clamp01(.20+.80*visibility/samples),clamp01(sunlight/5)];
}
class BakedIrradiancePlugin extends BABYLON.MaterialPluginBase{
  constructor(material){super(material,'BakedIrradiance',220,{BAKED_IRRADIANCE:false,BAKED_SUNSHADOW:false},true);this._enable(true);}
  getClassName(){return 'BakedIrradiance';}
  prepareDefines(defines,scene,mesh){defines.BAKED_IRRADIANCE=mesh.isVerticesDataPresent('bakedIrradiance');defines.BAKED_SUNSHADOW=/^(generatedIsland_|vagabondUnifiedRockShell|vagStrata_|vagCarrierRunway|vagUpperCourtyard|indMainApron|indDockPlatform|indRefineryHall|indHangarRoof|forestUndersideMultiRoots|indUndersideMultiRoots)/.test(mesh.name);}
  getAttributes(attributes){attributes.push('bakedIrradiance','bakedSunVisibility');}
  getCustomCode(type){
    if(type==='vertex')return {CUSTOM_VERTEX_DEFINITIONS:'#ifdef BAKED_IRRADIANCE\nattribute vec4 bakedIrradiance; attribute float bakedSunVisibility; varying vec4 vBakedIrradiance; varying float vBakedSunVisibility;\n#endif',CUSTOM_VERTEX_MAIN_BEGIN:'#ifdef BAKED_IRRADIANCE\nvBakedIrradiance=bakedIrradiance;vBakedSunVisibility=bakedSunVisibility;\n#endif'};
    if(type==='fragment')return {CUSTOM_FRAGMENT_DEFINITIONS:'#ifdef BAKED_IRRADIANCE\nvarying vec4 vBakedIrradiance; varying float vBakedSunVisibility;\n#endif',CUSTOM_LIGHT0_COLOR:'#if defined(BAKED_IRRADIANCE) && defined(BAKED_SUNSHADOW) && defined(DIRLIGHT0)\nfloat stylizedSunVis = smoothstep(0.14, 0.86, vBakedSunVisibility);\ndiffuse0.rgb*=mix(vec3(0.32,0.54,0.82),vec3(1.06,1.00,0.92),stylizedSunVis);\n#endif',CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:`
      #if defined(BAKED_IRRADIANCE) && !defined(UNLIT)
      #ifdef REFLECTION
      finalIrradiance*=mix(.50,1.04,vBakedIrradiance.a);
      finalRadianceScaled*=mix(.66,1.02,vBakedIrradiance.a);
      #endif
      vec3 coolAoTint = mix(vec3(0.44, 0.60, 0.86), vec3(1.0), vBakedIrradiance.a);
      finalAmbient*=coolAoTint;
      finalDiffuse*=mix(.72,1.02,vBakedIrradiance.a);
      finalDiffuse+=surfaceAlbedo*vBakedIrradiance.rgb*1.75;
      #endif`};
    return null;
  }
}
export function applyBakedData(mesh,data){
  const irradiance=[],sun=[];for(let i=0;i<data.length;i+=5){irradiance.push(...data.slice(i,i+4));sun.push(data[i+4]);}
  mesh.setVerticesData('bakedIrradiance',irradiance,false,4);mesh.setVerticesData('bakedSunVisibility',sun,false,1);
  if(!mesh.material._bakedIrradiance)mesh.material._bakedIrradiance=new BakedIrradiancePlugin(mesh.material);
  mesh.material.markAsDirty(BABYLON.Material.AllDirtyFlag);
  mesh.metadata={...mesh.metadata,bakedIrradiance:true};
}
/** Offline cache for the shipped seed; other procedural seeds bake incrementally once. */
export class BakedLighting{
  constructor(scene){
    this.scene=scene;this.status='loading-cache';this.meshes=bakeTargets(scene);this.meshes.forEach(m=>refineBakeSurface(m));
    this.readyPromise=this.start().catch(e=>{this.status='failed';console.warn('Static irradiance bake failed',e);});
  }
  async start(){
    const start=performance.now();let cache=null;
    if(typeof fetch==='function'&&!(this.scene.getEngine() instanceof BABYLON.NullEngine)){
      try{const r=await fetch('./assets/lighting/static-irradiance-v2.json');if(r.ok)cache=await r.json();}catch{}
    }
    if(this.scene.isDisposed)return;
    const pending=[];let cached=0;
    for(const mesh of this.meshes){const data=cache?.version===BAKE_VERSION?cache.meshes[geometryKey(mesh)]:null;if(data?.length===mesh.getTotalVertices()*5){applyBakedData(mesh,data);cached++;}else pending.push(mesh);}
    this.pending=pending.map(m=>geometryKey(m));this.cached=cached;this.status=pending.length?'baking':'ready';this.baked=0;
    if(pending.length){
      const tree=buildBakeBVH(sceneTriangles(this.meshes)),B=BABYLON;
      for(const mesh of pending){
        const positions=mesh.getVerticesData('position'),normals=mesh.getVerticesData('normal'),matrix=mesh.computeWorldMatrix(true),normalMatrix=B.Matrix.Transpose(B.Matrix.Invert(matrix)),data=[];let slice=performance.now();
        for(let i=0;i<positions.length;i+=3){
          if(this.scene.isDisposed)return;
          const p=B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,i),matrix),n=B.Vector3.TransformNormal(B.Vector3.FromArray(normals,i),normalMatrix).normalize();
          data.push(...bakeVertex(tree,p.asArray(),n.asArray()));
          if(performance.now()-slice>7){await new Promise(resolve=>setTimeout(resolve,0));slice=performance.now();}
        }
        applyBakedData(mesh,data);this.baked++;
      }
    }
    this.status='ready';this.ms=Math.round(performance.now()-start);
  }
  get snapshot(){return {method:'ray-traced vertex diffuse occlusion and one-bounce colour transfer',status:this.status,meshes:this.meshes.length,cached:this.cached||0,generated:this.pending||[],baked:this.baked||0,bakeMs:this.ms||0,samples:24,maxDistance:24};}
}
