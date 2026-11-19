import { configureBuildingMaterial } from './buildingMaterials.js?v=mission1';
export const BUILDING_DEFINITIONS = Object.freeze({
  generator: { name: 'Эфирный генератор', file: 'ether_generator.glb', cost: 30, output: 4, demand: 0, width: 5.42, height: 4.84, depth: 7, detail: '+4 энергии · ремонт острова' },
  turret: { name: 'Зенитная установка', file: 'flak_turret.glb', cost: 35, output: 0, demand: 2, width: 7, height: 3.1, depth: 4.37, detail: '−2 энергии · защита острова' },
  radar: { name: 'Радар', file: 'radar_array.glb', cost: 25, output: 0, demand: 1, width: 5.84, height: 7.95, depth: 7, detail: '−1 энергии · обнаружение целей' },
});
const DEFINITIONS = BUILDING_DEFINITIONS;
const REQUIRED_TYPE = {build_generator:'generator', build_defense:'turret', build_radar:'radar'};
const DECK = {minX:-23, maxX:1, minZ:-10, maxZ:12, y:21.73};
const FOOTING = 7.7;
const GAP = .35;
const DEFAULT_POSITIONS = [{x:-18,z:-4},{x:-7,z:-4},{x:-18,z:7}];
const samePlace = (a,b) => Boolean(a&&b&&Math.hypot(a.x-b.x,a.z-b.z)<.6);

function fallbackFootingMaterial(scene) {
  const existing=scene.getMaterialByName('constructionFootingMaterial');if(existing)return existing;
  const mat=new BABYLON.StandardMaterial('constructionFootingMaterial',scene);
  mat.diffuseColor=BABYLON.Color3.FromHexString('#596a64');return mat;
}

