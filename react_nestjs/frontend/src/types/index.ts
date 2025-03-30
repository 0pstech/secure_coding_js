export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  permission: 'public' | 'private';
  author: User;
  createdAt: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  id: string;
  password: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  permission: 'public' | 'private';
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  permission?: 'public' | 'private';
} 