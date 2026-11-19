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
    this.shockMaterial=new B.StandardMaterial('explosionShockwaveMat',scene);
    this.shockMaterial.disableLighting=true;this.shockMaterial.diffuseColor.set(0,0,0);
    this.shockMaterial.emissiveColor=B.Color3.FromHexString('#ffd07a');this.shockMaterial.backFaceCulling=false;
    this.shockMaterial.alpha=0.72;this.shockMaterial.disableDepthWrite=true;
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
      // Full 3D spherical blast burst for impactful aerial & ground explosions
      const theta=this._rng(slot)*Math.PI*2;
      const phi=Math.acos(2*this._rng(slot)-1);
      const speed=(name==='spark'?12.5:name==='fire'?4.2:1.5)*slot.scale*(0.55+this._rng(slot)*0.7);
      direction.set(Math.sin(phi)*Math.cos(theta)*speed, (Math.cos(phi)+(name==='soot'?0.55:0.15))*speed, Math.sin(phi)*Math.sin(theta)*speed);
    };
    return ps;
  }

  _slot(index){
    const B=BABYLON,slot={index,active:false,age:0,duration:0,position:new B.Vector3(),scale:1,seed:index+1,dx:1,dz:0,smokeStarted:false};
    const fire=this._particle(slot,'fire',28,this.fireTexture);
    fire.blendMode=B.ParticleSystem.BLENDMODE_ADD;
    fire.minLifeTime=.28;fire.maxLifeTime=.72;fire.addSizeGradient(0,.65,1.05);fire.addSizeGradient(.35,1.85,2.45);fire.addSizeGradient(1,2.6,3.3);
    fire.addColorGradient(0,new B.Color4(1,.96,.78,.95));fire.addColorGradient(.32,new B.Color4(1,.54,.14,.82));fire.addColorGradient(.75,new B.Color4(.62,.16,.04,.35));fire.addColorGradient(1,new B.Color4(.22,.08,.04,0));
    const smoke=this._particle(slot,'soot',22,this.smokeTexture);
    smoke.minLifeTime=1.15;smoke.maxLifeTime=2.15;smoke.gravity.set(.15,.85,.05);
    smoke.addSizeGradient(0,1.1,1.5);smoke.addSizeGradient(.45,2.6,3.3);smoke.addSizeGradient(1,4.2,5.4);
    smoke.addColorGradient(0,new B.Color4(.22,.16,.13,0));smoke.addColorGradient(.12,new B.Color4(.20,.19,.18,.52));smoke.addColorGradient(.60,new B.Color4(.32,.31,.30,.24));smoke.addColorGradient(1,new B.Color4(.44,.43,.42,0));
    const spark=this._particle(slot,'spark',24,this.streakTexture);
    spark.minLifeTime=.22;spark.maxLifeTime=.78;spark.gravity.set(0,-12,0);
    spark.billboardMode=B.ParticleSystem.BILLBOARDMODE_STRETCHED;spark.minScaleX=.13;spark.maxScaleX=.24;spark.minScaleY=.8;spark.maxScaleY=1.6;
    spark.minAngularSpeed=spark.maxAngularSpeed=0;spark.blendMode=B.ParticleSystem.BLENDMODE_ADD;
    spark.addColorGradient(0,new B.Color4(1,.88,.52,.95));spark.addColorGradient(.45,new B.Color4(1,.48,.12,.68));spark.addColorGradient(1,new B.Color4(.35,.12,.02,0));
    const flash=B.MeshBuilder.CreatePlane(`explosionFlash_${index}`,{size:1},this.scene);flash.material=this.flashMaterial;flash.billboardMode=B.Mesh.BILLBOARDMODE_ALL;flash.isPickable=false;flash.checkCollisions=false;flash.setEnabled(false);
    const shock=B.MeshBuilder.CreateTorus(`explosionShock_${index}`,{diameter:1.8,thickness:0.14,tessellation:20},this.scene);shock.material=this.shockMaterial;shock.billboardMode=B.Mesh.BILLBOARDMODE_ALL;shock.isPickable=false;shock.checkCollisions=false;shock.setEnabled(false);
    const shards=[];
    for(let n=0;n<4;n++){
      const mesh=new B.Mesh(`explosionShrapnel_${index}_${n}`,this.scene),vd=new B.VertexData();
      const positions=[-.35,-.7,-.035,.40,-.4,-.035,-.12,.65,-.035,-.35,-.7,.035,.40,-.4,.035,-.12,.65,.035],indices=[0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5],normals=[];
      B.VertexData.ComputeNormals(positions,indices,normals);Object.assign(vd,{positions,indices,normals});vd.applyToMesh(mesh);
      mesh.material=this.shardMaterial;mesh.isPickable=false;mesh.checkCollisions=false;mesh.setEnabled(false);
      shards.push({mesh,vx:0,vy:0,vz:0});
    }
    return Object.assign(slot,{fire,smoke,spark,flash,shock,shards});
  }

  /** Returns false at the six-burst capacity, avoiding allocation spikes during weapon spam. */
  spawn(position,scale=1){
    if(this.disposed)return false;
    const slot=this.slots.find(s=>!s.active);if(!slot){this.dropped++;return false;}
    slot.active=true;slot.age=0;slot.scale=Math.max(.25,Math.min(Number(scale)||1,4));slot.duration=slot.scale<.7?1.55:2.45;
    slot.position.copyFrom(position);slot.seed=(++this.serial*2654435761)>>>0;slot.smokeStarted=false;
    const angle=this._rng(slot)*Math.PI*2;slot.dx=Math.cos(angle);slot.dz=Math.sin(angle);
    const small=slot.scale<.7;
    for(const ps of[slot.fire,slot.smoke,slot.spark]){ps.minSize=slot.scale*.78;ps.maxSize=slot.scale*1.32;}
    slot.smoke.minLifeTime=small?.75:1.15;slot.smoke.maxLifeTime=small?1.25:2.15;
    slot.fire.manualEmitCount=small?12:28;slot.fire.start();slot.spark.manualEmitCount=small?10:24;slot.spark.start();
    slot.flash.position.copyFrom(position);slot.flash.scaling.setAll(slot.scale*5.8);slot.flash.visibility=.98;slot.flash.rotation.z=angle;slot.flash.setEnabled(true);
    slot.shock.position.copyFrom(position);slot.shock.scaling.setAll(slot.scale*0.6);slot.shock.visibility=small?0.45:0.85;slot.shock.setEnabled(true);
    for(const shard of slot.shards){
      shard.mesh.position.copyFrom(position);shard.mesh.scaling.setAll(slot.scale*(.16+this._rng(slot)*.20));shard.mesh.rotation.set(this._rng(slot)*3,this._rng(slot)*3,this._rng(slot)*3);shard.mesh.setEnabled(true);
      const side=this._rng(slot)<.5?-1:1;shard.vx=(slot.dx*side*7+(this._rng(slot)-.5)*5)*slot.scale;shard.vy=(3+this._rng(slot)*5)*slot.scale;shard.vz=(slot.dz*side*7+(this._rng(slot)-.5)*5)*slot.scale;
    }
    return true;
  }

  update(dt){
    if(this.disposed)return;const step=Math.max(0,Math.min(Number(dt)||0,.1));
    for(const slot of this.slots){if(!slot.active)continue;slot.age+=step;
      if(slot.age<.11)slot.flash.visibility=.98*Math.pow(1-slot.age/.11,1.4);else slot.flash.setEnabled(false);
      if(slot.age<.38){
        const st=slot.age/.38;
        slot.shock.scaling.setAll(slot.scale*(0.6+st*5.2));
        slot.shock.visibility=(1-st)*(1-st)*0.75;
      }else slot.shock.setEnabled(false);
      if(!slot.smokeStarted&&slot.age>=.08){slot.smokeStarted=true;slot.smoke.manualEmitCount=slot.scale<.7?9:22;slot.smoke.start();}
      for(const shard of slot.shards){
        if(slot.age>.95){shard.mesh.setEnabled(false);continue;}
        shard.vy-=10.5*step;shard.mesh.position.x+=shard.vx*step;shard.mesh.position.y+=shard.vy*step;shard.mesh.position.z+=shard.vz*step;
        shard.mesh.rotation.x+=step*3.4;shard.mesh.rotation.z+=step*2.6;
      }
      if(slot.age>=slot.duration){slot.active=false;for(const ps of[slot.fire,slot.smoke,slot.spark]){ps.manualEmitCount=0;ps.stop();}slot.flash.setEnabled(false);slot.shock.setEnabled(false);slot.shards.forEach(s=>s.mesh.setEnabled(false));}
    }
  }

  get snapshot(){return {activeBursts:this.slots.filter(s=>s.active).length,maxBursts:6,particleCapacity:444,particleSystems:18,spawned:this.serial,dropped:this.dropped,textureCount:this.textures.length,geometryTriangles:6*2+6*4*8};}
  dispose(){if(this.disposed)return;this.disposed=true;this.scene.onDisposeObservable.remove(this.disposeObserver);for(const s of this.slots){s.fire.dispose(false);s.smoke.dispose(false);s.spark.dispose(false);s.flash.dispose();s.shock.dispose();s.shards.forEach(d=>d.mesh.dispose());}this.textures.forEach(t=>t.dispose());this.flashMaterial.dispose();this.shockMaterial.dispose();this.shardMaterial.dispose();}
}
