// Procedural WebAudio synthesizer for Nomad Sky Archipelago:
// Radial piston engines, sky wind ambience, autocannons, rockets, explosions, hitmarkers, footsteps & UI cues.
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
    this.noiseBuffer = null;

    this.thrustGain = null;
    this.thrustOsc = null;
    this.sailGain = null;
    this.sailFilter = null;

    this.engineOsc = null;
    this.engineSubOsc = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.windGain = null;
    this.windFilter = null;

    this.lastPingTime = 0;
    this.lastGunTime = 0;
    this.lastWinchTime = 0;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.34, this.ctx.currentTime, 0.04);
    }
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.setMuted(this.muted);
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.34;
    this.masterGain.connect(this.ctx.destination);

    this._buildNoiseBuffer();
    this._startAmbient();
    this._setupContinuousLoops();
  }

  stopPassageRadio() {
    this.passageGeneration=(this.passageGeneration||0)+1;
    for(const source of this.passageSources||[])source.stop();
    this.passageSources=new Set();
    this.radioVoice=null;
  }

  playPassageRadio(id) {
    this.radioRequest=(this.radioRequest||0)+1;
    if(this.radioVoice){this.radioVoice.stop();this.radioVoice=null;}
    this.playPassageSound(id,this.radioRequest);
  }

  async playPassageSound(id,radioRequest=null) {
    if(!this.ctx)return;
    this.passageCache ||= new Map();
    this.passageSources ||= new Set();
    const generation=this.passageGeneration;
    try {
      if(!this.passageCache.has(id))this.passageCache.set(id,(async()=>{
        const response=await fetch('./assets/audio/fog-passage/'+id+'.mp3');
        if(!response.ok)throw Error(response.status);
        return this.ctx.decodeAudioData(await response.arrayBuffer());
      })());
      const buffer=await this.passageCache.get(id);
      if(generation!==this.passageGeneration || (radioRequest!==null && radioRequest!==this.radioRequest))return;
      const source=this.ctx.createBufferSource();
      source.buffer=buffer;source.connect(this.masterGain);this.passageSources.add(source);
      if(radioRequest!==null)this.radioVoice=source;
      source.onended=()=>{this.passageSources.delete(source);if(this.radioVoice===source)this.radioVoice=null;source.disconnect();};
      source.start();
    }catch(error){this.passageCache.delete(id);console.warn('Mission audio unavailable',id,error);}
  }

  _buildNoiseBuffer() {
    if (!this.ctx) return;
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.06 * white) / 1.06;
      data[i] = last * 2.8;
    }
    this.noiseBuffer = buf;
  }

  _startAmbient() {
    if (!this.ctx || !this.noiseBuffer) return;
    // Gentle high-altitude sky wind ambience
    const windSrc = this.ctx.createBufferSource();
    windSrc.buffer = this.noiseBuffer;
    windSrc.loop = true;
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 340;
    this.windFilter.Q.value = 0.7;
    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.05;
    windSrc.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    windSrc.start();

    // Subtle warm diesel generator hum when walking on Vagabond's deck
    this.deckHumOsc = this.ctx.createOscillator();
    this.deckHumOsc.type = 'triangle';
    this.deckHumOsc.frequency.value = 56;
    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 135;
    this.deckHumGain = this.ctx.createGain();
    this.deckHumGain.gain.value = 0.0;
    this.deckHumOsc.connect(humFilter);
    humFilter.connect(this.deckHumGain);
    this.deckHumGain.connect(this.masterGain);
    this.deckHumOsc.start();
  }

  _setupContinuousLoops() {
    if (!this.ctx) return;

    // Legacy space/jetpack thrust hum
    this.thrustOsc = this.ctx.createOscillator();
    this.thrustOsc.type = 'sawtooth';
    this.thrustOsc.frequency.value = 78;
    const tFilter = this.ctx.createBiquadFilter();
    tFilter.type = 'lowpass';
    tFilter.frequency.value = 240;
    this.thrustGain = this.ctx.createGain();
    this.thrustGain.gain.value = 0;
    this.thrustOsc.connect(tFilter);
    tFilter.connect(this.thrustGain);
    this.thrustGain.connect(this.masterGain);
    this.thrustOsc.start();

    // Ether sail wind shimmer
    const sailOsc = this.ctx.createOscillator();
    sailOsc.type = 'triangle';
    sailOsc.frequency.value = 210;
    this.sailFilter = this.ctx.createBiquadFilter();
    this.sailFilter.type = 'bandpass';
    this.sailFilter.frequency.value = 420;
    this.sailGain = this.ctx.createGain();
    this.sailGain.gain.value = 0;
    sailOsc.connect(this.sailFilter);
    this.sailFilter.connect(this.sailGain);
    this.sailGain.connect(this.masterGain);
    sailOsc.start();

    // Dieselpunk Radial Piston / Propeller Engine loop
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 48;
    this.engineSubOsc = this.ctx.createOscillator();
    this.engineSubOsc.type = 'triangle';
    this.engineSubOsc.frequency.value = 24;
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 180;
    this.engineFilter.Q.value = 1.6;
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;

    this.engineOsc.connect(this.engineFilter);
    this.engineSubOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    this.engineOsc.start();
    this.engineSubOsc.start();
  }

  setAircraftEngine(throttle = 0, airspeed = 0, boost = false, silent = false) {
    if (!this.ctx || !this.engineGain) return;
    const now = this.ctx.currentTime;
    if (silent) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.12);
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.045, now, 0.20);
      return;
    }
    const rpmNorm = Math.max(0, Math.min(1.35, throttle * 0.85 + (airspeed / 80) * 0.35 + (boost ? 0.30 : 0)));
    const baseFreq = 40 + rpmNorm * 68;
    this.engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.08);
    this.engineSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(140 + rpmNorm * 320 + (boost ? 180 : 0), now, 0.09);
    this.engineGain.gain.setTargetAtTime(0.035 + rpmNorm * 0.065 + (boost ? 0.035 : 0), now, 0.08);

    if (this.windGain && this.windFilter) {
      const windLevel = 0.045 + Math.min(0.14, (airspeed / 75) * 0.11 + (boost ? 0.04 : 0));
      this.windGain.gain.setTargetAtTime(windLevel, now, 0.12);
      this.windFilter.frequency.setTargetAtTime(300 + Math.min(950, airspeed * 11), now, 0.12);
    }
  }

  setThrust(active, boost = false) {
    if (!this.ctx || !this.thrustGain) return;
    const now = this.ctx.currentTime;
    this.thrustGain.gain.setTargetAtTime(active ? (boost ? 0.14 : 0.09) : 0, now, 0.06);
    this.thrustOsc.frequency.setTargetAtTime(boost ? 125 : 78, now, 0.08);
  }

  setSailWind(efficiency, furled) {
    if (!this.ctx || !this.sailGain) return;
    const now = this.ctx.currentTime;
    const target = furled ? 0 : Math.max(0, efficiency) * 0.07;
    this.sailGain.gain.setTargetAtTime(target, now, 0.12);
    this.sailFilter.frequency.setTargetAtTime(280 + efficiency * 620, now, 0.12);
  }

  playGunshot(variant = 'cargo') {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    if (now - this.lastGunTime < 0.045) return;
    this.lastGunTime = now;

    // Punchy autocannon crack (noise burst)
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(variant === 'attacker' ? 520 : variant === 'fighter' ? 1150 : 780, now);
    filter.Q.value = 0.9;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(variant === 'attacker' ? 0.24 : 0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now, Math.random() * 0.8, 0.09);

    // Breech thump
    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(variant === 'attacker' ? 130 : 185, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.065);
    oGain.gain.setValueAtTime(0.18, now);
    oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(oGain);
    oGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  playSpecialWeapon(kind = 'rocket') {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    if (kind === 'bomb') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.42);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.46);
      return;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(1450, now + 0.28);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now, Math.random() * 0.5, 0.38);
  }

  playLockTone(locked = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const minGap = locked ? 0.14 : 0.24;
    if (now - (this.lastLockTime || 0) < minGap) return;
    this.lastLockTime = now;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = locked ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(locked ? 1320 : 840, now);
    gain.gain.setValueAtTime(locked ? 0.09 : 0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (locked ? 0.09 : 0.06));
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.10);
  }

  playManeuverWhoosh() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.18);
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.42);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now, Math.random() * 0.5, 0.46);
  }

  playMissileWarning() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastWarnTime || 0) < 0.28) return;
    this.lastWarnTime = now;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1480, now);
    osc.frequency.setValueAtTime(1120, now + 0.08);
    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playFlarePop() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.055;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800 + i * 240, t);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      src.connect(bp);
      bp.connect(gain);
      gain.connect(this.masterGain);
      src.start(t, Math.random() * 0.6, 0.1);
    }
  }

  playFlakCannon() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    // Heavy 88mm breech punch + sub-bass concussion
    const sub = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(135, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.28);
    sGain.gain.setValueAtTime(0.42, now);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
    sub.connect(sGain); sGain.connect(this.masterGain);
    sub.start(now); sub.stop(now + 0.32);

    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.setValueAtTime(680, now); bp.Q.value = 0.8;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.32, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    src.connect(bp); bp.connect(g); g.connect(this.masterGain);
    src.start(now, Math.random() * 0.5, 0.25);
  }

  playHeavyLaunch() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(1400, now);
    lpf.frequency.exponentialRampToValueAtTime(240, now + 0.95);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.02, now);
    g.gain.linearRampToValueAtTime(0.40, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    src.connect(lpf); lpf.connect(g); g.connect(this.masterGain);
    src.start(now, Math.random() * 0.4, 1.05);
  }

  playRadioSquelch() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1850; bp.Q.value = 2.4;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.09, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    src.connect(bp); bp.connect(g); g.connect(this.masterGain);
    src.start(now, Math.random() * 0.7, 0.1);
  }

  playExplosion(intensity = 0.8) {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const lvl = Math.max(0.25, Math.min(1.2, intensity));

    // Sub-bass shockwave
    const sub = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, now);
    sub.frequency.exponentialRampToValueAtTime(22, now + 0.55 * lvl);
    sGain.gain.setValueAtTime(0.38 * lvl, now);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.60 * lvl);
    sub.connect(sGain);
    sGain.connect(this.masterGain);
    sub.start(now);
    sub.stop(now + 0.65 * lvl);

    // Debris roar
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(920, now);
    lpf.frequency.exponentialRampToValueAtTime(110, now + 0.72 * lvl);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.32 * lvl, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.78 * lvl);
    src.connect(lpf);
    lpf.connect(nGain);
    nGain.connect(this.masterGain);
    src.start(now, Math.random() * 0.5, 0.80 * lvl);
  }

  playHitmarker() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.04);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playFootstep(sprint = false) {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = sprint ? 420 : 280;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(sprint ? 0.09 : 0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now, Math.random() * 0.8, 0.06);
  }

  playBuild() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [220, 330, 523.25].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.16, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.24);
    });
  }

  playWinchTick(progress = 0.5) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastWinchTime < 0.22) return;
    this.lastWinchTime = now;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 + progress * 460, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playJump() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(510, now + 0.16);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playDock(boarding = false) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(boarding ? 180 : 320, now);
    osc.frequency.exponentialRampToValueAtTime(boarding ? 360 : 140, now + 0.22);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playUpgrade() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.18, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.36);
    });
  }

  playResonance() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [220, 329.63, 440, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);
      gain.gain.setValueAtTime(0.001, now + i * 0.09);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.09 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 1.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 1.15);
    });
  }

  playImpact() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.28);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  playStormWarning() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(145, now + 0.45);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.58);
  }

  playPing(alignment = 0.5) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastPingTime < 0.48 - alignment * 0.28) return;
    this.lastPingTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380 + alignment * 480, now);
    gain.gain.setValueAtTime(0.05 + alignment * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playDefeat() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.5);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.65);
  }

  playVictory() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 440.0, t: 0, d: 0.2 },
      { f: 554.37, t: 0.18, d: 0.2 },
      { f: 659.25, t: 0.36, d: 0.2 },
      { f: 880.0, t: 0.54, d: 0.65 },
      { f: 659.25, t: 0.9, d: 0.2 },
      { f: 880.0, t: 1.1, d: 0.95 },
    ];
    fanfare.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.22, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.05);
    });
  }

  /** Dynamic wind rush (speed/altitude) + warm diesel deck hum when walking on Vagabond */
  updateAtmosphereAudio(speed = 0, altitude = 60, onDeck = false) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const spdNorm = Math.min(1, Math.max(0, speed / 75));
    const altNorm = Math.min(1, Math.max(0, (altitude + 40) / 220));
    if (this.windFilter && this.windGain) {
      this.windFilter.frequency.setTargetAtTime(240 + spdNorm * 580 + altNorm * 160, now, 0.12);
      this.windGain.gain.setTargetAtTime(0.035 + spdNorm * 0.095 + altNorm * 0.025, now, 0.12);
    }
    if (this.deckHumGain) {
      this.deckHumGain.gain.setTargetAtTime(onDeck ? 0.045 : 0.0, now, 0.25);
    }
  }

  /** Distant muffled storm thunder rumble */
  playDistantThunder() {
    if (!this.ctx || !this.noiseBuffer || this.muted) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(160, now);
    lp.frequency.exponentialRampToValueAtTime(48, now + 2.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.22, now + 0.35);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
    src.connect(lp); lp.connect(g); g.connect(this.masterGain);
    src.start(now); src.stop(now + 2.7);
  }

  /** Subtle 1930s Morse radio beacon pips on deck (· − ·) */
  playMorseBeacon() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const pattern = [[0.0, 0.07], [0.14, 0.20], [0.42, 0.07]];
    for (const [offset, dur] of pattern) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(760, now + offset);
      g.gain.setValueAtTime(0.028, now + offset);
      g.gain.exponentialRampToValueAtTime(0.0008, now + offset + dur);
      osc.connect(g); g.connect(this.masterGain);
      osc.start(now + offset); osc.stop(now + offset + dur + 0.02);
    }
  }
}
