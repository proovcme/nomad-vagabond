// Graphics quality profiles, procedural twilight IBL environment, adaptive exposure & post-processing

export const QUALITY_PRESETS = {
  low: {
    label: 'Низкое',
    shadowSize: 512,
    shadowPCF: false,
    ssao: false,
    bloom: false,
    msaa: 1,
    scaleFactor: 1.25,
    envIntensity: 0.65,
  },
  medium: {
    label: 'Среднее',
    shadowSize: 1024,
    shadowPCF: true,
    ssao: false,
    bloom: true,
    msaa: 2,
    scaleFactor: 1.0,
    envIntensity: 0.78,
  },
  high: {
    label: 'Высокое',
    shadowSize: 2048,
    shadowPCF: true,
    ssao: true,
    bloom: true,
    msaa: 4,
    scaleFactor: 1.0,
    envIntensity: 0.88,
  },
  ultra: {
    label: 'Ультра',
    shadowSize: 2048,
    shadowPCF: true,
    ssao: true,
    bloom: true,
    msaa: 4,
    scaleFactor: 1.0,
    envIntensity: 0.95,
  },
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Generates a 6-face procedural twilight/industrial-space RawCubeTexture for PBR IBL.
 * Zero external requests; works reliably in WebGL2 (Chrome & Safari).
 */
export function createTwilightEnvironmentTexture(scene, size = 32) {
  const faceDirs = [
    (u, v) => [1, -v, -u],  // +X
    (u, v) => [-1, -v, u],  // -X
    (u, v) => [u, 1, v],    // +Y
    (u, v) => [u, -1, -v],  // -Y
    (u, v) => [u, -v, 1],   // +Z
    (u, v) => [-u, -v, -1], // -Z
  ];

  // Key sun direction inside the environment probe for crisp metallic/glass highlights
  const sx = -0.62;
  const sy = 0.52;
  const sz = -0.58;

  const faces = faceDirs.map((dirFn) => {
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      const v = ((y + 0.5) / size) * 2 - 1;
      for (let x = 0; x < size; x++) {
        const u = ((x + 0.5) / size) * 2 - 1;
        let [dx, dy, dz] = dirFn(u, v);
        const len = Math.hypot(dx, dy, dz) || 1;
        dx /= len;
        dy /= len;
        dz /= len;

        // Vertical twilight sky -> slate-teal horizon -> dark ground bounce
        const upT = Math.max(0, dy);
        const downT = Math.max(0, -dy);
        const horiz = Math.pow(1 - Math.abs(dy), 2.2);

        let r = lerp(52, 74, upT) + horiz * 34 - downT * 12;
        let g = lerp(76, 114, upT) + horiz * 40 - downT * 22;
        let b = lerp(102, 156, upT) + horiz * 42 - downT * 26;

        // Warm amber sun lobe & crisp specular highlight
        const sunDot = Math.max(0, dx * sx + dy * sy + dz * sz);
        const sunGlow = Math.pow(sunDot, 5) * 95 + Math.pow(sunDot, 36) * 140;
        r += sunGlow * 1.15;
        g += sunGlow * 0.85;
        b += sunGlow * 0.52;

        // Subtle cool teal rim opposite sun
        const rimDot = Math.max(0, -dx * sx - dz * sz);
        const rim = Math.pow(rimDot, 3) * horiz * 26;
        g += rim * 0.8;
        b += rim * 1.1;

        const idx = (y * size + x) * 4;
        data[idx] = Math.max(0, Math.min(255, Math.round(r)));
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
        data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
        data[idx + 3] = 255;
      }
    }
    return data;
  });

  const cubeTex = new BABYLON.RawCubeTexture(
    scene,
    faces,
    size,
    BABYLON.Engine.TEXTUREFORMAT_RGBA,
    BABYLON.Engine.TEXTURETYPE_UNSIGNED_BYTE,
    true,
    false,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE
  );
  cubeTex.gammaSpace = true;
  return cubeTex;
}

/**
 * Creates a soft radial contact-shadow decal texture for grounding props, aircraft, and buildings.
 */
export function createContactShadowTexture(scene) {
  const size = 128;
  const tex = new BABYLON.DynamicTexture('contactShadowTex', { width: size, height: size }, scene, true);
  const ctx = tex.getContext();
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2 - 2);
  grad.addColorStop(0, 'rgba(6, 10, 14, 0.62)');
  grad.addColorStop(0.55, 'rgba(8, 12, 16, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  tex.update();
  return tex;
}

