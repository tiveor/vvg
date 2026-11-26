import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs", "iife"],
    globalName: "VVG",
    dts: true,
    clean: true,
    minify: false,
    sourcemap: false,
    target: "es2020",
    outDir: "dist",
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    target: "node20",
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
    define: { __VERSION__: JSON.stringify(version) },
    // Keep the optional native dependency out of the bundle.
    external: ["canvas"],
  },
]);
