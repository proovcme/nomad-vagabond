import { UPGRADE_CATALOG } from './world.js?v=mission1';

/** Physical inputs only: no fabricated RPM or instrument-only simulation. */
export function aircraftInstrumentValues(speedMetresPerSecond, altitudeMetres, throttle) {
  const finite=v=>Number.isFinite(Number(v))?Number(v):0;
  const clamp=(v,max)=>Math.max(0,Math.min(max,finite(v)));
  const airspeedKmh=Math.round(clamp(speedMetresPerSecond,1000)*3.6);
  const altitude=Math.round(clamp(altitudeMetres,99999));
  const throttlePercent=Math.round(clamp(throttle,1)*100);
  return {airspeedKmh,altitude,throttlePercent,speedAngle:-130+Math.min(1,airspeedKmh/450)*260,altitudeAngle:-130+Math.min(1,altitude/1000)*260,throttleAngle:-130+throttlePercent*2.6};
}


export class GameUI {
  constructor() {
    this.hud = document.getElementById('hud');
    this.flightDial = document.getElementById('flight-dial');
    this.aviationInstruments=document.getElementById('aviation-instruments');
    this.throttleVal=document.getElementById('dial-throttle');
    this.currentMode='foot';
    this.hudVisible=false;
    this.thrustRow = document.getElementById('thrust-row');
    this.hullLabel = document.getElementById('hull-label');
    this.fuelLabel = document.getElementById('fuel-label');

    this.modeLabel = document.getElementById('mode-label');
    this.speedVal = document.getElementById('speed-val');
    this.dialSpeed = document.getElementById('dial-speed');
    this.dialAlt = document.getElementById('dial-alt');
    this.dialVspd = document.getElementById('dial-vspd');

    this.compassHdg = document.getElementById('compass-hdg');
    this.compassTicks = [
      document.getElementById('compass-l3'),
      document.getElementById('compass-l2'),
      document.getElementById('compass-l1'),
      null,
      document.getElementById('compass-r1'),
      document.getElementById('compass-r2'),
      document.getElementById('compass-r3'),
    ];
    this.navTargetMarker = document.getElementById('nav-target-marker');
    this.navTargetName = document.getElementById('nav-target-name');
    this.navTargetDist = document.getElementById('nav-target-dist');
    this.locationBanner = document.getElementById('location-banner');
    this._lastLocKey = null;
    this._locBannerTimer = null;

    this.hullFill = document.getElementById('hull-fill');
    this.hullPct = document.getElementById('hull-pct');
    this.fuelFill = document.getElementById('fuel-fill');
    this.fuelPct = document.getElementById('fuel-pct');
    this.sailStateLabel = document.getElementById('sail-state-label');
    this.sailEffPct = document.getElementById('sail-eff-pct');
    this.sailFill = document.getElementById('sail-fill');

    this.windArrow = document.getElementById('wind-arrow');
    this.sailBar = document.getElementById('sail-bar');

    this.stormBanner = document.getElementById('storm-banner');
    this.locationName = document.getElementById('location-name');
    this.biomeLabel = document.getElementById('biome-label');
    this.keysCount = document.getElementById('keys-count');
    this.seedDisplay = document.getElementById('seed-display');
    this.upgradesBar = document.getElementById('upgrades-bar');
    this.heatWrap = document.getElementById('heat-wrap');
    this.heatFill = document.getElementById('heat-fill');
    this.heatPct = document.getElementById('heat-pct');
    this.questTitle = document.getElementById('quest-title');
    this.questDesc = document.getElementById('quest-desc');

    this.promptEl = document.getElementById('interact-prompt');
    this.toastEl = document.getElementById('toast-msg');

    this.scannerOverlay = document.getElementById('scanner-overlay');
    this.scannerInfo = document.getElementById('scanner-info');
    this.chartCanvas = document.getElementById('chart-canvas');
    this.systemLog = document.getElementById('system-log');
    this.mapStarInfo = document.getElementById('map-star-info');

    this.toastTimeout = null;
  }

  showHUD(visible) {
    this.hudVisible=Boolean(visible);
    this.hud.style.display = this.hudVisible ? 'block' : 'none';
    this.hud.setAttribute('aria-hidden',String(!this.hudVisible));
  }

  setHudScale(scale = 1) {
    document.documentElement.style.setProperty('--hud-scale', String(scale));
  }

