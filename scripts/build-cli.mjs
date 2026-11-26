// Prepares cli/ as the @tiveor/vvg-cli package: the bundled CLI plus `canvas`
// as a real dependency, so `npx @tiveor/vvg-cli "name"` always writes PNG.
import { chmodSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const manifest = JSON.parse(readFileSync("cli/package.json", "utf8"));

mkdirSync("cli/dist", { recursive: true });
copyFileSync("dist/cli.js", "cli/dist/cli.js");
chmodSync("cli/dist/cli.js", 0o755);
copyFileSync("LICENSE", "cli/LICENSE");

// Both packages ship the same CLI, so they share one version number.
if (manifest.version !== version) {
  manifest.version = version;
  writeFileSync("cli/package.json", JSON.stringify(manifest, null, 2) + "\n");
}
console.log(`cli/ ready: @tiveor/vvg-cli@${version}`);
