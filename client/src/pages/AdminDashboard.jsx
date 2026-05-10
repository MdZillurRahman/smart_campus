import { useState } from 'react'
import { useComplaints, useReopenComplaint } from '../hooks/useComplaints'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  LayoutDashboard, Inbox, Clock, CheckCircle2, LogOut,
  Filter, UserPlus, RotateCcw, CheckCheck, Search,
} from 'lucide-react';
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import AssignModal from '../components/AssignModal'
import ResolveModal from '../components/ResolveModal'

const STATUSES   = ['All', 'Submitted', 'In Progress', 'Resolved']
const CATEGORIES = ['All', 'Classroom', 'Hostel', 'Lab', 'Security', 'Cafeteria', 'Library']

function StatCard({ icon: Icon, label, value, accent, ring }) {
  return (
    <Card className="relative overflow-hidden border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1.5">{value}</p>
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${ring}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth()
  const [status,   setStatus]   = useState('')
  const [category, setCategory] = useState('')

  const [assignTarget, setAssignTarget]   = useState(null)
  const [resolveTarget, setResolveTarget] = useState(null)
  const [reopenTarget, setReopenTarget]   = useState(null)

  const { data, isLoading, isError } = useComplaints({
    ...(status   && status   !== 'All' && { status }),
    ...(category && category !== 'All' && { category }),
  })

  const { mutateAsync: reopen, isPending: reopening } = useReopenComplaint()

  const complaints  = data ?? []
  const total       = complaints.length
  const submitted   = complaints.filter(c => c.status === 'Submitted').length
  const inProgress  = complaints.filter(c => c.status === 'In Progress').length
  const resolved    = complaints.filter(c => c.status === 'Resolved').length

  const handleReopen = async () => {
    try {
      await reopen(reopenTarget.id)
      setReopenTarget(null)
    } catch {
      alert('Failed to reopen complaint.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm">Welcome back, {user.fullname}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/approvals">
              <Button size="sm" variant="outline">
                Pending Approvals
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={logoutUser} className="self-start sm:self-auto">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Inbox}        label="Total"       value={total}      accent="bg-slate-800"   ring="bg-slate-100 text-slate-700" />
          <StatCard icon={Clock}        label="Submitted"   value={submitted}  accent="bg-amber-500"   ring="bg-amber-50 text-amber-600" />
          <StatCard icon={Filter}       label="In Progress" value={inProgress} accent="bg-blue-500"    ring="bg-blue-50 text-blue-600" />
          <StatCard icon={CheckCircle2} label="Resolved"    value={resolved}   accent="bg-emerald-500" ring="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Filters */}
        <Card className="border-slate-200/70 shadow-sm">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <Select onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Complaints */}
        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        )}

        {isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-600 text-sm">Failed to load complaints.</CardContent>
          </Card>
        )}

        {!isLoading && !isError && complaints.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-white/60">
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No complaints found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting the filters above.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && complaints.length > 0 && (
          <div className="space-y-3">
            {complaints.map(c => (
              <Card key={c.id} className="border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-slate-400">{c.display_id}</span>
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="font-semibold text-slate-900 truncate">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-600">{c.category}</span>
                        <span className="mx-1.5">·</span>
                        {c.student?.fullname}
                        {c.assigned_to && (
                          <>
                            <span className="mx-1.5">·</span>
                            <span className="text-indigo-600">Assigned to {c.assigned_to.fullname}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {c.status === 'Submitted' && (
                        <Button size="sm" onClick={() => setAssignTarget(c)}>
                          <UserPlus className="h-4 w-4 mr-1.5" /> Assign
                        </Button>
                      )}
                      {c.status === 'In Progress' && (
                        <Button size="sm" onClick={() => setResolveTarget(c)}>
                          <CheckCheck className="h-4 w-4 mr-1.5" /> Resolve
                        </Button>
                      )}
                      {c.status === 'Resolved' && (
                        <Button size="sm" variant="outline" onClick={() => setReopenTarget(c)}>
                          <RotateCcw className="h-4 w-4 mr-1.5" /> Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        {assignTarget && (
          <AssignModal
            complaint={assignTarget}
            open={!!assignTarget}
            onClose={() => setAssignTarget(null)}
          />
        )}
        {resolveTarget && (
          <ResolveModal
            complaint={resolveTarget}
            open={!!resolveTarget}
            onClose={() => setResolveTarget(null)}
          />
        )}

        <AlertDialog open={!!reopenTarget} onOpenChange={() => setReopenTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reopen this complaint?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset the status to Submitted and clear the assignment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReopen} disabled={reopening}>
                {reopening ? 'Reopening…' : 'Yes, Reopen'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
