import type { Color } from "./types.js";

type RGB = [number, number, number];

export function parseHex(hex: Color): RGB {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`vvg: expected a hex color, got "${hex}"`);
  const v = parseInt(h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

const toHex = ([r, g, b]: RGB): Color =>
  "#" + [r, g, b].map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, "0")).join("");

/** Linear mix between two hex colors; t = 0 → a, t = 1 → b. */
export function mix(a: Color, b: Color, t: number): Color {
  const x = parseHex(a);
  const y = parseHex(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

/** Relative luminance, 0 (black) – 1 (white). */
export function luminance(c: Color): number {
  const [r, g, b] = parseHex(c).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const isDark = (c: Color): boolean => luminance(c) < 0.18;
