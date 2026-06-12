#!/usr/bin/env bash
# Server-side deploy (build-on-server). Runs on the aaPanel server via GitHub
# Actions SSH (or manually). Reverse-proxy + SSL are managed in the aaPanel UI,
# NOT here — this script only: pulls code, builds, runs containers, publishes
# the client static files into the aaPanel site docroot.
#
# Requirements on the server (one-time): docker + compose, node (nvm) + wasp CLI,
# the deploy user in the `docker` group and able to WRITE to $CLIENT_WEBROOT.
set -euo pipefail

# --- config (override via env in the workflow if paths differ) ---
APP_DIR="${APP_DIR:-/www/wwwroot/ai-tools-app}"           # where the repo is cloned on the server
CLIENT_WEBROOT="${CLIENT_WEBROOT:-/www/wwwroot/scribegem.com}"  # aaPanel site docroot
API_URL="${API_URL:-https://api.scribegem.com}"

cd "$APP_DIR"

# nvm not loaded in non-interactive SSH — source it so `wasp`/`npx` resolve
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "==> git pull"
git pull origin main

echo "==> wasp build (server image source -> .wasp/out)"
wasp build

echo "==> build + start containers (server + db)"
docker compose up -d --build

echo "==> wait for server, run migrations (Wasp also auto-migrates on boot)"
sleep 5
docker compose exec -T server npx prisma migrate deploy \
  || echo "explicit migrate skipped — relying on server boot auto-migrate"

echo "==> build client static (Wasp 1.x: vite build at project root)"
REACT_APP_API_URL="$API_URL" npx vite build
# output: .wasp/out/web-app/build  (SPA fallback = 200.html, no index.html)

echo "==> publish client to aaPanel docroot"
mkdir -p "$CLIENT_WEBROOT"
rm -rf "${CLIENT_WEBROOT:?}"/*
cp -r "$APP_DIR/.wasp/out/web-app/build/." "$CLIENT_WEBROOT"/

echo "==> done. logs: docker compose logs -f server"
