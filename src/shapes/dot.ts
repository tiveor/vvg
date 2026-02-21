import type { Drawable } from "../types.js";

export class Dot implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private size: number,
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
