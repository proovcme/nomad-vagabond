import { installLiftPropellers } from './props/liftPropellers.js';
import { createRustedMetalTexture } from './textures.js?v=mission1';

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

/**
 * Enemy Flying Fortress Island ("Железный Монолит") for the Bastion Flak 88 Defense mission.
 * Advances menacingly toward Vagabond while launching air raids; can be shattered and downed
 * by heavy anti-island "Громобой" missiles and 88mm Flak fire, triggering a 7-second breakup
 * into tumbling rock chunks and fiery collapse into the cloud sea.
 */
export class EnemyFortressIsland {
  constructor(scene, targetBasePos) {
    const B = BABYLON;
    this.scene = scene;
    this.name = 'Вражеский остров-крепость «Монолит»';
    this.targetBasePos = targetBasePos.clone();
    this.maxHp = 900;
    this.hp = this.maxHp;
    this.alive = true;
    this.collapsing = false;
    this.collapseTimer = 0;
    this.collapseBlastCd = 0;
    this.disposed = false;
    this.chunks = [];
    this.velocity = new B.Vector3();

    this.root = new B.TransformNode('enemyFortressIslandRoot', scene);
    // Start 410m ahead-port of Vagabond's Flak 88 terrace, looming dramatically in the sunset sky
    this.root.position.copyFrom(targetBasePos).addInPlace(new B.Vector3(245, 58, 315));

    const isNull = scene.getEngine() instanceof B.NullEngine;
    let rockDiff = null, rockNorm = null, armorDiff = null;
    if (!isNull) {
      rockDiff = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
      rockDiff.uScale = rockDiff.vScale = 3.5; rockDiff.anisotropicFilteringLevel = 8;
      rockNorm = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', scene);
      rockNorm.uScale = rockNorm.vScale = 3.5; rockNorm.gammaSpace = false; rockNorm.level = 0.9;
      armorDiff = new B.Texture('./assets/textures/nomad/armored-deck-plates.png', scene);
      armorDiff.uScale = armorDiff.vScale = 4.0; armorDiff.anisotropicFilteringLevel = 8;
    }

    const rockMat = new B.PBRMaterial('enemyIslRockMat', scene);
    rockMat.albedoColor = c3('#78726c');
    rockMat.metallic = 0.05;
    rockMat.roughness = 0.88;
    if (rockDiff) {
      rockMat.albedoTexture = rockDiff;
      rockMat.bumpTexture = rockNorm;
    }

    const armorMat = new B.PBRMaterial('enemyIslArmorMat', scene);
    armorMat.albedoColor = c3('#767b7e');
    armorMat.metallic = 0.56;
    armorMat.roughness = 0.46;
    armorMat.environmentIntensity = 0.70;
    if (armorDiff) {
      armorMat.albedoTexture = armorDiff;
    }

    const crimsonMat = new B.PBRMaterial('enemyIslCrimsonMat', scene);
    crimsonMat.albedoColor = c3('#962a20');
    crimsonMat.metallic = 0.24;
    crimsonMat.roughness = 0.65;

    const coreMat = new B.StandardMaterial('enemyIslCoreMat', scene);
    coreMat.emissiveColor = c3('#ff5a1f');
    coreMat.disableLighting = true;

    const reg = (m, mat) => {
      m.parent = this.root;
      m.material = mat;
      m.isPickable = false;
      m.alwaysSelectAsActiveMesh = true;
      return m;
    };

    // 1. Massive craggy rock body & deep stalactite keel
    const mainRock = reg(B.MeshBuilder.CreateCylinder('enemyIslMainRock', { diameterTop: 64, diameterBottom: 24, height: 42, tessellation: 12, subdivisions: 3 }, scene), rockMat);
    mainRock.position.y = -10;
    const keel = reg(B.MeshBuilder.CreateCylinder('enemyIslKeel', { diameterTop: 26, diameterBottom: 4, height: 34, tessellation: 10 }, scene), rockMat);
    keel.position.y = -46;
    for (const [cx, cy, cz, r, h] of [[-24, -4, 14, 18, 28], [26, -8, -12, 20, 32], [-10, -14, -24, 16, 26], [18, -6, 20, 17, 24]]) {
      const crag = reg(B.MeshBuilder.CreateCylinder(`enemyIslCrag_${cx}_${cz}`, { diameterTop: r, diameterBottom: r * 0.45, height: h, tessellation: 9 }, scene), rockMat);
      crag.position.set(cx, cy, cz);
    }

    // 2. Heavy ironclad citadel, bastion towers & smokestacks on top plateau
    const deck = reg(B.MeshBuilder.CreateCylinder('enemyIslDeck', { diameter: 56, height: 2.8, tessellation: 14 }, scene), armorMat);
    deck.position.y = 11.5;

    const citadel = reg(B.MeshBuilder.CreateBox('enemyIslCitadel', { width: 26, height: 14, depth: 22 }, scene), armorMat);
    citadel.position.set(0, 19.5, 0);

    const band = reg(B.MeshBuilder.CreateBox('enemyIslBanner', { width: 27, height: 2.6, depth: 23 }, scene), crimsonMat);
    band.position.set(0, 21.5, 0);

    for (const [sx, sz, sh] of [[-14, -10, 22], [14, -10, 22], [-14, 10, 18], [14, 10, 18]]) {
      const tower = reg(B.MeshBuilder.CreateCylinder(`enemyIslTower_${sx}_${sz}`, { diameterTop: 6.5, diameterBottom: 8.2, height: sh, tessellation: 8 }, scene), armorMat);
      tower.position.set(sx, 12 + sh * 0.5, sz);
      const beacon = reg(B.MeshBuilder.CreateSphere(`enemyIslBeacon_${sx}_${sz}`, { diameter: 2.2, segments: 6 }, scene), coreMat);
      beacon.position.set(sx, 12 + sh + 1.2, sz);
    }

    this.liftDrive=installLiftPropellers(this.root,[
      {x:-12,y:-36,offset:23,radius:10,anchorY:-19,anchorZ:10},
      {x:12,y:-38,offset:23,radius:11,anchorY:-20,anchorZ:9},
    ],{mount:armorMat,blade:scene.getMaterialByName('cfCruiserWhiteMat')||armorMat});

    this._rockMat = rockMat;
    this._armorMat = armorMat;
    this._ownedMaterials = [rockMat, armorMat, crimsonMat, coreMat];
    this._ownedTextures = rustTex ? [rustTex.albedoTex, rustTex.bumpTex] : [];
  }