  setMode(mode) {
    const isFoot = mode === 'foot',isAircraft=mode==='aircraft';
    this.currentMode=mode;this.hud.dataset.controlMode=mode;
    if(this.aviationInstruments)this.aviationInstruments.hidden=!isAircraft;
    if (this.flightDial) this.flightDial.style.display = isAircraft ? 'flex' : 'none';
    if (this.thrustRow) this.thrustRow.style.display = isFoot ? 'none' : 'grid';
    if (this.hullLabel) this.hullLabel.textContent = isFoot ? 'Корпус борта' : 'Броня';
    if (this.fuelLabel) this.fuelLabel.textContent = 'Топливо';
    const reticle = document.getElementById('gunsight-reticle');
    if (reticle) reticle.style.display = mode === 'aircraft' ? 'block' : 'none';

    if (mode === 'aircraft') {
      this.modeLabel.textContent = 'Авиация • Вылет';
    } else if (mode === 'ship') {
      this.modeLabel.textContent = 'Полёт • Крейсер';
    } else if (mode === 'water') {
      this.modeLabel.textContent = 'На воде';
    } else if (mode === 'drive') {
      this.modeLabel.textContent = 'На грунте';
    } else if (mode === 'asteroid') {
      this.modeLabel.textContent = 'Штурвал';
    } else {
      this.modeLabel.textContent = 'На палубе';
    }
  }

