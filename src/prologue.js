import production from './content/passage.js';
import {openingFrame} from './content/cinematic.js';
export const PROLOGUE_DURATION=production.shots.reduce((sum,shot)=>sum+shot.seconds,0);

export class Prologue {
  constructor(camera, ship, base, passage=null) {
    this.camera = camera;
    this.ship = ship;
    this.base = base;
    this.passage=passage;
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
    const shot=openingFrame(this.camera,this.ship.group,this.passage?.escort || this.base.group,time,production.shots);
    this.title.textContent=shot.title;
    this.subtitle.textContent=shot.subtitle;
  }

  hide() { this.overlay.hidden = true; }
}
