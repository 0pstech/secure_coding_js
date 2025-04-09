import client from './client';
import { Post, CreatePostDto, UpdatePostDto } from '../types';

export const getPosts = async (): Promise<Post[]> => {
  const response = await client.get<Post[]>('/posts');
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await client.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data: CreatePostDto): Promise<Post> => {
  const response = await client.post<Post>('/posts', data);
  return response.data;
};

export const updatePost = async (id: number, data: UpdatePostDto): Promise<Post> => {
  const response = await client.put<Post>(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await client.delete(`/posts/${id}`);
}; 