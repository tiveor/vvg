import type { Drawable, Point } from "../types.js";

export class Quadrilateral implements Drawable {
  constructor(
    private points: [Point, Point, Point, Point],
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.lineTo(this.points[3].x, this.points[3].y);
    ctx.closePath();
    ctx.fill();
  }
}
