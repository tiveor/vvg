import type { Palette } from "./types.js";
import { assertName } from "./style.js";

const palette = (name: string, background: string, ink: string, colors: string[]): Palette => ({
  name,
  background,
  ink,
  colors,
});

/** Curated palettes. The first five come from the original VVG. */
export const palettes: Record<string, Palette> = Object.fromEntries(
  [
    palette("bolivia", "#f3eee3", "#1d1b18", ["#da291c", "#f4c400", "#007a33", "#1d1b18"]),
    palette("whipala", "#f5f1e8", "#1c1c1c", [
      "#007934", "#0032a0", "#753bbd", "#da291c", "#ff6720", "#f9e300",
    ]),
    palette("faber", "#f4efe4", "#1a1b11", [
      "#f0d20b", "#fe7102", "#cc0303", "#983e7a", "#39b0ea", "#014e90", "#0d9715", "#8a3606",
    ]),
    palette("earth", "#e9e1d3", "#3b2f2a", [
      "#aa8076", "#9d7a58", "#846d67", "#ab9378", "#a68e55", "#9f6555", "#c2bb8c", "#aa9f43",
    ]),
    palette("vivid", "#f2ece4", "#2a1d17", [
      "#e69373", "#bf5830", "#77d36a", "#43bf30", "#557aaa", "#306ebf", "#805240", "#488040",
    ]),
    palette("jacaranda", "#f2ece6", "#3a2c2b", [
      "#6a3d9a", "#8b5fbf", "#a77bd6", "#c7a6e8", "#e3d3f2", "#d98bb3",
    ]),
    palette("mondrian", "#f1ede3", "#141414", ["#d62828", "#1d4e9e", "#f6c90e"]),
    palette("bauhaus", "#ede4d3", "#1b1b1b", ["#e63946", "#1d3557", "#f4a261", "#2a9d8f", "#e9c46a"]),
    palette("matisse", "#f6efe0", "#121212", ["#1f4bb8", "#e94f37", "#f5b700", "#0a8754", "#f29ca3"]),
    palette("sunset", "#241734", "#120b1c", ["#ff6b6b", "#feca57", "#ff9ff3", "#ee5253", "#ff9f43"]),
    palette("ocean", "#0b1d2a", "#061019", ["#1b4965", "#5fa8d3", "#cae9ff", "#62b6cb", "#bee9e8"]),
    palette("forest", "#e8e3d3", "#1f2b24", ["#2d4a3e", "#4f7a5a", "#8aa36b", "#c9b77c", "#a0522d"]),
    palette("desert", "#f1e3cf", "#2e2420", ["#c1440e", "#e08e45", "#f2c57c", "#7d5a50", "#3c6e71"]),
    palette("nordic", "#eceff1", "#2e3440", ["#2e3440", "#5e81ac", "#88c0d0", "#bf616a", "#ebcb8b"]),
    palette("noir", "#f2efe8", "#111111", ["#111111", "#3d3d3d", "#7a7a7a", "#b5b5b5", "#d64933"]),
    palette("neon", "#0c0b12", "#000000", ["#ff2e88", "#00e5ff", "#f9f871", "#7b61ff", "#00ff9c"]),
    palette("candy", "#fff4f6", "#3d2b3d", ["#ff8fab", "#fb6f92", "#8ecae6", "#ffd166", "#b8c0ff"]),
  ].map((p) => [p.name, p]),
);

export const paletteNames = (): string[] => Object.keys(palettes);

export function getPalette(name: string): Palette {
  const found = Object.prototype.hasOwnProperty.call(palettes, name) ? palettes[name] : undefined;
  if (!found) {
    throw new Error(`vvg: unknown palette "${name}". Try one of: ${paletteNames().join(", ")}`);
  }
  return found;
}

/** Registers a custom palette so it can be used by name. */
export function definePalette(p: Palette): Palette {
  assertName(p.name, "palette");
  if (!Array.isArray(p.colors) || !p.colors.length) throw new Error("vvg: a palette needs at least one color");
  palettes[p.name] = p;
  return p;
}
