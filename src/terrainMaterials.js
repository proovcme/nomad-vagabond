// World-space triplanar projection keeps cliffs at a fixed metre scale on every face.
class RockProjection extends BABYLON.MaterialPluginBase {
  constructor(material, scene, style = 'forest') {
    super(material, 'RockProjection', 200, {ROCK_PROJECTION:false}, true);
    if (!scene._sharedRockCliffTex) {
      const tex = new BABYLON.Texture('./assets/textures/nomad/golden-cliff-albedo.png', scene);
      tex.anisotropicFilteringLevel = 8;
      scene._sharedRockCliffTex = tex;
    }
    this.texture = scene._sharedRockCliffTex;
    this.styleCode = style === 'industrial' ? 1.0 : style === 'military' ? 2.0 : 0.0;
    this._invMatrix = new BABYLON.Matrix();
    this.registerForExtraEvents=true;
    this._enable(true);
  }
  getClassName() {return 'RockProjection';}
  prepareDefines(defines) {defines.ROCK_PROJECTION=true;}
  getUniforms(){return {ubo:[{name:'rockTextureToLocal',size:16,type:'mat4'},{name:'rockStyleParams',size:4,type:'vec4'}],fragment:'uniform mat4 rockTextureToLocal; uniform vec4 rockStyleParams;'};}
  hardBindForSubMesh(buffer,scene,engine,subMesh){
    const mesh = subMesh.getRenderingMesh();
    mesh.getWorldMatrix().invertToRef(this._invMatrix);
    buffer.updateMatrix('rockTextureToLocal',this._invMatrix);
    const pos = mesh.getAbsolutePosition();
    buffer.updateFloat4('rockStyleParams',this.styleCode,pos.x,pos.y,pos.z);
    buffer.update();
  }
  getSamplers(samplers) {samplers.push('rockTriplanarSampler');}
  bindForSubMesh(buffer) {buffer.setTexture('rockTriplanarSampler',this.texture);}
  getCustomCode(shaderType) {
    if (shaderType !== 'fragment') return null;
    return {
      CUSTOM_FRAGMENT_DEFINITIONS: '#ifdef ROCK_PROJECTION\nuniform sampler2D rockTriplanarSampler;\nfloat vAetherVeinMask;\nvec3 vSeamGlowColor;\nfloat vRockMicroRelief;\nfloat vRockStrataSlope;\nfloat vRockCreviceAO;\n#endif',
      CUSTOM_FRAGMENT_UPDATE_ALBEDO: `
        #ifdef ROCK_PROJECTION
        vec3 rockLocal = (rockTextureToLocal*vec4(vPositionW,1.0)).xyz;
        // Translation-anchored world-meter coordinates: never stretched by non-uniform mesh scaling!
        vec3 rockWorld = vPositionW - rockStyleParams.yzw;
        vec3 rockN = abs(normalize(vNormalW));
        vec3 rockW = pow(rockN, vec3(5.0));
        rockW /= max(dot(rockW, vec3(1.0)), 0.001);

        // Macro + medium + fine triplanar sampling of hand-painted golden-cliff-albedo.png
        vec3 pMacro = rockWorld * 0.026;
        vec3 colMacro = texture2D(rockTriplanarSampler, pMacro.zy).rgb * rockW.x
                      + texture2D(rockTriplanarSampler, pMacro.xz).rgb * rockW.y
                      + texture2D(rockTriplanarSampler, pMacro.xy).rgb * rockW.z;

        vec3 pDetail = rockWorld * 0.078 + vec3(0.37, 0.71, 0.19);
        vec3 colDetail = texture2D(rockTriplanarSampler, pDetail.zy).rgb * rockW.x
                       + texture2D(rockTriplanarSampler, pDetail.xz).rgb * rockW.y
                       + texture2D(rockTriplanarSampler, pDetail.xy).rgb * rockW.z;

        // Preserve the hand-painted block cracks of golden-cliff-albedo.png (6-tap triplanar, zero pixel shimmer)
        vec3 paintedCliff = mix(colMacro, colDetail, 0.36);
        float cliffLuma = dot(paintedCliff, vec3(0.299, 0.587, 0.114));
        float crackMask = smoothstep(0.20, 0.58, cliffLuma);
        vRockCreviceAO = mix(0.68, 1.06, crackMask);
        vRockMicroRelief = dot(colDetail - colMacro, vec3(0.333));
        vRockStrataSlope = cos(rockWorld.y * 0.52 + cliffLuma * 4.2);

        // Subtle horizontal geological strata modulation & directional shading cues
        float strataWave = 0.91 + 0.09 * sin(rockWorld.y * 0.42 + cliffLuma * 3.8);
        float topLedge = smoothstep(0.36, 0.80, vNormalW.y) * smoothstep(-8.0, 4.0, rockLocal.y);
        float overhang = clamp(-vNormalW.y * 0.65 + 0.10, 0.0, 1.0);

        vec3 rockPaint;
        vAetherVeinMask = 0.0;
        vSeamGlowColor = vec3(0.0);

        if (rockStyleParams.x > 1.5) {
          // MILITARY BASTION ('military'): Warm sunlit Mediterranean amber-limestone & cobalt crevices
          vec3 creviceCol = vec3(0.20, 0.32, 0.48);
          vec3 stoneBody = mix(vec3(0.60, 0.50, 0.40), vec3(0.92, 0.80, 0.62), cliffLuma);
          rockPaint = mix(creviceCol, stoneBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.94, 0.91, 0.88), 0.28) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.18, 0.30, 0.46), overhang * 0.34);
        } else if (rockStyleParams.x > 0.5) {
          // INDUSTRIAL FOUNDRY ('industrial'): Rich violet-slate basalt & warm rust-ochre strata
          vec3 creviceCol = vec3(0.16, 0.22, 0.36);
          vec3 basaltBody = mix(vec3(0.42, 0.38, 0.44), vec3(0.78, 0.63, 0.50), cliffLuma);
          rockPaint = mix(creviceCol, basaltBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.85, 0.76, 0.68), 0.26) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.16, 0.24, 0.38), overhang * 0.36);
        } else {
          // FOREST SANCTUARY ('forest'): Vibrant Ghibli golden-ochre & warm honey-terracotta sandstone + lush emerald moss
          vec3 creviceCol = vec3(0.22, 0.33, 0.50);
          vec3 limestoneBody = mix(vec3(0.68, 0.50, 0.34), vec3(0.95, 0.82, 0.58), cliffLuma);
          rockPaint = mix(creviceCol, limestoneBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.95, 0.92, 0.88), 0.32) * strataWave;
          vec3 alpineMoss = vec3(0.18, 0.70, 0.30) * (0.72 + 0.42 * cliffLuma);
          rockPaint = mix(rockPaint, alpineMoss, topLedge * 0.64);
          rockPaint = mix(rockPaint, vec3(0.18, 0.32, 0.48), overhang * 0.30);
        }
        surfaceAlbedo = toLinearSpace(clamp(rockPaint * vRockCreviceAO, 0.0, 1.0));
        #endif
      `,
      CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS: `
        #ifdef ROCK_PROJECTION
        float rockLuma = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
        metallicRoughness.r = rockStyleParams.x > 0.5 ? 0.12 : 0.06;
        metallicRoughness.g = clamp(0.78 - smoothstep(0.12, 0.58, rockLuma) * 0.26, 0.52, 0.86);
        #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION: `
        #if defined(ROCK_PROJECTION) && !defined(UNLIT)
        vec3 sunDirW = normalize(vec3(-0.66, 0.28, -0.69));
        // Clean smooth triplanar relief normal (no screen-space dFdx/dFdy shimmer)
        vec3 microNormalW = normalize(vNormalW + vec3(vRockMicroRelief * 0.30, vRockStrataSlope * 0.24, -vRockMicroRelief * 0.26));
        float ndl = dot(microNormalW, sunDirW);
        // Deep dramatic golden-hour contrast: crisp sunlit facets vs cool sapphire shadow crevices
        float celBand = smoothstep(-0.04, 0.18, ndl) * 0.62 + smoothstep(0.36, 0.64, ndl) * 0.38;
        float facetHighlight = pow(clamp(ndl, 0.0, 1.0), 5.0) * clamp(vRockMicroRelief + 0.40, 0.0, 1.0) * 0.30;
        vec3 warmCelSun = vec3(0.28, 0.17, 0.04) * (celBand + facetHighlight);
        vec3 coolCelShadow = vec3(0.03, 0.08, 0.18) * (1.0 - smoothstep(-0.12, 0.22, ndl));
        vec3 skyUnderBounce = vec3(0.06, 0.13, 0.24) * clamp(-vNormalW.y * 0.65 + 0.20, 0.0, 1.0);
        vec3 sunRimBoost = vec3(0.14, 0.09, 0.03) * clamp(microNormalW.y * 0.55 + 0.35, 0.0, 1.0) * smoothstep(-0.1, 0.4, ndl);
        finalDiffuse += surfaceAlbedo * (warmCelSun + coolCelShadow + skyUnderBounce + sunRimBoost);
        #endif
      `,
    };
  }
  dispose() {this.texture.dispose();}
}

class AutumnLeaves extends BABYLON.MaterialPluginBase {
  constructor(material) {super(material,'AutumnLeaves',210,{AUTUMN_LEAVES:false},true);this._enable(true);}
  getClassName() {return 'AutumnLeaves';}
  prepareDefines(defines) {defines.AUTUMN_LEAVES=true;}
  getUniforms() {return {ubo:[{name:'autumnWindParams',size:4,type:'vec4'}],vertex:'uniform vec4 autumnWindParams;'};}
  bindForSubMesh(buffer) {
    const t = typeof performance !== 'undefined' ? performance.now() * 0.001 : 0;
    buffer.updateFloat4('autumnWindParams', t, 0, 0, 0);
    buffer.update();
  }
  getCustomCode(shaderType) {
    if (shaderType === 'vertex') {
      return {
        CUSTOM_VERTEX_UPDATE_POSITION: `
          #ifdef AUTUMN_LEAVES
          float alSwayMask = clamp((positionUpdated.y - 0.15) * 0.42, 0.0, 2.2);
          float alPhase = autumnWindParams.x * 2.2 + positionUpdated.x * 0.55 + positionUpdated.z * 0.45;
          float alGust = sin(alPhase) * 0.15 + cos(alPhase * 1.7 - positionUpdated.y * 0.35) * 0.06;
          positionUpdated.x += alGust * alSwayMask;
          positionUpdated.z += alGust * 0.68 * alSwayMask;
          #endif
        `
      };
    }
    return shaderType === 'fragment' ? {
      CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
      #ifdef AUTUMN_LEAVES
      float leafLight = clamp(dot(surfaceAlbedo, vec3(.2126,.7152,.0722))*2.1+.28, .46, 1.0);
      float leafVariation = .5+.5*sin(vPositionW.x*.13+vPositionW.z*.17+vPositionW.y*.09);
      vec3 leafPaint = mix(vec3(.98,.30,.08),vec3(1.0,.82,.16),leafVariation);
      surfaceAlbedo = toLinearSpace(leafPaint)*leafLight;
      #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:`
      #if defined(AUTUMN_LEAVES) && !defined(UNLIT)
      float leafSun = smoothstep(-0.2, 0.45, dot(normalize(vNormalW), normalize(vec3(-0.60, 0.34, -0.72))));
      finalDiffuse += surfaceAlbedo * mix(vec3(0.12, 0.18, 0.34), vec3(0.48, 0.34, 0.12), leafSun);
      #endif
      `
    } : null;
  }
}

class SunlitCanopy extends BABYLON.MaterialPluginBase {
  constructor(material) {super(material,'SunlitCanopy',211,{SUNLIT_CANOPY:false},true);this._enable(true);}
  getClassName() {return 'SunlitCanopy';}
  prepareDefines(defines) {defines.SUNLIT_CANOPY=true;}
  getUniforms() {return {ubo:[{name:'canopyWindParams',size:4,type:'vec4'}],vertex:'uniform vec4 canopyWindParams;'};}
  bindForSubMesh(buffer) {
    const t = typeof performance !== 'undefined' ? performance.now() * 0.001 : 0;
    buffer.updateFloat4('canopyWindParams', t, 0, 0, 0);
    buffer.update();
  }
  getCustomCode(shaderType) {
    if (shaderType === 'vertex') {
      return {
        CUSTOM_VERTEX_UPDATE_POSITION: `
          #ifdef SUNLIT_CANOPY
          float scSwayMask = clamp((positionUpdated.y - 0.10) * 0.45, 0.0, 2.0);
          float scPhase = canopyWindParams.x * 2.0 + positionUpdated.x * 0.60 + positionUpdated.z * 0.50;
          float scGust = sin(scPhase) * 0.13 + cos(scPhase * 1.8 + positionUpdated.y * 0.40) * 0.05;
          positionUpdated.x += scGust * scSwayMask;
          positionUpdated.z += scGust * 0.65 * scSwayMask;
          #endif
        `
      };
    }
    return shaderType === 'fragment' ? {
      CUSTOM_FRAGMENT_UPDATE_ALBEDO:`
      #ifdef SUNLIT_CANOPY
      float canopyLuma = clamp(dot(surfaceAlbedo, vec3(.2126,.7152,.0722))*2.3+.24, .42, 1.0);
      float sunTip = .5+.5*sin(vPositionW.x*.19-vPositionW.z*.15+vPositionW.y*.24);
      vec3 emeraldJade = vec3(.12, .68, .40);
      vec3 sunlitLime = vec3(.64, .92, .24);
      vec3 canopyCol = mix(emeraldJade, sunlitLime, sunTip * .76);
      surfaceAlbedo = toLinearSpace(canopyCol) * canopyLuma;
      #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:`
      #if defined(SUNLIT_CANOPY) && !defined(UNLIT)
      float canopySun = smoothstep(-0.2, 0.45, dot(normalize(vNormalW), normalize(vec3(-0.60, 0.34, -0.72))));
      finalDiffuse += surfaceAlbedo * mix(vec3(0.10, 0.22, 0.38), vec3(0.46, 0.42, 0.14), canopySun);
      #endif
      `
    } : null;
  }
}

export function applyRockProjection(material, scene, style = 'forest') {
  if (!material) return;
  if (material._rockProjection) {
    material._rockProjection.styleCode = style === 'industrial' ? 1.0 : style === 'military' ? 2.0 : 0.0;
    return;
  }
  material._rockProjection = new RockProjection(material, scene, style);
  material.bumpTexture = null;
  material.roughness=.86; material.metallic=0;
}
export function applyAutumnFoliage(meshes) {
  for (const mesh of meshes) {
    const mat=mesh.material;
    if (!mat) continue;
    if (/foliage|leaf/i.test(mat.name) && !mat._autumnLeaves) mat._autumnLeaves=new AutumnLeaves(mat);
    else if (/pine|fir|needle|branch|fern|grass/i.test(mat.name) && !mat._sunlitCanopy) mat._sunlitCanopy=new SunlitCanopy(mat);
  }
}
export function applySunlitCanopy(meshes) {
  for (const mesh of meshes) {
    const mat=mesh.material;
    if (mat && !/bark|trunk|wood/i.test(mat.name) && !mat._sunlitCanopy && !mat._autumnLeaves) {
      mat._sunlitCanopy = new SunlitCanopy(mat);
    }
  }
}
