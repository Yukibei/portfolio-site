#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/verify-lanyard-assets.log"

exec > >(tee "$LOG_FILE") 2>&1

node_script='
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const expected = { width: 1678, height: 2532 };
const files = [
  ["front", "web/public/lanyard/front.png"],
  ["back", "web/public/lanyard/back.png"],
  ["band", "web/public/lanyard/band.png"],
];

function sizeOfPng(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`${file} is not a PNG`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

let failed = false;
for (const [name, rel] of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.error(`missing ${rel}`);
    failed = true;
    continue;
  }
  const size = sizeOfPng(file);
  console.log(`${rel}: ${size.width}x${size.height}`);
  if (name !== "band" && (size.width !== expected.width || size.height !== expected.height)) {
    console.error(`${rel} should be ${expected.width}x${expected.height}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
'

cd "$ROOT_DIR"
if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
elif command -v node.exe >/dev/null 2>&1; then
  NODE_BIN="node.exe"
else
  echo "node or node.exe is required" >&2
  exit 1
fi

"$NODE_BIN" -e "$node_script"
