const styles = {
  'Submitted':    'bg-yellow-100 text-yellow-800',
  'In Progress':  'bg-blue-100 text-blue-800',
  'Resolved':     'bg-green-100 text-green-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}