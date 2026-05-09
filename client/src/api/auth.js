import client from './client'

export const login = (credentials) =>
  client.post('/auth/login', credentials).then(r => r.data)

export const register = (data) =>
  client.post('/auth/register', { user: data }).then(r => r.data)