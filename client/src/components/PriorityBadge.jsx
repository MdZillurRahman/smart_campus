const styles = {
  'High':   'bg-red-100 text-red-800',
  'Medium': 'bg-orange-100 text-orange-800',
  'Low':    'bg-gray-100 text-gray-600',
}

export default function PriorityBadge({ priority }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[priority] ?? 'bg-gray-100 text-gray-800'}`}>
      {priority}
    </span>
  )
}