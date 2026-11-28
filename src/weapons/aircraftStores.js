import { createDetailedMissile } from './missileFactory.js?v=mission1';

// Coordinates are in the authored airframe frame (+Y up, nose toward -Z).
export class AircraftStores {
  constructor(parent, variant, modelOffset = 0) {
    this.scene = parent.getScene();
    this.root = new BABYLON.TransformNode('externalStores', this.scene);
    this.root.parent = parent;
    this.root.position.y = modelOffset;
    this.slots = [];
    this.mount('torpedo', 0, .72, -.38, .97);
    if (variant === 'attacker') {
      for (const side of [-1, 1]) this.mount('rocket', side * 3.4, 1.29, -1.3, .70);
    }
  }

  mount(kind, x, y, z, scale) {
    const rail = BABYLON.MeshBuilder.CreateBox(kind + 'Rail', {width:.14, height:.22, depth:1.14}, this.scene);
    rail.parent = this.root;
    rail.position.set(x, y, z);
    rail.isPickable = false;
    const slot = {kind, rail, scale, store:null};
    this.slots.push(slot);
    this.load(slot);
    rail.material = slot.store.getChildMeshes()[0].material;
  }

  load(slot) {
    const rocket = slot.kind === 'rocket';
    const store = createDetailedMissile(this.scene, slot.kind + 'Store', slot.scale,
      rocket ? '#56604b' : '#36444a', rocket ? '#b58543' : '#a85a3b', null);
    store.parent = slot.rail;
    store.position.y = -.1 - .21 * slot.scale;
    store.rotation.x = -Math.PI / 2;
    store._trailAnchor.setEnabled(false);
    slot.store = store;
  }

  reload(kind) {
    for (const slot of this.slots) if (slot.kind === kind && !slot.store) this.load(slot);
  }

  release(kind) {
    const slot = this.slots.find(s => s.kind === kind && s.store);
    if (!slot) return null;
    const store = slot.store;
    store.computeWorldMatrix(true);
    store.setParent(null);
    slot.store = null;
    return store;
  }
}
