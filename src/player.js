import { styleNomadHero } from './nomadHeroLook.js?v=mission1';
import { createSparkTexture } from './textures.js?v=mission1';
import { resolveCameraCollision } from './graphics.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Attaches vintage brass aviator goggles, leather strap, and a sculpted beard + mustache
 * directly to the character's Head bone so they animate seamlessly with all poses.
 */
export function attachHeroAviatorGear(scene, res) {
  if (!scene || !res) return;
  const headBone = res.skeletons?.[0]?.bones?.find((b) => b.name === 'Head');
  const headNode = headBone?.getTransformNode() || res.transformNodes?.find((n) => n.name === 'Head');
  if (!headNode) return;

  const gearRoot = new BABYLON.TransformNode('heroAviatorGear', scene);
  gearRoot.parent = headNode;

  // Dark chestnut hair PBR matching eyebrows (linear dark brown)
  const hairMat = new BABYLON.PBRMaterial('heroBeardHairMat', scene);
  hairMat.albedoColor = new BABYLON.Color3(0.055, 0.028, 0.015);
  hairMat.metallic = 0.0;
  hairMat.roughness = 0.92;

  // Sculpted Beard + Handlebar Mustache (Head local: +Y up, +Z forward)
  const chinBeard = BABYLON.MeshBuilder.CreateCylinder('heroChinBeard', { diameterTop: 0.104, diameterBottom: 0.056, height: 0.088, tessellation: 12 }, scene);
  chinBeard.parent = gearRoot;
  chinBeard.position.set(0, -0.024, 0.052);
  chinBeard.rotation.x = -0.18;
  chinBeard.scaling.set(1.0, 1.0, 0.85);
  chinBeard.material = hairMat;

  const jawWrap = BABYLON.MeshBuilder.CreateSphere('heroJawBeard', { diameter: 0.118, segments: 10 }, scene);
  jawWrap.parent = gearRoot;
  jawWrap.position.set(0, 0.002, 0.044);
  jawWrap.scaling.set(1.0, 0.68, 0.88);
  jawWrap.material = hairMat;

  for (const sx of [-1, 1]) {
    const stache = BABYLON.MeshBuilder.CreateCylinder(`heroMustache_${sx}`, { diameterTop: 0.020, diameterBottom: 0.008, height: 0.052, tessellation: 10 }, scene);
    stache.parent = gearRoot;
    stache.position.set(sx * 0.022, 0.018, 0.098);
    stache.rotation.z = sx * 1.25;
    stache.rotation.y = sx * 0.25;
    stache.material = hairMat;
  }
}

export class NavigatorPlayer {
  constructor(scene, camera, audio, { loadVisual = true } = {}) {
    this.scene = scene;
    this.camera = camera;
    this.audio = audio;

    this.group = new BABYLON.TransformNode('navRoot', scene);
    this.group.rotationQuaternion = BABYLON.Quaternion.Identity();
    this.group.metadata = {cameraIgnore: true};
    this.setVisible(false);

    this.velocity = new BABYLON.Vector3();
    this.localPos = new BABYLON.Vector3();
    this.localVel = new BABYLON.Vector3();
    this.up = new BABYLON.Vector3(0, 1, 0);
    this.yaw = 0;
    this.pitch = 0.08;

    this.grounded = false;
    this.currentPlanet = null;
    this.currentAsteroid = null;
    this.scannerActive = false;
    this.visible = false;
    this.animTime = 0;
    this.capeSegs = [];

    this.keys = {};
    this.animGroups = {};
    this.skeletalRoot = null;
    this.activeAnim = 'Idle';
    this._buildModel();
    if (loadVisual) this.loadSkeletalExplorer();
    this._bindInputs();
  }

  setVisible(v) {
    this.visible = v;
    this.group.setEnabled(v);
  }

