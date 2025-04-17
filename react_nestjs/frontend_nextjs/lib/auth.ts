import axios from 'axios';
import { AuthResponse, RegisterDto, LoginDto, User } from '../types';

const API_URL = 'http://localhost:3000';

export const register = async (data: RegisterDto): Promise<void> => {
  await axios.post(`${API_URL}/auth/register`, data);
};

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
}; 