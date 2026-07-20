# Lean Startup Game (App Layer)

This repository contains a Laravel 10 backend and a Vue 3 frontend for a classroom-style lean startup simulation game.

This README focuses on the application layer only (backend + frontend) and intentionally ignores Docker runtime details.

## Stack

- Backend: Laravel 10, PHP 8.1+, Eloquent ORM, API and web routes
- Frontend: Vue 3 (single mounted app), Vite, Axios, Chart.js, Vue Matomo
- Database: Laravel migrations for `games` and `players`

## High-Level Architecture

1. Browser requests `/`.
2. Laravel web route renders `resources/views/welcome.blade.php`.
3. Vite loads `resources/js/app.js`.
4. Vue mounts `LeanStartupGame.vue` into `#app`.
5. Vue sends Axios calls to Laravel API endpoints under `/api/*`.
6. Laravel controllers use Eloquent models to create/read rows in MySQL/PostgreSQL/SQLite.

## Backend and Frontend Interaction

### Frontend entry and mount

- `resources/views/welcome.blade.php` serves the HTML shell and Vite bundle.
- `resources/js/app.js` creates and mounts Vue, registers `lean-startup-game`, and injects Axios via `app.config.globalProperties.$axios`.

### API calls made by the frontend

In `resources/js/components/LeanStartupGame.vue`:

- `newGame()` calls `POST /api/game/new`
- `joinGame()` calls `POST /api/game/join`

### Backend API routes and controllers

In `routes/api.php`:

- Registered route: `POST /api/game/new` -> `GameController::new`

In controllers:

- `app/Http/Controllers/GameController.php` currently defines `post()` (not `new()`)
- `app/Http/Controllers/PlayerController.php` defines `post()` with validation and `Player::create(...)`, but no route is currently wired for it

### Important current mismatch

There is a route/controller mismatch and a missing route:

1. `POST /api/game/new` points to `GameController::new`, but `GameController` only has `post()`.
2. Frontend calls `POST /api/game/join`, but no `/api/game/join` route exists.

As-is, those frontend API actions will fail until route/controller names are aligned and join route behavior is implemented.

## Does the app need database access?

Short answer: yes, for API-backed game/session persistence.

Why:

- `GameController` uses `Game::create()`.
- `PlayerController` validates `exists:games,id` and creates `Player` rows.
- Migrations create concrete tables:
  - `database/migrations/2024_03_25_203836_create_games_table.php`
  - `database/migrations/2024_03_25_204302_create_players_table.php`

Without a configured database and migrated schema, backend API endpoints that create or validate games/players will fail.

Note: most gameplay mechanics (round logic, inventory updates, opinion cards) currently run in frontend memory in Vue classes/components.

## Local Development (without Docker)

From the repository root:

1. Install PHP dependencies
	- `composer install`
2. Create environment file
	- `cp .env.example .env`
3. Generate app key
	- `php artisan key:generate`
4. Configure database in `.env` (`DB_*` values)
5. Run migrations
	- `php artisan migrate`
6. Install frontend dependencies
	- `npm install`
7. Start Laravel server
	- `php artisan serve`
8. Start Vite dev server
	- `npm run dev`

Open the app URL shown by Laravel (usually `http://127.0.0.1:8000`).

## Deploy with Coolify + Traefik (Nixpacks)

This app now includes `nixpacks.toml` and a startup script at `scripts/start.sh` to support deployment via Coolify using Nixpacks.

### Coolify service settings

1. Create an application in Coolify from this Git repository.
2. Set **Build Pack** to `Nixpacks`.
3. Set **Base Directory** to repository root (`/` or empty, depending on your Coolify version).
4. Set a public domain on the service (Traefik handles TLS and routing).
5. Expose the service as HTTP (container listens on `${PORT}` passed by platform).

### Required environment variables

At minimum:

- `APP_NAME=Lean Startup Game`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=base64:...` (generate once with `php artisan key:generate --show`)
- `APP_URL=https://your-domain.example`
- `LOG_CHANNEL=stack`
- `LOG_LEVEL=info`
- `DB_CONNECTION=mysql`
- `DB_HOST=<coolify-db-hostname>`
- `DB_PORT=3306`
- `DB_DATABASE=<db-name>`
- `DB_USERNAME=<db-user>`
- `DB_PASSWORD=<db-password>`
- `SESSION_DRIVER=file`
- `CACHE_DRIVER=file`
- `QUEUE_CONNECTION=sync`

