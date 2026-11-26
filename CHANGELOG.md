# Changelog

## [1.0.1] - 2026-11-26

### Added
- `@tiveor/vvg-cli`: the same command with `canvas` included, so `npx @tiveor/vvg-cli "your name"` always writes a PNG. With 1.0.0, `npx @tiveor/vvg` fell back to SVG unless `canvas` was already installed.

### Changed
- Without `canvas`, the `vvg` command now points to `@tiveor/vvg-cli` for PNG output.

## [1.0.0] - 2026-11-26

vvg becomes "every word is a painting": seeded, reproducible paintings from any text.

### Added
- `paint({ seed, style, palette, width, height, grain, frame, signature })`: same seed, same painting, everywhere.
- Zero-dependency SVG output (`art.svg()`) next to canvas rendering (`art.draw(ctx)`).
- Eight styles: `flow`, `bauhaus`, `jacaranda`, `horizon`, `chaos`, `mondrian`, `blobs`, `waves`.
- 17 curated palettes, including the original `bolivia`, `whipala`, `faber`, `earth` and `vivid`.
- CLI: `npx @tiveor/vvg "your name"` with size presets (wallpaper, 4k, phone, og, avatar, a4…), batches, frame and signature.
- Playground (`web/`) that paints as you type, with shareable links and PNG/SVG downloads.
- `defineStyle` / `definePalette` and a `Painter` API for custom styles; seeded `createRandom` and `createNoise`.
- Paper grain, gallery mat and signature finishes.
- Test suite (determinism and every style × palette), CI and a GitHub Pages workflow.

### Changed
- **BREAKING:** the 0.x drawing API (`new VVG(canvas)`, `drawDot`, `drawFrame`, `example1`–`example4`, `Randomizer`, `Colorizer`, `PaletteType`) is replaced by `paint()` and the `Painter` passed to styles. The `jacaranda` and `chaos` styles carry on the old examples.
- `canvas` is now an optional peer dependency, only needed for PNG output in Node.
- Node 20 or newer.

### Migrating from 0.x

```js
// 0.x
const painter = new VVG(canvas);
example4(painter);

// 1.0
paint({ style: "chaos", width: canvas.width, height: canvas.height }).draw(canvas.getContext("2d"));
```

## [0.2.0] - 2026-02-19

### Complete Refactoring to TypeScript

Full modernization of the codebase from vanilla JavaScript/CommonJS to TypeScript/ES Modules.

### Added
- TypeScript with strict mode and full type definitions (`.d.ts`)
- `tsup` build pipeline outputting ESM, CJS, and IIFE (browser) formats
- Typed interfaces for all drawing options (`FrameOptions`, `DotOptions`, `LineOptions`, etc.)
- `Drawable` interface for all shapes
- `Point` type used consistently across all shapes
- `PaletteType` enum replacing string-based palette selection
- `BackgroundType` enum replacing loose object
- `generate()` utility function (extracted from `Gen` class)
- `saveToFile()` now returns a `Promise` instead of using callbacks
- Dual package exports (`import` / `require`) with proper `types` fields

### Changed
- **BREAKING:** Main class renamed from `vvg` to `VVG` (PascalCase)
- **BREAKING:** `drawEllispse()` renamed to `drawEllipse()` (typo fix)
- **BREAKING:** Examples extracted from VVG class to standalone functions: `example1(vvg)`, `example2(vvg)`, etc.
- **BREAKING:** Entry point moved from `index.js` to `dist/index.js`
- `Bezzier` class renamed to `Bezier`
- `palleteType` renamed to `PaletteType`
- `PALLETE_*` constants renamed to `PALETTE_*`
- `Quadrilateral` and `Bezier` now take `points` array instead of 8 separate coordinates
- `Line` now takes `from`/`to` `Point` objects instead of `x1, y1, x2, y2`
- `Snake` and `SnakeCollection` rewritten as proper ES6 classes (were prototype-based)
- `Tree.draw()` split into `draw()` and `animate()` for clarity
- `canvas` dependency upgraded from `^2.6.1` to `^3.2.1`
- Package version bumped to `0.2.0`

### Fixed
- `Frame.draw()`: used `borderRight` as Y position instead of `borderUp` (line 34 bug)
- `snake.js`: used global `context` variable instead of `this.context`
- `snake.js`: double `module.exports` caused only `SnakeCollection` to be exported
- `snake.js`: `split()` called `new Snake(this.canvas)` but `this.canvas` didn't exist
- `Randomizer.randInsideBoxX/Y`: referenced `this.maxX` in static methods (impossible)
- `SnakeCollection.remove()`: used `for...in` on array (fragile), now uses `indexOf`

### Removed
- `web/lib/vvg/` directory (was a full copy of `src/` for browser usage)
- `web/js/index.js` (replaced by inline script in `web/index.html`)
- `src/enums/pallettype.js` (merged into `src/utils/palettes.ts`)
- `src/utils/colorizer.data.js` (merged into `src/utils/palettes.ts`)
- `src/utils/gen.js` (merged as `generate()` in `src/utils/randomizer.ts`)
- `src/extended/snake_original.js` (legacy jQuery reference)
- Root `index.js` (replaced by `dist/` build output)
- `Gen` class (replaced by simple `generate()` function)

## [0.1.2]

- Fixed save to file issue
- Removed console logs

## [0.1.1]

- Fixed README

## [0.1.0]

- Refactored into shapes-based architecture
- Published to NPM as `@tiveor/vvg`

## [0.0.1]

- Initial release with original standalone HTML
