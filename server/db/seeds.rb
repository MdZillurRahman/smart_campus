puts "Seeding database..."

# ── Superadmin (the one true admin, seeded only) ───────────────
superadmin = User.find_or_create_by!(username: "superadmin") do |u|
  u.email    = "superadmin@campus.edu"
  u.password = "super123"
  u.role     = "admin"
  u.fullname = "Super Admin"
  u.status   = "approved"
end

# ── Staff (seeded, pre-approved) ──────────────────────────────
staff = User.find_or_create_by!(username: "staff1") do |u|
  u.email    = "staff@campus.edu"
  u.password = "staff123"
  u.role     = "staff"
  u.fullname = "Rahim Mia"
  u.status   = "approved"
end

# ── Students (seeded, auto-approved) ──────────────────────────
student1 = User.find_or_create_by!(username: "student1") do |u|
  u.email    = "student1@campus.edu"
  u.password = "student123"
  u.role     = "student"
  u.fullname = "Ayesha Rahman"
  u.status   = "approved"
end

student2 = User.find_or_create_by!(username: "student2") do |u|
  u.email    = "student2@campus.edu"
  u.password = "student123"
  u.role     = "student"
  u.fullname = "Nabil Hasan"
  u.status   = "approved"
end

puts "✓ Users created"

# ── Complaints ────────────────────────────────────────────────
Complaint.find_or_create_by!(title: "Broken projector in Room 204") do |c|
  c.student     = student1
  c.category    = "Classroom"
  c.description = "The projector has not been working for 3 days. Classes are affected."
  c.priority    = "High"
  c.status      = "Submitted"
end

Complaint.find_or_create_by!(title: "Water leakage in Hostel Block B") do |c|
  c.student     = student1
  c.category    = "Hostel"
  c.description = "There is a water leak in the corridor near room 12. Floor is wet."
  c.priority    = "High"
  c.status      = "In Progress"
  c.assigned_to = staff
end

Complaint.find_or_create_by!(title: "Lab computers running very slowly") do |c|
  c.student     = student2
  c.category    = "Lab"
  c.description = "All computers in Lab 3 take over 10 minutes to boot. Very disruptive."
  c.priority    = "Medium"
  c.status      = "In Progress"
  c.assigned_to = staff
end

Complaint.find_or_create_by!(title: "Cafeteria food quality has dropped") do |c|
  c.student     = student2
  c.category    = "Cafeteria"
  c.description = "The food quality has significantly dropped over the past two weeks."
  c.priority    = "Low"
  c.status      = "Resolved"
  c.assigned_to = staff
  c.resolution_note = "Spoke with cafeteria management. New supplier arranged from next week."
  c.resolved_at     = 2.days.ago
end

Complaint.find_or_create_by!(title: "Library AC not working") do |c|
  c.student     = student1
  c.category    = "Library"
  c.description = "The air conditioning in the main library hall has stopped working."
  c.priority    = "Medium"
  c.status      = "Submitted"
end

puts "✓ Complaints created"
puts "Done! #{User.count} users, #{Complaint.count} complaints."