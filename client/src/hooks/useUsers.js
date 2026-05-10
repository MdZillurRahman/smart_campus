import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPendingUsers, approveUser, rejectUser } from '../api/users'

export function usePendingUsers() {
  return useQuery({
    queryKey: ['users', 'pending'],
    queryFn: () => getPendingUsers().then(res =>
      res.data.map(item => ({ id: item.id, ...item.attributes }))
    ),
  })
}

export function useApproveUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'pending'] }),
  })
}

export function useRejectUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: rejectUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'pending'] }),
  })
}