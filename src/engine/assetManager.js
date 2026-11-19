/**
 * Centralized GLB/glTF Asset Manifest & Per-Scene Container Cache.
 * Enables new levels to instantiate diverse props by ID with automatic caching,
 * shadow-budget filtering, and clean scene disposal.
 */

export const ASSET_MANIFEST = Object.freeze({
  // Aircraft
  aircraft_cargo:     { dir: './assets/aircraft/', file: 'scrapyard_plane.glb', castShadow: true },
  aircraft_fighter:   { dir: './assets/aircraft/', file: 'scrapyard_fighter.glb', castShadow: true },
  aircraft_attacker:  { dir: './assets/aircraft/', file: 'scrapyard_attacker.glb', castShadow: true },
  aircraft_bomber:    { dir: './assets/aircraft/', file: 'scrapyard_bomber.glb', castShadow: true },
  // Character
  hero_nomad:         { dir: './assets/character/', file: 'nomad_hero.glb', castShadow: true },
  // Buildings & Props
  control_tower:      { dir: './assets/buildings/', file: 'control_tower.glb', castShadow: true },
  ether_generator:    { dir: './assets/buildings/', file: 'ether_generator.glb', castShadow: true },
  prop_barrel:        { dir: './assets/benchmark/models/Barrel_01/', file: 'Barrel_01_1k.gltf', castShadow: false },
  prop_crate:         { dir: './assets/benchmark/models/old_military_crate/', file: 'old_military_crate_1k.gltf', castShadow: false },
  // Nature
  tree_pine:          { dir: './assets/benchmark/models/trees/', file: 'pine_hero.glb', castShadow: true },
  tree_fir:           { dir: './assets/benchmark/models/trees/', file: 'fir_medium.glb', castShadow: false },
  tree_alder:         { dir: './assets/benchmark/models/trees/', file: 'coastal_alder.glb', castShadow: false },
  nature_grass:       { dir: './assets/benchmark/models/trees/', file: 'grass_clump.glb', castShadow: false },
  nature_fern:        { dir: './assets/benchmark/models/fern_02/', file: 'fern_02_1k.gltf', castShadow: false },
  nature_boulder:     { dir: './assets/benchmark/models/boulder_01/', file: 'boulder_01_1k.gltf', castShadow: false },
});

export class AssetManager {
  constructor(scene) {
    this.scene = scene;
    this._containers = new Map();
    this._inflight = new Map();
    this._disposed = false;
    scene.onDisposeObservable.addOnce(() => this.dispose());
  }

  async loadContainer(assetId) {
    if (this._disposed) return null;
    const spec = ASSET_MANIFEST[assetId];
    if (!spec) {
      console.warn(`[AssetManager] Unknown assetId: ${assetId}`);
      return null;
    }
    if (this._containers.has(assetId)) return this._containers.get(assetId);
    if (this._inflight.has(assetId)) return this._inflight.get(assetId);
    if (!BABYLON.SceneLoader || this.scene.getEngine() instanceof BABYLON.NullEngine) return null;

    const p = BABYLON.SceneLoader.LoadAssetContainerAsync(spec.dir, spec.file, this.scene)
      .then((container) => {
        if (this._disposed) {
          container.dispose();
          return null;
        }
        this._containers.set(assetId, container);
        this._inflight.delete(assetId);
        return container;
      })
      .catch((err) => {
        this._inflight.delete(assetId);
        console.warn(`[AssetManager] Failed to load ${assetId}:`, err?.message || err);
        return null;
      });
    this._inflight.set(assetId, p);
    return p;
  }

  async instantiate(assetId, { parent = null, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, shadowGenerator = null } = {}) {
    const container = await this.loadContainer(assetId);
    if (!container || this._disposed) return null;
    const spec = ASSET_MANIFEST[assetId];
    const holder = new BABYLON.TransformNode(`asset_${assetId}_${Date.now().toString(36)}`, this.scene);
    holder.parent = parent;
    holder.position.set(position[0] || 0, position[1] || 0, position[2] || 0);
    holder.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
    if (Array.isArray(scale)) holder.scaling.set(scale[0], scale[1], scale[2]);
    else holder.scaling.setAll(scale);

    const inst = container.instantiateModelsToScene((n) => `${n}_am`, false);
    for (const rn of inst.rootNodes) rn.parent = holder;
    for (const m of holder.getChildMeshes()) {
      m.receiveShadows = true;
      if (shadowGenerator && spec.castShadow && m.getTotalVertices() > 0) {
        shadowGenerator.addShadowCaster(m, false);
      }
    }
    return holder;
  }

  getStats() {
    return {
      cachedContainers: this._containers.size,
      manifestSize: Object.keys(ASSET_MANIFEST).length,
      cachedIds: Array.from(this._containers.keys()),
    };
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    for (const c of this._containers.values()) {
      try { c.dispose(); } catch {}
    }
    this._containers.clear();
    this._inflight.clear();
  }
}
