/** Small physical light fittings, restrained aviation signals and bounded warm illumination.
 * Reuses the carrier's existing lamps; no billboard glows or shadow-casting point lights.
 */
export class PracticalLights {
  constructor(scene, world, base, ship) {
    this.scene=scene;this.world=world;this.base=base;this.ship=ship;
    this.time=0;this.disposed=false;this.meshes=[];this.materials=[];this.newLights=[];
    this.changedLights=[];this.changedMeshes=[];this.pilotLamps=new Map();this.landmarkDone=false;
    this._lightStates=new Map();this._materialLimits=new Map();this._hangarLights=[];this._hangarTargets=[];
    this._aircraftRoot=null;this.aircraftFixtures=[];this.runwayFixtures=[];this._lightingRefreshTimer=0;
    this.red=this._emissive('practicalPortRed','#bc3024',.85);
    this.green=this._emissive('practicalStarboardGreen','#36ba7b',.85);
    this.white=this._emissive('practicalTailWhite','#e7dec4',.20);
    this.beacon=this._emissive('practicalAircraftBeacon','#eee3d0',.10);
    this.warm=this._emissive('practicalHangarWarm','#ffd39a',1.6);
    this.hangarBanks=[this.warm,...[1,2].map(i=>this._emissive('practicalHangarBank'+i,'#ffd39a',1.6))];
    this.generatorGreen=this._emissive('practicalGeneratorPilot','#48b579',.65);
    this.radarAmber=this._emissive('practicalRadarPilot','#dca34a',.70);
    this.ruinRed=this._emissive('practicalRuinWarning','#933327',.42);
    this.ruinWarm=this._emissive('practicalRuinBulb','#d7aa74',.65);
    this.runway=Array.from({length:6},(_,i)=>this._emissive(`practicalRunwaySequence_${i}`,'#dba457',.45));
    this.housing=new BABYLON.PBRMaterial('practicalLampHousing',scene);
    this.housing.albedoColor=BABYLON.Color3.FromHexString('#30494a');this.housing.metallic=.6;this.housing.roughness=.72;
    this.materials.push(this.housing);
    this._lensTemplates=new Map();
    this._installHangar();this._installRunway();this._installAircraft();
    this._installLandmark();
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  _emissive(name,hex,intensity) {
    const mat=new BABYLON.StandardMaterial(name,this.scene);
    const color=BABYLON.Color3.FromHexString(hex).toLinearSpace();
    mat.disableLighting=true;mat.diffuseColor=BABYLON.Color3.Black();mat.specularColor=BABYLON.Color3.Black();mat.emissiveColor=color.scale(intensity);
    mat._practicalBaseColor=color;
    this.materials.push(mat);return mat;
  }

  _intensity(material,value) {material.emissiveColor.copyFrom(material._practicalBaseColor).scaleInPlace(value);}

  _lens(name,parent,position,material,scale=1,axis='y') {
    let template=this._lensTemplates.get(material);
    if(!template){
      template=BABYLON.MeshBuilder.CreateCylinder(`practicalLensTemplate_${material.name}`,{diameter:.26,height:.10,tessellation:8},this.scene);
      template.material=material;template.isVisible=false;template.isPickable=false;template.checkCollisions=false;
      this._lensTemplates.set(material,template);this.meshes.push(template);
    }
    const mesh=template.createInstance(name);mesh.parent=parent;mesh.position.set(...position);mesh.scaling.setAll(scale);
    if(axis==='x')mesh.rotation.z=Math.PI/2;if(axis==='z')mesh.rotation.x=Math.PI/2;
    mesh.isPickable=false;mesh.checkCollisions=false;this.meshes.push(mesh);return mesh;
  }

  _fitting(name,parent,surface,normal,material,scale=1) {
    const B=BABYLON,n=new B.Vector3(...normal),p=new B.Vector3(...surface);
    if(!this._housingTemplate){
      this._housingTemplate=B.MeshBuilder.CreateCylinder('practicalFittingHousingTemplate',{diameter:.34,height:.14,tessellation:10},this.scene);
      this._housingTemplate.material=this.housing;this._housingTemplate.isVisible=false;this._housingTemplate.isPickable=false;this._housingTemplate.checkCollisions=false;this.meshes.push(this._housingTemplate);
    }
    const housing=this._housingTemplate.createInstance(`${name}Housing`);housing.parent=parent;
    housing.position.copyFrom(p).addInPlace(n.scale(.02*scale));housing.scaling.setAll(scale);housing.isPickable=false;housing.checkCollisions=false;
    housing.rotationQuaternion=B.Quaternion.Identity();B.Quaternion.FromUnitVectorsToRef(B.Axis.Y,n,housing.rotationQuaternion);this.meshes.push(housing);
    const lens=this._lens(name,parent,p.add(n.scale(.088*scale)).asArray(),material,scale);
    lens.rotationQuaternion=housing.rotationQuaternion.clone();
    return {lens,housing,surface:[...surface],normal:[...normal]};
  }

  _captureLight(light) {
    if(this._lightStates.has(light))return;
    const state={light,diffuse:light.diffuse.clone(),specular:light.specular.clone(),intensity:light.intensity,range:light.range,
      position:light.position?.clone(),parent:light.parent,renderPriority:light.renderPriority,shadowEnabled:light.shadowEnabled,
      falloffType:light.falloffType,intensityMode:light.intensityMode,includedOnlyMeshes:[...light.includedOnlyMeshes],excludedMeshes:[...light.excludedMeshes]};
    this._lightStates.set(light,state);this.changedLights.push(state);
  }

  _installHangar() {
    for(const bar of this.base.group.getChildMeshes().filter(m=>/^(vagHangarLight_|hangarRoofLamp_)/.test(m.name))){
      this.changedMeshes.push({mesh:bar,material:bar.material});const baseX=BABYLON.Vector3.TransformCoordinates(bar.computeWorldMatrix(true).getTranslation(),this.base.group.computeWorldMatrix(true).clone().invert()).x;
      bar.material=this.hangarBanks[baseX < -18 ? 2 : baseX < -3 ? 1 : 0];
      if(!/^vagHangarLight_/.test(bar.name))continue;
      const housing=BABYLON.MeshBuilder.CreateBox('practicalInsetHangarHousing',{width:1.12,height:.32,depth:13.35},this.scene);
      housing.parent=bar.parent;housing.position.copyFrom(bar.position);housing.position.y+=.28;
      housing.material=this.housing;housing.receiveShadows=true;housing.isPickable=false;housing.checkCollisions=false;this.meshes.push(housing);
    }
    // Actual strip bottoms are y=12.80 in island coordinates. Point sources sit
    // just below those lenses, rather than inheriting an unrelated legacy parent.
    const defs=[
      {name:'vagHangarFlood',position:[-10,12.7,4],range:28,intensity:720},
      {name:'baseHangarLamp',position:[-10,12.7,16],range:28,intensity:720},
      {name:'baseWorkLamp',position:[1,9.4,10],range:38,intensity:580,daylight:true},
      {name:'hangarInteriorLight_-31',position:[-25,12.7,4],range:28,intensity:650},
      {name:'hangarInteriorLight_-16',position:[-25,12.7,16],range:28,intensity:650},
    ];
    for(const d of defs){
      let light=this.scene.getLightByName(d.name);
      if(light)this._captureLight(light);
      else{light=new BABYLON.PointLight(`practical_${d.name}`,new BABYLON.Vector3(...d.position),this.scene);this.newLights.push(light);}
      light.parent=this.base.group;light.position.set(...d.position);
      light.diffuse=BABYLON.Color3.FromHexString(d.daylight?'#cee1ff':'#ffe8c5').toLinearSpace();light.specular=BABYLON.Color3.FromHexString(d.daylight?'#c8dbed':'#e6cdb0').toLinearSpace();
      light.intensityMode=BABYLON.Light.INTENSITYMODE_LUMINOUSINTENSITY;light.falloffType=BABYLON.Light.FALLOFF_GLTF;
      light.intensity=d.intensity;light.range=d.range;light.shadowEnabled=false;light.renderPriority=20;
      light._nominalIntensity=d.intensity;
      this._hangarLights.push(light);
    }
    this._syncHangarTargets();
  }

  _syncHangarTargets() {
    const targets=this.base.group.getChildMeshes().filter(mesh=>mesh.getTotalVertices?.()>0&&(/^hangar/i.test(mesh.name)||/^vagHangar|^vagCarrierRunway$|^vagabondUnifiedRockShell/.test(mesh.name)||(()=>{for(let n=mesh.parent;n;n=n.parent)if(/^parkedAircraft_/.test(n.name))return true;return false;})()));
    // A parked aircraft also receives the same practical light. In open air these
    // three local lights are removed from its shader entirely.
    if(this.ship.group&&BABYLON.Vector3.Distance(this.ship.group.position,this.base.group.position)<38){
      for(const mesh of this.ship.group.getChildMeshes())if(mesh.isVisible&&mesh.getTotalVertices?.()>0)targets.push(mesh);
    }
    this._hangarTargets=targets;
    for(const mesh of targets){
      const materials=mesh.material?.subMaterials||[mesh.material];
      for(const material of materials){
        if(!material||typeof material.maxSimultaneousLights!=='number')continue;
        if(!this._materialLimits.has(material))this._materialLimits.set(material,material.maxSimultaneousLights);
        material.maxSimultaneousLights=3+this._hangarLights.length;
      }
    }
    for(const light of this._hangarLights)light.includedOnlyMeshes=[...targets];
    // Legacy decorative point lights must not consume the first four material
    // slots ahead of these real fixtures. Sun/rim/sky remain unchanged.
    for(const light of this.scene.lights){
      if(this._hangarLights.includes(light)||light.getTypeID()!==BABYLON.Light.LIGHTTYPEID_POINTLIGHT)continue;
      this._captureLight(light);
      const saved=this._lightStates.get(light).excludedMeshes;
      light.excludedMeshes=[...new Set([...saved,...targets])];
    }
  }

  _installRunway() {
    const existing=this.base.group.getChildMeshes().filter(m=>/^vagRwLamp_/.test(m.name));
    if(existing.length){
      for(const lamp of existing){
        const post=lamp.parent;if(!post)continue;
        const x=post.position.x,z=post.position.z;
        this.changedMeshes.push({mesh:lamp,material:lamp.material,isVisible:lamp.isVisible});lamp.isVisible=false;
        this.changedMeshes.push({mesh:post,material:post.material,position:post.position.clone(),scaling:post.scaling.clone()});
        // Replace the old raised sphere with a flat cap seated on a short inset post.
        post.scaling.y=.10/1.1;post.position.y=3.43;
        const fitting=this._fitting(`practicalRunwayEdge_${x}_${z}`,this.base.group,[x,3.48,z],[0,1,0],this.runway[Math.abs(Math.round((x-9)/7.2))%6],1.10);
        this.runwayFixtures.push(fitting);
      }
    }else{
      for(let i=0;i<7;i++)for(const z of[-9.5,9.5])this.runwayFixtures.push(this._fitting(`practicalRunwayEdge_${i}_${z}`,this.base.group,[8+i*7.5,3.40,z],[0,1,0],this.runway[i%6],1.10));
    }
    // A continuous threshold of small inset fittings reads as a runway even in daylight.
    for(const z of[-8.7,-5.8,-2.9,0,2.9,5.8,8.7]){
      this.runwayFixtures.push(this._fitting(`practicalRunwayThresholdGreen_${z}`,this.base.group,[5,3.40,z],[0,1,0],this.green,1.10));
      this.runwayFixtures.push(this._fitting(`practicalRunwayThresholdRed_${z}`,this.base.group,[54.4,3.56,z],[0,1,0],this.red,1.10));
    }
  }

  _installAircraft() {this._syncAircraft();}

  _syncAircraft() {
    const sockets=this.ship.aircraftLightSockets;
    const root=sockets?.root;
    if(!root&&!this._aircraftRoot)return;
    if(root===this._aircraftRoot&&!root?.isDisposed())return;
    for(const fitting of this.aircraftFixtures){fitting.lens.dispose();fitting.housing.dispose();}
    this.aircraftFixtures=[];this.meshes=this.meshes.filter(mesh=>!mesh.isDisposed());this._aircraftRoot=null;
    if(!root||root.isDisposed())return;
    this._aircraftRoot=root;
    for(const [name,material,scale] of [['port',this.red,.72],['starboard',this.green,.72],['tail',this.white,.62],['beacon',this.beacon,.60]]){
      const socket=sockets[name];if(!socket)continue;
      this.aircraftFixtures.push(this._fitting(`practicalAircraft_${name}`,root,socket.surface,socket.normal,material,scale));
    }
    this._syncHangarTargets();
  }

  _installLandmark() {
    const root=this.world.landmarks?.root;if(!root||this.landmarkDone)return;
    this.landmarkDone=true;
    for(const [i,p] of [[0,[-13,30,-7]],[1,[-47,28,-7]]])this._lens(`practicalShipyardRed_${i}`,root,p,this.ruinRed,1.15,'z');
    for(const [i,p] of [[0,[-35,5,6]],[1,[17,-.7,-4.8]]]){
      // A small real bulb under its metal cap; these distant fittings add no point lights.
      this._lens(`practicalShipyardHangingBulb_${i}`,root,p,this.ruinWarm,1.4);
      const cap=BABYLON.MeshBuilder.CreateCylinder(`practicalShipyardLampCap_${i}`,{diameterTop:.55,diameterBottom:.9,height:.22,tessellation:8},this.scene);
      cap.parent=root;cap.position.set(p[0],p[1]+.18,p[2]);cap.material=this.housing;cap.isPickable=false;this.meshes.push(cap);
    }
  }

  _syncConstruction() {
    const construction=this.world.islandConstruction;
    if(!construction)return;
    for(const building of construction.buildings||[]){
      if(this.pilotLamps.has(building)||!building.node||building.node.isDisposed())continue;
      if(building.type==='generator'){
        const lens=this._lens(`practicalGeneratorPilot_${building.socket}`,building.node,[0,2.45,-3.54],this.generatorGreen,.78,'z');
        this.pilotLamps.set(building,lens);
      }else if(building.type==='radar'){
        const lens=this._lens(`practicalRadarPilot_${building.socket}`,building.node,[0,2.4,-3.53],this.radarAmber,.8,'z');
        this.pilotLamps.set(building,lens);
      }
    }
  }

  update(dt) {
    if(this.disposed)return;this.time+=Math.max(0,Math.min(dt,.1));
    this._syncAircraft();
    this._lightingRefreshTimer-=dt;if(this._lightingRefreshTimer<=0){this._lightingRefreshTimer=.5;this._syncHangarTargets();}
    const voltage=this.scene.metadata?.hangarVoltage ?? 1;
    if(voltage!==this.lastVoltage){
      const level=i=>Math.max(0,Math.min(1,(voltage-.12-i*.27)*4));
      this.hangarBanks.forEach((mat,i)=>this._intensity(mat,.03+1.57*level(i)));
      for(const light of this._hangarLights){
        const bank=light.position.x < -18 ? 2 : light.position.x < -3 ? 1 : 0;
        light.intensity=light._nominalIntensity*(.035+.965*level(bank));
      }
      this.lastVoltage=voltage;
    }
    // Slow subdued chasing approach lamps; no abrupt runway strobe.
    for(let i=0;i<6;i++){
      const wave=.5+.5*Math.cos(this.time*1.7-i*.72);
      this._intensity(this.runway[i],1.10+Math.pow(wave,5)*1.10);
    }
    // White tail stays readable; upper identification beacon has a low-duty 4.8-second flash.
    const phase=this.time%4.8;
    const flash=phase<.16?Math.sin(phase/.16*Math.PI):0;
    this._intensity(this.white,.90);
    this._intensity(this.beacon,.05+flash*.88);
    this._intensity(this.radarAmber,.42+(.5+.5*Math.sin(this.time*.9))*.20);
    this._intensity(this.ruinRed,.27+(.5+.5*Math.sin(this.time*.65))*.10);
    this._installLandmark();this._syncConstruction();
  }

  get snapshot() {
    return {newPointLights:this.newLights.length,reusedPointLights:this.changedLights.length,
      lensInstances:this.meshes.filter(m=>m.sourceMesh).length,
      uniqueGeometryTriangles:this.meshes.filter(m=>!m.sourceMesh).reduce((sum,m)=>sum+(m.getTotalIndices?.()||0)/3,0),
      runwayMaterialGroups:6,runwayFixtures:this.runwayFixtures.length,aircraftFixtures:this.aircraftFixtures.length,aircraftVariant:this.ship.aircraftLightSockets?.variant,
      hangarTargetMeshes:this._hangarTargets.length,hangarPointLights:this._hangarLights.map(light=>light.name),hangarMaxSimultaneousLights:3+this._hangarLights.length,
      constructionPilotLamps:this.pilotLamps.size,landmarkInstalled:this.landmarkDone};
  }

  dispose() {
    if(this.disposed)return;this.disposed=true;
    for(const state of this.changedMeshes){if(state.mesh.isDisposed())continue;state.mesh.material=state.material;if(state.position)state.mesh.position.copyFrom(state.position);if(state.scaling)state.mesh.scaling.copyFrom(state.scaling);if(state.isVisible!==undefined)state.mesh.isVisible=state.isVisible;}
    for(const state of this.changedLights){
      const light=state.light;if(light.isDisposed())continue;
      light.diffuse=state.diffuse;light.specular=state.specular;light.intensity=state.intensity;light.range=state.range;
      if(state.position)light.position.copyFrom(state.position);light.parent=state.parent;light.renderPriority=state.renderPriority;light.shadowEnabled=state.shadowEnabled;
      light.falloffType=state.falloffType;light.intensityMode=state.intensityMode;light.includedOnlyMeshes=state.includedOnlyMeshes;light.excludedMeshes=state.excludedMeshes;
    }
    for(const [material,limit]of this._materialLimits)if(!material.isDisposed?.())material.maxSimultaneousLights=limit;
    this.meshes.forEach(m=>m.dispose());this.newLights.forEach(l=>l.dispose());this.materials.forEach(m=>m.dispose());
  }
}
