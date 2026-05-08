# SmartCampus — Architecture

## Overview

SmartCampus is a decoupled full-stack web application.
The React frontend and Rails backend are **completely separate applications** that communicate exclusively via a JSON REST API over HTTPS.

---

## Stack

| Layer      | Technology                          | Version  | Hosted On   |
|------------|-------------------------------------|----------|-------------|
| Frontend   | React + Vite                        | React 19 | Netlify     |
| Styling    | Tailwind CSS + shadcn/ui            | TW 4     | —           |
| HTTP Client| Axios                               | latest   | —           |
| State      | React Query (TanStack)              | v5       | —           |
| Forms      | React Hook Form + Zod               | latest   | —           |
| Routing    | React Router v6                     | v6       | —           |
| Backend    | Ruby on Rails (API mode)            | 8.1.2    | Render      |
| Auth       | JWT (via `jwt` gem + bcrypt)        | —        | —           |
| Database   | PostgreSQL                          | 16       | Render      |
| Language   | Ruby                                | 3.2.10   | —           |

---

## Monorepo Structure

```
smartcampus/                   ← single GitHub repo
├── client/                    ← React app
│   ├── src/
│   │   ├── api/               ← all axios calls (one file per domain)
│   │   ├── components/        ← reusable UI pieces
│   │   ├── pages/             ← one component per route/page
│   │   ├── context/           ← AuthContext (global auth state)
│   │   ├── hooks/             ← custom hooks (useComplaints, useAuth)
│   │   ├── utils/             ← pure helper functions
│   │   ├── App.jsx            ← router + PrivateRoute
│   │   └── main.jsx
│   ├── public/
│   │   └── _redirects         ← Netlify SPA fix
│   ├── .env                   ← VITE_API_URL (local dev)
│   ├── .env.production        ← VITE_API_URL (production)
│   └── package.json
│
├── server/                    ← Rails API
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── application_controller.rb   ← JWT decode, current_user
│   │   │   └── api/
│   │   │       └── v1/
│   │   │           ├── auth_controller.rb
│   │   │           ├── complaints_controller.rb
│   │   │           └── users_controller.rb
│   │   ├── models/
│   │   │   ├── user.rb
│   │   │   └── complaint.rb
│   │   └── serializers/
│   │       ├── user_serializer.rb
│   │       └── complaint_serializer.rb
│   ├── config/
│   │   ├── routes.rb
│   │   └── initializers/
│   │       └── cors.rb
│   ├── db/
│   │   ├── migrate/
│   │   └── seeds.rb
│   └── Gemfile
│
├── docs/                      ← project context files (this folder)
│   ├── architecture.md
│   ├── features.md
│   ├── rules.md
│   ├── implementation.md
│   └── claude.md
│
└── README.md
```

---

## Database Schema

### `users` table

| Column          | Type         | Constraints                              |
|-----------------|--------------|------------------------------------------|
| id              | bigserial    | PRIMARY KEY                              |
| username        | varchar(50)  | UNIQUE, NOT NULL                         |
| email           | varchar(120) | UNIQUE, NOT NULL                         |
| password_digest | varchar(255) | NOT NULL (bcrypt hash, managed by Rails) |
| role            | varchar(10)  | NOT NULL, CHECK IN (student/admin/staff) |
| fullname        | varchar(120) | NOT NULL                                 |
| created_at      | timestamp    | NOT NULL                                 |
| updated_at      | timestamp    | NOT NULL                                 |

Indexes: `username`, `role`

> **Superadmin:** The first admin account, seeded directly. Identified by
> `username = "superadmin"` and `role = "admin"`. Has elevated privileges
> enforced at the application level — not a separate database role.
> Never registerable through the UI.

### `complaints` table

