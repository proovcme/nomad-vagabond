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
    const STYLE_CODES = { forest: 0.0, industrial: 1.0, military: 2.0, volcanic: 3.0, glacier: 4.0, desert: 5.0, ancient: 6.0 };
    this.styleCode = STYLE_CODES[style] ?? 0.0;
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
        vec3 paintedCliff = mix(colMacro, colDetail, 0.44);
        float cliffLuma = dot(paintedCliff, vec3(0.299, 0.587, 0.114));
        float crackMask = smoothstep(0.18, 0.56, cliffLuma);
        // Deep carved fracture AO + vertical rain-wash weathering streaks
        float rainStreak = 0.88 + 0.12 * sin(rockWorld.x * 0.65 + rockWorld.z * 0.55 + colDetail.r * 5.0);
        vRockCreviceAO = mix(0.48, 1.06, crackMask) * rainStreak;
        vRockMicroRelief = dot(colDetail - colMacro, vec3(0.333));
        vRockStrataSlope = cos(rockWorld.y * 0.58 + cliffLuma * 4.8);

        // Distinct horizontal sedimentary strata bands (layered sandstone / basalt shelves)
        float strataRaw = sin(rockWorld.y * 0.48 + cliffLuma * 3.4) * 0.6 + sin(rockWorld.y * 1.15 - colDetail.g * 4.2) * 0.4;
        float strataWave = 0.84 + 0.16 * smoothstep(-0.7, 0.7, strataRaw);
        float topLedge = smoothstep(0.42, 0.82, vNormalW.y) * smoothstep(-8.0, 6.0, rockLocal.y);
        float overhang = clamp(-vNormalW.y * 0.72 + 0.08, 0.0, 1.0);

        // Subtle glowing ancient aether-crystal veins deep inside the fractured hanging roots (why the islands float!)
        float rootDepth = smoothstep(-2.0, -14.0, rockLocal.y);
        float veinCrack = (1.0 - smoothstep(0.10, 0.24, cliffLuma)) * smoothstep(0.25, 0.75, abs(sin(rockWorld.y * 0.35 + rockWorld.x * 0.18)));
        vAetherVeinMask = rootDepth * veinCrack;
        vSeamGlowColor = rockStyleParams.x > 0.5 ? vec3(0.18, 0.78, 0.85) : vec3(0.32, 0.92, 0.76);

        vec3 rockPaint;
        if (rockStyleParams.x > 5.5) {
          // ANCIENT SANCTUARY ('ancient'): Weathered ivory-travertine marble, verdigris bronze crevices & bright golden-teal aether seams
          vec3 creviceCol = vec3(0.14, 0.28, 0.30);
          vec3 marbleBody = mix(vec3(0.68, 0.66, 0.58), vec3(0.92, 0.90, 0.80), cliffLuma);
          rockPaint = mix(creviceCol, marbleBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.96, 0.94, 0.88), 0.25) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.18, 0.36, 0.34), topLedge * 0.28);
          rockPaint = mix(rockPaint, vec3(0.12, 0.22, 0.28), overhang * 0.38);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.10, 0.22, cliffLuma)) * 0.65);
          vSeamGlowColor = vec3(0.28, 0.94, 0.82);
        } else if (rockStyleParams.x > 4.5) {
          // DESERT CANYON ('desert'): Deep terracotta-crimson sandstone, ochre strata & bleached dust ledges
          vec3 creviceCol = vec3(0.22, 0.11, 0.09);
          vec3 redBody = mix(vec3(0.58, 0.24, 0.14), vec3(0.88, 0.48, 0.26), cliffLuma);
          vec3 ochreBand = vec3(0.90, 0.66, 0.36);
          rockPaint = mix(creviceCol, redBody, crackMask);
          rockPaint = mix(rockPaint, ochreBand, smoothstep(0.35, 0.85, strataRaw) * 0.38);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.96, 0.78, 0.64), 0.26) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.86, 0.74, 0.56), topLedge * 0.42);
          rockPaint = mix(rockPaint, vec3(0.20, 0.10, 0.12), overhang * 0.42);
          vSeamGlowColor = vec3(1.00, 0.64, 0.22);
        } else if (rockStyleParams.x > 3.5) {
          // GLACIER ('glacier'): Fractured alpine blue-white ice & frozen slate with bright cyan subsurface crevices
          vec3 creviceCol = vec3(0.12, 0.38, 0.62);
          vec3 iceBody = mix(vec3(0.62, 0.80, 0.92), vec3(0.92, 0.97, 1.00), cliffLuma);
          rockPaint = mix(creviceCol, iceBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.84, 0.94, 1.00), 0.22) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.95, 0.98, 1.00), topLedge * 0.62);
          rockPaint = mix(rockPaint, vec3(0.16, 0.42, 0.68), overhang * 0.46);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.14, 0.30, cliffLuma)) * 0.45);
          vSeamGlowColor = vec3(0.32, 0.88, 1.00);
        } else if (rockStyleParams.x > 2.5) {
          // VOLCANIC OBSIDIAN ('volcanic'): Charred black basalt cliffs with molten magma cracks & ash ledges
          vec3 creviceCol = vec3(0.06, 0.05, 0.06);
          vec3 obsidianBody = mix(vec3(0.12, 0.11, 0.13), vec3(0.30, 0.26, 0.26), cliffLuma);
          rockPaint = mix(creviceCol, obsidianBody, crackMask) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.38, 0.34, 0.32), topLedge * 0.45);
          rockPaint = mix(rockPaint, vec3(0.05, 0.04, 0.05), overhang * 0.45);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.12, 0.26, cliffLuma)) * 0.95);
          vSeamGlowColor = vec3(1.00, 0.36, 0.06);
        } else if (rockStyleParams.x > 1.5) {
          // MILITARY BASTION ('military'): Weathered limestone & ochre sandstone with dark slate crevices & dry plateau lichen
          vec3 creviceCol = vec3(0.14, 0.19, 0.26);
          vec3 stoneBody = mix(vec3(0.48, 0.40, 0.32), vec3(0.84, 0.72, 0.55), cliffLuma);
          vec3 rustBand = vec3(0.64, 0.42, 0.28);
          rockPaint = mix(creviceCol, stoneBody, crackMask);
          rockPaint = mix(rockPaint, rustBand, smoothstep(0.45, 0.90, strataRaw) * 0.24);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.90, 0.86, 0.80), 0.34) * strataWave;
          vec3 dryLichen = vec3(0.36, 0.44, 0.26) * (0.75 + 0.35 * cliffLuma);
          rockPaint = mix(rockPaint, dryLichen, topLedge * 0.42);
          rockPaint = mix(rockPaint, vec3(0.12, 0.17, 0.25), overhang * 0.42);
        } else if (rockStyleParams.x > 0.5) {
          // INDUSTRIAL FOUNDRY ('industrial'): Dark volcanic basalt, scorched iron-rust strata & soot undersides
          vec3 creviceCol = vec3(0.11, 0.13, 0.19);
          vec3 basaltBody = mix(vec3(0.34, 0.32, 0.36), vec3(0.68, 0.55, 0.44), cliffLuma);
          rockPaint = mix(creviceCol, basaltBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.80, 0.72, 0.64), 0.30) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.11, 0.14, 0.22), overhang * 0.44);
        } else {
          // FOREST SANCTUARY ('forest'): Layered honey-terracotta sandstone, deep crevices & lush emerald moss shelves
          vec3 creviceCol = vec3(0.16, 0.22, 0.32);
          vec3 limestoneBody = mix(vec3(0.60, 0.44, 0.29), vec3(0.88, 0.74, 0.52), cliffLuma);
          rockPaint = mix(creviceCol, limestoneBody, crackMask);
          rockPaint = mix(rockPaint, paintedCliff * vec3(0.92, 0.88, 0.82), 0.34) * strataWave;
          vec3 alpineMoss = vec3(0.19, 0.58, 0.24) * (0.70 + 0.42 * cliffLuma);
          rockPaint = mix(rockPaint, alpineMoss, topLedge * 0.68);
          rockPaint = mix(rockPaint, vec3(0.14, 0.22, 0.34), overhang * 0.38);
        }
        surfaceAlbedo = toLinearSpace(clamp(rockPaint * vRockCreviceAO, 0.0, 1.0));
        #endif
      `,
      CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS: `
        #ifdef ROCK_PROJECTION
        // True matte mineral rock: zero metallic plastic sheen, high natural stone roughness!
        float rockLuma = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
        metallicRoughness.r = 0.0;
        metallicRoughness.g = clamp(0.96 - smoothstep(0.28, 0.82, rockLuma) * 0.09, 0.87, 0.98);
        #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION: `
        #if defined(ROCK_PROJECTION) && !defined(UNLIT)
        vec3 sunDirW = normalize(vec3(-0.66, 0.28, -0.69));
        // Crisp matte triplanar rock relief normal (no glossy specular plastic blob!)
        vec3 microNormalW = normalize(vNormalW + vec3(vRockMicroRelief * 0.48, vRockStrataSlope * 0.34, -vRockMicroRelief * 0.42));
        float ndl = dot(microNormalW, sunDirW);
        float diffuseLift = smoothstep(-0.08, 0.45, ndl);
        vec3 warmRockSun = vec3(0.22, 0.13, 0.03) * diffuseLift;
        vec3 coolShadow = vec3(0.02, 0.05, 0.12) * (1.0 - smoothstep(-0.15, 0.20, ndl));
        vec3 skyUnderBounce = vec3(0.08, 0.09, 0.13) * clamp(-vNormalW.y * 0.65 + 0.20, 0.0, 1.0);
        finalDiffuse += surfaceAlbedo * (warmRockSun + coolShadow + skyUnderBounce) + vSeamGlowColor * vAetherVeinMask * 0.48;
        #endif
      `,
    };
  }
  dispose() {}
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
