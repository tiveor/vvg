import type { Point } from "../types.js";
import { defineStyle } from "../style.js";

/** Organic paper cut-outs, after Matisse. */
export const blobs = defineStyle({
  name: "blobs",
  description: "Organic paper cut-outs with soft shadows",
  palettes: ["matisse", "candy", "bauhaus", "desert", "forest", "whipala", "faber"],
  grain: 0.14,
  draw(p) {
    const { rng, width: w, height: h, unit, noise } = p;
    p.background();

    const outline = (cx: number, cy: number, r: number, wobble: number): Point[] => {
      const n = rng.int(8, 13);
      const offset = rng.float(0, 100);
      const squash = rng.float(0.6, 1.4);
      const turn = rng.float(0, Math.PI);
      return Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const rr = r * (1 + wobble * noise(Math.cos(a) * 1.3 + offset, Math.sin(a) * 1.3 + offset));
        const x = Math.cos(a) * rr * squash;
        const y = Math.sin(a) * rr;
        return {
          x: cx + x * Math.cos(turn) - y * Math.sin(turn),
          y: cy + x * Math.sin(turn) + y * Math.cos(turn),
        };
      });
    };

    // Seaweed frond: a leaf with lobes, Matisse's signature cut-out.
    const frond = (cx: number, cy: number, len: number, angle: number): Point[] => {
      const lobes = rng.int(3, 5);
      const side: Point[] = [];
      const other: Point[] = [];
      const steps = lobes * 4;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const width = len * 0.22 * Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.abs(Math.sin(t * lobes * Math.PI)));
        const along = (t - 0.5) * len;
        const bend = Math.sin(t * Math.PI) * len * 0.08;
        side.push({ x: along, y: bend - width });
        other.push({ x: along, y: bend + width });
      }
      return [...side, ...other.reverse()].map((q) => ({
        x: cx + q.x * Math.cos(angle) - q.y * Math.sin(angle),
        y: cy + q.x * Math.sin(angle) + q.y * Math.cos(angle),
      }));
    };

    // Shapes gather around the middle and spill toward the edges.
    const center = { x: w * rng.float(0.4, 0.6), y: h * rng.float(0.4, 0.6) };
    const count = rng.int(9, 16);
    const items = Array.from({ length: count }, (_, i) => ({
      x: rng.gauss(center.x, w * 0.24),
      y: rng.gauss(center.y, h * 0.22),
      r: unit * (i < 3 ? rng.float(0.16, 0.26) : rng.float(0.05, 0.13)),
      leaf: i >= 3 && rng.chance(0.35),
    })).sort((a, b) => b.r - a.r);

    const lift = unit * 0.009;
    const shadow = { fill: p.palette.ink, alpha: 0.13 };
    let last = "";
    for (const it of items) {
      const fill = p.color(last);
      last = fill;
      const pts = it.leaf
        ? frond(it.x, it.y, it.r * 3, rng.float(0, Math.PI))
        : outline(it.x, it.y, it.r, rng.float(0.25, 0.55));
      p.curve(pts.map((q) => ({ x: q.x + lift, y: q.y + lift * 1.4 })), shadow, true);
      p.curve(pts, { fill }, true);
    }

    // Confetti of small stars and dots.
    for (let i = rng.int(6, 16); i > 0; i--) {
      const x = rng.gauss(center.x, w * 0.35);
      const y = rng.gauss(center.y, h * 0.3);
      const s = unit * rng.float(0.012, 0.028);
      if (rng.chance(0.5)) p.star(x, y, rng.int(5, 8), s, s * 0.45, rng.float(0, 1), { fill: p.color() });
      else p.circle(x, y, s * 0.5, { fill: p.color() });
    }
  },
});
