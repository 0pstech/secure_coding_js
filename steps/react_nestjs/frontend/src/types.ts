export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface KeyResponse {
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  permission: 'public' | 'private';
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePostDto {
  title: string;
  content: string;
  permission: 'public' | 'private';
}

export interface CreatePostDto {
  title: string;
  content: string;
  permission: 'public' | 'private';
} 