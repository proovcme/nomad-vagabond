/**
 * Chapter 2: «Перехват у Дувра» — Full scripted Interwar aerial-naval battle.
 * Features:
 *   - 215m Heavy Battleship «Колосс» (HMS Nelson profile) with 3 destructible subsystems & AA wing mounts
 *   - Tribal-class escort destroyer
 *   - Live main-battery 152mm triple-turret fire support from «Бродяга» (scaled by shipyard radars/generators)
 *   - Radio dialogue beats, HUD markers, and multi-stage explosions on subsystem & flagship kills
 */
import { buildHeavyBattleship } from '../props/heavyBattleship.js';
import { buildPursuitDestroyer } from '../props/pursuitDestroyer.js';

export class DoverConvoyMission {
  constructor(scene, world, base, { ui = null, audio = null, explode = null, construction = null } = {}) {
    const B = BABYLON;
    this.scene = scene;
    this.world = world;
    this.base = base;
    this.ui = ui;
    this.audio = audio;
    this.explode = explode;
    this.construction = construction;
    this.disposed = false;
    this.time = 0;
    this.stage = 'approach';
    this.radioSent = new Set();

    const origin = base.group.position;
    this.origin = origin.clone();

    // Flagship Battleship «Колосс» cruising broadside 720m off Vagabond's port bow
    this.battleship = buildHeavyBattleship(scene);
    this.battleship.position.copyFrom(origin).addInPlaceFromFloats(-420, 68, -640);
    this.battleship.rotation.y = 0.25;
    this._battleAngle = 0;
    this._battleSink = 0;

    // Escort Tribal-class destroyer screening the flagship
    this.escort = buildPursuitDestroyer(scene);
    this.escort.position.copyFrom(this.battleship.position).addInPlaceFromFloats(125, -10, 145);
    this.escort.hp = 260;
    this.escort.maxHp = 260;
    this.escort.alive = true;
    this._escortSink = 0;
    for (const target of [this.battleship, this.escort]) {
      for (const mesh of target.getChildMeshes()) {
        mesh.metadata = {...mesh.metadata, convoyTarget:target};
      }
    }

    // Shared tracer materials
    this.enemyTracerMat = new B.StandardMaterial('doverEnemyTracer', scene);
    this.enemyTracerMat.disableLighting = true;
    this.enemyTracerMat.emissiveColor = new B.Color3(1.0, 0.48, 0.16);

    this.friendlyTracerMat = new B.StandardMaterial('doverFriendlyTracer', scene);
    this.friendlyTracerMat.disableLighting = true;
    this.friendlyTracerMat.emissiveColor = new B.Color3(1.0, 0.88, 0.42);

    this.projectiles = [];
    this.vagSalvoCd = 4.5;
    this.enemyFlakCd = 3.8;
    this.completed = false;

    this._createHudMarkers();
    this._radio('intro', 'МОСТИК «БРОДЯГИ»', 'На горизонте у скал Дувра — тяжёлый линкор «Колосс» с эскортом Tribal! Прикрываем тебя главным калибром. Бей по узлам линкора торпедами (T) и пушками!');
    scene.onDisposeObservable.addOnce(() => this.dispose());
  }

