import { fbm3 } from './planet.js?v=mission1';
import { createWoodPlankTexture, createRustedMetalTexture, createTerrainDetailTexture } from './textures.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Project Nomads-style Flying Asteroid Base:
 * - Sculpted irregular craggy rock with a terraced upper plateau & rocky underside
 * - Lived-in dieselpunk compound: house, workshop, crane, greenhouse, tanks, pipes, railings, hangar & landing pad
 * - Heavy embedded industrial engines & slow, weighty orbital navigation between planets
 * - Local artificial gravity + exact surface height query for on-foot exploration
 */
export class AsteroidBase {
  constructor(scene, seedNum = 742) {
    this.scene = scene;
    this.seedNum = seedNum;
    this.id = 'asteroid_base';
    this.name = 'Бродяга';
    this.biomeLabel = 'Летучий астероид-база';
    this.radius = 15;
    this.heat = 0;
    this.integrity = 100;
    this.inAtmosphere = false;

    this.group = new BABYLON.TransformNode('asteroidBaseGroup', scene);
    this.prevPos = new BABYLON.Vector3();
    this.velocity = new BABYLON.Vector3();

    // Navigation & heavy inertial motion
    this.targetPlanet = null;
    this.orbitAngle = 0.85;
    this.orbitDistance = 76;
    this.orbitSpeed = 0.015;
    this.maxSpeed = 24.0;
    this.enginePower = 0;
    this.soiRadius = 38;

    // Key local landmarks (in asteroidBase local space)
    this.plateauY = 3.2;
    this.padLocalPos = new BABYLON.Vector3(5.2, 3.38, 0.0);
    this.hangarLocalPos = new BABYLON.Vector3(9.6, 3.35, 0.0);
    this.houseLocalPos = new BABYLON.Vector3(-6.2, 3.35, -4.6);
    this.workshopLocalPos = new BABYLON.Vector3(-6.4, 3.35, 4.4);
    this.helmLocalPos = new BABYLON.Vector3(-2.6, 3.35, -2.4);
    this.playerSpawnLocal = new BABYLON.Vector3(-1.8, 3.4, -1.6);

    this.engineFlames = [];
    this.engineRotors = [];
    this.flywheels = [];
    this.thrusterPS = null;
    this.antennaNode = null;
    this.beaconMats = [];
    this.colliders = [
      { x: this.houseLocalPos.x, z: this.houseLocalPos.z, r: 2.5 },
      { x: this.workshopLocalPos.x, z: this.workshopLocalPos.z, r: 2.4 },
      { x: -8.9, z: 1.1, r: 1.4 },
      { x: -1.2, z: -8.2, r: 1.9 },
      { x: this.helmLocalPos.x, z: this.helmLocalPos.z, r: 0.9 },
      { x: 2.4, z: -6.6, r: 2.2 },
      { x: this.hangarLocalPos.x + 1.2, z: this.hangarLocalPos.z, r: 2.8 },
    ];

    this._buildRockBody();
    this._buildIndustrialEngines();
    this._buildStructures();
  }

  /**
   * Local surface Y for walking on the asteroid plateau & rocky slopes.
   */
  getLocalSurfaceY(lx, lz) {
    const r = Math.hypot(lx, lz);
    const padDist = Math.hypot(lx - this.padLocalPos.x, lz - this.padLocalPos.z);
    if (padDist < 5.6 && Math.abs(lz) < 4.6) {
      return this.plateauY + 0.16;
    }
    if (r < 12.5) {
      const micro = (fbm3(lx * 0.25, 0, lz * 0.25, this.seedNum + 19, 2) - 0.5) * 0.22;
      return this.plateauY + micro;
    }
    const edgeT = Math.max(0, Math.min(1, (r - 12.5) / 6.0));
    const micro = (fbm3(lx * 0.25, 0, lz * 0.25, this.seedNum + 19, 2) - 0.5) * 0.8;
    return this.plateauY - edgeT * edgeT * 6.5 + micro;
  }

