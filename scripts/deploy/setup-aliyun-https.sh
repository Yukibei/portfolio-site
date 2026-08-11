#!/usr/bin/env bash
set -euo pipefail

DOMAINS="${DOMAINS:-liyilin.xyz www.liyilin.xyz}"
EMAIL="${EMAIL:-}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root: sudo bash setup-aliyun-https.sh" >&2
  exit 1
fi

if ! command -v dnf >/dev/null 2>&1; then
  echo "dnf is required on Alibaba Cloud Linux." >&2
  exit 1
fi

dnf install -y certbot python3-certbot-nginx

domain_args=()
for domain in $DOMAINS; do
  domain_args+=("-d" "$domain")
done

contact_args=("--register-unsafely-without-email")
if [ -n "$EMAIL" ]; then
  contact_args=("--email" "$EMAIL" "--no-eff-email")
fi

certbot --nginx \
  "${domain_args[@]}" \
  --non-interactive \
  --agree-tos \
  "${contact_args[@]}" \
  --redirect \
  --keep-until-expiring

nginx -t
systemctl reload nginx

systemctl enable --now certbot-renew.timer >/dev/null 2>&1 || true
systemctl list-timers --all | grep -E 'certbot|snap.certbot' || true
timeout 180 certbot renew --dry-run --non-interactive
