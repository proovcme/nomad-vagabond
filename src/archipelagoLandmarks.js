import { buildGeneratedIsland } from './islandGenerator.js?v=mission1';
import { applyRockProjection } from './terrainMaterials.js?v=mission1';

/** Scenic story beat beside the first flight: a split shipyard, its last cargo grounded.
 * Static geometry remains solid. This module does not add objectives or navigation markers.
 */
export class ArchipelagoLandmarks {
  constructor(scene, world, shadowGenerator = null) {
    this.scene = scene;
    this.world = world;
    this.shadowGenerator = shadowGenerator;
    this.elapsed = 0;
    this.disposed = false;
    this.root = new BABYLON.TransformNode('splitShipyardLandmark', scene);
    this.root.position.set(650, 75, -400);
    this.materials = [];
    this.staticMeshes = [];
    this.importedMeshes = [];
    this.halves = [];
    this.loadErrors = [];
    const red = this._material('shipyardOxideRed', '#a84628', 0.38);
    const dark = this._material('shipyardTealSteel', '#245457', 0.55);
    const ochre = this._material('shipyardOchreTrim', '#d2a051', 0.35);
    const cloth = this._material('shipyardPennantCloth', '#c76630', 0);
    cloth.backFaceCulling = false;
    cloth.roughness = 1;

    const left = new BABYLON.TransformNode('splitShipyardLeft', scene);
    left.parent = this.root; left.position.set(-35, 0, 1);
    const right = new BABYLON.TransformNode('splitShipyardRight', scene);
    right.parent = this.root; right.position.set(31, -4, -3);
    for (const [node, seed, radiusX, radiusZ, depth] of [[left,'SPLIT-DOCK-WEST',26,20,31],[right,'SPLIT-DOCK-EAST',20,16,26]]) {
      const island = buildGeneratedIsland(scene, {seed, radiusX, radiusZ, topY:1.5, depth, style:'industrial', parent:node, shadowGenerator});
      // The reusable small-island generator limits keel depth; stretch the whole half
      // uniformly in Y so its top/rock seam remains exact and the broken mass reads deep.
      node.scaling.y = node === left ? 1.3 : 1.6;
      this.halves.push(island);
      for (const mesh of [island.terrain,island.rock]) {
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        applyRockProjection(mesh.material, scene);
      }
    }

    // Western broken cantilever. Strong chords and diagonal braces, with a torn-away end.
    for (const z of [-4.8,4.8]) {
      this._beam([-26,2.8,z],[-4,2.0,z],0.65,0.9,red);
      this._beam([-26,-2,z],[-4,-3.5,z],0.5,0.65,dark);
      for(let span=0;span<4;span++) {
        const x=-26+span*5.5;
        this._beam([x,2.8-span*.2,z+Math.sign(z)*.36],[x+5.5,-2.4-span*.35,z+Math.sign(z)*.36],0.38,0.42,ochre);
        if(span<3)this._beam([x,-2-span*.35,z],[x+5.5,2.6-span*.2,z],0.34,0.38,red);
      }
    }
    for(const x of [-25,-19,-13,-7])this._beam([x,2.5,-4.8],[x,2.5,4.8],0.42,0.55,dark);
    for(const x of [-25,-22,-19,-16,-13,-10,-7])this._beam([x,3.1,-4.8],[x+.3,3.0,4.8],1.7,.22,ochre);
    // Remnant on the other half points down into the gap instead of bridging it neatly.
    for(const z of [-4.8,4.8]) {
      this._beam([17,-1,z],[9,-5,z-0.8],0.6,0.85,red);
      this._beam([17,-4,z],[9,-8,z-0.8],0.45,0.5,dark);
      this._beam([17,-1,z],[9,-8,z-0.8],0.32,0.45,ochre);
    }

    // A tilted skeletal derrick gives the tower a readable, deliberately uneven silhouette.
    const feet=[[-45,2,-7],[-37,2,-7],[-45,2,1],[-37,2,1]];
    const head=[-47,28,-7];
    feet.forEach(foot=>this._beam(foot,head,0.68,0.68,dark));
    for(let tier=0;tier<3;tier++) {
      const y=5+tier*7,shift=-tier*1.2;
      this._beam([-44+shift,y,-6.23],[-38+shift,y+7,-6.23],0.36,0.36,ochre);
      this._beam([-38+shift,y,-6],[-45+shift,y+7,-6],0.35,0.35,red);
    }
    this._beam(head,[-13,30,-7],0.75,0.9,red);
    this._beam([-46,23,-7],[-13,30,-7],0.4,0.55,ochre);
    this._beam([-46,27,-7],[-22,38,-7],0.4,0.48,dark);
    this._beam([-22,38,-7],[-13,30,-7],0.4,0.48,dark);

    // Crooked snapped beams and one substantial deck remnant, rather than a stack of boxes.
    this._beam([-44,2,7],[-30,2,7],7.5,0.65,red);
    for (const [a,b] of [
      [[-6,2,-4],[-1,5,-5]], [[-5,-1,4],[0,-7,6]],
      [[12,-4,-4],[5,-9,-7]], [[-31,3,9],[-25,5,12]],
      [[32,0,-6],[42,2,-11]], [[34,0,8],[41,-1,11]],
    ]) this._beam(a,b,0.5,0.65,red);

    this._hose('brokenFuelHose', [[-8,1,4],[-4,-4,5],[-5,-10,7],[-7,-16,7]], 0.23, dark);
    this._hose('saggingPowerCable', [[-21,9,-7],[-9,3,-7],[3,-3,-8],[13,-3,-8]], 0.16, dark);
    this._buildHook(dark, ochre);
    this._buildPennant(cloth);
    this._mergeStatic();

    const imports = [
      this._importModel('./assets/buildings/','control_tower.glb',left,[-9,1.5,5],1.05,[0,0.32,0.16]),
      this._importModel('./assets/aircraft/','scrapyard_plane.glb',right,[-4,5,0],1.65,[-0.55,Math.PI/2,0.28]),
    ];
    this.readyPromise=Promise.all([...this.halves.map(h=>h.readyPromise),...imports]).then(()=>this.snapshot);
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  _material(name,color,metallic) {
    const mat=new BABYLON.PBRMaterial(name,this.scene);
    mat.albedoColor=BABYLON.Color3.FromHexString(color);
    mat.metallic=metallic;mat.roughness=.78;
    this.materials.push(mat);return mat;
  }

  _solid(mesh,material) {
    mesh.material=material;mesh.parent=this.root;
    mesh.receiveShadows=true;mesh.checkCollisions=true;mesh.isPickable=true;
    this.staticMeshes.push(mesh);return mesh;
  }

  _beam(a,b,width,depth,material) {
    const from=new BABYLON.Vector3(...a),to=new BABYLON.Vector3(...b),delta=to.subtract(from);
    const mesh=BABYLON.MeshBuilder.CreateBox('shipyardStructuralBeam',{width,height:delta.length(),depth},this.scene);
    mesh.position.copyFrom(from.add(to).scale(.5));
    mesh.rotationQuaternion=BABYLON.Quaternion.FromUnitVectorsToRef(BABYLON.Axis.Y,delta.normalize(),new BABYLON.Quaternion());
    return this._solid(mesh,material);
  }

  _hose(name,points,radius,material) {
    const controls=points.map(p=>new BABYLON.Vector3(...p));
    const path=BABYLON.Curve3.CreateCatmullRomSpline(controls,4).getPoints();
    const mesh=BABYLON.MeshBuilder.CreateTube(name,{path,radius,tessellation:6,cap:BABYLON.Mesh.CAP_ALL},this.scene);
    return this._solid(mesh,material);
  }

  _buildHook(dark,ochre) {
    this.hookPivot=new BABYLON.TransformNode('shipyardWindHookPivot',this.scene);
    this.hookPivot.parent=this.root;this.hookPivot.position.set(-14,29,-7);
    const cable=BABYLON.MeshBuilder.CreateCylinder('shipyardHookCable',{height:12,diameter:.16,tessellation:6},this.scene);
    cable.parent=this.hookPivot;cable.position.y=-6;cable.material=dark;cable.isPickable=false;
    const path=[];for(let i=0;i<=12;i++){const a=-.4+i/12*Math.PI*1.65;path.push(new BABYLON.Vector3(Math.cos(a)*1.1,-12.7+Math.sin(a)*1.1,0));}
    const hook=BABYLON.MeshBuilder.CreateTube('shipyardHangingHook',{path,radius:.22,tessellation:6,cap:BABYLON.Mesh.CAP_ALL},this.scene);
    hook.parent=this.hookPivot;hook.material=ochre;hook.isPickable=false;
    this.dynamicMeshes=[cable,hook];
    for(const mesh of this.dynamicMeshes){mesh.receiveShadows=true;this.shadowGenerator?.addShadowCaster(mesh,false);}
  }

  _buildPennant(material) {
    this._beam([-44,27,-7],[-44,34,-7],.22,.22,this.materials[2]);
    const positions=[],indices=[],uvs=[];
    const columns=7,rows=3;
    for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++) {
      const end=x===columns ? [0,-.7,.35,-.2][y] : 0;
      positions.push(-44+x*.85,33-y*.8+end,-7);uvs.push(x/columns,y/rows);
      if(x<columns&&y<rows){const a=y*(columns+1)+x,b=a+1,c=a+columns+1,d=c+1;indices.push(a,c,b,b,c,d);}
    }
    this.pennant=new BABYLON.Mesh('shipyardTornPennant',this.scene);
    const vd=new BABYLON.VertexData();vd.positions=positions;vd.indices=indices;vd.uvs=uvs;
    const normals=[];BABYLON.VertexData.ComputeNormals(positions,indices,normals);vd.normals=normals;vd.applyToMesh(this.pennant,true);
    this.pennant.parent=this.root;this.pennant.material=material;this.pennant.isPickable=false;
    this.pennantRest=positions;this.pennantPositions=positions.slice();this.pennantIndices=indices;
    this.dynamicMeshes.push(this.pennant);
  }

