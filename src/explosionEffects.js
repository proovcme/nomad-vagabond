/** Six reusable painted explosions. Particle buffers and textures are allocated once. */
export class ExplosionEffects {
  constructor(scene){
    this.scene=scene;this.disposed=false;this.serial=0;this.dropped=0;this.textures=[];
    const B=BABYLON;
    const nullEngine=scene.getEngine() instanceof B.NullEngine;
    this.fireTexture=nullEngine?null:this._texture('paintedExplosionFire',256,'fire');
    this.smokeTexture=nullEngine?null:this._texture('paintedExplosionSoot',256,'smoke');
    this.streakTexture=nullEngine?null:this._texture('paintedExplosionStreak',128,'streak');
    this.flashTexture=nullEngine?null:this._texture('paintedExplosionFlash',128,'flash');
    this.flashMaterial=new B.StandardMaterial('explosionWarmFlashMaterial',scene);
    this.flashMaterial.disableLighting=true;this.flashMaterial.diffuseColor.set(0,0,0);
    this.flashMaterial.emissiveColor.set(.94,.84,.64);this.flashMaterial.backFaceCulling=false;
    this.flashMaterial.diffuseTexture=this.flashTexture;this.flashMaterial.useAlphaFromDiffuseTexture=true;
    this.flashMaterial.alpha=.9;this.flashMaterial.disableDepthWrite=true;
    this.shardMaterial=new B.PBRMaterial('explosionForgedShrapnel',scene);
    this.shardMaterial.albedoColor=B.Color3.FromHexString('#5c4333');this.shardMaterial.metallic=.35;this.shardMaterial.roughness=.7;
    this.slots=Array.from({length:6},(_,index)=>this._slot(index));
    this.disposeObserver=scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  _texture(name,size,kind){
    const B=BABYLON,t=new B.DynamicTexture(name,{width:size,height:size},this.scene,true),ctx=t.getContext(),image=ctx.createImageData(size,size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const u=(x+.5)/size*2-1,v=(y+.5)/size*2-1;
      const wx=u+.10*Math.sin(v*11+.7)+.035*Math.sin(v*25-u*8),wy=v+.08*Math.sin(u*9-1.3);
      const a=Math.atan2(wy,wx),r=Math.hypot(wx,wy);
      const boundary=.83+.09*Math.sin(a*5+.4)+.045*Math.sin(a*9+1.2);
      const falloff=Math.max(0,1-r/boundary);
      const brush=.78+.15*Math.sin(wx*17+wy*6)*Math.sin(wy*12-wx*4)+.07*Math.sin(wx*31+wy*23);
      let alpha=Math.pow(falloff,1.45)*brush,R=255,G=255,Bl=255;
      if(kind==='fire'){
        const hot=Math.max(0,1-r*1.75),ragged=.5+.5*Math.sin(wx*13+wy*9);
        R=230+hot*25;G=67+hot*163+ragged*16;Bl=14+hot*112;
        alpha=Math.pow(falloff,.85)*brush;
      }else if(kind==='smoke')alpha=Math.pow(falloff,1.6)*brush*.8;
      else if(kind==='flash')alpha=Math.pow(falloff,1.8)*(.75+.25*Math.sin(a*7+r*12));
      else if(kind==='streak'){
        const width=.11*(1-Math.abs(v)*.85);
        alpha=Math.max(0,1-Math.abs(u)/width)*Math.pow(Math.max(0,1-Math.abs(v)),.7);
        R=255;G=182;Bl=83;
      }
      const i=(y*size+x)*4;image.data[i]=R;image.data[i+1]=G;image.data[i+2]=Bl;image.data[i+3]=Math.round(Math.max(0,Math.min(1,alpha))*255);
    }
    ctx.putImageData(image,0,0);t.hasAlpha=true;t.wrapU=t.wrapV=B.Texture.CLAMP_ADDRESSMODE;t.update(false);this.textures.push(t);return t;
  }

  _rng(slot){slot.seed=(Math.imul(slot.seed,1664525)+1013904223)>>>0;return slot.seed/4294967296;}

  _particle(slot,name,capacity,texture){
    const B=BABYLON,ps=new B.ParticleSystem(`explosion_${name}_${slot.index}`,capacity,this.scene);
    ps.particleTexture=texture;ps.emitter=slot.position;ps.isLocal=false;ps.emitRate=0;ps.manualEmitCount=0;
    ps.updateSpeed=1/60;ps.minEmitPower=ps.maxEmitPower=1;ps.blendMode=B.ParticleSystem.BLENDMODE_STANDARD;
    ps.minInitialRotation=-Math.PI;ps.maxInitialRotation=Math.PI;ps.minAngularSpeed=-.6;ps.maxAngularSpeed=.6;
    ps.startPositionFunction=(_world,position)=>position.set(slot.position.x+(this._rng(slot)-.5)*slot.scale*.8,slot.position.y+(this._rng(slot)-.5)*slot.scale*.55,slot.position.z+(this._rng(slot)-.5)*slot.scale*.8);
    ps.startDirectionFunction=(_world,direction)=>{
      // Two oblique side-fire fans, rather than a spherical fireworks shell.
      const side=this._rng(slot)<.68?1:-1,fan=(this._rng(slot)-.5)*1.6;
      const speed=(name==='spark'?7.5:name==='fire'?2.6:.85)*slot.scale;
      direction.set((slot.dx*side+fan*.45)*speed,(name==='spark'?.7:name==='fire'?.9:1.2)*speed,(slot.dz*side-fan*.45)*speed);
    };
    return ps;
  }

  _slot(index){
    const B=BABYLON,slot={index,active:false,age:0,duration:0,position:new B.Vector3(),scale:1,seed:index+1,dx:1,dz:0,smokeStarted:false};
    const fire=this._particle(slot,'fire',20,this.fireTexture);
    fire.minLifeTime=.25;fire.maxLifeTime=.65;fire.addSizeGradient(0,.45,.8);fire.addSizeGradient(.40,1.25,1.75);fire.addSizeGradient(1,2.0,2.6);
    fire.addColorGradient(0,new B.Color4(1,.92,.66,.88));fire.addColorGradient(.38,new B.Color4(1,.60,.22,.68));fire.addColorGradient(1,new B.Color4(.35,.15,.08,0));
    const smoke=this._particle(slot,'soot',16,this.smokeTexture);
    smoke.minLifeTime=1.05;smoke.maxLifeTime=1.85;smoke.gravity.set(.1,.35,.03);
    smoke.addSizeGradient(0,.9,1.2);smoke.addSizeGradient(.5,2.1,2.7);smoke.addSizeGradient(1,3.4,4.2);
    smoke.addColorGradient(0,new B.Color4(.24,.23,.22,0));smoke.addColorGradient(.14,new B.Color4(.27,.28,.28,.34));smoke.addColorGradient(.65,new B.Color4(.40,.40,.39,.16));smoke.addColorGradient(1,new B.Color4(.48,.48,.47,0));
    const spark=this._particle(slot,'spark',16,this.streakTexture);
    spark.minLifeTime=.18;spark.maxLifeTime=.65;spark.gravity.set(0,-9,0);
    spark.billboardMode=B.ParticleSystem.BILLBOARDMODE_STRETCHED;spark.minScaleX=.11;spark.maxScaleX=.2;spark.minScaleY=.6;spark.maxScaleY=1.2;
    spark.minAngularSpeed=spark.maxAngularSpeed=0;spark.blendMode=B.ParticleSystem.BLENDMODE_ADD;
    spark.addColorGradient(0,new B.Color4(.95,.75,.4,.85));spark.addColorGradient(.5,new B.Color4(.75,.42,.14,.5));spark.addColorGradient(1,new B.Color4(.28,.13,.04,0));
    const flash=B.MeshBuilder.CreatePlane(`explosionFlash_${index}`,{size:1},this.scene);flash.material=this.flashMaterial;flash.billboardMode=B.Mesh.BILLBOARDMODE_ALL;flash.isPickable=false;flash.checkCollisions=false;flash.setEnabled(false);
    const shards=[];
    for(let n=0;n<3;n++){
      const mesh=new B.Mesh(`explosionShrapnel_${index}_${n}`,this.scene),vd=new B.VertexData();
      const positions=[-.35,-.7,-.035,.40,-.4,-.035,-.12,.65,-.035,-.35,-.7,.035,.40,-.4,.035,-.12,.65,.035],indices=[0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5],normals=[];
      B.VertexData.ComputeNormals(positions,indices,normals);Object.assign(vd,{positions,indices,normals});vd.applyToMesh(mesh);
      mesh.material=this.shardMaterial;mesh.isPickable=false;mesh.checkCollisions=false;mesh.setEnabled(false);
      shards.push({mesh,vx:0,vy:0,vz:0});
    }
    return Object.assign(slot,{fire,smoke,spark,flash,shards});
  }

  /** Returns false at the six-burst capacity, avoiding allocation spikes during weapon spam. */
  spawn(position,scale=1){
    if(this.disposed)return false;
    const slot=this.slots.find(s=>!s.active);if(!slot){this.dropped++;return false;}
    slot.active=true;slot.age=0;slot.scale=Math.max(.25,Math.min(Number(scale)||1,4));slot.duration=slot.scale<.7?1.45:2.30;
    slot.position.copyFrom(position);slot.seed=(++this.serial*2654435761)>>>0;slot.smokeStarted=false;
    const angle=this._rng(slot)*Math.PI*2;slot.dx=Math.cos(angle);slot.dz=Math.sin(angle);
    const small=slot.scale<.7;
    for(const ps of[slot.fire,slot.smoke,slot.spark]){ps.minSize=slot.scale*.65;ps.maxSize=slot.scale*1.1;}
    slot.smoke.minLifeTime=small?.65:1.05;slot.smoke.maxLifeTime=small?1.15:1.85;
    slot.fire.manualEmitCount=small?9:20;slot.fire.start();slot.spark.manualEmitCount=small?7:16;slot.spark.start();
    slot.flash.position.copyFrom(position);slot.flash.scaling.setAll(slot.scale*4.6);slot.flash.visibility=.95;slot.flash.rotation.z=angle;slot.flash.setEnabled(true);
    for(const shard of slot.shards){
      shard.mesh.position.copyFrom(position);shard.mesh.scaling.setAll(slot.scale*(.14+this._rng(slot)*.16));shard.mesh.rotation.set(this._rng(slot)*3,this._rng(slot)*3,this._rng(slot)*3);shard.mesh.setEnabled(true);
      const side=this._rng(slot)<.5?-1:1;shard.vx=(slot.dx*side*5+(this._rng(slot)-.5)*3)*slot.scale;shard.vy=(2+this._rng(slot)*4)*slot.scale;shard.vz=(slot.dz*side*5+(this._rng(slot)-.5)*3)*slot.scale;
    }
    return true;
  }

  update(dt){
    if(this.disposed)return;const step=Math.max(0,Math.min(Number(dt)||0,.1));
    for(const slot of this.slots){if(!slot.active)continue;slot.age+=step;
      if(slot.age<.085)slot.flash.visibility=.95*Math.pow(1-slot.age/.085,1.5);else slot.flash.setEnabled(false);
      if(!slot.smokeStarted&&slot.age>=.10){slot.smokeStarted=true;slot.smoke.manualEmitCount=slot.scale<.7?7:16;slot.smoke.start();}
      for(const shard of slot.shards){
        if(slot.age>.85){shard.mesh.setEnabled(false);continue;}
        shard.vy-=9.5*step;shard.mesh.position.x+=shard.vx*step;shard.mesh.position.y+=shard.vy*step;shard.mesh.position.z+=shard.vz*step;
        shard.mesh.rotation.x+=step*3.1;shard.mesh.rotation.z+=step*2.3;
      }
      if(slot.age>=slot.duration){slot.active=false;for(const ps of[slot.fire,slot.smoke,slot.spark]){ps.manualEmitCount=0;ps.stop();}slot.flash.setEnabled(false);slot.shards.forEach(s=>s.mesh.setEnabled(false));}
    }
  }

  get snapshot(){return {activeBursts:this.slots.filter(s=>s.active).length,maxBursts:6,particleCapacity:312,particleSystems:18,spawned:this.serial,dropped:this.dropped,textureCount:this.textures.length,geometryTriangles:6*2+6*3*8};}
  dispose(){if(this.disposed)return;this.disposed=true;this.scene.onDisposeObservable.remove(this.disposeObserver);for(const s of this.slots){s.fire.dispose(false);s.smoke.dispose(false);s.spark.dispose(false);s.flash.dispose();s.shards.forEach(d=>d.mesh.dispose());}this.textures.forEach(t=>t.dispose());this.flashMaterial.dispose();this.shardMaterial.dispose();}
}
