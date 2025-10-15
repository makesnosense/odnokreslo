#!/bin/bash
set -e

SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

docker run --rm \
  -v "$(pwd)":/app \
  -v /app/node_modules \
  -v /app/.astro \
  -w /app \
  node:alpine \
  sh -c "npm ci && npm run build"
rm -rf node_modules .astro
echo "✅ build complete"
