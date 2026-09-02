#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "MBA-parts"
echo "Folder: $PWD"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found."
  echo "Install LTS from https://nodejs.org (macOS installer) or:"
  echo "  brew install node"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Reinstall Node.js from https://nodejs.org"
  exit 1
fi

echo "node $(node -v)  npm $(npm -v)"

major="$(node -p "process.versions.node.split('.')[0]")"
if [ "$major" -lt 20 ]; then
  echo "Need Node.js 20+. Now: $(node -v)"
  echo "Install LTS: https://nodejs.org"
  exit 1
fi

if [ ! -d node_modules/next ]; then
  echo
  echo "[1/2] npm install  (wait 1-2 min)"
  npm install
fi

echo
echo "[2/2] Starting http://127.0.0.1:43123"
echo "Окно Terminal не закрывайте."
echo
exec node scripts/start-local.cjs
