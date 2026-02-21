import { Randomizer } from "./randomizer.js";
import { PALETTES, PaletteType } from "./palettes.js";

export class Colorizer {
  private paletteType: PaletteType;

  constructor(paletteType: PaletteType) {
    this.paletteType = paletteType;
  }

  getPalette(): string[] {
    return PALETTES[this.paletteType] ?? PALETTES[PaletteType.PALETTE_1];
  }

  rand(): string {
    const palette = this.getPalette();
    const index = Math.floor(Randomizer.random(0, palette.length));
    return palette[index];
  }

  static randColor(): string {
    const r = Randomizer.randomColorAttribute();
    const g = Randomizer.randomColorAttribute();
    const b = Randomizer.randomColorAttribute();
    return `rgb(${r},${g},${b})`;
  }

  static randColorAlpha(): string {
    const r = Randomizer.randomColorAttribute();
    const g = Randomizer.randomColorAttribute();
    const b = Randomizer.randomColorAttribute();
    const a = Randomizer.random(0.75, 1);
    return `rgba(${r},${g},${b},${a})`;
  }
}
