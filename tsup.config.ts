import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "VVG",
  dts: true,
  clean: true,
  splitting: false,
  outDir: "dist",
});
