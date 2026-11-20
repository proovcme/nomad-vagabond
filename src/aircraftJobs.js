import {aircraftHeading,configureImportedAircraftMaterial} from './explorerAircraft.js?v=mission1';
import {configureBuildingMaterial} from './buildingMaterials.js?v=mission1';

const JOBS=Object.freeze({
  cargo:{title:'Грузовой: лесной конвой',stage:'collect',detail:'Снизьтесь к ближайшему ящику (скорость < 18 м/с, высота до 22 м) и удерживайте F — лебёдка.',total:3},
  fighter:{title:'Истребитель: перехват',stage:'intercept',detail:'Перехватите два разведчика над лесным островом. Пулемёт — ЛКМ / Space.',total:2},
  attacker:{title:'Штурмовик: подавление батареи',stage:'strike',detail:'Уничтожьте две зенитные позиции на промышленном острове. Ракетный залп — F.',total:2},
  bomber:{title:'Бомбардировщик: топливные склады',stage:'bomb',detail:'Поразите два топливных склада бомбами. Пройдите над целью и сбросьте бомбу клавишей F.',total:2},
});
function distanceToSegment(point,a,b){
  if(!a)return BABYLON.Vector3.Distance(point,b);
  const ab=b.subtract(a),length=ab.lengthSquared();if(length<1e-8)return BABYLON.Vector3.Distance(point,b);
  const t=Math.max(0,Math.min(1,BABYLON.Vector3.Dot(point.subtract(a),ab)/length));return BABYLON.Vector3.Distance(point,a.add(ab.scale(t)));
}

/** Optional finite contracts; no tutorial stages or global economy are mutated here.
 * Root integration: start when boarding a selected aircraft, update after controller
 * projectiles; forward controller world impacts through onProjectileImpact(event).
 */