  _mergeStatic() {
    // Merge in local coordinates, before restoring the world transform: three draw calls for the steel kit.
    const offset=this.root.position.clone();this.root.position.setAll(0);this.root.computeWorldMatrix(true);
    for(const mesh of this.staticMeshes)mesh.computeWorldMatrix(true);
    const merged=[];
    for(const material of this.materials){
      const group=this.staticMeshes.filter(mesh=>mesh.material===material);
      if(!group.length)continue;
      const mesh=BABYLON.Mesh.MergeMeshes(group,true,true,undefined,false,false);
      if(!mesh)continue;
      mesh.name=`shipyardMerged_${material.name}`;mesh.parent=this.root;mesh.material=material;
      mesh.checkCollisions=true;mesh.receiveShadows=true;mesh.isPickable=true;
      this.shadowGenerator?.addShadowCaster(mesh,false);merged.push(mesh);
    }
    this.staticMeshes=merged;this.root.position.copyFrom(offset);
  }

  async _importModel(path,file,parent,position,scale,rotation) {
    if(this.scene.getEngine() instanceof BABYLON.NullEngine)return;
    try{
      const result=await BABYLON.SceneLoader.ImportMeshAsync('',path,file,this.scene);
      if(this.disposed){result.meshes.forEach(m=>m.dispose());return;}
      const mount=new BABYLON.TransformNode(`shipyardWreckMount_${file}`,this.scene);
      mount.parent=parent;mount.position.set(...position);mount.scaling.setAll(scale);
      mount.rotationQuaternion=BABYLON.Quaternion.FromEulerAngles(...rotation);
      for(const mesh of result.meshes){
        if(!mesh.parent)mesh.parent=mount;
        mesh.checkCollisions=true;mesh.receiveShadows=true;mesh.isPickable=true;
        if(file==='scrapyard_plane.glb' && mesh.material && /atlas/i.test(mesh.material.name)){mesh.material.metallic=.25;mesh.material.albedoColor=new BABYLON.Color3(1.2,.64,.44);}
        if(mesh.getTotalVertices()>0)this.shadowGenerator?.addShadowCaster(mesh,false);
        this.importedMeshes.push(mesh);
      }
    }catch(error){this.loadErrors.push(file);console.warn('Shipyard landmark model unavailable:',file,error);}
  }

