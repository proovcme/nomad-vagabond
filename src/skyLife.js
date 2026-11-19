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

    let birdIdx = 0;
    for (const fl of flocks) {
      for (let i = 0; i < fl.count; i++) {
        const idx = birdIdx++;
        const root = new B.TransformNode(`skyBird_${idx}`, scene);
        root.scaling.setAll(fl.scale * (0.88 + (idx % 4) * 0.08));

        // Streamlined bird body + tail fan
        const body = new B.Mesh(`skyBirdBody_${idx}`, scene);
        const bvd = new B.VertexData();
        bvd.positions = [
          0, 0.04, -0.95,    // beak tip (-Z forward)
          -0.22, 0.0, -0.15, // left shoulder
          0.22, 0.0, -0.15,  // right shoulder
          0, 0.12, -0.10,    // back ridge
          -0.32, 0.02, 0.85, // tail left
          0.32, 0.02, 0.85,  // tail right
        ];
        bvd.indices = [
          0, 1, 3,  0, 3, 2,  0, 2, 1,
          1, 4, 3,  3, 4, 5,  3, 5, 2,
        ];
        bvd.normals = [
          0, 1, 0,  0, 1, 0,  0, 1, 0,
          0, 1, 0,  0, 1, 0,  0, 1, 0,
        ];
        bvd.applyToMesh(body);
        body.material = bodyMat;
        body.parent = root;
        body.isPickable = false;

        const wings = [];
        for (const side of [-1, 1]) {
          // Inner wing (cream/white)
          const innerPivot = new B.TransformNode(`skyBirdWingInnerPivot_${idx}_${side}`, scene);
          innerPivot.parent = root;
          innerPivot.position.set(side * 0.14, 0.03, -0.12);

          const innerMesh = new B.Mesh(`skyBirdWing_${idx}_${side}`, scene);
          const ivd = new B.VertexData();
          ivd.positions = [
            0, 0, -0.36,
            side * 1.15, 0.08, -0.18,
            side * 1.05, 0.02, 0.42,
            0, 0, 0.38,
          ];
          ivd.indices = side > 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
          ivd.normals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
          ivd.applyToMesh(innerMesh);
          innerMesh.material = bodyMat;
          innerMesh.parent = innerPivot;
          innerMesh.isPickable = false;

          // Outer wingtip (dark ink plumage, articulated secondary joint)
          const outerPivot = new B.TransformNode(`skyBirdWingOuterPivot_${idx}_${side}`, scene);
          outerPivot.parent = innerPivot;
          outerPivot.position.set(side * 1.08, 0.05, 0.05);

          const outerMesh = new B.Mesh(`skyBirdWingTip_${idx}_${side}`, scene);
          const ovd = new B.VertexData();
          ovd.positions = [
            0, 0, -0.22,
            side * 1.15, -0.04, 0.35,
            0, 0, 0.34,
          ];
          ovd.indices = side > 0 ? [0, 1, 2] : [0, 2, 1];
          ovd.normals = [0, 1, 0, 0, 1, 0, 0, 1, 0];
          ovd.applyToMesh(outerMesh);
          outerMesh.material = wingTipMat;
          outerMesh.parent = outerPivot;
          outerMesh.isPickable = false;

          wings.push({ innerPivot, outerPivot, mesh: innerMesh, side });
        }

        const frac = i / Math.max(1, fl.count);
        const radius = fl.rMin + (fl.rMax - fl.rMin) * ((i * 0.618034) % 1);
        this.birds.push({
          root,
          wings,
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
  }

  update(dt) {
    this.time += dt;
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
