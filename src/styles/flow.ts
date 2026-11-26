import type { Point } from "../types.js";
import { defineStyle } from "../style.js";

/** Lines that follow an invisible current and never cross. */
export const flow = defineStyle({
  name: "flow",
  description: "Lines that follow an invisible current and never cross",
  palettes: ["ocean", "sunset", "jacaranda", "forest", "desert", "nordic", "neon", "earth"],
  grain: 0.1,
  draw(p) {
    const { rng, width: w, height: h, unit, noise } = p;
    p.background();

    const sep = unit * rng.float(0.007, 0.02);
    const thickness = sep * rng.float(0.35, 0.85);
    const step = sep * 0.5;
    const frequency = rng.float(0.7, 2.2) / unit;
    const turbulence = rng.float(0.8, 2.2);
    const drift = rng.float(0, Math.PI * 2);
    const maxSteps = Math.round((unit * rng.float(0.4, 1.2)) / step);
    const angleAt = (x: number, y: number): number =>
      drift + noise(x * frequency, y * frequency) * Math.PI * turbulence;

    // Spatial hash of every accepted point, so new lines keep their distance.
    const cols = Math.ceil(w / sep);
    const rows = Math.ceil(h / sep);
    const grid: Point[][] = Array.from({ length: cols * rows }, () => []);
    const cellOf = (pt: Point): number => Math.floor(pt.y / sep) * cols + Math.floor(pt.x / sep);
    const free = (pt: Point, min: number): boolean => {
      if (pt.x < 0 || pt.y < 0 || pt.x >= w || pt.y >= h) return false;
      const cx = Math.floor(pt.x / sep);
      const cy = Math.floor(pt.y / sep);
      for (let y = cy - 1; y <= cy + 1; y++) {
        for (let x = cx - 1; x <= cx + 1; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          for (const q of grid[y * cols + x]) {
            if ((q.x - pt.x) ** 2 + (q.y - pt.y) ** 2 < min * min) return false;
          }
        }
      }
      return true;
    };

    const trace = (start: Point, dir: 1 | -1): Point[] => {
      const out: Point[] = [];
      let pt = start;
      for (let i = 0; i < maxSteps; i++) {
        const a = angleAt(pt.x, pt.y);
        const next = { x: pt.x + Math.cos(a) * step * dir, y: pt.y + Math.sin(a) * step * dir };
        if (!free(next, sep * 0.9)) break;
        out.push(next);
        pt = next;
      }
      return out;
    };

    // A dominant color plus accents reads better than an even mix.
    const main = p.color();
    const accentShare = rng.float(0.25, 0.6);

    const seeds: Point[] = [];
    for (let y = sep / 2; y < h; y += sep * 2) {
      for (let x = sep / 2; x < w; x += sep * 2) seeds.push({ x: x + rng.float(-sep, sep), y: y + rng.float(-sep, sep) });
    }

    for (const start of rng.shuffle(seeds)) {
      if (!free(start, sep)) continue;
      const line = [...trace(start, -1).reverse(), start, ...trace(start, 1)];
      if (line.length < 6) continue;
      for (const pt of line) grid[cellOf(pt)].push(pt);
      // Keep every other point: the curve stays smooth and the file stays small.
      const pts = line.filter((_, i) => i % 2 === 0 || i === line.length - 1);
      const color = p.colorRng.chance(accentShare) ? p.color(main) : main;
      p.line(pts, {
        stroke: color,
        width: thickness * rng.float(0.7, 1.2),
        cap: "round",
        join: "round",
      });
    }
  },
});