  _buildModel() {
    this.visual = new BABYLON.TransformNode('navVisual', this.scene);
    this.visual.parent = this.group;

    const suitMat = new BABYLON.PBRMaterial('navSuitMat', this.scene);
    suitMat.albedoColor = c3('#cf5c30'); // classic flight-suit burnt orange
    suitMat.metallic = 0.08;
    suitMat.roughness = 0.65;

    const harnessMat = new BABYLON.PBRMaterial('navHarnessMat', this.scene);
    harnessMat.albedoColor = c3('#262d36'); // dark flight harness & pads
    harnessMat.metallic = 0.25;
    harnessMat.roughness = 0.58;

    const bootMat = new BABYLON.PBRMaterial('navBootMat', this.scene);
    bootMat.albedoColor = c3('#1d2228');
    bootMat.metallic = 0.2;
    bootMat.roughness = 0.6;

    const brassMat = new BABYLON.PBRMaterial('navBrassMat', this.scene);
    brassMat.albedoColor = c3('#d9a54c');
    brassMat.metallic = 0.85;
    brassMat.roughness = 0.26;

    const helmetMat = new BABYLON.PBRMaterial('navHelmetMat', this.scene);
    helmetMat.albedoColor = c3('#d8e0e8'); // crisp retro-space white-silver shell
    helmetMat.metallic = 0.35;
    helmetMat.roughness = 0.28;

    // Torso pivot (for subtle walk bob)
    this.bodyPivot = new BABYLON.TransformNode('navBodyPivot', this.scene);
    this.bodyPivot.position.y = 0.96;
    this.bodyPivot.parent = this.visual;

    const torso = BABYLON.MeshBuilder.CreateCylinder(
      'navTorso',
      { diameterTop: 0.48, diameterBottom: 0.40, height: 0.64, tessellation: 14 },
      this.scene
    );
    torso.scaling.z = 0.72;
    torso.position.y = 0.05;
    torso.material = suitMat;
    torso.parent = this.bodyPivot;

    // Chest harness & brass collar ring
    const collar = BABYLON.MeshBuilder.CreateTorus('navCollar', { diameter: 0.34, thickness: 0.06, tessellation: 16 }, this.scene);
    collar.position.y = 0.36;
    collar.material = brassMat;
    collar.parent = this.bodyPivot;

    const chestPack = BABYLON.MeshBuilder.CreateBox('navChestPack', { width: 0.26, height: 0.22, depth: 0.08 }, this.scene);
    chestPack.position.set(0, 0.14, -0.17);
    chestPack.material = harnessMat;
    chestPack.parent = this.bodyPivot;

    const belt = BABYLON.MeshBuilder.CreateCylinder('navBelt', { diameter: 0.44, height: 0.10, tessellation: 14 }, this.scene);
    belt.scaling.z = 0.75;
    belt.position.y = -0.22;
    belt.material = harnessMat;
    belt.parent = this.bodyPivot;

    // Head + Spherical Astronaut Helmet + Panoramic Gold Visor + Headset
    this.headNode = new BABYLON.TransformNode('navHeadNode', this.scene);
    this.headNode.position.y = 0.56;
    this.headNode.parent = this.bodyPivot;

    const helmet = BABYLON.MeshBuilder.CreateSphere('navHelmet', { diameter: 0.48, segments: 16 }, this.scene);
    helmet.material = helmetMat;
    helmet.parent = this.headNode;

    const visor = BABYLON.MeshBuilder.CreateSphere('navVisor', { diameter: 0.42, segments: 14 }, this.scene);
    const vMat = new BABYLON.PBRMaterial('navVisorMat', this.scene);
    vMat.albedoColor = c3('#f5b43c');
    vMat.emissiveColor = c3('#4a2d08');
    vMat.metallic = 0.92;
    vMat.roughness = 0.12;
    visor.material = vMat;
    visor.scaling.set(0.95, 0.72, 0.78);
    visor.position.set(0, 0.02, -0.11);
    visor.parent = this.headNode;

    // Pilot headset ear-cups + comms antenna
    [-1, 1].forEach((s) => {
      const cup = BABYLON.MeshBuilder.CreateCylinder(`navEar_${s}`, { diameter: 0.14, height: 0.08, tessellation: 10 }, this.scene);
      cup.rotation.z = Math.PI / 2;
      cup.position.set(s * 0.24, 0.0, 0.02);
      cup.material = harnessMat;
      cup.parent = this.headNode;
    });

    const ant = BABYLON.MeshBuilder.CreateCylinder('navAnt', { diameter: 0.022, height: 0.26, tessellation: 6 }, this.scene);
    ant.position.set(0.22, 0.22, 0.04);
    ant.material = brassMat;
    ant.parent = this.headNode;

    // Articulated Left & Right Arms (Shoulder -> Upper Arm -> Elbow Joint -> Forearm -> Glove)
    [-1, 1].forEach((side) => {
      const armPiv = new BABYLON.TransformNode(`navArmPiv_${side}`, this.scene);
      armPiv.position.set(side * 0.30, 0.27, 0);
      armPiv.parent = this.bodyPivot;

      const shoulder = BABYLON.MeshBuilder.CreateSphere(`navShoulder_${side}`, { diameter: 0.16, segments: 10 }, this.scene);
      shoulder.material = harnessMat;
      shoulder.parent = armPiv;

      const upperArm = BABYLON.MeshBuilder.CreateCylinder(`navUpperArm_${side}`, { diameterTop: 0.14, diameterBottom: 0.12, height: 0.26, tessellation: 10 }, this.scene);
      upperArm.position.y = -0.13;
      upperArm.material = suitMat;
      upperArm.parent = armPiv;

      const elbowPiv = new BABYLON.TransformNode(`navElbowPiv_${side}`, this.scene);
      elbowPiv.position.y = -0.26;
      elbowPiv.parent = armPiv;

      const elbowCap = BABYLON.MeshBuilder.CreateSphere(`navElbow_${side}`, { diameter: 0.12, segments: 8 }, this.scene);
      elbowCap.material = harnessMat;
      elbowCap.parent = elbowPiv;

      const forearm = BABYLON.MeshBuilder.CreateCylinder(`navForearm_${side}`, { diameterTop: 0.12, diameterBottom: 0.10, height: 0.24, tessellation: 10 }, this.scene);
      forearm.position.y = -0.12;
      forearm.material = suitMat;
      forearm.parent = elbowPiv;

      const glove = BABYLON.MeshBuilder.CreateSphere(`navGlove_${side}`, { diameter: 0.13, segments: 10 }, this.scene);
      glove.position.y = -0.26;
      glove.material = bootMat;
      glove.parent = elbowPiv;

      if (side < 0) {
        this.armL = armPiv;
        this.elbowL = elbowPiv;
      } else {
        this.armR = armPiv;
        this.elbowR = elbowPiv;
      }
    });

    // Articulated Left & Right Legs (Hip -> Thigh -> Knee Joint -> Shin -> Boot)
    [-1, 1].forEach((side) => {
      const legPiv = new BABYLON.TransformNode(`navLegPiv_${side}`, this.scene);
      legPiv.position.set(side * 0.14, 0.68, 0);
      legPiv.parent = this.visual;

      const thigh = BABYLON.MeshBuilder.CreateCylinder(`navThigh_${side}`, { diameterTop: 0.18, diameterBottom: 0.15, height: 0.28, tessellation: 10 }, this.scene);
      thigh.position.y = -0.14;
      thigh.material = suitMat;
      thigh.parent = legPiv;

      const kneePiv = new BABYLON.TransformNode(`navKneePiv_${side}`, this.scene);
      kneePiv.position.y = -0.28;
      kneePiv.parent = legPiv;

      const knee = BABYLON.MeshBuilder.CreateBox(`navKnee_${side}`, { width: 0.13, height: 0.11, depth: 0.12 }, this.scene);
      knee.position.set(0, 0, -0.02);
      knee.material = harnessMat;
      knee.parent = kneePiv;

      const shin = BABYLON.MeshBuilder.CreateCylinder(`navShin_${side}`, { diameterTop: 0.14, diameterBottom: 0.12, height: 0.26, tessellation: 10 }, this.scene);
      shin.position.y = -0.14;
      shin.material = suitMat;
      shin.parent = kneePiv;

      const bootPiv = new BABYLON.TransformNode(`navAnklePiv_${side}`, this.scene);
      bootPiv.position.set(0, -0.28, 0);
      bootPiv.parent = kneePiv;

      const boot = BABYLON.MeshBuilder.CreateBox(`navBoot_${side}`, { width: 0.15, height: 0.13, depth: 0.27 }, this.scene);
      boot.position.set(0, -0.04, -0.04);
      boot.material = bootMat;
      boot.parent = bootPiv;

      if (side < 0) {
        this.legL = legPiv;
        this.kneeL = kneePiv;
        this.ankleL = bootPiv;
      } else {
        this.legR = legPiv;
        this.kneeR = kneePiv;
        this.ankleR = bootPiv;
      }
    });

    // Multi-segment Flowing Explorer Cape + Shoulder Scarf Collar
    const capeMat = new BABYLON.PBRMaterial('navCapeMat', this.scene);
    capeMat.albedoColor = c3('#942e22');
    capeMat.roughness = 0.85;
    capeMat.backFaceCulling = false;

    const scarf = BABYLON.MeshBuilder.CreateTorus('navScarf', { diameter: 0.44, thickness: 0.09, tessellation: 16 }, this.scene);
    scarf.position.set(0, 0.34, 0.02);
    scarf.rotation.x = 0.18;
    scarf.material = capeMat;
    scarf.parent = this.bodyPivot;

    this.capeSegs = [];
    let capeParent = this.bodyPivot;
    for (let c = 0; c < 3; c++) {
      const segPiv = new BABYLON.TransformNode(`navCapePiv_${c}`, this.scene);
      segPiv.position.set(0, c === 0 ? 0.33 : -0.30, c === 0 ? 0.29 : 0.01);
      segPiv.parent = capeParent;

      const segMesh = BABYLON.MeshBuilder.CreateBox(`navCapeMesh_${c}`, {
        width: 0.40 + c * 0.11,
        height: 0.32,
        depth: 0.012,
      }, this.scene);
      segMesh.position.y = -0.16;
      segMesh.material = capeMat;
      segMesh.parent = segPiv;

      this.capeSegs.push(segPiv);
      capeParent = segPiv;
    }

    // Compact Flight-Pack / Jetpack with Twin Thrusters
    const pack = BABYLON.MeshBuilder.CreateBox('navPack', { width: 0.34, height: 0.44, depth: 0.20 }, this.scene);
    pack.position.set(0, 0.08, 0.23);
    pack.material = helmetMat;
    pack.parent = this.bodyPivot;

    [-0.1, 0.1].forEach((nx, i) => {
      const noz = BABYLON.MeshBuilder.CreateCylinder(`navNoz_${i}`, { diameterTop: 0.08, diameterBottom: 0.11, height: 0.16, tessellation: 8 }, this.scene);
      noz.position.set(nx, -0.18, 0.24);
      noz.material = brassMat;
      noz.parent = this.bodyPivot;
    });

    this.jetFlame = BABYLON.MeshBuilder.CreateCylinder(
      'navFlame',
      { diameterTop: 0.02, diameterBottom: 0.24, height: 0.55, tessellation: 6 },
      this.scene
    );
    const fMat = new BABYLON.StandardMaterial('navFlameMat', this.scene);
    fMat.emissiveColor = c3('#38f2d8');
    fMat.disableLighting = true;
    this.jetFlame.material = fMat;
    this.jetFlame.rotation.x = Math.PI;
    this.jetFlame.position.set(0, -0.28, 0.26);
    this.jetFlame.isVisible = false;
    this.jetFlame.parent = this.bodyPivot;

    const engine = this.scene.getEngine();
    if (engine && !(engine instanceof BABYLON.NullEngine)) {
      try {
        const ps = new BABYLON.ParticleSystem('navJetPS', 80, this.scene);
        ps.particleTexture = createSparkTexture(this.scene);
        ps.emitter = this.jetFlame;
        ps.minEmitBox = new BABYLON.Vector3(-0.1, 0, -0.1);
        ps.maxEmitBox = new BABYLON.Vector3(0.1, 0, 0.1);
        ps.color1 = new BABYLON.Color4(0.25, 0.95, 0.85, 0.9);
        ps.color2 = new BABYLON.Color4(1.0, 0.72, 0.25, 0.8);
        ps.minSize = 0.08;
        ps.maxSize = 0.22;
        ps.minLifeTime = 0.15;
        ps.maxLifeTime = 0.35;
        ps.emitRate = 0;
        ps.minEmitPower = 1;
        ps.maxEmitPower = 2.5;
        ps.start();
        this.jetPS = ps;
      } catch (_) {}
    }
  }

