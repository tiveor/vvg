import type { Op, Palette } from "./types.js";
import { createRandom, hash } from "./random.js";
import { Painter } from "./painter.js";
import { getPalette, palettes, paletteNames } from "./palettes.js";
import { getStyle, styleNames, styles, type Style } from "./style.js";
import { renderSvg } from "./render/svg.js";
import { applyGrain, renderOps, type Context2D } from "./render/canvas.js";
import { isDark, mix } from "./color.js";
import "./styles/index.js";

export interface PaintOptions {
  /** Any text or number. Same seed + same options → same painting. Random if omitted. */
  seed?: string | number;
  /** Style name or a custom style. Picked by the seed if omitted. */
  style?: string | Style;
  /** Palette name or a custom palette. Picked by the seed if omitted. */
  palette?: string | Palette;
  /** Default 1600. */
  width?: number;
  /** Default 1000. */
  height?: number;
  /** Paper grain, 0–1. Defaults to the style's own amount; 0 turns it off. */
  grain?: number;
  /** Adds a gallery mat. `true` or a mat size as a fraction of the short side. */
  frame?: boolean | number;
  /** Signature written in the bottom-right corner. */
  signature?: string;
}

export interface Painting {
  readonly seed: string;
  readonly style: string;
  readonly palette: string;
  readonly width: number;
  readonly height: number;
  readonly grain: number;
  /** The scene as a flat list of drawing operations. */
  readonly ops: Op[];
  /** Standalone SVG document. Zero dependencies, works anywhere. */
  svg(): string;
  /**
   * Draws onto a 2D context (browser canvas, OffscreenCanvas or node-canvas).
   * Scale the context first if the canvas is larger than the painting.
   */
  draw(ctx: Context2D): void;
}

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 1000;

/** A short, readable random seed, e.g. "k3f9qa". */
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Turns a seed into a painting. */
export function paint(options: PaintOptions = {}): Painting {
  const seed = String(options.seed ?? randomSeed());
  const width = Math.round(options.width ?? DEFAULT_WIDTH);
  const height = Math.round(options.height ?? DEFAULT_HEIGHT);
  if (!(width > 0 && height > 0)) throw new Error("vvg: width and height must be positive");

  const rng = createRandom(seed);
  const style =
    typeof options.style === "object"
      ? options.style
      : getStyle(options.style ?? rng.fork("style").pick(styleNames()));
  const palette =
    typeof options.palette === "object"
      ? options.palette
      : getPalette(options.palette ?? rng.fork("palette").pick(preferredPalettes(style)));

  const painter = new Painter(width, height, rng.fork("draw"), palette);
  style.draw(painter);
  finish(painter, options);

  const grain = Math.max(0, Math.min(1, options.grain ?? style.grain ?? 0.1));
  const ops = painter.ops;
  const grainSeed = hash(seed);

  return {
    seed,
    style: style.name,
    palette: palette.name,
    width,
    height,
    grain,
    ops,
    svg: () => renderSvg(ops, { width, height, grain, seed: grainSeed, title: `vvg · ${seed}` }),
    draw: (ctx) => {
      renderOps(ctx, ops);
      applyGrain(ctx, grain, grainSeed);
    },
  };
}

function preferredPalettes(style: Style): string[] {
  const known = (style.palettes ?? []).filter((name) => name in palettes);
  return known.length ? known : paletteNames();
}

/** Mat and signature, drawn over the style. */
function finish(p: Painter, { frame, signature }: PaintOptions): void {
  const { width: w, height: h, unit } = p;
  const mat = frame ? unit * (typeof frame === "number" ? frame : 0.06) : 0;
  if (mat > 0) {
    const paper = isDark(p.palette.background) ? "#f4f1ea" : mix(p.palette.background, "#ffffff", 0.55);
    p.rect(0, 0, w, mat, { fill: paper });
    p.rect(0, h - mat, w, mat, { fill: paper });
    p.rect(0, mat, mat, h - mat * 2, { fill: paper });
    p.rect(w - mat, mat, mat, h - mat * 2, { fill: paper });
    p.rect(mat, mat, w - mat * 2, h - mat * 2, { stroke: "#000000", width: Math.max(1, unit * 0.0015), alpha: 0.18 });
  }
  if (signature) {
    const size = mat > 0 ? mat * 0.3 : unit * 0.022;
    const inset = mat > 0 ? mat : unit * 0.035;
    const onDark = mat === 0 && isDark(p.palette.background);
    p.text(w - inset, h - (mat > 0 ? mat * 0.38 : inset), signature, {
      fill: onDark ? "#ffffff" : p.palette.ink,
      alpha: 0.7,
    }, { size, align: "end", font: "Georgia, 'Times New Roman', serif" });
  }
}

export { createRandom, createNoise, hash } from "./random.js";
export type { Random, Noise2D } from "./random.js";
export { Painter, smooth } from "./painter.js";
export { defineStyle, getStyle, styleNames, styles } from "./style.js";
export type { Style } from "./style.js";
export { definePalette, getPalette, paletteNames, palettes } from "./palettes.js";
export { mix, luminance, isDark } from "./color.js";
export { renderSvg } from "./render/svg.js";
export { renderOp, renderOps, applyGrain } from "./render/canvas.js";
export type { Context2D } from "./render/canvas.js";
export type * from "./types.js";
