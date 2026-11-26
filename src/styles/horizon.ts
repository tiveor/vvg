import type { Point } from "../types.js";
import { isDark, mix } from "../color.js";
import { defineStyle } from "../style.js";

/** Layered ridges fading into the distance, under a low sun. */
export const horizon = defineStyle({
  name: "horizon",
  description: "Layered mountains fading into the distance under a low sun",
  palettes: ["sunset", "desert", "ocean", "forest", "nordic", "jacaranda", "candy", "earth"],
  grain: 0.16,
  draw(p) {
    const { rng, width: w, height: h, unit, noise } = p;
    const { background: paper, ink } = p.palette;
    const [skyColor, landColor, sunColor] = p.colorRng.shuffle(p.palette.colors);
    const horizonY = h * rng.float(0.42, 0.6);

    p.background({
      type: "linear",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: horizonY,
      stops: [
        [0, mix(skyColor, ink, 0.15)],
        [0.55, mix(skyColor, paper, 0.45)],
        [1, mix(paper, sunColor ?? paper, 0.25)],
      ],
    });

    // Sun with a soft halo.
    const sun = { x: rng.float(0.2, 0.8) * w, y: horizonY - unit * rng.float(0.12, 0.32), r: unit * rng.float(0.06, 0.12) };
    const sunFill = sunColor ?? mix(paper, "#ffffff", 0.5);
    for (let i = 4; i > 0; i--) p.circle(sun.x, sun.y, sun.r * (1 + i * 0.45), { fill: sunFill, alpha: 0.06 });
    p.circle(sun.x, sun.y, sun.r, { fill: sunFill });

    // Ridges: far ones are pale and jagged, near ones dark and smooth.
    const layers = rng.int(5, 8);
    // Spread the land from pale to deep whatever the paper, so dark palettes keep their depth.
    const far = isDark(paper) ? mix(landColor, "#ffffff", 0.35) : mix(landColor, paper, 0.65);
    const near = mix(landColor, ink, 0.65);
    const samples = 140;
    for (let i = 0; i < layers; i++) {
      const t = i / (layers - 1);
      const base = horizonY + (h - horizonY) * (t * 0.85) - unit * 0.02;
      const amplitude = unit * (0.22 - t * 0.14) * rng.float(0.7, 1.2);
      const freq = (3.5 - t * 2.2) / w;
      const pts: Point[] = [];
      for (let s = 0; s <= samples; s++) {
        const x = (s / samples) * w;
        const n1 = noise(x * freq, i * 7.31);
        const n2 = noise(x * freq * 4, i * 3.17) * (0.35 - t * 0.3);
        pts.push({ x, y: base - amplitude * (0.55 + 0.45 * (n1 + n2)) });
      }
      const fill = mix(far, near, t);
      p.path(
        [
          ["M", 0, h],
          ...pts.map((pt): ["L", number, number] => ["L", pt.x, pt.y]),
          ["L", w, h],
          ["Z"],
        ],
        { fill },
      );
    }

    // A few birds, sometimes.
    if (rng.chance(0.6)) {
      const flock = { x: rng.float(0.15, 0.85) * w, y: rng.float(0.1, 0.35) * h };
      for (let i = rng.int(2, 7); i > 0; i--) {
        const bx = rng.gauss(flock.x, unit * 0.05);
        const by = rng.gauss(flock.y, unit * 0.025);
        const s = unit * rng.float(0.006, 0.012);
        p.line(
          [
            { x: bx - s, y: by - s * 0.4 },
            { x: bx, y: by },
            { x: bx + s, y: by - s * 0.4 },
          ],
          { stroke: mix(ink, skyColor, 0.3), width: Math.max(1, s * 0.18), cap: "round", join: "round" },
        );
      }
    }
  },
});