/** A world-space builder: pointer placement, visible foundations, and one authoritative validator. */
export class IslandConstruction {
  constructor(scene, base, shadowGenerator = null) {
    this.scene=scene;this.base=base;this.shadowGenerator=shadowGenerator;
    this.salvage=80;this.buildings=[];this.isOpen=false;this.disposed=false;
    this.selectedType='generator';this.selectedSocket=0;
    this.selectedPosition={...DEFAULT_POSITIONS[0]};this.positionPinned=false;
    this.stage=null;this.sockets=[];this.savedCamera=null;
    this.canvas=scene.getEngine().getRenderingCanvas();
    this.previewMaterial=new BABYLON.StandardMaterial('constructionPreviewMat',scene);
    this.previewMaterial.diffuseColor=BABYLON.Color3.FromHexString('#74e5ad');
    this.previewMaterial.emissiveColor=BABYLON.Color3.FromHexString('#235c3f');
    this.previewMaterial.alpha=.40;this.previewMaterial.disableLighting=true;
    this.preview=BABYLON.MeshBuilder.CreateBox('constructionPreview',{size:1},scene);
    this.preview.material=this.previewMaterial;this.preview.parent=base.group;
    this.preview.isPickable=false;this.preview.checkCollisions=false;this.preview.setEnabled(false);
    this.previewOutline=BABYLON.MeshBuilder.CreateLines('constructionFootprint',{points:[
      new BABYLON.Vector3(-FOOTING/2,0,-FOOTING/2),new BABYLON.Vector3(FOOTING/2,0,-FOOTING/2),
      new BABYLON.Vector3(FOOTING/2,0,FOOTING/2),new BABYLON.Vector3(-FOOTING/2,0,FOOTING/2),new BABYLON.Vector3(-FOOTING/2,0,-FOOTING/2),
    ]},scene);
    this.previewOutline.parent=base.group;this.previewOutline.isPickable=false;this.previewOutline.setEnabled(false);
    this._createFoundations();this._createUI();this._bindInput();
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  get snapshot() {
    const powerProduced=this.buildings.reduce((n,b)=>n+DEFINITIONS[b.type].output,0);
    const powerUsed=this.buildings.reduce((n,b)=>n+DEFINITIONS[b.type].demand,0);
    const validation=this.validateBuild();
    return {salvage:this.salvage,powerProduced,powerUsed,powerAvailable:powerProduced-powerUsed,
      generators:this.buildings.filter(b=>b.type==='generator').length,
      turrets:this.buildings.filter(b=>b.type==='turret').length,
      radars:this.buildings.filter(b=>b.type==='radar').length,
      buildings:this.buildings.map(({type,socket,position})=>({type,socket,position:{...position}})),
      isOpen:this.isOpen,selectedType:this.selectedType,selectedPosition:{...this.selectedPosition},positionPinned:this.positionPinned,
      placementValid:validation.valid,placementReason:validation.reason};
  }

  _power() {
    return this.buildings.reduce((n,b)=>n+DEFINITIONS[b.type].output-DEFINITIONS[b.type].demand,0);
  }

  validatePlacement(type=this.selectedType, position=this.selectedPosition) {
    if(!DEFINITIONS[type])return {valid:false,code:'type',reason:'Выберите постройку.'};
    if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.z))return {valid:false,code:'position',reason:'Укажите место на палубе.'};
    const half=FOOTING/2, x=position.x,z=position.z;
    if(x-half<DECK.minX||x+half>DECK.maxX||z-half<DECK.minZ||z+half>DECK.maxZ)
      return {valid:false,code:'edge',reason:'Фундамент выходит за край строительной палубы.'};
    if(x+half>-20&&x-half<13&&z+half>-15.6&&z-half<-9.2)
      return {valid:false,code:'stairs',reason:'Здесь проходит лестница. Оставьте проход свободным.'};
    const liftDistance=Math.hypot(Math.max(Math.abs(x+8)-half,0),Math.max(Math.abs(z-6.5)-half,0));
    if(liftDistance<3)return {valid:false,code:'lift',reason:'Слишком близко к подъёмнику: нужен свободный проход.'};
    if(this.buildings.some(b=>Math.abs(b.position.x-x)<FOOTING+GAP&&Math.abs(b.position.z-z)<FOOTING+GAP))
      return {valid:false,code:'occupied',reason:'Фундаменты пересекаются. Выберите свободное место.'};
    return {valid:true,code:'ok',reason:'Место свободно. Enter или «Построить» — подтвердить.'};
  }

  validateBuild(type=this.selectedType, position=this.selectedPosition) {
    if(this.disposed)return {valid:false,code:'disposed',reason:'Строительство закрыто.'};
    const d=DEFINITIONS[type];if(!d)return {valid:false,code:'type',reason:'Выберите постройку.'};
    const required=REQUIRED_TYPE[this.stage];
    if(required&&required!==type)return {valid:false,code:'mission',reason:`Сейчас по заданию нужен: ${DEFINITIONS[required].name}.`};
    if(this.buildings.some(b=>b.type===type))return {valid:false,code:'duplicate',reason:'В первой миссии достаточно одной постройки каждого типа.'};
    const placement=this.validatePlacement(type,position);if(!placement.valid)return placement;
    if(this.salvage<d.cost)return {valid:false,code:'salvage',reason:`Не хватает ${d.cost-this.salvage} лома. Нужен лом с обломков.`};
    if(this._power()<d.demand)return {valid:false,code:'power',reason:`Не хватает ${d.demand-this._power()} энергии. Сначала постройте генератор.`};
    if(!this._leavesMissionSpace(position))return {valid:false,code:'capacity',reason:'Здесь не останется места для остальных построек. Сдвиньте фундамент или выберите готовое место 1–3.'};
    return placement;
  }

  _leavesMissionSpace(position) {
    const remaining=2-this.buildings.length;if(remaining<=0)return true;
    const occupied=[...this.buildings.map(b=>b.position),position];
    const fits=p=>this.validatePlacement(this.selectedType,p).valid&&!occupied.some(q=>Math.abs(q.x-p.x)<FOOTING+GAP&&Math.abs(q.z-p.z)<FOOTING+GAP);
    const candidates=DEFAULT_POSITIONS.filter(fits);
    for(let z=-5;z<=8;z+=1)for(let x=-19;x<=-3;x+=1){if(fits({x,z}))candidates.push({x,z});}
    if(remaining===1)return candidates.length>0;
    for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++){
      if(Math.abs(candidates[i].x-candidates[j].x)>=FOOTING+GAP||Math.abs(candidates[i].z-candidates[j].z)>=FOOTING+GAP)return true;
    }
    return false;
  }

  addSalvage(amount) {if(!Number.isFinite(amount)||amount<=0)return false;this.salvage+=Math.floor(amount);this._refresh();return true;}

  selectPosition(position, pinned=true) {
    if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.z))return false;
    this.selectedPosition={x:Math.round(position.x*2)/2,z:Math.round(position.z*2)/2};
    this.selectedSocket=DEFAULT_POSITIONS.findIndex(p=>samePlace(p,this.selectedPosition));
    this.positionPinned=pinned;this._refresh();return true;
  }

  selectSocket(index) {
    if(!this.sockets[index])return false;
    this.selectedSocket=index;return this.selectPosition(DEFAULT_POSITIONS[index],true);
  }

  selectType(type) {
    if(!DEFINITIONS[type])return false;
    this.selectedType=type;
    if(!this.validatePlacement(type,this.selectedPosition).valid)this._recommendPosition();
    this.positionPinned=false;this._refresh();return true;
  }

  _recommendPosition() {
    const found=DEFAULT_POSITIONS.find(p=>this.validatePlacement(this.selectedType,p).valid);
    if(found){this.selectedPosition={...found};this.selectedSocket=DEFAULT_POSITIONS.indexOf(found);return;}
    // A nonstandard first placement must not make all three shortcut slots mandatory.
    for(let z=-5;z<=8;z+=.5)for(let x=-19;x<=-3;x+=.5){
      if(this.validatePlacement(this.selectedType,{x,z}).valid){this.selectedPosition={x,z};this.selectedSocket=-1;return;}
    }
  }

  open() {
    if(this.disposed||this.isOpen)return;
    this.isOpen=true;this.panel.hidden=false;this.positionPinned=false;
    document.body.classList?.add('construction-open');
    this.selectedType=REQUIRED_TYPE[this.stage]||Object.keys(DEFINITIONS).find(t=>!this.buildings.some(b=>b.type===t))||this.selectedType;
    this._recommendPosition();this._saveCamera();this._frameCamera();this._refresh();
    this.sockets.forEach(s=>s.pad.setEnabled(true));
    this.canvas?.focus();
  }

  close() {
    if(!this.isOpen)return;
    this.isOpen=false;this.panel.hidden=true;this.pointerPending=null;
    document.body.classList?.remove('construction-open');
    this.preview.setEnabled(false);this.previewOutline.setEnabled(false);
    this.sockets.forEach(s=>s.pad.setEnabled(false));
    this._restoreCamera();this.canvas?.focus();
  }

  _saveCamera() {
    const c=this.scene.activeCamera;if(!c)return;
    this.savedCamera={camera:c,position:c.position.clone(),rotation:c.rotation.clone(),rotationQuaternion:c.rotationQuaternion?.clone(),up:c.upVector.clone(),fov:c.fov,mode:c.mode,
      orthoLeft:c.orthoLeft,orthoRight:c.orthoRight,orthoTop:c.orthoTop,orthoBottom:c.orthoBottom,
      viewport:{x:c.viewport.x,y:c.viewport.y,width:c.viewport.width,height:c.viewport.height}};
  }

  _frameCamera() {
    const c=this.savedCamera?.camera;if(!c)return;
    const B=BABYLON,engine=this.scene.getEngine(),rect=this.canvas?.getBoundingClientRect();
    const width=rect?.width||engine.getRenderWidth(),height=rect?.height||engine.getRenderHeight();
    const narrow=width<=760;
    c.viewport=new B.Viewport(0,narrow ? .42 : 0,narrow?1:Math.max(.4,(width-326)/width),narrow ? .58 : 1);
    c.mode=B.Camera.ORTHOGRAPHIC_CAMERA;
    const aspect=width*c.viewport.width/(height*c.viewport.height),halfHeight=18;
    c.orthoTop=halfHeight;c.orthoBottom=-halfHeight;c.orthoLeft=-halfHeight*aspect;c.orthoRight=halfHeight*aspect;
    this.base.group.computeWorldMatrix(true);
    const matrix=this.base.group.getWorldMatrix();
    c.position.copyFrom(B.Vector3.TransformCoordinates(new B.Vector3(-11,90,1),matrix));
    c.upVector.copyFrom(B.Vector3.TransformNormal(new B.Vector3(0,0,-1),matrix).normalize());
    c.setTarget(B.Vector3.TransformCoordinates(new B.Vector3(-11,DECK.y,1),matrix));
    c.getProjectionMatrix(true);this.scene.updateTransformMatrix(true);
  }

  _restoreCamera() {
    const saved=this.savedCamera;if(!saved)return;
    const c=saved.camera;
    if(!c.isDisposed()){
      c.position.copyFrom(saved.position);c.rotation.copyFrom(saved.rotation);
      c.rotationQuaternion=saved.rotationQuaternion?.clone()||null;c.upVector.copyFrom(saved.up);c.fov=saved.fov;c.mode=saved.mode;
      for(const key of ['orthoLeft','orthoRight','orthoTop','orthoBottom'])c[key]=saved[key];
      c.viewport=new BABYLON.Viewport(saved.viewport.x,saved.viewport.y,saved.viewport.width,saved.viewport.height);
      c.getProjectionMatrix(true);this.scene.updateTransformMatrix(true);
    }
    this.savedCamera=null;
  }

  update(dt,context={}) {
    if(this.disposed)return;
    const changed=context.stage!==this.stage;this.stage=context.stage;
    if(this.isOpen&&context.controlMode&&context.controlMode!=='foot')this.close();
    if(this.isOpen){
      if(changed){this.selectedType=REQUIRED_TYPE[this.stage]||this.selectedType;this._recommendPosition();this.positionPinned=false;this._refresh();}
      this._frameCamera();
      if(this.pointerPending&&!this.positionPinned){const p=this._pickPosition(this.pointerPending);if(p)this.selectPosition(p,false);}
      this.pointerPending=null;
    }
    const count=this.buildings.filter(b=>b.type==='generator').length;
    if(count&&Number.isFinite(this.base.integrity))this.base.integrity=Math.min(this.base.maxIntegrity||100,this.base.integrity+Math.max(0,Math.min(dt,.1))*count*1.5);
  }

  _pickPosition(event) {
    if(!this.savedCamera||!this.canvas)return null;
    const B=BABYLON,rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const camera=this.savedCamera.camera;
    const pick=this.scene.pick(x,y,mesh=>this.sockets.some(s=>s.pad===mesh),false,camera);
    if(pick?.hit)return {...DEFAULT_POSITIONS[pick.pickedMesh.metadata.constructionSocket]};
    this.base.group.computeWorldMatrix(true);
    const ray=this.scene.createPickingRay(x,y,B.Matrix.Identity(),camera);
    const local=B.Ray.Transform(ray,this.base.group.getWorldMatrix().clone().invert());
    const distance=local.intersectsPlane(new B.Plane(0,1,0,-DECK.y));
    if(distance===null||distance<0)return null;
    const point=local.origin.add(local.direction.scale(distance));return {x:point.x,z:point.z};
  }

  build(type=this.selectedType, positionOrSocket=undefined) {
    const position=typeof positionOrSocket==='number'?DEFAULT_POSITIONS[positionOrSocket]:(positionOrSocket||this.selectedPosition);
    const validation=this.validateBuild(type,position);
    if(!validation.valid){this._refresh(validation.reason);return false;}
    const definition=DEFINITIONS[type],location={x:position.x,z:position.z};
    const socketIndex=DEFAULT_POSITIONS.findIndex(p=>samePlace(p,location));
    this.salvage-=definition.cost;
    const placement=new BABYLON.TransformNode(`constructionPlacement_${this.buildings.length}`,this.scene);
    placement.parent=this.base.group;placement.position.set(location.x,DECK.y,location.z);
    const node=new BABYLON.TransformNode(`built_${type}_${this.buildings.length}`,this.scene);node.parent=placement;
    // The existing raised footing keeps imported bottom faces clear of the deck surface.
    const footing=BABYLON.MeshBuilder.CreateBox(`builtFooting_${this.buildings.length}`,{width:FOOTING,height:.32,depth:FOOTING},this.scene);
    footing.parent=placement;footing.position.y=.16;footing.material=this.scene.getMaterialByName('vagConcretePBR')||fallbackFootingMaterial(this.scene);
    footing.receiveShadows=true;footing.isPickable=false;node.position.y=.40;
    const building={type,socket:socketIndex,position:location,node,placement,footing,loaded:false};
    if(socketIndex>=0)this.sockets[socketIndex].building=building;
    this.buildings.push(building);
    const fallback=BABYLON.MeshBuilder.CreateBox(`builtFallback_${type}_${this.buildings.length}`,{width:definition.width,height:definition.height,depth:definition.depth},this.scene);
    fallback.parent=node;fallback.position.y=definition.height/2;fallback.checkCollisions=true;
    const mat=new BABYLON.StandardMaterial(`builtFallbackMat_${this.buildings.length}`,this.scene);mat.diffuseColor=BABYLON.Color3.FromHexString('#69787a');fallback.material=mat;fallback.receiveShadows=true;
    if(!(this.scene.getEngine() instanceof BABYLON.NullEngine))this._loadModel(building,fallback,mat);
    this.positionPinned=false;this._recommendPosition();
    this._refresh(`${definition.name} построен. ${definition.detail}.`);
    this.panel.dispatchEvent(new CustomEvent('island-build',{bubbles:true,detail:this.snapshot}));
    return true;
  }

  async _loadModel(building,fallback,fallbackMat) {
    try {
      const result=await BABYLON.SceneLoader.ImportMeshAsync('','./assets/buildings/',DEFINITIONS[building.type].file,this.scene);
      if(this.disposed||building.node.isDisposed()){result.meshes.forEach(m=>m.dispose());return;}
      const roots=result.meshes.filter(m=>!m.parent),container=new BABYLON.TransformNode(`builtAsset_${this.buildings.indexOf(building)}`,this.scene);
      for(const root of roots)root.parent=container;
      const bounds=container.getHierarchyBoundingVectors(true),size=bounds.max.subtract(bounds.min);
      const scale=Math.min(7/Math.max(size.x,size.z,.01),9/Math.max(size.y,.01));container.scaling.setAll(scale);
      container.position.set(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);container.parent=building.node;
      for(const mesh of result.meshes){configureBuildingMaterial(mesh.material,building.type,this.scene.getEngine());mesh.receiveShadows=true;mesh.checkCollisions=true;mesh.isPickable=false;this.shadowGenerator?.addShadowCaster(mesh,false);}
      fallback.dispose();fallbackMat.dispose();building.loaded=true;
    }catch(error){if(!this.disposed)console.warn('Construction model fallback:',building.type,error);}
  }

  _createFoundations() {
    this.padMaterial=new BABYLON.StandardMaterial('constructionPadMaterial',this.scene);this.padMaterial.diffuseColor=BABYLON.Color3.FromHexString('#5f8d70');this.padMaterial.emissiveColor=BABYLON.Color3.FromHexString('#183a23');this.padMaterial.alpha=.38;
    this.sockets=DEFAULT_POSITIONS.map((position,index)=>{
      const node=new BABYLON.TransformNode(`constructionSocket_${index}`,this.scene);node.parent=this.base.group;node.position.set(position.x,DECK.y,position.z);
      const pad=BABYLON.MeshBuilder.CreateBox(`constructionClickablePad_${index}`,{width:FOOTING,height:.06,depth:FOOTING},this.scene);pad.parent=node;pad.position.y=.07;
      pad.material=this.padMaterial;pad.metadata={constructionSocket:index};pad.isPickable=true;pad.checkCollisions=false;pad.setEnabled(false);
      if(!(this.scene.getEngine() instanceof BABYLON.NullEngine)){
        const texture=new BABYLON.DynamicTexture(`constructionPadNumber_${index}`,{width:128,height:128},this.scene,false);
        texture.hasAlpha=true;texture.drawText(String(index+1),null,97,'bold 86px sans-serif','#f3e9bc','transparent',true);
        const material=new BABYLON.StandardMaterial(`constructionPadNumberMaterial_${index}`,this.scene);
        material.diffuseTexture=texture;material.opacityTexture=texture;material.emissiveColor.set(.8,.8,.8);material.disableLighting=true;material.backFaceCulling=false;
        const label=BABYLON.MeshBuilder.CreateGround(`constructionPadLabel_${index}`,{width:2,height:2},this.scene);
        label.parent=pad;label.position.y=.08;label.material=material;label.isPickable=false;
      }

      return {node,pad,building:null};
    });
  }

  _bindInput() {
    this._keyHandler=event=>{
      if(!this.isOpen)return;
      event.stopImmediatePropagation();
      const uiActivation=this.panel.contains(event.target)&&['Tab','Enter','Space'].includes(event.code);
      if(!uiActivation)event.preventDefault();
      if(event.repeat)return;
      if(event.code==='Escape'||event.code==='KeyB')this.close();
      else if(event.code==='Enter'&&!uiActivation)this.build();
      else if(/^Digit[123]$/.test(event.code))this.selectSocket(Number(event.code.slice(-1))-1);
    };
    this._pointerMove=event=>{if(this.isOpen&&!this.positionPinned)this.pointerPending={clientX:event.clientX,clientY:event.clientY};};
    this._pointerDown=event=>{
      if(!this.isOpen)return;
      event.preventDefault();event.stopImmediatePropagation();if(event.button!==0)return;
      const point=this._pickPosition(event);if(!point)return;
      const snapped={x:Math.round(point.x*2)/2,z:Math.round(point.z*2)/2};
      if(this.positionPinned&&samePlace(this.selectedPosition,snapped)&&this.validateBuild(this.selectedType,snapped).valid)this.build(this.selectedType,snapped);
      else this.selectPosition(snapped,true);
    };
    window.addEventListener('keydown',this._keyHandler,true);
    this.canvas?.addEventListener('pointermove',this._pointerMove);
    this.canvas?.addEventListener('pointerdown',this._pointerDown,true);
  }

  _createUI() {
    this.style=document.createElement('style');this.style.textContent=`
      body.construction-open #hud,body.construction-open #scanner-overlay,body.construction-open #radio-dialogue-box{visibility:hidden!important}
      .island-builder-panel{position:fixed;right:12px;top:12px;bottom:12px;width:296px;overflow:auto;z-index:80;background:#1b261ef5;color:#eee4c5;border:1px solid #9d9d74;padding:16px;box-shadow:0 5px 30px #0008;font:13px/1.4 Arial,sans-serif;pointer-events:auto}
      .island-builder-panel button{font:inherit;min-height:38px;border:1px solid #6e8067;background:#303e2b;color:#f1e6c7;padding:8px;cursor:pointer;text-align:left;border-radius:2px}
      .island-builder-panel button:hover{background:#465239}.island-builder-panel button:focus-visible{outline:2px solid #f3d98e;outline-offset:2px}.island-builder-panel button:disabled{opacity:.4;cursor:default}
      .island-builder-panel [data-types]{display:grid;gap:7px;margin:10px 0}.island-builder-panel [data-sockets]{display:flex;gap:6px;margin:8px 0}.island-builder-panel small{font-size:11px;color:#c2c9ae}
      @media(max-width:760px){.island-builder-panel{left:12px;right:12px;top:auto;bottom:10px;width:auto;max-height:39vh;padding:10px;font-size:12px}.island-builder-panel [data-types]{grid-template-columns:repeat(3,1fr);gap:5px;margin:6px 0}.island-builder-panel [data-types] button{padding:6px;font-size:11px}.island-builder-panel [data-types] small{display:none}.island-builder-panel [data-message]{margin:5px 0!important;min-height:0!important}}
    `;document.body.append(this.style);
    const panel=document.createElement('section');panel.className='island-builder-panel pilot-panel';panel.hidden=true;panel.setAttribute('aria-label','Строительство острова');
    panel.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>ВЕРФЬ «БРОДЯГА»</strong><button data-close aria-label="Закрыть строительство">×</button></div><p data-resources style="color:#d6d6ad;margin:10px 0"></p><div data-types></div><div style="display:flex;gap:6px;align-items:center"><span style="font-size:11px">Готовые места:</span><div data-sockets></div></div><button data-reposition style="width:100%;font-size:12px">Выбрать другое место мышью</button><p data-position style="font:11px monospace;color:#bbc8a9;margin-top:8px"></p><p data-message role="status" style="min-height:54px;margin:10px 0;color:#e8cd91"></p><button data-confirm style="width:100%;font-weight:bold">Построить</button><p style="opacity:.65;font-size:11px;margin-top:10px">ЛКМ — место · повторный ЛКМ / Enter — построить<br>B / Esc — вернуться на палубу</p>';
    this.panel=panel;
    for(const type of Object.keys(DEFINITIONS)){
      const d=DEFINITIONS[type],button=document.createElement('button');button.dataset.type=type;button.innerHTML=`<strong>${d.name}</strong><br>${d.cost} лома<br><small>${d.detail}</small>`;
      button.onclick=()=>this.selectType(type);panel.querySelector('[data-types]').append(button);
    }
    this.sockets.forEach((socket,index)=>{const button=document.createElement('button');button.dataset.socket=index;button.onclick=()=>this.selectSocket(index);panel.querySelector('[data-sockets]').append(button);});
    this.closeButton=panel.querySelector('[data-close]');this.closeButton.onclick=()=>this.close();
    panel.querySelector('[data-confirm]').onclick=()=>this.build();
    panel.querySelector('[data-reposition]').onclick=()=>{this.positionPinned=false;this._refresh('Двигайте мышь над палубой и щёлкните по выбранному месту.');this.canvas?.focus();};
    for(const name of ['pointerdown','pointerup','mousedown','mouseup','click','dblclick','wheel','contextmenu'])panel.addEventListener(name,event=>{event.stopPropagation();if(name==='contextmenu')event.preventDefault();});
    document.body.append(panel);
  }

  _refresh(message='') {
    if(this.disposed)return;
    const validation=this.validateBuild(),d=DEFINITIONS[this.selectedType],required=REQUIRED_TYPE[this.stage];
    const produced=this.buildings.reduce((n,b)=>n+DEFINITIONS[b.type].output,0),used=produced-this._power();
    this.panel.querySelector('[data-resources]').textContent=`Лом ${this.salvage} · Энергия ${used}/${produced}`;
    this.panel.querySelectorAll('[data-type]').forEach(button=>{
      const type=button.dataset.type,built=this.buildings.some(b=>b.type===type),blocked=Boolean(required&&required!==type);
      button.disabled=built||blocked;button.title=built?'Уже построено':blocked?`По заданию сейчас нужен: ${DEFINITIONS[required].name}`:DEFINITIONS[type].detail;
      button.style.borderColor=type===this.selectedType?'#efd997':'#6e8067';button.setAttribute('aria-pressed',String(type===this.selectedType));
    });
    this.panel.querySelectorAll('[data-socket]').forEach(button=>{
      const index=Number(button.dataset.socket),valid=this.validatePlacement(this.selectedType,DEFAULT_POSITIONS[index]).valid;
      button.textContent=`${index+1}${valid?'':' ×'}`;button.title=valid?'Свободное место':this.validatePlacement(this.selectedType,DEFAULT_POSITIONS[index]).reason;
      button.style.borderColor=index===this.selectedSocket?'#efd997':'#6e8067';button.setAttribute('aria-pressed',String(index===this.selectedSocket));
    });
    this.panel.querySelector('[data-position]').textContent=`Место X ${this.selectedPosition.x.toFixed(1)} / Z ${this.selectedPosition.z.toFixed(1)} · ${this.positionPinned?'выбрано':'наведение'}`;
    this.panel.querySelector('[data-message]').textContent=message||validation.reason;
    const confirm=this.panel.querySelector('[data-confirm]');confirm.disabled=!validation.valid;confirm.textContent=`Построить · ${d.cost} лома`;
    this.preview.setEnabled(this.isOpen);this.previewOutline.setEnabled(this.isOpen);
    this.preview.position.set(this.selectedPosition.x,DECK.y+.40+d.height/2,this.selectedPosition.z);this.preview.scaling.set(d.width,d.height,d.depth);
    this.previewOutline.position.set(this.selectedPosition.x,DECK.y+.13,this.selectedPosition.z);
    this.previewMaterial.emissiveColor=BABYLON.Color3.FromHexString(validation.valid?'#235c3f':'#8b2820');
    this.previewMaterial.diffuseColor=BABYLON.Color3.FromHexString(validation.valid?'#74e5ad':'#ee6953');
    this.previewOutline.color=BABYLON.Color3.FromHexString(validation.valid?'#b6ffb8':'#ff8c68');
    this.sockets.forEach((socket,index)=>{socket.pad.visibility=this.validatePlacement(this.selectedType,DEFAULT_POSITIONS[index]).valid ? .7 : .2;});
  }

  dispose() {
    if(this.disposed)return;
    this.close();this.disposed=true;
    window.removeEventListener('keydown',this._keyHandler,true);
    this.canvas?.removeEventListener('pointermove',this._pointerMove);
    this.canvas?.removeEventListener('pointerdown',this._pointerDown,true);
    this.panel.remove();this.style.remove();this.preview.dispose();this.previewOutline.dispose();this.previewMaterial.dispose();this.padMaterial.dispose();
    this.sockets.forEach(socket=>socket.node.dispose());
  }
}
