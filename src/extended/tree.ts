import type { Drawable } from "../types.js";
import { Snake, SnakeCollection } from "./snake.js";

export class Tree implements Drawable {
  snakes: Snake[] = [];

  constructor(
    private trunks: number,
    private width: number,
    private height: number,
    private color: string,
    private shadowColor: string,
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    // Tree uses animation frames internally, draw() starts synchronously
  }

  animate(ctx: CanvasRenderingContext2D, finished: () => void): void {
    let frame = 0;
    const initialRadius = this.width / 50;
    const collection = new SnakeCollection();

    for (let i = 0; i < this.trunks; i++) {
      const snake = new Snake(
        ctx,
        this.width,
        this.height,
        this.color,
        this.shadowColor,
      );
      snake.x = this.width / 2 - initialRadius + (i * initialRadius * 2) / this.trunks;
      snake.radius = initialRadius;
      collection.add(snake);
      this.snakes.push(snake);
    }

    const intervalHandle = setInterval(() => {
      if (frame < 300) {
        collection.next();
        frame++;
      } else {
        finished();
        clearInterval(intervalHandle);
      }
    }, 1);
  }
}
