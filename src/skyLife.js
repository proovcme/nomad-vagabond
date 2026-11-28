// Flocks of sky seabirds / albatrosses & windblown foliage across the Sky Archipelago.
export class SkyLife {
  constructor(scene, base, forest) {
    this.scene = scene;
    this.base = base;
    this.forest = forest;
    this.time = 0;
    this.birds = [];
    const B = BABYLON;

    const bodyMat = new B.StandardMaterial('skyBirdBodyMat', scene);
    bodyMat.diffuseColor = B.Color3.FromHexString('#f2ebdc');
    bodyMat.emissiveColor = B.Color3.FromHexString('#4a3e2e');
    bodyMat.specularColor.set(0.1, 0.1, 0.1);
    bodyMat.backFaceCulling = false;

    const wingTipMat = new B.StandardMaterial('skyBirdWingTipMat', scene);
    wingTipMat.diffuseColor = B.Color3.FromHexString('#263d48');
    wingTipMat.emissiveColor = B.Color3.FromHexString('#12222c');
    wingTipMat.specularColor.set(0, 0, 0);
    wingTipMat.backFaceCulling = false;

    const forestPos = forest?.group?.position ? forest.group.position.clone() : new B.Vector3(340, 85, -260);
    const basePos = base?.group?.position ? base.group.position.clone() : new B.Vector3(0, 35, 0);

    // 5 distinct flocks across the archipelago so the sky feels alive everywhere
    const flocks = [
      // Flock 0: Circling Vagabond Bastion & runway approach
      { center: basePos.add(new B.Vector3(12, 34, -28)), count: 5, rMin: 38, rMax: 78, speed: 0.22, scale: 1.35, dir: 1 },
      // Flock 1: Wheeling thermal flock along the flight corridor between Vagabond & Forest Island
      { center: new B.Vector3(165, 82, -135), count: 4, rMin: 55, rMax: 105, speed: 0.18, scale: 1.55, dir: -1 },
      // Flock 2: Soaring over Emerald Cliff (Forest Island) waterfall & ancient ruins
      { center: forestPos.add(new B.Vector3(0, 48, 0)), count: 4, rMin: 46, rMax: 88, speed: 0.20, scale: 1.40, dir: 1 },
      // Flock 3: High-altitude albatrosses gliding above the archipelago
      { center: new B.Vector3(55, 118, -75), count: 3, rMin: 75, rMax: 135, speed: 0.15, scale: 1.85, dir: 1 },
    ];

    // Single master bird mesh instanced across all 16 soaring seabirds (1 draw call instead of 80!)
    const masterBird = new B.Mesh('skyBirdMaster', scene);
    const bvd = new B.VertexData();
    bvd.positions = [
      0, 0.04, -0.95,    -0.22, 0.0, -0.15,   0.22, 0.0, -0.15,
      0, 0.12, -0.10,    -0.32, 0.02, 0.85,   0.32, 0.02, 0.85,
      // Left gull wing (swept graceful dihedral)
      -0.14, 0.03, -0.36, -1.25, 0.18, -0.14, -2.25, 0.04, 0.36, -1.15, 0.08, 0.42, -0.14, 0.02, 0.36,
      // Right gull wing
       0.14, 0.03, -0.36,  1.25, 0.18, -0.14,  2.25, 0.04, 0.36,  1.15, 0.08, 0.42,  0.14, 0.02, 0.36,
    ];
    bvd.indices = [
      0, 1, 3,  0, 3, 2,  0, 2, 1,  1, 4, 3,  3, 4, 5,  3, 5, 2,
      6, 9, 7,  6, 10, 9,  7, 9, 8,
      11, 12, 14,  11, 14, 15,  12, 13, 14,
    ];
    bvd.normals = [];
    B.VertexData.ComputeNormals(bvd.positions, bvd.indices, bvd.normals);
    bvd.applyToMesh(masterBird);
    masterBird.material = bodyMat;
    masterBird.isPickable = false;
    masterBird.setEnabled(false);

    let birdIdx = 0;
    for (const fl of flocks) {
      for (let i = 0; i < fl.count; i++) {
        const idx = birdIdx++;
        const root = masterBird.createInstance(`skyBird_${idx}`);
        root.scaling.setAll(fl.scale * (0.88 + (idx % 4) * 0.08));
        root.isPickable = false;

        const frac = i / Math.max(1, fl.count);
        const radius = fl.rMin + (fl.rMax - fl.rMin) * ((i * 0.618034) % 1);
        this.birds.push({
          root,
          wings: [],
          phase: frac * Math.PI * 2 + idx * 0.73,
          center: fl.center.clone().add(new B.Vector3(0, (i % 5) * 3.2, 0)),
          radius,
          speed: fl.speed * (0.88 + (i % 3) * 0.11),
          dir: fl.dir,
          eccentricity: 0.78 + (idx % 3) * 0.16,
        });
      }
    }

    if (scene.getEngine() instanceof B.NullEngine) return;
    const tex = new B.DynamicTexture('autumnLeafSprite', { width: 64, height: 64 }, scene, false);
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(32, 3); ctx.lineTo(39, 19); ctx.lineTo(54, 10); ctx.lineTo(48, 28);
    ctx.lineTo(62, 32); ctx.lineTo(44, 42); ctx.lineTo(37, 54); ctx.lineTo(33, 44);
    ctx.lineTo(30, 61); ctx.lineTo(28, 43); ctx.lineTo(13, 49); ctx.lineTo(20, 35);
    ctx.lineTo(4, 24); ctx.lineTo(24, 22);
    ctx.closePath();
    ctx.fill();
    tex.update();
    tex.hasAlpha = true;

    const leaves = new B.ParticleSystem('windblownAutumnLeaves', 96, scene);
    leaves.particleTexture = tex;
    leaves.emitter = base.group;
    leaves.isLocal = false;
    leaves.blendMode = B.ParticleSystem.BLENDMODE_STANDARD;
    leaves.minSize = 0.15;
    leaves.maxSize = 0.34;
    leaves.minLifeTime = 4.5;
    leaves.maxLifeTime = 8.0;
    leaves.emitRate = 9;
    leaves.minEmitPower = 0.8;
    leaves.maxEmitPower = 1.8;
    leaves.direction1 = new B.Vector3(1.2, -0.4, -0.3);
    leaves.direction2 = new B.Vector3(2.4, -0.05, 0.8);
    leaves.gravity = new B.Vector3(0.10, -0.11, 0.05);
    leaves.minAngularSpeed = -2.4;
    leaves.maxAngularSpeed = 2.4;
    leaves.minInitialRotation = 0;
    leaves.maxInitialRotation = 6.28;
    leaves.color1 = new B.Color4(1, 0.55, 0.10, 0.92);
    leaves.color2 = new B.Color4(0.38, 0.88, 0.28, 0.85);
    leaves.colorDead = new B.Color4(0.9, 0.38, 0.05, 0);
    let n = 0;
    leaves.startPositionFunction = (_m, p) => {
      const slot = n++ % 3;
      const s = slot === 0
        ? new B.Vector3(-22, 29, -22.5)
        : slot === 1
          ? new B.Vector3(-4, 29, 23.5)
          : new B.Vector3(16, 26, -14.0);
      s.x += (Math.random() - 0.5) * 8;
      s.z += (Math.random() - 0.5) * 8;
      B.Vector3.TransformCoordinatesToRef(s, base.group.getWorldMatrix(), p);
    };
    leaves.start();
    this.leaves = leaves;

    // Sunlit golden floating dust motes / sky pollen drifting gently around the active camera
    const moteTex = new B.DynamicTexture('skySunMoteTex', { width: 32, height: 32 }, scene, false);
    const mCtx = moteTex.getContext();
    mCtx.clearRect(0, 0, 32, 32);
    const mGrad = mCtx.createRadialGradient(16, 16, 1, 16, 16, 15);
    mGrad.addColorStop(0, 'rgba(255, 244, 200, 0.95)');
    mGrad.addColorStop(0.45, 'rgba(255, 214, 130, 0.45)');
    mGrad.addColorStop(1, 'rgba(255, 200, 110, 0)');
    mCtx.fillStyle = mGrad;
    mCtx.fillRect(0, 0, 32, 32);
    moteTex.update();
    moteTex.hasAlpha = true;

    const motes = new B.ParticleSystem('skySunMotes', 140, scene);
    motes.particleTexture = moteTex;
    motes.emitter = new B.Vector3(0, 45, 0);
    motes.isLocal = false;
    motes.blendMode = B.ParticleSystem.BLENDMODE_ADD;
    motes.minSize = 0.08;
    motes.maxSize = 0.24;
    motes.minLifeTime = 3.5;
    motes.maxLifeTime = 6.5;
    motes.emitRate = 24;
    motes.minEmitPower = 0.4;
    motes.maxEmitPower = 1.6;
    motes.direction1 = new B.Vector3(0.8, 0.2, -0.5);
    motes.direction2 = new B.Vector3(1.8, 0.6, 0.6);
    motes.color1 = new B.Color4(1.0, 0.90, 0.62, 0.65);
    motes.color2 = new B.Color4(0.95, 0.82, 0.55, 0.45);
    motes.colorDead = new B.Color4(1.0, 0.78, 0.40, 0);
    motes.startPositionFunction = (_m, p) => {
      const anchor = scene.activeCamera?.position || base.group.position;
      p.set(
        anchor.x + (Math.random() - 0.5) * 90,
        anchor.y + (Math.random() - 0.5) * 45,
        anchor.z + (Math.random() - 0.5) * 90
      );
    };
    motes.start();
    this.motes = motes;

    // 1. Living Interbellum Supply & Mail Airship «Альбатрос» (painted crimson-and-cream zeppelin with props & resupply!)
    const airshipRoot = new B.TransformNode('skySupplyAirshipAlbatross', scene);
    const creamMat = new B.PBRMaterial('albatrossCreamMat', scene);
    creamMat.albedoColor = B.Color3.FromHexString('#dfd2b6');
    creamMat.metallic = 0.12; creamMat.roughness = 0.72;
    const crimsonMat = new B.PBRMaterial('albatrossCrimsonMat', scene);
    crimsonMat.albedoColor = B.Color3.FromHexString('#a83226');
    crimsonMat.metallic = 0.18; crimsonMat.roughness = 0.56;
    const brassMat = new B.PBRMaterial('albatrossBrassMat', scene);
    brassMat.albedoColor = B.Color3.FromHexString('#cfa04e');
    brassMat.metallic = 0.85; brassMat.roughness = 0.28;
    const woodSteelMat = new B.PBRMaterial('albatrossGondolaMat', scene);
    woodSteelMat.albedoColor = B.Color3.FromHexString('#4a3c32');
    woodSteelMat.metallic = 0.42; woodSteelMat.roughness = 0.52;
    const winGlowMat = new B.StandardMaterial('albatrossWindowGlowMat', scene);
    winGlowMat.emissiveColor = B.Color3.FromHexString('#ffd078');
    winGlowMat.disableLighting = true;

    const creamParts = [], crimsonParts = [], brassParts = [], gondolaParts = [], glowParts = [];
    const addP = (arr, m, px, py, pz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
      m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.scaling.set(sx, sy, sz);
      m.computeWorldMatrix(true); arr.push(m);
    };
    // Cigar envelope + crimson aviation bands & tail fins
    addP(creamParts, B.MeshBuilder.CreateSphere('albHull', { diameter: 15, segments: 14 }, scene), 0, 0, 0, 0, 0, 0, 0.86, 0.80, 3.3);
    addP(crimsonParts, B.MeshBuilder.CreateTorus('albBandF', { diameter: 11.4, thickness: 1.4, tessellation: 18 }, scene), 0, 0, -11.5, Math.PI * 0.5, 0, 0, 1.0, 1.0, 0.94);
    addP(crimsonParts, B.MeshBuilder.CreateTorus('albBandR', { diameter: 10.6, thickness: 1.4, tessellation: 18 }, scene), 0, 0, 12.5, Math.PI * 0.5, 0, 0, 1.0, 1.0, 0.94);
    addP(crimsonParts, B.MeshBuilder.CreateBox('albFinV', { width: 0.45, height: 12.5, depth: 9.5 }, scene), 0, 0, 18.5);
    addP(crimsonParts, B.MeshBuilder.CreateBox('albFinH', { width: 12.5, height: 0.45, depth: 9.5 }, scene), 0, 0, 18.5);
    // Brass mooring nose cone + equatorial ribs
    addP(brassParts, B.MeshBuilder.CreateCylinder('albNose', { diameterTop: 0.3, diameterBottom: 3.4, height: 3.6, tessellation: 10 }, scene), 0, 0, -25.2, -Math.PI * 0.5);
    // Underslung Interbellum passenger/supply gondola + warm cabin windows + engine struts
    addP(gondolaParts, B.MeshBuilder.CreateBox('albGondola', { width: 4.6, height: 3.6, depth: 19.0 }, scene), 0, -7.8, -1.0);
    addP(gondolaParts, B.MeshBuilder.CreateBox('albKeel', { width: 2.2, height: 1.6, depth: 26.0 }, scene), 0, -5.8, 0.5);
    for (let wz = -7.5; wz <= 5.5; wz += 2.6) {
      addP(glowParts, B.MeshBuilder.CreateBox(`albWinL_${wz}`, { width: 0.14, height: 1.0, depth: 1.3 }, scene), -2.35, -7.6, wz);
      addP(glowParts, B.MeshBuilder.CreateBox(`albWinR_${wz}`, { width: 0.14, height: 1.0, depth: 1.3 }, scene), 2.35, -7.6, wz);
    }
    // Twin outboard engine nacelles + spinning props
    this._airshipProps = [];
    for (const side of [-1, 1]) {
      addP(gondolaParts, B.MeshBuilder.CreateBox(`albStrut_${side}`, { width: 4.4, height: 0.45, depth: 0.7 }, scene), side * 4.2, -7.4, 2.5);
      addP(brassParts, B.MeshBuilder.CreateCylinder(`albPod_${side}`, { diameterTop: 1.4, diameterBottom: 1.8, height: 4.8, tessellation: 10 }, scene), side * 6.4, -7.4, 2.5, Math.PI * 0.5);
      const prop = B.MeshBuilder.CreateBox(`albProp_${side}`, { width: 3.4, height: 0.36, depth: 0.12 }, scene);
      prop.parent = airshipRoot; prop.position.set(side * 6.4, -7.4, 5.1);
      prop.material = brassMat; prop.isPickable = false;
      this._airshipProps.push(prop);
    }
    const finalizePart = (arr, name, mat) => {
      const m = B.Mesh.MergeMeshes(arr, true, true, undefined, false, false);
      if (m) { m.name = name; m.parent = airshipRoot; m.material = mat; m.isPickable = false; m.checkCollisions = false; }
    };
    finalizePart(creamParts, 'skySupplyAirshipHull', creamMat);
    finalizePart(crimsonParts, 'skySupplyAirshipTrim', crimsonMat);
    finalizePart(brassParts, 'skySupplyAirshipBrass', brassMat);
    finalizePart(gondolaParts, 'skySupplyAirshipGondola', woodSteelMat);
    finalizePart(glowParts, 'skySupplyAirshipWindows', winGlowMat);
    this._horizonBarge = airshipRoot;
    this._supplyCooldown = 0;

    // HUD supply-airship marker (non-intrusive gold anchor icon when within 1200m)
    if (!(scene.getEngine() instanceof B.NullEngine) && typeof document !== 'undefined') {
      this._airshipMarker = document.createElement('div');
      this._airshipMarker.style.cssText = 'position:fixed;transform:translate(-50%,-50%);color:#f6d98c;text-shadow:0 1px 4px #000c;font:600 11px/1.2 sans-serif;white-space:nowrap;pointer-events:none;z-index:21;display:none;';
      document.body.appendChild(this._airshipMarker);
    }

    scene.onDisposeObservable.addOnce(() => { this._airshipMarker?.remove(); });
  }

