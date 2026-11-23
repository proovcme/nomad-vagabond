/**
 * Project Nomads Exploration System: Ancient Aether Artifacts & Salvage Relics.
 * Gives the player compelling reasons to explore every island & landmark in the sky archipelago.
 */

const STORAGE_KEY = 'vagabond_artifacts_v1';

const ARTIFACT_SPECS = [
  {
    id: 'windmill_core',
    name: 'Кристалл Ветряной Башни',
    lore: 'Чертёж древних: повышенная тяга турбин и +50 лома',
    salvage: 50,
    anchor: 'forest',
    offset: [22, 27, -18],
  },
  {
    id: 'forest_wreck_log',
    name: 'Чёрный ящик «Икара»',
    lore: 'Найдены редкие детали и бортовой журнал (+45 лома)',
    salvage: 45,
    anchor: 'forest',
    offset: [-35, 11, -10],
  },
  {
    id: 'lighthouse_lens',
    name: 'Призма Небесного Маяка',
    lore: 'Оптика дальнего обнаружения для радара (+55 лома)',
    salvage: 55,
    anchor: 'industrial',
    offset: [34, 34, -16],
  },
  {
    id: 'monolith_shard',
    name: 'Осколок Древнего Монолита',
    lore: 'Технология Эфирного щита Древних (+70 лома)',
    salvage: 70,
    anchor: 'world',
    offset: [-145, 72, 160],
  },
  {
    id: 'astrolabe_relic',
    name: 'Ядро Небесной Астролябии',
    lore: 'Навигационная схема ЗРК ПВО (+65 лома)',
    salvage: 65,
    anchor: 'world',
    offset: [145, 96, -148],
  },
  {
    id: 'shipyard_cargo',
    name: 'Контейнер Расколотой Верфи',
    lore: 'Запас бронеплит и редких сплавов (+75 лома)',
    salvage: 75,
    anchor: 'world',
    offset: [650, 96, -400],
  },
];