  _createHudMarkers() {
    if (this.scene.getEngine() instanceof BABYLON.NullEngine || typeof document === 'undefined') return;
    this.markerLayer = document.createElement('div');
    this.markerLayer.id = 'dover-convoy-markers';
    this.markerLayer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:24;overflow:hidden;';
    document.body.appendChild(this.markerLayer);

    const makeTag = (color) => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;transform:translate(-50%,-50%);color:${color};text-shadow:0 1px 4px #000d;font:700 11px/1.2 "Courier New",monospace;white-space:nowrap;display:none;background:rgba(16,22,18,0.62);padding:2px 6px;border:1px solid ${color}66;border-radius:2px;`;
      this.markerLayer.appendChild(el);
      return el;
    };
    this.flagshipTag = makeTag('#ff9e68');
    this.escortTag = makeTag('#ffd57a');
  }

  _radio(id, speaker, text) {
    if (this.radioSent.has(id)) return;
    this.radioSent.add(id);
    this.ui?.showRadio?.('dispatcher', text, 5600, speaker);
    this.audio?.playObjective?.();
  }

  get priorityTarget() {
    if (this.completed) return null;
    return this.escort.alive ? this.escort : this.battleship;
  }

  get readyForDebrief() {
    return this.completed && this._battleSink >= 3;
  }

  getObjectiveText() {
    if (this.completed) return 'Линкор «Колосс» уничтожен! Архипелаг Дувра свободен.';
    const bPct = Math.max(0, Math.round((this.battleship.hp / this.battleship.maxHp) * 100));
    const aliveSubs = this.battleship.subsystems.filter(s => s.alive).length;
    const escTxt = this.escort.alive ? ` · Эсминец Tribal: ${Math.round((this.escort.hp / this.escort.maxHp) * 100)}%` : '';
    return `Уничтожить линкор «Колосс» (${bPct}% · узлов: ${aliveSubs}/3)${escTxt}`;
  }

  /**
   * Called when player projectiles / torpedoes / bombs impact near enemy ships.
   */
  onPlayerHit(pos, damage = 25, target = null) {
    if (this.disposed || this.completed || !pos) return false;
    const B = BABYLON;

    // 1. Check escort destroyer
    if (this.escort.alive && (target ? target === this.escort : B.Vector3.Distance(pos, this.escort.position) < 62)) {
      this.escort.hp = Math.max(0, this.escort.hp - damage);
      this.explode?.(pos, 1.4);
      if (this.escort.hp <= 0) {
        this.escort.alive = false;
        this.explode?.(this.escort.position.clone().addInPlaceFromFloats(0, 8, 0), 3.6);
        this.audio?.playExplosion?.(1.0);
        this.construction?.addSalvage?.(60);
        this.construction?.saveState?.();
        this._radio('escort_down', 'МОСТИК «БРОДЯГИ»', 'Эсминец Tribal выведен из строя! Переносим огонь всех башен на «Колосс» (+60 лома)!');
      }
      return true;
    }

    // 2. Check flagship Battleship «Колосс» & its 3 subsystems
    if (this.battleship.alive && (target ? target === this.battleship : B.Vector3.Distance(pos, this.battleship.position) < 118)) {
      this.battleship.computeWorldMatrix(true);
      const wm = this.battleship.getWorldMatrix();
      let hitSub = null;
      for (const sub of this.battleship.subsystems) {
        if (!sub.alive) continue;
        const wPos = B.Vector3.TransformCoordinates(sub.localPos, wm);
        if (B.Vector3.Distance(pos, wPos) < 42) {
          hitSub = sub;
          break;
        }
      }
      if (hitSub) {
        hitSub.hp = Math.max(0, hitSub.hp - damage * 1.35);
        if (hitSub.hp <= 0) {
          hitSub.alive = false;
          const wPos = B.Vector3.TransformCoordinates(hitSub.localPos, wm);
          this.explode?.(wPos, 3.2);
          this.audio?.playExplosion?.(1.0);
          this.battleship.hp = Math.max(0, this.battleship.hp - 120);
          this.construction?.addSalvage?.(45);
          this.construction?.saveState?.();
          this.ui?.showToast?.(`💥 Уничтожен узел «Колосса»: ${hitSub.name}! (+45 лома)`, 4200);
        }
      }
      this.battleship.hp = Math.max(0, this.battleship.hp - damage);
      this.explode?.(pos, 1.6);
      if (this.battleship.hp <= 0) {
        this._sinkBattleship();
      }
      return true;
    }
    return false;
  }

  _sinkBattleship() {
    if (!this.battleship.alive) return;
    this.battleship.alive = false;
    this.completed = true;
    const p = this.battleship.position;
    this.explode?.(p.clone().addInPlaceFromFloats(-40, 14, 0), 4.2);
    this.explode?.(p.clone().addInPlaceFromFloats(25, 22, 0), 4.6);
    this.audio?.playExplosion?.(1.2);
    this.construction?.addSalvage?.(150);
    this.construction?.saveState?.();
    this._radio('victory', 'МОСТИК «БРОДЯГИ»', '«Колосс» разваливается и уходит в облака! Чистая работа, пилот (+150 лома)!');
  }

  update(dt, ship, camera, onPlayerDamage) {
    if (this.disposed) return;
    const B = BABYLON;
    this.time += dt;

    // 1. Battleship «Колосс» majestic circular cruise around Vagabond (580m radius)
    if (this.battleship.alive) {
      this._battleAngle += dt * 0.036;
      const r = 560;
      const bx = this.origin.x - 160 + Math.cos(this._battleAngle - 1.9) * r;
      const bz = this.origin.z - 120 + Math.sin(this._battleAngle - 1.9) * r;
      const by = this.origin.y + 62 + Math.sin(this.time * 0.35) * 4.5;
      const prev = this.battleship.position.clone();
      this.battleship.position.set(bx, by, bz);
      const dx = bx - prev.x, dz = bz - prev.z;
      if (Math.hypot(dx, dz) > 0.001) {
        this.battleship.rotation.y = Math.atan2(dz, -dx);
      }
      // Track Vagabond with the 3 all-forward triple 16-inch turrets
      const toVag = this.origin.subtract(this.battleship.position);
      const desiredYaw = Math.atan2(toVag.z, -toVag.x) - this.battleship.rotation.y;
      for (const t of this.battleship.mainTurrets || []) {
        t.yawPivot.rotation.y = Math.max(-1.6, Math.min(1.6, desiredYaw));
      }
    } else if (this._battleSink < 12) {
      this._battleSink += dt;
      this.battleship.position.y -= dt * 16;
      this.battleship.rotation.z += dt * 0.09;
      this.battleship.rotation.x += dt * 0.04;
    }

    // 2. Escort Tribal destroyer screens the flagship
    if (this.escort.alive) {
      const eAng = this._battleAngle + 0.24;
      const ex = this.origin.x - 160 + Math.cos(eAng - 1.9) * 430;
      const ez = this.origin.z - 120 + Math.sin(eAng - 1.9) * 430;
      const ey = this.origin.y + 48 + Math.sin(this.time * 0.55) * 3.5;
      const prev = this.escort.position.clone();
      this.escort.position.set(ex, ey, ez);
      const dx = ex - prev.x, dz = ez - prev.z;
      if (Math.hypot(dx, dz) > 0.001) this.escort.rotation.y = Math.atan2(dz, -dx);
    } else if (this._escortSink < 10) {
      this._escortSink += dt;
      this.escort.position.y -= dt * 18;
      this.escort.rotation.z -= dt * 0.14;
    }

    // 3. LIVE MAIN-BATTERY 152mm TRIPLE-TURRET FIRE SUPPORT FROM «БРОДЯГА»!
    const primaryTarget = this.priorityTarget;
    if (primaryTarget && this.base?.mainTurrets?.length) {
      const targetPos = primaryTarget.position.clone().addInPlaceFromFloats(0, 10, 0);
      const toTgt = targetPos.subtract(this.base.group.position);
      const aimYaw = Math.atan2(toTgt.z, -toTgt.x) - (this.base.group.rotation.y || 0);
      for (const t of this.base.mainTurrets) {
        t.yawPivot.rotation.y = Math.max(-1.9, Math.min(1.9, aimYaw));
        t.pitchPivot.rotation.z = -(0.16 + Math.min(0.22, toTgt.length() / 2200));
      }
      const radarBonus = (this.construction?.snapshot?.radars || 0) * 0.8;
      const genBonus = (this.construction?.snapshot?.generators || 0) * 0.5;
      this.vagSalvoCd -= dt;
      if (this.vagSalvoCd <= 0 && toTgt.length() < 950 + radarBonus * 180) {
        this.vagSalvoCd = Math.max(3.6, 6.8 - genBonus);
        this._fireVagabondBroadside(primaryTarget);
      }
    }

    // 4. Enemy AA Flak bursts toward player aircraft when close
    if (!this.completed && ship && !ship.dockedAsteroid && (this.battleship.alive || this.escort.alive)) {
      this.enemyFlakCd -= dt;
      const shooter = (this.escort.alive && B.Vector3.Distance(ship.group.position, this.escort.position) < 380)
        ? this.escort
        : (this.battleship.alive && B.Vector3.Distance(ship.group.position, this.battleship.position) < 480 ? this.battleship : null);
      if (shooter && this.enemyFlakCd <= 0) {
        this.enemyFlakCd = 3.2;
        const aim = ship.group.position.add(ship.velocity.scale(0.65));
        const start = shooter.position.clone().addInPlaceFromFloats(0, 18, 0);
        const tracer = B.MeshBuilder.CreateSphere('doverEnemyFlak', { diameter: 0.9, segments: 5 }, this.scene);
        tracer.material = this.enemyTracerMat;
        tracer.isPickable = false;
        tracer.position.copyFrom(start);
        this.projectiles.push({ kind: 'enemy', start, end: aim, t: 0, dur: 0.9, tracer });
      }
    }

    // 5. Update in-flight tracers (both Vagabond 152mm shells & enemy AA)
    for (const pr of this.projectiles) {
      pr.t += dt / pr.dur;
      const u = Math.min(1, pr.t);
      const p = B.Vector3.Lerp(pr.start, pr.end, u);
      if (pr.kind === 'friendly') p.y += Math.sin(u * Math.PI) * 28; // ballistic arc!
      pr.tracer.position.copyFrom(p);
      if (pr.t >= 1) {
        pr.tracer.dispose();
        if (pr.kind === 'friendly' && pr.target?.alive) {
          this.explode?.(pr.end, 2.2);
          pr.target.hp = Math.max(0, pr.target.hp - 28);
          if (pr.target === this.battleship && pr.target.hp <= 0) this._sinkBattleship();
          else if (pr.target === this.escort && pr.target.hp <= 0) {
            this.escort.alive = false;
            this.explode?.(this.escort.position.clone(), 3.4);
          }
        } else if (pr.kind === 'enemy') {
          this.explode?.(pr.end, 1.8);
          if (!this.completed && ship && !ship.dockedAsteroid && B.Vector3.Distance(ship.group.position, pr.end) < 18) {
            onPlayerDamage?.(9);
          }
        }
      }
    }
    this.projectiles = this.projectiles.filter(p => p.t < 1);

    // 6. Update HUD markers
    this._updateMarkers(camera, ship?.group?.position);
  }

  _fireVagabondBroadside(target) {
    const B = BABYLON;
    this.base.group.computeWorldMatrix(true);
    for (const t of this.base.mainTurrets) {
      t.pitchPivot.computeWorldMatrix(true);
      const muzzle = B.Vector3.TransformCoordinates(new B.Vector3(-19, 0, 0), t.pitchPivot.getWorldMatrix());
      this.explode?.(muzzle, 0.9);
      const spread = new B.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 18);
      const end = target.position.clone().addInPlaceFromFloats(0, 10, 0).addInPlace(spread);
      const tracer = B.MeshBuilder.CreateSphere('vag152Shell', { diameter: 1.15, segments: 5 }, this.scene);
      tracer.material = this.friendlyTracerMat;
      tracer.isPickable = false;
      tracer.position.copyFrom(muzzle);
      this.projectiles.push({ kind: 'friendly', start: muzzle, end, t: 0, dur: 1.25, tracer, target });
    }
  }

  _updateMarkers(camera, playerPos) {
    if (!this.markerLayer || !camera) return;
    const eng = this.scene.getEngine();
    const canvas = eng.getRenderingCanvas();
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const transform = this.scene.getTransformMatrix();
    const vp = camera.viewport.toGlobal(w, h);

    const place = (el, node, label) => {
      if (!el) return;
      if (!node.alive) { el.style.display = 'none'; return; }
      const worldP = node.position.clone().addInPlaceFromFloats(0, 36, 0);
      const proj = BABYLON.Vector3.Project(worldP, BABYLON.Matrix.Identity(), transform, vp);
      if (proj.z >= 0 && proj.z <= 1 && proj.x > 20 && proj.x < w - 20 && proj.y > 20 && proj.y < h - 20) {
        const dist = playerPos ? Math.round(BABYLON.Vector3.Distance(playerPos, node.position)) : 0;
        const pct = Math.max(0, Math.round((node.hp / node.maxHp) * 100));
        el.style.display = 'block';
        el.style.left = `${proj.x}px`;
        el.style.top = `${proj.y}px`;
        el.textContent = `${label} · ${pct}% · ${dist}м`;
      } else {
        el.style.display = 'none';
      }
    };
    place(this.flagshipTag, this.battleship, '⚓ ЛИНКОР «КОЛОСС»');
    place(this.escortTag, this.escort, '◈ ЭСМИНЕЦ TRIBAL');
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const p of this.projectiles) p.tracer?.dispose();
    this.projectiles = [];
    this.markerLayer?.remove();
    this.battleship?.dispose();
    this.escort?.dispose();
    this.enemyTracerMat?.dispose();
    this.friendlyTracerMat?.dispose();
  }
}
