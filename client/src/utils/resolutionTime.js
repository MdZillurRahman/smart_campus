export function resolutionTime(createdAt, resolvedAt) {
  if (!resolvedAt) return null
  const ms = new Date(resolvedAt) - new Date(createdAt)
  const days = ms / (1000 * 60 * 60 * 24)
  return `${days.toFixed(1)} days`
}