/**
 * Combat HUD Controller — caches DOM elements, Canvas2D tactical radar,
 * hitmarkers, directional damage arc, boss/base HP bars, and turret/FPV overlays.
 */

export class CombatHUD {
  constructor(canvas) {
    this.canvas = canvas;
    this.els = {
      leadPipper: document.getElementById('lead-pipper'),
      targetBox: document.getElementById('target-box'),
      targetHpFill: document.getElementById('target-hp-fill'),
      targetDist: document.getElementById('target-dist-label'),
      offscreenChev: document.getElementById('offscreen-chevron'),
      rwrAlert: document.getElementById('rwr-alert'),
      combatLead: document.getElementById('combat-lead'),
      turretBar: document.getElementById('turret-weapon-bar'),
      btnSam: document.getElementById('btn-turret-sam'),
      btnHeavyAuto: document.getElementById('btn-turret-heavy-auto'),
      btnHeavyFpv: document.getElementById('btn-turret-heavy-fpv'),
      missileCamHud: document.getElementById('missile-cam-hud'),
      missileTelemetry: document.getElementById('missile-cam-telemetry'),
      cockpitCanopy: document.getElementById('cockpit-canopy-frame'),
      turretReticle: document.getElementById('turret-reticle'),
      hitmarker: document.getElementById('hitmarker'),
      damageArc: document.getElementById('damage-arc'),
      bossBar: document.getElementById('boss-hp-bar'),
      bossEnemyRow: document.getElementById('boss-enemy-row'),
      bossEnemyName: document.getElementById('boss-enemy-name'),
      bossEnemyFill: document.getElementById('boss-enemy-fill'),
      bossEnemyPct: document.getElementById('boss-enemy-pct'),
      bossBaseRow: document.getElementById('boss-base-row'),
      bossBaseFill: document.getElementById('boss-base-fill'),
      bossBasePct: document.getElementById('boss-base-pct'),
      radarWrap: document.getElementById('tactical-radar-wrap'),
      radarCanvas: document.getElementById('tactical-radar'),
      victoryTitle: document.getElementById('victory-title'),
    };
    this.radarCtx = this.els.radarCanvas ? this.els.radarCanvas.getContext('2d') : null;
    this.radarTicks = 0;
    this.hitmarkerTimer = 0;
    this.damageArcTimer = 0;
  }

  flashHitmarker(isKill = false) {
    if (!this.els.hitmarker) return;
    this.els.hitmarker.classList.toggle('kill', Boolean(isKill));
    this.els.hitmarker.classList.add('show');
    this.hitmarkerTimer = isKill ? 0.28 : 0.14;
  }

  flashDamageArc(sourceWorldPos, camera) {
    if (!this.els.damageArc || !camera) return;
    let angDeg = 0;
    if (sourceWorldPos) {
      const camPos = camera.position;
      const fwd = camera.getForwardRay().direction;
      const right = BABYLON.Vector3.Cross(fwd, BABYLON.Axis.Y);
      if (right.lengthSquared() > 0.001) right.normalize();
      const toSrc = sourceWorldPos.subtract(camPos);
      const fx = BABYLON.Vector3.Dot(toSrc, right);
      const fz = BABYLON.Vector3.Dot(toSrc, fwd);
      angDeg = Math.atan2(fx, fz) * (180 / Math.PI);
    }
    this.els.damageArc.style.transform = `rotate(${angDeg.toFixed(1)}deg)`;
    this.els.damageArc.classList.add('show');
    this.damageArcTimer = 0.45;
  }

  tickTimers(dt) {
    if (this.hitmarkerTimer > 0) {
      this.hitmarkerTimer = Math.max(0, this.hitmarkerTimer - dt);
      if (this.hitmarkerTimer <= 0 && this.els.hitmarker) this.els.hitmarker.classList.remove('show', 'kill');
    }
    if (this.damageArcTimer > 0) {
      this.damageArcTimer = Math.max(0, this.damageArcTimer - dt);
      if (this.damageArcTimer <= 0 && this.els.damageArc) this.els.damageArc.classList.remove('show');
    }
  }

