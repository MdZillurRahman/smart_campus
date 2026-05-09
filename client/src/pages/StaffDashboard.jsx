import { useState } from 'react'
import { useComplaints } from '../hooks/useComplaints'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClipboardList, Clock, CheckCircle2, LogOut, Inbox } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import ResolveModal from '../components/ResolveModal'

const STATUSES = ['All', 'In Progress', 'Resolved']

export default function StaffDashboard() {
  const { user, logoutUser } = useAuth()
  const [status, setStatus] = useState('')
  const [resolveTarget, setResolveTarget] = useState(null)

  const { data, isLoading, isError } = useComplaints({
    ...(status && status !== 'All' && { status }),
  })

  const complaints = data ?? []
  const pending  = complaints.filter(c => c.status !== 'Resolved').length
  const resolved = complaints.filter(c => c.status === 'Resolved').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
              <p className="text-slate-500 text-sm">Welcome, {user.fullname}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={logoutUser} className="self-start sm:self-auto">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="border-slate-200/70 shadow-sm overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-500" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending</p>
                <p className="text-3xl font-bold text-slate-900 mt-1.5">{pending}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/70 shadow-sm overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Resolved</p>
                <p className="text-3xl font-bold text-slate-900 mt-1.5">{resolved}</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="border-slate-200/70 shadow-sm">
          <CardContent className="p-4">
            <Select onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Tasks" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Task list */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
        )}

        {isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-600 text-sm">Failed to load tasks. Please refresh.</CardContent>
          </Card>
        )}

        {!isLoading && !isError && complaints.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-white/60">
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No tasks assigned yet</p>
              <p className="text-slate-400 text-sm mt-1">New tasks will appear here.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && complaints.length > 0 && (
          <div className="space-y-3">
            {complaints.map(c => (
              <TaskCard key={c.id} complaint={c} onResolve={setResolveTarget} />
            ))}
          </div>
        )}

        {resolveTarget && (
          <ResolveModal
            complaint={resolveTarget}
            open={!!resolveTarget}
            onClose={() => setResolveTarget(null)}
          />
        )}
      </div>
    </div>
  )
}
