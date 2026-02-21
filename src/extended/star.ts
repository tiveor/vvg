import type { Drawable, Point } from "../types.js";
import { Polygon } from "../shapes/polygon.js";

export class Star implements Drawable {
  private polygon: Polygon;

  constructor(
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    color: string,
  ) {
    const points = Star.calculatePoints(cx, cy, spikes, outerRadius, innerRadius);
    this.polygon = new Polygon(points, color);
  }

  private static calculatePoints(
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ): Point[] {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    const points: Point[] = [{ x: cx, y: cy - outerRadius }];

    for (let i = 0; i < spikes; i++) {
      points.push({
        x: cx + Math.cos(rot) * outerRadius,
        y: cy + Math.sin(rot) * outerRadius,
      });
      rot += step;

      points.push({
        x: cx + Math.cos(rot) * innerRadius,
        y: cy + Math.sin(rot) * innerRadius,
      });
      rot += step;
    }

    points.push({ x: cx, y: cy - outerRadius });
    return points;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.polygon.draw(ctx);
  }
}
