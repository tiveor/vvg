import type { Point } from "../types.js";
import { mix } from "../color.js";
import { defineStyle } from "../style.js";

interface Branch {
  x: number;
  y: number;
  angle: number;
  radius: number;
  generation: number;
  travelled: number;
  trail: { x: number; y: number; r: number }[];
}

/**
 * A tree in bloom. Grows with the "snake" algorithm from the original VVG
 * (after Kenneth Jorgensen's canvas trees), now fully seeded.
 */
export const jacaranda = defineStyle({
  name: "jacaranda",
  description: "A tree in full bloom, grown branch by branch",
  palettes: ["jacaranda", "candy", "sunset", "forest", "matisse", "earth"],
  grain: 0.12,
  draw(p) {
    const { rng, width: w, height: h, unit } = p;
    // Portrait canvases (phone wallpapers) get a taller tree instead of a tiny one.
    const size = unit * Math.min(1.4, Math.max(1, h / w));
    const { background, ink } = p.palette;
    p.background({
      type: "linear",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: h,
      stops: [
        [0, mix(background, "#ffffff", 0.35)],
        [1, background],
      ],
    });

    const ground = h * rng.float(0.88, 0.94);
    p.rect(0, ground, w, h - ground, { fill: mix(background, ink, 0.08) });

    const step = size / 250;
    const maxGeneration = 5;
    const living: Branch[] = [];
    const done: Branch[] = [];
    const baseX = w / 2 + rng.float(-0.12, 0.12) * w;

    const trunks = rng.int(1, 3);
    for (let i = 0; i < trunks; i++) {
      living.push({
        x: baseX + (i - (trunks - 1) / 2) * size * 0.025,
        y: ground + size * 0.01,
        angle: -Math.PI / 2 + rng.float(-0.15, 0.15),
        radius: (size / 32) / Math.sqrt(trunks),
        generation: 0,
        travelled: 0,
        trail: [],
      });
    }

    const trunkLength = size * rng.float(0.16, 0.26);
    for (let tick = 0; tick < 900 && living.length; tick++) {
      for (const b of living.splice(0)) {
        b.trail.push({ x: b.x, y: b.y, r: b.radius });
        b.x += Math.cos(b.angle) * step;
        b.y += Math.sin(b.angle) * step;
        b.travelled += step;
        b.radius *= 0.993 - b.generation * 0.0035;
        // Wander, with a gentle pull upward so the crown spreads, not sags.
        const pull = b.generation === 0 ? 0.04 : 0.006;
        b.angle += rng.float(-0.09, 0.09) + (-Math.PI / 2 - b.angle) * pull;

        const due = b.generation === 0 ? trunkLength : size * rng.float(0.06, 0.14);
        const splits = b.generation < maxGeneration && b.travelled > due && rng.chance(0.08);
        if (splits) {
          const n = rng.int(2, 3);
          for (let i = 0; i < n; i++) {
            living.push({
              x: b.x,
              y: b.y,
              angle: b.angle + (i - (n - 1) / 2) * rng.float(0.35, 0.7),
              radius: b.radius * 0.82,
              generation: b.generation + 1,
              travelled: 0,
              trail: [{ x: b.x, y: b.y, r: b.radius * 0.82 }],
            });
          }
          done.push(b);
        } else if (b.radius < size * 0.0007 || b.y < -h * 0.1) {
          done.push(b);
        } else {
          living.push(b);
        }
      }
    }
    done.push(...living);

    // Wood: each branch as short tapered segments.
    const bark = mix(ink, p.palette.colors[0], 0.15);
    for (const b of done) {
      const t = b.trail;
      for (let i = 0; i < t.length - 1; i += 4) {
        const seg = t.slice(i, i + 5);
        p.line(seg, { stroke: bark, width: Math.max(0.6, seg[0].r * 2), cap: "round", join: "round" });
      }
    }

    // Blossom: petals cluster around the young wood.
    const spots: Point[] = [];
    for (const b of done) {
      if (b.generation < 2) continue;
      for (let i = 0; i < b.trail.length; i += 6) spots.push(b.trail[i]);
      const end = b.trail[b.trail.length - 1];
      if (end) spots.push(end, end);
    }
    const bloom = size * rng.float(0.035, 0.055);
    const petal = size * 0.0085;
    const per = Math.max(3, Math.round(3200 / Math.max(1, spots.length)));
    for (const s of spots) {
      for (let i = 0; i < per; i++) {
        const r = petal * rng.float(0.5, 1.6);
        p.ellipse(rng.gauss(s.x, bloom), rng.gauss(s.y, bloom * 0.8), r, r * 0.6, rng.float(0, Math.PI), {
          fill: p.color(),
          alpha: rng.float(0.55, 0.95),
        });
      }
    }

    // Fallen petals.
    for (let i = rng.int(150, 400); i > 0; i--) {
      const r = petal * rng.float(0.4, 1.1);
      p.ellipse(rng.gauss(baseX, size * 0.35), rng.float(ground, h), r, r * 0.5, rng.float(0, Math.PI), {
        fill: p.color(),
        alpha: rng.float(0.5, 0.9),
      });
    }
  },
});
