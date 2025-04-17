import axios, { InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const token = localStorage.getItem('token');

// Request interceptor
if (token) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

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