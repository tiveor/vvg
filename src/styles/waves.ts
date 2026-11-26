import type { Point } from "../types.js";
import { defineStyle } from "../style.js";

/** Undulating bands of color, after Bridget Riley's op art. */
export const waves = defineStyle({
  name: "waves",
  description: "Undulating bands of color, op-art style",
  palettes: ["sunset", "ocean", "candy", "nordic", "desert", "bolivia", "whipala", "noir"],
  grain: 0.1,
  draw(p) {
    const { rng, width: w, height: h, unit, noise } = p;
    p.background();

    const vertical = rng.chance(0.3);
    const along = vertical ? h : w;
    const across = vertical ? w : h;
    const bands = rng.int(16, 48);
    const amplitude = (across / bands) * rng.float(1.5, 5);
    const freq = rng.float(1, 3) / along;
    const shift = rng.float(0.02, 0.12);
    const samples = 120;
    const sequence = p.colorRng.shuffle([p.palette.background, ...p.palette.colors]).slice(0, p.colorRng.int(2, 5));

    const edge = (i: number): Point[] => {
      // Edges start and end beyond the canvas so the waves never expose the background.
      const base = -amplitude * 1.2 + (i / bands) * (across + amplitude * 2.4);
      return Array.from({ length: samples + 1 }, (_, s) => {
        const u = (s / samples) * along;
        const v = base + amplitude * noise(u * freq, i * shift);
        return vertical ? { x: v, y: u } : { x: u, y: v };
      });
    };

    let top = edge(0);
    for (let i = 1; i <= bands; i++) {
      const bottom = edge(i);
      p.polygon([...top, ...bottom.slice().reverse()], { fill: sequence[i % sequence.length] });
      top = bottom;
    }
  },
});
