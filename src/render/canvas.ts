import type { Fill, Op, Paint, PathCommand, Shape } from "../types.js";

/**
 * The subset of CanvasRenderingContext2D VVG uses. Browser contexts,
 * OffscreenCanvas and node-canvas all satisfy it.
 */
export interface Context2D {
  canvas: { width: number; height: number };
  fillStyle: unknown;
  strokeStyle: unknown;
  lineWidth: number;
  lineCap: string;
  lineJoin: string;
  globalAlpha: number;
  globalCompositeOperation: string;
  font: string;
  textAlign: string;
  save(): void;
  restore(): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(a: number, b: number, c: number, d: number, x: number, y: number): void;
  arc(x: number, y: number, r: number, start: number, end: number, ccw?: boolean): void;
  ellipse(x: number, y: number, rx: number, ry: number, rot: number, start: number, end: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  fill(): void;
  stroke(): void;
  fillText(text: string, x: number, y: number): void;
  createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradientLike;
  createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): CanvasGradientLike;
  getImageData(x: number, y: number, w: number, h: number): { data: Uint8ClampedArray };
  putImageData(data: { data: Uint8ClampedArray }, x: number, y: number): void;
}

interface CanvasGradientLike {
  addColorStop(offset: number, color: string): void;
}

const BLEND: Record<string, string> = {
  normal: "source-over",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  darken: "darken",
  lighten: "lighten",
};

function resolveFill(ctx: Context2D, fill: Fill): unknown {
  if (typeof fill === "string") return fill;
  const g =
    fill.type === "linear"
      ? ctx.createLinearGradient(fill.x1, fill.y1, fill.x2, fill.y2)
      : ctx.createRadialGradient(fill.x, fill.y, 0, fill.x, fill.y, fill.r);
  for (const [offset, color] of fill.stops) g.addColorStop(offset, color);
  return g;
}

function tracePath(ctx: Context2D, d: PathCommand[]): void {
  for (const c of d) {
    switch (c[0]) {
      case "M": ctx.moveTo(c[1], c[2]); break;
      case "L": ctx.lineTo(c[1], c[2]); break;
      case "Q": ctx.quadraticCurveTo(c[1], c[2], c[3], c[4]); break;
      case "C": ctx.bezierCurveTo(c[1], c[2], c[3], c[4], c[5], c[6]); break;
      case "Z": ctx.closePath(); break;
    }
  }
}

function traceShape(ctx: Context2D, shape: Exclude<Shape, { type: "text" }>): void {
  switch (shape.type) {
    case "rect":
      ctx.rect(shape.x, shape.y, shape.w, shape.h);
      break;
    case "circle":
      ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
      break;
    case "ellipse":
      ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, shape.rotation, 0, Math.PI * 2);
      break;
    case "wedge":
      ctx.moveTo(shape.x, shape.y);
      ctx.arc(shape.x, shape.y, shape.r, shape.start, shape.end, shape.end < shape.start);
      ctx.closePath();
      break;
    case "path":
      tracePath(ctx, shape.d);
      break;
  }
}

export function renderOp(ctx: Context2D, { shape, paint }: Op): void {
  ctx.save();
  applyPaint(ctx, paint);
  if (shape.type === "text") {
    ctx.font = `${shape.size}px ${shape.font}`;
    ctx.textAlign = shape.align === "middle" ? "center" : shape.align === "end" ? "right" : "left";
    if (paint.fill !== undefined) ctx.fillText(shape.text, shape.x, shape.y);
  } else {
    ctx.beginPath();
    traceShape(ctx, shape);
    if (paint.fill !== undefined) ctx.fill();
    if (paint.stroke) ctx.stroke();
  }
  ctx.restore();
}

function applyPaint(ctx: Context2D, paint: Paint): void {
  if (paint.fill !== undefined) ctx.fillStyle = resolveFill(ctx, paint.fill);
  if (paint.stroke) {
    ctx.strokeStyle = paint.stroke;
    ctx.lineWidth = paint.width ?? 1;
    ctx.lineCap = paint.cap ?? "butt";
    ctx.lineJoin = paint.join ?? "miter";
  }
  if (paint.alpha !== undefined) ctx.globalAlpha = paint.alpha;
  if (paint.blend) ctx.globalCompositeOperation = BLEND[paint.blend] ?? "source-over";
}

/** Draws `ops[start..end)`. Lets you paint a scene progressively. */
export function renderOps(ctx: Context2D, ops: Op[], start = 0, end = ops.length): void {
  for (let i = Math.max(0, start); i < Math.min(end, ops.length); i++) renderOp(ctx, ops[i]);
}

/** Multiplies a seeded monochrome paper grain over the whole canvas. */
export function applyGrain(ctx: Context2D, amount: number, seed: number): void {
  if (amount <= 0) return;
  const { width, height } = ctx.canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  let s = seed >>> 0 || 1;
  for (let i = 0; i < data.length; i += 4) {
    // xorshift32: fast and deterministic.
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const f = 1 - amount * ((s >>> 0) / 4294967296) * 0.6;
    data[i] *= f;
    data[i + 1] *= f;
    data[i + 2] *= f;
  }
  ctx.putImageData(image, 0, 0);
}
