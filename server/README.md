# SmartCampus — Server

Rails 8.1 API-only app (Ruby 3.2.10) with PostgreSQL. JWT auth is implemented manually in `ApplicationController`.

## Setup
Create `server/.env` (git-ignored):
```
SECRET_KEY_BASE=<bin/rails secret>
ALLOWED_ORIGINS=http://localhost:5173
```
PostgreSQL must be running (development DB is `smartcampus_development`, no password).
```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/rails s -p 3001
```

## Seeded accounts
`superadmin`/`super123`, `staff1`/`staff123`, `student1`/`student123`, `student2`/`student123`. The seed is idempotent.

## Endpoints (all under `/api/v1`)
- `POST auth/login`, `POST auth/register`
- `GET complaints`, `GET complaints/:id`, `POST complaints`, `PATCH complaints/:id/assign|resolve|reopen`
- `GET users?role=`, `GET users/pending`, `PATCH users/:id/approve|reject`

Full table in the root `architecture.md`.

## Production (Render)
Env vars: `DATABASE_URL`, `SECRET_KEY_BASE`, `ALLOWED_ORIGINS` (the Netlify URL), `RAILS_ENV=production`.
Production runs in API mode (no active_storage / solid_cache / solid_queue).
