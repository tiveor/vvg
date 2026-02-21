import type { Drawable } from "../types.js";

export class Label implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private text: string,
    private font: string,
    private color: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
  }
}
