#!/usr/bin/env bash
# Publishes the playground at https://alvarotech.dev/vvg/, the same way the
# site's own scripts/publish.sh does: copy into public/vvg, commit, push.
# The site deploys to Firebase on push to main.
#   pnpm publish:site            (SITE_DIR overrides where the site repo lives)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="${SITE_DIR:-$HOME/dev/tiveor/tiveor.github.io}"
fail() { echo "❌ $*" >&2; exit 1; }

[ -d "$SITE_DIR/.git" ] || fail "Site repo not found at $SITE_DIR (set SITE_DIR)"
cd "$SITE_DIR"
[ -z "$(git diff --cached --name-only)" ] || fail "The site repo has staged changes; commit or unstage them first"
git pull --rebase --autostash --quiet

cd "$ROOT"
pnpm build >/dev/null
for f in index.html vvg.js og.jpg; do [ -f "web/$f" ] || fail "web/$f is missing"; done
SHA="$(git rev-parse --short HEAD)"
[ -z "$(git status --porcelain --untracked-files=no)" ] || SHA="$SHA-dirty"

rm -rf "$SITE_DIR/public/vvg"
mkdir -p "$SITE_DIR/public/vvg"
cp web/index.html web/vvg.js web/og.jpg "$SITE_DIR/public/vvg/"

cd "$SITE_DIR"
git add -A -- public/vvg
if git diff --cached --quiet; then
  echo "✅ No changes: public/vvg is already up to date"
  exit 0
fi
git commit --quiet -m "chore(deploy): publish vvg @ $SHA"
git push --quiet
echo "✅ Published https://alvarotech.dev/vvg/ ($SHA)"