export class AircraftJobs {
  constructor(scene,world,base,{onReward=()=>{},onToast=()=>{},onExplosion=()=>{}}={}){
    this.scene=scene;this.world=world;this.base=base;this.onReward=onReward;this.onToast=onToast;this.onExplosion=onExplosion;
    this.entities=[];this.hostileBolts=[];this.epoch=0;this.sequence=0;this.job=null;this.disposed=false;this.loadErrors=[];
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }
  start(variant){
    if(this.disposed||!JOBS[variant])return false;
    if(this.job?.variant===variant&&!['complete','failed'].includes(this.job.stage))return this.snapshot;
    this._clear();this.epoch++;this.loadErrors=[];
    this.job={id:++this.sequence,variant,stage:JOBS[variant].stage,done:0,total:JOBS[variant].total,paid:false,time:0,loading:0};
    const forest=this.world.forestIsland,industrial=this.world.industrialIsland;
    if((variant==='cargo'||variant==='fighter')&&!forest||(variant==='attacker'||variant==='bomber')&&!industrial){this.job.stage='failed';this.onToast('Для задания нужен остров назначения.');return this.snapshot;}
    const loads=[];
    if(variant==='cargo')for(const [i,p]of[[-28,17],[-22,22],[-16,17]].entries()){
      const e=this._ground('supply',forest,p[0],p[1],1.9,0,i);e.pickupProgress=0;e.radius=3;
      loads.push(this._load(e,'./assets/benchmark/models/old_military_crate/','old_military_crate_1k.gltf',1.8));
    }
    if(variant==='fighter')for(let i=0;i<2;i++){
      const root=new BABYLON.TransformNode(`contractScout_${this.job.id}_${i}`,this.scene),e={id:i,kind:'scout',root,alive:true,hp:84,maxHp:84,radius:6.5,phase:i*Math.PI,speed:28,fireCooldown:2+i,propellers:[]};
      this.entities.push(e);this._moveScout(e,0);loads.push(this._load(e,'./assets/aircraft/','scrapyard_fighter.glb',12));
    }
    if(variant==='attacker')for(const [i,p]of[[28,-18],[-31,19]].entries()){
      const e=this._ground('flak',industrial,p[0],p[1],4.8,140,i);e.radius=4.7;e.fireCooldown=2+i;
      loads.push(this._load(e,'./assets/buildings/','flak_turret.glb',7));
    }
    if(variant==='bomber')for(const [i,p]of[[-31,-22],[20,-29]].entries()){
      const e=this._ground('depot',industrial,p[0],p[1],2.4,1,i);e.radius=7;
      for(const [j,off]of[[-1.8,0], [0,0], [1.8,0]].entries())loads.push(this._load(e,'./assets/benchmark/models/Barrel_01/','Barrel_01_1k.gltf',2.5,{offset:[off[0],0,off[1]],part:`fuel${j}`}));
      loads.push(this._load(e,'./assets/benchmark/models/old_military_crate/','old_military_crate_1k.gltf',2.4,{offset:[0,0,2.1],part:'storage'}));
    }
    const generation=this.epoch;this.readyPromise=Promise.all(loads).then(()=>{if(this.disposed||generation!==this.epoch)return;if(this.loadErrors.length){this.job.stage='failed';this.onToast('Не удалось загрузить цель задания. Выберите самолёт повторно.');}});
    this.onToast(`${JOBS[variant].title}. ${JOBS[variant].detail}`);return this.snapshot;
  }
  _ground(kind,island,x,z,height,hp,id){
    const root=new BABYLON.TransformNode(`contract_${kind}_${this.job.id}_${id}`,this.scene);root.parent=island.group;
    const groundY=island.getTopHeightLocal?.(x,z) ?? island.generated?.getHeight?.(x,z) ?? island.topY ?? 0;
    root.position.set(x,groundY+.12,z);
    const e={id,kind,island,root,height,hp,maxHp:hp,alive:true,loaded:false};this.entities.push(e);return e;
  }
  async _load(entity,directory,file,size,{offset=[0,0,0],part='model'}={}){
    if(this.scene.getEngine() instanceof BABYLON.NullEngine){entity.loaded=true;return;}
    const generation=this.epoch;
    try{
      const res=await BABYLON.SceneLoader.ImportMeshAsync('',directory,file,this.scene);
      if(this.disposed||generation!==this.epoch||entity.root.isDisposed()){res.meshes.filter(m=>!m.parent).forEach(m=>m.dispose(false,true));return;}
      const model=new BABYLON.TransformNode(`${entity.root.name}_${part}`,this.scene);
      res.meshes.filter(m=>!m.parent).forEach(m=>m.parent=model);
      const bounds=model.getHierarchyBoundingVectors(true),dim=bounds.max.subtract(bounds.min),scale=size/Math.max(dim.x,dim.y,dim.z,.01);
      model.scaling.setAll(scale);model.position.set(-(bounds.min.x+bounds.max.x)*scale/2+offset[0],-bounds.min.y*scale+offset[1],-(bounds.min.z+bounds.max.z)*scale/2+offset[2]);model.parent=entity.root;
      for(const mesh of res.meshes){mesh.checkCollisions=false;mesh.isPickable=false;mesh.receiveShadows=true;mesh.metadata={...mesh.metadata,contractTarget:true};
        if(entity.kind==='scout'){configureImportedAircraftMaterial(mesh.material,this.scene.getEngine());if(/propeller/i.test(mesh.name))entity.propellers.push(mesh);}
        if(entity.kind==='flak')configureBuildingMaterial(mesh.material,'turret',this.scene.getEngine());
      }
      if(entity.kind==='supply'){entity.crateVisual=model;entity.crateRestY=model.position.y;}
      entity.loaded=true;
    }catch(error){if(!this.disposed&&generation===this.epoch)this.loadErrors.push({file,error:String(error.message||error)});}
  }
  get target(){
    if(!this.job||this.job.stage==='failed')return null;
    if(this.job.stage==='complete')return {name:'Домой: ВПП и выбор следующего борта',position:this.base.group.getAbsolutePosition().add(this.base.padLocalPos||BABYLON.Vector3.Zero())};
    if(this.job.stage==='deliver')return {name:'Разгрузка: домашний ангар',position:this.base.group.getAbsolutePosition().add(this.base.padLocalPos||BABYLON.Vector3.Zero())};
    const e=this.entities.find(e=>e.alive&&!e.collected);if(!e)return null;
    const p=e.root.getAbsolutePosition().clone();if(e.kind==='scout')return {name:`Разведчик ${e.id+1} · ${e.hp}/${e.maxHp}`,position:p,velocity:e.velocity||BABYLON.Vector3.Zero()};
    p.y+=e.kind==='depot'?1.5:e.kind==='flak'?2:1;
    return {name:e.kind==='supply'?`Груз ${e.id+1}: лебёдка F`:e.kind==='flak'?`Зенитная позиция ${e.id+1}`:`Топливный склад ${e.id+1}`,position:p};
  }
  get snapshot(){
    if(!this.job)return {active:false,stage:'idle',title:'Контракт не выбран',detail:'Выберите самолёт в ангаре.'};
    const j=this.job,definition=JOBS[j.variant];
    return {active:!['complete','failed'].includes(j.stage),id:j.id,variant:j.variant,stage:j.stage,title:definition.title,detail:j.stage==='complete'?'Задание выполнено: +30 лома. Вернитесь на ВПП и выберите следующий борт.':j.stage==='failed'?'Задание прервано. Выберите самолёт повторно.':j.stage==='deliver'?'Все три ящика на борту. Выполните посадку на своём острове для разгрузки.':`${definition.detail} ${j.done}/${j.total}.`,completed:j.done,total:j.total,reward:j.paid?30:0,winchProgress:Math.round((j.loading||0)/2.5*100),targets:this.entities.filter(e=>e.alive&&!e.collected).length,loadErrors:this.loadErrors.slice()};
  }
  update(dt,{ship,controlMode,onFoot=false,landed=false}={}){
    if(this.disposed)return;
    const safeDt=Math.max(0,Math.min(dt,.1));
    this._updateCrashingScouts(safeDt);
    if(!this.job||['complete','failed'].includes(this.job.stage)||!ship)return;
    dt=safeDt;this.ship=ship;this.controlMode=controlMode;this.job.time+=dt;
    if(ship.hull<=0){this.job.stage='failed';this._removeCable();this.onToast('Борт потерян: контракт можно начать заново.');return;}
    const correctVariant=ship.variant===this.job.variant;
    if(this.job.variant==='cargo'){
      if(!correctVariant){this._removeCable();return;}
      if(this.job.stage==='deliver'){
        if(ship.dockedAsteroid===this.base&&(landed||onFoot||controlMode==='aircraft')&&BABYLON.Vector3.Distance(ship.group.position,this.base.group.getAbsolutePosition())<95)this._complete();
        return;
      }
      // Pick the NEAREST uncollected crate so the player can collect in any order
      let nearest = null, bestDist = Infinity;
      for (const cand of this.entities) {
        if (!cand.alive || cand.collected || !cand.loaded) continue;
        const d = BABYLON.Vector3.Distance(ship.group.position, cand.root.getAbsolutePosition());
        if (d < bestDist) { bestDist = d; nearest = cand; }
      }
      const e = nearest;
      if(!e)return;
      const speed=ship.velocity.subtract(e?.island?.velocity||BABYLON.Vector3.Zero()).length();
      const ground=e.root.getAbsolutePosition(),delta=ship.group.position.subtract(ground),horizontal=Math.hypot(delta.x,delta.z);
      const winching=controlMode==='aircraft'&&Boolean(ship.keys?.KeyF)&&speed<18&&horizontal<14&&delta.y>=0.5&&delta.y<=22;
      if(!winching){
        this.job.loading=Math.max(0,(this.job.loading||0)-dt*0.65);
        if(e.crateVisual)e.crateVisual.position.y=e.crateRestY+Math.max(0,delta.y-1.5)*Math.min(1,this.job.loading/2.0);
        if(this.job.loading<=0.01)this._removeCable();
        return;
      }
      this.job.loading+=dt;
      ship.audio?.playWinchTick?.(Math.min(1,this.job.loading/2.0));
      const lift=Math.max(0,delta.y-1.5)*Math.min(1,this.job.loading/2.0);
      if(e.crateVisual)e.crateVisual.position.y=e.crateRestY+lift;
      this._drawCable(ground.add(new BABYLON.Vector3(0,lift+.8,0)),ship.group.position.add(new BABYLON.Vector3(0,-1.4,0)));
      if(this.job.loading>=2.0){
        if(e.crateVisual)e.crateVisual.position.y=e.crateRestY;
        e.collected=true;this.job.done++;this.job.loading=0;
        e.root.parent=ship.group;e.root.position.set((this.job.done-2)*1.9,-1.5,1.5);
        this._removeCable();ship.audio?.playDock?.(true);
        this.onToast(`Груз закреплён: ${this.job.done}/3`);
        if(this.job.done===3)this.job.stage='deliver';
      }
      return;
    }
    for(const e of this.entities){if(!e.alive)continue;if(e.kind==='scout')this._moveScout(e,dt);
      if(correctVariant&&controlMode==='aircraft'&&e.loaded&&e.kind!=='depot'){
        this._consumeHits(e,ship);
        if(e.alive){e.fireCooldown-=dt;if(e.fireCooldown<=0){e.fireCooldown=e.kind==='flak'?2.6:1.8;this._fireHostile(e,ship);}}
      }
    }
    this._updateHostileBolts(dt,ship);
    if(this.job.done>=this.job.total)this._complete();
  }
  _moveScout(e,dt){
    e.phase+=dt*.25;const center=this.world.forestIsland.group.getAbsolutePosition();
    const desired=center.add(new BABYLON.Vector3(Math.cos(e.phase)*110,54+Math.sin(e.phase*2)*11,Math.sin(e.phase)*90));
    if(!e.initialized){e.root.position.copyFrom(desired);e.initialized=true;e.velocity=BABYLON.Vector3.Zero();return;}
    const delta=desired.subtract(e.root.position),length=delta.length();if(length>.01){const direction=delta.scale(1/length);e.velocity=direction.scale(e.speed);e.root.position.addInPlace(direction.scale(Math.min(length,e.speed*dt)));e.root.rotationQuaternion=aircraftHeading(direction);}
    for(const prop of e.propellers){if(prop.rotationQuaternion)prop.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z,dt*25));else prop.rotation.z+=dt*25;}
  }
  _consumeHits(entity,ship){
    const center=entity.root.getAbsolutePosition().add(new BABYLON.Vector3(0,entity.kind==='flak'?2:0,0));
    for(let i=ship.projectiles.length-1;i>=0;i--){const p=ship.projectiles[i];if(p.kind==='bomb'||!p.mesh||p.mesh.isDisposed())continue;
      if(distanceToSegment(center,p.previousPosition,p.mesh.position)>entity.radius)continue;
      entity.hp-=p.kind==='rocket'?95:entity.kind==='flak'?14:28;
      ship.audio?.playHitmarker?.();
      this.onExplosion?.(p.mesh.position.clone(), 0.45);
      this._disposeProjectile(ship,i);
      if(entity.hp<=0){this._destroy(entity);break;}
    }
  }
  onProjectileImpact(event){
    if(!this.job||this.job.stage!=='bomb'||(this.ship&&this.ship.variant!=='bomber')||event?.kind!=='bomb')return false;
    const point=event.position||event.to;if(!point)return false;let hit=false;
    for(const e of this.entities){if(!e.alive||!e.loaded)continue;const center=e.root.getAbsolutePosition().add(new BABYLON.Vector3(0,1.5,0));
      if(BABYLON.Vector3.Distance(center,point)<=e.radius+3){this._destroy(e);hit=true;}}
    if(this.job.done>=this.job.total)this._complete();return hit;
  }
  _destroy(e){
    if(!e.alive)return;
    this.ship?.audio?.playExplosion?.(e.kind==='depot'?1.0:0.8);
    this.onExplosion?.(e.root.getAbsolutePosition().add(new BABYLON.Vector3(0,e.kind==='scout'?0:2,0)),e.kind==='depot'?2.2:1.5);
    e.alive=false;this.job.done++;
    if(e.kind==='scout'){
      // Keep shot-down scout visible and send it into a burning spiral crash dive instead of vanishing!
      this.crashingScouts ||= [];
      this.crashingScouts.push({
        entity: e,
        vel: (e.velocity ? e.velocity.scale(0.9) : new BABYLON.Vector3(14, -4, 10)).add(new BABYLON.Vector3(0, -3, 0)),
        spin: new BABYLON.Vector3(-0.9 - Math.random() * 0.5, (Math.random() - 0.5) * 0.8, (Math.random() < 0.5 ? -1 : 1) * 3.0),
        life: 4.2,
        blastCd: 0.55,
      });
    } else {
      e.root.setEnabled(false);
    }
    this.onToast(`${e.kind==='scout'?'Разведчик сбит':e.kind==='flak'?'Батарея подавлена':'Топливный склад уничтожен'}: ${this.job.done}/${this.job.total}`);
  }
  _updateCrashingScouts(dt){
    if(!this.crashingScouts?.length)return;
    for(let i=this.crashingScouts.length-1;i>=0;i--){
      const c=this.crashingScouts[i], r=c.entity.root;
      if(!r||r.isDisposed?.()){this.crashingScouts.splice(i,1);continue;}
      c.life-=dt; c.blastCd-=dt;
      c.vel.y-=12.5*dt;
      r.position.addInPlace(c.vel.scale(dt));
      if(!r.rotationQuaternion)r.rotationQuaternion=BABYLON.Quaternion.FromEulerAngles(r.rotation.x,r.rotation.y,r.rotation.z);
      r.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.FromEulerAngles(c.spin.x*dt,c.spin.y*dt,c.spin.z*dt)).normalize();
      if(c.blastCd<=0){c.blastCd=0.55;this.onExplosion?.(r.position.clone(),0.75);}
      if(c.life<=0||r.position.y<-95){
        this.onExplosion?.(r.position.clone(),1.8);
        r.setEnabled(false);
        this.crashingScouts.splice(i,1);
      }
    }
  }
  _complete(){if(this.job.paid)return;this.job.stage='complete';this.job.paid=true;this._removeCable();const crashing=new Set((this.crashingScouts||[]).map(c=>c.entity));this.entities.forEach(e=>{if(crashing.has(e))return;e.root.parent=null;e.root.setEnabled(false);});this.hostileBolts.forEach(b=>b.mesh.dispose());this.hostileBolts=[];this.ship?.audio?.playUpgrade?.();this.onReward(30,{variant:this.job.variant,jobId:this.job.id});this.onToast(`${JOBS[this.job.variant].title}: выполнено. +30 лома`);}
  _disposeProjectile(ship,i){const p=ship.projectiles[i];p.trail?.dispose();p.mesh.dispose(false,false);ship.projectiles.splice(i,1);}
  _fireHostile(e,ship){
    const from=e.root.getAbsolutePosition().add(new BABYLON.Vector3(0,e.kind==='flak'?3:1,0)),delta=ship.group.position.subtract(from),distance=delta.length();if(distance<12||distance>190||this.hostileBolts.length>=12)return;
    if(e.kind==='flak')e.root.rotation.y=Math.atan2(-delta.z,delta.x);
    const direction=delta.scale(1/distance),mesh=BABYLON.MeshBuilder.CreateLines('contractEnemyTracer',{points:[from,from.add(direction.scale(3))],updatable:true},this.scene);mesh.color=BABYLON.Color3.FromHexString('#dc9d64');mesh.isPickable=false;mesh.checkCollisions=false;
    this.hostileBolts.push({mesh,position:from.clone(),velocity:direction.scale(105),life:2.2});
  }
  _updateHostileBolts(dt,ship){
    for(let i=this.hostileBolts.length-1;i>=0;i--){const b=this.hostileBolts[i],old=b.position.clone();b.position.addInPlace(b.velocity.scale(dt));b.life-=dt;
      const hit=distanceToSegment(ship.group.position,old,b.position)<2.8;
      if(hit){ship.hull=Math.max(0,ship.hull-6);ship.recoilShake=Math.max(ship.recoilShake||0,0.22);ship.audio?.playImpact?.();b.life=0;}
      if(b.life<=0){b.mesh.dispose();this.hostileBolts.splice(i,1);}else BABYLON.MeshBuilder.CreateLines(b.mesh.name,{points:[b.position,b.position.subtract(b.velocity.scale(.025))],instance:b.mesh},this.scene);
    }
  }
  _drawCable(from,to){if(this.cable)BABYLON.MeshBuilder.CreateLines('contractWinchCable',{points:[from,to],instance:this.cable},this.scene);else{this.cable=BABYLON.MeshBuilder.CreateLines('contractWinchCable',{points:[from,to],updatable:true},this.scene);this.cable.color=BABYLON.Color3.FromHexString('#c9bd98');this.cable.isPickable=false;}}
  _removeCable(){this.cable?.dispose();this.cable=null;}
  cancel(){if(this.disposed)return;this.epoch++;this._clear();this.job=null;}
  _clear(){this._removeCable();this.entities.forEach(e=>e.root.dispose(false,true));this.entities=[];this.hostileBolts.forEach(b=>b.mesh.dispose());this.hostileBolts=[];}
  dispose(){if(this.disposed)return;this.disposed=true;this.epoch++;this._clear();}
}