  loadSkeletalExplorer() {
    if (this.readyPromise || this.scene.isDisposed) return this.readyPromise;
    const eng = this.scene.getEngine();
    if (!BABYLON.SceneLoader || (BABYLON.NullEngine && eng instanceof BABYLON.NullEngine)) return;
    const setupLoaded = (res, isNomadHero) => {
      if (this.scene.isDisposed) return;
      const root = res.meshes[0];
      if (!root) return;
      root.parent = this.group;
      root.position.set(0, 0, 0);
      // nomad_hero.glb faces +Z; rotate PI around Y so forward is -Z (matching player forward)
      root.rotationQuaternion = isNomadHero
        ? BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0)
        : BABYLON.Quaternion.Identity();
      for (const m of res.meshes) {
        m.receiveShadows = true;
        if (m.material) {
          m.material.environmentIntensity = 0.82;
        }
      }
      this.skeletalRoot = root;
      if (isNomadHero) this.heroLook=styleNomadHero(this.scene,res,root);
      if (this.jetFlame) this.jetFlame.parent = this.group;
      if (this.visual) this.visual.setEnabled(false);

      this.animGroups = {};
      this._animWeights = {};
      const allowedNames = new Set(['Idle_Loop', 'Idle', 'Walk_Loop', 'Walk', 'Jog_Fwd_Loop', 'Sprint_Loop', 'Run', 'Jump_Loop', 'Jump']);
      for (const ag of res.animationGroups || []) {
        ag.stop();
        if (ag.name === 'Interact') {
          this.interactClip = ag;
          continue;
        }
        // Only register unique locomotion clips; keep A_TPose and utility clips permanently stopped
        if (!allowedNames.has(ag.name) || this.animGroups[ag.name]) continue;
        ag.enableBlending = true;
        ag.blendingSpeed = 0.14;
        const isIdle = ag.name === 'Idle_Loop' || ag.name === 'Idle';
        ag.start(true, 1.0, ag.from, ag.to, false);
        ag.setWeightForAllAnimatables(isIdle ? 1.0 : 0.0);
        this.animGroups[ag.name] = ag;
        this._animWeights[ag.name] = isIdle ? 1.0 : 0.0;
      }
    };

