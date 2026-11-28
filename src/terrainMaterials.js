const ROCK_STYLE_CODES = { forest: 0, industrial: 1, military: 2, volcanic: 3, glacier: 4, desert: 5, ancient: 6 };

// World-space triplanar projection keeps cliffs at a fixed metre scale on every face.
class RockProjection extends BABYLON.MaterialPluginBase {
  constructor(material, scene, style = 'forest') {
    super(material, 'RockProjection', 200, {ROCK_PROJECTION:false, TURF_EDGE:false}, true);
    if (!scene._sharedRockCliffTex) {
      const tex = new BABYLON.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
      tex.anisotropicFilteringLevel = 8;
      scene._sharedRockCliffTex = tex;
    }
    if (!scene._sharedGrassTopTex) {
      const gTex = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg', scene);
      gTex.anisotropicFilteringLevel = 8;
      scene._sharedGrassTopTex = gTex;
    }
    this.texture = scene._sharedRockCliffTex;
    this.grassTexture = scene._sharedGrassTopTex;
    this.styleCode = ROCK_STYLE_CODES[style] ?? 0;
    this._invMatrix = new BABYLON.Matrix();
    this.registerForExtraEvents=true;
    this._enable(true);
  }
  getClassName() {return 'RockProjection';}
  prepareDefines(defines, scene, mesh) {
    defines.ROCK_PROJECTION = true;
    defines.TURF_EDGE = !!mesh?.metadata?.turfEdge && this.styleCode < 2;
  }
  getUniforms(){return {ubo:[{name:'edgeSpan',size:2,type:'vec2'},{name:'rockTextureToLocal',size:16,type:'mat4'},{name:'rockStyleParams',size:4,type:'vec4'}],fragment:'uniform vec2 edgeSpan; uniform mat4 rockTextureToLocal; uniform vec4 rockStyleParams;'};}
  hardBindForSubMesh(buffer,scene,engine,subMesh){
    const mesh = subMesh.getRenderingMesh();
    const edge = mesh.metadata?.turfEdge;
    if (edge && this.styleCode < 2) {
      buffer.updateFloat2('edgeSpan', edge.width, edge.depth);
      buffer.setTexture('edgeTerrainSampler', edge.material.albedoTexture || this.grassTexture);
    }
    mesh.getWorldMatrix().invertToRef(this._invMatrix);
    buffer.updateMatrix('rockTextureToLocal',this._invMatrix);
    const pos = mesh.getAbsolutePosition();
    buffer.updateFloat4('rockStyleParams',this.styleCode,pos.x,pos.y,pos.z);
    buffer.update();
  }
  getSamplers(samplers) {samplers.push('rockTriplanarSampler', 'grassTopSampler', 'edgeTerrainSampler');}
  bindForSubMesh(buffer) {
    buffer.setTexture('rockTriplanarSampler', this.texture);
    buffer.setTexture('grassTopSampler', this.grassTexture);
  }
  getCustomCode(shaderType) {
    if (shaderType === 'vertex') return {
      CUSTOM_VERTEX_DEFINITIONS: '#ifdef TURF_EDGE\nvarying float vEdgeDrop;\n#endif',
      CUSTOM_VERTEX_MAIN_BEGIN: '#ifdef TURF_EDGE\nvEdgeDrop = uv.y * 9.0;\n#endif',
    };
    if (shaderType !== 'fragment') return null;
    return {
      CUSTOM_FRAGMENT_DEFINITIONS: '#ifdef TURF_EDGE\nvarying float vEdgeDrop; uniform sampler2D edgeTerrainSampler;\n#endif\n#ifdef ROCK_PROJECTION\nuniform sampler2D rockTriplanarSampler;\nuniform sampler2D grassTopSampler;\nfloat vAetherVeinMask;\nvec3 vSeamGlowColor;\nfloat vRockMicroRelief;\n#endif',
      CUSTOM_FRAGMENT_UPDATE_ALBEDO: `
        #ifdef ROCK_PROJECTION
        vec3 rockLocal = (rockTextureToLocal*vec4(vPositionW,1.0)).xyz;
        // Translation-anchored world-meter coordinates: never stretched by non-uniform mesh scaling!
        vec3 rockWorld = vPositionW - rockStyleParams.yzw;
        vec3 rockN = abs(normalize(vNormalW));
        vec3 rockW = pow(rockN, vec3(5.0));
        rockW /= max(dot(rockW, vec3(1.0)), 0.001);

        // Dual-scale anti-tiling triplanar sampling of real photogrammetry granite (aerial_rocks_02)
        float beddingY = rockWorld.y + rockWorld.x * 0.16 - rockWorld.z * 0.09;
        float fold = sin(rockWorld.x * 0.044 + rockWorld.z * 0.031) * 2.8;
        vec3 pMacro = vec3(rockWorld.x, (beddingY + fold) * 1.43, rockWorld.z) * 0.022;
        vec3 colMacro = texture2D(rockTriplanarSampler, pMacro.zy).rgb * rockW.x
                      + texture2D(rockTriplanarSampler, pMacro.xz).rgb * rockW.y
                      + texture2D(rockTriplanarSampler, pMacro.xy).rgb * rockW.z;

        // Dominant-plane fine detail octave (1 fetch instead of 3 — cuts rock bandwidth by 33% with crisp detail!)
        mat2 rot37 = mat2(0.798, -0.602, 0.602, 0.798);
        vec3 pDetail = rockWorld * 0.074 + vec3(0.37, 0.71, 0.19);
        vec2 domUv = (rockW.y >= rockW.x && rockW.y >= rockW.z) ? pDetail.xz
                   : (rockW.x >= rockW.z ? pDetail.zy : pDetail.xy);
        vec3 colDetail = texture2D(rockTriplanarSampler, rot37 * domUv).rgb;

        float detailWeight = smoothstep(0.44, 0.78, max(rockW.x, max(rockW.y, rockW.z)));
        vec3 photoRock = mix(colMacro, colDetail, 0.48 * detailWeight);
        // Branch-guarded photogrammetry meadow turf: vertical cliffs & undersides skip BOTH grass fetches (50% less bandwidth!)
        vec3 realisticTurf = vec3(0.30, 0.36, 0.22);
        float grassLuma = 0.38;
        float grassRelief = 0.0;
        if (vNormalW.y > 0.10 && rockLocal.y > -6.0 && rockStyleParams.x < 2.5) {
          vec3 grassMacro = texture2D(grassTopSampler, rockWorld.xz * 0.068).rgb;
          vec3 grassFine = texture2D(grassTopSampler, rot37 * (rockWorld.xz * 0.195 + vec2(0.41, 0.27))).rgb;
          vec3 photoGrass = mix(grassMacro, grassFine, 0.54);
          grassLuma = dot(photoGrass, vec3(0.299, 0.587, 0.114));
          grassRelief = (grassFine.g - grassMacro.g) * 2.2;
          vec3 dryMeadow = photoGrass * vec3(1.18, 1.06, 0.72);
          vec3 oliveTurf = photoGrass * vec3(0.84, 1.02, 0.74);
          float dryPatch = smoothstep(0.32, 0.74, 0.5 + 0.5 * sin(rockWorld.x * 0.09 + rockWorld.z * 0.07 + grassMacro.r * 4.0));
          realisticTurf = clamp(mix(oliveTurf, dryMeadow, dryPatch * 0.55) * 1.18, 0.0, 1.0);
        }
        // Normalize photogrammetry granite exposure so shadowed cliff faces show crisp sculptural stone detail
        vec3 liftedRock = clamp(photoRock * 1.48 + vec3(0.06, 0.06, 0.07), 0.0, 1.0);
        float cliffLuma = dot(liftedRock, vec3(0.299, 0.587, 0.114));
        float crackMask = smoothstep(0.14, 0.52, cliffLuma);

        // Tilted beds follow an erosion field driven by the photographed rock.
        float mineralBed = beddingY + fold + (colMacro.g - 0.4) * 5.0;
        float layer = sin(mineralBed * 0.37) * 0.68 + sin(mineralBed * 0.68 + 1.2) * 0.32;
        float macroPatch = smoothstep(0.25, 0.70, colMacro.r + layer * 0.16);
        float mineralStreak = smoothstep(0.25, 0.68, colMacro.r + layer * 0.27) * crackMask;
        float crevice = mix(0.64, 1.06, crackMask);
        float strataRaw = layer + (colDetail.g - 0.39) * 0.39;
        float strataWave = 0.85 + 0.16 * smoothstep(-0.66, 0.63, strataRaw);
        vRockMicroRelief = cliffLuma * 0.75 + (layer + (colDetail.g - 0.39) * 0.39 * detailWeight) * 0.24;
        float topLedge = smoothstep(0.26, 0.78, vNormalW.y) * smoothstep(-5.0, 7.0, rockLocal.y);
        float mossSpill = smoothstep(-1.5, 10.0, rockLocal.y) * smoothstep(0.16, 0.66, vNormalW.y + (colMacro.g - 0.4) * 0.45);
        float overhang = clamp(-vNormalW.y * 0.78 + 0.08, 0.0, 1.0);
        float rootDepth = 1.0 - smoothstep(-15.0, -1.5, rockLocal.y);

        // Subtle glowing ancient aether-crystal veins deep inside the fractured hanging roots
        float veinCrack = (1.0 - smoothstep(0.10, 0.23, cliffLuma)) * smoothstep(0.25, 0.75, abs(sin(rockWorld.y * 0.35 + rockWorld.x * 0.18)));
        vAetherVeinMask = rootDepth * veinCrack;
        vSeamGlowColor = vec3(0.24, 0.86, 0.82);

        vec3 rockPaint;
        if (rockStyleParams.x > 5.5) {
          // ANCIENT SANCTUARY ('ancient'): Pale travertine marble, verdigris bronze crevices & glowing aether seams
          vec3 creviceCol = vec3(0.12, 0.26, 0.28);
          vec3 marbleBody = mix(vec3(0.66, 0.65, 0.58), vec3(0.92, 0.90, 0.82), cliffLuma);
          rockPaint = mix(creviceCol, marbleBody, crackMask) * strataWave;
          rockPaint = mix(rockPaint, photoRock * vec3(1.12, 1.10, 1.02), 0.35);
          rockPaint = mix(rockPaint, vec3(0.18, 0.38, 0.34), topLedge * 0.32);
          rockPaint = mix(rockPaint, vec3(0.10, 0.20, 0.26), overhang * 0.42);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.10, 0.22, cliffLuma)) * 0.68);
          vSeamGlowColor = vec3(0.28, 0.94, 0.82);
        } else if (rockStyleParams.x > 4.5) {
          // DESERT CANYON ('desert'): Deep terracotta-crimson sandstone, ochre bands & sunlit chalk ledges
          vec3 creviceCol = vec3(0.18, 0.09, 0.08);
          vec3 redBody = mix(vec3(0.56, 0.22, 0.14), vec3(0.86, 0.46, 0.26), cliffLuma);
          vec3 ochreBand = vec3(0.90, 0.68, 0.40);
          rockPaint = mix(creviceCol, redBody, crackMask);
          rockPaint = mix(rockPaint, ochreBand, smoothstep(0.35, 0.85, strataRaw) * 0.36);
          rockPaint = mix(rockPaint, photoRock * vec3(1.05, 0.72, 0.56), 0.38) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.84, 0.72, 0.54), topLedge * 0.40);
          rockPaint = mix(rockPaint, vec3(0.16, 0.08, 0.10), overhang * 0.44);
          vSeamGlowColor = vec3(1.00, 0.64, 0.22);
        } else if (rockStyleParams.x > 3.5) {
          // GLACIER ('glacier'): Fractured alpine blue-white ice & frozen slate with cyan subsurface glow
          vec3 creviceCol = vec3(0.10, 0.36, 0.60);
          vec3 iceBody = mix(vec3(0.58, 0.78, 0.92), vec3(0.92, 0.97, 1.00), cliffLuma);
          rockPaint = mix(creviceCol, iceBody, crackMask);
          rockPaint = mix(rockPaint, photoRock * vec3(0.82, 0.96, 1.08), 0.30) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.95, 0.98, 1.00), topLedge * 0.65);
          rockPaint = mix(rockPaint, vec3(0.14, 0.40, 0.66), overhang * 0.46);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.14, 0.30, cliffLuma)) * 0.48);
          vSeamGlowColor = vec3(0.32, 0.88, 1.00);
        } else if (rockStyleParams.x > 2.5) {
          // VOLCANIC OBSIDIAN ('volcanic'): Charred black basalt cliffs with molten magma cracks & ash ledges
          vec3 creviceCol = vec3(0.05, 0.04, 0.05);
          vec3 obsidianBody = mix(vec3(0.11, 0.11, 0.13), vec3(0.28, 0.26, 0.28), cliffLuma);
          rockPaint = mix(creviceCol, obsidianBody, crackMask) * strataWave;
          rockPaint = mix(rockPaint, photoRock * vec3(0.36, 0.34, 0.36), 0.35);
          rockPaint = mix(rockPaint, vec3(0.36, 0.34, 0.33), topLedge * 0.42);
          rockPaint = mix(rockPaint, vec3(0.04, 0.04, 0.05), overhang * 0.48);
          vAetherVeinMask = max(vAetherVeinMask, (1.0 - smoothstep(0.12, 0.26, cliffLuma)) * 0.95);
          vSeamGlowColor = vec3(1.00, 0.36, 0.06);
        } else if (rockStyleParams.x > 1.5) {
          // MILITARY BASTION ('military' — Vagabond): Crisp weathered coastal granite & blue-grey slate with pale chalk ridges, rust veins & alpine turf!
          vec3 creviceCol = vec3(0.18, 0.23, 0.30);
          vec3 darkSlate = mix(vec3(0.38, 0.43, 0.49), vec3(0.64, 0.68, 0.72), cliffLuma);
          vec3 paleGranite = mix(vec3(0.62, 0.62, 0.58), vec3(0.92, 0.90, 0.82), cliffLuma);
          vec3 stoneBody = mix(darkSlate, paleGranite, macroPatch);
          vec3 ironStreak = vec3(0.76, 0.52, 0.36);
          rockPaint = mix(creviceCol, stoneBody, crackMask);
          rockPaint = mix(rockPaint, ironStreak, mineralStreak * 0.28);
          rockPaint = mix(rockPaint, liftedRock * vec3(0.96, 0.96, 0.94), 0.45) * strataWave;
          // Crisp height-blended photogrammetry coastal turf & exposed granite outcrops (zero plasticine green!)
          float turfHeight = topLedge * 0.85 + mossSpill * 0.55 + (grassLuma - cliffLuma) * 0.42;
          float turfMask = smoothstep(0.34, 0.56, turfHeight) * (1.0 - smoothstep(0.68, 0.88, cliffLuma) * 0.65);
          // Warm dry soil/pebble collar right at the rock-to-turf edge
          float soilEdge = smoothstep(0.22, 0.42, turfHeight) * (1.0 - turfMask);
          rockPaint = mix(rockPaint, vec3(0.34, 0.29, 0.23) * (0.7 + 0.5 * grassLuma), soilEdge * 0.68);
          rockPaint = mix(rockPaint, realisticTurf, turfMask * 0.90);
          // Boost micro-relief on turf so blades & soil crevices catch grazing sunlight
          vRockMicroRelief = mix(vRockMicroRelief, grassRelief, turfMask);
          // Cool atmospheric slate roots underneath (never crushed black)
          rockPaint = mix(rockPaint, vec3(0.22, 0.28, 0.38), clamp(overhang * 0.38 + rootDepth * 0.28, 0.0, 0.52));
        } else if (rockStyleParams.x > 0.5) {
          // INDUSTRIAL FOUNDRY ('industrial'): Deep dark charcoal-basalt cliffs with bold oxidized copper-rust strata
          vec3 creviceCol = vec3(0.10, 0.12, 0.16);
          vec3 basaltBody = mix(vec3(0.24, 0.27, 0.32), vec3(0.54, 0.52, 0.50), cliffLuma);
          rockPaint = mix(creviceCol, basaltBody, crackMask);
          rockPaint = mix(rockPaint, vec3(0.76, 0.38, 0.18), mineralStreak * 0.44);
          rockPaint = mix(rockPaint, liftedRock * vec3(0.76, 0.75, 0.78), 0.38) * strataWave;
          rockPaint = mix(rockPaint, vec3(0.14, 0.17, 0.22), overhang * 0.44);
        } else {
          // FOREST SANCTUARY ('forest'): High-contrast sunlit warm chalk-limestone cliffs with lush olive-terracotta turf
          vec3 creviceCol = vec3(0.24, 0.26, 0.30);
          vec3 slateTone = mix(vec3(.48,.37,.30), vec3(.84,.65,.47), cliffLuma);
          vec3 warmStone = mix(vec3(.68,.30,.15), vec3(.97,.64,.36), cliffLuma);
          vec3 limestoneBody = mix(slateTone, warmStone, macroPatch);
          rockPaint = mix(creviceCol, limestoneBody, crackMask);
          rockPaint = mix(rockPaint, liftedRock * vec3(1.10,.87,.72),.27) * strataWave;
          // Natural photogrammetry alpine turf with exposed limestone outcrops
          float fTurfHeight = topLedge * 0.84 + mossSpill * 0.44 + (grassLuma - cliffLuma) * 0.54;
          float fTurfMask = smoothstep(0.32, 0.54, fTurfHeight) * (1.0 - smoothstep(0.72, 0.90, cliffLuma) * 0.55);
          float scree = smoothstep(0.11, 0.38, fTurfHeight) * (1.0 - fTurfMask);
          rockPaint = mix(rockPaint, vec3(0.61, 0.41, 0.25) * (0.78 + cliffLuma * 0.30), scree * 0.62);
          rockPaint = mix(rockPaint, realisticTurf * vec3(1.02, 1.09, 0.82), fTurfMask * 0.64);
          vRockMicroRelief = mix(vRockMicroRelief, grassRelief, fTurfMask);
          rockPaint = mix(rockPaint, vec3(0.20, 0.28, 0.38), clamp(overhang * 0.36 + rootDepth * 0.24, 0.0, 0.48));
        }
        surfaceAlbedo = toLinearSpace(clamp(rockPaint * crevice, 0.0, 1.0));
        #ifdef TURF_EDGE
        float soilDepth = 1.3 + 3.2 * smoothstep(.23,.62,colMacro.g) + sin(rockLocal.x*.31 + rockLocal.z*.23)*.75;
        if (vEdgeDrop < soilDepth) {
          vec3 turf = texture2D(edgeTerrainSampler, rockLocal.xz / edgeSpan + .5).rgb;
          float erosion = smoothstep(.0, soilDepth, vEdgeDrop);
          surfaceAlbedo = mix(toLinearSpace(turf), surfaceAlbedo, erosion);
          vRockMicroRelief *= erosion;
        }
        #endif
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
      CUSTOM_FRAGMENT_BEFORE_LIGHTS: `
        #ifdef ROCK_PROJECTION
        // Derive surface relief in world metres and let the scene lights shade it.
        vec3 tx = dFdx(vPositionW);
        vec3 ty = dFdy(vPositionW);
        vec3 u = cross(ty, normalW);
        vec3 v = cross(normalW, tx);
        float area = dot(tx, u);
        vec3 relief = (u * dFdx(vRockMicroRelief) + v * dFdy(vRockMicroRelief)) * sign(area) / max(abs(area), 0.00001);
        normalW = normalize(normalW - relief * min(0.62, 0.47 / max(length(relief), 0.001)));
        #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION: `
        #if defined(ROCK_PROJECTION) && !defined(UNLIT)
        vec3 skyUnderBounce = vec3(0.22, 0.25, 0.31) * clamp(-vNormalW.y * 0.48 + 0.40, 0.0, 1.0);
        finalDiffuse += surfaceAlbedo * skyUnderBounce + vSeamGlowColor * vAetherVeinMask * 0.58;
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
      float leafLight = clamp(dot(surfaceAlbedo, vec3(.2126,.7152,.0722))*1.65+.22, .34, 1.0);
      float leafVariation = .5+.5*sin(vPositionW.x*.13+vPositionW.z*.17+vPositionW.y*.09);
      // Muted russet-sienna & warm ochre foliage matching photogrammetry rock & Interbellum brass
      vec3 leafPaint = mix(vec3(.52,.24,.13),vec3(.68,.48,.22),leafVariation);
      surfaceAlbedo = toLinearSpace(leafPaint)*leafLight;
      #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:`
      #if defined(AUTUMN_LEAVES) && !defined(UNLIT)
      float leafSun = smoothstep(-0.2, 0.45, dot(normalize(vNormalW), normalize(vec3(-0.60, 0.34, -0.72))));
      finalDiffuse += surfaceAlbedo * mix(vec3(0.08, 0.11, 0.18), vec3(0.20, 0.15, 0.08), leafSun);
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
      float canopyLuma = clamp(dot(surfaceAlbedo, vec3(.2126,.7152,.0722))*1.60+.18, .28, 1.0);
      float sunTip = .5+.5*sin(vPositionW.x*.19-vPositionW.z*.15+vPositionW.y*.24);
      // Natural desaturated coastal pine & olive-sage canopy (harmonizes with granite & olive turf, zero neon!)
      vec3 deepPine = vec3(.14, .22, .14);
      vec3 sunlitSage = vec3(.32, .40, .23);
      vec3 canopyCol = mix(deepPine, sunlitSage, sunTip * .72);
      surfaceAlbedo = toLinearSpace(canopyCol) * canopyLuma;
      #endif
      `,
      CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION:`
      #if defined(SUNLIT_CANOPY) && !defined(UNLIT)
      float canopySun = smoothstep(-0.2, 0.45, dot(normalize(vNormalW), normalize(vec3(-0.60, 0.34, -0.72))));
      finalDiffuse += surfaceAlbedo * mix(vec3(0.06, 0.10, 0.16), vec3(0.18, 0.16, 0.08), canopySun);
      #endif
      `
    } : null;
  }
}

export function applyRockProjection(material, scene, style = 'forest') {
  if (!material) return;
  if (material._rockProjection) {
    material._rockProjection.styleCode = ROCK_STYLE_CODES[style] ?? 0;
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
