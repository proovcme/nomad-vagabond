const BUILDING_PALETTES = Object.freeze({
  generator: {body:'#324849',panel:'#c37943',trim:'#d6ae5e'},
  turret: {body:'#38434a',panel:'#9c7357',trim:'#ccaa60'},
  radar: {body:'#314748',panel:'#468a86',trim:'#d4b264'},
  tower: {body:'#354b52',panel:'#72949b',trim:'#d9b466'},
});

function buildingKind(value) {
  const name=String(value||'').toLowerCase();
  if(/generator|ether/.test(name))return 'generator';
  if(/turret|flak|defense/.test(name))return 'turret';
  if(/radar/.test(name))return 'radar';
  if(/tower|control/.test(name))return 'tower';
  return null;
}
const color = hex => BABYLON.Color3.FromHexString(hex).toLinearSpace();

/** Atlas-preserving paint grade: UVs, seams, rivets and original wear remain in place. */
class BuildingAtlasPaint extends BABYLON.MaterialPluginBase {
  constructor(material,primary,trim) {
    super(material,'BuildingAtlasPaint',215,{BUILDING_ATLAS_PAINT:false},true);
    this.primary=primary;this.trim=trim;this._enable(true);
  }
  getClassName(){return 'BuildingAtlasPaint';}
  prepareDefines(defines){defines.BUILDING_ATLAS_PAINT=true;}
  getUniforms(){return {ubo:[{name:'buildingPaintPrimary',size:4,type:'vec4'},{name:'buildingPaintTrim',size:4,type:'vec4'}],fragment:'uniform vec4 buildingPaintPrimary; uniform vec4 buildingPaintTrim;'};}
  bindForSubMesh(buffer){
    buffer.updateFloat4('buildingPaintPrimary',this.primary.r,this.primary.g,this.primary.b,.76);
    buffer.updateFloat4('buildingPaintTrim',this.trim.r,this.trim.g,this.trim.b,1);
    buffer.update();
  }
  getCustomCode(type){
    if(type!=='fragment')return null;
    return {CUSTOM_FRAGMENT_DEFINITIONS:`
      #ifdef BUILDING_ATLAS_PAINT
      float armorGrain;
      #endif
    `, CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS:`
      #ifdef BUILDING_ATLAS_PAINT
      metallicRoughness.g=clamp(.66+.22*metallicRoughness.g-.10*armorGrain,.51,.94);
      #endif
    `, CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
      #ifdef BUILDING_ATLAS_PAINT
      // Grade the existing atlas, never replace its UVs or hide wear under a flat multiply.
      float buildingLum=dot(surfaceAlbedo,vec3(.2126,.7152,.0722));
      armorGrain=clamp(buildingLum*2.,0.,1.);
      float buildingWear=smoothstep(.065,.24,surfaceAlbedo.r-surfaceAlbedo.b);
      float buildingDetail=clamp(pow(max(buildingLum,.001)/.26,.70),.22,1.42);
      vec3 buildingPaint=mix(buildingPaintPrimary.rgb,buildingPaintTrim.rgb,buildingWear*.78)*buildingDetail;
      vec3 buildingOriginal=mix(vec3(buildingLum),surfaceAlbedo,1.12);
      surfaceAlbedo=max(vec3(0.0),mix(buildingOriginal,buildingPaint,buildingPaintPrimary.a));
      #endif
    `};
  }
}

/** Configure only the four imported building families. Returns material, or null if skipped.
 * kind accepts generator/turret/radar/tower and existing GLB filenames.
 * Each imported GLB already owns its materials; never pass a shared aircraft material here.
 */
export function configureBuildingMaterial(material,kind,engine) {
  const family=buildingKind(kind);
  if(!material||!family||material.getClassName?.()!=='PBRMaterial')return null;
  // Authored building bodies are solid: the original generator exported many
  // inward-wound faces, repaired in the GLBs. Do not disguise them with blending.
  if(!/glass|window|transparent/i.test(material.name)){material.alpha=1;material.transparencyMode=BABYLON.PBRMaterial.PBRMATERIAL_OPAQUE;material.backFaceCulling=true;}
  // Keep intentional glass, alpha cutouts and authored emission separate.
  if(material.alpha<.999 || material.transparencyMode===BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND ||
      material.transparencyMode===BABYLON.PBRMaterial.PBRMATERIAL_ALPHATESTANDBLEND ||
      material.albedoTexture?.hasAlpha || material.refractionTexture ||
      /glass|window|transparent|glow|emissive/i.test(material.name))return null;
  const name=material.name.toLowerCase();
  const role=/diesel_armor/.test(name)?'armor':/gunmetal/.test(name)?'body':/brass/.test(name)?'trim':/crimson/.test(name)?'oxide':null;
  if(!role)return null;
  if(material._buildingPaintFamily===family)return material;
  const palette=BUILDING_PALETTES[family];
  if(role==='armor'&&material.albedoTexture){
    // Do not add a second plugin if a material is configured twice during loader callbacks.
    const primary=color(palette.panel),trim=color(palette.trim);
    if(material._buildingAtlasPaint){material._buildingAtlasPaint.primary=primary;material._buildingAtlasPaint.trim=trim;}
    else material._buildingAtlasPaint=new BuildingAtlasPaint(material,primary,trim);
    material.albedoColor.set(1,1,1);
    material.metallic=.22;material.roughness=.78;
  }else if(role==='body'){
    material.albedoColor.copyFrom(color(palette.body));material.metallic=.59;material.roughness=.73;
    const path='./assets/textures/nomad/weathered-iron-v2.jpg';
    const scene=material.getScene();
    material.albedoTexture ||= scene.getTextureByName(path) || new BABYLON.Texture(path,scene);
  }else if(role==='trim'){
    material.albedoColor.copyFrom(color(palette.trim));material.metallic=.84;material.roughness=.39;
  }else if(role==='oxide'){
    material.albedoColor.copyFrom(color('#8c4f32'));material.metallic=.12;material.roughness=.86;
  }
  // Texture references, metallic/roughness packing, alpha and emission are intentionally retained.
  material._buildingPaintFamily=family;
  material.metadata={...material.metadata,buildingPalette:family,buildingPaintRole:role};
  return material;
}
