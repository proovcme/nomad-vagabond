import { buildPursuitDestroyer } from '../props/pursuitDestroyer.js';
import production from '../content/passage.js';
const effects=Object.fromEntries(production.effects.map(effect=>[effect.id,effect.scale]));

export class FogPassage {
  constructor(scene,world,base,smokeTexture) {
    const B=BABYLON, origin=base.group.position;
    this.fixes=production.route.map(({position,name,hint,cue})=>({position:origin.add(B.Vector3.FromArray(position)),name,hint,cue}));
    this.start=origin.add(new B.Vector3(3590,108,-165));
    this.index=0;
    base.missionBatteryControlled=true;
    this.restY=origin.y;
    this.liftTime=0;
    scene.fogMode=B.Scene.FOGMODE_EXP2;
    scene.fogColor=B.Color3.FromHexString('#b9c3c5');
    scene.fogDensity=.00235;
    const banksInFog=[];
    const shelf=(name,x,y,z,sx,sy,sz,yaw,industrial=false)=>{
      const source=(industrial?world.industrialIsland:world.forestIsland).generated;
      const root=new B.TransformNode('fogIsle_'+name,scene);
      root.position.copyFrom(origin).addInPlaceFromFloats(x,y,z);
      root.rotation.y=yaw;root.scaling.set(sx,sy,sz);
      for(const part of [source.terrain,source.rock]) {
        const surface=part.clone(name+'_'+part.name,root,true);
        surface.checkCollisions=true;surface.receiveShadows=true;
      }
      banksInFog.push(root);
      return root;
    };
    const banks=[
      [3340,46,-65,1.24,.92,1.3],[3110,25,-445,1.65,.82,1.1],
      [2760,116,-255,.72,1.86,.80],[2785,105,-525,.65,1.63,.65],
      [2410,58,-420,1.4,1.21,.90],[2250,46,-803,1.5,.93,1.48],
      [1920,76,-820,1.25,1.2,1.03],[1630,42,-437,1.46,.87,1.15],
      [1480,60,-761,1.43,1.14,1.1],[1070,88,-265,.91,1.60,.85],
      [1130,91,-526,1.07,1.65,.84],[770,24,-373,1.5,.98,1.18],
      [570,38,5,1.20,1.03,.83],[390,8,-178,1.58,.87,1.25],
    ];
    banks.forEach(([x,y,z,sx,sy,sz],i)=>{
      const industrial=i%3===0;
      const root=shelf(i,x,y,z,sx,sy,sz,i*.81,industrial);
      if(i===6) {
        const tower=scene.getMeshByName('euDoverStone');
        // The watch island is identifiable from its masonry skyline through the mist.
        if(tower){const silhouette=tower.clone('fogWatchStation',root,true);silhouette.scaling.setAll(1.28);}
      }
    });
    shelf('cradle',-39,-11,6,2.12,.62,1.38,.04);
    // At this fog density less than 0.04% of the surface colour reaches the
    // camera beyond 1.2 km. Keep distant scenery out of both render passes.
    const regions=[...banksInFog,...world.islands.map(i=>i.group),world.landmarks?.root].filter(Boolean);
    scene.onBeforeActiveMeshesEvaluationObservable.add(()=>{
      const camera=scene.activeCamera;
      if(!camera)return;
      for(const root of regions){
        const distance=B.Vector3.DistanceSquared(camera.globalPosition,root.getAbsolutePosition());
        if(distance>1500**2 && root.isEnabled())root.setEnabled(false);
        else if(distance<1420**2 && !root.isEnabled())root.setEnabled(true);
      }
    });
    // Preserve gameplay transforms on the home ship. Only suppress rendering
    // of opaque fittings and the enclosed parked airframes at distance.
    const limitRange=(mesh,meters)=>{
      if(mesh.addLODLevel && !mesh.hasLODLevels && mesh.getTotalVertices()>0)
        mesh.addLODLevel(meters,null);
    };
    for(const mesh of base.group.getChildMeshes())limitRange(mesh,1250);
    world.fleet?.readyPromise.then(()=>{
      for(const bay of world.fleet.records)
        for(const mesh of bay.root?.getChildMeshes() || [])limitRange(mesh,180);
    });
    this.escort=buildPursuitDestroyer(scene);
    this.escort.position.copyFrom(this.start).addInPlaceFromFloats(180,5,66);
    this.exhaust=[];
    if(smokeTexture) for(const [x,y,rate] of [[-7.7,16.55,6],[6,13.9,4]]){
      const uptake=new B.TransformNode('escortStackOutlet'+x,scene);
      uptake.parent=this.escort;uptake.position.set(x,y,0);
      const plume=new B.ParticleSystem('escortFunnelExhaust'+x,Math.ceil(rate*3.8),scene);
      plume.particleTexture=smokeTexture;plume.emitter=uptake;
      plume.minEmitBox.set(-.65,0,-.5);plume.maxEmitBox.set(.65,.25,.5);
      plume.direction1.set(3.8,1.9,-.45);plume.direction2.set(7.2,3.1,.6);
      plume.emitRate=rate;plume.minLifeTime=2;plume.maxLifeTime=3.8;
      plume.minAngularSpeed=-.24;plume.maxAngularSpeed=.31;
      plume.minSize=1.8;plume.maxSize=2.9;plume.addSizeGradient(0,.7);plume.addSizeGradient(1,3.2);
      plume.color1=new B.Color4(.21,.19,.17,.37);plume.color2=new B.Color4(.31,.29,.26,.29);
      plume.colorDead=new B.Color4(.39,.38,.35,0);plume.blendMode=B.ParticleSystem.BLENDMODE_STANDARD;
      plume.start();this.exhaust.push(plume);
    }
    this.attackClock=5;this.bursts=[];this.salvoTime=0;
    this.salvoBolts=[];
    this.flashMaterial=new B.StandardMaterial('fogPassageTracer',scene);
    this.flashMaterial.disableLighting=true;this.flashMaterial.emissiveColor=new B.Color3(1,.59,.15);
    this.keelLights=base.group.getChildMeshes().filter(m=>m.name==='cfAntigravGlow');
    this.keelLights.forEach(m=>m.setEnabled(false));
  }

