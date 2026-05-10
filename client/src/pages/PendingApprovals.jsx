import { useAuth } from '../context/AuthContext'
import { usePendingUsers, useApproveUser, useRejectUser } from '../hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  UserCheck,
  Mail,
  AtSign,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const roleBadge = {
  staff: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  admin: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
}

const roleIcon = {
  staff: Users,
  admin: ShieldCheck,
}

export default function PendingApprovals() {
  const { user } = useAuth()
  const isSuperadmin = user?.username === 'superadmin'

  const { data: pending = [], isLoading, isError } = usePendingUsers()
  const { mutateAsync: approve, isPending: approving } = useApproveUser()
  const { mutateAsync: reject, isPending: rejecting } = useRejectUser()

  const visible = isSuperadmin
    ? pending
    : pending.filter((u) => u.role === 'staff')

  const handleApprove = async (id) => {
    try {
      await approve(id)
    } catch {
      alert('Failed to approve. Please try again.')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this registration?')) return
    try {
      await reject(id)
    } catch {
      alert('Failed to reject. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Pending Approvals
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {isSuperadmin
                    ? 'Review pending staff and admin registrations'
                    : 'Review pending staff registrations'}
                </p>
              </div>
            </div>

            {!isLoading && !isError && (
              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                <Clock className="h-3.5 w-3.5" />
                {visible.length} pending
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center text-red-600">
              Failed to load pending users. Please refresh.
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!isLoading && !isError && visible.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-700">All caught up</p>
              <p className="text-sm text-slate-500 mt-1">
                No pending registrations right now.
              </p>
            </CardContent>
          </Card>
        )}

        {/* List */}
        {!isLoading && !isError && visible.length > 0 && (
          <div className="space-y-3">
            {visible.map((u) => {
              const RoleIcon = roleIcon[u.role] ?? Users
              const initials = (u.fullname || u.username || '?')
                .split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <Card
                  key={u.id}
                  className="overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar + Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-sm">
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900 truncate">
                              {u.fullname}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${roleBadge[u.role]}`}
                            >
                              <RoleIcon className="h-3 w-3" />
                              {u.role}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-0.5 rounded-full font-medium">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <AtSign className="h-3 w-3" />
                              {u.username}
                            </span>
                            <span className="inline-flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0 sm:flex-row w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(u.id)}
                          disabled={approving}
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(u.id)}
                          disabled={rejecting}
                          className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
