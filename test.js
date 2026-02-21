import { VVG, example4 } from "./dist/index.js";
import { createCanvas } from "canvas";

const canvas = createCanvas(1024, 768);
const painter = new VVG(canvas);

// Example 4: Aviary
example4(painter);
await painter.saveToFile("example4.png");
