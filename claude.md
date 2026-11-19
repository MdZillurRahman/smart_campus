# Claude Briefing File — SmartCampus

> Upload this file at the start of every new session.
> Keep it updated as the project progresses — update "Current Status" and "What We Did Last Session" each time.

---

## What This Project Is

SmartCampus is a **role-based campus complaint tracking system**.
Students submit complaints → Admins assign them to staff → Staff (or admin) resolves them.

This is a **rebuild** of an existing PHP/HTML/CSS app using a modern full stack.

---

## The Stack

| Part      | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 19 + Vite + Tailwind + shadcn/ui |
| Backend   | Ruby on Rails 8.1.2 (API mode)        |
| Database  | PostgreSQL 18 (start with: brew services start postgresql@18)                            |
| Auth      | JWT (manual, no Devise)               |
| Hosting   | Render (API + DB) + Netlify (React)   |

---

## Repo Structure

```
smartcampus/          ← single GitHub monorepo
├── client/           ← React app
├── server/           ← Rails API
├── *.md              ← architecture, features, rules, implementation, claude (repo root)
└── README.md
```

Local path: `smart_campus/` (based on terminal prompt observed)

---

## The 3 Roles

| Role    | What they do                                           |
|---------|--------------------------------------------------------|
| student | Submit complaints, view own complaints, track status   |
| admin   | View all complaints, assign to staff, resolve, reopen  |
| staff   | View assigned complaints only, resolve their tasks     |

---

## Superadmin

- Not a 4th role — stored as `role = "admin"` in the database
- Identified in code by: `role == "admin" && username == "superadmin"`
- Seeded directly in `db/seeds.rb` — never registerable through the UI
- Extra powers over regular admin:
  - Can approve admin-role registrations (admin can only approve staff)
  - Can create and deactivate admin accounts
  - Can deactivate any user in the system
- Enforced at application level via `current_user.superadmin?` helper in User model
- Credentials in seeds: username `superadmin`, password `super123`

## Data Models (Quick Reference)

**users:** id, username, email, password_digest, role, fullname, status (pending/approved/rejected), created_at, updated_at

**complaints:** id, student_id (FK), assigned_to_id (FK nullable), category, title, description, priority, status, resolution_note, resolved_at, created_at, updated_at

**Status flow:** Submitted → In Progress → Resolved → (Reopen) → Submitted

**Enums:**
- category: Classroom, Hostel, Lab, Security, Cafeteria, Library
- priority: High, Medium, Low
- status: Submitted, In Progress, Resolved

---

## Auth Flow (Summary)

1. POST `/api/v1/auth/login` with `{ username, password }`
2. Rails returns `{ token, user: { id, username, fullname, role } }`
3. React stores token in `localStorage` as `sc_token`
4. Every request sends `Authorization: Bearer <token>`
5. Rails decodes it in `ApplicationController#authenticate_user!`

---

