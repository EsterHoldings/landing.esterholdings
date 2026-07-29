#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/landing.esterholdings.com}"
PM2_APP_NAME="${PM2_APP_NAME:-landing-esterholdings}"
APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-3002}"
NODE_BIN_DIR="${NODE_BIN_DIR:-/opt/node-v20.20.1/bin}"
NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://${APP_HOST}:${APP_PORT}/}"

log() {
  printf '[landing-deploy] %s\n' "$*"
}

fail() {
  printf '[landing-deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

on_error() {
  local exit_code=$?
  printf '[landing-deploy] FAILED at line %s (exit code %s)\n' "${BASH_LINENO[0]}" "$exit_code" >&2

  if command -v pm2 >/dev/null 2>&1; then
    pm2 logs "$PM2_APP_NAME" --lines 60 --nostream 2>/dev/null || true
  fi

  exit "$exit_code"
}

trap on_error ERR

[ -d "$APP_DIR" ] || fail "Application directory does not exist: $APP_DIR"
[ -d "$APP_DIR/.git" ] || fail "Application directory is not a Git checkout: $APP_DIR"
[ -f "$APP_DIR/package.json" ] || fail "package.json was not found in $APP_DIR"
[ -f "$APP_DIR/yarn.lock" ] || fail "yarn.lock was not found in $APP_DIR"
[ -w "$APP_DIR" ] || fail "User $(id -un) cannot write to $APP_DIR"

if [ -d "$NODE_BIN_DIR" ]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi

export CI=1
export NODE_ENV=production
export NODE_OPTIONS
export HOST="$APP_HOST"
export PORT="$APP_PORT"
export NITRO_HOST="$APP_HOST"
export NITRO_PORT="$APP_PORT"

command -v node >/dev/null 2>&1 || fail "Node.js was not found in PATH"
command -v pm2 >/dev/null 2>&1 || fail "PM2 was not found in PATH"
command -v curl >/dev/null 2>&1 || fail "curl was not found in PATH"

node_major="$(node -p 'Number(process.versions.node.split(".")[0])')"
[ "$node_major" -ge 20 ] || fail "Node.js 20 or newer is required; found $(node --version)"

if command -v yarn >/dev/null 2>&1; then
  yarn_command=(yarn)
elif command -v corepack >/dev/null 2>&1; then
  yarn_command=(corepack yarn)
else
  fail "Yarn and Corepack were not found in PATH"
fi

cd "$APP_DIR"

log "Commit: $(git rev-parse --short HEAD)"
log "Node: $(node --version)"
log "Yarn: $("${yarn_command[@]}" --version)"

log "Installing locked dependencies"
"${yarn_command[@]}" install --frozen-lockfile --non-interactive --production=false

log "Building Nuxt SSR application"
"${yarn_command[@]}" build

entrypoint="$APP_DIR/.output/server/index.mjs"
[ -f "$entrypoint" ] || fail "Nuxt server entrypoint was not created: $entrypoint"

node_binary="$(command -v node)"

if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  log "Reloading PM2 process $PM2_APP_NAME"
  pm2 reload "$PM2_APP_NAME" --update-env
else
  log "Starting PM2 process $PM2_APP_NAME"
  pm2 start "$entrypoint" \
    --name "$PM2_APP_NAME" \
    --cwd "$APP_DIR" \
    --interpreter "$node_binary"
fi

log "Waiting for health check: $HEALTHCHECK_URL"
healthcheck_ok=0

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error \
    --max-time 5 \
    "$HEALTHCHECK_URL" \
    >/dev/null; then
    healthcheck_ok=1
    break
  fi

  log "Health check attempt $attempt/30 failed; retrying in 2 seconds"
  sleep 2
done

if [ "$healthcheck_ok" -ne 1 ]; then
  fail "Application did not pass the health check: $HEALTHCHECK_URL"
fi

pm2 save

log "Deployment completed successfully"