  _buildRockBody() {
    const rock = BABYLON.MeshBuilder.CreateSphere(
      'asteroidBaseRock',
      { diameter: 2, segments: 48, updatable: true },
      this.scene
    );
    const pos = rock.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const cols = new Float32Array((pos.length / 3) * 4);
    const uvs = new Float32Array((pos.length / 3) * 2);
    const dir = new BABYLON.Vector3();

    const cTopMoss = [0.16, 0.22, 0.17];
    const cSandstone = [0.25, 0.25, 0.24];
    const cBasalt = [0.11, 0.13, 0.16];
    const cOchre = [0.29, 0.22, 0.17];

    for (let i = 0; i < pos.length; i += 3) {
      dir.set(pos[i], pos[i + 1], pos[i + 2]).normalize();
      const n1 = fbm3(dir.x * 2.1 + 2.0, dir.y * 2.1 + 1.0, dir.z * 2.1, this.seedNum + 5, 3);
      const n2 = fbm3(dir.x * 4.4, dir.y * 4.4, dir.z * 4.4, this.seedNum + 73, 2);
      const ridge = 1.0 - Math.abs(n2 * 2.0 - 1.0);
      // Deep geological fault fissures running across the rock
      const fault = Math.max(0, 1.0 - Math.abs(fbm3(dir.x * 3.1 + 5, dir.y * 1.4, dir.z * 3.1, this.seedNum + 19, 2) - 0.5) * 14.0);

      // Dramatic floating-island silhouette: wide craggy upper rim, tapered rocky keel
      const keelTaper = dir.y < 0 ? Math.max(0.45, 1.0 + dir.y * 0.42) : 1.0;
      let rx = dir.x * (21.5 + (n1 - 0.5) * 8.2 + (ridge - 0.5) * 1.6 - fault * 2.1) * keelTaper;
      let rz = dir.z * (18.0 + (n1 - 0.5) * 7.2 + (ridge - 0.5) * 1.5 - fault * 1.8) * keelTaper;
      let ry = dir.y * (14.2 + (n1 - 0.5) * 5.0 + (ridge - 0.5) * 1.2);

      // Carve a terraced flat upper plateau for the settlement & runway
      if (dir.y > 0.12) {
        const flatTarget = this.plateauY + (n2 - 0.5) * 0.22;
        const rHoriz = Math.hypot(rx, rz);
        const blend = Math.max(0, Math.min(1, 1.0 - (rHoriz - 12.6) / 5.4));
        ry = ry * (1 - blend) + flatTarget * blend;
      } else {
        // Tapered rocky spire underside
        ry -= Math.abs(dir.y) * (4.2 + n1 * 5.4) + fault * 1.4;
      }

      pos[i] = rx;
      pos[i + 1] = ry;
      pos[i + 2] = rz;
      const vi = i / 3;
      uvs[vi * 2] = Math.atan2(dir.z, dir.x) / (Math.PI * 2) + 0.5;
      uvs[vi * 2 + 1] = Math.asin(Math.max(-1, Math.min(1, dir.y))) / Math.PI + 0.5;

      // Geological strata + dark fault crevices + carved plateau dust
      let col = cSandstone;
      if (ry > this.plateauY - 0.7) {
        col = [
          cSandstone[0] * (1 - n2 * 0.55) + cTopMoss[0] * (n2 * 0.55),
          cSandstone[1] * (1 - n2 * 0.55) + cTopMoss[1] * (n2 * 0.55),
          cSandstone[2] * (1 - n2 * 0.55) + cTopMoss[2] * (n2 * 0.55),
        ];
      } else if (ry < -4.0 || fault > 0.35) {
        col = cBasalt;
      } else if (Math.abs((ry + 2.0) % 4.5) < 1.3 || n1 > 0.54) {
        col = cOchre;
      }

      const shade = (0.72 + ridge * 0.34) * (1.0 - fault * 0.38);
      const ci = (i / 3) * 4;
      cols[ci] = Math.min(1, col[0] * shade);
      cols[ci + 1] = Math.min(1, col[1] * shade);
      cols[ci + 2] = Math.min(1, col[2] * shade);
      cols[ci + 3] = 1.0;
    }

    rock.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    rock.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
    rock.setVerticesData(BABYLON.VertexBuffer.ColorKind, cols);
    const norm = new Float32Array(pos.length);
    BABYLON.VertexData.ComputeNormals(pos, rock.getIndices(), norm);
    rock.updateVerticesData(BABYLON.VertexBuffer.NormalKind, norm);
    rock.refreshBoundingInfo(true);

    const rockDetail = createTerrainDetailTexture(this.scene);
    rockDetail.albedoTex.uScale = 5;
    rockDetail.albedoTex.vScale = 5;
    rockDetail.bumpTex.uScale = 5;
    rockDetail.bumpTex.vScale = 5;
    const rockMat = new BABYLON.PBRMaterial('asteroidBaseRockMat', this.scene);
    rockMat.albedoTexture = rockDetail.albedoTex;
    rockMat.bumpTexture = rockDetail.bumpTex;
    rockMat.bumpTexture.level = 0.65;
    rockMat.albedoColor = c3('#ffffff');
    rockMat.metallic = 0.04;
    rockMat.roughness = 0.90;
    rock.material = rockMat;
    rock.receiveShadows = true;
    rock.parent = this.group;
    this.rockMesh = rock;
  }

