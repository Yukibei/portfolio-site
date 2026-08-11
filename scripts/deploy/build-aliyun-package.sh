#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
DEPLOY_DIR="$ROOT_DIR/.omx/deploy"
PACKAGE_DIR="$DEPLOY_DIR/portfolio-site"
ARCHIVE="$DEPLOY_DIR/portfolio-site-aliyun.tar.gz"
LOG_FILE="$LOG_DIR/deploy-package.log"

mkdir -p "$LOG_DIR" "$DEPLOY_DIR"
exec > >(tee "$LOG_FILE") 2>&1

"$ROOT_DIR/scripts/build.sh"

PACKAGE_ABS="$(cd "$DEPLOY_DIR" && pwd -P)/portfolio-site"
case "$PACKAGE_ABS" in
  "$(cd "$ROOT_DIR" && pwd -P)/.omx/deploy/portfolio-site") rm -rf -- "$PACKAGE_ABS" ;;
  *) echo "Refusing to delete unexpected package path: $PACKAGE_ABS" >&2; exit 1 ;;
esac

mkdir -p "$PACKAGE_DIR"
cp -R "$ROOT_DIR/web/.next/standalone/." "$PACKAGE_DIR/"

if [ -d "$PACKAGE_DIR/web" ]; then
  mkdir -p "$PACKAGE_DIR/web/.next"
  cp -R "$ROOT_DIR/web/.next/static" "$PACKAGE_DIR/web/.next/static"
  cp -R "$ROOT_DIR/web/public" "$PACKAGE_DIR/web/public"
  SERVER_ENTRY="web/server.js"
else
  mkdir -p "$PACKAGE_DIR/.next"
  cp -R "$ROOT_DIR/web/.next/static" "$PACKAGE_DIR/.next/static"
  cp -R "$ROOT_DIR/web/public" "$PACKAGE_DIR/public"
  SERVER_ENTRY="server.js"
fi

cat > "$PACKAGE_DIR/.env.production" <<'ENV'
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=3000
ENV

cat > "$PACKAGE_DIR/start.sh" <<START
#!/usr/bin/env bash
set -euo pipefail
cd "\$(dirname "\${BASH_SOURCE[0]}")"
export NODE_ENV="\${NODE_ENV:-production}"
export HOSTNAME="\${HOSTNAME:-127.0.0.1}"
export PORT="\${PORT:-3000}"
node "$SERVER_ENTRY"
START
chmod +x "$PACKAGE_DIR/start.sh"

tar -czf "$ARCHIVE" -C "$PACKAGE_DIR" .

echo "Aliyun package created: $ARCHIVE"
echo "Server entry: $SERVER_ENTRY"
