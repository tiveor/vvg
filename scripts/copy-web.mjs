// Makes the freshly built library available to the playground (web/vvg.js).
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.js", "web/vvg.js");
