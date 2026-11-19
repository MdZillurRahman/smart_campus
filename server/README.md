# SmartCampus — Server (Rails API)

Rails 8.1 API-only app (Ruby 3.2.10) with PostgreSQL. Authentication is JWT, implemented by hand in `ApplicationController` (no Devise). The React client in `../client` talks to it over JSON.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Ruby | 3.2.10 (pinned in `.ruby-version` and the `Gemfile`) | `ruby -v` |
| Bundler | any recent | `bundle -v` |
| PostgreSQL | running locally; any recent version | `psql --version` |

Install Ruby with a version manager (`rbenv install 3.2.10`, `asdf install ruby 3.2.10`, …). On macOS with Homebrew, start Postgres with `brew services start postgresql@18` (or whichever version you installed).

## Run it locally

All commands are run from this `server/` folder.

**1. Create your environment file**
```bash
cp .env.example .env
```
Open `.env` and set a real secret:
```bash
bin/rails secret      # copy the output into SECRET_KEY_BASE=
```
| Variable | Purpose |
|----------|---------|
| `SECRET_KEY_BASE` | **Required.** Signs the JWTs. The app will not boot without it. |
| `ALLOWED_ORIGINS` | Frontend origin(s) allowed by CORS. Default `http://localhost:5173`. Comma-separate several. |
| `DATABASE_URL` | Production only (Render sets it). Locally the database is `smartcampus_development` on your local Postgres. |

**2. Install gems**
```bash
bundle install
```

**3. Create, migrate and seed the database**
```bash
bin/rails db:create db:migrate db:seed
```
The seed is safe to run again (it uses `find_or_create_by`).

**4. Start the server on port 3001**
```bash
bin/rails s -p 3001
```
The API is now at `http://localhost:3001/api/v1`. The root URL (`/`) has no page; to check it is alive, log in:
```bash
curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"super123"}'
```
You should get back a `token` and a `user`.

Now run the client (see `../client/README.md`).

## Seeded accounts

| Username | Password | Role |
|----------|----------|------|
| `superadmin` | `super123` | admin (the only seeded admin) |
| `staff1` | `staff123` | staff |
| `student1`, `student2` | `student123` | student |

There is no `admin1`. The seed also creates 5 sample complaints in different states. These passwords are public, so use fake data only.

## Registration and approval

- Students who register are approved immediately.
- Staff and admin registrations are `pending` and **cannot log in** until an admin approves them (superadmin approves admins). Pending and rejected users get a clear message at login.
- `status` is set on the server only; the client can never send it.

## API endpoints (all under `/api/v1`)

| Method | Path | Who |
|--------|------|-----|
| POST | `/auth/login` | public |
| POST | `/auth/register` | public |
| GET | `/complaints`, `/complaints/:id` | any role (scoped to the user's role) |
| POST | `/complaints` | student |
| PATCH | `/complaints/:id/assign` | admin (not for Resolved complaints) |
| PATCH | `/complaints/:id/resolve` | admin, or the assigned staff member (note required) |
| PATCH | `/complaints/:id/reopen` | admin (Resolved complaints only) |
| GET | `/users?role=staff` | admin |
| GET | `/users/pending` | admin |
| PATCH | `/users/:id/approve`, `/users/:id/reject` | admin |

Send `Authorization: Bearer <token>` on everything except login and register. Full details are in the root `architecture.md`.

## Useful commands

```bash
bin/rails db:reset      # drop, recreate, migrate and re-seed (deletes local data)
bin/rails console       # open a Rails console
bin/rails routes        # list all routes
bin/rubocop             # style check
bin/brakeman            # security scan
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `KeyError: key not found: "SECRET_KEY_BASE"` | `server/.env` is missing or has no `SECRET_KEY_BASE`. Do step 1. |
| `PG::ConnectionBad … could not connect` | PostgreSQL isn't running. Start it (`brew services start postgresql@18`, or `sudo service postgresql start` on Linux). |
| `role "yourname" does not exist` | Create a Postgres role for your OS user: `createuser -s $(whoami)`. |
| `Your Ruby version is X, but your Gemfile specified 3.2.10` | Install and switch to Ruby 3.2.10. |
| Login says "Invalid username or password" | Use a seeded username from the table above. Usernames are case-sensitive. |
| Browser shows a CORS error | `ALLOWED_ORIGINS` must exactly match the frontend origin (scheme, host, port, no trailing slash). Restart Rails after editing `.env`. |
| Port 3001 already in use | Stop the other process, or pick another port and update `VITE_API_URL` in the client. |

## Production (Render)

Set these environment variables: `DATABASE_URL`, `SECRET_KEY_BASE`, `ALLOWED_ORIGINS` (the Netlify URL, no trailing slash) and `RAILS_ENV=production`. Production runs in API mode (no Active Storage, Solid Cache or Solid Queue). More in the root `architecture.md`.
