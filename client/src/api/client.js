import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach JWT to every request automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default client;