    this.readyPromise = BABYLON.SceneLoader.ImportMeshAsync('', './assets/character/', 'nomad_hero.glb', this.scene)
      .then((res) => setupLoaded(res, true))
      .catch(() => this.scene.isDisposed ? undefined :
        BABYLON.SceneLoader.ImportMeshAsync('', './assets/benchmark/models/character/', 'explorer.glb', this.scene)
          .then((res) => setupLoaded(res, false))
          .catch((err) => {
            console.warn('Skeletal character load failed, using fallback:', err);
          })
      );
  }

  _resolveAnimKey(logicalState) {
    const aliases = {
      Idle: ['Idle_Loop', 'Idle'],
      Walk: ['Walk_Loop', 'Walk'],
      Jog: ['Jog_Fwd_Loop', 'Walk_Loop', 'Walk'],
      Run: ['Sprint_Loop', 'Jog_Fwd_Loop', 'Run'],
      Jump: ['Jump_Loop', 'Jump'],
    };
    const list = aliases[logicalState] || [logicalState];
    for (const k of list) {
      if (this.animGroups[k]) return k;
    }
    return logicalState;
  }

  setAnimState(name) {
    this.activeAnim = name;
    const resolved = this._resolveAnimKey(name);
    for (const [k, ag] of Object.entries(this.animGroups)) {
      const w = k === resolved ? 1.0 : 0.0;
      if (this._animWeights) this._animWeights[k] = w;
      ag.setWeightForAllAnimatables(w);
    }
  }

  pullSwitch() {
    this.switchReach = .95;
    if (this.interactClip) {
      this.interactClip.start(false);
      this.interactClip.setWeightForAllAnimatables(1);
    }
  }

  _animateCharacter(dt, horizSpeed, grounded) {
    this.switchReach = Math.max(0,(this.switchReach || 0)-dt);
    if (this.switchReach && this.interactClip?.isPlaying) {
      for (const ag of Object.values(this.animGroups)) ag.setWeightForAllAnimatables(0);
      return;
    }
    if (!this.switchReach && this.interactClip?.isPlaying) this.interactClip.stop();
    if (this.skeletalRoot && Object.keys(this.animGroups).length > 0) {
      const logical = !grounded
        ? 'Jump'
        : (horizSpeed > 6.6 ? 'Run' : (horizSpeed > 3.6 ? 'Jog' : (horizSpeed > 0.35 ? 'Walk' : 'Idle')));
      this.activeAnim = logical;
      const target = this._resolveAnimKey(logical);
      const blendRate = 1 - Math.exp(-dt * 11.0);
      this._animWeights ||= {};
      let sumW = 0;
      for (const [k, ag] of Object.entries(this.animGroups)) {
        const curW = this._animWeights[k] ?? (k === target ? 1.0 : 0.0);
        const dstW = k === target ? 1.0 : 0.0;
        const nextW = Math.abs(dstW - curW) < 0.004 ? dstW : (curW + (dstW - curW) * blendRate);
        this._animWeights[k] = nextW;
        sumW += nextW;
        // Match playback speed to actual foot travel speed so feet don't skate
        if (k === 'Walk_Loop' || k === 'Walk') {
          ag.speedRatio = Math.max(0.65, Math.min(1.45, horizSpeed / 2.2));
        } else if (k === 'Jog_Fwd_Loop') {
          ag.speedRatio = Math.max(0.78, Math.min(1.32, horizSpeed / 5.0));
        } else if (k === 'Sprint_Loop' || k === 'Run') {
          ag.speedRatio = Math.max(0.85, Math.min(1.35, horizSpeed / 8.0));
        } else {
          ag.speedRatio = 1.0;
        }
      }
      const invSum = sumW > 0.001 ? 1 / sumW : 1;
      for (const [k, ag] of Object.entries(this.animGroups)) {
        ag.setWeightForAllAnimatables((this._animWeights[k] || 0) * invSum);
      }

      // Dynamic secondary motion: turn banking, sprint lean, landing squash & scarf wind
      const yawDelta = this._prevYaw !== undefined ? Math.atan2(Math.sin(this.yaw - this._prevYaw), Math.cos(this.yaw - this._prevYaw)) : 0;
      this._prevYaw = this.yaw;
      const turnRate = clamp(yawDelta / Math.max(0.008, dt), -4.5, 4.5);
      const targetRoll = clamp(-turnRate * 0.055 * Math.min(1, horizSpeed / 3.5), -0.14, 0.14);
      const targetPitch = grounded ? clamp(horizSpeed * 0.012, 0, 0.11) : clamp(-this.localVel.y * 0.018, -0.12, 0.12);
      this._leanRoll = (this._leanRoll || 0) + (targetRoll - (this._leanRoll || 0)) * (1 - Math.exp(-9 * dt));
      this._leanPitch = (this._leanPitch || 0) + (targetPitch - (this._leanPitch || 0)) * (1 - Math.exp(-8 * dt));
      if (grounded && this._wasGrounded === false) {
        this._landSquash = 0.12;
      }
      this._wasGrounded = grounded;
      this._landSquash = Math.max(0, (this._landSquash || 0) - dt * 0.72);
      const squashY = 1 - this._landSquash * 0.55;
      const squashXZ = 1 + this._landSquash * 0.25;
      this.skeletalRoot.scaling.set(squashXZ, squashY, squashXZ);
      this.skeletalRoot.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, this._leanPitch, this._leanRoll);
      this.heroLook?.setMotion?.(horizSpeed, turnRate * 0.35, !grounded);
      return;
    }
    if (!this.legL || !this.legR || !this.armL || !this.armR || !this.bodyPivot) return;
    const spdNorm = Math.min(1, horizSpeed / 9.0);
    if (!grounded) {
      this.animTime += dt * 7.0;
      this.legL.rotation.x = -0.35;
      this.legR.rotation.x = 0.25;
      if (this.kneeL) this.kneeL.rotation.x = 0.75;
      if (this.kneeR) this.kneeR.rotation.x = 0.35;
      this.armL.rotation.x = -0.75;
      this.armR.rotation.x = -0.75;
      if (this.elbowL) this.elbowL.rotation.x = -0.45;
      if (this.elbowR) this.elbowR.rotation.x = -0.45;
      this.bodyPivot.position.y = 0.96;
      this.bodyPivot.rotation.y = 0;
    } else if (horizSpeed > 0.35) {
      this.animTime += dt * (4.8 + horizSpeed * 0.78);
      const s = Math.sin(this.animTime);
      const c = Math.cos(this.animTime);
      this.legL.rotation.x = s * 0.68;
      this.legR.rotation.x = -s * 0.68;
      // Realistic knee bend on swing-back / lift phase
      if (this.kneeL) this.kneeL.rotation.x = Math.max(0, -c) * 1.1;
      if (this.kneeR) this.kneeR.rotation.x = Math.max(0, c) * 1.1;
      this.armL.rotation.x = -s * 0.58;
      this.armR.rotation.x = s * 0.58;
      if (this.elbowL) this.elbowL.rotation.x = -0.55 - Math.max(0, -s) * 0.45;
      if (this.elbowR) this.elbowR.rotation.x = -0.55 - Math.max(0, s) * 0.45;
      this.bodyPivot.position.y = 0.96 + Math.abs(c) * 0.08;
      this.bodyPivot.rotation.y = s * 0.09;
      this.bodyPivot.rotation.x = -0.12 * spdNorm;
      if (this.ankleL) this.ankleL.rotation.x = -s * 0.35;
      if (this.ankleR) this.ankleR.rotation.x = s * 0.35;
      if (this.headNode) {
        this.headNode.rotation.x = 0.1 * spdNorm;
        this.headNode.rotation.y = -s * 0.05;
      }
    } else {
      this.animTime += dt * 2.0;
      const idle = Math.sin(this.animTime) * 0.035;
      this.legL.rotation.x *= 0.8;
      this.legR.rotation.x *= 0.8;
      if (this.kneeL) this.kneeL.rotation.x *= 0.8;
      if (this.kneeR) this.kneeR.rotation.x *= 0.8;
      if (this.ankleL) this.ankleL.rotation.x *= 0.8;
      if (this.ankleR) this.ankleR.rotation.x *= 0.8;
      this.armL.rotation.x = idle;
      this.armR.rotation.x = -idle;
      if (this.elbowL) this.elbowL.rotation.x = -0.18;
      if (this.elbowR) this.elbowR.rotation.x = -0.18;
      this.bodyPivot.position.y = 0.96 + Math.sin(this.animTime * 1.2) * 0.015;
      this.bodyPivot.rotation.y *= 0.8;
      this.bodyPivot.rotation.x *= 0.8;
      if (this.headNode) {
        this.headNode.rotation.y = Math.sin(this.animTime * 0.45) * 0.09;
        this.headNode.rotation.x = Math.sin(this.animTime * 0.7) * 0.03;
      }
    }

    if(this.switchReach){
      const reach=Math.sin(Math.PI*this.switchReach/.95);
      this.armR.rotation.x=reach*1.2;
      if(this.elbowR)this.elbowR.rotation.x=-reach*.55;
    }

    // Flowing cape wave animation
    if (this.capeSegs && this.capeSegs.length === 3) {
      const airLift = grounded ? 0 : 0.45;
      const waveT = this.animTime * (grounded ? 1.2 : 1.8);
      this.capeSegs[0].rotation.x = 0.14 + spdNorm * 0.48 + airLift + Math.sin(waveT) * 0.06;
      this.capeSegs[1].rotation.x = 0.08 + spdNorm * 0.34 + Math.sin(waveT - 1.1) * (0.08 + spdNorm * 0.12);
      this.capeSegs[2].rotation.x = 0.06 + spdNorm * 0.25 + Math.sin(waveT - 2.2) * (0.1 + spdNorm * 0.16);
    }
  }

  _bindInputs() {
    const controller = new AbortController();
    this.scene.onDisposeObservable.addOnce(() => controller.abort());
    const listen = (type, handler) => window.addEventListener(type, handler, {signal:controller.signal});
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    listen('keydown', (e) => {
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
      if (e.target.id === 'game-canvas' && this.visible) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });
    listen('mouseup', () => {
      this.isDragging = false;
    });
    listen('mousemove', (e) => {
      if (this.isDragging && this.visible) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        const sens = this.scannerActive ? 0.0025 : 0.0055;
        this.yaw -= dx * sens;
        this.pitch = clamp(this.pitch + dy * sens, -1.25, 1.35);
      }
    });
  }

  placeOnAsteroid(asteroid, localPos = null) {
    this.currentAsteroid = asteroid;
    this.currentPlanet = null;
    const lp = (localPos || asteroid.playerSpawnLocal).clone();
    lp.y = Math.max(lp.y, asteroid.getLocalSurfaceY(lp.x, lp.z, lp.y));
    if (!localPos) lp.y = asteroid.getLocalSurfaceY(lp.x, lp.z, lp.y);
    this.localPos.copyFrom(lp);
    this.localVel.set(0, 0, 0);
    const cosY = Math.cos(asteroid.group.rotation.y);
    const sinY = Math.sin(asteroid.group.rotation.y);
    const wx = lp.x * cosY + lp.z * sinY;
    const wz = -lp.x * sinY + lp.z * cosY;
    this.group.position.set(asteroid.group.position.x + wx, asteroid.group.position.y + lp.y, asteroid.group.position.z + wz);
    this.velocity.copyFrom(asteroid.velocity);
    this.up.set(0, 1, 0);
    this.grounded = true;
    this.setVisible(true);
  }

  disembarkFromShip(ship) {
    if (ship.dockedAsteroid) {
      const lp = ship.group.position.subtract(ship.dockedAsteroid.group.position).add(new BABYLON.Vector3(-2.6, 0.4, 2.2));
      this.placeOnAsteroid(ship.dockedAsteroid, lp);
      return;
    }
    const planet = ship.dockedPlanet || ship.waterPlanet;
    if (!planet) return;
    this.currentAsteroid = null;
    this.currentPlanet = planet;
    const normal = ship.group.position.subtract(planet.group.position).normalize();
    const tangent = Math.abs(normal.x) > 0.9 ? new BABYLON.Vector3(0, 0, 1) : new BABYLON.Vector3(1, 0, 0);
    const side = BABYLON.Vector3.Cross(normal, tangent).normalize();
    const dropDir = normal.add(side.scale(0.08)).normalize();
    const groundR = planet.getSurfaceHeight
      ? Math.max(planet.seaLevel - 0.3, planet.getSurfaceHeight(dropDir))
      : planet.radius;

    this.group.position
      .copyFrom(planet.group.position)
      .addInPlace(dropDir.scale(groundR + 0.6));
    this.velocity.copyFrom(planet.velocity);
    this.up.copyFrom(dropDir);
    this.grounded = false;
    this.setVisible(true);
  }

  boardShip() {
    this.setVisible(false);
    this.scannerActive = false;
    this.currentAsteroid = null;
  }

  _updateOnAsteroid(dt, ship) {
    const ast = this.currentAsteroid;
    this.up.set(0, 1, 0);

    if (this.keys['ArrowLeft']) this.yaw += 2.2 * dt;
    if (this.keys['ArrowRight']) this.yaw -= 2.2 * dt;
    if (this.keys['ArrowUp']) this.pitch = clamp(this.pitch - 1.4 * dt, -1.25, 1.35);
    if (this.keys['ArrowDown']) this.pitch = clamp(this.pitch + 1.4 * dt, -1.25, 1.35);

    const worldYaw = this.yaw + ast.group.rotation.y;
    const forward = new BABYLON.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new BABYLON.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
    BABYLON.Quaternion.RotationYawPitchRollToRef(worldYaw, 0, 0, this.group.rotationQuaternion);

    const moveFwd = (this.keys['KeyW'] ? 1 : 0) - (this.keys['KeyS'] ? 1 : 0);
    const moveStrafe = (this.keys['KeyD'] ? 1 : 0) - (this.keys['KeyA'] ? 1 : 0);
    const wishDir = forward.scale(moveFwd).addInPlace(right.scale(moveStrafe));
    if (wishDir.lengthSquared() > 0.001) wishDir.normalize();

    // Pure asteroid-local physics + Dieselpunk Jetpack (hold Space in mid-air to ascend between decks!)
    this.jetFuel = this.jetFuel ?? 1.0;
    this.airTime = this.grounded ? 0 : (this.airTime || 0) + dt;
    let jetActive = false;
    this.localVel.y -= 18.0 * dt;
    if (this.grounded) {
      this.jetFuel = Math.min(1.0, this.jetFuel + dt * 0.65);
      const moveSpeed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 9.2 : 5.4;
      if (wishDir.lengthSquared() > 0.001) {
        const accel = 1 - Math.exp(-12 * dt);
        this.localVel.x += (wishDir.x * moveSpeed - this.localVel.x) * accel;
        this.localVel.z += (wishDir.z * moveSpeed - this.localVel.z) * accel;
        this._stepTimer = (this._stepTimer || 0) - dt * (moveSpeed > 7 ? 1.5 : 1.0);
        if (this._stepTimer <= 0) {
          this._stepTimer = 0.42;
          this.audio?.playFootstep?.(moveSpeed > 7);
        }
      } else {
        this.localVel.x = 0;
        this.localVel.z = 0;
        this._stepTimer = 0.1;
      }
      if (this.keys['Space']) {
        this.localVel.y = 9.0;
        this.grounded = false;
        this.airTime = 0.01;
        this.audio?.playJump?.();
      }
    } else {
      const airCtrl = this.keys['Space'] && this.jetFuel > 0.02 ? 17 : 12;
      this.localVel.x += wishDir.x * airCtrl * dt;
      this.localVel.z += wishDir.z * airCtrl * dt;
      // Smooth air drag so jetpack gliding feels crisp and controllable
      const drag = Math.exp(-1.6 * dt);
      this.localVel.x *= drag;
      this.localVel.z *= drag;
      if (this.keys['Space'] && this.airTime > 0.14 && this.jetFuel > 0.02) {
        this.localVel.y = Math.min(13.5, this.localVel.y + 34.0 * dt);
        this.jetFuel = Math.max(0, this.jetFuel - dt * 0.30);
        jetActive = true;
      }
    }

    ast.group.computeWorldMatrix(true);
    // Carry the pre-move foot point with the current island transform before CCD.
    const beforeMove = BABYLON.Vector3.TransformCoordinates(this.localPos,ast.group.getWorldMatrix());
    this.localPos.addInPlace(this.localVel.scale(dt));

    // Solid building & parked aircraft collisions on AsteroidBase
    if (ast.colliders) {
      for (const col of ast.colliders) {
        const dx = this.localPos.x - col.x;
        const dz = this.localPos.z - col.z;
        const d = Math.hypot(dx, dz);
        if (d < col.r && d > 0.001 && this.localPos.y < ast.plateauY + 3.2) {
          const push = col.r / d;
          this.localPos.x = col.x + dx * push;
          this.localPos.z = col.z + dz * push;
        }
      }
    }
    if (ship && ship.dockedAsteroid === ast) {
      const dockLocal = ship._dockLocal || ast.padLocalPos;
      const dx = this.localPos.x - dockLocal.x;
      const dz = this.localPos.z - dockLocal.z;
      const d = Math.hypot(dx, dz);
      if (d < 2.2 && d > 0.001 && Math.abs(this.localPos.y - dockLocal.y) < 3.0) {
        const push = 2.2 / d;
        this.localPos.x = dockLocal.x + dx * push;
        this.localPos.z = dockLocal.z + dz * push;
      }
    }

    // Clamp gently to walkable asteroid plateau, runway & hangar deck
    if (typeof ast.clampWalkPos === 'function') {
      ast.clampWalkPos(this.localPos);
    } else {
      const rXZ = Math.hypot(this.localPos.x, this.localPos.z);
      if (rXZ > 11.5) {
        const k = 11.5 / rXZ;
        this.localPos.x *= k;
        this.localPos.z *= k;
      }
    }
    const surfY = ast.getLocalSurfaceY(this.localPos.x, this.localPos.z, this.localPos.y);
    const descendingStep = this.grounded && !this.keys['Space'] && this.localVel.y <= 0 && this.localPos.y - surfY < .5;
    if (this.localPos.y <= surfY + 0.03 || descendingStep) {
      this.localPos.y = surfY;
      this.localVel.y = Math.max(0, this.localVel.y);
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    // Transform exact asteroid-local position into world coordinates
    const cosY = Math.cos(ast.group.rotation.y);
    const sinY = Math.sin(ast.group.rotation.y);
    const wx = this.localPos.x * cosY + this.localPos.z * sinY;
    const wz = -this.localPos.x * sinY + this.localPos.z * cosY;
    this.group.position.set(ast.group.position.x + wx, ast.group.position.y + this.localPos.y, ast.group.position.z + wz);
    if (this.scene.collisionWorld) {
      const matrix=ast.group.getWorldMatrix(),inv=matrix.clone().invert();
      const floorAt=point=>{
        const local=BABYLON.Vector3.TransformCoordinates(point,inv);
        const surface=ast.getLocalSurfaceY(local.x,local.z,local.y);
        return BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(local.x,surface,local.z),matrix).y;
      };
      const resolved = this.scene.collisionWorld.moveGrounded(beforeMove,this.group.position,{grounded:this.grounded&&!this.keys.Space,floorAt,stepHeight:.36});
      this.localPos.copyFrom(BABYLON.Vector3.TransformCoordinates(resolved, inv));
      this.group.position.copyFrom(resolved);
    }
    this.velocity.copyFrom(ast.velocity).addInPlace(this.localVel);

    const hSpeed = Math.hypot(this.localVel.x, this.localVel.z);
    this._animateCharacter(dt, hSpeed, this.grounded);

    this.jetFlame.isVisible = jetActive;
    if (this.jetPS) this.jetPS.emitRate = jetActive ? 75 : 0;
    const worldFwd = new BABYLON.Vector3(-Math.sin(worldYaw), 0, -Math.cos(worldYaw)).normalize();
    const worldRight = new BABYLON.Vector3(Math.cos(worldYaw), 0, -Math.sin(worldYaw)).normalize();
    const pitchQ = BABYLON.Quaternion.RotationAxis(worldRight, -this.pitch);
    const lookDir = BABYLON.Vector3.TransformNormal(worldFwd, BABYLON.Matrix.FromQuaternionToRef(pitchQ, new BABYLON.Matrix())).normalize();
    const pivotPos = this.group.position.add(new BABYLON.Vector3(0, 1.75, 0));
    const desiredCam = this.group.position.add(new BABYLON.Vector3(0, 2.35, 0)).addInPlace(lookDir.scale(-4.8));
    const safeCam = resolveCameraCollision(this.scene, pivotPos, desiredCam, this.up, (pt) => {
      const dx = pt.x - ast.group.position.x;
      const dz = pt.z - ast.group.position.z;
      const lx = dx * cosY - dz * sinY;
      const lz = dx * sinY + dz * cosY;
      const minY = ast.group.position.y + ast.getLocalSurfaceY(lx, lz, this.localPos.y) + 0.65;
      return pt.y < minY ? new BABYLON.Vector3(pt.x, minY, pt.z) : null;
    }, 1.35);
    if (this.camInited === false) {
      this.camera.position.copyFrom(safeCam);
      this.camera.upVector.copyFrom(this.up);
      this.camInited = true;
    } else {
      BABYLON.Vector3.LerpToRef(this.camera.position, safeCam, 1 - Math.exp(-14 * dt), this.camera.position);
      BABYLON.Vector3.LerpToRef(this.camera.upVector, this.up, 1 - Math.exp(-10 * dt), this.camera.upVector);
    }
    this.camera.setTarget(this.group.position.add(new BABYLON.Vector3(0, 1.85, 0)).addInPlace(lookDir.scale(8)));
    this.camera.fov = 1.02;
  }

  update(dt, ship, simTime = 0) {
    if (!this.visible) return;
    if (this.currentAsteroid) {
      this._updateOnAsteroid(dt, ship);
      return;
    }
    if (!this.currentPlanet) return;
    const planet = this.currentPlanet;

    // Follow planet orbital displacement smoothly
    const prevOffset = this.group.position.subtract(planet.prevPos);
    this.group.position.copyFrom(planet.group.position).addInPlace(prevOffset);

    const targetUp = this.group.position.subtract(planet.group.position).normalize();
    BABYLON.Vector3.LerpToRef(this.up, targetUp, Math.min(1, dt * 10), this.up);
    this.up.normalize();

    const refForward = Math.abs(BABYLON.Vector3.Dot(this.up, new BABYLON.Vector3(0, 0, -1))) > 0.95
      ? new BABYLON.Vector3(1, 0, 0)
      : new BABYLON.Vector3(0, 0, -1);

    const baseRight = BABYLON.Vector3.Cross(refForward, this.up).normalize();
    const baseForward = BABYLON.Vector3.Cross(this.up, baseRight).normalize();

    if (this.keys['ArrowLeft']) this.yaw += 2.2 * dt;
    if (this.keys['ArrowRight']) this.yaw -= 2.2 * dt;
    if (this.keys['ArrowUp']) this.pitch = clamp(this.pitch - 1.4 * dt, -1.25, 1.35);
    if (this.keys['ArrowDown']) this.pitch = clamp(this.pitch + 1.4 * dt, -1.25, 1.35);

    const yawQ = BABYLON.Quaternion.RotationAxis(this.up, this.yaw);
    const yawMat = new BABYLON.Matrix();
    yawQ.toRotationMatrix(yawMat);
    const forward = BABYLON.Vector3.TransformNormal(baseForward, yawMat).normalize();
    const right = BABYLON.Vector3.Cross(this.up, forward).normalize();

    const rotMat = new BABYLON.Matrix();
    BABYLON.Matrix.FromXYZAxesToRef(BABYLON.Vector3.Cross(forward, this.up).normalize(), this.up, forward.scale(-1), rotMat);
    BABYLON.Quaternion.FromRotationMatrixToRef(rotMat, this.group.rotationQuaternion);

    const moveFwd = (this.keys['KeyW'] ? 1 : 0) - (this.keys['KeyS'] ? 1 : 0);
    const moveStrafe = (this.keys['KeyD'] ? 1 : 0) - (this.keys['KeyA'] ? 1 : 0);
    const wishDir = forward.scale(moveFwd).addInPlace(right.scale(moveStrafe));
    if (wishDir.lengthSquared() > 0.001) wishDir.normalize();

    const isJump = !!this.keys['Space'];

    // Spherical gravity
    this.velocity.addInPlace(this.up.scale(-planet.gravity * dt));
    const relVel = this.velocity.subtract(planet.velocity);

    if (this.grounded) {
      const targetHoriz = wishDir.scale(11.5);
      const vertSpeed = BABYLON.Vector3.Dot(relVel, this.up);
      const horizVel = relVel.subtract(this.up.scale(vertSpeed));
      if (wishDir.lengthSquared() < 0.001) {
        horizVel.set(0, 0, 0);
      } else {
        BABYLON.Vector3.LerpToRef(horizVel, targetHoriz, Math.min(1, dt * 14), horizVel);
      }
      relVel.copyFrom(horizVel).addInPlace(this.up.scale(vertSpeed));
      this.velocity.copyFrom(relVel).addInPlace(planet.velocity);

      if (isJump) {
        this.velocity.addInPlace(this.up.scale(13.5));
        this.grounded = false;
        this.audio.playJump();
      }
    } else {
      if (wishDir.lengthSquared() > 0) {
        this.velocity.addInPlace(wishDir.scale(15 * dt));
      }
      if (isJump && ship.fuel > 0) {
        this.velocity.addInPlace(this.up.scale(28 * dt));
        ship.fuel = Math.max(0, ship.fuel - 8 * dt);
      }
    }

    // Apply ONLY relative velocity (planet orbital displacement was already applied via prevOffset)
    const stepRel = this.velocity.subtract(planet.velocity);
    this.group.position.addInPlace(stepRel.scale(dt));

    // Exact terrain & ocean surface clamp + tree trunk collisions!
    const toPlayer = this.group.position.subtract(planet.group.position);
    const dist = toPlayer.length();
    const n = toPlayer.scale(1 / Math.max(0.001, dist));
    const groundR = planet.getSurfaceHeight ? planet.getSurfaceHeight(n) : planet.radius;
    const inWater = planet.getSurfaceHeight && groundR < planet.seaLevel - 0.35;
    const waterR = inWater ? planet.getWaveHeight(n, simTime) : groundR;

    // Tree trunk collision (only check nearby trunks)
    if (planet.treeColliders && planet.treeColliders.length > 0) {
      const angThreshold = 1.6 / Math.max(10, groundR);
      for (const tc of planet.treeColliders) {
        if (Math.abs(n.x - tc.dir.x) < angThreshold && Math.abs(n.z - tc.dir.z) < angThreshold) {
          const arcDist = BABYLON.Vector3.Distance(n, tc.dir) * groundR;
          if (arcDist < tc.radius + 0.45 && arcDist > 0.001) {
            const push = n.subtract(tc.dir).normalize();
            const pushAmt = (tc.radius + 0.45 - arcDist) / groundR;
            const pushedN = n.add(push.scale(pushAmt)).normalize();
            this.group.position.copyFrom(planet.group.position).addInPlace(pushedN.scale(dist));
          }
        }
      }
    }

    // Solid collision with parked aircraft on planet
    if (ship && ship.dockedPlanet === planet) {
      const toShip = this.group.position.subtract(ship.group.position);
      const sd = toShip.length();
      if (sd < 2.3 && sd > 0.01) {
        this.group.position.copyFrom(ship.group.position).addInPlace(toShip.scale(2.3 / sd));
      }
    }

    if (inWater && dist < waterR + 0.25) {
      // Swimming buoyancy in the ocean
      const sub = Math.min(1.5, waterR - dist + 0.4);
      const rv = this.velocity.subtract(planet.velocity);
      const vn = BABYLON.Vector3.Dot(rv, n);
      rv.addInPlace(n.scale((sub * 38 - vn * 4.5) * dt));
      this.velocity.copyFrom(rv).addInPlace(planet.velocity);
      this.grounded = true;
      if (dist < groundR + 0.1) {
        this.group.position.copyFrom(planet.group.position).addInPlace(n.scale(groundR + 0.1));
      }
    } else if (dist <= groundR + 0.08) {
      this.group.position.copyFrom(planet.group.position).addInPlace(n.scale(groundR));
      const rv = this.velocity.subtract(planet.velocity);
      const vn = BABYLON.Vector3.Dot(rv, n);
      if (vn < 0) {
        rv.subtractInPlace(n.scale(vn));
        this.velocity.copyFrom(rv).addInPlace(planet.velocity);
      }
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    const thrusting = !this.grounded && isJump && ship.fuel > 0;
    this.jetFlame.isVisible = thrusting;
    if (this.jetPS) this.jetPS.emitRate = thrusting ? 45 : 0;
    this.audio.setThrust(thrusting, false);

    const rvAnim = this.velocity.subtract(planet.velocity);
    const vRad = BABYLON.Vector3.Dot(rvAnim, this.up);
    const hSpd = rvAnim.subtract(this.up.scale(vRad)).length();
    this._animateCharacter(dt, hSpd, this.grounded);

    // Camera
    const pitchQ = BABYLON.Quaternion.RotationAxis(right, -this.pitch);
    const pitchMat = new BABYLON.Matrix();
    pitchQ.toRotationMatrix(pitchMat);
    const lookDir = BABYLON.Vector3.TransformNormal(forward, pitchMat).normalize();

    if (this.scannerActive) {
      const eyePos = this.group.position.add(this.up.scale(1.8));
      this.camera.position.copyFrom(eyePos);
      this.camera.upVector.copyFrom(this.up);
      this.camera.setTarget(eyePos.add(lookDir.scale(20)));
      this.camera.fov = 0.5;
    } else {
      const pivotPos = this.group.position.add(this.up.scale(1.75));
      const desiredCam = this.group.position.add(this.up.scale(2.35)).addInPlace(lookDir.scale(-4.8));
      const safeCam = resolveCameraCollision(this.scene, pivotPos, desiredCam, this.up, (pt) => {
        const rel = pt.subtract(planet.group.position);
        const dist = rel.length();
        if (dist < 1) return null;
        const unit = rel.scale(1 / dist);
        const minR = planet.getSurfaceHeight(unit) + 0.65;
        return dist < minR ? planet.group.position.add(unit.scale(minR)) : null;
      }, 1.35);
      BABYLON.Vector3.LerpToRef(this.camera.position, safeCam, Math.min(1, dt * 14), this.camera.position);
      BABYLON.Vector3.LerpToRef(this.camera.upVector, this.up, Math.min(1, dt * 10), this.camera.upVector);
      this.camera.upVector.normalize();
      this.camera.setTarget(this.group.position.add(this.up.scale(1.85)).addInPlace(lookDir.scale(8)));
      this.camera.fov = 1.02;
    }
  }
}
