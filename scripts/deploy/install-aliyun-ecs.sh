#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-portfolio-site}"
APP_ROOT="${APP_ROOT:-/opt/portfolio-site}"
APP_USER="${APP_USER:-}"
PORT="${PORT:-3000}"
BIND_HOST="${BIND_HOST:-127.0.0.1}"
DOMAIN="${DOMAIN:-_}"
PACKAGE_PATH="${1:-portfolio-site-aliyun.tar.gz}"

normalize_domains() {
  local normalized=""
  local domain_name
  for domain_name in $DOMAIN; do
    normalized="$normalized $domain_name"
  done
  normalized="${normalized# }"
  if [ -z "$normalized" ]; then
    normalized="_"
  fi
  printf '%s' "$normalized"
}

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root: sudo bash install-aliyun-ecs.sh $PACKAGE_PATH" >&2
  exit 1
fi

if [ ! -f "$PACKAGE_PATH" ]; then
  echo "Package not found: $PACKAGE_PATH" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 20+ before running this script." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required for the post-deploy health check." >&2
  exit 1
fi

if [ -z "$APP_USER" ]; then
  if id nginx >/dev/null 2>&1; then
    APP_USER="nginx"
  elif id www-data >/dev/null 2>&1; then
    APP_USER="www-data"
  else
    APP_USER="root"
  fi
fi

PREVIOUS_RELEASE=""
if [ -L "$APP_ROOT/current" ]; then
  PREVIOUS_RELEASE="$(readlink -f "$APP_ROOT/current" || true)"
fi

mkdir -p "$APP_ROOT/releases" "$APP_ROOT/shared"
RELEASE_DIR="$APP_ROOT/releases/$(date +%Y%m%d%H%M%S)"
mkdir -p "$RELEASE_DIR"
tar -xzf "$PACKAGE_PATH" -C "$RELEASE_DIR"

if [ ! -x "$RELEASE_DIR/start.sh" ] || \
  { [ ! -f "$RELEASE_DIR/server.js" ] && [ ! -f "$RELEASE_DIR/web/server.js" ]; }; then
  rm -rf -- "$RELEASE_DIR"
  echo "Invalid deployment package: start.sh or server.js is missing." >&2
  exit 1
fi

ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
chown "$APP_USER":"$APP_USER" "$APP_ROOT" "$APP_ROOT/releases" "$APP_ROOT/shared"
chown -R "$APP_USER":"$APP_USER" "$RELEASE_DIR"

cat > "/etc/systemd/system/$APP_NAME.service" <<SERVICE
[Unit]
Description=Portfolio Site
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_ROOT/current
Environment=NODE_ENV=production
Environment=HOSTNAME=$BIND_HOST
Environment=PORT=$PORT
ExecStart=$APP_ROOT/current/start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable "$APP_NAME"

rollback_release() {
  if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ]; then
    ln -sfn "$PREVIOUS_RELEASE" "$APP_ROOT/current"
    systemctl restart "$APP_NAME" || true
    echo "Rolled back to $PREVIOUS_RELEASE" >&2
  else
    rm -f "$APP_ROOT/current"
    systemctl stop "$APP_NAME" || true
    echo "First deployment failed; service stopped." >&2
  fi
}

if ! systemctl restart "$APP_NAME"; then
  rollback_release
  exit 1
fi

APP_READY=false
for _ in $(seq 1 30); do
  if curl --max-time 2 -fsS "http://127.0.0.1:$PORT/" >/dev/null; then
    APP_READY=true
    break
  fi
  sleep 1
done

if [ "$APP_READY" != true ]; then
  journalctl -u "$APP_NAME" -n 80 --no-pager >&2 || true
  rollback_release
  exit 1
fi

if command -v nginx >/dev/null 2>&1; then
  NGINX_CONFIG="/etc/nginx/conf.d/$APP_NAME.conf"
  NGINX_BACKUP=""
  if [ -f "$NGINX_CONFIG" ]; then
    NGINX_BACKUP="$(mktemp)"
    cp "$NGINX_CONFIG" "$NGINX_BACKUP"
  fi
  DOMAIN_NAMES="$(normalize_domains)"
  primary_domain="${DOMAIN_NAMES%% *}"
  cert_dir="/etc/letsencrypt/live/$primary_domain"
  if [ "$DOMAIN_NAMES" != "_" ] && [ -f "$cert_dir/fullchain.pem" ] && [ -f "$cert_dir/privkey.pem" ]; then
    cat > "$NGINX_CONFIG" <<NGINX
server {
    listen 80;
    server_name $DOMAIN_NAMES;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAMES;

    ssl_certificate $cert_dir/fullchain.pem;
    ssl_certificate_key $cert_dir/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX
  else
    cat > "$NGINX_CONFIG" <<NGINX
server {
    listen 80;
    server_name $DOMAIN_NAMES;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX
  fi
  if ! nginx -t; then
    if [ -n "$NGINX_BACKUP" ]; then
      cp "$NGINX_BACKUP" "$NGINX_CONFIG"
    else
      rm -f "$NGINX_CONFIG"
    fi
    rm -f "$NGINX_BACKUP"
    nginx -t || true
    exit 1
  fi
  rm -f "$NGINX_BACKUP"
  systemctl enable nginx
  systemctl start nginx
  systemctl reload nginx
else
  echo "nginx not found; skipped reverse proxy configuration."
fi

systemctl --no-pager --full status "$APP_NAME" || true
echo "Installed $APP_NAME at $APP_ROOT/current"