  updateRadar({ activeEnemies, gameState, controlMode, worldMode, activeFlakRig, ship, camera, asteroidBase, demoState }) {
    if (!this.els.radarWrap || !this.radarCtx) return;
    const show = gameState === 'playing' && (controlMode === 'aircraft' || controlMode === 'turret' || controlMode === 'missile_cam') && worldMode === 'sky';
    this.els.radarWrap.style.display = show ? 'block' : 'none';
    if (!show || (++this.radarTicks % 2 !== 0)) return;

    const ctx = this.radarCtx, w = 136, h = 136, cx = 68, cy = 68, r = 62, range = 520;
    ctx.clearRect(0, 0, w, h);
    // 1930s Interbellum amber-phosphor CRT scope rings & degree ticks
    ctx.strokeStyle = 'rgba(218, 184, 108, 0.28)';
    ctx.lineWidth = 1;
    for (const ring of [0.33, 0.66, 1.0]) {
      ctx.beginPath(); ctx.arc(cx, cy, r * ring, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();

    const refPos = controlMode === 'turret' && activeFlakRig?.root ? activeFlakRig.root.getAbsolutePosition() : (ship?.group?.position || BABYLON.Vector3.Zero());
    const fwd = camera ? camera.getForwardRay().direction : new BABYLON.Vector3(0, 0, -1);
    const heading = Math.atan2(fwd.x, fwd.z);
    const cosH = Math.cos(heading), sinH = Math.sin(heading);
    const sweep = (performance.now() * 0.0022) % (Math.PI * 2);
    // Phosphor afterglow sweep wedge
    ctx.fillStyle = 'rgba(212, 186, 102, 0.14)';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, sweep - Math.PI * 0.5 - 0.38, sweep - Math.PI * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(244, 212, 124, 0.62)';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(sweep) * r, cy - Math.cos(sweep) * r); ctx.stroke();

    const toRadar = (worldPos) => {
      const dx = worldPos.x - refPos.x;
      const dz = worldPos.z - refPos.z;
      const rx = -(dx * cosH - dz * sinH);
      const ry = -(dx * sinH + dz * cosH);
      const d = Math.hypot(rx, ry);
      const clampScale = d > range ? range / d : 1;
      return { x: cx + (rx * clampScale / range) * (r - 5), y: cy + (ry * clampScale / range) * (r - 5), dy: worldPos.y - refPos.y };
    };

    if (asteroidBase) {
      const bp = toRadar(asteroidBase.group.position);
      ctx.fillStyle = '#e8c46a';
      ctx.fillRect(bp.x - 4, bp.y - 4, 8, 8);
    }
    for (const en of activeEnemies || []) {
      if (!en?.root) continue;
      const p = toRadar(en.root.position);
      const isIncMissile = demoState?.incomingIslandMissiles?.includes(en);
      const isBoss = en === demoState?.dreadnought || en === demoState?.enemyIsland;
      if (isIncMissile) {
        ctx.strokeStyle = Math.floor(performance.now() / 160) % 2 === 0 ? '#ff6b22' : '#ffe680';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(p.x - 4, p.y - 4); ctx.lineTo(p.x + 4, p.y + 4); ctx.moveTo(p.x + 4, p.y - 4); ctx.lineTo(p.x - 4, p.y + 4); ctx.stroke();
      } else if (isBoss) {
        ctx.fillStyle = '#ff4433';
        ctx.beginPath(); ctx.moveTo(p.x, p.y - 6); ctx.lineTo(p.x + 6, p.y); ctx.lineTo(p.x, p.y + 6); ctx.lineTo(p.x - 6, p.y); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = '#ff5442';
        ctx.beginPath();
        if (p.dy > 20) { ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x + 3.5, p.y + 3); ctx.lineTo(p.x - 3.5, p.y + 3); }
        else if (p.dy < -20) { ctx.moveTo(p.x, p.y + 4); ctx.lineTo(p.x + 3.5, p.y - 3); ctx.lineTo(p.x - 3.5, p.y - 3); }
        else { ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); }
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.fillStyle = '#e8f5d8';
    ctx.beginPath(); ctx.moveTo(cx, cy - 5); ctx.lineTo(cx + 4, cy + 4); ctx.lineTo(cx, cy + 2); ctx.lineTo(cx - 4, cy + 4); ctx.closePath(); ctx.fill();
  }

  hideAll() {
    if (this.els.leadPipper) this.els.leadPipper.style.display = 'none';
    if (this.els.targetBox) this.els.targetBox.style.display = 'none';
    if (this.els.offscreenChev) this.els.offscreenChev.style.display = 'none';
    if (this.els.rwrAlert) this.els.rwrAlert.style.display = 'none';
    if (this.els.combatLead) this.els.combatLead.hidden = true;
    if (this.els.turretBar) this.els.turretBar.style.display = 'none';
    if (this.els.missileCamHud) this.els.missileCamHud.style.display = 'none';
    if (this.els.cockpitCanopy) this.els.cockpitCanopy.style.display = 'none';
    if (this.els.turretReticle) this.els.turretReticle.style.display = 'none';
    if (this.els.bossBar) this.els.bossBar.style.display = 'none';
    if (this.els.radarWrap) this.els.radarWrap.style.display = 'none';
    if (this.els.hitmarker) this.els.hitmarker.classList.remove('show', 'kill');
    if (this.els.damageArc) this.els.damageArc.classList.remove('show');
  }
}
