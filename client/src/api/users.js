import client from './client'

export const getStaff = () =>
  client.get('/users', { params: { role: 'staff' } }).then(r => r.data)