class Star {
  constructor(cx, cy, spikes, outerRadius, innerRadius, color) {
    this.cx = cx;
    this.cy = cy;
    this.spikes = spikes;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.color = color;
    this.createStar();
  }

  createStar() {
    var rot = (Math.PI / 2) * 3;
    var x = this.cx;
    var y = this.cy;
    var step = Math.PI / this.spikes;

    let points = [];
    points.push({ x: this.cx, y: this.cy - this.outerRadius });

    for (let i = 0; i < this.spikes; i++) {
      x = this.cx + Math.cos(rot) * this.outerRadius;
      y = this.cy + Math.sin(rot) * this.outerRadius;
      points.push({ x, y });
      rot += step;

      x = this.cx + Math.cos(rot) * this.innerRadius;
      y = this.cy + Math.sin(rot) * this.innerRadius;
      points.push({ x, y });
      rot += step;
    }

    points.push({ x: this.cx, y: this.cy - this.outerRadius });
    this.polygon = new Polygon(points, this.color);
  }

  draw(ctx) {
    this.polygon.draw(ctx);
  }
}
