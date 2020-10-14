class Polygon {
  constructor(points, color) {
    this.points = points;
    this.color = color;
  }

  draw(ctx) {
    if (this.points.length < 3) {
      throw new Error("A polygon needs 3 points at least");
    }

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.fillStyle = this.color;
    ctx.closePath();
    ctx.fill();
  }
}
