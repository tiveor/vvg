export class Randomizer {
  private minX: number;
  private minY: number;
  private maxX: number;
  private maxY: number;

  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomBool(): boolean {
    return Math.random() >= 0.5;
  }

  static randomAngle(): number {
    return Math.floor(Randomizer.random(0, 360)) * (Math.PI / 180);
  }

  static randomColorAttribute(): number {
    return Math.floor(Randomizer.random(0, 255));
  }

  static randRef(ref: number, gap: number): number {
    const side = Randomizer.randomBool();
    return Randomizer.random(ref, ref + (side ? gap : -gap));
  }

  randInsideX(): number {
    return Randomizer.random(this.minX, this.maxX);
  }

  randInsideY(): number {
    return Randomizer.random(this.minY, this.maxY);
  }

  randXRef(refX: number, gap: number): number {
    const side = Randomizer.randomBool();
    return Randomizer.random(refX, refX + (side ? gap : -gap));
  }

  randYRef(refY: number, gap: number): number {
    const side = Randomizer.randomBool();
    return Randomizer.random(refY, refY + (side ? gap : -gap));
  }
}

export function generate(min: number, max: number, execute: () => void): void {
  const times = Randomizer.random(min, max);
  for (let i = 0; i < times; i++) {
    execute();
  }
}
