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
    // A moving-coil meter on the aisle side of the switch cabinet.
    const dial=B.MeshBuilder.CreateCylinder('switchboardVoltmeter',{diameter:.67,height:.07,tessellation:32},scene);
    dial.parent=this.leverNode;dial.position.set(0,1.09,.49);dial.rotation.x=Math.PI/2;dial.material=steel;
    dial.position.y=.96;
    const brass=metal(scene,'switchboardBrass','#b39657',.42);
    dial.material=brass;
    const panelMaterial=(name,file)=>{
      const mat=metal(scene,name,'#ffffff',.77);
      mat.metallic=.16;
      mat.albedoTexture=new B.Texture('./assets/textures/nomad/'+file,scene);
      mat.albedoTexture.uScale=-1;mat.albedoTexture.uOffset=1;
      return mat;
    };
    const sign=B.MeshBuilder.CreatePlane('switchboardServiceDoor',{width:1.08,height:1.47},scene);
    sign.parent=this.leverNode;sign.position.set(0,.75,.458);sign.rotation.y=Math.PI;
    sign.material=panelMaterial('switchboardEnamel','switchboard-enamel.webp');
    const scale=B.MeshBuilder.CreateDisc('voltmeterScale',{radius:.297,tessellation:48},scene);
    scale.parent=this.leverNode;scale.position.set(0,.96,.537);scale.rotation.y=Math.PI;
    scale.material=panelMaterial('switchboardPaper','switchboard-volts.webp');
    scale.material.albedoTexture.vScale=-1;scale.material.albedoTexture.vOffset=1;
    const casing=scene.getMeshByName('vagLeverBox');
    if(casing){
      casing.material.albedoColor=B.Color3.FromHexString('#486c60');
      casing.material.albedoTexture=new B.Texture('./assets/textures/nomad/weathered-iron-v2.jpg',scene);
      casing.material.metallic=.36;casing.material.roughness=.7;
      steel.albedoTexture=casing.material.albedoTexture;
      steel.roughness=.72;steel.metallic=.31;
      grip.albedoTexture=casing.material.albedoTexture;grip.metallic=.05;
    }
    const pivot=new B.TransformNode('voltmeterPivot',scene);pivot.parent=this.leverNode;pivot.position.set(0,.88,.549);
    const pipe=metal(scene,'switchboardConduit','#71674e',.57);
    for(const side of [-1,1]){
      const z=side*.21;
      const path=[new B.Vector3(-.51,.47,z),new B.Vector3(-.68,.47,z),new B.Vector3(-.73,.42,z),new B.Vector3(-.73,.12,z),new B.Vector3(-.8,.055,z),new B.Vector3(-1.3,.055,z)];
      const tube=B.MeshBuilder.CreateTube('switchboardFeed',{path,radius:.043,tessellation:8},scene);
      tube.parent=this.leverNode;tube.material=pipe;
    }
    for(const [y,w,h,d] of [[.07,1.18,.12,.98],[1.51,1.15,.055,.95]]){
      const rim=B.MeshBuilder.CreateBox('switchboardLip',{width:w,height:h,depth:d},scene);
      rim.parent=this.leverNode;rim.position.y=y;rim.material=steel;
    }
    for(const y of [.34,.91]){
      const hinge=B.MeshBuilder.CreateCylinder('switchboardDoorHinge',{diameter:.052,height:.20,tessellation:10},scene);
      hinge.parent=this.leverNode;hinge.position.set(-.53,y,.47);hinge.material=brass;
    }
    this.needle=new B.TransformNode('voltmeterNeedlePivot',scene);this.needle.parent=pivot;
    const pointer=B.MeshBuilder.CreateBox('voltmeterNeedle',{width:.019,height:.24,depth:.013},scene);
    pointer.parent=this.needle;pointer.position.set(0,.11,.014);pointer.material=grip;
    const hub=B.MeshBuilder.CreateSphere('voltmeterSpindle',{diameter:.05,segments:10},scene);
    hub.parent=pivot;hub.position.z=.024;hub.material=brass;
    // The old bulb becomes a small inset status lens, leaving the moving handle readable.
    const lamp=scene.getMeshByName('vagLeverBeacon');if(lamp){lamp.material.diffuseColor=B.Color3.FromHexString('#702f23');lamp.material.specularColor.set(.09,.05,.03);lamp.scaling.set(.22,.22,.22);lamp.position.set(.56,1.32,.27);}
  }
  _discover(){
    for(const node of this.scene.transformNodes)if((node.name==='radarRotor'||node.name==='vagRadarRotor')&&!this.radars.has(node)){if(node.rotationQuaternion){node.rotation.copyFrom(node.rotationQuaternion.toEulerAngles());node.rotationQuaternion=null;}this.radars.add(node);}
    for(const mesh of this.scene.meshes){const m=mesh.material;if(m&&/foliage|leaf/i.test(m.name)&&!m._foliageWind&&!m._autumnLeaves&&!m._sunlitCanopy&&m.getClassName?.()==='PBRMaterial'){m._foliageWind=new FoliageWind(m);}}
  }
  update(dt,powered=false, coldStart=false){
    dt=Math.max(0,Math.min(dt,.1));this.elapsed+=dt;this.scene.metadata ||= {};this.scene.metadata.windTime=this.elapsed;this.scene.metadata.basePowered=Boolean(powered);
    if(this.elapsed>=this.scanAfter){this._discover();this.scanAfter=this.elapsed+.5;}
    this.voltage = powered ? Math.min(1,(this.voltage || 0) + dt/3.2) : 0;
    if(this.needle)this.needle.rotation.z=1-this.voltage*2;
    this.scene.metadata.hangarVoltage = coldStart ? this.voltage : 1;
    this.radarSpeed+=((powered && (!coldStart || this.voltage>.65) ? .62 : 0)-this.radarSpeed)*(1-Math.exp(-dt*2.8));
    for(const radar of this.radars){if(radar.isDisposed()){this.radars.delete(radar);continue;}radar.rotation.y=(radar.rotation.y+this.radarSpeed*dt)%(Math.PI*2);}
    if(this.leverPivot)this.leverPivot.rotation.z+=((powered?-2.65:-.35)-this.leverPivot.rotation.z)*(1-Math.exp(-dt*8));
  }
  get snapshot(){return {powered:Boolean(this.scene.metadata?.basePowered),voltage:this.voltage,radarRotors:this.radars.size,radarSpeed:this.radarSpeed,leverAngle:this.leverPivot?.rotation.z,windTime:this.elapsed,windMaterials:this.scene.materials.filter(m=>m._foliageWind).length};}
}
