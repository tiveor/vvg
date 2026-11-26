# Contributing

Thanks for helping. The most valuable contribution is a **new style**: one file, a few dozen lines, and everyone who runs `npx @tiveor/vvg-cli` can paint with it.

## Setup

```bash
pnpm install
pnpm test        # determinism and SVG checks for every style × palette
pnpm web         # playground at http://127.0.0.1:4321
```

## Adding a style

1. Create `src/styles/<name>.ts`:

   ```ts
   import { defineStyle } from "../style.js";

   export const name = defineStyle({
     name: "name",
     description: "One line that says what it looks like",
     palettes: ["matisse", "ocean"], // the palettes it looks best with
     draw(p) {
       p.background();
       // draw with p.rect, p.circle, p.curve, p.wedge…
     },
   });
   ```

2. Export it from `src/styles/index.ts`.
3. Add a showcase line to `scripts/gallery.mjs` and run `pnpm gallery`.
4. Run `pnpm test`. The suite already checks your style in every palette and at odd sizes.

### Rules that keep paintings reproducible

- Use `p.rng` for geometry and `p.color()` / `p.colorRng` for color choices. Never call `Math.random()`. Keeping color choices separate means switching the palette never changes the composition.
- Size things with `p.unit` (the short side) or `p.width` / `p.height`, never fixed pixels, so the style works from 512×512 avatars to 4K wallpapers.
- Keep the SVG reasonable: a 1600×1000 painting should stay under about 1 MB.
- No dependencies.

## Adding a palette

Add a line to `src/palettes.ts` with a `background`, a dark `ink` and 3–8 `colors`. Check it against a few styles in the playground before opening a PR.

## Commits

[Conventional Commits](https://www.conventionalcommits.org): `feat(styles): add confetti`, `fix(cli): …`.
