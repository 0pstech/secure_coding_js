import axios, { InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Request interceptor
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Only access localStorage on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client; 