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
| Database  | PostgreSQL                            |
| Auth      | JWT (manual, no Devise)               |
| Hosting   | Render (API + DB) + Netlify (React)   |

---

## Repo Structure

```
smartcampus/          ← single GitHub monorepo
├── client/           ← React app
├── server/           ← Rails API
├── docs/             ← all these .md files
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

**users:** id, username, email, password_digest, role, fullname, created_at, updated_at

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
GET    /api/v1/complaints          (scoped by role)
POST   /api/v1/complaints          (student)
GET    /api/v1/complaints/:id
PATCH  /api/v1/complaints/:id/assign   (admin)
PATCH  /api/v1/complaints/:id/resolve  (admin, staff)
PATCH  /api/v1/complaints/:id/reopen   (admin)
GET    /api/v1/users?role=staff    (admin)
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
- Feature branches → PR into `dev` → merge to `main` only when stable

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

## Current Status

> ⚠️ UPDATE THIS SECTION AT THE END OF EVERY SESSION

**Active Phase:** Phase 2A — React Setup + Auth UI
**What was completed last session:**
- Scaffolded Rails API inside `server/`
- Configured PostgreSQL, CORS, environment variables
- Wrote and ran all migrations (users + complaints + add_status_to_users)
- Built User and Complaint models with validations and scopes
- Built ApplicationController with JWT auth (authenticate_user!, require_role!)
- Built AuthController (login)
- Built RegistrationsController (hybrid approval — students auto-approved, staff/admin pending)
- Built ComplaintsController (index, show, create, assign, resolve, reopen)
- Built UsersController (index, pending, approve, reject)
- Built UserSerializer and ComplaintSerializer
- Seeded database with superadmin, staff1, student1, student2 + 5 complaints
- Tested all endpoints in Postman — all passing
- Merged feature/rails-setup → dev → staging

**What to do next session:**
- Start Phase 2A — scaffold React + Vite inside `client/`
- Install and configure Tailwind CSS + shadcn/ui
- Set up Axios client with JWT interceptor
- Build AuthContext and PrivateRoute
- Build Login page
- Build Registration page with role selector

**Active Phase:** Phase 1A — Rails API Setup
**What was completed last session:**
- Created GitHub monorepo (`smart_campus`)
- Created `docs/` folder with: `architecture.md`, `features.md`, `rules.md`, `implementation.md`, `claude.md`

**What to do next session:**
- Scaffold Rails API app inside `server/` folder
- Configure PostgreSQL
- Add gems and run first migration

**Active Phase:** Phase 2B — Student Views

**What was completed last session:**
- Scaffolded React + Vite inside client/
- Installed all dependencies (Axios, React Query, React Router, RHF, Zod)
- Configured Tailwind CSS v4 and shadcn/ui
- Set up Axios client with JWT interceptor (src/api/client.js)
- Built AuthContext with login, logout, localStorage persistence
- Built PrivateRoute with role-based protection
- Built Login page with Zod validation and error handling
- Set up all routes in App.jsx with placeholder dashboards
- Tested login → correct redirect for all 3 roles (superadmin, student1, staff1)

**What to do next session:**
- Build StudentDashboard (stat cards + recent complaints)
- Build SubmitComplaint page
- Build MyComplaints page with filters
- Build StatusBadge and PriorityBadge components
- Build ComplaintRow with expandable detail

**Active Phase:** Phase 2C — Admin + Staff Views

**What was completed last session:**
- Built StatusBadge and PriorityBadge components
- Built ComplaintRow with expandable detail
- Built resolutionTime util
- Built useComplaints hook with jsonapi-serializer normalization fix
- Built StudentDashboard with stat cards and recent complaints
- Built SubmitComplaint form with Zod validation
- Built MyComplaints with status/category filters
- Updated App.jsx with all student routes
- Tested all student flows end to end — working

**What to do next session:**
- Build AdminDashboard with all complaints + stat cards
- Build AssignModal (staff dropdown)
- Build ResolveModal (resolution note)
- Build reopen confirmation
- Build StaffDashboard with assigned task cards
- Build TaskCard with priority colour stripe
- Wire staff resolve modal

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