Optional:

- `RUN_MIGRATIONS=true` to run `php artisan migrate --force` on container start.
- `ASSET_URL=https://your-domain.example` when serving assets from a CDN or separate host.
- `MAIL_*` values when sending real email from production.
- `REDIS_*` values when using redis-backed cache/session/queue.
- `AWS_*` values when using S3 storage.
- `SANCTUM_STATEFUL_DOMAINS` only if you later use Sanctum SPA auth across domains.

### Coolify env setup steps

1. Open your application in Coolify.
2. Go to the **Environment Variables** tab.
3. Add all required variables from the list above.
4. Save, then trigger **Redeploy**.
5. Check deployment logs for `Application key set successfully` (if set during build), successful Laravel boot, and successful DB connection.

Suggested starter values for Coolify:

```env
APP_NAME="Lean Startup Game"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:REPLACE_WITH_GENERATED_KEY
APP_URL=https://your-domain.example

LOG_CHANNEL=stack
LOG_LEVEL=info

DB_CONNECTION=mysql
DB_HOST=REPLACE_WITH_DATABASE_HOST
DB_PORT=3306
DB_DATABASE=REPLACE_WITH_DATABASE_NAME
DB_USERNAME=REPLACE_WITH_DATABASE_USER
DB_PASSWORD=REPLACE_WITH_DATABASE_PASSWORD

SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

RUN_MIGRATIONS=true
```

How to generate `APP_KEY`:

1. Run once in the repository root: `php artisan key:generate --show`
2. Copy the returned `base64:...` value into Coolify as `APP_KEY`

### What Nixpacks does in this project

1. Installs PHP and Node dependencies (`composer install`, `npm ci`).
2. Builds frontend assets (`npm run build`).
3. Caches Laravel config/routes/views for production.
4. Starts Laravel on `0.0.0.0:${PORT}` so Traefik can route traffic to the container.

### Notes

- This app uses API endpoints for game creation and player persistence, so a database service is required in production.
- If you enable `RUN_MIGRATIONS=true`, keep at least one healthy instance during rolling updates to avoid downtime on long migrations.
- Current application logic still has API route mismatches (`/api/game/new` method name and missing `/api/game/join` backend route), which affect gameplay API actions after deployment.

### Troubleshooting: "Nixpacks failed to detect the application type"

If Coolify shows this error:

1. Verify **Build Pack** is `Nixpacks`.
2. Set **Base Directory** to repository root (`/` or empty).
3. Ensure `nixpacks.toml` is at that same root (already true in this repo).
4. Redeploy after saving settings.

Why this happens:

- Nixpacks auto-detection checks the selected app root for framework files (`composer.json`, `package.json`, etc.).
- Nixpacks must run from the directory containing `composer.json` and `package.json` (now repository root).

### Troubleshooting: Nix profile conflict during build

If you see an error like:

- `Unable to build profile. There is a conflict for ... node ... lldb_commands.py`

Use this repo's current Nixpacks config (single provider):

- `providers = ["php"]` in `nixpacks.toml`

Reason:

- Enabling both `php` and `node` providers can install two different Node toolchains in separate Nix profile generations, which may conflict on shared doc files.

After changing config:

1. Save and push changes.
2. In Coolify, trigger a fresh redeploy.
3. If your Coolify version supports it, clear build cache once before redeploy.

## Project Map (app layer)

- `routes/web.php`: web entry route (`/`)
- `routes/api.php`: API endpoints under `/api`
- `app/Http/Controllers`: API controller logic
- `app/Models`: Eloquent models (`Game`, `Player`)
- `database/migrations`: relational schema
- `resources/views/welcome.blade.php`: page shell
- `resources/js/app.js`: Vue bootstrap
- `resources/js/components/LeanStartupGame.vue`: main gameplay and API calls

## Recommended Next Fixes

1. Align route method names (`GameController::new` vs existing `post`).
2. Implement and register `/api/game/join` endpoint.
3. Add feature tests for game creation/join flows.
4. Consider moving static login hash authentication to Laravel auth middleware if real users are needed.
