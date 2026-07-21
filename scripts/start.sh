#!/usr/bin/env bash

set -euo pipefail

# Ensure Laravel writable directories exist with proper permissions.
mkdir -p storage bootstrap/cache storage/framework/views storage/framework/cache storage/framework/sessions
chmod -R ug+rwx storage bootstrap/cache

# Build caches from runtime env (APP_URL/ASSET_URL) instead of image-build defaults.
php artisan config:clear || true
php artisan route:clear || true
php artisan config:cache || true
php artisan route:cache || true

if [[ "${RUN_MIGRATIONS:-false}" == "true" ]]; then
  php artisan migrate --force
fi

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
