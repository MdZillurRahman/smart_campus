import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

// Handle expired or invalid token globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
)

export default client;