  _buildIndustrialEngines() {
    const rustTex = createRustedMetalTexture(this.scene, [74, 82, 86]);
    const ironMat = new BABYLON.PBRMaterial('baseIronMat', this.scene);
    ironMat.albedoTexture = rustTex.albedoTex;
    ironMat.bumpTexture = rustTex.bumpTex;
    ironMat.bumpTexture.level = 0.85;
    ironMat.metallic = 0.72;
    ironMat.roughness = 0.52;

    const copperMat = new BABYLON.PBRMaterial('baseCopperMat', this.scene);
    copperMat.albedoColor = c3('#b67342');
    copperMat.metallic = 0.82;
    copperMat.roughness = 0.36;

    const flameMat = new BABYLON.StandardMaterial('baseEngineFlameMat', this.scene);
    flameMat.emissiveColor = c3('#e88c38');
    flameMat.disableLighting = true;
    flameMat.alpha = 0.28;
    flameMat.alphaMode = BABYLON.Engine.ALPHA_ADD;

    const coreGlowMat = new BABYLON.StandardMaterial('baseEngCoreMat', this.scene);
    coreGlowMat.emissiveColor = c3('#48c8bc');
    coreGlowMat.disableLighting = true;

    // Integrated rock-mounted industrial propulsion nacelles & underside lift thrusters
    const mounts = [
      { pos: [-22.6, 1.4, 2.2], rotX: Math.PI / 2, rotZ: 0.08, scale: 1.35, side: -1, strutX: 5.5 },
      { pos: [22.6, 1.4, 2.2], rotX: Math.PI / 2, rotZ: -0.08, scale: 1.35, side: 1, strutX: -5.5 },
      { pos: [0, 0.2, 19.2], rotX: Math.PI / 2 - 0.12, rotZ: 0, scale: 1.55, side: 0, strutX: 0 },
      { pos: [-8.5, -6.5, 13.2], rotX: Math.PI / 2 - 0.25, rotZ: 0.08, scale: 1.2, side: 0, strutX: 0 },
      { pos: [8.5, -6.5, 13.2], rotX: Math.PI / 2 - 0.25, rotZ: -0.08, scale: 1.2, side: 0, strutX: 0 },
    ];

    mounts.forEach((m, idx) => {
      const pod = new BABYLON.TransformNode(`baseEngine_${idx}`, this.scene);
      pod.position.set(m.pos[0], m.pos[1], m.pos[2]);
      pod.rotation.set(m.rotX, 0, m.rotZ);
      pod.scaling.setAll(m.scale);
      pod.parent = this.group;

      if (m.strutX !== 0) {
        const anchorPlate = BABYLON.MeshBuilder.CreateBox(`baseEngPlate_${idx}`, { width: 1.2, height: 2.6, depth: 2.8 }, this.scene);
        anchorPlate.position.set(m.strutX * 0.78, 0.1, 0.2);
        anchorPlate.material = ironMat;
        anchorPlate.parent = pod;

        const strut = BABYLON.MeshBuilder.CreateBox(`baseEngStrut_${idx}`, { width: 6.2, height: 0.85, depth: 1.5 }, this.scene);
        strut.position.set(m.strutX * 0.52, 0.2, 0);
        strut.material = ironMat;
        strut.parent = pod;

        const brace = BABYLON.MeshBuilder.CreateBox(`baseEngBrace_${idx}`, { width: 6.0, height: 0.42, depth: 0.52 }, this.scene);
        brace.position.set(m.strutX * 0.48, -0.75, 0.5);
        brace.rotation.z = m.side * 0.32;
        brace.material = copperMat;
        brace.parent = pod;

        const pipe = BABYLON.MeshBuilder.CreateCylinder(`baseEngPipe_${idx}`, { diameter: 0.24, height: 5.2, tessellation: 8 }, this.scene);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(m.strutX * 0.48, 0.9, -0.55);
        pipe.material = copperMat;
        pipe.parent = pod;
      } else {
        // Tapered mounting ring & cooling pipes anchoring rear/underside engines into rock
        const collar = BABYLON.MeshBuilder.CreateCylinder(`baseEngCollar_${idx}`, { diameterTop: 2.8, diameterBottom: 2.2, height: 1.8, tessellation: 12 }, this.scene);
        collar.position.set(0, 1.5, -0.4);
        collar.material = ironMat;
        collar.parent = pod;
      }

      const housing = BABYLON.MeshBuilder.CreateCylinder(
        `baseEngHousing_${idx}`,
        { diameterTop: 2.2, diameterBottom: 2.75, height: 4.2, tessellation: 14 },
        this.scene
      );
      housing.material = ironMat;
      housing.parent = pod;

      const band = BABYLON.MeshBuilder.CreateTorus(
        `baseEngCoil_${idx}`,
        { diameter: 3.0, thickness: 0.36, tessellation: 18 },
        this.scene
      );
      band.position.y = -0.5;
      band.material = ironMat;
      band.parent = pod;

      // Steampunk Brass Flywheel on side engines
      if (m.side !== 0) {
        const wheel = BABYLON.MeshBuilder.CreateTorus(`baseEngFlywheel_${idx}`, { diameter: 2.6, thickness: 0.28, tessellation: 16 }, this.scene);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(m.side * 1.45, 0.4, 0);
        wheel.material = copperMat;
        wheel.parent = pod;
        this.flywheels.push(wheel);

        const stack = BABYLON.MeshBuilder.CreateCylinder(`baseEngStack_${idx}`, { diameterTop: 0.65, diameterBottom: 0.48, height: 2.6, tessellation: 10 }, this.scene);
        stack.rotation.x = -Math.PI / 2;
        stack.position.set(0, 0.6, 1.8);
        stack.material = ironMat;
        stack.parent = pod;
      }

      // Ducted lift propeller shroud & 4-blade rotor (no jet thrusters!)
      const shroud = BABYLON.MeshBuilder.CreateTorus(
        `baseEngShroud_${idx}`,
        { diameter: 4.8, thickness: 0.65, tessellation: 18 },
        this.scene
      );
      shroud.position.y = -2.2;
      shroud.material = ironMat;
      shroud.parent = pod;

      const rotorHub = new BABYLON.TransformNode(`baseEngRotor_${idx}`, this.scene);
      rotorHub.parent = pod;
      rotorHub.position.y = -2.2;

      const spinner = BABYLON.MeshBuilder.CreateCylinder(
        `baseEngSpinner_${idx}`,
        { diameterTop: 0.85, diameterBottom: 0.25, height: 1.4, tessellation: 10 },
        this.scene
      );
      spinner.material = copperMat;
      spinner.parent = rotorHub;

      for (let bIdx = 0; bIdx < 4; bIdx++) {
        const blade = BABYLON.MeshBuilder.CreateBox(
          `baseEngBlade_${idx}_${bIdx}`,
          { width: 4.2, height: 0.09, depth: 0.56 },
          this.scene
        );
        blade.parent = rotorHub;
        blade.rotation.y = (bIdx * Math.PI) / 2;
        blade.rotation.x = 0.28;
        blade.material = copperMat;
      }
      this.engineRotors.push(rotorHub);
    });

    // Atmospheric reentry heat shield glow (hidden until asteroid enters a planet's atmosphere)
    this.reentryGlow = BABYLON.MeshBuilder.CreateSphere('baseReentryGlow', { diameter: 34, segments: 18 }, this.scene);
    const reMat = new BABYLON.StandardMaterial('baseReentryMat', this.scene);
    reMat.emissiveColor = c3('#ff5a1f');
    reMat.disableLighting = true;
    reMat.alpha = 0.0;
    reMat.backFaceCulling = false;
    this.reentryGlow.material = reMat;
    this.reentryGlow.parent = this.group;
    this.reentryMat = reMat;
  }

