# SmartCampus — Features

Status legend: `[ ]` not started · `[~]` in progress / partial · `[x]` done

_Last updated: 2026-11-19. Phase 1 is complete and deployed. Phase 2 is partly done (registration + approvals). Phase 3 has not started._

---

## Phase 1 — Core (Feature Parity + Security Improvements)
> Target: Week 1–2

### Authentication
- [x] User login with username + password
- [x] Password stored as bcrypt hash (NOT plaintext like v1)
- [x] JWT token issued on login
- [x] JWT decoded on every protected request
- [x] Role-based route protection (student / admin / staff)
- [x] Logout (clear token client-side)
- [x] Auto-redirect to login if token is missing or expired

### Student
- [x] View personal dashboard with 4 stat cards (Total / Pending / In Progress / Resolved)
- [x] View 5 most recent complaints on dashboard
- [x] Submit a new complaint (category, title, description, priority)
- [x] View all personal complaints with filters (status, category)
- [x] Expand a complaint row to see full description + resolution info
- [x] See resolution time chip (e.g. "2.3 days")
- [x] Notification bell showing complaint status updates

### Admin
- [x] View all complaints (all students) with stat cards
- [x] Filter complaints by status and category
- [x] Assign a complaint to a staff member → status becomes "In Progress"
- [x] Resolve a complaint with a resolution note → status becomes "Resolved"
- [x] Reopen a resolved complaint → status resets to "Submitted"
- [x] Expand complaint rows to see full detail
- [x] Notification bell for unassigned complaints

### Staff
- [x] View only complaints assigned to them
- [x] Filter by pending / resolved
- [x] Resolve an assigned complaint with a resolution note
- [x] Notification bell for newly assigned tasks

### Shared UI
- [x] Landing page (marketing, how it works, roles)
- [x] Role-aware navbar (different links per role)
- [x] Status badges (Submitted / In Progress / Resolved)
- [x] Priority badges (High / Medium / Low)
- [x] Priority-coloured task cards for staff
- [x] Empty states with CTAs
- [x] Loading states on all data fetches
- [x] Error states with user-friendly messages
- [x] Responsive layout (mobile-friendly)

---

## Phase 2 — Enhanced Features
> Target: Week 3 (stretch goals after core is done)

### User Management
- [x] Self-registration (email + username + password): students auto-approved, staff/admin queued as pending
- [ ] Admin can view all users (only the pending queue exists so far)
- [~] Admin can add new staff accounts (today: staff self-register and an admin approves; no direct create form)
- [ ] Admin can deactivate a user account
- [x] Admin can view and approve pending staff registrations
- [x] Superadmin can view and approve pending admin registrations
- [~] Reject pending registrations (reject works; sending feedback to the user does not)
- [x] Block pending/rejected users from logging in (login returns 403 with a message; tokens of non-approved users are refused)

### Notifications (Email)
- [ ] Email sent to student when complaint is assigned
- [ ] Email sent to student when complaint is resolved
- [ ] Email sent to staff when a complaint is assigned to them
- [ ] Provider: SendGrid or Resend (free tier)

### Complaint Enhancements
- [ ] Comments/notes thread on a complaint (admin ↔ staff communication)
- [ ] File attachment on submission (photo of the issue)
- [ ] File storage: Cloudinary free tier via ActiveStorage

---

## Phase 3 — Rich Features
> Future / nice to have

### Search & Discovery
- [ ] Full-text search across complaint titles and descriptions
- [ ] Search results page

### Pagination
- [ ] Paginate complaint lists (25 per page)
- [ ] Pagination controls in UI

### Analytics
- [ ] Admin dashboard charts (complaints by category, by priority, over time)
- [ ] Staff performance view (how many resolved, average resolution time)
- [ ] Chart library: Recharts

---

## Complaint Field Reference

| Field           | Allowed Values                                        |
|-----------------|-------------------------------------------------------|
| category        | Classroom, Hostel, Lab, Security, Cafeteria, Library  |
| priority        | High, Medium, Low                                     |
| status          | Submitted, In Progress, Resolved                      |
| role            | student, admin, staff                                 |

---

## Role Permission Matrix

| Action                          | Student | Admin | Superadmin |  Staff |
|---------------------------------|:-------:|:-----:|:----------:|:------:|
| Submit complaint                | ✅      | ❌    | ❌         | ❌     |
| View own complaints             | ✅      | ❌    | ❌         | ❌     |
| View all complaints             | ❌      | ✅    | ✅         | ❌     |
| View assigned complaints        | ❌      | ❌    | ❌         | ✅     |
| Assign complaint                | ❌      | ✅    | ✅         | ❌     |
| Resolve complaint               | ❌      | ✅    | ✅         | ✅*    |
| Reopen complaint                | ❌      | ✅    | ✅         | ❌     |
| Approve staff registrations     | ❌      | ✅    | ✅         | ❌     |
| Approve admin registrations     | ❌      | ❌    | ✅         | ❌     |
| Create/deactivate admin account | ❌      | ❌    | ✅         | ❌     |
| Deactivate any user             | ❌      | ❌    | ✅         | ❌     |

> *Staff can only resolve complaints where `assigned_to_id = current_user.id`
> **Superadmin is `role = "admin"` with `username = "superadmin"` — not a separate DB role**

> *Staff can only resolve complaints where `assigned_to_id = current_user.id`