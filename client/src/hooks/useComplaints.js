import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComplaints, createComplaint, assignComplaint, resolveComplaint, reopenComplaint } from '../api/complaints'

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

export function useAssignComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => assignComplaint(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
  })
}

export function useResolveComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => resolveComplaint(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
  })
}

export function useReopenComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => reopenComplaint(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaints'] }),
  })
}