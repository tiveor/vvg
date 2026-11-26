import { paint, styles, palettes, renderOps, applyGrain, hash, mix, isDark, randomSeed } from "./vvg.js";

const SIZES = {
  landscape: [1600, 1000, "Landscape"],
  wallpaper: [2560, 1440, "Wallpaper 16:9"],
  phone: [1179, 2556, "Phone"],
  square: [2048, 2048, "Square"],
  og: [1200, 630, "Social card"],
};
const $ = (id) => document.getElementById(id);
const canvas = $("art");
const ctx = canvas.getContext("2d");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const option = (value, label) => Object.assign(document.createElement("option"), { value, textContent: label });
$("style").append(option("", "any style"), ...Object.values(styles).map((s) => option(s.name, s.name)));
$("palette").append(option("", "any"), ...Object.values(palettes).map((p) => option(p.name, p.name)));
$("size").append(...Object.entries(SIZES).map(([k, [, , label]]) => option(k, label)));

// State lives in the URL so every painting is a link.
// Links can be crafted, so only known names are taken from them.
const params = new URLSearchParams(location.search);
const known = (table, name) => (name && Object.prototype.hasOwnProperty.call(table, name) ? name : "");
const state = {
  seed: (params.get("s") || randomSeed()).slice(0, 80),
  style: known(styles, params.get("style")),
  palette: known(palettes, params.get("palette")),
  size: known(SIZES, params.get("size")) || "landscape",
};
const history = [];
let cursor = -1;
let art = null;
let frame = 0;

function options() {
  const [width, height] = SIZES[state.size];
  return { seed: state.seed, style: state.style || undefined, palette: state.palette || undefined, width, height };
}

function syncUrl() {
  const q = new URLSearchParams({ s: state.seed });
  if (state.style) q.set("style", state.style);
  if (state.palette) q.set("palette", state.palette);
  if (state.size !== "landscape") q.set("size", state.size);
  window.history.replaceState(null, "", `?${q}`);
}

function command() {
  const parts = [`npx @tiveor/vvg-cli ${JSON.stringify(art.seed)}`, `-s ${art.style}`, `-p ${art.palette}`];
  if (state.size === "wallpaper") parts.push("-z wallpaper");
  else if (state.size === "phone") parts.push("-z phone");
  else if (state.size === "square") parts.push("-z square");
  else if (state.size === "og") parts.push("-z og");
  return parts.join(" ");
}

function render({ animate = true } = {}) {
  art = paint(options());
  const pal = palettes[art.palette];

  // The wall takes the painting's colors, like a gallery room painted for the show.
  const dark = isDark(pal.background);
  const wall = dark ? mix(pal.background, "#000000", 0.35) : mix(pal.background, pal.ink, 0.13);
  document.body.style.setProperty("--wall", wall);
  document.body.style.setProperty("--text", dark ? "#f3efe8" : pal.ink);
  $("wrap").style.setProperty("--ratio", art.width / art.height);
  // The label lines up with the painting, so size the whole piece.
  const piece = document.querySelector(".piece");
  piece.style.setProperty("--piece-w", `calc(68svh * ${art.width / art.height})`);
  piece.classList.toggle("side", art.width <= art.height);

  if (document.activeElement !== $("seed")) $("seed").value = art.seed;
  $("style").value = state.style;
  $("palette").value = state.palette;
  $("size").value = state.size;
  $("style").options[0].textContent = state.style ? "any style" : `${art.style} (by seed)`;
  $("palette").options[0].textContent = state.palette ? "any" : `${art.palette} (by seed)`;
  $("cmd").textContent = command();
  document.title = `${art.seed} — vvg`;
  syncUrl();

  // Backing store at device resolution, drawn in painting coordinates.
  const box = $("wrap").getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(box.width * dpr);
  canvas.height = Math.round(box.height * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(canvas.width / art.width, 0, 0, canvas.height / art.height, 0, 0);

  cancelAnimationFrame(frame);
  const ops = art.ops;
  const finish = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    applyGrain(ctx, art.grain, hash(art.seed));
  };
  if (!animate || reduceMotion) {
    renderOps(ctx, ops);
    return finish();
  }
  // The one moment of motion: the painting paints itself.
  const duration = Math.min(1800, 500 + ops.length * 0.4);
  const start = performance.now();
  let done = 0;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    const target = Math.ceil(eased * ops.length);
    renderOps(ctx, ops, done, target);
    done = target;
    if (t < 1) frame = requestAnimationFrame(tick);
    else finish();
  };
  frame = requestAnimationFrame(tick);
}

function go(seed, { record = true, animate = true } = {}) {
  state.seed = seed;
  if (record) {
    history.splice(cursor + 1);
    history.push(seed);
    cursor = history.length - 1;
  }
  render({ animate });
}

const fresh = () => go(randomSeed());
const back = () => cursor > 0 && go(history[--cursor], { record: false });
const forward = () => cursor < history.length - 1 && go(history[++cursor], { record: false });

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 1800);
}

const fileName = (ext) =>
  `${art.seed.normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "painting"}-${art.style}.${ext}`;

function download(blob, name) {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function savePng() {
  const full = document.createElement("canvas");
  full.width = art.width;
  full.height = art.height;
  art.draw(full.getContext("2d"));
  full.toBlob((blob) => download(blob, fileName("png")), "image/png");
  toast(`Saved ${art.width} × ${art.height} PNG`);
}

async function copy(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    toast("Copy failed: select the text and copy it by hand");
  }
}

let typing = 0;
$("seed").addEventListener("input", (e) => {
  clearTimeout(typing);
  const value = e.target.value.trim();
  if (!value) return;
  typing = setTimeout(() => go(value), 280);
});
$("seed").addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.target.blur();
});
for (const id of ["style", "palette", "size"]) {
  $(id).addEventListener("change", (e) => {
    state[id] = e.target.value;
    render();
  });
}
$("again").addEventListener("click", fresh);
$("wrap").addEventListener("click", fresh);
$("png").addEventListener("click", savePng);
$("svg").addEventListener("click", () => {
  download(new Blob([art.svg()], { type: "image/svg+xml" }), fileName("svg"));
  toast("Saved SVG");
});
$("share").addEventListener("click", () => copy(location.href, "Link copied: anyone who opens it sees this exact painting"));
$("copy-cmd").addEventListener("click", () => copy($("cmd").textContent, "Command copied"));

addEventListener("keydown", (e) => {
  if (e.target.matches("input, select, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === " ") { e.preventDefault(); fresh(); }
  else if (e.key === "ArrowLeft") back();
  else if (e.key === "ArrowRight") forward();
  else if (e.key.toLowerCase() === "s") savePng();
});

let resizing = 0;
addEventListener("resize", () => {
  clearTimeout(resizing);
  resizing = setTimeout(() => render({ animate: false }), 150);
});

go(state.seed);
