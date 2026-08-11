#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
mkdir -p "$ROOT_DIR/logs"
cd "$ROOT_DIR/web"
npm run quality:report 2>&1 | tee "$ROOT_DIR/logs/quality-report.log"
