# SmartCampus — Implementation Plan

## Timeline: 2–3 Weeks (Accelerated)
> Started: May 2026
> Phases 1–4 completed and deployed in May 2026. Post-launch work continues.

---

## Current Status

**Overall:** All planned phases complete; deployed. Post-launch polish in progress.
**Live:** Frontend https://smartcampusissuetracking.netlify.app · API https://smartcampus-api-ml3z.onrender.com
**Merged:** Navbar + NotificationBell, docs refresh. **In review:** `fix/hardening-and-cleanup`
**Last updated:** 2026-11-19

---

## Phase Overview

| Phase | Focus                        | Duration  | Status      |
|-------|------------------------------|-----------|-------------|
| 1A    | Rails API setup + DB + Auth  | Days 1–4  | ✅ Done     |
| 1B    | Complaints API               | Days 5–7  | ✅ Done     |
| 2A    | React setup + Auth UI        | Days 8–10 | ✅ Done     |
| 2B    | Student views                | Days 11–13| ✅ Done     |
| 2C    | Admin + Staff views          | Days 14–16| ✅ Done     |
| 3     | Integration + Polish         | Days 17–18| ✅ Done     |
| 4     | Deployment                   | Days 19–21| ✅ Done     |
| 5     | Post-launch polish (navbar, notifications, docs, approval fix) | —  | 🔄 In progress |

---

## Phase 1A — Rails API Setup + Database + Auth
> Goal: A working Rails API that can register users, store complaints in PostgreSQL, and issue JWTs

### Tasks
- [x] Scaffold Rails API app inside `server/` folder
- [x] Configure PostgreSQL (`database.yml`)
- [x] Add gems: `pg`, `rack-cors`, `bcrypt`, `jwt`, `jsonapi-serializer`
- [x] Create and run `create_users` migration
- [x] Create and run `create_complaints` migration
- [x] Build `User` model with `has_secure_password` and validations
- [x] Build `Complaint` model with validations and scopes
- [x] Write `db/seeds.rb` with demo users and complaints
- [x] Run `rails db:create db:migrate db:seed` — confirm data exists
- [x] Build `ApplicationController` with `authenticate_user!` and `require_role!`
- [x] Build `Api::V1::AuthController` — login action returns JWT
- [x] Test login endpoint in Postman/Insomnia
- [x] Configure CORS (`rack-cors`) to allow `localhost:5173`

### Why we do it in this order
> Database and models first — controllers are useless without working data.
> Auth next — every other endpoint depends on it.
> CORS last in this phase — it only matters when React tries to talk to Rails.

---

## Phase 1B — Complaints API
> Goal: All complaint endpoints working and testable in Postman

### Tasks
- [x] Build `Api::V1::ComplaintsController` — `index` action (role-scoped)
- [x] Build `create` action (student only)
- [x] Build `assign` action (admin only)
- [x] Build `resolve` action (admin + staff, with ownership check for staff)
- [x] Build `reopen` action (admin only)
- [x] Build `Api::V1::UsersController` — `index` with `?role=staff` filter
- [x] Build `UserSerializer` and `ComplaintSerializer`
- [x] Test every endpoint in Postman with all 3 roles
- [x] Confirm 401 on missing token, 403 on wrong role

### Why we do it in this order
> Index and create first — they are the simplest and confirm DB read/write works.
> Custom actions (assign/resolve/reopen) next — they build on index/create.
> Serializers alongside — so responses are clean from the start, not retrofitted.

---

## Phase 2A — React Setup + Auth UI
> Goal: A running React app that can log in, store the JWT, and redirect by role

### Tasks
- [x] Scaffold React + Vite app inside `client/` folder
- [x] Install dependencies: React Router, Axios, React Query, React Hook Form, Zod
- [x] Install and configure Tailwind CSS
- [x] Install and configure shadcn/ui
- [x] Set up `src/api/client.js` (Axios instance with JWT interceptor)
- [x] Set up `AuthContext` (login, logout, persist to localStorage)
- [x] Build `PrivateRoute` component
- [x] Set up routes in `App.jsx` (all pages, protected by role)
- [x] Build `Login` page — form, validation, call API, store token, redirect
- [x] Build `Navbar` component (role-aware links, logout button)
- [x] Test login → redirect to correct dashboard for all 3 roles
- [x] Test protected route redirect (unauthenticated → login page)

### Why we do it in this order
> Tooling first — you cannot build UI without the foundation.
> AuthContext before any page — every page depends on knowing who is logged in.
> Login page before dashboards — you cannot reach dashboards without it.

---

## Phase 2B — Student Views
> Goal: Students can submit complaints and track them

### Tasks
- [x] Build `StudentDashboard` — stat cards + recent complaints table
- [x] Build `SubmitComplaint` — form with validation (React Hook Form + Zod)
- [x] Build `MyComplaints` — full list with status/category filters
- [x] Build `ComplaintRow` with expandable detail (description, assigned staff, resolution)
- [x] Build `StatusBadge` and `PriorityBadge` components
- [x] Build `ResolutionTime` util (`resolutionTime.js`)
- [x] Build `NotificationBell` component (student notifications)
- [x] Add loading and empty states to all views

