import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPost, deletePost } from '../../lib/posts';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await getPost(Number(id));
        setPost(data);
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    router.push(`/posts/edit/${post?.id}`);
  };

  const handleDelete = async () => {
    if (!post?.id) return;
    try {
      await deletePost(post.id);
      router.push('/');
    } catch (err) {
      setError('Failed to delete post.');
    }
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

  if (!post) {
    return (
      <div className="alert alert-warning" role="alert">
        Post not found.
      </div>
    );
  }

  const isAuthor = isAuthenticated && user?.id === post.author?.id;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0">{post.title}</h2>
          {isAuthor && (
            <div>
              <button
                className="btn btn-outline-primary me-2"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="mb-3">
            <small className="text-muted">
              Posted by {post.author?.username || 'Unknown'} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
} 