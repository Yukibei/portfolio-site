#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/.omx/deploy/portfolio-site"
LOG_FILE="$ROOT_DIR/logs/deploy-smoke.log"
HOST="127.0.0.1"
PORT="${PORT:-3100}"

mkdir -p "$ROOT_DIR/logs"

if [ -f "$PACKAGE_DIR/server.js" ]; then
  SERVER_ENTRY="$PACKAGE_DIR/server.js"
elif [ -f "$PACKAGE_DIR/web/server.js" ]; then
  SERVER_ENTRY="$PACKAGE_DIR/web/server.js"
else
  echo "standalone 包中缺少 server.js" >&2
  exit 1
fi

: > "$LOG_FILE"
if command -v node >/dev/null 2>&1; then
  CURL_BIN="curl"
  HOSTNAME="$HOST" PORT="$PORT" node "$SERVER_ENTRY" >> "$LOG_FILE" 2>&1 &
else
  WINDOWS_ENTRY="$(wslpath -w "$SERVER_ENTRY")"
  NODE_BIN="/mnt/c/Users/ASUS/AppData/Roaming/fnm/node-versions/v24.14.1/installation/node.exe"
  CURL_BIN="curl.exe"
  export HOSTNAME="$HOST" PORT
  export WSLENV="${WSLENV:+$WSLENV:}HOSTNAME/w:PORT/w"
  "$NODE_BIN" "$WINDOWS_ENTRY" >> "$LOG_FILE" 2>&1 &
fi
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

READY=false
for _ in $(seq 1 30); do
  if "$CURL_BIN" --max-time 1 -fsS "http://$HOST:$PORT/" >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 1
done

if [ "$READY" != true ]; then
  cat "$LOG_FILE" >&2
  exit 1
fi

ROUTES=(
  "/"
  "/work"
  "/notes"
  "/notes/favorites"
  "/notes/queue"
  "/notes/profile"
  "/notes/settings"
  "/notes/notifications"
  "/notes/series/portfolio-v2"
  "/notes/portfolio-as-a-system"
)

for route in "${ROUTES[@]}"; do
  "$CURL_BIN" --max-time 5 -fsS "http://$HOST:$PORT$route" >/dev/null
  echo "OK $route"
done

echo "standalone 部署包冒烟通过"
