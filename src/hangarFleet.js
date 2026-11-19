import { configureImportedAircraftMaterial } from './explorerAircraft.js?v=mission1';
export const HANGAR_FLEET=Object.freeze([
 {variant:'cargo',name:'Грузовой «Бродяга»',role:'Доставка припасов',file:'scrapyard_plane.glb',x:-29,z:0},
 {variant:'bomber',name:'Бомбардировщик «Молот»',role:'Бомбометание по складам',file:'scrapyard_bomber.glb',x:-29,z:20},
 {variant:'fighter',name:'Истребитель «Оса»',role:'Воздушный перехват',file:'scrapyard_fighter.glb',x:-13,z:0},
 {variant:'attacker',name:'Штурмовик «Клык»',role:'Подавление наземных орудий',file:'scrapyard_attacker.glb',x:-13,z:20},
]);
/** Four real Gemini airframes. Active aircraft is controlled by ExplorerAircraft, not duplicated. */
export class HangarFleet {
 constructor(scene,base,shadowGenerator=null){this.scene=scene;this.base=base;this.shadowGenerator=shadowGenerator;this.activeVariant='cargo';this.disposed=false;this.records=HANGAR_FLEET.map(d=>({...d,root:null,loaded:false,error:null}));this.readyPromise=Promise.all(this.records.map(r=>this._load(r)));scene.onDisposeObservable.addOnce(()=>{this.disposed=true;});}
 async _load(record){
  if(this.scene.getEngine() instanceof BABYLON.NullEngine)return;
  try{
   const res=await BABYLON.SceneLoader.ImportMeshAsync('','./assets/aircraft/',record.file,this.scene);
   if(this.disposed){res.meshes.forEach(m=>m.dispose());return;}
   const root=new BABYLON.TransformNode(`parkedAircraft_${record.variant}`,this.scene);
   root.rotationQuaternion=BABYLON.Quaternion.RotationYawPitchRoll(-Math.PI/2,0,0);
   for(const n of res.meshes.filter(m=>!m.parent))n.parent=root;
   root.computeWorldMatrix(true);const bounds=root.getHierarchyBoundingVectors(true);
   root.position.set(record.x,3.38-bounds.min.y,record.z);root.parent=this.base.group;
   for(const m of res.meshes){m.isPickable=false;m.checkCollisions=true;if(!m.sourceMesh)m.receiveShadows=true;configureImportedAircraftMaterial(m.material,this.scene.getEngine(),record.variant);if(m.getTotalVertices()>0)this.shadowGenerator?.addShadowCaster(m,false);}
   record.root=root;record.loaded=true;record.floorOffset=-bounds.min.y;record.bounds={min:bounds.min.asArray(),max:bounds.max.asArray()};root.setEnabled(record.variant!==this.activeVariant);
  }catch(e){record.error=String(e?.message||e);console.warn('Hangar aircraft could not load',record.variant,e);}
 }
 setActiveVariant(variant){this.activeVariant=variant;for(const r of this.records)r.root?.setEnabled(r.variant!==variant);}
 point(record){this.base.group.computeWorldMatrix(true);return BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(record.x+4.5,4.5,record.z),this.base.group.getWorldMatrix());}
 nearest(position){let best=null,distance=Infinity;for(const r of this.records){if(!r.loaded)continue;const d=BABYLON.Vector3.Distance(position,this.point(r));if(d<distance){best=r;distance=d;}}return distance<7?best:null;}
 parkActive(ship){const r=this.records.find(r=>r.variant===ship.variant);if(!r)return;ship.dockOnAsteroid(this.base,{localPad:{x:r.x,y:3.38,z:r.z}});this.setActiveVariant(ship.variant);}

 get snapshot(){return {activeVariant:this.activeVariant,bays:this.records.map(({variant,x,z,loaded,error})=>({variant,x,z,loaded,error}))};}
}
