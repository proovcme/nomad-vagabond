/** Shared wind clock and powered mechanisms; no timers or extra render loop. */
class FoliageWind extends BABYLON.MaterialPluginBase {
  constructor(material){super(material,'FoliageWind',230,{FOLIAGE_WIND:false},true);this.registerForExtraEvents=true;this._enable(true);}
  getClassName(){return 'FoliageWind';}
  prepareDefines(d){d.FOLIAGE_WIND=true;}
  getUniforms(){return {ubo:[{name:'foliageWind',size:4,type:'vec4'}],vertex:'uniform vec4 foliageWind;'};}
  hardBindForSubMesh(buffer,scene,engine,subMesh){const b=subMesh.getRenderingMesh().getBoundingInfo().boundingBox;buffer.updateFloat4('foliageWind',scene.metadata?.windTime||0,b.minimum.y,Math.max(.01,b.maximum.y-b.minimum.y),.026);buffer.update();}
  getCustomCode(type){return type==='vertex'?{CUSTOM_VERTEX_UPDATE_POSITION:`
    #ifdef FOLIAGE_WIND
    float crownHeight=clamp((positionUpdated.y-foliageWind.y)/foliageWind.z,0.0,1.0);
    float crownBend=crownHeight*crownHeight*foliageWind.z*foliageWind.w;
    float gust=sin(foliageWind.x*1.18+positionUpdated.x*.91+positionUpdated.z*.72);
    positionUpdated.x+=crownBend*(gust+.35*sin(foliageWind.x*2.3+positionUpdated.y*2.1));
    positionUpdated.z+=crownBend*.42*cos(foliageWind.x*.93+positionUpdated.x*1.7);
    #endif`}:null;}
}
function metal(scene,name,color,roughness=.6){const m=new BABYLON.PBRMaterial(name,scene);m.albedoColor=BABYLON.Color3.FromHexString(color);m.metallic=.5;m.roughness=roughness;return m;}
export class WorldMotion {
  constructor(scene,leverNode=null){
    this.scene=scene;this.elapsed=0;this.scanAfter=0;this.radars=new Set();this.radarSpeed=0;this.leverNode=leverNode;
    if(leverNode)this._lever();
  }
  _lever(){
    const B=BABYLON,scene=this.scene;
    this.leverPivot=new B.TransformNode('powerSwitchHinge',scene);this.leverPivot.parent=this.leverNode;this.leverPivot.position.set(.59,.96,0);this.leverPivot.rotation.z=-.35;
    const steel=metal(scene,'powerSwitchBrushedSteel','#8a998e'),grip=metal(scene,'powerSwitchBakelite','#402e1b',.85);
    for(const z of[-.19,.19]){const arm=B.MeshBuilder.CreateCylinder('powerSwitchArm',{diameter:.055,height:.57,tessellation:8},scene);arm.parent=this.leverPivot;arm.position.set(0,.285,z);arm.material=steel;arm.isPickable=false;}
    const handle=B.MeshBuilder.CreateCylinder('powerSwitchGrip',{diameter:.14,height:.54,tessellation:10},scene);handle.parent=this.leverPivot;handle.position.y=.58;handle.rotation.x=Math.PI/2;handle.material=grip;handle.isPickable=false;
    for(const z of[-.36,.36]){const hinge=B.MeshBuilder.CreateCylinder('powerSwitchBearing',{diameter:.22,height:.12,tessellation:10},scene);hinge.parent=this.leverNode;hinge.position.set(.59,.96,z);hinge.rotation.x=Math.PI/2;hinge.material=steel;hinge.isPickable=false;}
    // The old bulb becomes a small inset status lens, leaving the moving handle readable.
    const lamp=scene.getMeshByName('vagLeverBeacon');if(lamp){lamp.scaling.set(.30,.30,.30);lamp.position.set(.56,1.32,.27);}
  }
  _discover(){
    for(const node of this.scene.transformNodes)if(node.name==='radarRotor'&&!this.radars.has(node)){if(node.rotationQuaternion){node.rotation.copyFrom(node.rotationQuaternion.toEulerAngles());node.rotationQuaternion=null;}this.radars.add(node);}
    for(const mesh of this.scene.meshes){const m=mesh.material;if(m&&/foliage|leaf/i.test(m.name)&&!m._foliageWind&&!m._autumnLeaves&&!m._sunlitCanopy&&m.getClassName?.()==='PBRMaterial'){m._foliageWind=new FoliageWind(m);}}
  }
  update(dt,powered=false){
    dt=Math.max(0,Math.min(dt,.1));this.elapsed+=dt;this.scene.metadata ||= {};this.scene.metadata.windTime=this.elapsed;this.scene.metadata.basePowered=Boolean(powered);
    if(this.elapsed>=this.scanAfter){this._discover();this.scanAfter=this.elapsed+.5;}
    this.radarSpeed+=(Number(powered)*.62-this.radarSpeed)*(1-Math.exp(-dt*2.8));
    for(const radar of this.radars){if(radar.isDisposed()){this.radars.delete(radar);continue;}radar.rotation.y=(radar.rotation.y+this.radarSpeed*dt)%(Math.PI*2);}
    if(this.leverPivot)this.leverPivot.rotation.z+=((powered?-2.65:-.35)-this.leverPivot.rotation.z)*(1-Math.exp(-dt*8));
  }
  get snapshot(){return {powered:Boolean(this.scene.metadata?.basePowered),radarRotors:this.radars.size,radarSpeed:this.radarSpeed,leverAngle:this.leverPivot?.rotation.z,windTime:this.elapsed,windMaterials:this.scene.materials.filter(m=>m._foliageWind).length};}
}
