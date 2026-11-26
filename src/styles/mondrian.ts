import { defineStyle } from "../style.js";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Recursive subdivision with heavy black lines and a few blocks of color. */
export const mondrian = defineStyle({
  name: "mondrian",
  description: "Recursive blocks, black lines and a few bold colors",
  palettes: ["mondrian", "bauhaus", "nordic", "noir", "matisse"],
  grain: 0.12,
  draw(p) {
    const { rng, width: w, height: h, unit } = p;
    const line = unit * rng.float(0.01, 0.018);
    p.background(p.palette.ink);

    const minSide = unit * rng.float(0.09, 0.16);
    const boxes: Box[] = [];
    const split = (b: Box, depth: number): void => {
      const canV = b.w > minSide * 2;
      const canH = b.h > minSide * 2;
      const keep = depth > 1 && rng.chance(0.18 + depth * 0.06);
      if ((!canV && !canH) || keep) {
        boxes.push(b);
        return;
      }
      const vertical = canV && (!canH || rng.chance(b.w / (b.w + b.h)));
      const t = rng.float(0.25, 0.75);
      if (vertical) {
        const cut = Math.max(minSide, Math.min(b.w - minSide, b.w * t));
        split({ ...b, w: cut }, depth + 1);
        split({ ...b, x: b.x + cut, w: b.w - cut }, depth + 1);
      } else {
        const cut = Math.max(minSide, Math.min(b.h - minSide, b.h * t));
        split({ ...b, h: cut }, depth + 1);
        split({ ...b, y: b.y + cut, h: b.h - cut }, depth + 1);
      }
    };
    split({ x: 0, y: 0, w, h }, 0);

    // Big boxes stay paper more often: color reads as an accent, not a quilt.
    const paper = p.palette.background;
    const colored = Math.max(2, Math.round(boxes.length * rng.float(0.18, 0.32)));
    const order = rng.shuffle(boxes.map((_, i) => i));
    const tinted = new Set(order.slice(0, colored));
    boxes.forEach((b, i) => {
      const fill = tinted.has(i) ? p.color(p.palette.ink) : paper;
      p.rect(b.x + line / 2, b.y + line / 2, b.w - line, b.h - line, { fill });
    });
  },
});