  update(dt, { playerPos = null, camera = null, isPlaying = false, ship = null, construction = null, ui = null, audio = null } = {}) {
    this.time += dt;
    if (this._supplyCooldown > 0) this._supplyCooldown = Math.max(0, this._supplyCooldown - dt);
    if (this._horizonBarge && !this._horizonBarge.isDisposed()) {
      const a = this.time * 0.032 + 0.7;
      const r = 440;
      const bx = Math.cos(a) * r;
      const bz = Math.sin(a) * r;
      const by = 96 + Math.sin(this.time * 0.42) * 5;
      this._horizonBarge.position.set(bx, by, bz);
      this._horizonBarge.rotation.y = Math.atan2(Math.sin(a), -Math.cos(a));
      for (const p of this._airshipProps || []) p.rotation.z += dt * 22;

      if (isPlaying && playerPos) {
        const dist = BABYLON.Vector3.Distance(playerPos, this._horizonBarge.position);
        if (dist < 78 && this._supplyCooldown <= 0) {
          this._supplyCooldown = 45;
          if (ship) {
            ship.hull = ship.maxHull || 100;
            if (typeof ship.torpedoes === 'number') ship.torpedoes = Math.max(ship.torpedoes, 4);
            if (typeof ship.missiles === 'number') ship.missiles = Math.max(ship.missiles, 8);
          }
          if (construction) {
            construction.addSalvage(35);
            construction.saveState?.();
          }
          audio?.playObjective?.();
          ui?.showToast?.('⚓ Дирижабль «Альбатрос»: борт отремонтирован, боезапас пополнен, +35 лома!', 4600);
        }
        if (this._airshipMarker && camera && dist < 1300) {
          const eng = this.scene.getEngine();
          const w = eng.getRenderWidth(), h = eng.getRenderHeight();
          const proj = BABYLON.Vector3.Project(
            this._horizonBarge.position.add(new BABYLON.Vector3(0, 14, 0)),
            BABYLON.Matrix.Identity(),
            this.scene.getTransformMatrix(),
            camera.viewport.toGlobal(w, h)
          );
          if (proj.z >= 0 && proj.z <= 1 && proj.x > 20 && proj.x < w - 20 && proj.y > 20 && proj.y < h - 20) {
            this._airshipMarker.style.display = 'block';
            this._airshipMarker.style.left = `${proj.x}px`;
            this._airshipMarker.style.top = `${proj.y}px`;
            this._airshipMarker.textContent = `⚓ Снабженец «Альбатрос» · ${Math.round(dist)}м`;
          } else {
            this._airshipMarker.style.display = 'none';
          }
        } else if (this._airshipMarker) {
          this._airshipMarker.style.display = 'none';
        }
      } else if (this._airshipMarker) {
        this._airshipMarker.style.display = 'none';
      }
    }

    for (const bird of this.birds) {
      const angle = this.time * bird.speed * bird.dir + bird.phase;
      const rx = bird.radius;
      const rz = bird.radius * bird.eccentricity;
      const x = Math.cos(angle) * rx;
      const z = Math.sin(angle) * rz;
      const bobY = Math.sin(angle * 2.0 + bird.phase) * 4.2;

      bird.root.position.set(
        bird.center.x + x,
        bird.center.y + bobY,
        bird.center.z + z
      );

      // Tangent velocity vector so bird faces its exact flight direction (-Z forward)
      const vx = -Math.sin(angle) * rx * bird.dir;
      const vz = Math.cos(angle) * rz * bird.dir;
      bird.root.rotation.y = Math.atan2(-vx, -vz);
      bird.root.rotation.z = -bird.dir * 0.22 * (1.0 + 0.35 * Math.cos(angle * 2.0));
      bird.root.rotation.x = Math.cos(angle * 2.0 + bird.phase) * 0.08;

      // Alternate between rhythmic wing-flapping and thermal gliding
      const flapCycle = Math.sin(this.time * 0.85 + bird.phase * 1.3);
      const flapAmp = flapCycle > -0.25 ? 0.38 : 0.07;
      const flapWave = Math.sin(this.time * 5.4 + bird.phase * 2.1);
      const outerWave = Math.sin(this.time * 5.4 + bird.phase * 2.1 - 0.65);
      for (const wing of bird.wings) {
        wing.innerPivot.rotation.z = wing.side * flapWave * flapAmp;
        wing.outerPivot.rotation.z = wing.side * outerWave * (flapAmp * 0.85);
      }
    }
  }
}
