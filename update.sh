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
  TARGET="$HOME/ma-parts"
  echo "Эта папка из ZIP и не обновляется."
  echo "Скачиваю последнюю версию с GitHub в $TARGET"
  echo
  if [ -d "$TARGET/.git" ]; then
    git -C "$TARGET" fetch origin
    git -C "$TARGET" reset --hard origin/main
  else
    if [ -e "$TARGET" ]; then
      TARGET="$HOME/ma-parts-site"
    fi
    git clone "$REPO" "$TARGET"
  fi
  chmod +x "$TARGET/start.sh" "$TARGET/update.sh"
  exec "$TARGET/start.sh"
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
