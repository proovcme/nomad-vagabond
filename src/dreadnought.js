import { createRustedMetalTexture } from './textures.js?v=mission1';
import { buildFlak88Turret } from './flak88.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Giant 65m dieselpunk armored airship-dreadnought (or convoy transport)
 * with destructible Flak 88 turrets, glowing engine gondola, spinning props,
 * defensive AA fire, and a dramatic multi-blast sinking sequence.
 */
export class EnemyDreadnought {
  constructor(scene, centerPos, options = {}) {
    const B = BABYLON;
    this.scene = scene;
    this.isConvoy = Boolean(options.isConvoy);
    this.name = this.isConvoy ? 'Транспортный дирижабль «Арго»' : 'Дирижабль-дредноут «Голиаф»';
    this.centerPos = centerPos.clone();
    this.orbitRadius = options.orbitRadius || (this.isConvoy ? 240 : 210);
    this.altitude = options.altitude || (this.isConvoy ? 95 : 108);
    this.phase = options.phase || 0.6;
    this.speed = this.isConvoy ? 14 : 11;
    this.maxHp = this.isConvoy ? 340 : 680;
    this.hp = this.maxHp;
    this.alive = true;
    this.sinking = false;
    this.sinkTimer = 0;
    this.sinkBlastCd = 0;
    this.disposed = false;
    this.velocity = new B.Vector3();
    this.props = [];
    this.turrets = [];
    this.weakPoints = [];

    this.root = new B.TransformNode(this.isConvoy ? 'convoyAirshipRoot' : 'dreadnoughtRoot', scene);
    this.root.position.set(
      centerPos.x + Math.cos(this.phase) * this.orbitRadius,
      centerPos.y + this.altitude,
      centerPos.z + Math.sin(this.phase) * this.orbitRadius
    );

    const isNull = scene.getEngine() instanceof B.NullEngine;
    let hullTex = null;
    if (!isNull) {
      hullTex = createRustedMetalTexture(scene, this.isConvoy ? [118, 96, 74] : [82, 74, 68]);
      hullTex.albedoTex.uScale = 4; hullTex.albedoTex.vScale = 2;
      hullTex.bumpTex.uScale = 4; hullTex.bumpTex.vScale = 2;
    }

    const envelopeMat = new B.PBRMaterial(`${this.root.name}_envMat`, scene);
    envelopeMat.albedoColor = c3(this.isConvoy ? '#8a7358' : '#58514b');
    envelopeMat.metallic = 0.24;
    envelopeMat.roughness = 0.72;
    if (hullTex) {
      envelopeMat.albedoTexture = hullTex.albedoTex;
      envelopeMat.bumpTexture = hullTex.bumpTex;
      envelopeMat.bumpTexture.level = 0.85;
    }

    const armorMat = new B.PBRMaterial(`${this.root.name}_armorMat`, scene);
    armorMat.albedoColor = c3(this.isConvoy ? '#5a4e42' : '#3a3836');
    armorMat.metallic = 0.62;
    armorMat.roughness = 0.44;
    if (hullTex) {
      armorMat.bumpTexture = hullTex.bumpTex;
      armorMat.bumpTexture.level = 0.85;
    }

    const crimsonMat = new B.PBRMaterial(`${this.root.name}_crimsonMat`, scene);
    crimsonMat.albedoColor = c3('#8f2b22');
    crimsonMat.metallic = 0.22;
    crimsonMat.roughness = 0.68;

    const coreMat = new B.StandardMaterial(`${this.root.name}_coreMat`, scene);
    coreMat.emissiveColor = c3(this.isConvoy ? '#ffbe55' : '#ff5e2b');
    coreMat.disableLighting = true;

    const markerMat = new B.StandardMaterial(`${this.root.name}_markerMat`, scene);
    markerMat.emissiveColor = c3('#ff3b30');
    markerMat.disableLighting = true;

    const reg = (m, mat) => {
      m.parent = this.root;
      m.material = mat;
      m.isPickable = false;
      m.alwaysSelectAsActiveMesh = true;
      return m;
    };

    const lenScale = this.isConvoy ? 0.78 : 1.0;

    // 1. Main armored zeppelin envelope (65m cigar hull)
    const hull = reg(B.MeshBuilder.CreateSphere(`${this.root.name}_hull`, { diameter: 20 * lenScale, segments: 16 }, scene), envelopeMat);
    hull.scaling.set(0.86, 0.82, 3.25);

    // Armored nose cone, crimson war stripes & keel spine
    const nose = reg(B.MeshBuilder.CreateCylinder(`${this.root.name}_nose`, { diameterTop: 0.6, diameterBottom: 7.5 * lenScale, height: 8.5 * lenScale, tessellation: 12 }, scene), armorMat);
    nose.rotation.x = -Math.PI * 0.5;
    nose.position.set(0, 0, -31.5 * lenScale);

    for (const bz of [-16, 0, 16]) {
      const band = reg(B.MeshBuilder.CreateTorus(`${this.root.name}_band_${bz}`, { diameter: (bz === 0 ? 17.6 : 15.6) * lenScale, thickness: 1.05 * lenScale, tessellation: 18 }, scene), bz === 0 ? crimsonMat : armorMat);
      band.rotation.x = Math.PI * 0.5;
      band.position.set(0, 0, bz * lenScale);
    }

    // 4 cruciform tail fins
    for (let i = 0; i < 4; i++) {
      const fin = reg(B.MeshBuilder.CreateBox(`${this.root.name}_fin_${i}`, { width: 0.65, height: 11.5 * lenScale, depth: 14.0 * lenScale }, scene), i % 2 === 0 ? crimsonMat : armorMat);
      const ang = (i * Math.PI) / 2;
      fin.rotation.z = ang;
      fin.position.set(Math.sin(ang) * 7.2 * lenScale, Math.cos(ang) * 7.2 * lenScale, 22.0 * lenScale);
    }

    // 2. Underslung armored command & engine gondola (Weak Point: Engine Core)
    const gondola = reg(B.MeshBuilder.CreateBox(`${this.root.name}_gondola`, { width: 7.2 * lenScale, height: 5.2 * lenScale, depth: 28.0 * lenScale }, scene), armorMat);
    gondola.position.set(0, -10.2 * lenScale, -1.5 * lenScale);

    const reactorCore = reg(B.MeshBuilder.CreateCylinder(`${this.root.name}_reactor`, { diameter: 3.6 * lenScale, height: 7.8 * lenScale, tessellation: 12 }, scene), coreMat);
    reactorCore.rotation.z = Math.PI * 0.5;
    reactorCore.position.set(0, -10.4 * lenScale, 5.5 * lenScale);

    this.weakPoints.push({
      id: 'reactor',
      name: 'Энергоблок гондолы',
      node: reactorCore,
      radius: 7.2 * lenScale,
      hp: this.isConvoy ? 110 : 210,
      maxHp: this.isConvoy ? 110 : 210,
      alive: true,
    });

    // 3. Four outrigger engine nacelles with spinning propellers
    for (const [sx, sz] of [[-1, -6], [1, -6], [-1, 10], [1, 10]]) {
      const strut = reg(B.MeshBuilder.CreateBox(`${this.root.name}_strut_${sx}_${sz}`, { width: 6.2 * lenScale, height: 0.7, depth: 1.2 }, scene), armorMat);
      strut.position.set(sx * 6.5 * lenScale, -8.5 * lenScale, sz * lenScale);

      const nac = reg(B.MeshBuilder.CreateCylinder(`${this.root.name}_nac_${sx}_${sz}`, { diameter: 2.2 * lenScale, height: 5.5 * lenScale, tessellation: 10 }, scene), armorMat);
      nac.rotation.x = Math.PI * 0.5;
      nac.position.set(sx * 9.5 * lenScale, -8.5 * lenScale, sz * lenScale);

      const propHub = new B.TransformNode(`${this.root.name}_prop_${sx}_${sz}`, scene);
      propHub.parent = this.root;
      propHub.position.set(sx * 9.5 * lenScale, -8.5 * lenScale, (sz - 3.0) * lenScale);
      for (let b = 0; b < 3; b++) {
        const blade = B.MeshBuilder.CreateBox(`${this.root.name}_blade_${sx}_${sz}_${b}`, { width: 0.35, height: 3.4 * lenScale, depth: 0.08 }, scene);
        blade.parent = propHub;
        blade.rotation.z = (b * Math.PI * 2) / 3;
        blade.material = armorMat;
        blade.isPickable = false;
      }
      this.props.push(propHub);
    }

    // 4. Dorsal Flak 88 AA Turrets (destructible weak points!)
    const turretPositions = this.isConvoy
      ? [new B.Vector3(0, 8.2 * lenScale, -6 * lenScale)]
      : [new B.Vector3(0, 8.4 * lenScale, -12), new B.Vector3(0, 8.4 * lenScale, 10)];

    turretPositions.forEach((tPos, idx) => {
      const deck = reg(B.MeshBuilder.CreateCylinder(`${this.root.name}_tDeck_${idx}`, { diameter: 6.5, height: 0.9, tessellation: 12 }, scene), armorMat);
      deck.position.copyFrom(tPos).addInPlace(new B.Vector3(0, -0.45, 0));
      const rig = buildFlak88Turret(scene, `${this.root.name}_flak_${idx}`, this.root, tPos, 0, null);
      const wp = {
        id: `turret_${idx}`,
        name: `Зенитная башня №${idx + 1}`,
        node: rig.root,
        rig,
        radius: 6.2,
        hp: 150,
        maxHp: 150,
        alive: true,
        fireCd: 1.8 + idx * 1.1,
      };
      this.turrets.push(wp);
      this.weakPoints.push(wp);
    });

    // Beacon marker above hull
    this.marker = reg(B.MeshBuilder.CreateSphere(`${this.root.name}_marker`, { diameter: 3.8, segments: 8 }, scene), markerMat);
    this.marker.position.set(0, 15.5 * lenScale, 0);

    this._ownedMaterials = [envelopeMat, armorMat, crimsonMat, coreMat, markerMat];
    this._ownedTextures = hullTex ? [hullTex.albedoTex, hullTex.bumpTex] : [];
    this._invMat = new B.Matrix();
  }

