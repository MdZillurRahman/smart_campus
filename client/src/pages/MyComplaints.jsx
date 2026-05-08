import { useState } from 'react'
import { useComplaints } from '../hooks/useComplaints'
import ComplaintRow from '../components/ComplaintRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Filter, Inbox } from 'lucide-react'

const STATUSES    = ['All', 'Submitted', 'In Progress', 'Resolved']
const CATEGORIES  = ['All', 'Classroom', 'Hostel', 'Lab', 'Security', 'Cafeteria', 'Library']

export default function MyComplaints() {
  const [status,   setStatus]   = useState('')
  const [category, setCategory] = useState('')

  const { data, isLoading, isError } = useComplaints({
    ...(status   && status   !== 'All' && { status }),
    ...(category && category !== 'All' && { category }),
  })

  const complaints = data ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Link
              to="/student/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">My Complaints</h1>
            <p className="text-slate-500 text-sm mt-1">Browse and filter your submitted issues</p>
          </div>
          <Link to="/student/submit">
            <Button size="sm" className="w-full sm:w-auto shadow-sm">
              <Plus className="h-4 w-4 mr-1" /> New Complaint
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-slate-200/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 inline-flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="border-slate-200/70">
          <CardContent className="pt-6">
            {isLoading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            )}

            {isError && (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium">Failed to load complaints.</p>
                <p className="text-sm text-slate-500 mt-1">Please refresh the page.</p>
              </div>
            )}

            {!isLoading && !isError && complaints.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Inbox className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No complaints found</p>
                <p className="text-sm text-slate-400 mt-1">Try changing your filters</p>
              </div>
            )}

            {!isLoading && complaints.length > 0 && (
              <div className="space-y-2">
                {complaints.map(c => <ComplaintRow key={c.id} complaint={c} />)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
