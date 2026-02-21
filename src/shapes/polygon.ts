import type { Drawable, Point } from "../types.js";

export class Polygon implements Drawable {
  constructor(
    private points: Point[],
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 3) {
      throw new Error("A polygon needs at least 3 points");
    }

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }
}
