#!/bin/bash
set -e

SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT"

echo "📋 copying static files to nginx..."
cp -r dist/* ../nginx-on-vps/www/odnokreslo/
echo "✅ copied"
