import client from './client';

export const login = (credentials) =>
  client.post('/auth/login', credentials).then((res) => res.data);