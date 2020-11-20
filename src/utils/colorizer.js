const Randomizer = require("./randomizer.js");
const { COLORS } = require("./colorizer.data.js");
const { palleteType } = require("../enums/pallettype.js");

class Colorizer {
  constructor(paletteType) {
    this.paletteType = paletteType;
  }

  getPallete() {
    switch (this.paletteType) {
      case palleteType.PALETTE_1:
        return COLORS.PALLETE_1;
      case palleteType.PALETTE_2:
        return COLORS.PALLETE_2;
      case palleteType.PALETTE_FABER:
        return COLORS.PALLETE_FABER_CASTELL;
      case palleteType.PALETTE_BOLIVIA:
        return COLORS.PALLETE_BOLIVIA;
      case palleteType.PALETTE_WHIPALA:
        return COLORS.PALLETE_WHIPALA;
      default:
        return COLORS.PALLETE_1;
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
    const color = `rgb(${r},${g},${b})`;
    return color;
  };

  static randColorA = () => {
    const r = Randomizer.randAttibuteColor();
    const g = Randomizer.randAttibuteColor();
    const b = Randomizer.randAttibuteColor();
    const a = Randomizer.random(0.75, 1);
    const color = `rgba(${r},${g},${b},${a})`;
    return color;
  };
}
module.exports = Colorizer;