function loadCollectedSet() {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveCollectedSet(set) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

export class ExplorationArtifacts {
  constructor(scene, archipelago, { construction = null, ui = null, audio = null } = {}) {
    this.scene = scene;
    this.archipelago = archipelago;
    this.construction = construction;
    this.ui = ui;
    this.audio = audio;
    this.collected = loadCollectedSet();
    this.items = [];
    this.time = 0;
    this.disposed = false;

    const isNull = scene.getEngine() instanceof BABYLON.NullEngine;
    this.coreMat = new BABYLON.StandardMaterial('artifactCoreMat', scene);
    this.coreMat.emissiveColor = BABYLON.Color3.FromHexString('#ffd86b');
    this.coreMat.diffuseColor = BABYLON.Color3.FromHexString('#fff0b3');
    this.coreMat.disableLighting = true;

    this.ringMat = new BABYLON.StandardMaterial('artifactRingMat', scene);
    this.ringMat.emissiveColor = BABYLON.Color3.FromHexString('#48e4ff');
    this.ringMat.disableLighting = true;

    this.beamMat = new BABYLON.StandardMaterial('artifactBeamMat', scene);
    this.beamMat.emissiveColor = BABYLON.Color3.FromHexString('#ffe082');
    this.beamMat.disableLighting = true;
    this.beamMat.alpha = 0.22;
    this.beamMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    this.beamMat.backFaceCulling = false;
    this.beamMat.depthWrite = false;

    this._createOverlay(isNull);
    this._spawnArtifacts();
    scene.onDisposeObservable.addOnce(() => this.dispose());
  }

  _createOverlay(isNull) {
    if (isNull || typeof document === 'undefined') return;
    this.overlay = document.createElement('div');
    this.overlay.id = 'artifact-markers-layer';
    this.overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:22;overflow:hidden;';
    document.body.appendChild(this.overlay);

    this.counterEl = document.createElement('div');
    this.counterEl.style.cssText = 'position:fixed;top:92px;left:50%;transform:translateX(-50%);padding:3px 10px;background:rgba(20,28,24,0.72);border:1px solid rgba(226,196,120,0.42);color:#f3dca0;font:600 11px/1.25 "Courier New",monospace;letter-spacing:0.08em;border-radius:3px;pointer-events:none;z-index:23;display:none;';
    document.body.appendChild(this.counterEl);
    this._updateCounter();
  }

  _updateCounter() {
    if (!this.counterEl) return;
    this.counterEl.textContent = `✦ АРТЕФАКТЫ: ${this.collected.size} / ${ARTIFACT_SPECS.length}`;
  }

  _resolvePosition(spec) {
    const off = new BABYLON.Vector3(...spec.offset);
    if (spec.anchor === 'forest' && this.archipelago?.forestIsland?.group) {
      return this.archipelago.forestIsland.group.position.add(off);
    }
    if (spec.anchor === 'industrial' && this.archipelago?.industrialIsland?.group) {
      return this.archipelago.industrialIsland.group.position.add(off);
    }
    return off;
  }

  _spawnArtifacts() {
    for (const spec of ARTIFACT_SPECS) {
      if (this.collected.has(spec.id)) continue;
      const root = new BABYLON.TransformNode(`artifact_${spec.id}`, this.scene);
      root.position.copyFrom(this._resolvePosition(spec));

      const crystal = BABYLON.MeshBuilder.CreatePolyhedron(`artifactCrystal_${spec.id}`, { type: 1, size: 2.1 }, this.scene);
      crystal.parent = root;
      crystal.material = this.coreMat;
      crystal.isPickable = false;

      const ring = BABYLON.MeshBuilder.CreateTorus(`artifactRing_${spec.id}`, { diameter: 6.2, thickness: 0.28, tessellation: 16 }, this.scene);
      ring.parent = root;
      ring.material = this.ringMat;
      ring.isPickable = false;

      // Vertical beacon pillar visible from 1.5 km away (classic Project Nomads landmark pull!)
      const pillar = BABYLON.MeshBuilder.CreateCylinder(`artifactBeacon_${spec.id}`, { diameterTop: 0.7, diameterBottom: 2.8, height: 68, tessellation: 8, cap: BABYLON.Mesh.NO_CAP }, this.scene);
      pillar.parent = root;
      pillar.position.y = 32;
      pillar.material = this.beamMat;
      pillar.isPickable = false;

      let markerEl = null;
      if (this.overlay) {
        markerEl = document.createElement('div');
        markerEl.style.cssText = 'position:absolute;transform:translate(-50%,-50%);color:#ffe38f;text-shadow:0 1px 4px #000c;font:600 11px/1.2 sans-serif;white-space:nowrap;display:none;';
        this.overlay.appendChild(markerEl);
      }

      this.items.push({ spec, root, crystal, ring, pillar, markerEl, collected: false });
    }
  }

  update(dt, playerPos, camera, isPlaying = false) {
    if (this.disposed) return;
    this.time += dt;
    if (this.counterEl) {
      this.counterEl.style.display = isPlaying ? 'block' : 'none';
    }

    const engine = this.scene.getEngine();
    const w = engine.getRenderWidth();
    const h = engine.getRenderHeight();
    const transform = camera ? this.scene.getTransformMatrix() : null;
    const viewport = camera ? camera.viewport.toGlobal(w, h) : null;

    for (const item of this.items) {
      if (item.collected) continue;
      const basePos = this._resolvePosition(item.spec);
      item.root.position.set(basePos.x, basePos.y + Math.sin(this.time * 2.1 + basePos.x) * 1.1, basePos.z);
      item.crystal.rotation.y += dt * 1.4;
      item.crystal.rotation.x = Math.sin(this.time * 1.2) * 0.25;
      item.ring.rotation.x += dt * 0.9;
      item.ring.rotation.z -= dt * 0.65;

      if (isPlaying && playerPos) {
        const dist = BABYLON.Vector3.Distance(playerPos, item.root.position);
        if (dist < 36) {
          this._collect(item);
          continue;
        }
        if (item.markerEl && transform && viewport && dist < 1900) {
          const proj = BABYLON.Vector3.Project(item.root.position, BABYLON.Matrix.Identity(), transform, viewport);
          if (proj.z >= 0 && proj.z <= 1 && proj.x > 20 && proj.x < w - 20 && proj.y > 20 && proj.y < h - 20) {
            item.markerEl.style.display = 'block';
            item.markerEl.style.left = `${proj.x}px`;
            item.markerEl.style.top = `${proj.y - 16}px`;
            item.markerEl.textContent = `✦ ${Math.round(dist)}м`;
          } else {
            item.markerEl.style.display = 'none';
          }
        } else if (item.markerEl) {
          item.markerEl.style.display = 'none';
        }
      } else if (item.markerEl) {
        item.markerEl.style.display = 'none';
      }
    }
  }

  _collect(item) {
    item.collected = true;
    this.collected.add(item.spec.id);
    saveCollectedSet(this.collected);
    this._updateCounter();

    if (item.markerEl) item.markerEl.remove();
    item.root.dispose();

    if (this.construction) {
      this.construction.addSalvage(item.spec.salvage);
      this.construction.saveState();
    }
    this.audio?.playPickup?.() || this.audio?.playObjective?.();
    this.ui?.showToast?.(`✦ Найден артефакт: «${item.spec.name}»! ${item.spec.lore}`, 5200);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const item of this.items) {
      item.markerEl?.remove();
      if (!item.collected) item.root?.dispose();
    }
    this.overlay?.remove();
    this.counterEl?.remove();
    this.coreMat?.dispose();
    this.ringMat?.dispose();
    this.beamMat?.dispose();
  }
}
