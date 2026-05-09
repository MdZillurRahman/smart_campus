import client from './client'

export const getComplaints  = (params) => client.get('/complaints', { params }).then(r => r.data)
export const getComplaint   = (id)     => client.get(`/complaints/${id}`).then(r => r.data)
export const createComplaint = (data)  => client.post('/complaints', data).then(r => r.data)
export const assignComplaint = (id, data)  => client.patch(`/complaints/${id}/assign`, data).then(r => r.data)
export const resolveComplaint = (id, data) => client.patch(`/complaints/${id}/resolve`, data).then(r => r.data)
export const reopenComplaint  = (id)       => client.patch(`/complaints/${id}/reopen`).then(r => r.data)