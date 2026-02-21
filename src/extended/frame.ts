import type { Drawable } from "../types.js";
import { Label } from "./label.js";

export class Frame implements Drawable {
  constructor(
    private width: number,
    private height: number,
    private borderUp: number,
    private borderRight: number,
    private borderDown: number,
    private borderLeft: number,
    private color: string,
    private colorBorder: string,
    private author?: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.colorBorder;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(
      this.borderLeft,
      this.borderUp,
      this.width - this.borderLeft - this.borderRight,
      this.height - this.borderUp - this.borderDown,
    );
    ctx.fill();
    this.drawAuthor(ctx);
    ctx.clip();
  }

  private drawAuthor(ctx: CanvasRenderingContext2D): void {
    if (!this.author) return;

    ctx.direction = "rtl";
    const label = new Label(
      this.width - this.borderRight,
      this.height - this.borderDown / 2,
      this.author,
      "14px Helvetica",
      "#555555",
    );
    label.draw(ctx);
  }
}