  _buildStructures() {
    const woodTex = createWoodPlankTexture(this.scene);
    const woodMat = new BABYLON.PBRMaterial('baseWoodMat', this.scene);
    woodMat.albedoColor = c3('#caa37a');
    woodMat.albedoTexture = woodTex.albedoTex;
    woodMat.bumpTexture = woodTex.bumpTex;
    woodMat.bumpTexture.level = 0.8;
    woodMat.metallic = 0.04;
    woodMat.roughness = 0.78;

    const rustSteelTex = createRustedMetalTexture(this.scene, [112, 98, 84]);
    const hangarMetalMat = new BABYLON.PBRMaterial('baseHangarMat', this.scene);
    hangarMetalMat.albedoTexture = rustSteelTex.albedoTex;
    hangarMetalMat.bumpTexture = rustSteelTex.bumpTex;
    hangarMetalMat.bumpTexture.level = 0.85;
    hangarMetalMat.metallic = 0.50;
    hangarMetalMat.roughness = 0.62;

    const rustRedTex = createRustedMetalTexture(this.scene, [136, 78, 52]);
    const roofRustMat = new BABYLON.PBRMaterial('baseRoofRustMat', this.scene);
    roofRustMat.albedoTexture = rustRedTex.albedoTex;
    roofRustMat.bumpTexture = rustRedTex.bumpTex;
    roofRustMat.bumpTexture.level = 0.9;
    roofRustMat.metallic = 0.45;
    roofRustMat.roughness = 0.64;

    const darkIronMat = new BABYLON.PBRMaterial('baseDarkIronMat', this.scene);
    darkIronMat.albedoColor = c3('#30353a');
    darkIronMat.metallic = 0.78;
    darkIronMat.roughness = 0.48;

    const winGlowMat = new BABYLON.StandardMaterial('baseWinGlow', this.scene);
    winGlowMat.emissiveColor = c3('#ffb85c');
    winGlowMat.diffuseColor = c3('#ffdba0');

    const glassMat = new BABYLON.PBRMaterial('baseGlassMat', this.scene);
    glassMat.albedoColor = c3('#8cc8c4');
    glassMat.metallic = 0.1;
    glassMat.roughness = 0.15;
    glassMat.alpha = 0.45;

    const Y = this.plateauY;

    // Warm work-lamp over the compound so pad, workshop & hangar stay readable in shadow
    const workLamp = new BABYLON.PointLight('baseWorkLamp', new BABYLON.Vector3(0.5, Y + 6.5, 0), this.scene);
    workLamp.diffuse = c3('#ffc478');
    workLamp.intensity = 1.6;
    workLamp.range = 32;
    workLamp.parent = this.group;

    // 1. Living House with warm lit windows, pitched roof & chimney (compact scale relative to massive rock)
    const house = new BABYLON.TransformNode('baseHouse', this.scene);
    house.position.set(this.houseLocalPos.x, Y, this.houseLocalPos.z);
    house.rotation.y = 0.35;
    house.scaling.setAll(0.84);
    house.parent = this.group;

    const houseBody = BABYLON.MeshBuilder.CreateBox('houseBody', { width: 4.2, height: 2.4, depth: 3.4 }, this.scene);
    houseBody.position.y = 1.2;
    houseBody.material = woodMat;
    houseBody.receiveShadows = true;
    houseBody.parent = house;

    const houseRoof = BABYLON.MeshBuilder.CreateCylinder(
      'houseRoof',
      { diameter: 3.6, height: 4.6, tessellation: 3 },
      this.scene
    );
    houseRoof.rotation.z = Math.PI / 2;
    houseRoof.scaling.set(0.65, 1, 1.15);
    houseRoof.position.y = 2.95;
    houseRoof.material = roofRustMat;
    houseRoof.parent = house;

    const chimney = BABYLON.MeshBuilder.CreateCylinder('houseChimney', { diameter: 0.42, height: 1.8, tessellation: 8 }, this.scene);
    chimney.position.set(-1.1, 3.6, -0.6);
    chimney.material = darkIronMat;
    chimney.parent = house;

    // Warm glowing windows on front & side
    [
      [0.9, 1.35, 1.72, 0],
      [-0.9, 1.35, 1.72, 0],
      [2.12, 1.35, 0.0, Math.PI / 2],
    ].forEach(([wx, wy, wz, ry], idx) => {
      const w = BABYLON.MeshBuilder.CreatePlane(`houseWin_${idx}`, { width: 0.72, height: 0.68 }, this.scene);
      w.position.set(wx, wy, wz);
      w.rotation.y = ry;
      w.material = winGlowMat;
      w.parent = house;
    });

    // 2. Workshop with Crane, Fuel Tanks & Workbench
    const shop = new BABYLON.TransformNode('baseWorkshop', this.scene);
    shop.position.set(this.workshopLocalPos.x, Y, this.workshopLocalPos.z);
    shop.rotation.y = -0.22;
    shop.scaling.setAll(0.84);
    shop.parent = this.group;

    const shopFloor = BABYLON.MeshBuilder.CreateBox('shopFloor', { width: 4.8, height: 0.25, depth: 3.8 }, this.scene);
    shopFloor.position.y = 0.12;
    shopFloor.material = woodMat;
    shopFloor.receiveShadows = true;
    shopFloor.parent = shop;

    // 4 steel corner posts + slanted corrugated roof
    [[-2.1, -1.6], [2.1, -1.6], [-2.1, 1.6], [2.1, 1.6]].forEach(([px, pz], idx) => {
      const post = BABYLON.MeshBuilder.CreateCylinder(`shopPost_${idx}`, { diameter: 0.18, height: 2.7, tessellation: 8 }, this.scene);
      post.position.set(px, 1.35, pz);
      post.material = darkIronMat;
      post.parent = shop;
    });
    const shopRoof = BABYLON.MeshBuilder.CreateBox('shopRoof', { width: 5.2, height: 0.16, depth: 4.2 }, this.scene);
    shopRoof.position.y = 2.75;
    shopRoof.rotation.x = 0.12;
    shopRoof.material = roofRustMat;
    shopRoof.parent = shop;

    // Gantry crane arm extending toward landing pad
    const craneMast = BABYLON.MeshBuilder.CreateCylinder('craneMast', { diameter: 0.28, height: 4.6, tessellation: 8 }, this.scene);
    craneMast.position.set(2.5, 2.3, -1.4);
    craneMast.material = darkIronMat;
    craneMast.parent = shop;

    const craneBoom = BABYLON.MeshBuilder.CreateBox('craneBoom', { width: 3.8, height: 0.22, depth: 0.22 }, this.scene);
    craneBoom.position.set(4.1, 4.3, -1.4);
    craneBoom.rotation.z = 0.18;
    craneBoom.material = roofRustMat;
    craneBoom.parent = shop;

    // 3. Landing Pad & Support Trusses + Arched Hangar Bay
    const pad = BABYLON.MeshBuilder.CreateBox('landingPadDeck', { width: 10.6, height: 0.34, depth: 7.4 }, this.scene);
    pad.position.set(this.padLocalPos.x + 1.2, Y + 0.08, 0);
    pad.material = hangarMetalMat;
    pad.receiveShadows = true;
    pad.parent = this.group;

    // Steel support trusses & rock pilings anchoring the landing deck into the cliff
    [2.5, 6.2, 9.8].forEach((tx, idx) => {
      [-3.1, 3.1].forEach((tz, sIdx) => {
        const piling = BABYLON.MeshBuilder.CreateCylinder(`padPiling_${idx}_${sIdx}`, { diameter: 0.32, height: 3.4, tessellation: 8 }, this.scene);
        piling.position.set(tx, Y - 1.55, tz);
        piling.material = darkIronMat;
        piling.parent = this.group;
      });
      const crossBeam = BABYLON.MeshBuilder.CreateBox(`padTruss_${idx}`, { width: 0.28, height: 0.32, depth: 6.4 }, this.scene);
      crossBeam.position.set(tx, Y - 0.25, 0);
      crossBeam.material = darkIronMat;
      crossBeam.parent = this.group;
    });

    // Overhead industrial pipe linking workshop to hangar (behind landing pad)
    const steamPipe = BABYLON.MeshBuilder.CreateCylinder('baseSteamPipe', { diameter: 0.22, height: 11.5, tessellation: 8 }, this.scene);
    steamPipe.rotation.z = Math.PI / 2;
    steamPipe.position.set(1.5, Y + 2.4, -5.4);
    steamPipe.material = roofRustMat;
    steamPipe.parent = this.group;

    // Wooden planked apron beside pad + iron safety railings
    const walkway = BABYLON.MeshBuilder.CreateBox('baseWalkway', { width: 9.2, height: 0.22, depth: 2.6 }, this.scene);
    walkway.position.set(-1.5, Y + 0.05, 0);
    walkway.material = woodMat;
    walkway.receiveShadows = true;
    walkway.parent = this.group;

    [-1.25, 1.25].forEach((rz, rIdx) => {
      const rail = BABYLON.MeshBuilder.CreateBox(`baseWalkRail_${rIdx}`, { width: 8.6, height: 0.06, depth: 0.06 }, this.scene);
      rail.position.set(-1.5, Y + 0.82, rz);
      rail.material = darkIronMat;
      rail.parent = this.group;
      for (let p = 0; p < 4; p++) {
        const post = BABYLON.MeshBuilder.CreateCylinder(`baseWalkPost_${rIdx}_${p}`, { diameter: 0.06, height: 0.75, tessellation: 6 }, this.scene);
        post.position.set(-5.4 + p * 2.6, Y + 0.45, rz);
        post.material = darkIronMat;
        post.parent = this.group;
      }
    });

    // Warm local lights at the house porch & hangar bay for nighttime readability
    const houseLamp = new BABYLON.PointLight('baseHouseLamp', new BABYLON.Vector3(this.houseLocalPos.x + 1.8, Y + 2.2, this.houseLocalPos.z + 1.8), this.scene);
    houseLamp.diffuse = c3('#ffb862');
    houseLamp.intensity = 2.1;
    houseLamp.range = 14;
    houseLamp.parent = this.group;

    const hangarLamp = new BABYLON.PointLight('baseHangarLamp', new BABYLON.Vector3(this.hangarLocalPos.x - 1.5, Y + 3.2, 0), this.scene);
    hangarLamp.diffuse = c3('#78d8cc');
    hangarLamp.intensity = 1.8;
    hangarLamp.range = 15;
    hangarLamp.parent = this.group;

    // Landing pad edge beacons
    for (let i = 0; i < 6; i++) {
      const bx = 0.8 + i * 1.9;
      [-3.35, 3.35].forEach((bz, sIdx) => {
        const bMat = new BABYLON.StandardMaterial(`padBeaconMat_${i}_${sIdx}`, this.scene);
        bMat.emissiveColor = c3(i === 0 ? '#5cf2c8' : '#ffaa44');
        const beacon = BABYLON.MeshBuilder.CreateCylinder(`padBeacon_${i}_${sIdx}`, { diameter: 0.22, height: 0.28, tessellation: 8 }, this.scene);
        beacon.position.set(bx, Y + 0.35, bz);
        beacon.material = bMat;
        beacon.parent = this.group;
        this.beaconMats.push(bMat);
      });
    }

    // Arched Hangar Shelter at eastern end of pad (large enough for aircraft)
    const hangarNode = new BABYLON.TransformNode('baseHangar', this.scene);
    hangarNode.position.set(this.hangarLocalPos.x + 1.1, Y + 0.25, 0);
    hangarNode.scaling.setAll(1.22);
    hangarNode.parent = this.group;

    for (let r = 0; r < 4; r++) {
      const arch = BABYLON.MeshBuilder.CreateTorus(`hangarArch_${r}`, { diameter: 6.4, thickness: 0.22, tessellation: 18 }, this.scene);
      arch.rotation.y = Math.PI / 2;
      arch.scaling.set(1, 0.72, 1);
      arch.position.set(-1.8 + r * 1.35, 0.4, 0);
      arch.material = darkIronMat;
      arch.parent = hangarNode;
    }
    const hangarShell = BABYLON.MeshBuilder.CreateCylinder(
      'hangarShell',
      { diameter: 6.2, height: 4.5, tessellation: 14, slice: 0.5 },
      this.scene
    );
    hangarShell.rotation.z = Math.PI / 2;
    hangarShell.rotation.x = -Math.PI / 2;
    hangarShell.scaling.set(0.72, 1, 1);
    hangarShell.position.set(0.2, 0.4, 0);
    hangarShell.material = hangarMetalMat;
    hangarShell.parent = hangarNode;

    // 4. Greenhouse / Small Garden
    const gh = new BABYLON.TransformNode('baseGreenhouse', this.scene);
    gh.position.set(-1.2, Y, -8.2);
    gh.parent = this.group;

    const ghBase = BABYLON.MeshBuilder.CreateBox('ghBase', { width: 3.4, height: 0.5, depth: 2.4 }, this.scene);
    ghBase.position.y = 0.25;
    ghBase.material = woodMat;
    ghBase.parent = gh;

    // 4b. Power Generator House & Aether Collector + Street Lamps & Cargo Crates
    const genNode = new BABYLON.TransformNode('basePowerGen', this.scene);
    genNode.position.set(2.4, Y, -6.6);
    genNode.parent = this.group;

    const genBase = BABYLON.MeshBuilder.CreateBox('genBase', { width: 3.6, height: 1.8, depth: 2.6 }, this.scene);
    genBase.position.y = 0.9;
    genBase.material = hangarMetalMat;
    genBase.receiveShadows = true;
    genBase.parent = genNode;

    const genCoreMat = new BABYLON.StandardMaterial('genCoreMat', this.scene);
    genCoreMat.emissiveColor = c3('#4ce8d8');
    genCoreMat.disableLighting = true;
    const genCoil = BABYLON.MeshBuilder.CreateCylinder('genCoil', { diameter: 0.72, height: 2.2, tessellation: 12 }, this.scene);
    genCoil.position.set(0, 2.2, 0);
    genCoil.material = genCoreMat;
    genCoil.parent = genNode;

    [-1.95, 1.95].forEach((fx, fi) => {
      const fw = BABYLON.MeshBuilder.CreateTorus(`genFlywheel_${fi}`, { diameter: 1.65, thickness: 0.22, tessellation: 16 }, this.scene);
      fw.rotation.y = Math.PI / 2;
      fw.position.set(fx, 1.25, 0);
      fw.material = roofRustMat;
      fw.parent = genNode;
      this.flywheels.push(fw);
    });

    const genLight = new BABYLON.PointLight('baseGenLight', new BABYLON.Vector3(2.4, Y + 3.0, -6.0), this.scene);
    genLight.diffuse = c3('#64e8d8');
    genLight.intensity = 1.4;
    genLight.range = 14;
    genLight.parent = this.group;

    // Walkway bridge connecting greenhouse/generator to main apron
    const sideBridge = BABYLON.MeshBuilder.CreateBox('sideBridge', { width: 2.0, height: 0.2, depth: 5.8 }, this.scene);
    sideBridge.position.set(-1.2, Y + 0.06, -4.1);
    sideBridge.material = woodMat;
    sideBridge.receiveShadows = true;
    sideBridge.parent = this.group;

    // Street lanterns along the compound walkway
    const lanternMat = new BABYLON.StandardMaterial('baseLanternMat', this.scene);
    lanternMat.emissiveColor = c3('#ffd288');
    lanternMat.disableLighting = true;
    [
      [-5.2, 1.35],
      [-0.6, -1.35],
      [2.8, -4.6],
    ].forEach(([lx, lz], li) => {
      const pole = BABYLON.MeshBuilder.CreateCylinder(`streetPole_${li}`, { diameter: 0.1, height: 2.4, tessellation: 6 }, this.scene);
      pole.position.set(lx, Y + 1.2, lz);
      pole.material = darkIronMat;
      pole.parent = this.group;
      const bulb = BABYLON.MeshBuilder.CreateSphere(`streetBulb_${li}`, { diameter: 0.28, segments: 8 }, this.scene);
      bulb.position.set(lx, Y + 2.45, lz);
      bulb.material = lanternMat;
      bulb.parent = this.group;
    });

    // Cargo crates & fuel barrels near workshop/pad
    [
      [-4.2, 0.35, 3.1, 0.7],
      [-3.4, 0.28, 3.5, 0.56],
      [0.6, 0.35, -3.7, 0.7],
    ].forEach(([cx, cy, cz, cs], ci) => {
      const crate = BABYLON.MeshBuilder.CreateBox(`baseCrate_${ci}`, { size: cs }, this.scene);
      crate.position.set(cx, Y + cy, cz);
      crate.rotation.y = ci * 0.45;
      crate.material = woodMat;
      crate.receiveShadows = true;
      crate.parent = this.group;
    });

    const ghDome = BABYLON.MeshBuilder.CreateCylinder('ghDome', { diameter: 2.3, height: 3.3, tessellation: 10 }, this.scene);
    ghDome.rotation.z = Math.PI / 2;
    ghDome.position.y = 1.05;
    ghDome.material = glassMat;
    ghDome.parent = gh;

    const plantMat = new BABYLON.PBRMaterial('ghPlantMat', this.scene);
    plantMat.albedoColor = c3('#48a842');
    plantMat.emissiveColor = c3('#123a16');
    plantMat.roughness = 0.72;
    for (let p = 0; p < 4; p++) {
      const bush = BABYLON.MeshBuilder.CreateIcoSphere(`ghPlant_${p}`, { radius: 0.42, subdivisions: 1 }, this.scene);
      bush.position.set(-1.0 + p * 0.65, 0.85, (p % 2 === 0 ? 0.3 : -0.3));
      bush.material = plantMat;
      bush.parent = gh;
    }

    // Warm industrial deck floodlight so buildings, pad & aircraft read clearly
    const deckLamp = new BABYLON.PointLight('baseDeckLight', new BABYLON.Vector3(0, 11.5, -1.5), this.scene);
    deckLamp.diffuse = c3('#ffcf86');
    deckLamp.intensity = 2.4;
    deckLamp.range = 36;
    deckLamp.parent = this.group;

    // 5. Fuel Tanks, Overhead Pipes & Rotating Radio Antenna
    [-9.5, -8.3].forEach((tx, idx) => {
      const tank = BABYLON.MeshBuilder.CreateCylinder(`baseTank_${idx}`, { diameter: 1.1, height: 2.6, tessellation: 12 }, this.scene);
      tank.position.set(tx, Y + 1.3, 1.1);
      tank.material = roofRustMat;
      tank.parent = this.group;
    });

    const pipePath = [
      new BABYLON.Vector3(-8.3, Y + 2.4, 1.1),
      new BABYLON.Vector3(-5.0, Y + 3.8, 1.4),
      new BABYLON.Vector3(0.4, Y + 3.9, 2.8),
      new BABYLON.Vector3(7.2, Y + 0.6, 3.3),
    ];
    const pipe = BABYLON.MeshBuilder.CreateTube('baseFuelPipe', { path: pipePath, radius: 0.11, tessellation: 8 }, this.scene);
    pipe.material = darkIronMat;
    pipe.parent = this.group;

    // Radio / Navigation Antenna Tower
    const antBase = BABYLON.MeshBuilder.CreateCylinder('antTower', { diameterTop: 0.14, diameterBottom: 0.42, height: 5.5, tessellation: 6 }, this.scene);
    antBase.position.set(-3.2, Y + 2.75, -6.5);
    antBase.material = darkIronMat;
    antBase.parent = this.group;

    this.antennaNode = new BABYLON.TransformNode('baseAntennaDish', this.scene);
    this.antennaNode.position.set(-3.2, Y + 5.5, -6.5);
    this.antennaNode.parent = this.group;

    const dish = BABYLON.MeshBuilder.CreateCylinder('antDish', { diameterTop: 1.5, diameterBottom: 0.25, height: 0.45, tessellation: 12 }, this.scene);
    dish.rotation.x = 0.9;
    dish.material = hangarMetalMat;
    dish.parent = this.antennaNode;

    // 6. Helm Console for direct Asteroid Base piloting
    const helm = new BABYLON.TransformNode('baseHelmConsole', this.scene);
    helm.position.set(this.helmLocalPos.x, Y, this.helmLocalPos.z);
    helm.parent = this.group;

    const helmPedestal = BABYLON.MeshBuilder.CreateBox('helmPedestal', { width: 0.85, height: 1.15, depth: 0.65 }, this.scene);
    helmPedestal.position.y = 0.58;
    helmPedestal.material = darkIronMat;
    helmPedestal.parent = helm;

    const helmScreenMat = new BABYLON.StandardMaterial('helmScreenMat', this.scene);
    helmScreenMat.emissiveColor = c3('#38f2d8');
    helmScreenMat.disableLighting = true;
    const helmScreen = BABYLON.MeshBuilder.CreatePlane('helmScreen', { width: 0.68, height: 0.38 }, this.scene);
    helmScreen.position.set(0, 1.18, 0.25);
    helmScreen.rotation.x = -0.65;
    helmScreen.material = helmScreenMat;
    helmScreen.parent = helm;

    const helmWheel = BABYLON.MeshBuilder.CreateTorus('helmWheel', { diameter: 0.62, thickness: 0.08, tessellation: 14 }, this.scene);
    helmWheel.position.set(0, 0.95, 0.4);
    helmWheel.rotation.x = 0.4;
    helmWheel.material = roofRustMat;
    helmWheel.parent = helm;

    // 7. Heavy Engine Thruster Particle Plume
    const ps = new BABYLON.ParticleSystem('baseThrusterPS', 120, this.scene);
    const ptTex = new BABYLON.DynamicTexture('baseJetTex', 32, this.scene, false);
    const ctx = ptTex.getContext();
    const grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
    grad.addColorStop(0, 'rgba(255, 225, 160, 1)');
    grad.addColorStop(0.45, 'rgba(255, 130, 45, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    ptTex.update();
    ps.particleTexture = ptTex;
    ps.emitter = this.engineFlames[0] || this.group;
    ps.minEmitBox = new BABYLON.Vector3(-0.6, -0.4, -0.6);
    ps.maxEmitBox = new BABYLON.Vector3(0.6, 0.2, 0.6);
    ps.color1 = new BABYLON.Color4(1.0, 0.75, 0.35, 0.9);
    ps.color2 = new BABYLON.Color4(1.0, 0.4, 0.15, 0.6);
    ps.colorDead = new BABYLON.Color4(0.2, 0.1, 0.05, 0);
    ps.minSize = 0.45;
    ps.maxSize = 1.25;
    ps.minLifeTime = 0.25;
    ps.maxLifeTime = 0.55;
    ps.emitRate = 28;
    ps.direction1 = new BABYLON.Vector3(-0.4, -1.0, -0.4);
    ps.direction2 = new BABYLON.Vector3(0.4, -1.0, 0.4);
    ps.minEmitPower = 4;
    ps.maxEmitPower = 9;
    ps.start();
    this.thrusterPS = ps;
  }

  /**
   * WorldNavigation: set a target planet for the heavy AsteroidBase to travel/orbit near.
   */
  setTargetPlanet(planet) {
    this.targetPlanet = planet;
    if (planet) {
      this.orbitDistance = planet.radius + 32;
    }
  }

  /**
   * Direct manual piloting of the Asteroid Base between planets.
   */
  pilotForward() {
    const heading = this.group.rotation.y + (this.pilotHeadingOffset ?? 0);
    return new BABYLON.Vector3(Math.sin(heading), 0, Math.cos(heading));
  }

  applyPilotInput(keys, dt) {
    let thrusting = false;
    const turnSpeed = 0.75;
    if (keys['KeyA'] || keys['ArrowLeft']) {
      this.group.rotation.y += turnSpeed * dt;
      thrusting = true;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
      this.group.rotation.y -= turnSpeed * dt;
      thrusting = true;
    }

    const fwd = this.pilotForward();
    const boost = keys['ShiftLeft'] || keys['ShiftRight'] ? 1.85 : 1.0;
    const accel = 15.5 * boost;

    if (keys['KeyW'] || keys['ArrowUp']) {
      this.targetPlanet = null;
      this.velocity.addInPlace(fwd.scale(accel * dt));
      thrusting = true;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      this.targetPlanet = null;
      this.velocity.addInPlace(fwd.scale(-accel * 0.75 * dt));
      thrusting = true;
    }
    if (keys['Space']) {
      this.targetPlanet = null;
      this.velocity.y += accel * 0.7 * dt;
      thrusting = true;
    }
    if (keys['KeyC']) {
      this.targetPlanet = null;
      this.velocity.y -= accel * 0.7 * dt;
      thrusting = true;
    }

    const maxV = this.maxSpeed * boost;
    if (this.velocity.length() > maxV) {
      this.velocity.normalize().scaleInPlace(maxV);
    }
    if (thrusting) {
      this.enginePower = Math.min(1, 0.55 + this.velocity.length() / maxV);
    }
  }

  update(dt, manualKeys = null, world = null) {
    this.prevPos.copyFrom(this.group.position);

    if (this.antennaNode) {
      this.antennaNode.rotation.y += dt * 0.55;
    }

    if (this.targetPlanet) {
      this.orbitAngle += this.orbitSpeed * dt;
      const desired = this.targetPlanet.group.position.add(
        new BABYLON.Vector3(
          Math.cos(this.orbitAngle) * this.orbitDistance,
          12.0,
          Math.sin(this.orbitAngle) * this.orbitDistance
        )
      );
      const toDesired = desired.subtract(this.group.position);
      const dist = toDesired.length();
      const targetVel = dist > 0.5
        ? toDesired.normalize().scale(Math.min(this.maxSpeed, dist * 0.45))
        : this.targetPlanet.velocity.clone();

      // Heavy inertial steering (asteroid feels massive)
      const accel = targetVel.subtract(this.velocity).scale(Math.min(1, dt * 1.1));
      this.velocity.addInPlace(accel);
      this.enginePower = Math.min(1, accel.length() * 0.4 + this.velocity.length() / this.maxSpeed);
    } else {
      this.velocity.scaleInPlace(Math.max(0, 1 - dt * 0.18));
      this.enginePower = Math.max(0.22, this.enginePower - dt * 0.5);
    }

    // Optional manual low-speed correction when piloting asteroid directly
    if (manualKeys) {
      const corrSpeed = 4.5;
      if (manualKeys['KeyI']) this.velocity.z -= corrSpeed * dt;
      if (manualKeys['KeyK']) this.velocity.z += corrSpeed * dt;
      if (manualKeys['KeyJ']) this.velocity.x -= corrSpeed * dt;
      if (manualKeys['KeyL']) this.velocity.x += corrSpeed * dt;
    }

    // Atmospheric Drag, Heating & Reentry Burn-up (prevents clipping into planets!)
    this.inAtmosphere = false;
    let maxAtmo = 0;
    if (world && world.planets) {
      for (const p of world.planets) {
        const rel = this.group.position.subtract(p.group.position);
        const dist = rel.length();
        const atmoOuter = p.radius + 28;
        if (dist < atmoOuter && dist > 0.1) {
          this.inAtmosphere = true;
          const dens = Math.max(0, Math.min(1, (atmoOuter - dist) / 28));
          if (dens > maxAtmo) maxAtmo = dens;
          const relVel = this.velocity.subtract(p.velocity);
          const relSpeed = relVel.length();

          // Strong atmospheric braking drag
          const drag = Math.min(0.95, dens * (0.45 + relSpeed * 0.04) * dt);
          this.velocity.subtractInPlace(relVel.scale(drag));

          // Reentry heating proportional to density & speed
          this.heat = Math.min(100, this.heat + dens * (8 + relSpeed * 1.35) * dt);

          // Prevent passing through solid planetary crust while burning up
          const minSafe = p.radius + 6;
          if (dist < minSafe) {
            const n = rel.scale(1 / dist);
            this.group.position.copyFrom(p.group.position).addInPlace(n.scale(minSafe));
            const vn = BABYLON.Vector3.Dot(relVel, n);
            if (vn < 0) this.velocity.subtractInPlace(n.scale(vn * 1.1));
            this.heat = Math.min(100, this.heat + 28 * dt);
          }
        }
      }
    }

    if (!this.inAtmosphere) {
      this.heat = Math.max(0, this.heat - 14 * dt);
    }
    if (this.heat > 75) {
      this.integrity = Math.max(0, this.integrity - (this.heat - 70) * 0.7 * dt);
    }
    if (this.reentryMat) {
      this.reentryMat.alpha = (this.heat / 100) * 0.58;
    }

    this.group.position.addInPlace(this.velocity.scale(dt));

    // Animate lift propeller rotors & steampunk flywheels smoothly
    for (const rot of this.engineRotors) {
      rot.rotation.y += dt * (8.0 + this.enginePower * 18.0);
    }
    for (const fw of this.flywheels) {
      fw.rotation.x += dt * (2.5 + this.enginePower * 9.0);
    }
    if (this.thrusterPS) {
      this.thrusterPS.emitRate = 0;
    }
  }
}