  update(dt) {
    if(this.disposed)return;this.elapsed+=Math.min(Math.max(dt,0),.1);
    this.hookPivot.rotation.z=Math.sin(this.elapsed*.54)*.075;
    this.hookPivot.rotation.x=Math.sin(this.elapsed*.37+.7)*.035;
    const p=this.pennantPositions;
    for(let i=0;i<p.length;i+=3){const x=this.pennantRest[i],distance=(x+44)/5.95;
      p[i+2]=-7+Math.sin(distance*6-this.elapsed*2.1)*distance*.5+Math.sin(distance*11-this.elapsed*3.2)*distance*.10;
      p[i+1]=this.pennantRest[i+1]+Math.sin(distance*8-this.elapsed*1.7)*distance*.14;
    }
    this.pennant.updateVerticesData(BABYLON.VertexBuffer.PositionKind,p);
    const normals=[];BABYLON.VertexData.ComputeNormals(p,this.pennantIndices,normals);
    this.pennant.updateVerticesData(BABYLON.VertexBuffer.NormalKind,normals);
  }

  get snapshot() {
    const meshes=[...this.staticMeshes,...this.dynamicMeshes,...this.importedMeshes,...this.halves.flatMap(h=>[h.terrain,h.rock])];
    return {name:'Расколотая верфь',position:this.root.position.asArray(),
      meshes:meshes.filter(m=>m.getTotalVertices()>0).length,triangles:meshes.reduce((sum,m)=>sum+m.getTotalIndices()/3,0),
      bounds:{min:[587,40,-426],max:[706,113,-372]},loadErrors:[...this.loadErrors]};
  }

  dispose() {
    if(this.disposed)return;this.disposed=true;
    this.halves.forEach(h=>h.dispose());this.root.dispose();this.materials.forEach(m=>m.dispose());
  }
}
