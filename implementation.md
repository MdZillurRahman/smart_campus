# SmartCampus — Implementation Plan

## Timeline: 2–3 Weeks (Accelerated)
> Started: May 2026
> Target Completion: Late May 2026

---

## Current Status

**Active Phase:** Phase 1 — Backend Foundation
**Current Task:** Rails API scaffolding
**Last Completed:** Repo setup, docs folder created

---

## Phase Overview

| Phase | Focus                        | Duration  | Status      |
|-------|------------------------------|-----------|-------------|
| 1A    | Rails API setup + DB + Auth  | Days 1–4  | ✅ Done     |
| 1B    | Complaints API               | Days 5–7  | ✅ Done     |
| 2A    | React setup + Auth UI        | Days 8–10 | 🔄 Next     |
| 2B    | Student views                | Days 11–13| Not started |
| 2C    | Admin + Staff views          | Days 14–16| Not started |
| 3     | Integration + Polish         | Days 17–18| Not started |
| 4     | Deployment                   | Days 19–21| Not started |

---

## Phase 1A — Rails API Setup + Database + Auth
> Goal: A working Rails API that can register users, store complaints in PostgreSQL, and issue JWTs

### Tasks
- [ ] Scaffold Rails API app inside `server/` folder
- [ ] Configure PostgreSQL (`database.yml`)
- [ ] Add gems: `pg`, `rack-cors`, `bcrypt`, `jwt`, `jsonapi-serializer`
- [ ] Create and run `create_users` migration
- [ ] Create and run `create_complaints` migration
- [ ] Build `User` model with `has_secure_password` and validations
- [ ] Build `Complaint` model with validations and scopes
- [ ] Write `db/seeds.rb` with demo users and complaints
- [ ] Run `rails db:create db:migrate db:seed` — confirm data exists
- [ ] Build `ApplicationController` with `authenticate_user!` and `require_role!`
- [ ] Build `Api::V1::AuthController` — login action returns JWT
- [ ] Test login endpoint in Postman/Insomnia
- [ ] Configure CORS (`rack-cors`) to allow `localhost:5173`

### Why we do it in this order
> Database and models first — controllers are useless without working data.
> Auth next — every other endpoint depends on it.
> CORS last in this phase — it only matters when React tries to talk to Rails.

---

## Phase 1B — Complaints API
> Goal: All complaint endpoints working and testable in Postman

### Tasks
- [ ] Build `Api::V1::ComplaintsController` — `index` action (role-scoped)
- [ ] Build `create` action (student only)
- [ ] Build `assign` action (admin only)
- [ ] Build `resolve` action (admin + staff, with ownership check for staff)
- [ ] Build `reopen` action (admin only)
- [ ] Build `Api::V1::UsersController` — `index` with `?role=staff` filter
- [ ] Build `UserSerializer` and `ComplaintSerializer`
- [ ] Test every endpoint in Postman with all 3 roles
- [ ] Confirm 401 on missing token, 403 on wrong role

### Why we do it in this order
> Index and create first — they are the simplest and confirm DB read/write works.
> Custom actions (assign/resolve/reopen) next — they build on index/create.
> Serializers alongside — so responses are clean from the start, not retrofitted.

---

## Phase 2A — React Setup + Auth UI
> Goal: A running React app that can log in, store the JWT, and redirect by role

### Tasks
- [ ] Scaffold React + Vite app inside `client/` folder
- [ ] Install dependencies: React Router, Axios, React Query, React Hook Form, Zod
- [ ] Install and configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up `src/api/client.js` (Axios instance with JWT interceptor)
- [ ] Set up `AuthContext` (login, logout, persist to localStorage)
- [ ] Build `PrivateRoute` component
- [ ] Set up routes in `App.jsx` (all pages, protected by role)
- [ ] Build `Login` page — form, validation, call API, store token, redirect
- [ ] Build `Navbar` component (role-aware links, logout button)
- [ ] Test login → redirect to correct dashboard for all 3 roles
- [ ] Test protected route redirect (unauthenticated → login page)

### Why we do it in this order
> Tooling first — you cannot build UI without the foundation.
> AuthContext before any page — every page depends on knowing who is logged in.
> Login page before dashboards — you cannot reach dashboards without it.

---

## Phase 2B — Student Views
> Goal: Students can submit complaints and track them

