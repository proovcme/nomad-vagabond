import { SeededRNG } from './rng.js?v=mission1';
import { createPlanetTextures, createStarTexture, createSpaceEnvironmentTexture } from './textures.js?v=mission1';
import { TerrainPlanet } from './planet.js?v=mission1';
import { GraphicsManager } from './graphics.js?v=mission1';

export const UPGRADE_CATALOG = [
  {
    id: 'solar_sails',
    name: 'Крылья Солнечного Прилива',
    desc: '+45% тяги от звёздного ветра и потоков эфира.',
    icon: '⛵',
  },
  {
    id: 'gravity_keel',
    name: 'Гравитационный Киль',
    desc: '+65% ускорения от грави-манёвров у планет и мягкая стыковка.',
    icon: '🧲',
  },
  {
    id: 'condenser',
    name: 'Резонансный Конденсатор',
    desc: 'Полёт в потоках эфира заряжает топливо и чинит корпус.',
    icon: '🔋',
  },
  {
    id: 'storm_rigging',
    name: 'Титановый Такелаж',
    desc: '-55% урона от звёздных штормов и столкновений; +масса корпуса.',
    icon: '🛡️',
  },
  {
    id: 'astral_compass',
    name: 'Астральный Компас',
    desc: '+30% манёвренности корабля и увеличенная дальность сканера.',
    icon: '🧭',
  },
  {
    id: 'pulse_thruster',
    name: 'Импульсный Двигатель',
    desc: '+50% мощности маршевых двигателей и рывок на Shift.',
    icon: '⚡',
  },
];

const STAR_TYPES = [
  { name: 'Лазурный Пульсар', color: '#52f2e8', corona: '#1ea3b8', windPower: 22, stormInterval: 46 },
  { name: 'Янтарный Гигант', color: '#ffc652', corona: '#ff7722', windPower: 19, stormInterval: 56 },
  { name: 'Фиалковый Карлик', color: '#c57bff', corona: '#6f2dbd', windPower: 17, stormInterval: 50 },
];

const BIOME_CONFIG = {
  oasis: { label: 'Изумрудный Оазис', atmo: '#38f2d8', mapColor: '#269e7d', grav: 21 },
  world_tree: { label: 'Планета-Древо', atmo: '#76c45a', mapColor: '#4c9c3a', grav: 19 },
  living_ocean: { label: 'Живой Океан', atmo: '#28c4d8', mapColor: '#1b88a6', grav: 22 },
  hollow_core: { label: 'Полая Планета (Внутренний мир)', atmo: '#e08b4f', mapColor: '#b56338', grav: 18 },
  cryo: { label: 'Кристальный Ледник', atmo: '#7ad7ff', mapColor: '#6ec6f5', grav: 17 },
  volcanic: { label: 'Вулканическая Кузня', atmo: '#ff6a33', mapColor: '#d9532f', grav: 26 },
  observatory: { label: 'Латунная Обсерватория', atmo: '#f5c451', mapColor: '#c9973e', grav: 22 },
  desert: { label: 'Янтарные Дюны', atmo: '#ffbf69', mapColor: '#d49446', grav: 23 },
  tidal: { label: 'Атолл Приливов', atmo: '#c57bff', mapColor: '#8d57d1', grav: 22 },
};

const BODY_NAMES = [
  'Айон-VII',
  'Вела-Прим',
  'Тихий Утёс',
  'Хроно-Сфера',
  'Осколок Лиры',
  'Зеркальный Атолл',
  'Станция «Зенит»',
  'Кристальный Пик',
  'Остов «Ориона»',
  'Эфирный Сад',
];

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

export class SolarWorld {
  constructor(scene, seedStr) {
    this.scene = scene;
    this.seedStr = seedStr;
    this.rng = new SeededRNG(seedStr);

    this.starType = this.rng.pick(STAR_TYPES);
    this.planets = [];
    this.obelisks = [];
    this.upgrades = [];
    this.geysers = [];
    this.currents = [];
    this.anomalies = [];
    this.debris = [];
    this.moons = [];
    this.spaceCreatures = [];
    this.planetFlocks = [];
    this.refuelNodes = [];
    this.megastructures = [];

    this.gate = null;
    this.gateUnlocked = false;
    this.simTime = 0;

    this.stormCooldown = this.starType.stormInterval;
    this.stormWarning = 0;
    this.stormActive = false;
    this.stormRadius = 18;
    this.stormMesh = null;

    this._buildLightingAndPostProcess();
    this._buildStarfield();
    this._buildStar();
    this._buildPlanets();
    this._buildEtherCurrents();
    this._buildAnomalies();
    this._buildAsteroidBelt();
    this._buildWildlife();
    this._buildMegastructures();
    this._buildHorizonGate();
    this._buildStormWave();
  }

