# SmartCampus — Rules & Conventions

These are the decisions we have locked in. Follow them consistently across the entire codebase.
When in doubt, ask before deviating — consistency matters more than preference.

---

## Git

### Branch Strategy
- `main` — production-ready code only. Never commit directly.
- `dev` — active development branch. Merge features here first.
- `feature/<name>` — one branch per feature (e.g. `feature/auth`, `feature/complaint-form`)

### Commit Message Format
Use **Conventional Commits**. Format: `type: short description`

| Type     | Use for                                      |
|----------|----------------------------------------------|
| feat     | New feature                                  |
| fix      | Bug fix                                      |
| chore    | Setup, config, tooling (no app logic)        |
| refactor | Code change with no behaviour change         |
| style    | Formatting, whitespace only                  |
| docs     | Documentation changes                        |
| test     | Adding or updating tests                     |

Examples:
```
feat: add JWT authentication to application controller
fix: correct CORS allowed origins in production
chore: add rack-cors gem to Gemfile
docs: update architecture with database schema
```

### Pull Request Rule
- Every feature branch → open a PR into `dev`
- Squash commits on merge to keep history clean
- No PR merges to `main` unless `dev` is fully tested

---

## Rails (Server)

### Naming
- Models: `PascalCase` singular → `User`, `Complaint`
- Controllers: `PascalCase` plural → `ComplaintsController`
- Files: `snake_case` → `complaints_controller.rb`
- Database columns: `snake_case` → `assigned_to_id`, `resolution_note`
- Routes: `snake_case`, RESTful → `/api/v1/complaints/:id/assign`

### Controller Rules
- Every controller action starts with `before_action :authenticate_user!`
- Role checks use `require_role!("admin")` — never inline `if current_user.role == "admin"`
- Controllers are **thin** — no business logic. Move it to models or service objects.
- Always respond with JSON. No HTML from the API.
- Use `render json:` with explicit `status:` codes.

### Model Rules
- All validations live in the model — never validate in the controller.
- Use ActiveRecord scopes for reusable queries (`.submitted`, `.by_category(cat)`, etc.)
- Timestamps (`created_at`, `updated_at`) are managed by Rails — never set manually.
- `resolved_at` is set server-side in the controller — never trusted from client params.

### HTTP Status Codes (use these consistently)
| Situation             | Status Code              |
|-----------------------|--------------------------|
| Success (read)        | 200 OK                   |
| Success (created)     | 201 Created              |
| Validation failed     | 422 Unprocessable Entity |
| Not authenticated     | 401 Unauthorized         |
| Wrong role            | 403 Forbidden            |
| Record not found      | 404 Not Found            |

### API Versioning
- All routes live under `/api/v1/`. This lets us add `/api/v2/` later without breaking clients.

### Strong Parameters
- Always use `params.require().permit()` in every controller. Never pass raw `params` to a model.

### Serializers
- Use `jsonapi-serializer` gem for all responses. Never call `.to_json` on a model directly.
- Serializer files live in `app/serializers/`.

---

## React (Client)

### Naming
- Components: `PascalCase` with `.jsx` extension → `ComplaintTable.jsx`
- Hooks: `camelCase` prefixed with `use` → `useComplaints.js`
- Utils/helpers: `camelCase` → `resolutionTime.js`
- CSS classes: Tailwind utilities only. No custom CSS files (except global resets in `index.css`).
- API files: one file per domain → `api/complaints.js`, `api/auth.js`

### Component Rules
- One component per file.
- Props are destructured at the top of the component function.
- No business logic in components — data fetching goes in hooks, formatting goes in utils.
- Keep components under ~150 lines. If longer, split it.

### State Management Rules
- **Server state** (data from API) → React Query (`useQuery`, `useMutation`)
- **Global client state** (auth) → AuthContext
- **Local UI state** (modal open, filter value) → `useState` in the component
- Do NOT put server data in Context — that is what React Query is for.

### API Calls
- All API calls go through `src/api/client.js` (the configured Axios instance).
- Never call `fetch()` directly — always use the Axios client so JWT is attached automatically.
- API functions live in `src/api/` and are imported into hooks, not into components.

### Routing
- Routes are defined only in `App.jsx`.
- Protected routes use the `<PrivateRoute allowedRoles={[...]}>` wrapper.
- Role-based redirect after login:
  - `student` → `/student/dashboard`
  - `admin` → `/admin/dashboard`
  - `staff` → `/staff/dashboard`

### Environment Variables
- All Vite env vars must be prefixed with `VITE_`.
- Access them as `import.meta.env.VITE_API_URL`.
- Never hardcode the API URL anywhere in source code.

### Error Handling
- Every `useQuery` and `useMutation` must handle `isLoading` and `isError` states in the UI.
- Show a spinner during loading.
- Show a user-friendly error message (not raw API errors) on failure.

---

## Database

### Migration Rules
- Never edit a migration after it has been committed. Create a new migration instead.
- Migration names describe the action: `create_users`, `add_index_to_complaints_status`.
- Always add indexes for foreign keys and columns used in WHERE clauses.

### Seeds
- `db/seeds.rb` must always contain working demo data:
  - 1 admin user
  - 1 staff user
  - 2-3 student users
  - 5-8 complaints in various states (Submitted, In Progress, Resolved)
- Seed data must be idempotent: running `rails db:seed` twice should not create duplicates.
  Use `find_or_create_by` not `create`.

---

## Security Rules (Non-Negotiable)

1. **Passwords are always bcrypt-hashed.** Rails `has_secure_password` handles this. Never store plaintext.
2. **JWT secret comes from environment variables.** Never hardcode it in source code.
3. **All user input is validated server-side.** Client validation is UX only, not security.
4. **`resolved_at` is always set server-side.** Never accept it from the client.
5. **Staff can only resolve their own assigned complaints.** Check `assigned_to_id == current_user.id` server-side.
6. **Sensitive data never goes in git.** Use `.env` files locally, Render/Netlify environment variables in production. Both `.env` files are in `.gitignore`.

---

## What We Do NOT Use

| Tool           | Reason we skipped it                                          |
|----------------|---------------------------------------------------------------|
| Redux          | Overkill for this app size. React Query + Context is enough.  |
| Next.js        | We want a clean separation of frontend/backend. Plain React.  |
| GraphQL        | REST is simpler and sufficient for this API surface.          |
| Devise (gem)   | We handle auth manually with JWT — Devise adds too much magic.|
| Turbo/Hotwire  | Rails API mode only — no server-rendered HTML.                |