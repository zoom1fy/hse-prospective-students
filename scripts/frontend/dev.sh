#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BIND="${BIND:-localhost}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../../frontend" && pwd)"

cd "$FRONTEND_DIR"

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies (bun)..."
  bun install
fi

echo "Starting frontend (dev) on http://${BIND}:${PORT}"
exec bun run dev -- --port "$PORT" --hostname "$BIND"
