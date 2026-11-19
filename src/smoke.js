/** A world-space, alpha-blended engine smoke trail. No mesh spheres or glow. */
export class SmokeTrail {
  constructor(scene, ship) {
    this.scene = scene;
    this.ship = ship;
    this.disposed = false;
    this.active = false;
    this.localEmitter = new BABYLON.Vector3(-2.4, 0.3, 0);
    this.localBehind = new BABYLON.Vector3(0, 0, 1);
    this.worldBehind = new BABYLON.Vector3();
    const ps = new BABYLON.ParticleSystem('damagedEngineSmoke', 120, scene);
    this.system = ps;
    ps.emitter = ship.group;
    ps.isLocal = false; // Old smoke stays in the air as the aircraft banks away.
    ps.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    ps.forceDepthWrite = false;
    ps.emitRate = 0;
    ps.minLifeTime = 1.7;
    ps.maxLifeTime = 2.8;
    ps.minSize = 0.85;
    ps.maxSize = 1.45;
    ps.minEmitPower = ps.maxEmitPower = 1;
    ps.updateSpeed = 0.012;
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = Math.PI * 2;
    ps.minAngularSpeed = -0.24;
    ps.maxAngularSpeed = 0.24;
    ps.gravity = new BABYLON.Vector3(0.22, 0.5, -0.12);
    ps.addSizeGradient(0, 0.5, 0.75);
    ps.addSizeGradient(0.25, 1.1, 1.6);
    ps.addSizeGradient(1, 2.6, 3.7);
    ps.addColorGradient(0, new BABYLON.Color4(0.27, 0.29, 0.30, 0));
    ps.addColorGradient(0.10, new BABYLON.Color4(0.27, 0.29, 0.30, 0.36));
    ps.addColorGradient(0.40, new BABYLON.Color4(0.36, 0.38, 0.39, 0.25));
    ps.addColorGradient(1, new BABYLON.Color4(0.47, 0.49, 0.50, 0));
    ps.startPositionFunction = (_worldMatrix, position) => {
      // Emit from actual GLB engine nozzle when loaded, falling back to localEmitter
      const nozzle = ship.nozzles?.[0];
      if (nozzle && !nozzle.isDisposed?.()) {
        nozzle.computeWorldMatrix(true);
        position.copyFrom(nozzle.getAbsolutePosition());
      } else {
        ship.group.computeWorldMatrix(true);
        BABYLON.Vector3.TransformCoordinatesToRef(this.localEmitter, ship.group.getWorldMatrix(), position);
      }
      position.x += (Math.random() - 0.5) * 0.30;
      position.y += (Math.random() - 0.5) * 0.20;
      position.z += (Math.random() - 0.5) * 0.30;
    };
    ps.startDirectionFunction = (_worldMatrix, direction) => {
      BABYLON.Vector3.TransformNormalToRef(this.localBehind, ship.group.getWorldMatrix(), this.worldBehind);
      this.worldBehind.normalize();
      const velocity = ship.velocity;
      // Partial inherited speed leaves a continuous wake, with exhaust motion behind the nose.
      direction.set(
        (velocity?.x || 0) * 0.12 + this.worldBehind.x * 2.7 + (Math.random() - 0.5) * 0.75,
        (velocity?.y || 0) * 0.12 + this.worldBehind.y * 2.7 + 0.65 + Math.random() * 0.55,
        (velocity?.z || 0) * 0.12 + this.worldBehind.z * 2.7 + (Math.random() - 0.5) * 0.75
      );
    };
    if (!(scene.getEngine() instanceof BABYLON.NullEngine)) {
      this.texture = this._createTexture();
      ps.particleTexture = this.texture;
    }
    ps.start();
    scene.onDisposeObservable.addOnce(() => this.dispose());
  }

  _createTexture() {
    const size = 128;
    const texture = new BABYLON.DynamicTexture('softEngineSmokeWisp', {width:size,height:size}, this.scene, true);
    const context = texture.getContext();
    const image = context.createImageData(size, size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size * 2 - 1, v = (y + 0.5) / size * 2 - 1;
      // Warped elliptic radial falloff with broad lobes and fine translucent gaps.
      const wx = u + 0.12 * Math.sin(v * 8 + 0.7) + 0.045 * Math.sin(v * 19 + u * 4);
      const wy = v + 0.10 * Math.sin(u * 7 - 0.4);
      const radius = Math.hypot(wx * 0.90, wy * 1.12);
      const angle = Math.atan2(wy, wx);
      const boundary = 0.81 + 0.10 * Math.sin(angle * 5 + 0.8) + 0.04 * Math.sin(angle * 9);
      const fade = Math.max(0, 1 - radius / boundary);
      const lumpy = 0.65 + 0.19 * Math.sin(wx * 13 + wy * 7) * Math.sin(wy * 11 - wx * 4) + 0.12 * Math.sin(wx * 23 + wy * 17);
      const alpha = Math.pow(fade, 1.45) * lumpy;
      const at = (y * size + x) * 4;
      image.data[at] = image.data[at + 1] = image.data[at + 2] = 255;
      image.data[at + 3] = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
    }
    context.putImageData(image, 0, 0);
    texture.hasAlpha = true;
    texture.wrapU = texture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
    texture.update(false);
    return texture;
  }

  update(_dt) {
    if (this.disposed) return;
    const ship = this.ship;
    const damaged = ship.hull > 0 && ship.hull < (ship.maxHull || 100) * 0.55;
    this.active = damaged && !ship.dockedAsteroid && !ship.dockedPlanet && !ship.waterPlanet;
    // Stop emission on docking/repair; already-emitted wisps finish their natural fade.
    this.system.emitRate = this.active ? 32 : 0;
  }

  get snapshot() {
    return {active:this.active, emitRate:this.disposed ? 0 : this.system.emitRate, capacity:120,
      particles:this.disposed ? 0 : this.system.getActiveCount(), localEmitter:this.localEmitter.asArray()};
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.active = false;
    this.system.dispose();
    this.texture?.dispose();
  }
}
