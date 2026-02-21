export interface Point {
  x: number;
  y: number;
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface FrameOptions {
  width: number;
  height: number;
  borderUp: number;
  borderRight: number;
  borderDown: number;
  borderLeft: number;
  color: string;
  colorBorder: string;
  author?: string;
}

export interface DotOptions {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface LineOptions {
  points: [Point, Point];
  width: number;
  color: string;
}

export interface BezierOptions {
  points: [Point, Point, Point, Point];
  color: string;
}

export interface PolygonOptions {
  points: Point[];
  color: string;
}

export interface QuadrilateralOptions {
  points: [Point, Point, Point, Point];
  color: string;
}

export interface EllipseOptions {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface LabelOptions {
  x: number;
  y: number;
  text: string;
  font: string;
  color: string;
}

export interface StarOptions {
  cx: number;
  cy: number;
  spikes: number;
  outerRadius: number;
  innerRadius: number;
  color: string;
}

export interface ImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
}

export interface TreeOptions {
  trunks: number;
  width: number;
  height: number;
  color: string;
  shadowColor: string;
}

export enum BackgroundType {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export interface BackgroundOptions {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  limit: number;
  type: BackgroundType;
  color: string;
}
