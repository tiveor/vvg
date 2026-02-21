import type {
  FrameOptions,
  DotOptions,
  LineOptions,
  BezierOptions,
  PolygonOptions,
  QuadrilateralOptions,
  BackgroundOptions,
  EllipseOptions,
  LabelOptions,
  StarOptions,
  ImageOptions,
  TreeOptions,
} from "./types.js";

import { Frame } from "./extended/frame.js";
import { Background } from "./extended/background.js";
import { Label } from "./extended/label.js";
import { Star } from "./extended/star.js";
import { Tree } from "./extended/tree.js";

import { Dot } from "./shapes/dot.js";
import { Line } from "./shapes/line.js";
import { Ellipse } from "./shapes/ellipse.js";
import { Polygon } from "./shapes/polygon.js";
import { Quadrilateral } from "./shapes/quadrilateral.js";
import { Bezier } from "./shapes/bezier.js";
import { VImage } from "./shapes/image.js";

import { Randomizer, generate } from "./utils/randomizer.js";

export class VVG {
  readonly ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  private frame: Frame | null = null;

  constructor(private canvas: HTMLCanvasElement | OffscreenCanvas | any) {
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  drawFrame(options: FrameOptions): void {
    const frame = new Frame(
      options.width,
      options.height,
      options.borderUp,
      options.borderRight,
      options.borderDown,
      options.borderLeft,
      options.color,
      options.colorBorder,
      options.author,
    );
    frame.draw(this.ctx);
    this.frame = frame;
  }

  drawDot(options: DotOptions): void {
    new Dot(options.x, options.y, options.size, options.color).draw(this.ctx);
  }

  drawLine(options: LineOptions): void {
    new Line(options.points[0], options.points[1], options.width, options.color).draw(
      this.ctx,
    );
  }

  drawBezier(options: BezierOptions): void {
    new Bezier(options.points, options.color).draw(this.ctx);
  }

  drawPolygon(options: PolygonOptions): void {
    new Polygon(options.points, options.color).draw(this.ctx);
  }

  drawQuadrilateral(options: QuadrilateralOptions): void {
    new Quadrilateral(options.points, options.color).draw(this.ctx);
  }

  drawBackground(options: BackgroundOptions): void {
    new Background(
      options.p1,
      options.p2,
      options.p3,
      options.p4,
      options.limit,
      options.type,
      options.color,
    ).draw(this.ctx);
  }

  drawEllipse(options: EllipseOptions): void {
    new Ellipse(options.x, options.y, options.size, options.color).draw(this.ctx);
  }

  drawLabel(options: LabelOptions): void {
    new Label(options.x, options.y, options.text, options.font, options.color).draw(
      this.ctx,
    );
  }

  drawStar(options: StarOptions): void {
    new Star(
      options.cx,
      options.cy,
      options.spikes,
      options.outerRadius,
      options.innerRadius,
      options.color,
    ).draw(this.ctx);
  }

  drawImage(options: ImageOptions): void {
    new VImage(options.x, options.y, options.width, options.height, options.src).draw(
      this.ctx,
    );
  }

  drawTree(options: TreeOptions, finished: () => void): void {
    const tree = new Tree(
      options.trunks,
      options.width,
      options.height,
      options.color,
      options.shadowColor,
    );

    tree.animate(this.ctx, () => {
      for (const snake of tree.snakes) {
        if (!snake.collection) continue;
        for (const point of snake.collection.snakes) {
          generate(10, 10, () => {
            const size = Randomizer.random(8, 10);
            this.drawImage({
              x: Randomizer.randRef(point.x, 80),
              y: Randomizer.randRef(point.y, 80),
              width: size,
              height: size,
              src: "assets/leaf_green.svg",
            });
          });

          generate(10, 50, () => {
            const size = Randomizer.random(10, 15);
            this.drawImage({
              x: Randomizer.randRef(point.x, 120),
              y: Randomizer.randRef(point.y, 120),
              width: size,
              height: size,
              src: "assets/leaf_purple.svg",
            });
          });
        }
      }
      finished();
    });
  }

  drawGrass(): void {
    const r = new Randomizer(18, 18, this.width - 18, this.height - 63);
    generate(10, 400, () => {
      const size = Randomizer.random(10, 40);
      this.drawImage({
        x: r.randInsideX(),
        y: this.height - 63 - size,
        width: size,
        height: size,
        src: "assets/grass.svg",
      });
    });
  }

  async saveToFile(fileNamePath: string): Promise<void> {
    const fs = await import("fs");
    const path = await import("path");
    const fullPath = path.resolve(process.cwd(), fileNamePath);
    const out = fs.createWriteStream(fullPath);
    const stream = (this.canvas as any).createPNGStream();
    stream.pipe(out);
    return new Promise((resolve) => {
      out.on("finish", () => {
        console.log(`${fullPath} file was created.`);
        resolve();
      });
    });
  }
}

// Re-export everything useful
export { BackgroundType } from "./types.js";
export type {
  Point,
  Drawable,
  FrameOptions,
  DotOptions,
  LineOptions,
  BezierOptions,
  PolygonOptions,
  QuadrilateralOptions,
  EllipseOptions,
  LabelOptions,
  StarOptions,
  ImageOptions,
  TreeOptions,
  BackgroundOptions,
} from "./types.js";

export { Randomizer, generate } from "./utils/randomizer.js";
export { Colorizer } from "./utils/colorizer.js";
export { PaletteType, PALETTES } from "./utils/palettes.js";

export { Dot } from "./shapes/dot.js";
export { Line } from "./shapes/line.js";
export { Ellipse } from "./shapes/ellipse.js";
export { Polygon } from "./shapes/polygon.js";
export { Quadrilateral } from "./shapes/quadrilateral.js";
export { Bezier } from "./shapes/bezier.js";
export { VImage } from "./shapes/image.js";

export { Frame } from "./extended/frame.js";
export { Background } from "./extended/background.js";
export { Label } from "./extended/label.js";
export { Star } from "./extended/star.js";
export { Tree } from "./extended/tree.js";
export { Snake, SnakeCollection } from "./extended/snake.js";

export { example1, example2, example3, example4 } from "./examples/index.js";

export default VVG;