  _buildLightingAndPostProcess() {
    const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), this.scene);
    hemi.intensity = 0.44;
    hemi.diffuse = c3('#6d99bf');
    hemi.groundColor = c3('#1b2e3d');
    this.hemiLight = hemi;

    const sunLight = new BABYLON.PointLight('sunLight', BABYLON.Vector3.Zero(), this.scene);
    sunLight.diffuse = c3('#ffdfb0');
    sunLight.intensity = 0.65;
    sunLight.range = 3600;
    this.sunPointLight = sunLight;

    // Focused directional sun light + PCF shadow generator that tracks the active ship/planet
    this.sunDirLight = new BABYLON.DirectionalLight('sunDirLight', new BABYLON.Vector3(-1, -0.3, -0.5).normalize(), this.scene);
    this.sunDirLight.diffuse = c3('#ffe4bc');
    this.sunDirLight.intensity = 2.85;
    this.sunDirLight.shadowMinZ = 1;
    this.sunDirLight.shadowMaxZ = 160;
    this.sunDirLight.autoCalcShadowZBounds = false;
    this.sunDirLight.shadowOrthoScale = 0.09;

    const engine = this.scene.getEngine();
    this.shadowGenerator = null;
    if (engine && !(engine instanceof BABYLON.NullEngine)) {
      try {
        const sg = new BABYLON.ShadowGenerator(2048, this.sunDirLight);
        sg.usePercentageCloserFiltering = true;
        sg.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
        sg.bias = 0.0005;
        sg.normalBias = 0.012;
        sg.darkness = 0.22;
        this.shadowGenerator = sg;
      } catch (_) {
        this.shadowGenerator = null;
      }
    }

    this.glowLayer = null;
    this.graphics = new GraphicsManager(this.scene, this.scene.activeCamera);
    this.graphics.applyQuality('high', this.shadowGenerator);
  }

  updateShadowFocus(targetPos) {
    if (!this.sunDirLight || !targetPos) return;
    const toTarget = targetPos.clone();
    if (toTarget.lengthSquared() < 1) return;
    const dir = toTarget.normalize();
    this.sunDirLight.direction.copyFrom(dir);
    this.sunDirLight.position.copyFrom(targetPos).subtractInPlace(dir.scale(65));
  }

  _buildStarfield() {
    // Deep, dark vacuum skybox with a subtle, structured galactic dust band
    BABYLON.Effect.ShadersStore['spaceSkyVertexShader'] = `
      precision highp float;
      attribute vec3 position;
      uniform mat4 worldViewProjection;
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;
    BABYLON.Effect.ShadersStore['spaceSkyFragmentShader'] = `
      precision highp float;
      varying vec3 vDir;
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }
      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p = p * 2.07 + 1.3;
          a *= 0.5;
        }
        return v;
      }
      void main() {
        vec3 d = normalize(vDir);
        vec3 deepSpace = vec3(0.022, 0.036, 0.068);
        vec3 bandBase = vec3(0.055, 0.088, 0.140);
        float tilt = d.y * 2.6 + d.x * 0.40 - d.z * 0.22;
        float band = exp(-pow(tilt, 2.0));
        float n1 = fbm(d * 3.6);
        float n2 = fbm(d * 8.2 + 3.7);
        float rift = smoothstep(0.30, 0.72, n2);
        float dustLane = smoothstep(0.40, 0.84, n1) * band;
        vec3 coolDust = vec3(0.035, 0.082, 0.105) * dustLane * rift;
        vec3 warmCore = vec3(0.070, 0.052, 0.042) * smoothstep(0.56, 0.92, n1) * band * 0.55;
        vec3 col = mix(deepSpace, bandBase, band * 0.58 * (0.55 + 0.45 * rift)) + coolDust + warmCore;
        gl_FragColor = vec4(col, 1.0);
      }
    `;
    const sky = BABYLON.MeshBuilder.CreateSphere(
      'spaceSkybox',
      { diameter: 4400, segments: 24, sideOrientation: BABYLON.Mesh.BACKSIDE },
      this.scene
    );
    const skyMat = new BABYLON.ShaderMaterial(
      'spaceSkyMat',
      this.scene,
      { vertex: 'spaceSky', fragment: 'spaceSky' },
      { attributes: ['position'], uniforms: ['worldViewProjection'] }
    );
    skyMat.backFaceCulling = false;
    sky.material = skyMat;
    sky.isPickable = false;
    sky.infiniteDistance = true;

    // Multi-scale starfield (faint background dust + distinct brighter navigation stars)
    const palette = [c3('#f4f7ff'), c3('#ffe0a8'), c3('#b6dcff'), c3('#ffc8a4')];
    const pcsSmall = new BABYLON.PointsCloudSystem('starsSmall', 1.25, this.scene);
    pcsSmall.addPoints(520, (particle) => {
      const r = this.rng.range(600, 1250);
      const theta = this.rng.range(0, Math.PI * 2);
      const phi = Math.acos(this.rng.range(-1, 1));
      particle.position = new BABYLON.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const c = this.rng.pick(palette);
      particle.color = new BABYLON.Color4(c.r, c.g, c.b, this.rng.range(0.18, 0.56));
    });
    pcsSmall.buildMeshAsync();

    const pcsBright = new BABYLON.PointsCloudSystem('starsBright', 2.4, this.scene);
    pcsBright.addPoints(95, (particle) => {
      const r = this.rng.range(620, 1180);
      const theta = this.rng.range(0, Math.PI * 2);
      const phi = Math.acos(this.rng.range(-1, 1));
      particle.position = new BABYLON.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      const c = this.rng.pick(palette);
      particle.color = new BABYLON.Color4(c.r, c.g, c.b, this.rng.range(0.68, 0.96));
    });
    pcsBright.buildMeshAsync();
  }

  _buildStar() {
    // Soft radial corona shader (zero hard sphere edge!)
    if (!BABYLON.Effect.ShadersStore['starCoronaVertexShader']) {
      BABYLON.Effect.ShadersStore['starCoronaVertexShader'] = `
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
          vWorldNormal = normalize(mat3(world) * normal);
          gl_Position = worldViewProjection * vec4(position, 1.0);
        }
      `;
      BABYLON.Effect.ShadersStore['starCoronaFragmentShader'] = `
        precision highp float;
        uniform vec3 cameraPosition;
        uniform vec3 coronaColor;
        uniform float coronaStrength;
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        void main() {
          vec3 N = normalize(vWorldNormal);
          vec3 V = normalize(cameraPosition - vWorldPos);
          float facing = max(dot(N, V), 0.0);
          float glow = pow(facing, 3.8) * coronaStrength;
          gl_FragColor = vec4(coronaColor, glow);
        }
      `;
    }
    const makeCoronaMat = (name, hex, strength) => {
      const m = new BABYLON.ShaderMaterial(
        name,
        this.scene,
        { vertex: 'starCorona', fragment: 'starCorona' },
        {
          attributes: ['position', 'normal'],
          uniforms: ['world', 'worldViewProjection', 'cameraPosition', 'coronaColor', 'coronaStrength'],
          needAlphaBlending: true,
        }
      );
      m.setColor3('coronaColor', c3(hex));
      m.setFloat('coronaStrength', strength);
      m.alphaMode = BABYLON.Engine.ALPHA_ADD;
      m.backFaceCulling = true;
      m.depthWrite = false;
      return m;
    };

    // Binary Star System: Primary Star + Orbiting Companion Dwarf Star
    this.sun = BABYLON.MeshBuilder.CreateSphere('sun', { diameter: 34, segments: 32 }, this.scene);
    const sunMat = new BABYLON.StandardMaterial('sunMat', this.scene);
    const starTex = createStarTexture(this.scene, this.starType.color, this.rng.range(1, 999));
    sunMat.emissiveTexture = starTex;
    sunMat.disableLighting = true;
    this.sun.material = sunMat;

    this.sunCorona = BABYLON.MeshBuilder.CreateSphere('corona', { diameter: 58, segments: 24 }, this.scene);
    this.sunCorona.material = makeCoronaMat('coronaMat', this.starType.corona, 0.52);
    this.sunCorona.isPickable = false;

    // Companion Binary Star
    const compColor = this.starType.color === '#52f2e8' ? '#ffb85c' : '#7ae8ff';
    this.sunB = BABYLON.MeshBuilder.CreateSphere('sunB', { diameter: 15, segments: 24 }, this.scene);
    const sunBMat = new BABYLON.StandardMaterial('sunBMat', this.scene);
    sunBMat.emissiveTexture = createStarTexture(this.scene, compColor, this.rng.range(1, 999));
    sunBMat.disableLighting = true;
    this.sunB.material = sunBMat;
    this.sunB.position.set(42, 4, 0);

    this.sunBCorona = BABYLON.MeshBuilder.CreateSphere('coronaB', { diameter: 26, segments: 18 }, this.scene);
    this.sunBCorona.material = makeCoronaMat('coronaBMat', compColor, 0.48);
    this.sunBCorona.isPickable = false;
    this.sunBCorona.parent = this.sunB;
  }

  _buildPlanets() {
    const names = this.rng.shuffle(BODY_NAMES);
    const wildPool = this.rng.shuffle(['world_tree', 'living_ocean', 'hollow_core', 'volcanic', 'cryo']);
    const biomes = ['oasis', ...wildPool];

    const shuffledUpgrades = this.rng.shuffle(UPGRADE_CATALOG);
    let upgradeIdx = 0;
    let obeliskCount = 0;

    for (let i = 0; i < 6; i++) {
      // Planet 0 is the detailed Stage-2 TerrainPlanet (continents, forests, ocean waves)
      if (i === 0) {
        const tp = new TerrainPlanet(
          this.scene,
          {
            id: 'living_archipelago',
            name: names[0],
            orbitRadius: 240,
            orbitAngle: 0.35,
            orbitSpeed: 0.006,
            elevationY: 0,
            orbitTilt: 0.04,
          },
          this.rng
        );
        this.planets.push(tp);
        this.terrainPlanet = tp;

        const orbitPts = [];
        for (let s = 0; s <= 64; s++) {
          const a = (s / 64) * Math.PI * 2;
          orbitPts.push(new BABYLON.Vector3(Math.cos(a) * 240, Math.sin(a) * 240 * Math.sin(0.04), Math.sin(a) * 240));
        }
        const orbitLine = BABYLON.MeshBuilder.CreateLines(`orbit_0`, { points: orbitPts }, this.scene);
        orbitLine.isVisible = false;
        this._spawnRefuelNode(tp, new BABYLON.Vector3(0.4, 0.8, 0.4).normalize(), tp.radius + 1.5);
        continue;
      }

      const biome = biomes[i];
      const bCfg = BIOME_CONFIG[biome];
      const radius = biome === 'world_tree' || biome === 'hollow_core' ? this.rng.range(36.0, 46.0) : this.rng.range(30.0, 40.0);
      // Wide spacing so planetary gravity wells never overlap!
      const orbitRadius = 380 + (i - 1) * 150 + this.rng.range(-16, 18);
      const orbitAngle = this.rng.range(0, Math.PI * 2);
      const orbitSpeed = this.rng.range(0.005, 0.014) * (i % 2 === 0 ? 1 : -1);
      const elevationY = this.rng.range(-65, 68);
      const orbitTilt = this.rng.range(-0.14, 0.14);
      const baseGravity = bCfg.grav;

      const group = new BABYLON.TransformNode(`planet_${i}`, this.scene);

      // Orbit ring (hidden in 3D space, shown only on Astral Chart)
      const orbitPts = [];
      for (let s = 0; s <= 64; s++) {
        const a = (s / 64) * Math.PI * 2;
        orbitPts.push(
          new BABYLON.Vector3(
            Math.cos(a) * orbitRadius,
            elevationY + Math.sin(a) * orbitRadius * Math.sin(orbitTilt),
            Math.sin(a) * orbitRadius
          )
        );
      }
      const orbitLine = BABYLON.MeshBuilder.CreateLines(`orbit_${i}`, { points: orbitPts }, this.scene);
      orbitLine.isVisible = false;

      const extras = [];
      if (biome === 'hollow_core') {
        // Hollow Planet with outer cracked crust (openings to fly inside) + glowing inner cavern world!
        const outerShell = BABYLON.MeshBuilder.CreateSphere(
          `bodyMesh_${i}`,
          { diameter: radius * 2, segments: 24, slice: 0.72 },
          this.scene
        );
        outerShell.parent = group;
        const shellMat = new BABYLON.PBRMaterial(`pMat_${i}`, this.scene);
        const { albedoTex, bumpTex } = createPlanetTextures(this.scene, 'desert', this.rng.range(1, 9999), `pl_${i}`);
        shellMat.albedoTexture = albedoTex;
        shellMat.bumpTexture = bumpTex;
        shellMat.roughness = 0.88;
        shellMat.backFaceCulling = false;
        outerShell.material = shellMat;

        const innerShell = BABYLON.MeshBuilder.CreateSphere(
          `hollowInner_${i}`,
          { diameter: radius * 1.56, segments: 24, sideOrientation: BABYLON.Mesh.BACKSIDE, slice: 0.78 },
          this.scene
        );
        innerShell.parent = group;
        const innerMat = new BABYLON.PBRMaterial(`hollowInnerMat_${i}`, this.scene);
        innerMat.albedoColor = c3('#466858');
        innerMat.emissiveColor = c3('#1a2c22');
        innerMat.roughness = 0.82;
        innerShell.material = innerMat;

        const innerSun = BABYLON.MeshBuilder.CreateSphere(`hollowCoreSun_${i}`, { diameter: 4.5, segments: 16 }, this.scene);
        const sunCoreMat = new BABYLON.StandardMaterial(`hollowCoreSunMat_${i}`, this.scene);
        sunCoreMat.emissiveColor = c3('#ff9e4a');
        sunCoreMat.disableLighting = true;
        innerSun.material = sunCoreMat;
        innerSun.parent = group;
        extras.push({ mesh: innerSun, speed: 0.5 });
      } else {
        // Planet textured sphere
        const mesh = BABYLON.MeshBuilder.CreateSphere(
          `bodyMesh_${i}`,
          { diameter: radius * 2, segments: 28 },
          this.scene
        );
        mesh.parent = group;
        const pMat = new BABYLON.PBRMaterial(`pMat_${i}`, this.scene);
        const texBiome = biome === 'world_tree' ? 'oasis' : biome === 'living_ocean' ? 'tidal' : biome;
        const { albedoTex, bumpTex } = createPlanetTextures(this.scene, texBiome, this.rng.range(1, 9999), `pl_${i}`);
        pMat.albedoTexture = albedoTex;
        pMat.bumpTexture = bumpTex;
        pMat.bumpTexture.level = 1.65;
        if (biome === 'volcanic') {
          pMat.emissiveTexture = albedoTex;
          pMat.emissiveColor = c3('#3d1004');
        } else if (biome === 'living_ocean') {
          pMat.emissiveColor = c3('#0b3545');
          pMat.roughness = 0.22;
        }
        pMat.metallic = 0.08;
        pMat.roughness = biome === 'cryo' ? 0.28 : biome === 'living_ocean' ? 0.22 : 0.82;
        mesh.material = pMat;

        if (biome === 'world_tree') {
          this._buildWorldTreeCanopies(group, radius);
        }

        // Sun-lit atmospheric Fresnel scattering rim (only glows on day side / terminator)
        const atmoColors = {
          oasis: '#6eb4d8',
          world_tree: '#78b896',
          living_ocean: '#5ea8cc',
          cryo: '#92c4e2',
          volcanic: '#c85a2e',
        };
        if (atmoColors[biome]) {
          this._attachAtmosphereRim(group, radius, atmoColors[biome], i);
        }
      }

      if (biome === 'cryo') {
        const ring = BABYLON.MeshBuilder.CreateTorus(
          `pRing_${i}`,
          { diameter: (radius + 9.5) * 2, thickness: 2.2, tessellation: 64 },
          this.scene
        );
        ring.parent = group;
        ring.rotation.x = Math.PI / 2.35;
        ring.scaling.y = 0.02;
        const rMat = new BABYLON.PBRMaterial(`rMat_${i}`, this.scene);
        rMat.albedoColor = c3('#9ab0be');
        rMat.metallic = 0.12;
        rMat.roughness = 0.78;
        rMat.alpha = 0.36;
        ring.material = rMat;
        extras.push({ mesh: ring, speed: 0.14 });
      }

      // Orbiting Moon for select planets
      if (i === 1 || i === 3 || i === 4) {
        const moonMesh = BABYLON.MeshBuilder.CreateIcoSphere(`moon_${i}`, { radius: 4.5, subdivisions: 2, flat: true }, this.scene);
        const mMat = new BABYLON.PBRMaterial(`moonMat_${i}`, this.scene);
        mMat.albedoColor = c3(i === 3 ? '#7ba2b8' : '#85786c');
        mMat.roughness = 0.88;
        moonMesh.material = mMat;
        moonMesh.parent = group;
        this.moons.push({ mesh: moonMesh, orbitR: radius + 21.0, angle: i * 1.4, speed: 0.35 });
      }

      // Biome surface 3D props!
      this._populateBiomeProps(group, biome === 'world_tree' ? 'oasis' : biome === 'living_ocean' ? 'tidal' : biome === 'hollow_core' ? 'desert' : biome, radius, i);

      const planet = {
        id: `body_${i}`,
        name: names[i],
        biome,
        biomeLabel: bCfg.label,
        radius,
        baseGravity,
        gravity: baseGravity,
        orbitRadius,
        orbitAngle,
        orbitSpeed,
        elevationY,
        orbitTilt,
        color: bCfg.mapColor,
        group,
        prevPos: new BABYLON.Vector3(),
        velocity: new BABYLON.Vector3(),
        extras,
        discovered: i === 0,
        mysteryNote:
          biome === 'tidal'
            ? 'Атолл Приливов: гравитация пульсирует волнами!'
            : biome === 'observatory'
            ? 'Латунная Обсерватория: станция навигаторов с доком и модулем.'
            : biome === 'volcanic'
            ? 'Вулканическая Кузня: высокая тяжесть и магматические разломы.'
            : biome === 'cryo'
            ? 'Кристальный Ледник: низкая гравитация и ледяные шпили.'
            : biome === 'desert'
            ? 'Янтарные Дюны: древние каменные арки и монолиты.'
            : 'Изумрудный Оазис: эфирные рощи и мягкая атмосфера.',
      };
      this.planets.push(planet);

      // Place 3 Resonance Obelisks on planets 0, 2, 4
      if ((i === 0 || i === 2 || i === 4) && obeliskCount < 3) {
        const ob = this._createObeliskMesh(obeliskCount);
        placeOnSurface(ob.group, new BABYLON.Vector3(0, 1, 0), radius, 0);
        ob.group.parent = group;
        this.obelisks.push({
          ...ob,
          planet,
          activated: false,
          label: `Резонансный Обелиск (${planet.name})`,
        });
        obeliskCount++;
      }

      // Place Upgrades on planets 1, 3, 5
      if ((i === 1 || i === 3 || i === 5) && upgradeIdx < shuffledUpgrades.length) {
        const upgData = shuffledUpgrades[upgradeIdx++];
        const upgNode = this._createUpgradeMesh(i);
        placeOnSurface(upgNode, new BABYLON.Vector3(0.8, 0.5, 0.2), radius, 0.6);
        upgNode.parent = group;
        this.upgrades.push({ mesh: upgNode, planet, data: upgData, collected: false });
      }

      // Ether Geysers on planets 0, 1, 3, 5
      if (i === 0 || i === 1 || i === 3 || i === 5) {
        const geyser = this._createGeyserMesh(i);
        placeOnSurface(geyser.group, new BABYLON.Vector3(-0.7, 0.65, 0.3), radius, 0);
        geyser.group.parent = group;
        this.geysers.push({ ...geyser, planet, cooldown: 0 });
      }

      // Refuel Stations on planets 1, 2, 4, 5
      if (i === 1 || i === 2 || i === 4 || i === 5) {
        this._spawnRefuelNode(planet, new BABYLON.Vector3(0.45, 0.72, -0.52).normalize(), radius);
      }
    }

    this._buildWildlife();
    this.update(0);
  }

  _attachAtmosphereRim(group, radius, colorHex, idx) {
    if (!BABYLON.Effect.ShadersStore['atmoRimVertexShader']) {
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
          vWorldNormal = normalize(mat3(world) * normal);
          gl_Position = worldViewProjection * vec4(position, 1.0);
        }
      `;
      BABYLON.Effect.ShadersStore['atmoRimFragmentShader'] = `
        precision highp float;
        uniform vec3 cameraPosition;
        uniform vec3 atmoColor;
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        void main() {
          vec3 N = normalize(vWorldNormal);
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(-vWorldPos); // Sun at origin
          float rim = pow(clamp(1.0 - abs(dot(N, V)), 0.0, 1.0), 3.2);
          float day = smoothstep(-0.22, 0.55, dot(N, L));
          float alpha = rim * day * 0.48;
          gl_FragColor = vec4(atmoColor * (0.75 + 0.5 * day), alpha);
        }
      `;
    }
    const atmo = BABYLON.MeshBuilder.CreateSphere(
      `atmoRim_${idx}`,
      { diameter: radius * 2.09, segments: 28 },
      this.scene
    );
    const mat = new BABYLON.ShaderMaterial(
      `atmoRimMat_${idx}`,
      this.scene,
      { vertex: 'atmoRim', fragment: 'atmoRim' },
      {
        attributes: ['position', 'normal'],
        uniforms: ['world', 'worldViewProjection', 'cameraPosition', 'atmoColor'],
        needAlphaBlending: true,
      }
    );
    mat.setColor3('atmoColor', c3(colorHex));
    mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    mat.backFaceCulling = false;
    mat.depthWrite = false;
    atmo.material = mat;
    atmo.isPickable = false;
    atmo.parent = group;
  }

  _buildWorldTreeCanopies(group, radius) {
    const barkMat = new BABYLON.PBRMaterial('wtBarkMat', this.scene);
    barkMat.albedoColor = c3('#463426');
    barkMat.roughness = 0.94;
    const leafMat = new BABYLON.PBRMaterial('wtLeafMat', this.scene);
    leafMat.albedoColor = c3('#466640');
    leafMat.roughness = 0.85;

    const dirs = [
      new BABYLON.Vector3(0, 1, 0),
      new BABYLON.Vector3(0.85, 0.4, 0.3),
      new BABYLON.Vector3(-0.7, 0.5, -0.5),
      new BABYLON.Vector3(0.3, -0.8, 0.5),
      new BABYLON.Vector3(-0.4, -0.5, -0.75),
    ];
    dirs.forEach((d, idx) => {
      const n = d.normalize();
      const trunk = BABYLON.MeshBuilder.CreateCylinder(
        `wtTrunk_${idx}`,
        { diameterTop: 2.4, diameterBottom: 4.8, height: 2.2, tessellation: 9 },
        this.scene
      );
      trunk.material = barkMat;
      trunk.parent = group;
      placeOnSurface(trunk, n, radius, 0.2);

      // Compact multi-lobed forest crown hugging the planet curvature
      const canopy = BABYLON.MeshBuilder.CreateIcoSphere(
        `wtCanopy_${idx}`,
        { radius: 4.2, subdivisions: 2, flat: true },
        this.scene
      );
      canopy.scaling.set(1.18, 0.34, 1.18);
      canopy.material = leafMat;
      canopy.parent = group;
      placeOnSurface(canopy, n, radius, 1.2);
    });
  }

  _spawnRefuelNode(planet, unitDir, surfR) {
    const g = new BABYLON.TransformNode(`refuel_${this.refuelNodes.length}`, this.scene);
    g.parent = planet.group;
    placeOnSurface(g, unitDir, surfR, 0);

    const padMat = new BABYLON.PBRMaterial(`refuelPadMat_${this.refuelNodes.length}`, this.scene);
    padMat.albedoColor = c3('#4a545e');
    padMat.metallic = 0.7;
    padMat.roughness = 0.45;
    const tankMat = new BABYLON.PBRMaterial(`refuelTankMat_${this.refuelNodes.length}`, this.scene);
    tankMat.albedoColor = c3('#e59838');
    tankMat.metallic = 0.45;
    tankMat.roughness = 0.35;
    const beaconMat = new BABYLON.StandardMaterial(`refuelBeaconMat_${this.refuelNodes.length}`, this.scene);
    beaconMat.emissiveColor = c3('#38f2d8');
    beaconMat.disableLighting = true;

    const base = BABYLON.MeshBuilder.CreateCylinder(`rfBase_${this.refuelNodes.length}`, { diameter: 5.2, height: 0.6, tessellation: 10 }, this.scene);
    base.position.y = 0.3;
    base.material = padMat;
    base.parent = g;

    const tank = BABYLON.MeshBuilder.CreateCylinder(`rfTank_${this.refuelNodes.length}`, { diameter: 1.8, height: 3.4, tessellation: 10 }, this.scene);
    tank.position.set(1.4, 2.0, 0);
    tank.material = tankMat;
    tank.parent = g;

    const beacon = BABYLON.MeshBuilder.CreateSphere(`rfBeacon_${this.refuelNodes.length}`, { diameter: 1.1, segments: 8 }, this.scene);
    beacon.position.set(1.4, 4.3, 0);
    beacon.material = beaconMat;
    beacon.parent = g;

    this.refuelNodes.push({ group: g, beacon, planet });
  }

  _buildWildlife() {
    // 1. Space Mantas / Void Jellyfish gliding between stars & planets
    const mantaMat = new BABYLON.PBRMaterial('mantaMat', this.scene);
    mantaMat.albedoColor = c3('#2a5868');
    mantaMat.emissiveColor = c3('#081820');
    mantaMat.roughness = 0.55;
    mantaMat.alpha = 0.65;

    for (let i = 0; i < 10; i++) {
      const root = new BABYLON.TransformNode(`manta_${i}`, this.scene);
      const body = BABYLON.MeshBuilder.CreateDisc(`mantaBody_${i}`, { radius: 3.4, tessellation: 8 }, this.scene);
      body.rotation.x = Math.PI / 2;
      body.scaling.set(1.6, 1.0, 0.65);
      body.material = mantaMat;
      body.parent = root;

      const tail = BABYLON.MeshBuilder.CreateCylinder(`mantaTail_${i}`, { diameterTop: 0.45, diameterBottom: 0.04, height: 6.5, tessellation: 6 }, this.scene);
      tail.rotation.x = Math.PI / 2;
      tail.position.z = -4.2;
      tail.material = mantaMat;
      tail.parent = root;

      const r = this.rng.range(260, 640);
      const a = this.rng.range(0, Math.PI * 2);
      const y = this.rng.range(-48, 48);
      root.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      this.spaceCreatures.push({
        root,
        body,
        orbitR: r,
        angle: a,
        speed: this.rng.range(0.03, 0.085),
        y,
        phase: this.rng.range(0, Math.PI * 2),
      });
    }

    // 2. Planetary Sky-Bird Flocks on living worlds (TerrainPlanet & world_tree & living_ocean)
    const birdMat = new BABYLON.StandardMaterial('skyBirdMat', this.scene);
    birdMat.emissiveColor = c3('#f5d79c');
    birdMat.diffuseColor = c3('#ffe5b4');

    for (const p of this.planets) {
      if (p.biome !== 'oasis' && p.biome !== 'world_tree' && p.biome !== 'living_ocean') continue;
      for (let f = 0; f < 6; f++) {
        const bird = BABYLON.MeshBuilder.CreateBox(`bird_${p.id}_${f}`, { width: 1.5, height: 0.14, depth: 0.5 }, this.scene);
        bird.material = birdMat;
        bird.parent = p.group;
        this.planetFlocks.push({
          mesh: bird,
          planet: p,
          alt: p.radius + this.rng.range(6, 15),
          angle: this.rng.range(0, Math.PI * 2),
          incl: this.rng.range(-0.6, 0.6),
          speed: this.rng.range(0.35, 0.65),
          phase: f * 0.9,
        });
      }
    }
  }

  _populateBiomeProps(group, biome, radius, pIdx) {
    const propCount = 26;
    for (let k = 0; k < propCount; k++) {
      const theta = this.rng.range(0, Math.PI * 2);
      const phi = Math.acos(this.rng.range(-0.9, 0.9));
      const dir = new BABYLON.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      const prop = new BABYLON.TransformNode(`prop_${pIdx}_${k}`, this.scene);
      if (biome === 'oasis') {
        const trunk = BABYLON.MeshBuilder.CreateCylinder(`tr_${pIdx}_${k}`, { diameter: 0.35, height: 1.8 }, this.scene);
        trunk.position.y = 0.9;
        trunk.parent = prop;
        const cap = BABYLON.MeshBuilder.CreateSphere(`cp_${pIdx}_${k}`, { diameter: 1.6 }, this.scene);
        cap.scaling.y = 0.55;
        cap.position.y = 1.9;
        const capMat = new BABYLON.StandardMaterial(`cpMat_${pIdx}_${k}`, this.scene);
        capMat.diffuseColor = c3('#24c99d');
        capMat.emissiveColor = c3('#127862');
        cap.material = capMat;
        cap.parent = prop;
      } else if (biome === 'cryo') {
        for (let c = 0; c < 3; c++) {
          const crystal = BABYLON.MeshBuilder.CreateCylinder(
            `ice_${pIdx}_${k}_${c}`,
            { diameterTop: 0.04, diameterBottom: 0.65, height: this.rng.range(1.4, 2.9), tessellation: 5 },
            this.scene
          );
          crystal.position.set((c - 1) * 0.35, 0.9, 0);
          crystal.rotation.z = (c - 1) * 0.32;
          const iMat = new BABYLON.StandardMaterial(`iceMat_${pIdx}_${k}_${c}`, this.scene);
          iMat.diffuseColor = c3('#9be8ff');
          iMat.emissiveColor = c3('#1c7eb8');
          iMat.alpha = 0.88;
          crystal.material = iMat;
          crystal.parent = prop;
        }
      } else if (biome === 'volcanic') {
        const cone = BABYLON.MeshBuilder.CreateCylinder(
          `lav_${pIdx}_${k}`,
          { diameterTop: 0.75, diameterBottom: 2.1, height: 1.6, tessellation: 8 },
          this.scene
        );
        cone.position.y = 0.7;
        const lMat = new BABYLON.PBRMaterial(`lavMat_${pIdx}_${k}`, this.scene);
        lMat.albedoColor = c3('#362525');
        lMat.roughness = 0.9;
        cone.material = lMat;
        cone.parent = prop;
        const lavaTop = BABYLON.MeshBuilder.CreateDisc(`lavTop_${pIdx}_${k}`, { radius: 0.36 }, this.scene);
        lavaTop.rotation.x = Math.PI / 2;
        lavaTop.position.y = 1.52;
        const ltMat = new BABYLON.StandardMaterial(`ltMat_${pIdx}_${k}`, this.scene);
        ltMat.emissiveColor = c3('#ff5a1f');
        ltMat.disableLighting = true;
        lavaTop.material = ltMat;
        lavaTop.parent = prop;
      } else if (biome === 'desert') {
        const dMat = new BABYLON.PBRMaterial(`desMat_${pIdx}_${k}`, this.scene);
        dMat.albedoColor = c3('#d99b4e');
        dMat.roughness = 0.85;
        const p1 = BABYLON.MeshBuilder.CreateBox(`des1_${pIdx}_${k}`, { width: 0.55, height: 2.2, depth: 0.55 }, this.scene);
        p1.position.set(-0.65, 1.0, 0);
        p1.material = dMat;
        p1.parent = prop;
        const p2 = BABYLON.MeshBuilder.CreateBox(`des2_${pIdx}_${k}`, { width: 0.55, height: 2.2, depth: 0.55 }, this.scene);
        p2.position.set(0.65, 1.0, 0);
        p2.material = dMat;
        p2.parent = prop;
        const lintel = BABYLON.MeshBuilder.CreateBox(`desL_${pIdx}_${k}`, { width: 2.0, height: 0.45, depth: 0.65 }, this.scene);
        lintel.position.set(0, 2.2, 0);
        lintel.material = dMat;
        lintel.parent = prop;
      } else {
        const node = BABYLON.MeshBuilder.CreateBox(`obs_${pIdx}_${k}`, { width: 1.0, height: 1.5, depth: 1.0 }, this.scene);
        node.position.y = 0.7;
        const oMat = new BABYLON.PBRMaterial(`obsMat_${pIdx}_${k}`, this.scene);
        oMat.albedoColor = c3(biome === 'observatory' ? '#d9a145' : '#9452e0');
        oMat.metallic = 0.75;
        oMat.roughness = 0.3;
        node.material = oMat;
        node.parent = prop;
      }

      placeOnSurface(prop, dir, radius, -0.1);
      prop.parent = group;
    }
  }

  _createObeliskMesh(idx) {
    const group = new BABYLON.TransformNode(`ob_${idx}`, this.scene);
    const mat = new BABYLON.PBRMaterial(`obMat_${idx}`, this.scene);
    mat.albedoColor = c3('#26344a');
    mat.metallic = 0.78;
    mat.roughness = 0.28;

    const spire = BABYLON.MeshBuilder.CreateCylinder(
      `spire_${idx}`,
      { diameterTop: 0.1, diameterBottom: 2.2, height: 4.6, tessellation: 4 },
      this.scene
    );
    spire.position.y = 2.3;
    spire.material = mat;
    spire.parent = group;

    const crystalMat = new BABYLON.StandardMaterial(`crysMat_${idx}`, this.scene);
    crystalMat.diffuseColor = c3('#38f2d8');
    crystalMat.emissiveColor = c3('#1bc4ad');

    const crystal = BABYLON.MeshBuilder.CreatePolyhedron(`crys_${idx}`, { type: 1, size: 0.85 }, this.scene);
    crystal.position.y = 5.4;
    crystal.material = crystalMat;
    crystal.parent = group;

    return { group, crystal, crystalMat, index: idx };
  }

  _createUpgradeMesh(idx) {
    const group = new BABYLON.TransformNode(`upg_${idx}`, this.scene);
    const coreMat = new BABYLON.StandardMaterial(`upgCoreMat_${idx}`, this.scene);
    coreMat.diffuseColor = c3('#f5c451');
    coreMat.emissiveColor = c3('#c98c24');

    const core = BABYLON.MeshBuilder.CreatePolyhedron(`upgCore_${idx}`, { type: 1, size: 0.85 }, this.scene);
    core.position.y = 1.2;
    core.material = coreMat;
    core.parent = group;

    const ringMat = new BABYLON.StandardMaterial(`upgRingMat_${idx}`, this.scene);
    ringMat.emissiveColor = c3('#38f2d8');
    ringMat.disableLighting = true;

    const ring = BABYLON.MeshBuilder.CreateTorus(
      `upgRing_${idx}`,
      { diameter: 2.6, thickness: 0.2, tessellation: 24 },
      this.scene
    );
    ring.position.y = 1.2;
    ring.material = ringMat;
    ring.parent = group;

    return group;
  }

  _createGeyserMesh(idx) {
    const group = new BABYLON.TransformNode(`gey_${idx}`, this.scene);
    const baseMat = new BABYLON.PBRMaterial(`geyBase_${idx}`, this.scene);
    baseMat.albedoColor = c3('#3e5469');
    baseMat.metallic = 0.65;
    baseMat.roughness = 0.4;

    const base = BABYLON.MeshBuilder.CreateCylinder(
      `geyCyl_${idx}`,
      { diameterTop: 2.5, diameterBottom: 3.3, height: 0.7, tessellation: 10 },
      this.scene
    );
    base.position.y = 0.35;
    base.material = baseMat;
    base.parent = group;

    const plumeMat = new BABYLON.StandardMaterial(`geyPlumeMat_${idx}`, this.scene);
    plumeMat.emissiveColor = c3('#38f2d8');
    plumeMat.disableLighting = true;
    plumeMat.alpha = 0.65;

    const plume = BABYLON.MeshBuilder.CreateCylinder(
      `geyPlume_${idx}`,
      { diameterTop: 0.1, diameterBottom: 1.7, height: 2.8, tessellation: 8 },
      this.scene
    );
    plume.position.y = 1.8;
    plume.material = plumeMat;
    plume.parent = group;

    return { group, plume };
  }

  _buildEtherCurrents() {
    for (let i = 0; i < 4; i++) {
      const startAngle = (i / 4) * Math.PI * 2 + this.rng.range(-0.2, 0.2);
      const pts = [];
      for (let s = 0; s <= 4; s++) {
        const a = startAngle + s * 0.55;
        const r = 48 + s * 34 + this.rng.range(-8, 10);
        const y = this.rng.range(-32, 34);
        pts.push(new BABYLON.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      const curve = BABYLON.Curve3.CreateCatmullRomSpline(pts, 16, false);
      const pathPts = curve.getPoints();
      const path3d = new BABYLON.Path3D(pathPts);

      const width = this.rng.range(10, 16);
      const baseSpeed = this.rng.range(22, 34);
      const variability = this.rng.range(0.18, 0.42);
      const phase = this.rng.range(0, Math.PI * 2);

      // Keep ether current physics, hide artificial 3D route lines & markers in space
      const beads = [];
      this.currents.push({ path3d, width, baseSpeed, variability, phase, strength: baseSpeed, beads });
    }
  }

  _buildAnomalies() {
    for (let i = 0; i < 2; i++) {
      const a = this.rng.range(0, Math.PI * 2);
      const r = this.rng.range(85, 145);
      const y = this.rng.range(-24, 28);
      const pos = new BABYLON.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);

      const group = new BABYLON.TransformNode(`anom_${i}`, this.scene);
      group.position.copyFrom(pos);

      const core = BABYLON.MeshBuilder.CreateSphere(`anomCore_${i}`, { diameter: 5.2, segments: 12 }, this.scene);
      const cMat = new BABYLON.StandardMaterial(`anomCMat_${i}`, this.scene);
      cMat.emissiveColor = c3('#12202a');
      cMat.disableLighting = true;
      core.material = cMat;
      core.parent = group;

      const ring = BABYLON.MeshBuilder.CreateTorus(
        `anomRing_${i}`,
        { diameter: 13, thickness: 0.65, tessellation: 32 },
        this.scene
      );
      const rMat = new BABYLON.PBRMaterial(`anomRMat_${i}`, this.scene);
      rMat.albedoColor = c3('#6b5842');
      rMat.metallic = 0.72;
      rMat.roughness = 0.55;
      ring.material = rMat;
      ring.parent = group;

      this.anomalies.push({ group, ring, pos, radius: 18 });
    }
  }

  _buildAsteroidBelt() {
    const rockMat = new BABYLON.PBRMaterial('rockMat', this.scene);
    rockMat.albedoColor = c3('#6b635a');
    rockMat.roughness = 0.88;
    rockMat.metallic = 0.15;

    const oreMat = new BABYLON.PBRMaterial('oreMat', this.scene);
    oreMat.albedoColor = c3('#47656f');
    oreMat.emissiveColor = c3('#0c2f36');
    oreMat.roughness = 0.58;
    oreMat.metallic = 0.45;

    for (let i = 0; i < 42; i++) {
      const a = this.rng.range(0, Math.PI * 2);
      const r = this.rng.range(180, 720);
      const y = this.rng.range(-44, 44);
      const mesh = BABYLON.MeshBuilder.CreateIcoSphere(
        `deb_${i}`,
        { radius: 1.45, subdivisions: 2, flat: true, updatable: true },
        this.scene
      );
      const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      const seed = i * 13.7 + 5.1;
      for (let v = 0; v < pos.length; v += 3) {
        const vx = pos[v], vy = pos[v + 1], vz = pos[v + 2];
        const n = Math.sin(vx * 2.1 + seed) * Math.cos(vy * 2.3 - seed) * Math.sin(vz * 1.9 + seed * 0.5);
        const crag = 0.72 + 0.45 * Math.abs(n);
        pos[v] = vx * crag;
        pos[v + 1] = vy * crag;
        pos[v + 2] = vz * crag;
      }
      mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
      const norm = new Float32Array(pos.length);
      BABYLON.VertexData.ComputeNormals(pos, mesh.getIndices(), norm);
      mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norm);
      mesh.refreshBoundingInfo(true);

      mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      mesh.scaling.set(
        this.rng.range(0.7, 2.2),
        this.rng.range(0.6, 1.7),
        this.rng.range(0.7, 2.1)
      );
      mesh.material = i % 5 === 0 ? oreMat : rockMat;
      this.debris.push({
        mesh,
        orbitR: r,
        angle: a,
        speed: this.rng.range(0.012, 0.038),
        y,
        rotSpeed: this.rng.range(0.4, 1.6),
      });
    }
  }

  _buildMegastructures() {
    const brassMat = new BABYLON.PBRMaterial('megaBrassMat', this.scene);
    brassMat.albedoColor = c3('#d8a648');
    brassMat.metallic = 0.85;
    brassMat.roughness = 0.25;

    const steelMat = new BABYLON.PBRMaterial('megaSteelMat', this.scene);
    steelMat.albedoColor = c3('#465260');
    steelMat.metallic = 0.78;
    steelMat.roughness = 0.42;

    const glowMat = new BABYLON.StandardMaterial('megaGlowMat', this.scene);
    glowMat.emissiveColor = c3('#38f2d8');
    glowMat.disableLighting = true;

    // 1. Dyson Ring Accelerator ("Венец Звезды")
    const ringGroup = new BABYLON.TransformNode('megaRingGroup', this.scene);
    ringGroup.position.set(125, 18, -75);
    ringGroup.rotation.set(0.35, 0.4, 0.2);

    const outerTorus = BABYLON.MeshBuilder.CreateTorus('megaRingOuter', { diameter: 56, thickness: 3.4, tessellation: 48 }, this.scene);
    outerTorus.material = steelMat;
    outerTorus.parent = ringGroup;

    const energyRing = BABYLON.MeshBuilder.CreateTorus('megaRingGlow', { diameter: 51, thickness: 0.8, tessellation: 48 }, this.scene);
    energyRing.material = glowMat;
    energyRing.parent = ringGroup;

    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2;
      const pylon = BABYLON.MeshBuilder.CreateBox(`megaPylon_${p}`, { width: 3.2, height: 12, depth: 3.2 }, this.scene);
      pylon.position.set(Math.cos(a) * 28, 0, Math.sin(a) * 28);
      pylon.material = brassMat;
      pylon.parent = ringGroup;
    }

    this.megastructures.push({
      id: 'star_accelerator',
      name: 'Кольцо-Ускоритель «Венец Звезды»',
      group: ringGroup,
      spinMesh: energyRing,
      visited: false,
      radius: 36,
    });

    // 2. Ancient Orbital Shipyard / Monolith ("Орбитальная Верфь Предтеч")
    const dockGroup = new BABYLON.TransformNode('megaDockGroup', this.scene);
    dockGroup.position.set(-290, 26, 160);

    const spine = BABYLON.MeshBuilder.CreateCylinder('megaSpine', { diameterTop: 6, diameterBottom: 9, height: 48, tessellation: 8 }, this.scene);
    spine.material = steelMat;
    spine.parent = dockGroup;

    const gyro1 = BABYLON.MeshBuilder.CreateTorus('megaGyro1', { diameter: 38, thickness: 2.2, tessellation: 36 }, this.scene);
    gyro1.material = brassMat;
    gyro1.parent = dockGroup;

    const gyro2 = BABYLON.MeshBuilder.CreateTorus('megaGyro2', { diameter: 28, thickness: 1.5, tessellation: 36 }, this.scene);
    gyro2.rotation.x = Math.PI / 2;
    gyro2.material = glowMat;
    gyro2.parent = dockGroup;

    const beacon = BABYLON.MeshBuilder.CreateSphere('megaBeacon', { diameter: 7.5, segments: 16 }, this.scene);
    beacon.position.y = 26;
    beacon.material = glowMat;
    beacon.parent = dockGroup;

    this.megastructures.push({
      id: 'ancient_shipyard',
      name: 'Орбитальная Верфь Предтеч',
      group: dockGroup,
      spinMesh: gyro1,
      spinMesh2: gyro2,
      visited: false,
      radius: 32,
    });
  }

  _buildHorizonGate() {
    const a = this.rng.range(0, Math.PI * 2);
    const r = 860;
    const y = this.rng.range(-44, 44);

    const group = new BABYLON.TransformNode('horizonGate', this.scene);
    group.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    group.lookAt(BABYLON.Vector3.Zero());

    const brassMat = new BABYLON.PBRMaterial('gateBrass', this.scene);
    brassMat.albedoColor = c3('#f5c451');
    brassMat.metallic = 0.88;
    brassMat.roughness = 0.2;

    const outerRing = BABYLON.MeshBuilder.CreateTorus(
      'gateOuter',
      { diameter: 22, thickness: 1.4, tessellation: 48 },
      this.scene
    );
    outerRing.rotation.x = Math.PI / 2;
    outerRing.material = brassMat;
    outerRing.parent = group;

    const innerRing = BABYLON.MeshBuilder.CreateTorus(
      'gateInner',
      { diameter: 16.4, thickness: 0.8, tessellation: 40 },
      this.scene
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.material = brassMat;
    innerRing.parent = group;

    const portalMat = new BABYLON.StandardMaterial('gatePortalMat', this.scene);
    portalMat.emissiveColor = c3('#ff4b4b');
    portalMat.disableLighting = true;
    portalMat.alpha = 0.3;
    portalMat.backFaceCulling = false;

    const portal = BABYLON.MeshBuilder.CreateDisc('gatePortal', { radius: 7.8, tessellation: 32 }, this.scene);
    portal.material = portalMat;
    portal.parent = group;

    this.gate = { group, outerRing, innerRing, portal, portalMat };
  }

  _buildStormWave() {
    this.stormMesh = BABYLON.MeshBuilder.CreateSphere('stormWave', { diameter: 2, segments: 24 }, this.scene);
    const sMat = new BABYLON.StandardMaterial('stormMat', this.scene);
    sMat.emissiveColor = c3('#ff6b35');
    sMat.disableLighting = true;
    sMat.alpha = 0.18;
    sMat.backFaceCulling = false;
    this.stormMesh.material = sMat;
    this.stormMesh.isVisible = false;
  }

  unlockGate() {
    this.gateUnlocked = true;
    if (this.gate) {
      this.gate.portalMat.emissiveColor = c3('#38f2d8');
      this.gate.portalMat.alpha = 0.65;
    }
  }

  sampleEtherCurrent(pos) {
    const out = new BABYLON.Vector3();
    for (const c of this.currents) {
      let bestDist = Infinity;
      let bestT = 0;
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const pt = c.path3d.getPointAt(t);
        const d = BABYLON.Vector3.Distance(pos, pt);
        if (d < bestDist) {
          bestDist = d;
          bestT = t;
        }
      }
      if (bestDist < c.width) {
        const tangent = c.path3d.getTangentAt(bestT).normalize();
        const binormal = c.path3d.getBinormalAt(bestT).normalize();
        const falloff = Math.pow(1 - bestDist / c.width, 0.75);
        // Time-varying speed & subtle meandering variability
        const wave = 1 + Math.sin(this.simTime * 0.9 + c.phase + bestT * 5) * c.variability;
        const meander = Math.cos(this.simTime * 0.6 + c.phase) * c.variability * 0.25;
        const dir = tangent.addInPlace(binormal.scale(meander)).normalize();
        out.addInPlace(dir.scale(c.baseSpeed * wave * falloff));
      }
    }
    return out;
  }

  update(dt, onStormWarning, cameraPos = null, shipWorldPos = null, shipInWater = false) {
    this.simTime += dt;

    if (this.sun) this.sun.rotation.y += dt * 0.08;
    if (this.sunB) {
      const bAngle = this.simTime * 0.14;
      this.sunB.position.set(Math.cos(bAngle) * 58, Math.sin(bAngle * 0.7) * 6, Math.sin(bAngle) * 58);
      if (this.sunBCorona) {
        const sb = 1 + Math.sin(this.simTime * 3.1) * 0.08;
        this.sunBCorona.scaling.setAll(sb);
      }
    }
    if (this.sunCorona) {
      const s = 1 + Math.sin(this.simTime * 2.4) * 0.06;
      this.sunCorona.scaling.setAll(s);
    }

    for (const p of this.planets) {
      p.prevPos.copyFrom(p.group.position);
      const a = p.orbitAngle + this.simTime * p.orbitSpeed;
      const x = Math.cos(a) * p.orbitRadius;
      const z = Math.sin(a) * p.orbitRadius;
      const y = p.elevationY + Math.sin(a) * p.orbitRadius * Math.sin(p.orbitTilt);
      p.group.position.set(x, y, z);

      if (dt > 0) {
        p.group.position.subtractToRef(p.prevPos, p.velocity);
        p.velocity.scaleInPlace(1 / dt);
      }

      if (p.biome === 'tidal') {
        p.gravity = p.baseGravity + Math.sin(this.simTime * 0.8) * 11;
      }

      if (p instanceof TerrainPlanet) {
        p.update(dt, this.simTime, cameraPos, shipWorldPos, shipInWater);
      } else {
        for (const ex of p.extras) {
          ex.mesh.rotation.z += ex.speed * dt;
        }
      }
    }

    for (const c of this.currents) {
      const spdFactor = (c.baseSpeed / 26) * (1 + Math.sin(this.simTime * 0.9 + c.phase) * c.variability * 0.5);
      for (const b of c.beads) {
        b.t = ((b.t + dt * 0.12 * spdFactor) % 1 + 1) % 1;
        const pt = c.path3d.getPointAt(b.t);
        const tan = c.path3d.getTangentAt(b.t);
        b.mesh.position.copyFrom(pt);
        b.mesh.lookAt(pt.add(tan));
      }
    }

    for (const an of this.anomalies) {
      an.ring.rotation.x += dt * 1.4;
      an.ring.rotation.y += dt * 1.1;
    }

    for (const d of this.debris) {
      d.angle += d.speed * dt;
      d.mesh.position.set(Math.cos(d.angle) * d.orbitR, d.y, Math.sin(d.angle) * d.orbitR);
      d.mesh.rotation.x += dt * d.rotSpeed;
      d.mesh.rotation.y += dt * d.rotSpeed * 0.7;
    }

    for (const m of this.moons) {
      m.angle += m.speed * dt;
      m.mesh.position.set(Math.cos(m.angle) * m.orbitR, Math.sin(m.angle * 0.5) * 2.5, Math.sin(m.angle) * m.orbitR);
      m.mesh.rotation.y += dt * 0.4;
    }

    for (const sc of this.spaceCreatures) {
      sc.angle += sc.speed * dt;
      const bob = Math.sin(this.simTime * 1.4 + sc.phase) * 3.5;
      sc.root.position.set(Math.cos(sc.angle) * sc.orbitR, sc.y + bob, Math.sin(sc.angle) * sc.orbitR);
      sc.root.rotation.y = -sc.angle;
      sc.body.scaling.y = 1 + Math.sin(this.simTime * 3.5 + sc.phase) * 0.22;
    }

    for (const fl of this.planetFlocks) {
      fl.angle += fl.speed * dt;
      const r = fl.alt;
      fl.mesh.position.set(
        Math.cos(fl.angle) * r,
        Math.sin(fl.angle + fl.incl) * r * 0.45,
        Math.sin(fl.angle) * r
      );
      fl.mesh.rotation.y = -fl.angle;
      fl.mesh.scaling.y = 0.7 + Math.abs(Math.sin(this.simTime * 8 + fl.phase)) * 0.8;
    }

    for (const rf of this.refuelNodes) {
      rf.beacon.scaling.setAll(0.9 + Math.sin(this.simTime * 4) * 0.2);
    }

    if (cameraPos) {
      this._updateLOD(cameraPos);
    }

    if (this.gate) {
      this.gate.outerRing.rotation.y += dt * 0.35;
      this.gate.innerRing.rotation.y -= dt * 0.65;
    }

    for (const ms of this.megastructures) {
      if (ms.spinMesh) ms.spinMesh.rotation.y += dt * 0.25;
      if (ms.spinMesh2) ms.spinMesh2.rotation.z += dt * 0.4;
    }

    for (const ob of this.obelisks) {
      ob.crystal.rotation.y += dt * (ob.activated ? 2.6 : 0.8);
    }
    for (const u of this.upgrades) {
      if (!u.collected) u.mesh.rotation.y += dt * 1.8;
    }
    for (const g of this.geysers) {
      if (g.cooldown > 0) g.cooldown = Math.max(0, g.cooldown - dt);
      const s = 0.85 + Math.sin(this.simTime * 8) * 0.15;
      g.plume.scaling.set(1, s, 1);
    }

    if (!this.stormActive) {
      if (this.stormWarning > 0) {
        this.stormWarning -= dt;
        if (this.stormWarning <= 0) {
          this.stormActive = true;
          this.stormRadius = 18;
          this.stormMesh.isVisible = true;
        }
      } else {
        this.stormCooldown -= dt;
        if (this.stormCooldown <= 0) {
          this.stormWarning = 7.0;
          if (onStormWarning) onStormWarning();
        }
      }
    } else {
      this.stormRadius += 42 * dt;
      this.stormMesh.scaling.setAll(this.stormRadius);
      if (this.stormRadius > 1150) {
        this.stormActive = false;
        this.stormMesh.isVisible = false;
        this.stormCooldown = this.starType.stormInterval;
      }
    }
  }

  _updateLOD(cameraPos) {
    // Distance-based LOD / visibility culling for props, flocks, and far debris
    for (const sc of this.spaceCreatures) {
      const dist = BABYLON.Vector3.Distance(sc.root.position, cameraPos);
      sc.root.setEnabled(dist < 520);
    }
    for (const d of this.debris) {
      const dist = BABYLON.Vector3.Distance(d.mesh.position, cameraPos);
      d.mesh.isVisible = dist < 620;
    }
    for (const fl of this.planetFlocks) {
      const dist = BABYLON.Vector3.Distance(fl.planet.group.position, cameraPos);
      fl.mesh.isVisible = dist < 240;
    }
  }
}
