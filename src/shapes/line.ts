import type { Drawable, Point } from "../types.js";

export class Line implements Drawable {
  constructor(
    private from: Point,
    private to: Point,
    private width: number,
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}
