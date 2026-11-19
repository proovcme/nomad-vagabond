import { createSailTexture, createSparkTexture, createHullTexture, createWoodPlankTexture } from './textures.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export class EtherShip {
  constructor(scene, camera, audio) {
    this.scene = scene;
    this.camera = camera;
    this.audio = audio;

    this.group = new BABYLON.TransformNode('shipRoot', scene);
    this.group.rotationQuaternion = BABYLON.Quaternion.Identity();

    this.mass = 2.4;
    this.velocity = new BABYLON.Vector3();
    this.angVel = new BABYLON.Vector3(); // x: pitch, y: yaw, z: roll

    this.hull = 100;
    this.maxHull = 100;
    this.fuel = 100;
    this.maxFuel = 100;

    this.sailAngle = 0; // radians (-1.2 to +1.2)
    this.sailsFurled = false;
    this.sailEfficiency = 0;
    this.liftRatio = 0;
    this.apparentWindAngle = 0; // relative to ship forward for HUD
    this.apparentWindSpeed = 0;
    this.inCurrent = false;
    this.nearPlanet = null;
    this.dockedPlanet = null;
    this.waterPlanet = null;
    this.driveSpeed = 0;

    this.upgrades = new Set();
    this.keys = {};
    this.heelAngle = 0; // aerodynamic heel from wind pressure
    this.stormHitCooldown = 0;
    this.impactCooldown = 0;

    this.wheels = [];
    this.gearStruts = [];
    this.sailMeshes = [];

    this._buildModel();
    this._buildParticles();
    this._bindInputs();
  }

  _buildModel() {
    this.visual = new BABYLON.TransformNode('shipVisual', this.scene);
    this.visual.parent = this.group;

    const hullTex = createHullTexture(this.scene);
    const hullMat = new BABYLON.PBRMaterial('shipHullMat', this.scene);
    hullMat.albedoTexture = hullTex.albedoTex;
    hullMat.bumpTexture = hullTex.bumpTex;
    hullMat.bumpTexture.level = 0.9;
    hullMat.metallic = 0.28;
    hullMat.roughness = 0.52;

    const woodTex = createWoodPlankTexture(this.scene);
    const woodMat = new BABYLON.PBRMaterial('shipWoodMat', this.scene);
    woodMat.albedoColor = c3('#d8b48e');
    woodMat.albedoTexture = woodTex.albedoTex;
    woodMat.bumpTexture = woodTex.bumpTex;
    woodMat.bumpTexture.level = 0.85;
    woodMat.metallic = 0.02;
    woodMat.roughness = 0.74;

    const brassMat = new BABYLON.PBRMaterial('shipBrassMat', this.scene);
    brassMat.albedoColor = c3('#cfa04c');
    brassMat.metallic = 0.85;
    brassMat.roughness = 0.30;

    const darkIronMat = new BABYLON.PBRMaterial('shipIronMat', this.scene);
    darkIronMat.albedoColor = c3('#252d38');
    darkIronMat.metallic = 0.8;
    darkIronMat.roughness = 0.45;

    const tireMat = new BABYLON.PBRMaterial('shipTireMat', this.scene);
    tireMat.albedoColor = c3('#1b222c');
    tireMat.metallic = 0.2;
    tireMat.roughness = 0.78;

    const cabinWinMat = new BABYLON.StandardMaterial('cabinWinMat', this.scene);
    cabinWinMat.emissiveColor = c3('#ffcf78');
    cabinWinMat.diffuseColor = c3('#ffe5a8');

    // 1. Sculpted Nautical-Aether Hull via Ribbon Lofting (9 stations from bow to stern)
    // Stations: [z, halfWidth, gunwaleY, keelY]
    const stations = [
      [-4.65, 0.04, 0.78, 0.15], // sharp cutwater prow
      [-3.75, 0.48, 0.64, -0.35],
      [-2.55, 1.02, 0.54, -0.72],
      [-1.15, 1.32, 0.48, -0.86], // midship beam
      [0.35,  1.36, 0.48, -0.86],
      [1.65,  1.24, 0.56, -0.76],
      [2.65,  1.05, 0.72, -0.52],
      [3.35,  0.82, 0.88, -0.22], // raised stern transom
    ];
    const hullPaths = stations.map(([z, hw, gy, ky]) => [
      new BABYLON.Vector3(-hw, gy, z),
      new BABYLON.Vector3(-hw * 0.92, (gy + ky) * 0.42, z),
      new BABYLON.Vector3(-hw * 0.48, ky * 0.88, z),
      new BABYLON.Vector3(0, ky, z),
      new BABYLON.Vector3(hw * 0.48, ky * 0.88, z),
      new BABYLON.Vector3(hw * 0.92, (gy + ky) * 0.42, z),
      new BABYLON.Vector3(hw, gy, z),
    ]);
    const hullMesh = BABYLON.MeshBuilder.CreateRibbon(
      'shipSculptedHull',
      { pathArray: hullPaths, closePath: false, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      this.scene
    );
    hullMesh.material = hullMat;
    hullMesh.parent = this.visual;

    // 2. Curved Planked Wooden Deck following the sheer line
    const deckPaths = stations.map(([z, hw, gy]) => [
      new BABYLON.Vector3(-hw * 0.96, gy - 0.06, z),
      new BABYLON.Vector3(0, gy - 0.03, z),
      new BABYLON.Vector3(hw * 0.96, gy - 0.06, z),
    ]);
    const deckMesh = BABYLON.MeshBuilder.CreateRibbon(
      'shipDeck',
      { pathArray: deckPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      this.scene
    );
    deckMesh.material = woodMat;
    deckMesh.parent = this.visual;

    // Gunwale wooden & brass rails along port and starboard
    [-1, 1].forEach((side) => {
      const railPts = stations.map(([z, hw, gy]) => new BABYLON.Vector3(side * hw * 0.98, gy + 0.08, z));
      const rail = BABYLON.MeshBuilder.CreateTube(
        `gunwale_${side}`,
        { path: railPts, radius: 0.065, tessellation: 8 },
        this.scene
      );
      rail.material = brassMat;
      rail.parent = this.visual;
    });

    // 3. Raised Stern Quarterdeck Cabin & Brass Gallery
    const cabin = BABYLON.MeshBuilder.CreateCylinder(
      'shipCabin',
      { diameterTop: 1.55, diameterBottom: 1.85, height: 1.65, tessellation: 8 },
      this.scene
    );
    cabin.rotation.x = Math.PI / 2;
    cabin.scaling.set(1.05, 1.0, 0.52);
    cabin.position.set(0, 0.96, 2.45);
    cabin.material = woodMat;
    cabin.parent = this.visual;

    // Arched brass-framed stern gallery windows
    [-0.44, 0, 0.44].forEach((wx, idx) => {
      const frame = BABYLON.MeshBuilder.CreateTorus(
        `winFrame_${idx}`,
        { diameter: 0.34, thickness: 0.055, tessellation: 12 },
        this.scene
      );
      frame.rotation.x = Math.PI / 2;
      frame.position.set(wx, 1.02, 3.34);
      frame.material = brassMat;
      frame.parent = this.visual;

      const pane = BABYLON.MeshBuilder.CreateDisc(`winPane_${idx}`, { radius: 0.14, tessellation: 12 }, this.scene);
      pane.position.set(wx, 1.02, 3.35);
      pane.material = cabinWinMat;
      pane.parent = this.visual;
    });

    // Helm Wheel on Quarterdeck
    const helm = BABYLON.MeshBuilder.CreateTorus('shipHelm', { diameter: 0.62, thickness: 0.05, tessellation: 14 }, this.scene);
    helm.position.set(0, 1.38, 1.68);
    helm.material = brassMat;
    helm.parent = this.visual;

    // 4. Midship Spinning Brass Astrolabe / Aether Gyroscope
    this.gyroRings = [];
    const gyroCore = BABYLON.MeshBuilder.CreateSphere('gyroCore', { diameter: 0.36, segments: 12 }, this.scene);
    const gyroCoreMat = new BABYLON.StandardMaterial('gyroCoreMat', this.scene);
    gyroCoreMat.emissiveColor = c3('#38f2d8');
    gyroCoreMat.diffuseColor = c3('#8afaf0');
    gyroCore.material = gyroCoreMat;
    gyroCore.position.set(0, 0.92, -0.55);
    gyroCore.parent = this.visual;

    [0.62, 0.82].forEach((diam, idx) => {
      const gRing = BABYLON.MeshBuilder.CreateTorus(
        `gyroRing_${idx}`,
        { diameter: diam, thickness: 0.045, tessellation: 20 },
        this.scene
      );
      gRing.position.set(0, 0.92, -0.55);
      gRing.rotation.x = idx * 0.7;
      gRing.material = brassMat;
      gRing.parent = this.visual;
      this.gyroRings.push(gRing);
    });

    // 5. Swept Keel Fin & Side Brass Stabilizer Wings
    const keelPath = [
      new BABYLON.Vector3(0, -0.78, -2.0),
      new BABYLON.Vector3(0, -1.65, -0.4),
      new BABYLON.Vector3(0, -1.55, 1.9),
      new BABYLON.Vector3(0, -0.55, 2.8),
    ];
    const keel = BABYLON.MeshBuilder.CreateTube('shipKeel', { path: keelPath, radius: 0.09, tessellation: 8 }, this.scene);
    keel.scaling.x = 0.65;
    keel.material = brassMat;
    keel.parent = this.visual;

    [-1, 1].forEach((side, i) => {
      const fin = BABYLON.MeshBuilder.CreateBox(
        `stabFin_${i}`,
        { width: 0.95, height: 0.07, depth: 1.35 },
        this.scene
      );
      fin.position.set(side * 1.45, -0.18, 1.35);
      fin.rotation.z = side > 0 ? -0.18 : 0.18;
      fin.rotation.y = side > 0 ? -0.22 : 0.22;
      fin.material = brassMat;
      fin.parent = this.visual;
    });

    // 6. Tapered Bowsprit + Brass Collars + Hanging Bow Lantern
    const bowsprit = BABYLON.MeshBuilder.CreateCylinder(
      'bowsprit',
      { diameterTop: 0.07, diameterBottom: 0.24, height: 3.4, tessellation: 10 },
      this.scene
    );
    bowsprit.rotation.x = -Math.PI / 2 + 0.2;
    bowsprit.position.set(0, 1.02, -5.85);
    bowsprit.material = woodMat;
    bowsprit.parent = this.visual;

    const bowLantern = BABYLON.MeshBuilder.CreateSphere('bowLantern', { diameter: 0.28, segments: 10 }, this.scene);
    bowLantern.material = cabinWinMat;
    bowLantern.position.set(0, 1.32, -7.35);
    bowLantern.parent = this.visual;

    // 7. Twin Sculpted Bronze Aether Thruster Nacelles + Flared Exhaust Bells + Plasma Cones
    this.engineGlow = new BABYLON.TransformNode('engineCluster', this.scene);
    this.engineGlow.position.set(0, 0.08, 3.48);
    this.engineGlow.parent = this.visual;

    const eMat = new BABYLON.StandardMaterial('shipEngineMat', this.scene);
    eMat.emissiveColor = c3('#2ad8c6');
    eMat.disableLighting = true;
    eMat.alpha = 0.45;
    [-0.78, 0.78].forEach((nx, i) => {
      const pod = BABYLON.MeshBuilder.CreateCylinder(
        `pod_${i}`,
        { diameterTop: 0.34, diameterBottom: 0.54, height: 1.55, tessellation: 12 },
        this.scene
      );
      pod.rotation.x = Math.PI / 2;
      pod.position.set(nx, 0.08, 2.7);
      pod.material = brassMat;
      pod.parent = this.visual;

      // Flared dark-iron thruster bell housing
      const bell = BABYLON.MeshBuilder.CreateCylinder(
        `bell_${i}`,
        { diameterTop: 0.36, diameterBottom: 0.56, height: 0.42, tessellation: 12 },
        this.scene
      );
      bell.rotation.x = Math.PI / 2;
      bell.position.set(nx, 0.08, 3.55);
      bell.material = darkIronMat;
      bell.parent = this.visual;

      // Tapered translucent plasma exhaust plume (tucked inside bell when idle)
      const plume = BABYLON.MeshBuilder.CreateCylinder(
        `nozzle_${i}`,
        { diameterTop: 0.04, diameterBottom: 0.32, height: 0.75, tessellation: 12 },
        this.scene
      );
      plume.rotation.x = Math.PI / 2;
      plume.material = eMat;
      plume.position.set(nx, 0.0, 0.25);
      plume.parent = this.engineGlow;
    });

    // 8. 4 Landing Wheels + Struts
    const wheelOffsets = [
      [-1.35, -0.75, -1.3],
      [1.35, -0.75, -1.3],
      [-1.35, -0.75, 1.5],
      [1.35, -0.75, 1.5],
    ];
    wheelOffsets.forEach(([wx, wy, wz], idx) => {
      const strut = new BABYLON.TransformNode(`strut_${idx}`, this.scene);
      strut.position.set(wx * 0.72, -0.35, wz);
      strut.parent = this.visual;

      const leg = BABYLON.MeshBuilder.CreateCylinder(
        `leg_${idx}`,
        { diameter: 0.14, height: 0.9, tessellation: 8 },
        this.scene
      );
      leg.position.set(wx * 0.28, -0.3, 0);
      leg.rotation.z = wx > 0 ? -0.35 : 0.35;
      leg.material = brassMat;
      leg.parent = strut;

      const wheel = BABYLON.MeshBuilder.CreateCylinder(
        `wheel_${idx}`,
        { diameter: 0.95, height: 0.38, tessellation: 16 },
        this.scene
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx * 0.38, wy + 0.1, 0);
      wheel.material = tireMat;
      wheel.parent = strut;

      const hub = BABYLON.MeshBuilder.CreateCylinder(
        `hub_${idx}`,
        { diameter: 0.48, height: 0.42, tessellation: 10 },
        this.scene
      );
      hub.material = brassMat;
      hub.parent = wheel;

      strut.scaling.setAll(0.45);
      strut.position.y = 0.05;

      this.gearStruts.push(strut);
      this.wheels.push(wheel);
    });

    // 9. 3D Cambered Billowing Sails (Woven Parchment PBR, NOT flat neon planes!)
    this.sailMat = new BABYLON.PBRMaterial('sailMat', this.scene);
    const sailTex = createSailTexture(this.scene);
    this.sailMat.albedoTexture = sailTex;
    this.sailMat.metallic = 0.02;
    this.sailMat.roughness = 0.78;
    this.sailMat.backFaceCulling = false;
    this.sailMat.subSurface.isTranslucencyEnabled = true;
    this.sailMat.subSurface.translucencyIntensity = 0.35;

    this.mastPivot = new BABYLON.TransformNode('mastPivot', this.scene);
    this.mastPivot.position.set(0, 0.45, 0.0);
    this.mastPivot.parent = this.visual;

    const createCurvedSail = (name, width, height, camber = 0.62) => {
      const rows = 8;
      const cols = 10;
      const paths = [];
      for (let r = 0; r <= rows; r++) {
        const v = r / rows; // 0 bottom .. 1 top
        const rowTaper = 1.0 - 0.16 * (1 - v); // tapered clews
        const rowBelly = Math.sin(v * Math.PI);
        const path = [];
        for (let c = 0; c <= cols; c++) {
          const u = c / cols; // 0 left .. 1 right
          const x = (u - 0.5) * width * rowTaper;
          // Scalloped foot arch along bottom edge + subtle head sag
          const footArch = Math.sin(u * Math.PI) * height * 0.14 * (1 - v) * (1 - v);
          const y = (v - 0.5) * height + footArch;
          const colBelly = Math.sin(u * Math.PI);
          // Natural vertical cloth pleats/folds caught by wind
          const pleats = Math.sin(u * Math.PI * 7.0) * 0.055 * rowBelly;
          const z = -camber * rowBelly * colBelly + pleats;
          path.push(new BABYLON.Vector3(x, y, z));
        }
        paths.push(path);
      }
      return BABYLON.MeshBuilder.CreateRibbon(
        name,
        { pathArray: paths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: false },
        this.scene
      );
    };

    const buildMast = (zPos, height, widthMain, widthTop) => {
      const mNode = new BABYLON.TransformNode(`mast_${zPos}`, this.scene);
      mNode.position.set(0, 0, zPos);
      mNode.parent = this.mastPivot;

      const pole = BABYLON.MeshBuilder.CreateCylinder(
        `pole_${zPos}`,
        { diameterTop: 0.11, diameterBottom: 0.25, height, tessellation: 10 },
        this.scene
      );
      pole.position.y = height / 2;
      pole.material = woodMat;
      pole.parent = mNode;

      // Crow's nest platform
      const nest = BABYLON.MeshBuilder.CreateCylinder(
        `nest_${zPos}`,
        { diameterTop: 0.85, diameterBottom: 0.62, height: 0.24, tessellation: 10 },
        this.scene
      );
      nest.position.y = height * 0.66;
      nest.material = woodMat;
      nest.parent = mNode;

      const yard1 = BABYLON.MeshBuilder.CreateCylinder(
        `y1_${zPos}`,
        { diameter: 0.11, height: widthMain + 0.6, tessellation: 8 },
        this.scene
      );
      yard1.rotation.z = Math.PI / 2;
      yard1.position.y = height * 0.58;
      yard1.material = woodMat;
      yard1.parent = mNode;

      const yard2 = BABYLON.MeshBuilder.CreateCylinder(
        `y2_${zPos}`,
        { diameter: 0.08, height: widthTop + 0.5, tessellation: 8 },
        this.scene
      );
      yard2.rotation.z = Math.PI / 2;
      yard2.position.y = height * 0.9;
      yard2.material = woodMat;
      yard2.parent = mNode;

      const s1 = createCurvedSail(`s1_${zPos}`, widthMain, height * 0.40, 0.72);
      s1.position.set(0, height * 0.38, -0.05);
      s1.material = this.sailMat;
      s1.parent = mNode;

      const s2 = createCurvedSail(`s2_${zPos}`, widthTop, height * 0.26, 0.50);
      s2.position.set(0, height * 0.76, -0.05);
      s2.material = this.sailMat;
      s2.parent = mNode;

      this.sailMeshes.push(s1, s2);
    };

    buildMast(0.45, 5.5, 4.5, 3.1);
    buildMast(-1.75, 4.3, 3.4, 2.2);

    // Curved Triangular Fore Jib Sail
    const jibPaths = [];
    for (let r = 0; r <= 5; r++) {
      const t = r / 5;
      const y = 0.95 + t * 3.2;
      const zFront = -7.0 + t * 5.25;
      const zBack = -3.6 + t * 1.85;
      const belly = Math.sin(t * Math.PI) * 0.28;
      jibPaths.push([
        new BABYLON.Vector3(0, y, zFront),
        new BABYLON.Vector3(belly, y, (zFront + zBack) * 0.5),
        new BABYLON.Vector3(0, y, zBack),
      ]);
    }
    const jib = BABYLON.MeshBuilder.CreateRibbon(
      'jibSail',
      { pathArray: jibPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      this.scene
    );
    jib.material = this.sailMat;
    jib.parent = this.mastPivot;
    this.sailMeshes.push(jib);

    // Standing Rigging (stays & shrouds)
    const stayLines = [
      [new BABYLON.Vector3(0, 1.32, -7.25), new BABYLON.Vector3(0, 4.6, -1.75), new BABYLON.Vector3(0, 5.85, 0.45), new BABYLON.Vector3(0, 1.25, 3.2)],
      [new BABYLON.Vector3(-1.25, 0.48, 0.35), new BABYLON.Vector3(0, 3.9, 0.45), new BABYLON.Vector3(1.25, 0.48, 0.35)],
      [new BABYLON.Vector3(-1.15, 0.52, -1.75), new BABYLON.Vector3(0, 3.3, -1.75), new BABYLON.Vector3(1.15, 0.52, -1.75)],
    ];
    stayLines.forEach((pts, idx) => {
      const line = BABYLON.MeshBuilder.CreateLines(`rig_${idx}`, { points: pts }, this.scene);
      line.color = c3('#8c6d46');
      line.alpha = 0.78;
      line.parent = this.visual;
    });
    void darkIronMat;
  }

  _buildParticles() {
    const engine = this.scene.getEngine();
    if (!engine || engine instanceof BABYLON.NullEngine) return;
    try {
      const ps = new BABYLON.ParticleSystem('engineTrail', 140, this.scene);
      ps.particleTexture = createSparkTexture(this.scene);
      ps.emitter = this.engineGlow;
      ps.minEmitBox = new BABYLON.Vector3(-0.6, -0.15, 0);
      ps.maxEmitBox = new BABYLON.Vector3(0.6, 0.15, 0);
      ps.color1 = new BABYLON.Color4(0.22, 0.95, 0.85, 0.85);
      ps.color2 = new BABYLON.Color4(0.96, 0.77, 0.32, 0.65);
      ps.colorDead = new BABYLON.Color4(0.1, 0.2, 0.4, 0.0);
      ps.minSize = 0.18;
      ps.maxSize = 0.45;
      ps.minLifeTime = 0.22;
      ps.maxLifeTime = 0.5;
      ps.emitRate = 35;
      ps.minEmitPower = 1;
      ps.maxEmitPower = 3;
      ps.start();
      this.trailPS = ps;
    } catch (_) {}
  }

  _setLandingGear(deployed) {
    for (const s of this.gearStruts) {
      s.scaling.setAll(deployed ? 1.0 : 0.45);
      s.position.y = deployed ? -0.3 : 0.05;
    }
  }

  _bindInputs() {
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    window.addEventListener('mousedown', (e) => {
      if (e.target.id === 'game-canvas') {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });
    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging && !this.dockedPlanet) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        const turnMult = this.upgrades.has('astral_compass') ? 1.3 : 1.0;
        this.angVel.y = clamp(this.angVel.y - dx * 0.0042 * turnMult, -1.8, 1.8);
        this.angVel.x = clamp(this.angVel.x - dy * 0.0036 * turnMult, -1.4, 1.4);
      }
    });
    window.addEventListener('wheel', (e) => {
      if (!this.dockedPlanet) {
        this.sailAngle = clamp(this.sailAngle + Math.sign(e.deltaY) * 0.14, -1.2, 1.2);
      }
    });
  }

  spawnNear(planet) {
    const dir = new BABYLON.Vector3(0.4, 0.85, 0.35).normalize();
    const surfaceR = planet.getSurfaceHeight ? Math.max(planet.seaLevel, planet.getSurfaceHeight(dir)) : planet.radius;
    this.group.position.copyFrom(planet.group.position).addInPlace(dir.scale(surfaceR + 12));
    this.group.lookAt(BABYLON.Vector3.Zero());
    if (!this.group.rotationQuaternion) {
      this.group.rotationQuaternion = BABYLON.Quaternion.FromEulerVector(this.group.rotation);
    }
    this.velocity.copyFrom(planet.velocity);
    this.angVel.set(0, 0, 0);
    this.hull = this.maxHull;
    this.fuel = this.maxFuel;
    this.dockedPlanet = null;
    this.waterPlanet = null;
    this._setLandingGear(false);
  }

  toggleSails() {
    this.sailsFurled = !this.sailsFurled;
    for (const s of this.sailMeshes) {
      s.scaling.y = this.sailsFurled ? 0.12 : 1.0;
    }
  }

  dockOn(planet) {
    this.dockedPlanet = planet;
    this.waterPlanet = null;
    this.driveSpeed = 0;
    this.angVel.set(0, 0, 0);
    this._setLandingGear(true);
    const normal = this.group.position.subtract(planet.group.position).normalize();
    const surfaceR = planet.getSurfaceHeight ? Math.max(planet.seaLevel - 0.2, planet.getSurfaceHeight(normal)) : planet.radius;
    this.group.position.copyFrom(planet.group.position).addInPlace(normal.scale(surfaceR + 1.55));
    this.velocity.copyFrom(planet.velocity);
    this.audio.playDock(false);
  }

  enterWater(planet) {
    this.waterPlanet = planet;
    this.dockedPlanet = null;
    this._setLandingGear(false);
    this.audio.playDock(false);
  }

  /**
   * 4-point Archimedes buoyancy & wave pitch/roll physics on spherical ocean
   */
  updateWater(dt, world, isSailing) {
    const planet = this.waterPlanet;
    if (!planet) return;

    const prevOffset = this.group.position.subtract(planet.prevPos);
    this.group.position.copyFrom(planet.group.position).addInPlace(prevOffset);

    const up = this.group.position.subtract(planet.group.position).normalize();
    const rotMat = new BABYLON.Matrix();
    this.group.rotationQuaternion.toRotationMatrix(rotMat);
    const forward = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat).normalize();
    const right = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(1, 0, 0), rotMat).normalize();

    // 4 hull sample points (bow, stern, port, starboard)
    const sampleOffsets = [
      forward.scale(3.2),
      forward.scale(-2.8),
      right.scale(-1.2),
      right.scale(1.2),
    ];
    const subs = sampleOffsets.map((off) => {
      const worldPt = this.group.position.add(off);
      const rel = worldPt.subtract(planet.group.position);
      const ptR = rel.length();
      const ptDir = rel.scale(1 / Math.max(0.001, ptR));
      const waveH = planet.getWaveHeight(ptDir, world.simTime);
      return clamp(waveH - (ptR - 0.45), 0, 3.0);
    });

    const avgSub = (subs[0] + subs[1] + subs[2] + subs[3]) * 0.25;
    const pitchDiff = subs[0] - subs[1]; // bow vs stern
    const rollDiff = subs[2] - subs[3]; // port vs starboard

    // Buoyancy force along planet normal + water vertical damping
    const relVel = this.velocity.subtract(planet.velocity);
    const vUp = BABYLON.Vector3.Dot(relVel, up);
    const buoyAccel = avgSub * 42.0 - planet.gravity * 0.65 - vUp * 5.2;
    this.velocity.addInPlace(up.scale(buoyAccel * dt));

    if (isSailing) {
      const steer = (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0) -
        (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0);
      if (this.keys['KeyZ']) this.sailAngle = Math.max(-1.2, this.sailAngle - 1.6 * dt);
      if (this.keys['KeyX']) this.sailAngle = Math.min(1.2, this.sailAngle + 1.6 * dt);
      this.mastPivot.rotation.y = this.sailAngle;

      // Tangent forward & steer around planet normal
      const tangentFwd = forward.subtract(up.scale(BABYLON.Vector3.Dot(forward, up)));
      if (tangentFwd.lengthSquared() < 0.001) tangentFwd.set(0, 0, -1);
      tangentFwd.normalize();

      if (steer !== 0) {
        const steerQ = BABYLON.Quaternion.RotationAxis(up, steer * 1.35 * dt);
        const sMat = new BABYLON.Matrix();
        steerQ.toRotationMatrix(sMat);
        BABYLON.Vector3.TransformNormalToRef(tangentFwd, sMat, tangentFwd);
        tangentFwd.normalize();
      }

      // Sail propulsion + water engine thrust
      const accel = (this.keys['KeyW'] ? 1 : 0) - (this.keys['KeyS'] ? 0.6 : 0);
      if (accel !== 0) {
        this.velocity.addInPlace(tangentFwd.scale(accel * 18 * dt));
      }
      if (!this.sailsFurled) {
        this.velocity.addInPlace(tangentFwd.scale(8.5 * dt));
      }

      // Water hydrodynamic drag (strong lateral keel resistance)
      const vFwd = BABYLON.Vector3.Dot(relVel, tangentFwd);
      const tRight = BABYLON.Vector3.Cross(tangentFwd, up).normalize();
      const vLat = BABYLON.Vector3.Dot(relVel, tRight);
      this.velocity.addInPlace(tRight.scale(-vLat * 3.2 * dt));
      this.velocity.addInPlace(tangentFwd.scale(-vFwd * 0.45 * dt));

      // Wave pitch & roll orientation!
      const wavePitch = clamp(pitchDiff * 0.32, -0.35, 0.35);
      const waveRoll = clamp(rollDiff * 0.38 - steer * 0.14, -0.4, 0.4);
      const alignMat = new BABYLON.Matrix();
      BABYLON.Matrix.FromXYZAxesToRef(tRight, up, tangentFwd.scale(-1), alignMat);
      const targetQ = new BABYLON.Quaternion();
      BABYLON.Quaternion.FromRotationMatrixToRef(alignMat, targetQ);
      const waveQ = BABYLON.Quaternion.RotationYawPitchRoll(0, wavePitch, waveRoll);
      targetQ.multiplyInPlace(waveQ);
      BABYLON.Quaternion.SlerpToRef(this.group.rotationQuaternion, targetQ, Math.min(1, dt * 6), this.group.rotationQuaternion);

      // Launch into space on Spacebar
      if (this.keys['Space']) {
        this.waterPlanet = null;
        this.velocity.addInPlace(up.scale(18));
        this.audio.playDock(true);
        return;
      }
    }

    this.group.position.addInPlace(this.velocity.scale(dt));

    // Prevent sinking below seabed
    const newRel = this.group.position.subtract(planet.group.position);
    const newR = newRel.length();
    const newDir = newRel.scale(1 / Math.max(0.001, newR));
    const seabedR = planet.getSurfaceHeight(newDir);
    if (newR < seabedR + 1.2) {
      this.group.position.copyFrom(planet.group.position).addInPlace(newDir.scale(seabedR + 1.2));
    }

    this.fuel = Math.min(this.maxFuel, this.fuel + 10 * dt);
    this.audio.setThrust(false);
    this.audio.setSailWind(this.sailsFurled ? 0 : 0.45, this.sailsFurled);

    if (isSailing) {
      const desiredCam = this.group.position.clone().addInPlace(forward.scale(-14.2)).addInPlace(up.scale(5.2));
      BABYLON.Vector3.LerpToRef(this.camera.position, desiredCam, Math.min(1, dt * 7), this.camera.position);
      BABYLON.Vector3.LerpToRef(this.camera.upVector, up, Math.min(1, dt * 5), this.camera.upVector);
      this.camera.upVector.normalize();
      this.camera.setTarget(this.group.position.add(forward.scale(6)).addInPlace(up.scale(1.6)));
      this.camera.fov = 0.98;
    }
  }

  undock() {
    if (!this.dockedPlanet) return;
    const up = this.group.position.subtract(this.dockedPlanet.group.position).normalize();
    this.velocity.copyFrom(this.dockedPlanet.velocity).addInPlace(up.scale(14));
    this.dockedPlanet = null;
    this.driveSpeed = 0;
    this._setLandingGear(false);
    this.audio.playDock(true);
  }

  updateDrive(dt, world, isDriving) {
    const planet = this.dockedPlanet;
    if (!planet) return;

    const prevOffset = this.group.position.subtract(planet.prevPos);
    this.group.position.copyFrom(planet.group.position).addInPlace(prevOffset);

    const up = this.group.position.subtract(planet.group.position).normalize();
    const rotMat = new BABYLON.Matrix();
    this.group.rotationQuaternion.toRotationMatrix(rotMat);
    const curFwd = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat);

    const tangentFwd = curFwd.subtract(up.scale(BABYLON.Vector3.Dot(curFwd, up)));
    if (tangentFwd.lengthSquared() < 0.001) tangentFwd.set(0, 0, -1);
    tangentFwd.normalize();
    const tangentRight = BABYLON.Vector3.Cross(tangentFwd, up).normalize();

    if (isDriving) {
      const steer = (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0) -
        (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0);
      if (steer !== 0) {
        const steerQ = BABYLON.Quaternion.RotationAxis(up, steer * 1.85 * dt);
        const sMat = new BABYLON.Matrix();
        steerQ.toRotationMatrix(sMat);
        BABYLON.Vector3.TransformNormalToRef(tangentFwd, sMat, tangentFwd);
        tangentFwd.normalize();
        BABYLON.Vector3.CrossToRef(tangentFwd, up, tangentRight);
        tangentRight.normalize();
      }

      if (this.keys['KeyZ']) this.sailAngle = Math.max(-1.2, this.sailAngle - 1.6 * dt);
      if (this.keys['KeyX']) this.sailAngle = Math.min(1.2, this.sailAngle + 1.6 * dt);
      this.mastPivot.rotation.y = this.sailAngle;

      const accel = (this.keys['KeyW'] ? 1 : 0) - (this.keys['KeyS'] ? 1 : 0);
      if (accel !== 0) {
        this.driveSpeed = clamp(this.driveSpeed + accel * 18 * dt, -11, 19);
      } else {
        this.driveSpeed *= Math.pow(0.18, dt);
      }

      this.group.position.addInPlace(tangentFwd.scale(this.driveSpeed * dt));
      const newUp = this.group.position.subtract(planet.group.position).normalize();
      const groundR = planet.getSurfaceHeight
        ? Math.max(planet.seaLevel - 0.15, planet.getSurfaceHeight(newUp))
        : planet.radius;
      this.group.position.copyFrom(planet.group.position).addInPlace(newUp.scale(groundR + 1.55));

      for (const w of this.wheels) {
        w.rotation.x += this.driveSpeed * 1.8 * dt;
      }

      if (this.keys['Space']) {
        this.undock();
        return;
      }
    }

    const alignMat = new BABYLON.Matrix();
    BABYLON.Matrix.FromXYZAxesToRef(tangentRight, up, tangentFwd.scale(-1), alignMat);
    BABYLON.Quaternion.FromRotationMatrixToRef(alignMat, this.group.rotationQuaternion);
    this.visual.rotation.z = 0;

    this.fuel = Math.min(this.maxFuel, this.fuel + 14 * dt);
    this.velocity.copyFrom(planet.velocity).addInPlace(tangentFwd.scale(this.driveSpeed));
    this.audio.setThrust(false);
    this.audio.setSailWind(0, true);

    if (isDriving) {
      const desiredCam = this.group.position
        .clone()
        .addInPlace(tangentFwd.scale(-13.0))
        .addInPlace(up.scale(5.0));
      BABYLON.Vector3.LerpToRef(this.camera.position, desiredCam, Math.min(1, dt * 8), this.camera.position);
      BABYLON.Vector3.LerpToRef(this.camera.upVector, up, Math.min(1, dt * 6), this.camera.upVector);
      this.camera.upVector.normalize();
      this.camera.setTarget(this.group.position.add(tangentFwd.scale(6)).addInPlace(up.scale(1.6)));
      this.camera.fov = 1.0;
    }
  }

  update(dt, world, mode, onToast) {
    if (this.stormHitCooldown > 0) this.stormHitCooldown -= dt;
    if (this.impactCooldown > 0) this.impactCooldown -= dt;

    if (this.dockedPlanet) {
      this.updateDrive(dt, world, mode === 'drive');
      return;
    }

    if (this.waterPlanet) {
      this.updateWater(dt, world, mode === 'water');
      return;
    }

    if (mode !== 'ship') return;

    const effectiveMass = this.mass * (this.upgrades.has('storm_rigging') ? 1.25 : 1.0);
    const turnMult = this.upgrades.has('astral_compass') ? 1.3 : 1.0;

    // 1. Rotational Inertia (6-DOF: yaw, pitch, roll with smooth stabilization)
    const yawInput =
      (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0) -
      (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0);
    const pitchInput =
      (this.keys['ArrowUp'] ? 1 : 0) - (this.keys['ArrowDown'] ? 1 : 0);
    const rollInput = (this.keys['KeyQ'] ? 1 : 0) - (this.keys['KeyR'] ? 1 : 0);

    this.angVel.y += yawInput * 2.4 * turnMult * dt;
    this.angVel.x += pitchInput * 2.0 * turnMult * dt;
    this.angVel.z += rollInput * 2.2 * turnMult * dt;

    // Smooth angular stabilization damping
    this.angVel.scaleInPlace(Math.pow(0.09, dt));

    const deltaQ = BABYLON.Quaternion.RotationYawPitchRoll(
      this.angVel.y * dt,
      this.angVel.x * dt,
      this.angVel.z * dt
    );
    this.group.rotationQuaternion.multiplyInPlace(deltaQ).normalize();

    if (this.keys['KeyZ']) this.sailAngle = Math.max(-1.2, this.sailAngle - 1.6 * dt);
    if (this.keys['KeyX']) this.sailAngle = Math.min(1.2, this.sailAngle + 1.6 * dt);
    this.mastPivot.rotation.y = this.sailAngle;

    const rotMat = new BABYLON.Matrix();
    this.group.rotationQuaternion.toRotationMatrix(rotMat);
    const forward = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rotMat).normalize();
    const right = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(1, 0, 0), rotMat).normalize();
    const up = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 1, 0), rotMat).normalize();

    // 2. Apparent Wind (Solar Wind + 3D Ether Currents - Ship Velocity)
    const radialWind = this.group.position.clone().normalize().scale(world.starType.windPower);
    const currentVec = world.sampleEtherCurrent(this.group.position);
    this.inCurrent = currentVec.lengthSquared() > 1;
    const trueWind = radialWind.add(currentVec);
    const apparentWind = trueWind.subtract(this.velocity);
    this.apparentWindSpeed = apparentWind.length();

    const windDir = this.apparentWindSpeed > 0.05
      ? apparentWind.clone().scale(1 / this.apparentWindSpeed)
      : forward.clone();

    this.apparentWindAngle = Math.atan2(
      BABYLON.Vector3.Dot(windDir, right),
      BABYLON.Vector3.Dot(windDir, forward)
    );

    // 3. Sail Aerodynamics: Lift & Drag + Visual Billowing
    const sailLocalNormal = new BABYLON.Vector3(Math.sin(this.sailAngle), 0, Math.cos(this.sailAngle));
    const sailWorldNormal = BABYLON.Vector3.TransformNormal(sailLocalNormal, rotMat).normalize();

    const netForce = new BABYLON.Vector3();
    let lateralWindPressure = 0;

    if (!this.sailsFurled && this.apparentWindSpeed > 0.1) {
      const cosA = BABYLON.Vector3.Dot(sailWorldNormal, windDir);
      const absCos = Math.abs(cosA);
      const sinA = Math.sqrt(Math.max(0, 1 - absCos * absCos));
      const sailBonus = this.upgrades.has('solar_sails') ? 1.45 : 1.0;

      // Drag along apparent wind
      const dragMag = absCos * this.apparentWindSpeed * 1.15 * sailBonus;
      const dragForce = windDir.scale(dragMag);

      // Lift perpendicular to apparent wind (peaks around ~45 deg angle of attack!)
      const liftDirVec = BABYLON.Vector3.Cross(windDir, up);
      if (liftDirVec.lengthSquared() > 0.001) {
        liftDirVec.normalize();
        // Choose lift sign aligned with sail normal
        if (BABYLON.Vector3.Dot(liftDirVec, sailWorldNormal) < 0) liftDirVec.scaleInPlace(-1);
      }
      const liftMag = 2.0 * absCos * sinA * this.apparentWindSpeed * 1.35 * sailBonus;
      const liftForce = liftDirVec.scale(liftMag);

      const sailForce = dragForce.addInPlace(liftForce);
      netForce.addInPlace(sailForce);

      this.sailEfficiency = clamp((absCos * 0.55 + 2 * absCos * sinA * 0.65), 0, 1);
      this.liftRatio = clamp(2 * absCos * sinA, 0, 1);
      lateralWindPressure = BABYLON.Vector3.Dot(sailForce, right);

      // Billow sails visually based on wind catch
      const billow = 1 + this.sailEfficiency * 0.35;
      for (const s of this.sailMeshes) {
        s.scaling.z = billow;
      }
    } else {
      this.sailEfficiency = 0;
      this.liftRatio = 0;
      for (const s of this.sailMeshes) s.scaling.z = 1;
    }

    const emissiveHex = this.inCurrent ? '#356b66' : this.sailEfficiency > 0.68 ? '#4a3818' : '#18140d';
    this.sailMat.emissiveColor = c3(emissiveHex).scale(0.2 + this.sailEfficiency * 0.45);
    for (const s of this.sailMeshes) {
      s.scaling.z = this.sailsFurled ? 0.25 : 0.78 + this.sailEfficiency * 0.55;
    }
    if (this.gyroRings) {
      this.gyroRings[0].rotation.y += dt * 1.4;
      this.gyroRings[1].rotation.x += dt * 1.1;
    }
    this.audio.setSailWind(this.sailEfficiency, this.sailsFurled);

    // 4. Keel & Ether Medium Interaction (resists leeway/drift, converts to forward stability + heel!)
    const vFwd = BABYLON.Vector3.Dot(this.velocity, forward);
    const vRight = BABYLON.Vector3.Dot(this.velocity, right);
    const vUp = BABYLON.Vector3.Dot(this.velocity, up);

    // Keel strongly damps lateral slip, moderately damps vertical slip, minimally damps forward glide
    netForce.addInPlace(right.scale(-vRight * 2.2));
    netForce.addInPlace(up.scale(-vUp * 1.1));
    netForce.addInPlace(forward.scale(-vFwd * 0.14));

    // Aerodynamic heel + turn banking on visual mesh
    const targetHeel = clamp(-this.angVel.y * 0.36 - lateralWindPressure * 0.008, -0.58, 0.58);
    this.heelAngle = lerp(this.heelAngle, targetHeel, Math.min(1, dt * 5));
    this.visual.rotation.z = this.heelAngle;

    if (this.inCurrent && this.upgrades.has('condenser')) {
      this.fuel = Math.min(this.maxFuel, this.fuel + 16 * dt);
      this.hull = Math.min(this.maxHull, this.hull + 3.5 * dt);
    }

    // 5. Auxiliary Thrusters (gradual inertial acceleration, never instant!)
    const engineMult = this.upgrades.has('pulse_thruster') ? 1.5 : 1.0;
    const isBoost = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight']) && this.upgrades.has('pulse_thruster');
    let thrusting = false;

    if (this.fuel > 0) {
      if (this.keys['KeyW']) {
        netForce.addInPlace(forward.scale((isBoost ? 72 : 42) * engineMult));
        this.fuel = Math.max(0, this.fuel - (isBoost ? 13 : 5.5) * dt);
        thrusting = true;
      }
      if (this.keys['KeyS']) {
        netForce.addInPlace(forward.scale(-30 * engineMult));
        this.fuel = Math.max(0, this.fuel - 4.5 * dt);
        thrusting = true;
      }
      if (this.keys['Space']) {
        netForce.addInPlace(up.scale(34 * engineMult));
        this.fuel = Math.max(0, this.fuel - 4.5 * dt);
        thrusting = true;
      }
      if (this.keys['KeyC']) {
        netForce.addInPlace(up.scale(-34 * engineMult));
        this.fuel = Math.max(0, this.fuel - 4.5 * dt);
        thrusting = true;
      }
    }

    this.engineGlow.scaling.set(1, 1, thrusting ? (isBoost ? 1.8 : 1.15) : 0.18);
    if (this.trailPS) this.trailPS.emitRate = thrusting ? 95 : 22;
    this.audio.setThrust(thrusting, isBoost);

    // 6. Smooth Multi-Body Planetary Gravity (no sudden pops or teleports!)
    this.nearPlanet = null;
    let closestDist = Infinity;

    for (const p of world.planets) {
      const toP = p.group.position.subtract(this.group.position);
      const d = toP.length();
      const wellRadius = p.radius * 2.6;
      if (d < wellRadius) {
        if (d < closestDist) {
          closestDist = d;
          this.nearPlanet = p;
        }
        const dir = toP.normalize();
        // Smooth cubic falloff at gravity well boundary
        const t = clamp(1 - d / wellRadius, 0, 1);
        const smoothPull = p.gravity * effectiveMass * (t * t * (3 - 2 * t)) * 0.7;
        netForce.addInPlace(dir.scale(smoothPull));

        // Gravity Slingshot assist when skimming fast
        if (d > p.radius + 3 && this.velocity.length() > 16) {
          const keelBonus = this.upgrades.has('gravity_keel') ? 1.65 : 1.0;
          netForce.addInPlace(this.velocity.clone().normalize().scale(8.5 * keelBonus));
        }

        // Smooth surface collision (exact terrain height + ocean splashdown!)
        const out = dir.scale(-1);
        const terrainR = p.getSurfaceHeight ? p.getSurfaceHeight(out) : p.radius;
        const isWaterSpot = p.getSurfaceHeight && terrainR < p.seaLevel - 0.35;
        const contactR = isWaterSpot ? p.getWaveHeight(out, world.simTime) + 0.6 : terrainR + 1.65;

        if (d < contactR) {
          const impactSpeed = this.velocity.subtract(p.velocity).length();
          if (isWaterSpot && impactSpeed < 24) {
            this.enterWater(p);
            onToast('🌊 Мягкое приводнение! Паруса на волнах — [Space] для взлёта.');
            return;
          }
          this.group.position.copyFrom(p.group.position).addInPlace(out.scale(contactR + 0.1));
          if (impactSpeed > 22 && this.impactCooldown <= 0) {
            const dmgMult = this.upgrades.has('storm_rigging') ? 0.45 : 1.0;
            this.hull = Math.max(0, this.hull - Math.round((impactSpeed - 18) * 0.9 * dmgMult));
            this.impactCooldown = 0.7;
            this.audio.playImpact();
            onToast('💥 Жёсткое касание! Снижайте скорость перед посадкой.');
          }
          const dot = BABYLON.Vector3.Dot(this.velocity, out);
          if (dot < 0) {
            this.velocity.subtractInPlace(out.scale(1.6 * dot));
          }
          this.velocity.scaleInPlace(0.45).addInPlace(p.velocity.scale(0.55));
        }
      }
    }

    // Gravity Vortex Anomalies
    for (const an of world.anomalies) {
      const toAn = an.pos.subtract(this.group.position);
      const d = toAn.length();
      if (d < an.radius) {
        const dir = toAn.normalize();
        netForce.addInPlace(dir.scale(60 * effectiveMass));
        if (d < 4.5 && this.impactCooldown <= 0) {
          this.hull = Math.max(0, this.hull - 12);
          this.impactCooldown = 1.0;
          this.velocity.copyFrom(dir).scaleInPlace(-45);
          this.audio.playImpact();
          onToast('🌀 Выброс из Гравитационного Вихря!');
        }
      }
    }

    // Debris
    for (const deb of world.debris) {
      if (BABYLON.Vector3.Distance(this.group.position, deb.mesh.position) < 3.2 && this.impactCooldown <= 0) {
        const dmgMult = this.upgrades.has('storm_rigging') ? 0.45 : 1.0;
        this.hull = Math.max(0, this.hull - Math.round(14 * dmgMult));
        this.impactCooldown = 0.8;
        this.audio.playImpact();
        onToast('☄️ Столкновение с астероидом!');
      }
    }

    // Solar Storm
    if (world.stormActive && this.stormHitCooldown <= 0) {
      const distFromStar = this.group.position.length();
      if (Math.abs(distFromStar - world.stormRadius) < 7.5) {
        this.stormHitCooldown = 2.0;
        if (this.sailsFurled) {
          onToast('⛵ Паруса убраны — шторм прошёл без урона!', 2400);
        } else {
          const dmgMult = this.upgrades.has('storm_rigging') ? 0.45 : 1.0;
          this.hull = Math.max(0, this.hull - Math.round(22 * dmgMult));
          this.velocity.addInPlace(this.group.position.clone().normalize().scale(22));
          this.audio.playImpact();
          onToast('🔥 Звёздный шторм ударил в расправленные паруса! Жмите [F]!', 3000);
        }
      }
    }

    // Star core hazard
    if (this.group.position.length() < 19) {
      this.hull = Math.max(0, this.hull - 40 * dt);
      netForce.addInPlace(this.group.position.clone().normalize().scale(120 * effectiveMass));
    }

    // Integrate F = m * a -> dv = (F / m) * dt
    this.velocity.addInPlace(netForce.scale(dt / effectiveMass));
    if (this.velocity.length() > 75) this.velocity.normalize().scaleInPlace(75);
    this.group.position.addInPlace(this.velocity.scale(dt));

    // 7. Smooth Chase Camera (stable up-vector & inertial lag)
    const desiredCam = this.group.position
      .clone()
      .addInPlace(forward.scale(-15.0))
      .addInPlace(up.scale(5.2));
    BABYLON.Vector3.LerpToRef(this.camera.position, desiredCam, Math.min(1, dt * 6.5), this.camera.position);
    BABYLON.Vector3.LerpToRef(this.camera.upVector, up, Math.min(1, dt * 4.5), this.camera.upVector);
    this.camera.upVector.normalize();
    this.camera.setTarget(this.group.position.add(forward.scale(7)).addInPlace(up.scale(1.6)));
    this.camera.fov = 0.98;
  }
}
