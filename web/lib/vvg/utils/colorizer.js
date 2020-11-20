const palleteType = {
  PALETTE_1: "PALETTE_1",
  PALETTE_2: "PALETTE_2",
  PALETTE_FABER: "PALETTE_FABER",
  PALETTE_BOLIVIA: "PALETTE_BOLIVIA",
  PALETTE_WHIPALA: "PALETTE_WHIPALA",
};

class Colorizer {
  constructor(paletteType) {
    this.paletteType = paletteType;
  }

  getPallete() {
    switch (this.paletteType) {
      case palleteType.PALETTE_1:
        return COLORS_PALLETE_1;
      case palleteType.PALETTE_2:
        return COLORS_PALLETE_2;
      case palleteType.PALETTE_FABER:
        return COLORS_PALLETE_FABER_CASTELL;
      case palleteType.PALETTE_BOLIVIA:
        return COLORS_PALLETE_BOLIVIA;
      case palleteType.PALETTE_WHIPALA:
        return COLORS_PALLETE_WHIPALA;
      default:
        return COLORS_PALLETE_1;
    }
  }

  rand = () => {
    const pallete = this.getPallete();
    const index = parseInt(Randomizer.random(0, pallete.length));
    return pallete[index];
  };

  static randColor = () => {
    const r = Randomizer.randAttibuteColor();
    const g = Randomizer.randAttibuteColor();
    const b = Randomizer.randAttibuteColor();
    return `rgb(${r},${g},${b})`;
  };

  static randColorA = () => {
    const r = Randomizer.randAttibuteColor();
    const g = Randomizer.randAttibuteColor();
    const b = Randomizer.randAttibuteColor();
    const a = Randomizer.random(0.75, 1);
    return `rgba(${r},${g},${b},${a})`;
  };
}