  /** Apply hit damage from Flak 88 shell or Anti-Island Missile. */
  applyDamage(dmg, hitPos, spawnExplosionFn, audio) {
    if (!this.alive || this.collapsing) return false;
    this.hp = Math.max(0, this.hp - dmg);
    spawnExplosionFn?.(hitPos || this.root.position.clone(), dmg >= 200 ? 3.2 : 1.3);
    if (this.hp <= 0) {
      this.alive = false;
      this.collapsing = true;
      this.collapseTimer = 7.2;
      this.collapseBlastCd = 0.08;
      this._spawnShatterChunks();
      spawnExplosionFn?.(this.root.position.add(new BABYLON.Vector3(0, -24, 0)), 4.0);
      audio?.playExplosion?.(1.0);
      return true;
    }
    return false;
  }

  _spawnShatterChunks() {
    const B = BABYLON;
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 12 + Math.random() * 20;
      const chunk = B.MeshBuilder.CreateCylinder(`enemyIslBreakChunk_${i}`, {
        diameterTop: 6 + Math.random() * 7,
        diameterBottom: 3 + Math.random() * 5,
        height: 8 + Math.random() * 11,
        tessellation: 7,
      }, this.scene);
      chunk.position.copyFrom(this.root.position).addInPlace(new B.Vector3(
        Math.cos(ang) * dist,
        (Math.random() - 0.3) * 24,
        Math.sin(ang) * dist
      ));
      chunk.material = i % 3 === 0 ? this._armorMat : this._rockMat;
      chunk.isPickable = false;
      chunk.alwaysSelectAsActiveMesh = true;
      this.chunks.push({
        mesh: chunk,
        vel: new B.Vector3(Math.cos(ang) * (12 + Math.random() * 14), 6 + Math.random() * 12, Math.sin(ang) * (12 + Math.random() * 14)),
        rotVel: new B.Vector3((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8),
      });
    }
  }