## API Routes (Summary)

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register       (public — students auto-approved, staff/admin pending)
GET    /api/v1/complaints          (scoped by role)
POST   /api/v1/complaints          (student)
GET    /api/v1/complaints/:id
PATCH  /api/v1/complaints/:id/assign   (admin)
PATCH  /api/v1/complaints/:id/resolve  (admin, staff)
PATCH  /api/v1/complaints/:id/reopen   (admin)
GET    /api/v1/users?role=staff    (admin)
GET    /api/v1/users/pending       (admin)
PATCH  /api/v1/users/:id/approve   (admin)
PATCH  /api/v1/users/:id/reject    (admin)
```

---

## Key Rules (Non-Negotiable)

- No Devise gem — JWT is implemented manually
- No Redux — AuthContext + React Query only
- Passwords: bcrypt via `has_secure_password`
- `resolved_at` always set server-side, never from client
- Staff can only resolve their OWN assigned complaints (enforced server-side)
- All routes under `/api/v1/`
- Commits follow Conventional Commits format (`feat:`, `fix:`, `chore:` etc.)
- Feature branches → PR into `dev`/`staging` → merge to `main` only when stable

---

## Environment Variables

**Server (Render / local `.env`):**
- `DATABASE_URL`
- `SECRET_KEY_BASE`
- `ALLOWED_ORIGINS`
- `RAILS_ENV`

**Client (Netlify / local `.env`):**
- `VITE_API_URL`

---

## Live URLs

| Part     | URL |
|----------|-----|
| Frontend (Netlify) | https://smartcampusissuetracking.netlify.app |
| API (Render)       | https://smartcampus-api-ml3z.onrender.com |

> The frontend was confirmed loading on 2026-11-18. The API URL is as reported by the developer — it could not be fetched from the review environment, so verify it with a login request.

---

## Current Status

> ⚠️ UPDATE THIS SECTION AT THE END OF EVERY SESSION

**Overall:** Phases 1–4 complete — the app is deployed. Now in post-launch polish.
**Last updated:** 2026-11-19

**Built and deployed**
- Rails API: JWT auth, registration with hybrid approval, complaints (index/show/create/assign/resolve/reopen), users (index/pending/approve/reject), serializers, seeds
- React client: Login, Register, landing page, student views, admin dashboard, staff dashboard, assign/resolve modals, pending approvals page, global expired-JWT handling
- Deployed: API on Render, client on Netlify (production DB seeded via the Render build command)

**In review (PR into `staging`, branch `feature/navbar-notifications`)**
- `Navbar` (role-aware links, mobile menu, logout) rendered by `PrivateRoute`
- `NotificationBell` — student status updates, admin unassigned complaints, staff open tasks (derived client-side from the complaints list; polls every 60s)
- `ComplaintSerializer` now exposes `updated_at`
- Per-page logout buttons removed (the navbar replaces them)

**Next**
- Test and merge the navbar/notifications PR, then promote `staging` → `main`
- Enforce `status == approved` at login and in `authenticate_user!` (pending/rejected users can currently log in)
- Change the production `superadmin` password (production was seeded with the default seed passwords)
- Add `.env.example` files so a fresh clone is easy to run
- Phase 2 features: email notifications on approval/assignment/resolution, comments thread, file attachments
- Phase 3 features: search, pagination, analytics

**Local setup reminder**
- `server/.env`: `SECRET_KEY_BASE`, `ALLOWED_ORIGINS=http://localhost:5173`
- `client/.env`: `VITE_API_URL=http://localhost:3001/api/v1`
- PostgreSQL running → `bin/rails db:create db:migrate db:seed` → `bin/rails s -p 3001`; client: `npm run dev`
- Seed logins (local/demo): `superadmin`/`super123`, `staff1`/`staff123`, `student1`/`student123`, `student2`/`student123`. There is no `admin1` user.

**Session history (short)**
1. Repo + docs created
2. Rails API (models, auth, complaints, users, serializers, seeds) tested in Postman
3. React setup + auth UI
4. Student views → admin + staff views
5. Integration, JWT expiry handling, registration, landing page
6. Deployment (Render + Netlify), production.rb fixed for API mode, pending approvals page
7. Navbar + notification bell (PR in review); docs refreshed

---

## My Role in This Project

I am both **mentor and assistant**:
- I explain **why** we do things, not just what to type
- I flag bad practices before they become habits
- I make decisions and defend them — I won't just agree with everything
- I keep the big picture in mind while we work on small pieces

The developer (you) already knows the fundamentals. You need:
1. Rails/React specific guidance
2. Architectural reasoning
3. Fast, focused sessions with clear next steps

---

## Useful Context

- Developer is on macOS (arm64), Ruby 3.2.10, Rails 8.1.2, Node v25.6.1
- Developer is comfortable with PHP, HTML, CSS — learning Rails + React
- We are aiming for 2–3 week completion (accelerated from original 6-week plan)
- The original PHP app is fully documented in `SmartCampus_Documentation.docx`
- Detailed rebuild plan is in `SmartCampus_v2_BuildPlan.docx`
