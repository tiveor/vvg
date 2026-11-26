// Renders the README gallery and the playground's social card.
// Run with `pnpm gallery` (needs the `canvas` dev dependency).
import { mkdirSync, writeFileSync } from "node:fs";
import { createCanvas } from "canvas";
import { paint } from "../dist/index.js";

// One showcase per style: [style, palette, seed]. Change a seed to change the picture.
const SHOWCASE = [
  ["flow", "neon", "Ada Lovelace"],
  ["jacaranda", "jacaranda", "ana"],
  ["bauhaus", "bauhaus", "tiveor"],
  ["horizon", "sunset", "tiveor"],
  ["waves", "ocean", "hello world"],
  ["mondrian", "mondrian", "Piet"],
  ["blobs", "matisse", "ana"],
  ["chaos", "faber", "Marc Quinn"],
];

mkdirSync("docs/styles", { recursive: true });

const jpeg = (canvas) => canvas.toBuffer("image/jpeg", { quality: 0.86 });
const render = (options) => {
  const art = paint(options);
  const canvas = createCanvas(art.width, art.height);
  art.draw(canvas.getContext("2d"));
  return canvas;
};

// Per-style thumbnails.
for (const [style, palette, seed] of SHOWCASE) {
  writeFileSync(`docs/styles/${style}.jpg`, jpeg(render({ seed, style, palette, width: 800, height: 500 })));
  console.log(`docs/styles/${style}.jpg`);
}

// Hero: the eight styles on a wall, 4 × 2.
const tile = { w: 640, h: 400 };
const gap = 24;
const cols = 4;
const rows = Math.ceil(SHOWCASE.length / cols);
const hero = createCanvas(cols * tile.w + (cols + 1) * gap, rows * tile.h + (rows + 1) * gap);
const ctx = hero.getContext("2d");
ctx.fillStyle = "#1c1b1a";
ctx.fillRect(0, 0, hero.width, hero.height);
SHOWCASE.forEach(([style, palette, seed], i) => {
  const x = gap + (i % cols) * (tile.w + gap);
  const y = gap + Math.floor(i / cols) * (tile.h + gap);
  ctx.drawImage(render({ seed, style, palette, width: 1280, height: 800 }), x, y, tile.w, tile.h);
});
writeFileSync("docs/hero.jpg", jpeg(hero));
console.log("docs/hero.jpg");

// Social card for the playground.
const og = render({ seed: "every word is a painting", style: "flow", palette: "sunset", width: 1200, height: 630 });
writeFileSync("web/og.jpg", jpeg(og));
console.log("web/og.jpg");