---

## Phase 2C — Admin + Staff Views
> Goal: Admin can manage all complaints, staff can resolve their tasks

### Tasks
- [x] Build `AdminDashboard` — all complaints table with stat cards
- [x] Build `AssignModal` — staff dropdown, confirm assign
- [x] Build `ResolveModal` — resolution note textarea
- [x] Wire reopen button with confirm dialog
- [x] Build `StaffDashboard` — task cards filtered to assigned complaints
- [x] Build `TaskCard` component with priority colour stripe
- [x] Wire staff resolve modal
- [x] Add notification bells for admin and staff

---

## Phase 3 — Integration + Polish
> Goal: Frontend and backend fully connected, edge cases handled

### Tasks
- [x] Connect all React API calls to the live Rails server (localhost:3001)
- [x] Add registration page + hybrid approval flow (students auto-approved; staff/admin pending) and pending approvals page for admin/superadmin
- [x] Fix any CORS issues that appear during integration
- [x] Test full complaint lifecycle end-to-end (submit → assign → resolve → reopen)
- [x] Test all role restrictions in the UI (not just API) — *recorded as done by the developer; not independently re-verified*
- [x] Add global error handling for expired JWT (auto-logout + redirect)
- [x] Mobile responsiveness pass — test on narrow viewport
- [x] Build `Landing` page (index.html equivalent)

---

## Phase 4 — Deployment
> Goal: Live URLs on Render (API) and Netlify (frontend)

### Tasks
- [x] Push `server/` to GitHub (`main` branch)
- [x] Create Render Web Service — connect GitHub repo, set root to `server/`
- [x] Create Render PostgreSQL database — attach to web service
- [x] Set environment variables on Render:
  - `RAILS_ENV=production`
  - `SECRET_KEY_BASE` (generate with `rails secret`)
  - `DATABASE_URL` (auto-filled by Render)
  - `ALLOWED_ORIGINS=https://your-app.netlify.app`
- [x] Run `rails db:migrate` and `rails db:seed` on Render
- [x] Test all API endpoints against the Render URL in Postman
- [x] Fix `production.rb` for API mode (removed active_storage, solid_cache, solid_queue); fix Render start command
- [x] Push `client/` to GitHub
- [x] Create Netlify site — connect GitHub repo, set base to `client/`
- [x] Set `VITE_API_URL=https://your-api.onrender.com/api/v1` on Netlify
- [x] Add `public/_redirects` file for React Router SPA fix
- [x] Test full app on live URLs

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
| May 2026 | Hybrid registration approval (students auto-approved; staff/admin pending) | Anyone can self-register as a student, but staff/admin power needs a human sign-off. `users.status` is set server-side only. |
| May 2026 | `superadmin` is a seeded admin; admins approve staff, superadmin approves admins | Prevents anyone self-promoting to admin. |
| May 2026 | Rails API-mode production.rb trimmed (no active_storage / solid_cache / solid_queue) | Not needed for a JSON API; they broke the Render boot. |
| Nov 2026 | Login and token checks require `status == approved`; login returns 403 with a clear message for pending/rejected (only after the password is verified) | Registration approval was previously bypassable: pending/rejected staff/admin could log in. Password is checked first so status isn't leaked to guessers. A token for a non-approved user gets 401, so a user rejected mid-session is logged out. |
| Nov 2026 | Complaint state machine enforced server-side: assign only if not Resolved (and only to approved staff), resolve needs a note and cannot repeat, reopen only from Resolved | The UI already only offered these transitions, but the API accepted any, so a direct call could assign a resolved complaint and leave stale resolution data. |
| Nov 2026 | Login rate limiting deferred | Rails `rate_limit` needs a working cache store and could not be tested here; shared demo credentials mean many testers can share one IP. Revisit with a generous limit once testable. |
| Nov 2026 | Notifications derived client-side from the complaints list (no notifications table) | Zero backend/migration cost; good enough for the current scale. Revisit if email/push is added. |
| Nov 2026 | Navbar rendered by `PrivateRoute` | One place covers every protected page; pages no longer carry their own logout button. |
| May 2026 | No Redux                                      | Overkill. Auth in Context + server data in React Query covers everything. |

---

## Known Issues / Blockers
> Add anything that is blocking progress here.

- **Demo credentials are intentionally public.** The login page shows `superadmin`/`super123`, `staff1`, `student1` so customers can try the app. Anyone can therefore act as admin on the deployed site; do not put real data there, or switch to a separate demo deployment before real use.
- **Notifications are derived, not stored.** Students' "unread" is tracked in `localStorage` per browser; admin/staff bells show current to-do items.
- **Client bundle > 500 kB** (Vite warning). Fine for now; route-level code splitting is the fix if load time matters.
- **API URL not independently verified** from the review environment — confirm with a real login.

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
