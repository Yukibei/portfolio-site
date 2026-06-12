#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
SRC_DIR="$ROOT_DIR/web/card-src"
PUBLIC_DIR="$ROOT_DIR/web/public/lanyard"
mkdir -p "$LOG_DIR" "$PUBLIC_DIR"
LOG_FILE="$LOG_DIR/render-lanyard-assets.log"

exec > >(tee "$LOG_FILE") 2>&1

CHROME="${CHROME:-/mnt/c/Program Files/Google/Chrome/Application/chrome.exe}"
if [ ! -x "$CHROME" ]; then
  echo "Chrome not found: $CHROME" >&2
  exit 1
fi

to_win_path() {
  if command -v wslpath >/dev/null 2>&1; then
    wslpath -w "$1"
  else
    printf '%s' "$1"
  fi
}

to_file_url_path() {
  if command -v wslpath >/dev/null 2>&1; then
    wslpath -m "$1"
  else
    printf '%s' "$1"
  fi
}

render_card() {
  local name="$1"
  local html_file="$SRC_DIR/card-$name.html"
  local png_file="$SRC_DIR/card-$name.png"
  local png_win
  local html_url
  png_win="$(to_win_path "$png_file")"
  html_url="file:///$(to_file_url_path "$html_file")"

  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size=1678,2532 \
    --screenshot="$png_win" \
    "$html_url"
}

render_band() {
  local html_file="$SRC_DIR/band.html"
  local png_file="$SRC_DIR/band.png"
  local png_win
  local html_url
  png_win="$(to_win_path "$png_file")"
  html_url="file:///$(to_file_url_path "$html_file")"

  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size=1025,250 \
    --screenshot="$png_win" \
    "$html_url"
}

render_card front
render_card back
render_band

cp "$SRC_DIR/card-front.png" "$PUBLIC_DIR/front.png"
cp "$SRC_DIR/card-back.png" "$PUBLIC_DIR/back.png"
cp "$SRC_DIR/band.png" "$PUBLIC_DIR/band.png"

bash "$ROOT_DIR/scripts/verify-lanyard-assets.sh"
