import { leadPoint } from './combatAim.js?v=mission1';
import { createRustedMetalTexture } from './textures.js?v=mission1';
import { resolveCameraCollision, createContactShadowTexture } from './graphics.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Aircraft assets, physics, weapons and chase camera all use local -Z as the nose.
// TransformNode.lookAt defaults differ between handedness settings; keep this explicit.
export function aircraftHeading(direction) {
  const d = direction.normalizeToNew();
  return BABYLON.Quaternion.RotationYawPitchRoll(
    Math.atan2(-d.x, -d.z), Math.asin(clamp(d.y, -1, 1)), 0
  );
}

/** Preserve the authored Gemini atlas: adjust only its physical response in daylight.
 * The packed green/blue roughness/metalness channels still distinguish canvas,
 * painted panels and exposed steel. No replacement texture, tint or glow is added.
 */
class NomadAviationPaint extends BABYLON.MaterialPluginBase {
  constructor(material, variant = 'cargo') {
    super(material, 'NomadAviationPaint', 212, {NOMAD_AVIATION_PAINT:false}, true);
    this.setVariant(variant);
    this._enable(true);
  }
  setVariant(variant) {
    this.variantCode = variant === 'fighter' ? 1.0 : variant === 'attacker' ? 2.0 : variant === 'bomber' ? 3.0 : 0.0;
  }
  getClassName() {return 'NomadAviationPaint';}
  prepareDefines(defines) {defines.NOMAD_AVIATION_PAINT=true;}
  getUniforms() {return {ubo:[{name:'aircraftLiveryParams',size:4,type:'vec4'}],fragment:'uniform vec4 aircraftLiveryParams;'};}
  bindForSubMesh(buffer) {
    buffer.updateFloat4('aircraftLiveryParams', this.variantCode, 0, 0, 0);
    buffer.update();
  }
  getCustomCode(type) {
    if (type !== 'fragment') return null;
    return {
      CUSTOM_FRAGMENT_UPDATE_ALBEDO: `
        #if defined(NOMAD_AVIATION_PAINT) && defined(ALBEDO)
        // Extract riveted panel seams, grime & grain from the authored atlas while replacing circus stripes
        float rawLum = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
        float panelDetail = clamp(pow(max(rawLum, 0.004) / 0.22, 0.58), 0.30, 1.30);
        float oxideHint = smoothstep(0.06, 0.22, surfaceAlbedo.r - surfaceAlbedo.b);
        vec2 uv = vAlbedoUV;
        float vBand = fract(uv.y);

        vec3 bodyTone;
        vec3 trimTone;
        vec3 cowlingTone;
        if (aircraftLiveryParams.x < 0.5) {
          // CARGO ('cargo' — TaleSpin Sea Duck: weathered sand-ochre hull, deep maroon trim, dark anti-glare nose)
          bodyTone = vec3(0.76, 0.58, 0.33);
          trimTone = vec3(0.52, 0.16, 0.14);
          cowlingTone = vec3(0.24, 0.27, 0.26);
        } else if (aircraftLiveryParams.x < 1.5) {
          // FIGHTER ('fighter' — Porco Rosso Savoia/Curtiss: weathered Adriatic crimson-terracotta, warm cream band, charcoal nose)
          bodyTone = vec3(0.64, 0.19, 0.15);
          trimTone = vec3(0.84, 0.78, 0.64);
          cowlingTone = vec3(0.21, 0.24, 0.26);
        } else if (aircraftLiveryParams.x < 2.5) {
          // ATTACKER ('attacker' — Project Nomads gunship: utilitarian olive-drab, tactical ochre band, gunmetal armor)
          bodyTone = vec3(0.35, 0.41, 0.32);
          trimTone = vec3(0.70, 0.54, 0.28);
          cowlingTone = vec3(0.23, 0.26, 0.28);
        } else {
          // BOMBER ('bomber' — Expedition khaki-bronze, deep naval slate band, soot-bronze nacelles)
          bodyTone = vec3(0.52, 0.45, 0.35);
          trimTone = vec3(0.25, 0.30, 0.34);
          cowlingTone = vec3(0.23, 0.22, 0.21);
        }

        vec3 targetLinear;
        if (vBand < 0.25) {
          float stripe = smoothstep(0.095, 0.105, vBand) * (1.0 - smoothstep(0.130, 0.140, vBand));
          vec3 baseCol = mix(bodyTone, trimTone, stripe);
          baseCol = mix(baseCol, vec3(0.26, 0.22, 0.19), oxideHint * 0.42);
          targetLinear = toLinearSpace(baseCol) * panelDetail;
        } else if (vBand < 0.50) {
          float pinStripe = smoothstep(0.358, 0.365, vBand) * (1.0 - smoothstep(0.382, 0.390, vBand));
          vec3 noseCol = mix(cowlingTone, trimTone * 0.85, pinStripe * 0.65);
          noseCol = mix(noseCol, vec3(0.32, 0.25, 0.20), oxideHint * 0.35);
          targetLinear = toLinearSpace(noseCol) * panelDetail;
        } else if (vBand < 0.75) {
          targetLinear = toLinearSpace(vec3(0.22, 0.24, 0.26)) * panelDetail;
        } else {
          vec3 strapOrBrass = fract(uv.x) < 0.5 ? vec3(0.36, 0.33, 0.30) : vec3(0.76, 0.58, 0.30);
          targetLinear = toLinearSpace(strapOrBrass) * panelDetail;
        }
        surfaceAlbedo = clamp(targetLinear, vec3(0.0), vec3(1.0));
        #endif
      `,
      CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS: `
        #if defined(NOMAD_AVIATION_PAINT) && defined(ALBEDO)
        float vBandMR = fract(vAlbedoUV.y);
        float panelLumMR = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
        if (vBandMR >= 0.50) {
          // Exposed steel cowlings, gun barrels & brass straps gleam with metallic specular highlights
          metallicRoughness.r = 0.76;
          metallicRoughness.g = clamp(0.28 - panelLumMR * 0.08, 0.18, 0.36);
        } else {
          // Satin-gloss aviation enamel with crisp sunlit highlights along riveted panels
          metallicRoughness.r = 0.38;
          metallicRoughness.g = clamp(0.38 - panelLumMR * 0.12, 0.24, 0.46);
        }
        #endif
      `,
    };
  }
}

export function configureImportedAircraftMaterial(material, engine, variant = 'cargo') {
  if (!material || material.getClassName?.() !== 'PBRMaterial') return false;
  if (/glass|canopy|window/i.test(material.name)) {
    material.albedoColor.set(0.18, 0.28, 0.36);
    material.metallic = 0.35;
    material.roughness = 0.08;
    material.environmentIntensity = 1.85;
    material.specularIntensity = 1.45;
    material.alpha = Math.min(material.alpha || 0.48, 0.52);
    if (material.clearCoat) {
      material.clearCoat.isEnabled = true;
      material.clearCoat.intensity = 0.65;
      material.clearCoat.roughness = 0.06;
    }
    return true;
  }
  if (/glow|emissive/i.test(material.name)) {
    material.emissiveColor = c3('#ffb84d');
    material.emissiveIntensity = 2.4;
    return true;
  }
  if (!/atlas|armor/i.test(material.name)) return false;
  material.albedoColor.set(1.0, 1.0, 1.0);
  material.metallic = 0.42;
  material.roughness = 0.36;
  material.environmentIntensity = 1.65;
  material.specularIntensity = 1.35;
  if (material.clearCoat) {
    material.clearCoat.isEnabled = true;
    material.clearCoat.intensity = 0.42;
    material.clearCoat.roughness = 0.18;
  }
  if (material._nomadAviationPaint) material._nomadAviationPaint.setVariant(variant);
  else material._nomadAviationPaint = new NomadAviationPaint(material, variant);
  // Preserve mip filtering and atlas detail on shallow-angle wings; cap the cost.
  const anisotropy = Math.min(8, engine?.getCaps?.().maxAnisotropy || 4);
  if (material.albedoTexture) material.albedoTexture.anisotropicFilteringLevel = anisotropy;
  if (material.metallicTexture) material.metallicTexture.anisotropicFilteringLevel = anisotropy;
  return true;
}

/** Find navigation-light mount faces on the loaded airframe, in model-root coordinates.
 * Uses real wing/tail/roof geometry, so variants and the GLB's root offset stay aligned.
 */
export function deriveAircraftLightSockets(meshes, modelRoot, variant = 'cargo') {
  const B = BABYLON;
  const frames = meshes.filter(m => /airframe/i.test(m.name) && m.getTotalVertices?.() > 0);
  if (!frames.length) return null;
  modelRoot.computeWorldMatrix(true);
  const inverse = modelRoot.getWorldMatrix().clone().invert(), points = [], faces = [];
  for (const mesh of frames) {
    mesh.computeWorldMatrix(true);
    const transform = mesh.getWorldMatrix().multiply(inverse);
    const vertices = mesh.getVerticesData(B.VertexBuffer.PositionKind), localPoints = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const point = B.Vector3.TransformCoordinates(new B.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]), transform);
      localPoints.push(point); points.push(point);
    }
    const indices = mesh.getIndices();
    for (let i = 0; i < indices.length; i += 3) faces.push([localPoints[indices[i]], localPoints[indices[i + 1]], localPoints[indices[i + 2]]]);
  }
  const min = new B.Vector3(Infinity, Infinity, Infinity), max = new B.Vector3(-Infinity, -Infinity, -Infinity);
  for (const point of points) {min.minimizeInPlace(point);max.maximizeInPlace(point);}
  const average = samples => samples.reduce((sum, point) => sum.addInPlace(point), B.Vector3.Zero()).scaleInPlace(1 / samples.length);
  const onSurface = point => {
    let nearest = Infinity; const result = point.clone(), projected = B.Vector3.Zero();
    for (const face of faces) {
      const distance = B.Vector3.ProjectOnTriangleToRef(point, face[0], face[1], face[2], projected);
      if (distance < nearest) {nearest = distance; result.copyFrom(projected);}
    }
    return result;
  };
  const band = .025;
  const port = onSurface(average(points.filter(p => p.x <= min.x + band)));
  const starboard = onSurface(average(points.filter(p => p.x >= max.x - band)));
  const tail = onSurface(average(points.filter(p => p.z >= max.z - band)));
  const roofPoints = points.filter(p => Math.abs(p.x) < (max.x - min.x) * .12 && p.z < min.z + (max.z - min.z) * .65);
  const roofY = Math.max(...roofPoints.map(p => p.y));
  const roof = onSurface(average(roofPoints.filter(p => p.y >= roofY - band)));
  const socket = (surface, normal) => ({surface: surface.asArray(), normal});
  return {root: modelRoot, variant, source: 'airframe-surface-extrema', bounds: {min: min.asArray(), max: max.asArray()},
    port: socket(port, [-1, 0, 0]), starboard: socket(starboard, [1, 0, 0]),
    tail: socket(tail, [0, 0, 1]), beacon: socket(roof, [0, 1, 0])};
}

export const AIRCRAFT_SPECS = {
  cargo: {
    name: 'Грузовой «Бродяга»',
    maxHull: 150,
    maxSpeed: 50,
    boostSpeed: 74,
    accel: 36,
    brake: 34,
    pitchRate: 1.55,
    yawRate: 1.25,
    rollRate: 1.95,
    bankAssist: 0.45,
    turnGrip: 3.4,
    gunCd: 0.14,
    gunSpeed: 210,
    gunSpread: 0.014,
    gunColor: '#ffd166',
    gunSize: 0.22,
    special: 'winch',
    specialCd: 1.5,
  },
  fighter: {
    name: 'Истребитель «Оса»',
    maxHull: 135,
    maxSpeed: 76,
    boostSpeed: 118,
    accel: 66,
    brake: 54,
    pitchRate: 2.50,
    yawRate: 1.95,
    rollRate: 3.80,
    bankAssist: 0.78,
    turnGrip: 6.0,
    gunCd: 0.11,
    gunSpeed: 290,
    gunSpread: 0.008,
    gunColor: '#ffe066',
    gunSize: 0.18,
    dualGuns: true,
    special: 'none',
    specialCd: 1.0,
  },
  bomber: {
    name: 'Бомбардировщик «Молот»',
    maxHull: 215,
    maxSpeed: 42,
    boostSpeed: 62,
    accel: 26,
    brake: 28,
    pitchRate: 1.15,
    yawRate: 0.95,
    rollRate: 1.35,
    bankAssist: 0.30,
    turnGrip: 2.6,
    gunCd: 0.18,
    gunSpeed: 195,
    gunSpread: 0.022,
    gunColor: '#ff9f43',
    gunSize: 0.26,
    special: 'bomb',
    specialCd: 1.15,
  },
  attacker: {
    name: 'Штурмовик «Клык»',
    maxHull: 170,
    maxSpeed: 56,
    boostSpeed: 84,
    accel: 46,
    brake: 42,
    pitchRate: 1.85,
    yawRate: 1.45,
    rollRate: 2.45,
    bankAssist: 0.55,
    turnGrip: 4.2,
    gunCd: 0.16,
    gunSpeed: 235,
    gunSpread: 0.007,
    gunColor: '#ff7b38',
    gunSize: 0.30,
    special: 'rocket_salvo',
    specialCd: 1.1,
  },
};

export const AIRCRAFT_GROUND_PROFILES = Object.freeze({
  cargo: {gearBottom:-.744974918, rotationSpeed:20, liftoffSpeed:22, groundAccel:10, wingspan:13.64, noseClearX:12, autoRotateX:45},
  fighter: {gearBottom:-.747499999, rotationSpeed:17, liftoffSpeed:20, groundAccel:13, wingspan:10.28, noseClearX:12, autoRotateX:43},
  bomber: {gearBottom:-.744974918, rotationSpeed:22, liftoffSpeed:24, groundAccel:9, wingspan:16.30, noseClearX:14, autoRotateX:46},
  attacker: {gearBottom:-.747499999, rotationSpeed:19, liftoffSpeed:22, groundAccel:11.5, wingspan:11.30, noseClearX:12, autoRotateX:44},
});

/**
 * Dieselpunk Explorer Aircraft + Dual FlightPhysics (Atmosphere Aerodynamics <-> Space 6-DOF).
 * Compact (~4.0u long, 4.8u wingspan) relative to the ~44u AsteroidBase.
 */
