class WorldPaint extends BABYLON.MaterialPluginBase {
  constructor(material,texture,role,weathered=false) {
    super(material,'WorldPaint',205,{WORLD_PAINT:false,WORLD_WEATHERED:false},true);
    this.texture=texture;this.role=role;this.weathered=weathered;this.registerForExtraEvents=true;this._enable(true);
  }
  getClassName(){return 'WorldPaint';}
  prepareDefines(defines){defines.WORLD_PAINT=true;defines.WORLD_WEATHERED=this.weathered;}
  getUniforms(){return {ubo:[{name:'worldPaintToLocal',size:16,type:'mat4'},{name:'worldPaintTone',size:4,type:'vec4'},{name:'worldPaintVariation',size:4,type:'vec4'}],fragment:'uniform mat4 worldPaintToLocal; uniform vec4 worldPaintTone; uniform vec4 worldPaintVariation;'};}
  hardBindForSubMesh(buffer,scene,engine,subMesh){
    const mesh=subMesh.getRenderingMesh();buffer.updateMatrix('worldPaintToLocal',mesh.getWorldMatrix().clone().invert());
    if(!mesh.metadata?.paintVariation){
      let hash=2166136261;for(const c of mesh.name)hash=Math.imul(hash^c.charCodeAt(0),16777619);
      const unit=(hash>>>0)/4294967295;mesh.metadata={...mesh.metadata,paintVariation:[unit*3.73,(unit*7.31)%3,(unit*5.17)%4,.13+unit*.045]};
    }
    buffer.updateFloat4('worldPaintVariation',...(this.weathered?mesh.metadata.paintVariation:[0,0,0,.16]));buffer.update();
  }
  getSamplers(samplers){samplers.push('worldPaintSampler');}
  bindForSubMesh(buffer){buffer.setTexture('worldPaintSampler',this.texture);buffer.updateFloat4('worldPaintTone',...this.role);buffer.update();}
  getCustomCode(type){
    if(type!=='fragment')return null;
    return {
      CUSTOM_FRAGMENT_DEFINITIONS:'#ifdef WORLD_PAINT\nuniform sampler2D worldPaintSampler;\n#endif',
      CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
      #ifdef WORLD_PAINT
      vec3 paintP=(worldPaintToLocal*vec4(vPositionW,1.0)).xyz*worldPaintVariation.w+worldPaintVariation.xyz;
      vec3 paintN=abs(normalize(cross(dFdx(paintP),dFdy(paintP))));
      vec3 paintW=pow(paintN,vec3(6.0));paintW/=max(dot(paintW,vec3(1.0)),.001);
      vec3 paintRGB=texture2D(worldPaintSampler,paintP.zy).rgb*paintW.x+texture2D(worldPaintSampler,paintP.xz).rgb*paintW.y+texture2D(worldPaintSampler,paintP.xy).rgb*paintW.z;
      float paintValue=dot(paintRGB,vec3(.2126,.7152,.0722));
      float paintedBody=1.0-smoothstep(.02,.25,paintRGB.r-paintRGB.g);
      vec3 broadTone=worldPaintTone.rgb*(.78+paintValue*1.32);
      paintRGB=mix(paintRGB*1.12,broadTone,paintedBody*worldPaintTone.a);
      surfaceAlbedo=toLinearSpace(clamp(paintRGB,0.0,1.0));
      #endif`,
      CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS:`
      float surfLuma=dot(surfaceAlbedo,vec3(.2126,.7152,.0722));
      metallicRoughness.g=clamp(metallicRoughness.g-(surfLuma-.22)*.24,.34,.94);
      #ifdef WORLD_WEATHERED
      float oxideMask=smoothstep(.025,.13,surfaceAlbedo.r-surfaceAlbedo.g);
      float bareSteel=1.0-smoothstep(.018,.085,abs(surfaceAlbedo.r-surfaceAlbedo.g)+abs(surfaceAlbedo.g-surfaceAlbedo.b));
      metallicRoughness.r=mix(.28,.05,oxideMask)+bareSteel*.46;
      metallicRoughness.g=mix(.64,.92,oxideMask)-bareSteel*.20;
      #endif`,
    };
  }
}

/** Shared, metre-scaled painted workshop materials; imported aircraft keep their atlas. */
export class MaterialKit {
  constructor(scene) {
    this.scene=scene;this.changed=[];this.textures=new Map();
    if(scene.getEngine() instanceof BABYLON.NullEngine)return;
    const indDeck=/^(indConcretePBR|indGratePBR)/;
    const metal=/^(vagHullMat|vagPipeMat|vagabondPipeMat|hangarRibIron|indSteelMat|vagSteelScaleMat|islandRotorFrame|islandRotorBlade|practicalLampHousing|shipyardTealSteel)/;
    const rust=/^(indRustMat|indFactoryRust|shipyardOxideRed)/;
    const cloth=/^(shipyardPennantCloth|vagBannerMat)/;
    for(const mat of scene.materials.slice()) {
      if(mat.getClassName()!=='PBRMaterial')continue;
      if(indDeck.test(mat.name))this.apply(mat,'weathered-iron-v2.jpg',.28,.78,[.34,.31,.28,.58]);
      else if(metal.test(mat.name))this.apply(mat,'weathered-iron-v2.jpg',.48,.56,[.44,.40,.36,.48]);
      else if(rust.test(mat.name))this.apply(mat,'weathered-iron-v2.jpg',.26,.76,[.58,.34,.18,.58]);
      else if(cloth.test(mat.name)){
        mat.albedoTexture=this.texture('ochre-aircraft-canvas.png');mat.albedoColor.set(1,1,1);mat.metallic=0;mat.roughness=.95;mat.bumpTexture=null;this.changed.push(mat.name);
      }
    }
    const runway=scene.getMeshByName('vagCarrierRunway');
    if(runway){
      const mat=new BABYLON.PBRMaterial('aviationRunwaySteel',scene);
      this.apply(mat,'aviation-runway-graphite-v1.jpg',.34,.82,[.78,.76,.72,.22]);
      runway.material=mat;runway.receiveShadows=true;
    }
    const wall=new BABYLON.PBRMaterial('paintedHangarWallOlive',scene);this.apply(wall,'weathered-iron-v2.jpg',.18,.86,[.54,.48,.42,.52]);
    for(const mesh of scene.meshes)if(/^vagHangar(?:Back|Side|Ceil)/.test(mesh.name))mesh.material=wall;
    const floor=scene.getMeshByName('hangarInnerFloor');
    if(floor){const mat=new BABYLON.PBRMaterial('aviationHangarFloorSteel',scene);this.apply(mat,'aviation-runway-graphite-v1.jpg',.38,.78,[.82,.78,.72,.18]);floor.material=mat;}
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }
  texture(file){
    if(!this.textures.has(file)){const t=new BABYLON.Texture(`./assets/textures/nomad/${file}`,this.scene);t.anisotropicFilteringLevel=8;this.textures.set(file,t);}
    return this.textures.get(file);
  }
  apply(material,file,metallic,roughness,role=[.44,.40,.36,.42]){
    if(material._worldPaint)return;
    const texture=this.texture(file);
    material.albedoTexture=texture;material.albedoColor.set(1,1,1);
    material.metallic=metallic;material.roughness=roughness;
    material._worldPaint=new WorldPaint(material,texture,role,file==='weathered-iron-v2.jpg');this.changed.push(material.name);
  }
  get snapshot(){return {materials:[...this.changed],textures:this.textures.size};}
  dispose(){if(this.disposed)return;this.disposed=true;for(const t of this.textures.values())t.dispose();}
}
