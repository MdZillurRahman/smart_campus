// Pure helpers that turn a role's complaint list into notification items.
// No React, no API calls — see hooks/useNotifications.js for the data side.

const MAX_ITEMS = 10

const byNewest = (a, b) => new Date(b.timestamp) - new Date(a.timestamp)

export function buildNotifications(role, complaints = []) {
  let items = []

  if (role === 'student') {
    items = complaints
      .filter(c => c.status === 'In Progress' || c.status === 'Resolved')
      .map(c => ({
        id: `${c.id}-${c.status}`,
        message: c.status === 'Resolved'
          ? `${c.display_id} was resolved`
          : `${c.display_id} is now in progress${c.assigned_to ? ` (${c.assigned_to.fullname})` : ''}`,
        detail: c.title,
        timestamp: c.updated_at ?? c.created_at,
        to: '/student/complaints',
      }))
  }

  if (role === 'admin') {
    items = complaints
      .filter(c => c.status === 'Submitted')
      .map(c => ({
        id: `${c.id}-unassigned`,
        message: `${c.display_id} is waiting to be assigned`,
        detail: c.title,
        timestamp: c.created_at,
        to: '/admin/dashboard',
      }))
  }

  if (role === 'staff') {
    items = complaints
      .filter(c => c.status === 'In Progress')
      .map(c => ({
        id: `${c.id}-task`,
        message: `New task: ${c.display_id}`,
        detail: c.title,
        timestamp: c.updated_at ?? c.created_at,
        to: '/staff/dashboard',
      }))
  }

  return items.sort(byNewest).slice(0, MAX_ITEMS)
}

// Admin and staff notifications are to-do items: they stay "unread" until the
// underlying complaint changes state. Students' are updates, so they are
// unread only if newer than the last time the bell was opened.
export function countUnread(role, items, lastSeen) {
  if (role !== 'student') return items.length
  if (!lastSeen) return items.length
  return items.filter(i => new Date(i.timestamp) > new Date(lastSeen)).length
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000)
  if (seconds < 60)    return 'just now'
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