  /** Direct damage hook for SAMs / area blasts that detonate near the hull. */
  applyExternalDamage(dmg, hitPos, spawnExplosionFn) {
    if (!this.alive || this.sinking) return false;
    this.hp = Math.max(0, this.hp - dmg);
    spawnExplosionFn?.(hitPos || this.root.position.clone(), 1.8);
    if (this.hp <= 0) {
      this.alive = false;
      this.sinking = true;
      this.sinkTimer = 5.2;
      this.sinkBlastCd = 0.1;
      this.marker?.dispose?.();
      return true;
    }
    return false;
  }

  /** Applies hit from player projectile (segment-checked so fast shells never tunnel). */
  checkHit(prevPos, curPos, dmg, spawnExplosionFn) {
    if (!this.alive || this.sinking) return { hit: false };
    const hitRes = { hit: false, weakPointDestroyed: null, destroyed: false, hitPos: curPos.clone() };
    const segA = prevPos || curPos;
    const segVec = curPos.subtract(segA);
    const segLenSq = segVec.lengthSquared();
    const distToSeg = (pt) => {
      if (segLenSq < 0.0001) return BABYLON.Vector3.Distance(pt, curPos);
      const t = Math.max(0, Math.min(1, BABYLON.Vector3.Dot(pt.subtract(segA), segVec) / segLenSq));
      return BABYLON.Vector3.Distance(pt, segA.add(segVec.scale(t)));
    };

    // 1. Check destructible weak points first (bonus damage!)
    for (const wp of this.weakPoints) {
      if (!wp.alive || !wp.node || wp.node.isDisposed?.()) continue;
      const wpPos = wp.node.getAbsolutePosition();
      if (distToSeg(wpPos) < wp.radius) {
        hitRes.hit = true;
        hitRes.hitPos = wpPos.clone();
        wp.hp -= dmg;
        this.hp = Math.max(0, this.hp - dmg * 1.25);
        if (wp.hp <= 0) {
          wp.alive = false;
          hitRes.weakPointDestroyed = wp.name;
          this.hp = Math.max(0, this.hp - 120);
          spawnExplosionFn?.(wpPos, 2.2);
          wp.node.setEnabled(false);
        }
        break;
      }
    }

    // 2. Check main airship envelope hit (ellipsoid approximation in local space)
    if (!hitRes.hit) {
      this.root.getWorldMatrix().invertToRef(this._invMat);
      const localP = BABYLON.Vector3.TransformCoordinates(curPos, this._invMat);
      const rx = this.isConvoy ? 9.5 : 12.0;
      const ry = this.isConvoy ? 11.0 : 13.5;
      const rz = this.isConvoy ? 27.0 : 35.0;
      const ellip = (localP.x * localP.x) / (rx * rx) + (localP.y * localP.y) / (ry * ry) + (localP.z * localP.z) / (rz * rz);
      if (ellip <= 1.0) {
        hitRes.hit = true;
        this.hp = Math.max(0, this.hp - dmg);
      }
    }

    if (hitRes.hit && this.hp <= 0 && !this.sinking) {
      this.alive = false;
      this.sinking = true;
      this.sinkTimer = 5.2;
      this.sinkBlastCd = 0.1;
      hitRes.destroyed = true;
      this.marker?.dispose?.();
    }
    return hitRes;
  }

