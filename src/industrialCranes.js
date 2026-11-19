/** Authored riveted cargo cranes: tapered lattice, triangular boom, sloped cab and live hoist. */
export class IndustrialCranes {
  constructor(scene,islandGroup,shadowGenerator=null){
    this.scene=scene;this.parent=islandGroup;this.shadowGenerator=shadowGenerator;this.time=0;this.disposed=false;
    this.staticMeshes=[];this.hoists=[];this.ownedMaterials=[];this.hiddenLegacy=[];this.roots=[];
    const get=(name,hex,metal=.3)=>{let m=scene.getMaterialByName(name);if(m)return m;m=new BABYLON.PBRMaterial(name,scene);m.albedoColor=BABYLON.Color3.FromHexString(hex);m.metallic=metal;m.roughness=.76;this.ownedMaterials.push(m);return m;};
    this.steel=get('indSteelMat','#398a87',.35);this.rust=get('indFactoryRust','#ac5831',.24);this.ochre=get('indCraneOchrePaint','#dfb767',.2);
    this.glass=get('indCraneCabGlass','#81c8c9',.05);this.glass.alpha=.78;this.glass.roughness=.24;this.glass.backFaceCulling=false;
    for(const m of islandGroup.getChildMeshes())if(/^indCrane(Mast|Boom)_/.test(m.name)){
      this.hiddenLegacy.push({mesh:m,visible:m.isVisible,collisions:m.checkCollisions});m.isVisible=false;m.checkCollisions=false;shadowGenerator?.removeShadowCaster(m);
    }
    const specs=[{x:16,z:-10,h:30,boom:26,rotY:.55},{x:26,z:18,h:24,boom:20,rotY:-.9}];
    specs.forEach((spec,index)=>this._build(spec,index));
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  _beam(a,b,radius,material,list,parent){
    const from=new BABYLON.Vector3(...a),to=new BABYLON.Vector3(...b),delta=to.subtract(from);
    const mesh=BABYLON.MeshBuilder.CreateCylinder('cargoCraneProfile',{height:delta.length(),diameter:radius*2,tessellation:6},this.scene);
    mesh.position.copyFrom(from.add(to).scale(.5));mesh.rotationQuaternion=new BABYLON.Quaternion();
    BABYLON.Quaternion.FromUnitVectorsToRef(BABYLON.Axis.Y,delta.normalize(),mesh.rotationQuaternion);
    mesh.parent=parent;mesh.material=material;mesh.receiveShadows=true;list.push(mesh);return mesh;
  }

  _prism(name,points,depth,position,material,list,parent){
    const p=[],indices=[],uv=[];const n=points.length;
    for(const z of[-depth/2,depth/2])for(const[x,y]of points){p.push(x,y,z);uv.push(x*.2,y*.2);}
    for(let i=1;i<n-1;i++){indices.push(0,i+1,i,n,n+i,n+i+1);}
    for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,n+j,i,n+j,n+i);}
    const normals=[];BABYLON.VertexData.ComputeNormals(p,indices,normals);
    const mesh=new BABYLON.Mesh(name,this.scene),vd=new BABYLON.VertexData();Object.assign(vd,{positions:p,indices,normals,uvs:uv});vd.applyToMesh(mesh);
    mesh.position.set(...position);mesh.parent=parent;mesh.material=material;mesh.receiveShadows=true;list.push(mesh);return mesh;
  }

  _merge(parts,parent,prefix,solid=true){
    // All parts are still under an origin-space assembly here; bake only local transforms.
    const result=[];
    for(const material of[this.steel,this.rust,this.ochre,this.glass]){
      const members=parts.filter(m=>m.material===material);if(!members.length)continue;
      members.forEach(m=>m.computeWorldMatrix(true));
      const mesh=BABYLON.Mesh.MergeMeshes(members,true,true,undefined,false,false);if(!mesh)continue;
      mesh.name=`${prefix}_${material.name}`;mesh.parent=parent;mesh.material=material;
      mesh.checkCollisions=solid&&material!==this.glass;mesh.isPickable=mesh.checkCollisions;mesh.receiveShadows=true;
      if(material!==this.glass)this.shadowGenerator?.addShadowCaster(mesh,false);result.push(mesh);
    }
    return result;
  }

  _build(spec,index){
    const root=new BABYLON.TransformNode(`authoredCargoCrane_${index}`,this.scene);this.roots.push(root);
    const parts=[],beam=(a,b,r,m)=>this._beam(a,b,r,m,parts,root);
    const lower=2.4,top=lower+spec.h;
    // Broad tapered bearing plinth and raised slewing ring; no stacked rectangular tower.
    for(const [name,diamTop,diamBottom,height,y,mat]of[
      ['craneBearingPlinth',4.8,6.2,.9,lower+.45,this.rust],
      ['craneSlewRing',4.2,4.8,.42,lower+1.15,this.ochre],
    ]){const m=BABYLON.MeshBuilder.CreateCylinder(name,{diameterTop:diamTop,diameterBottom:diamBottom,height,tessellation:12},this.scene);m.parent=root;m.position.y=y;m.material=mat;parts.push(m);}
    const width=y=>1.8-(y-lower)/spec.h*.6;
    for(const x of[-1,1])for(const z of[-1,1])beam([x*width(lower+1.4),lower+1.4,z*width(lower+1.4)],[x*width(top),top,z*width(top)],.23,this.steel);
    const levels=6;
    for(let j=0;j<=levels;j++){
      const y=lower+1.6+(spec.h-1.6)*j/levels,w=width(y);
      for(const z of[-1,1])beam([-w,y,z*w],[w,y,z*w],.13,this.ochre);
      for(const x of[-1,1])beam([x*w,y,-w],[x*w,y,w],.13,this.steel);
      if(j===levels)continue;
      const yy=lower+1.6+(spec.h-1.6)*(j+1)/levels,ww=width(yy),flip=j%2?1:-1;
      // One diagonal per face gives a readable Warren lattice without overlapping X caps.
      for(const z of[-1,1])beam([flip*w,y,z*w],[-flip*ww,yy,z*ww],.105,this.rust);
      for(const x of[-1,1])beam([x*w,y,-flip*w],[x*ww,yy,flip*ww],.105,this.steel);
    }
    // Triangular boom: twin lower chords plus one elevated spine and zig-zag webs.
    const rear=-spec.boom*.30,end=spec.boom*.78,by=top-.5,boomY=x=>by+x*.095;
    for(const z of[-1.10,1.10])beam([rear,boomY(rear),z],[end,boomY(end),z],.20,this.ochre);
    beam([rear,boomY(rear)+2.1,0],[end,boomY(end)+2.1,0],.18,this.rust);
    const bays=8;
    for(let i=0;i<=bays;i++){
      const x=rear+(end-rear)*i/bays,y=boomY(x);
      beam([x,y,-1.10],[x,y,1.10],.10,this.steel);
      for(const z of[-1.10,1.10])beam([x,y,z],[x,y+2.1,0],.105,this.steel);
      if(i<bays){const xx=rear+(end-rear)*(i+1)/bays,yy=boomY(xx);
        for(const z of[-1.10,1.10])beam([x,y,z],[xx,yy+2.1,0],.095,this.rust);}
    }
    // A-frame stays, counterweight cradle, sloped glazed operator cab.
    for(const z of[-.8,.8])beam([-1,top+1,z],[-2,top+7.5,z*.35],.17,this.steel);
    beam([-2,top+7.5,0],[end-1,boomY(end)+2.2,0],.07,this.steel);
    beam([-2,top+7.5,0],[rear,boomY(rear)+2.2,0],.07,this.steel);
    this._prism('craneFacetedCounterweight',[[-2.5,0],[2.5,0],[2.15,2.25],[-1.85,2.25]],3.8,[rear+1.2,boomY(rear)-.5,0],this.rust,parts,root);
    this._prism('craneSlopedOperatorCab',[[-2,0],[2,0],[2,1.7],[1.2,3],[-1.7,3],[-2.25,2.2]],3.4,[2.7,top-4.1,2.2],this.ochre,parts,root);
    // Glazed front/sloping pane is offset outward from solid cab shell by a real frame depth.
    this._prism('craneCabGlazing',[[-1.55,0],[1.50,0],[1.15,1.10],[-1.40,1.10]],.08,[2.8,top-2.2,3.96],this.glass,parts,root);
    beam([.7,top-4.15,4.02],[4.8,top-4.15,4.02],.13,this.steel);
    // Exposed winch and two flanged pulleys make the lifting mechanism legible.
    for(const [x,y,z,radius,len]of[[-3,top+1.3,0,.68,1.4],[-3,top+1.3,-.84,.85,.16],[-3,top+1.3,.84,.85,.16],[end-2,boomY(end)+.3,0,.48,.85]]){
      const drum=BABYLON.MeshBuilder.CreateCylinder('craneWinchDrum',{diameter:radius*2,height:len,tessellation:12},this.scene);drum.parent=root;drum.position.set(x,y,z);drum.rotation.x=Math.PI/2;drum.material=this.steel;parts.push(drum);
    }
    this.staticMeshes.push(...this._merge(parts,root,`cargoCraneStatic_${index}`));
    // Hoist geometry remains a tiny separate assembly, gently responding to wind.
    const pivot=new BABYLON.TransformNode(`cargoCraneHoist_${index}`,this.scene);pivot.parent=root;pivot.position.set(end-2,boomY(end)-.1,0);
    const hoistParts=[],length=spec.h*.52;
    for(const z of[-.28,.28])this._beam([0,0,z],[0,-length,z],.035,this.steel,hoistParts,pivot);
    this._prism('craneHoistBlock',[[-.5,0],[.5,0],[.65,.55],[-.65,.55]],.85,[0,-length-.55,0],this.ochre,hoistParts,pivot);
    const arc=[];for(let j=0;j<=14;j++){const a=-.35+j/14*Math.PI*1.65;arc.push(new BABYLON.Vector3(Math.cos(a)*.53,-length-1.12+Math.sin(a)*.53,0));}
    const hook=BABYLON.MeshBuilder.CreateTube('craneForgedHook',{path:arc,radius:.13,tessellation:6,cap:BABYLON.Mesh.CAP_ALL},this.scene);hook.parent=pivot;hook.material=this.ochre;hoistParts.push(hook);
    // Merge at origin to avoid baking the pivot offset twice.
    const pivotPosition=pivot.position.clone();pivot.position.setAll(0);pivot.computeWorldMatrix(true);
    const dynamic=this._merge(hoistParts,pivot,`cargoCraneMoving_${index}`,false);pivot.position.copyFrom(pivotPosition);
    this.hoists.push({pivot,meshes:dynamic,phase:index*1.8});
    root.parent=this.parent;root.position.set(spec.x,0,spec.z);root.rotation.y=spec.rotY;root.computeWorldMatrix(true);
  }

  update(dt){if(this.disposed)return;this.time+=Math.max(0,Math.min(dt,.1));for(const h of this.hoists){h.pivot.rotation.z=Math.sin(this.time*.48+h.phase)*.018;h.pivot.rotation.x=Math.sin(this.time*.37+h.phase)*.012;}}
  get snapshot(){const moving=this.hoists.flatMap(h=>h.meshes),meshes=[...this.staticMeshes,...moving];return {cranes:2,staticDraws:this.staticMeshes.length,movingDraws:moving.length,triangles:meshes.reduce((s,m)=>s+m.getTotalIndices()/3,0),hiddenLegacy:this.hiddenLegacy.length};}
  dispose(){if(this.disposed)return;this.disposed=true;for(const m of this.staticMeshes)m.dispose();for(const root of this.roots)root.dispose();for(const m of this.ownedMaterials)m.dispose();for(const old of this.hiddenLegacy)if(!old.mesh.isDisposed()){old.mesh.isVisible=old.visible;old.mesh.checkCollisions=old.collisions;}}
}
