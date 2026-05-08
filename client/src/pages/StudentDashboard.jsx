import { useComplaints } from '../hooks/useComplaints'
import { useAuth } from '../context/AuthContext'
import ComplaintRow from '../components/ComplaintRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  Plus,
  LogOut,
  ArrowRight,
  Inbox,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <Card className="relative overflow-hidden border-slate-200/70 hover:shadow-md transition-shadow">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </CardTitle>
        <div className={`p-2 rounded-lg ${accent.iconBg}`}>
          <Icon className={`h-4 w-4 ${accent.iconText}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl sm:text-3xl font-bold ${accent.text}`}>{value}</p>
      </CardContent>
    </Card>
  )
}

export default function StudentDashboard() {
  const { user, logoutUser } = useAuth()
  const { data, isLoading, isError } = useComplaints()

  const complaints = data ?? []
  const total      = complaints.length
  const pending    = complaints.filter(c => c.status === 'Submitted').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved   = complaints.filter(c => c.status === 'Resolved').length
  const recent     = complaints.slice(0, 5)

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    </div>
  )

  if (isError) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-200">
        <CardContent className="pt-6 text-center">
          <p className="text-red-600 font-medium">Failed to load complaints.</p>
          <p className="text-sm text-slate-500 mt-1">Please refresh the page.</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Welcome, {user.fullname}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Track and manage your complaints in one place</p>
          </div>
          <div className="flex gap-2">
            <Link to="/student/submit" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full shadow-sm">
                <Plus className="h-4 w-4 mr-1" /> New Complaint
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={logoutUser}>
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total" value={total} icon={FileText}
            accent={{ bar: 'bg-slate-700', iconBg: 'bg-slate-100', iconText: 'text-slate-700', text: 'text-slate-900' }}
          />
          <StatCard
            label="Pending" value={pending} icon={Clock}
            accent={{ bar: 'bg-yellow-500', iconBg: 'bg-yellow-100', iconText: 'text-yellow-700', text: 'text-yellow-700' }}
          />
          <StatCard
            label="In Progress" value={inProgress} icon={Loader2}
            accent={{ bar: 'bg-blue-500', iconBg: 'bg-blue-100', iconText: 'text-blue-700', text: 'text-blue-700' }}
          />
          <StatCard
            label="Resolved" value={resolved} icon={CheckCircle2}
            accent={{ bar: 'bg-green-500', iconBg: 'bg-green-100', iconText: 'text-green-700', text: 'text-green-700' }}
          />
        </div>

        {/* Recent complaints */}
        <Card className="border-slate-200/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Complaints</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Your latest submissions</p>
            </div>
            <Link
              to="/student/complaints"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Inbox className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No complaints yet</p>
                <p className="text-sm text-slate-400 mt-1">Get started by submitting your first one</p>
                <Link to="/student/submit">
                  <Button className="mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Submit your first complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map(c => <ComplaintRow key={c.id} complaint={c} />)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