| Column          | Type         | Constraints                                              |
|-----------------|--------------|----------------------------------------------------------|
| id              | bigserial    | PRIMARY KEY                                              |
| student_id      | bigint       | NOT NULL, FK → users(id)                                 |
| assigned_to_id  | bigint       | NULLABLE, FK → users(id)                                 |
| category        | varchar(20)  | NOT NULL, CHECK IN (Classroom/Hostel/Lab/Security/Cafeteria/Library) |
| title           | varchar(120) | NOT NULL                                                 |
| description     | text         | NOT NULL                                                 |
| priority        | varchar(10)  | NOT NULL, CHECK IN (High/Medium/Low)                     |
| status          | varchar(15)  | NOT NULL, DEFAULT 'Submitted', CHECK IN (Submitted/In Progress/Resolved) |
| resolution_note | text         | NULLABLE                                                 |
| resolved_at     | timestamp    | NULLABLE                                                 |
| created_at      | timestamp    | NOT NULL                                                 |
| updated_at      | timestamp    | NOT NULL                                                 |

Indexes: `student_id`, `assigned_to_id`, `status`

> **Display IDs:** The database uses integer PKs. The "CMP001" format is generated in the frontend:
> ```js
> const displayId = `CMP${String(complaint.id).padStart(3, '0')}`
> ```

---

## Authentication Flow

```
1. POST /api/v1/auth/login  { username, password }
        ↓
2. Rails: find user by username
          verify password with bcrypt (authenticate method)
          generate JWT: { user_id, role, exp: 24h }
        ↓
3. Response: { token, user: { id, username, fullname, role } }
        ↓
4. React: store token in localStorage ("sc_token")
          store user in localStorage ("sc_user")
          set AuthContext state
        ↓
5. Every subsequent request:
   Authorization: Bearer <token>
        ↓
6. Rails ApplicationController: decode token → set @current_user
   If invalid/expired → 401 Unauthorized
   If wrong role     → 403 Forbidden
```

> **Security note:** localStorage is used for simplicity (appropriate for demo/portfolio).
> For a production app, prefer httpOnly cookies to mitigate XSS risk.

---

## API Routes

All routes are prefixed with `/api/v1/`.

| Method | Endpoint                      | Auth Role     | Description                              |
|--------|-------------------------------|---------------|------------------------------------------|
| POST   | /auth/login                   | Public        | Returns JWT + user info                  |
| DELETE | /auth/logout                  | Any           | Client-side only (clears token)          |
| GET    | /complaints                   | All roles     | Scoped by role. Supports ?status= ?category= |
| POST   | /complaints                   | student       | Create new complaint                     |
| GET    | /complaints/:id               | All roles     | Single complaint detail                  |
| PATCH  | /complaints/:id/assign        | admin         | Assign to staff, status → In Progress    |
| PATCH  | /complaints/:id/resolve       | admin, staff  | Mark resolved, save note + timestamp     |
| PATCH  | /complaints/:id/reopen        | admin         | Reset to Submitted, clear assignment     |
| GET    | /users?role=staff             | admin         | List staff users for assign dropdown     |

---

## CORS Configuration

- **Development:** allow `http://localhost:5173` (Vite default)
- **Production:** allow the Netlify deployment URL only
- Configured in `server/config/initializers/cors.rb` using the `rack-cors` gem

---

## Environment Variables

### Server (`server/`)
| Variable         | Description                              |
|------------------|------------------------------------------|
| DATABASE_URL     | PostgreSQL connection string             |
| SECRET_KEY_BASE  | Used as JWT signing secret               |
| ALLOWED_ORIGINS  | Comma-separated allowed frontend URLs    |
| RAILS_ENV        | `development` or `production`            |

### Client (`client/`)
| Variable       | Description                              |
|----------------|------------------------------------------|
| VITE_API_URL   | Base URL of the Rails API                |

---

## Request/Response Shape

### Complaint object (API response)
```json
{
  "id": 1,
  "display_id": "CMP001",
  "title": "Broken projector in Room 204",
  "description": "...",
  "category": "Classroom",
  "priority": "High",
  "status": "In Progress",
  "resolution_note": null,
  "resolved_at": null,
  "created_at": "2026-05-01T09:30:00Z",
  "student": {
    "id": 1,
    "fullname": "Ayesha Rahman",
    "username": "student1"
  },
  "assigned_to": {
    "id": 3,
    "fullname": "Rahim Mia",
    "username": "staff1"
  }
}
```

---

## Complaint Status Lifecycle

```
[Submitted] ──(admin assigns)──► [In Progress] ──(admin or staff resolves)──► [Resolved]
     ▲                                                                               │
     └───────────────────────────(admin reopens)─────────────────────────────────────┘
```