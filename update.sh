#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

REPO="https://github.com/8Sergey8/ma-parts.git"

if ! command -v git >/dev/null 2>&1; then
  echo "Git не найден. На Mac: откройте Terminal и выполните"
  echo "  xcode-select --install"
  echo "затем повторите эту команду."
  exit 1
fi

if [ ! -d .git ]; then
  echo "Эта папка скачана ZIP-архивом, без Git."
  echo "Один раз вставьте в Terminal:"
  echo
  echo "  cd ~"
  echo "  git clone $REPO ma-parts"
  echo "  cd ma-parts"
  echo "  chmod +x start.sh update.sh"
  echo "  ./update.sh"
  echo
  exit 1
fi

echo "MBA-parts — обновление с GitHub"
echo "Папка: $PWD"
echo

if git remote get-url github >/dev/null 2>&1; then
  git remote set-url github "$REPO"
else
  git remote add github "$REPO"
fi

git fetch github main
git merge --ff-only github/main

chmod +x start.sh update.sh
exec ./start.sh
