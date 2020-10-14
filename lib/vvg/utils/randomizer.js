const DRAW_MAX_SIZE = 25;

class Randomizer {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return parseInt(Randomizer.random(min, max));
  }

  static randomBool = () => {
    return Math.random() >= 0.5;
  };

  randInsideX = () => {
    return Randomizer.random(0, this.maxX);
  };

  static randref = (refX, gap) => {
    const side = Randomizer.randomBool();
    return Randomizer.random(refX, refX + (side ? gap : -gap));
  };

  randXref = (refX, gap) => {
    const side = Randomizer.randomBool();
    return Randomizer.random(refX, refX + (side ? gap : -gap));
  };

  randInsideY = () => {
    return Randomizer.random(0, this.maxY);
  };

  randYref = (refY, gap) => {
    const side = Randomizer.randomBool();
    return Randomizer.random(refY, refY + (side ? gap : -gap));
  };

  static randInsideBoxX = (maxWidth) => {
    return Randomizer.random(0, this.maxX - maxWidth);
  };

  static randInsideBoxY = (maxHeight) => {
    return Randomizer.random(0, this.maxY - maxHeight);
  };

  static randomAngle = () => {
    return parseInt(Randomizer.random(0, 360)) * (Math.PI / 180);
  };

  static randAttibuteColor = () => {
    return Randomizer.random(0, 255);
  };
}
