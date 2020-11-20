const backgroundType = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

class Background {
  constructor(p1, p2, p3, p4, limit, bType, color) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.limit = limit;
    this.bType = bType;
    this.color = color;
    this.quadrilateral =
      bType === backgroundType.HORIZONTAL
        ? this.createHorizontal()
        : this.createVertical();
  }

  createVertical() {
    return new Quadrilateral(
      this.p1,
      0,
      this.p2,
      0,
      this.p3,
      this.limit,
      this.p4,
      this.limit,
      this.color
    );
  }

  createHorizontal() {
    return new Quadrilateral(
      0,
      this.p1,
      0,
      this.p2,
      this.limit,
      this.p3,
      this.limit,
      this.p4,
      this.color
    );
  }

  draw(ctx) {
    this.quadrilateral.draw(ctx);
  }
}
