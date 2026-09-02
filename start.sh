#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Установите Node.js 20+ с https://nodejs.org"
  exit 1
fi

echo "Запускаю магазин MBA-parts на http://127.0.0.1:43123"
exec node scripts/start-local.cjs
