#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
RUN_DIR="$ROOT_DIR/.omx/run"
PORT_FILE="$RUN_DIR/portfolio-site-dev.port"
LOG_FILE="$LOG_DIR/verify-portrait-stage.log"

mkdir -p "$LOG_DIR"
exec > >(tee "$LOG_FILE") 2>&1

PORT="$(cat "$PORT_FILE" 2>/dev/null || echo 3000)"
URL="${URL:-http://127.0.0.1:$PORT/lab/portrait-stage}"

cd "$ROOT_DIR/web"
npm run verify:portrait-stage -- "$URL"
