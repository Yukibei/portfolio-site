#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT_DIR/logs"
cd "$ROOT_DIR"
if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
  SCRIPT_PATH="scripts/verify-glass-notes.mjs"
else
  NODE_BIN="/mnt/c/Users/ASUS/AppData/Roaming/fnm/node-versions/v24.14.1/installation/node.exe"
  SCRIPT_PATH="$(wslpath -w "$ROOT_DIR/scripts/verify-glass-notes.mjs")"
fi
NOTES_BASE_URL="${NOTES_BASE_URL:-http://127.0.0.1:3001}" "$NODE_BIN" "$SCRIPT_PATH" 2>&1 | tee "$ROOT_DIR/logs/verify-glass-notes.log"
