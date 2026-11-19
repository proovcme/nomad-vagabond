// Authored opening. Time belongs to the simulation, so pause also pauses subtitles.
const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export const PROLOGUE_DURATION = 12;

export class Prologue {
  constructor(camera, ship, base) {
    this.camera = camera;
    this.ship = ship;
    this.base = base;
    this.overlay = document.getElementById('prologue');
    this.title = document.getElementById('prologue-title');
    this.subtitle = document.getElementById('prologue-subtitle');
  }

  showLoading() {
    this.overlay.hidden = false;
    this.title.textContent = 'БРОДЯГА';
    this.subtitle.textContent = 'Прокладываем курс…';
    document.getElementById('prologue-skip').hidden = true;
  }

  frame(time) {
    this.overlay.hidden = false;
    document.getElementById('prologue-skip').hidden = false;
    const B = BABYLON;
    const rm = B.Matrix.FromQuaternionToRef(this.ship.group.rotationQuaternion, new B.Matrix());
    const fwd = B.Vector3.TransformNormal(new B.Vector3(0, 0, -1), rm);
    const right = B.Vector3.TransformNormal(new B.Vector3(1, 0, 0), rm);
    const p = this.ship.group.position;
    let back, side, height, target;
    if (time < 3.5) {
      const t = smooth(time / 3.5);
      back = 30 - 7 * t; side = 18 - 3 * t; height = 11 - 4 * t;
      target = p.add(fwd.scale(10)).add(new B.Vector3(0, 2, 0));
      this.title.textContent = 'НЕБО ПОСЛЕ РАСКОЛА';
      this.subtitle.textContent = 'Между островами остался только эфир.';
      this.camera.fov = 0.78;
    } else if (time < 7) {
      const t = smooth((time - 3.5) / 3.5);
      back = -4 + 6 * t; side = 15; height = 4.5;
      target = p.add(new B.Vector3(0, 1.6, 0));
      this.title.textContent = '142.8 · КАПИТАН';
      this.subtitle.textContent = 'Левый мотор сдаёт. «Бродяга», приём! Мне нужна полоса.';
      this.camera.fov = 0.82;
    } else if (time < 9.5) {
      const t = smooth((time - 7) / 2.5);
      const base = this.base.group.position;
      this.camera.position.copyFrom(base).addInPlace(new B.Vector3(100 - 16 * t, 48 - 5 * t, 105));
      target = base.add(new B.Vector3(0, 3, 0));
      this.title.textContent = '142.8 · ОСТРОВ «БРОДЯГА»';
      this.subtitle.textContent = 'Вижу тебя. Заходи с востока. Полоса свободна.';
      this.camera.fov = 0.86;
    } else {
      const t = smooth((time - 9.5) / 2.5);
      back = 23 - 8 * t; side = 9 * (1 - t); height = 8 - 2.8 * t;
      target = p.add(fwd.scale(6.5)).add(new B.Vector3(0, 2.2, 0));
      this.title.textContent = 'ДОТЯНУТЬ ДО ОСТРОВА';
      this.subtitle.textContent = 'Вы — за штурвалом. Держите курс на остров.';
      this.camera.fov = 0.86 + 0.18 * t;
    }
    if (back !== undefined) {
      this.camera.position.copyFrom(p).subtractInPlace(fwd.scale(back))
        .addInPlace(right.scale(side)).addInPlace(new B.Vector3(0, height, 0));
    }
    this.camera.upVector.set(0, 1, 0);
    this.camera.setTarget(target);
  }

  hide() { this.overlay.hidden = true; }
}
