// Benchmark Coastal Diorama: full PBR + glTF asset pipeline reference location
// Built as an isolated showcase zone (?shot=bench_shore | ?shot=bench_forest)

const BENCH_MODELS = [
  { key: 'pine', dir: './assets/benchmark/models/trees/', file: 'pine_hero.glb', targetHeight: 11.0 },
  { key: 'fir', dir: './assets/benchmark/models/trees/', file: 'fir_medium.glb', targetHeight: 6.4 },
  { key: 'alder', dir: './assets/benchmark/models/trees/', file: 'coastal_alder.glb', targetHeight: 7.2 },
  { key: 'snag', dir: './assets/benchmark/models/trees/', file: 'dead_snag.glb', targetHeight: 7.5 },
  { key: 'grass', dir: './assets/benchmark/models/trees/', file: 'grass_clump.glb', targetHeight: 0.75 },
  { key: 'fern', dir: './assets/benchmark/models/fern_02/', file: 'fern_02_1k.gltf', targetHeight: 0.95 },
  { key: 'boulder', dir: './assets/benchmark/models/boulder_01/', file: 'boulder_01_1k.gltf', targetHeight: 1.8 },
  { key: 'barrel', dir: './assets/benchmark/models/Barrel_01/', file: 'Barrel_01_1k.gltf', targetHeight: 0.98 },
  { key: 'crate', dir: './assets/benchmark/models/old_military_crate/', file: 'old_military_crate_1k.gltf', targetHeight: 0.85 },
  { key: 'lantern', dir: './assets/benchmark/models/Lantern_01/', file: 'Lantern_01_1k.gltf', targetHeight: 0.48 },
];

