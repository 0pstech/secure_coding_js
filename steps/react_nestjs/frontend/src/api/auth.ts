import axios from 'axios';
import { AuthResponse, RegisterDto, LoginDto, KeyResponse } from '../types';
import client from './client';

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

export const getAPIKey = async (): Promise<KeyResponse> => {
  const response = await client.get(`/auth/openai`);
  return response.data;
};

export const getPublicKey = async (): Promise<string> => {
  const res = await client.get<{ publicKey: string }>('/auth/public-key');
  return res.data.publicKey;
}

export const decryptRequest = async (
  clientPubKey: string,
  iv: string,
  data: string,
): Promise<string> => {
  const response = await client.post<{ decrypted: string }>('/auth/decrypt', { clientPubKey, iv, data });
  return response.data.decrypted;
}