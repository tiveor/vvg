import type { Drawable } from "../types.js";

export class VImage implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private src: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    const img = new Image();
    img.src = this.src;
    img.onload = () => {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    };
  }
}
