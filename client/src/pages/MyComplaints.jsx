import { useState } from 'react'
import { useComplaints } from '../hooks/useComplaints'
import ComplaintRow from '../components/ComplaintRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/student/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-1">My Complaints</h1>
        </div>
        <Link to="/student/submit">
          <Button size="sm">+ New Complaint</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      {isError && <p className="text-red-500">Failed to load complaints. Please refresh.</p>}

      {!isLoading && !isError && complaints.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No complaints found.</p>
        </div>
      )}

      {!isLoading && complaints.map(c => <ComplaintRow key={c.id} complaint={c} />)}
    </div>
  )
}