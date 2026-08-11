#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/experience-layout.log"
URL="${URL:-http://127.0.0.1:3000}"

exec > >(tee "$LOG_FILE") 2>&1

cd "$ROOT_DIR/web"

URL="$URL" SCREENSHOT_PATH="../logs/experience-layout.png" \
  npm run verify:experience-layout
