#!/usr/bin/env bash
set -euo pipefail

IMAGE="${IMAGE:-hse-prospective-students-frontend}"
PORT="${PORT:-3000}"
NO_BUILD="${NO_BUILD:-0}"
DETACH="${DETACH:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../../frontend" && pwd)"

if [ "$NO_BUILD" != "1" ]; then
  echo "Building Docker image ${IMAGE}..."
  docker build -t "$IMAGE" "$FRONTEND_DIR"
fi

RUN_ARGS=(run --rm -p "${PORT}:3000")
if [ "$DETACH" = "1" ]; then
  RUN_ARGS+=(-d)
fi

echo "Starting container on http://localhost:${PORT}"
exec docker "${RUN_ARGS[@]}" "$IMAGE"
