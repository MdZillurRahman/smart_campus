import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useComplaints } from './useComplaints'
import { buildNotifications, countUnread } from '../utils/notifications'

const seenKey = (userId) => `sc_notif_seen_${userId}`

const readSeen = (userId) => {
  try { return localStorage.getItem(seenKey(userId)) } catch { return null }
}

export function useNotifications() {
  const { user } = useAuth()
  const [lastSeen, setLastSeen] = useState(() => readSeen(user.id))

  // Same query key as the dashboards, so this shares their cache.
  const { data, isLoading } = useComplaints({}, { refetchInterval: 60_000 })

  const items = useMemo(
    () => buildNotifications(user.role, data ?? []),
    [user.role, data]
  )
  const unread = countUnread(user.role, items, lastSeen)

  const markAllSeen = useCallback(() => {
    const now = new Date().toISOString()
    try { localStorage.setItem(seenKey(user.id), now) } catch { /* storage unavailable */ }
    setLastSeen(now)
  }, [user.id])

  return { items, unread, isLoading, markAllSeen, role: user.role }
}