  showToast(text, duration = 3000) {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('visible');
    }, duration);
  }

  setPrompt(text) {
    if (text) {
      this.promptEl.textContent = text;
      this.promptEl.style.display = 'block';
    } else {
      this.promptEl.style.display = 'none';
    }
  }

  updateHUD(ship, player, world, mode, keysAttuned, asteroidBase = null, questState = null) {
    const rawVel = mode === 'foot'
      ? player.velocity
      : (mode === 'asteroid' && asteroidBase ? asteroidBase.velocity : ship.velocity);
    let refBodyVel = BABYLON.Vector3.Zero();
    if (mode !== 'foot' && mode !== 'asteroid') {
      if (ship.dockedPlanet) refBodyVel = ship.dockedPlanet.velocity || refBodyVel;
      else if (ship.waterPlanet) refBodyVel = ship.waterPlanet.velocity || refBodyVel;
      else if (ship.dockedAsteroid) refBodyVel = ship.dockedAsteroid.velocity || refBodyVel;
    } else if (mode === 'foot') {
      if (player.currentPlanet) refBodyVel = player.currentPlanet.velocity || refBodyVel;
      else if (player.currentAsteroid) refBodyVel = player.currentAsteroid.velocity || refBodyVel;
    }
    const activeVel = rawVel.subtract(refBodyVel);
    const spd = Math.round(activeVel.length());
    // Show speed in #speed-val ONLY in foot/asteroid modes where #flight-dial is absent or secondary; in flight #dial-speed is the sole speed readout
    if (this.speedVal) {
      this.speedVal.textContent = mode === 'aircraft' ? '' : `${spd} м/с`;
    }
    let instrumentAltitude=0;

    const fmtDist = (d) => (d >= 1000 ? `${(d / 1000).toFixed(1)} км` : `${Math.round(d)} м`);

    // Real physical altitude & vertical speed relative to nearest planet
    let nearestPlanet = ship.dockedPlanet || ship.waterPlanet || ship.nearPlanet;
    let nearestDist = Infinity;
    if (!nearestPlanet && world && world.planets) {
      const ref = ship.group ? ship.group.position : player.group.position;
      for (const p of world.planets) {
        const d = BABYLON.Vector3.Distance(ref, p.group.position) - p.radius;
        if (d < nearestDist) {
          nearestDist = d;
          nearestPlanet = p;
        }
      }
    } else if (nearestPlanet && ship.group) {
      nearestDist = BABYLON.Vector3.Distance(ship.group.position, nearestPlanet.group.position) - nearestPlanet.radius;
    }
    if (this.dialAlt && this.dialVspd) {
      if (nearestPlanet && nearestDist < 240) {
        const alt = Math.max(0, Math.round(nearestDist));
        const upDir = ship.group.position.subtract(nearestPlanet.group.position).normalize();
        const relV = activeVel.subtract(nearestPlanet.velocity || BABYLON.Vector3.Zero());
        const vSpd = Math.round(BABYLON.Vector3.Dot(relV, upDir));
        instrumentAltitude=alt;
        this.dialAlt.textContent = fmtDist(alt);
        this.dialVspd.textContent = `${vSpd >= 0 ? '▲' : '▼'} ${Math.abs(vSpd)} м/с`;
      } else {
        const altM = Math.max(0, Math.round(ship.group.position.y + 125));
        const vSpd = Math.round(activeVel.y);
        instrumentAltitude=altM;
        this.dialAlt.textContent = `${altM} м`;
        this.dialVspd.textContent = `${vSpd >= 0 ? '▲' : '▼'} ${Math.abs(vSpd)} м/с`;
      }
    }

    if(mode==='aircraft') {
      const values=aircraftInstrumentValues(spd,instrumentAltitude,ship.throttle);
      if(this.dialSpeed)this.dialSpeed.textContent=String(values.airspeedKmh);
      if(this.throttleVal)this.throttleVal.textContent=String(values.throttlePercent);
      for(const [id,angle] of [['airspeed-needle',values.speedAngle],['altimeter-needle',values.altitudeAngle],['throttle-needle',values.throttleAngle]])document.getElementById(id)?.setAttribute('transform',`rotate(${angle} 50 50)`);
    }

    if (this.heatWrap && asteroidBase) {
      const showHeat = mode === 'asteroid' || asteroidBase.heat > 1;
      this.heatWrap.style.display = showHeat ? 'grid' : 'none';
      if (showHeat) {
        const hp = Math.round(asteroidBase.heat);
        this.heatFill.style.width = `${hp}%`;
        this.heatPct.textContent = `${hp}%`;
      }
    }

    if (questState && this.questTitle && this.questDesc) {
      this.questTitle.textContent = questState.title;
      this.questDesc.textContent = questState.desc;
    }

    const h = mode === 'asteroid' ? Math.round(asteroidBase.integrity) : Math.round(Math.max(0, Math.min(100, ship.hull / (ship.maxHull || 100) * 100)));
    this.hullFill.style.width = `${h}%`;
    this.hullPct.textContent = `${h}%`;

    const f = Math.round(ship.fuel);
    this.fuelFill.style.width = `${f}%`;
    this.fuelPct.textContent = `${f}%`;

    if (ship.atmoDensity !== undefined) {
      const atmoPct = Math.round(ship.atmoDensity * 100);
      const thrPct = Math.round(Math.max(0, mode === 'asteroid' ? asteroidBase.enginePower : ship.throttle) * 100);
      this.sailStateLabel.textContent = ship.isStalling ? 'Свал!' : 'Тяга';
      this.sailEffPct.textContent = `${thrPct}%`;
      this.sailFill.style.width = `${thrPct}%`;
      if (mode === 'asteroid') {
        this.modeLabel.textContent = world.isSkyWorld ? 'КРЕЙСЕР «БРОДЯГА»' : 'ОСТРОВ «БРОДЯГА»';
        this.hullLabel.textContent = 'ЦЕЛОСТНОСТЬ';
        this.sailStateLabel.textContent = 'ДВИГАТЕЛИ';
      } else if (mode === 'drive' || ship.dockedPlanet) {
        this.modeLabel.textContent = 'На грунте';
      } else if (mode === 'water' || ship.waterPlanet) {
        this.modeLabel.textContent = 'На воде';
      } else if (ship.dockedAsteroid && mode !== 'foot') {
        this.modeLabel.textContent = 'На ВПП острова';
      } else if (mode === 'aircraft') {
        const clsName = (ship.spec && (ship.spec.label || ship.spec.name)) ? (ship.spec.label || ship.spec.name) : 'САМОЛЁТ';
        const cls = String(clsName).toUpperCase();
        this.modeLabel.textContent = ship.afterburner
          ? `${cls} • ФОРСАЖ`
          : (ship.isStalling ? `${cls} • СВАЛ!` : `${cls} • ПОЛЁТ`);
      }
    } else {
      const eff = Math.round((ship.sailEfficiency || 0) * 100);
      this.sailStateLabel.textContent = 'Тяга';
      this.sailEffPct.textContent = `${eff}%`;
      this.sailFill.style.width = `${eff}%`;
    }

    // Navigation tape: real heading & target azimuth + distance
    if (this.compassHdg && this.navTargetName && this.navTargetDist) {
      const refPos = mode === 'foot' ? player.group.position : mode === 'asteroid' ? asteroidBase.group.position : ship.group.position;
      let fwdX = 0;
      let fwdZ = -1;
      if (mode === 'asteroid') {
        const forward = asteroidBase.pilotForward();
        fwdX = forward.x; fwdZ = forward.z;
      } else if (mode === 'foot' && player.camera) {
        const dir = player.camera.getForwardRay().direction;
        fwdX = dir.x;
        fwdZ = dir.z;
      } else if (ship && ship.group && ship.group.rotationQuaternion) {
        const rm = BABYLON.Matrix.FromQuaternionToRef(ship.group.rotationQuaternion, new BABYLON.Matrix());
        const f = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rm);
        fwdX = f.x;
        fwdZ = f.z;
      }
      const yawDeg = (((Math.round((Math.atan2(fwdX, fwdZ) * 180) / Math.PI) % 360) + 360) % 360);
      const dirs = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
      const card = (d) => {
        const w = ((Math.round(d) % 360) + 360) % 360;
        const idx = w % 45 === 0 ? Math.round(w / 45) % 8 : -1;
        return idx >= 0 && w % 90 === 0 ? `${String(w).padStart(3, '0')}° ${dirs[idx]}` : `${String(w).padStart(3, '0')}°`;
      };
      this.compassHdg.textContent = `${String(yawDeg).padStart(3, '0')}° ${dirs[Math.round(yawDeg / 45) % 8]}`;
      if (this.compassTicks) {
        const offsets = [-90, -60, -30, 0, 30, 60, 90];
        offsets.forEach((off, i) => {
          if (this.compassTicks[i]) this.compassTicks[i].textContent = card(yawDeg + off);
        });
      }

      let tgtPos = null;
      if (world.missionTarget) {
        tgtPos = world.missionTarget.position;
        this.navTargetName.textContent = world.missionTarget.name;
        this.navTargetDist.textContent = fmtDist(BABYLON.Vector3.Distance(refPos, tgtPos));
      } else
      if (mode === 'foot' && ship && ship.group) {
        const dShip = Math.round(BABYLON.Vector3.Distance(refPos, ship.group.position));
        this.navTargetName.textContent = 'Самолёт «Бродяга»';
        this.navTargetDist.textContent = fmtDist(dShip);
        tgtPos = ship.group.position;
      } else {
        const tgt = (asteroidBase && asteroidBase.targetPlanet) || world.terrainPlanet || world.planets[0];
        if (!tgt) {this.navTargetName.textContent = 'Свободный курс'; this.navTargetDist.textContent = '—';}
        if (tgt) {
          const dTgt = Math.max(0, Math.round(BABYLON.Vector3.Distance(refPos, tgt.group.position) - tgt.radius));
          this.navTargetName.textContent = tgt.name;
          this.navTargetDist.textContent = fmtDist(dTgt);
          tgtPos = tgt.group.position;
        }
      }
      if (this.navTargetMarker && tgtPos) {
        const toT = tgtPos.subtract(refPos);
        const tgtDeg = ((Math.atan2(toT.x, toT.z) * 180) / Math.PI + 360) % 360;
        let rel = tgtDeg - yawDeg;
        if (rel > 180) rel -= 360;
        if (rel < -180) rel += 360;
        const pct = Math.max(4, Math.min(96, 50 + (rel / 90) * 44));
        this.navTargetMarker.style.left = `${pct.toFixed(1)}%`;
      }
    }

    const body = mode === 'foot'
      ? (player.currentAsteroid || player.currentPlanet)
      : (ship.dockedAsteroid || ship.dockedPlanet || ship.waterPlanet || ship.nearPlanet);
    const locKey = body ? body.name : (world.isSkyWorld ? 'Небесный Архипелаг' : 'Открытый Эфир');
    const locSub = body ? body.biomeLabel : (world.isSkyWorld ? 'Свободный полёт над облаками' : 'Межпланетное пространство');
    if (this.locationName) this.locationName.textContent = locKey;
    if (this.biomeLabel) this.biomeLabel.textContent = locSub;
    if (this.locationBanner && locKey !== this._lastLocKey) {
      if (this._lastLocKey !== null) {
        this.locationBanner.textContent = `${locKey} • ${locSub}`;
        this.locationBanner.classList.add('visible');
        clearTimeout(this._locBannerTimer);
        this._locBannerTimer = setTimeout(() => {
          this.locationBanner.classList.remove('visible');
        }, 2600);
      }
      this._lastLocKey = locKey;
    }

    if (this.keysCount) this.keysCount.textContent = questState?.resources || `${keysAttuned}/3`;
    if (this.seedDisplay) this.seedDisplay.textContent = world.seedStr;

    if (world.stormWarning > 0) {
      this.stormBanner.style.display = 'block';
      this.stormBanner.textContent = `ЗВЁЗДНЫЙ ШТОРМ ЧЕРЕЗ ${Math.ceil(world.stormWarning)}с`;
    } else if (world.stormActive) {
      this.stormBanner.style.display = 'block';
      this.stormBanner.textContent = 'ИДЁТ ВОЛНА ЗВЁЗДНОГО ШТОРМА';
    } else {
      this.stormBanner.style.display = 'none';
    }

    const pills = [];
    for (const id of ship.upgrades) {
      const u = UPGRADE_CATALOG.find((x) => x.id === id);
      if (u) pills.push(`<span class="upg-pill" title="${u.desc}">${u.name}</span>`);
    }
    this.upgradesBar.innerHTML = pills.join('');
  }

  updateScanner(active, camera, world, ship, audio) {
    this.scannerOverlay.style.display = active ? 'block' : 'none';
    if (!active) return;

    const camDir = camera.getForwardRay().direction.clone().normalize();
    const maxRange = ship.upgrades.has('astral_compass') ? 450 : 280;

    const targets = [];
    for (const ob of world.obelisks) {
      if (!ob.activated) {
        targets.push({ label: ob.label, pos: ob.crystal.getAbsolutePosition().clone() });
      }
    }
    for (const u of world.upgrades) {
      if (!u.collected) {
        targets.push({ label: `Модуль: ${u.data.name}`, pos: u.mesh.getAbsolutePosition().clone() });
      }
    }
    if (world.gate) {
      targets.push({ label: 'Врата Перехода', pos: world.gate.group.position.clone() });
    }

    let best = null;
    let bestDot = -1;
    for (const t of targets) {
      const toT = t.pos.subtract(camera.position);
      const dist = toT.length();
      if (dist > maxRange) continue;
      const dot = BABYLON.Vector3.Dot(toT.normalize(), camDir);
      if (dot > bestDot) {
        bestDot = dot;
        best = { ...t, dist, dot };
      }
    }

    if (best) {
      const pct = Math.max(0, Math.round(best.dot * 100));
      this.scannerInfo.textContent = `${best.label} • ${Math.round(best.dist)} м • Резонанс ${pct}%`;
      if (best.dot > 0.72) audio.playPing((best.dot - 0.72) / 0.28);
    } else {
      this.scannerInfo.textContent = 'Нет сигналов в радиусе сканера';
    }
  }

  renderChart(world, ship, asteroidBase = null) {
    this.mapStarInfo.textContent = `${world.starType?.name || 'Небесный архипелаг'} • ${world.seedStr}`;

    const ctx = this.chartCanvas.getContext('2d');
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 0.72;

    ctx.clearRect(0, 0, w, h);

    // Subtle polar navigation grid
    ctx.strokeStyle = 'rgba(196, 156, 86, 0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(w - 20, cy);
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, h - 20);
    ctx.stroke();

    if (world.isSkyWorld) {
      const maxRange = Math.max(600, Math.abs(ship.group.position.x), Math.abs(ship.group.position.z));
      const mapScale = Math.min((w-80)/(maxRange*2),(h-60)/(maxRange*1.5));
      ctx.font='12px Courier New'; ctx.textAlign='left';
      for(const island of world.islands) {
        const x=cx+island.group.position.x*mapScale, y=cy+island.group.position.z*mapScale;
        ctx.beginPath();ctx.ellipse(x,y,Math.max(8,island.radius*mapScale),Math.max(6,island.radius*mapScale*.75),0,0,Math.PI*2);
        ctx.fillStyle=island===asteroidBase?'#c7a85c':island.type==='forest'?'#7e9c60':'#9e7650';ctx.fill();
        ctx.fillStyle='#ece5c8';ctx.fillText(island.name,x+10,y-10);
      }
      const x=cx+ship.group.position.x*mapScale,y=cy+ship.group.position.z*mapScale;
      ctx.fillStyle='#f5e8b8';ctx.fillText('▲ Ваш борт',x,y);
      if(world.missionTarget){const p=world.missionTarget.position;ctx.fillStyle='#78d3c8';ctx.fillText('◆ '+world.missionTarget.name,cx+p.x*mapScale,cy+p.z*mapScale+18);}
      this.mapStarInfo.textContent='НЕБЕСНЫЙ АРХИПЕЛАГ · '+world.seedStr;
      this.systemLog.replaceChildren();
      for(const island of world.islands){const entry=document.createElement('div');entry.className='log-entry';entry.textContent=island.name+' · '+island.biomeLabel;this.systemLog.appendChild(entry);}
      return;
    }

    // Star
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = world.starType.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 17, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(228, 186, 114, 0.35)';
    ctx.stroke();

    // Course vector from AsteroidBase to its target planet
    if (asteroidBase && asteroidBase.targetPlanet) {
      const bx = cx + asteroidBase.group.position.x * scale;
      const by = cy + asteroidBase.group.position.z * scale;
      const tx = cx + asteroidBase.targetPlanet.group.position.x * scale;
      const ty = cy + asteroidBase.targetPlanet.group.position.z * scale;
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = 'rgba(100, 190, 184, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    for (const p of world.planets) {
      ctx.beginPath();
      ctx.arc(cx, cy, p.orbitRadius * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(232, 226, 213, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const px = cx + p.group.position.x * scale;
      const py = cy + p.group.position.z * scale;
      const isTgt = asteroidBase && asteroidBase.targetPlanet === p;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(5, p.radius * 0.36), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      if (isTgt) {
        ctx.beginPath();
        ctx.arc(px, py, Math.max(8, p.radius * 0.36 + 4), 0, Math.PI * 2);
        ctx.strokeStyle = '#64beb8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const elev = Math.round(p.group.position.y);
      const elevStr = elev >= 0 ? `+${elev}` : `${elev}`;
      ctx.fillStyle = isTgt ? '#ece4d2' : '#929ca4';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`${p.name} (${elevStr})`, px + 9, py + 3);
    }

    if (world.gate) {
      const gx = cx + world.gate.group.position.x * scale;
      const gy = cy + world.gate.group.position.z * scale;
      ctx.beginPath();
      ctx.arc(gx, gy, 7, 0, Math.PI * 2);
      ctx.strokeStyle = world.gateUnlocked ? '#64beb8' : '#c85a44';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#d4a65a';
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Врата', gx + 10, gy + 4);
    }

    const sx = cx + ship.group.position.x * scale;
    const sy = cy + ship.group.position.z * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ece4d2';
    ctx.fill();
    ctx.strokeStyle = '#d4a65a';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    this.systemLog.innerHTML = world.planets
      .map((p) => {
        const ob = world.obelisks.find((o) => o.planet === p);
        const status = ob ? (ob.activated ? 'Обелиск настроен' : 'Обнаружен Обелиск') : p.biomeLabel;
        const isTgt = asteroidBase && asteroidBase.targetPlanet === p;
        return `
          <div class="log-entry ${p.discovered || isTgt ? 'done' : ''}">
            <strong style="color:${isTgt ? '#64beb8' : '#ece4d2'}">${p.name}${isTgt ? ' • Курс' : ''}</strong>
            <div class="muted" style="margin-top:2px;">${p.discovered ? p.mysteryNote : 'Не исследовано. Совершите посадку.'}</div>
            <div style="color:#d4a65a;margin-top:3px;font-size:11px;">${status}</div>
          </div>`;
      })
      .join('');
  }

  /**
   * Displays a stylized dieselpunk radio dialogue box with character SVG avatar & subtitles.
   */
  hideRadio() {
    clearTimeout(this._radioTimer);
    if (this._radioBox) this._radioBox.style.display = 'none';
  }

  showRadio(speakerKey, text, duration = 5200, callsign) {
    if (typeof document === 'undefined') return;
    if (!this._radioBox) {
      const box = document.createElement('div');
      box.id = 'radio-dialogue-box';
      box.className = 'pilot-panel pilot-radio';
      box.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:96px', 'transform:translateX(-50%)',
        'z-index:26', 'display:none', 'align-items:center', 'gap:14px',
        'min-width:420px', 'max-width:640px', 'padding:12px 16px',
        'background:rgba(16,18,22,0.88)', 'border:1px solid rgba(212,166,90,0.65)',
        'border-left:4px solid #d4a65a', 'border-radius:8px',
        'box-shadow:0 8px 28px rgba(0,0,0,0.55)', 'pointer-events:none',
        'font-family:system-ui,-apple-system,sans-serif', 'color:#f2ead8',
      ].join(';');
      box.innerHTML = `
        <div id="radio-avatar" style="width:62px;height:62px;flex:0 0 62px;border-radius:6px;overflow:hidden;border:1px solid rgba(212,166,90,0.55);background:#1b2028;"></div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span id="radio-speaker" style="font-weight:700;font-size:13px;letter-spacing:0.4px;color:#ffd07b;"></span>
            <span id="radio-freq" style="font-size:10px;color:#7ec8c2;letter-spacing:0.6px;"></span>
          </div>
          <div id="radio-text" style="font-size:14px;line-height:1.38;color:#f5efe2;"></div>
        </div>
      `;
      document.body.appendChild(box);
      this._radioBox = box;
    }

    const speakers = {
      pilot: {
        name: 'БРОДЯГА • КАПИТАН',
        color: '#ffd07b',
        svg: `<svg viewBox="0 0 64 64" width="62" height="62"><rect width="64" height="64" fill="#232933"/><path d="M12 64 C14 48 50 48 52 64Z" fill="#6b3e26"/><circle cx="32" cy="30" r="14" fill="#d9a57e"/><path d="M18 27 C18 14 46 14 46 27 Z" fill="#5c3520"/><circle cx="25" cy="21" r="5" fill="#b8823c"/><circle cx="25" cy="21" r="3" fill="#7fb7d4"/><circle cx="39" cy="21" r="5" fill="#b8823c"/><circle cx="39" cy="21" r="3" fill="#7fb7d4"/><path d="M21 35 Q32 42 43 35 L40 46 Q32 50 24 46 Z" fill="#3a2114"/><path d="M23 36 Q32 33 41 36" stroke="#2a160c" stroke-width="3" fill="none"/></svg>`,
      },
      dispatcher: {
        name: 'ВАРВАРА • ДИСПЕТЧЕР ОСТРОВА',
        color: '#7ad8f0',
        svg: `<svg viewBox="0 0 64 64" width="62" height="62"><rect width="64" height="64" fill="#1b2630"/><path d="M12 64 C16 48 48 48 52 64Z" fill="#3d5a6c"/><circle cx="32" cy="31" r="13" fill="#e0b290"/><path d="M18 26 C18 14 46 14 46 26 L44 21 L20 21 Z" fill="#9e3328"/><rect x="15" y="25" width="5" height="11" rx="2" fill="#4a5058"/><rect x="44" y="25" width="5" height="11" rx="2" fill="#4a5058"/><circle cx="26" cy="24" r="4.5" fill="#d4a65a"/><circle cx="38" cy="24" r="4.5" fill="#d4a65a"/><circle cx="26" cy="24" r="2.5" fill="#2c353d"/><circle cx="38" cy="24" r="2.5" fill="#2c353d"/><path d="M27 38 Q32 41 37 38" stroke="#8c4a3e" stroke-width="2" fill="none"/></svg>`,
      },
      enemy: {
        name: 'РЕЙДЕР «ЖЕЛЕЗНЫЙ КОРШУН»',
        color: '#ff6b5b',
        svg: `<svg viewBox="0 0 64 64" width="62" height="62"><rect width="64" height="64" fill="#2a1818"/><path d="M10 64 C16 47 48 47 54 64Z" fill="#3d3835"/><circle cx="32" cy="30" r="14" fill="#786b64"/><path d="M17 28 C18 13 46 13 47 28 Z" fill="#2e2a28"/><rect x="21" y="24" width="22" height="6" rx="2" fill="#ff3b30"/><path d="M23 35 L41 35 L38 45 L26 45 Z" fill="#25282c"/></svg>`,
      },
    };
    const sp = speakers[speakerKey] || speakers.pilot;
    this._radioBox.style.borderLeftColor = sp.color;
    this._radioBox.querySelector('#radio-avatar').innerHTML = sp.svg;
    const spEl = this._radioBox.querySelector('#radio-speaker');
    spEl.textContent = callsign || sp.name;
    spEl.style.color = sp.color;
    this._radioBox.querySelector('#radio-text').textContent = text;
    this._radioBox.style.display = 'flex';

    clearTimeout(this._radioTimer);
    this._radioTimer = setTimeout(() => {
      if (this._radioBox) this._radioBox.style.display = 'none';
    }, duration);
  }
}
