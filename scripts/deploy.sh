#!/bin/bash

set -e

# build client static files
./build.sh

./copy-static-files-to-nginx.sh

./reload-nginx.sh

echo "🚀 Deployment complete!"
