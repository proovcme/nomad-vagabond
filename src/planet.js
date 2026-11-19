// Procedural 3D Terrain Planet with Continents, Mountains, Stylized Ocean Shader, Multi-Layer Organic Forests & Ruins
import { createTerrainDetailTexture, createBarkTexture } from './textures.js?v=mission1';

function hash3(x, y, z, seed) {
  let n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453123;
  return n - Math.floor(n);
}

function noise3D(x, y, z, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  const n000 = hash3(ix, iy, iz, seed);
  const n100 = hash3(ix + 1, iy, iz, seed);
  const n010 = hash3(ix, iy + 1, iz, seed);
  const n110 = hash3(ix + 1, iy + 1, iz, seed);
  const n001 = hash3(ix, iy, iz + 1, seed);
  const n101 = hash3(ix + 1, iy, iz + 1, seed);
  const n011 = hash3(ix, iy + 1, iz + 1, seed);
  const n111 = hash3(ix + 1, iy + 1, iz + 1, seed);

  const nx00 = n000 + (n100 - n000) * ux;
  const nx10 = n010 + (n110 - n010) * ux;
  const nx01 = n001 + (n101 - n001) * ux;
  const nx11 = n011 + (n111 - n011) * ux;

  const nxy0 = nx00 + (nx10 - nx00) * uy;
  const nxy1 = nx01 + (nx11 - nx01) * uy;

  return nxy0 + (nxy1 - nxy0) * uz;
}

export function fbm3(x, y, z, seed, octaves = 4) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise3D(x * freq, y * freq, z * freq, seed + i * 29);
    freq *= 2.05;
    amp *= 0.5;
  }
  return val;
}

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function placeOnSurface(node, dir, radius, offset = 0) {
  const n = dir.clone().normalize();
  node.position.copyFrom(n).scaleInPlace(radius + offset);
  const q = new BABYLON.Quaternion();
  BABYLON.Quaternion.FromUnitVectorsToRef(new BABYLON.Vector3(0, 1, 0), n, q);
  node.rotationQuaternion = q;
}

