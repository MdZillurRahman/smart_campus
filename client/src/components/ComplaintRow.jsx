import { useState } from 'react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import { resolutionTime } from '../utils/resolutionTime'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function ComplaintRow({ complaint }) {
  const [expanded, setExpanded] = useState(false)
  const displayId = `CMP${String(complaint.id).padStart(3, '0')}`
  const resTime = resolutionTime(complaint.created_at, complaint.resolved_at)

  return (
    <div className="border rounded-lg mb-2 bg-white">
      {/* Summary row */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-slate-400 font-mono shrink-0">{displayId}</span>
          <span className="text-sm font-medium truncate">{complaint.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="text-xs text-slate-400 hidden sm:block">{complaint.category}</span>
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t pt-3 space-y-2 text-sm text-slate-600">
          <p>{complaint.description}</p>

          {complaint.assigned_to && (
            <p className="text-xs text-slate-400">
              Assigned to: <span className="font-medium text-slate-600">{complaint.assigned_to.fullname}</span>
            </p>
          )}

          {complaint.resolution_note && (
            <div className="bg-green-50 rounded p-2 text-xs text-green-800">
              <span className="font-medium">Resolution: </span>{complaint.resolution_note}
            </div>
          )}

          {resTime && (
            <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
              ⏱ Resolved in {resTime}
            </span>
          )}
        </div>
      )}
    </div>
  )
}