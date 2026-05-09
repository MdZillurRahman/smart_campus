import { useQuery } from '@tanstack/react-query'
import { getStaff } from '../api/users'

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => getStaff().then(res =>
      res.data.map(item => ({ id: item.id, ...item.attributes }))
    ),
  })
}