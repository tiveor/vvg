// Tiny static server for the playground: node scripts/serve.mjs [--port 4321] [--host 127.0.0.1]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: { port: { type: "string", short: "p" }, host: { type: "string", short: "H" } },
});
const port = Number(values.port ?? process.env.PORT ?? 4321);
const host = values.host ?? process.env.HOST ?? "127.0.0.1";
const root = new URL("../web/", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(root, path.endsWith("/") ? `${path}index.html` : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, host, () => console.log(`vvg playground → http://${host}:${port}`));
