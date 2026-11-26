import type { Color, Fill, Op, Paint, Palette, PathCommand, Point, Shape } from "./types.js";
import { createNoise, type Noise2D, type Random } from "./random.js";

/**
 * The drawing context handed to every style. It records operations;
 * renderers (SVG, Canvas) turn them into pixels later.
 */
export class Painter {
  readonly ops: Op[] = [];
  /** Shorter side of the canvas: use it to size things so styles scale. */
  readonly unit: number;
  readonly noise: Noise2D;
  /**
   * Stream reserved for color choices, so swapping the palette never
   * changes the composition.
   */
  readonly colorRng: Random;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly rng: Random,
    readonly palette: Palette,
  ) {
    this.unit = Math.min(width, height);
    this.noise = createNoise(rng.fork("noise"));
    this.colorRng = rng.fork("color");
  }

  /** A random palette color, optionally avoiding some. */
  color(...avoid: (Color | undefined)[]): Color {
    const options = this.palette.colors.filter((c) => !avoid.includes(c));
    return this.colorRng.pick(options.length ? options : this.palette.colors);
  }

  add(shape: Shape, paint: Paint): this {
    this.ops.push({ shape, paint });
    return this;
  }

  /** Fills the whole canvas. */
  background(fill: Fill = this.palette.background): this {
    return this.rect(0, 0, this.width, this.height, { fill });
  }

  rect(x: number, y: number, w: number, h: number, paint: Paint): this {
    return this.add({ type: "rect", x, y, w, h }, paint);
  }

  circle(x: number, y: number, r: number, paint: Paint): this {
    return this.add({ type: "circle", x, y, r: Math.max(0, r) }, paint);
  }

  ellipse(x: number, y: number, rx: number, ry: number, rotation: number, paint: Paint): this {
    return this.add({ type: "ellipse", x, y, rx: Math.abs(rx), ry: Math.abs(ry), rotation }, paint);
  }

  /** Pie slice; angles in radians, clockwise on screen, 0 = pointing right. */
  wedge(x: number, y: number, r: number, start: number, end: number, paint: Paint): this {
    return this.add({ type: "wedge", x, y, r, start, end }, paint);
  }

  path(d: PathCommand[], paint: Paint): this {
    return d.length ? this.add({ type: "path", d }, paint) : this;
  }

  /** Closed polygon through the points. */
  polygon(points: Point[], paint: Paint): this {
    return this.path(toCommands(points, true), paint);
  }

  /** Open polyline through the points (give it a stroke). */
  line(points: Point[], paint: Paint): this {
    return this.path(toCommands(points, false), paint);
  }

  /** Smooth curve passing through every point (Catmull-Rom). */
  curve(points: Point[], paint: Paint, closed = false): this {
    return this.path(smooth(points, closed), paint);
  }

  star(x: number, y: number, spikes: number, outer: number, inner: number, rotation: number, paint: Paint): this {
    const points: Point[] = [];
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = rotation - Math.PI / 2 + (i * Math.PI) / spikes;
      points.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r });
    }
    return this.polygon(points, paint);
  }

  text(
    x: number,
    y: number,
    text: string,
    paint: Paint,
    options: { size?: number; font?: string; align?: "start" | "middle" | "end" } = {},
  ): this {
    return this.add(
      {
        type: "text",
        x,
        y,
        text,
        size: options.size ?? this.unit / 40,
        font: options.font ?? "Georgia, 'Times New Roman', serif",
        align: options.align ?? "start",
      },
      paint,
    );
  }
}

function toCommands(points: Point[], closed: boolean): PathCommand[] {
  if (points.length < 2) return [];
  const d: PathCommand[] = [["M", points[0].x, points[0].y]];
  for (let i = 1; i < points.length; i++) d.push(["L", points[i].x, points[i].y]);
  if (closed) d.push(["Z"]);
  return d;
}

/** Catmull-Rom spline through `points`, as cubic Bézier commands. */
export function smooth(points: Point[], closed = false, tension = 1): PathCommand[] {
  const n = points.length;
  if (n < 3) return toCommands(points, closed);
  const at = (i: number): Point =>
    closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))];
  const d: PathCommand[] = [["M", points[0].x, points[0].y]];
  const segments = closed ? n : n - 1;
  const k = tension / 6;
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d.push([
      "C",
      p1.x + (p2.x - p0.x) * k,
      p1.y + (p2.y - p0.y) * k,
      p2.x - (p3.x - p1.x) * k,
      p2.y - (p3.y - p1.y) * k,
      p2.x,
      p2.y,
    ]);
  }
  if (closed) d.push(["Z"]);
  return d;
}