function createCloudTexture(scene, seed) {
  const size = 256;
  const tex = new BABYLON.DynamicTexture('cloudTex', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const a = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI;
      const nx = Math.sin(v) * Math.cos(a) * 2.4;
      const ny = Math.cos(v) * 2.4;
      const nz = Math.sin(v) * Math.sin(a) * 2.4;
      const n = fbm3(nx + 4, ny + 4, nz + 4, seed + 55, 4);
      const alpha = Math.max(0, Math.min(255, (n - 0.48) * 520));
      const idx = (y * size + x) * 4;
      img.data[idx] = 235;
      img.data[idx + 1] = 248;
      img.data[idx + 2] = 255;
      img.data[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  tex.hasAlpha = true;
  tex.update();
  return tex;
}

export class TerrainPlanet {
  constructor(scene, config, rng) {
    this.scene = scene;
    this.rng = rng;
    this.seedNum = rng.range(10, 900);

    this.id = config.id || 'verdant_prime';
    this.name = config.name || 'Айон-VII';
    this.biome = 'living_archipelago';
    this.biomeLabel = 'Живой Архипелаг (Леса и Океан)';
    this.radius = 44; // Base radius
    this.seaLevel = 44.0;
    this.baseGravity = 22;
    this.gravity = 22;

    this.orbitRadius = config.orbitRadius || 68;
    this.orbitAngle = config.orbitAngle || 0.4;
    this.orbitSpeed = config.orbitSpeed || 0.012;
    this.elevationY = config.elevationY || 0;
    this.orbitTilt = config.orbitTilt || 0.05;
    this.color = '#2cb88e';

    this.group = new BABYLON.TransformNode(`terrainPlanet_${this.id}`, scene);
    this.prevPos = new BABYLON.Vector3();
    this.velocity = new BABYLON.Vector3();
    this.extras = [];
    this.discovered = true;
    this.mysteryNote = 'Материки, густые рощи и океан с приливными волнами. В глубине леса скрыт Древний Резонатор.';

    this.treeColliders = []; // { dir: Vector3, radius: number }
    this.ruinPosLocal = null;
    this.ruinActivated = false;
    this.shipAnchorLocal = null;

    this._buildTerrainLOD();
    this._buildOcean();
    this._buildAtmosphereAndClouds();
    this._buildForestAndRuin();
  }

  /**
   * Deterministic 3D spherical height function (continents, mountains, beaches, seabed)
   */
  getSurfaceHeight(unitDir) {
    const x = unitDir.x;
    const y = unitDir.y;
    const z = unitDir.z;

    // Domain warp for organic peninsulas, coves & headlands (eliminates "round bathtub" lakes)
    const wx = fbm3(x * 2.6 + 1.3, y * 2.6, z * 2.6, this.seedNum + 17, 2) - 0.5;
    const wy = fbm3(x * 2.6, y * 2.6 + 2.7, z * 2.6, this.seedNum + 31, 2) - 0.5;
    const wz = fbm3(x * 2.6, y * 2.6, z * 2.6 + 4.1, this.seedNum + 47, 2) - 0.5;
    const dx = x + wx * 0.42;
    const dy = y + wy * 0.42;
    const dz = z + wz * 0.42;

    // Continents, archipelagos & sheltered bays
    const cont = fbm3(dx * 2.15 + 3.1, dy * 2.15 + 3.1, dz * 2.15 + 3.1, this.seedNum, 4);
    // Ridged Mountains & Headland Cliffs
    const ridgeRaw = fbm3(dx * 4.8 + 8.2, dy * 4.8 + 8.2, dz * 4.8 + 8.2, this.seedNum + 101, 4);
    const ridge = 1.0 - Math.abs(ridgeRaw * 2.0 - 1.0);
    const detail = fbm3(x * 12.0, y * 12.0, z * 12.0, this.seedNum + 202, 2);

    // Map warped continent noise around seaLevel with steeper coastal shelves
    let h = this.seaLevel + (cont - 0.475) * 15.5;
    if (h > this.seaLevel + 0.25) {
      const landFactor = Math.min(1, (h - this.seaLevel) / 3.2);
      h += Math.pow(ridge, 1.95) * 6.4 * landFactor;
    } else if (h < this.seaLevel - 0.3) {
      // Deeper underwater basins
      h -= Math.min(2.2, (this.seaLevel - h) * 0.35);
    }
    h += (detail - 0.5) * 0.85;

    return h;
  }

  /**
   * Synchronized 3D ocean wave height (used by both ocean mesh & ship buoyancy!)
   */
  getWaveHeight(unitDir, time) {
    const terrainH = this.getSurfaceHeight(unitDir);
    const depth = Math.max(0, this.seaLevel - terrainH);
    const swellScale = Math.min(1, depth / 2.2); // calmer in shallow bays, taller in open sea
    const w1 = Math.sin(unitDir.x * 9.0 + unitDir.z * 5.0 + time * 1.8) * 0.28;
    const w2 = Math.cos(unitDir.y * 11.0 - unitDir.z * 7.0 + time * 1.35) * 0.2;
    const w3 = Math.sin((unitDir.x + unitDir.y) * 16.0 + time * 2.6) * 0.1;
    return this.seaLevel + (w1 + w2 + w3) * (0.35 + 0.65 * swellScale);
  }

  getSlope(unitDir) {
    const eps = 0.03;
    const t1 = Math.abs(unitDir.x) < 0.9 ? new BABYLON.Vector3(1, 0, 0) : new BABYLON.Vector3(0, 1, 0);
    const b1 = BABYLON.Vector3.Cross(unitDir, t1).normalize();
    const b2 = BABYLON.Vector3.Cross(unitDir, b1).normalize();
    const h0 = this.getSurfaceHeight(unitDir);
    const h1 = this.getSurfaceHeight(unitDir.add(b1.scale(eps)).normalize());
    const h2 = this.getSurfaceHeight(unitDir.add(b2.scale(eps)).normalize());
    return Math.hypot(h1 - h0, h2 - h0) / (eps * this.radius);
  }

  _buildTerrainMesh(segments, name) {
    const mesh = BABYLON.MeshBuilder.CreateSphere(
      name,
      { diameter: 2, segments, updatable: true },
      this.scene
    );
    const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const colors = new Float32Array((positions.length / 3) * 4);
    const dir = new BABYLON.Vector3();

    const mix3 = (a, b, t) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const smoothstep = (e0, e1, x) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    // Twilight-harmonized planetary palette (slate seabed, warm sand, olive-sage meadow, deep pine forest, basalt cliffs)
    const cSeabed = [0.06, 0.16, 0.22];
    const cWetSand = [0.38, 0.35, 0.27];
    const cBeach = [0.64, 0.56, 0.42];
    const cMeadow = [0.23, 0.36, 0.23];
    const cForest = [0.13, 0.24, 0.17];
    const cCliff = [0.32, 0.30, 0.29];
    const cSnow = [0.68, 0.70, 0.69];

    for (let i = 0; i < positions.length; i += 3) {
      dir.set(positions[i], positions[i + 1], positions[i + 2]).normalize();
      const h = this.getSurfaceHeight(dir);
      positions[i] = dir.x * h;
      positions[i + 1] = dir.y * h;
      positions[i + 2] = dir.z * h;

      const relH = h - this.seaLevel;
      const micro = fbm3(dir.x * 16.0, dir.y * 16.0, dir.z * 16.0, this.seedNum + 411, 2);
      const slope = this.getSlope(dir);

      let col = cSeabed;
      if (relH < -0.45) {
        col = mix3(cSeabed, cWetSand, smoothstep(-2.8, -0.45, relH));
      } else if (relH < 0.65) {
        col = mix3(cWetSand, cBeach, smoothstep(-0.45, 0.55, relH));
      } else if (relH < 1.8) {
        col = mix3(cBeach, cMeadow, smoothstep(0.55, 1.5, relH));
      } else if (relH < 4.5) {
        col = mix3(cMeadow, cForest, smoothstep(1.5, 3.3, relH));
      } else {
        col = mix3(cForest, cCliff, smoothstep(4.2, 5.4, relH));
        col = mix3(col, cSnow, smoothstep(6.0, 7.6, relH));
      }

      // Steep cliffs expose weathered sandstone/granite rock regardless of elevation
      if (relH > 0.25) {
        const cliffT = smoothstep(0.36, 0.78, slope);
        col = mix3(col, cCliff, cliffT * 0.9);
      }

      // Organic micro-variation so no flat single-color blobs appear
      const tint = 0.84 + micro * 0.32;
      const ci = (i / 3) * 4;
      colors[ci] = Math.min(1, col[0] * tint);
      colors[ci + 1] = Math.min(1, col[1] * tint);
      colors[ci + 2] = Math.min(1, col[2] * tint);
      colors[ci + 3] = 1.0;
    }

    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors);
    const indices = mesh.getIndices();
    const normals = new Float32Array(positions.length);
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    mesh.refreshBoundingInfo(true);

    const mat = new BABYLON.PBRMaterial(`${name}_mat`, this.scene);
    const eng = this.scene.getEngine();
    const isNullEng = typeof BABYLON.NullEngine !== 'undefined' && eng instanceof BABYLON.NullEngine;
    if (!isNullEng) {
      if (!this._realTerrainTex) {
        const diff = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg', this.scene);
        diff.uScale = 28; diff.vScale = 14;
        const nor = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/nor_gl.jpg', this.scene);
        nor.uScale = 28; nor.vScale = 14;
        const arm = new BABYLON.Texture('./assets/benchmark/textures/aerial_grass_rock/arm.jpg', this.scene);
        arm.uScale = 28; arm.vScale = 14;
        this._realTerrainTex = { diff, nor, arm };
      }
      mat.albedoColor = c3('#ffffff');
      mat.albedoTexture = this._realTerrainTex.diff;
      mat.bumpTexture = this._realTerrainTex.nor;
      mat.bumpTexture.level = 1.05;
      mat.invertNormalMapY = true;
      mat.metallicTexture = this._realTerrainTex.arm;
      mat.useAmbientOcclusionFromMetallicTextureRed = true;
      mat.useRoughnessFromMetallicTextureGreen = true;
      mat.useMetallnessFromMetallicTextureBlue = true;
      mat.metallic = 0.0;
      mat.roughness = 0.92;
    } else {
      if (!this._terrainDetailTex) {
        this._terrainDetailTex = createTerrainDetailTexture(this.scene);
        this._terrainDetailTex.albedoTex.uScale = this._terrainDetailTex.albedoTex.vScale = 24;
        this._terrainDetailTex.bumpTex.uScale = this._terrainDetailTex.bumpTex.vScale = 24;
      }
      mat.albedoColor = c3('#ffffff');
      mat.albedoTexture = this._terrainDetailTex.albedoTex;
      mat.bumpTexture = this._terrainDetailTex.bumpTex;
      mat.bumpTexture.level = 0.55;
      mat.metallic = 0.02;
      mat.roughness = 0.88;
    }
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.parent = this.group;
    return mesh;
  }

  _buildTerrainLOD() {
    this.highTerrain = this._buildTerrainMesh(84, `${this.id}_terrainHigh`);
    this.lowTerrain = this._buildTerrainMesh(26, `${this.id}_terrainLow`);
    this.lowTerrain.setEnabled(false);
  }

  _buildOcean() {
    const segments = 64;
    this.oceanMesh = BABYLON.MeshBuilder.CreateSphere(
      `${this.id}_ocean`,
      { diameter: 2, segments, updatable: false },
      this.scene
    );
    const pos = this.oceanMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const vertCount = pos.length / 3;
    const terrainHeights = new Float32Array(vertCount);
    const newPos = new Float32Array(pos.length);

    const dir = new BABYLON.Vector3();
    for (let i = 0; i < pos.length; i += 3) {
      dir.set(pos[i], pos[i + 1], pos[i + 2]).normalize();
      newPos[i] = dir.x;
      newPos[i + 1] = dir.y;
      newPos[i + 2] = dir.z;
      terrainHeights[i / 3] = this.getSurfaceHeight(dir);
    }
    this.oceanMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPos);
    this.oceanMesh.setVerticesData('aTerrainH', terrainHeights, false, 1);

    BABYLON.Effect.ShadersStore['stylizedOceanVertexShader'] = `
      precision highp float;
      attribute vec3 position;
      attribute float aTerrainH;
      uniform mat4 world;
      uniform mat4 worldViewProjection;
      uniform float uTime;
      uniform float uSeaLevel;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vUnitDir;
      varying float vDepth;
      varying float vClearance;

      float waveOffset(vec3 d, float depth, float t) {
        float swell = min(1.0, depth / 2.2);
        float w1 = sin(d.x * 9.0 + d.z * 5.0 + t * 1.8) * 0.28;
        float w2 = cos(d.y * 11.0 - d.z * 7.0 + t * 1.35) * 0.20;
        float w3 = sin((d.x + d.y) * 16.0 + t * 2.6) * 0.10;
        return (w1 + w2 + w3) * (0.35 + 0.65 * swell);
      }

      void main() {
        vec3 d = normalize(position);
        float depth = max(0.0, uSeaLevel - aTerrainH);
        float wh = uSeaLevel + waveOffset(d, depth, uTime);
        vec3 localPos = d * wh;

        // Analytical/finite-diff wave normal for crisp sun specular glints
        vec3 upRef = abs(d.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 t1 = normalize(cross(d, upRef));
        vec3 t2 = normalize(cross(d, t1));
        float eps = 0.03;
        vec3 d1 = normalize(d + t1 * eps);
        vec3 d2 = normalize(d + t2 * eps);
        vec3 p1 = d1 * (uSeaLevel + waveOffset(d1, depth, uTime));
        vec3 p2 = d2 * (uSeaLevel + waveOffset(d2, depth, uTime));
        vec3 nLocal = normalize(cross(p2 - localPos, p1 - localPos));
        if (dot(nLocal, d) < 0.0) nLocal = -nLocal;

        vec4 wp = world * vec4(localPos, 1.0);
        vWorldPos = wp.xyz;
        vWorldNormal = normalize((world * vec4(nLocal, 0.0)).xyz);
        vUnitDir = d;
        vDepth = depth;
        vClearance = wh - aTerrainH;
        gl_Position = worldViewProjection * vec4(localPos, 1.0);
      }
    `;

    BABYLON.Effect.ShadersStore['stylizedOceanFragmentShader'] = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uCameraPos;
      uniform vec3 uStarPos;
      uniform vec3 uPlanetPos;
      uniform vec3 uShipWorldPos;
      uniform float uShipActive;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vUnitDir;
      varying float vDepth;
      varying float vClearance;

      float oHash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float oNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(oHash(i), oHash(i + vec2(1.0, 0.0)), u.x),
                   mix(oHash(i + vec2(0.0, 1.0)), oHash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float oFbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
        for (int i = 0; i < 4; i++) {
          v += a * oNoise(p);
          p = rot * p * 2.07 + vec2(13.7, 7.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 baseN = normalize(vWorldNormal);
        vec3 refUp = abs(baseN.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 t1 = normalize(cross(refUp, baseN));
        vec3 t2 = cross(baseN, t1);
        vec2 uv1 = vec2(dot(vUnitDir, t1), dot(vUnitDir, t2)) * 38.0 + vec2(uTime * 0.12, uTime * 0.08);
        vec2 uv2 = uv1 * 2.15 - vec2(uTime * 0.16, -uTime * 0.11);
        float h0 = oFbm(uv1) * 0.6 + oFbm(uv2) * 0.4;
        float hx = oFbm(uv1 + vec2(0.18, 0.0)) * 0.6 + oFbm(uv2 + vec2(0.18, 0.0)) * 0.4;
        float hz = oFbm(uv1 + vec2(0.0, 0.18)) * 0.6 + oFbm(uv2 + vec2(0.0, 0.18)) * 0.4;
        vec3 N = normalize(baseN + t1 * ((h0 - hx) * 0.42) + t2 * ((h0 - hz) * 0.42));

        vec3 V = normalize(uCameraPos - vWorldPos);
        vec3 L = normalize(uStarPos - vWorldPos);

        // Depth-based color absorption (muted coastal jade -> deep slate teal -> abyssal Prussian blue)
        vec3 shallowCol = vec3(0.12, 0.43, 0.46);
        vec3 midCol = vec3(0.05, 0.25, 0.37);
        vec3 deepCol = vec3(0.02, 0.10, 0.21);
        float d1 = smoothstep(0.0, 1.8, vDepth);
        float d2 = smoothstep(1.6, 5.2, vDepth);
        vec3 waterCol = mix(shallowCol, midCol, d1);
        waterCol = mix(waterCol, deepCol, d2);

        // Diffuse sunlight + soft sky ambient
        float NdotL = max(dot(N, L), 0.0);
        float skyLight = 0.30 + 0.70 * NdotL;
        vec3 litWater = waterCol * skyLight;

        // Fresnel sky & twilight reflection
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.6);
        vec3 skyRefl = mix(vec3(0.16, 0.34, 0.46), vec3(0.58, 0.66, 0.72), NdotL);
        litWater = mix(litWater, skyRefl, fresnel * 0.62);

        // Crisp sun specular glints
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 96.0);
        float softSpec = pow(max(dot(N, H), 0.0), 18.0) * 0.10;
        litWater += vec3(1.0, 0.88, 0.68) * (spec * 0.82 + softSpec);

        // Organic shoreline foam modulated by FBM
        float foamBreak = oFbm(vUnitDir.xz * 52.0 + vUnitDir.xy * 37.0 + vec2(uTime * 0.10, 0.0));
        float edgeBand = 1.0 - smoothstep(-0.01, 0.14, vClearance - (foamBreak - 0.5) * 0.06);
        float foamMask = clamp(edgeBand * 0.65, 0.0, 0.75);

        // Ship bow/hull wake foam when sailing on water
        if (uShipActive > 0.5) {
          float distToShip = length(vWorldPos - uShipWorldPos);
          float hullFoam = (1.0 - smoothstep(1.2, 3.5, distToShip)) * (0.35 + 0.65 * foamBreak);
          foamMask = clamp(foamMask + hullFoam * 0.68, 0.0, 1.0);
        }

        vec3 foamCol = vec3(0.86, 0.92, 0.94);
        vec3 finalCol = mix(litWater, foamCol, foamMask);

        // Shallow water is genuinely translucent so sandy seabed shows through near shore
        float alpha = mix(0.28, 0.94, smoothstep(0.0, 2.8, vDepth));
        alpha = max(alpha, foamMask * 0.88);
        gl_FragColor = vec4(finalCol, alpha);
      }
    `;

    this.oceanMat = new BABYLON.ShaderMaterial(
      `${this.id}_oceanShader`,
      this.scene,
      { vertex: 'stylizedOcean', fragment: 'stylizedOcean' },
      {
        attributes: ['position', 'aTerrainH'],
        uniforms: ['world', 'worldViewProjection', 'uTime', 'uSeaLevel', 'uCameraPos', 'uStarPos', 'uPlanetPos', 'uShipWorldPos', 'uShipActive'],
        needAlphaBlending: true,
      }
    );
    this.oceanMat.setFloat('uTime', 0);
    this.oceanMat.setFloat('uSeaLevel', this.seaLevel);
    this.oceanMat.setVector3('uCameraPos', new BABYLON.Vector3(0, 0, 100));
    this.oceanMat.setVector3('uStarPos', BABYLON.Vector3.Zero());
    this.oceanMat.setVector3('uPlanetPos', this.group.position);
    this.oceanMat.setVector3('uShipWorldPos', BABYLON.Vector3.Zero());
    this.oceanMat.setFloat('uShipActive', 0);

    this.oceanMesh.material = this.oceanMat;
    this.oceanMesh.parent = this.group;
    // Set large bounding sphere so vertex wave displacement never frustum-culls early
    const bound = this.seaLevel + 2.0;
    this.oceanMesh.setBoundingInfo(new BABYLON.BoundingInfo(new BABYLON.Vector3(-bound, -bound, -bound), new BABYLON.Vector3(bound, bound, bound)));
  }

  _updateOceanWaves(time, cameraPos, shipWorldPos, shipInWater) {
    if (!this.oceanMat) return;
    this.oceanMat.setFloat('uTime', time);
    this.oceanMat.setVector3('uPlanetPos', this.group.position);
    if (cameraPos) this.oceanMat.setVector3('uCameraPos', cameraPos);
    if (shipWorldPos && shipInWater) {
      this.oceanMat.setVector3('uShipWorldPos', shipWorldPos);
      this.oceanMat.setFloat('uShipActive', 1.0);
    } else {
      this.oceanMat.setFloat('uShipActive', 0.0);
    }
  }

  _buildAtmosphereAndClouds() {
    // Fresnel Atmospheric Scattering Rim (Outer Wilds-style horizon halo)
    BABYLON.Effect.ShadersStore['atmoRimVertexShader'] = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 world;
      uniform mat4 worldViewProjection;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vec4 wp = world * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        vWorldNormal = normalize((world * vec4(normal, 0.0)).xyz);
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;
    BABYLON.Effect.ShadersStore['atmoRimFragmentShader'] = `
      precision highp float;
      uniform vec3 uCameraPos;
      uniform vec3 uStarPos;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(uCameraPos - vWorldPos);
        vec3 L = normalize(uStarPos - vWorldPos);
        float rim = pow(1.0 - abs(dot(N, V)), 2.2);
        // Smoothly fade the outer sphere silhouette to 0 so no hard bubble edge appears in space
        float outerFade = smoothstep(0.0, 0.36, abs(dot(N, V)));
        float sunSide = smoothstep(-0.35, 0.7, dot(N, L));
        vec3 dayAtmo = vec3(0.26, 0.72, 0.86);
        vec3 sunsetAtmo = vec3(0.92, 0.54, 0.28);
        float term = exp(-pow((dot(N, L)) * 3.0, 2.0));
        vec3 col = mix(dayAtmo, sunsetAtmo, term * 0.5);
        float alpha = rim * outerFade * (0.12 + 0.54 * sunSide);
        gl_FragColor = vec4(col, alpha);
      }
    `;
    const atmo = BABYLON.MeshBuilder.CreateSphere(
      `${this.id}_atmo`,
      { diameter: (this.radius + 7.5) * 2, segments: 32 },
      this.scene
    );
    this.atmoMat = new BABYLON.ShaderMaterial(
      `${this.id}_atmoMat`,
      this.scene,
      { vertex: 'atmoRim', fragment: 'atmoRim' },
      {
        attributes: ['position', 'normal'],
        uniforms: ['world', 'worldViewProjection', 'uCameraPos', 'uStarPos'],
        needAlphaBlending: true,
      }
    );
    this.atmoMat.backFaceCulling = true;
    this.atmoMat.setVector3('uCameraPos', new BABYLON.Vector3(0, 0, 100));
    this.atmoMat.setVector3('uStarPos', BABYLON.Vector3.Zero());
    atmo.material = this.atmoMat;
    atmo.parent = this.group;

    // Soft Painterly Cloud Layer
    this.cloudMesh = BABYLON.MeshBuilder.CreateSphere(
      `${this.id}_clouds`,
      { diameter: (this.radius + 8.8) * 2, segments: 28 },
      this.scene
    );
    const cMat = new BABYLON.PBRMaterial(`${this.id}_cloudMat`, this.scene);
    const cloudTex = createCloudTexture(this.scene, this.seedNum);
    cMat.albedoTexture = cloudTex;
    cMat.useAlphaFromAlbedoTexture = true;
    cMat.emissiveColor = c3('#162836');
    cMat.metallic = 0.0;
    cMat.roughness = 0.95;
    cMat.alpha = 0.36;
    cMat.backFaceCulling = false;
    this.cloudMesh.material = cMat;
    this.cloudMesh.parent = this.group;
  }

  _createWindPlugin(material, amp = 0.08, speed = 1.6) {
    if (typeof BABYLON.MaterialPluginBase === 'undefined') return null;
    try {
      const plugin = new (class WindSwayPlugin extends BABYLON.MaterialPluginBase {
        constructor(mat) {
          super(mat, 'WindSway', 200, { WINDSWAY: true });
          this.time = 0;
          this._enable(true);
        }
        getClassName() { return 'WindSwayPlugin'; }
        getUniforms() {
          return {
            ubo: [{ name: 'uWindTime', size: 1, type: 'float' }],
            vertex: 'uniform float uWindTime;',
          };
        }
        bindForSubMesh(uniformBuffer) {
          uniformBuffer.updateFloat('uWindTime', this.time);
        }
        getCustomCode(shaderType) {
          if (shaderType === 'vertex') {
            return {
              CUSTOM_VERTEX_UPDATE_POSITION: `
                float swayPhase = positionUpdated.x * 1.7 + positionUpdated.z * 1.3;
                float swayHeight = clamp(positionUpdated.y * 0.4, 0.0, 1.5);
                positionUpdated.x += sin(uWindTime * ${speed.toFixed(2)} + swayPhase) * ${amp.toFixed(3)} * swayHeight;
                positionUpdated.z += cos(uWindTime * ${(speed * 0.8).toFixed(2)} + swayPhase * 1.1) * ${(amp * 0.8).toFixed(3)} * swayHeight;
              `,
            };
          }
          return null;
        }
      })(material);
      return plugin;
    } catch (_) {
      return null;
    }
  }

  _buildOrganicFoliageMesh(name, lobes, topCol, botCol, seedBase) {
    const parts = [];
    lobes.forEach(([lx, ly, lz, rx, ry, rz], idx) => {
      const lobe = BABYLON.MeshBuilder.CreateIcoSphere(
        `${name}_lobe_${idx}`,
        { radius: 1, subdivisions: 2, flat: false, updatable: true },
        this.scene
      );
      const pos = lobe.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      const cols = new Float32Array((pos.length / 3) * 4);
      for (let i = 0; i < pos.length; i += 3) {
        const vx = pos[i], vy = pos[i + 1], vz = pos[i + 2];
        const n = fbm3(vx * 2.1 + seedBase + idx * 5, vy * 2.1, vz * 2.1, this.seedNum + idx * 11, 2);
        const disp = 0.68 + n * 0.62;
        // Flatten underside and flare bough skirts so canopies read as layered foliage, not round blobs
        const yFactor = vy < 0 ? 0.44 : 1.12;
        const flare = vy < 0 ? 1.15 : 0.92;
        pos[i] = vx * rx * disp * flare + lx;
        pos[i + 1] = vy * ry * disp * yFactor + ly;
        pos[i + 2] = vz * rz * disp * flare + lz;

        // Strong vertical + radial self-occlusion so canopy undersides and inner hollows are shaded
        const shadeT = Math.max(0, Math.min(1, (vy * 0.55 + 0.45) * 0.8 + n * 0.3));
        const ci = (i / 3) * 4;
        cols[ci] = botCol[0] + (topCol[0] - botCol[0]) * shadeT;
        cols[ci + 1] = botCol[1] + (topCol[1] - botCol[1]) * shadeT;
        cols[ci + 2] = botCol[2] + (topCol[2] - botCol[2]) * shadeT;
        cols[ci + 3] = 1.0;
      }
      lobe.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
      lobe.setVerticesData(BABYLON.VertexBuffer.ColorKind, cols);
      const norm = new Float32Array(pos.length);
      BABYLON.VertexData.ComputeNormals(pos, lobe.getIndices(), norm);
      lobe.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norm);
      parts.push(lobe);
    });
    const merged = BABYLON.Mesh.MergeMeshes(parts, true, true, undefined, false, false);
    merged.name = name;
    return merged;
  }

  _buildBranchingTrunkMesh(name, branchPaths, radii) {
    const parts = branchPaths.map((pts, idx) => {
      const r0 = radii[idx][0];
      const r1 = radii[idx][1];
      return BABYLON.MeshBuilder.CreateTube(
        `${name}_b_${idx}`,
        {
          path: pts,
          radiusFunction: (i, dist) => {
            const t = i / (pts.length - 1);
            const rootFlare = idx === 0 && i === 0 ? 1.48 : 1.0;
            return (r0 * (1 - t) + r1 * t) * rootFlare;
          },
          tessellation: 7,
          cap: BABYLON.Mesh.CAP_END,
        },
        this.scene
      );
    });
    const merged = BABYLON.Mesh.MergeMeshes(parts, true, true, undefined, false, false);
    merged.name = name;
    return merged;
  }

  _buildForestAndRuin() {
    this._windPlugins = [];

    // 1. Find a lush forested inland spot for the Mysterious Ancient Ruin
    let bestRuinDir = new BABYLON.Vector3(0, 1, 0);
    for (let i = 0; i < 160; i++) {
      const theta = this.rng.range(0, Math.PI * 2);
      const phi = Math.acos(this.rng.range(-0.9, 0.9));
      const d = new BABYLON.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
      const h = this.getSurfaceHeight(d);
      const slope = this.getSlope(d);
      if (h > this.seaLevel + 1.2 && h < this.seaLevel + 3.4 && slope < 0.42) {
        bestRuinDir = d;
        break;
      }
    }
    const ruinH = this.getSurfaceHeight(bestRuinDir);
    this.ruinPosLocal = bestRuinDir.scale(ruinH);
    this._buildRuinMesh(bestRuinDir, ruinH);

    // 2. Find a nearby scenic coastal bay for initial arrival / reference
    let bayDir = bestRuinDir.clone();
    for (let i = 0; i < 200; i++) {
      const d = bestRuinDir
        .add(new BABYLON.Vector3(this.rng.range(-0.6, 0.6), this.rng.range(-0.6, 0.6), this.rng.range(-0.6, 0.6)))
        .normalize();
      const h = this.getSurfaceHeight(d);
      if (h < this.seaLevel - 0.5 && h > this.seaLevel - 2.5) {
        bayDir = d;
        break;
      }
    }
    this.shipAnchorLocal = bayDir.scale(this.seaLevel + 4.0);

    // 3. Materials for Multi-Species Trees & Multi-Layer Understory
    const barkTex = createBarkTexture(this.scene);
    const trunkMat = new BABYLON.PBRMaterial('treeTrunkMat', this.scene);
    trunkMat.albedoTexture = barkTex.albedoTex;
    trunkMat.bumpTexture = barkTex.bumpTex;
    trunkMat.bumpTexture.level = 0.95;
    trunkMat.metallic = 0.02;
    trunkMat.roughness = 0.9;

    const silverBarkMat = new BABYLON.PBRMaterial('silverBarkMat', this.scene);
    silverBarkMat.albedoColor = c3('#96a8a2');
    silverBarkMat.bumpTexture = barkTex.bumpTex;
    silverBarkMat.metallic = 0.04;
    silverBarkMat.roughness = 0.8;

    const foliageMat = new BABYLON.PBRMaterial('foliageMat', this.scene);
    foliageMat.albedoColor = c3('#ffffff');
    foliageMat.metallic = 0.02;
    foliageMat.roughness = 0.78;
    const fp = this._createWindPlugin(foliageMat, 0.06, 1.4);
    if (fp) this._windPlugins.push(fp);

    const willowLeafMat = new BABYLON.PBRMaterial('willowLeafMat', this.scene);
    willowLeafMat.albedoColor = c3('#ffffff');
    willowLeafMat.metallic = 0.02;
    willowLeafMat.roughness = 0.78;
    const wp = this._createWindPlugin(willowLeafMat, 0.08, 1.7);
    if (wp) this._windPlugins.push(wp);

    const grassMat = new BABYLON.PBRMaterial('grassMat', this.scene);
    grassMat.albedoColor = c3('#ffffff');
    grassMat.metallic = 0.0;
    grassMat.roughness = 0.82;
    grassMat.backFaceCulling = false;
    const gp = this._createWindPlugin(grassMat, 0.11, 2.2);
    if (gp) this._windPlugins.push(gp);

    const rockMat = new BABYLON.PBRMaterial('boulderMat', this.scene);
    rockMat.albedoColor = c3('#5b6166');
    rockMat.metallic = 0.05;
    rockMat.roughness = 0.88;

    // 4. Sculpted Organic Tree & Understory Templates (NO CONES!)
    // A) Ancient Cedar / Pine: curved trunk + 4 layered asymmetric organic bough clusters
    const cedarTrunk = this._buildBranchingTrunkMesh(
      'tCedarTrunk',
      [
        [
          new BABYLON.Vector3(0, -0.2, 0),
          new BABYLON.Vector3(0.08, 1.4, 0.05),
          new BABYLON.Vector3(-0.04, 2.9, -0.06),
          new BABYLON.Vector3(0.02, 4.3, 0),
        ],
        [new BABYLON.Vector3(0.02, 2.2, 0), new BABYLON.Vector3(0.75, 2.65, 0.3)],
        [new BABYLON.Vector3(-0.02, 2.8, -0.04), new BABYLON.Vector3(-0.68, 3.25, -0.25)],
      ],
      [[0.34, 0.07], [0.1, 0.03], [0.09, 0.03]]
    );
    cedarTrunk.material = trunkMat;
    cedarTrunk.parent = this.group;

    const cedarCrown = this._buildOrganicFoliageMesh(
      'tCedarCrown',
      [
        [0.48, 2.25, 0.28, 1.55, 0.45, 1.4],
        [-0.48, 2.45, -0.22, 1.45, 0.44, 1.35],
        [0.15, 2.95, -0.25, 1.32, 0.45, 1.25],
        [-0.22, 3.35, 0.22, 1.12, 0.45, 1.08],
        [0.08, 3.85, -0.06, 0.88, 0.48, 0.86],
        [-0.04, 4.38, 0.04, 0.56, 0.52, 0.56],
      ],
      [0.24, 0.48, 0.24],
      [0.05, 0.16, 0.10],
      11
    );
    cedarCrown.material = foliageMat;
    cedarCrown.parent = this.group;

    // B) Broadleaf Emerald Oak: gnarled branching trunk + 7-lobe wide layered canopy
    const oakTrunk = this._buildBranchingTrunkMesh(
      'tOakTrunk',
      [
        [
          new BABYLON.Vector3(0, -0.2, 0),
          new BABYLON.Vector3(-0.08, 0.9, 0.06),
          new BABYLON.Vector3(0.06, 1.9, -0.04),
          new BABYLON.Vector3(0.0, 2.6, 0.0),
        ],
        [new BABYLON.Vector3(0.04, 1.7, 0), new BABYLON.Vector3(0.85, 2.55, 0.45)],
        [new BABYLON.Vector3(-0.03, 1.85, 0), new BABYLON.Vector3(-0.82, 2.48, -0.35)],
        [new BABYLON.Vector3(0.0, 2.0, 0), new BABYLON.Vector3(0.12, 2.75, -0.78)],
      ],
      [[0.38, 0.14], [0.14, 0.05], [0.13, 0.05], [0.12, 0.05]]
    );
    oakTrunk.material = trunkMat;
    oakTrunk.parent = this.group;

    const oakCrown = this._buildOrganicFoliageMesh(
      'tOakCrown',
      [
        [0.0, 3.1, 0.0, 1.6, 0.72, 1.55],
        [1.05, 2.55, 0.48, 1.15, 0.58, 1.12],
        [-0.95, 2.52, -0.38, 1.18, 0.55, 1.1],
        [0.18, 2.72, -0.92, 1.08, 0.56, 1.05],
        [-0.3, 3.58, 0.28, 1.05, 0.6, 1.0],
        [0.52, 3.45, -0.32, 0.92, 0.55, 0.92],
        [-0.55, 2.85, 0.72, 0.98, 0.52, 0.95],
      ],
      [0.36, 0.56, 0.22],
      [0.08, 0.20, 0.10],
      27
    );
    oakCrown.material = foliageMat;
    oakCrown.parent = this.group;

    // C) Aether-Willow (rare luminous grove accent)
    const willowTrunk = this._buildBranchingTrunkMesh(
      'tWillowTrunk',
      [
        [
          new BABYLON.Vector3(0, -0.2, 0),
          new BABYLON.Vector3(0.18, 1.1, 0.1),
          new BABYLON.Vector3(-0.08, 2.2, -0.08),
          new BABYLON.Vector3(0.06, 3.0, 0.05),
        ],
      ],
      [[0.22, 0.08]]
    );
    willowTrunk.material = silverBarkMat;
    willowTrunk.parent = this.group;

    const willowCrown = this._buildOrganicFoliageMesh(
      'tWillowCrown',
      [
        [0.08, 3.15, 0.05, 1.35, 0.65, 1.3],
        [0.82, 2.55, 0.42, 0.95, 0.75, 0.92],
        [-0.75, 2.5, -0.38, 0.98, 0.72, 0.9],
        [0.12, 3.55, -0.15, 0.88, 0.55, 0.88],
      ],
      [0.48, 0.56, 0.28],
      [0.11, 0.21, 0.12],
      43
    );
    willowCrown.material = willowLeafMat;
    willowCrown.parent = this.group;

    // D) Understory Shrubs (3-lobe leafy bushes)
    const shrubMesh = this._buildOrganicFoliageMesh(
      'tShrub',
      [
        [0, 0.32, 0, 0.58, 0.42, 0.56],
        [0.35, 0.24, 0.22, 0.42, 0.32, 0.42],
        [-0.32, 0.26, -0.18, 0.4, 0.34, 0.38],
      ],
      [0.32, 0.68, 0.30],
      [0.12, 0.30, 0.16],
      61
    );
    shrubMesh.material = foliageMat;
    shrubMesh.parent = this.group;

    // E) Radiating Fern Fronds (5 curved arched blades via Ribbon)
    const fernParts = [];
    for (let f = 0; f < 5; f++) {
      const a = (f / 5) * Math.PI * 2 + 0.2;
      const ca = Math.cos(a), sa = Math.sin(a);
      const frondPaths = [];
      for (let r = 0; r <= 4; r++) {
        const t = r / 4;
        const dist = t * 0.95;
        const y = 0.08 + Math.sin(t * Math.PI * 0.78) * 0.48 - t * 0.12;
        const w = Math.sin(t * Math.PI) * 0.16 + 0.02;
        frondPaths.push([
          new BABYLON.Vector3(ca * dist - sa * w, y, sa * dist + ca * w),
          new BABYLON.Vector3(ca * dist + sa * w, y, sa * dist - ca * w),
        ]);
      }
      fernParts.push(BABYLON.MeshBuilder.CreateRibbon(`fern_${f}`, { pathArray: frondPaths }, this.scene));
    }
    const fernMesh = BABYLON.Mesh.MergeMeshes(fernParts, true, true, undefined, false, false);
    fernMesh.name = 'tFern';
    const fernPos = fernMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const fernCols = new Float32Array((fernPos.length / 3) * 4);
    for (let i = 0; i < fernCols.length; i += 4) {
      fernCols[i] = 0.22;
      fernCols[i + 1] = 0.64;
      fernCols[i + 2] = 0.28;
      fernCols[i + 3] = 1.0;
    }
    fernMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, fernCols);
    fernMesh.material = grassMat;
    fernMesh.parent = this.group;

    // F) Tall Meadow Grass Tufts + Wildflower Accents
    const grassParts = [];
    for (let g = 0; g < 6; g++) {
      const a = (g / 6) * Math.PI * 2;
      const ox = Math.cos(a) * 0.14;
      const oz = Math.sin(a) * 0.14;
      const leanX = Math.cos(a) * 0.22;
      const leanZ = Math.sin(a) * 0.22;
      grassParts.push(
        BABYLON.MeshBuilder.CreateRibbon(
          `blade_${g}`,
          {
            pathArray: [
              [new BABYLON.Vector3(ox - 0.04, 0, oz), new BABYLON.Vector3(ox + 0.04, 0, oz)],
              [new BABYLON.Vector3(ox + leanX * 0.5 - 0.025, 0.35, oz + leanZ * 0.5), new BABYLON.Vector3(ox + leanX * 0.5 + 0.025, 0.35, oz + leanZ * 0.5)],
              [new BABYLON.Vector3(ox + leanX, 0.68, oz + leanZ), new BABYLON.Vector3(ox + leanX + 0.005, 0.68, oz + leanZ)],
            ],
          },
          this.scene
        )
      );
    }
    const grassMesh = BABYLON.Mesh.MergeMeshes(grassParts, true, true, undefined, false, false);
    grassMesh.name = 'tGrass';
    const gPos = grassMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const gCols = new Float32Array((gPos.length / 3) * 4);
    for (let i = 0; i < gPos.length; i += 3) {
      const hT = Math.min(1, gPos[i + 1] / 0.68);
      const ci = (i / 3) * 4;
      gCols[ci] = 0.18 + hT * 0.28;
      gCols[ci + 1] = 0.42 + hT * 0.34;
      gCols[ci + 2] = 0.16 + hT * 0.12;
      gCols[ci + 3] = 1.0;
    }
    grassMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, gCols);
    grassMesh.material = grassMat;
    grassMesh.parent = this.group;

    // G) Sculpted Mossy Boulders (displaced IcoSphere, NOT smooth sphere)
    const rockMesh = BABYLON.MeshBuilder.CreateIcoSphere(
      'tRock',
      { radius: 0.62, subdivisions: 2, flat: true, updatable: true },
      this.scene
    );
    const rPos = rockMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for (let i = 0; i < rPos.length; i += 3) {
      const n = fbm3(rPos[i] * 2.5, rPos[i + 1] * 2.5, rPos[i + 2] * 2.5, this.seedNum + 88, 2);
      const k = 0.72 + n * 0.55;
      rPos[i] *= k;
      rPos[i + 1] *= k * 0.78;
      rPos[i + 2] *= k;
    }
    rockMesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, rPos);
    const rNorm = new Float32Array(rPos.length);
    BABYLON.VertexData.ComputeNormals(rPos, rockMesh.getIndices(), rNorm);
    rockMesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, rNorm);
    rockMesh.material = rockMat;
    rockMesh.parent = this.group;

    const cedarTrunkMats = [];
    const cedarCrownMats = [];
    const oakTrunkMats = [];
    const oakCrownMats = [];
    const willowTrunkMats = [];
    const willowCrownMats = [];
    const shrubMats = [];
    const fernMats = [];
    const grassMats = [];
    const rockMats = [];
    const weirdMats = [];

    // Strange glowing crystalline / alien spore-totems ("непонятные штуки")
    const weirdMesh = BABYLON.MeshBuilder.CreatePolyhedron('tpWeirdTotem', { type: 1, size: 0.55 }, this.scene);
    const weirdMat = new BABYLON.PBRMaterial('tpWeirdMat', this.scene);
    weirdMat.albedoColor = c3('#38f2d8');
    weirdMat.emissiveColor = c3('#126b62');
    weirdMat.metallic = 0.6;
    weirdMat.roughness = 0.2;
    weirdMesh.material = weirdMat;
    weirdMesh.parent = this.group;

    const upRef = new BABYLON.Vector3(0, 1, 0);
    const q = new BABYLON.Quaternion();
    const m = new BABYLON.Matrix();

    // Sample 5200 surface candidates for dense multi-layered forests, meadows, boulders & strange artifacts
    for (let i = 0; i < 5200; i++) {
      const theta = this.rng.range(0, Math.PI * 2);
      const phi = Math.acos(this.rng.range(-1, 1));
      const dir = new BABYLON.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));

      if (BABYLON.Vector3.Distance(dir, bestRuinDir) < 0.13) continue;

      const h = this.getSurfaceHeight(dir);
      const slope = this.getSlope(dir);
      if (h < this.seaLevel + 0.45 || h > this.seaLevel + 4.8 || slope > 0.68) continue;

      BABYLON.Quaternion.FromUnitVectorsToRef(upRef, dir, q);
      const rotY = BABYLON.Quaternion.RotationAxis(dir, this.rng.range(0, Math.PI * 2));
      const fullQ = rotY.multiply(q);

      const forestMask = fbm3(dir.x * 5.0, dir.y * 5.0, dir.z * 5.0, this.seedNum + 333, 2);

      // Clearings & coastal meadows get tall grass tufts, boulders & strange hovering artifacts
      if (forestMask < 0.36 || h < this.seaLevel + 0.85) {
        if (h > this.seaLevel + 0.65 && this.rng.next() < 0.72) {
          const gs = this.rng.range(0.85, 1.65);
          BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(gs, gs, gs), fullQ, dir.scale(h - 0.04), m);
          grassMats.push(...m.m);
        } else if (this.rng.next() < 0.28) {
          const sc = this.rng.range(0.65, 1.65);
          BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(sc, sc * 0.72, sc), fullQ, dir.scale(h + 0.1), m);
          rockMats.push(...m.m);
        } else if (this.rng.next() < 0.07) {
          const ws = this.rng.range(0.8, 1.9);
          BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(ws, ws * 1.4, ws), fullQ, dir.scale(h + 1.1), m);
          weirdMats.push(...m.m);
        }
        continue;
      }

      // Dense Forest Grove: Clustered Trees with varied height, proportions & natural lean
      const scaleH = this.rng.range(0.55, 1.72);
      const scaleW = scaleH * this.rng.range(0.82, 1.22);
      const tiltAxis = new BABYLON.Vector3(this.rng.range(-1, 1), 0, this.rng.range(-1, 1));
      if (tiltAxis.lengthSquared() < 0.01) tiltAxis.set(1, 0, 0);
      tiltAxis.normalize();
      const tiltQ = BABYLON.Quaternion.RotationAxis(tiltAxis, this.rng.range(-0.14, 0.14));
      const treeQ = fullQ.multiply(tiltQ);
      const distToRuin = BABYLON.Vector3.Distance(dir, bestRuinDir);
      const posVec = dir.scale(h - 0.16);

      if (distToRuin < 0.34 && this.rng.next() < 0.35) {
        BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(scaleW, scaleH, scaleW), treeQ, posVec, m);
        willowTrunkMats.push(...m.m);
        willowCrownMats.push(...m.m);
      } else if (h > this.seaLevel + 2.2 || this.rng.next() < 0.48) {
        BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(scaleW, scaleH, scaleW), treeQ, posVec, m);
        cedarTrunkMats.push(...m.m);
        cedarCrownMats.push(...m.m);
      } else {
        BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(scaleW, scaleH, scaleW), treeQ, posVec, m);
        oakTrunkMats.push(...m.m);
        oakCrownMats.push(...m.m);
      }

      this.treeColliders.push({ dir, radius: 0.42 * scaleW });

      // Add natural understory around trees (offset slightly along tangent)
      if (this.rng.next() < 0.78) {
        const perp = BABYLON.Vector3.Cross(dir, Math.abs(dir.y) < 0.9 ? upRef : new BABYLON.Vector3(1, 0, 0)).normalize();
        const uDir = dir.add(perp.scale(this.rng.range(-0.045, 0.045))).normalize();
        const uh = this.getSurfaceHeight(uDir);
        const uScale = this.rng.range(0.75, 1.35);
        BABYLON.Quaternion.FromUnitVectorsToRef(upRef, uDir, q);
        const uQ = BABYLON.Quaternion.RotationAxis(uDir, this.rng.range(0, Math.PI * 2)).multiply(q);
        BABYLON.Matrix.ComposeToRef(new BABYLON.Vector3(uScale, uScale, uScale), uQ, uDir.scale(uh - 0.04), m);
        const roll = this.rng.next();
        if (roll < 0.38) fernMats.push(...m.m);
        else if (roll < 0.72) grassMats.push(...m.m);
        else shrubMats.push(...m.m);
      }
    }

    const applyInstances = (mesh, arr) => {
      if (arr.length > 0) {
        mesh.thinInstanceSetBuffer('matrix', new Float32Array(arr), 16, true);
        mesh.receiveShadows = true;
      } else {
        mesh.setEnabled(false);
      }
    };

    applyInstances(cedarTrunk, cedarTrunkMats);
    applyInstances(cedarCrown, cedarCrownMats);
    applyInstances(oakTrunk, oakTrunkMats);
    applyInstances(oakCrown, oakCrownMats);
    applyInstances(willowTrunk, willowTrunkMats);
    applyInstances(willowCrown, willowCrownMats);
    applyInstances(shrubMesh, shrubMats);
    applyInstances(fernMesh, fernMats);
    applyInstances(grassMesh, grassMats);
    applyInstances(rockMesh, rockMats);
    applyInstances(weirdMesh, weirdMats);

    this.vegReadyPromise = this._upgradeVegetationWithGLTF({
      cedar: { matrices: cedarTrunkMats, fallbacks: [cedarTrunk, cedarCrown], dir: './assets/benchmark/models/trees/', file: 'pine_hero.glb', targetH: 7.4 },
      oak: { matrices: oakTrunkMats, fallbacks: [oakTrunk, oakCrown], dir: './assets/benchmark/models/trees/', file: 'coastal_alder.glb', targetH: 5.4 },
      willow: { matrices: willowTrunkMats, fallbacks: [willowTrunk, willowCrown], dir: './assets/benchmark/models/trees/', file: 'fir_medium.glb', targetH: 5.2 },
      fern: { matrices: fernMats, fallbacks: [fernMesh], dir: './assets/benchmark/models/fern_02/', file: 'fern_02_1k.gltf', targetH: 0.95 },
      grass: { matrices: grassMats, fallbacks: [grassMesh], dir: './assets/benchmark/models/trees/', file: 'grass_clump.glb', targetH: 0.75 },
      rock: { matrices: rockMats, fallbacks: [rockMesh], dir: './assets/benchmark/models/boulder_01/', file: 'boulder_01_1k.gltf', targetH: 1.55 },
    });
  }

  async _upgradeVegetationWithGLTF(specs) {
    const eng = this.scene.getEngine();
    if (!BABYLON.SceneLoader || (typeof BABYLON.NullEngine !== 'undefined' && eng instanceof BABYLON.NullEngine)) return;

    await Promise.all(
      Object.entries(specs).map(async ([key, cfg]) => {
        if (!cfg.matrices || cfg.matrices.length === 0) return;
        try {
          const res = await BABYLON.SceneLoader.ImportMeshAsync('', cfg.dir, cfg.file, this.scene);
          let minY = Infinity;
          let maxY = -Infinity;
          const meshes = [];
          for (const mesh of res.meshes) {
            if (!mesh.geometry) continue;
            mesh.computeWorldMatrix(true);
            const bi = mesh.getBoundingInfo();
            minY = Math.min(minY, bi.boundingBox.minimumWorld.y);
            maxY = Math.max(maxY, bi.boundingBox.maximumWorld.y);
            meshes.push(mesh);
          }
          if (!meshes.length) return;

          const rawH = Math.max(0.05, maxY - minY);
          const normScale = cfg.targetH / rawH;
          const yOff = Number.isFinite(minY) ? -minY * normScale : 0;

          // Bake normalization into thinInstance matrices so each sub-mesh aligns cleanly on planet radial up
          const normMat = BABYLON.Matrix.Compose(
            new BABYLON.Vector3(normScale, normScale, normScale),
            BABYLON.Quaternion.Identity(),
            new BABYLON.Vector3(0, yOff, 0)
          );
          const count = cfg.matrices.length / 16;
          const finalBuf = new Float32Array(cfg.matrices.length);
          const tmpM = new BABYLON.Matrix();
          const outM = new BABYLON.Matrix();
          for (let i = 0; i < count; i++) {
            BABYLON.Matrix.FromArrayToRef(cfg.matrices, i * 16, tmpM);
            normMat.multiplyToRef(tmpM, outM);
            outM.copyToArray(finalBuf, i * 16);
          }

          for (const mesh of meshes) {
            mesh.parent = this.group;
            mesh.receiveShadows = true;
            if (mesh.material) mesh.material.environmentIntensity = 0.78;
            mesh.thinInstanceSetBuffer('matrix', finalBuf, 16, true);
          }
          // Hide old procedural fallback templates once real GLTF/GLB instances are active
          for (const fb of cfg.fallbacks) {
            if (fb) fb.setEnabled(false);
          }
        } catch (err) {
          console.warn(`TerrainPlanet GLTF upgrade failed for ${key}:`, err);
        }
      })
    );
  }

  _buildRuinMesh(dir, h) {
    const group = new BABYLON.TransformNode('ancientRuin', this.scene);
    placeOnSurface(group, dir, h, 0);
    group.parent = this.group;

    const stoneMat = new BABYLON.PBRMaterial('ruinStoneMat', this.scene);
    stoneMat.albedoColor = c3('#747b82');
    if (this._terrainDetailTex) {
      stoneMat.albedoTexture = this._terrainDetailTex.albedoTex;
      stoneMat.bumpTexture = this._terrainDetailTex.bumpTex;
      stoneMat.bumpTexture.level = 0.7;
    }
    stoneMat.metallic = 0.06;
    stoneMat.roughness = 0.86;

    // Stepped circular stone dais
    const dais = BABYLON.MeshBuilder.CreateCylinder(
      'ruinDais',
      { diameterTop: 6.4, diameterBottom: 7.4, height: 0.45, tessellation: 14 },
      this.scene
    );
    dais.position.y = 0.18;
    dais.material = stoneMat;
    dais.receiveShadows = true;
    dais.parent = group;

    // Ring of 6 weathered standing monoliths + carved stone lintels
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const pillar = BABYLON.MeshBuilder.CreateCylinder(
        `ruinPil_${i}`,
        { diameterTop: 0.55, diameterBottom: 0.78, height: 3.4, tessellation: 6 },
        this.scene
      );
      pillar.position.set(Math.cos(a) * 3.1, 1.75, Math.sin(a) * 3.1);
      pillar.rotation.y = -a;
      pillar.material = stoneMat;
      pillar.parent = group;

      if (i % 2 === 0) {
        const nextA = ((i + 1) / 6) * Math.PI * 2;
        const midA = (a + nextA) * 0.5;
        const lintel = BABYLON.MeshBuilder.CreateBox(
          `ruinLintel_${i}`,
          { width: 3.3, height: 0.42, depth: 0.72 },
          this.scene
        );
        lintel.position.set(Math.cos(midA) * 2.95, 3.45, Math.sin(midA) * 2.95);
        lintel.rotation.y = -midA + Math.PI / 2;
        lintel.material = stoneMat;
        lintel.parent = group;
      }
    }

    // Floating Resonant Monolith at center (faceted crystalline PBR + subtle inner core)
    this.ruinCrystalMat = new BABYLON.PBRMaterial('ruinCrysMat', this.scene);
    this.ruinCrystalMat.albedoColor = c3('#24c8b4');
    this.ruinCrystalMat.emissiveColor = c3('#0c6e64');
    this.ruinCrystalMat.metallic = 0.18;
    this.ruinCrystalMat.roughness = 0.14;
    this.ruinCrystalMat.alpha = 0.90;

    this.ruinCrystal = BABYLON.MeshBuilder.CreatePolyhedron('ruinCrystal', { type: 1, size: 0.92 }, this.scene);
    this.ruinCrystal.position.y = 2.75;
    this.ruinCrystal.material = this.ruinCrystalMat;
    this.ruinCrystal.parent = group;

    // Local cyan-teal illumination from the floating crystal onto surrounding pillars & terrain
    const crystalLight = new BABYLON.PointLight('ruinCrystalLight', new BABYLON.Vector3(0, 2.8, 0), this.scene);
    crystalLight.diffuse = c3('#4ce8d8');
    crystalLight.intensity = 2.4;
    crystalLight.range = 16;
    crystalLight.parent = group;
  }

  isClearOfTrees(unitDir, minAngularDist = 0.095) {
    for (const tc of this.treeColliders) {
      if (BABYLON.Vector3.Distance(unitDir, tc.dir) < minAngularDist) return false;
    }
    return true;
  }

  update(dt, time, cameraPos, shipWorldPos, shipInWater) {
    // LOD switching based on distance to camera
    const dist = cameraPos ? BABYLON.Vector3.Distance(cameraPos, this.group.position) : 0;
    const isNear = dist < 155;
    this.highTerrain.setEnabled(isNear);
    this.lowTerrain.setEnabled(!isNear);

    if (this.atmoMat && cameraPos) {
      this.atmoMat.setVector3('uCameraPos', cameraPos);
    }
    if (this._windPlugins) {
      for (const wp of this._windPlugins) wp.time = time;
    }

    if (isNear) {
      this._updateOceanWaves(time, cameraPos, shipWorldPos, shipInWater);
    }

    if (this.cloudMesh) {
      this.cloudMesh.rotation.y += dt * 0.02;
    }
    if (this.ruinCrystal) {
      this.ruinCrystal.rotation.y += dt * (this.ruinActivated ? 2.5 : 0.7);
    }
  }
}
