class vvg {
  constructor(context, canvas, width, height) {
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  drawFrame({
    width,
    height,
    borderUp,
    borderRight,
    borderDown,
    borderLeft,
    color,
    colorBorder,
    author,
  }) {
    const frame = new Frame(
      width,
      height,
      borderUp,
      borderRight,
      borderDown,
      borderLeft,
      color,
      colorBorder,
      author
    );
    frame.draw(this.ctx);
    this.frame = frame;
  }

  drawDot({ x, y, size, color }) {
    const dot = new Dot(x, y, size, color);
    dot.draw(this.ctx);
  }

  drawLine({ color, width, points }) {
    if (points.length !== 2) {
      throw new Error("A line needs 2 points");
    }

    const line = new Line(
      points[0].x,
      points[0].y,
      points[1].x,
      points[1].y,
      width,
      color
    );
    line.draw(this.ctx);
  }

  drawBezier({ color, points }) {
    if (points.length !== 4) {
      throw new Error("A bezzier needs 4 points");
    }

    const bezzier = new Bezzier(
      points[0].x,
      points[0].y,
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y,
      points[3].x,
      points[3].y,
      color
    );
    bezzier.draw(this.ctx);
  }

  drawPolygon({ color, points }) {
    const polygon = new Polygon(points, color);
    polygon.draw(this.ctx);
  }

  drawQuadrilateral({ color, points }) {
    const quadrilateral = new Quadrilateral(
      points[0].x,
      points[0].y,
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y,
      points[3].x,
      points[3].y,
      color
    );
    quadrilateral.draw(this.ctx);
  }

  drawBackground({ p1, p2, p3, p4, limit, bType, color }) {
    const background = new Background(p1, p2, p3, p4, limit, bType, color);
    background.draw(this.ctx);
  }

  drawEllispse({ x, y, size, color }) {
    const ellipse = new Ellipse(x, y, size, color);
    ellipse.draw(this.ctx);
  }

  drawLabel({ x, y, text, font, color }) {
    const label = new Label(x, y, text, font, color);
    label.draw(this.ctx);
  }

  drawStar({ cx, cy, spikes, outerRadius, innerRadius, color }) {
    const star = new Star(cx, cy, spikes, outerRadius, innerRadius, color);
    star.draw(this.ctx);
  }

  drawImage({ x, y, width, height, src }) {
    const image = new VImage(x, y, width, height, src);
    image.draw(this.ctx);
  }

  drawTree({ trunks, width, height, color, shadowColor }) {
    const trunk = new Tree(trunks, width, height, color, shadowColor);
    const that = this;

    trunk.draw(this.canvas, function () {
      for (var i = 0; i < trunk.snakes.length; i++) {
        for (var j = 0; j < trunk.snakes[i].collection.snakes.length; j++) {
          const point = trunk.snakes[i].collection.snakes[j];

          Gen.generate(10, 10, function () {
            const size = Randomizer.random(8, 10);
            that.drawImage({
              x: Randomizer.randref(point.x, 80),
              y: Randomizer.randref(point.y, 80),
              width: size,
              height: size,
              src: "assets/leaf_green.svg",
            });
          });

          Gen.generate(10, 50, function () {
            const size = Randomizer.random(10, 15);
            that.drawImage({
              x: Randomizer.randref(point.x, 120),
              y: Randomizer.randref(point.y, 120),
              width: size,
              height: size,
              src: "assets/leaf_purple.svg",
              //src: "assets/leaf_white.svg",
            });
          });
        }
      }
    });
  }

  drawGrass() {
    const that = this;
    const r = new Randomizer(18, 18, this.width - 18, this.height - 63);
    Gen.generate(10, 400, function () {
      const size = Randomizer.random(10, 40);
      that.drawImage({
        x: r.randInsideX(),
        y: that.height - 63 - size,
        width: size,
        height: size,
        src: "assets/grass.svg",
      });
    });
  }

  example1() {
    this.drawFrame({
      width: this.width,
      height: this.height,
      borderUp: 10,
      borderDown: 50,
      borderRight: 10,
      borderLeft: 10,
      color: "#222222",
      colorBorder: "white",
      author: "VVG a Random Painter - Free Drawing",
    });

    this.drawBackground({
      p1: this.height / 2,
      p2: this.height / 3,
      p3: this.height / 4,
      p4: this.height / 3,
      limit: this.width,
      bType: backgroundType.HORIZONTAL,
      color: Colorizer.randColor(),
    });

    this.drawQuadrilateral({
      points: [
        { x: 400, y: 400 },
        { x: 400, y: 500 },
        { x: 500, y: 500 },
        { x: 500, y: 400 },
      ],
      color: "yellow",
    });

    this.drawBezier({
      points: [
        { x: 0, y: 0 },
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 500 },
      ],
      color: "#FF0000",
    });

    this.drawPolygon({
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 60, y: 60 },
        { x: 10, y: 90 },
        { x: 20, y: 70 },
      ],
      color: "#00FF00",
    });

    this.drawDot({
      x: this.width / 2,
      y: this.height / 2,
      size: 5,
      color: "purple",
    });

    this.drawLine({
      points: [
        { x: 0, y: 0 },
        { x: this.width / 2, y: this.height / 2 },
      ],
      width: 5,
      color: "#0000FF",
    });

    this.drawEllispse({
      x: this.width / 3,
      y: this.height / 3,
      size: 50,
      color: "brown",
    });

    this.drawLabel({
      x: (this.width * 3) / 4,
      y: (this.height * 3) / 4,
      text: "BIBIYI is GUD",
      font: "50px Verdana",
      color: "orange",
    });

    this.drawStar({
      cx: 200,
      cy: 300,
      spikes: 5,
      outerRadius: 30,
      innerRadius: 15,
      color: "skyblue",
    });

    this.drawImage({
      x: 300,
      y: 300,
      width: 50,
      height: 50,
      src: "assets/leaf.svg",
    });
  }

  example2() {
    this.drawFrame({
      width: this.width,
      height: this.height,
      borderUp: 18,
      borderDown: 63,
      borderRight: 18,
      borderLeft: 18,
      color: "#333333",
      colorBorder: "white",
      author: "VVG a Random Painter - Bolivian Party",
    });

    const r = new Randomizer(18, 18, this.width - 18, this.height - 63);
    const c = new Colorizer(palleteType.PALETTE_BOLIVIA);

    Gen.generate(100, 300, () => {
      this.drawEllispse({
        x: r.randInsideX(),
        y: r.randInsideY(),
        size: Randomizer.random(5, 25),
        color: c.rand(),
      });
    });

    Gen.generate(100, 500, () => {
      this.drawStar({
        cx: r.randInsideX(),
        cy: r.randInsideY(),
        spikes: Randomizer.random(5, 10),
        outerRadius: Randomizer.random(10, 15),
        innerRadius: Randomizer.random(15, 20),
        color: c.rand(),
      });
    });
  }

  example3() {
    this.drawFrame({
      width: this.width,
      height: this.height,
      borderUp: 18,
      borderDown: 63,
      borderRight: 18,
      borderLeft: 18,
      color: "lightblue",
      colorBorder: "white",
      author: "VVG a Random Painter - Jacaranda",
    });

    this.drawTree({
      trunks: 5,
      width: this.width - 18 - 18,
      height: this.height - 18 - 63,
      color: "#8e4d16",
      shadowColor: "#663002",
    });

    this.drawGrass();
  }

  example4() {
    const borderUp = 18;
    const borderDown = 63;
    const borderRight = 18;
    const borderLeft = 18;

    this.drawFrame({
      width: this.width,
      height: this.height,
      borderUp: borderUp,
      borderDown: borderDown,
      borderRight: borderRight,
      borderLeft: borderLeft,
      color: "lightblue",
      colorBorder: "white",
      author: "VVG a Random Painter - Aviary",
    });

    const r = new Randomizer(
      borderLeft,
      borderUp,
      this.width - borderRight,
      this.height - borderDown
    );

    const that = this;
    Gen.generate(1, 3, function () {
      that.drawBackground({
        p1: r.randInsideY(),
        p2: r.randInsideY(),
        p3: r.randInsideY(),
        p4: r.randInsideY(),
        limit: that.width,
        bType: backgroundType.HORIZONTAL,
        color: Colorizer.randColor(),
      });
    });

    Gen.generate(500, 1000, function () {
      that.drawDot({
        x: r.randInsideX(),
        y: r.randInsideY(),
        size: 1,
        color: Colorizer.randColor(),
      });
    });

    Gen.generate(100, 500, function () {
      const size = Randomizer.random(10, 25);
      that.drawEllispse({
        x: r.randInsideX(),
        y: r.randInsideY(),
        size: size,
        color: Colorizer.randColor(),
      });
    });

    const DRAW_MAX_SIZE = 25;

    Gen.generate(1000, 2000, function () {
      let x1 = r.randInsideX();
      let y1 = r.randInsideY();
      let x2 = r.randXref(x1, DRAW_MAX_SIZE);
      let y2 = r.randYref(y1, DRAW_MAX_SIZE);
      let x3 = r.randXref(x2, DRAW_MAX_SIZE);
      let y3 = r.randYref(y2, DRAW_MAX_SIZE);
      let x4 = r.randXref(x3, DRAW_MAX_SIZE);
      let y4 = r.randYref(y3, DRAW_MAX_SIZE);

      that.drawBezier({
        points: [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x3, y: y3 },
          { x: x4, y: y4 },
        ],
        color: Colorizer.randColor(),
      });
    });

    Gen.generate(100, 500, function () {
      let points = [];
      const x1 = r.randInsideX();
      const y1 = r.randInsideY();
      points.push({ x: x1, y: y1 });

      for (var i = 0; i < Randomizer.random(10, 20); i++) {
        points.push({
          x: r.randXref(x1, DRAW_MAX_SIZE),
          y: r.randYref(y1, DRAW_MAX_SIZE),
        });
      }

      that.drawPolygon({
        points: points,
        color: Colorizer.randColor(),
      });
    });

    Gen.generate(100, 500, function () {
      const x1 = r.randInsideX();
      const y1 = r.randInsideY();

      that.drawLine({
        points: [
          { x: x1, y: y1 },
          {
            x: r.randXref(x1, DRAW_MAX_SIZE),
            y: r.randYref(y1, DRAW_MAX_SIZE),
          },
        ],
        width: Randomizer.random(1, 3),
        color: Colorizer.randColor(),
      });
    });
  }
}
