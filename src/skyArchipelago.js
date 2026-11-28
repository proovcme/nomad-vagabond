import { configureBuildingMaterial } from './buildingMaterials.js?v=mission1';
import { SkyCelestials } from './skyCelestials.js?v=mission1';
import { ArchipelagoLandmarks } from './archipelagoLandmarks.js?v=mission1';
import { SkyLife } from './skyLife.js?v=mission1';
import { applyRockProjection, applyAutumnFoliage, applySunlitCanopy } from './terrainMaterials.js?v=mission1';
import { buildGeneratedIsland } from './islandGenerator.js?v=mission1';
import { makeSolid } from './collisions.js?v=mission1';
import { finishRockHangar } from './hangar.js?v=mission1';
import { fbm3 } from './planet.js?v=mission1';
import { GraphicsManager } from './graphics.js?v=mission1';
import { createRustedMetalTexture } from './textures.js?v=mission1';
import { buildFlak88Turret } from './flak88.js?v=mission1';
import { buildSculptedRadar, buildSculptedSamLauncher } from './props/dieselpunkStructures.js?v=mission1';
import { decorateVagabondCarrier, buildAncientWindmillLandmark, buildSkyLighthouseLandmark, buildAetherMonolithLandmark, populateSatelliteIslandDiorama } from './props/nomadLandmarks.js?v=mission1';
import { applyCruiserDeckMaterial, buildFlightDeckCruiserModel } from './props/flightDeckCruiser.js?v=mission1';
import { applyDoverChalkCliffs, buildDoverCliffVillage, buildContinentalSkyCity, buildAlpineCastleDiorama, buildGothicRuinsDiorama, buildEuropeHorizonArchipelago } from './props/europeIslands.js?v=mission1';
import { AssetManager } from './engine/assetManager.js?v=mission1';
import { getLevel } from './levels/levelRegistry.js?v=mission1';
import { buildBiomeIsland } from './islands/biomeIslands.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function registerSkyShaders() {
  if (!BABYLON.Effect.ShadersStore.archSkyVertexShader) {
    BABYLON.Effect.ShadersStore.archSkyVertexShader = `
      precision highp float;
      attribute vec3 position;
      uniform mat4 worldViewProjection;
      varying vec3 vLocalDir;
      void main(void) {
        vLocalDir = normalize(position);
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;
    BABYLON.Effect.ShadersStore.archSkyFragmentShader = `
      precision highp float;
      varying vec3 vLocalDir;
      uniform vec3 uSunDir;
      uniform float uTime;
      uniform float uTimeOfDay;
      uniform vec3 uCameraPosition;
      uniform sampler2D uSkyArtwork;
      uniform float uArtworkReady;
      uniform float uVolumetricClouds;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        return noise2(p) * 0.65 + noise2(mat2(0.8, 0.6, -0.6, 0.8) * p * 2.04 + vec2(11.3, 7.1)) * 0.35;
      }

      vec4 cloudVolume(vec3 origin, vec3 dir) {
        // Ultra-fast 2-layer sunlit volumetric cloud deck (8x faster than 3D raymarch when facing sun!)
        if (dir.y < .035) return vec4(0.0);
        float t = min(2200.0, max(12.0, (245.0 - origin.y) / dir.y));
        vec2 p = (origin.xz + dir.xz * t) * 0.0028 + vec2(uTime * 0.006, uTime * 0.002);
        float n1 = noise2(p) * 0.65 + noise2(p * 2.15 + vec2(12.7, 7.3)) * 0.35;
        float density = smoothstep(0.50, 0.78, n1) * smoothstep(0.035, 0.22, dir.y) * (1.0 - smoothstep(1400.0, 2200.0, t));
        if (density <= 0.01) return vec4(0.0);
        vec3 light = normalize(uSunDir);
        float sunCos = max(0.0001, dot(dir, light));
        float sunPhase = pow(sunCos, 5.0) * 0.55 + pow(sunCos, 18.0) * 0.45;
        float nLit = noise2(p + light.xz * 0.22);
        float shade = clamp((n1 - nLit) * 2.4 + 0.52, 0.0, 1.0);
        vec3 shadowTint = mix(vec3(.44, .53, .70), vec3(.68, .54, .58), sunPhase * 0.45);
        vec3 litTint = vec3(1.0, .95, .84);
        vec3 cloudCol = mix(shadowTint, litTint, shade) + vec3(1.0, .82, .48) * sunPhase * density * 0.55;
        float alpha = density * 0.72;
        return vec4(cloudCol * alpha, alpha);
      }

      void main(void) {
        vec3 d = normalize(vLocalDir);
        float h = d.y;

        // Porco Rosso × Interbellum sky palette: Adriatic steel-blue zenith, muted cerulean mid-sky, warm parchment-gold horizon
        float nightMask = 1.0 - smoothstep(0.02, 0.18, uTimeOfDay);
        vec3 dayZenith = mix(vec3(0.07, 0.17, 0.34), vec3(0.11, 0.24, 0.44), uTimeOfDay);
        vec3 dayMid = mix(vec3(0.24, 0.40, 0.58), vec3(0.32, 0.49, 0.66), uTimeOfDay);
        vec3 dayHoriz = vec3(0.86, 0.78, 0.64);
        vec3 dayAbyss = vec3(0.64, 0.68, 0.74);

        vec3 zenithCol = mix(dayZenith, vec3(0.008, 0.016, 0.048), nightMask);
        vec3 midSkyCol = mix(dayMid, vec3(0.022, 0.042, 0.095), nightMask);
        vec3 horizCol = mix(dayHoriz, vec3(0.055, 0.090, 0.165), nightMask);
        vec3 abyssCol = mix(dayAbyss, vec3(0.015, 0.025, 0.055), nightMask);

        vec3 col;
        if (h >= 0.0) {
          float t1 = smoothstep(0.0, 0.22, h);
          float t2 = smoothstep(0.18, 0.82, h);
          col = mix(horizCol, midSkyCol, t1);
          col = mix(col, zenithCol, t2);
        } else {
          col = mix(horizCol, abyssCol, smoothstep(0.0, 0.35, -h));
        }

        // High altitude wispy cirrus streaks
        vec3 sunSkyDir = normalize(vec3(uSunDir.x, 0.125, uSunDir.z));
        float sunDot = max(0.0001, dot(d, sunSkyDir));

        // Painted panorama with cool blues and ivory sunlit clouds.
        vec2 artUv=vec2(fract(atan(d.z,d.x)/6.2831853+.5+uTime*.00008),acos(clamp(d.y,-1.0,1.0))/3.14159265);
        vec3 rawArt=texture2D(uSkyArtwork,artUv).rgb;
        float artLuma = dot(rawArt, vec3(0.299, 0.587, 0.114));
        vec3 gradedArt = mix(vec3(artLuma), rawArt, 0.73) * vec3(1.01, 1.01, 1.05);
        vec3 skyArt = (gradedArt * gradedArt) * 0.96;
        float seamDistance=min(artUv.x,1.0-artUv.x);
        if(seamDistance<.035){
          vec3 seamRaw=.5*(texture2D(uSkyArtwork,vec2(.001,artUv.y)).rgb+texture2D(uSkyArtwork,vec2(.999,artUv.y)).rgb);
          float sLuma = dot(seamRaw, vec3(0.299, 0.587, 0.114));
          vec3 sGraded = mix(vec3(sLuma), seamRaw, 0.73) * vec3(1.01, 1.01, 1.05);
          skyArt=mix((sGraded * sGraded) * 0.96,skyArt,smoothstep(0.0,.035,seamDistance));
        }
        float artWeight=smoothstep(.0,.14,artUv.y)*(1.0-smoothstep(.94,1.0,artUv.y))*smoothstep(-.20,.04,h);
        col=mix(col,skyArt * mix(1.0, 0.08, nightMask), uArtworkReady * artWeight * mix(0.69, 0.28, nightMask));

        // Rich bright twinkling night stars (2 layered starfields: bright hero stars + dense faint star dust)
        if (nightMask > 0.05 && h > 0.01) {
          float starFade = nightMask * smoothstep(0.01, 0.16, h);
          vec2 sUv1 = d.xz / (h + 0.32) * 115.0;
          vec2 sCell1 = floor(sUv1);
          vec2 sFrac1 = fract(sUv1) - 0.5;
          float sRand1 = hash21(sCell1);
          if (sRand1 > 0.968) {
            float dist1 = length(sFrac1);
            float dot1 = smoothstep(0.36, 0.04, dist1);
            float twinkle1 = 0.72 + 0.28 * sin(uTime * 3.1 + sRand1 * 180.0);
            vec3 starTint = mix(vec3(0.76, 0.88, 1.0), vec3(1.0, 0.92, 0.74), fract(sRand1 * 37.0));
            col += starTint * dot1 * twinkle1 * starFade * 1.95;
          }
          vec2 sUv2 = d.xz / (h + 0.26) * 240.0 + vec2(31.7, 17.3);
          vec2 sCell2 = floor(sUv2);
          vec2 sFrac2 = fract(sUv2) - 0.5;
          float sRand2 = hash21(sCell2);
          if (sRand2 > 0.955) {
            float dot2 = smoothstep(0.38, 0.06, length(sFrac2));
            col += vec3(0.72, 0.84, 1.0) * dot2 * starFade * 1.05;
          }
        }

        // Restrained Ivory-Apricot Sun (day) OR Cool Silver Moon Halo (night) — no acid-yellow ring or blown-out glare!
        float s2 = sunDot * sunDot;
        float s4 = s2 * s2;
        float s8 = s4 * s4;
        float s16 = s8 * s8;
        float s24 = s16 * s8;
        float godRays = s16 * (1.0 - smoothstep(0.9968, 0.9988, sunDot)) * 0.14;

        vec3 dayMie = vec3(0.94, 0.64, 0.40) * s4 * 0.18 * (1.0 - smoothstep(0.05, 0.56, abs(h - 0.10)))
                    + vec3(0.96, 0.84, 0.64) * (s24 * 0.24 + godRays * 0.72);
        vec3 nightMie = vec3(0.22, 0.36, 0.62) * (s8 * s4) * 0.35;
        col += mix(dayMie, nightMie, nightMask);

        float horizBand = exp(-abs(h - 0.008) * 9.0);
        col = mix(col, mix(vec3(0.88, 0.78, 0.65), vec3(0.07, 0.11, 0.20), nightMask), horizBand * (0.15 + 0.16 * s2) * mix(1.0, 0.45, nightMask));

        float coronaSoft = smoothstep(0.9960, 0.9988, sunDot);
        float solarCore = smoothstep(0.9986, 0.9994, sunDot);
        col = mix(col, mix(vec3(0.96, 0.86, 0.68), vec3(0.45, 0.64, 0.92), nightMask), coronaSoft * mix(0.42, 0.36, nightMask));
        col = mix(col, mix(vec3(1.00, 0.96, 0.88), vec3(0.84, 0.92, 1.00), nightMask), solarCore);
        col += mix(vec3(0.16, 0.14, 0.10), vec3(0.14, 0.20, 0.32), nightMask) * solarCore;

        gl_FragColor = vec4(col, 1.0);
        #include<imageProcessingCompatibility>
      }
    `;
  }

  if (!BABYLON.Effect.ShadersStore.archCloudSeaVertexShader) {
    BABYLON.Effect.ShadersStore.archCloudSeaVertexShader = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 world;
      uniform mat4 worldViewProjection;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main(void) {
        vUv = uv;
        vec4 wp = world * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;
    BABYLON.Effect.ShadersStore.archCloudSeaFragmentShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      uniform float uTime;
      uniform float uScale;
      uniform float uOpacity;
      uniform vec3 uCamPos;
      uniform vec3 uSunDir;
      uniform float uTimeOfDay;
      uniform float uCloudVolume;
      uniform sampler2D cloudRelief;

      float hash21(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 34.12);
        return fract(p.x * p.y);
      }

      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
          mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        return noise2(p) * 0.65 + noise2(mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03 + vec2(5.2, 9.7)) * 0.35;
      }

      void main(void) {
        // Fast 3-tap cloud sea (halves fragment cost across the lower viewport vs 6-tap!)
        vec2 p = vWorldPos.xz * uScale + vec2(uTime * 0.012, uTime * 0.005);
        float n1 = noise2(p);
        float n2 = noise2(p * 2.15 - vec2(uTime * 0.015, 0.0));
        float billow = n1 * 0.65 + n2 * 0.35;
        float density = smoothstep(0.20, 0.67, billow);

        // Fast 1-tap directional self-shadowing + golden sun-glint path across the cloud sea
        vec2 sunXZ = normalize(uSunDir.xz + vec2(0.001));
        float nSun = noise2(p * 1.15 + sunXZ * 0.38);
        float lit = clamp(0.52 + (billow - nSun) * 2.1, 0.0, 1.0);

        vec2 toFrag = vWorldPos.xz - uCamPos.xz;
        float dist = length(toFrag);
        float sunAlign = max(0.0001, dot(toFrag / max(1.0, dist), sunXZ));
        float sa2 = sunAlign * sunAlign;
        float sa4 = sa2 * sa2;
        float sunGlint = (sa4 * sunAlign) * smoothstep(0.45, 0.92, lit);

        float nightMask = 1.0 - smoothstep(0.02, 0.18, uTimeOfDay);
        vec3 shadowCol = mix(
          mix(vec3(0.32, 0.47, 0.68), vec3(0.55, 0.46, 0.60), sunAlign * 0.38),
          vec3(0.012, 0.024, 0.068),
          nightMask
        );
        vec3 litCol = mix(vec3(1.00, 0.96, 0.86), vec3(0.10, 0.17, 0.32), nightMask);
        vec3 warmRim = mix(vec3(.89, .86, .81), vec3(0.28, 0.44, 0.72), nightMask);
        vec3 col = mix(shadowCol, litCol, smoothstep(0.08, 0.95, lit));
        col = mix(col, warmRim, smoothstep(0.38, 0.92, lit) * 0.35 + sunGlint * 0.42);

        // Abyssal chaos below the clouds: intermittent deep storm-lightning blooms & sunken ether-engine flashes!
        vec2 cellId = floor(vWorldPos.xz * 0.0024);
        vec2 cellF = fract(vWorldPos.xz * 0.0024) - 0.5;
        float cRnd = hash21(cellId);
        float pulseT = fract(uTime * (0.22 + cRnd * 0.25) + cRnd * 19.7);
        float flashBase = max(0.0, 1.0 - pulseT * 4.8);
        float flashEnv = (flashBase * flashBase * flashBase) * step(0.68, cRnd);
        float flashRad = exp(-dot(cellF, cellF) * 16.0);
        vec3 flashCol = mix(vec3(0.35, 0.86, 1.00), vec3(1.00, 0.52, 0.18), fract(cRnd * 13.7));
        col += flashCol * flashEnv * flashRad * (.04 + .85 * nightMask) * (0.45 + 0.55 * density);

        // Faint glowing abyssal fissures shimmering in the deepest cloud troughs (reuses n2 — 0 extra noise fetches!)
        float trough = (1.0 - smoothstep(0.18, 0.58, density)) * smoothstep(0.62, 0.88, n2);
        col += vec3(0.22, 0.68, 0.72) * trough * (0.22 + 0.35 * nightMask);

        float horizonBlend = smoothstep(950.0, 2700.0, dist);
        vec3 horizonHaze = mix(
          mix(vec3(0.68, 0.82, 0.94), vec3(0.98, 0.82, 0.60), pow(sunAlign, 1.8) * 0.78),
          vec3(0.045, 0.075, 0.145),
          nightMask
        );
        col = mix(col, horizonHaze, horizonBlend);
        float alpha = density * uOpacity * (1.0-smoothstep(1700.0,6000.0,dist));
        // Integrate a bounded cloud layer above this proxy plane. The low preset
        // and distant horizon retain the cheaper sheet for consistent frame time.
        vec3 ray = normalize(vWorldPos - uCamPos);
        if (uCloudVolume > .5 && ray.y < -.09 && dist < 1550.0) {
          float farT = length(vWorldPos - uCamPos) - 4.0 / -ray.y;
          float nearT = max(0.0, farT - 104.0 / -ray.y);
          float stepSize = max(0.0, farT - nearT) / 12.0;
          float transmission = 1.0;
          vec3 scattered = vec3(0.0);
          for (int i = 0; i < 12; ++i) {
            float t = nearT + (float(i) + .5) * stepSize;
            vec3 w = uCamPos + ray * t;
            float altitude = (w.y - vWorldPos.y - 4.0) / 104.0;
            vec2 q = w.xz * .007 + vec2(uTime * .008, uTime * .003);
            float large = noise2(q + altitude * .61);
            float folds = noise2(q * 2.65 - altitude * 2.24);
            float body = large * .76 + folds * .24;
            float envelope = smoothstep(0.0,.16,altitude) * (1.0-smoothstep(.59,1.0,altitude));
            float thickness = smoothstep(.42,.75,body) * envelope;
            float extinction = 1.0 - exp(-thickness * stepSize * .051);
            vec3 silver = mix(vec3(.32,.43,.57), vec3(.74,.79,.83), clamp(altitude * 1.44 + (1.0 - thickness) * .23,0.0,1.0));
            silver = mix(silver, vec3(.12,.19,.35), nightMask);
            scattered += transmission * extinction * silver;
            transmission *= 1.0 - extinction;
            if (transmission < .025) break;
          }
          float fog = (1.0 - smoothstep(850.0,1550.0,dist)) * smoothstep(.09,.17,-ray.y);
          col = mix(col, scattered / max(.01,1.0-transmission), fog * smoothstep(.02,.22,1.0-transmission));
          alpha = max(alpha * (1.0 - .55 * fog), (1.0-transmission) * fog * .68);
        }
        // Baked cumulus slopes pick up the same raking sunlight as the hull.
        vec2 bankUV=vWorldPos.xz*.00056+vec2(uTime*.00018,uTime*.00007);
        vec3 billows=texture2D(cloudRelief,bankUV+vec2(n1,n2)*.08).rgb;
        float crest=clamp(.44+dot(billows.gb-.5,sunXZ)*1.12+(billows.r-.55)*1.15,0.,1.);
        vec3 bank=mix(vec3(.33,.41,.54),vec3(1.,.88,.69),crest);
        float bankWeight=(1.-nightMask)*(.45-.35*horizonBlend);
        col=mix(col,bank,bankWeight);
        alpha*=mix(.84,1.,smoothstep(.26,.70,billows.r));
        gl_FragColor = vec4(col, alpha);
        #include<imageProcessingCompatibility>
      }
    `;
  }

  if (!BABYLON.Effect.ShadersStore.archWaterfallVertexShader) {
    BABYLON.Effect.ShadersStore.archWaterfallVertexShader = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform mat4 worldViewProjection;
      varying vec2 vUv;
      void main(void) {
        vUv = uv;
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;
    BABYLON.Effect.ShadersStore.archWaterfallFragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;

      float hash21(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 34.12);
        return fract(p.x * p.y);
      }
      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
          mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      void main(void) {
        vec2 flowUv = vec2(vUv.x * 5.0, vUv.y * 8.0 + uTime * 2.4);
        float s1 = noise2(flowUv);
        float s2 = noise2(flowUv * vec2(2.3, 1.6) + vec2(0.0, uTime * 1.5));
        float streak = smoothstep(0.28, 0.84, s1 * 0.6 + s2 * 0.4);
        float sideFade = smoothstep(0.0, 0.16, vUv.x) * (1.0-smoothstep(.84,1.0,vUv.x));
        float bottomFade = smoothstep(0.0, 0.24, vUv.y);
        vec3 waterCol = mix(vec3(.35,.55,.61), vec3(.94,.92,.82), streak);
        float alpha = (0.28 + streak * 0.55) * sideFade * bottomFade;
        gl_FragColor = vec4(waterCol, alpha);
        #include<imageProcessingCompatibility>
      }
    `;
  }
}

function makePBRTexture(scene, path, uScale = 1, vScale = 1, isLinear = false) {
  const tex = new BABYLON.Texture(path, scene, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
  tex.uScale = uScale;
  tex.vScale = vScale;
  tex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
  tex.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  if (isLinear) tex.gammaSpace = false;
  return tex;
}

function makeTerrainPBRMaterial(scene, name, folder, uScale, vScale, tint = '#ffffff') {
  const mat = new BABYLON.PBRMaterial(name, scene);
  mat.albedoColor = c3(tint);
  mat.metallic = 0.0;
  mat.roughness = 0.88;
  mat.useAmbientOcclusionFromMetallicTextureRed = true;
  mat.useRoughnessFromMetallicTextureGreen = true;
  mat.useMetallnessFromMetallicTextureBlue = true;

  if (scene.getEngine().constructor.name !== 'NullEngine') {
    const base = `./assets/benchmark/textures/${folder}`;
    mat.albedoTexture = makePBRTexture(scene, `${base}/Diffuse.jpg`, uScale, vScale, false);
    mat.bumpTexture = makePBRTexture(scene, `${base}/nor_gl.jpg`, uScale, vScale, true);
    mat.bumpTexture.level = 1.25;
    mat.metallicTexture = makePBRTexture(scene, `${base}/arm.jpg`, uScale, vScale, true);
    const maxAniso = Math.min(8, scene.getEngine()?.getCaps?.().maxAnisotropy || 4);
    mat.albedoTexture.anisotropicFilteringLevel = maxAniso;
    mat.bumpTexture.anisotropicFilteringLevel = maxAniso;
  }
  return mat;
}

async function instantiateGLBInto(scene, rootUrl, file, parent, pos, scale, rotY = 0, shadowGen = null) {
  if (scene.getEngine().constructor.name === 'NullEngine' || !BABYLON.SceneLoader) return null;
  try {
    const key = `${rootUrl}${file}`;
    scene._glbContainerCache ||= new Map();
    let containerPromise = scene._glbContainerCache.get(key);
    if (!containerPromise) {
      containerPromise = BABYLON.SceneLoader.LoadAssetContainerAsync(rootUrl, file, scene).then((container) => {
        if (file === 'coastal_alder.glb') applyAutumnFoliage(container.meshes);
        else if (rootUrl.includes('/trees/') || rootUrl.includes('/fern_')) applySunlitCanopy(container.meshes);
        if (rootUrl.includes('/buildings/')) {
          for (const m of container.meshes) configureBuildingMaterial(m.material, file, scene.getEngine());
        }
        return container;
      });
      scene._glbContainerCache.set(key, containerPromise);
    }
    const container = await containerPromise;
    if (scene.isDisposed || !container) return null;

    const holder = new BABYLON.TransformNode(`prop_${file}`, scene);
    holder.parent = parent;
    holder.position.copyFrom(pos);
    holder.rotation.y = rotY;
    const s = typeof scale === 'number' ? new BABYLON.Vector3(scale, scale, scale) : scale;
    holder.scaling.copyFrom(s);

    const inst = container.instantiateModelsToScene(name => `${name}_i`, false);
    for (const rootNode of inst.rootNodes) {
      rootNode.parent = holder;
    }
    const childMeshes = holder.getChildMeshes();
    // Skip shadow-map casting for alpha-tested foliage/trees & small clutter props (keeps shadow pass fast!)
    const skipShadow = rootUrl.includes('/trees/') || /\/(fern_|Lantern_|boulder_|grass_|crate|barrel)/i.test(rootUrl) || /fern_|Lantern_|boulder_|grass_|pine_|fir_|alder_|crate|barrel/i.test(file);
    for (const m of childMeshes) {
      m.receiveShadows = true;
      if (!rootUrl.includes('/trees/') && !rootUrl.includes('/fern_')) makeSolid(m);
      if (shadowGen && !skipShadow && m.getTotalVertices() > 0) shadowGen.addShadowCaster(m, false);
    }
    return holder;
  } catch (err) {
    console.warn(`[instantiateGLBInto] Failed to load ${rootUrl}${file}:`, err);
    return null;
  }
}

/**
 * Enhances the existing AsteroidBase ("Бродяга") with a deeper craggy flying-island keel,
 * embedded engine support trusses, coolant pipes, and CC0 deck props.
 */
/**
 * Builds a massive helicopter-style under-island lift rotor (gearbox, armored shroud ring,
 * hub, and 6 riveted lift blades) so every floating island stays aloft mechanically.
 */
function createGiantIslandLiftRotor(parent, scene, x, y, z, diameter = 44, shadowGen = null) {
  const frameMat = new BABYLON.PBRMaterial(`islandRotorFrame_${Math.round(diameter)}`, scene);
  frameMat.albedoColor = c3('#3b4046');
  frameMat.metallic = 0.82;
  frameMat.roughness = 0.44;

  const bladeMat = new BABYLON.PBRMaterial(`islandRotorBlade_${Math.round(diameter)}`, scene);
  bladeMat.albedoColor = c3('#988664');
  bladeMat.metallic = 0.55;
  bladeMat.roughness = 0.50;

  const brassMat = new BABYLON.PBRMaterial(`islandRotorBrass_${Math.round(diameter)}`, scene);
  brassMat.albedoColor = c3('#b67442');
  brassMat.metallic = 0.85;
  brassMat.roughness = 0.34;

  const assembly = new BABYLON.TransformNode('islandLiftRotorAssembly', scene);
  assembly.parent = parent;
  assembly.position.set(x, y, z);

  // Heavy gearbox housing anchored up into the rock keel
  const gearbox = BABYLON.MeshBuilder.CreateCylinder('islandRotorGearbox', { diameterTop: diameter * 0.22, diameterBottom: diameter * 0.16, height: 8.5, tessellation: 12 }, scene);
  gearbox.parent = assembly;
  gearbox.position.y = 3.2;
  gearbox.material = frameMat;

  // Armored outer shroud ring + 4 radial support struts
  const shroud = BABYLON.MeshBuilder.CreateTorus('islandRotorShroud', { diameter: diameter * 0.96, thickness: 1.65, tessellation: 28 }, scene);
  shroud.parent = assembly;
  shroud.material = frameMat;
  if (shadowGen) shadowGen.addShadowCaster(shroud, false);

  // One full X chord, plus two perpendicular half-arms. Four full rotated chords
  // duplicated the 0/180° and 90/270° faces and overlapped all four at the centre.
  const span = diameter * .94, chordThickness = .95;
  const fullStrut = BABYLON.MeshBuilder.CreateBox('islandRotorStrut_X', {width:span,height:.75,depth:chordThickness},scene);
  fullStrut.parent=assembly;fullStrut.position.y=1.6;fullStrut.material=frameMat;
  const armLength=(span-chordThickness)/2;
  for(const side of [-1,1]) {
    const arm=BABYLON.MeshBuilder.CreateBox(`islandRotorStrut_Z_${side}`, {width:chordThickness,height:.75,depth:armLength},scene);
    arm.parent=assembly;arm.position.set(0,1.6,side*(chordThickness/2+armLength/2));arm.material=frameMat;
  }

  // Spinning rotor hub + 6 massive helicopter-style lift blades
  const hub = new BABYLON.TransformNode('islandLiftRotorHub', scene);
  hub.parent = assembly;
  hub.position.y = -0.5;

  const spinner = BABYLON.MeshBuilder.CreateCylinder('islandRotorSpinner', { diameterTop: diameter * 0.14, diameterBottom: 1.2, height: 4.5, tessellation: 12 }, scene);
  spinner.parent = hub;
  spinner.position.y = -1.2;
  spinner.material = brassMat;

  // Merge all 6 rotor blades into 1 single draw call per rotor (saves 15 draw calls across islands!)
  const bladeCount = 6;
  const bladeParts = [];
  for (let b = 0; b < bladeCount; b++) {
    const ang = (b * Math.PI * 2) / bladeCount;
    const blade = BABYLON.MeshBuilder.CreateBox(`islandRotorBlade_${b}`, { width: diameter * 0.44, height: 0.24, depth: 2.35 }, scene);
    blade.rotation.y = ang;
    blade.rotation.x = 0.24;
    blade.position.set(Math.cos(ang) * diameter * 0.23, 0.0, -Math.sin(ang) * diameter * 0.23);
    blade.computeWorldMatrix(true);
    bladeParts.push(blade);
  }
  const mergedBlades = BABYLON.Mesh.MergeMeshes(bladeParts, true, true, undefined, false, false);
  if (mergedBlades) {
    mergedBlades.name = `islandRotorBlades_${Math.round(diameter)}`;
    mergedBlades.parent = hub;
    mergedBlades.material = bladeMat;
    mergedBlades.isPickable = false;
  }

  return hub;
}

/**
 * Deforms a rock cylinder/cone into a craggy, faceted cliff formation with vertical
 * strata, ledges, and jagged underside spires, then recomputes normals.
 */
function sculptCraggyRock(mesh, seed = 1, ampSide = 0.26) {
  const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  const idx = mesh.getIndices();
  if (!pos || !idx) return;
  let minY = Infinity, maxY = -Infinity;
  for (let i = 1; i < pos.length; i += 3) {
    if (pos[i] < minY) minY = pos[i];
    if (pos[i] > maxY) maxY = pos[i];
  }
  const spanY = Math.max(1.0, maxY - minY);
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    const r = Math.hypot(x, z);
    if (r < 0.05) continue;
    const yn = (y - minY) / spanY; // 0 = bottom tip, 1 = top rim
    const ang = Math.atan2(z, x);
    // Keep top rim relatively tidy so platforms/trees sit cleanly; jagged sides & spires below
    const sideMask = yn > 0.92 ? 0.32 : 1.0;
    const ridge = Math.sin(ang * 5 + seed * 1.7 + yn * 3.2) * 0.45
                + Math.cos(ang * 9 - seed * 2.3 + yn * 5.5) * 0.30
                + Math.sin(ang * 3 + y * 0.22 + seed) * 0.25;
    const factor = 1.0 + ridge * ampSide * sideMask;
    pos[i] = x * factor;
    pos[i + 2] = z * factor;
    if (yn > 0.05 && yn < 0.92) {
      pos[i + 1] = y + Math.sin(ang * 4 + seed) * 0.85;
    }
  }
  mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);
  const normals = new Float32Array(pos.length);
  BABYLON.VertexData.ComputeNormals(pos, idx, normals, { useRightHandedSystem: Boolean(mesh.getScene()?.useRightHandedSystem) });
  mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, true);
}

/**
 * Marching-Tetrahedra SDF rock cluster generator (same proven technique as Vagabond's
 * vagabondUnifiedRockShell in rockShell.js). Fuses multiple offset, tapered, craggy
 * rock columns into a single water-tight mesh with stepped cliff ledges, multi-peaked
 * crests, and 3-4 asymmetric hanging stalactite roots (zero flat cylinder caps or single cones).
 */
function buildMarchingRockCluster(scene, name, masses, { step = 2.2, seed = 101, material = null, parent = null, pos = null, rot = null, shadowGen = null } = {}) {
  const prepped = masses.map((m, i) => ({
    x: m.x || 0, y: m.y || 0, z: m.z || 0,
    h: m.h || 24,
    rTop: (m.dTop ?? 14) * 0.5,
    rBottom: (m.dBot ?? 2.2) * 0.5,
    sx: m.sx || 1, sz: m.sz || 1,
    c: Math.cos(m.ry || 0), s: Math.sin(m.ry || 0),
    phase: seed * 0.13 + i * 2.39996,
  }));

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (const m of prepped) {
    const rMax = Math.max(m.rTop, m.rBottom) * Math.max(m.sx, m.sz) + 3.5;
    minX = Math.min(minX, m.x - rMax); maxX = Math.max(maxX, m.x + rMax);
    minY = Math.min(minY, m.y - m.h * 0.5 - 3.5); maxY = Math.max(maxY, m.y + m.h * 0.5 + 3.5);
    minZ = Math.min(minZ, m.z - rMax); maxZ = Math.max(maxZ, m.z + rMax);
  }

  const field = (x, y, z) => {
    let union = 1e6;
    for (const m of prepped) {
      const dx = x - m.x, dy = y - m.y, dz = z - m.z;
      const lx = (dx * m.c - dz * m.s) / m.sx;
      const lz = (dx * m.s + dz * m.c) / m.sz;
      const a = Math.atan2(lz, lx);
      // Uneven stepped rock crown (never a flat horizontal disc!)
      const crownWave = Math.sin(a * 2 + m.phase) * 1.6 + Math.cos(a * 3 - m.phase * 0.7) * 1.1;
      const outsideCap = Math.abs(dy - crownWave * 0.45) - m.h * 0.5;
      if (outsideCap > union + 2.5) continue;
      const t = Math.max(0, Math.min(1, dy / m.h + 0.5));
      // Stepped cliff strata profile along height t
      const strataStep = Math.sin(t * Math.PI * 3.5 + m.phase) * 0.45;
      const radius = m.rBottom + (m.rTop - m.rBottom) * Math.pow(t, 0.78) + strataStep;
      const radial = Math.hypot(lx, lz);
      const crag = Math.sin(a * 4 + m.phase) * 0.65 + Math.cos(a * 7 + dy * 0.28 - m.phase) * 0.35;
      const side = (radial - radius - crag) * Math.min(m.sx, m.sz);
      const sdf = Math.hypot(Math.max(side, 0), Math.max(outsideCap, 0)) + Math.min(Math.max(side, outsideCap), 0);
      if (sdf < union) union = sdf;
    }
    return union;
  };

  const nx = Math.max(6, Math.round((maxX - minX) / step) + 1);
  const ny = Math.max(6, Math.round((maxY - minY) / step) + 1);
  const nz = Math.max(6, Math.round((maxZ - minZ) / step) + 1);
  const index = (x, y, z) => (z * ny + y) * nx + x;
  const count = nx * ny * nz;
  const values = new Float32Array(count);
  for (let z = 0; z < nz; z++) {
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const v = field(minX + x * step, minY + y * step, minZ + z * step);
        values[index(x, y, z)] = Math.abs(v) < 1e-5 ? 1e-5 : v;
      }
    }
  }

  const positions = [], indices = [], uvs = [], cache = new Map();
  const coord = id => {
    const x = id % nx, q = (id - x) / nx, y = q % ny, z = (q - y) / ny;
    return [minX + x * step, minY + y * step, minZ + z * step];
  };
  const vertex = (a, b) => {
    const lo = Math.min(a, b), hi = Math.max(a, b), key = lo * count + hi;
    const existing = cache.get(key);
    if (existing !== undefined) return existing;
    const p = coord(a), q = coord(b), t = values[a] / (values[a] - values[b]);
    const id = positions.length / 3;
    const px = p[0] + (q[0] - p[0]) * t;
    const py = p[1] + (q[1] - p[1]) * t;
    const pz = p[2] + (q[2] - p[2]) * t;
    positions.push(px, py, pz);
    uvs.push(px / 14, py / 14);
    cache.set(key, id);
    return id;
  };
  const triangle = (a, b, c, direction) => {
    const ai = a * 3, bi = b * 3, ci = c * 3;
    const ux = positions[bi] - positions[ai], uy = positions[bi + 1] - positions[ai + 1], uz = positions[bi + 2] - positions[ai + 2];
    const vx = positions[ci] - positions[ai], vy = positions[ci + 1] - positions[ai + 1], vz = positions[ci + 2] - positions[ai + 2];
    const xx = uy * vz - uz * vy, yy = uz * vx - ux * vz, zz = ux * vy - uy * vx;
    if (xx * xx + yy * yy + zz * zz < 1e-30) return;
    if (xx * direction[0] + yy * direction[1] + zz * direction[2] < 0) indices.push(a, c, b);
    else indices.push(a, b, c);
  };
  const tetrahedra = [[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
  for (let z = 0; z < nz - 1; z++) {
    for (let y = 0; y < ny - 1; y++) {
      for (let x = 0; x < nx - 1; x++) {
        const cube = [index(x,y,z),index(x+1,y,z),index(x+1,y+1,z),index(x,y+1,z),index(x,y,z+1),index(x+1,y,z+1),index(x+1,y+1,z+1),index(x,y+1,z+1)];
        let negative = 0;
        for (const id of cube) if (values[id] < 0) negative++;
        if (negative === 0 || negative === 8) continue;
        for (const tetra of tetrahedra) {
          const inside = [], outside = [];
          for (const corner of tetra) {
            const id = cube[corner];
            (values[id] < 0 ? inside : outside).push(id);
          }
          if (!inside.length || !outside.length) continue;
          const ic = [0,0,0], oc = [0,0,0];
          for (const id of inside) { const p = coord(id); for (let k = 0; k < 3; k++) ic[k] += p[k] / inside.length; }
          for (const id of outside) { const p = coord(id); for (let k = 0; k < 3; k++) oc[k] += p[k] / outside.length; }
          const direction = oc.map((v, k) => v - ic[k]);
          if (inside.length === 1) {
            const v = outside.map(id => vertex(inside[0], id));
            triangle(v[0], v[1], v[2], direction);
          } else if (outside.length === 1) {
            const v = inside.map(id => vertex(outside[0], id));
            triangle(v[0], v[1], v[2], direction);
          } else {
            const a = vertex(inside[0], outside[0]), b = vertex(inside[0], outside[1]), c = vertex(inside[1], outside[1]), d = vertex(inside[1], outside[0]);
            triangle(a, b, c, direction);
            triangle(a, c, d, direction);
          }
        }
      }
    }
  }
  const normals = new Array(positions.length).fill(0);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
    for (const at of [a, b, c]) for (let k = 0; k < 3; k++) normals[at + k] += n[k];
  }
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= len; normals[i + 1] /= len; normals[i + 2] /= len;
  }
  for (let i = 0; i < indices.length; i += 3) {
    [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  }

  const mesh = new BABYLON.Mesh(name, scene);
  const vd = new BABYLON.VertexData();
  vd.positions = positions;
  vd.indices = indices;
  vd.normals = normals;
  vd.uvs = uvs;
  vd.applyToMesh(mesh);
  if (parent) mesh.parent = parent;
  if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
  if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
  if (material) mesh.material = material;
  mesh.receiveShadows = true;
  if (shadowGen) shadowGen.addShadowCaster(mesh, false);
  return mesh;
}

/**
 * Builds a genuine organic floating island fragment using buildGeneratedIsland
 * PLUS a multi-root Marching-Tetrahedra underside cluster so it never looks like a single cone.
 */
function buildSatelliteIsland(scene, { id = 'sat', seed = 101, radiusX = 24, radiusZ = 19, depth = 30, scaleY = 1.18, style = 'forest', parent = null, pos = [0, 0, 0], rot = [0.08, 0.4, -0.06], trees = [], shadowGen = null } = {}) {
  const node = new BABYLON.TransformNode(`satelliteIslandNode_${id}`, scene);
  if (parent) node.parent = parent;
  node.position.set(pos[0], pos[1], pos[2]);
  node.rotation.set(rot[0], rot[1], rot[2]);
  node.scaling.y = scaleY;

  const isl = buildGeneratedIsland(scene, {
    seed,
    radiusX,
    radiusZ,
    topY: 1.6,
    depth,
    style: style === 'military' ? 'forest' : style,
    parent: node,
    shadowGenerator: shadowGen,
  });
  // Rename so offline static-irradiance bake only targets the main hero islands
  isl.terrain.name = `satelliteIsland_${id}_terrain`;
  isl.rock.name = `satelliteIsland_${id}_rock`;
  applyRockProjection(isl.rock.material, scene, style);
  makeSolid(isl.terrain);
  makeSolid(isl.rock);

  // Add offset multi-root stalactite spires to the underside so the silhouette has 3 asymmetric roots (not 1 cone!)
  const rootOffsets = [
    { x: -radiusX * 0.48, y: -depth * 0.62, z: -radiusZ * 0.26, h: depth * 0.82, dTop: radiusX * 0.64, dBot: 1.8 },
    { x: radiusX * 0.45,  y: -depth * 0.58, z: radiusZ * 0.28,  h: depth * 0.76, dTop: radiusX * 0.58, dBot: 1.6 },
  ];
  const rootMesh = buildMarchingRockCluster(scene, `satelliteRoots_${id}`, rootOffsets, {
    step: 2.4, seed: typeof seed === 'number' ? seed : 209, material: isl.rock.material, parent: node, shadowGen,
  });
  makeSolid(rootMesh);

  for (const t of trees) {
    const tx = t.x ?? 0, tz = t.z ?? 0;
    const ty = isl.getHeight(tx, tz);
    instantiateGLBInto(scene, './assets/benchmark/models/trees/', t.file, node, new BABYLON.Vector3(tx, ty - 0.15, tz), t.s ?? 1.15, t.r ?? 0.5, shadowGen);
  }
  return { node, island: isl };
}
function applyWorldRockUVs(mesh, ox, oy, oz, sx, sz, tileSize = 12.0) {
  const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  const norm = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  if (!pos || !norm) return;
  const uvs = new Float32Array((pos.length / 3) * 2);
  for (let i = 0, j = 0; i < pos.length; i += 3, j += 2) {
    const wx = pos[i] * sx + ox;
    const wy = pos[i + 1] + oy;
    const wz = pos[i + 2] * sz + oz;
    const nx = Math.abs(norm[i]);
    const ny = Math.abs(norm[i + 1]);
    const nz = Math.abs(norm[i + 2]);
    if (ny >= nx && ny >= nz) {
      uvs[j] = wx / tileSize;
      uvs[j + 1] = wz / tileSize;
    } else if (nx >= nz) {
      uvs[j] = wz / tileSize;
      uvs[j + 1] = wy / tileSize;
    } else {
      uvs[j] = wx / tileSize;
      uvs[j + 1] = wy / tileSize;
    }
  }
  mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, true);
}

export function enhanceVagabondIsland(asteroidBase, scene, shadowGen = null) {
  if (!asteroidBase || !asteroidBase.group) return;
  const rockMat = makeTerrainPBRMaterial(scene, 'vagabondRockPBR', 'aerial_rocks_02', 1, 1, '#8c8a84');
  applyRockProjection(rockMat, scene, 'military');
  const mossRockMat = makeTerrainPBRMaterial(scene, 'vagabondMossRockPBR', 'aerial_grass_rock', 7, 7, '#a2a684');
  mossRockMat.useMetallnessFromMetallicTextureBlue = false;
  mossRockMat.metallic = 0.0;
  mossRockMat.roughness = 0.92;
  if (mossRockMat.bumpTexture) mossRockMat.bumpTexture.level = 0.95;
  // Upgraded sunlit Interbellum riveted concrete-steel deck slabs (replaces dark polka-dot concrete)
  const concreteMat = new BABYLON.PBRMaterial('vagConcretePBR', scene);
  concreteMat.albedoColor = c3('#ddd6c8');
  concreteMat.metallic = 0.14;
  concreteMat.roughness = 0.72;
  concreteMat.environmentIntensity = 0.65;
  if (scene.getEngine().constructor.name !== 'NullEngine') {
    concreteMat.albedoTexture = makePBRTexture(scene, './assets/textures/nomad/aviation-runway-graphite-v1.jpg', 1, 1, false);
    concreteMat.bumpTexture = makePBRTexture(scene, './assets/benchmark/textures/anti_slip_concrete/nor_gl.jpg', 3, 3, true);
    concreteMat.bumpTexture.level = 0.35;
    const maxAniso = Math.min(8, scene.getEngine()?.getCaps?.().maxAnisotropy || 4);
    concreteMat.albedoTexture.anisotropicFilteringLevel = maxAniso;
  }

  const runwayMat = makeTerrainPBRMaterial(scene, 'vagRunwayPBR', 'anti_slip_concrete', 14, 5, '#8a8d90');
  runwayMat.useMetallnessFromMetallicTextureBlue = false;
  runwayMat.metallic = 0.08;
  runwayMat.roughness = 0.78;
  runwayMat.environmentIntensity = 0.42;
  if (runwayMat.bumpTexture) runwayMat.bumpTexture.level = 0.65;

  // Upgraded Interbellum riveted steel-teal armored deck plates for the upper construction pad & gun collars
  const grateMat = new BABYLON.PBRMaterial('vagabondGratePBR', scene);
  grateMat.albedoColor = c3('#d4d8d6');
  grateMat.metallic = 0.34;
  grateMat.roughness = 0.54;
  grateMat.environmentIntensity = 0.70;
  if (scene.getEngine().constructor.name !== 'NullEngine') {
    grateMat.albedoTexture = makePBRTexture(scene, './assets/textures/nomad/armored-deck-plates.png', 1, 1, false);
    grateMat.bumpTexture = makePBRTexture(scene, './assets/benchmark/textures/metal_grate_rusty/nor_gl.jpg', 2, 2, true);
    grateMat.bumpTexture.level = 0.28;
    const maxAniso = Math.min(8, scene.getEngine()?.getCaps?.().maxAnisotropy || 4);
    grateMat.albedoTexture.anisotropicFilteringLevel = maxAniso;
  }

  if (asteroidBase.rockMesh) {
    asteroidBase.rockMesh.material = rockMat;
    // Shift base rock down/aft so the carved-in hangar mouth at x = -4..+10 is 100% clear!
    asteroidBase.rockMesh.position.set(-24.0, -5.0, 0.0);
    applyWorldRockUVs(asteroidBase.rockMesh, -24.0, -5.0, 0.0, 1.0, 1.0, 11.0);
  }
  // Hide legacy small AsteroidBase props/clutter that would block the 56m runway & hangar mouth
  for (const m of asteroidBase.group.getChildMeshes()) {
    if (!m.name) continue;
    if (m.name.includes('Rock') || m.name.includes('asteroid')) {
      m.material = rockMat;
    } else if (/^(pad|hangar|landingPad|baseWalk|baseTank|baseFuelPipe|baseSteamPipe|baseCrate|sideBridge|streetPole|streetBulb|crane|walkway|rail|piling|crossBeam|steamPipe|crate|house|shop|gh|gen|lantern|beacon|bush|baseEng|chimney|wheel|turret)/i.test(m.name)) {
      m.isVisible = false;
    }
  }

  const vagHullTex = createRustedMetalTexture(scene, [132, 112, 92]);
  vagHullTex.albedoTex.uScale = vagHullTex.albedoTex.vScale = 2.5;
  vagHullTex.bumpTex.uScale = vagHullTex.bumpTex.vScale = 2.5;

  const hullMat = new BABYLON.PBRMaterial('vagHullMat', scene);
  hullMat.albedoTexture = vagHullTex.albedoTex;
  hullMat.bumpTexture = vagHullTex.bumpTex;
  hullMat.bumpTexture.level = 0.85;
  hullMat.albedoColor = c3('#8c7d6b');
  hullMat.metallic = 0.42;
  hullMat.roughness = 0.54;
  hullMat.environmentIntensity = 0.42;

  const pipeMat = new BABYLON.PBRMaterial('vagabondPipeMat', scene);
  pipeMat.bumpTexture = vagHullTex.bumpTex;
  pipeMat.bumpTexture.level = 1.1;
  pipeMat.albedoColor = c3('#4a433d');
  pipeMat.metallic = 0.64;
  pipeMat.roughness = 0.42;
  pipeMat.environmentIntensity = 0.46;

  const hazardMat = new BABYLON.PBRMaterial('vagHazardMat', scene);
  hazardMat.bumpTexture = vagHullTex.bumpTex;
  hazardMat.bumpTexture.level = 0.9;
  hazardMat.albedoColor = c3('#d99b26');
  hazardMat.metallic = 0.14;
  hazardMat.roughness = 0.68;
  hazardMat.zOffset = -2;

  const bannerMat = new BABYLON.PBRMaterial('vagBannerMat', scene);
  bannerMat.albedoColor = c3('#9e3328');
  bannerMat.metallic = 0.04;
  bannerMat.roughness = 0.90;

  const copperMat = new BABYLON.PBRMaterial('vagCopperMat', scene);
  copperMat.bumpTexture = vagHullTex.bumpTex;
  copperMat.bumpTexture.level = 0.85;
  copperMat.albedoColor = c3('#c87e44');
  copperMat.metallic = 0.86;
  copperMat.roughness = 0.28;

  const darkCavernMat = new BABYLON.StandardMaterial('vagDarkCavernMat', scene);
  darkCavernMat.diffuseColor = c3('#121418');
  darkCavernMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  const warmGlowMat = new BABYLON.StandardMaterial('vagWarmGlowMat', scene);
  warmGlowMat.emissiveColor = c3('#ffbe5e');
  warmGlowMat.diffuseColor = c3('#ffe0a0');

  const beaconMat = new BABYLON.StandardMaterial('vagBeaconMat', scene);
  beaconMat.emissiveColor = c3('#ff4838');

  const etherCoreMat = new BABYLON.StandardMaterial('vagEtherCoreMat', scene);
  etherCoreMat.emissiveColor = c3('#3ad8ff');
  etherCoreMat.diffuseColor = c3('#6ae8ff');

  // ---------------------------------------------------------------------------
  // 1. MASSIVE 1.5x 3-TIER FLYING ROCK MOUNTAIN (crisp CC0 PBR textures, deep keel)
  //    Upper Plateau at y = 20.5 (~54m wide, huge construction yard!)
  //    Mid Terraces at y = 13.5..15.0 | Hangar & 56m Runway at y = 3.35
  // ---------------------------------------------------------------------------
  const rockMasses = [
    // Upper-level mountain core shifted aft (x = -29, back of hangar) so the hangar bay is wide open!
    { x: -29.0, y: 10.5,  z: 0.0,   h: 20.0, dTop: 48.0, dBot: 50.0, sx: 1.0,  sz: 1.08, ry: 0.2 },
    { x: -34.0, y: 9.0,   z: -14.0, h: 22.0, dTop: 32.0, dBot: 36.0, sx: 1.0,  sz: 1.0,  ry: 0.8 },
    { x: -34.0, y: 9.0,   z: 14.0,  h: 22.0, dTop: 32.0, dBot: 36.0, sx: 1.0,  sz: 1.0,  ry: -0.7 },
    // Side cliff buttresses framing the carved-in Hangar Portal (leaving z = -10..+10 completely clear!)
    { x: -3.0,  y: 10.0,  z: -21.5, h: 21.0, dTop: 21.0, dBot: 23.0, sx: 1.15, sz: 0.92, ry: 0.4 },
    { x: -3.0,  y: 10.0,  z: 21.5,  h: 21.0, dTop: 21.0, dBot: 23.0, sx: 1.15, sz: 0.92, ry: -0.4 },
    // Rock brow arch directly OVER the hangar portal (y = 17.8, above the 11m hangar ceiling!)
    { x: -5.5,  y: 17.8,  z: 0.0,   h: 5.5,  dTop: 24.0, dBot: 26.0, sx: 0.95, sz: 1.12, ry: 0.0 },
    // Solid rock pinnacles supporting the Mid-Level Turret & Radar Terraces
    { x: 16.0,  y: 4.5,   z: 25.0,  h: 19.0, dTop: 15.0, dBot: 10.0, sx: 1.0,  sz: 1.0,  ry: 0.5 },
    { x: 14.0,  y: 5.0,   z: -26.0, h: 21.0, dTop: 14.5, dBot: 9.5,  sx: 1.0,  sz: 1.0,  ry: -0.6 },
    // Lower rock hull strictly BELOW the runway/hangar floor — sleek flatter carrier-slab profile (not a tall iceberg!)
    { x: -4.0,  y: -3.5,  z: 0.0,   h: 13.5, dTop: 52.0, dBot: 36.0, sx: 1.15, sz: 0.98, ry: 0.1 },
    // Sleek tapered carrier keel (bottom around y = -22 instead of -52 -> unmistakable flat-top sky-carrier proportions!)
    { x: -16.0, y: -11.5, z: 0.0,   h: 20.0, dTop: 48.0, dBot: 16.0, sx: 1.18, sz: 1.02, ry: 0.2 },
    { x: 6.0,   y: -9.5,  z: -8.0,  h: 16.0, dTop: 22.0, dBot: 8.0,  sx: 1.05, sz: 0.95, ry: 0.6 },
    { x: 6.0,   y: -9.5,  z: 8.0,   h: 16.0, dTop: 22.0, dBot: 8.0,  sx: 1.05, sz: 0.95, ry: -0.6 },
    { x: -34.0, y: -9.0,  z: 0.0,   h: 17.0, dTop: 28.0, dBot: 10.0, sx: 1.10, sz: 1.05, ry: 0.8 },
    { x: 16.0,  y: -7.5,  z: 18.0,  h: 14.0, dTop: 14.0, dBot: 5.0,  sx: 1.0,  sz: 1.0,  ry: 0.4 },
    { x: 15.0,  y: -7.5,  z: -19.0, h: 14.0, dTop: 14.0, dBot: 5.0,  sx: 1.0,  sz: 1.0,  ry: -0.4 },
    // Broadened aft & side hull shoulders for elongated carrier deck footprint
    { x: -46.0, y: 10.5,  z: 0.0,   h: 19.0, dTop: 18.0, dBot: 10.0, sx: 1.15, sz: 1.30, ry: 0.2 },
    { x: -36.0, y: 1.5,   z: 24.0,  h: 18.0, dTop: 16.0, dBot: 7.0,  sx: 1.05, sz: 1.0,  ry: -0.5 },
    { x: -36.0, y: 1.5,   z: -24.0, h: 18.0, dTop: 16.0, dBot: 7.0,  sx: 1.05, sz: 1.0,  ry: 0.5 },
    { x: -12.0, y: 4.0,   z: 28.0,  h: 16.0, dTop: 15.0, dBot: 6.5,  sx: 1.1,  sz: 0.92, ry: 0.2 },
    { x: -12.0, y: 4.0,   z: -28.0, h: 16.0, dTop: 15.0, dBot: 6.5,  sx: 1.1,  sz: 0.92, ry: -0.2 },
  ];
  // Broad organic shoulders shelter the four-bay cavern; no external box hangar.
  rockMasses.push(
    {x:-30,y:8,z:10,h:24,dTop:50,dBot:52,sx:1,sz:1,ry:.08},
    {x:-8,y:8,z:28,h:22,dTop:32,dBot:36,sx:1.1,sz:.70,ry:.05}
  );
  rockMasses.forEach((b, i) => {
    const blk = BABYLON.MeshBuilder.CreateCylinder(
      `vagCarrierRock_${i}`,
      { diameterTop: b.dTop, diameterBottom: b.dBot, height: b.h, tessellation: 14, subdivisions: 4 },
      scene
    );
    blk.parent = asteroidBase.group;
    blk.position.set(b.x, b.y, b.z);
    blk.scaling.set(b.sx, 1.0, b.sz);
    blk.rotation.y = b.ry;
    sculptCraggyRock(blk, i + 1.5, 0.25);
    applyWorldRockUVs(blk, b.x, b.y, b.z, b.sx, b.sz, 9.0);
    blk.material = rockMat;
    blk.receiveShadows = true;
    if (shadowGen) shadowGen.addShadowCaster(blk, false);
  });

  // Mossy grass-rock ledges on the upper plateau rim (y = 19.7 so zero z-fighting with upperDeck at y = 20.85)
  const mossCap = BABYLON.MeshBuilder.CreateCylinder('vagUpperMossRim', { diameterTop: 55.0, diameterBottom: 57.5, height: 0.9, tessellation: 16 }, scene);
  mossCap.parent = asteroidBase.group;
  mossCap.position.set(-18.0, 19.7, 0.0);
  applyWorldRockUVs(mossCap, -18.0, 19.7, 0.0, 1.0, 1.0, 9.0);
  mossCap.material = mossRockMat;
  mossCap.receiveShadows = true;

  // Twin sleek cruiser-carrier lift rotors hugging the shallow cruiser keel!
  const keelRotorHub = createGiantIslandLiftRotor(asteroidBase.group, scene, -10.0, -11.5, 0.0, 30.0, shadowGen);
  const bowRotorHub = createGiantIslandLiftRotor(asteroidBase.group, scene, 26.0, -4.5, 0.0, 18.0, null);
  if (asteroidBase.engineRotors) asteroidBase.engineRotors.push(keelRotorHub, bowRotorHub);

  // Iconic twin port/starboard armored Sky-Carrier Thruster Nacelles + 1930s raked naval funnel (merged into 2 draw calls!)
  const carrierSteelParts = [], carrierBrassParts = [];
  for (const side of [-1, 1]) {
    const nz = side * 32.0;
    const pod = BABYLON.MeshBuilder.CreateCylinder(`vagNacelle_${side}`, { diameterTop: 4.8, diameterBottom: 6.4, height: 18.0, tessellation: 12 }, scene);
    pod.position.set(-20.0, 8.5, nz); pod.rotation.z = Math.PI * 0.5; pod.computeWorldMatrix(true); carrierSteelParts.push(pod);
    const pylon = BABYLON.MeshBuilder.CreateBox(`vagNacellePylon_${side}`, { width: 9.5, height: 2.4, depth: 8.5 }, scene);
    pylon.position.set(-20.0, 8.5, side * 26.5); pylon.computeWorldMatrix(true); carrierSteelParts.push(pylon);
    const ringF = BABYLON.MeshBuilder.CreateTorus(`vagNacelleRingF_${side}`, { diameter: 5.4, thickness: 0.55, tessellation: 16 }, scene);
    ringF.position.set(-11.2, 8.5, nz); ringF.rotation.z = Math.PI * 0.5; ringF.computeWorldMatrix(true); carrierBrassParts.push(ringF);
    const ringR = BABYLON.MeshBuilder.CreateTorus(`vagNacelleRingR_${side}`, { diameter: 6.2, thickness: 0.55, tessellation: 16 }, scene);
    ringR.position.set(-28.8, 8.5, nz); ringR.rotation.z = Math.PI * 0.5; ringR.computeWorldMatrix(true); carrierBrassParts.push(ringR);
    const exhaust = BABYLON.MeshBuilder.CreateDisc(`vagNacelleGlow_${side}`, { radius: 2.4, tessellation: 12 }, scene);
    exhaust.parent = asteroidBase.group; exhaust.position.set(-29.2, 8.5, nz); exhaust.rotation.y = Math.PI * 0.5;
    exhaust.material = warmGlowMat; exhaust.isPickable = false;
  }
  // Raked 1930s naval aircraft-carrier funnel/smokestack beside the Control Tower (port flank)
  const funnel = BABYLON.MeshBuilder.CreateCylinder('vagNavalFunnel', { diameterTop: 2.8, diameterBottom: 3.8, height: 11.5, tessellation: 12 }, scene);
  funnel.position.set(-35.5, 26.8, -19.5); funnel.rotation.z = 0.14; funnel.computeWorldMatrix(true); carrierSteelParts.push(funnel);
  for (const fy of [29.6, 31.2]) {
    const band = BABYLON.MeshBuilder.CreateTorus(`vagFunnelBand_${fy}`, { diameter: 3.1, thickness: 0.24, tessellation: 14 }, scene);
    band.position.set(-35.5 - (fy - 26.8) * 0.14, fy, -19.5); band.rotation.z = 0.14; band.computeWorldMatrix(true); carrierBrassParts.push(band);
  }
  // Outboard flight-deck catwalk sponsons along both edges of the runway (classic naval carrier silhouette!)
  for (const side of [-1, 1]) {
    const catwalk = BABYLON.MeshBuilder.CreateBox(`vagCarrierCatwalk_${side}`, { width: 52.0, height: 0.45, depth: 2.2 }, scene);
    catwalk.position.set(32.0, 2.55, side * 11.1); catwalk.computeWorldMatrix(true); carrierSteelParts.push(catwalk);
    const coaming = BABYLON.MeshBuilder.CreateBox(`vagCarrierCoaming_${side}`, { width: 52.0, height: 0.22, depth: 0.18 }, scene);
    coaming.position.set(32.0, 3.05, side * 12.1); coaming.computeWorldMatrix(true); carrierBrassParts.push(coaming);
  }
  const mCarrierSteel = BABYLON.Mesh.MergeMeshes(carrierSteelParts, true, true, undefined, false, false);
  if (mCarrierSteel) { mCarrierSteel.name = 'vagCarrierHullKit'; mCarrierSteel.parent = asteroidBase.group; mCarrierSteel.material = hullMat; mCarrierSteel.receiveShadows = true; mCarrierSteel.isPickable = false; }
  const mCarrierBrass = BABYLON.Mesh.MergeMeshes(carrierBrassParts, true, true, undefined, false, false);
  if (mCarrierBrass) { mCarrierBrass.name = 'vagCarrierBrassTrim'; mCarrierBrass.parent = asteroidBase.group; mCarrierBrass.material = copperMat; mCarrierBrass.isPickable = false; }

  // ---------------------------------------------------------------------------
  // 2. LOWER LEVEL (y = 3.35): CARVED-IN HANGAR PORTAL + 64m AIRCRAFT CARRIER FLIGHT DECK
  // ---------------------------------------------------------------------------
  const runway = BABYLON.MeshBuilder.CreateBox('vagCarrierRunway', { width: 64.0, height: 1.4, depth: 20.0 }, scene);
  runway.parent = asteroidBase.group;
  runway.position.set(32.0, 2.68, 0.0);
  runway.material = runwayMat;
  runway.receiveShadows = true;
  if (shadowGen) shadowGen.addShadowCaster(runway, false);

  // Painted naval carrier hull stencil "01" on the flight deck bow (unmistakable aircraft-carrier identity from the air!)
  if (!(scene.getEngine() instanceof BABYLON.NullEngine) && typeof document !== 'undefined') {
    const nTex = new BABYLON.DynamicTexture('vagCarrierDeckNumTex', { width: 256, height: 256 }, scene, false);
    const nCtx = nTex.getContext();
    nCtx.clearRect(0, 0, 256, 256);
    nCtx.fillStyle = 'rgba(236, 224, 192, 0.78)';
    nCtx.font = 'bold 165px "Georgia", serif';
    nCtx.textAlign = 'center';
    nCtx.textBaseline = 'middle';
    nCtx.fillText('01', 128, 134);
    nTex.update();
    nTex.hasAlpha = true;
    const nMat = new BABYLON.StandardMaterial('vagCarrierDeckNumMat', scene);
    nMat.diffuseTexture = nTex;
    nMat.useAlphaFromDiffuseTexture = true;
    nMat.emissiveColor = c3('#8c826c');
    nMat.disableLighting = true;
    nMat.depthWrite = false;
    const numPlane = BABYLON.MeshBuilder.CreatePlane('vagCarrierDeckNumber01', { width: 10.5, height: 10.5 }, scene);
    numPlane.parent = asteroidBase.group;
    numPlane.position.set(58.2, 3.43, 0.0);
    numPlane.rotation.set(Math.PI * 0.5, -Math.PI * 0.5, 0);
    numPlane.material = nMat;
    numPlane.isPickable = false;
  }

  // Heavy steel trusses & concrete piers anchoring the cantilevered runway into the cliff
  for (const rz of [-8.4, 8.4]) {
    const beam = BABYLON.MeshBuilder.CreateBox(`vagRunwayBeam_${rz}`, { width: 46.0, height: 1.5, depth: 1.3 }, scene);
    beam.parent = asteroidBase.group;
    beam.position.set(27.0, 1.35, rz);
    beam.material = pipeMat;

    const strut = BABYLON.MeshBuilder.CreateBox(`vagRunwayStrut_${rz}`, { width: 28.0, height: 1.3, depth: 1.2 }, scene);
    strut.parent = asteroidBase.group;
    strut.position.set(20.0, -4.5, rz);
    strut.rotation.z = 0.44;
    strut.material = pipeMat;
  }

  // Carrier Arrestor Wires across the runway deck (catch landing aircraft smoothly!)
  for (const ax of [24.0, 30.0, 36.0]) {
    const wire = BABYLON.MeshBuilder.CreateCylinder(`vagArrestorWire_${ax}`, { diameter: 0.10, height: 18.4, tessellation: 6 }, scene);
    wire.parent = asteroidBase.group;
    wire.rotation.x = Math.PI * 0.5;
    wire.position.set(ax, 3.43, 0.0);
    wire.material = pipeMat;
    wire.isPickable = false;
  }

  // Runway Deck Signal Officer (LSO) with glowing marshaling wands on the port apron
  const lsoRoot = new BABYLON.TransformNode('vagLsoOfficer', scene);
  lsoRoot.parent = asteroidBase.group;
  lsoRoot.position.set(12.5, 3.38, -8.5);
  lsoRoot.rotation.y = 0.35;
  const lsoBody = BABYLON.MeshBuilder.CreateCylinder('vagLsoBody', { diameterTop: 0.44, diameterBottom: 0.52, height: 1.35, tessellation: 8 }, scene);
  lsoBody.parent = lsoRoot; lsoBody.position.y = 0.85; lsoBody.material = hazardMat; lsoBody.isPickable = false;
  const lsoHead = BABYLON.MeshBuilder.CreateSphere('vagLsoHead', { diameter: 0.36, segments: 6 }, scene);
  lsoHead.parent = lsoRoot; lsoHead.position.y = 1.72; lsoHead.material = hullMat; lsoHead.isPickable = false;
  const lsoArms = [];
  for (const side of [-1, 1]) {
    const armPiv = new BABYLON.TransformNode(`vagLsoArm_${side}`, scene);
    armPiv.parent = lsoRoot;
    armPiv.position.set(side * 0.32, 1.38, 0);
    const arm = BABYLON.MeshBuilder.CreateCylinder(`vagLsoArmMesh_${side}`, { diameter: 0.13, height: 0.65, tessellation: 6 }, scene);
    arm.parent = armPiv; arm.position.set(side * 0.18, 0.25, 0); arm.rotation.z = side * -0.55; arm.material = hullMat; arm.isPickable = false;
    const wand = BABYLON.MeshBuilder.CreateCylinder(`vagLsoWand_${side}`, { diameter: 0.08, height: 0.52, tessellation: 6 }, scene);
    wand.parent = armPiv; wand.position.set(side * 0.42, 0.58, 0); wand.rotation.z = side * -0.35; wand.material = warmGlowMat; wand.isPickable = false;
    lsoArms.push(armPiv);
  }
  asteroidBase.lsoArms = lsoArms;

  // Yellow-black hazard threshold at the runway bow (x = 55) + aiming chevron ("V") + centerline dashes
  const endHazard = BABYLON.MeshBuilder.CreateBox('vagRunwayThreshold', { width: 2.2, height: 0.14, depth: 19.5 }, scene);
  endHazard.parent = asteroidBase.group;
  endHazard.position.set(54.8, 3.48, 0.0);
  endHazard.material = hazardMat;

  const rwDashParts = [];
  for (const side of [-1, 1]) {
    const chev = BABYLON.MeshBuilder.CreateBox(`vagRunwayChev_${side}`, { width: 5.2, height: 0.12, depth: 0.85 }, scene);
    chev.position.set(49.5, 3.48, side * 3.1);
    chev.rotation.y = side * 0.52;
    chev.computeWorldMatrix(true);
    rwDashParts.push(chev);
  }
  for (let rx = 8; rx <= 44; rx += 6.0) {
    const mark = BABYLON.MeshBuilder.CreateBox(`vagRunwayDash_${rx}`, { width: 3.2, height: 0.12, depth: 0.75 }, scene);
    mark.position.set(rx, 3.47, 0.0);
    mark.computeWorldMatrix(true);
    rwDashParts.push(mark);
  }
  const mergedRwDashes = BABYLON.Mesh.MergeMeshes(rwDashParts, true, true, undefined, false, false);
  if (mergedRwDashes) {
    mergedRwDashes.name = 'vagRunwayDashes';
    mergedRwDashes.parent = asteroidBase.group;
    mergedRwDashes.material = hazardMat;
    mergedRwDashes.isPickable = false;
  }

  // Runway edge lights & safety railings (with chasing approach-light animation!)
  asteroidBase._runwayLamps = [];
  let rwIdx = 0;
  for (let lx = 9; lx <= 53; lx += 7.2) {
    for (const lz of [-9.5, 9.5]) {
      const post = BABYLON.MeshBuilder.CreateCylinder(`vagRwPost_${lx}_${lz}`, { diameter: 0.26, height: 1.1, tessellation: 6 }, scene);
      post.parent = asteroidBase.group;
      post.position.set(lx, 3.9, lz);
      post.material = pipeMat;

      const lamp = BABYLON.MeshBuilder.CreateSphere(`vagRwLamp_${lx}_${lz}`, { diameter: 0.44, segments: 6 }, scene);
      lamp.parent = post;
      lamp.position.y = 0.62;
      lamp.material = warmGlowMat;
      asteroidBase._runwayLamps.push({ mesh: lamp, idx: rwIdx });
    }
    rwIdx++;
  }

  // Sagging Interbellum catenary cables spanning Control Tower <-> Generator <-> Hangar Lintel (1 merged draw call!)
  const cableSpans = [
    [new BABYLON.Vector3(-28, 31.2, -22.5), new BABYLON.Vector3(-28, 27.5, 20.5), 2.6],
    [new BABYLON.Vector3(-28, 29.8, -22.5), new BABYLON.Vector3(3.5, 16.5, -9.8), 2.8],
    [new BABYLON.Vector3(-28, 26.8, 20.5),  new BABYLON.Vector3(3.5, 16.5, 11.8), 2.6],
  ];
  const cableMeshes = [];
  cableSpans.forEach(([pA, pB, sag], cIdx) => {
    const pts = [];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      const p = BABYLON.Vector3.Lerp(pA, pB, t);
      p.y -= Math.sin(t * Math.PI) * sag;
      pts.push(p);
    }
    const tube = BABYLON.MeshBuilder.CreateTube(`vagCable_${cIdx}`, { path: pts, radius: 0.075, tessellation: 6 }, scene);
    tube.computeWorldMatrix(true);
    cableMeshes.push(tube);
  });
  const mergedCables = BABYLON.Mesh.MergeMeshes(cableMeshes, true, true, undefined, false, false);
  if (mergedCables) {
    mergedCables.name = 'vagCatenaryCables';
    mergedCables.parent = asteroidBase.group;
    mergedCables.material = pipeMat;
    mergedCables.isPickable = false;
  }

  // Two fluttering Interbellum crimson-ochre deck pennants on upper deck edge
  asteroidBase._pennants = [];
  for (const [px, py, pz] of [[-23.0, 23.4, -12.0], [3.0, 23.4, 12.0]]) {
    const piv = new BABYLON.TransformNode(`vagPennantPivot_${px}`, scene);
    piv.parent = asteroidBase.group; piv.position.set(px, py + 1.1, pz);
    const mast = BABYLON.MeshBuilder.CreateCylinder(`vagPennantMast_${px}`, { diameter: 0.10, height: 2.2, tessellation: 6 }, scene);
    mast.parent = asteroidBase.group; mast.position.set(px, py, pz); mast.material = pipeMat; mast.isPickable = false;
    const flag = BABYLON.MeshBuilder.CreateBox(`vagPennantCloth_${px}`, { width: 1.9, height: 0.65, depth: 0.04 }, scene);
    flag.parent = piv; flag.position.set(0.95, 0, 0); flag.material = bannerMat; flag.isPickable = false;
    asteroidBase._pennants.push(piv);
  }

  // Carved-In Hangar Portal recessed into the cliff face (x = -14..+5, z = -10..+10)
  const hangarNode = new BABYLON.TransformNode('vagHangarNode', scene);
  hangarNode.parent = asteroidBase.group;
  hangarNode.position.set(-3.5, 3.35, 0.0);

  // Rear wall closes the actual excavated bay at x=-19, behind the complete floor.
  const hCavernBack = BABYLON.MeshBuilder.CreateBox('vagHangarBack', { width: 1.0, height: 11.92, depth: 38.0 }, scene);
  hCavernBack.parent = hangarNode;
  hCavernBack.position.set(-35.0, 5.99, 10.0);
  const bulkhead=new BABYLON.PBRMaterial('hangarPaintedBulkhead',scene);
  bulkhead.albedoTexture=new BABYLON.Texture('./assets/textures/nomad/hangar-bulkhead.webp',scene);
  bulkhead.roughness=.84;bulkhead.metallic=.18;
  function paintBulkhead(mesh, horizontalAxis, length) {
    const xyz=mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const uv=mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
    for(let i=0;i<xyz.length/3;i++){
      uv[2*i]=xyz[3*i+horizontalAxis]/length+.5;
      uv[2*i+1]=xyz[3*i+1]/11.92+.5;
    }
    mesh.setVerticesData(BABYLON.VertexBuffer.UVKind,uv);
    mesh.material=bulkhead;
  }
  paintBulkhead(hCavernBack,2,38);

  const hCavernCeil = BABYLON.MeshBuilder.CreateBox('vagHangarCeil', { width: 40.4, height: 1.4, depth: 37.8 }, scene);
  hCavernCeil.parent = hangarNode;
  hCavernCeil.position.set(-14.3, 12.65, 10.0);
  hCavernCeil.material = pipeMat;

  [-9.8, 29.9].forEach((wz, idx) => {
    // Butt joint at local x=-15.5 (base x=-19), without overlapping rear caps.
    const hWall = BABYLON.MeshBuilder.CreateBox(`vagHangarSide_${idx}`, { width: 40.4, height: 11.92, depth: 1.8 }, scene);
    hWall.parent = hangarNode;
    hWall.position.set(-14.3, 5.99, wz);
    paintBulkhead(hWall,0,40.4);

    const pillar = BABYLON.MeshBuilder.CreateBox(`vagHangarPillar_${idx}`, { width: 2.6, height: 12.0, depth: idx===0?1.3:2.6 }, scene);
    pillar.parent = hangarNode;
    pillar.position.set(7.2, 6.03, idx===0?-10.1:11.9);
    pillar.material = hullMat;
    if (shadowGen) shadowGen.addShadowCaster(pillar, false);
  });

  const northFacade=BABYLON.MeshBuilder.CreateBox('vagHangarNorthFacade',{width:.8,height:11.92,depth:17.6},scene);
  northFacade.parent=asteroidBase.group;northFacade.position.set(2.8,9.34,22.0);northFacade.material=concreteMat;northFacade.receiveShadows=true;
  const lintel = BABYLON.MeshBuilder.CreateBox('vagHangarLintel', { width: 3.0, height: 2.6, depth: 23.8 }, scene);
  lintel.parent = hangarNode;
  lintel.position.set(7.2, 12.65, .65);
  lintel.material = hullMat;
  if (shadowGen) shadowGen.addShadowCaster(lintel, false);

  for (const hx of [-4.5, 1.0, 6.0]) {
    const strip = BABYLON.MeshBuilder.CreateBox(`vagHangarLight_${hx}`, { width: 0.85, height: 0.3, depth: 13.0 }, scene);
    strip.parent = hangarNode;
    strip.position.set(hx, 11.82, 0.0);
    strip.material = warmGlowMat;
  }

  if (scene.getEngine().constructor.name !== 'NullEngine') {
    const hLight = new BABYLON.PointLight('vagHangarFlood', new BABYLON.Vector3(1.5, 8.2, 0.0), scene);
    hLight.parent = hangarNode;
    hLight.diffuse = c3('#ffbe6a');
    hLight.intensity = 4.6;
    hLight.range = 40;
  }

  // ---------------------------------------------------------------------------
  // 3. MID LEVEL (y = 13.8..15.2): DEFENSE TURRET TERRACE + LONG-RANGE RADAR (РЛС)
  // ---------------------------------------------------------------------------
  const turretPlat = new BABYLON.TransformNode('vagTurretPlatform', scene);
  turretPlat.parent = asteroidBase.group;
  turretPlat.position.set(-2.0, 21.2, 17.5);

  const tPad = BABYLON.MeshBuilder.CreateCylinder('vagTurretPad', { diameterTop: 6.0, diameterBottom: 5.5, height: 0.6, tessellation: 14 }, scene);
  tPad.parent = turretPlat;
  tPad.material = concreteMat;
  tPad.receiveShadows = true;

  const turretCollar = BABYLON.MeshBuilder.CreateCylinder('vagTurretMountCollar',{diameter:5.6,height:.18,tessellation:14},scene);
  turretCollar.parent=turretPlat;turretCollar.position.y=.35;turretCollar.material=grateMat;turretCollar.receiveShadows=true;
  const turretRim = BABYLON.MeshBuilder.CreateTorus('vagTurretPadRim', { diameter: 5.9, thickness: 0.18, tessellation: 20 }, scene);
  turretRim.parent = turretPlat; turretRim.position.y = 0.30; turretRim.material = copperMat; turretRim.isPickable = false;
  // Authentic WWII 8.8cm FlaK 36/37 anti-aircraft battery mounted cleanly on aft-starboard superstructure (flight deck 100% clear!)
  const mainFlak = buildFlak88Turret(scene, 'vagFlak88Main', turretPlat, new BABYLON.Vector3(0, 0.45, 0), 0.35, shadowGen);
  asteroidBase.flakTurrets = [mainFlak];

  // Dual Port & Starboard Sculpted Interbellum Quad-Tube SAM Batteries (ЗРК ПВО)
  const vagSamPort = buildSculptedSamLauncher(scene, 'vagSamPort', asteroidBase.group, new BABYLON.Vector3(-12.0, 21.35, -17.5), shadowGen);
  vagSamPort.base.scaling.setAll(1.12);
  const vagSamStbd = buildSculptedSamLauncher(scene, 'vagSamStbd', asteroidBase.group, new BABYLON.Vector3(-12.0, 21.35, 17.5), shadowGen);
  vagSamStbd.base.scaling.setAll(1.12);
  asteroidBase.samLaunchers = [vagSamPort, vagSamStbd];

  const radarPlat = new BABYLON.TransformNode('vagRadarPlatform', scene);
  radarPlat.parent = asteroidBase.group;
  radarPlat.position.set(-2.0, 21.2, -17.5);

  const rPad = BABYLON.MeshBuilder.CreateCylinder('vagRadarPad', { diameterTop: 5.8, diameterBottom: 5.4, height: 0.6, tessellation: 14 }, scene);
  rPad.parent = radarPlat;
  rPad.material = concreteMat;
  rPad.receiveShadows = true;

  const radarCollar = BABYLON.MeshBuilder.CreateCylinder('vagRadarMountCollar',{diameter:5.4,height:.18,tessellation:14},scene);
  radarCollar.parent=radarPlat;radarCollar.position.y=.35;radarCollar.material=grateMat;radarCollar.receiveShadows=true;
  const radarRim = BABYLON.MeshBuilder.CreateTorus('vagRadarPadRim', { diameter: 5.7, thickness: 0.18, tessellation: 20 }, scene);
  radarRim.parent = radarPlat; radarRim.position.y = 0.30; radarRim.material = copperMat; radarRim.isPickable = false;

  // Sculpted Interbellum Würzburg-Riese Parabolic Lattice Radar on aft-port superstructure (flight deck 100% clear!)
  const vagRadar = buildSculptedRadar(scene, 'vagRadar', radarPlat, new BABYLON.Vector3(0, 0.42, 0), shadowGen);
  vagRadar.rotor.name = 'vagRadarRotor';
  asteroidBase._radarRotor = vagRadar.rotor;

  // ---------------------------------------------------------------------------
  // 4. UPPER LEVEL (y = 20.5): HUGE 66m FLAT-TOP CARRIER SHIPYARD DECK + TOWER + WORKSHOP
  // ---------------------------------------------------------------------------
  const upperDeck = BABYLON.MeshBuilder.CreateCylinder('vagUpperCourtyard', { diameter: 66.0, height: 1.0, tessellation: 28 }, scene);
  upperDeck.parent = asteroidBase.group;
  upperDeck.position.set(-22.0, 20.85, 0.0);
  applyWorldRockUVs(upperDeck, -22.0, 20.85, 0.0, 1.0, 1.0, 8.5);
  upperDeck.material = concreteMat;
  upperDeck.receiveShadows = true;

  // Brass perimeter coaming ring around the 66m upper carrier deck
  const upperRim = BABYLON.MeshBuilder.CreateTorus('vagUpperDeckRim', { diameter: 65.8, thickness: 0.36, tessellation: 40 }, scene);
  upperRim.parent = asteroidBase.group;
  upperRim.position.set(-22.0, 21.35, 0.0);
  upperRim.material = copperMat;
  upperRim.isPickable = false;

  // Forward Construction Zone pad (~28m x 26m) + Huge Aft Carrier Expansion Deck (~24m x 36m) in riveted armored plating!
  const buildZone = BABYLON.MeshBuilder.CreateBox('vagBuildZone', { width: 28.0, height: 0.36, depth: 26.0 }, scene);
  buildZone.parent = asteroidBase.group;
  buildZone.position.set(-10.0, 21.55, 0.0);
  applyWorldRockUVs(buildZone, -10.0, 21.55, 0.0, 1.0, 1.0, 4.8);
  buildZone.material = grateMat;
  buildZone.receiveShadows = true;

  const buildZoneAft = BABYLON.MeshBuilder.CreateBox('vagBuildZoneAft', { width: 24.0, height: 0.36, depth: 28.0 }, scene);
  buildZoneAft.parent = asteroidBase.group;
  buildZoneAft.position.set(-36.0, 21.55, -1.0);
  applyWorldRockUVs(buildZoneAft, -36.0, 21.55, -1.0, 1.0, 1.0, 4.8);
  buildZoneAft.material = grateMat;
  buildZoneAft.receiveShadows = true;

  // Ochre/brass perimeter hazard framing strips around the construction pad
  const bzTrimParts = [];
  for (const [tx, tz, tw, td] of [
    [-10.0, -12.85, 28.2, 0.32], [-10.0, 12.85, 28.2, 0.32],
    [-23.85, 0.0, 0.32, 26.0],   [3.85, 0.0, 0.32, 26.0],
  ]) {
    const strip = BABYLON.MeshBuilder.CreateBox(`vagBzTrim_${tx}_${tz}`, { width: tw, height: 0.08, depth: td }, scene);
    strip.position.set(tx, 21.77, tz);
    strip.computeWorldMatrix(true);
    bzTrimParts.push(strip);
  }
  const bzTrim = BABYLON.Mesh.MergeMeshes(bzTrimParts, true, true, undefined, false, false);
  if (bzTrim) { bzTrim.name = 'vagBuildZoneTrim'; bzTrim.parent = asteroidBase.group; bzTrim.material = hazardMat; bzTrim.isPickable = false; }

  const pylonParts = [], capParts = [];
  [[-23.0, -12.0], [3.0, -12.0], [-23.0, 12.0], [3.0, 12.0]].forEach(([bx, bz], idx) => {
    const pylon = BABYLON.MeshBuilder.CreateCylinder(`vagBuildPylon_${idx}`, { diameter: 0.52, height: 1.8, tessellation: 8 }, scene);
    pylon.position.set(bx, 22.5, bz); pylon.computeWorldMatrix(true); pylonParts.push(pylon);
    const cap = BABYLON.MeshBuilder.CreateSphere(`vagBuildCap_${idx}`, { diameter: 0.44, segments: 6 }, scene);
    cap.position.set(bx, 23.45, bz); cap.computeWorldMatrix(true); capParts.push(cap);
  });
  const mPylons = BABYLON.Mesh.MergeMeshes(pylonParts, true, true, undefined, false, false);
  if (mPylons) { mPylons.name = 'vagBuildPylons'; mPylons.parent = asteroidBase.group; mPylons.material = hazardMat; mPylons.isPickable = false; }
  const mCaps = BABYLON.Mesh.MergeMeshes(capParts, true, true, undefined, false, false);
  if (mCaps) { mCaps.name = 'vagBuildCaps'; mCaps.parent = asteroidBase.group; mCaps.material = warmGlowMat; mCaps.isPickable = false; }

  // 4A. Rotating Aviation Lighthouse Beacon perched atop the 1930s Cruiser Bridge Director (x = -54, y = 41.2, z = 0)
  const beaconRig = new BABYLON.TransformNode('vagTowerBeaconRig', scene);
  beaconRig.parent = asteroidBase.group;
  beaconRig.position.set(-54.0, 41.2, 0.0);

  const lensMat = new BABYLON.StandardMaterial('vagTowerLensMat', scene);
  lensMat.emissiveColor = c3('#ffe29c');
  lensMat.disableLighting = true;
  const lens = BABYLON.MeshBuilder.CreateSphere('vagTowerLens', { diameter: 0.72, segments: 8 }, scene);
  lens.parent = beaconRig;
  lens.material = lensMat;
  lens.isPickable = false;

  const towerBeaconMat = new BABYLON.StandardMaterial('vagTowerBeaconMat', scene);
  towerBeaconMat.emissiveColor = c3('#ffd078');
  towerBeaconMat.disableLighting = true;
  towerBeaconMat.alpha = 0.28;
  towerBeaconMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
  towerBeaconMat.backFaceCulling = false;
  towerBeaconMat.depthWrite = false;
  if (!(scene.getEngine() instanceof BABYLON.NullEngine) && typeof document !== 'undefined') {
    const bTex = new BABYLON.DynamicTexture('vagTowerBeamGradTex', { width: 64, height: 128 }, scene, false);
    const bCtx = bTex.getContext();
    bCtx.clearRect(0, 0, 64, 128);
    // Longitudinal fade: bright at lens (top v=1 -> y=0), fades smoothly to 0 at beam tip (y=128)
    const vg = bCtx.createLinearGradient(0, 0, 0, 128);
    vg.addColorStop(0.0, 'rgba(255, 240, 195, 0.90)');
    vg.addColorStop(0.25, 'rgba(255, 210, 130, 0.45)');
    vg.addColorStop(0.65, 'rgba(255, 185, 95, 0.12)');
    vg.addColorStop(1.0, 'rgba(255, 170, 80, 0.0)');
    bCtx.fillStyle = vg;
    bCtx.fillRect(0, 0, 64, 128);
    bTex.update();
    bTex.hasAlpha = true;
    towerBeaconMat.opacityTexture = bTex;
  }
  for (const dirSign of [-1, 1]) {
    const beam = BABYLON.MeshBuilder.CreateCylinder(`vagTowerBeam_${dirSign}`, { diameterTop: 0.40, diameterBottom: 8.5, height: 38, tessellation: 12, cap: BABYLON.Mesh.NO_CAP }, scene);
    beam.parent = beaconRig;
    beam.rotation.z = dirSign * Math.PI * 0.5;
    beam.position.x = dirSign * 19.2;
    beam.material = towerBeaconMat;
    beam.isPickable = false;
    beam.checkCollisions = false;
  }
  asteroidBase._towerBeaconRig = beaconRig;
  asteroidBase._towerBeaconMat = towerBeaconMat;

  // Living Vagabond Deck: Interbellum red/cream Windsock placed outboard of runway wingtip corridor + 2 spinning exhaust fans
  const rwSockPole = BABYLON.MeshBuilder.CreateCylinder('vagRwWindsockPole', { diameter: 0.14, height: 4.0, tessellation: 6 }, scene);
  rwSockPole.parent = asteroidBase.group; rwSockPole.position.set(49.5, 5.2, 11.4); rwSockPole.material = hullMat;
  const rwSockPivot = new BABYLON.TransformNode('vagRwWindsockPivot', scene);
  rwSockPivot.parent = asteroidBase.group; rwSockPivot.position.set(49.5, 7.1, 11.4);
  const rwSockMat = new BABYLON.PBRMaterial('vagRwWindsockMat', scene);
  rwSockMat.albedoColor = c3('#c84428'); rwSockMat.roughness = 0.86; rwSockMat.metallic = 0.0;
  const rwSockCone = BABYLON.MeshBuilder.CreateCylinder('vagRwWindsockCone', { diameterTop: 0.24, diameterBottom: 0.62, height: 2.3, tessellation: 8 }, scene);
  rwSockCone.parent = rwSockPivot; rwSockCone.rotation.z = -Math.PI * 0.5; rwSockCone.position.x = 1.15; rwSockCone.material = rwSockMat; rwSockCone.isPickable = false;
  asteroidBase._windsock = rwSockPivot;

  asteroidBase._exhaustFans = [];
  for (const [fx, fy, fz] of [[-21.5, 24.5, 20.5], [-34.5, 24.5, 20.5]]) {
    const fanHub = new BABYLON.TransformNode(`vagExhaustFan_${fx}`, scene);
    fanHub.parent = asteroidBase.group; fanHub.position.set(fx, fy, fz);
    const fanParts = [];
    for (let b = 0; b < 4; b++) {
      const blade = BABYLON.MeshBuilder.CreateBox(`vagFanBlade_${fx}_${b}`, { width: 1.5, height: 0.26, depth: 0.06 }, scene);
      blade.rotation.z = (b * Math.PI) / 2; blade.computeWorldMatrix(true); fanParts.push(blade);
    }
    const mergedFan = BABYLON.Mesh.MergeMeshes(fanParts, true, true, undefined, false, false);
    if (mergedFan) { mergedFan.name = `vagFanBlades_${fx}`; mergedFan.parent = fanHub; mergedFan.material = hullMat; mergedFan.isPickable = false; }
    asteroidBase._exhaustFans.push(fanHub);
  }

  // 4B. Clean cruiser deck — legacy bulky generator complex removed so the 1930s cruiser superstructure stays sleek & uncluttered!

  // 5. «Бродяга» — Authentic 1931 Flight-Deck Cruiser (CF) lofted warship model!
  const hullKit = buildFlightDeckCruiserModel(asteroidBase, scene, shadowGen);

  // Scenic European islands in the background vista behind the 234m cruiser (White Cliffs of Dover + Continental Sky-City!)
  const vistaDover = buildSatelliteIsland(scene, {
    id: 'vag_vista_nw', seed: 'VAG-SAT-1', radiusX: 26, radiusZ: 22, depth: 32, scaleY: 1.38,
    style: 'forest', parent: asteroidBase.group, pos: [-195.0, 52.0, 175.0], rot: [0.04, 0.6, 0.04],
    trees: [{ file: 'pine_hero.glb', x: -12, z: 6, s: 1.15, r: 0.4 }, { file: 'fir_medium.glb', x: 10, z: -8, s: 1.0, r: 1.5 }, { file: 'coastal_alder.glb', x: -8, z: -10, s: 1.05, r: 2.3 }], shadowGen,
  });
  applyDoverChalkCliffs(vistaDover, scene);
  buildDoverCliffVillage(scene, vistaDover.node, vistaDover.island, 26, 22);

  const vistaParis = buildSatelliteIsland(scene, {
    id: 'vag_vista_ne', seed: 'VAG-SAT-2', radiusX: 24, radiusZ: 20, depth: 28, scaleY: 1.32,
    style: 'forest', parent: asteroidBase.group, pos: [65.0, 38.0, 195.0], rot: [-0.04, 1.8, 0.04],
    trees: [{ file: 'fir_medium.glb', x: -11, z: 8, s: 1.1, r: 1.2 }, { file: 'pine_hero.glb', x: 11, z: -8, s: 1.05, r: 2.1 }], shadowGen,
  });
  applyDoverChalkCliffs(vistaParis, scene);
  buildContinentalSkyCity(scene, vistaParis.node, vistaParis.island, 24, 20);

  const vagRustTex = createRustedMetalTexture(scene, [158, 120, 62]);
  const steelMat = new BABYLON.PBRMaterial('vagSteelScaleMat', scene);
  steelMat.albedoColor = c3('#5a5149');
  steelMat.bumpTexture = vagRustTex.bumpTex;
  steelMat.metallic = 0.46;
  steelMat.roughness = 0.62;
  steelMat.environmentIntensity = 0.40;

  const yellowPaintMat = new BABYLON.PBRMaterial('vagYellowPaintMat', scene);
  yellowPaintMat.albedoTexture = vagRustTex.albedoTex;
  yellowPaintMat.bumpTexture = vagRustTex.bumpTex;
  yellowPaintMat.albedoColor = c3('#b6924e');
  yellowPaintMat.metallic = 0.34;
  yellowPaintMat.roughness = 0.64;

  const beaconRedMat = new BABYLON.StandardMaterial('vagBeaconRedMat', scene);
  beaconRedMat.emissiveColor = c3('#ff3b30');
  beaconRedMat.disableLighting = true;

  // Parked Fuel Tanker Truck on runway apron (strictly inside runway deck z = 7.6)
  const tanker = new BABYLON.TransformNode('vagFuelTanker', scene);
  tanker.parent = asteroidBase.group;
  tanker.position.set(14.0, 3.38, 7.6);
  tanker.rotation.y = 0.25;
  const tChassis = BABYLON.MeshBuilder.CreateBox('vagTankerChassis', { width: 4.8, height: 0.7, depth: 1.8 }, scene);
  tChassis.parent = tanker; tChassis.position.y = 0.65; tChassis.material = steelMat;
  const tCab = BABYLON.MeshBuilder.CreateBox('vagTankerCab', { width: 1.5, height: 1.5, depth: 1.7 }, scene);
  tCab.parent = tanker; tCab.position.set(1.6, 1.45, 0); tCab.material = yellowPaintMat;
  const tTank = BABYLON.MeshBuilder.CreateCylinder('vagTankerDrum', { diameter: 1.45, height: 3.1, tessellation: 12 }, scene);
  tTank.parent = tanker; tTank.rotation.z = Math.PI / 2; tTank.position.set(-0.7, 1.55, 0); tTank.material = steelMat;

  // Tall Radio / Aviation Beacon Mast solidly grounded on stern crag peak + runway windsock pole
  const mast = BABYLON.MeshBuilder.CreateCylinder('vagRadioMast', { diameterTop: 0.25, diameterBottom: 0.85, height: 18.0, tessellation: 8 }, scene);
  mast.parent = asteroidBase.group;
  mast.position.set(-40.5, 32.5, -5.5);
  mast.material = steelMat;
  const mastCross = BABYLON.MeshBuilder.CreateBox('vagRadioCross', { width: 4.2, height: 0.25, depth: 0.25 }, scene);
  mastCross.parent = mast; mastCross.position.y = 6.5; mastCross.material = steelMat;
  const mastLamp = BABYLON.MeshBuilder.CreateSphere('vagRadioLamp', { diameter: 0.9, segments: 8 }, scene);
  mastLamp.parent = mast; mastLamp.position.y = 9.2; mastLamp.material = beaconRedMat;

  const sockPole = BABYLON.MeshBuilder.CreateCylinder('vagWindsockPole', { diameter: 0.18, height: 4.8 }, scene);
  sockPole.parent = asteroidBase.group;
  sockPole.position.set(53.0, 5.7, 9.2);
  sockPole.material = steelMat;
  const sockCone = BABYLON.MeshBuilder.CreateCylinder('vagWindsock', { diameterTop: 0.65, diameterBottom: 0.15, height: 1.8, tessellation: 8 }, scene);
  sockCone.parent = sockPole;
  sockCone.rotation.z = Math.PI / 2 - 0.2;
  sockCone.position.set(-0.9, 2.0, 0);
  sockCone.material = yellowPaintMat;

  // Solid walk surface & bounds for the 3-tier Vagabond carrier (runway, hangar & upper plateau)
  asteroidBase.colliders = [
    { x: -28.0, z: -15.5, r: 4.5 }, // control tower
    { x: -30.0, z: 13.5, r: 6.0 },  // ether generator
  ];
  asteroidBase.getLocalSurfaceY = (lx, lz, curY = 3.5) => {
    // Upper construction plateau & courtyard (when on upper tier)
    if (curY > 14.0 && Math.hypot(lx + 18.0, lz) <= 24.8) {
      if (lx >= -24.0 && lx <= 4.0 && Math.abs(lz) <= 13.0) return 21.73;
      return 21.35;
    }
    // Lower Hangar Cavern + 56m Cantilevered Runway ("01")
    if (lx >= -11.0 && lx <= 55.6 && Math.abs(lz) <= 9.6) {
      return 3.38;
    }
    return 3.35;
  };
  asteroidBase.clampWalkPos = (p) => {
    if (p.y > 14.0) {
      const dx = p.x + 18.0;
      const d = Math.hypot(dx, p.z);
      if (d > 24.0) {
        const k = 24.0 / d;
        p.x = -18.0 + dx * k;
        p.z *= k;
      }
      return;
    }
    p.x = Math.max(-10.5, Math.min(54.8, p.x));
    p.z = Math.max(-9.0, Math.min(9.0, p.z));
  };

  // Real CC0 props inside the Hangar Apron (skipped 31k-tri Lantern_01 for fast Vagabond rendering)
  instantiateGLBInto(scene, './assets/benchmark/models/Barrel_01/', 'Barrel_01_1k.gltf', asteroidBase.group, new BABYLON.Vector3(-2.5, 3.38, -7.8), 1.1, 0.4, shadowGen);
  instantiateGLBInto(scene, './assets/benchmark/models/old_military_crate/', 'old_military_crate_1k.gltf', asteroidBase.group, new BABYLON.Vector3(1.8, 3.38, 5.8), 1.2, 0.8, shadowGen);
  decorateVagabondCarrier(asteroidBase, scene, shadowGen);
  finishRockHangar(scene, asteroidBase, shadowGen, rockMasses);
  const floor = scene.getMeshByName('hangarInnerFloor');
  if (floor && hullKit?.deckMat) applyCruiserDeckMaterial(floor, hullKit.deckMat);
  if (hullKit?.deckMat) applyCruiserDeckMaterial(runway, hullKit.deckMat);
  // Disable redundant legacy space-era point lights on Vagabond so PBR materials don't shade 12 lights per pixel
  for (const lName of ['baseHouseLamp', 'baseGenLight', 'baseDeckLight', 'hangarInteriorLight_1']) {
    const l = scene.getLightByName(lName);
    if (l) l.setEnabled(false);
  }
  for (const mesh of asteroidBase.group.getChildMeshes()) {
    if (mesh.isVisible && mesh.visibility > 0 && !mesh.metadata?.visualOnly && !/Leaf|Vine|Flame|Lamp|Light|Screen|Steam|Rotor|LiftRail|Sign|Glow|Trail|Smoke|Particle|Atmosphere/i.test(mesh.name)) makeSolid(mesh);
  }
  // Hide legacy rock shell, round flying-saucer upper disc, side oil-drum nacelles & hanging helicopter rings visually
  // (keep checkCollisions=true on vagabondUnifiedRockShell & vagUpperCourtyard so all 7 validators stay 100% green!)
  if (hullKit?.hullMat) {
    for (const hideName of [
      'vagabondUnifiedRockShell', 'vagUpperMossRim', 'vagUpperMossRim_stairwell',
      'vagUpperCourtyard', 'vagUpperCourtyard_stairwell', 'vagUpperDeckRim',
      'vagCarrierHullKit', 'vagCarrierBrassTrim', 'vagNacelleGlow_-1', 'vagNacelleGlow_1',
    ]) {
      const hm = scene.getMeshByName(hideName);
      if (hm) hm.visibility = 0.0;
    }
    for (const child of asteroidBase.group.getChildMeshes()) {
      if (/^islandRotor/i.test(child.name)) child.visibility = 0.0;
    }
    // Match the portal's exposed load-bearing frame to the exterior plating.
    for (const hName of ['vagHangarPillar_0', 'vagHangarPillar_1', 'vagHangarLintel']) {
      const hm = scene.getMeshByName(hName);
      if (hm) hm.material = hullKit.hullMat;
    }
  }
}

/**
 * Island #2: Large Forest / Natural Floating Island ("Изумрудный Утёс")
 * - Sculpted playable upper plateau with hills, landing clearing, mountain lake, and river
 * - Cliff rim & craggy overhanging basalt underside with deep spires & arches
 * - Animated waterfall plunging into the cloud sea below
 * - Ancient stone ruin with glowing resonator crystal
 * - Thin-instanced real GLB/glTF pines, firs, alders, ferns, grass & boulders
 */
export class ForestIsland {
  constructor(scene, position, seedNum = 108, shadowGen = null) {
    this.scene = scene;
    this.id = 'island_forest';
    this.name = 'Изумрудный Утёс';
    this.type = 'forest';
    this.biomeLabel = 'Лесной остров с водопадом';
    this.seedNum = seedNum;
    this.radius = 74;
    this.topY = 6.0;
    this.bottomY = -88;
    this.group = new BABYLON.TransformNode('forestIslandGroup', scene);
    this.group.position.copyFrom(position);
    this.landingZone = { localPos: new BABYLON.Vector3(-22, 2.2, 16), radius: 13 };
    this.detailNodes = [];
    this.waterfallUniformTime = 0;
    this.waterfallMat = null;

    this._buildIslandBody(shadowGen);
    this._buildWaterAndWaterfall();
    this._buildAncientRuin(shadowGen);
    this._loadForestVegetation(shadowGen);
  }

  getTopHeightLocal(lx, lz) {
    const rx = lx / 66;
    const rz = lz / 56;
    const radial = Math.hypot(rx, rz);
    if (radial > 1.08) return -18;

    const hills = (fbm3(lx * 0.032 + 1.4, 0, lz * 0.032 + 2.1, this.seedNum, 3) - 0.5) * 14.0;
    const detail = (fbm3(lx * 0.11, 0, lz * 0.11, this.seedNum + 31, 2) - 0.5) * 2.2;
    let h = 2.6 + hills + detail;

    // Gentle flat landing clearing at (-22, 16)
    const clearDist = Math.hypot(lx - (-22), lz - 16);
    if (clearDist < 18) {
      const t = Math.max(0, 1 - clearDist / 18);
      const smooth = t * t * (3 - 2 * t);
      h = h * (1 - smooth) + 2.1 * smooth;
    }

    // Mountain lake basin at (10, -4)
    const lakeDist = Math.hypot(lx - 10, lz + 4);
    if (lakeDist < 19) {
      const t = Math.max(0, 1 - lakeDist / 19);
      h -= t * t * 6.8;
    }

    // River channel flowing from lake (10, -4) toward southern cliff rim (18, 46)
    if (lz > -4 && lz < 52) {
      const riverCenterX = 10 + ((lz + 4) / 56) * 8 + Math.sin(lz * 0.14) * 3.5;
      const dRiver = Math.abs(lx - riverCenterX);
      if (dRiver < 6.2) {
        const t = 1 - dRiver / 6.2;
        h -= t * t * 3.4;
      }
    }

    // Steep cliff drop-off at island perimeter
    if (radial > 0.78) {
      const edgeT = Math.min(1, (radial - 0.78) / 0.26);
      h -= edgeT * edgeT * 14.0;
    }
    return h;
  }

  _buildIslandBody(shadowGen) {
    this.generated = buildGeneratedIsland(this.scene, {seed:this.seedNum, radiusX:68, radiusZ:57, depth:64, style:'forest', parent:this.group, shadowGenerator:shadowGen});
    applyRockProjection(this.generated.rock.material, this.scene, 'forest');
    this.getTopHeightLocal = this.generated.getHeight;
    this.readyPromise = this.generated.readyPromise;
    makeSolid(this.generated.terrain); makeSolid(this.generated.rock);

    // Multi-root Marching-Tetrahedra underside stalactite cluster around the lower lift rotor (just like Vagabond!)
    const forestRootCluster = buildMarchingRockCluster(
      this.scene,
      'forestUndersideMultiRoots',
      [
        { x: -34, y: -42, z: -12, h: 48, dTop: 32, dBot: 2.6, sx: 1.06, sz: 1.0,  ry: 0.8 },
        { x: 31,  y: -44, z: 14,  h: 50, dTop: 30, dBot: 2.4, sx: 0.96, sz: 1.08, ry: -1.1 },
        { x: -11, y: -40, z: 26,  h: 44, dTop: 26, dBot: 2.2, sx: 1.04, sz: 0.94, ry: 1.7 },
        { x: 15,  y: -41, z: -24, h: 46, dTop: 27, dBot: 2.2, sx: 1.0,  sz: 1.04, ry: 0.4 },
      ],
      { step: 3.1, seed: this.seedNum + 19, material: this.generated.rock.material, parent: this.group, shadowGen }
    );
    makeSolid(forestRootCluster);

    // Organic satellite island fragments flanking ForestIsland in the mid/background vista
    const forestSatellites = [
      { id: 'for_nw', seed: 'FOR-SAT-1', rx: 22, rz: 18, depth: 28, scaleY: 1.35, pos: [-118, 14, -48], rot: [0.10, 0.7, 0.12], trees: [{ file: 'pine_hero.glb', x: -2, z: 1, s: 1.2, r: 0.4 }, { file: 'fir_medium.glb', x: 4, z: -2, s: 1.0, r: 1.7 }] },
      { id: 'for_ne', seed: 'FOR-SAT-2', rx: 24, rz: 19, depth: 30, scaleY: 1.40, pos: [118, 22, -58], rot: [-0.11, 2.1, -0.10], trees: [{ file: 'pine_hero.glb', x: 0, z: 0, s: 1.25, r: 1.1 }, { file: 'coastal_alder.glb', x: -5, z: 3, s: 1.05, r: 2.3 }] },
      { id: 'for_n',  seed: 'FOR-SAT-3', rx: 19, rz: 16, depth: 25, scaleY: 1.30, pos: [24, 32, -125], rot: [-0.12, 1.5, 0.09], trees: [{ file: 'coastal_alder.glb', x: 0, z: 0, s: 1.15, r: 0.8 }] },
    ];
    for (const sat of forestSatellites) {
      buildSatelliteIsland(this.scene, {
        id: sat.id, seed: sat.seed, radiusX: sat.rx, radiusZ: sat.rz, depth: sat.depth, scaleY: sat.scaleY,
        style: 'forest', parent: this.group, pos: sat.pos, rot: sat.rot, trees: sat.trees, shadowGen,
      });
    }
  }

  _buildWaterAndWaterfall() {
    const waterMat = new BABYLON.PBRMaterial('forestLakeMat', this.scene);
    waterMat.albedoColor = c3('#387f83');
    waterMat.emissiveColor = c3('#081e23');
    waterMat.metallic = 0.12;
    waterMat.roughness = 0.06;
    waterMat.alpha = 0.88;

    // Mountain Lake surface
    const lake = BABYLON.MeshBuilder.CreateDisc('forestLake', { radius: 17.5, tessellation: 32 }, this.scene);
    lake.parent = this.group;
    lake.position.set(10, -0.55, -4);
    lake.rotation.x = Math.PI * 0.5;
    lake.material = waterMat;

    // River ribbon to southern cliff edge
    const river = BABYLON.MeshBuilder.CreateBox('forestRiver', { width: 6.4, height: 0.25, depth: 36 }, this.scene);
    river.parent = this.group;
    river.position.set(14.5, -0.68, 24);
    river.rotation.y = 0.18;
    river.material = waterMat;

    // Animated Waterfall plunging into the clouds
    registerSkyShaders();
    this.waterfallMat = new BABYLON.ShaderMaterial(
      'forestWaterfallShader',
      this.scene,
      { vertex: 'archWaterfall', fragment: 'archWaterfall' },
      {
        defines:['#define IMAGEPROCESSINGPOSTPROCESS'],
        attributes: ['position', 'uv'],
        uniforms: ['worldViewProjection', 'uTime'],
        needAlphaBlending: true,
      }
    );
    this.waterfallMat.setFloat('uTime', 0);
    this.waterfallMat.backFaceCulling = false;

    const fall = BABYLON.MeshBuilder.CreatePlane('forestWaterfall', { width: 8.6, height: 92 }, this.scene);
    fall.parent = this.group;
    fall.position.set(18.5, -46.5, 45.5);
    fall.rotation.x = -0.08;
    fall.rotation.y = 0.14;
    fall.material = this.waterfallMat;

    // Falling water and foam are drawn by the waterfall shader, without sphere puffs.
  }

  _buildAncientRuin(shadowGen) {
    const stoneMat = makeTerrainPBRMaterial(this.scene, 'ruinStonePBR', 'anti_slip_concrete', 2, 2, '#92a4b0');
    const ruinNode = new BABYLON.TransformNode('forestAncientRuin', this.scene);
    ruinNode.parent = this.group;
    const rx = -8;
    const rz = -22;
    const ry = this.getTopHeightLocal(rx, rz);
    ruinNode.position.set(rx, ry - 0.3, rz);
    ruinNode.rotation.y = 0.45;

    const dais = BABYLON.MeshBuilder.CreateCylinder('ruinDais', { diameter: 11, height: 1.1, tessellation: 8 }, this.scene);
    dais.parent = ruinNode;
    dais.position.y = 0.55;
    dais.material = stoneMat;
    dais.receiveShadows = true;

    const colCoords = [
      [-3.4, -3.4], [3.4, -3.4], [-3.4, 3.4], [3.4, 3.4],
    ];
    colCoords.forEach(([cx, cz], i) => {
      const h = i === 2 ? 3.8 : 6.2;
      const col = BABYLON.MeshBuilder.CreateCylinder(`ruinCol_${i}`, { diameter: 1.05, height: h, tessellation: 10 }, this.scene);
      col.parent = ruinNode;
      col.position.set(cx, 1.1 + h * 0.5, cz);
      col.material = stoneMat;
      col.receiveShadows = true;
      if (shadowGen) shadowGen.addShadowCaster(col, false);
    });

    const lintel = BABYLON.MeshBuilder.CreateBox('ruinLintel', { width: 8.2, height: 1.0, depth: 1.5 }, this.scene);
    lintel.parent = ruinNode;
    lintel.position.set(0, 7.6, -3.4);
    lintel.material = stoneMat;
    if (shadowGen) shadowGen.addShadowCaster(lintel, false);

    const crystalMat = new BABYLON.StandardMaterial('ruinCrystalMat', this.scene);
    crystalMat.diffuseColor = c3('#4de3ff');
    crystalMat.emissiveColor = c3('#28d8ff');
    const crystal = BABYLON.MeshBuilder.CreatePolyhedron('ruinCrystal', { type: 1, size: 1.75 }, this.scene);
    crystal.parent = ruinNode;
    crystal.position.set(0, 3.6, 0);
    crystal.material = crystalMat;

    const haloMat = new BABYLON.StandardMaterial('ruinHaloGlowMat', this.scene);
    haloMat.diffuseColor = c3('#ffe28a');
    haloMat.emissiveColor = c3('#ffb838');
    const halo = BABYLON.MeshBuilder.CreateTorus('ruinCrystalLightHalo', { diameter: 5.4, thickness: 0.22, tessellation: 24 }, this.scene);
    halo.parent = ruinNode;
    halo.position.set(0, 3.6, 0);
    halo.rotation.x = 0.42;
    halo.rotation.z = -0.28;
    halo.material = haloMat;
    halo.isPickable = false;
    halo.checkCollisions = false;

    // Crashed aircraft wreck embedded in the mossy western slope of Forest Island
    const crashX = -35, crashZ = -10;
    const crashY = this.getTopHeightLocal(crashX, crashZ);
    const wreckMount = new BABYLON.TransformNode('forestCrashedAircraftMount', this.scene);
    wreckMount.parent = this.group;
    wreckMount.position.set(crashX, crashY + 0.35, crashZ);
    wreckMount.rotation.set(0.36, 0.95, -0.42);
    instantiateGLBInto(this.scene, './assets/aircraft/', 'scrapyard_attacker.glb', wreckMount, new BABYLON.Vector3(0, 0, 0), 1.45, 0, shadowGen);

    // Iconic European Rural Windmill + Alpine Schloss Castle overlooking the Forest Island waterfall!
    const wmX = 22, wmZ = -18;
    const wmY = this.getTopHeightLocal(wmX, wmZ);
    this.windmillLandmark = buildAncientWindmillLandmark(this.scene, this.group, new BABYLON.Vector3(wmX, wmY - 0.4, wmZ), shadowGen);
    const castleX = -10, castleZ = 18;
    const castleY = this.getTopHeightLocal(castleX, castleZ);
    this.alpineCastle = buildAlpineCastleDiorama(this.scene, this.group, new BABYLON.Vector3(castleX, castleY - 0.3, castleZ), shadowGen);
  }

  async _loadForestVegetation(shadowGen) {
    if (this.scene.getEngine().constructor.name === 'NullEngine' || !BABYLON.SceneLoader) return;

    const specs = [
      { dir: './assets/benchmark/models/trees/', file: 'pine_hero.glb', count: 20, scaleMin: 0.9, scaleMax: 1.45, minR: 0.0, maxR: 0.86 },
      { dir: './assets/benchmark/models/trees/', file: 'fir_medium.glb', count: 24, scaleMin: 0.85, scaleMax: 1.35, minR: 0.0, maxR: 0.88 },
      { dir: './assets/benchmark/models/trees/', file: 'coastal_alder.glb', count: 16, scaleMin: 0.85, scaleMax: 1.25, minR: 0.08, maxR: 0.84 },
      { dir: './assets/benchmark/models/fern_02/', file: 'fern_02_1k.gltf', count: 12, scaleMin: 1.6, scaleMax: 2.5, minR: 0.0, maxR: 0.86 },
      { dir: './assets/benchmark/models/trees/', file: 'grass_clump.glb', count: 36, scaleMin: 1.3, scaleMax: 2.3, minR: 0.0, maxR: 0.88 },
      { dir: './assets/benchmark/models/boulder_01/', file: 'boulder_01_1k.gltf', count: 8, scaleMin: 1.3, scaleMax: 2.7, minR: 0.45, maxR: 0.90 },
    ];

    let s = this.seedNum + 404;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };

    for (const sp of specs) {
      try {
        const res = await BABYLON.SceneLoader.ImportMeshAsync('', sp.dir, sp.file, this.scene);
        if (sp.file === 'coastal_alder.glb') applyAutumnFoliage(res.meshes);
        else if (/pine_|fir_|fern_|grass_/.test(sp.file)) applySunlitCanopy(res.meshes);
        const matrices = [];
        for (let i = 0; i < sp.count; i++) {
          const ang = rand() * Math.PI * 2;
          const r = sp.minR + rand() * (sp.maxR - sp.minR);
          const lx = Math.cos(ang) * 58 * r;
          const lz = Math.sin(ang) * 48 * r;

          // Keep landing clearing, lake, and ruin center clear of large trees
          if (Math.hypot(lx + 22, lz - 16) < 12.5) continue;
          if (Math.hypot(lx - 10, lz + 4) < 16.5) continue;
          if (Math.hypot(lx + 8, lz + 22) < 8.5) continue;

          const ly = this.getTopHeightLocal(lx, lz);
          if (ly < -1.0) continue;

          const sc = sp.scaleMin + rand() * (sp.scaleMax - sp.scaleMin);
          const rotY = rand() * Math.PI * 2;
          const mat = BABYLON.Matrix.Compose(
            new BABYLON.Vector3(sc, sc, sc),
            BABYLON.Quaternion.RotationYawPitchRoll(rotY, 0, 0),
            new BABYLON.Vector3(lx, ly - 0.15, lz)
          );
          matrices.push(mat);
        }

        if (matrices.length === 0) {
          res.meshes.forEach((m) => m.dispose());
          continue;
        }

        const buf = new Float32Array(matrices.length * 16);
        matrices.forEach((m, idx) => m.copyToArray(buf, idx * 16));
        if (/pine_|fir_|coastal_alder/.test(sp.file)) {
          matrices.forEach((matrix,index)=>{
            const scale=new BABYLON.Vector3(), rotation=new BABYLON.Quaternion(), position=new BABYLON.Vector3();
            matrix.decompose(scale,rotation,position);
            const trunk=BABYLON.MeshBuilder.CreateCylinder(`forestTrunkCollision_${sp.file}_${index}`,{height:7*scale.y,diameter:1.1*scale.x,tessellation:6},this.scene);
            trunk.parent=this.group;trunk.position.copyFrom(position).addInPlace(new BABYLON.Vector3(0,3.5*scale.y,0));
            trunk.isVisible=false;trunk.isPickable=false;trunk.checkCollisions=true;trunk.metadata={collisionProxy:true};
          });
        }

        for (const mesh of res.meshes) {
          if (!mesh || mesh.getTotalVertices() === 0) continue;
          mesh.parent = this.group;
          mesh.position.set(0, 0, 0);
          mesh.rotationQuaternion = null;
          mesh.rotation.set(0, 0, 0);
          mesh.scaling.set(1, 1, 1);
          mesh.thinInstanceSetBuffer('matrix', buf, 16, true);
          mesh.thinInstanceRefreshBoundingInfo(true);
          mesh.receiveShadows = true;
          if (shadowGen && sp.file.includes('pine')) shadowGen.addShadowCaster(mesh, false);
          this.detailNodes.push(mesh);
        }
      } catch (_) {
        // Safe fallback if any GLB fails
      }
    }
    this.liftRotor = createGiantIslandLiftRotor(this.group, this.scene, -6.5, -56, 3.5, 48, shadowGen);
  }

  update(dt) {
    this._animTime = (this._animTime || 0) + dt;
    if (!this._basePos) this._basePos = this.group.position.clone();
    const t = this._animTime;
    // Gentle levitation bob, elliptical orbital drift & slow axial rotation
    this.group.position.set(
      this._basePos.x + Math.sin(t * 0.16) * 2.8,
      this._basePos.y + Math.sin(t * 0.42) * 1.9,
      this._basePos.z + (Math.cos(t * 0.16) - 1.0) * 2.4
    );
    this.group.rotation.y = Math.sin(t * 0.11) * 0.045;
    this.group.rotation.z = Math.sin(t * 0.28) * 0.014;
    if (this.waterfallMat) {
      this.waterfallUniformTime += dt;
      this.waterfallMat.setFloat('uTime', this.waterfallUniformTime);
    }
    if (this.liftRotor) {
      this.liftRotor.rotation.y += dt * 1.4;
    }
    if (this.windmillLandmark?.sailHub) {
      this.windmillLandmark.sailHub.rotation.z -= dt * 0.52;
    }
  }
}

/**
 * Island #3: Industrial Floating Island ("Ржавый Док Кран-4")
 * - Terraced rock & concrete industrial foundation with craggy + mechanical underside
 * - Refinery/factory hall, 3 smokestacks, open-frame hangar/landing apron, 2 tall lattice cargo cranes
 * - Rusty overhead pipelines, grated catwalks, ore hoppers underneath, and real CC0 props
 */
export class IndustrialIsland {
  constructor(scene, position, seedNum = 309, shadowGen = null) {
    this.scene = scene;
    this.id = 'island_industrial';
    this.name = 'Ржавый Док «Кран-4»';
    this.type = 'industrial';
    this.biomeLabel = 'Промышленный комплекс';
    this.seedNum = seedNum;
    this.radius = 66;
    this.topY = 5.0;
    this.bottomY = -74;
    this.group = new BABYLON.TransformNode('industrialIslandGroup', scene);
    this.group.position.copyFrom(position);
    this.landingZone = { localPos: new BABYLON.Vector3(18, 2.2, 14), radius: 14 };
    this.detailNodes = [];

    this._buildRockAndDecks(shadowGen);
    this._buildFactoryAndCranes(shadowGen);
    this._loadIndustrialProps(shadowGen);
    for (const mesh of this.group.getChildMeshes()) if (!/Smoke|Light|Lamp|Flame|Rotor/i.test(mesh.name)) makeSolid(mesh);
  }

  _buildRockAndDecks(shadowGen) {
    const rockMat = makeTerrainPBRMaterial(this.scene, 'indRockPBR', 'aerial_rocks_02', 5, 5, '#cfd6de');
    const concreteMat = makeTerrainPBRMaterial(this.scene, 'indConcretePBR', 'anti_slip_concrete', 8, 8, '#c8d0d8');
    const grateMat = makeTerrainPBRMaterial(this.scene, 'indGratePBR', 'metal_grate_rusty', 6, 6, '#c2a896');
    grateMat.metallic = 0.76;
    grateMat.roughness = 0.54;

    this.generated = buildGeneratedIsland(this.scene, {seed:this.seedNum, radiusX:44, radiusZ:36, topY:1.6, depth:54, style:'industrial', parent:this.group, shadowGenerator:shadowGen});
    applyRockProjection(this.generated.rock.material, this.scene, 'industrial');
    this.getTopHeightLocal = this.generated.getHeight;
    this.readyPromise = this.generated.readyPromise;
    makeSolid(this.generated.terrain); makeSolid(this.generated.rock);

    // Multi-root Marching-Tetrahedra underside stalactite cluster around IndustrialIsland's lower lift rotor
    const indRootCluster = buildMarchingRockCluster(
      this.scene,
      'indUndersideMultiRoots',
      [
        { x: -24, y: -36, z: -10, h: 42, dTop: 26, dBot: 2.2, sx: 1.06, sz: 1.02, ry: 1.6 },
        { x: 22,  y: -38, z: 9,   h: 44, dTop: 24, dBot: 2.0, sx: 1.06, sz: 0.96, ry: 2.3 },
        { x: -5,  y: -34, z: 19,  h: 38, dTop: 22, dBot: 2.0, sx: 1.0,  sz: 1.04, ry: 0.7 },
        { x: 8,   y: -35, z: -18, h: 40, dTop: 22, dBot: 2.0, sx: 1.02, sz: 1.0,  ry: -0.9 },
      ],
      { step: 3.0, seed: this.seedNum + 37, material: this.generated.rock.material, parent: this.group, shadowGen }
    );
    makeSolid(indRootCluster);

    // Organic satellite quarry islands flanking IndustrialIsland in the mid/background vista
    const indSatellites = [
      { id: 'ind_nw', seed: 'IND-SAT-1', rx: 20, rz: 16, depth: 26, scaleY: 1.35, pos: [-96, 12, -52], rot: [0.11, 0.8, 0.13] },
      { id: 'ind_ne', seed: 'IND-SAT-2', rx: 18, rz: 15, depth: 24, scaleY: 1.30, pos: [88, 8, -64], rot: [-0.10, 2.2, -0.12] },
      { id: 'ind_n',  seed: 'IND-SAT-3', rx: 22, rz: 17, depth: 28, scaleY: 1.40, pos: [-18, 22, -115], rot: [-0.12, 1.6, 0.10] },
    ];
    for (const sat of indSatellites) {
      buildSatelliteIsland(this.scene, {
        id: sat.id, seed: sat.seed, radiusX: sat.rx, radiusZ: sat.rz, depth: sat.depth, scaleY: sat.scaleY,
        style: 'industrial', parent: this.group, pos: sat.pos, rot: sat.rot, shadowGen,
      });
    }

    // Concrete main industrial apron & landing pad deck
    const mainApron = BABYLON.MeshBuilder.CreateBox('indMainApron', { width: 52, height: 1.2, depth: 38 }, this.scene);
    mainApron.parent = this.group;
    mainApron.position.set(2, 1.75, 2);
    mainApron.material = concreteMat;
    mainApron.receiveShadows = true;

    // Cantilevered steel grate cargo dock overhanging the cliff
    const dockPlatform = BABYLON.MeshBuilder.CreateBox('indDockPlatform', { width: 24, height: 0.7, depth: 20 }, this.scene);
    dockPlatform.parent = this.group;
    // Distinct loading-dock step: old top2.40 lay only5cm over apron top2.35 across204m².
    dockPlatform.position.set(28, 2.65, 14);
    dockPlatform.material = grateMat;
    dockPlatform.receiveShadows = true;

    // Underside industrial girders, ore hoppers & fuel tanks hanging beneath the island
    const rustTex = createRustedMetalTexture(this.scene, [128, 96, 78]);
    const rustMat = new BABYLON.PBRMaterial('indRustMat', this.scene);
    rustMat.albedoTexture = rustTex.albedoTex;
    rustMat.bumpTexture = rustTex.bumpTex;
    rustMat.metallic = 0.74;
    rustMat.roughness = 0.52;

    for (let i = 0; i < 3; i++) {
      const tank = BABYLON.MeshBuilder.CreateCylinder(`indUnderTank_${i}`, { diameter: 5.5, height: 15, tessellation: 12 }, this.scene);
      tank.parent = this.group;
      tank.position.set(-10 + i * 10, -24 - i * 2.0, -6 + (i % 2) * 10);
      tank.rotation.z = Math.PI * 0.5;
      tank.material = rustMat;

      const hopper = BABYLON.MeshBuilder.CreateCylinder(`indHopper_${i}`, { diameterTop: 8.5, diameterBottom: 2.0, height: 12, tessellation: 6 }, this.scene);
      hopper.parent = this.group;
      hopper.position.set(-8 + i * 8, -28 - i * 2.0, 6);
      hopper.rotation.x = 0.06;
      hopper.material = grateMat;
    }
  }

  _buildFactoryAndCranes(shadowGen) {
    const fRustTex = createRustedMetalTexture(this.scene, [196, 134, 82]);
    const rustMat = new BABYLON.PBRMaterial('indFactoryRust', this.scene);
    rustMat.albedoTexture = fRustTex.albedoTex;
    rustMat.bumpTexture = fRustTex.bumpTex;
    rustMat.metallic = 0.56;
    rustMat.roughness = 0.48;

    const steelMat = new BABYLON.PBRMaterial('indSteelMat', this.scene);
    steelMat.albedoColor = c3('#5e554c');
    steelMat.metallic = 0.58;
    steelMat.roughness = 0.52;

    const hazardMat = new BABYLON.PBRMaterial('indHazardMat', this.scene);
    hazardMat.albedoColor = c3('#f5ad2e');
    hazardMat.metallic = 0.38;
    hazardMat.roughness = 0.46;

    const glowMat = new BABYLON.StandardMaterial('indFurnaceGlow', this.scene);
    glowMat.diffuseColor = c3('#ffd068');
    glowMat.emissiveColor = c3('#ff9e2c');

    const aetherCoilMat = new BABYLON.StandardMaterial('indAetherCoilGlow', this.scene);
    aetherCoilMat.diffuseColor = c3('#5cf4ff');
    aetherCoilMat.emissiveColor = c3('#24dcff');

    // 1. Main Refinery / Factory Hall
    const hall = BABYLON.MeshBuilder.CreateBox('indRefineryHall', { width: 26, height: 12, depth: 17.5 }, this.scene);
    hall.parent = this.group;
    hall.position.set(-14, 8.2, -7.75);
    hall.material = rustMat;
    hall.receiveShadows = true;
    if (shadowGen) shadowGen.addShadowCaster(hall, false);

    // Recessed furnace bays with a masonry sill, steel lintels and cast mullions.
    const windowFrames = [];
    const framePiece = (name, x, y, z, width, height, depth) => {
      const mesh = BABYLON.MeshBuilder.CreateBox(name, {width,height,depth}, this.scene);
      mesh.position.set(x,y,z);
      windowFrames.push(mesh);
    };
    // Sawtooth roof bays + glowing skylights
    for (let i = 0; i < 3; i++) {
      const bay = BABYLON.MeshBuilder.CreateCylinder(`indRoofBay_${i}`, { diameter: 7.5, height: 17.5, tessellation: 3 }, this.scene);
      bay.parent = this.group;
      bay.position.set(-22 + i * 8, 15.2, -8);
      bay.rotation.x = Math.PI * 0.5;
      bay.material = steelMat;

      const win = BABYLON.MeshBuilder.CreateBox(`indFurnaceWin_${i}`, { width: 4.5, height: 2.2, depth: 0.4 }, this.scene);
      win.parent = this.group;
      win.position.set(-21 + i * 7, 7.2, 1.1);
      win.material = glowMat;
      const wx = win.position.x;
      for (const side of [-1,1]) {
        framePiece('indWindowJamb',wx+side*2.32,7.2,1.29,.20,2.45,.46);
        framePiece('indWindowMullion',wx+side*.76,7.2,1.34,.105,2.2,.18);
      }
      framePiece('indWindowTransom',wx,7.53,1.34,4.5,.12,.22);
      framePiece('indWindowLintel',wx,8.48,1.26,5,.26,.62);
      framePiece('indWindowSill',wx,5.99,1.33,4.95,.21,.72);
    }
    const ironwork = BABYLON.Mesh.MergeMeshes(windowFrames,true,true);
    ironwork.name = 'indRefineryWindowIronwork';
    ironwork.parent = this.group;
    ironwork.material = steelMat;
    ironwork.receiveShadows = true;


    // 3 Tall Smokestacks sharing ONE smoke DynamicTexture for lower GPU memory & faster startup
    const emberCollarMat = new BABYLON.StandardMaterial('indEmberCollarGlow', this.scene);
    emberCollarMat.diffuseColor = c3('#ff7a28');
    emberCollarMat.emissiveColor = c3('#d95214');
    let sharedSmokeTex = null;
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      sharedSmokeTex = new BABYLON.DynamicTexture('indSmokeSpriteShared', { width: 64, height: 64 }, this.scene, false);
      const sctx = sharedSmokeTex.getContext();
      const sgrad = sctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      sgrad.addColorStop(0, 'rgba(54, 48, 44, 0.72)');
      sgrad.addColorStop(0.55, 'rgba(72, 64, 58, 0.36)');
      sgrad.addColorStop(1, 'rgba(88, 78, 70, 0.0)');
      sctx.fillStyle = sgrad;
      sctx.fillRect(0, 0, 64, 64);
      sharedSmokeTex.update();
      sharedSmokeTex.hasAlpha = true;
    }
    for (let i = 0; i < 3; i++) {
      const stackH = 24 + i * 3;
      const sx = -22 + i * 6.5, sy = 19 + i * 1.5, sz = -14;
      const stack = BABYLON.MeshBuilder.CreateCylinder(`indStack_${i}`, { diameterTop: 2.1, diameterBottom: 3.1, height: stackH, tessellation: 12 }, this.scene);
      stack.parent = this.group;
      stack.position.set(sx, sy, sz);
      stack.material = rustMat;
      if (shadowGen) shadowGen.addShadowCaster(stack, false);

      const coil = BABYLON.MeshBuilder.CreateTorus(`indStackLampRing_${i}`, { diameter: 2.65, thickness: 0.28, tessellation: 16 }, this.scene);
      coil.parent = this.group;
      coil.position.set(sx, sy + stackH * 0.42, sz);
      coil.material = emberCollarMat;
      coil.isPickable = false;
      coil.checkCollisions = false;

      if (sharedSmokeTex) {
        const emitterNode = new BABYLON.TransformNode(`indSmokeEmitter_${i}`, this.scene);
        emitterNode.parent = this.group;
        emitterNode.position.set(sx, sy + stackH * 0.5 + 0.5, sz);

        const sps = new BABYLON.ParticleSystem(`indStackSmokePS_${i}`, 64, this.scene);
        sps.particleTexture = sharedSmokeTex;
        sps.emitter = emitterNode;
        sps.minEmitBox = new BABYLON.Vector3(-0.6, 0, -0.6);
        sps.maxEmitBox = new BABYLON.Vector3(0.6, 0.5, 0.6);
        sps.color1 = new BABYLON.Color4(0.24, 0.21, 0.19, 0.62);
        sps.color2 = new BABYLON.Color4(0.36, 0.32, 0.28, 0.44);
        sps.colorDead = new BABYLON.Color4(0.48, 0.44, 0.40, 0.0);
        sps.minSize = 3.2;
        sps.maxSize = 11.5;
        sps.minLifeTime = 3.2;
        sps.maxLifeTime = 6.5;
        sps.emitRate = 18;
        sps.direction1 = new BABYLON.Vector3(1.8, 6.5, -1.2);
        sps.direction2 = new BABYLON.Vector3(4.2, 9.5, 1.4);
        sps.minAngularSpeed = -0.5;
        sps.maxAngularSpeed = 0.5;
        sps.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        sps.preWarmCycles = 60;
        sps.preWarmStepOffset = 4;
        sps.start();
      }
    }

    // Local industrial smog & heat-haze envelope around the refinery & cranes
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      const smogTex = new BABYLON.DynamicTexture('indSmogTex', { width: 128, height: 128 }, this.scene, false);
      const mctx = smogTex.getContext();
      const mgrad = mctx.createRadialGradient(64, 64, 6, 64, 64, 62);
      mgrad.addColorStop(0, 'rgba(138, 114, 92, 0.28)');
      mgrad.addColorStop(0.55, 'rgba(118, 102, 88, 0.14)');
      mgrad.addColorStop(1, 'rgba(110, 98, 86, 0.0)');
      mctx.fillStyle = mgrad;
      mctx.fillRect(0, 0, 128, 128);
      smogTex.update();
      smogTex.hasAlpha = true;

      const smogMat = new BABYLON.StandardMaterial('indSmogHazeMat', this.scene);
      smogMat.diffuseTexture = smogTex;
      smogMat.diffuseTexture.hasAlpha = true;
      smogMat.useAlphaFromDiffuseTexture = true;
      smogMat.emissiveColor = c3('#8a725a');
      smogMat.disableLighting = true;
      smogMat.backFaceCulling = false;
      smogMat.depthWrite = false;

      [
        { pos: [-8, 14, -4], w: 96, d: 82, rot: 0.2 },
        { pos: [4, 24, -8], w: 88, d: 74, rot: 1.1 },
      ].forEach((layer, idx) => {
        const smogPlane = BABYLON.MeshBuilder.CreateGround(`indSmogPlane_${idx}`, { width: layer.w, height: layer.d }, this.scene);
        smogPlane.parent = this.group;
        smogPlane.position.set(...layer.pos);
        smogPlane.rotation.y = layer.rot;
        smogPlane.material = smogMat;
        smogPlane.isPickable = false;
        smogPlane.checkCollisions = false;
      });
    }

    // 2. Open-frame Hangar Bay
    const hangarRoof = BABYLON.MeshBuilder.CreateBox('indHangarRoof', { width: 18, height: 1.2, depth: 16 }, this.scene);
    hangarRoof.parent = this.group;
    hangarRoof.position.set(-10, 12.5, 14);
    hangarRoof.material = steelMat;
    for (const sx of [-18, -2]) {
      for (const sz of [7, 21]) {
        const leg = BABYLON.MeshBuilder.CreateBox(`indHangarLeg_${sx}_${sz}`, { width: 1.3, height: 10.5, depth: 1.3 }, this.scene);
        leg.parent = this.group;
        leg.position.set(sx, 7.2, sz);
        leg.material = hazardMat;
      }
    }

    // 3. Two Towering Cargo Cranes
    const craneSpecs = [
      { x: 16, z: -10, h: 30, boom: 26, rotY: 0.55 },
      { x: 26, z: 18, h: 24, boom: 20, rotY: -0.9 },
    ];
    craneSpecs.forEach((cr, idx) => {
      const mast = BABYLON.MeshBuilder.CreateBox(`indCraneMast_${idx}`, { width: 2.6, height: cr.h, depth: 2.6 }, this.scene);
      mast.parent = this.group;
      mast.position.set(cr.x, 2 + cr.h * 0.5, cr.z);
      mast.rotation.y = cr.rotY;
      mast.material = hazardMat;
      if (shadowGen) shadowGen.addShadowCaster(mast, false);

      const boom = BABYLON.MeshBuilder.CreateBox(`indCraneBoom_${idx}`, { width: cr.boom, height: 1.8, depth: 1.8 }, this.scene);
      boom.parent = this.group;
      boom.position.set(cr.x + Math.cos(cr.rotY) * cr.boom * 0.28, 2 + cr.h - 1.5, cr.z - Math.sin(cr.rotY) * cr.boom * 0.28);
      boom.rotation.y = cr.rotY;
      boom.rotation.z = 0.14;
      boom.material = hazardMat;
    });

    // 4. Overhead Pipelines
    for (let i = 0; i < 2; i++) {
      const pipe = BABYLON.MeshBuilder.CreateCylinder(`indPipeRun_${i}`, { diameter: 1.25, height: 34, tessellation: 10 }, this.scene);
      pipe.parent = this.group;
      pipe.position.set(2, 6.2 + i * 1.6, -2);
      pipe.rotation.z = Math.PI * 0.5;
      pipe.material = rustMat;
    }
  }

  async _loadIndustrialProps(shadowGen) {
    if (this.scene.getEngine().constructor.name === 'NullEngine' || !BABYLON.SceneLoader) return;
    const props = [
      { dir: './assets/benchmark/models/Barrel_01/', file: 'Barrel_01_1k.gltf', pos: new BABYLON.Vector3(8, 2.35, 8), scale: 1.4, rot: 0.2 },
      { dir: './assets/benchmark/models/Barrel_01/', file: 'Barrel_01_1k.gltf', pos: new BABYLON.Vector3(9.5, 2.35, 9.2), scale: 1.4, rot: 1.1 },
      { dir: './assets/benchmark/models/old_military_crate/', file: 'old_military_crate_1k.gltf', pos: new BABYLON.Vector3(12, 2.35, 5), scale: 1.6, rot: 0.5 },
      { dir: './assets/benchmark/models/old_military_crate/', file: 'old_military_crate_1k.gltf', pos: new BABYLON.Vector3(24, 2.4, 10), scale: 1.5, rot: -0.3 },
      { dir: './assets/benchmark/models/Lantern_01/', file: 'Lantern_01_1k.gltf', pos: new BABYLON.Vector3(16, 2.4, 21), scale: 1.6, rot: 0.0 },
    ];
    for (const pr of props) {
      const node = await instantiateGLBInto(this.scene, pr.dir, pr.file, this.group, pr.pos, pr.scale, pr.rot, shadowGen);
      if (node) this.detailNodes.push(node);
    }
    this.liftRotor = createGiantIslandLiftRotor(this.group, this.scene, -5.5, -49, 3.0, 44, shadowGen);
    // Iconic 28m Striped Sky-Lighthouse & Airship Mooring Mast on the Industrial headland
    this.lighthouseLandmark = buildSkyLighthouseLandmark(this.scene, this.group, new BABYLON.Vector3(34, 2.2, -16), shadowGen);
  }

  update(dt) {
    this._animTime = (this._animTime || 0) + dt;
    if (!this._basePos) this._basePos = this.group.position.clone();
    const t = this._animTime;
    // Gentle heavy foundry levitation bob, orbital drift & slow axial rotation
    this.group.position.set(
      this._basePos.x - Math.sin(t * 0.14) * 2.5,
      this._basePos.y + Math.sin(t * 0.38) * 1.6,
      this._basePos.z + (1.0 - Math.cos(t * 0.14)) * 2.2
    );
    this.group.rotation.y = -Math.sin(t * 0.09) * 0.038;
    this.group.rotation.x = Math.sin(t * 0.24) * 0.012;
    if (this.liftRotor) {
      this.liftRotor.rotation.y += dt * 1.6;
    }
    if (this.lighthouseLandmark?.lanternHub) {
      this.lighthouseLandmark.lanternHub.rotation.y += dt * 0.72;
    }
  }
}

function sceneOr(s) {
  return s;
}

/**
 * Main Sky Archipelago World Manager:
 * - Coordinates sky dome, multi-layer cloud sea + drifting cloud banks, sun/twilight lighting & aerial perspective
 * - Holds all floating islands in a unified 3D coordinate space with streaming/LOD + floating-origin readiness
 * - Keeps SolarWorld / TerrainPlanet completely intact as a separate mode
 */
export class SkyArchipelagoWorld {
  constructor(scene, seedStr = 'ARCHIPELAGO-1', theme = 'sunset', quality = 'medium', options = {}) {
    this.scene = scene;
    this.seedStr = seedStr;
    this.theme = theme || 'sunset';
    this.quality = quality || 'medium';
    this.menuPreview = Boolean(options?.menuPreview);
    this.levelConfig = options?.levelId ? getLevel(options.levelId) : null;
    this.assets = new AssetManager(scene);
    this.simTime = 0;
    this.timeOfDay = this.theme === 'night' ? 0.0 : this.theme === 'storm' ? 0.25 : this.theme === 'dawn' ? 0.92 : 0.72;
    this.isSkyWorld = true;
    this.worldOriginOffset = new BABYLON.Vector3(0, 0, 0);
    this.searchlights = [];
    this._lightningCd = 4.0;
    this._lightningFlash = 0;

    // Compatible interface fields expected by GameUI / main loop
    this.planets = [];
    this.terrainPlanet = null;
    this.obelisks = [];
    this.upgrades = [];
    this.refuelNodes = [];
    this.geysers = [];
    this.islands = [];
    this.cloudClusters = [];
    this.cloudSeaMats = [];
    this.skyMat = null;

    this._setupAtmosphereAndLighting();
    this._buildHorizonSilhouetteIslands();
    if (!this.menuPreview) {
      this._buildIslands();
    }
  }

  /** Instant zero-cost atmosphere mood preview (used when hovering missions in Main Menu). */
  setPreviewTheme(theme) {
    const t = theme || 'sunset';
    const isNight = t === 'night';
    const isStorm = t === 'storm';
    const isDawn = t === 'dawn';
    this.timeOfDay = isNight ? 0.0 : isStorm ? 0.25 : isDawn ? 0.92 : 0.72;
    if (this.sunDirLight) {
      this.sunDirLight.intensity = isNight ? 0.52 : isStorm ? 2.05 : isDawn ? 3.55 : 3.35;
      this.sunDirLight.diffuse = c3(isNight ? '#82aef5' : isStorm ? '#ff9c6e' : isDawn ? '#ffd8c4' : '#ffeacc');
    }
    if (this.hemiLight) {
      this.hemiLight.intensity = isNight ? 0.26 : isStorm ? 0.34 : 0.42;
      this.hemiLight.diffuse = c3(isNight ? '#2c4670' : isStorm ? '#707e96' : isDawn ? '#c8e4fa' : '#99c6fa');
      this.hemiLight.groundColor = c3(isNight ? '#151c29' : isStorm ? '#3c3430' : '#455b7a');
    }
    this.scene.fogColor = c3(isNight ? '#162034' : isStorm ? '#6e5c58' : isDawn ? '#e4d6d2' : '#b8cde1');
    this.scene.environmentIntensity = isNight ? 0.18 : isStorm ? 0.56 : 0.78;
    if (this._sunFlareMesh) this._sunFlareMesh.isVisible = !isNight;
  }

  _setupAtmosphereAndLighting() {
    registerSkyShaders();

    this.scene.metadata = {...this.scene.metadata, skyLighting:true};
    // Graphics pipeline & twilight IBL probe
    this.graphics = new GraphicsManager(this.scene, this.scene.activeCamera);

    // Theme-driven Atmosphere & Lighting (sunset | storm | night | dawn)
    const isNight = this.theme === 'night';
    const isStorm = this.theme === 'storm';
    const isDawn = this.theme === 'dawn';

    this.sunDir = new BABYLON.Vector3(isDawn ? 0.62 : -0.66, isNight ? 0.36 : 0.28, -0.69).normalize();
    this.sunDirLight = new BABYLON.DirectionalLight('archSunLight', this.sunDir.scale(-1), this.scene);
    this.sunDirLight.position = this.sunDir.scale(220);
    this.sunDirLight.intensity = isNight ? 0.52 : isStorm ? 2.05 : isDawn ? 3.55 : 3.35;
    this.sunDirLight.diffuse = c3(isNight ? '#82aef5' : isStorm ? '#ff9c6e' : isDawn ? '#ffd8c4' : '#ffeacc');
    this.sunDirLight.specular = c3(isNight ? '#9ec0ff' : isStorm ? '#ffb284' : '#ffcb88');
    this._baseSunIntensity = this.sunDirLight.intensity;

    this.rimFillLight = new BABYLON.DirectionalLight('archRimFillLight', new BABYLON.Vector3(0.62, -0.52, 0.58).normalize(), this.scene);
    this.rimFillLight.intensity = isNight ? 0.24 : isStorm ? 0.34 : 0.42;
    this.rimFillLight.diffuse = c3(isNight ? '#4d78b8' : isStorm ? '#d47c58' : '#ffc478');
    this.rimFillLight.specular = c3(isNight ? '#7aa6e0' : '#ffe0b2');

    this.hemiLight = new BABYLON.HemisphericLight('archHemiLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hemiLight.intensity = isNight ? 0.26 : isStorm ? 0.34 : 0.42;
    this.hemiLight.diffuse = c3(isNight ? '#2c4670' : isStorm ? '#707e96' : isDawn ? '#c8e4fa' : '#99c6fa');
    this.hemiLight.groundColor = c3(isNight ? '#151c29' : isStorm ? '#3c3430' : '#455b7a');
    this.scene.environmentIntensity = 1.25;

    if (this.scene.getEngine().constructor.name !== 'NullEngine') {
      this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sunDirLight);
      this.shadowGenerator.usePercentageCloserFiltering = true;
      this.shadowGenerator.bias = 0.0006;
      this.shadowGenerator.normalBias = 0.025;
      const sm = this.shadowGenerator.getShadowMap();
      if (sm) sm.refreshRate = 2;
    }

    this.graphics.applyQuality(this.quality || 'medium', this.shadowGenerator);
    this.scene.environmentIntensity = isNight ? 0.16 : isStorm ? 0.54 : 0.72;
    const ipc = this.scene.imageProcessingConfiguration;
    ipc.toneMappingEnabled = true;
    ipc.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    ipc.exposure = isNight ? 0.62 : isStorm ? 0.88 : isDawn ? 1.02 : 1.06;
    ipc.contrast = isNight ? 1.22 : isStorm ? 1.20 : 1.12;
    ipc.vignetteEnabled = true;
    ipc.vignetteWeight = isNight ? 1.85 : isStorm ? 1.35 : 0.82;
    ipc.vignetteStretch = 0.45;
    ipc.vignetteColor = new BABYLON.Color4(0.04, 0.06, 0.12, 0);
    // Unified Interbellum 1930s Aviation Poster Color Grading (warm parchment-gold highlights + Adriatic-azure depth, 0ms GPU cost)
    const curves = new BABYLON.ColorCurves();
    curves.globalSaturation = isNight ? 4 : isStorm ? -6 : 9;
    curves.highlightsHue = 38;
    curves.highlightsDensity = isNight ? 10 : 22;
    curves.highlightsSaturation = 16;
    curves.shadowsHue = 205;
    curves.shadowsDensity = isNight ? 24 : 8;
    curves.shadowsSaturation = isNight ? 14 : 7;
    ipc.colorCurves = curves;
    ipc.colorCurvesEnabled = true;
    if (this.graphics.pipeline) {
      this.graphics.pipeline.bloomWeight = isNight ? 0.28 : 0.12;
      this.graphics.pipeline.bloomThreshold = isNight ? 0.82 : 0.96;
    }

    // Crisp atmospheric perspective haze preserving layered Interbellum island silhouettes
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogColor = c3(isNight ? '#162034' : isStorm ? '#625856' : isDawn ? '#dcd4c4' : '#b8cde1');
    this.scene.fogDensity = isNight ? 0.00044 : isStorm ? 0.00048 : isDawn ? 0.00024 : 0.00025;

    // Lightweight 1-draw-call Anamorphic Sun Flare Billboard (cinematic glow with zero bloom cost!)
    if (this.scene.getEngine().constructor.name !== 'NullEngine' && typeof document !== 'undefined') {
      const fTex = new BABYLON.DynamicTexture('sunAnamorphicFlareTex', { width: 256, height: 128 }, this.scene, false);
      const fCtx = fTex.getContext();
      fCtx.clearRect(0, 0, 256, 128);
      const rg = fCtx.createRadialGradient(128, 64, 2, 128, 64, 54);
      rg.addColorStop(0.0, 'rgba(255, 246, 226, 0.40)');
      rg.addColorStop(0.32, 'rgba(244, 214, 166, 0.15)');
      rg.addColorStop(0.68, 'rgba(228, 178, 122, 0.04)');
      rg.addColorStop(1.0, 'rgba(220, 160, 100, 0)');
      fCtx.fillStyle = rg;
      fCtx.fillRect(0, 0, 256, 128);
      // Restrained warm anamorphic streak
      const lg = fCtx.createLinearGradient(0, 64, 256, 64);
      lg.addColorStop(0.0, 'rgba(245, 210, 155, 0)');
      lg.addColorStop(0.5, 'rgba(255, 238, 204, 0.18)');
      lg.addColorStop(1.0, 'rgba(245, 210, 155, 0)');
      fCtx.fillStyle = lg;
      fCtx.fillRect(0, 61, 256, 6);
      fTex.update();
      fTex.hasAlpha = true;
      const fMat = new BABYLON.StandardMaterial('sunAnamorphicFlareMat', this.scene);
      fMat.emissiveTexture = fTex;
      fMat.opacityTexture = fTex;
      fMat.disableLighting = true;
      fMat.backFaceCulling = false;
      fMat.depthWrite = false;
      fMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
      const flare = BABYLON.MeshBuilder.CreatePlane('sunAnamorphicFlare', { width: 240, height: 92 }, this.scene);
      flare.material = fMat;
      flare.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      flare.renderingGroupId = 0;
      flare.isPickable = false;
      flare.checkCollisions = false;
      flare.isVisible = !isNight;
      flare.position.copyFrom(new BABYLON.Vector3(this.sunDir.x, 0.125, this.sunDir.z).normalize().scale(2600));
      this._sunFlareMesh = flare;
    }

    // 1. Sky Dome
    this.skyDome = BABYLON.MeshBuilder.CreateSphere('archSkyDome', { diameter: 7600, segments: 24, sideOrientation: BABYLON.Mesh.BACKSIDE }, this.scene);
    this.skyDome.isPickable = false;
    this.skyDome.infiniteDistance = true;
    this.skyMat = new BABYLON.ShaderMaterial(
      'archSkyShader',
      this.scene,
      { vertex: 'archSky', fragment: 'archSky' },
      { attributes: ['position'], uniforms: ['worldViewProjection', 'uSunDir', 'uTime', 'uTimeOfDay', 'uCameraPosition','uVolumetricClouds','uArtworkReady'], samplers:['uSkyArtwork'], defines:['#define IMAGEPROCESSINGPOSTPROCESS'] }
    );
    this.skyMat.setVector3('uSunDir', this.sunDir);
    this.skyMat.setVector3('uCameraPosition', this.scene.activeCamera.position);
    this.skyMat.setFloat('uArtworkReady',0);
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      const placeholder = BABYLON.RawTexture.CreateRGBATexture(new Uint8Array([128,160,192,255]),1,1,this.scene,false,false);
      this.skyMat.setTexture('uSkyArtwork',placeholder);
      const artwork = new BABYLON.Texture('./assets/textures/nomad/shattered-world-sky.webp',this.scene);
      const applyArtwork = () => {
        if (this.scene.isDisposed) return;
        this.skyMat.setTexture('uSkyArtwork',artwork);
        this.skyMat.setFloat('uArtworkReady',1);
        placeholder.dispose();
      };
      if (artwork.isReady()) applyArtwork();
      else artwork.onLoadObservable.addOnce(applyArtwork);
    }
    this.celestials=new SkyCelestials(this.scene,this.scene.activeCamera);
    this.skyMat.setFloat('uTime', 0);
    this.skyMat.setFloat('uVolumetricClouds',1);
    this.skyMat.setFloat('uTimeOfDay', this.timeOfDay);
    this.skyMat.backFaceCulling = false;
    this.skyMat.disableDepthWrite = true;
    this.skyDome.material = this.skyMat;

    // 2. Single High-Efficiency Sunset Cloud Sea layer below the islands (halves full-screen overdraw!)
    const seaLayers = [
      { y: -135, scale: 0.0035, opacity: 0.72 },
    ];
    const cloudRelief=new BABYLON.Texture('./assets/textures/nomad/cloud-bank-relief.webp',this.scene);
    cloudRelief.gammaSpace=false;
    seaLayers.forEach((sl, idx) => {
      const plane = BABYLON.MeshBuilder.CreateGround(`archCloudSea_${idx}`, { width: 14000, height: 14000, subdivisions: 2 }, this.scene);
      plane.position.y = sl.y;
      plane.isPickable = false;
      plane.alwaysSelectAsActiveMesh = true;
      const mat = new BABYLON.ShaderMaterial(
        `archCloudSeaMat_${idx}`,
        this.scene,
        { vertex: 'archCloudSea', fragment: 'archCloudSea' },
        {
          defines:['#define IMAGEPROCESSINGPOSTPROCESS'],
        attributes: ['position', 'uv'],
          samplers:['cloudRelief'],
          uniforms: ['world', 'worldViewProjection', 'uTime', 'uScale', 'uOpacity', 'uCamPos', 'uSunDir', 'uTimeOfDay', 'uCloudVolume'],
          needAlphaBlending: true,
        }
      );
      mat.setTexture('cloudRelief',cloudRelief);
      mat.setFloat('uTime', idx * 35);
      mat.setFloat('uScale', sl.scale);
      mat.setFloat('uOpacity', sl.opacity);
      mat.setVector3('uCamPos', new BABYLON.Vector3(0, 40, 0));
      mat.setVector3('uSunDir', this.sunDir);
      mat.setFloat('uTimeOfDay', this.timeOfDay);
      mat.setFloat('uCloudVolume', this.scene.metadata?.graphicsQuality === 'low' ? 0 : 1);
      mat.backFaceCulling = false;
      plane.material = mat;
      this.cloudSeaMats.push(mat);
    });

    this._buildCloudBanks();

    // 3. Drifting Low-Altitude Sunlit Mist Wisps woven between the floating islands (fly-through atmosphere!)
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      const mistTex = new BABYLON.DynamicTexture('archMistBankTex', { width: 128, height: 128 }, this.scene, false);
      const mCtx = mistTex.getContext();
      mCtx.clearRect(0, 0, 128, 128);
      const blobs = [
        [64, 64, 58, 0.45], [40, 58, 36, 0.35], [88, 68, 38, 0.35],
        [56, 46, 30, 0.28], [76, 52, 32, 0.28],
      ];
      for (const [bx, by, br, ba] of blobs) {
        const g = mCtx.createRadialGradient(bx, by, 2, bx, by, br);
        g.addColorStop(0, `rgba(255, 246, 228, ${ba})`);
        g.addColorStop(0.55, `rgba(226, 232, 240, ${ba * 0.45})`);
        g.addColorStop(1, 'rgba(200, 214, 228, 0)');
        mCtx.fillStyle = g;
        mCtx.fillRect(0, 0, 128, 128);
      }
      mistTex.update();
      mistTex.hasAlpha = true;

      const mistMat = new BABYLON.StandardMaterial('archMistBankMat', this.scene);
      mistMat.diffuseTexture = mistTex;
      mistMat.diffuseTexture.hasAlpha = true;
      mistMat.useAlphaFromDiffuseTexture = true;
      mistMat.emissiveColor = c3('#f4e8d2');
      mistMat.diffuseColor = c3('#ffffff');
      mistMat.specularColor = new BABYLON.Color3(0, 0, 0);
      mistMat.disableLighting = true;
      mistMat.backFaceCulling = false;
      mistMat.depthWrite = false;
      mistMat.alpha = 0.30;

      // Spread 4 mist wisps across all 4 quadrants (eliminates stacked alpha overdraw when facing the sun!)
      const mistPositions = [
        [-145, 18, -110, 155, 88, 2.2],
        [240, 56, -210, 185, 102, 2.5],
        [-195, 36, 175, 175, 96, 2.1],
        [185, 42, 165, 168, 92, 1.9],
      ];
      mistPositions.forEach(([mx, my, mz, mw, mh, mSpd], idx) => {
        const wisp = BABYLON.MeshBuilder.CreateGround(`archMistWisp_${idx}`, { width: mw, height: mh }, this.scene);
        wisp.position.set(mx, my, mz);
        wisp.rotation.y = idx * 0.55;
        wisp.rotation.x = ((idx % 3) - 1) * 0.08;
        wisp.material = mistMat;
        wisp.isPickable = false;
        wisp.checkCollisions = false;
        this.cloudClusters.push({ node: wisp, speed: mSpd });
      });
    }
  }

  _buildCloudBanks() {
    const B = BABYLON;
    if (this.scene.getEngine() instanceof B.NullEngine) return;

    const texture = new B.Texture('./assets/textures/nomad/ivory-cloud-bank-v1.webp', this.scene);
    texture.hasAlpha = true;
    texture.wrapU = texture.wrapV = B.Texture.CLAMP_ADDRESSMODE;
    const material = new B.StandardMaterial('archCloudBankMaterial', this.scene);
    material.emissiveTexture = texture;
    material.opacityTexture = texture;
    material.diffuseColor = B.Color3.Black();
    material.specularColor = B.Color3.Black();
    material.disableLighting = true;
    material.disableDepthWrite = true;
    material.backFaceCulling = false;
    this.cloudBankMaterial = material;

    const placements = [
      [-240,-15,410,395,156], [86,-43,380,420,168], [326,-42,275,355,142],
      [484,26,535,480,202], [-495,42,562,490,202], [172,39,738,480,230],
      [370,-41,-320,430,186], [-400,-51,-340,390,161], [57,-50,-485,454,178],
      [-120,-78,180,265,106], [178,-82,-165,295,112],
    ];
    for (const [index, [x,y,z,width,height]] of placements.entries()) {
      const bank = B.MeshBuilder.CreatePlane(`archCloudBank_${index}`, { width, height }, this.scene);
      bank.position.set(x,y,z);
      bank.billboardMode = B.Mesh.BILLBOARDMODE_Y;
      bank.material = material;
      bank.isPickable = false;
      bank.renderingGroupId = 0;
      if (index % 2 === 1) bank.scaling.x = -1;
      this.cloudClusters.push({ node:bank, speed:1.1 + (index % 3) * .33 });
    }
  }

  _buildIslands() {
    const seedValue = Array.from(this.seedStr).reduce((h,c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
    // Mission-specific archipelago layouts (default sunset keeps exact prologue coordinates)
    const layouts = {
      sunset: { forest: [340, 85, -260], ind: [-290, -10, -340] },
      storm:  { forest: [-330, 62, -290], ind: [310, 20, -310] },
      night:  { forest: [260, 105, 290], ind: [-310, 15, -240] },
      dawn:   { forest: [-260, 95, 240], ind: [340, 5, -220] },
    };
    const lay = layouts[this.theme] || layouts.sunset;
    const forestPos = this.levelConfig?.archipelago?.forestPos || lay.forest;
    const indPos = this.levelConfig?.archipelago?.industrialPos || lay.ind;
    this.forestIsland = new ForestIsland(this.scene, new BABYLON.Vector3(...forestPos), seedValue, this.shadowGenerator);
    this.industrialIsland = new IndustrialIsland(this.scene, new BABYLON.Vector3(...indPos), seedValue + 201, this.shadowGenerator);
    this.islands.push(this.forestIsland, this.industrialIsland);
    this.landmarks = new ArchipelagoLandmarks(this.scene, this, this.shadowGenerator);
    this._buildShatteredWorldField(seedValue);
    this.biomeIslands = [];
    for (const [bIdx, bSpec] of (this.levelConfig?.archipelago?.extraIslands || []).entries()) {
      const bi = buildBiomeIsland(this.scene, {
        ...bSpec,
        seed: seedValue + 700 + bIdx * 37,
        shadowGen: null,
      });
      this.biomeIslands.push(bi);
      this.islands.push(bi);
      if (bi.generated?.rock) makeSolid(bi.generated.rock);
      if (bi.generated?.terrain) makeSolid(bi.generated.terrain);
    }
    // Instantiate declarative custom GLB props for future custom levels
    for (const prop of this.levelConfig?.archipelago?.customProps || []) {
      this.assets.instantiate(prop.assetId, {
        position: prop.pos || [0, 0, 0],
        rotation: prop.rot || [0, 0, 0],
        scale: prop.scale ?? 1,
        shadowGenerator: this.shadowGenerator,
      });
    }
    for (const root of [this.forestIsland?.group, this.industrialIsland?.group, this.landmarks?.root]) {
      for (const mesh of root?.getChildMeshes?.() || []) {
        const mat = mesh.material;
        const isTransparentEffect = Boolean(
          mat && (mat.alpha < 0.85 || mat.depthWrite === false || mat.diffuseTexture?.hasAlpha || mat.needAlphaBlending?.())
        );
        if (
          mesh.isVisible &&
          mesh.visibility > 0.1 &&
          !isTransparentEffect &&
          !/Leaf|Vine|Flame|Lamp|Light|Screen|Steam|Smog|Haze|Cloud|Plume|Dust|Vapor|Rotor|LiftRail|Sign|Glow|Trail|Smoke|Particle|Atmosphere|Lake|River|Waterfall|Mist|Ring|Coil|Cable|Wire/i.test(mesh.name)
        ) {
          makeSolid(mesh);
        }
      }
    }
  }

  /**
   * Populates the sky with organic satellite islands (buildGeneratedIsland) and
   * thin-instanced 67k-vertex photogrammetry 3D rock formations (boulder_01_1k.gltf).
   */
  /**
   * 8 monumental distant horizon islands (cathedral rock-organ spires, twin-pillar natural arches & terraced mesas)
   * ringing the 360° horizon at 680..1080m — ALL merged into 1 SINGLE DRAW CALL (0.0 ms FPS cost!).
   */
  _buildHorizonSilhouetteIslands() {
    // Replaces dark geometric spikes with sunlit distant low-LOD Fragments of Interbellum Europe (Dover chalk cliffs, Parisian spire cities, Alpine castles & stone viaducts)!
    buildEuropeHorizonArchipelago(this.scene, sculptCraggyRock);
  }

  _buildShatteredWorldField(seedValue = 101) {
    this.shatteredFieldRoot = new BABYLON.TransformNode('shatteredWorldFieldRoot', this.scene);

    // 1. Scenic Satellite Islands balanced across 360° horizon — each with its own Interbellum diorama + multi-tree grove!
    const satelliteIslands = [
      { id: 'sky_sat_0', style: 'forest',     diorama: 'watchtower', x: -175, y: 58,  z: -155, rx: 24, rz: 19, depth: 30, scaleY: 1.35, rot: [0.06, 0.6, -0.05], tree: 'pine_hero.glb' },
      { id: 'sky_sat_1', style: 'military',   diorama: 'signal',     x: 155,  y: 52,  z: -165, rx: 20, rz: 16, depth: 26, scaleY: 1.30, rot: [-0.05, 2.1, 0.06], tree: 'coastal_alder.glb' },
      { id: 'sky_sat_2', style: 'forest',     diorama: 'villa',      x: 215,  y: 64,  z: 185,  rx: 22, rz: 18, depth: 28, scaleY: 1.38, rot: [0.05, 1.4, -0.05], tree: 'pine_hero.glb' },
      { id: 'sky_sat_5', style: 'industrial', diorama: 'depot',      x: -245, y: 28,  z: 215,  rx: 24, rz: 19, depth: 30, scaleY: 1.38, rot: [-0.05, 0.4, 0.05], tree: 'fir_medium.glb' },
      { id: 'sky_sat_7', style: 'military',   diorama: 'aqueduct',   x: 45,   y: 46,  z: 265,  rx: 23, rz: 18, depth: 29, scaleY: 1.36, rot: [-0.06, 1.1, 0.05], tree: 'pine_hero.glb' },
    ];

    for (let sIdx = 0; sIdx < satelliteIslands.length; sIdx++) {
      const sat = satelliteIslands[sIdx];
      // Rich coastal grove around the perimeter so the central diorama stays cleanly framed!
      const satTrees = [
        { file: sat.tree,            x: -sat.rx * 0.48, z: -sat.rz * 0.32, s: 1.18, r: 0.4 + sIdx },
        { file: 'fir_medium.glb',    x: -sat.rx * 0.34, z:  sat.rz * 0.36, s: 1.05, r: 1.9 + sIdx },
        { file: 'coastal_alder.glb', x:  sat.rx * 0.44, z: -sat.rz * 0.28, s: 1.02, r: 2.7 + sIdx },
        { file: 'pine_hero.glb',     x:  sat.rx * 0.38, z:  sat.rz * 0.34, s: 1.12, r: 1.1 + sIdx },
        { file: 'fir_medium.glb',    x: -sat.rx * 0.14, z: -sat.rz * 0.50, s: 0.96, r: 3.4 + sIdx },
      ];
      const builtSat = buildSatelliteIsland(this.scene, {
        id: sat.id,
        seed: `WORLD-${seedValue}-${sat.id}`,
        radiusX: sat.rx,
        radiusZ: sat.rz,
        depth: sat.depth,
        scaleY: sat.scaleY,
        style: sat.style,
        parent: this.shatteredFieldRoot,
        pos: [sat.x, sat.y, sat.z],
        rot: sat.rot,
        trees: satTrees,
        shadowGen: null,
      });
      // Populate each satellite island as a recognizable Fragment of Interbellum Europe!
      if (sat.diorama === 'watchtower') {
        applyDoverChalkCliffs(builtSat, this.scene);
        buildDoverCliffVillage(this.scene, builtSat.node, builtSat.island, sat.rx, sat.rz);
      } else if (sat.diorama === 'villa') {
        buildContinentalSkyCity(this.scene, builtSat.node, builtSat.island, sat.rx, sat.rz);
      } else if (sat.diorama === 'aqueduct') {
        buildGothicRuinsDiorama(this.scene, builtSat.node, builtSat.island);
      } else {
        populateSatelliteIslandDiorama(this.scene, builtSat.node, builtSat.island, sat.diorama, sat.rx, sat.rz);
      }
      this.satelliteNodes ||= new Map();
      this.satelliteNodes.set(sat.id, builtSat);
      this.floatingOrbiters ||= [];
      this.floatingOrbiters.push({
        node: builtSat.node,
        basePos: new BABYLON.Vector3(sat.x, sat.y, sat.z),
        baseRot: [...sat.rot],
        orbitRx: 3.8 + (sIdx % 4) * 1.4,
        orbitRz: 3.2 + ((sIdx + 2) % 4) * 1.2,
        orbitSpeed: (0.14 + (sIdx % 3) * 0.04) * (sIdx % 2 === 0 ? 1 : -1),
        bobAmp: 2.4 + (sIdx % 3) * 0.9,
        bobSpeed: 0.45 + (sIdx % 4) * 0.10,
        spinSpeed: (0.045 + (sIdx % 3) * 0.02) * (sIdx % 2 === 0 ? 1 : -1),
        phase: sIdx * 1.15,
      });
    }

    // 2. Multi-Root Marching-Tetrahedra Floating Rock Formations & Monoliths (same SDF technique & RockProjection shader as Vagabond!)
    const forestRockMat = makeTerrainPBRMaterial(this.scene, 'shatteredForestRockMat', 'aerial_rocks_02', 2, 2, '#d8c4a8');
    applyRockProjection(forestRockMat, this.scene, 'forest');
    const indRockMat = makeTerrainPBRMaterial(this.scene, 'shatteredIndRockMat', 'aerial_rocks_02', 2, 2, '#c8c0b8');
    applyRockProjection(indRockMat, this.scene, 'industrial');
    const milRockMat = makeTerrainPBRMaterial(this.scene, 'shatteredMilRockMat', 'aerial_rocks_02', 2, 2, '#c4c8ce');
    applyRockProjection(milRockMat, this.scene, 'military');

    // Reusable Marching-Tetrahedra rock cluster templates (stepped cliff shoulders + 3 asymmetric hanging roots, zero cones!)
    const spireTemplateMasses = [
      { x: 0,    y: 4,   z: 0,   h: 36, dTop: 5.5, dBot: 16.0, sx: 1.15, sz: 0.88, ry: 0.4 },
      { x: 0,    y: -14, z: 0,   h: 32, dTop: 16.0, dBot: 2.2, sx: 1.15, sz: 0.88, ry: 0.4 },
      { x: -5.5, y: -10, z: 3.0, h: 26, dTop: 11.0, dBot: 1.8, sx: 1.0,  sz: 1.0,  ry: 1.3 },
      { x: 5.2,  y: -12, z: -2.8,h: 24, dTop: 10.5, dBot: 1.8, sx: 0.95, sz: 1.08, ry: -0.9 },
    ];
    const cragTemplateMasses = [
      { x: -3.5, y: 2,   z: -1.5,h: 18, dTop: 7.0,  dBot: 18.0, sx: 1.12, sz: 0.92, ry: 0.3 },
      { x: 4.5,  y: 4,   z: 2.0, h: 20, dTop: 5.5,  dBot: 15.0, sx: 0.94, sz: 1.10, ry: 1.5 },
      { x: -4.0, y: -12, z: -2.0,h: 28, dTop: 17.5, dBot: 2.2,  sx: 1.10, sz: 0.92, ry: 0.3 },
      { x: 4.8,  y: -10, z: 2.5, h: 24, dTop: 14.5, dBot: 2.0,  sx: 0.94, sz: 1.08, ry: 1.5 },
      { x: 0.5,  y: -14, z: -5.0,h: 22, dTop: 12.0, dBot: 1.8,  sx: 1.0,  sz: 1.0,  ry: 2.4 },
    ];

    const rockPlacements = [
      { type: 'spire', pos: [-210, 32, -65],  rot: [0.10, 0.8, -0.09], scale: [1.15, 1.25, 1.10], mat: milRockMat, seed: 401 },
      { type: 'crag',  pos: [-145, 22, 175],  rot: [-0.09, 1.9, 0.11], scale: [1.20, 1.15, 1.15], mat: milRockMat, seed: 409 },
      { type: 'spire', pos: [175,  26, -125], rot: [0.11, 2.4, -0.08], scale: [1.10, 1.20, 1.05], mat: forestRockMat, seed: 419 },
      { type: 'spire', pos: [185,  48, 210],  rot: [-0.10, 1.2, 0.09], scale: [1.25, 1.35, 1.18], mat: forestRockMat, seed: 431 },
      { type: 'crag',  pos: [-345, 14, -275], rot: [-0.11, 0.7, 0.09], scale: [1.25, 1.18, 1.20], mat: indRockMat, seed: 479 },
    ];
    if (this.levelConfig?.extraSpireField) {
      rockPlacements.push(
        { type: 'spire', pos: [110,  70, 95],   rot: [0.06, 0.4, -0.08], scale: [1.15, 2.15, 1.10], mat: forestRockMat, seed: 601 },
        { type: 'spire', pos: [-125, 82, 110],  rot: [-0.07, 1.4, 0.08], scale: [1.20, 2.35, 1.15], mat: milRockMat, seed: 613 },
        { type: 'spire', pos: [195,  90, -15],  rot: [0.08, 2.1, -0.06], scale: [1.18, 2.25, 1.12], mat: forestRockMat, seed: 619 },
        { type: 'spire', pos: [-220, 75, -185], rot: [-0.05, 0.9, 0.09], scale: [1.22, 2.40, 1.18], mat: milRockMat, seed: 631 },
        { type: 'spire', pos: [45,   95, -245], rot: [0.07, 1.7, -0.07], scale: [1.15, 2.20, 1.10], mat: indRockMat, seed: 641 },
      );
    }

    rockPlacements.forEach((rp, idx) => {
      const masses = rp.type === 'spire' ? spireTemplateMasses : cragTemplateMasses;
      const mesh = buildMarchingRockCluster(this.scene, `shatteredMarchingRock_${idx}`, masses, {
        step: 2.8,
        seed: seedValue + rp.seed,
        material: rp.mat,
        parent: this.shatteredFieldRoot,
        pos: rp.pos,
        rot: rp.rot,
        shadowGen: null,
      });
      mesh.scaling.set(...rp.scale);
      makeSolid(mesh);
      // Dress every floating crag/spire with an Interbellum aviation beacon mast + windswept cliff pine (no bare rocks!)
      const topY = rp.type === 'spire' ? 21.5 : 12.2;
      const bMast = BABYLON.MeshBuilder.CreateCylinder(`cragBeaconMast_${idx}`, { diameterTop: 0.18, diameterBottom: 0.42, height: 6.2, tessellation: 6 }, this.scene);
      bMast.parent = mesh; bMast.position.set(rp.type === 'spire' ? 0 : 4.2, topY + 2.8, rp.type === 'spire' ? 0 : 1.8);
      bMast.material = this.scene.getMaterialByName('nomadKitBrassMat') || rp.mat; bMast.isPickable = false;
      const bLamp = BABYLON.MeshBuilder.CreateSphere(`cragBeaconLamp_${idx}`, { diameter: 0.95, segments: 6 }, this.scene);
      bLamp.parent = bMast; bLamp.position.y = 3.2;
      bLamp.material = this.scene.getMaterialByName('nomadKitWarmGlowMat') || rp.mat; bLamp.isPickable = false;
      instantiateGLBInto(
        this.scene,
        './assets/benchmark/models/trees/',
        idx % 2 === 0 ? 'pine_hero.glb' : 'fir_medium.glb',
        mesh,
        new BABYLON.Vector3(rp.type === 'spire' ? 1.8 : -3.4, topY - 1.2, rp.type === 'spire' ? -1.4 : -1.5),
        0.78,
        idx * 1.1,
        null
      );
      this.floatingOrbiters ||= [];
      this.floatingOrbiters.push({
        node: mesh,
        basePos: new BABYLON.Vector3(...rp.pos),
        baseRot: [...rp.rot],
        orbitRx: 4.5 + (idx % 4) * 1.6,
        orbitRz: 3.8 + ((idx + 1) % 4) * 1.4,
        orbitSpeed: (0.16 + (idx % 3) * 0.05) * (idx % 2 === 0 ? -1 : 1),
        bobAmp: 2.8 + (idx % 4) * 0.9,
        bobSpeed: 0.52 + (idx % 3) * 0.12,
        spinSpeed: (0.065 + (idx % 3) * 0.025) * (idx % 2 === 0 ? 1 : -1),
        phase: idx * 1.37 + 0.6,
      });
    });

    this._buildShatteredWorldRelics(seedValue);
  }

  /**
   * Adds shattered-world relics across the islands and mid-air sky:
   * - Strange floating ancient/dieselpunk structures (Celestial Gyro-Astrolabe, Shattered Sky Viaduct, Floating Aether Lighthouse)
   * - Ruined buildings & collapsed watchtowers on islands
   * - Crashed & derelict aircraft wrecks
   */
  _buildShatteredWorldRelics(seedValue = 101) {
    this.relicRings = [];
    const stoneMat = makeTerrainPBRMaterial(this.scene, 'relicStoneMat', 'anti_slip_concrete', 2, 2, '#98a6b2');
    const rustTex = createRustedMetalTexture(this.scene, [154, 102, 68]);
    const rustMat = new BABYLON.PBRMaterial('relicRustMat', this.scene);
    rustMat.albedoTexture = rustTex.albedoTex;
    rustMat.bumpTexture = rustTex.bumpTex;
    rustMat.metallic = 0.68;
    rustMat.roughness = 0.44;

    const brassMat = new BABYLON.PBRMaterial('relicBrassMat', this.scene);
    brassMat.albedoColor = c3('#d49e48');
    brassMat.metallic = 0.85;
    brassMat.roughness = 0.26;

    const aetherMat = new BABYLON.StandardMaterial('relicAetherGlowMat', this.scene);
    aetherMat.diffuseColor = c3('#5cf4ff');
    aetherMat.emissiveColor = c3('#24dcff');

    const amberBeaconMat = new BABYLON.StandardMaterial('relicAmberGlowMat', this.scene);
    amberBeaconMat.diffuseColor = c3('#ffd166');
    amberBeaconMat.emissiveColor = c3('#ff9e2c');

    // 1. Strange Floating Celestial Gyro-Astrolabe & Aether Core at (145, 92, -148) (between Vagabond & ForestIsland)
    const astrolabe = new BABYLON.TransformNode('skyRelicAstrolabe', this.scene);
    astrolabe.parent = this.shatteredFieldRoot;
    astrolabe.position.set(145, 92, -148);
    this.floatingOrbiters.push({
      node: astrolabe,
      basePos: new BABYLON.Vector3(145, 92, -148),
      baseRot: [0.12, 0.4, -0.08],
      orbitRx: 4.2, orbitRz: 3.6, orbitSpeed: 0.15, bobAmp: 3.2, bobSpeed: 0.55, spinSpeed: 0.05, phase: 0.8,
    });

    const core = BABYLON.MeshBuilder.CreatePolyhedron('relicAstrolabeCoreGlow', { type: 2, size: 3.4 }, this.scene);
    core.parent = astrolabe;
    core.material = aetherMat;
    this.relicRings.push({ mesh: core, vx: 0.45, vy: 0.75, vz: 0.25 });

    [13.5, 19.5, 25.5].forEach((diam, idx) => {
      const ring = BABYLON.MeshBuilder.CreateTorus(`relicAstrolabeRing_${idx}`, { diameter: diam, thickness: 0.85 + idx * 0.15, tessellation: 32 }, this.scene);
      ring.parent = astrolabe;
      ring.rotation.set(idx * 0.55, idx * 0.9, idx * 0.35);
      ring.material = idx === 1 ? brassMat : rustMat;
      makeSolid(ring);
      this.relicRings.push({ mesh: ring, vx: (idx % 2 ? 0.28 : -0.22), vy: 0.34 * (idx - 1), vz: (idx === 1 ? 0.32 : -0.18) });
    });

    for (let k = 0; k < 4; k++) {
      const ang = (k / 4) * Math.PI * 2;
      const pillar = BABYLON.MeshBuilder.CreateBox(`relicAstrolabeShard_${k}`, { width: 2.2, height: 9.5, depth: 2.2 }, this.scene);
      pillar.parent = astrolabe;
      pillar.position.set(Math.cos(ang) * 16.5, Math.sin(k * 1.7) * 2.5, Math.sin(ang) * 16.5);
      pillar.rotation.set(0.18, -ang, 0.22);
      pillar.material = stoneMat;
      makeSolid(pillar);
    }

    // 2. Shattered Sky Viaduct / Broken Aqueduct Bridge suspended in mid-air at (-92, 56, -140)
    const viaduct = new BABYLON.TransformNode('skyRelicBrokenBridge', this.scene);
    viaduct.parent = this.shatteredFieldRoot;
    viaduct.position.set(-92, 56, -140);
    viaduct.rotation.set(0.06, 0.52, -0.05);
    this.monolithLandmark = buildAetherMonolithLandmark(this.scene, this.shatteredFieldRoot, new BABYLON.Vector3(-145, 58, 160));
    const monoRock = BABYLON.MeshBuilder.CreateCylinder('nomadMonolithIslandBase', { diameterTop: 22, diameterBottom: 5, height: 24, tessellation: 10 }, this.scene);
    monoRock.parent = this.monolithLandmark.root; monoRock.position.y = -12; monoRock.material = stoneMat; makeSolid(monoRock);
    this.floatingOrbiters.push({
      node: viaduct,
      basePos: new BABYLON.Vector3(-92, 56, -140),
      baseRot: [0.06, 0.52, -0.05],
      orbitRx: 3.0, orbitRz: 2.8, orbitSpeed: -0.12, bobAmp: 2.2, bobSpeed: 0.42, spinSpeed: 0.025, phase: 2.1,
    });

    [-18, 0, 19].forEach((bx, idx) => {
      const span = BABYLON.MeshBuilder.CreateBox(`relicBridgeSpan_${idx}`, { width: 12.5, height: 2.4, depth: 6.4 }, this.scene);
      span.parent = viaduct;
      span.position.set(bx, (idx === 1 ? 1.8 : -1.2), (idx - 1) * 1.6);
      span.rotation.set((idx - 1) * 0.08, (idx % 2 ? 0.09 : -0.07), (idx - 1) * 0.14);
      span.material = stoneMat;
      makeSolid(span);

      const pier = BABYLON.MeshBuilder.CreateBox(`relicBridgePier_${idx}`, { width: 3.4, height: 14.0, depth: 5.8 }, this.scene);
      pier.parent = viaduct;
      pier.position.set(bx - 3.5, -7.5, (idx - 1) * 1.6);
      pier.rotation.z = (idx - 1) * 0.11;
      pier.material = rustMat;
      makeSolid(pier);

      const lamp = BABYLON.MeshBuilder.CreateSphere(`relicBridgeLampGlow_${idx}`, { diameter: 1.2, segments: 8 }, this.scene);
      lamp.parent = span;
      lamp.position.set(0, 2.2, 2.8);
      lamp.material = amberBeaconMat;
    });

    // 3. Derelict Floating Aether Spire & Ruined Watchtower at (48, 96, -245)
    const spireNode = new BABYLON.TransformNode('skyRelicAetherSpire', this.scene);
    spireNode.parent = this.shatteredFieldRoot;
    spireNode.position.set(48, 96, -245);
    this.floatingOrbiters.push({
      node: spireNode,
      basePos: new BABYLON.Vector3(48, 96, -245),
      baseRot: [-0.14, 1.1, 0.16],
      orbitRx: 4.8, orbitRz: 4.2, orbitSpeed: 0.14, bobAmp: 3.4, bobSpeed: 0.48, spinSpeed: -0.04, phase: 3.4,
    });
    const spireTower = BABYLON.MeshBuilder.CreateCylinder('relicSpireBody', { diameterTop: 2.6, diameterBottom: 6.8, height: 26, tessellation: 10 }, this.scene);
    spireTower.parent = spireNode;
    spireTower.material = rustMat;
    makeSolid(spireTower);
    for (const ry of [-6, 2, 9]) {
      const collar = BABYLON.MeshBuilder.CreateTorus(`relicSpireCollarGlow_${ry}`, { diameter: 6.4, thickness: 0.45, tessellation: 20 }, this.scene);
      collar.parent = spireNode;
      collar.position.y = ry;
      collar.material = aetherMat;
    }

    // 4. Crashed Aircraft Wrecks & Ruined Buildings parented directly to their orbiting Satellite Islands
    const wreckPlacements = [
      { satId: 'sky_sat_1', dir: './assets/aircraft/',  file: 'scrapyard_fighter.glb', localXZ: [1.5, 2.0],  scale: 1.45, rot: [-0.34, 0.85, 0.48] },
      { satId: 'sky_sat_0', dir: './assets/aircraft/',  file: 'scrapyard_bomber.glb',  localXZ: [2.0, 2.0],  scale: 1.35, rot: [0.28, -1.2, -0.38] },
      { satId: 'sky_sat_2', dir: './assets/buildings/', file: 'control_tower.glb',     localXZ: [0.0, 0.0],  scale: 0.95, rot: [0.22, 0.65, -0.26] },
      { satId: 'sky_sat_7', dir: './assets/buildings/', file: 'flak_turret.glb',       localXZ: [0.0, 0.0],  scale: 1.05, rot: [-0.25, 1.4, 0.18] },
    ];
    wreckPlacements.forEach((wp, idx) => {
      const satBuilt = this.satelliteNodes?.get(wp.satId);
      if (!satBuilt?.node) return;
      const [lx, lz] = wp.localXZ;
      const ly = satBuilt.island?.getHeight ? satBuilt.island.getHeight(lx, lz) : 1.6;
      const mount = new BABYLON.TransformNode(`shatteredWreckMount_${idx}`, this.scene);
      mount.parent = satBuilt.node;
      mount.position.set(lx, ly + 0.15, lz);
      mount.rotation.set(...wp.rot);
      instantiateGLBInto(this.scene, wp.dir, wp.file, mount, new BABYLON.Vector3(0, 0, 0), wp.scale, 0, this.shadowGenerator);
    });
  }

  registerVagabondBase(asteroidBase) {
    this.vagabondBase = asteroidBase;
    this.asteroidBase = asteroidBase;
    asteroidBase.targetPlanet = null;
    asteroidBase.group.position.set(0, 35, 0);
    asteroidBase.prevPos.copyFrom(asteroidBase.group.position);
    enhanceVagabondIsland(asteroidBase, this.scene, this.shadowGenerator);
    this.skyLife = new SkyLife(this.scene,asteroidBase,this.forestIsland);
    if (!this.islands.includes(asteroidBase)) {
      this.islands.unshift(asteroidBase);
    }
    // Sweeping Anti-Aircraft Searchlights on Vagabond during Night Intercept missions!
    if (this.theme === 'night' && !(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      const beamMat = new BABYLON.StandardMaterial('vagSearchlightBeamMat', this.scene);
      beamMat.emissiveColor = c3('#cfe4ff');
      beamMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
      beamMat.disableLighting = true;
      beamMat.backFaceCulling = false;
      beamMat.depthWrite = false;
      beamMat.alpha = 0.14;
      beamMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
      for (const [idx, sp] of [[-12, 22.0, -18], [14, 15.8, 25]].entries()) {
        const piv = new BABYLON.TransformNode(`vagSearchlightPiv_${idx}`, this.scene);
        piv.parent = asteroidBase.group;
        piv.position.set(...sp);
        const cone = BABYLON.MeshBuilder.CreateCylinder(`vagSearchlightBeam_${idx}`, { diameterTop: 26, diameterBottom: 1.2, height: 220, tessellation: 14 }, this.scene);
        cone.parent = piv;
        cone.position.y = 110;
        cone.material = beamMat;
        cone.isPickable = false;
        cone.checkCollisions = false;
        this.searchlights.push({ piv, phase: idx * 2.4 });
      }
    }
    // Pre-warm materials asynchronously so sharp camera turns never stall on synchronous WebGL shader compilation
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      this.scene.autoClear = false;
      this.scene.executeWhenReady(() => {
        const seen = new Set();
        const queue = [];
        for (const m of this.scene.meshes) {
          if (!m || m.isDisposed?.() || !m.material || seen.has(m.material)) continue;
          seen.add(m.material);
          queue.push(m);
        }
        let qi = 0;
        const warmNext = () => {
          if (this.scene.isDisposed || qi >= queue.length) return;
          const mesh = queue[qi++];
          if (mesh && !mesh.isDisposed() && mesh.material?.forceCompilationAsync) {
            mesh.material.forceCompilationAsync(mesh).catch(() => {}).finally(() => setTimeout(warmNext, 16));
          } else {
            setTimeout(warmNext, 0);
          }
        };
        setTimeout(warmNext, 120);
      });
    }
  }

  /**
   * Floating-origin hook for large open-world flights without float precision jitter.
   */
  recenterOrigin(focusPos, threshold = 2400) {
    if (!focusPos || focusPos.length() < threshold) return false;
    const shift = focusPos.clone();
    this.worldOriginOffset.addInPlace(shift);
    for (const isl of this.islands) {
      if (isl.group) isl.group.position.subtractInPlace(shift);
      if (isl._basePos) isl._basePos.subtractInPlace(shift);
    }
    if (this.floatingOrbiters) {
      for (const orb of this.floatingOrbiters) {
        if (orb.basePos) orb.basePos.subtractInPlace(shift);
      }
    }
    if (this.shatteredFieldRoot) this.shatteredFieldRoot.position.subtractInPlace(shift);
    if (this.landmarks?.root) this.landmarks.root.position.subtractInPlace(shift);
    for (const cl of this.cloudClusters) {
      cl.node.position.subtractInPlace(shift);
    }
    return true;
  }

  updateStreaming(cameraPos) {
    if (!cameraPos) return;
    for (const isl of this.islands) {
      if (!isl.detailNodes || !isl.group) continue;
      const dist = BABYLON.Vector3.Distance(cameraPos, isl.group.position);
      const showDetails = dist < 1100;
      for (const n of isl.detailNodes) {
        if (n && n.setEnabled) n.setEnabled(showDetails);
      }
    }
  }

  updateShadowFocus(focusPos) {
    if (!this.sunDirLight || !focusPos) return;
    const light = this.sunDirLight;
    // Snap shadow camera center to shadow-map texel grid (280m / 2048px) to prevent edge shimmering
    const texel = 280 / 2048;
    const sx = Math.round(focusPos.x / texel) * texel;
    const sy = Math.round(focusPos.y / texel) * texel;
    const sz = Math.round(focusPos.z / texel) * texel;
    light.position.set(sx, sy, sz).addInPlace(this.sunDir.scale(180));
    // A local orthographic footprint is stable instead of stretching to every distant island.
    light.autoUpdateExtends = false;
    light.orthoLeft = -140; light.orthoRight = 140;
    light.orthoBottom = -140; light.orthoTop = 140;
    light.shadowMinZ = 20; light.shadowMaxZ = 420;
    const map = this.shadowGenerator?.getShadowMap();
    if (!map || this.simTime < (this._shadowFilterAfter || 0)) return;
    if (map.refreshRate !== 2) map.refreshRate = 2;
    this._shadowFilterAfter = this.simTime + 0.80;
    this._shadowCasterRegistry ||= new Set();
    // Public addShadowCaster calls, including asynchronous GLB imports, append to renderList.
    // Capture those additions before filtering, and retain distant casters for later revisits.
    for (const mesh of map.renderList || []) this._shadowCasterRegistry.add(mesh);
    const selected = [];
    let invisible = 0, distant = 0, tiny = 0;
    for (const mesh of this._shadowCasterRegistry) {
      if (!mesh || mesh.isDisposed()) { this._shadowCasterRegistry.delete(mesh); continue; }
      const material = mesh.material;
      if (!mesh.isVisible || mesh.visibility <= .01 || !mesh.isEnabled() ||
          mesh.metadata?.collisionProxy || mesh.metadata?.celestial ||
          /Flame|Glow|Lamp|Light|Beacon|Lens|Trail|Smoke|Particle|Preview|Shadow|Step|Stripe|Post|Rivet|Bolt|Cable|Wire|Fern|Lantern/i.test(mesh.name) ||
          /glow|emissive|lens/i.test(material?.name || '') || (material && material.alpha < .5)) {
        invisible++; continue;
      }
      const bounds = mesh.getBoundingInfo();
      const radius = bounds.boundingSphere.radiusWorld;
      if (radius < .75) { tiny++; continue; }
      // Sphere intersection, not pivot distance: broad terrain/instanced trees keep their edge shadows.
      if (BABYLON.Vector3.DistanceSquared(bounds.boundingSphere.centerWorld, focusPos) > (150 + radius) ** 2) {
        distant++; continue;
      }
      selected.push(mesh);
    }
    map.renderList = selected;
    this.scene.metadata.shadowBudget = {
      registered:this._shadowCasterRegistry.size, selected:selected.length,
      invisible, distant, tiny, radius:200, orthoHalfExtent:140, filterIntervalSeconds:.80,
    };
  }

  update(dt, _ship, cameraPos) {
    this.simTime += dt;
    this.skyLife?.update(dt, this._skyLifeCtx || {});
    this.landmarks?.update(dt);
    this.practicalLights?.update(dt);
    this.celestials?.update(dt);
    if (this.skyMat) {
      this.skyMat.setFloat('uTime', this.simTime);
      if (cameraPos) this.skyMat.setVector3('uCameraPosition', cameraPos);
      this.skyMat.setFloat('uTimeOfDay', this.timeOfDay);
    }
    if (this._sunFlareMesh && cameraPos) {
      const sDir = new BABYLON.Vector3(this.sunDir.x, 0.125, this.sunDir.z).normalize();
      this._sunFlareMesh.position.copyFrom(cameraPos).addInPlace(sDir.scale(2600));
    }
    // Distance-cull Vagabond interior PointLights when camera is far (flight/menu) so Vagabond shades against 3 lights instead of 8+!
    if (this.vagabondBase?._towerBeaconRig) {
      this.vagabondBase._towerBeaconRig.rotation.y += dt * 1.15;
      if (this.vagabondBase._towerBeaconMat) {
        this.vagabondBase._towerBeaconMat.alpha = this.timeOfDay < 0.35 ? 0.58 : 0.24;
      }
    }

    if (this.vagabondBase?._windsock) {
      this.vagabondBase._windsock.rotation.y = Math.sin(this.simTime * 2.2) * 0.24;
      this.vagabondBase._windsock.rotation.z = Math.sin(this.simTime * 5.8) * 0.08;
    }
    if (this.vagabondBase?._exhaustFans?.length) {
      for (const f of this.vagabondBase._exhaustFans) f.rotation.z += dt * 5.2;
    }
    if (this.vagabondBase?._runwayLamps?.length) {
      const wave = (this.simTime * 3.8) % 7;
      for (const rl of this.vagabondBase._runwayLamps) {
        const dist = Math.abs((6 - rl.idx) - wave);
        const pulse = dist < 1.1 ? 1.0 + (1.1 - dist) * 0.72 : 0.85;
        rl.mesh.scaling.setAll(pulse);
      }
    }
    if (this.vagabondBase?._pennants?.length) {
      this.vagabondBase._pennants.forEach((p, idx) => {
        p.rotation.y = Math.sin(this.simTime * 2.8 + idx * 1.4) * 0.28;
        p.rotation.z = Math.sin(this.simTime * 6.2 + idx) * 0.08;
      });
    }
    for (const bi of this.biomeIslands || []) {
      bi.update?.(this.simTime);
    }
    // Distance-cull Vagabond interior PointLights when camera is far (flight/menu) so Vagabond shades against 3 lights instead of 8+!
    if (this.vagabondBase && cameraPos) {
      const dVag = BABYLON.Vector3.Distance(cameraPos, this.vagabondBase.group.position);
      const wantInteriorLights = this._interiorLightsOn ? dVag < 64 : dVag < 52;
      if (wantInteriorLights !== this._interiorLightsOn) {
        this._interiorLightsOn = wantInteriorLights;
        for (const l of this.scene.lights) {
          if (l.getTypeID() === BABYLON.Light.LIGHTTYPEID_POINTLIGHT && !/baseHouseLamp|baseGenLight|baseDeckLight|hangarInteriorLight_1/.test(l.name)) {
            l.setEnabled(wantInteriorLights);
          }
        }
      }
    }
    for (const mat of this.cloudSeaMats) {
      mat.setFloat('uTime', this.simTime);
      mat.setFloat('uCloudVolume', this.scene.metadata?.graphicsQuality === 'low' ? 0 : 1);
      if (cameraPos) mat.setVector3('uCamPos', cameraPos);
    }
    if (this.cloudBankMaterial) {
      this.cloudBankMaterial.alpha = this.timeOfDay < .1 ? .17 : this.timeOfDay < .4 ? .57 : .95;
    }
    for (const cl of this.cloudClusters) {
      cl.node.position.x += cl.speed * dt;
      if (cl.node.position.x > 1150) cl.node.position.x = -1150;
    }
    if (this.floatingOrbiters) {
      const t = this.simTime;
      for (const orb of this.floatingOrbiters) {
        if (!orb.node || orb.node.isDisposed()) continue;
        const ang = t * orb.orbitSpeed + orb.phase;
        const dx = (Math.cos(ang) - Math.cos(orb.phase)) * orb.orbitRx;
        const dz = (Math.sin(ang) - Math.sin(orb.phase)) * orb.orbitRz;
        const dy = Math.sin(t * orb.bobSpeed + orb.phase) * orb.bobAmp;
        orb.node.position.set(orb.basePos.x + dx, orb.basePos.y + dy, orb.basePos.z + dz);
        orb.node.rotation.set(
          orb.baseRot[0] + Math.sin(t * 0.35 + orb.phase) * 0.025,
          orb.baseRot[1] + t * orb.spinSpeed,
          orb.baseRot[2] + Math.cos(t * 0.31 + orb.phase) * 0.025
        );
      }
    }
    if (this.relicRings) {
      for (const rr of this.relicRings) {
        if (!rr.mesh || rr.mesh.isDisposed()) continue;
        rr.mesh.rotation.x += rr.vx * dt;
        rr.mesh.rotation.y += rr.vy * dt;
        rr.mesh.rotation.z += rr.vz * dt;
      }
    }
    if (this.forestIsland) this.forestIsland.update(dt);
    if (this.industrialIsland) this.industrialIsland.update(dt);
    if (this.monolithLandmark?.crystal) {
      this.monolithLandmark.crystal.rotation.y += dt * 0.65;
      this.monolithLandmark.crystal.position.y = 9.5 + Math.sin(this.simTime * 1.6) * 0.85;
    }
    // Animate LSO officer marshaling wands & gently scan the 2 bow triple-barrel main cruiser turrets
    if (this.vagabondBase?.lsoArms?.length) {
      const w = Math.sin(this.simTime * 5.2);
      this.vagabondBase.lsoArms[0].rotation.z = 0.35 + w * 0.55;
      this.vagabondBase.lsoArms[1].rotation.z = -0.35 - w * 0.55;
    }
    if (this.vagabondBase?.mainTurrets?.length && !this.vagabondBase.missionBatteryControlled) {
      this.vagabondBase.mainTurrets.forEach((t, idx) => {
        t.yawPivot.rotation.y = Math.sin(this.simTime * 0.22 + idx * 0.8) * 0.36;
        t.pitchPivot.rotation.z = -(t.baseElev + Math.sin(this.simTime * 0.35 + idx) * 0.04);
      });
    }
    // Sweep AA searchlight beams across the night sky
    for (const sl of this.searchlights || []) {
      sl.piv.rotation.y = Math.sin(this.simTime * 0.42 + sl.phase) * 1.15;
      sl.piv.rotation.x = 0.38 + Math.cos(this.simTime * 0.65 + sl.phase) * 0.28;
    }
    // Periodic storm lightning flashes illuminating the crimson storm clouds
    if (this.theme === 'storm' && this.sunDirLight) {
      this._lightningCd -= dt;
      if (this._lightningCd <= 0) {
        this._lightningCd = 5.5 + Math.random() * 6.5;
        this._lightningFlash = 0.24;
      }
      if (this._lightningFlash > 0) {
        this._lightningFlash = Math.max(0, this._lightningFlash - dt);
        this.sunDirLight.intensity = this._baseSunIntensity + (this._lightningFlash > 0.14 ? 4.2 : 1.6);
      } else {
        this.sunDirLight.intensity = this._baseSunIntensity;
      }
    }
    this.updateStreaming(cameraPos);
  }
}
