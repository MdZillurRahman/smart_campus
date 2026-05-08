import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComplaints, createComplaint } from '../api/complaints'

// Flatten jsonapi-serializer response into plain objects
const normalize = (res) =>
  res.data.map(item => ({ id: item.id, ...item.attributes }))

export function useComplaints(filters = {}) {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => getComplaints(filters).then(normalize),
  })
}

export function useCreateComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
  })
}