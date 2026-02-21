/**
 * Snake algorithm for generative tree branches.
 * Based on Kenneth Jorgensen's canvas trees (http://kennethjorgensen.com/blog/2014/canvas-trees)
 * Modified by Alvaro Orellana - rewritten in TypeScript.
 */

export class Snake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
  fillStyle: string;
  shadowColor: string;
  shadowBlur: number;
  generation: number;
  lifespan: number;
  totalDistance: number;
  distance: number;
  collection: SnakeCollection | null = null;

  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    shadowColor: string,
  ) {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.x = width / 2;
    this.y = height;
    this.radius = 10;
    this.speed = width / 500;
    this.angle = Math.PI / 2;
    this.fillStyle = color;
    this.shadowColor = shadowColor;
    this.shadowBlur = 2;
    this.generation = 0;
    this.lifespan = 0;
    this.totalDistance = 0;
    this.distance = 0;
  }

  next(): void {
    this.render();
    this.iterate();
    this.randomize();
    this.split();
    this.lifespan++;
    this.die();
  }

  private render(): void {
    this.ctx.save();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.shadowColor = this.shadowColor;
    this.ctx.shadowBlur = this.shadowBlur;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  private iterate(): void {
    const lastX = this.x;
    const lastY = this.y;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * -Math.sin(this.angle);
    this.radius *= 0.99 - this.generation / 250;
    const deltaDistance = Math.sqrt(
      Math.abs(lastX - this.x) + Math.abs(lastY - this.y),
    );
    this.distance += deltaDistance;
    this.totalDistance += deltaDistance;
    if (this.speed > this.radius * 2) {
      this.speed = this.radius * 2;
    }
  }

  private randomize(): void {
    this.angle += Math.random() / 5 - 1 / 5 / 2;
  }

  private split(): void {
    if (!this.collection) return;

    let splitChance = 0;
    if (this.generation === 0) {
      splitChance = (this.distance - this.canvasHeight / 5) / 100;
    } else if (this.generation < 3) {
      splitChance = (this.distance - this.canvasHeight / 10) / 100;
    }

    if (Math.random() < splitChance) {
      const n = 2 + Math.round(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        const snake = new Snake(
          this.ctx,
          this.canvasWidth,
          this.canvasHeight,
          this.fillStyle,
          this.shadowColor,
        );
        snake.x = this.x;
        snake.y = this.y;
        snake.angle = this.angle;
        snake.speed = this.speed;
        snake.radius = this.radius * 0.9;
        snake.generation = this.generation + 1;
        snake.fillStyle = this.fillStyle;
        snake.shadowColor = this.shadowColor;
        snake.shadowBlur = this.shadowBlur;
        snake.totalDistance = this.totalDistance;
        this.collection.add(snake);
      }
      this.collection.remove(this);
    }
  }

  private die(): void {
    if (this.radius < 0.2) {
      this.collection?.remove(this);
    }
  }
}

export class SnakeCollection {
  snakes: Snake[] = [];

  next(): void {
    const current = [...this.snakes];
    for (const snake of current) {
      snake.next();
    }
  }

  add(snake: Snake): void {
    this.snakes.push(snake);
    snake.collection = this;
  }

  remove(snake: Snake): void {
    const index = this.snakes.indexOf(snake);
    if (index !== -1) {
      this.snakes.splice(index, 1);
    }
  }
}
