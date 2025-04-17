import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { getPost, deletePost } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Invalid post ID.');
        setLoading(false);
        return;
      }

      try {
        const postId = parseInt(id, 10);
        if (isNaN(postId)) {
          throw new Error('Invalid post ID.');
        }
        const data = await getPost(postId);
        setPost(data);
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      setError('Invalid post ID.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const postId = parseInt(id, 10);
      if (isNaN(postId)) {
        throw new Error('Invalid post ID.');
      }
      await deletePost(postId);
      navigate('/');
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

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">{post.title}</h3>
              <div>
                <span className="text-muted me-3">
                  Author: {post.author.username}
                </span>
                <span className="text-muted">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              {post.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Back to List
              </button>
              {isAuthenticated && (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/posts/${id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 