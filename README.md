# SmartCampus — Complaint & Issue Tracking System

A full-stack campus complaint management system built with React, Ruby on Rails, and PostgreSQL.

**Live:** [https://smartcampusissuetracking.netlify.app](https://smartcampusissuetracking.netlify.app) · API: `https://smartcampus-api-ml3z.onrender.com`

## Stack
- **Frontend:** React 19 + Vite + Tailwind CSS 4 + shadcn/ui (in `/client`)
- **Backend:** Ruby on Rails 8.1 API (Ruby 3.2.10) + PostgreSQL (in `/server`)
- **Auth:** JWT (`jwt` gem + bcrypt), no Devise
- **Hosting:** Netlify (client) + Render (server)

## Roles
| Role | What they can do |
|------|-----------------|
| Student | Self-register (auto-approved), submit complaints, track status |
| Staff | Self-register (needs approval), resolve complaints assigned to them |
| Admin | Assign, resolve and reopen all complaints; approve staff registrations |
| Superadmin | The one seeded admin (`superadmin`); also approves admin registrations |

## Run locally

Prerequisites: Ruby 3.2.10, Node, and PostgreSQL running locally.

**1. Environment files** (both are git-ignored, so create them yourself)

`server/.env`
```
SECRET_KEY_BASE=<run `bin/rails secret` in server/>
ALLOWED_ORIGINS=http://localhost:5173
```

`client/.env`
```
VITE_API_URL=http://localhost:3001/api/v1
```

**2. Backend**
```bash
cd server
bundle install
bin/rails db:create db:migrate db:seed
bin/rails s -p 3001
```

**3. Frontend** (restart it if you change `.env`)
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## Demo logins (seeded data)
| Username | Password | Role |
|----------|----------|------|
| `superadmin` | `super123` | admin |
| `staff1` | `staff123` | staff |
| `student1` / `student2` | `student123` | student |

> These passwords are public. Change them on any deployed database.

## Project docs
`architecture.md` · `features.md` · `rules.md` · `implementation.md` · `claude.md`
