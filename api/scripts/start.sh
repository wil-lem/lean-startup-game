#!/usr/bin/env bash

set -euo pipefail

# Ensure Laravel writable directories exist with proper permissions.
mkdir -p storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

if [[ "${RUN_MIGRATIONS:-false}" == "true" ]]; then
  php artisan migrate --force
fi

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
