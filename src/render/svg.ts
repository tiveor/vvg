import type { Gradient, Op, Paint, PathCommand, Shape } from "../types.js";

/** Rounds to 2 decimals: keeps files small and output stable. */
const n = (v: number): string => String(Math.round(v * 100) / 100);

const escapeXml = (s: string): string =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

// Every string that reaches an attribute is escaped: colors and other paint values
// can come from user-defined palettes and styles, so they are untrusted input.
const attr = escapeXml;

export function pathData(d: PathCommand[]): string {
  return d.map(([cmd, ...args]) => cmd + args.map(n).join(" ")).join("");
}

function shapeElement(shape: Shape, attrs: string): string {
  switch (shape.type) {
    case "rect":
      return `<rect x="${n(shape.x)}" y="${n(shape.y)}" width="${n(shape.w)}" height="${n(shape.h)}"${attrs}/>`;
    case "circle":
      return `<circle cx="${n(shape.x)}" cy="${n(shape.y)}" r="${n(shape.r)}"${attrs}/>`;
    case "ellipse": {
      const rot = shape.rotation ? ` transform="rotate(${n((shape.rotation * 180) / Math.PI)} ${n(shape.x)} ${n(shape.y)})"` : "";
      return `<ellipse cx="${n(shape.x)}" cy="${n(shape.y)}" rx="${n(shape.rx)}" ry="${n(shape.ry)}"${rot}${attrs}/>`;
    }
    case "wedge": {
      const { x, y, r, start, end } = shape;
      const sweep = end - start;
      if (Math.abs(sweep) >= Math.PI * 2 - 1e-9) {
        return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"${attrs}/>`;
      }
      const large = Math.abs(sweep) > Math.PI ? 1 : 0;
      const dir = sweep > 0 ? 1 : 0;
      const d =
        `M${n(x)} ${n(y)}L${n(x + r * Math.cos(start))} ${n(y + r * Math.sin(start))}` +
        `A${n(r)} ${n(r)} 0 ${large} ${dir} ${n(x + r * Math.cos(end))} ${n(y + r * Math.sin(end))}Z`;
      return `<path d="${d}"${attrs}/>`;
    }
    case "path":
      return `<path d="${pathData(shape.d)}"${attrs}/>`;
    case "text": {
      return (
        `<text x="${n(shape.x)}" y="${n(shape.y)}" font-size="${n(shape.size)}" ` +
        `font-family="${escapeXml(shape.font)}" text-anchor="${attr(shape.align)}"${attrs}>${escapeXml(shape.text)}</text>`
      );
    }
  }
}

function paintAttrs(paint: Paint, gradientId: (g: Gradient) => string): string {
  let out = "";
  const fill = paint.fill;
  out += ` fill="${fill === undefined ? "none" : typeof fill === "string" ? attr(fill) : `url(#${gradientId(fill)})`}"`;
  if (paint.stroke) {
    out += ` stroke="${attr(paint.stroke)}" stroke-width="${n(paint.width ?? 1)}"`;
    if (paint.cap) out += ` stroke-linecap="${attr(paint.cap)}"`;
    if (paint.join) out += ` stroke-linejoin="${attr(paint.join)}"`;
  }
  if (paint.alpha !== undefined && paint.alpha < 1) out += ` opacity="${n(paint.alpha)}"`;
  if (paint.blend && paint.blend !== "normal") out += ` style="mix-blend-mode:${attr(paint.blend)}"`;
  return out;
}

function gradientElement(g: Gradient, id: string): string {
  const stops = g.stops.map(([o, c]) => `<stop offset="${n(o)}" stop-color="${attr(c)}"/>`).join("");
  return g.type === "linear"
    ? `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n(g.x1)}" y1="${n(g.y1)}" x2="${n(g.x2)}" y2="${n(g.y2)}">${stops}</linearGradient>`
    : `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n(g.x)}" cy="${n(g.y)}" r="${n(g.r)}">${stops}</radialGradient>`;
}

export interface SvgOptions {
  width: number;
  height: number;
  grain: number;
  seed: number;
  title?: string;
}

export function renderSvg(ops: Op[], options: SvgOptions): string {
  const { width, height, grain } = options;
  const defs: string[] = [];
  const ids = new Map<Gradient, string>();
  const gradientId = (g: Gradient): string => {
    let id = ids.get(g);
    if (!id) {
      id = `g${ids.size}`;
      ids.set(g, id);
      defs.push(gradientElement(g, id));
    }
    return id;
  };

  const body = ops.map((op) => shapeElement(op.shape, paintAttrs(op.paint, gradientId))).join("\n");

  let grainLayer = "";
  if (grain > 0) {
    defs.push(
      `<filter id="grain" x="0" y="0" width="100%" height="100%">` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${n(Math.abs(options.seed) % 10000)}" stitchTiles="stitch"/>` +
        `<feColorMatrix type="saturate" values="0"/></filter>`,
    );
    grainLayer = `\n<rect width="100%" height="100%" filter="url(#grain)" opacity="${n(grain)}" style="mix-blend-mode:multiply"/>`;
  }

  const title = options.title ? `<title>${escapeXml(options.title)}</title>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${n(width)}" height="${n(height)}" viewBox="0 0 ${n(width)} ${n(height)}">` +
    title +
    (defs.length ? `<defs>${defs.join("")}</defs>` : "") +
    `\n${body}${grainLayer}\n</svg>\n`
  );
}
