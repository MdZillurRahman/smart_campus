import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, BellOff } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { timeAgo } from '../utils/notifications'

const TITLES = {
  student: 'Complaint updates',
  admin: 'Awaiting assignment',
  staff: 'Your open tasks',
}

export default function NotificationBell() {
  const { items, unread, isLoading, markAllSeen, role } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    // Opening the panel counts as "seen" for students.
    if (!open && role === 'student') markAllSeen()
    setOpen(o => !o)
  }

  const go = (to) => { setOpen(false); navigate(to) }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">{TITLES[role]}</p>
          </div>

          {isLoading ? (
            <p className="px-4 py-6 text-sm text-slate-400 text-center">Loading...</p>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <BellOff className="h-6 w-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">You're all caught up</p>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {items.map(n => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => go(n.to)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-800">{n.message}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{n.detail}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.timestamp)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
