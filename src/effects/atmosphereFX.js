/**
 * Interbellum / Dieselpunk Atmospheric & Combat Visual Effects:
 * - Wingtip vortex trails on high-speed turns/dives (zero per-frame allocations)
 * - WWII / Interbellum dark Flak burst clouds + brief orange-amber detonation core
 * - Muzzle flash & gun-smoke puffs for AA cannon & SAM launches
 * - Diesel chimney smoke (Vagabond generator + Industrial stacks) & damaged aircraft smoke plumes
 * - Forest Island cliff waterfall cascade into the cloud sea
 * - Storm horizon lightning flashes + distant muffled thunder cue
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

export class AtmosphereFX {
  constructor(scene, { theme = 'sunset', asteroidBase = null, forestIsland = null, industrialIsland = null, audio = null } = {}) {
    this.scene = scene;
    this.theme = theme;
    this.asteroidBase = asteroidBase;
    this.forestIsland = forestIsland;
    this.industrialIsland = industrialIsland;
    this.audio = audio;
    this.disposed = false;
    this.time = 0;

    this._isNull = scene.getEngine() instanceof BABYLON.NullEngine;
    this._puffs = [];
    this._flashes = [];
    this._chimneyTimer = 0;
    this._damageTimer = 0;
    this._lightningTimer = 5 + Math.random() * 7;
    this._lightningFlash = 0;
    this._morseTimer = 14 + Math.random() * 14;
    this._waterfallMat = null;
    this._wingTrails = null;
    this._prevForward = new BABYLON.Vector3(0, 0, 1);

    if (this._isNull) return;

    this._initPuffPool();
    this._initWingTrails();
    this._buildForestWaterfall();
    scene.onDisposeObservable.addOnce(() => this.dispose());
  }

  _makeSoftCloudTex(name, rgb, alphaScale = 0.85, lobes = 5) {
    const B = BABYLON;
    const size = 128;
    const tex = new B.DynamicTexture(name, { width: size, height: size }, this.scene, true);
    const ctx = tex.getContext();
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = ((x + 0.5) / size) * 2 - 1;
        const v = ((y + 0.5) / size) * 2 - 1;
        const wx = u + 0.11 * Math.sin(v * 7.5 + 0.6) + 0.04 * Math.sin(v * 17 - u * 5);
        const wy = v + 0.09 * Math.sin(u * 6.5 - 1.1);
        const ang = Math.atan2(wy, wx);
        const r = Math.hypot(wx, wy);
        const edge = 0.84 + 0.10 * Math.sin(ang * lobes + 0.5) + 0.04 * Math.sin(ang * (lobes + 4) + 1.3);
        const falloff = Math.max(0, 1 - r / edge);
        const wisp = 0.78 + 0.16 * Math.sin(wx * 11 + wy * 5) * Math.cos(wy * 9 - wx * 4);
        const a = Math.pow(falloff, 1.85) * wisp * alphaScale;
        const idx = (y * size + x) * 4;
        img.data[idx] = rgb[0];
        img.data[idx + 1] = rgb[1];
        img.data[idx + 2] = rgb[2];
        img.data[idx + 3] = Math.round(Math.max(0, Math.min(1, a)) * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
    tex.hasAlpha = true;
    tex.wrapU = tex.wrapV = B.Texture.CLAMP_ADDRESSMODE;
    tex.update(false);
    return tex;
  }

  _initPuffPool() {
    const B = BABYLON;
    // Soft wispy billboard textures (zero angular polygons or black cubes!)
    this._smokeTex = this._makeSoftCloudTex('atmoSoftSmokeTex', [54, 52, 50], 0.72, 5);
    this._steamTex = this._makeSoftCloudTex('atmoSoftSteamTex', [216, 210, 198], 0.58, 5);
    this._flashTex = this._makeSoftCloudTex('atmoSoftFlashTex', [255, 192, 92], 0.95, 7);

    this._smokeMat = new B.StandardMaterial('atmoSmokePuffMat', this.scene);
    this._smokeMat.diffuseTexture = this._smokeTex;
    this._smokeMat.useAlphaFromDiffuseTexture = true;
    this._smokeMat.emissiveColor = c3('#2a2826');
    this._smokeMat.diffuseColor = c3('#3c3936');
    this._smokeMat.specularColor = new B.Color3(0, 0, 0);
    this._smokeMat.disableLighting = true;
    this._smokeMat.backFaceCulling = false;
    this._smokeMat.depthWrite = false;

    this._steamMat = new B.StandardMaterial('atmoSteamPuffMat', this.scene);
    this._steamMat.diffuseTexture = this._steamTex;
    this._steamMat.useAlphaFromDiffuseTexture = true;
    this._steamMat.emissiveColor = c3('#c8c2b4');
    this._steamMat.diffuseColor = c3('#e4dfd2');
    this._steamMat.specularColor = new B.Color3(0, 0, 0);
    this._steamMat.disableLighting = true;
    this._steamMat.backFaceCulling = false;
    this._steamMat.depthWrite = false;

    this._flashMat = new B.StandardMaterial('atmoFlashCoreMat', this.scene);
    this._flashMat.emissiveTexture = this._flashTex;
    this._flashMat.opacityTexture = this._flashTex;
    this._flashMat.emissiveColor = c3('#ffb24c');
    this._flashMat.disableLighting = true;
    this._flashMat.alphaMode = B.Engine.ALPHA_ADD;
    this._flashMat.backFaceCulling = false;
    this._flashMat.depthWrite = false;

    // Pre-allocate 42 soft camera-facing billboard smoke puffs (zero boxes, zero faceted rocks!)
    for (let i = 0; i < 42; i++) {
      const m = B.MeshBuilder.CreatePlane(`atmoPuff_${i}`, { size: 2.0 }, this.scene);
      m.billboardMode = B.Mesh.BILLBOARDMODE_ALL;
      m.isVisible = false;
      m.isPickable = false;
      m.checkCollisions = false;
      m.material = this._smokeMat;
      this._puffs.push({
        mesh: m, active: false, age: 0, maxAge: 2.2,
        vel: new B.Vector3(), startScale: 1, endScale: 4, baseAlpha: 0.72,
      });
    }

    // Pre-allocate 12 soft additive radial flash sprites
    for (let i = 0; i < 12; i++) {
      const m = B.MeshBuilder.CreatePlane(`atmoFlash_${i}`, { size: 2.0 }, this.scene);
      m.billboardMode = B.Mesh.BILLBOARDMODE_ALL;
      m.isVisible = false;
      m.isPickable = false;
      m.checkCollisions = false;
      m.material = this._flashMat;
      this._flashes.push({
        mesh: m, active: false, age: 0, maxAge: 0.20, startScale: 2, endScale: 5.5,
      });
    }
  }

  _initWingTrails() {
    const B = BABYLON;
    const segments = 18;
    const mat = new B.StandardMaterial('wingtipVortexMat', this.scene);
    mat.emissiveColor = c3('#e8eff4');
    mat.disableLighting = true;
    mat.alpha = 0.0;
    mat.alphaMode = B.Engine.ALPHA_ADD;
    mat.backFaceCulling = false;
    mat.depthWrite = false;

    const makeRibbon = (sideName) => {
      const pts = [];
      for (let i = 0; i < segments; i++) pts.push(new B.Vector3(0, -500, 0));
      const positions = new Float32Array(segments * 2 * 3);
      const indices = [];
      for (let i = 0; i < segments - 1; i++) {
        const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
        indices.push(a, b, c, b, d, c);
      }
      const mesh = new B.Mesh(`wingVortex_${sideName}`, this.scene);
      const vd = new B.VertexData();
      vd.positions = positions;
      vd.indices = indices;
      vd.applyToMesh(mesh, true);
      mesh.material = mat;
      mesh.isPickable = false;
      mesh.checkCollisions = false;
      mesh.alwaysSelectAsActiveMesh = true;
      mesh.isVisible = false;
      return { mesh, pts, positions, head: 0 };
    };

    this._wingTrails = {
      mat,
      segments,
      left: makeRibbon('L'),
      right: makeRibbon('R'),
      alpha: 0,
      sampleAcc: 0,
    };
  }

  _buildForestWaterfall() {
    if (!this.forestIsland?.group || typeof document === 'undefined') return;
    const B = BABYLON;
    const tex = new B.DynamicTexture('forestWaterfallTex', { width: 64, height: 256 }, this.scene, false);
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, 64, 256);
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.0, 'rgba(225, 244, 255, 0.85)');
    g.addColorStop(0.25, 'rgba(185, 228, 248, 0.65)');
    g.addColorStop(0.70, 'rgba(165, 214, 238, 0.35)');
    g.addColorStop(1.0, 'rgba(190, 224, 244, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 256);
    // Vertical foam streaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let s = 0; s < 6; s++) {
      ctx.fillRect(6 + s * 10, (s * 37) % 120, 4, 95);
    }
    tex.update();
    tex.hasAlpha = true;
    tex.wrapV = B.Texture.WRAP_ADDRESSMODE;

    const wfMat = new B.StandardMaterial('forestWaterfallMat', this.scene);
    wfMat.emissiveTexture = tex;
    wfMat.opacityTexture = tex;
    wfMat.disableLighting = true;
    wfMat.backFaceCulling = false;
    wfMat.depthWrite = false;
    wfMat.alpha = 0.72;
    this._waterfallMat = wfMat;
    this._waterfallTex = tex;

    // Graceful curved water sheet spilling off the southern cliff rim of Forest Island into the cloud abyss
    const sheet = B.MeshBuilder.CreatePlane('forestCliffWaterfall', { width: 14, height: 145 }, this.scene);
    sheet.parent = this.forestIsland.group;
    sheet.position.set(-18, -72, 46);
    sheet.rotation.y = 0.28;
    sheet.material = wfMat;
    sheet.isPickable = false;
    sheet.checkCollisions = false;
  }

  _allocPuff() {
    let best = this._puffs[0];
    for (const p of this._puffs) {
      if (!p.active) return p;
      if (p.age / p.maxAge > best.age / best.maxAge) best = p;
    }
    return best;
  }

  _allocFlash() {
    let best = this._flashes[0];
    for (const f of this._flashes) {
      if (!f.active) return f;
      if (f.age / f.maxAge > best.age / best.maxAge) best = f;
    }
    return best;
  }

  /** WWII / Interbellum dark Flak detonation puff + brief hot orange flash */
  spawnFlakBurst(pos, scale = 1.0) {
    if (this._isNull || this.disposed || !pos) return;
    const flash = this._allocFlash();
    flash.active = true;
    flash.age = 0;
    flash.maxAge = 0.18;
    flash.startScale = 2.4 * scale;
    flash.endScale = 7.5 * scale;
    flash.mesh.position.copyFrom(pos);
    flash.mesh.scaling.setAll(flash.startScale);
    flash.mesh.visibility = 1.0;
    flash.mesh.isVisible = true;

    for (let k = 0; k < 2; k++) {
      const p = this._allocPuff();
      p.active = true;
      p.age = 0;
      p.maxAge = 2.2 + Math.random() * 0.9;
      p.startScale = (1.6 + k * 0.6) * scale;
      p.endScale = (5.4 + k * 1.6) * scale;
      p.baseAlpha = 0.68;
      p.mesh.material = this._smokeMat;
      p.mesh.position.set(
        pos.x + (Math.random() - 0.5) * 2.2 * scale,
        pos.y + (Math.random() - 0.5) * 1.6 * scale,
        pos.z + (Math.random() - 0.5) * 2.2 * scale
      );
      p.mesh.rotation.z = Math.random() * Math.PI * 2;
      p.vel.set((Math.random() - 0.5) * 2.5 + 1.8, 1.2 + Math.random() * 1.4, (Math.random() - 0.5) * 2.5);
      p.mesh.scaling.setAll(p.startScale);
      p.mesh.visibility = 0.05;
      p.mesh.isVisible = true;
    }
  }

  /** Gun muzzle flash + grey powder puff */
  spawnMuzzleFlash(pos, dir = null) {
    if (this._isNull || this.disposed || !pos) return;
    const flash = this._allocFlash();
    flash.active = true;
    flash.age = 0;
    flash.maxAge = 0.10;
    flash.startScale = 1.4;
    flash.endScale = 3.2;
    flash.mesh.position.copyFrom(pos);
    flash.mesh.scaling.setAll(flash.startScale);
    flash.mesh.isVisible = true;

    const p = this._allocPuff();
    p.active = true;
    p.age = 0;
    p.maxAge = 1.1;
    p.startScale = 0.85;
    p.endScale = 2.8;
    p.mesh.material = this._steamMat;
    p.mesh.position.copyFrom(pos);
    p.vel.set(
      (dir?.x || 0) * 6 + (Math.random() - 0.5) * 1.5,
      (dir?.y || 0.4) * 6 + 1.5,
      (dir?.z || 0) * 6 + (Math.random() - 0.5) * 1.5
    );
    p.mesh.scaling.setAll(p.startScale);
    p.mesh.isVisible = true;
  }

  /** Emit a single chimney or damage smoke puff */
  spawnSmokePuff(pos, { dark = true, scale = 1.0, rise = 4.5 } = {}) {
    if (this._isNull || this.disposed || !pos) return;
    const p = this._allocPuff();
    p.active = true;
    p.age = 0;
    p.maxAge = 2.6 + Math.random() * 1.1;
    p.startScale = 0.9 * scale;
    p.endScale = 4.2 * scale;
    p.baseAlpha = dark ? 0.62 : 0.48;
    p.mesh.material = dark ? this._smokeMat : this._steamMat;
    p.mesh.position.copyFrom(pos);
    p.mesh.rotation.z = Math.random() * Math.PI * 2;
    p.vel.set(2.2 + (Math.random() - 0.5) * 1.4, rise + Math.random() * 1.6, (Math.random() - 0.5) * 1.4);
    p.mesh.scaling.setAll(p.startScale);
    p.mesh.visibility = 0.05;
    p.mesh.isVisible = true;
  }

  _updateWingTrails(dt, ship, controlMode) {
    const wt = this._wingTrails;
    if (!wt || !ship?.group || controlMode !== 'aircraft' || ship.dockedAsteroid) {
      if (wt) {
        wt.alpha = Math.max(0, wt.alpha - dt * 2.5);
        wt.mat.alpha = wt.alpha;
        if (wt.alpha <= 0.01) { wt.left.mesh.isVisible = false; wt.right.mesh.isVisible = false; }
      }
      return;
    }

    const speed = ship.velocity ? ship.velocity.length() : 0;
    const fwd = ship.group.forward ? ship.group.forward.normalize() : new BABYLON.Vector3(0, 0, 1);
    const turnRate = Math.min(1, BABYLON.Vector3.Distance(fwd, this._prevForward) / Math.max(0.008, dt) * 0.55);
    this._prevForward.copyFrom(fwd);

    const targetAlpha = (speed > 36)
      ? Math.min(0.42, Math.max(0, (speed - 36) / 48) * 0.16 + turnRate * 0.34)
      : 0;
    wt.alpha += (targetAlpha - wt.alpha) * Math.min(1, dt * 6);
    wt.mat.alpha = wt.alpha;

    const show = wt.alpha > 0.025;
    wt.left.mesh.isVisible = show;
    wt.right.mesh.isVisible = show;
    if (!show) return;

    wt.sampleAcc += dt;
    if (wt.sampleAcc < 0.028) return;
    wt.sampleAcc = 0;

    ship.group.computeWorldMatrix(true);
    const wm = ship.group.getWorldMatrix();
    const halfSpan = 5.4;
    const leftTip = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(-halfSpan, 0.15, -0.4), wm);
    const rightTip = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(halfSpan, 0.15, -0.4), wm);
    const up = BABYLON.Vector3.TransformNormal(BABYLON.Axis.Y, wm).normalize();

    const updateSide = (side, tip) => {
      for (let i = wt.segments - 1; i > 0; i--) {
        side.pts[i].copyFrom(side.pts[i - 1]);
      }
      side.pts[0].copyFrom(tip);
      const pos = side.positions;
      for (let i = 0; i < wt.segments; i++) {
        const t = i / (wt.segments - 1);
        const w = (1 - t) * 0.24 + 0.03;
        const p = side.pts[i];
        const o = i * 6;
        pos[o]     = p.x + up.x * w; pos[o + 1] = p.y + up.y * w; pos[o + 2] = p.z + up.z * w;
        pos[o + 3] = p.x - up.x * w; pos[o + 4] = p.y - up.y * w; pos[o + 5] = p.z - up.z * w;
      }
      side.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    };
    updateSide(wt.left, leftTip);
    updateSide(wt.right, rightTip);
  }

  update(dt, { ship = null, controlMode = 'menu', activeEnemies = [], dreadnought = null, camera = null } = {}) {
    if (this.disposed || this._isNull) return;
    const safeDt = Math.min(0.05, Math.max(0.001, dt));
    this.time += safeDt;

    // 1. Scroll waterfall UV shimmer
    if (this._waterfallTex) {
      this._waterfallTex.vOffset = (this._waterfallTex.vOffset + safeDt * 0.42) % 1;
    }

    // 2. Wingtip vortex trails
    this._updateWingTrails(safeDt, ship, controlMode);

    // 3. Diesel chimney smoke (Vagabond Ether Generator) + periodic steam vent
    this._chimneyTimer -= safeDt;
    if (this._chimneyTimer <= 0 && this.asteroidBase?.group) {
      this._chimneyTimer = 0.85 + Math.random() * 0.45;
      const basePos = this.asteroidBase.group.position;
      this.spawnSmokePuff(new BABYLON.Vector3(basePos.x - 30.0, basePos.y + 29.2, basePos.z + 13.5), {
        dark: Math.random() > 0.35, scale: 0.72, rise: 3.6,
      });
    }

    // 4. Damaged aircraft / Dreadnought black smoke trails (< 50% HP)
    this._damageTimer -= safeDt;
    if (this._damageTimer <= 0) {
      this._damageTimer = 0.22;
      if (dreadnought?.alive && dreadnought.hp < dreadnought.maxHp * 0.55 && dreadnought.root) {
        const dp = dreadnought.root.position;
        this.spawnSmokePuff(new BABYLON.Vector3(dp.x + (Math.random() - 0.5) * 14, dp.y + 4, dp.z + (Math.random() - 0.5) * 18), {
          dark: true, scale: 1.65, rise: 5.0,
        });
      }
      for (let i = 0; i < Math.min(3, activeEnemies.length); i++) {
        const en = activeEnemies[i];
        if (en?.alive && en.maxHp && en.hp < en.maxHp * 0.5 && en.root && !en.root.isDisposed?.()) {
          this.spawnSmokePuff(en.root.position, { dark: true, scale: 0.65, rise: 2.2 });
        }
      }
    }

    // 5. Storm horizon lightning flashes + distant muffled thunder
    if (this.theme === 'storm') {
      this._lightningTimer -= safeDt;
      if (this._lightningTimer <= 0) {
        this._lightningTimer = 7.5 + Math.random() * 9.0;
        this._lightningFlash = 1.0;
        this.audio?.playDistantThunder?.();
      }
      if (this._lightningFlash > 0) {
        this._lightningFlash = Math.max(0, this._lightningFlash - safeDt * 2.8);
        const flicker = this._lightningFlash * (0.65 + 0.35 * Math.sin(this.time * 48));
        if (this.scene.imageProcessingConfiguration) {
          this.scene.imageProcessingConfiguration.exposure = 0.90 + flicker * 0.36;
        }
      }
    }

    // 6. Occasional 1930s Morse radio beacon pip when walking on Vagabond deck
    if (controlMode === 'foot') {
      this._morseTimer -= safeDt;
      if (this._morseTimer <= 0) {
        this._morseTimer = 18 + Math.random() * 16;
        this.audio?.playMorseBeacon?.();
      }
    }

    // 7. Update active soft smoke/flak billboard puffs (smooth fade-in & fade-out!)
    for (const p of this._puffs) {
      if (!p.active) continue;
      p.age += safeDt;
      if (p.age >= p.maxAge) {
        p.active = false;
        p.mesh.isVisible = false;
        continue;
      }
      const t = p.age / p.maxAge;
      p.mesh.position.addInPlaceFromFloats(p.vel.x * safeDt, p.vel.y * safeDt, p.vel.z * safeDt);
      const s = p.startScale + (p.endScale - p.startScale) * Math.sqrt(t);
      p.mesh.scaling.setAll(s);
      const fadeIn = Math.min(1, t / 0.14);
      const fadeOut = Math.max(0, 1 - Math.max(0, t - 0.28) / 0.72);
      p.mesh.visibility = fadeIn * fadeOut * (p.baseAlpha || 0.72);
    }

    // 8. Update active soft flash sprites
    for (const f of this._flashes) {
      if (!f.active) continue;
      f.age += safeDt;
      if (f.age >= f.maxAge) {
        f.active = false;
        f.mesh.isVisible = false;
        continue;
      }
      const t = f.age / f.maxAge;
      f.mesh.scaling.setAll(f.startScale + (f.endScale - f.startScale) * t);
      f.mesh.visibility = Math.max(0, 1 - t);
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this._puffs.forEach((p) => p.mesh?.dispose());
    this._flashes.forEach((f) => f.mesh?.dispose());
    this._wingTrails?.left?.mesh?.dispose();
    this._wingTrails?.right?.mesh?.dispose();
    this._wingTrails?.mat?.dispose();
    this._smokeMat?.dispose();
    this._steamMat?.dispose();
    this._flashMat?.dispose();
    this._smokeTex?.dispose();
    this._steamTex?.dispose();
    this._flashTex?.dispose();
    this._waterfallMat?.dispose();
    this._waterfallTex?.dispose();
  }
}