### Tasks
- [ ] Build `StudentDashboard` — stat cards + recent complaints table
- [ ] Build `SubmitComplaint` — form with validation (React Hook Form + Zod)
- [ ] Build `MyComplaints` — full list with status/category filters
- [ ] Build `ComplaintRow` with expandable detail (description, assigned staff, resolution)
- [ ] Build `StatusBadge` and `PriorityBadge` components
- [ ] Build `ResolutionTime` util (`resolutionTime.js`)
- [ ] Build `NotificationBell` component (student notifications)
- [ ] Add loading and empty states to all views

---

## Phase 2C — Admin + Staff Views
> Goal: Admin can manage all complaints, staff can resolve their tasks

### Tasks
- [ ] Build `AdminDashboard` — all complaints table with stat cards
- [ ] Build `AssignModal` — staff dropdown, confirm assign
- [ ] Build `ResolveModal` — resolution note textarea
- [ ] Wire reopen button with confirm dialog
- [ ] Build `StaffDashboard` — task cards filtered to assigned complaints
- [ ] Build `TaskCard` component with priority colour stripe
- [ ] Wire staff resolve modal
- [ ] Add notification bells for admin and staff

---

## Phase 3 — Integration + Polish
> Goal: Frontend and backend fully connected, edge cases handled

### Tasks
- [ ] Connect all React API calls to the live Rails server (localhost:3001)
- [ ] Fix any CORS issues that appear during integration
- [ ] Test full complaint lifecycle end-to-end (submit → assign → resolve → reopen)
- [ ] Test all role restrictions in the UI (not just API)
- [ ] Add global error handling for expired JWT (auto-logout + redirect)
- [ ] Mobile responsiveness pass — test on narrow viewport
- [ ] Build `Landing` page (index.html equivalent)

---

## Phase 4 — Deployment
> Goal: Live URLs on Render (API) and Netlify (frontend)

### Tasks
- [ ] Push `server/` to GitHub (`main` branch)
- [ ] Create Render Web Service — connect GitHub repo, set root to `server/`
- [ ] Create Render PostgreSQL database — attach to web service
- [ ] Set environment variables on Render:
  - `RAILS_ENV=production`
  - `SECRET_KEY_BASE` (generate with `rails secret`)
  - `DATABASE_URL` (auto-filled by Render)
  - `ALLOWED_ORIGINS=https://your-app.netlify.app`
- [ ] Run `rails db:migrate` and `rails db:seed` on Render
- [ ] Test all API endpoints against the Render URL in Postman
- [ ] Push `client/` to GitHub
- [ ] Create Netlify site — connect GitHub repo, set base to `client/`
- [ ] Set `VITE_API_URL=https://your-api.onrender.com/api/v1` on Netlify
- [ ] Add `public/_redirects` file for React Router SPA fix
- [ ] Test full app on live URLs

---

## Decisions Log
> Record every "why did we do it this way" decision here as we go.

| Date     | Decision                                      | Reason                                                        |
|----------|-----------------------------------------------|---------------------------------------------------------------|
| May 2026 | Monorepo (client/ + server/ in one GitHub repo) | Simpler for solo dev. One place for issues and history.     |
| May 2026 | JWT over sessions                             | React frontend is on a different domain — sessions don't work cross-domain cleanly. |
| May 2026 | No Devise gem                                 | Devise is designed for session-based Rails apps. JWT auth is cleaner to implement manually for an API. |
| May 2026 | Integer PKs, display CMP001 in frontend       | Simpler DB. Format is a display concern, not a data concern. |
| May 2026 | React Query for server state                  | Avoids useEffect + useState boilerplate for every API call. Handles caching and refetching automatically. |
| May 2026 | No Redux                                      | Overkill. Auth in Context + server data in React Query covers everything. |

---

## Known Issues / Blockers
> Add anything that is blocking progress here.

_None yet._

---

## Useful Commands (Quick Reference)

```bash
# --- Server ---
cd server
rails s -p 3001            # start Rails on port 3001 (avoids clash with React)
rails db:migrate           # run pending migrations
rails db:seed              # seed demo data
rails db:reset             # drop + recreate + migrate + seed
rails routes               # list all routes
rails c                    # Rails console (test models interactively)

# --- Client ---
cd client
npm run dev                # start Vite dev server on localhost:5173
npm run build              # production build
npm run preview            # preview production build locally

# --- Git ---
git checkout -b feature/auth    # create and switch to new branch
git add . && git commit -m ""   # stage and commit
git push origin feature/auth    # push branch to GitHub
```
