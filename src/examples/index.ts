import type { VVG } from "../index.js";
import { BackgroundType } from "../types.js";
import { Randomizer, generate } from "../utils/randomizer.js";
import { Colorizer } from "../utils/colorizer.js";
import { PaletteType } from "../utils/palettes.js";

export function example1(vvg: VVG): void {
  vvg.drawFrame({
    width: vvg.width,
    height: vvg.height,
    borderUp: 10,
    borderDown: 50,
    borderRight: 10,
    borderLeft: 10,
    color: "#222222",
    colorBorder: "white",
    author: "VVG a Random Painter - Free Drawing",
  });

  vvg.drawBackground({
    p1: vvg.height / 2,
    p2: vvg.height / 3,
    p3: vvg.height / 4,
    p4: vvg.height / 3,
    limit: vvg.width,
    type: BackgroundType.HORIZONTAL,
    color: Colorizer.randColor(),
  });

  vvg.drawQuadrilateral({
    points: [
      { x: 400, y: 400 },
      { x: 400, y: 500 },
      { x: 500, y: 500 },
      { x: 500, y: 400 },
    ],
    color: "yellow",
  });

  vvg.drawBezier({
    points: [
      { x: 0, y: 0 },
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 500 },
    ],
    color: "#FF0000",
  });

  vvg.drawPolygon({
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

  vvg.drawDot({
    x: vvg.width / 2,
    y: vvg.height / 2,
    size: 5,
    color: "purple",
  });

  vvg.drawLine({
    points: [
      { x: 0, y: 0 },
      { x: vvg.width / 2, y: vvg.height / 2 },
    ],
    width: 5,
    color: "#0000FF",
  });

  vvg.drawEllipse({
    x: vvg.width / 3,
    y: vvg.height / 3,
    size: 50,
    color: "brown",
  });

  vvg.drawLabel({
    x: (vvg.width * 3) / 4,
    y: (vvg.height * 3) / 4,
    text: "BIBIYI is GUD",
    font: "50px Verdana",
    color: "orange",
  });

  vvg.drawStar({
    cx: 200,
    cy: 300,
    spikes: 5,
    outerRadius: 30,
    innerRadius: 15,
    color: "skyblue",
  });

  vvg.drawImage({
    x: 300,
    y: 300,
    width: 50,
    height: 50,
    src: "assets/leaf.svg",
  });
}

export function example2(vvg: VVG): void {
  vvg.drawFrame({
    width: vvg.width,
    height: vvg.height,
    borderUp: 18,
    borderDown: 63,
    borderRight: 18,
    borderLeft: 18,
    color: "#333333",
    colorBorder: "white",
    author: "VVG a Random Painter - Bolivian Party",
  });

  const r = new Randomizer(18, 18, vvg.width - 18, vvg.height - 63);
  const c = new Colorizer(PaletteType.PALETTE_BOLIVIA);

  generate(100, 300, () => {
    vvg.drawEllipse({
      x: r.randInsideX(),
      y: r.randInsideY(),
      size: Randomizer.random(5, 25),
      color: c.rand(),
    });
  });

  generate(100, 500, () => {
    vvg.drawStar({
      cx: r.randInsideX(),
      cy: r.randInsideY(),
      spikes: Randomizer.random(5, 10),
      outerRadius: Randomizer.random(10, 15),
      innerRadius: Randomizer.random(15, 20),
      color: c.rand(),
    });
  });
}

export function example3(vvg: VVG, finished: () => void): void {
  vvg.drawFrame({
    width: vvg.width,
    height: vvg.height,
    borderUp: 18,
    borderDown: 63,
    borderRight: 18,
    borderLeft: 18,
    color: "lightblue",
    colorBorder: "white",
    author: "VVG a Random Painter - Jacaranda",
  });

  vvg.drawTree(
    {
      trunks: 5,
      width: vvg.width - 18 - 18,
      height: vvg.height - 18 - 63,
      color: "#8e4d16",
      shadowColor: "#663002",
    },
    finished,
  );

  vvg.drawGrass();
}

export function example4(vvg: VVG): void {
  const borderUp = 18;
  const borderDown = 63;
  const borderRight = 18;
  const borderLeft = 18;

  vvg.drawFrame({
    width: vvg.width,
    height: vvg.height,
    borderUp,
    borderDown,
    borderRight,
    borderLeft,
    color: "lightblue",
    colorBorder: "white",
    author: "VVG a Random Painter - Aviary",
  });

  const r = new Randomizer(
    borderLeft,
    borderUp,
    vvg.width - borderRight,
    vvg.height - borderDown,
  );

  const DRAW_MAX_SIZE = 25;

  generate(1, 3, () => {
    vvg.drawBackground({
      p1: r.randInsideY(),
      p2: r.randInsideY(),
      p3: r.randInsideY(),
      p4: r.randInsideY(),
      limit: vvg.width,
      type: BackgroundType.HORIZONTAL,
      color: Colorizer.randColor(),
    });
  });

  generate(500, 1000, () => {
    vvg.drawDot({
      x: r.randInsideX(),
      y: r.randInsideY(),
      size: 1,
      color: Colorizer.randColor(),
    });
  });

  generate(100, 500, () => {
    vvg.drawEllipse({
      x: r.randInsideX(),
      y: r.randInsideY(),
      size: Randomizer.random(10, 25),
      color: Colorizer.randColor(),
    });
  });

  generate(1000, 2000, () => {
    const x1 = r.randInsideX();
    const y1 = r.randInsideY();
    const x2 = r.randXRef(x1, DRAW_MAX_SIZE);
    const y2 = r.randYRef(y1, DRAW_MAX_SIZE);
    const x3 = r.randXRef(x2, DRAW_MAX_SIZE);
    const y3 = r.randYRef(y2, DRAW_MAX_SIZE);
    const x4 = r.randXRef(x3, DRAW_MAX_SIZE);
    const y4 = r.randYRef(y3, DRAW_MAX_SIZE);

    vvg.drawBezier({
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
        { x: x4, y: y4 },
      ],
      color: Colorizer.randColor(),
    });
  });

  generate(100, 500, () => {
    const x1 = r.randInsideX();
    const y1 = r.randInsideY();
    const points = [{ x: x1, y: y1 }];

    for (let i = 0; i < Randomizer.random(10, 20); i++) {
      points.push({
        x: r.randXRef(x1, DRAW_MAX_SIZE),
        y: r.randYRef(y1, DRAW_MAX_SIZE),
      });
    }

    vvg.drawPolygon({
      points,
      color: Colorizer.randColor(),
    });
  });

  generate(100, 500, () => {
    const x1 = r.randInsideX();
    const y1 = r.randInsideY();

    vvg.drawLine({
      points: [
        { x: x1, y: y1 },
        {
          x: r.randXRef(x1, DRAW_MAX_SIZE),
          y: r.randYRef(y1, DRAW_MAX_SIZE),
        },
      ],
      width: Randomizer.random(1, 3),
      color: Colorizer.randColor(),
    });
  });
}
