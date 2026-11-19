# SmartCampus — Client

React 19 + Vite + Tailwind CSS 4 + shadcn/ui. State: AuthContext + TanStack Query. Forms: React Hook Form + Zod.

## Setup
```bash
npm install
```
Create `client/.env` (git-ignored):
```
VITE_API_URL=http://localhost:3001/api/v1
```
```bash
npm run dev      # http://localhost:5173 (restart after changing .env)
npm run build    # production build
npm run lint
```

## Layout
- `src/pages/` — route-level screens (student, admin, staff, auth, landing)
- `src/components/` — shared UI (`Navbar`, `NotificationBell`, modals, badges, `ui/` from shadcn)
- `src/hooks/` — data hooks (`useComplaints`, `useUsers`, `useStaff`, `useNotifications`)
- `src/api/` — Axios client (adds the JWT, handles 401 globally) and endpoint functions
- `src/utils/` — pure helpers (`resolutionTime`, `notifications`)

Deployed on Netlify; `public/_redirects` makes client-side routes work. See the root README and `architecture.md`.