export class GraphicsManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.quality = 'high';
    this.pipeline = null;
    this.ssao = null;
    this.targetExposure = 1.22;
    this.currentExposure = 1.22;

    const engine = scene.getEngine();
    this.isHeadlessOrNull = !engine || engine instanceof BABYLON.NullEngine;

    // Install procedural IBL environment immediately so all PBR materials reflect twilight sky & sun
    if (!this.isHeadlessOrNull) {
      scene.environmentTexture = scene.metadata?.skyLighting
        ? BABYLON.CubeTexture.CreateFromPrefilteredData('./assets/environments/environmentSpecular.env', scene)
        : createTwilightEnvironmentTexture(scene, 32);
      scene.environmentIntensity = QUALITY_PRESETS[this.quality].envIntensity;
    }

    // Configure ACES / PBR-Neutral tone mapping + Juicy Stylized Porco-Rosso / TaleSpin Color Grading
    const ipc = scene.imageProcessingConfiguration;
    if (ipc) {
      ipc.toneMappingEnabled = true;
      ipc.toneMappingType = scene.metadata?.skyLighting ? BABYLON.ImageProcessingConfiguration.TONEMAPPING_KHR_PBR_NEUTRAL : BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
      ipc.exposure = this.currentExposure;
      ipc.contrast = 1.18;
      ipc.colorCurvesEnabled = true;
      const curves = new BABYLON.ColorCurves();
      curves.shadowsHue = 216;
      curves.shadowsSaturation = 26;
      curves.shadowsDensity = 6;
      curves.midtonesHue = 32;
      curves.midtonesSaturation = 34;
      curves.midtonesDensity = 0;
      curves.highlightsHue = 38;
      curves.highlightsSaturation = 28;
      curves.highlightsExposure = 8;
      ipc.colorCurves = curves;

      ipc.vignetteEnabled = !scene.metadata?.skyLighting;
      ipc.vignetteWeight = 0.25;
      ipc.vignetteStretch = 0.5;
      ipc.vignetteColor = new BABYLON.Color4(0.08, 0.05, 0.04, 1.0);
      ipc.vignetteBlendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEBLENDMODE_MULTIPLY;
    }
  }

  applyQuality(presetKey = 'high', shadowGenerator = null) {
    const key = QUALITY_PRESETS[presetKey] ? presetKey : 'high';
    this.quality = key;
    this.scene.metadata={...this.scene.metadata,graphicsQuality:key};
    const cfg = QUALITY_PRESETS[key];
    const engine = this.scene.getEngine();

    if (this.isHeadlessOrNull || !this.camera) return;

    const dpr = Math.min(window.devicePixelRatio || 1, key==='medium'?1.5:key==='low'?1:2);
    engine.setHardwareScalingLevel(cfg.scaleFactor / dpr);
    this.scene.environmentIntensity = this.scene.metadata?.skyLighting ? 0.86 : cfg.envIntensity;
    this.scene.getMaterialByName('archSkyShader')?.setFloat('uVolumetricClouds',cfg.ssao?1:0);

    if (shadowGenerator) {
      shadowGenerator.getShadowMap()?.resize(cfg.shadowSize);
      shadowGenerator.usePercentageCloserFiltering = cfg.shadowPCF;
      shadowGenerator.filteringQuality = cfg.shadowPCF
        ? BABYLON.ShadowGenerator.QUALITY_HIGH
        : BABYLON.ShadowGenerator.QUALITY_LOW;
    }

    // Selective subtle Bloom + MSAA (no blur/haze)
    if (this.pipeline) {
      this.pipeline.dispose();
      this.pipeline = null;
    }
    try {
      const pipe = new BABYLON.DefaultRenderingPipeline('nomadPipe', true, this.scene, [this.camera]);
      pipe.samples = cfg.msaa;
      pipe.fxaaEnabled = cfg.msaa <= 1;
      pipe.imageProcessingEnabled = Boolean(this.scene.metadata?.skyLighting); // One final linear→display transform for the entire sky scene
      pipe.bloomEnabled = cfg.bloom;
      if (cfg.bloom) {
        pipe.bloomThreshold = 0.86;
        pipe.bloomWeight = 0.22;
        pipe.bloomKernel = 56;
        pipe.bloomScale = 0.5;
      }
      // A single ACES/PBR-neutral path with subtle sharpening for crisp rock/metal detail
      pipe.sharpenEnabled = true;
      if (pipe.sharpen) {
        pipe.sharpen.edgeAmount = 0.26;
        pipe.sharpen.colorAmount = 1.0;
      }
      pipe.grainEnabled = false;
      pipe.chromaticAberrationEnabled = false;
      this.pipeline = pipe;
    } catch (_) {
      this.pipeline = null;
    }

    // SSAO2 for architectural & rock crevice depth (High / Ultra on WebGL2)
    if (this.ssao) {
      this.ssao.dispose();
      this.ssao = null;
    }
    if(!cfg.ssao && this.scene.metadata?.skyLighting)this.scene.disablePrePassRenderer();
    if (cfg.ssao && engine.webGLVersion >= 2) {
      try {
        const ssao = new BABYLON.SSAO2RenderingPipeline('nomadSSAO', this.scene, { ssaoRatio: 0.5, blurRatio: 0.75 }, [this.camera], false);
        ssao.radius = 1.6;
        ssao.totalStrength = 0.62;
        ssao.expensiveBlur = false;
        ssao.samples = 16;
        ssao.maxZ = 220;
        // SSAO's pre-pass must not apply a second gamma conversion to PBR output.
        this.scene.enablePrePassRenderer().disableGammaTransform = true;
        this.ssao = ssao;
      } catch (_) {
        this.ssao = null;
      }
    }
  }

  /**
   * Adapts directional light tint/intensity and camera exposure for space, day/sunset, and night.
   */
  updateAtmosphereLighting(dt, world, context = {}) {
    const { inAtmo = false, atmoDensity = 0, sunElevation = 0.5, onAsteroid = false } = context;

    // 1. Exposure adaptation: slightly brighter at night or inside space shadow so nothing goes blind
    let targetExp = 1.08;
    if (onAsteroid) {
      targetExp = 1.14;
    } else if (inAtmo) {
      const nightFactor = Math.max(0, Math.min(1, -sunElevation * 2.2 + 0.25));
      targetExp = lerp(1.04, 1.24, nightFactor);
    } else {
      targetExp = 1.10;
    }
    this.currentExposure = lerp(this.currentExposure, targetExp, Math.min(1, dt * 2.4));
    if (this.scene.imageProcessingConfiguration) {
      this.scene.imageProcessingConfiguration.exposure = this.currentExposure;
    }

    // 2. Sun elevation color shift in atmosphere (golden sunset -> twilight blue -> night moonlight)
    if (world && world.sunDirLight && world.hemiLight) {
      if (inAtmo) {
        const dayT = Math.max(0, Math.min(1, (sunElevation + 0.15) / 0.65));
        const sunsetT = Math.max(0, 1 - Math.abs(sunElevation - 0.08) / 0.28);

        // Sun light tint: warm cream in day, rich amber-coral at sunset, cool moonlight at night
        const sunR = lerp(0.38, 1.0, dayT) + sunsetT * 0.12;
        const sunG = lerp(0.52, 0.89, dayT) - sunsetT * 0.14;
        const sunB = lerp(0.76, 0.74, dayT) - sunsetT * 0.28;
        world.sunDirLight.diffuse.set(
          Math.min(1, sunR),
          Math.max(0.25, Math.min(1, sunG)),
          Math.max(0.20, Math.min(1, sunB))
        );
        world.sunDirLight.intensity = lerp(0.95, 2.95, dayT);

        // Sky hemisphere light: keeps night readable in cold twilight blue without washing out day
        world.hemiLight.intensity = lerp(0.52, 0.42, dayT) + atmoDensity * 0.08;
        world.hemiLight.diffuse.set(
          lerp(0.28, 0.48, dayT),
          lerp(0.42, 0.60, dayT),
          lerp(0.62, 0.76, dayT)
        );
      } else {
        world.sunDirLight.diffuse.set(1.0, 0.90, 0.74);
        world.sunDirLight.intensity = 2.85;
        world.hemiLight.intensity = 0.44;
        world.hemiLight.diffuse.set(0.43, 0.60, 0.75);
      }
    }
  }

  dispose() {
    if (this.ssao) this.ssao.dispose();
    if (this.pipeline) this.pipeline.dispose();
  }
}

