import type { Drawable, Point } from "../types.js";

export class Bezier implements Drawable {
  constructor(
    private points: [Point, Point, Point, Point],
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    const [start, cp1, cp2, end] = this.points;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }
}