  get fix(){return this.fixes[this.index];}

  search(position,base) {
    if(BABYLON.Vector3.Distance(position,base.group.position)<235)return 'found';
    if(this.index<this.fixes.length-1 && (BABYLON.Vector3.Distance(position,this.fix.position)<175 ||
        position.x<this.fix.position.x-110)) { this.index++;return 'bearing'; }
    return null;
  }

  pursue(dt,ship,base,airborne,explode,onHit) {
    const B=BABYLON,p=this.escort.position;
    const goal=airborne?ship.group.position:base.group.position;
    const delta=goal.subtract(p),range=delta.length();
    // Slow silhouette above the banks. It keeps closing while the pilot is on foot.
    if(range>(airborne?110:280)){
      const heading=Math.atan2(delta.z,-delta.x);
      this.escort.rotation.y=heading;
      p.addInPlace(delta.normalize().scale(Math.min(range,26*dt)));
      p.y=Math.max(base.group.position.y+75,p.y);
    }
    this.attackClock-=dt;
    if(airborne && range<315 && this.attackClock<=0){
      this.attackClock=5.5;
      const aim=ship.group.position.add(ship.velocity.scale(.85));
      const local=B.Vector3.TransformCoordinates(aim,B.Matrix.Invert(this.escort.computeWorldMatrix(true)));
      const mount=this.escort.antiAircraftMounts.find(m=>m.side===(local.z<0?-1:1));
      const offset=B.Vector3.TransformCoordinates(aim,B.Matrix.Invert(mount.swivel.parent.computeWorldMatrix(true)))
        .subtract(mount.swivel.position).subtract(new B.Vector3(0,mount.pivot.position.y,0));
      mount.swivel.rotation.y=Math.atan2(offset.z,-offset.x);
      mount.pivot.rotation.z=-Math.atan2(offset.y,Math.hypot(offset.x,offset.z));
      mount.swivel.computeWorldMatrix(true);
      const start=B.Vector3.TransformCoordinates(new B.Vector3(-3.25,.1,.39),mount.pivot.computeWorldMatrix(true));
      explode(start,effects.muzzle);
      const tracer=B.MeshBuilder.CreateSphere('escortAATracer',{diameter:.8,segments:5},this.escort.getScene());
      tracer.material=this.flashMaterial;tracer.isPickable=false;tracer.position.copyFrom(start);
      this.bursts.push({point:aim,start,tracer,delay:.85});
    }
    for (const burst of this.bursts) {
      burst.delay-=dt;
      B.Vector3.LerpToRef(burst.start,burst.point,Math.min(1,1-burst.delay/.85),burst.tracer.position);
      if(burst.delay<=0){burst.tracer.dispose();explode(burst.point,effects.airburst);if(airborne&&B.Vector3.Distance(ship.group.position,burst.point)<18)onHit();}
    }
    this.bursts=this.bursts.filter(b=>b.delay>0);
  }

  fire(scene,base,explode) {
    const B=BABYLON,dest=this.escort.position.clone();
    this.salvoTime=0;
    for(const burst of this.bursts) burst.tracer.dispose();
    this.bursts=[];
    for(const plume of this.exhaust) plume.stop();
    for(const turret of base.mainTurrets) {
      const delta=dest.subtract(turret.yawPivot.getAbsolutePosition());
      turret.yawPivot.rotation.y=Math.atan2(delta.z,-delta.x);
      turret.pitchPivot.rotation.z=-Math.atan2(delta.y,Math.hypot(delta.x,delta.z));
      turret.yawPivot.computeWorldMatrix(true);
      const matrix=turret.pitchPivot.computeWorldMatrix(true);
      for(const z of [-2.4,0,2.4]){
        const start=B.Vector3.TransformCoordinates(new B.Vector3(-19,0,z),matrix);
        const bolt=B.MeshBuilder.CreateSphere('cruiserSalvo',{diameter:2.4,segments:6},scene);
        bolt.material=this.flashMaterial;bolt.position.copyFrom(start);
        this.salvoBolts.push({bolt,start,end:dest.add(new B.Vector3(z*2,4,z))});
      }
      explode(this.salvoBolts.at(-1).start,effects.muzzle);
    }
  }

  resolveSalvo(dt,explode) {
    this.salvoTime+=dt;
    const t=Math.min(1,this.salvoTime/1.45);
    for(const {bolt,start,end} of this.salvoBolts) BABYLON.Vector3.LerpToRef(start,end,t,bolt.position);
    if(t===1 && this.salvoBolts.length){
      for(const {bolt,end} of this.salvoBolts){explode(end,effects.impact);bolt.dispose();}
      this.salvoBolts=[];
    }
    if(t===1){this.escort.rotation.z+=dt*.34;this.escort.position.y-=dt*17;}
    if(this.salvoTime<4.2)return false;
    this.escort.setEnabled(false);return true;
  }

  lift(dt,base) {
    this.keelLights.forEach(m=>m.setEnabled(true));
    this.liftTime=Math.min(6,this.liftTime+dt);
    const t=this.liftTime/6;
    base.group.position.y=this.restY+24*t*t*(3-2*t);
    base.group.computeWorldMatrix(true);
    return t>=1;
  }
}
