import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import {
  createRandom,
  definePalette,
  defineStyle,
  getPalette,
  getStyle,
  hash,
  mix,
  paint,
  paletteNames,
  styleNames,
} from "../src/index.js";

describe("random", () => {
  it("is reproducible for the same seed", () => {
    const a = createRandom("hello");
    const b = createRandom("hello");
    expect(Array.from({ length: 50 }, a)).toEqual(Array.from({ length: 50 }, b));
  });

  it("differs between seeds", () => {
    expect(createRandom("a")()).not.toEqual(createRandom("b")());
    expect(hash("a")).not.toEqual(hash("b"));
  });

  it("stays in range", () => {
    const rng = createRandom(42);
    for (let i = 0; i < 1000; i++) {
      const f = rng.float(-3, 7);
      const n = rng.int(2, 5);
      expect(f).toBeGreaterThanOrEqual(-3);
      expect(f).toBeLessThan(7);
      expect(Number.isInteger(n) && n >= 2 && n <= 5).toBe(true);
    }
  });

  it("forks are independent of how much the parent was used", () => {
    const a = createRandom("x");
    const b = createRandom("x");
    b();
    b();
    expect(a.fork("draw")()).toEqual(b.fork("draw")());
  });
});

describe("paint", () => {
  it("is deterministic: same seed, same SVG", () => {
    for (const style of styleNames()) {
      const a = paint({ seed: "Ada Lovelace", style, width: 400, height: 300 }).svg();
      const b = paint({ seed: "Ada Lovelace", style, width: 400, height: 300 }).svg();
      expect(a, style).toEqual(b);
    }
  });

  it("gives different seeds different paintings", () => {
    const svgs = new Set(["one", "two", "three", "four"].map((seed) => paint({ seed, style: "flow", width: 300, height: 200 }).svg()));
    expect(svgs.size).toBe(4);
  });

  it("lets the seed choose style and palette", () => {
    const art = paint({ seed: "tiveor" });
    expect(styleNames()).toContain(art.style);
    expect(paletteNames()).toContain(art.palette);
    expect(paint({ seed: "tiveor" }).style).toBe(art.style);
  });

  it("keeps the composition when only the palette changes", () => {
    const a = paint({ seed: "same", style: "bauhaus", palette: "mondrian", width: 300, height: 300 });
    const b = paint({ seed: "same", style: "bauhaus", palette: "ocean", width: 300, height: 300 });
    expect(a.ops.map((o) => o.shape.type)).toEqual(b.ops.map((o) => o.shape.type));
  });

  it.each(styleNames())("%s renders clean SVG in every palette", (style) => {
    for (const palette of paletteNames()) {
      const art = paint({ seed: `${style}-${palette}`, style, palette, width: 320, height: 200, frame: true, signature: "<Me & you>" });
      const svg = art.svg();
      expect(art.ops.length).toBeGreaterThan(1);
      expect(svg).not.toMatch(/NaN|undefined|Infinity/);
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).toContain("&lt;Me &amp; you&gt;");
    }
  });

  it("works in portrait and extreme sizes", () => {
    for (const style of styleNames()) {
      for (const [width, height] of [[120, 900], [900, 120], [16, 16]]) {
        expect(paint({ seed: "edge", style, width, height }).svg(), `${style} ${width}x${height}`).not.toMatch(/NaN/);
      }
    }
  });

  it("supports custom styles and palettes", () => {
    const dots = defineStyle({
      name: "test-dots",
      description: "test",
      draw(p) {
        p.background();
        p.circle(p.width / 2, p.height / 2, p.unit / 4, { fill: p.color() });
      },
    });
    const art = paint({ style: dots, palette: { name: "mine", background: "#000000", ink: "#ffffff", colors: ["#ff0000"] }, grain: 0 });
    expect(art.svg()).toContain('fill="#ff0000"');
    expect(art.svg()).not.toContain("feTurbulence");
  });

  it("rejects unknown names with a helpful message", () => {
    expect(() => paint({ style: "nope" })).toThrow(/Try one of/);
    expect(() => getPalette("nope")).toThrow(/Try one of/);
  });
});

describe("canvas", () => {
  it("draws with node-canvas and matches across runs", () => {
    const { createCanvas } = createRequire(import.meta.url)("canvas");
    const render = () => {
      const canvas = createCanvas(200, 120);
      paint({ seed: "pixels", style: "bauhaus", width: 200, height: 120 }).draw(canvas.getContext("2d"));
      return canvas.toBuffer("image/png") as Buffer;
    };
    expect(render().equals(render())).toBe(true);
    // The first load of the native canvas binary after an install can take several
    // seconds (macOS scans new binaries), more than the default 5 s timeout.
  }, 30_000);
});

describe("color", () => {
  it("mixes hex colors", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mix("#fff", "#000", 0)).toBe("#ffffff");
  });
});

describe("security", () => {
  it("escapes colors from custom palettes in SVG attributes", () => {
    const evil = '#000"/><script>alert(1)</script><rect fill="';
    const svg = paint({
      seed: "x",
      style: "bauhaus",
      palette: { name: "evil", background: evil, ink: evil, colors: [evil, evil] },
    }).svg();
    expect(svg).not.toContain("<script");
    expect(svg).toContain("&lt;script&gt;");
  });

  it("refuses names that reach Object.prototype", () => {
    expect(() => getStyle("__proto__")).toThrow(/unknown style/);
    expect(() => getStyle("toString")).toThrow(/unknown style/);
    expect(() => getPalette("constructor")).toThrow(/unknown palette/);
    expect(() => definePalette({ name: "__proto__", background: "#fff", ink: "#000", colors: ["#f00"] })).toThrow(/invalid palette name/);
    expect(() => defineStyle({ name: "constructor", description: "", draw() {} })).toThrow(/invalid style name/);
  });

  it("bounds the size of a painting", () => {
    expect(() => paint({ width: 100_000, height: 100 })).toThrow(/at most/);
    expect(() => paint({ width: Number.NaN, height: 100 })).toThrow(/positive/);
  });
});
