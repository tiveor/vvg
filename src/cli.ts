import { parseArgs } from "node:util";
import { writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { paint, paletteNames, styleNames, styles, palettes, randomSeed, type PaintOptions } from "./index.js";

const SIZES: Record<string, [number, number]> = {
  default: [1600, 1000],
  wallpaper: [2560, 1440],
  "4k": [3840, 2160],
  phone: [1179, 2556],
  square: [2048, 2048],
  og: [1200, 630],
  banner: [1500, 500],
  avatar: [512, 512],
  a4: [2480, 3508],
};

const HELP = `
  vvg — every word is a painting

  Usage
    $ vvg [seed] [options]

  Options
    -s, --style <name>     ${styleNames().join(" | ")}
    -p, --palette <name>   any palette from --list
    -z, --size <size>      WxH or a preset: ${Object.keys(SIZES).join(", ")}
    -o, --out <file>       .png or .svg (default: <seed>.png, or .svg without node-canvas)
    -n, --count <n>        paint n variations: <seed>-1, <seed>-2, …
    -g, --grain <0-1>      paper grain (0 = off)
    -f, --frame            add a gallery mat
        --sign <text>      sign the painting
        --open             open the file when done
        --list             list styles and palettes
    -v, --version
    -h, --help

  Examples
    $ vvg "Ada Lovelace"
    $ vvg tiveor --style flow --size wallpaper
    $ vvg --size og --out cover.svg
    $ vvg sunday -n 6 --frame --sign "Me, 2026"
`;

function parseSize(input: string): [number, number] {
  const preset = SIZES[input.toLowerCase()];
  if (preset) return preset;
  const m = /^(\d+)\s*[x×]\s*(\d+)$/i.exec(input);
  if (!m) throw new Error(`invalid size "${input}". Use WxH (e.g. 1920x1080) or a preset: ${Object.keys(SIZES).join(", ")}`);
  return [Number(m[1]), Number(m[2])];
}

const slug = (s: string): string =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "painting";

async function loadCanvas(): Promise<{ createCanvas(w: number, h: number): any } | null> {
  try {
    // Optional peer dependency: only needed for PNG.
    const name = "canvas";
    return await import(name);
  } catch {
    return null;
  }
}

function openFile(file: string): void {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  spawn(cmd, [file], { detached: true, stdio: "ignore" }).unref();
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      style: { type: "string", short: "s" },
      palette: { type: "string", short: "p" },
      size: { type: "string", short: "z" },
      out: { type: "string", short: "o" },
      count: { type: "string", short: "n" },
      grain: { type: "string", short: "g" },
      frame: { type: "boolean", short: "f" },
      sign: { type: "string" },
      open: { type: "boolean" },
      list: { type: "boolean" },
      version: { type: "boolean", short: "v" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) return void console.log(HELP);
  if (values.version) return void console.log(__VERSION__);
  if (values.list) {
    console.log("\n  Styles");
    for (const s of Object.values(styles)) console.log(`    ${s.name.padEnd(11)} ${s.description}`);
    console.log("\n  Palettes");
    for (const p of Object.values(palettes)) console.log(`    ${p.name.padEnd(11)} ${p.colors.join(" ")}`);
    console.log(`\n  Sizes\n    ${Object.entries(SIZES).map(([k, [w, h]]) => `${k} ${w}x${h}`).join(", ")}\n`);
    return;
  }

  const base = positionals.join(" ").trim() || randomSeed();
  const [width, height] = parseSize(values.size ?? "default");
  const count = Math.max(1, Math.min(100, Number(values.count ?? 1) || 1));
  const grain = values.grain === undefined ? undefined : Number(values.grain);
  if (grain !== undefined && Number.isNaN(grain)) throw new Error(`invalid grain "${values.grain}"`);
  if (values.style && !styleNames().includes(values.style)) {
    throw new Error(`unknown style "${values.style}". Styles: ${styleNames().join(", ")}`);
  }
  if (values.palette && !paletteNames().includes(values.palette)) {
    throw new Error(`unknown palette "${values.palette}". Palettes: ${paletteNames().join(", ")}`);
  }

  const wantsSvg = values.out?.toLowerCase().endsWith(".svg");
  const canvasLib = wantsSvg ? null : await loadCanvas();
  if (!wantsSvg && !canvasLib && values.out) {
    throw new Error("PNG output needs node-canvas: run `npm i canvas` (or ask for an .svg)");
  }
  const ext = canvasLib ? "png" : "svg";
  if (!canvasLib && !values.out) {
    console.log("  tip: install `canvas` for PNG output — writing SVG for now\n");
  }

  for (let i = 1; i <= count; i++) {
    const seed = count > 1 ? `${base}-${i}` : base;
    const options: PaintOptions = {
      seed,
      style: values.style,
      palette: values.palette,
      width,
      height,
      grain,
      frame: values.frame,
      signature: values.sign,
    };
    const art = paint(options);

    let file = values.out ?? `${slug(seed)}.${ext}`;
    if (values.out && count > 1) file = file.replace(/(\.\w+)?$/, (e) => `-${i}${e}`);

    if (file.toLowerCase().endsWith(".svg")) {
      await writeFile(file, art.svg());
    } else {
      const canvas = canvasLib!.createCanvas(width, height);
      art.draw(canvas.getContext("2d"));
      await writeFile(file, canvas.toBuffer("image/png"));
    }
    console.log(`  ✿ ${file}  ${art.style} · ${art.palette} · "${seed}"`);
    if (values.open) openFile(file);
  }
}

declare const __VERSION__: string;

main().catch((err: Error) => {
  console.error(`  vvg: ${err.message.replace(/^vvg: /, "")}`);
  process.exit(1);
});
