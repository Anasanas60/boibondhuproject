# Deployment Guide — BoiBondhu

This document describes the minimal steps to deploy the BoiBondhu frontend (Vite/React) and backend (PHP) to production using Vercel (frontend) and Render (or similar) for the PHP API. It also includes the required environment variables, Postgres setup instructions, and a short troubleshooting section.

## 1) Environment variables (required)
Set these in your hosting provider's UI (Vercel/Render) or in a secrets manager. Do NOT commit them to source control.

Database (preferred single URL):
- `DATABASE_URL` — Postgres connection string, e.g. `postgres://user:password@db-host:5432/dbname`

Or split form if needed:
- `DB_HOST` (or `PGHOST`)
- `DB_PORT` (or `PGPORT`) — default: `5432`
- `DB_NAME` (or `PGDATABASE`)
- `DB_USER` (or `PGUSER`)
- `DB_PASSWORD` (or `PGPASSWORD`)

App & runtime:
- `APP_ENV` — `production` or `development` (controls error output)
- `DEBUG` — `1` or `0` (optional)

Frontend / API base:
- `VITE_API_BASE_URL` — Full URL to your API, e.g. `https://api.example.com` (used by the built frontend)
- `API_BASE_URL` — fallback used by some server-side code (optional)

CORS / uploads / misc:
- `ALLOWED_ORIGINS` — comma-separated allowed origins for CORS (optional)
- `CORS_ALLOW_CREDENTIALS` — `true`/`false` (optional)
- `UPLOADS_DIR` — absolute path on the backend server where uploaded files are stored (optional; for Render use `/tmp/uploads` or persistent storage)
- `UPLOADS_PUBLIC_PATH` — (optional) public URL prefix if uploads are served from a CDN

Secrets & logging (optional):
- `APP_SECRET` or `SECRET_KEY` — signing key for tokens/session if added
- `LOG_LEVEL` — `info|warn|error` (optional)

## 2) Build commands

Frontend (run in the project root where `package.json` lives):

```powershell
npm install
npm run build
```

This produces a `dist/` directory. Make sure `VITE_API_BASE_URL` is set in Vercel (or your CI) before building so the production bundle points to the right API.

Backend (PHP):

There is no build step for the PHP backend. Deploy the `api/` folder to your PHP host (Render, Fly, or a VPS) and ensure PHP 8+ is available.

## 3) Deployment steps

a) Frontend — Vercel (recommended)

1. Sign in to Vercel and import the repository.
2. Set the root to the project root (where `package.json` is located).
3. In Environment Variables, set `VITE_API_BASE_URL` to your API URL (e.g., `https://api.example.com`).
4. Vercel build command: `npm run build` (default)
5. Output directory: `dist`
6. Deploy. Verify the production site loads and requests go to the API URL.

b) Backend — Render (Web Service) or any PHP host

Render (Web Service with PHP):
1. Create a new Web Service in Render and connect the repository. Set the root directory to the project root.
2. Set the start command to your web server configuration (Render's PHP services use a default PHP runtime). Ensure the `api/` directory is exposed as the web root or mapped appropriately.
3. Add environment variables listed above (DATABASE_URL, APP_ENV, UPLOADS_DIR, etc.).
4. Ensure persistent storage for uploads (or configure uploading to S3/CSP). Render's filesystem is ephemeral — prefer object storage for persistence.
5. Deploy and check logs.

Alternative hosts: DigitalOcean App Platform, Fly, Heroku (PHP buildpack), or a traditional VPS with Nginx + PHP-FPM. Ensure PHP version >= 7.4 (recommended 8.0+) and PDO pgsql extension is enabled.

## 4) Database setup — PostgreSQL

Local quickstart (psql):

```powershell
# Create DB and user (adjust names/passwords as needed)
psql -U postgres -c "CREATE USER boibondhu_user WITH PASSWORD 'securepassword';"
psql -U postgres -c "CREATE DATABASE boibondhu OWNER boibondhu_user;"
# Apply schema
psql -U boibondhu_user -d boibondhu -f api/init_db_postgres.sql
psql -U boibondhu_user -d boibondhu -f api/create_messages_table_postgres.sql
psql -U boibondhu_user -d boibondhu -f api/migrate_listings_postgres.sql
psql -U boibondhu_user -d boibondhu -f api/add_profile_picture_column_postgres.sql
```

If your host provides a Postgres addon (Render, Heroku, Railway):
1. Create the Postgres service in the host panel.
2. Copy the `DATABASE_URL` and set it as an environment variable on your backend service.
3. Connect to the DB using psql or the provider's web console and run the `*_postgres.sql` files above.

Notes on migrations:
- The provided `*_postgres.sql` files are conservative conversions from the original MySQL DDL. Review them for indexes and production tuning (e.g., additional indexes on frequently queried columns).
- If you have existing MySQL data, use a migration tool (like `pgloader`) or export/import with transformation for data types.

## 5) Troubleshooting — common issues

- Build shows `localhost` in `dist/` after build:
  - Ensure `VITE_API_BASE_URL` is set in your build environment (Vercel env vars or CI). Then rebuild: `npm run build`.

- Database connection fails with `could not connect`:
  - Verify `DATABASE_URL` or `DB_*` env vars are correct and the host allows connections (firewall, VPC). Use `psql` locally to test connectivity.

- `PDOException` or missing pgsql driver:
  - Ensure the PHP build includes the `pdo_pgsql` extension. On Ubuntu/Debian: `sudo apt install php-pgsql` and restart PHP-FPM.

- File uploads disappear after deploy:
  - Many PaaS providers use ephemeral file systems. Use S3 (or provider storage) for persistent uploads. Alternatively, mount a persistent volume and set `UPLOADS_DIR` to that path.

- CORS errors in browser console:
  - Configure `ALLOWED_ORIGINS` (or `VITE_API_BASE_URL`) on the backend and set `APP_ENV=production`. Avoid using `Access-Control-Allow-Origin: *` in production.

- Frontend shows 404 on assets after deploy:
  - Ensure the build output directory is `dist` and the host is serving the `dist` folder. On Vercel the default static settings will work if output directory is `dist`.

- `npm run build` fails because of Node/npm mismatch:
  - Align Node and npm versions. Use LTS Node (recommended) or update npm. Example (install nvm and set Node 18+):

```powershell
# Using nvm-windows example: install Node 18 or 20 and use it for CI/build
nvm install 18.20.0
nvm use 18.20.0
npm install
npm run build
```

## Helpful commands & checks

```powershell
# Check Postgres connectivity
psql "$env:DATABASE_URL"

# Run SQL file
psql -d postgres -f api/init_db_postgres.sql

# Test PHP script locally (built-in server) - not for production
php -S localhost:8000 -t api/
```

## Final notes
- Keep secrets out of source control. Use your platform's environment variable management and secret storage.
- Prefer object storage for uploads in production.
- Run the Postgres migration scripts in a test environment before migrating production data.

If you'd like, I can add a simple GitHub Actions workflow that builds the frontend and fails if `localhost` appears in the `dist/` output, and/or a Render deployment template for the backend.
