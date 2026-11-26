import type { Point } from "../types.js";
import { defineStyle } from "../style.js";

interface Shard {
  size: number;
  draw(): void;
}

/** The original VVG idea: a storm of shards, now with a palette and a center of gravity. */
export const chaos = defineStyle({
  name: "chaos",
  description: "A storm of shards around a center of gravity — the original VVG",
  palettes: ["faber", "whipala", "bolivia", "matisse", "neon", "candy", "bauhaus"],
  grain: 0.12,
  draw(p) {
    const { rng, width: w, height: h, unit } = p;
    p.background();

    // Broad diagonal washes, a nod to the original drawBackground().
    for (let i = rng.int(2, 4); i > 0; i--) {
      const y1 = rng.float(-0.3, 1) * h;
      const y2 = y1 + rng.float(0.15, 0.5) * h;
      const tilt = rng.float(-0.4, 0.4) * h;
      p.polygon(
        [
          { x: 0, y: y1 },
          { x: w, y: y1 + tilt },
          { x: w, y: y2 + tilt },
          { x: 0, y: y2 },
        ],
        { fill: p.color(), alpha: rng.float(0.12, 0.3) },
      );
    }

    const focus = { x: rng.float(0.3, 0.7) * w, y: rng.float(0.3, 0.7) * h };
    const spread = unit * rng.float(0.26, 0.4);
    const count = Math.round(((w * h) / (unit * unit)) * rng.int(450, 800));
    const shards: Shard[] = [];

    for (let i = 0; i < count; i++) {
      const pos: Point = rng.chance(0.6)
        ? { x: rng.gauss(focus.x, spread * 1.3), y: rng.gauss(focus.y, spread) }
        : { x: rng.float(0, w), y: rng.float(0, h) };
      const d = Math.hypot(pos.x - focus.x, pos.y - focus.y) / unit;
      // Power law: lots of small pieces, a few big ones, bigger near the focus.
      const size = unit * 0.004 * 10 ** (rng() * 1.4) * (1.3 - 0.8 * Math.min(1, d));
      const angle = rng.float(0, Math.PI * 2);
      const fill = p.color();
      const alpha = rng.float(0.82, 1);
      const kind = rng.weighted([
        ["sliver", 40],
        ["triangle", 20],
        ["dot", 14],
        ["stroke", 16],
        ["star", 4],
        ["square", 6],
      ] as const);

      shards.push({
        size,
        draw: () => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          switch (kind) {
            case "sliver": {
              const len = size * rng.float(1.5, 3.5);
              const bulge = size * rng.float(0.2, 0.6);
              const ax = pos.x - cos * len;
              const ay = pos.y - sin * len;
              const bx = pos.x + cos * len;
              const by = pos.y + sin * len;
              p.path(
                [
                  ["M", ax, ay],
                  ["Q", pos.x - sin * bulge * 2, pos.y + cos * bulge * 2, bx, by],
                  ["Q", pos.x + sin * bulge * 0.4, pos.y - cos * bulge * 0.4, ax, ay],
                  ["Z"],
                ],
                { fill, alpha },
              );
              break;
            }
            case "triangle": {
              const pts: Point[] = [0, 1, 2].map((k) => {
                const a = angle + (k * Math.PI * 2) / 3 + rng.float(-0.5, 0.5);
                const r = size * rng.float(0.5, 1.6);
                return { x: pos.x + Math.cos(a) * r, y: pos.y + Math.sin(a) * r };
              });
              p.polygon(pts, { fill, alpha });
              break;
            }
            case "dot":
              p.circle(pos.x, pos.y, size * rng.float(0.25, 0.8), { fill, alpha });
              break;
            case "stroke": {
              const len = size * rng.float(1.5, 5);
              p.line(
                [
                  { x: pos.x - cos * len, y: pos.y - sin * len },
                  { x: pos.x + cos * len, y: pos.y + sin * len },
                ],
                { stroke: fill, width: Math.max(1, size * rng.float(0.08, 0.25)), cap: "round", alpha },
              );
              break;
            }
            case "star":
              p.star(pos.x, pos.y, rng.int(4, 7), size, size * 0.35, angle, { fill, alpha });
              break;
            case "square":
              p.polygon(
                [0, 1, 2, 3].map((k) => ({
                  x: pos.x + Math.cos(angle + (k * Math.PI) / 2) * size * 0.6,
                  y: pos.y + Math.sin(angle + (k * Math.PI) / 2) * size * 0.6,
                })),
                { fill, alpha },
              );
              break;
          }
        },
      });
    }

    // Big pieces first so the fine detail sits on top.
    shards.sort((a, b) => b.size - a.size).forEach((s) => s.draw());
  },
});
