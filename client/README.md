# SmartCampus — Client (React)

React 19 + Vite + Tailwind CSS 4 + shadcn/ui. Server state: TanStack Query. Auth: `AuthContext` + JWT in `localStorage`. Forms: React Hook Form + Zod. Routing: React Router 7.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 20.19+ or 22.12+ (required by Vite 8) | `node -v` |
| npm | comes with Node | `npm -v` |
| API | the Rails server running on port 3001 | see `../server/README.md` |

## Run it locally

All commands are run from this `client/` folder. **Start the server first**, otherwise login will fail.

**1. Create your environment file**
```bash
cp .env.example .env
```
It contains one variable:
```
VITE_API_URL=http://localhost:3001/api/v1
```
This must be the API base URL, including `/api/v1`. Vite reads `.env` only at startup, so **restart `npm run dev` after changing it**.

**2. Install dependencies**
```bash
npm install
```

**3. Start the dev server**
```bash
npm run dev
```
Open **http://localhost:5173**.

## Log in and try it

| Username | Password | Role | Lands on |
|----------|----------|------|----------|
| `student1` | `student123` | student | `/student/dashboard` |
| `staff1` | `staff123` | staff | `/staff/dashboard` |
| `superadmin` | `super123` | admin | `/admin/dashboard` |

These are also shown on the login page. A good walkthrough:
1. As `student1`, submit a complaint (**New Complaint**).
2. As `superadmin`, assign it to `staff1`.
3. As `staff1`, resolve it with a note.
4. As `student1`, open the notification bell to see the update.
5. Register a new staff account, then approve it from **Pending Approvals** as `superadmin`. Until then that account cannot log in.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload on port 5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (should report no errors) |

## Project layout

```
src/
  pages/        route-level screens (landing, login, register, student, staff, admin, approvals)
  components/   shared UI: Navbar, NotificationBell, modals, badges, ui/ (shadcn)
  hooks/        data hooks: useComplaints, useUsers, useStaff, useNotifications
  api/          Axios client (adds the JWT, handles 401) and endpoint functions
  context/      AuthContext
  utils/        pure helpers (resolution time, notifications)
```
The `@` import alias points at `src/`. Route protection lives in `components/PrivateRoute.jsx`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Login does nothing, or the network tab shows 404s / HTML responses | `VITE_API_URL` is missing or wrong. Fix `.env` and restart `npm run dev`. |
| "Network Error" or a CORS error in the console | The Rails server isn't running, or its `ALLOWED_ORIGINS` doesn't include `http://localhost:5173`. |
| "Invalid username or password" | Use a seeded account from the table above (there is no `admin1`). |
| "Your account is awaiting admin approval" | New staff/admin accounts must be approved by `superadmin` first. |
| Redirected to login with "session expired" | The 24-hour token expired. Sign in again. |
| `npm install` fails on engines | Upgrade Node to 20.19+ or 22.12+. |

## Deployment (Netlify)

Base directory `client/`, build command `npm run build`, publish directory `dist`. Set `VITE_API_URL` to the deployed API's `/api/v1` URL. `public/_redirects` makes client-side routes work on refresh. More in the root `architecture.md`.