  update(dt, spawnExplosionFn, audio) {
    if (this.disposed) return;

    this.liftDrive.power=this.collapsing ? 0 : 1;

    if (this.collapsing) {
      this.collapseTimer -= dt;
      this.collapseBlastCd -= dt;
      // Heavy dramatic tilt and plunge into the cloud sea
      this.root.position.y -= (14.0 + (7.2 - this.collapseTimer) * 3.2) * dt;
      this.root.rotation.z += 0.14 * dt;
      this.root.rotation.x -= 0.09 * dt;

      for (const ch of this.chunks) {
        if (!ch.mesh || ch.mesh.isDisposed()) continue;
        ch.vel.y -= 21.0 * dt;
        ch.mesh.position.addInPlace(ch.vel.scale(dt));
        ch.mesh.rotation.x += ch.rotVel.x * dt;
        ch.mesh.rotation.y += ch.rotVel.y * dt;
        ch.mesh.rotation.z += ch.rotVel.z * dt;
      }

      if (this.collapseBlastCd <= 0) {
        this.collapseBlastCd = 0.45 + Math.random() * 0.28;
        const off = new BABYLON.Vector3((Math.random() - 0.5) * 44, (Math.random() - 0.5) * 28, (Math.random() - 0.5) * 44);
        spawnExplosionFn?.(this.root.position.add(off), 2.8 + Math.random() * 1.1);
        audio?.playExplosion?.(0.85);
      }

      if (this.collapseTimer <= 0 || this.root.position.y < -150) {
        spawnExplosionFn?.(this.root.position.clone(), 4.0);
        audio?.playExplosion?.(1.0);
        this.dispose();
      }
      return;
    }

    if (!this.alive) return;

    // Persistent damage fires & slight structural list as fortress takes heavy hits
    const hpRatio = this.hp / Math.max(1, this.maxHp);
    this.missileCadenceScale = hpRatio < 0.45 ? 1.65 : 1.0;
    this._dmgFireCd = Math.max(0, (this._dmgFireCd || 0) - dt);
    if (hpRatio < 0.68 && this._dmgFireCd <= 0) {
      this._dmgFireCd = hpRatio < 0.35 ? 0.65 : 1.3;
      const off = new BABYLON.Vector3((Math.random() - 0.5) * 32, 6 + Math.random() * 18, (Math.random() - 0.5) * 32);
      spawnExplosionFn?.(this.root.position.add(off), hpRatio < 0.35 ? 1.35 : 0.85);
    }
    this.root.rotation.z += ((1 - hpRatio) * 0.14 - this.root.rotation.z) * Math.min(1, dt * 1.2);

    // Slowly advance menacingly toward Vagabond until ~175m standoff distance, then hover & rock gently
    const toBase = this.targetBasePos.add(new BABYLON.Vector3(0, 46, 0)).subtract(this.root.position);
    const dist = toBase.length();
    if (dist > 185) {
      const dir = toBase.scale(1 / dist);
      this.velocity.copyFrom(dir.scale(6.2));
      this.root.position.addInPlace(this.velocity.scale(dt));
    } else {
      this.velocity.set(0, Math.sin(performance.now() * 0.001) * 1.2, 0);
      this.root.position.y += this.velocity.y * dt;
    }
    this.root.rotation.y += dt * 0.045;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const ch of this.chunks) ch.mesh?.dispose?.();
    this.chunks = [];
    this.root?.dispose();
    for (const m of this._ownedMaterials || []) m?.dispose?.();
    for (const t of this._ownedTextures || []) t?.dispose?.();
  }
}