/**
 * Raycasts from pivotPos toward desiredCam against solid world geometry (terrain, rocks, buildings)
 * and clamps the camera above local surface height so it never clips inside slopes or structures.
 */
export function resolveCameraCollision(scene, pivotPos, desiredCam, upVec, getMinHeightAtWorldPos = null, minDist = 1.45) {
  const toCam = desiredCam.subtract(pivotPos);
  const fullDist = toCam.length();
  if (fullDist < 0.01) return desiredCam.clone();

  const dir = toCam.scale(1 / fullDist);
  const ray = new BABYLON.Ray(pivotPos, dir, fullDist);
  const hit = scene.pickWithRay(ray, (mesh) => {
    if (!mesh || !mesh.isVisible || !mesh.isEnabled() || !mesh.checkCollisions) return false;
    for (let owner = mesh; owner; owner = owner.parent) {
      if (owner.metadata?.cameraIgnore) return false;
    }
    return true;
  });

  let safeDist = fullDist;
  if (hit && hit.hit && hit.distance > 0.25 && hit.distance < fullDist) {
    safeDist = Math.max(minDist, hit.distance - 0.48);
  }
  const resolved = pivotPos.add(dir.scale(safeDist));

  if (getMinHeightAtWorldPos) {
    const minPos = getMinHeightAtWorldPos(resolved);
    if (minPos) return minPos;
  }
  return resolved;
}
