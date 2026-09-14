#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BIND="${BIND:-0.0.0.0}"
SKIP_BUILD="${SKIP_BUILD:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../../frontend" && pwd)"

cd "$FRONTEND_DIR"

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies (bun)..."
  bun install --frozen-lockfile
fi

if [ "$SKIP_BUILD" != "1" ]; then
  echo "Building frontend (production)..."
  bun run build
fi

echo "Starting frontend (prod) on http://${BIND}:${PORT}"
PORT=$PORT HOSTNAME=$BIND exec bun run start -- --port "$PORT" --hostname "$BIND"