  update(dt, playerPos, playerVel, playerInAir, enemyShots, tracerMat, spawnExplosionFn, audio) {
    if (this.disposed) return;

    // Spin all 4 outrigger propellers
    for (const p of this.props) {
      p.rotation.z += dt * (this.sinking ? 4.5 : 18.0);
    }

    if (this.sinking) {
      this.sinkTimer -= dt;
      this.sinkBlastCd -= dt;
      this.root.position.y -= 13.5 * dt;
      this.root.position.addInPlace(this.velocity.scale(dt * 0.45));
      this.root.rotation.z += 0.24 * dt;
      this.root.rotation.x -= 0.16 * dt;
      if (this.sinkBlastCd <= 0) {
        this.sinkBlastCd = 0.42 + Math.random() * 0.25;
        const off = new BABYLON.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 38);
        spawnExplosionFn?.(this.root.position.add(off), 2.1);
        audio?.playExplosion?.(0.75);
      }
      if (this.sinkTimer <= 0 || this.root.position.y < -115) {
        spawnExplosionFn?.(this.root.position.clone(), 3.6);
        audio?.playExplosion?.(1.0);
        this.dispose();
      }
      return;
    }

    if (!this.alive) return;

    // Weak-point gameplay impact: destroyed engines/nodes slow cruise speed & cause a visible burning list
    const totalWp = Math.max(1, this.weakPoints.length);
    const aliveWp = this.weakPoints.filter((w) => w.alive).length;
    const wpRatio = aliveWp / totalWp;
    const effSpeed = this.speed * (0.55 + 0.45 * wpRatio);
    const hpRatio = this.hp / Math.max(1, this.maxHp);
    this._dmgFireCd = Math.max(0, (this._dmgFireCd || 0) - dt);
    if (hpRatio < 0.65 && this._dmgFireCd <= 0) {
      this._dmgFireCd = hpRatio < 0.35 ? 0.55 : 1.15;
      const off = new BABYLON.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 26);
      spawnExplosionFn?.(this.root.position.add(off), hpRatio < 0.35 ? 1.15 : 0.72);
    }

    // Cruise smoothly along high-altitude patrol orbit
    this.phase += (effSpeed / this.orbitRadius) * dt;
    this.root.rotation.z += ((1 - wpRatio) * 0.22 - this.root.rotation.z) * Math.min(1, dt * 1.5);
    const nx = this.centerPos.x + Math.cos(this.phase) * this.orbitRadius;
    const ny = this.centerPos.y + this.altitude + Math.sin(this.phase * 2.0) * 6.0;
    const nz = this.centerPos.z + Math.sin(this.phase) * this.orbitRadius;
    const prev = this.root.position.clone();
    this.root.position.set(nx, ny, nz);
    const moveDir = this.root.position.subtract(prev);
    if (moveDir.lengthSquared() > 0.0001) {
      this.velocity.copyFrom(moveDir.scale(1 / Math.max(0.001, dt)));
      const dir = moveDir.normalize();
      this.root.rotation.y = Math.atan2(-dir.x, -dir.z);
    }

    // Active Flak 88 turrets track & fire bursts at player
    if (playerInAir && playerPos) {
      for (const t of this.turrets) {
        if (!t.alive || !t.rig) continue;
        const rig = t.rig;
        if (rig.recoil > 0 && rig.recoilNode) {
          rig.recoil = Math.max(0, rig.recoil - dt * 2.2);
          rig.recoilNode.position.z = rig.recoil * 0.68;
        }
        rig.root.computeWorldMatrix(true);
        const gunWorld = rig.root.getAbsolutePosition();
        const delta = playerPos.subtract(gunWorld);
        const dist = delta.length();
        if (dist < 320) {
          const targetYaw = Math.atan2(-delta.x, -delta.z) - this.root.rotation.y;
          let yawDiff = targetYaw - rig.yawNode.rotation.y;
          while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
          while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
          rig.yawNode.rotation.y += yawDiff * (1 - Math.exp(-3.5 * dt));
          const horiz = Math.max(1, Math.hypot(delta.x, delta.z));
          const targetPitch = Math.max(-0.15, Math.min(1.25, Math.atan2(delta.y, horiz)));
          rig.pitchNode.rotation.x += (targetPitch - rig.pitchNode.rotation.x) * (1 - Math.exp(-3.5 * dt));

          t.fireCd -= dt;
          if (t.fireCd <= 0) {
            t.fireCd = this.isConvoy ? 3.2 : 2.6;
            rig.recoil = 1.0;
            rig.muzzleNode.computeWorldMatrix(true);
            const from = rig.muzzleNode.getAbsolutePosition().clone();
            const lead = playerPos.add((playerVel || BABYLON.Vector3.Zero()).scale(dist / 175)).add(new BABYLON.Vector3(
              (Math.random() - 0.5) * 9.5, (Math.random() - 0.5) * 7.5, (Math.random() - 0.5) * 9.5
            ));
            const shotDir = lead.subtract(from).normalize();
            const es = BABYLON.MeshBuilder.CreateCylinder('dreadFlakShot', { diameter: 0.34, height: 3.6, tessellation: 6 }, this.scene);
            es.position.copyFrom(from);
            es.lookAt(from.add(shotDir));
            es.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
            es.material = tracerMat;
            es.isPickable = false;
            enemyShots.push({ mesh: es, vel: shotDir.scale(175), life: 2.2 });
          }
        }
      }
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.root?.dispose();
    for (const m of this._ownedMaterials || []) m?.dispose?.();
    for (const t of this._ownedTextures || []) t?.dispose?.();
  }
}
