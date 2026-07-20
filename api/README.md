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

From the `api` directory:

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
