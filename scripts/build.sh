#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/build.log"

exec > >(tee "$LOG_FILE") 2>&1

"$ROOT_DIR/scripts/stop-dev.sh" --quiet || true

cd "$ROOT_DIR/web"
npm run build
