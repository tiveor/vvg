import type { Painter } from "./painter.js";

export interface Style {
  name: string;
  /** One line shown in `vvg --list` and the playground. */
  description: string;
  /** Palettes this style looks best with; used when the seed picks one. */
  palettes?: string[];
  /** Grain amount that suits the style (0–1). */
  grain?: number;
  draw(p: Painter): void;
}

export const styles: Record<string, Style> = {};

/** Names become object keys, so keys that reach Object.prototype are refused. */
export function assertName(name: unknown, kind: string): asserts name is string {
  if (typeof name !== "string" || !/^[a-z0-9][a-z0-9_-]{0,39}$/i.test(name) || ["__proto__", "constructor", "prototype"].includes(name)) {
    throw new Error(`vvg: invalid ${kind} name ${JSON.stringify(name)}: use letters, digits, - or _`);
  }
}

/** Registers a style so it can be used by name (`paint({ style: name })`). */
export function defineStyle(style: Style): Style {
  assertName(style.name, "style");
  if (typeof style.draw !== "function") throw new Error("vvg: a style needs a draw(p) function");
  styles[style.name] = style;
  return style;
}

export const styleNames = (): string[] => Object.keys(styles);

export function getStyle(name: string): Style {
  const found = Object.prototype.hasOwnProperty.call(styles, name) ? styles[name] : undefined;
  if (!found) {
    throw new Error(`vvg: unknown style "${name}". Try one of: ${styleNames().join(", ")}`);
  }
  return found;
}
