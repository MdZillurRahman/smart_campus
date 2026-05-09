import StatusBadge from './StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tag, CheckCheck } from 'lucide-react'

const priorityStripe = {
  'High':   'bg-gradient-to-b from-red-500 to-rose-600',
  'Medium': 'bg-gradient-to-b from-orange-400 to-amber-500',
  'Low':    'bg-gradient-to-b from-slate-300 to-slate-400',
}

const priorityLabel = {
  'High':   'text-red-600',
  'Medium': 'text-amber-600',
  'Low':    'text-slate-500',
}

export default function TaskCard({ complaint, onResolve }) {
  return (
    <Card className="overflow-hidden flex border-slate-200/70 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
      <div className={`w-1.5 shrink-0 ${priorityStripe[complaint.priority] ?? 'bg-slate-200'}`} />

      <div className="p-4 sm:p-5 flex-1 space-y-2.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400">{complaint.display_id}</span>
              <span className={`text-xs font-semibold ${priorityLabel[complaint.priority] ?? 'text-slate-500'}`}>
                · {complaint.priority}
              </span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">{complaint.title}</p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{complaint.description}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            <Tag className="h-3 w-3" /> {complaint.category}
          </span>
          {complaint.status !== 'Resolved' && (
            <Button size="sm" onClick={() => onResolve(complaint)}>
              <CheckCheck className="h-4 w-4 mr-1.5" /> Resolve
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
