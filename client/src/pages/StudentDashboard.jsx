import { useComplaints } from '../hooks/useComplaints'
import { useAuth } from '../context/AuthContext'
import ComplaintRow from '../components/ComplaintRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function StatCard({ label, value, color }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
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
    <div className="p-8 space-y-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
    </div>
  )

  if (isError) return (
    <div className="p-8 text-red-500">Failed to load complaints. Please refresh.</div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.fullname}</h1>
          <p className="text-slate-500 text-sm">Track and manage your complaints</p>
        </div>
        <div className="flex gap-2">
          <Link to="/student/submit">
            <Button size="sm">+ New Complaint</Button>
          </Link>
          <Button size="sm" variant="outline" onClick={logoutUser}>Logout</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total"       value={total}      color="text-slate-800" />
        <StatCard label="Pending"     value={pending}    color="text-yellow-600" />
        <StatCard label="In Progress" value={inProgress} color="text-blue-600" />
        <StatCard label="Resolved"    value={resolved}   color="text-green-600" />
      </div>

      {/* Recent complaints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">Recent Complaints</h2>
          <Link to="/student/complaints" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No complaints yet.</p>
            <Link to="/student/submit">
              <Button className="mt-4" size="sm">Submit your first complaint</Button>
            </Link>
          </div>
        ) : (
          recent.map(c => <ComplaintRow key={c.id} complaint={c} />)
        )}
      </div>
    </div>
  )
}