#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
RUN_DIR="$ROOT_DIR/.omx/run"
mkdir -p "$LOG_DIR" "$RUN_DIR"

HOST="${HOST:-127.0.0.1}"
START_PORT="${PORT:-3000}"
PID_FILE="$RUN_DIR/portfolio-site-dev.pid"
PORT_FILE="$RUN_DIR/portfolio-site-dev.port"
LOG_FILE="$LOG_DIR/dev.log"

to_windows_path() {
  local path="$1"
  if command -v wslpath >/dev/null 2>&1; then
    wslpath -w "$path"
    return
  fi
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -w "$path"
    return
  fi
  printf '%s' "$path"
}

pid_is_running() {
  local pid="$1"
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command \
      "if (Get-Process -Id $pid -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" \
      >/dev/null 2>&1
    return $?
  fi
  kill -0 "$pid" >/dev/null 2>&1
}

clean_next_cache() {
  local web_dir="$ROOT_DIR/web"
  local next_dir="$web_dir/.next"

  if [ ! -e "$next_dir" ]; then
    return
  fi

  local web_abs
  local next_abs
  web_abs="$(cd "$web_dir" && pwd -P)"
  next_abs="$(cd "$next_dir" && pwd -P)"

  case "$next_abs" in
    "$web_abs/.next") rm -rf -- "$next_abs" ;;
    *) echo "Refusing to delete unexpected path: $next_abs" >&2; exit 1 ;;
  esac
}

if [ -f "$PID_FILE" ] && pid_is_running "$(cat "$PID_FILE")"; then
  PORT="$(cat "$PORT_FILE" 2>/dev/null || echo "$START_PORT")"
  echo "Dev server already running with PID $(cat "$PID_FILE")"
  echo "URL: http://$HOST:$PORT"
  exit 0
fi

"$ROOT_DIR/scripts/stop-dev.sh" --quiet || true
rm -f "$PID_FILE" "$PORT_FILE"
clean_next_cache

port_is_busy() {
  local port="$1"
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile -Command \
      "if (Get-NetTCPConnection -LocalAddress '$HOST' -LocalPort $port -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" \
      >/dev/null 2>&1
    return $?
  fi
  return 1
}

PORT="$START_PORT"
while port_is_busy "$PORT"; do
  PORT=$((PORT + 1))
done

: > "$LOG_FILE"

cd "$ROOT_DIR/web"
nohup npm run dev -- --hostname "$HOST" --port "$PORT" > "$LOG_FILE" 2>&1 &
echo "$!" > "$PID_FILE"

echo "$PORT" > "$PORT_FILE"

echo "Started dev server with PID $(cat "$PID_FILE")"
echo "URL: http://$HOST:$PORT"
echo "Log: $LOG_FILE"
