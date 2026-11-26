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

/** Registers a style so it can be used by name (`paint({ style: name })`). */
export function defineStyle(style: Style): Style {
  styles[style.name] = style;
  return style;
}

export const styleNames = (): string[] => Object.keys(styles);

export function getStyle(name: string): Style {
  const found = styles[name];
  if (!found) {
    throw new Error(`vvg: unknown style "${name}". Try one of: ${styleNames().join(", ")}`);
  }
  return found;
}
