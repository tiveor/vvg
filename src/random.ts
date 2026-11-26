/**
 * Seeded randomness: any string (or number) becomes a reproducible stream.
 * Same seed → same numbers → same painting, on every platform.
 */

/** cyrb53 string hash → 53-bit integer. */
export function hash(input: string | number): number {
  const str = String(input);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export interface Random {
  /** Float in [0, 1). */
  (): number;
  /** Float in [min, max). */
  float(min?: number, max?: number): number;
  /** Integer in [min, max] (inclusive). */
  int(min: number, max: number): number;
  /** True with the given probability (default 0.5). */
  chance(probability?: number): boolean;
  /** Random element of a non-empty array. */
  pick<T>(items: readonly T[]): T;
  /** Element chosen proportionally to its weight. */
  weighted<T>(items: readonly (readonly [T, number])[]): T;
  /** Normally distributed number. */
  gauss(mean?: number, deviation?: number): number;
  /** Returns a shuffled copy. */
  shuffle<T>(items: readonly T[]): T[];
  /** Independent child stream, stable for a given label. */
  fork(label: string): Random;
}

/** Creates a seeded random stream (mulberry32). */
export function createRandom(seed: string | number): Random {
  let state = hash(seed) >>> 0;
  const base = String(seed);

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = next as Random;
  rng.float = (min = 0, max = 1) => min + next() * (max - min);
  rng.int = (min, max) => Math.floor(min + next() * (max - min + 1));
  rng.chance = (probability = 0.5) => next() < probability;
  rng.pick = (items) => {
    if (items.length === 0) throw new Error("vvg: cannot pick from an empty array");
    return items[Math.floor(next() * items.length)];
  };
  rng.weighted = (items) => {
    const total = items.reduce((sum, [, w]) => sum + w, 0);
    let roll = next() * total;
    for (const [item, weight] of items) {
      roll -= weight;
      if (roll < 0) return item;
    }
    return items[items.length - 1][0];
  };
  rng.gauss = (mean = 0, deviation = 1) => {
    // Box–Muller; 1 - next() avoids log(0).
    const u = 1 - next();
    const v = next();
    return mean + deviation * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  rng.shuffle = (items) => {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  rng.fork = (label) => createRandom(`${base}\u0000${label}`);
  return rng;
}

/** Seeded 2D simplex noise, returns values in roughly [-1, 1]. */
export type Noise2D = (x: number, y: number) => number;

const GRAD: readonly [number, number][] = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

export function createNoise(rng: Random): Noise2D {
  const perm = new Uint8Array(512);
  const p = rng.shuffle(Array.from({ length: 256 }, (_, i) => i));
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const corner = (gi: number, x: number, y: number): number => {
    const t = 0.5 - x * x - y * y;
    if (t < 0) return 0;
    const [gx, gy] = GRAD[gi % 8];
    return t * t * t * t * (gx * x + gy * y);
  };

  return (xin, yin) => {
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const n0 = corner(perm[ii + perm[jj]], x0, y0);
    const n1 = corner(perm[ii + i1 + perm[jj + j1]], x1, y1);
    const n2 = corner(perm[ii + 1 + perm[jj + 1]], x2, y2);
    return 70 * (n0 + n1 + n2);
  };
}
