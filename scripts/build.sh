#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
source "$ROOT_DIR/scripts/lib/next-cache.sh"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/build.log"

exec > >(tee "$LOG_FILE") 2>&1

"$ROOT_DIR/scripts/stop-dev.sh" --quiet || true
clean_next_cache "$ROOT_DIR"

cd "$ROOT_DIR/web"
npm run build
