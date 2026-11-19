// Deterministic seeded PRNG (Mulberry32 + FNV-1a string hash)
export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class SeededRNG {
  constructor(seedStr) {
    this.seedStr = String(seedStr || 'AETHER-101');
    this.state = hashSeed(this.seedStr) || 1;
  }

  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

export function generateRandomSeed() {
  const prefixes = ['AETHER', 'VELA', 'ORION', 'LYRA', 'NEXUS', 'SOLIS', 'CHRONO'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = Math.floor(100 + Math.random() * 8999);
  return `${p}-${n}`;
}
