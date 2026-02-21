import type { Drawable } from "../types.js";

export class Ellipse implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private size: number,
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 2 * Math.PI, true);
    ctx.fill();
  }
}
