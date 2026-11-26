export type Color = string;

export interface Point {
  x: number;
  y: number;
}

export type GradientStop = readonly [offset: number, color: Color];

export type Gradient =
  | { type: "linear"; x1: number; y1: number; x2: number; y2: number; stops: GradientStop[] }
  | { type: "radial"; x: number; y: number; r: number; stops: GradientStop[] };

export type Fill = Color | Gradient;

export type Blend = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten";

/** How a shape is painted. Omit `fill` and `stroke` and nothing is drawn. */
export interface Paint {
  fill?: Fill;
  stroke?: Color;
  /** Stroke width. */
  width?: number;
  /** Opacity, 0–1. */
  alpha?: number;
  cap?: "butt" | "round" | "square";
  join?: "miter" | "round" | "bevel";
  blend?: Blend;
}

export type PathCommand =
  | ["M", number, number]
  | ["L", number, number]
  | ["Q", number, number, number, number]
  | ["C", number, number, number, number, number, number]
  | ["Z"];

export type Shape =
  | { type: "rect"; x: number; y: number; w: number; h: number }
  | { type: "circle"; x: number; y: number; r: number }
  | { type: "ellipse"; x: number; y: number; rx: number; ry: number; rotation: number }
  /** Pie slice from `start` to `end` (radians, clockwise on screen). */
  | { type: "wedge"; x: number; y: number; r: number; start: number; end: number }
  | { type: "path"; d: PathCommand[] }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      size: number;
      font: string;
      align: "start" | "middle" | "end";
    };

/** One drawing operation: the scene is a flat list of these. */
export interface Op {
  shape: Shape;
  paint: Paint;
}

export interface Palette {
  name: string;
  /** Canvas / paper color. */
  background: Color;
  /** Dark color for lines, outlines and text. */
  ink: Color;
  colors: Color[];
}
