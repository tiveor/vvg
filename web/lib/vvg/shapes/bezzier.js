class Bezzier {
  constructor(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.x4 = x4;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.y4 = y4;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }
}
