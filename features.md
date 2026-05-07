# SmartCampus — Features

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 1 — Core (Feature Parity + Security Improvements)
> Target: Week 1–2

### Authentication
- [ ] User login with username + password
- [ ] Password stored as bcrypt hash (NOT plaintext like v1)
- [ ] JWT token issued on login
- [ ] JWT decoded on every protected request
- [ ] Role-based route protection (student / admin / staff)
- [ ] Logout (clear token client-side)
- [ ] Auto-redirect to login if token is missing or expired

### Student
- [ ] View personal dashboard with 4 stat cards (Total / Pending / In Progress / Resolved)
- [ ] View 5 most recent complaints on dashboard
- [ ] Submit a new complaint (category, title, description, priority)
- [ ] View all personal complaints with filters (status, category)
- [ ] Expand a complaint row to see full description + resolution info
- [ ] See resolution time chip (e.g. "2.3 days")
- [ ] Notification bell showing complaint status updates

### Admin
- [ ] View all complaints (all students) with stat cards
- [ ] Filter complaints by status and category
- [ ] Assign a complaint to a staff member → status becomes "In Progress"
- [ ] Resolve a complaint with a resolution note → status becomes "Resolved"
- [ ] Reopen a resolved complaint → status resets to "Submitted"
- [ ] Expand complaint rows to see full detail
- [ ] Notification bell for unassigned complaints

### Staff
- [ ] View only complaints assigned to them
- [ ] Filter by pending / resolved
- [ ] Resolve an assigned complaint with a resolution note
- [ ] Notification bell for newly assigned tasks

### Shared UI
- [ ] Landing page (marketing, how it works, roles)
- [ ] Role-aware navbar (different links per role)
- [ ] Status badges (Submitted / In Progress / Resolved)
- [ ] Priority badges (High / Medium / Low)
- [ ] Priority-coloured task cards for staff
- [ ] Empty states with CTAs
- [ ] Loading states on all data fetches
- [ ] Error states with user-friendly messages
- [ ] Responsive layout (mobile-friendly)

---

## Phase 2 — Enhanced Features
> Target: Week 3 (stretch goals after core is done)

### User Management
- [ ] Student self-registration (email + username + password)
- [ ] Admin can view all users
- [ ] Admin can add new staff accounts
- [ ] Admin can deactivate a user account

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

| Action                   | Student | Admin | Staff |
|--------------------------|:-------:|:-----:|:-----:|
| Submit complaint          | ✅      | ❌    | ❌    |
| View own complaints       | ✅      | ❌    | ❌    |
| View all complaints       | ❌      | ✅    | ❌    |
| View assigned complaints  | ❌      | ❌    | ✅    |
| Assign complaint          | ❌      | ✅    | ❌    |
| Resolve complaint         | ❌      | ✅    | ✅*   |
| Reopen complaint          | ❌      | ✅    | ❌    |
| Manage users              | ❌      | ✅    | ❌    |

> *Staff can only resolve complaints where `assigned_to_id = current_user.id`