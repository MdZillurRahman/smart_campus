import client from './client'

export const getStaff = () =>
  client.get('/users', { params: { role: 'staff' } }).then(r => r.data)

export const getPendingUsers = () =>
  client.get('/users/pending').then(r => r.data)

export const approveUser = (id) =>
  client.patch(`/users/${id}/approve`).then(r => r.data)

export const rejectUser = (id) =>
  client.delete(`/users/${id}/reject`).then(r => r.data)