function createPadDecalTexture(scene) {
  const size = 512;
  const tex = new BABYLON.DynamicTexture('benchPadDecal', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();
  ctx.clearRect(0, 0, size, size);

  // Subtle grime & oil stains
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 4 + Math.random() * 24;
    ctx.fillStyle = `rgba(18, 20, 22, ${0.02 + Math.random() * 0.05})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Painted expedition landing circle (faded amber/ochre)
  ctx.strokeStyle = 'rgba(218, 162, 72, 0.72)';
  ctx.lineWidth = 12;
  ctx.setLineDash([28, 14]);
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.5, size * 0.34, 0, Math.PI * 2);
  ctx.stroke();

  // Inner H / crosshairs
  ctx.setLineDash([]);
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(225, 198, 140, 0.58)';
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.5, size * 0.16, 0, Math.PI * 2);
  ctx.stroke();

  // Hazard chevrons on edges
  ctx.fillStyle = 'rgba(212, 152, 54, 0.65)';
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(20 + i * 40, 12, 22, 12);
    ctx.fillRect(20 + i * 40, size - 24, 22, 12);
  }

  // Scorch mark at center from thruster exhaust
  const grad = ctx.createRadialGradient(size * 0.5, size * 0.5, 6, size * 0.5, size * 0.5, size * 0.2);
  grad.addColorStop(0, 'rgba(12, 10, 8, 0.55)');
  grad.addColorStop(0.5, 'rgba(22, 18, 14, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.5, size * 0.2, 0, Math.PI * 2);
  ctx.fill();

  tex.hasAlpha = true;
  tex.update();
  return tex;
}

class TerrainSplatPlugin extends BABYLON.MaterialPluginBase {
  constructor(material, sandTex, forestTex, cliffTex) {
    super(material, 'TerrainSplatPlugin', 200, { TERRAIN_SPLAT: false });
    this._sandTex = sandTex;
    this._forestTex = forestTex;
    this._cliffTex = cliffTex;
    this._enable(true);
  }

  prepareDefines(defines) {
    defines.TERRAIN_SPLAT = true;
  }

  getClassName() {
    return 'TerrainSplatPlugin';
  }

  getSamplers(samplers) {
    samplers.push('splatSandTex', 'splatForestTex', 'splatCliffTex');
  }

  bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
    if (this._sandTex) uniformBuffer.setTexture('splatSandTex', this._sandTex);
    if (this._forestTex) uniformBuffer.setTexture('splatForestTex', this._forestTex);
    if (this._cliffTex) uniformBuffer.setTexture('splatCliffTex', this._cliffTex);
  }

  getCustomCode(shaderType) {
    if (shaderType === 'vertex') {
      return {
        CUSTOM_VERTEX_DEFINITIONS: `
          varying vec4 vSplatWeights;
          varying vec2 vSplatUV;
        `,
        CUSTOM_VERTEX_MAIN_END: `
          vSplatWeights = color;
          vSplatUV = uv;
        `,
      };
    }
    if (shaderType === 'fragment') {
      return {
        CUSTOM_FRAGMENT_DEFINITIONS: `
          varying vec4 vSplatWeights;
          varying vec2 vSplatUV;
          uniform sampler2D splatSandTex;
          uniform sampler2D splatForestTex;
          uniform sampler2D splatCliffTex;
        `,
        CUSTOM_FRAGMENT_UPDATE_ALBEDO: `
          vec3 sandCol = pow(texture2D(splatSandTex, vSplatUV * 18.0).rgb, vec3(2.2));
          vec3 forestCol = pow(texture2D(splatForestTex, vSplatUV * 16.0).rgb, vec3(2.2));
          vec3 cliffCol = pow(texture2D(splatCliffTex, vSplatUV * 12.0).rgb, vec3(2.2));
          vec4 w = max(vSplatWeights, vec4(0.0));
          float wSum = max(0.001, w.r + w.g + w.b + w.a);
          w /= wSum;
          surfaceAlbedo = surfaceAlbedo * w.g + sandCol * w.r + forestCol * w.b + cliffCol * w.a;
        `,
      };
    }
    return null;
  }
}

export class BenchmarkCoast {
  constructor(scene, shadowGenerator = null) {
    this.scene = scene;
    this.shadowGenerator = shadowGenerator;
    this.origin = new BABYLON.Vector3(0, -1200, 0);
    this.group = new BABYLON.TransformNode('benchmarkCoastRoot', scene);
    this.group.position.copyFrom(this.origin);

    this.padLocalPos = new BABYLON.Vector3(3.0, 3.1, 0.0);
    this.forestPlayerLocalPos = new BABYLON.Vector3(26.0, 0, 6.0);
    this.sunDir = new BABYLON.Vector3(-0.68, 0.28, -0.68).normalize();
    this.waterTime = 0;
    this.readyPromise = null;
    this._assetsLoaded = false;
    this._beaconMat = null;

    this._buildSkyDome();
    this._buildTerrain();
    this._buildWater();
    this._buildLandingPad();
    this._buildLights();
    this.forestPlayerLocalPos.y = this.getHeight(this.forestPlayerLocalPos.x, this.forestPlayerLocalPos.z);
  }

  getHeight(lx, lz) {
    // Sculpted coastal bay (west) -> sandy beach -> headland plateau -> rolling forested hills
    const coastLine = -8.0 + Math.sin(lz * 0.065) * 5.0 + Math.cos(lz * 0.14) * 1.8;
    const distFromCoast = lx - coastLine;

    let h = 0;
    if (distFromCoast < 0) {
      h = Math.max(-4.5, distFromCoast * 0.22);
    } else {
      const baseRise = Math.min(11.5, Math.pow(distFromCoast, 0.72) * 0.36);
      const ridge =
        Math.sin(lx * 0.065 + 0.4) * Math.cos(lz * 0.06 - 0.3) * 1.35 +
        Math.sin(lx * 0.14 - lz * 0.12) * 0.45;
      h = baseRise + ridge * Math.min(1.0, distFromCoast / 22.0);
    }

    // Smooth coastal headland plateau around landing pad (3, 0)
    const pdx = lx - this.padLocalPos.x;
    const pdz = lz - this.padLocalPos.z;
    const padDist = Math.hypot(pdx, pdz);
    if (padDist < 16.0) {
      const t = Math.max(0, Math.min(1, (16.0 - padDist) / 7.5));
      const smooth = t * t * (3 - 2 * t);
      h = h * (1 - smooth) + 2.7 * smooth;
    }

    // Gentle forest trail around player (26, 6)
    const fdx = lx - this.forestPlayerLocalPos.x;
    const fdz = lz - this.forestPlayerLocalPos.z;
    const fpDist = Math.hypot(fdx, fdz);
    if (fpDist < 9.0) {
      const t = Math.max(0, Math.min(1, (9.0 - fpDist) / 5.0));
      const smooth = t * t * (3 - 2 * t);
      h = h * (1 - smooth * 0.7) + 4.4 * (smooth * 0.7);
    }

    return h;
  }

  _getNormal(lx, lz) {
    const e = 0.55;
    const hL = this.getHeight(lx - e, lz);
    const hR = this.getHeight(lx + e, lz);
    const hD = this.getHeight(lx, lz - e);
    const hU = this.getHeight(lx, lz + e);
    return new BABYLON.Vector3(hL - hR, 2 * e, hD - hU).normalize();
  }

  _buildSkyDome() {
    if (!BABYLON.Effect.ShadersStore.benchSkyVertexShader) {
      BABYLON.Effect.ShadersStore.benchSkyVertexShader = `
        precision highp float;
        attribute vec3 position;
        uniform mat4 worldViewProjection;
        uniform mat4 world;
        varying vec3 vDir;
        void main() {
          vec4 wp = world * vec4(position, 1.0);
          vDir = normalize(position);
          gl_Position = worldViewProjection * vec4(position, 1.0);
        }
      `;
      BABYLON.Effect.ShadersStore.benchSkyFragmentShader = `
        precision highp float;
        varying vec3 vDir;
        uniform vec3 sunDir;
        uniform float time;
        uniform float twilight;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.04;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 d = normalize(vDir);
          float h = clamp(d.y, -0.2, 1.0);
          float sunDot = max(0.0, dot(d, normalize(sunDir)));

          // Twilight / golden-hour coastal sky palette
          vec3 zenith = mix(vec3(0.085, 0.175, 0.285), vec3(0.025, 0.055, 0.115), twilight);
          vec3 midSky = mix(vec3(0.22, 0.39, 0.50), vec3(0.08, 0.16, 0.25), twilight);
          vec3 horizon = mix(vec3(0.56, 0.62, 0.60), vec3(0.24, 0.31, 0.38), twilight);
          vec3 sunHorizon = mix(vec3(0.86, 0.58, 0.36), vec3(0.68, 0.36, 0.24), twilight);

          vec3 col = mix(horizon, midSky, smoothstep(0.0, 0.24, max(0.0, h)));
          col = mix(col, zenith, smoothstep(0.18, 0.78, max(0.0, h)));

          // Mie scattering around sun near horizon (controlled exposure, no blown-out disc)
          float sunGlow = pow(sunDot, 5.0) * smoothstep(0.65, -0.05, h);
          col = mix(col, sunHorizon, clamp(sunGlow * 0.72, 0.0, 1.0));
          col += vec3(0.95, 0.78, 0.56) * pow(sunDot, 42.0) * 0.35;
          col += vec3(1.0, 0.92, 0.80) * smoothstep(0.9988, 0.9997, sunDot) * 0.65;

          // Subtle high-altitude clouds
          if (h > 0.02) {
            vec2 uv = d.xz / (h + 0.18) * 1.3 + vec2(time * 0.003, 0.0);
            float c = fbm(uv * 1.8);
            float cloudMask = smoothstep(0.48, 0.76, c) * smoothstep(0.02, 0.16, h) * smoothstep(0.85, 0.22, h);
            vec3 cloudCol = mix(vec3(0.42, 0.50, 0.56), vec3(0.94, 0.72, 0.52), pow(sunDot, 2.5));
            col = mix(col, cloudCol, cloudMask * 0.52);
          }

          // Below horizon mist
          if (h < 0.0) {
            col = mix(col, vec3(0.10, 0.18, 0.24), smoothstep(0.0, -0.18, h));
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `;
    }

    const skyMat = new BABYLON.ShaderMaterial('benchSkyMat', this.scene, {
      vertex: 'benchSky',
      fragment: 'benchSky',
    }, {
      attributes: ['position'],
      uniforms: ['world', 'worldViewProjection', 'sunDir', 'time', 'twilight'],
    });
    skyMat.backFaceCulling = false;
    skyMat.disableDepthWrite = true;
    skyMat.setVector3('sunDir', this.sunDir);
    skyMat.setFloat('time', 0);
    skyMat.setFloat('twilight', 0);

    const skyDome = BABYLON.MeshBuilder.CreateSphere('benchSkyDome', { diameter: 820, segments: 32 }, this.scene);
    skyDome.parent = this.group;
    skyDome.material = skyMat;
    skyDome.isPickable = false;
    skyDome.infiniteDistance = false;
    this._skyMat = skyMat;
  }

  _buildTerrain() {
    const size = 160;
    const sub = 132;
    const ground = BABYLON.MeshBuilder.CreateGround('benchTerrain', {
      width: size,
      height: size,
      subdivisions: sub,
      updatable: true,
    }, this.scene);
    ground.parent = this.group;

    const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const colors = new Float32Array((positions.length / 3) * 4);
    const normals = new Float32Array(positions.length);

    for (let i = 0; i < positions.length / 3; i++) {
      const lx = positions[i * 3];
      const lz = positions[i * 3 + 2];
      const y = this.getHeight(lx, lz);
      positions[i * 3 + 1] = y;

      const n = this._getNormal(lx, lz);
      normals[i * 3] = n.x;
      normals[i * 3 + 1] = n.y;
      normals[i * 3 + 2] = n.z;

      const slope = 1.0 - n.y; // 0 = flat, 1 = vertical
      let wSand = Math.max(0, 1.0 - Math.max(0, y - 0.8) / 1.8);
      let wCliff = Math.max(0, Math.min(1, (slope - 0.10) / 0.22));
      let wForest = Math.max(0, Math.min(1, (lx - 4) / 16)) * Math.max(0, 1 - wCliff);
      let wGrass = Math.max(0.05, (1 - wSand) * (1 - wCliff) * (1 - wForest * 0.72));

      const sum = wSand + wGrass + wForest + wCliff;
      colors[i * 4] = wSand / sum;
      colors[i * 4 + 1] = wGrass / sum;
      colors[i * 4 + 2] = wForest / sum;
      colors[i * 4 + 3] = wCliff / sum;
    }

    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
    ground.refreshBoundingInfo();
    ground.receiveShadows = true;

    const mat = new BABYLON.PBRMaterial('benchTerrainPBR', this.scene);
    const grassDiff = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg', this.scene);
    grassDiff.uScale = 16;
    grassDiff.vScale = 16;
    const grassNorm = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/nor_gl.jpg', this.scene);
    grassNorm.uScale = 16;
    grassNorm.vScale = 16;
    const grassArm = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/arm.jpg', this.scene);
    grassArm.uScale = 16;
    grassArm.vScale = 16;

    mat.albedoTexture = grassDiff;
    mat.bumpTexture = grassNorm;
    mat.bumpTexture.level = 1.15;
    mat.invertNormalMapX = false;
    mat.invertNormalMapY = true;
    mat.metallicTexture = grassArm;
    mat.useAmbientOcclusionFromMetallicTextureRed = true;
    mat.useRoughnessFromMetallicTextureGreen = true;
    mat.useMetallnessFromMetallicTextureBlue = true;
    mat.metallic = 0.0;
    mat.roughness = 0.92;
    mat.environmentIntensity = 0.72;

    const sandTex = new BABYLON.Texture('./assets/benchmark/textures/coast_sand_01/Diffuse.jpg', this.scene);
    const forestTex = new BABYLON.Texture('./assets/benchmark/textures/brown_mud_leaves_01/Diffuse.jpg', this.scene);
    const cliffTex = new BABYLON.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', this.scene);
    new TerrainSplatPlugin(mat, sandTex, forestTex, cliffTex);

    ground.material = mat;
    this.terrainMesh = ground;
  }

  _buildWater() {
    if (!BABYLON.Effect.ShadersStore.benchWaterVertexShader) {
      BABYLON.Effect.ShadersStore.benchWaterVertexShader = `
        precision highp float;
        attribute vec3 position;
        attribute vec4 color;
        uniform mat4 worldViewProjection;
        uniform mat4 world;
        uniform float time;
        varying vec3 vWorldPos;
        varying float vDepth;
        void main() {
          vec3 p = position;
          float wave = sin(p.x * 0.45 + time * 1.4) * 0.045 + cos(p.z * 0.38 - time * 1.1) * 0.04;
          p.y += wave * clamp(color.r * 0.6, 0.0, 1.0);
          vec4 wp = world * vec4(p, 1.0);
          vWorldPos = wp.xyz;
          vDepth = color.r;
          gl_Position = worldViewProjection * vec4(p, 1.0);
        }
      `;
      BABYLON.Effect.ShadersStore.benchWaterFragmentShader = `
        precision highp float;
        varying vec3 vWorldPos;
        varying float vDepth;
        uniform vec3 cameraPosition;
        uniform vec3 sunDir;
        uniform float time;

        float hash2(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float vnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x),
                     mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float waterFbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            v += a * vnoise(p);
            p = rot * p * 2.07 + vec2(13.7, 7.1);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = vWorldPos.xz;
          float eps = 0.22;
          vec2 p1 = p * 0.34 + vec2(time * 0.14, time * 0.09);
          vec2 p2 = p * 0.92 - vec2(time * 0.19, -time * 0.13);
          float h0 = waterFbm(p1) * 0.65 + waterFbm(p2) * 0.35;
          float hx = waterFbm(p1 + vec2(eps, 0.0)) * 0.65 + waterFbm(p2 + vec2(eps, 0.0)) * 0.35;
          float hz = waterFbm(p1 + vec2(0.0, eps)) * 0.65 + waterFbm(p2 + vec2(0.0, eps)) * 0.35;
          vec3 N = normalize(vec3((h0 - hx) * 1.15, 1.0, (h0 - hz) * 1.15));
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(sunDir);

          float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.8);
          vec3 shallowCol = vec3(0.16, 0.42, 0.43);
          vec3 deepCol = vec3(0.045, 0.125, 0.195);
          vec3 waterCol = mix(shallowCol, deepCol, smoothstep(0.12, 2.8, vDepth));

          vec3 skyReflect = mix(vec3(0.28, 0.44, 0.52), vec3(0.80, 0.58, 0.40), pow(max(0.0, dot(reflect(-V, N), L)), 3.2));
          vec3 col = mix(waterCol, skyReflect, clamp(fresnel * 0.78 + 0.06, 0.0, 0.85));

          vec3 H = normalize(L + V);
          float spec = pow(max(0.0, dot(N, H)), 128.0);
          col += vec3(1.0, 0.88, 0.68) * spec * 0.85;

          // Organic shoreline foam modulated by FBM
          float foamNoise = waterFbm(p * 1.1 + vec2(time * 0.12, 0.0));
          float foamMask = smoothstep(0.38, 0.01, vDepth - (foamNoise - 0.5) * 0.18);
          col = mix(col, vec3(0.82, 0.86, 0.86), foamMask * 0.58);

          // Horizon mist blend
          float dist = length(vWorldPos.xz - cameraPosition.xz);
          float fogFactor = 1.0 - exp(-pow(dist * 0.0040, 2.0));
          col = mix(col, vec3(0.56, 0.60, 0.58), clamp(fogFactor, 0.0, 1.0));

          float alpha = clamp(0.45 + vDepth * 0.35 + fresnel * 0.25, 0.42, 0.97);
          gl_FragColor = vec4(col, alpha);
        }
      `;
    }

    const water = BABYLON.MeshBuilder.CreateGround('benchWater', {
      width: 480,
      height: 480,
      subdivisions: 96,
      updatable: true,
    }, this.scene);
    water.parent = this.group;
    water.position.y = 0.0;

    const pos = water.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const col = new Float32Array((pos.length / 3) * 4);
    for (let i = 0; i < pos.length / 3; i++) {
      const lx = pos[i * 3];
      const lz = pos[i * 3 + 2];
      const depth = Math.max(0, -this.getHeight(lx, lz));
      col[i * 4] = depth;
      col[i * 4 + 1] = 0;
      col[i * 4 + 2] = 0;
      col[i * 4 + 3] = 1;
    }
    water.setVerticesData(BABYLON.VertexBuffer.ColorKind, col);

    const wMat = new BABYLON.ShaderMaterial('benchWaterMat', this.scene, {
      vertex: 'benchWater',
      fragment: 'benchWater',
    }, {
      attributes: ['position', 'color'],
      uniforms: ['world', 'worldViewProjection', 'cameraPosition', 'sunDir', 'time'],
      needAlphaBlending: true,
    });
    wMat.setVector3('sunDir', this.sunDir);
    wMat.setFloat('time', 0);
    water.material = wMat;
    this._waterMat = wMat;
  }

  _buildLandingPad() {
    const padRoot = new BABYLON.TransformNode('benchPadRoot', this.scene);
    padRoot.parent = this.group;
    padRoot.position.copyFrom(this.padLocalPos);

    // Riveted Interbellum aviation deck slab
    const deckMat = new BABYLON.PBRMaterial('benchPadDeckMat', this.scene);
    deckMat.albedoTexture = new BABYLON.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg', this.scene);
    deckMat.albedoTexture.uScale = 3;
    deckMat.albedoTexture.vScale = 3;
    deckMat.albedoTexture.anisotropicFilteringLevel = 8;
    deckMat.albedoColor = BABYLON.Color3.FromHexString('#d6d0c4');
    deckMat.bumpTexture = new BABYLON.Texture('./assets/benchmark/textures/anti_slip_concrete/nor_gl.jpg', this.scene);
    deckMat.bumpTexture.uScale = 6;
    deckMat.bumpTexture.vScale = 6;
    deckMat.bumpTexture.level = 0.35;
    deckMat.invertNormalMapY = true;
    deckMat.metallic = 0.16;
    deckMat.roughness = 0.70;

    const deck = BABYLON.MeshBuilder.CreateBox('benchPadDeck', { width: 13.0, height: 0.65, depth: 13.0 }, this.scene);
    deck.parent = padRoot;
    deck.position.y = -0.32;
    deck.material = deckMat;
    deck.receiveShadows = true;
    this._addShadowCaster(deck);

    // Painted & weathered landing markings decal overlay
    const decalMat = new BABYLON.PBRMaterial('benchPadDecalMat', this.scene);
    const decalTex = createPadDecalTexture(this.scene);
    decalMat.albedoTexture = decalTex;
    decalMat.useAlphaFromAlbedoTexture = true;
    decalMat.transparencyMode = BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;
    decalMat.metallic = 0.05;
    decalMat.roughness = 0.88;
    decalMat.zOffset = -2;

    const decalPlane = BABYLON.MeshBuilder.CreateGround('benchPadMarkings', { width: 12.6, height: 12.6 }, this.scene);
    decalPlane.parent = padRoot;
    decalPlane.position.y = 0.015;
    decalPlane.material = decalMat;
    decalPlane.receiveShadows = true;

    // Riveted steel support pilings & edge beams
    const steelMat = new BABYLON.PBRMaterial('benchPadSteelMat', this.scene);
    steelMat.albedoTexture = new BABYLON.Texture('./assets/textures/nomad/armored-deck-plates.png', this.scene);
    steelMat.albedoTexture.uScale = 2;
    steelMat.albedoTexture.vScale = 2;
    steelMat.albedoTexture.anisotropicFilteringLevel = 8;
    steelMat.albedoColor = BABYLON.Color3.FromHexString('#c4cac8');
    steelMat.metallic = 0.44;
    steelMat.roughness = 0.54;

    const pilingOffsets = [[-5.8, -5.8], [-5.8, 5.8], [5.8, -5.8], [5.8, 5.8], [-5.8, 0]];
    pilingOffsets.forEach(([px, pz], idx) => {
      const col = BABYLON.MeshBuilder.CreateCylinder(`benchPiling_${idx}`, { diameter: 0.78, height: 5.5, tessellation: 12 }, this.scene);
      col.parent = padRoot;
      col.position.set(px, -3.0, pz);
      col.material = steelMat;
      col.receiveShadows = true;
      this._addShadowCaster(col);
    });

    // Steel rim curbs & safety bollards
    for (const side of [-1, 1]) {
      const curb = BABYLON.MeshBuilder.CreateBox(`benchCurbZ_${side}`, { width: 13.4, height: 0.35, depth: 0.42 }, this.scene);
      curb.parent = padRoot;
      curb.position.set(0, 0.12, side * 6.45);
      curb.material = steelMat;
      curb.receiveShadows = true;
      this._addShadowCaster(curb);
    }

    // Sloped access ramp connecting pad east edge (+X) into the coastal hillside/trail
    const ramp = BABYLON.MeshBuilder.CreateBox('benchPadRamp', { width: 4.8, height: 0.42, depth: 4.2 }, this.scene);
    ramp.parent = padRoot;
    ramp.position.set(8.6, -0.35, 0.0);
    ramp.rotation.z = -0.14;
    ramp.material = deckMat;
    ramp.receiveShadows = true;
    this._addShadowCaster(ramp);

    // Mooring bollards & fuel pipe on pad edge
    for (const [bx, bz] of [[-6.1, -6.1], [-6.1, 6.1], [6.1, 6.1]]) {
      const b = BABYLON.MeshBuilder.CreateCylinder('benchBollard', { diameter: 0.28, height: 0.72, tessellation: 10 }, this.scene);
      b.parent = padRoot;
      b.position.set(bx, 0.36, bz);
      b.material = steelMat;
      this._addShadowCaster(b);
    }
    const fuelPipe = BABYLON.MeshBuilder.CreateCylinder('benchFuelPipe', { diameter: 0.14, height: 4.2, tessellation: 8 }, this.scene);
    fuelPipe.parent = padRoot;
    fuelPipe.rotation.z = Math.PI * 0.5;
    fuelPipe.position.set(4.5, 0.12, -5.8);
    fuelPipe.material = steelMat;
    this._addShadowCaster(fuelPipe);

    // Beacon mast at corner
    const mast = BABYLON.MeshBuilder.CreateCylinder('benchBeaconMast', { diameterTop: 0.12, diameterBottom: 0.24, height: 5.2, tessellation: 10 }, this.scene);
    mast.parent = padRoot;
    mast.position.set(5.9, 2.6, -5.9);
    mast.material = steelMat;
    this._addShadowCaster(mast);

    const beaconMat = new BABYLON.StandardMaterial('benchBeaconBulb', this.scene);
    beaconMat.emissiveColor = BABYLON.Color3.FromHexString('#ff9c42');
    beaconMat.disableLighting = true;
    this._beaconMat = beaconMat;
    const bulb = BABYLON.MeshBuilder.CreateSphere('benchBeaconLamp', { diameter: 0.38 }, this.scene);
    bulb.parent = padRoot;
    bulb.position.set(5.9, 5.3, -5.9);
    bulb.material = beaconMat;
  }

  _buildLights() {
    // Warm local expedition lantern lights on the pad
    const l1 = new BABYLON.PointLight('benchPadLight1', this.origin.add(this.padLocalPos).add(new BABYLON.Vector3(5.2, 2.2, -5.2)), this.scene);
    l1.diffuse = BABYLON.Color3.FromHexString('#ffae5c');
    l1.intensity = 14.0;
    l1.range = 24;

    const l2 = new BABYLON.PointLight('benchPadLight2', this.origin.add(this.padLocalPos).add(new BABYLON.Vector3(-5.0, 1.5, 5.0)), this.scene);
    l2.diffuse = BABYLON.Color3.FromHexString('#ffc078');
    l2.intensity = 9.0;
    l2.range = 18;
  }

  _addShadowCaster(mesh) {
    if (this.shadowGenerator && mesh) {
      this.shadowGenerator.addShadowCaster(mesh, true);
    }
  }

  async loadAssets() {
    if (this._assetsLoaded) return;
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = (async () => {
      const templates = {};
      await Promise.all(
        BENCH_MODELS.map(async (m) => {
          try {
            const res = await BABYLON.SceneLoader.ImportMeshAsync('', m.dir, m.file, this.scene);
            const root = new BABYLON.TransformNode(`benchTpl_${m.key}`, this.scene);
            const meshes = [];
            let minY = Infinity;
            let maxY = -Infinity;
            for (const mesh of res.meshes) {
              if (mesh.name === '__root__') {
                mesh.parent = root;
                continue;
              }
              mesh.receiveShadows = true;
              if (mesh.material) {
                mesh.material.environmentIntensity = 0.78;
              }
              if (mesh.geometry) {
                mesh.computeWorldMatrix(true);
                const bi = mesh.getBoundingInfo();
                minY = Math.min(minY, bi.boundingBox.minimumWorld.y);
                maxY = Math.max(maxY, bi.boundingBox.maximumWorld.y);
              }
              meshes.push(mesh);
            }
            const rawH = Math.max(0.05, maxY - minY);
            const normScale = (m.targetHeight || rawH) / rawH;
            const yOffset = Number.isFinite(minY) ? -minY * normScale : 0;
            root.setEnabled(false);
            templates[m.key] = { root, meshes, normScale, yOffset };
          } catch (err) {
            console.warn(`BenchmarkCoast failed to load ${m.key}:`, err);
          }
        })
      );

      this._scatterInstances(templates);
      this._assetsLoaded = true;
    })();

    return this.readyPromise;
  }

  _placeTemplate(tpl, name, lx, ly, lz, rotY, scale, castShadow = true) {
    if (!tpl || !tpl.meshes.length) return;
    const holder = new BABYLON.TransformNode(name, this.scene);
    holder.parent = this.group;
    const finalScale = scale * (tpl.normScale || 1);
    holder.position.set(lx, ly + (tpl.yOffset || 0) * scale, lz);
    holder.rotation.y = rotY;
    holder.scaling.setAll(finalScale);

    for (let i = 0; i < tpl.meshes.length; i++) {
      const src = tpl.meshes[i];
      if (!src.geometry) continue;
      const inst = src.createInstance(`${name}_${i}`);
      inst.parent = holder;
      // Preserve local transform from template sub-mesh
      inst.position.copyFrom(src.position);
      if (src.rotationQuaternion) {
        inst.rotationQuaternion = src.rotationQuaternion.clone();
      } else {
        inst.rotation.copyFrom(src.rotation);
      }
      inst.scaling.copyFrom(src.scaling);
      inst.receiveShadows = true;
      if (castShadow) this._addShadowCaster(inst);
    }
  }

  _scatterInstances(templates) {
    // Deterministic seeded PRNG for consistent before/after framing
    let s = 133742;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };

    const isClearOfPad = (lx, lz, margin = 13.0) =>
      Math.hypot(lx - this.padLocalPos.x, lz - this.padLocalPos.z) > margin;

    const isClearOfPlayer = (lx, lz, margin = 4.2) =>
      Math.hypot(lx - this.forestPlayerLocalPos.x, lz - this.forestPlayerLocalPos.z) > margin;

    const canGrowTree = (lx, lz) => {
      const ly = this.getHeight(lx, lz);
      if (ly < 2.0) return false;
      const n = this._getNormal(lx, lz);
      return n.y > 0.82;
    };

    // 1. Natural Forest Groves (cluster centers -> varied species: pine, fir, alder, snag)
    const groveCenters = [
      [17, -14], [21, 16], [33, -10], [36, 15], [46, -2], [44, 24],
      [25, -26], [54, -18], [56, 14], [14, 24],
    ];
    let treeIdx = 0;
    groveCenters.forEach(([gx, gz]) => {
      const count = 4 + Math.floor(rand() * 4);
      for (let k = 0; k < count; k++) {
        const ang = rand() * Math.PI * 2;
        const rad = 2.0 + rand() * 8.5;
        const lx = gx + Math.cos(ang) * rad;
        const lz = gz + Math.sin(ang) * rad;
        if (!canGrowTree(lx, lz) || !isClearOfPad(lx, lz, 13.2) || !isClearOfPlayer(lx, lz, 4.2)) continue;
        const ly = this.getHeight(lx, lz);
        const rType = rand();
        const key = rType < 0.44 ? 'pine' : (rType < 0.72 ? 'fir' : (rType < 0.91 ? 'alder' : 'snag'));
        const scale = 0.78 + rand() * 0.52;
        this._placeTemplate(templates[key], `benchTree_${treeIdx++}`, lx, ly - 0.22, lz, rand() * Math.PI * 2, scale, true);

        // Undergrowth cluster (ferns + grass tufts) around each tree base
        for (let u = 0; u < 3; u++) {
          const ua = rand() * Math.PI * 2;
          const ur = 1.1 + rand() * 2.4;
          const ux = lx + Math.cos(ua) * ur;
          const uz = lz + Math.sin(ua) * ur;
          const uy = this.getHeight(ux, uz);
          if (uy < 1.6 || !isClearOfPad(ux, uz, 11.5) || !isClearOfPlayer(ux, uz, 1.8)) continue;
          const uKey = rand() < 0.45 ? 'fern' : 'grass';
          this._placeTemplate(templates[uKey], `benchUnder_${treeIdx}_${u}`, ux, uy - 0.06, uz, rand() * Math.PI * 2, 0.8 + rand() * 0.6, false);
        }
      }
    });

    // 2. Additional Ground Ferns & Grass Tufts along trail edges
    for (let i = 0; i < 95; i++) {
      const lx = 8 + rand() * 48;
      const lz = -30 + rand() * 60;
      const ly = this.getHeight(lx, lz);
      if (ly < 1.5 || !isClearOfPad(lx, lz, 11.8) || !isClearOfPlayer(lx, lz, 1.8)) continue;
      const key = rand() < 0.42 ? 'fern' : 'grass';
      this._placeTemplate(templates[key], `benchGround_${i}`, lx, ly - 0.05, lz, rand() * Math.PI * 2, 0.75 + rand() * 0.65, false);
    }

    // 4. Coastal Rocks & Forest Boulders
    const rockSpots = [
      [-5, -10], [-7, -3], [-6, 6], [-4, 14], [1, -13], [4, 15],
      [-10, 2], [-12, -14], [12, -8], [20, 9], [31, 14], [21, 2],
      [35, 8], [18, 16], [28, -6], [40, 11],
    ];
    rockSpots.forEach(([lx, lz], i) => {
      if (!isClearOfPlayer(lx, lz, 3.6) || !isClearOfPad(lx, lz, 10.0)) return;
      const ly = this.getHeight(lx, lz);
      this._placeTemplate(templates.boulder, `benchRock_${i}`, lx, ly - 0.25, lz, rand() * Math.PI * 2, 0.9 + rand() * 1.1, true);
    });

    // 5. Industrial Landing Pad Props (Barrels, Expedition Crates, Lanterns)
    const py = this.padLocalPos.y;
    const px = this.padLocalPos.x;
    const pz = this.padLocalPos.z;
    this._placeTemplate(templates.barrel, 'benchBarrel_0', px + 4.8, py, pz - 4.4, 0.4, 1.15, true);
    this._placeTemplate(templates.barrel, 'benchBarrel_1', px + 5.5, py, pz - 3.9, 1.9, 1.15, true);
    this._placeTemplate(templates.barrel, 'benchBarrel_2', px + 5.1, py, pz - 5.1, 2.7, 1.12, true);
    this._placeTemplate(templates.crate, 'benchCrate_0', px - 4.9, py, pz + 4.6, 0.25, 1.15, true);
    this._placeTemplate(templates.crate, 'benchCrate_1', px - 4.5, py, pz + 3.2, -0.35, 1.05, true);
    this._placeTemplate(templates.lantern, 'benchLantern_0', px + 5.2, py, pz - 5.6, 0.5, 1.4, false);
    this._placeTemplate(templates.lantern, 'benchLantern_1', px - 5.2, py, pz + 5.4, 2.1, 1.4, false);
  }

  setTwilight(enabled) {
    if (this._skyMat) this._skyMat.setFloat('twilight', enabled ? 1.0 : 0.0);
  }

  update(dt) {
    this.waterTime += dt;
    if (this._waterMat) this._waterMat.setFloat('time', this.waterTime);
    if (this._skyMat) this._skyMat.setFloat('time', this.waterTime);
    if (this._beaconMat) {
      const pulse = 0.65 + 0.35 * Math.sin(this.waterTime * 3.2);
      this._beaconMat.emissiveColor.set(1.0 * pulse, 0.56 * pulse, 0.22 * pulse);
    }
  }
}