export class ExplorerAircraft {
  constructor(scene, camera, audio, variant = 'cargo') {
    this.scene = scene;
    this.camera = camera;
    this.audio = audio;
    this.variant = variant;
    this.spec = AIRCRAFT_SPECS[variant] || AIRCRAFT_SPECS.cargo;

    this.group = new BABYLON.TransformNode('aircraftGroup', scene);
    this.group.rotationQuaternion = BABYLON.Quaternion.Identity();
    this.group.metadata = {cameraIgnore: true};
    this.velocity = new BABYLON.Vector3();

    this.hull = this.spec.maxHull;
    this.maxHull = this.spec.maxHull;
    this.fuel = 100;
    this.maxFuel = 100;
    this.projectiles = [];
    this.gunCooldown = 0;
    this.specialCooldown = 0;
    this.gunBarrelToggle = 0;
    this.throttle = 0.0;
    this.atmoDensity = 0.0;
    this.airspeed = 0.0;
    this.liftRatio = 0.0;
    this.isStalling = false;
    this.driveSpeed = 0.0;

    // Docking / landing state
    this.dockedAsteroid = null;
    this.dockedPlanet = null;
    this.waterPlanet = null;
    this.nearPlanet = null;
    this.nearAsteroid = null;
    this.upgrades = new Set();

    // Camera orbit / chase state
    this.camPos = new BABYLON.Vector3(0, 10, 20);
    this.camTarget = new BABYLON.Vector3();
    this.camInited = false;
    this.freeYaw = 0;
    this.freePitch = 0.14;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.keys = {};

    // Animated parts
    this.propellerNode = null;
    this.aileronL = null;
    this.aileronR = null;
    this.elevator = null;
    this.rudder = null;
    this.rocketFlames = [];
    this.wheels = [];
    this.gearStruts = [];
    this.exhaustPS = null;

    this._gearRestInfo = new Map();
    this._groundGearBottom = null;
    this._deployedGearPoints = [];
    this._runwayState = null;
    this._buildModel();
    this._rememberLandingGear(this.gearStruts, false);
    this._bindInputs();
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine) && typeof BABYLON.SceneLoader !== 'undefined') {
      this.readyPromise = this._loadGlbAircraft(this.variant);
    }
  }

  setVariant(variant) {
    if (!variant || variant === this.variant) return;
    this.variant = variant;
    const baseSpec = AIRCRAFT_SPECS[variant] || AIRCRAFT_SPECS.cargo;
    const u = this._upgrades || { armor: 0, engine: 0, guns: 0 };
    const engMult = Math.pow(1.14, u.engine || 0);
    const gunCdMult = Math.pow(0.82, u.guns || 0);
    const gunSpdMult = Math.pow(1.12, u.guns || 0);
    this.spec = {
      ...baseSpec,
      maxSpeed: baseSpec.maxSpeed * engMult,
      boostSpeed: baseSpec.boostSpeed * engMult,
      accel: baseSpec.accel * Math.pow(1.15, u.engine || 0),
      gunCd: Math.max(0.06, baseSpec.gunCd * gunCdMult),
      gunSpeed: baseSpec.gunSpeed * gunSpdMult,
    };
    this.maxHull = Math.round(baseSpec.maxHull * Math.pow(1.25, u.armor || 0));
    this.hull = Math.min(this.hull, this.maxHull);
    if (this.glbRoot) {
      this.glbRoot.dispose(false, false);
      this.glbRoot = null;
    }
    if (this._glbMaterials) {
      for (const mat of this._glbMaterials) {
        if (mat && !mat.isDisposed) mat.dispose(false, true);
      }
      this._glbMaterials = null;
    }
    this.propellers = [];
    this.gearStruts = [];
    this.aircraftLightSockets = null;
    this._groundGearBottom = null;
    this._deployedGearPoints = [];
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine) && typeof BABYLON.SceneLoader !== 'undefined') {
      this.readyPromise = this._loadGlbAircraft(this.variant);
    }
  }

  async _loadGlbAircraft(variant = 'cargo') {
    const fileMap = {
      cargo: 'scrapyard_plane.glb',
      fighter: 'scrapyard_fighter.glb',
      bomber: 'scrapyard_bomber.glb',
      attacker: 'scrapyard_attacker.glb',
    };
    const file = fileMap[variant] || fileMap.cargo;
    const loadId = this.assetLoadId = (this.assetLoadId || 0) + 1;
    try {
      const res = await BABYLON.SceneLoader.ImportMeshAsync('', './assets/aircraft/', file, this.scene);
      if (this.scene.isDisposed || loadId !== this.assetLoadId) {res.meshes.forEach(m => m.dispose());return;}
      const glbRoot = new BABYLON.TransformNode(`acGlbRoot_${variant}`, this.scene);
      glbRoot.parent = this.group;
      glbRoot.position.set(0, -0.72, 0);
      // Source GLBs already face -Z (propellers z=-3.82, tail gear z=+4.15).
      glbRoot.rotationQuaternion = BABYLON.Quaternion.Identity();

      const tunedMaterials = new Set();
      for (const m of res.meshes) {
        if (m.name === '__root__') {
          m.parent = glbRoot;
        }
        m.isPickable = true;
        m.receiveShadows = true;
        if (m.material && !tunedMaterials.has(m.material)) {
          configureImportedAircraftMaterial(m.material, this.scene.getEngine(), variant);
          tunedMaterials.add(m.material);
        }
        m.alwaysSelectAsActiveMesh = true;
      }
      this._glbMaterials = tunedMaterials;

      // Hide procedural fallback meshes & disable fallback point light
      if (this.visual) {
        for (const m of this.visual.getChildMeshes()) {
          if (!m.name.startsWith('acRocketFlame') && m.name !== 'acContactShadow') {
            m.isVisible = false;
            m.setEnabled(false);
          }
        }
        const fallbackFill = this.scene.getLightByName('acLocalFill');
        if (fallbackFill) fallbackFill.setEnabled(false);
      }
      if (this.throttle <= 0.01) {
        for (const f of this.rocketFlames) f.scaling.y = 0.01;
      }

      // Hook up GLB animated propellers & gear nodes
      const glbProps = [];
      const glbGears = [];
      for (const n of [...res.transformNodes, ...res.meshes]) {
        if (n.name.startsWith('propeller_')) {
          glbProps.push(n);
        } else if (n.name.startsWith('gear_')) {
          glbGears.push(n);
        }
      }
      if (glbProps.length) {
        this.propellers = glbProps;
        this.propellerNode = glbProps[0];
        // Attach subtle translucent propeller motion-blur discs for high-RPM realism
        if (this.propBlurDiscs) {
          for (const d of this.propBlurDiscs) d.dispose(false, false);
        }
        this.propBlurDiscs = [];
        if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
          if (!this._propBlurMat || this._propBlurMat.isDisposed) {
            const pTex = new BABYLON.DynamicTexture('acPropBlurTex', { width: 128, height: 128 }, this.scene, false);
            const ctx = pTex.getContext();
            ctx.clearRect(0, 0, 128, 128);
            const radGrad = ctx.createRadialGradient(64, 64, 10, 64, 64, 62);
            radGrad.addColorStop(0.0, 'rgba(30,26,22,0.0)');
            radGrad.addColorStop(0.22, 'rgba(36,32,28,0.42)');
            radGrad.addColorStop(0.84, 'rgba(42,38,34,0.28)');
            radGrad.addColorStop(0.93, 'rgba(235,205,130,0.48)');
            radGrad.addColorStop(1.0, 'rgba(235,205,130,0.0)');
            ctx.fillStyle = radGrad;
            ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2); ctx.fill();
            // Subtle 3-blade motion streaks
            for (let b = 0; b < 3; b++) {
              ctx.save();
              ctx.translate(64, 64);
              ctx.rotate((b * Math.PI * 2) / 3);
              ctx.fillStyle = 'rgba(20,18,16,0.22)';
              ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 58, -0.26, 0.26); ctx.closePath(); ctx.fill();
              ctx.restore();
            }
            pTex.update();
            pTex.hasAlpha = true;
            const bm = new BABYLON.StandardMaterial('acPropBlurMat', this.scene);
            bm.diffuseTexture = pTex;
            bm.diffuseTexture.hasAlpha = true;
            bm.useAlphaFromDiffuseTexture = true;
            bm.emissiveColor = c3('#302a24');
            bm.specularColor = new BABYLON.Color3(0, 0, 0);
            bm.disableLighting = true;
            bm.backFaceCulling = false;
            bm.depthWrite = false;
            bm.alpha = 0.0;
            this._propBlurMat = bm;
          }
          const discRadius = variant === 'fighter' ? 1.15 : (variant === 'bomber' ? 1.35 : 1.25);
          glbProps.forEach((prop, idx) => {
            const disc = BABYLON.MeshBuilder.CreateDisc(`acPropBlurDisc_${variant}_${idx}`, { radius: discRadius, tessellation: 24 }, this.scene);
            disc.parent = prop;
            disc.position.set(0, 0, -0.04);
            disc.material = this._propBlurMat;
            disc.isPickable = false;
            disc.checkCollisions = false;
            disc.alwaysSelectAsActiveMesh = true;
            this.propBlurDiscs.push(disc);
          });
        }
      }
      if (glbGears.length) {
        this.gearStruts = glbGears;
        this._rememberLandingGear(glbGears, true);
      }
      this.glbRoot = glbRoot;
      this.aircraftLightSockets = deriveAircraftLightSockets(res.meshes, glbRoot, variant);
      this._setupGlbWeaponAndTrailSockets(glbRoot, variant, glbProps);
      this._setupGlbControlSurfaceRig(res.meshes, variant);
      if (this._upgrades) this.applyVisualUpgrades(this._upgrades);
      this._setLandingGear(Boolean(this.dockedAsteroid || this.dockedPlanet), true);
      if (this.contactShadow) {
        this.contactShadow.isVisible = Boolean(this.dockedAsteroid || this.dockedPlanet);
      }
      if (this.dockedAsteroid) this._applyDockPose();
    } catch (err) {
      console.warn('GLB aircraft load failed, keeping procedural fallback:', err);
    }
  }

  /**
   * Real seamless vertex-hinge mechanization directly on the authored GLB `airframe` mesh:
   * hinges the actual trailing-edge airfoil vertices of left/right ailerons, inboard flaps,
   * horizontal tailplane elevator, and vertical fin rudder around their exact geometric hinge lines,
   * plus subtle aerodynamic wing flex under high-G maneuvers. Zero external boxes or seams!
   */
  _setupGlbControlSurfaceRig(resMeshes, variant) {
    this._ctrlRig = null;
    const airframe = resMeshes.find(m => /airframe/i.test(m.name) && m.getTotalVertices?.() > 0);
    if (!airframe) return;
    const rawPos = airframe.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    if (!rawPos || rawPos.length < 9) return;

    const basePos = new Float32Array(rawPos);
    const livePos = new Float32Array(rawPos);
    airframe.setVerticesData(BABYLON.VertexBuffer.PositionKind, livePos, true);

    const cfg = {
      cargo:    { wingYMin: 2.38, wingYMax: 3.12, wingYMid: 2.78, flapXMin: 1.45, flapXMax: 3.65, flapHZ: -0.78, ailXMin: 3.70, ailXMax: 6.75, ailHZ: -0.88, htXMin: 0.32, htYMin: 1.65, htYMax: 2.28, htYMid: 1.96, htHZ: 4.30, vtXMax: 0.26, vtYMin: 2.22, vtHZ: 4.42 },
      fighter:  { wingYMin: 1.32, wingYMax: 1.92, wingYMid: 1.64, flapXMin: 1.25, flapXMax: 2.85, flapHZ: -0.92, ailXMin: 2.90, ailXMax: 5.05, ailHZ: -1.06, htXMin: 0.28, htYMin: 1.68, htYMax: 2.18, htYMid: 1.92, htHZ: 2.94, vtXMax: 0.24, vtYMin: 2.10, vtHZ: 2.98 },
      attacker: { wingYMin: 1.28, wingYMax: 1.92, wingYMid: 1.60, flapXMin: 1.35, flapXMax: 3.10, flapHZ: -0.96, ailXMin: 3.15, ailXMax: 5.55, ailHZ: -1.10, htXMin: 0.30, htYMin: 1.72, htYMax: 2.22, htYMid: 1.96, htHZ: 3.38, vtXMax: 0.24, vtYMin: 2.10, vtHZ: 3.30 },
      bomber:   { wingYMin: 2.52, wingYMax: 3.32, wingYMid: 2.92, flapXMin: 1.45, flapXMax: 4.85, flapHZ: -1.05, ailXMin: 4.90, ailXMax: 8.05, ailHZ: -1.15, htXMin: 0.34, htYMin: 2.38, htYMax: 2.98, htYMid: 2.69, htHZ: 4.72, vtXMax: 0.28, vtYMin: 2.15, vtHZ: 5.42 },
    }[variant] || { wingYMin: 2.38, wingYMax: 3.12, wingYMid: 2.78, flapXMin: 1.45, flapXMax: 3.65, flapHZ: -0.78, ailXMin: 3.70, ailXMax: 6.75, ailHZ: -0.88, htXMin: 0.32, htYMin: 1.65, htYMax: 2.28, htYMid: 1.96, htHZ: 4.30, vtXMax: 0.26, vtYMin: 2.22, vtHZ: 4.42 };

    const ailL = [], ailR = [], flapL = [], flapR = [], elev = [], rud = [], flex = [];
    for (let i = 0; i < basePos.length; i += 3) {
      const x = basePos[i], y = basePos[i + 1], z = basePos[i + 2];
      const ax = Math.abs(x);
      if (z < 1.6 && y >= cfg.wingYMin && y <= cfg.wingYMax) {
        if (ax >= cfg.ailXMin && ax <= cfg.ailXMax && z > cfg.ailHZ) {
          (x < 0 ? ailL : ailR).push(i);
        } else if (ax >= cfg.flapXMin && ax <= cfg.flapXMax && z > cfg.flapHZ) {
          (x < 0 ? flapL : flapR).push(i);
        }
        if (ax > 2.2) flex.push(i);
      } else if (z > cfg.htHZ && ax >= cfg.htXMin && y >= cfg.htYMin && y <= cfg.htYMax) {
        elev.push(i);
      } else if (z > cfg.vtHZ && ax <= cfg.vtXMax && y >= cfg.vtYMin) {
        rud.push(i);
      }
    }

    this._ctrlRig = {
      mesh: airframe,
      basePos,
      livePos,
      cfg,
      ailL, ailR, flapL, flapR, elev, rud, flex,
      state: { ail: 0, flap: 0, elev: 0, rud: 0, flex: 0 },
      lastApplied: { ail: 0, flap: 0, elev: 0, rud: 0, flex: 0 },
    };
  }

  _updateGlbControlSurfaceRig(dt, ailTarget, flapTarget, elevTarget, rudTarget, gForce = 1.0) {
    const rig = this._ctrlRig;
    if (!rig || !rig.mesh || rig.mesh.isDisposed()) return;
    const s = rig.state;
    const smoothFast = 1 - Math.exp(-14 * dt);
    const smoothFlap = 1 - Math.exp(-5.5 * dt);
    s.ail  += (ailTarget - s.ail) * smoothFast;
    s.flap += (flapTarget - s.flap) * smoothFlap;
    s.elev += (elevTarget - s.elev) * smoothFast;
    s.rud  += (rudTarget - s.rud) * smoothFast;
    const flexTarget = clamp((gForce - 1.0) * 0.032, -0.04, 0.14);
    s.flex += (flexTarget - s.flex) * smoothFast;

    const la = rig.lastApplied;
    if (
      Math.abs(s.ail - la.ail) < 0.002 &&
      Math.abs(s.flap - la.flap) < 0.002 &&
      Math.abs(s.elev - la.elev) < 0.002 &&
      Math.abs(s.rud - la.rud) < 0.002 &&
      Math.abs(s.flex - la.flex) < 0.002
    ) return;
    la.ail = s.ail; la.flap = s.flap; la.elev = s.elev; la.rud = s.rud; la.flex = s.flex;

    const { basePos, livePos, cfg } = rig;

    // Reset flex vertices to rest before applying subtle wing bending
    for (let k = 0; k < rig.flex.length; k++) {
      const i = rig.flex[k];
      const ax = Math.abs(basePos[i]);
      const t = clamp((ax - 2.2) / 4.5, 0, 1.3);
      livePos[i]     = basePos[i];
      livePos[i + 1] = basePos[i + 1] + s.flex * t * t;
      livePos[i + 2] = basePos[i + 2];
    }

    const rotateYZ = (list, hy, hz, angle, withFlex = false) => {
      const c = Math.cos(angle), sn = Math.sin(angle);
      for (let k = 0; k < list.length; k++) {
        const i = list[k];
        const y0 = basePos[i + 1], z0 = basePos[i + 2];
        const dy = y0 - hy, dz = z0 - hz;
        let flexY = 0;
        if (withFlex) {
          const t = clamp((Math.abs(basePos[i]) - 2.2) / 4.5, 0, 1.3);
          flexY = s.flex * t * t;
        }
        livePos[i + 1] = hy + dy * c - dz * sn + flexY;
        livePos[i + 2] = hz + dy * sn + dz * c;
      }
    };

    rotateYZ(rig.ailL,  cfg.wingYMid, cfg.ailHZ,   s.ail, true);
    rotateYZ(rig.ailR,  cfg.wingYMid, cfg.ailHZ,  -s.ail, true);
    rotateYZ(rig.flapL, cfg.wingYMid, cfg.flapHZ,  s.flap, true);
    rotateYZ(rig.flapR, cfg.wingYMid, cfg.flapHZ,  s.flap, true);
    rotateYZ(rig.elev,  cfg.htYMid,   cfg.htHZ,    s.elev, false);

    // Rudder rotates around vertical axis (x = 0, z = cfg.vtHZ)
    const cr = Math.cos(s.rud), sr = Math.sin(s.rud);
    for (let k = 0; k < rig.rud.length; k++) {
      const i = rig.rud[k];
      const x0 = basePos[i], z0 = basePos[i + 2];
      const dz = z0 - cfg.vtHZ;
      livePos[i]     = x0 * cr + dz * sr;
      livePos[i + 2] = cfg.vtHZ - x0 * sr + dz * cr;
    }

    rig.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, livePos, false, false);
  }

  /**
   * Binds invisible muzzle TransformNodes to the authored GLB weapon mounts
   * (e.g. roof dorsal turret on cargo/bomber, wing guns on fighter, chin guns on attacker)
   * and continuous ribbon contrails (zero primitive boxes/cylinders or particle balls!).
   */
  _setupGlbWeaponAndTrailSockets(glbRoot, variant, glbProps = []) {
    this.gunMuzzleNodes = [];
    this.specialMuzzleNodes = [];
    this.muzzleFlashes = [];
    this.glbExhaustFlames = [];
    this.dorsalTurretYaw = null;
    this.dorsalTurretPitch = null;

    const addMuzzleSocket = (name, x, y, z) => {
      const muzzle = new BABYLON.TransformNode(name, this.scene);
      muzzle.parent = glbRoot;
      muzzle.position.set(x, y, z);
      this.gunMuzzleNodes.push(muzzle);
    };

    if (variant === 'cargo') {
      // Authored dorsal roof turret barrels on scrapyard_plane.glb (y ≈ 3.48, z ≈ -2.25 in glbRoot space)
      addMuzzleSocket('acCargoTurretMuzzleL', -0.15, 3.48, -2.28);
      addMuzzleSocket('acCargoTurretMuzzleR',  0.15, 3.48, -2.28);
    } else if (variant === 'bomber') {
      // Authored dorsal roof turret + nose turret barrels on scrapyard_bomber.glb
      addMuzzleSocket('acBomberTurretMuzzleL', -0.16, 3.64, -2.20);
      addMuzzleSocket('acBomberTurretMuzzleR',  0.16, 3.64, -2.20);
      addMuzzleSocket('acBomberNoseMuzzleL',   -0.26, 1.52, -5.85);
      addMuzzleSocket('acBomberNoseMuzzleR',    0.26, 1.52, -5.85);
    } else if (variant === 'fighter') {
      // Authored wing-mounted cannon barrels on scrapyard_fighter.glb
      addMuzzleSocket('acFighterWingMuzzleL', -2.15, 1.56, -3.15);
      addMuzzleSocket('acFighterWingMuzzleR',  2.15, 1.56, -3.15);
    } else if (variant === 'attacker') {
      // Authored heavy chin rotary cannons on scrapyard_attacker.glb
      addMuzzleSocket('acAttackerChinMuzzleL', -0.34, 1.12, -4.75);
      addMuzzleSocket('acAttackerChinMuzzleR',  0.34, 1.12, -4.75);
    }

    const specX = variant === 'bomber' ? 0.52 : (variant === 'cargo' ? 2.48 : 2.35);
    const specY = variant === 'bomber' ? 0.58 : (variant === 'cargo' ? 1.98 : 1.30);
    const specZ = variant === 'bomber' ? -0.65 : -2.25;
    [-1, 1].forEach((side, idx) => {
      const spNode = new BABYLON.TransformNode(`acOrdMuzzle_${variant}_${idx}`, this.scene);
      spNode.parent = glbRoot;
      spNode.position.set(side * specX, specY, specZ);
      this.specialMuzzleNodes.push(spNode);
    });

    // Keep nozzle anchors for damaged engine smoke (smoke.js) and ONLY TWO wingtip nodes for soft vapor contrails (no middle trail, no cloth ribbons!)
    if (this.engineTrails) {
      for (const t of this.engineTrails) t.dispose();
    }
    this.engineTrails = [];
    this.nozzles = [];
    this.wingtipNodes = [];
    const propSources = glbProps.length ? glbProps : [{ position: new BABYLON.Vector3(0, 1.8, -3.6) }];
    propSources.forEach((prop, idx) => {
      const noz = new BABYLON.TransformNode(`acGlbNozzle_${variant}_${idx}`, this.scene);
      noz.parent = glbRoot;
      noz.position.set(prop.position.x, prop.position.y - 0.12, prop.position.z + 1.25);
      this.nozzles.push(noz);
    });
    if (this.aircraftLightSockets) {
      for (const sideKey of ['port', 'starboard']) {
        const sock = this.aircraftLightSockets[sideKey]?.surface;
        if (!sock) continue;
        const tipNode = new BABYLON.TransformNode(`acGlbWingtipNode_${variant}_${sideKey}`, this.scene);
        tipNode.parent = glbRoot;
        tipNode.position.set(sock[0], sock[1], sock[2] + 0.25);
        this.wingtipNodes.push(tipNode);
      }
    }

    // Bright aviation navigation lights (port red, starboard green, tail white, dorsal double-flash strobe & warm nose landing lamp)
    this._glbStrobeBulb = null;
    this._glbLandingBulb = null;
    if (this.aircraftLightSockets) {
      const makeBulb = (name, posArr, hex, diameter = 0.24, intensity = 2.6) => {
        if (!posArr) return null;
        const mat = new BABYLON.StandardMaterial(`${name}GlowMat`, this.scene);
        mat.emissiveColor = c3(hex).scale(intensity);
        mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.disableLighting = true;
        const bulb = BABYLON.MeshBuilder.CreateSphere(`${name}LightBulb`, { diameter, segments: 8 }, this.scene);
        bulb.parent = glbRoot;
        bulb.position.set(posArr[0], posArr[1], posArr[2]);
        bulb.material = mat;
        bulb.isPickable = false;
        bulb.checkCollisions = false;
        bulb.alwaysSelectAsActiveMesh = true;
        return bulb;
      };
      makeBulb(`acGlbNavPort_${variant}`, this.aircraftLightSockets.port?.surface, '#ff3526', 0.24, 2.8);
      makeBulb(`acGlbNavStbd_${variant}`, this.aircraftLightSockets.starboard?.surface, '#28ee72', 0.24, 2.8);
      makeBulb(`acGlbNavTail_${variant}`, this.aircraftLightSockets.tail?.surface, '#fff6df', 0.22, 2.2);
      this._glbStrobeBulb = makeBulb(`acGlbStrobe_${variant}`, this.aircraftLightSockets.beacon?.surface, '#ff4028', 0.26, 3.2);
      const bMin = this.aircraftLightSockets.bounds?.min;
      if (bMin) {
        const noseY = (variant === 'cargo' || variant === 'bomber') ? 1.55 : 1.32;
        this._glbLandingBulb = makeBulb(`acGlbLandingLamp_${variant}`, [0, noseY, bMin[2] - 0.06], '#ffefc2', 0.32, 3.0);
      }
    }
  }

  _buildModel() {
    this.visual = new BABYLON.TransformNode('aircraftVisual', this.scene);
    this.visual.parent = this.group;
    // Large, bulky twin-engine scrapyard dieselpunk expedition aircraft relative to 1.82m hero
    this.visual.scaling.set(1.85, 1.85, 1.85);
    this.visual.position.y = 0.65;

    const bodyTex = createRustedMetalTexture(this.scene, [146, 122, 84]); // weathered ochre-olive steel
    const bodyMat = new BABYLON.PBRMaterial('acBodyMat', this.scene);
    bodyMat.albedoTexture = bodyTex.albedoTex;
    bodyMat.bumpTexture = bodyTex.bumpTex;
    bodyMat.bumpTexture.level = 0.45;
    bodyMat.metallic = 0.30;
    bodyMat.roughness = 0.62;

    const wingTex = createRustedMetalTexture(this.scene, [78, 108, 112]); // chipped slate-teal aviation paint
    const wingMat = new BABYLON.PBRMaterial('acWingMat', this.scene);
    wingMat.albedoTexture = wingTex.albedoTex;
    wingMat.bumpTexture = wingTex.bumpTex;
    wingMat.bumpTexture.level = 0.45;
    wingMat.metallic = 0.28;
    wingMat.roughness = 0.64;

    const rustTex = createRustedMetalTexture(this.scene, [128, 72, 48]); // heavily rusted scrap iron
    const rustPatchMat = new BABYLON.PBRMaterial('acRustPatchMat', this.scene);
    rustPatchMat.albedoTexture = rustTex.albedoTex;
    rustPatchMat.bumpTexture = rustTex.bumpTex;
    rustPatchMat.bumpTexture.level = 0.58;
    rustPatchMat.metallic = 0.22;
    rustPatchMat.roughness = 0.80;

    const hazardTex = createRustedMetalTexture(this.scene, [176, 136, 54]); // salvaged hazard-yellow plate
    const hazardScrapMat = new BABYLON.PBRMaterial('acHazardScrapMat', this.scene);
    hazardScrapMat.albedoTexture = hazardTex.albedoTex;
    hazardScrapMat.bumpTexture = hazardTex.bumpTex;
    hazardScrapMat.bumpTexture.level = 0.50;
    hazardScrapMat.metallic = 0.25;
    hazardScrapMat.roughness = 0.68;

    const sootTex = createRustedMetalTexture(this.scene, [58, 62, 68]); // greasy soot-stained steel
    const sootSteelMat = new BABYLON.PBRMaterial('acSootSteelMat', this.scene);
    sootSteelMat.albedoTexture = sootTex.albedoTex;
    sootSteelMat.bumpTexture = sootTex.bumpTex;
    sootSteelMat.bumpTexture.level = 0.52;
    sootSteelMat.metallic = 0.68;
    sootSteelMat.roughness = 0.56;

    const bareSteelMat = new BABYLON.PBRMaterial('acBareSteelMat', this.scene);
    bareSteelMat.albedoColor = c3('#8e98a2');
    bareSteelMat.metallic = 0.84;
    bareSteelMat.roughness = 0.38;

    const brassMat = new BABYLON.PBRMaterial('acBrassMat', this.scene);
    brassMat.albedoColor = c3('#b88240');
    brassMat.metallic = 0.78;
    brassMat.roughness = 0.42;

    const copperPipeMat = new BABYLON.PBRMaterial('acCopperPipeMat', this.scene);
    copperPipeMat.albedoColor = c3('#9c5e3a');
    copperPipeMat.metallic = 0.76;
    copperPipeMat.roughness = 0.46;

    const darkIronMat = new BABYLON.PBRMaterial('acIronMat', this.scene);
    darkIronMat.albedoColor = c3('#2a2f36');
    darkIronMat.metallic = 0.72;
    darkIronMat.roughness = 0.52;

    const tireMat = new BABYLON.PBRMaterial('acTireMat', this.scene);
    tireMat.albedoColor = c3('#1c2024');
    tireMat.metallic = 0.08;
    tireMat.roughness = 0.86;

    const glassMat = new BABYLON.PBRMaterial('acGlassMat', this.scene);
    glassMat.albedoColor = c3('#8cc4cc');
    glassMat.metallic = 0.25;
    glassMat.roughness = 0.06;
    glassMat.alpha = 0.36;

    // Ground contact shadow decal beneath fuselage/wings
    const csTex = createContactShadowTexture(this.scene);
    const csMat = new BABYLON.StandardMaterial('acContactShadowMat', this.scene);
    csMat.diffuseTexture = csTex;
    csMat.diffuseTexture.hasAlpha = true;
    csMat.useAlphaFromDiffuseTexture = true;
    csMat.disableLighting = true;
    csMat.depthWrite = false;
    const contactShadow = BABYLON.MeshBuilder.CreateGround('acContactShadow', { width: 4.8, height: 4.4 }, this.scene);
    contactShadow.position.set(0, -0.68, 0.1);
    contactShadow.material = csMat;
    contactShadow.isPickable = false;
    contactShadow.parent = this.visual;
    this.contactShadow = contactShadow;

    const instMat = new BABYLON.StandardMaterial('acInstMat', this.scene);
    instMat.emissiveColor = c3('#ffb854');

    const flameMat = new BABYLON.StandardMaterial('acRocketFlameMat', this.scene);
    flameMat.emissiveColor = c3('#ffaf58');
    flameMat.disableLighting = true;
    flameMat.alpha = 0.38;
    flameMat.alphaMode = BABYLON.Engine.ALPHA_ADD;

    // Subtle local deck-bounce fill (space mode only; in Sky World extra moving PointLights trigger PBR shader recompiles!)
    if (!this.scene.metadata?.skyLighting) {
      const localRim = new BABYLON.PointLight('acLocalFill', new BABYLON.Vector3(0, 2.2, -0.8), this.scene);
      localRim.diffuse = c3('#9ab8d4');
      localRim.intensity = 0.55;
      localRim.range = 8.5;
      localRim.parent = this.visual;
    }

    // 1. Chunky Scrapyard Cargo Fuselage (nose -Z to tail +Z)
    const stations = [
      [-2.15, 0.28, 0.24, -0.06], // blunt radiator nose cap
      [-1.75, 0.48, 0.44, 0.04],  // forward nose & spotlight cowling
      [-1.15, 0.56, 0.56, 0.12],  // stepped cockpit forward
      [-0.35, 0.58, 0.58, 0.14],  // main cargo cabin & side hatch
      [0.65,  0.50, 0.50, 0.14],  // aft cargo bay
      [1.55,  0.32, 0.34, 0.16],  // tapered tail boom
      [2.25,  0.14, 0.18, 0.18],  // tail cone
      [2.45,  0.06, 0.08, 0.18],  // tip
    ];
    const fusePaths = stations.map(([z, rx, ry, cy]) => {
      const ring = [];
      for (let a = 0; a <= 12; a++) {
        const ang = (a / 12) * Math.PI * 2;
        ring.push(new BABYLON.Vector3(Math.cos(ang) * rx, cy + Math.sin(ang) * ry, z));
      }
      return ring;
    });
    const fuselage = BABYLON.MeshBuilder.CreateRibbon(
      'acFuselage',
      { pathArray: fusePaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      this.scene
    );
    fuselage.material = bodyMat;
    fuselage.receiveShadows = true;
    fuselage.parent = this.visual;

    // Mismatched chipped slate-blue nose cowling + bolted scrap hull plates & steel straps
    const noseCowling = BABYLON.MeshBuilder.CreateCylinder('acNoseCowling', { diameterTop: 0.46, diameterBottom: 0.88, height: 0.56, tessellation: 14 }, this.scene);
    noseCowling.rotation.x = Math.PI / 2;
    noseCowling.position.set(0, 0.01, -1.86);
    noseCowling.material = wingMat;
    noseCowling.parent = this.visual;

    const fusePatches = [
      { pos: [-0.46, 0.24, -1.35], size: [0.16, 0.32, 0.56], rot: [0.06, -0.18, 0.22], mat: rustPatchMat },
      { pos: [0.48, 0.18, -1.25],  size: [0.14, 0.28, 0.62], rot: [-0.04, 0.16, -0.18], mat: hazardScrapMat },
      { pos: [0.54, 0.12, 0.15],   size: [0.10, 0.42, 0.78], rot: [0.02, -0.05, 0.08], mat: rustPatchMat },
      { pos: [-0.48, 0.28, 0.55],  size: [0.12, 0.30, 0.64], rot: [0.05, 0.10, -0.12], mat: sootSteelMat },
      { pos: [0.0, 0.64, 0.20],    size: [0.56, 0.08, 0.85], rot: [0.03, 0.02, 0.0], mat: rustPatchMat },
      { pos: [0.0, -0.34, -0.65],  size: [0.68, 0.10, 1.15], rot: [0.0, 0.0, 0.0], mat: sootSteelMat },
    ];
    fusePatches.forEach((p, idx) => {
      const patch = BABYLON.MeshBuilder.CreateBox(`acFusePatch_${idx}`, { width: p.size[0], height: p.size[1], depth: p.size[2] }, this.scene);
      patch.position.set(p.pos[0], p.pos[1], p.pos[2]);
      patch.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
      patch.material = p.mat;
      patch.parent = this.visual;
    });

    // Heavy riveted circumferential fuselage straps
    [-1.55, -0.78, 0.08, 0.88].forEach((sz, idx) => {
      const rScale = idx === 0 ? 0.92 : idx === 3 ? 0.78 : 1.18;
      const strap = BABYLON.MeshBuilder.CreateTorus(`acFuseStrap_${idx}`, { diameter: rScale, thickness: 0.045, tessellation: 18 }, this.scene);
      strap.rotation.x = Math.PI / 2;
      strap.position.set(0, idx === 0 ? 0.04 : 0.14, sz);
      strap.material = idx % 2 === 0 ? sootSteelMat : rustPatchMat;
      strap.parent = this.visual;
    });

    // Slatted front radiator grille
    const radBox = BABYLON.MeshBuilder.CreateBox('acRadFrame', { width: 0.42, height: 0.28, depth: 0.12 }, this.scene);
    radBox.position.set(0, -0.10, -2.14);
    radBox.material = sootSteelMat;
    radBox.parent = this.visual;
    for (let s = -2; s <= 2; s++) {
      const slat = BABYLON.MeshBuilder.CreateBox(`acRadSlat_${s}`, { width: 0.36, height: 0.022, depth: 0.14 }, this.scene);
      slat.position.set(0, -0.10 + s * 0.046, -2.15);
      slat.material = darkIronMat;
      slat.parent = this.visual;
    }

    // Recessed warm spotlight / headlight canister on nose
    const headPod = BABYLON.MeshBuilder.CreateCylinder('acHeadlightPod', { diameter: 0.26, height: 0.34, tessellation: 14 }, this.scene);
    headPod.rotation.x = Math.PI / 2;
    headPod.position.set(0.32, -0.14, -1.96);
    headPod.material = sootSteelMat;
    headPod.parent = this.visual;
    const headLensMat = new BABYLON.StandardMaterial('acHeadLensMat', this.scene);
    headLensMat.emissiveColor = c3('#ffd078');
    headLensMat.diffuseColor = c3('#ffe4a8');
    const headLens = BABYLON.MeshBuilder.CreateDisc('acHeadlightLens', { radius: 0.105, tessellation: 14 }, this.scene);
    headLens.position.set(0.32, -0.14, -2.135);
    headLens.rotation.y = Math.PI;
    headLens.material = headLensMat;
    headLens.parent = this.visual;

    // External welded fuel canisters & storage boxes strapped along lower flanks
    [-1, 1].forEach((side, idx) => {
      const tank = BABYLON.MeshBuilder.CreateCylinder(`acScrapTank_${idx}`, { diameter: 0.24, height: 0.88, tessellation: 12 }, this.scene);
      tank.rotation.x = Math.PI / 2;
      tank.position.set(side * 0.56, -0.18, -0.15 + idx * 0.22);
      tank.material = idx === 0 ? rustPatchMat : hazardScrapMat;
      tank.parent = this.visual;

      [-0.26, 0.26].forEach((dz, bIdx) => {
        const band = BABYLON.MeshBuilder.CreateTorus(`acTankBand_${idx}_${bIdx}`, { diameter: 0.26, thickness: 0.028, tessellation: 12 }, this.scene);
        band.rotation.x = Math.PI / 2;
        band.position.set(side * 0.56, -0.18, -0.15 + idx * 0.22 + dz);
        band.material = darkIronMat;
        band.parent = this.visual;
      });

      const pipe = BABYLON.MeshBuilder.CreateCylinder(`acSidePipe_${idx}`, { diameter: 0.045, height: 1.35, tessellation: 8 }, this.scene);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(side * 0.50, -0.02, -0.55);
      pipe.material = copperPipeMat;
      pipe.parent = this.visual;
    });

    // Side boarding hatch frame on port side
    const hatchFrame = BABYLON.MeshBuilder.CreateBox('acHatchFrame', { width: 0.08, height: 0.62, depth: 0.44 }, this.scene);
    hatchFrame.position.set(-0.56, 0.04, -0.45);
    hatchFrame.material = sootSteelMat;
    hatchFrame.parent = this.visual;
    const hatchInterior = BABYLON.MeshBuilder.CreateBox('acHatchVoid', { width: 0.09, height: 0.52, depth: 0.34 }, this.scene);
    hatchInterior.position.set(-0.565, 0.04, -0.45);
    hatchInterior.material = darkIronMat;
    hatchInterior.parent = this.visual;

    // 2. Stepped Multi-Pane Greenhouse Cockpit + Roll-Cage Bars + Roof Vents
    const cockpitGlass = BABYLON.MeshBuilder.CreateBox('acCanopy', { width: 0.78, height: 0.34, depth: 0.88 }, this.scene);
    cockpitGlass.position.set(0, 0.52, -0.96);
    cockpitGlass.rotation.x = 0.14;
    cockpitGlass.material = glassMat;
    cockpitGlass.parent = this.visual;

    const cockpitRoof = BABYLON.MeshBuilder.CreateBox('acCockpitRoof', { width: 0.84, height: 0.10, depth: 0.78 }, this.scene);
    cockpitRoof.position.set(0, 0.68, -0.82);
    cockpitRoof.material = bodyMat;
    cockpitRoof.parent = this.visual;

    // Heavy window mullions & roll-cage bars
    [-0.38, -0.13, 0.13, 0.38].forEach((mx, idx) => {
      const mullion = BABYLON.MeshBuilder.CreateBox(`acMullion_${idx}`, { width: 0.045, height: 0.38, depth: 0.045 }, this.scene);
      mullion.position.set(mx, 0.52, -1.36);
      mullion.rotation.x = -0.32;
      mullion.material = darkIronMat;
      mullion.parent = this.visual;
    });
    [-1.22, -0.94, -0.64].forEach((az, idx) => {
      const arch = BABYLON.MeshBuilder.CreateBox(`acCanopyArch_${idx}`, { width: 0.84, height: 0.05, depth: 0.05 }, this.scene);
      arch.position.set(0, 0.66, az);
      arch.material = darkIronMat;
      arch.parent = this.visual;
    });
    [-0.18, 0.18].forEach((vx, idx) => {
      const roofVent = BABYLON.MeshBuilder.CreateCylinder(`acRoofVent_${idx}`, { diameter: 0.14, height: 0.36, tessellation: 10 }, this.scene);
      roofVent.rotation.x = Math.PI / 2;
      roofVent.position.set(vx, 0.75, -0.78);
      roofVent.material = idx === 0 ? rustPatchMat : sootSteelMat;
      roofVent.parent = this.visual;
    });

    const dash = BABYLON.MeshBuilder.CreateBox('acDash', { width: 0.52, height: 0.18, depth: 0.12 }, this.scene);
    dash.position.set(0, 0.45, -1.24);
    dash.material = darkIronMat;
    dash.parent = this.visual;
    [-0.12, 0.12].forEach((dx, idx) => {
      const dial = BABYLON.MeshBuilder.CreateDisc(`acDial_${idx}`, { radius: 0.052, tessellation: 12 }, this.scene);
      dial.position.set(dx, 0.47, -1.17);
      dial.material = instMat;
      dial.parent = this.visual;
    });

    // 3. High-Mounted Thick Patchwork Wings + Twin Wing-Mounted Radial Engines & Propellers
    this.propellers = [];
    [-1, 1].forEach((side, idx) => {
      const wingStations = [
        [side * 0.42, 0.46, -1.10, -1.10 + 1.38, 0.11],
        [side * 1.58, 0.48, -0.96, -0.96 + 1.16, 0.085],
        [side * 2.82, 0.50, -0.70, -0.70 + 0.76, 0.052],
      ];
      const wPaths = wingStations.map(([x, y, zLe, zTe, halfT]) => {
        const chord = zTe - zLe;
        return [
          new BABYLON.Vector3(x, y, zLe),
          new BABYLON.Vector3(x, y + halfT * 1.15, zLe + chord * 0.32),
          new BABYLON.Vector3(x, y + halfT * 0.6, zTe),
          new BABYLON.Vector3(x, y - halfT * 0.55, zLe + chord * 0.38),
          new BABYLON.Vector3(x, y, zLe),
        ];
      });
      const wing = BABYLON.MeshBuilder.CreateRibbon(
        `acWing_${idx}`,
        { pathArray: wPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
        this.scene
      );
      wing.material = wingMat;
      wing.receiveShadows = true;
      wing.parent = this.visual;

      // Rusty riveted rib straps wrapped across the wing chord
      [0.82, 1.52, 2.22].forEach((rx, rIdx) => {
        const rib = BABYLON.MeshBuilder.CreateBox(`acWingRib_${idx}_${rIdx}`, { width: 0.075, height: 0.16 - rIdx * 0.03, depth: 1.18 - rIdx * 0.20 }, this.scene);
        rib.position.set(side * rx, 0.48, -0.38 + rIdx * 0.05);
        rib.material = rIdx === 1 ? rustPatchMat : sootSteelMat;
        rib.parent = this.visual;
      });

      // Bolted scrap repair patches on top of wings
      const wPatch = BABYLON.MeshBuilder.CreateBox(`acWingPatch_${idx}`, { width: 0.52, height: 0.035, depth: 0.44 }, this.scene);
      wPatch.position.set(side * 1.92, 0.545, -0.30);
      wPatch.rotation.y = side * 0.14;
      wPatch.material = side < 0 ? hazardScrapMat : rustPatchMat;
      wPatch.parent = this.visual;

      // Brushed/scarred steel leading-edge cuff
      const leStrip = BABYLON.MeshBuilder.CreateCylinder(`acWingLE_${idx}`, { diameter: 0.11, height: 2.40, tessellation: 8 }, this.scene);
      leStrip.rotation.z = Math.PI / 2;
      leStrip.rotation.y = side * -0.16;
      leStrip.position.set(side * 1.62, 0.48, -0.90);
      leStrip.material = bareSteelMat;
      leStrip.parent = this.visual;

      // Heavy under-wing diagonal struts & hanging cable loop
      const brace = BABYLON.MeshBuilder.CreateCylinder(`acWingStrut_${idx}`, { diameter: 0.07, height: 1.24, tessellation: 8 }, this.scene);
      brace.position.set(side * 1.02, 0.08, -0.35);
      brace.rotation.z = side * 0.94;
      brace.material = darkIronMat;
      brace.parent = this.visual;

      const cableLoop = BABYLON.MeshBuilder.CreateTorus(`acWingLoop_${idx}`, { diameter: 0.18, thickness: 0.022, tessellation: 12 }, this.scene);
      cableLoop.rotation.y = Math.PI / 2;
      cableLoop.position.set(side * 1.88, 0.40, -0.35);
      cableLoop.material = darkIronMat;
      cableLoop.parent = this.visual;

      // Twin Wing-Mounted Big Radial Engine Nacelles + 3-Blade Propellers
      const nacX = side * 1.08;
      const nacY = 0.36;
      const nacZ = -1.02;
      const nacelle = BABYLON.MeshBuilder.CreateCylinder(`acNacelle_${idx}`, { diameterTop: 0.56, diameterBottom: 0.64, height: 1.08, tessellation: 14 }, this.scene);
      nacelle.rotation.x = Math.PI / 2;
      nacelle.position.set(nacX, nacY, nacZ);
      nacelle.material = bodyMat;
      nacelle.parent = this.visual;

      const cowlRing = BABYLON.MeshBuilder.CreateTorus(`acCowlRing_${idx}`, { diameter: 0.62, thickness: 0.12, tessellation: 16 }, this.scene);
      cowlRing.rotation.x = Math.PI / 2;
      cowlRing.position.set(nacX, nacY, nacZ - 0.50);
      cowlRing.material = sootSteelMat;
      cowlRing.parent = this.visual;

      const scoop = BABYLON.MeshBuilder.CreateBox(`acNacScoop_${idx}`, { width: 0.22, height: 0.14, depth: 0.55 }, this.scene);
      scoop.position.set(nacX, nacY + 0.30, nacZ - 0.10);
      scoop.material = rustPatchMat;
      scoop.parent = this.visual;

      for (let c = 0; c < 7; c++) {
        const ang = (c / 7) * Math.PI * 2;
        const cyl = BABYLON.MeshBuilder.CreateCylinder(`acCyl_${idx}_${c}`, { diameter: 0.11, height: 0.26, tessellation: 8 }, this.scene);
        cyl.position.set(nacX + Math.cos(ang) * 0.20, nacY + Math.sin(ang) * 0.20, nacZ - 0.48);
        cyl.rotation.z = ang - Math.PI / 2;
        cyl.material = bareSteelMat;
        cyl.parent = this.visual;
      }

      // Chunky asymmetrical exhaust stack on nacelle
      const exPipe = BABYLON.MeshBuilder.CreateCylinder(`acExhaust_${idx}`, { diameter: 0.095, height: 0.85, tessellation: 10 }, this.scene);
      exPipe.rotation.x = Math.PI / 2;
      exPipe.rotation.y = side * 0.10;
      exPipe.position.set(nacX + side * 0.28, nacY - 0.16, nacZ + 0.15);
      exPipe.material = copperPipeMat;
      exPipe.parent = this.visual;

      const propNode = new BABYLON.TransformNode(`acPropeller_${idx}`, this.scene);
      propNode.position.set(nacX, nacY, nacZ - 0.64);
      propNode.parent = this.visual;
      this.propellers.push(propNode);
      if (idx === 0) this.propellerNode = propNode;

      const spinner = BABYLON.MeshBuilder.CreateCylinder(`acSpinner_${idx}`, { diameterTop: 0.05, diameterBottom: 0.26, height: 0.32, tessellation: 12 }, this.scene);
      spinner.rotation.x = -Math.PI / 2;
      spinner.position.z = -0.10;
      spinner.material = brassMat;
      spinner.parent = propNode;

      for (let b = 0; b < 3; b++) {
        const bladePivot = new BABYLON.TransformNode(`propBladePiv_${idx}_${b}`, this.scene);
        bladePivot.rotation.z = (b * Math.PI * 2) / 3 + idx * 0.4;
        bladePivot.parent = propNode;

        const blade = BABYLON.MeshBuilder.CreateBox(`propBlade_${idx}_${b}`, { width: 0.12, height: 0.72, depth: 0.025 }, this.scene);
        blade.position.y = 0.40;
        blade.rotation.y = 0.28;
        blade.material = darkIronMat;
        blade.parent = bladePivot;

        const tip = BABYLON.MeshBuilder.CreateBox(`propBladeTip_${idx}_${b}`, { width: 0.115, height: 0.14, depth: 0.028 }, this.scene);
        tip.position.y = 0.72;
        tip.rotation.y = 0.28;
        tip.material = hazardScrapMat;
        tip.parent = bladePivot;
      }

      // Asymmetric wingtip salvage fairing / pod
      const tipPod = BABYLON.MeshBuilder.CreateCylinder(`acTipPod_${idx}`, { diameterTop: 0.12, diameterBottom: 0.18, height: 0.76, tessellation: 10 }, this.scene);
      tipPod.rotation.x = Math.PI / 2;
      tipPod.position.set(side * 2.84, 0.50, -0.34);
      tipPod.material = idx === 0 ? rustPatchMat : sootSteelMat;
      tipPod.parent = this.visual;

      // Animated Aileron (mismatched scrap colors)
      const ail = BABYLON.MeshBuilder.CreateBox(`acAileron_${idx}`, { width: 0.96, height: 0.045, depth: 0.20 }, this.scene);
      ail.position.set(side * 2.02, 0.49, 0.14);
      ail.rotation.y = side * 0.12;
      ail.material = side < 0 ? hazardScrapMat : rustPatchMat;
      ail.parent = this.visual;
      if (side < 0) this.aileronL = ail;
      else this.aileronR = ail;

      // Wingtip Nav Light
      const navMat = new BABYLON.StandardMaterial(`acNavMat_${idx}`, this.scene);
      navMat.emissiveColor = c3(side < 0 ? '#d84a42' : '#42b88a');
      const nav = BABYLON.MeshBuilder.CreateSphere(`acNav_${idx}`, { diameter: 0.09, segments: 8 }, this.scene);
      nav.position.set(side * 2.88, 0.56, -0.58);
      nav.material = navMat;
      nav.parent = this.visual;

      // Vacuum RCS Thruster Nozzle
      const rcs = BABYLON.MeshBuilder.CreateCylinder(`acRcs_${idx}`, { diameterTop: 0.07, diameterBottom: 0.13, height: 0.24, tessellation: 8 }, this.scene);
      rcs.position.set(side * 2.84, 0.50, 0.05);
      rcs.rotation.x = Math.PI / 2;
      rcs.material = darkIronMat;
      rcs.parent = this.visual;
    });

    // 4. Tall Scrapyard Tailplane + Antenna Wires
    const hStabPaths = [
      [new BABYLON.Vector3(-0.98, 0.24, 2.02), new BABYLON.Vector3(-0.98, 0.27, 2.18), new BABYLON.Vector3(-0.98, 0.24, 2.34), new BABYLON.Vector3(-0.98, 0.22, 2.18), new BABYLON.Vector3(-0.98, 0.24, 2.02)],
      [new BABYLON.Vector3(0, 0.24, 1.82), new BABYLON.Vector3(0, 0.28, 2.08), new BABYLON.Vector3(0, 0.24, 2.34), new BABYLON.Vector3(0, 0.21, 2.08), new BABYLON.Vector3(0, 0.24, 1.82)],
      [new BABYLON.Vector3(0.98, 0.24, 2.02), new BABYLON.Vector3(0.98, 0.27, 2.18), new BABYLON.Vector3(0.98, 0.24, 2.34), new BABYLON.Vector3(0.98, 0.22, 2.18), new BABYLON.Vector3(0.98, 0.24, 2.02)],
    ];
    const hStab = BABYLON.MeshBuilder.CreateRibbon('acHStab', { pathArray: hStabPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this.scene);
    hStab.material = wingMat;
    hStab.parent = this.visual;

    this.elevator = BABYLON.MeshBuilder.CreateBox('acElevator', { width: 1.72, height: 0.04, depth: 0.18 }, this.scene);
    this.elevator.position.set(0, 0.24, 2.40);
    this.elevator.material = rustPatchMat;
    this.elevator.parent = this.visual;

    const vFinPaths = [
      [new BABYLON.Vector3(0, 0.24, 1.56), new BABYLON.Vector3(0.05, 0.24, 1.94), new BABYLON.Vector3(0, 0.24, 2.30), new BABYLON.Vector3(-0.05, 0.24, 1.94), new BABYLON.Vector3(0, 0.24, 1.56)],
      [new BABYLON.Vector3(0, 1.18, 1.98), new BABYLON.Vector3(0.03, 1.18, 2.16), new BABYLON.Vector3(0, 1.18, 2.34), new BABYLON.Vector3(-0.03, 1.18, 2.16), new BABYLON.Vector3(0, 1.18, 1.98)],
    ];
    const vFin = BABYLON.MeshBuilder.CreateRibbon('acVFin', { pathArray: vFinPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this.scene);
    vFin.material = bodyMat;
    vFin.parent = this.visual;

    this.rudder = BABYLON.MeshBuilder.CreateBox('acRudder', { width: 0.05, height: 0.86, depth: 0.22 }, this.scene);
    this.rudder.position.set(0, 0.70, 2.40);
    this.rudder.material = hazardScrapMat;
    this.rudder.parent = this.visual;

    // Antenna wire from cockpit roof to tall tail fin
    const wire = BABYLON.MeshBuilder.CreateCylinder('acAntennaWire', { diameter: 0.015, height: 2.86, tessellation: 6 }, this.scene);
    wire.position.set(0, 0.94, 0.65);
    wire.rotation.x = Math.PI / 2 - 0.16;
    wire.material = darkIronMat;
    wire.parent = this.visual;

    // 5. Twin Recessed Rocket Thrusters + Translucent Exhaust Plumes
    [-0.32, 0.32].forEach((rx, idx) => {
      const shroud = BABYLON.MeshBuilder.CreateCylinder(`acRocketShroud_${idx}`, { diameter: 0.28, height: 0.46, tessellation: 12 }, this.scene);
      shroud.rotation.x = Math.PI / 2;
      shroud.position.set(rx, -0.04, 1.62);
      shroud.material = idx === 0 ? rustPatchMat : sootSteelMat;
      shroud.parent = this.visual;

      const bell = BABYLON.MeshBuilder.CreateCylinder(`acRocketBell_${idx}`, { diameterTop: 0.18, diameterBottom: 0.30, height: 0.36, tessellation: 12 }, this.scene);
      bell.rotation.x = Math.PI / 2;
      bell.position.set(rx, -0.04, 1.88);
      bell.material = darkIronMat;
      bell.parent = this.visual;

      const flame = BABYLON.MeshBuilder.CreateCylinder(`acRocketFlame_${idx}`, { diameterTop: 0.16, diameterBottom: 0.05, height: 0.72, tessellation: 12 }, this.scene);
      flame.rotation.x = Math.PI / 2;
      flame.position.set(rx, -0.04, 2.34);
      flame.material = flameMat;
      flame.parent = this.visual;
      this.rocketFlames.push(flame);

      const nozzle = new BABYLON.TransformNode(`acNozzle_${idx}`, this.scene);
      nozzle.position.set(rx, -0.04, 2.44);
      nozzle.parent = this.visual;
      if (!this.nozzles) this.nozzles = [];
      this.nozzles.push(nozzle);
    });

    // 6. Heavy-Duty 3-Point Landing Gear + Retractable Boarding Ladder
    // Wheel bottoms sit at local y = -0.74 so (-0.74 * 1.85 + 0.65 = -0.719) rests flush on ground
    const gearSpecs = [
      [0,     -0.65,  1.88, 0.18, 0.14], // dual-style tailwheel
      [-0.88, -0.52, -0.45, 0.44, 0.22], // massive left main tire
      [0.88,  -0.52, -0.45, 0.44, 0.22], // massive right main tire
    ];
    gearSpecs.forEach(([gx, wheelY, gz, wDiam, wWidth], idx) => {
      const strut = new BABYLON.TransformNode(`acGearStrut_${idx}`, this.scene);
      strut.position.set(gx, wheelY + 0.34, gz);
      strut.parent = this.visual;

      const leg = BABYLON.MeshBuilder.CreateCylinder(`acLeg_${idx}`, { diameter: idx === 0 ? 0.05 : 0.09, height: idx === 0 ? 0.34 : 0.46, tessellation: 8 }, this.scene);
      leg.position.y = idx === 0 ? -0.17 : -0.18;
      leg.material = darkIronMat;
      leg.parent = strut;

      if (idx > 0) {
        const brace = BABYLON.MeshBuilder.CreateCylinder(`acGearBrace_${idx}`, { diameter: 0.06, height: 0.56, tessellation: 8 }, this.scene);
        brace.position.set(gx < 0 ? 0.18 : -0.18, -0.12, 0.06);
        brace.rotation.z = gx < 0 ? 0.65 : -0.65;
        brace.material = rustPatchMat;
        brace.parent = strut;
      }

      const wheel = BABYLON.MeshBuilder.CreateCylinder(`acWheel_${idx}`, { diameter: wDiam, height: wWidth, tessellation: 16 }, this.scene);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.y = -0.34;
      wheel.material = tireMat;
      wheel.parent = strut;

      const hub = BABYLON.MeshBuilder.CreateCylinder(`acHub_${idx}`, { diameter: wDiam * 0.50, height: wWidth + 0.03, tessellation: 10 }, this.scene);
      hub.rotation.z = Math.PI / 2;
      hub.material = brassMat;
      hub.parent = wheel;

      this.gearStruts.push(strut);
      this.wheels.push(wheel);
    });

    // Boarding ladder attached to port main gear strut (retracts automatically in flight!)
    const ladderNode = new BABYLON.TransformNode('acLadder', this.scene);
    ladderNode.position.set(0.22, -0.18, 0.02);
    ladderNode.rotation.z = 0.32;
    ladderNode.parent = this.gearStruts[1];
    [-0.12, 0.12].forEach((lz, rIdx) => {
      const rail = BABYLON.MeshBuilder.CreateBox(`acLadderRail_${rIdx}`, { width: 0.035, height: 0.72, depth: 0.04 }, this.scene);
      rail.position.set(0, 0.14, lz);
      rail.material = rustPatchMat;
      rail.parent = ladderNode;
    });
    for (let r = 0; r < 4; r++) {
      const rung = BABYLON.MeshBuilder.CreateBox(`acLadderRung_${r}`, { width: 0.035, height: 0.028, depth: 0.24 }, this.scene);
      rung.position.set(0, -0.12 + r * 0.17, 0);
      rung.material = bodyMat;
      rung.parent = ladderNode;
    }

    // 8. Soft Feathered Contrail Ribbons (Gaussian cross-fade opacity texture so they look like vapor, never cloth!)
    const trailMat = new BABYLON.StandardMaterial('acTrailMat', this.scene);
    trailMat.emissiveColor = c3('#eef5ff');
    trailMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    trailMat.specularColor = new BABYLON.Color3(0, 0, 0);
    trailMat.disableLighting = true;
    trailMat.backFaceCulling = false;
    trailMat.depthWrite = false;
    trailMat.alpha = 0.0;
    if (!(this.scene.getEngine() instanceof BABYLON.NullEngine)) {
      const cTex = new BABYLON.DynamicTexture('acContrailVaporTex', { width: 64, height: 64 }, this.scene, false);
      const ctx = cTex.getContext();
      const grad = ctx.createLinearGradient(0, 0, 64, 0);
      grad.addColorStop(0.0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.28, 'rgba(255,255,255,0.45)');
      grad.addColorStop(0.5, 'rgba(255,255,255,1.0)');
      grad.addColorStop(0.72, 'rgba(255,255,255,0.45)');
      grad.addColorStop(1.0, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      // Soft wispy breakup along the vapor stream
      ctx.globalCompositeOperation = 'destination-in';
      const vGrad = ctx.createLinearGradient(0, 0, 0, 64);
      vGrad.addColorStop(0.0, 'rgba(255,255,255,0.85)');
      vGrad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
      vGrad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(0, 0, 64, 64);
      cTex.update();
      cTex.hasAlpha = true;
      trailMat.opacityTexture = cTex;
    }
    this.trailMat = trailMat;
    this.engineTrails = [];
    this.wingtipNodes = [];

    // Soft aerodynamic vapor contrails strictly from the TWO wingtips (zero cloth ribbons, zero middle trail!)
    const ps = new BABYLON.ParticleSystem('acWingtipContrails', 320, this.scene);
    const tex = new BABYLON.DynamicTexture('acWingtipVaporTex', 64, this.scene, false);
    const ctx = tex.getContext();
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(244, 248, 255, 0.42)');
    grad.addColorStop(0.45, 'rgba(222, 232, 244, 0.18)');
    grad.addColorStop(1, 'rgba(200, 214, 230, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.update();
    tex.hasAlpha = true;
    ps.particleTexture = tex;
    ps.emitter = new BABYLON.Vector3(0, 0, 0);
    ps.isLocal = false;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    ps.minLifeTime = 0.55;
    ps.maxLifeTime = 0.95;
    ps.minSize = 0.26;
    ps.maxSize = 0.46;
    ps.addSizeGradient(0.0, 0.24, 0.34);
    ps.addSizeGradient(0.5, 0.52, 0.68);
    ps.addSizeGradient(1.0, 0.95, 1.25);
    ps.minEmitPower = 0.1;
    ps.maxEmitPower = 0.4;
    ps.updateSpeed = 1 / 60;
    let tipToggle = 0;
    ps.startPositionFunction = (_worldMatrix, positionToUpdate) => {
      const tips = this.wingtipNodes && this.wingtipNodes.length >= 2 ? this.wingtipNodes : null;
      if (tips) {
        const tip = tips[tipToggle % 2];
        tipToggle++;
        tip.computeWorldMatrix(true);
        const p = tip.getAbsolutePosition();
        positionToUpdate.set(p.x, p.y, p.z);
      } else {
        const side = (tipToggle++ % 2 === 0) ? -4.8 : 4.8;
        this.group.computeWorldMatrix(true);
        BABYLON.Vector3.TransformCoordinatesToRef(new BABYLON.Vector3(side, 0.2, 0.4), this.group.getWorldMatrix(), positionToUpdate);
      }
    };
    ps.startDirectionFunction = (_worldMatrix, dirToUpdate) => {
      dirToUpdate.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.4);
    };
    ps.color1 = new BABYLON.Color4(0.92, 0.95, 1.0, 0.22);
    ps.color2 = new BABYLON.Color4(0.84, 0.89, 0.96, 0.12);
    ps.colorDead = new BABYLON.Color4(0.80, 0.86, 0.92, 0);
    ps.emitRate = 0;
    ps.start();
    this.exhaustPS = ps;
  }

  _bindInputs() {
    const controller = new AbortController();
    this.scene.onDisposeObservable.addOnce(() => controller.abort());
    const listen = (type, handler) => window.addEventListener(type, handler, {signal:controller.signal});
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    listen('keydown', (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!this.keys[e.code] && this._lastControlMode === 'aircraft') {
        if (e.code === 'KeyV') this._toggleExpertAerobatics = true;
        if (e.code === 'KeyX') this._requestBarrelRoll = true;
        if (e.code === 'KeyT') this._cycleShowSmoke = true;
        if (e.code === 'KeyL') this._toggleLandingGear = true;
        if (e.code === 'KeyH') this._requestFlares = true;
        if (e.code === 'Digit1') this._toggleCockpitView = true;
      }
      this.keys[e.code] = true;
    });
    listen('keyup', (e) => {
      this.keys[e.code] = false;
    });
    listen('blur', () => {
      this.keys = {};
      this.isDragging = false;
    });
    listen('mousedown', (e) => {
      if (e.target.id === 'game-canvas') {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        if (e.button === 0) this.keys['MouseLeft'] = true;
        if (e.button === 2) this.keys['MouseRight'] = true;
      }
    });
    listen('mouseup', (e) => {
      this.isDragging = false;
      if (e.button === 0) this.keys['MouseLeft'] = false;
      if (e.button === 2) this.keys['MouseRight'] = false;
    });
    listen('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.freeYaw -= dx * 0.0045;
        this.freePitch = clamp(this.freePitch + dy * 0.0045, -1.1, 1.1);
      }
    });
  }

  refuel(amount = 100) {
    this.fuel = clamp(this.fuel + amount, 0, this.maxFuel);
  }

  get groundProfile() {
    const profile = AIRCRAFT_GROUND_PROFILES[this.variant] || AIRCRAFT_GROUND_PROFILES.cargo;
    return {...profile, gearBottom:this._groundGearBottom ?? profile.gearBottom};
  }

  getGroundClearance() {return -this.groundProfile.gearBottom;}

  _rememberLandingGear(nodes, imported) {
    for (const node of nodes) {
      this._gearRestInfo.set(node, {
        position: node.position.clone(),
        scaling: node.scaling.clone(),
        rotation: node.rotation ? node.rotation.clone() : new BABYLON.Vector3(),
        rotationQuaternion: node.rotationQuaternion ? node.rotationQuaternion.clone() : null,
        imported,
      });
    }
    this._gearDeployTarget = 1;
    this._gearDeployProgress = 1;
    if (!imported) return;
    this.group.computeWorldMatrix(true);
    const inverse=this.group.getWorldMatrix().clone().invert();let bottom=Infinity;this._deployedGearPoints=[];
    for(const node of nodes){
      const meshes=node.getTotalVertices?.()>0?[node]:node.getChildMeshes();
      for(const mesh of meshes){
        mesh.computeWorldMatrix(true);
        const matrix=mesh.getWorldMatrix().multiply(inverse),positions=mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        for(let i=0;i<positions.length;i+=3){const point=BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(positions,i),matrix);this._deployedGearPoints.push(point);bottom=Math.min(bottom,point.y);}
      }
    }
    if(Number.isFinite(bottom))this._groundGearBottom=bottom;
  }

  _setLandingGear(deployed, immediate = false) {
    this._gearDeployTarget = deployed ? 1 : 0;
    if (immediate || this._gearDeployProgress === undefined) {
      this._gearDeployProgress = this._gearDeployTarget;
      this._applyGearPose(this._gearDeployProgress);
    }
  }

  _applyGearPose(deployProgress) {
    const p = clamp(deployProgress, 0, 1);
    const r = 1 - p; // 0 = deployed, 1 = retracted
    const smoothR = r * r * (3 - 2 * r);
    const gearVisible = p > 0.03;
    for (const node of this.gearStruts) {
      const rest = this._gearRestInfo.get(node);
      if (!rest) continue;
      if (typeof node.setEnabled === 'function') node.setEnabled(gearVisible);
      if (!gearVisible) continue;
      const isTail = /tail/i.test(node.name);
      const isLeft = /_L/i.test(node.name) || rest.position.x < -0.1;
      const sideSign = isLeft ? 1 : -1;

      node.position.copyFrom(rest.position);
      if (rest.imported) {
        if (isTail) {
          // Tuck tailwheel cleanly upward and forward into the tail cone (never floating behind/above it)
          node.position.y += smoothR * 0.44;
          node.position.z -= smoothR * 0.34;
        } else {
          node.position.y += smoothR * 0.96;
          node.position.x *= (1 - smoothR * 0.34);
        }
        const scaleFactor = Math.max(0.06, 1 - smoothR * 0.90);
        node.scaling.copyFrom(rest.scaling).scaleInPlace(scaleFactor);
        const foldQ = isTail
          ? BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, -smoothR * 1.15)
          : BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, sideSign * smoothR * 1.38);
        if (rest.rotationQuaternion) {
          node.rotationQuaternion = rest.rotationQuaternion.multiply(foldQ);
        } else {
          node.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(rest.rotation).multiply(foldQ);
        }
      } else {
        node.position.y += smoothR * 0.24;
        node.scaling.copyFrom(rest.scaling).scaleInPlace(1 - smoothR * 0.65);
      }
    }
  }

  getCollisionCenterOffsetWorld() {
    const bounds=this.aircraftLightSockets?.bounds;
    const local=bounds?new BABYLON.Vector3((bounds.min[0]+bounds.max[0])*.5,Math.max(1.35,(bounds.min[1]+bounds.max[1])*.5+(this.glbRoot?.position.y??-.72)),(bounds.min[2]+bounds.max[2])*.5):new BABYLON.Vector3(0,1.65,0);
    return BABYLON.Vector3.TransformNormal(local,BABYLON.Matrix.FromQuaternionToRef(this.group.rotationQuaternion||BABYLON.Quaternion.Identity(),new BABYLON.Matrix()));
  }

  _applyDockPose() {
    const base=this.dockedAsteroid;if(!base)return;
    const local=this._dockLocal||base.padLocalPos;
    base.group.computeWorldMatrix(true);
    const pitch=this._runwayState?.pitch||0;
    const gearBottom=this._deployedGearPoints.length?Math.min(...this._deployedGearPoints.map(p=>p.y*Math.cos(pitch)-p.z*Math.sin(pitch))):this.groundProfile.gearBottom;
    const height=local.y-gearBottom;
    this.group.position.copyFrom(BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(local.x,height,local.z),base.group.getWorldMatrix()));
    this.group.rotationQuaternion=BABYLON.Quaternion.RotationYawPitchRoll(-Math.PI/2+base.group.rotation.y+(this._runwayState?.yaw||0),this._runwayState?.pitch||0,0);
  }

  dockOnAsteroid(asteroid, options = {}) {
    this.dockedAsteroid=asteroid;this.dockedPlanet=null;this.waterPlanet=null;
    this._runwayState=null;this._takeoffPitchGrace=0;
    const pad=options.localPad||asteroid.padLocalPos;
    this._dockLocal=new BABYLON.Vector3(pad.x,pad.y,pad.z);
    this.velocity.copyFrom(asteroid.velocity);this.throttle=0;this.driveSpeed=0;
    this._setLandingGear(true, true);this._applyDockPose();
  }

  /** Start a real +X runway roll. The local start is a deck point, not an aircraft pivot. */
  positionForTakeoff(asteroid, localStart = {x:8,y:3.38,z:0}) {
    this.dockOnAsteroid(asteroid,{localPad:localStart});
    this._runwayState={base:asteroid,local:this._dockLocal.clone(),yaw:0,pitch:0,requestTakeoff:false};
    this.lastTakeoff=null;this.keys={};this.camInited=false;
    return this.groundProfile;
  }

  _updateRunwayRoll(dt, isPiloted, toastCb) {
    const state=this._runwayState,base=this.dockedAsteroid,profile=this.groundProfile;
    if(!state||!base)return false;
    if(isPiloted){
      if(this.keys.KeyW&&this.fuel>.05){
        this.throttle=clamp(this.throttle+dt*1.4,0,1);
        this.driveSpeed=Math.min(profile.liftoffSpeed+6,this.driveSpeed+profile.groundAccel*(.30+.70*this.throttle)*dt);
        this.fuel=Math.max(0,this.fuel-.20*dt);
      }else if(this.keys.KeyS){this.throttle=Math.max(0,this.throttle-1.5*dt);this.driveSpeed=Math.max(0,this.driveSpeed-14*dt);}
      else{this.throttle=Math.max(0,this.throttle-.18*dt);this.driveSpeed=Math.max(0,this.driveSpeed-1.1*dt);}
      const steering=(this.keys.KeyA?1:0)-(this.keys.KeyD?1:0);
      state.yaw=clamp(state.yaw+steering*.24*dt,-.12,.12);
      if(!steering)state.yaw*=Math.exp(-dt*3);
      // Inside the portal keep the centreline; turning/rolling a wing into the wall is never a takeoff lesson.
      if(state.local.x<profile.noseClearX)state.yaw=0;
      state.local.x=Math.min(52,state.local.x+Math.cos(state.yaw)*this.driveSpeed*dt);
      const lane=Math.max(.45,9.2-profile.wingspan*.5);
      state.local.z=clamp(state.local.z-Math.sin(state.yaw)*this.driveSpeed*dt,-lane,lane);
      const canRotate=state.local.x>=profile.noseClearX&&this.driveSpeed>=profile.rotationSpeed;
      const rotate=canRotate&&(this.keys.ArrowUp||this.keys.Space||state.requestTakeoff||state.local.x>=profile.autoRotateX);
      state.pitch+=( (rotate ? .12 : 0)-state.pitch)*Math.min(1,dt*3.5);
      for(const wheel of this.wheels)wheel.rotation.x-=this.driveSpeed*dt*2.5;
      this._spinPropellers(dt*(8+this.throttle*30));
      this._updateGlbControlSurfaceRig(dt, 0, 0.36, rotate ? 0.34 : 0, steering * 0.38, 1.0);
    }
    this._dockLocal.copyFrom(state.local);this._applyDockPose();
    const matrix=BABYLON.Matrix.FromQuaternionToRef(this.group.rotationQuaternion,new BABYLON.Matrix());
    const forward=BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0,0,-1),matrix).normalize();
    this.velocity.copyFrom(base.velocity).addInPlace(forward.scale(this.driveSpeed));
    this.airspeed=this.driveSpeed;this.atmoDensity=1;
    if(state.local.x>=profile.noseClearX&&this.driveSpeed>=profile.liftoffSpeed&&state.pitch>=.055){
      this.lastTakeoff={variant:this.variant,localX:state.local.x,speed:this.driveSpeed,pitch:state.pitch,gearBottom:profile.gearBottom};
      this.dockedAsteroid=null;this._runwayState=null;this.throttle=Math.max(.65,this.throttle);
      this._takeoffPitchGrace=1.4;
      this._gearRetractY=base.group.position.y+state.local.y+3;
      if(toastCb)toastCb('Взлёт · держите нос чуть выше горизонта',2800);
    }
    if(isPiloted)this._updateChaseCamera(dt,forward,new BABYLON.Vector3(0,1,0),17,5.5);
    return true;
  }

  undockFromAsteroid({force=false} = {}) {
    if(!this.dockedAsteroid)return false;
    if(this._runwayState&&!force){this._runwayState.requestTakeoff=true;return false;}
    this._runwayState=null;
    const matrix=BABYLON.Matrix.FromQuaternionToRef(this.group.rotationQuaternion||BABYLON.Quaternion.Identity(),new BABYLON.Matrix());
    const forward=BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0,0,-1),matrix).normalize();
    this.velocity.copyFrom(this.dockedAsteroid.velocity).addInPlace(forward.scale(15)).addInPlace(new BABYLON.Vector3(0,7.5,0));
    this.throttle=.6;this.dockedAsteroid=null;this._setLandingGear(false);return true;
  }

  dockOnPlanet(planet) {
    this.dockedPlanet = planet;
    this.dockedAsteroid = null;
    this.waterPlanet = null;
    this.driveSpeed = 0;
    this.throttle = 0;
    this._setLandingGear(true);
  }

  undockFromPlanet() {
    if (!this.dockedPlanet) return;
    const up = this.group.position.subtract(this.dockedPlanet.group.position).normalize();
    const q = this.group.rotationQuaternion || BABYLON.Quaternion.Identity();
    const rotMat = BABYLON.Matrix.FromQuaternionToRef(q, new BABYLON.Matrix());
    const fwd = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat).normalize();
    this.velocity.copyFrom(this.dockedPlanet.velocity)
      .addInPlace(fwd.scale(14.0))
      .addInPlace(up.scale(9.0));
    this.throttle = 0.6;
    this.dockedPlanet = null;
    this._setLandingGear(false);
  }

  /**
   * Visually modifies the aircraft airframe to reflect installed workbench upgrades
   * (riveted armor plates, copper turbo exhaust stacks, and extended finned gun barrels).
   */
  applyVisualUpgrades(upgrades = {}) {
    this._upgrades = { armor: upgrades.armor || 0, engine: upgrades.engine || 0, guns: upgrades.guns || 0 };
    if (this._upgradeVisualRoot && !this._upgradeVisualRoot.isDisposed?.()) {
      this._upgradeVisualRoot.dispose();
      this._upgradeVisualRoot = null;
    }
    const { armor, engine, guns } = this._upgrades;
    if (!armor && !engine && !guns) return;
    const host = this.glbRoot || this.group;
    if (!host) return;
    const root = new BABYLON.TransformNode('acVisualUpgradesRoot', this.scene);
    root.parent = host;
    this._upgradeVisualRoot = root;

    if (!this._upgMats || this._upgMats.steel.isDisposed) {
      const steelMat = new BABYLON.PBRMaterial('acUpgSteelMat', this.scene);
      steelMat.albedoColor = c3('#3b3d3a');
      steelMat.metallic = 0.78;
      steelMat.roughness = 0.36;

      const brassMat = new BABYLON.PBRMaterial('acUpgBrassMat', this.scene);
      brassMat.albedoColor = c3('#cf9b4a');
      brassMat.metallic = 0.86;
      brassMat.roughness = 0.28;

      const copperMat = new BABYLON.PBRMaterial('acUpgCopperMat', this.scene);
      copperMat.albedoColor = c3('#c46d3a');
      copperMat.metallic = 0.84;
      copperMat.roughness = 0.32;
      this._upgMats = { steel: steelMat, brass: brassMat, copper: copperMat };
    }
    const { steel: steelMat, brass: brassMat, copper: copperMat } = this._upgMats;

    const prep = (m, mat) => {
      m.parent = root;
      m.material = mat;
      m.isPickable = false;
      m.checkCollisions = false;
      m.alwaysSelectAsActiveMesh = true;
      return m;
    };

    // 1. ARMOR UPGRADE: Riveted fuselage side armor plates + brass rivet strips (+ armored cowl brow at Lv.2)
    if (armor >= 1) {
      for (const sx of [-1, 1]) {
        const plate = prep(BABYLON.MeshBuilder.CreateBox(`upgArmorSide_${sx}`, { width: 0.08, height: 0.42, depth: 1.95 }, this.scene), steelMat);
        plate.position.set(sx * 0.72, 0.38, -0.35);
        plate.rotation.z = sx * -0.14;
        const trim = prep(BABYLON.MeshBuilder.CreateBox(`upgArmorTrim_${sx}`, { width: 0.10, height: 0.06, depth: 1.90 }, this.scene), brassMat);
        trim.position.set(sx * 0.74, 0.56, -0.35);
      }
    }
    if (armor >= 2) {
      const brow = prep(BABYLON.MeshBuilder.CreateBox('upgArmorBrow', { width: 0.92, height: 0.12, depth: 0.65 }, this.scene), steelMat);
      brow.position.set(0, 0.92, -1.55);
      brow.rotation.x = 0.22;
      for (const sx of [-1, 1]) {
        const cowl = prep(BABYLON.MeshBuilder.CreateBox(`upgArmorCowl_${sx}`, { width: 0.10, height: 0.36, depth: 1.25 }, this.scene), steelMat);
        cowl.position.set(sx * 0.66, 0.50, -2.05);
      }
    }

    // 2. ENGINE UPGRADE: Angled copper/brass turbo exhaust stacks & dorsal supercharger intake
    if (engine >= 1) {
      const intake = prep(BABYLON.MeshBuilder.CreateCylinder('upgTurboIntake', { diameterTop: 0.28, diameterBottom: 0.36, height: 1.05, tessellation: 10 }, this.scene), brassMat);
      intake.rotation.x = Math.PI * 0.5;
      intake.position.set(0, 0.74, -2.15);
      for (const sx of [-1, 1]) {
        for (let k = 0; k < 3; k++) {
          const stack = prep(BABYLON.MeshBuilder.CreateCylinder(`upgExhaustStack_${sx}_${k}`, { diameter: 0.09, height: 0.44, tessellation: 8 }, this.scene), copperMat);
          stack.position.set(sx * 0.68, 0.42, -1.85 + k * 0.32);
          stack.rotation.z = sx * -0.72;
          stack.rotation.x = 0.42;
        }
      }
    }
    if (engine >= 2) {
      const cooler = prep(BABYLON.MeshBuilder.CreateBox('upgIntercooler', { width: 0.64, height: 0.28, depth: 0.85 }, this.scene), copperMat);
      cooler.position.set(0, -0.34, -1.85);
      const scoop = prep(BABYLON.MeshBuilder.CreateCylinder('upgTurboScoop', { diameterTop: 0.20, diameterBottom: 0.34, height: 0.45, tessellation: 10 }, this.scene), brassMat);
      scoop.rotation.x = Math.PI * 0.5;
      scoop.position.set(0, 0.82, -2.65);
    }

    // 3. GUNS UPGRADE: Extended cooled barrels & brass muzzle compensators mounted on exact gun muzzle sockets
    if (guns >= 1 && this.gunMuzzleNodes?.length) {
      this.gunMuzzleNodes.forEach((mNode, idx) => {
        const extLen = guns >= 2 ? 0.95 : 0.62;
        const barrel = BABYLON.MeshBuilder.CreateCylinder(`upgGunBarrel_${idx}`, { diameterTop: 0.09, diameterBottom: 0.13, height: extLen, tessellation: 8 }, this.scene);
        barrel.parent = mNode;
        barrel.rotation.x = Math.PI * 0.5;
        barrel.position.set(0, 0, -extLen * 0.35);
        barrel.material = steelMat;
        barrel.isPickable = false;
        barrel.alwaysSelectAsActiveMesh = true;

        const muzzleBrake = BABYLON.MeshBuilder.CreateCylinder(`upgGunBrake_${idx}`, { diameter: guns >= 2 ? 0.16 : 0.13, height: 0.18, tessellation: 8 }, this.scene);
        muzzleBrake.parent = mNode;
        muzzleBrake.rotation.x = Math.PI * 0.5;
        muzzleBrake.position.set(0, 0, -extLen * 0.78);
        muzzleBrake.material = brassMat;
        muzzleBrake.isPickable = false;
        muzzleBrake.alwaysSelectAsActiveMesh = true;

        // Track for cleanup on next upgrade rebuild
        barrel.parent = root;
        barrel.position.copyFrom(mNode.position).addInPlace(new BABYLON.Vector3(0, 0, -extLen * 0.35));
        muzzleBrake.parent = root;
        muzzleBrake.position.copyFrom(mNode.position).addInPlace(new BABYLON.Vector3(0, 0, -extLen * 0.78));
      });
    }
  }

  _spinPropellers(angle) {
    const props = (this.propellers && this.propellers.length)
      ? this.propellers
      : (this.propellerNode ? [this.propellerNode] : []);
    for (const p of props) {
      if (!p) continue;
      if (p.rotationQuaternion) {
        const dq = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, angle);
        p.rotationQuaternion.multiplyInPlace(dq).normalize();
      } else {
        p.rotation.z += angle;
      }
    }
  }

  _rotateLocal(axis, angle) {
    if (Math.abs(angle) < 1e-6) return;
    const dq = BABYLON.Quaternion.RotationAxis(axis, angle);
    this.group.rotationQuaternion = this.group.rotationQuaternion.multiply(dq).normalize();
  }

  /**
   * Smooth atmospheric density [0..1] based on proximity to nearest planet's atmosphere shell.
   */
  computeAtmosphere(world) {
    if (world.isSkyWorld) { this.nearPlanet = null; this.atmoDensity = 1; return 1; }
    let maxDensity = 0;
    let closest = null;
    let closestDist = Infinity;
    for (const p of world.planets) {
      const d = BABYLON.Vector3.Distance(this.group.position, p.group.position);
      if (d < closestDist) {
        closestDist = d;
        closest = p;
      }
      const atmoTop = p.radius + 22.0;
      if (d < atmoTop) {
        const dens = clamp((atmoTop - d) / 18.0, 0, 1);
        if (dens > maxDensity) maxDensity = dens;
      }
    }
    this.nearPlanet = closestDist < (closest ? closest.radius * 2.8 : 0) ? closest : null;
    this.atmoDensity = maxDensity;
    return maxDensity;
  }

  update(dt, world, controlMode, toastCb) {
    this._lastControlMode = controlMode;
    if (controlMode !== 'aircraft' && this._lastCanopyVis) {
      this._lastCanopyVis = false;
      const canopyEl = typeof document !== 'undefined' ? document.getElementById('cockpit-canopy-frame') : null;
      if (canopyEl) canopyEl.style.display = 'none';
    }
    const q = this.group.rotationQuaternion || BABYLON.Quaternion.Identity();
    const rotMat = BABYLON.Matrix.FromQuaternionToRef(q, new BABYLON.Matrix());
    const right = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(1, 0, 0), rotMat).normalize();
    const up = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 1, 0), rotMat).normalize();
    const forward = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat).normalize();

    const isPiloted = controlMode === 'aircraft' || controlMode === 'drive';
    // Smooth mechanical landing-gear folding animation + manual [L] toggle + aviation strobe/landing lights
    if (isPiloted && !this.dockedAsteroid && !this.dockedPlanet && this._toggleLandingGear) {
      this._toggleLandingGear = false;
      const nextDeployed = (this._gearDeployTarget ?? 0) < 0.5;
      this._setLandingGear(nextDeployed, false);
      this.audio?.playDock?.(nextDeployed);
      toastCb?.(nextDeployed ? '🛞 Шасси выпущены (L)' : '🛞 Шасси убраны (L)', 1800);
    }
    if (this._gearDeployProgress !== undefined && this._gearDeployTarget !== undefined) {
      const diff = this._gearDeployTarget - this._gearDeployProgress;
      if (Math.abs(diff) > 0.002) {
        this._gearDeployProgress = clamp(this._gearDeployProgress + Math.sign(diff) * Math.min(Math.abs(diff), dt * 0.78), 0, 1);
        this._applyGearPose(this._gearDeployProgress);
      }
    }
    if (this._glbStrobeBulb) {
      const cycle = (performance.now() * 0.001) % 1.15;
      const flash = (cycle < 0.09) || (cycle > 0.17 && cycle < 0.25);
      this._glbStrobeBulb.isVisible = flash;
    }
    if (this._glbLandingBulb) {
      this._glbLandingBulb.isVisible = (this._gearDeployProgress ?? 1) > 0.25 || this.airspeed < 28;
    }

    if (this.contactShadow) {
      this.contactShadow.isVisible = Boolean(this.dockedAsteroid || this.dockedPlanet);
    }
    if (this._muzzleFlashTimer > 0) {
      this._muzzleFlashTimer = Math.max(0, this._muzzleFlashTimer - dt);
      if (this._muzzleFlashTimer <= 0 && this.muzzleFlashes) {
        for (const fl of this.muzzleFlashes) fl.isVisible = false;
      }
    }

    // 1. Parked on AsteroidBase: move in lockstep with asteroid without jitter
    if (this.dockedAsteroid) {
      if(this._runwayState){this._updateRunwayRoll(dt,isPiloted,toastCb);return;}
      this._applyDockPose();
      this.velocity.copyFrom(this.dockedAsteroid.velocity);
      this.atmoDensity = 0;
      this.airspeed = 0;
      for (const f of this.rocketFlames) f.scaling.y = 0.01;
      if (this.glbExhaustFlames) for (const gf of this.glbExhaustFlames) gf.isVisible = false;
      if (this.exhaustPS) this.exhaustPS.emitRate = 0;
      for (const t of this.engineTrails) t.isVisible = false;
      if (isPiloted) {
        if (this.keys['KeyW']) {
          if (this.fuel <= 0.5) {
            if (toastCb) toastCb('⛽ Нет топлива! Пополните запас на планете', 2000);
          } else {
            this.driveSpeed = clamp(this.driveSpeed + 12 * dt, 0, 12);
            for (const w of this.wheels) w.rotation.x -= this.driveSpeed * dt * 2.5;
            this._spinPropellers(dt * (6 + this.driveSpeed * 2));
            if (this.driveSpeed >= 8.0) {
              const fwdPad = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat).normalize();
              this.undockFromAsteroid();
              this.velocity.addInPlace(fwdPad.scale(10.0)).addInPlace(new BABYLON.Vector3(0, 3.5, 0));
              if (toastCb) toastCb('🛫 Взлёт с разбега!', 2000);
            }
          }
        } else {
          this.driveSpeed *= Math.max(0, 1 - dt * 4);
        }
        this._updateChaseCamera(dt, forward, up, 8.5, 2.8);
      }
      return;
    }

    // 2. Parked / Rolling on Planet Surface
    if (controlMode === 'drive' && this.dockedPlanet) {
      const planet = this.dockedPlanet;
      this.group.position.addInPlace(planet.group.position.subtract(planet.prevPos));
      const pUp = this.group.position.subtract(planet.group.position).normalize();

      if (this.keys['KeyW']) this.driveSpeed = clamp(this.driveSpeed + 18 * dt, -10, 22);
      else if (this.keys['KeyS']) this.driveSpeed = clamp(this.driveSpeed - 18 * dt, -10, 22);
      else this.driveSpeed *= Math.max(0, 1 - dt * 3.5);

      let steer = 0;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) steer += 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) steer -= 1;
      if (Math.abs(steer) > 0 && Math.abs(this.driveSpeed) > 0.2) {
        this.group.rotationQuaternion = BABYLON.Quaternion.RotationAxis(pUp, steer * 1.6 * dt).multiply(this.group.rotationQuaternion).normalize();
      }

      const fwd2 = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), BABYLON.Matrix.FromQuaternionToRef(this.group.rotationQuaternion, new BABYLON.Matrix())).normalize();
      const tangentFwd = fwd2.subtract(pUp.scale(BABYLON.Vector3.Dot(fwd2, pUp))).normalize();
      this.group.position.addInPlace(tangentFwd.scale(this.driveSpeed * dt));

      const dir = this.group.position.subtract(planet.group.position).normalize();
      const groundH = planet.getSurfaceHeight ? Math.max(planet.seaLevel + 0.1, planet.getSurfaceHeight(dir)) : planet.radius;
      this.group.position.copyFrom(planet.group.position).addInPlace(dir.scale(groundH + 0.72));
      this.velocity.copyFrom(planet.velocity).addInPlace(tangentFwd.scale(this.driveSpeed));

      // Align upright to planet surface normal
      const curUp = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 1, 0), BABYLON.Matrix.FromQuaternionToRef(this.group.rotationQuaternion, new BABYLON.Matrix())).normalize();
      const alignQ = new BABYLON.Quaternion();
      BABYLON.Quaternion.FromUnitVectorsToRef(curUp, dir, alignQ);
      this.group.rotationQuaternion = BABYLON.Quaternion.Slerp(
        this.group.rotationQuaternion,
        alignQ.multiply(this.group.rotationQuaternion).normalize(),
        Math.min(1, dt * 10)
      );

      for (const w of this.wheels) w.rotation.x -= this.driveSpeed * dt * 2.5;
      this._spinPropellers(dt * (4 + Math.abs(this.driveSpeed) * 1.5));
      for (const f of this.rocketFlames) f.scaling.y = 0.01;
      if (this.exhaustPS) this.exhaustPS.emitRate = 0;
      for (const t of this.engineTrails) t.isVisible = false;

      if (this.keys['Space'] || this.driveSpeed >= 10.0) {
        if (this.fuel <= 0.5) {
          if (toastCb) toastCb('⛽ Нет топлива для взлёта! Пополните на станции', 2200);
        } else {
          const isRunway = this.driveSpeed >= 10.0 && !this.keys['Space'];
          this.undockFromPlanet();
          if (isRunway) {
            this.velocity.addInPlace(tangentFwd.scale(8.5));
            if (toastCb) toastCb('🛫 Взлёт с разбега!', 2000);
          } else {
            if (toastCb) toastCb('🚀 Вертикальный взлёт (VTOL)!', 2000);
          }
        }
      }
      this._updateChaseCamera(dt, tangentFwd, dir, 8.8, 3.0);
      return;
    }

    // If on foot on planet, keep aircraft parked on planet
    if (this.dockedPlanet && !isPiloted) {
      this.group.position.addInPlace(this.dockedPlanet.group.position.subtract(this.dockedPlanet.prevPos));
      this.velocity.copyFrom(this.dockedPlanet.velocity);
      for (const f of this.rocketFlames) f.scaling.y = 0.01;
      for (const t of this.engineTrails) t.isVisible = false;
      return;
    }

    if(this._gearRetractY!==undefined&&this.group.position.y>=this._gearRetractY){this._setLandingGear(false);this._gearRetractY=undefined;}

    // 3. Dual Flight Physics (Continuous blend via atmospheric density [0..1])
    const dens = this.computeAtmosphere(world);
    const refVel = this.nearPlanet ? this.velocity.subtract(this.nearPlanet.velocity) : this.velocity;
    this.airspeed = refVel.length();

    let pitchIn = 0;
    let yawIn = 0;
    let rollIn = 0;
    let thrusting = false;

    if (isPiloted) {
      const pitchSign = window.__invertPitch ? -1 : 1;
      if (this.keys['ArrowUp']) pitchIn += pitchSign;
      if (this.keys['ArrowDown']) pitchIn -= pitchSign;
      if (this.keys['ArrowLeft'] || this.keys['KeyA']) yawIn += 1;
      if (this.keys['ArrowRight'] || this.keys['KeyD']) yawIn -= 1;
      if (this.keys['KeyQ']) rollIn += 1;
      if (this.keys['KeyR']) rollIn -= 1;

      // Optional Mouse Aim mode ([U] or Settings): cursor off-center steers nose smoothly
      if (window.__mouseAim && !this.dockedAsteroid && !this.dockedPlanet) {
        const mx = window.__mouseNormX || 0;
        const my = window.__mouseNormY || 0;
        const dead = 0.04;
        if (yawIn === 0 && Math.abs(mx) > dead) {
          yawIn = clamp(-Math.sign(mx) * ((Math.abs(mx) - dead) / (1 - dead)) * 1.35, -1, 1);
        }
        if (pitchIn === 0 && Math.abs(my) > dead) {
          pitchIn = clamp(-Math.sign(my) * ((Math.abs(my) - dead) / (1 - dead)) * 1.25 * pitchSign, -1, 1);
        }
      }

      if (this.keys['KeyW']) {
        this.throttle = clamp(this.throttle + dt * 1.2, 0, 1);
        thrusting = true;
      } else if (this.keys['KeyS']) {
        this.throttle = clamp(this.throttle - dt * 1.4, world.isSkyWorld ? 0 : -0.35, 1);
        thrusting = true;
      } else {
        const cruiseFloor = world.isSkyWorld && this.throttle > 0.22 ? 0.38 : 0;
        this.throttle = Math.max(cruiseFloor, this.throttle * Math.exp(-dt * 0.42));
      }
    }

    // Animate seamless vertex-hinge control surfaces on the authored GLB airframe (ailerons, flaps, elevator, rudder + wing flex)
    const bankRollCue = clamp(yawIn * 0.45 + rollIn * 0.90, -1, 1);
    const flapTarget = (this.keys['KeyS'] || this.airspeed < 24 || this.dockedAsteroid || this.dockedPlanet) ? 0.44 : 0.0;
    this._updateGlbControlSurfaceRig(dt, bankRollCue * 0.42, flapTarget, pitchIn * 0.42, yawIn * 0.44, this.gForce || 1.0);
    if (this.aileronL) this.aileronL.rotation.x += (bankRollCue * 0.46 - this.aileronL.rotation.x) * Math.min(1, dt * 14);
    if (this.aileronR) this.aileronR.rotation.x += (-bankRollCue * 0.46 - this.aileronR.rotation.x) * Math.min(1, dt * 14);
    if (this.elevator) this.elevator.rotation.x += (pitchIn * 0.46 - this.elevator.rotation.x) * Math.min(1, dt * 14);
    if (this.rudder) this.rudder.rotation.y += (yawIn * 0.48 - this.rudder.rotation.y) * Math.min(1, dt * 14);
    if (this.dorsalTurretYaw && this.dorsalTurretPitch) {
      let targetTurretYaw = yawIn * 0.32;
      let targetTurretPitch = clamp(pitchIn * 0.22, -0.25, 0.55);
      if (this.aimAssistTarget?.position) {
        const toTgt = this.aimAssistTarget.position.subtract(this.group.position);
        const localX = BABYLON.Vector3.Dot(toTgt, right);
        const localY = BABYLON.Vector3.Dot(toTgt, up);
        const localZ = -BABYLON.Vector3.Dot(toTgt, forward);
        targetTurretYaw = clamp(Math.atan2(localX, Math.max(2, localZ)), -1.35, 1.35);
        targetTurretPitch = clamp(Math.atan2(localY, Math.max(2, Math.hypot(localX, localZ))), -0.22, 0.72);
      }
      this.dorsalTurretYaw.rotation.y += (targetTurretYaw - this.dorsalTurretYaw.rotation.y) * Math.min(1, dt * 10);
      this.dorsalTurretPitch.rotation.x += (targetTurretPitch - this.dorsalTurretPitch.rotation.x) * Math.min(1, dt * 10);
    }
    const airSpdFactor = clamp((this.airspeed || 0) / 55, 0, 1);
    const throttleFactor = clamp(Math.abs(this.throttle || 0), 0, 1);
    const boostFactor = (isPiloted && this.keys['ShiftLeft'] && this.fuel > 0) ? 1.0 : 0.0;
    const targetPropRpm = (5.5 + airSpdFactor * 16.5 + throttleFactor * 10.5 + boostFactor * 10.0) * (0.45 + 0.55 * dens);
    this._propRpm = (this._propRpm ?? targetPropRpm) + (targetPropRpm - (this._propRpm ?? targetPropRpm)) * Math.min(1, dt * 6.0);
    // Cap per-frame step below 3-blade aliasing threshold so firing/frame jitter never alters visual prop speed
    this._spinPropellers(Math.min(0.42, dt * this._propRpm));
    if (this._propBlurMat && !this._propBlurMat.isDisposed) {
      this._propBlurMat.alpha = clamp((this._propRpm - 10) / 30, 0, 1) * 0.42;
    }

    // Aerobatic toggles & pro-flight maneuvers (V = Expert 360°, X = Barrel Roll, C = High-G Cobra Turn, T = Show Smoke)
    if (isPiloted && this._toggleExpertAerobatics) {
      this._toggleExpertAerobatics = false;
      this.expertAerobatics = !this.expertAerobatics;
      toastCb?.(this.expertAerobatics
        ? '✈ Пилотаж PRO (V): автогоризонт отключён · полная свобода 360°'
        : '✈ Пилотаж СТАНДАРТ (V): автогоризонт включён', 2600);
    }
    if (isPiloted && this._cycleShowSmoke) {
      this._cycleShowSmoke = false;
      this.showSmokeMode = ((this.showSmokeMode || 0) + 1) % 4;
      const labels = ['Выкл', 'Алый', 'Золотой', 'Лазурный'];
      toastCb?.(`💨 Пилотажный дым (T): ${labels[this.showSmokeMode]}`, 1800);
    }
    if (isPiloted && this._requestBarrelRoll) {
      this._requestBarrelRoll = false;
      if ((this._barrelRollTimer || 0) <= 0 && this.airspeed > 14) {
        this._barrelRollTimer = 0.62;
        this._barrelRollDir = (yawIn < 0 || rollIn < 0) ? -1 : 1;
        this.audio?.playManeuverWhoosh?.();
        toastCb?.('🌀 Боевая бочка!', 1400);
      }
    }

    const isHighG = Boolean(isPiloted && this.keys['KeyC'] && this.airspeed > 18 && (Math.abs(pitchIn) > 0.1 || Math.abs(yawIn) > 0.1));
    this.isHighG = isHighG;

    // Arcade + Aerobatic flight rotation: class-tuned pitch/yaw/roll + High-G Cobra + Barrel Roll + 360° loops/inverted
    const spec = this.spec || AIRCRAFT_SPECS.cargo;
    const takeoffAge = 1.4 - Math.max(0, this._takeoffPitchGrace || 0);
    const pitchAuthority = this._takeoffPitchGrace > 0 ? .12 + .88 * Math.pow(clamp(takeoffAge / 1.4, 0, 1), 3) : 1;
    this._takeoffPitchGrace = Math.max(0, (this._takeoffPitchGrace || 0) - dt);

    const highGMult = isHighG ? 1.65 : 1.0;
    const pitchRateNow = pitchIn * spec.pitchRate * pitchAuthority * highGMult;
    const yawRateNow = yawIn * spec.yawRate * (isHighG ? 1.35 : 1.0);
    this._rotateLocal(new BABYLON.Vector3(1, 0, 0), pitchRateNow * dt);
    this._rotateLocal(new BABYLON.Vector3(0, 1, 0), yawRateNow * dt);

    let rollStep = rollIn * spec.rollRate;
    if ((this._barrelRollTimer || 0) > 0) {
      this._barrelRollTimer = Math.max(0, this._barrelRollTimer - dt);
      rollStep = (Math.PI * 2 / 0.62) * (this._barrelRollDir || 1);
    } else if (rollIn === 0 && !this.expertAerobatics && up.y > 0.15 && Math.abs(right.y) < 0.72) {
      const targetRightY = clamp(yawIn * (spec.bankAssist || 0.5), -0.62, 0.62);
      const bankErr = targetRightY - right.y;
      rollStep = clamp(bankErr * (yawIn !== 0 ? 2.4 : 2.6), -spec.rollRate * 0.75, spec.rollRate * 0.75);
    }
    this._rotateLocal(new BABYLON.Vector3(0, 0, 1), rollStep * dt);

    // Live G-Force & Stunt Detection (Loops, Barrel Rolls, Inverted Flight)
    const angSpeed = Math.hypot(pitchRateNow, yawRateNow);
    this.gForce = 1.0 + (angSpeed * this.airspeed) / 9.81;
    if (isHighG && this.gForce > 4.2) {
      this.recoilShake = Math.max(this.recoilShake || 0, 0.045);
    }
    if (isPiloted && world.isSkyWorld && this._takeoffPitchGrace <= 0) {
      this._stuntCd = Math.max(0, (this._stuntCd || 0) - dt);
      if (Math.abs(pitchRateNow) > 0.6) this._loopAccum = (this._loopAccum || 0) + pitchRateNow * dt;
      else this._loopAccum = (this._loopAccum || 0) * Math.exp(-dt * 2.5);
      if (Math.abs(this._loopAccum) >= Math.PI * 1.85 && this._stuntCd <= 0) {
        this._loopAccum = 0; this._stuntCd = 2.5;
        this.audio?.playManeuverWhoosh?.();
        toastCb?.('➰ Мёртвая петля выполнена!', 2000);
      }
      if (up.y < -0.65 && this.airspeed > 22) {
        this._invertedTime = (this._invertedTime || 0) + dt;
        if (this._invertedTime > 2.2 && this._stuntCd <= 0) {
          this._invertedTime = 0; this._stuntCd = 4.0;
          toastCb?.('🙃 Перевёрнутый полёт!', 2000);
        }
      } else {
        this._invertedTime = 0;
      }
    }

    const netForce = new BABYLON.Vector3();
    const hasFuel = this.fuel > 0.05;
    const isBoost = isPiloted && (this.keys['ShiftLeft'] || this.keys['ShiftRight']) && hasFuel;
    const isBrake = isPiloted && this.keys['KeyS'];
    const thrustPower = (isBoost ? spec.accel * 1.55 : spec.accel) * (0.35 + 0.65 * Math.abs(this.throttle));

    if (isPiloted && hasFuel && !(world.isSkyWorld && this.keys['KeyS']) && (thrusting || Math.abs(this.throttle) > 0.08)) {
      const dirSign = this.throttle >= 0 ? 1 : -0.5;
      netForce.addInPlace(forward.scale(thrustPower * dirSign));
      const burnRate = dens < 0.25 ? (isBoost ? 6.5 : 2.8) : (isBoost ? 1.8 : 0.45);
      this.fuel = Math.max(0, this.fuel - burnRate * dt);
    }
    if (isBrake || isHighG) {
      netForce.addInPlace(forward.scale(-spec.brake * (isHighG ? 0.45 : 0.65)));
    }

    // Guided Missile Seeker Lock-On (exclusively for Attacker class with homing rockets)
    this.lockProgress = this.lockProgress || 0;
    if (isPiloted && world.isSkyWorld && this.aimAssistTarget?.position && spec.special === 'rocket_salvo') {
      const toLock = this.aimAssistTarget.position.subtract(this.group.position);
      const lockDist = toLock.length();
      const inCone = lockDist > 12 && lockDist < 460 && BABYLON.Vector3.Dot(forward, toLock.scale(1 / lockDist)) > 0.84;
      if (inCone) {
        this.lockProgress = clamp(this.lockProgress + dt / 0.85, 0, 1);
        this.audio?.playLockTone?.(this.lockProgress >= 0.98);
      } else {
        this.lockProgress = Math.max(0, this.lockProgress - dt * 1.8);
      }
    } else {
      this.lockProgress = 0;
    }

    // Countermeasure Flares ([H] key): pops 4 blazing IR decoy flares to spoof incoming homing missiles
    this.flareCooldown = Math.max(0, (this.flareCooldown || 0) - dt);
    if (isPiloted && this._requestFlares) {
      this._requestFlares = false;
      if (this.flareCooldown <= 0) {
        this._deployFlares(forward, right, up, toastCb);
      } else {
        toastCb?.(`🔥 Ловушки перезаряжаются (${this.flareCooldown.toFixed(1)}с)`, 1200);
      }
    }
    this._updateFlares(dt);

    // Weapons: Space / LMB = primary cannon projectiles; F / RMB = homing rockets or bombs
    this.gunCooldown = Math.max(0, (this.gunCooldown || 0) - dt);
    this.specialCooldown = Math.max(0, (this.specialCooldown || 0) - dt);
    if (isPiloted && (this.keys['Space'] || this.keys['MouseLeft']) && this.gunCooldown <= 0) {
      this._firePrimaryGuns(forward, right, up);
    }
    if (isPiloted && this.specialInputEnabled !== false && (this.keys['KeyF'] || this.keys['MouseRight']) && this.specialCooldown <= 0) {
      this._fireSpecialWeapon(forward, right, up);
    }
    this._updateProjectiles(dt, world);

    // Dynamic afterburner & High-G FOV punch
    if (this.camera && controlMode === 'aircraft') {
      const targetFov = isBoost ? 1.05 : (isHighG ? 0.96 : (isBrake ? 0.80 : 0.88));
      this.camera.fov += (targetFov - this.camera.fov) * (1 - Math.exp(-6 * dt));
    }

    // Atmospheric Aerodynamics (lift, bank-coupling, stall, drag, dive/climb energy) scaled by dens
    if (world.isSkyWorld) {
      // Bank-coupled lift, real dive overspeed energy, steep climb speed bleed, airbrake drag & low-speed stall/sink
      this.liftRatio = clamp((this.airspeed - 5.0) / 13.0, 0, 1);
      this.isStalling = this.airspeed < 13.5;
      const airbrakeDrag = (isPiloted && this.keys['KeyS'] && this.airspeed > 16) ? 0.34 : 0.12;
      netForce.addInPlace(refVel.scale(-airbrakeDrag));
      if (isPiloted && this.airspeed > 6 && this.airspeed < 16.5 && this._takeoffPitchGrace <= 0) {
        // Tactile stall buffet warning before nose drops
        this.recoilShake = Math.max(this.recoilShake || 0, 0.04 * (1 - (this.airspeed - 6) / 10.5));
      }
      if (isPiloted && world.theme === 'storm' && this._takeoffPitchGrace <= 0) {
        const gt = performance.now() * 0.001;
        const gust = Math.sin(gt * 1.3) * Math.cos(gt * 2.7) * 2.4;
        netForce.addInPlace(right.scale(gust));
      }
      if (this._takeoffPitchGrace <= 0) {
        if (forward.y < -0.06) {
          // Diving converts potential energy into airspeed
          netForce.addInPlace(forward.scale(-forward.y * 18.5));
        } else if (forward.y > 0.16 && !isBoost) {
          // Steep climbing bleeds airspeed realistically
          netForce.addInPlace(forward.scale(-forward.y * 13.5));
        }
        // Wing lift drops when banking knife-edge (up.y -> 0) or inverted (up.y < 0)
        const wingLiftUp = clamp(up.y, 0, 1);
        const effectiveLift = this.liftRatio * (0.28 + 0.72 * wingLiftUp);
        if (effectiveLift < 1.0) {
          netForce.y -= (1.0 - effectiveLift) * 16.5;
        }
        if (this.isStalling && forward.y > -0.36) {
          const stallNoseDrop = (1.0 - clamp(this.airspeed / 13.5, 0, 1)) * 0.82 * dt;
          this._rotateLocal(new BABYLON.Vector3(1, 0, 0), -stallNoseDrop);
        }
      }
      if (isPiloted && Math.abs(yawIn) + Math.abs(pitchIn) > 1.2 && this.airspeed > 32) {
        // Subtle aerodynamic buffet during high-G turns
        this.recoilShake = Math.max(this.recoilShake || 0, 0.045);
      }
      // Ground-effect cushion when flaring close above the Vagabond runway (0.5..6m)
      const vagBase = world.vagabondBase || world.asteroidBase;
      if (vagBase && this.airspeed > 14 && this._takeoffPitchGrace <= 0) {
        const bPos = vagBase.group.position;
        const dBaseH = Math.hypot(this.group.position.x - bPos.x, this.group.position.z - bPos.z);
        const hAboveDeck = this.group.position.y - (bPos.y + 3.4);
        if (dBaseH < 64 && hAboveDeck > 0.4 && hAboveDeck < 6.0 && this.velocity.y < 0) {
          const cushion = (1 - hAboveDeck / 6.0) * 6.5;
          netForce.y += cushion;
        }
      }
      // Subtle atmospheric micro-turbulence at high speed
      if (isPiloted && this.airspeed > 26 && this._takeoffPitchGrace <= 0) {
        const tNow = performance.now() * 0.001;
        const turb = Math.sin(tNow * 2.9) * Math.cos(tNow * 4.7) * 0.45 * clamp((this.airspeed - 26) / 50, 0, 1);
        netForce.y += turb;
      }
      // Realistic airframe damage model below 38% hull: smoking engine, mild thrust loss & slight roll drift
      const maxH = this.maxHull || spec.maxHull || 100;
      const isCritDamaged = this.hull > 0 && this.hull < maxH * 0.38 && !this.dockedAsteroid;
      if (isCritDamaged) {
        netForce.addInPlace(forward.scale(-spec.accel * 0.12));
        if (isPiloted && this._takeoffPitchGrace <= 0) {
          this._rotateLocal(new BABYLON.Vector3(0, 0, 1), 0.14 * dt);
        }
      }
      if (this._playerDmgTrail) {
        this._playerDmgTrail.dispose();
        this._playerDmgTrail = null;
      }
    } else if (dens > 0.01 && this.airspeed > 0.2) {
      const vDir = refVel.scale(1 / this.airspeed);
      const aoa = clamp(BABYLON.Vector3.Dot(vDir, up), -0.8, 0.8);
      const stallFactor = this.airspeed < 7.0 ? (this.airspeed / 7.0) : 1.0;
      this.isStalling = this.airspeed < 7.0;

      // Lift perpendicular to airspeed (along aircraft up)
      const liftMag = Math.min(48, this.airspeed * this.airspeed * 0.085 * (0.45 + Math.abs(aoa) * 1.4)) * stallFactor * dens;
      this.liftRatio = clamp(liftMag / 24, 0, 1);
      netForce.addInPlace(up.scale(liftMag));

      // Parasitic + induced air drag
      const dragMag = this.airspeed * this.airspeed * 0.018 * dens;
      netForce.addInPlace(vDir.scale(-dragMag));

      // Gentle sideways keel/fin alignment in atmosphere
      const sideSlip = BABYLON.Vector3.Dot(refVel, right);
      netForce.addInPlace(right.scale(-sideSlip * 2.4 * dens));
    } else {
      this.isStalling = false;
      this.liftRatio = 0;
    }

    // Outer Wilds-style SOI isolation: inside AsteroidBase SOI, ignore external planetary gravity!
    const insideAsteroidSOI = this.nearAsteroid &&
      BABYLON.Vector3.Distance(this.group.position, this.nearAsteroid.group.position) < (this.nearAsteroid.soiRadius || 38);

    // Planetary gravity (feels weighty inside atmosphere, balanced by lift when flying fast!)
    if (!insideAsteroidSOI) {
      for (const p of world.planets) {
        const toP = p.group.position.subtract(this.group.position);
        const d = toP.length();
        const well = p.radius * 2.6;
        if (d < well && d > 1) {
          const gMag = p.gravity * Math.pow(1 - d / well, 1.35);
          netForce.addInPlace(toP.normalize().scale(gMag));
        }
      }
    }

    this.velocity.addInPlace(netForce.scale(dt));
    if (world.isSkyWorld) {
      // Prevent reverse horizontal flight when braking, without zeroing vertical gravity sink
      const fwdHoriz = new BABYLON.Vector3(forward.x, 0, forward.z);
      if (fwdHoriz.lengthSquared() > 1e-4) {
        fwdHoriz.normalize();
        const backHoriz = BABYLON.Vector3.Dot(this.velocity, fwdHoriz);
        if (backHoriz < 0) {
          this.velocity.x -= fwdHoriz.x * backHoriz;
          this.velocity.z -= fwdHoriz.z * backHoriz;
        }
      }
    }

    // Arcade Ace Combat velocity alignment: loosens during High-G Cobra turns so the nose whips around aggressively
    const spdNow = this.velocity.length();
    if (spdNow > 2.5) {
      const desiredVel = forward.scale(spdNow);
      const liftGripFactor = (world.isSkyWorld ? (0.12 + 0.88 * this.liftRatio) : 1.0) * (this.isHighG ? 0.36 : 1.0);
      const grip = 1 - Math.exp(-(spec.turnGrip || 3.8) * (0.45 + 0.55 * dens) * liftGripFactor * dt);
      BABYLON.Vector3.LerpToRef(this.velocity, desiredVel, grip, this.velocity);
      if (this.velocity.lengthSquared() > 1e-4) {
        this.velocity.normalize().scaleInPlace(spdNow);
      }
    }

    // Class-specific speed cap (with dive overspeed allowance when nose is pitched down)
    const diveBonus = (world.isSkyWorld && forward.y < -0.10) ? (-forward.y * spec.maxSpeed * 0.28) : 0;
    const maxV = (isBoost ? spec.boostSpeed : spec.maxSpeed) + diveBonus;
    if (this.velocity.length() > maxV) {
      this.velocity.normalize().scaleInPlace(maxV);
    }

    this.group.position.addInPlace(this.velocity.scale(dt));

    // Engine audio feedback (continuous RPM & airspeed modulation when piloted)
    if (isPiloted && this.audio?.setAircraftEngine) {
      this.audio.setAircraftEngine(this.throttle, this.airspeed, isBoost, false);
    }

    // Continuous ribbon trails behind engines & wingtips (never discrete particle balls!)
    const activeThrust = hasFuel && (thrusting || isBoost || Math.abs(this.throttle) > 0.10);
    const flicker = 0.92 + Math.sin(performance.now() * 0.045) * 0.08;
    const rocketVis = activeThrust ? (1.15 - dens * 0.35) * (isBoost ? 1.65 : 1.05) * flicker : 0.04;
    for (const f of this.rocketFlames) {f.scaling.y = rocketVis;f.isVisible = !world.isSkyWorld;}
    // Drive ONLY TWO soft vapor wingtip contrails (zero middle trail, zero cloth ribbons!)
    if (this.exhaustPS) {
      this._trailWarmup = (this._trailWarmup || 0) + 1;
      const showVapor = this._trailWarmup > 8 && !this.dockedAsteroid && !this.dockedPlanet && (Boolean(this.showSmokeMode) || isBoost || this.isHighG || this.airspeed > 22);
      if (!showVapor) {
        this.exhaustPS.emitRate = 0;
      } else {
        const rate = this.showSmokeMode > 0 ? 150 : (isBoost || this.isHighG ? 135 : Math.round(clamp((this.airspeed - 22) * 3.2, 24, 95)));
        this.exhaustPS.emitRate = rate;
        if (this.showSmokeMode === 1) {
          this.exhaustPS.color1 = new BABYLON.Color4(1.0, 0.38, 0.22, 0.55);
          this.exhaustPS.color2 = new BABYLON.Color4(1.0, 0.52, 0.30, 0.32);
        } else if (this.showSmokeMode === 2) {
          this.exhaustPS.color1 = new BABYLON.Color4(1.0, 0.84, 0.34, 0.55);
          this.exhaustPS.color2 = new BABYLON.Color4(1.0, 0.90, 0.55, 0.32);
        } else if (this.showSmokeMode === 3) {
          this.exhaustPS.color1 = new BABYLON.Color4(0.24, 0.92, 1.0, 0.55);
          this.exhaustPS.color2 = new BABYLON.Color4(0.55, 0.96, 1.0, 0.32);
        } else {
          const a = (isBoost || this.isHighG) ? 0.34 : 0.20;
          this.exhaustPS.color1 = new BABYLON.Color4(0.92, 0.95, 1.0, a);
          this.exhaustPS.color2 = new BABYLON.Color4(0.84, 0.89, 0.96, a * 0.55);
        }
        this.exhaustPS.colorDead = new BABYLON.Color4(0.85, 0.90, 0.95, 0.0);
      }
    }

    // Terrain collision / auto-touchdown on ALL planets (TerrainPlanet + procedural planets)
    for (const p of world.planets) {
      const rel = this.group.position.subtract(p.group.position);
      const dist = rel.length();
      if (dist > p.radius + 8) continue;
      const dir = rel.clone().normalize();
      const groundH = p.getSurfaceHeight ? p.getSurfaceHeight(dir) : p.radius;
      const minH = p.seaLevel ? Math.max(p.seaLevel + 0.25, groundH + 0.72) : groundH + 0.72;
      if (dist < minH) {
        this.group.position.copyFrom(p.group.position).addInPlace(dir.scale(minH));
        const radVel = BABYLON.Vector3.Dot(this.velocity.subtract(p.velocity), dir);
        if (radVel < -2.0 && isPiloted) {
          if (this.fuel < 5 && radVel < -8.0) {
            this.hull = Math.max(0, this.hull - 12);
            if (toastCb) toastCb('💥 Жёсткая посадка без топлива! (-12% корпус)', 2400);
          } else if (toastCb) {
            toastCb('🛞 Посадка на поверхность! [G] Выйти пешком', 2400);
          }
          this.dockOnPlanet(p);
          break;
        } else {
          this.velocity.addInPlace(dir.scale(Math.max(0, -radVel)));
        }
      }
    }

    if (isPiloted) {
      const cls = this.variant;
      const camBack = cls === 'cargo' ? 17.5 : (cls === 'bomber' ? 16.0 : 12.0);
      const camUp = cls === 'cargo' ? 6.2 : (cls === 'bomber' ? 5.6 : 4.0);
      this._updateChaseCamera(dt, forward, up, camBack, camUp);
    }
  }

  _updateChaseCamera(dt, forward, up, backDist, upDist) {
    backDist *= Math.max(1, 1.15 / this.scene.getEngine().getAspectRatio(this.camera));
    backDist += clamp((this.airspeed - 25) * 0.04, 0, 2.2);

    // Smoothly return free-look mouse orbit toward center when not dragging
    if (!this.isDragging) {
      const recenter = Math.exp(-5.0 * dt);
      this.freeYaw *= recenter;
      this.freePitch = 0.14 + (this.freePitch - 0.14) * recenter;
    }

    if (this._toggleCockpitView) {
      this._toggleCockpitView = false;
      this.cockpitView = !this.cockpitView;
      this.camInited = false;
    }
    const showCanopy = Boolean(this.cockpitView && !this.dockedAsteroid && !this.dockedPlanet && this._lastControlMode === 'aircraft');
    if (typeof document !== 'undefined' && this._lastCanopyVis !== showCanopy) {
      this._lastCanopyVis = showCanopy;
      const canopyEl = document.getElementById('cockpit-canopy-frame');
      if (canopyEl) canopyEl.style.display = showCanopy ? 'block' : 'none';
    }
    const right = BABYLON.Vector3.Cross(up, forward).normalize();
    if (this.cockpitView && !this.dockedAsteroid && !this.dockedPlanet) {
      const eyePos = this.group.position.add(forward.scale(1.25)).add(up.scale(1.52));
      const lookTgt = eyePos.add(forward.scale(48));
      this.camera.position.copyFrom(eyePos);
      if (this.recoilShake > 0.001) {
        this.camera.position.addInPlace(new BABYLON.Vector3(
          (Math.random() - 0.5) * this.recoilShake * 0.45,
          (Math.random() - 0.5) * this.recoilShake * 0.45,
          (Math.random() - 0.5) * this.recoilShake * 0.45
        ));
        this.recoilShake *= Math.exp(-12.0 * dt);
      }
      this.camera.upVector.copyFrom(up);
      this.camera.setTarget(lookTgt);
      if (typeof document !== 'undefined') {
        const canopyEl = document.getElementById('cockpit-canopy-frame');
        if (canopyEl && this._lastCanopyVis) {
          const px = clamp(-right.y * 14, -14, 14);
          const py = clamp(forward.y * 10 + (this.recoilShake || 0) * 18, -12, 12);
          canopyEl.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(1.03)`;
        }
      }
      return;
    }
    let camBackDir = forward.scale(-1);
    if (Math.abs(this.freeYaw) > 0.005 || Math.abs(this.freePitch - 0.14) > 0.005) {
      const yawQ = BABYLON.Quaternion.RotationAxis(up, this.freeYaw);
      const pitchQ = BABYLON.Quaternion.RotationAxis(right, clamp(this.freePitch - 0.14, -0.75, 0.75));
      const orbitMat = BABYLON.Matrix.FromQuaternionToRef(yawQ.multiply(pitchQ), new BABYLON.Matrix());
      camBackDir = BABYLON.Vector3.TransformNormal(camBackDir, orbitMat).normalize();
    }

    const desiredCam = this.group.position
      .add(camBackDir.scale(backDist))
      .add(up.scale(upDist));
    const safeCam = resolveCameraCollision(
      this.scene,
      this.group.position.add(up.scale(0.6)),
      desiredCam,
      up,
      (pt) => {
        const p = this.dockedPlanet || this.nearPlanet;
        if (!p || !p.getSurfaceHeight) return null;
        const rel = pt.subtract(p.group.position);
        const dist = rel.length();
        if (dist < 1) return null;
        const unit = rel.scale(1 / dist);
        const minR = p.getSurfaceHeight(unit) + 0.9;
        return dist < minR ? p.group.position.add(unit.scale(minR)) : null;
      },
      3.5
    );
    const desiredTgt = this.group.position.add(forward.scale(6.5)).add(up.scale(2.2));

    if (!this.camInited) {
      this.camPos.copyFrom(safeCam);
      this.camTarget.copyFrom(desiredTgt);
      this.camInited = true;
    } else {
      const s = 1 - Math.exp(-7.5 * dt);
      BABYLON.Vector3.LerpToRef(this.camPos, safeCam, s, this.camPos);
      BABYLON.Vector3.LerpToRef(this.camTarget, desiredTgt, s, this.camTarget);
    }
    this.camera.position.copyFrom(this.camPos);
    if (this.recoilShake > 0.001) {
      this.camera.position.addInPlace(new BABYLON.Vector3(
        (Math.random() - 0.5) * this.recoilShake,
        (Math.random() - 0.5) * this.recoilShake,
        (Math.random() - 0.5) * this.recoilShake
      ));
      this.recoilShake *= Math.exp(-12.0 * dt);
    }
    // Smooth hermite transition for inverted/steep-bank camera roll (no instant snap at up.y === 0.15)
    const invertT = clamp((0.35 - up.y) / 0.50, 0, 1);
    const smoothT = invertT * invertT * (3 - 2 * invertT);
    const camUpBlend = 0.34 + (0.85 - 0.34) * smoothT;
    BABYLON.Vector3.LerpToRef(BABYLON.Axis.Y, up, camUpBlend, this.camera.upVector);
    this.camera.upVector.normalize();
    this.camera.setTarget(this.camTarget);
  }

  _getSharedProjectileMaterial(key, hexColor) {
    this._projMats ||= {};
    if (!this._projMats[key] || this._projMats[key].isDisposed) {
      const mat = new BABYLON.StandardMaterial(`acSharedProjMat_${key}`, this.scene);
      mat.emissiveColor = c3(hexColor);
      mat.disableLighting = true;
      this._projMats[key] = mat;
    }
    return this._projMats[key];
  }

  _deployFlares(forward, right, up, toastCb) {
    this.flareCooldown = 4.2;
    this.flares ||= [];
    this.audio?.playFlarePop?.();
    toastCb?.('✨ Отстрел тепловых ловушек (H)!', 1600);
    const mat = this._getSharedProjectileMaterial('flare', '#fff2b0');
    for (let i = 0; i < 4; i++) {
      const side = (i % 2 === 0 ? -1 : 1);
      const spread = 0.55 + Math.floor(i / 2) * 0.45;
      const pos = this.group.position
        .subtract(forward.scale(2.8 + i * 0.4))
        .add(right.scale(side * 1.1))
        .subtract(up.scale(0.6));
      const ejectVel = this.velocity.scale(0.55)
        .add(right.scale(side * 12 * spread))
        .subtract(up.scale(8 + Math.random() * 4))
        .subtract(forward.scale(10));
      const mesh = BABYLON.MeshBuilder.CreateSphere('acDecoyFlare', { diameter: 0.65, segments: 6 }, this.scene);
      mesh.position.copyFrom(pos);
      mesh.material = mat;
      mesh.isPickable = false;
      let trail = null;
      if (typeof BABYLON.TrailMesh === 'function') {
        mesh.computeWorldMatrix(true);
        trail = new BABYLON.TrailMesh(`acFlareTrail_${Date.now()}_${i}`, mesh, this.scene, 0.22, 18, true);
        trail.material = this._rocketTrailMat || this._getSharedProjectileMaterial('flareTrail', '#ffe5a0');
        trail.isPickable = false;
      }
      this.flares.push({ mesh, trail, vel: ejectVel, life: 2.8, owner: 'player' });
    }
  }

  _updateFlares(dt) {
    if (!this.flares?.length) return;
    for (let i = this.flares.length - 1; i >= 0; i--) {
      const f = this.flares[i];
      f.life -= dt;
      f.vel.scaleInPlace(Math.exp(-dt * 1.4));
      f.vel.y -= 9.5 * dt;
      f.mesh.position.addInPlace(f.vel.scale(dt));
      const pulse = 0.75 + Math.sin(performance.now() * 0.04 + i) * 0.35;
      f.mesh.scaling.setAll(Math.max(0.15, (f.life / 2.8) * pulse));
      if (f.life <= 0) {
        f.trail?.dispose();
        f.mesh.dispose(false, false);
        this.flares.splice(i, 1);
      }
    }
  }

  _firePrimaryGuns(forward, right, up) {
    const spec = this.spec || AIRCRAFT_SPECS.cargo;
    this.gunCooldown = spec.gunCd;
    this.recoilShake = Math.min(0.28, (this.recoilShake || 0) + 0.09);
    this.audio?.playGunshot?.(this.variant);
    const muzzleCount = this.gunMuzzleNodes?.length || 2;
    const barrelsToFire = spec.dualGuns ? [0, Math.min(1, muzzleCount - 1)] : [((this.gunBarrelToggle = ((this.gunBarrelToggle || 0) + 1) % muzzleCount))];

    if (this.muzzleFlashes) {
      this.muzzleFlashes.forEach((fl, idx) => {
        fl.isVisible = barrelsToFire.includes(idx);
        if (fl.isVisible) fl.rotation.y = Math.random() * Math.PI * 2;
      });
      this._muzzleFlashTimer = 0.055;
    }

    for (const barrelIdx of barrelsToFire) {
      const sideSign = (barrelIdx % 2) === 0 ? -1 : 1;
      let spawnPos;
      const activeMuzzle = this.gunMuzzleNodes?.[barrelIdx];
      if (activeMuzzle) {
        activeMuzzle.computeWorldMatrix(true);
        spawnPos = activeMuzzle.getAbsolutePosition().clone();
      } else {
        const lat = this.variant === 'fighter' ? 1.85 : this.variant === 'attacker' ? 0.55 : 0.16;
        const upOff = (this.variant === 'cargo' || this.variant === 'bomber') ? 2.85 : (this.variant === 'attacker' ? 0.40 : 0.85);
        const fwdOff = (this.variant === 'cargo' || this.variant === 'bomber') ? 2.35 : 3.6;
        spawnPos = this.group.position
          .add(forward.scale(fwdOff))
          .add(right.scale(sideSign * lat))
          .add(up.scale(upOff));
      }

      const spreadX = (Math.random() - 0.5) * spec.gunSpread;
      const spreadY = (Math.random() - 0.5) * spec.gunSpread;
      let aim = forward;
      if (this.aimAssistTarget) {
        const lead = leadPoint(spawnPos,this.velocity,this.aimAssistTarget.position,this.aimAssistTarget.velocity,spec.gunSpeed);
        const corrected = lead.subtract(spawnPos).normalize();
        const minDot = (this.variant === 'cargo' || this.variant === 'bomber') ? 0.92 : 0.985;
        if (BABYLON.Vector3.Dot(forward,corrected) > minDot) aim = corrected;
      }
      const dir = aim.add(right.scale(spreadX)).add(up.scale(spreadY)).normalize();
      const vel = this.velocity.add(dir.scale(spec.gunSpeed));

      const bullet = BABYLON.MeshBuilder.CreateCylinder('acProjBullet', { diameter: spec.gunSize, height: 2.6, tessellation: 6 }, this.scene);
      bullet.position.copyFrom(spawnPos);
      bullet.lookAt(spawnPos.add(dir));
      bullet.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
      bullet.isPickable = false;
      bullet.material = this._getSharedProjectileMaterial(`bullet_${this.variant}`, spec.gunColor);

      this.projectiles.push({ mesh: bullet, vel, life: 2.2, kind: 'bullet' });
    }
  }

  _fireSpecialWeapon(forward, right, up) {
    const spec = this.spec || AIRCRAFT_SPECS.cargo;
    // Only Attacker carries rockets; only Bomber carries bombs; Fighter & Cargo have no rockets
    if (spec.special !== 'bomb' && spec.special !== 'rocket_salvo') return;
    this.specialCooldown = spec.specialCd;
    this.recoilShake = Math.min(0.55, (this.recoilShake || 0) + 0.30);
    const isBomb = spec.special === 'bomb';
    this.audio?.playSpecialWeapon?.(isBomb ? 'bomb' : 'rocket');
    const count = spec.special === 'rocket_salvo' ? 2 : 1;
    const lockedTarget = (!isBomb && (this.lockProgress || 0) >= 0.65 && this.aimAssistTarget?.position)
      ? this.aimAssistTarget
      : null;

    if (!isBomb && !this._rocketTrailMat) {
      const rtm = new BABYLON.StandardMaterial('acRocketSmokeTrailMat', this.scene);
      rtm.emissiveColor = c3('#f4ece0');
      rtm.diffuseColor = new BABYLON.Color3(0, 0, 0);
      rtm.disableLighting = true;
      rtm.backFaceCulling = false;
      rtm.depthWrite = false;
      rtm.alpha = 0.58;
      if (this.trailMat?.opacityTexture) rtm.opacityTexture = this.trailMat.opacityTexture;
      this._rocketTrailMat = rtm;
    }

    for (let i = 0; i < count; i++) {
      const slotIdx = count === 2 ? i : ((this.gunBarrelToggle || 0) % 2);
      const side = slotIdx === 0 ? -1 : 1;
      let spawnPos;
      const ordMuzzle = this.specialMuzzleNodes?.[slotIdx];
      if (ordMuzzle) {
        ordMuzzle.computeWorldMatrix(true);
        spawnPos = ordMuzzle.getAbsolutePosition().clone();
      } else {
        spawnPos = this.group.position
          .add(forward.scale(isBomb ? 0.8 : 2.8))
          .add(right.scale(isBomb ? side * 0.6 : side * 2.4))
          .add(up.scale(isBomb ? -0.35 : 0.35));
      }

      const launchDir = (!isBomb && count === 2)
        ? forward.add(right.scale(side * 0.08)).add(up.scale(-0.04)).normalize()
        : forward;

      const vel = isBomb
        ? this.velocity.add(up.scale(-4.5))
        : this.velocity.add(launchDir.scale(115));

      const ord = BABYLON.MeshBuilder.CreateCylinder(
        isBomb ? 'acProjBomb' : 'acProjRocket',
        { diameterTop: isBomb ? 0.38 : 0.22, diameterBottom: isBomb ? 0.52 : 0.34, height: isBomb ? 1.5 : 2.1, tessellation: 8 },
        this.scene
      );
      ord.position.copyFrom(spawnPos);
      ord.lookAt(spawnPos.add(launchDir));
      ord.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
      ord.isPickable = false;
      ord.material = this._getSharedProjectileMaterial(isBomb ? 'bomb' : 'rocket', isBomb ? '#ff6b35' : '#ffbe44');

      let trail = null;
      if (!isBomb) {
        // Bright fiery motor exhaust plume on the rocket tail
        const plume = BABYLON.MeshBuilder.CreateCylinder(`acRocketPlume_${i}`, { diameterTop: 0.34, diameterBottom: 0.02, height: 1.55, tessellation: 6 }, this.scene);
        plume.parent = ord;
        plume.position.set(0, -1.65, 0);
        plume.material = this._getSharedProjectileMaterial('rocketPlume', '#fff0a8');
        plume.isPickable = false;
        if (typeof BABYLON.TrailMesh === 'function') {
          ord.computeWorldMatrix(true);
          trail = new BABYLON.TrailMesh(`acRocketTrail_${Date.now()}_${i}`, ord, this.scene, 0.36, 36, true);
          trail.material = this._rocketTrailMat;
          trail.isPickable = false;
        }
      }

      this.projectiles.push({
        mesh: ord,
        trail,
        vel,
        life: isBomb ? 4.5 : 3.8,
        kind: isBomb ? 'bomb' : 'rocket',
        target: lockedTarget,
      });
    }
  }

  _updateProjectiles(dt, world) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.life -= dt;
      if (pr.kind === 'bomb') {
        pr.vel.y -= 18.0 * dt;
      } else if (pr.kind === 'rocket') {
        const curSpd = Math.max(85, pr.vel.length());
        let dir = pr.vel.lengthSquared() > 0.1 ? pr.vel.scale(1 / curSpd) : new BABYLON.Vector3(0, 0, -1);
        // Active proportional-navigation homing toward locked target
        if (pr.target?.position) {
          const tgtPos = pr.target.position;
          const tgtVel = pr.target.velocity || BABYLON.Vector3.Zero();
          const aimPt = leadPoint(pr.mesh.position, BABYLON.Vector3.Zero(), tgtPos, tgtVel, Math.min(195, curSpd + 35));
          const toAim = aimPt.subtract(pr.mesh.position);
          const distToAim = toAim.length();
          if (distToAim > 1.5) {
            const desiredDir = toAim.scale(1 / distToAim);
            if (BABYLON.Vector3.Dot(dir, desiredDir) > 0.25) {
              const turnBlend = 1 - Math.exp(-4.8 * dt);
              BABYLON.Vector3.LerpToRef(dir, desiredDir, turnBlend, dir);
              dir.normalize();
            }
          }
        }
        const nextSpd = Math.min(195, curSpd + 85.0 * dt);
        pr.vel.copyFrom(dir.scale(nextSpd));
        pr.mesh.lookAt(pr.mesh.position.add(dir));
        pr.mesh.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
      }
      pr.previousPosition = pr.mesh.position.clone();
      pr.mesh.position.addInPlace(pr.vel.scale(dt));

      let hit = false, hitPoint = null;
      if (world.isSkyWorld) {
        const move = pr.mesh.position.subtract(pr.previousPosition);
        const length = move.length();
        if (length>0.001) {
          const ray = new BABYLON.Ray(pr.previousPosition, move.scale(1/length), length);
          const pick=this.scene.pickWithRay(ray,m=>m.checkCollisions&&m.isEnabled()&&(m.isVisible||m.metadata?.collisionProxy));
          hit=Boolean(pick?.hit);if(hit)hitPoint=pick.pickedPoint?.clone()||pr.mesh.position.clone();
        }
      }
      if (world?.planets) {
        for (const p of world.planets) {
          if (BABYLON.Vector3.Distance(pr.mesh.position, p.group.position) <= p.radius + 0.5) {
            hit = true;
            break;
          }
        }
      }
      if(pr.life<=0&&!hit&&pr.kind==='bomb'&&world.isSkyWorld){
        const below=this.scene.pickWithRay(new BABYLON.Ray(pr.mesh.position,new BABYLON.Vector3(0,-1,0),6),m=>m.checkCollisions&&m.isEnabled()&&(m.isVisible||m.metadata?.collisionProxy));
        if(below?.hit){hit=true;hitPoint=below.pickedPoint?.clone()||pr.mesh.position.clone();}
      }
      if (pr.life <= 0 || hit) {
        if(hit)this.onProjectileImpact?.({kind:pr.kind,from:pr.previousPosition.clone(),to:pr.mesh.position.clone(),position:hitPoint||pr.mesh.position.clone(),expired:pr.life<=0});
        pr.trail?.dispose();
        pr.mesh.dispose(false, false);
        this.projectiles.splice(i, 1);
      }
    }
  }
}
