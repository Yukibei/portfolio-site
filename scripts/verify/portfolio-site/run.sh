#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LOG_DIR="$ROOT_DIR/logs/visual-audit"
AUDIT_URL="${AUDIT_URL:-http://127.0.0.1:3002}"
mkdir -p "$LOG_DIR"

resolve_uv() {
  if command -v uv >/dev/null 2>&1; then
    command -v uv
    return
  fi

  if command -v uv.exe >/dev/null 2>&1; then
    command -v uv.exe
    return
  fi

  if command -v where.exe >/dev/null 2>&1; then
    local windows_uv
    windows_uv="$(where.exe uv 2>/dev/null | head -n 1 | tr -d '\r')"
    if [ -n "$windows_uv" ] && command -v cygpath >/dev/null 2>&1; then
      cygpath -u "$windows_uv"
      return
    fi
  fi

  echo "uv executable not found" >&2
  return 1
}

UV_BIN="$(resolve_uv)"

cd "$ROOT_DIR"
AUDIT_URL="$AUDIT_URL" "$UV_BIN" run --with playwright python \
  scripts/verify/portfolio-site/visual_audit.py \
  2>&1 | tee "$LOG_DIR/run.log"

AUDIT_URL="$AUDIT_URL" "$UV_BIN" run --with playwright python \
  scripts/verify/portfolio-site/route_audit.py \
  2>&1 | tee -a "$LOG_DIR/run.log"

AUDIT_URL="$AUDIT_URL" "$UV_BIN" run --with playwright python \
  scripts/verify/portfolio-site/game_audit.py \
  2>&1 | tee -a "$LOG_DIR/run.log"
