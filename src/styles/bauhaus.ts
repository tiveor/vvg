import { defineStyle } from "../style.js";

const QUARTER = Math.PI / 2;

/** Tiles of quarter circles, half moons and triangles. */
export const bauhaus = defineStyle({
  name: "bauhaus",
  description: "A grid of quarter circles, half moons and triangles",
  palettes: ["bauhaus", "mondrian", "matisse", "desert", "nordic", "bolivia", "whipala"],
  grain: 0.14,
  draw(p) {
    const { rng, width: w, height: h, unit } = p;
    p.background();

    const cell = unit / rng.int(3, 6);
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const ox = (w - cols * cell) / 2;
    const oy = (h - rows * cell) / 2;
    const gutter = rng.chance(0.35) ? cell * 0.04 : 0;
    // A smaller working set of colors makes the grid feel designed, not random.
    const hue = p.colorRng;
    const colors = hue.shuffle(p.palette.colors).slice(0, hue.int(3, 5));
    const pick = (...avoid: string[]): string => {
      const options = colors.filter((c) => !avoid.includes(c));
      return hue.pick(options.length ? options : colors);
    };
    const tiles = [p.palette.background, ...colors];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const s = cell - gutter * 2;
        const x = ox + c * cell + gutter;
        const y = oy + r * cell + gutter;
        const base = hue.chance(0.3) ? p.palette.background : hue.pick(tiles);
        const ink = pick(base);
        p.rect(x, y, s, s, { fill: base });

        const corner = rng.int(0, 3);
        const cx = corner === 1 || corner === 2 ? x + s : x;
        const cy = corner >= 2 ? y + s : y;
        const motif = rng.weighted([
          ["quarter", 30],
          ["half", 18],
          ["circle", 12],
          ["triangle", 12],
          ["twins", 9],
          ["stripes", 7],
          ["target", 7],
          ["empty", 5],
        ] as const);

        switch (motif) {
          case "quarter":
            p.wedge(cx, cy, s, corner * QUARTER, (corner + 1) * QUARTER, { fill: ink });
            if (rng.chance(0.35)) {
              p.wedge(cx, cy, s * rng.float(0.35, 0.6), corner * QUARTER, (corner + 1) * QUARTER, {
                fill: pick(ink, base),
              });
            }
            break;
          case "half": {
            const side = rng.int(0, 3);
            const centers = [
              [x + s / 2, y],
              [x + s, y + s / 2],
              [x + s / 2, y + s],
              [x, y + s / 2],
            ];
            const [hx, hy] = centers[side];
            const start = [0, QUARTER, 2 * QUARTER, -QUARTER][side];
            p.wedge(hx, hy, s / 2, start, start + Math.PI, { fill: ink });
            break;
          }
          case "circle":
            p.circle(x + s / 2, y + s / 2, s * rng.float(0.3, 0.45), { fill: ink });
            break;
          case "target":
            p.circle(x + s / 2, y + s / 2, s * 0.42, { fill: ink });
            p.circle(x + s / 2, y + s / 2, s * 0.2, { fill: pick(ink) });
            break;
          case "triangle": {
            const pts = [
              { x, y },
              { x: x + s, y },
              { x: x + s, y: y + s },
              { x, y: y + s },
            ];
            pts.splice(corner, 1);
            p.polygon(pts, { fill: ink });
            break;
          }
          case "twins": {
            const opposite = (corner + 2) % 4;
            const ox2 = opposite === 1 || opposite === 2 ? x + s : x;
            const oy2 = opposite >= 2 ? y + s : y;
            p.wedge(cx, cy, s / 2, corner * QUARTER, (corner + 1) * QUARTER, { fill: ink });
            p.wedge(ox2, oy2, s / 2, opposite * QUARTER, (opposite + 1) * QUARTER, { fill: pick(base) });
            break;
          }
          case "stripes": {
            const n = rng.int(3, 5);
            const vertical = rng.chance();
            const band = s / (n * 2 - 1);
            for (let i = 0; i < n; i++) {
              const off = i * band * 2;
              if (vertical) p.rect(x + off, y, band, s, { fill: ink });
              else p.rect(x, y + off, s, band, { fill: ink });
            }
            break;
          }
          case "empty":
            break;
        }
      }
    }
  },
});
