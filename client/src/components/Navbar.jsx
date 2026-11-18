import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GraduationCap, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import NotificationBell from './NotificationBell'

const LINKS = {
  student: [
    { to: '/student/dashboard',  label: 'Dashboard' },
    { to: '/student/complaints', label: 'My Complaints' },
    { to: '/student/submit',     label: 'New Complaint' },
  ],
  admin: [
    { to: '/admin/dashboard',  label: 'Dashboard' },
    { to: '/admin/approvals',  label: 'Pending Approvals' },
  ],
  staff: [
    { to: '/staff/dashboard', label: 'My Tasks' },
  ],
}

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = LINKS[user.role] ?? []

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to={links[0]?.to ?? '/'} className="flex items-center gap-2 font-bold text-slate-900">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </span>
            SmartCampus
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>)}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationBell />
          <span className="hidden lg:block text-sm text-slate-500 max-w-40 truncate">{user.fullname}</span>
          <Button size="sm" variant="outline" onClick={logoutUser} className="hidden md:inline-flex">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <p className="px-3 pb-1 text-xs text-slate-400">{user.fullname}</p>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={logoutUser}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  )
}
