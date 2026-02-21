import type { Drawable } from "../types.js";
import { BackgroundType } from "../types.js";
import { Quadrilateral } from "../shapes/quadrilateral.js";

export class Background implements Drawable {
  private quadrilateral: Quadrilateral;

  constructor(
    p1: number,
    p2: number,
    p3: number,
    p4: number,
    limit: number,
    type: BackgroundType,
    color: string,
  ) {
    this.quadrilateral =
      type === BackgroundType.HORIZONTAL
        ? new Quadrilateral(
            [
              { x: 0, y: p1 },
              { x: 0, y: p2 },
              { x: limit, y: p3 },
              { x: limit, y: p4 },
            ],
            color,
          )
        : new Quadrilateral(
            [
              { x: p1, y: 0 },
              { x: p2, y: 0 },
              { x: p3, y: limit },
              { x: p4, y: limit },
            ],
            color,
          );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.quadrilateral.draw(ctx);
  }
}
