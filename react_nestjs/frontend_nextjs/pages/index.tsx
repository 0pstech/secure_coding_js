import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPosts } from '../lib/posts';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        console.log('Post list:', data);
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    console.log('Clicked post ID:', postId);
    router.push(`/posts/${postId}`);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Post List</h2>
        {isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => router.push('/posts/new')}
          >
            Write Post
          </button>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Title</th>
              <th style={{ width: '20%' }}>Author</th>
              <th style={{ width: '30%' }}>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
                className="post-row"
              >
                <td>{post.title}</td>
                <td>{post.author?.username || 'Unknown'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 