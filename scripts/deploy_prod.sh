#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/landing.esterholdings.com}"
PM2_APP_NAME="${PM2_APP_NAME:-landing-esterholdings}"
APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-3002}"
NODE_BIN_DIR="${NODE_BIN_DIR:-/opt/node-v20.20.1/bin}"
NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://${APP_HOST}:${APP_PORT}/}"
RELEASE_SHA="${RELEASE_SHA:-}"

log() {
  printf '[landing-deploy] %s\n' "$*"
}

fail() {
  printf '[landing-deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

[ -d "$APP_DIR" ] || fail "Application directory does not exist: $APP_DIR"
[ -d "$APP_DIR/.git" ] || fail "Application directory is not a Git checkout: $APP_DIR"
[ -w "$APP_DIR" ] || fail "User $(id -un) cannot write to $APP_DIR"
[[ "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]] || fail "A full Git commit SHA is required"

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
command -v tar >/dev/null 2>&1 || fail "tar was not found in PATH"

node_major="$(node -p 'Number(process.versions.node.split(".")[0])')"
[ "$node_major" -ge 20 ] || fail "Node.js 20 or newer is required; found $(node --version)"

release_dir="$APP_DIR/.deploy/releases/$RELEASE_SHA"
archive="$APP_DIR/.deploy/$RELEASE_SHA/landing-output.tar.gz"
staged_output="$release_dir/.output"
backup_dir="$APP_DIR/.deploy/backups/$(date -u +%Y%m%d%H%M%S)-$RELEASE_SHA"
backup_dir="${backup_dir}-$$"

[ -s "$archive" ] || fail "Build artifact was not uploaded: $archive"
mkdir -p "$release_dir"
tar -xzf "$archive" -C "$release_dir" --no-same-owner
[ -s "$staged_output/server/index.mjs" ] || fail "Nuxt server entrypoint is missing from the uploaded artifact"

if [ -e "$APP_DIR/.output" ] || [ -L "$APP_DIR/.output" ]; then
  mkdir -p "$(dirname "$backup_dir")"
  mv "$APP_DIR/.output" "$backup_dir"
fi

if ! mv "$staged_output" "$APP_DIR/.output"; then
  if [ -e "$backup_dir" ] || [ -L "$backup_dir" ]; then
    mv "$backup_dir" "$APP_DIR/.output"
  fi
  fail "Could not activate the new build; previous output was restored"
fi

node_binary="$(command -v node)"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  log "Reloading PM2 process $PM2_APP_NAME"
  if ! pm2 reload "$PM2_APP_NAME" --update-env; then
    if [ -e "$backup_dir" ] || [ -L "$backup_dir" ]; then
      mv "$APP_DIR/.output" "$staged_output.failed"
      mv "$backup_dir" "$APP_DIR/.output"
      pm2 reload "$PM2_APP_NAME" --update-env || true
    fi
    fail "PM2 reload failed; previous output was restored when available"
  fi
else
  log "Starting PM2 process $PM2_APP_NAME"
  pm2 start "$APP_DIR/.output/server/index.mjs" \
    --name "$PM2_APP_NAME" \
    --cwd "$APP_DIR" \
    --interpreter "$node_binary"
fi

log "Waiting for health check: $HEALTHCHECK_URL"
healthcheck_ok=0
for attempt in $(seq 1 10); do
  if curl --fail --silent --show-error --max-time 3 "$HEALTHCHECK_URL" >/dev/null; then
    healthcheck_ok=1
    break
  fi

  log "Health check attempt $attempt/10 failed; retrying in 1 second"
  sleep 1
done

if [ "$healthcheck_ok" -ne 1 ]; then
  if [ -e "$backup_dir" ] || [ -L "$backup_dir" ]; then
    mv "$APP_DIR/.output" "$staged_output.failed"
    mv "$backup_dir" "$APP_DIR/.output"
    pm2 reload "$PM2_APP_NAME" --update-env || true
  fi
  fail "Application did not pass the health check: $HEALTHCHECK_URL"
fi

pm2 save
log "Deployment of $RELEASE_SHA completed successfully"
